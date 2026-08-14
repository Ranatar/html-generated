#!/usr/bin/env node
// Проверка САМОГО ГРАФА: наведение, одиночный и двойной клик по узлу,
// клик по связи, shift-клик под admin.
//
// Три условия, без которых такая проверка врёт:
//  1. Раскладка при загрузке ЕЩЁ ЛЕТИТ (полная остановка на 38–41 с).
//     Ждём остановки, потом ЗАМОРАЖИВАЕМ — иначе узел уедет из-под курсора
//     между наведением и снимком.
//  2. Раскладка СВОЯ при каждой загрузке, поэтому координаты не берутся
//     наперёд: у каждой страницы спрашиваем, где её узел, и жмём туда.
//  3. Правка и shift-клики доступны только под admin/admin.
//
// Испытательная площадка ставится ВВОЗОМ МОДУЛЯ, а не через мост:
// в сборке наружу выставлено только то, что зовёт разметка, и
// freezeSimulation туда не входит — и правильно, что не входит.
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


// площадка для модульной сборки: ввозим то, что нужно приборам
const RIG_MODULE = `
import { S, DATA, MET, VIEWS } from './core/ns.js';
import { freezeSimulation, unfreezeSimulation } from './render/simulation.js';
import { pickNode, pickLink, toGraph } from './render/picking.js';
import { selectedNodes as выбранныеУзлы } from './state.js';
import { closeUniversalModal, openUniversalModal } from './modal/core.js';
import { openAuthModal, submitAuth, closeAuthModal } from './modal/auth.js';
window.__rig = { S, DATA, MET, VIEWS, freezeSimulation, unfreezeSimulation, pickNode, pickLink, toGraph,
  closeUniversalModal, openUniversalModal, openAuthModal, submitAuth, closeAuthModal,
  nodes: () => DATA.nodes, links: () => DATA.links,
  transform: () => S.renderState.transform, canvas: () => S.gfxCanvas,
  simulation: () => S.simulation,
  selectedNodes: () => (S.selectedNodes !== undefined ? S.selectedNodes : выбранныеУзлы),
  tickCount: () => S.tickCount };
window.__rigReady = true;
`;
// та же площадка для исходника: там всё это и так глобально
const RIG_CLASSIC = `
window.__rig = { freezeSimulation: freezeSimulation, unfreezeSimulation: unfreezeSimulation,
  pickNode: pickNode, pickLink: pickLink, toGraph: toGraph,
  closeUniversalModal: closeUniversalModal, openUniversalModal: openUniversalModal,
  openAuthModal: openAuthModal, submitAuth: submitAuth, closeAuthModal: closeAuthModal,
  nodes: function () { return nodes; }, links: function () { return links; },
  transform: function () { return renderState.transform; },
  canvas: function () { return gfxCanvas; },
  simulation: function () { return simulation; },
  selectedNodes: function () { return selectedNodes; },
  tickCount: function () { return tickCount; } };
window.__rigReady = true;
`;

async function settle(page) {
  // ждём, пока раскладка встанет: либо счётчик шагов дошёл до предела,
  // либо остыла alpha. Потом проверяем, что узел ДЕЙСТВИТЕЛЬНО не едет.
  const t0 = Date.now();
  while (Date.now() - t0 < 70000) {
    const st = await page.evaluate(() => {
      const s = window.__rig.simulation();
      return { alpha: s ? s.alpha() : 0, tick: window.__rig.tickCount() };
    });
    if (st.alpha <= 0.001 || st.tick >= 300) break;
    await wait(1000);
  }
  const before = await page.evaluate(() => {
    const n = window.__rig.nodes()[0];
    return [n.x, n.y];
  });
  await wait(700);
  const after = await page.evaluate(() => {
    const n = window.__rig.nodes()[0];
    return [n.x, n.y];
  });
  const moved = Math.hypot(after[0] - before[0], after[1] - before[1]);
  await page.evaluate(() => window.__rig.freezeSimulation());
  await wait(300);
  const frozen = await page.evaluate(() => {
    const n = window.__rig.nodes()[0];
    return [n.x, n.y];
  });
  const movedFrozen = Math.hypot(frozen[0] - after[0], frozen[1] - after[1]);
  return { сек: Math.round((Date.now() - t0) / 1000), сдвигДоЗаморозки: +moved.toFixed(3),
           сдвигПослеЗаморозки: +movedFrozen.toFixed(3) };
}

