#!/usr/bin/env node
// Проверка того, что прежними наборами НЕ ПОКРЫВАЛОСЬ:
// перетаскивание узла, колесо масштаба, СОДЕРЖИМОЕ вывезенных SVG и PNG,
// печатная кожа, узкий экран.
//
// Приложение зовётся только через оснастку: у переведённой сборки это
// _probe-rig.js, у исходника — обычный сценарий, достающий его лексические
// объявления (в классическом сценарии let и const в window не попадают).
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
window.__rig = { S: A.S, DATA: A.DATA, freezeSimulation: A.freezeSimulation,
  pickNode: A.pickNode, toGraph: A.toGraph, exportToSVG: A.exportToSVG, exportToPNG: A.exportToPNG,
  nodes: function () { return A.DATA.nodes; },
  transform: function () { return A.S.renderState.transform; },
  canvas: function () { return A.S.gfxCanvas; },
  simulation: function () { return A.S.simulation; },
  tickCount: function () { return A.S.tickCount; } };
window.__rigReady = true;`;

const RIG_CLASSIC = `
window.__rig = { S: null, DATA: null, freezeSimulation: freezeSimulation,
  pickNode: pickNode, toGraph: toGraph, exportToSVG: exportToSVG, exportToPNG: exportToPNG,
  nodes: function () { return nodes; },
  transform: function () { return renderState.transform; },
  canvas: function () { return gfxCanvas; },
  simulation: function () { return simulation; },
  tickCount: function () { return tickCount; } };
