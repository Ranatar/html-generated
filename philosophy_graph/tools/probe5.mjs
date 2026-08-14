#!/usr/bin/env node
// Пятый прибор: то, что осталось после разбора списка пользователя.
//
//  1. CTRL-клик — множественный выбор узлов и связей. В прежних наборах
//     были наведение, одиночный, двойной и shift-клик; ctrl я упустил.
//  2. КАРТА СХОДСТВА целиком: кнопка «показать на графе» в разделе похожих
//     концепций окна концепции → окно закрывается, на графе стрелки к
//     похожим, обводка узлов по схожести, панель схожести с переключателем
//     режима (по профилю / по структуре) и кнопкой «Скрыть».
//
// Приложение зовётся только через оснастку: у сборки _probe-rig.js, у
// исходника — обычный сценарий, достающий его лексические объявления.
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
import { S, DATA } from './core/ns.js';
import { freezeSimulation } from './render/simulation.js';
import { pickNode, pickLink, toGraph } from './render/picking.js';
import { openConceptById } from './modal/entry.js';
// Имя живёт то в общем состоянии, то обычной переменной своего модуля —
// это зависит от того, пишут ли в него извне, а раскладка со временем
// меняется. Прибор смотрит В ОБА МЕСТА, иначе врёт при каждой перестановке.
import { selectedNodes as выбУзлы, selectedEdges as выбСвязи } from './state.js';
import { closeUniversalModal } from './modal/core.js';
window.__rig = { S: S, DATA: DATA, freezeSimulation: freezeSimulation,
  pickNode: pickNode, pickLink: pickLink, toGraph: toGraph,
  openConceptById: openConceptById, closeUniversalModal: closeUniversalModal,
  nodes: function () { return DATA.nodes; },
  links: function () { return DATA.links; },
  transform: function () { return S.renderState.transform; },
  canvas: function () { return S.gfxCanvas; },
  simulation: function () { return S.simulation; },
  selectedNodes: function () { return S.selectedNodes !== undefined ? S.selectedNodes : выбУзлы; },
  selectedEdges: function () { return S.selectedEdges !== undefined ? S.selectedEdges : выбСвязи; },
  overlay: function () { return S.similarityOverlay; } };