// ЗАМОРОЗКА ПЕРЕД КАЖДЫМ ДЕЙСТВИЕМ, а не один раз в начале: закрытие окна
// зовёт unfreezeSimulation, и раскладка трогается снова, если счётчик шагов
// не дошёл до предела. Узел уезжает из-под курсора между шагами, клик
// приходится в пустоту — и прибор врёт по-разному в разных прогонах.
// Поэтому точка не берётся наперёд: перед каждым действием замораживаем
// и спрашиваем у приложения, где узел СЕЙЧАС и попадаем ли мы в него.
async function freshPoint(page, id) {
  await page.evaluate(() => window.__rig.freezeSimulation());
  await wait(200);
  return await page.evaluate(nid => {
    const n = window.__rig.nodes().find(x => x.id === nid);
    if (!n) return null;
    const t = window.__rig.transform();
    const r = window.__rig.canvas().getBoundingClientRect();
    const x = Math.round(r.left + t.applyX(n.x)), y = Math.round(r.top + t.applyY(n.y));
    const el = document.elementFromPoint(x, y);
    const g = window.__rig.toGraph(x, y);
    const hit = window.__rig.pickNode(g[0], g[1]);
    return { x, y, полотно: !!(el && el.id === 'graphCanvas'), попал: !!(hit && hit.id === nid) };
  }, id);
}

// экранная точка узла: спрашиваем у самой страницы
async function pointOf(page, id) {
  return await page.evaluate(nid => {
    const n = window.__rig.nodes().find(x => x.id === nid);
    if (!n) return null;
    const t = window.__rig.transform();
    const r = window.__rig.canvas().getBoundingClientRect();
    return { x: Math.round(r.left + t.applyX(n.x)), y: Math.round(r.top + t.applyY(n.y)) };
  }, id);
}

