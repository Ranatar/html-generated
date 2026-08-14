#!/usr/bin/env node
// Седьмой прибор: СОХРАННОСТЬ ПРАВОК.
//
// Проверяется на обеих сторонах одинаково — исходник тоже пропатчен, иначе
// сверять новую возможность было бы не с чем.
//
//  1. Кнопки на месте.
//  2. Сериализатор отдаёт ровно шесть исходных наборов и ничего сверх.
//  3. Выгрузка даёт шесть файлов; их содержимое СОВПАДАЕТ с тем, что в
//     памяти, и разбирается обратно без потерь.
//  4. Правка помечает базу изменённой, сохранение снимает пометку.
//  5. ПОСЛЕ ПРАВКИ выгруженный файл содержит правку — то есть сохраняется
//     новое состояние, а не то, что читали при загрузке.
//  6. Запись в папку: наличие хода и поведение без разрешения.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER ||
  '/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer');
import fs from 'node:fs';

const CHROME = process.env.CHROME ||
  '/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';
const BASE = process.env.BASE || 'http://127.0.0.1:8711/';
const wait = ms => new Promise(r => setTimeout(r, ms));

import { ХЕШ as HASH, объяснить } from './snapshot.mjs';


const RIG_MODULE = `
import { DATA } from './core/ns.js';
import { collectData, hasUnsaved, DATA_SETS } from './data/save.js';
import { openEditConceptModal } from './modal/entry.js';
import { closeUniversalModal } from './modal/core.js';
import { openAuthModal, submitAuth, closeAuthModal } from './modal/auth.js';
window.__rig = { собратьБазу: collectData, естьПравки: hasUnsaved, НАБОРЫ: DATA_SETS,
  openEditConceptModal, closeUniversalModal, openAuthModal, submitAuth, closeAuthModal,
  D: k => DATA[k] };
window.__rigReady = true;`;

const RIG_CLASSIC = `
window.__rig = { собратьБазу: collectData, естьПравки: hasUnsaved, НАБОРЫ: DATA_SETS,
  openEditConceptModal: openEditConceptModal, closeUniversalModal: closeUniversalModal,
  openAuthModal: openAuthModal, submitAuth: submitAuth, closeAuthModal: closeAuthModal,
  D: function (k) { return ({ concepts: concepts, relations: relations,
      philosophers: philosophers, traditions: traditions, rubrics: rubrics,
      relationTypes: relationTypes })[k]; } };
window.__rigReady = true;`;

// ловушка выгрузки: забираем содержимое файлов, на диск ничего не пишем
const ЛОВУШКА = `
window.__файлы = [];
(function () {
  const старый = URL.createObjectURL;
  URL.createObjectURL = function (blob) {
    const з = { размер: blob.size, текст: null };
    window.__файлы.push(з);
    blob.text().then(t => { з.текст = t; }).catch(() => {});
    return старый.call(URL, blob);
  };
  const клик = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download) { window.__файлы[window.__файлы.length - 1].имя = this.download; return; }
    return клик.apply(this, arguments);
  };
})();
window.__ловушка = true;`;