window.__rigReady = true;`;

const RIG_CLASSIC = `
window.__rig = { freezeSimulation: freezeSimulation,
  pickNode: pickNode, pickLink: pickLink, toGraph: toGraph,
  openConceptById: openConceptById, closeUniversalModal: closeUniversalModal,
  nodes: function () { return nodes; },
  links: function () { return links; },
  transform: function () { return renderState.transform; },
  canvas: function () { return gfxCanvas; },
  simulation: function () { return simulation; },
  selectedNodes: function () { return selectedNodes; },
  selectedEdges: function () { return selectedEdges; },
  overlay: function () { return similarityOverlay; } };
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

  await page.goto(BASE + label, { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(3500);
  await page.addScriptTag(label.startsWith('_ref')
    ? { content: RIG_CLASSIC } : { type: 'module', content: RIG_MODULE });
  await page.waitForFunction('window.__rigReady === true', { timeout: 20000 });

  const out = {};
  const H = async expr => {
    try { return await page.evaluate(`(${HASH})(${expr})`); }
    catch (e) { return { h: 'ОШИБКА', n: 0, v: e.message.slice(0, 70) }; }
  };

  // раскладка должна встать
  const t0 = Date.now();
  while (Date.now() - t0 < 70000) {
    const a = await page.evaluate(() => {
      const s = window.__rig.simulation();
      return s ? s.alpha() : 0;
    });
    if (a <= 0.001) break;
    await wait(1000);
  }

  // годная точка узла: замораживаем и спрашиваем у приложения
  const узел = async (кроме) => {
    await page.evaluate(() => window.__rig.freezeSimulation());
    await wait(150);
    return await page.evaluate(исключить => {
      const t = window.__rig.transform();
      const r = window.__rig.canvas().getBoundingClientRect();
      for (const n of window.__rig.nodes()) {
        if (исключить.includes(n.id)) continue;
        const x = Math.round(r.left + t.applyX(n.x)), y = Math.round(r.top + t.applyY(n.y));
        if (x < 60 || y < 60 || x > window.innerWidth - 60 || y > window.innerHeight - 60) continue;
        const el = document.elementFromPoint(x, y);
        if (!el || el.id !== 'graphCanvas') continue;
        const g = window.__rig.toGraph(x, y);
        const h = window.__rig.pickNode(g[0], g[1]);
        if (h && h.id === n.id) return { id: n.id, x, y };
      }
      return null;
    }, кроме || []);
  };

  // ── 1. CTRL-клик: множественный выбор узлов ───────────────────────
  {
    const a = await узел([]);
    out['__узел1'] = a ? a.id : 'нет';
    if (a) {
      await page.keyboard.down('Control');
      await page.mouse.click(a.x, a.y);
      await page.keyboard.up('Control');
      await wait(600);
      out['ctrl-клик: выбран один узел'] = await H(
        `String(window.__rig.selectedNodes().size)`);
      const b = await узел([a.id]);
      out['__узел2'] = b ? b.id : 'нет';
      if (b) {
        await page.keyboard.down('Control');
        await page.mouse.click(b.x, b.y);
        await page.keyboard.up('Control');
        await wait(600);
        out['ctrl-клик: добавился второй'] = await H(
          `String(window.__rig.selectedNodes().size)`);
        // повторный ctrl-клик по тому же снимает выбор
        const b2 = await узел([a.id]);
        await page.keyboard.down('Control');
        await page.mouse.click(b2.x, b2.y);
        await page.keyboard.up('Control');
        await wait(600);
        out['ctrl-клик: повторный снял'] = await H(
          `String(window.__rig.selectedNodes().size)`);
      }
      // обычный клик мимо сбрасывает набор
      await page.mouse.click(720, 460);
      await wait(600);
    }
  }

  // ── 2. CTRL-клик по связи ─────────────────────────────────────────
  {
    await page.evaluate(() => window.__rig.freezeSimulation());
    await wait(150);
    const точка = await page.evaluate(() => {
      const t = window.__rig.transform();
      const r = window.__rig.canvas().getBoundingClientRect();
      for (const l of window.__rig.links()) {
        const s = l.source, tg = l.target;
        if (!s || s.x === undefined || tg.x === undefined) continue;
        for (let f = 0.3; f <= 0.7; f += 0.05) {
          for (let off = -16; off <= 16; off += 2) {
            const gx = s.x + (tg.x - s.x) * f - (tg.y - s.y) * off / 100;
            const gy = s.y + (tg.y - s.y) * f + (tg.x - s.x) * off / 100;
            const x = Math.round(r.left + t.applyX(gx)), y = Math.round(r.top + t.applyY(gy));
            if (x < 60 || y < 60 || x > window.innerWidth - 60 || y > window.innerHeight - 60) continue;
            const el = document.elementFromPoint(x, y);
            if (!el || el.id !== 'graphCanvas') continue;
            const g = window.__rig.toGraph(x, y);
            if (window.__rig.pickNode(g[0], g[1])) continue;
            if (window.__rig.pickLink(g[0], g[1])) return { x, y };
          }
        }
      }
      return null;
    });
    out['точка на связи найдена'] = await H(JSON.stringify(!!точка));
    if (точка) {
      await page.keyboard.down('Control');
      await page.mouse.click(точка.x, точка.y);
      await page.keyboard.up('Control');
      await wait(700);
      out['ctrl-клик по связи: выбрана'] = await H(
        `String(window.__rig.selectedEdges().size)`);
      await page.keyboard.down('Control');
      await page.mouse.click(точка.x, точка.y);
      await page.keyboard.up('Control');
      await wait(700);
      out['ctrl-клик по связи: повторный снял'] = await H(
        `String(window.__rig.selectedEdges().size)`);
    }
    await page.mouse.click(720, 460);
    await wait(500);
  }

  // ── 3. Карта сходства: путь пользователя целиком ──────────────────
  {
    // концепция, у которой в окне ЕСТЬ раздел похожих с кнопкой на графе
    const выбор = await page.evaluate(async () => {
      const ids = [...document.querySelectorAll('#sourceSelectDropdown .custom-select-option')]
        .map(o => o.getAttribute('data-a2') ||
          ((o.getAttribute('onclick') || '').match(/'([^']+)'\s*\)$/) || [])[1])
        .filter(Boolean);
      for (const id of ids.slice(0, 40)) {
        window.__rig.openConceptById(id);
        await new Promise(r => setTimeout(r, 700));
        const el = document.getElementById('universalModalContent');
        const есть = el && (el.innerHTML.includes('show-similarity-overlay') ||
                            el.innerHTML.includes('showSimilarityOverlay'));
        if (есть) return id;
        window.__rig.closeUniversalModal();
        await new Promise(r => setTimeout(r, 200));
      }
      return null;
    });
    out['__концепция'] = выбор || 'не найдена';

    if (выбор) {
      out['окно: раздел похожих есть'] = await H(
        `String(document.getElementById('universalModalContent').innerHTML.includes('similarity') ||
                document.getElementById('universalModalContent').innerHTML.includes('Similarity'))`);
      // жмём саму кнопку в разметке, а не зовём функцию
      await page.evaluate(() => {
        const el = document.querySelector(
          '#universalModalContent [data-act-click^="show-similarity-overlay"], ' +
          '#universalModalContent [onclick*="showSimilarityOverlay"]');
        if (el) el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      });
      await wait(2500);
      out['после кнопки: окно закрылось'] = await H(
        `getComputedStyle(document.getElementById('universalModal')).display`);
      out['карта сходства: включена и её вид'] = await H(`(function(){
        var o = window.__rig.overlay();
        if (!o) return 'нет';
        return o.kind + '|стрелок ' + o.nearest.length + '|значений ' + o.values.size; })()`);
      out['панель схожести'] = await H(
        `(document.getElementById('similarityLegend') || {}).innerHTML || 'нет'`);

      // переключатель режима: по структуре
      await page.evaluate(() => {
        const кн = [...document.querySelectorAll('#similarityLegend button')]
          .find(b => /структур/i.test(b.textContent));
        if (кн) кн.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      });
      await wait(2500);
      out['после переключения: вид карты'] = await H(`(function(){
        var o = window.__rig.overlay();
        return o ? o.kind + '|стрелок ' + o.nearest.length : 'нет'; })()`);
      out['панель после переключения'] = await H(
        `(document.getElementById('similarityLegend') || {}).innerHTML || 'нет'`);

      // обратно по профилю
      await page.evaluate(() => {
        const кн = [...document.querySelectorAll('#similarityLegend button')]
          .find(b => /профил/i.test(b.textContent));
        if (кн) кн.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      });
      await wait(2500);
      out['возврат к профилю'] = await H(`(function(){
        var o = window.__rig.overlay();
        return o ? o.kind : 'нет'; })()`);

      // «Скрыть карту сходства»
      await page.evaluate(() => {
        const кн = [...document.querySelectorAll('#similarityLegend button')]
          .find(b => /скрыть/i.test(b.textContent));
        if (кн) кн.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      });
      await wait(1200);
      out['после «Скрыть»: карта снята'] = await H(
        `String(window.__rig.overlay() === null || window.__rig.overlay() === undefined)`);
      out['после «Скрыть»: панель убрана'] = await H(
        `String(!document.getElementById('similarityLegend') ||
                getComputedStyle(document.getElementById('similarityLegend')).display === 'none')`);
    }
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
  console.log(`ctrl и карта сходства: сверено ${keys.length}, совпало ${ok}, разошлось ${bad.length}`);
  for (const [k, x, y] of bad) console.log(объяснить(k, x, y) || `  ✗ ${k}`);
  for (const k of ['__узел1', '__узел2', '__концепция'])
    console.log(`  ${k}: исходник ${A[k]} | модули ${B[k]}`);
  console.log(`ошибки: исходник ${A.__errs.length}, модули ${B.__errs.length}`);
  for (const e of [...new Set([...A.__errs, ...B.__errs])].slice(0, 6)) console.log('   ' + e);
  process.exit(bad.length || A.__errs.length || B.__errs.length ? 1 : 0);
}