async function run(pageName, isModule) {
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
  await page.goto(BASE + pageName, { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(3000);
  await page.addScriptTag(isModule ? { type: 'module', content: RIG_MODULE } : { content: RIG_CLASSIC });
  await page.waitForFunction('window.__rigReady === true', { timeout: 20000 });

  const out = {};
  const H = async expr => {
    try { return await page.evaluate(`(${HASH})(${expr})`); }
    catch (e) { return { h: 'ОШИБКА', n: e.message.slice(0, 70) }; }
  };

  out['__остановка'] = await settle(page);

  // Узел берём не наугад и не самый связный: он может лежать ЗА краем окна
  // (граф шире полотна — у первой же пробы вышло y=1708 при высоте 900)
  // или под панелью легенды. Требования: точка в окне, под ней ИМЕННО
  // полотно (elementFromPoint), и приложение подтверждает попадание.
  const chosen = await page.evaluate(() => {
    const deg = {};
    window.__rig.links().forEach(l => {
      const s = l.source.id || l.source, t = l.target.id || l.target;
      deg[s] = (deg[s] || 0) + 1; deg[t] = (deg[t] || 0) + 1;
    });
    const t = window.__rig.transform();
    const r = window.__rig.canvas().getBoundingClientRect();
    const order = Object.keys(deg).sort((a, b) => deg[b] - deg[a]);
    for (const id of order) {
      const n = window.__rig.nodes().find(x => x.id === id);
      if (!n) continue;
      const x = Math.round(r.left + t.applyX(n.x)), y = Math.round(r.top + t.applyY(n.y));
      if (x < 30 || y < 30 || x > window.innerWidth - 30 || y > window.innerHeight - 30) continue;
      const el = document.elementFromPoint(x, y);
      if (!el || el.id !== 'graphCanvas') continue;
      const g = window.__rig.toGraph(x, y);
      const hit = window.__rig.pickNode(g[0], g[1]);
      if (!hit || hit.id !== id) continue;
      return { id, x, y, deg: deg[id] };
    }
    return null;
  });
  if (!chosen) { out.__errs = errs.concat('не нашлось узла в видимой части полотна'); await browser.close(); return out; }
  const id = chosen.id;
  const p = { x: chosen.x, y: chosen.y };
  out['__узел'] = id;
  out['__точка найдена'] = 'да';

  // попал ли курсор в узел — спрашиваем у самого приложения
  out['наведение: узел под курсором'] = await H(
    `(function(){ var g = window.__rig.toGraph(${p.x}, ${p.y}); var n = window.__rig.pickNode(g[0], g[1]); return n ? n.id : 'мимо'; })()`);

  let q = await freshPoint(page, id);
  out['наведение: точка годна'] = await H(`${JSON.stringify(String(q.полотно) + '|' + String(q.попал))}`);
  await page.mouse.move(q.x, q.y);
  await wait(900);
  out['наведение: подсказка'] = await H(
    `(document.getElementById('tooltip').style.opacity || '0') + '|' + document.getElementById('tooltip').innerHTML`);

  // Увод курсора. ДВА движения, а не одно, и плавно: браузер вычисляет
  // выход за границу элемента на СЛЕДУЮЩЕМ входном событии, а синтетическая
  // мышь на этом и заканчивает — mouseleave полотна приходит с запозданием
  // на один шаг. У живой мыши поток движений непрерывен, и такого нет.
  // Прыжок в одну точку давал ложное «подсказка не гаснет».
  await page.mouse.move(20, 20, { steps: 20 });
  await wait(300);
  await page.mouse.move(60, 120, { steps: 5 });
  await wait(600);
  out['увод курсора: подсказка'] = await H(`document.getElementById('tooltip').style.opacity || '0'`);

  // одиночный клик — подсветка
  q = await freshPoint(page, id);
  await page.mouse.click(q.x, q.y);
  await wait(900);
  out['клик: выбрано узлов'] = await H(`String(window.__rig.selectedNodes().size)`);
  out['клик: подсветка'] = await H(
    `(function(){ var n = window.__rig.nodes().find(function(x){return x.id === ${JSON.stringify(id)};}); return String(n.highlighted) + '|' + String(n.dimmed); })()`);

  // Двойной клик. clickCount: 2 у puppeteer шлёт ОДНО событие с detail=2,
  // а приложение считает клики само и ждёт ДВА события в пределах 300 мс.
  q = await freshPoint(page, id);
  await page.mouse.click(q.x, q.y);
  await wait(110);
  await page.mouse.click(q.x, q.y);
  await wait(1500);
  out['двойной клик: окно'] = await H(`document.getElementById('universalModalContent').innerHTML`);
  out['двойной клик: окно открыто'] = await H(
    `getComputedStyle(document.getElementById('universalModal')).display`);
  await page.evaluate(() => window.__rig.closeUniversalModal());
  await wait(400);

  // вход admin/admin — только под ним работают правка и shift-клики
  await page.evaluate(() => {
    window.__rig.openAuthModal('login');
    document.getElementById('authLogin').value = 'admin';
    document.getElementById('authPassword').value = 'admin';
    window.__rig.submitAuth();
  });
  await wait(900);
  // После входа админу показывается окошко про порядок правки. Оно лежит
  // ПОВЕРХ полотна, и пока не закрыто, клики по графу до него не доходят.
  await page.evaluate(() => { if (window.__rig.closeAuthModal) window.__rig.closeAuthModal(); });
  await wait(500);
  out['под admin: кнопки входа'] = await H(`document.getElementById('authButtons').innerHTML`);
  {
    const qq = await freshPoint(page, id);
    out['под admin: полотно свободно'] = await H(
      `(function(){ var el = document.elementFromPoint(${qq.x}, ${qq.y}); return el ? el.id || el.tagName : 'ничего'; })()`);
  }

  q = await freshPoint(page, id);
  out['под admin: точка годна'] = await H(`${JSON.stringify('|')}`.replace('|', String(q.полотно) + '|' + String(q.попал)));
  await page.mouse.click(q.x, q.y);
  await wait(110);
  await page.mouse.click(q.x, q.y);
  await wait(1500);
  // Не длины разметки, а сама разметка: длина меняется от одной формы
  // записи обработчика, а хеш такие атрибуты вычёркивает.
  out['под admin: двойной клик, полоса окна'] = await H(
    `(function(){ var m = document.getElementById('universalModal');
       var tb = document.querySelector('#universalModal .modal-toolbar');
       return getComputedStyle(m).display + '|' +
         document.getElementById('universalModalContent').innerHTML +
         '|' + (tb ? tb.innerHTML : 'нет полосы'); })()`);
  await page.evaluate(() => window.__rig.closeUniversalModal());
  await wait(300);

  // shift-клик по узлу — правка сущности с графа
  // Shift-клик: одиночный лишь запоминает узел, правку концепции открывает
  // ВТОРОЙ shift-клик по тому же узлу (второй по другому — правку связи).
  q = await freshPoint(page, id);
  await page.keyboard.down('Shift');
  await page.mouse.click(q.x, q.y);
  await wait(600);
  q = await freshPoint(page, id);
  await page.mouse.click(q.x, q.y);
  await page.keyboard.up('Shift');
  await wait(1800);
  out['под admin: shift-клик'] = await H(
    `(function(){ var el = document.getElementById('universalModalContent');
        var open = getComputedStyle(document.getElementById('universalModal')).display;
        return open + '|' + (el ? el.innerHTML : 'нет') + '|' +
          (el ? (el.innerHTML.indexOf('modal-form') >= 0) : false); })()`);
  await page.evaluate(() => window.__rig.closeUniversalModal());
  await wait(300);

  // клик по связи: ищем точку на дуге, спрашивая у приложения, а не
  // вычисляя по своему представлению о картинке
  await page.evaluate(() => window.__rig.freezeSimulation());
  await wait(200);
  const lp = await page.evaluate(nid => {
    const t = window.__rig.transform();
    const r = window.__rig.canvas().getBoundingClientRect();
    const ls = window.__rig.links().filter(l => (l.source.id || l.source) === nid);
    for (const l of ls) {
      const a = l.source, b = l.target;
      if (!a.x || !b.x) continue;
      for (let f = 0.3; f <= 0.7; f += 0.05) {
        for (let off = -14; off <= 14; off += 2) {
          const gx = a.x + (b.x - a.x) * f - (b.y - a.y) * off / 100;
          const gy = a.y + (b.y - a.y) * f + (b.x - a.x) * off / 100;
          const sx = Math.round(r.left + t.applyX(gx)), sy = Math.round(r.top + t.applyY(gy));
          if (sx < 30 || sy < 30 || sx > window.innerWidth - 30 || sy > window.innerHeight - 30) continue;
          const el = document.elementFromPoint(sx, sy);
          if (!el || el.id !== 'graphCanvas') continue;
          const g = window.__rig.toGraph(sx, sy);
          if (window.__rig.pickNode(g[0], g[1])) continue;
          const hit = window.__rig.pickLink(g[0], g[1]);
          if (hit) return { x: sx, y: sy };
        }
      }
    }
    return null;
  }, id);
  out['точка на связи найдена'] = lp ? 'да' : 'нет';
  if (lp) {
    await page.mouse.move(lp.x, lp.y);
    await wait(900);
    out['наведение на связь: подсказка'] = await H(
      `(document.getElementById('tooltip').style.opacity || '0') + '|' + (document.getElementById('tooltip').innerHTML.length > 0)`);
  }

  out.__errs = errs;
  await page.close(); await browser.close();
  return out;
}

const [, , mode, arg1, arg2] = process.argv;
if (mode === 'run') {
  const res = await run(arg1, arg1 === 'index.html');
  fs.writeFileSync(arg2, JSON.stringify(res, null, 1));
  console.log(`${arg1}: снимков ${Object.keys(res).length - 1}, ошибок ${res.__errs.length}`);
  console.log('  остановка раскладки:', JSON.stringify(res['__остановка']));
} else {
  const a = JSON.parse(fs.readFileSync(arg1, 'utf8'));
  const b = JSON.parse(fs.readFileSync(arg2, 'utf8'));
  const keys = Object.keys(a).filter(k => k !== '__errs' && !k.startsWith('__'));
  let ok = 0; const bad = [];
  for (const k of keys) {
    if (JSON.stringify(a[k]) === JSON.stringify(b[k])) ok++;
    else bad.push([k, a[k], b[k]]);
  }
  console.log(`граф: сверено ${keys.length}, совпало ${ok}, разошлось ${bad.length}`);
  for (const [k, x, y] of bad) console.log(`  ✗ ${k}: исходник ${JSON.stringify(x)} | модули ${JSON.stringify(y)}`);
  console.log('остановка: исходник', JSON.stringify(a['__остановка']), '| модули', JSON.stringify(b['__остановка']));
  console.log('узел: исходник', a['__узел'], '| модули', b['__узел']);
  console.log(`ошибки: исходник ${a.__errs.length}, модули ${b.__errs.length}`);
  for (const e of [...new Set([...a.__errs, ...b.__errs])].slice(0, 6)) console.log('   ' + e);
  process.exit(bad.length || a.__errs.length || b.__errs.length ? 1 : 0);
}