async function run(label) {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).split('\n')[0]));
  page.on('console', m => {
    const u = (m.location() && m.location().url) || '';
    if (m.type() === 'error' && !u.includes('favicon')) errs.push('console: ' + m.text().slice(0, 160));
  });
  page.on('dialog', async d => { try { await d.accept(); } catch (e) {} });

  await page.goto(BASE + label, { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(4000);
  await page.addScriptTag(label.startsWith('_ref')
    ? { content: RIG_CLASSIC } : { type: 'module', content: RIG_MODULE });
  await page.waitForFunction('window.__rigReady === true', { timeout: 20000 });
  await page.evaluate(ЛОВУШКА);

  const out = {};
  const H = async expr => {
    try { return await page.evaluate(`(${HASH})(${expr})`); }
    catch (e) { return { h: 'ОШИБКА', n: 0, v: e.message.slice(0, 90) }; }
  };

  // ── 1. кнопки ─────────────────────────────────────────────────────
  out['кнопки в панели'] = await H(`(function(){
    var a = document.getElementById('saveDataBtn'), b = document.getElementById('saveFolderBtn');
    return (a ? a.textContent.trim() : 'нет') + '|' + (b ? b.textContent.trim() : 'нет'); })()`);

  // ── 2. сериализатор ───────────────────────────────────────────────
  out['сериализатор: наборы'] = await H(
    `Object.keys(window.__rig.собратьБазу()).sort().join(',')`);
  out['сериализатор: производных нет'] = await H(`(function(){
    var б = window.__rig.собратьБазу();
    return String(!('nodes' in б) && !('links' in б) && !('relationTypesObj' in б)); })()`);
  out['сериализатор: размеры наборов'] = await H(`(function(){
    var б = window.__rig.собратьБазу();
    return window.__rig.НАБОРЫ.map(function (k) { return k + ':' + б[k].length; }).join('|'); })()`);

  // ── 3. пометка «есть несохранённое» ───────────────────────────────
  out['до правки: несохранённого нет'] = await H(`String(window.__rig.естьПравки())`);

  await page.evaluate(() => {
    window.__rig.openAuthModal('login');
    document.getElementById('authLogin').value = 'admin';
    document.getElementById('authPassword').value = 'admin';
    window.__rig.submitAuth();
  });
  await wait(900);
  await page.evaluate(() => window.__rig.closeAuthModal());
  await wait(400);

  const первая = await page.evaluate(() => window.__rig.D('concepts')[0].id);
  out['__концепция'] = первая;
  await page.evaluate(id => { window.__rig.closeUniversalModal(); window.__rig.openEditConceptModal(id); }, первая);
  await wait(1300);
  await page.evaluate(() => {
    document.getElementById('conceptLabel').value = 'СОХРАНЁННОЕ ИМЯ';
    const b = [...document.querySelectorAll('#universalModal button')]
      .find(x => /Сохранить/.test(x.textContent));
    if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await wait(2000);
  await page.evaluate(() => window.__rig.closeUniversalModal());
  await wait(400);
  out['после правки: несохранённое есть'] = await H(`String(window.__rig.естьПравки())`);

  // ── 4. выгрузка шести файлов ──────────────────────────────────────
  await page.evaluate(() => { window.__файлы.length = 0; });
  await page.evaluate(() => document.getElementById('saveDataBtn')
    .dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })));
  await wait(2500);
  out['выгрузка: имена файлов'] = await H(
    `window.__файлы.map(function (з) { return з.имя; }).join(',')`);
  out['выгрузка: разбирается обратно'] = await H(`(function(){
    try {
      return String(window.__файлы.every(function (з) {
        return з.текст && Array.isArray(JSON.parse(з.текст)); }));
    } catch (e) { return 'ошибка разбора'; } })()`);
  out['выгрузка: совпадает с памятью'] = await H(`(function(){
    var б = window.__rig.собратьБазу(), ок = true;
    window.__файлы.forEach(function (з) {
      var имя = (з.имя || '').replace('.json', '');
      if (!б[имя]) { ок = false; return; }
      if (JSON.stringify(JSON.parse(з.текст)) !== JSON.stringify(б[имя])) ок = false;
    });
    return String(ок); })()`);
  out['выгрузка: правка попала в файл'] = await H(`(function(){
    var з = window.__файлы.find(function (x) { return x.имя === 'concepts.json'; });
    return String(!!з && з.текст.indexOf('СОХРАНЁННОЕ ИМЯ') >= 0); })()`);
  out['после выгрузки: пометка снята'] = await H(`String(window.__rig.естьПравки())`);

  // ── 5. запись в папку ─────────────────────────────────────────────
  out['ход записи в папку есть'] = await H(
    `String(typeof document.getElementById('saveFolderBtn') === 'object')`);
  // без разрешения браузер откажет — важно, что отказ не роняет страницу
  await page.evaluate(() => document.getElementById('saveFolderBtn')
    .dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })));
  await wait(1500);
  out['запись в папку: страница цела'] = await H(
    `String(!!document.getElementById('graphCanvas'))`);

  out.__errs = errs;
  await page.close(); await browser.close();
  return out;
}

const [, , mode, a1, a2] = process.argv;
if (mode === 'run') {
  const res = await run(a1);
  fs.writeFileSync(a2, JSON.stringify(res, null, 1));
  console.log(`${a1}: снимков ${Object.keys(res).length - 1}, ошибок ${res.__errs.length}`);
} else {
  const A = JSON.parse(fs.readFileSync(a1, 'utf8'));
  const B = JSON.parse(fs.readFileSync(a2, 'utf8'));
  const keys = Object.keys(A).filter(k => k !== '__errs' && !k.startsWith('__'));
  let ok = 0; const bad = [];
  for (const k of keys) {
    if (JSON.stringify(A[k]) === JSON.stringify(B[k])) ok++; else bad.push([k, A[k], B[k]]);
  }
  console.log(`сохранность: сверено ${keys.length}, совпало ${ok}, разошлось ${bad.length}`);
  for (const [k, x, y] of bad) console.log(объяснить(k, x, y) || `  ✗ ${k}`);
  console.log(`ошибки: исходник ${A.__errs.length}, модули ${B.__errs.length}`);
  for (const e of [...new Set([...A.__errs, ...B.__errs])].slice(0, 6)) console.log('   ' + e);
  process.exit(bad.length || A.__errs.length || B.__errs.length ? 1 : 0);
}