window.__rigReady = true;`;

// перехват вывоза: подменяем создание ссылки на файл, чтобы забрать содержимое
const ЛОВУШКА = `
window.__вывоз = [];
(function () {
  const старый = URL.createObjectURL;
  URL.createObjectURL = function (blob) {
    const запись = { тип: blob.type, размер: blob.size, текст: null };
    window.__вывоз.push(запись);
    blob.text().then(t => { запись.текст = t; }).catch(() => {});
    return старый.call(URL, blob);
  };
  const клик = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download) return;        // файл не сохраняем, только считаем
    return клик.apply(this, arguments);
  };
})();
window.__ловушкаГотова = true;`;

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
  await wait(3500);
  const модуль = !label.startsWith('_ref');
  await page.addScriptTag(модуль ? { type: 'module', content: RIG_MODULE } : { content: RIG_CLASSIC });
  await page.waitForFunction('window.__rigReady === true', { timeout: 20000 });
  await page.evaluate(ЛОВУШКА);

  const out = {};
  const H = async expr => {
    try { return await page.evaluate(`(${HASH})(${expr})`); }
    catch (e) { return { h: 'ОШИБКА', n: e.message.slice(0, 70) }; }
  };

  // раскладка должна встать, иначе узел уедет из-под курсора
  const t0 = Date.now();
  while (Date.now() - t0 < 70000) {
    const a = await page.evaluate(() => {
      const s = window.__rig.simulation();
      return s ? s.alpha() : 0;
    });
    if (a <= 0.001) break;
    await wait(1000);
  }
  await page.evaluate(() => window.__rig.freezeSimulation());
  await wait(300);

  const точка = async () => {
    await page.evaluate(() => window.__rig.freezeSimulation());
    await wait(150);
    return await page.evaluate(() => {
      const t = window.__rig.transform();
      const r = window.__rig.canvas().getBoundingClientRect();
      for (const n of window.__rig.nodes()) {
        const x = Math.round(r.left + t.applyX(n.x)), y = Math.round(r.top + t.applyY(n.y));
        if (x < 60 || y < 60 || x > window.innerWidth - 60 || y > window.innerHeight - 60) continue;
        const el = document.elementFromPoint(x, y);
        if (!el || el.id !== 'graphCanvas') continue;
        const g = window.__rig.toGraph(x, y);
        const h = window.__rig.pickNode(g[0], g[1]);
        if (h && h.id === n.id) return { id: n.id, x, y };
      }
      return null;
    });
  };

  // Вывоз снимается ДО перетаскивания: иначе в SVG попадают уже сдвинутые
  // координаты, и сравнение ловит собственный шум прибора.
  // ── 3. содержимое вывезенного SVG ─────────────────────────────────
  {
    await page.evaluate(() => { window.__вывоз.length = 0; window.__rig.exportToSVG(); });
    await wait(1500);
    const св = await page.evaluate(() => {
      const z = window.__вывоз[0];
      return z ? { тип: z.тип, размер: z.размер, текст: z.текст } : null;
    });
    out['вывоз SVG: тип'] = await H(JSON.stringify(св ? св.тип : 'нет'));
    // РАСКЛАДКА НЕ ПОВТОРЯЕТСЯ ОТ ЗАГРУЗКИ К ЗАГРУЗКЕ: сила укладки считает
    // шаги по реальному времени, поэтому координаты у двух прогонов разные
    // даже на одной и той же странице (проверено прогоном исходника против
    // себя самого — расходился так же). Числа из разметки вычёркиваются:
    // сравнивается строение, цвета, подписи, порядок — всё, кроме геометрии.
    out['вывоз SVG: содержимое без чисел'] = await H(JSON.stringify(
      св && св.текст ? св.текст.replace(/-?\d+(?:\.\d+)?/g, '#') : 'пусто'));
    out['вывоз SVG: узлов и связей в разметке'] = await H(JSON.stringify(св && св.текст
      ? [(св.текст.match(/<circle/g) || []).length, (св.текст.match(/<path/g) || []).length].join('/')
      : 'нет'));
  }

  // ── 4. содержимое вывезенного PNG ─────────────────────────────────
  {
    await page.evaluate(() => { window.__вывоз.length = 0; window.__rig.exportToPNG(); });
    await wait(4000);
    const пн = await page.evaluate(() => {
      const z = window.__вывоз[0];
      return z ? { тип: z.тип, размер: z.размер } : null;
    });
    out['вывоз PNG: тип'] = await H(JSON.stringify(пн ? пн.тип : 'нет'));
    // точный размер зависит от сжатия, поэтому сверяем порядок величины
    out['вывоз PNG: порядок размера'] = await H(JSON.stringify(
      пн ? String(пн.размер).length : 'нет'));
  }

  // ── 1. перетаскивание узла ────────────────────────────────────────
  {
    const p = await точка();
    out['__узел'] = p ? p.id : 'не найден';
    if (p) {
      const было = await page.evaluate(id => {
        const n = window.__rig.nodes().find(x => x.id === id);
        return [n.x, n.y];
      }, p.id);
      await page.mouse.move(p.x, p.y);
      await page.mouse.down();
      await page.mouse.move(p.x + 120, p.y + 70, { steps: 12 });
      await page.mouse.up();
      await wait(900);
      const стало = await page.evaluate(id => {
        const n = window.__rig.nodes().find(x => x.id === id);
        return [n.x, n.y, n.fx === null || n.fx === undefined ? 'свободен' : 'закреплён'];
      }, p.id);
      const t = await page.evaluate(() => { const t = window.__rig.transform(); return t.k; });
      // Синтетическое перетаскивание не повторяет себя знак в знак: между
      // шагами мыши раскладка успевает дёрнуться, и итог гуляет на единицы.
      // Проверено прогоном ИСХОДНИКА ПРОТИВ СЕБЯ САМОГО — расходился так же.
      // Поэтому сверяется не точный сдвиг, а его округление до десятков:
      // это отвечает на вопрос «узел уехал туда, куда тянули», и не ловит шум.
      // Тянули на 120 по горизонтали и 70 по вертикали. Сверяется не точный
      // сдвиг (он гуляет на единицы от прогона к прогону), а попадание в
      // допуск: узел уехал туда, куда тянули, и на нужную величину.
      const dx = (стало[0] - было[0]) * t, dy = (стало[1] - было[1]) * t;
      out['перетаскивание: узел уехал за курсором'] = await H(JSON.stringify(
        Math.abs(dx - 120) <= 15 && Math.abs(dy - 70) <= 15));
      out['перетаскивание: узел после отпускания'] = await H(JSON.stringify(стало[2]));
    }
  }

  // ── 2. колесо масштаба ────────────────────────────────────────────
  {
    const до = await page.evaluate(() => {
      const t = window.__rig.transform();
      return [t.k, t.x, t.y];
    });
    await page.mouse.move(700, 450);
    await page.mouse.wheel({ deltaY: -300 });
    await wait(700);
    const после = await page.evaluate(() => {
      const t = window.__rig.transform();
      return [t.k, t.x, t.y];
    });
    out['колесо: масштаб вырос'] = await H(JSON.stringify(после[0] > до[0]));
    out['колесо: кратность'] = await H(JSON.stringify(Math.round((после[0] / до[0]) * 1000)));
    await page.mouse.wheel({ deltaY: 300 });
    await wait(700);
    const назад = await page.evaluate(() => window.__rig.transform().k);
    out['колесо: возврат'] = await H(JSON.stringify(Math.round((назад / до[0]) * 1000)));
  }

  // ── 5. печатная кожа ──────────────────────────────────────────────
  {
    await page.emulateMediaType('print');
    await wait(500);
    out['печать: что скрыто'] = await H(`(function(){
      var ids = ['legend','controls','pathFinder','graphCanvas','statsModal','universalModal'];
      return ids.map(function(i){ var e = document.getElementById(i);
        return i + ':' + (e ? getComputedStyle(e).display : 'нет'); }).join('|'); })()`);
    await page.emulateMediaType(null);
    await wait(300);
  }

  // ── 6. узкий экран ────────────────────────────────────────────────
  {
    await page.setViewport({ width: 700, height: 600 });
    await wait(1200);
    out['узкий экран: панели'] = await H(`(function(){
      var ids = ['legend','controls','pathFinder'];
      return ids.map(function(i){ var e = document.getElementById(i); if (!e) return i + ':нет';
        var r = e.getBoundingClientRect();
        return i + ':' + Math.round(r.width) + 'x' + Math.round(r.height) +
               '@' + Math.round(r.left) + ',' + Math.round(r.top); }).join('|'); })()`);
    out['узкий экран: вылезает за край'] = await H(`(function(){
      var n = 0;
      document.querySelectorAll('#legend *, #controls *, #pathFinder *').forEach(function(e){
        var r = e.getBoundingClientRect();
        if (r.width && r.right > window.innerWidth + 1) n++;
      });
      return String(n); })()`);
    out['узкий экран: размер полотна'] = await H(`(function(){
      var c = document.getElementById('graphCanvas');
      return c.width + 'x' + c.height; })()`);
    await page.setViewport({ width: 1440, height: 900 });
    await wait(1000);
    out['возврат размера: полотно'] = await H(`(function(){
      var c = document.getElementById('graphCanvas');
      return c.width + 'x' + c.height; })()`);
  }

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
  console.log(`прочее: сверено ${keys.length}, совпало ${ok}, разошлось ${bad.length}`);
  for (const [k, x, y] of bad) console.log(объяснить(k, x, y) || `  ✗ ${k}`);
  console.log('узел: исходник', A['__узел'], '| модули', B['__узел']);
  console.log(`ошибки: исходник ${A.__errs.length}, модули ${B.__errs.length}`);
  for (const e of [...new Set([...A.__errs, ...B.__errs])].slice(0, 6)) console.log('   ' + e);
  process.exit(bad.length || A.__errs.length || B.__errs.length ? 1 : 0);
}
