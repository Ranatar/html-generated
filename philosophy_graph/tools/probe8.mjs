#!/usr/bin/env node
// Восьмой прибор: ПЕРЕКЛЮЧАТЕЛЬ ЗАМОРОЗКИ.
//
// Главное, что здесь проверяется, — не «кнопка нажимается», а то, ради
// чего она задумана: замок, поставленный рукой, переживает открытие и
// закрытие окон, а обычное поведение окон без замка остаётся прежним.
//
// Проверка ведётся при ЖИВОЙ раскладке: если ждать, пока она уляжется,
// разницы между замороженным и размороженным не будет вовсе.
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
import './_probe-rig.js';
const A = window.__app;
window.__rig = { openStatsModal: A.openStatsModal, closeStatsModal: A.closeStatsModal,
  openConceptById: A.openConceptById, closeUniversalModal: A.closeUniversalModal,
  замок: () => document.getElementById('freezeBtn').classList.contains('frozen-by-hand'),
  alpha: () => (A.S.simulation ? A.S.simulation.alpha() : -1),
  tick: () => A.S.tickCount,
  узел: () => { const n = A.DATA.nodes[0]; return [n.x, n.y]; },
  первая: () => A.DATA.concepts[0].id };
window.__rigReady = true;`;

const RIG_CLASSIC = `
window.__rig = { openStatsModal: openStatsModal, closeStatsModal: closeStatsModal,
  openConceptById: openConceptById, closeUniversalModal: closeUniversalModal,
  замок: function () { return document.getElementById('freezeBtn').classList.contains('frozen-by-hand'); },
  alpha: function () { return simulation ? simulation.alpha() : -1; },
  tick: function () { return tickCount; },
  узел: function () { var n = nodes[0]; return [n.x, n.y]; },
  первая: function () { return concepts[0].id; } };
window.__rigReady = true;`;

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

  await page.goto(BASE + label, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await wait(3000);
  await page.addScriptTag(label.startsWith('_ref')
    ? { content: RIG_CLASSIC } : { type: 'module', content: RIG_MODULE });
  await page.waitForFunction('window.__rigReady === true', { timeout: 20000 });

  const out = {};
  const H = async expr => {
    try { return await page.evaluate(`(${HASH})(${expr})`); }
    catch (e) { return { h: 'ОШИБКА', n: 0, v: e.message.slice(0, 90) }; }
  };
  const жмём = () => page.evaluate(() => document.getElementById('freezeBtn')
    .dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })));
  // «раскладка едет» — узел за 700 мс сдвинулся заметно
  const едет = async () => {
    const a = await page.evaluate(() => window.__rig.узел());
    await wait(700);
    const b = await page.evaluate(() => window.__rig.узел());
    return Math.hypot(b[0] - a[0], b[1] - a[1]) > 0.5;
  };

  out['кнопка есть'] = await H(`(function(){
    var b = document.getElementById('freezeBtn');
    return b ? b.textContent.trim() : 'нет'; })()`);
  out['замок при загрузке снят'] = await H(`String(window.__rig.замок())`);
  // Спрашиваем ровно то, что проверяется по смыслу: НЕ ЗАМОРОЖЕНА ЛИ
  // раскладка до нажатия. Прежние два вопроса оба гуляли: «едет ли сейчас»
  // — потому что время до остановки скачет от 1 до 22 с, а прибор
  // подключается через фиксированные 3 с; «есть ли куда ехать» (число
  // шагов) — по той же причине. Признак заморозки от скорости не зависит.
  out['раскладка при загрузке не заморожена'] = await H(JSON.stringify(
    await page.evaluate(() => !window.__rig.замок())));

  // ── заморозка рукой ───────────────────────────────────────────────
  await жмём();
  await wait(400);
  out['после нажатия: замок стоит'] = await H(`String(window.__rig.замок())`);
  out['после нажатия: подпись кнопки'] = await H(
    `document.getElementById('freezeBtn').textContent.trim()`);
  out['после нажатия: раскладка стоит'] = await H(JSON.stringify(!(await едет())));

  // ── окно НЕ должно снимать замок: вот ради чего всё затевалось ────
  await page.evaluate(() => window.__rig.openStatsModal());
  await wait(700);
  await page.evaluate(() => window.__rig.closeStatsModal());
  await wait(900);
  out['окно статистики: замок цел'] = await H(`String(window.__rig.замок())`);
  out['окно статистики: раскладка стоит'] = await H(JSON.stringify(!(await едет())));

  // Из данных, а не из разметки: разметка списка меняется по замыслу,
  // и прибор не должен от неё зависеть там, где ему нужен просто
  // идентификатор концепции.
  const id = await page.evaluate(() => window.__rig.первая());
  if (id) {
    await page.evaluate(i => window.__rig.openConceptById(i), id);
    await wait(800);
    await page.evaluate(() => window.__rig.closeUniversalModal());
    await wait(900);
    out['окно концепции: замок цел'] = await H(`String(window.__rig.замок())`);
    out['окно концепции: раскладка стоит'] = await H(JSON.stringify(!(await едет())));
  }

  // ── разморозка рукой ──────────────────────────────────────────────
  await жмём();
  await wait(500);
  out['после второго нажатия: замок снят'] = await H(`String(window.__rig.замок())`);
  out['после второго нажатия: подпись'] = await H(
    `document.getElementById('freezeBtn').textContent.trim()`);
  const шагов = await page.evaluate(() => window.__rig.tick());
  out['разморозка: раскладка снова едет либо уже улеглась'] = await H(JSON.stringify(
    (await едет()) || шагов >= 300));

  // ── без замка окна ведут себя как прежде ──────────────────────────
  await page.evaluate(() => window.__rig.openStatsModal());
  await wait(600);
  out['без замка: окно останавливает'] = await H(JSON.stringify(!(await едет())));
  await page.evaluate(() => window.__rig.closeStatsModal());
  await wait(900);
  const шагов2 = await page.evaluate(() => window.__rig.tick());
  out['без замка: закрытие возвращает движение'] = await H(JSON.stringify(
    (await едет()) || шагов2 >= 300));

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
  console.log(`переключатель заморозки: сверено ${keys.length}, совпало ${ok}, разошлось ${bad.length}`);
  for (const [k, x, y] of bad) console.log(объяснить(k, x, y) || `  ✗ ${k}`);
  console.log(`ошибки: исходник ${A.__errs.length}, модули ${B.__errs.length}`);
  for (const e of [...new Set([...A.__errs, ...B.__errs])].slice(0, 6)) console.log('   ' + e);
  process.exit(bad.length || A.__errs.length || B.__errs.length ? 1 : 0);
}
