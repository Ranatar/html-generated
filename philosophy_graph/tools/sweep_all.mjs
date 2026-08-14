#!/usr/bin/env node
// Полный обход: КАЖДЫЙ обработчик разметки и КАЖДЫЙ слушатель из кода.
//
// Устройство. Приложение проводится по всем состояниям, где вообще
// появляется разметка: главная страница, 39 видов статистики, окна
// концепции, философа и связи в просмотре, они же в правке под admin,
// окна входа и заметок. В каждом состоянии со страницы СНИМАЕТСЯ ПЕРЕЧЕНЬ
// элементов с атрибутами on*, и каждый РАЗЛИЧНЫЙ обработчик срабатывает
// один раз — различие считается по тексту атрибута с вычеркнутыми
// подстановками, поэтому 195 атрибутов дают 115 различных обработчиков,
// а тридцать одинаковых карточек не гоняются тридцать раз.
//
// Изоляции между действиями НЕТ и не нужно: обе стороны идут ОДНОЙ И ТОЙ
// ЖЕ последовательностью, поэтому наведённое состояние у них одинаково,
// и расхождение снимка означает расхождение поведения.
//
// Окна подтверждения отклоняются (иначе правка меняла бы данные и дальше
// сравнивать было бы нечего), окна извещения закрываются.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER ||
  '/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer');
import fs from 'node:fs';
import { объяснить } from './snapshot.mjs';

const CHROME = process.env.CHROME ||
  '/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';
const BASE = process.env.BASE || 'http://127.0.0.1:8711/';
const wait = ms => new Promise(r => setTimeout(r, ms));

const VIEWS = ['overview', 'comparison', 'closest-pairs', 'philosopher-comparison',
  'philosopher-pairs', 'degree', 'pagerank', 'betweenness', 'closeness', 'eigenvector',
  'weighted-clustering', 'local-cohesion', 'rich-club', 'problem-generation',
  'critical-power', 'tension', 'revolutionary', 'paradigm-shift', 'influence',
  'foundational', 'synthetic', 'dialogical', 'coherence', 'transformation', 'fertility',
  'complexity', 'continuity', 'generative', 'instrumental', 'bridging', 'abstraction',
  'deductive', 'temporal-influence', 'philosopher-profile', 'philosopher-systematic',
  'philosopher-reach', 'philosopher-interdisciplinary', 'concept-rankings',
  'philosopher-rankings'];

// то, что в браузере ставится один раз и на месте
const PAGE_HELPERS = `
window.__hit = window.__hit || {};
window.__norm = function (c) {
  return String(c).replace(/'[^']*'/g, "'…'").replace(/\\s+/g, ' ').trim().replace(/;$/, '');
};
window.__hash = function (s) {
  // Форма записи обработчика НЕ СРАВНИВАЕТСЯ: у исходника это onclick="…",
  // у переведённой сборки data-act-click="имя" плюс data-a1 с доводами.
  // Сравнивается всё прочее — строение, текст, классы, остальные атрибуты.
  // Наличие самих обработчиков проверяет перечень обхода, а не хеш.
  s = String(s)
    .replace(/\\son[a-z]+\\s*=\\s*"[^"]*"/gi, '')
    .replace(/\\sdata-act-[a-z]+\\s*=\\s*"[^"]*"/gi, '')
    .replace(/\\sdata-a\\d+\\s*=\\s*"[^"]*"/gi, '')
    .replace(/\\sdata-sweep[a-z-]*\\s*=\\s*"[^"]*"/gi, '');
  s = s.replace(/>\\s+</g, '><').replace(/\\s+/g, ' ').trim();
  var h = 7 >>> 0;
  for (var i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;
  return h + ':' + s.length;
};
// снимок всего, что может измениться от любого действия
window.__snap = function () {
  var g = function (id) { var e = document.getElementById(id); return e ? window.__hash(e.innerHTML) : 'нет'; };
  var vis = function (id) { var e = document.getElementById(id); return e ? getComputedStyle(e).display : 'нет'; };
  var checked = function (sel) { return document.querySelectorAll(sel + ' input:checked').length; };
  return [
    g('legend'), g('pathFinder'), g('controls'), g('authButtons'),
    g('statsContentArea'), g('universalModalContent'), g('conceptProfileContent'),
    g('philosopherProfileContent'), g('pathDescriptionsContent'), g('authModal'),
    vis('statsModal'), vis('universalModal'), vis('conceptProfileModal'),
    vis('philosopherProfileModal'), vis('pathDescriptionsModal'), vis('modalOverlay'),
    (document.getElementById('tooltip') || {}).style ? document.getElementById('tooltip').style.opacity || '0' : '-',
    checked('#philosopherFilters'), checked('#relationFilters'),
    checked('#rubricFilters'), checked('#traditionFilters'),
    (document.getElementById('filterStats') || {}).textContent || '',
    (document.getElementById('filterMode') || {}).value || '',
  ].join('|');
};
// перечень необойдённых обработчиков в заданной области
// Разметка бывает двух видов: со встроенным атрибутом on* (исходник и ещё
// не переведённые генераторы) и с именем действия data-act-* (переведённые).
// Ключ у обоих ОДИН И ТОТ ЖЕ — исходный текст обработчика; для делегирования
// он берётся из actions_map.json. Без этого стороны сравнивать нельзя.
window.__handlers = function (rootSel) {
  var root = rootSel ? document.querySelector(rootSel) : document;
  if (!root) return [];
  var attrs = ['onclick','onchange','oninput','onfocus','onmouseover','onmouseout','onmouseenter','onmouseleave'];
  var признаки = { click: 'onclick', change: 'onchange', input: 'oninput', focus: 'onfocus',
                   enter: 'onmouseenter', leave: 'onmouseleave' };
  // чем бить по переведённому элементу: делегирование слушает всплывающие
  var бить = { click: 'click', change: 'change', input: 'input', focus: 'focus',
               enter: 'mouseover', leave: 'mouseout' };
  var out = [], seen = {};
  var all = root.querySelectorAll('*');
  var добавить = function (el, attr, key, событие) {
    if (seen[key] || window.__hit[key]) return;
    seen[key] = 1;
    el.setAttribute('data-sweep', key);
    if (событие) el.setAttribute('data-sweep-ev', событие);
    else el.removeAttribute('data-sweep-ev');
    out.push({ key: key, tag: el.tagName, type: el.type || '', attr: attr });
  };
  for (var i = 0; i < all.length; i++) {
    var el = all[i];
    // Сперва собрать всё, что висит на элементе, ОБЕИМИ записями, и лишь
    // потом упорядочить по виду события. Иначе у элемента, где один
    // обработчик уже переведён, а другой ещё нет, порядок разъезжается —
    // и стороны расходятся не поведением, а очерёдностью обхода.
    var свои = [];
    for (var a = 0; a < attrs.length; a++) {
      var code = el.getAttribute(attrs[a]);
      if (code) свои.push([a, attrs[a], attrs[a] + ' :: ' + window.__norm(code), null]);
    }
    for (var пр in признаки) {
      var имя = el.getAttribute('data-act-' + пр);
      if (!имя) continue;
      var зап = (window.__actmap || {})[имя];
      var attr = зап ? зап.attr : признаки[пр];
      var ключ;
      if (зап && зап['поимённо']) {
        // Кнопки «Сохранить» и «Удалить»: имя обработчика приходит из
        // данных, поэтому ключ строится по ним — иначе с исходником,
        // где стоит onclick="saveConceptData()", не сойтись.
        var n = el.dataset.a1 || '?';
        if (зап['поимённо'] === 'save') ключ = attr + ' :: ' + n + '()';
        else {
          var д = [el.dataset.a2, el.dataset.a3].filter(function (x) { return x; });
          ключ = attr + ' :: ' + n + '(' + д.map(function () { return "'…'"; }).join(', ') + ')';
        }
      } else if (зап) ключ = attr + ' :: ' + window.__norm(зап['код']);
      else ключ = attr + ' :: НЕИЗВЕСТНОЕ ДЕЙСТВИЕ ' + имя;
      свои.push([attrs.indexOf(attr), attr, ключ, бить[пр]]);
    }
    свои.sort(function (x, y) { return x[0] - y[0]; });
    for (var k = 0; k < свои.length; k++) добавить(el, свои[k][1], свои[k][2], свои[k][3]);
  }
  return out;
};
// сработать обработчиком, вид действия — по виду элемента
window.__fire = function (key) {
  var el = document.querySelector('[data-sweep="' + key.replace(/"/g, '\\\\"') + '"]');
  if (!el) return 'элемент исчез';
  window.__hit[key] = 1;
  var attr = key.split(' :: ')[0];
  var событие = el.getAttribute('data-sweep-ev');
  try {
    if (событие === 'mouseover' || событие === 'mouseout') {
      // граница у переведённого элемента: делегирование слушает всплывающее
      // событие, а «извне» задаётся relatedTarget вне элемента
      el.dispatchEvent(new MouseEvent(событие, { bubbles: true, relatedTarget: document.body }));
      return 'ок';
    }
    if (attr === 'onchange' || attr === 'oninput') {
      if (el.type === 'checkbox' || el.type === 'radio') { el.checked = !el.checked; }
      else if (el.tagName === 'SELECT') {
        var opts = [].slice.call(el.options);
        var next = opts[(el.selectedIndex + 1) % opts.length];
        el.value = next.value;
      } else if (el.type === 'range' || el.type === 'number') {
        el.value = String(Number(el.value || 0) + Number(el.step || 1));
      } else if (el.type === 'color') {
        el.value = '#123456';
      } else { el.value = 'а'; }
      el.dispatchEvent(new Event(attr.slice(2), { bubbles: true }));
    } else if (attr === 'onfocus') {
      el.dispatchEvent(new FocusEvent('focus', { bubbles: false }));
      el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    } else if (attr === 'onmouseover' || attr === 'onmouseout' ||
               attr === 'onmouseenter' || attr === 'onmouseleave') {
      el.dispatchEvent(new MouseEvent(attr.slice(2), { bubbles: attr.indexOf('enter') < 0 && attr.indexOf('leave') < 0 }));
    } else {
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
    return 'ок';
  } catch (e) { return 'исключение: ' + e.message.slice(0, 60); }
};
window.__helpersReady = true;
`;

// Обход дробится на три части, каждая своим запуском процесса: 271 снимок
// с хешами всей разметки в одном сеансе не помещается в память (вкладка
// отваливается на четырёх гигабайтах). Части идут от чистой загрузки,
// поэтому у каждой своя приставка, а покрытие считается объединением.
async function run(pageName, part) {
  const on = n => part === 0 || part === n;
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu',
           '--js-flags=--max-old-space-size=2048'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).split('\n')[0]));
  page.on('console', m => {
    const u = (m.location() && m.location().url) || '';
    if (m.type() === 'error' && !u.includes('favicon')) errs.push('console: ' + m.text().slice(0, 140));
  });
  // окна подтверждения отклоняем, извещения закрываем — одинаково с обеих сторон
  page.on('dialog', async d => { try { await d.dismiss(); } catch (e) {} });

  await page.goto(BASE + pageName, { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(4000);

  // Оснастка: у переведённой сборки точки входа даёт _probe-rig.js
  // (мост снят), у исходника всё и так лежит в window.
  if (pageName.startsWith('_ref')) {
    await page.evaluate(() => { window.__app = window; window.__appReady = true; });
  } else {
    await page.addScriptTag({ type: 'module', content:
      "import './_probe-rig.js';" });
    await page.waitForFunction('window.__appReady === true', { timeout: 20000 });
  }

  await page.evaluate(PAGE_HELPERS);
  await page.waitForFunction('window.__helpersReady === true');
  // карта действий: имя → исходный текст обработчика
  try {
    const m = fs.readFileSync(process.env.TREE ? process.env.TREE + '/actions_map.json' : '/home/claude/build/src/actions_map.json', 'utf8');
    await page.evaluate(j => { window.__actmap = JSON.parse(j); }, m);
  } catch (e) { await page.evaluate(() => { window.__actmap = {}; }); }

  const out = {};
  const order = [];
  const record = async (label) => {
    const snap = await page.evaluate(() => window.__snap());
    out[label] = snap;
    order.push(label);
  };

  // обойти все необойдённые обработчики в области
  const sweep = async (rootSel, context) => {
    const list = await page.evaluate(sel => window.__handlers(sel), rootSel);
    for (const h of list) {
      const before = errs.length;
      const res = await page.evaluate(k => window.__fire(k), h.key);
      await wait(220);
      // Снимок берётся УСТОЯВШИЙСЯ. Часть действий тянет за собой отложенную
      // работу (закрыть профиль, через 120 мс открыть статистику и посчитать
      // метрику), и снимок на полпути ловит то одно состояние, то другое —
      // расхождение сторон получилось бы от разной скорости, а не от разного
      // поведения. Поэтому: снять, переснять, и если разошлось — дать ещё.
      let snap = await page.evaluate(() => window.__snap());
      await wait(320);
      let snap2 = await page.evaluate(() => window.__snap());
      if (snap !== snap2) {
        await wait(1200);
        snap2 = await page.evaluate(() => window.__snap());
      }
      snap = snap2;
      const label = `${context} ▸ ${h.key}`;
      out[label] = `${res}|${snap}`;
      order.push(label);
      if (errs.length > before) out[label] += `|ОШИБОК+${errs.length - before}`;
    }
    return list.length;
  };

  // Любой шаг может упасть из-за наведённого состояния (обход шапки
  // статистики жмёт и кнопку закрытия). Падение не прерывает обход:
  // оно записывается в снимок и сверяется наравне со всем прочим.
  const safe = async (label, fn) => {
    try { return await fn(); }
    catch (e) { out['СБОЙ ' + label] = e.message.slice(0, 100); order.push('СБОЙ ' + label); return null; }
  };
  const ensureStats = async () => {
    const open = await page.evaluate(() =>
      getComputedStyle(document.getElementById('statsModal')).display !== 'none');
    if (!open) { await page.evaluate(() => window.__app.openStatsModal()); await wait(700); }
  };

  // Обход в один проход неполон: элементы стоят в порядке разметки, и
  // кнопка закрытия попадается раньше остальных — окно захлопывается, а
  // хвост списка исчезает. Поэтому область открывается заново и обходится
  // столько раз, сколько нужно, чтобы новых обработчиков не осталось.
  const cover = async (ctx, openFn, rootSel, passes = 8) => {
    let total = 0;
    for (let i = 0; i < passes; i++) {
      await safe(ctx + ' открытие', openFn);
      await wait(700);
      const n = await safe(ctx + ' обход', () => sweep(rootSel, ctx));
      total += n || 0;
      if (!n) break;
    }
    return total;
  };

  const counts = {};

  // Пара связанных концепций берётся ДО обхода: после него окно концепции
  // уже в наведённом состоянии, и разметки со связями в нём может не быть.
  // Идентификатор концепции берётся из разметки списка: у исходника он
  // внутри onclick, у переведённой сборки — в data-a2. Прибор обязан
  // понимать обе записи, иначе после перевода ему не за что зацепиться.
  const ids0 = await page.evaluate(() =>
    [...document.querySelectorAll('#sourceSelectDropdown .custom-select-option')]
      .map(o => {
        const d = o.getAttribute('data-a2');
        if (d) return d;
        const c = o.getAttribute('onclick') || '';
        const m = c.match(/'([^']+)'\s*\)$/);
        return m ? m[1] : null;
      }).filter(Boolean));
  const pair0 = await page.evaluate(async id => {
    window.__app.openConceptById(id);
    await new Promise(r => setTimeout(r, 900));
    const html = document.getElementById('universalModalContent').innerHTML;
    // без построения выражения на лету: берём первое совпадение и
    // отрезаем от него известную приставку — так проще и надёжнее
    // Направление в подписи не обязано совпадать с направлением связи:
    // список окна показывает и входящие. Поэтому пара не просто берётся,
    // а ПРОВЕРЯЕТСЯ через findConnection в обоих порядках — иначе окно
    // связи откроется в виде «новой связи», и половина его разметки
    // не появится вовсе.
    const пары = [];
    for (const one of (html.match(/toggleConnectionDescription\('([^']+)'\)/g) || []))
      пары.push(one.slice(one.indexOf("('") + 2, one.lastIndexOf("')")));
    // Переведённая запись: имя действия выводится из ПЕРВОГО вызова, а он
    // здесь event.stopPropagation() — так что искать надо не по имени, а по
    // самому дереву: у нужных элементов пара лежит в data-a1 и data-a2.
    for (const el of document.querySelectorAll('[data-a1]')) {
      const a1 = el.dataset.a1, a2 = el.dataset.a2;
      if (a1 && a2) пары.push(a1 + '-' + a2);
      else if (a1 && a1.indexOf('-') > 0) пары.push(a1);
    }
    for (const inner of пары) {
      if (!inner.startsWith(id + '-')) continue;
      const other = inner.slice(id.length + 1);
      if (window.__app.findConnection(id, other, false)) { window.__app.closeUniversalModal(); return [id, other]; }
      if (window.__app.findConnection(other, id, false)) { window.__app.closeUniversalModal(); return [other, id]; }
    }
    window.__app.closeUniversalModal();
    return null;
  }, ids0[0]);
  await wait(500);

  if (on(1) || on(4)) counts['главная'] = await sweep(null, 'главная');
  if (on(5)) {
    // разбирающий заход: дамп панели ПОСЛЕ ПЕРВОГО ЖЕ действия
    const list = await page.evaluate(sel => window.__handlers(sel), null);
    await page.evaluate(k => window.__fire(k), list[0].key);
    await wait(1500);
    out['__первоеДействие'] = list[0].key;
    out['__дампЛегенды'] = await page.evaluate(() => {
      const t = document.getElementById('legend').innerHTML;
      return String(t)
        .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
        .replace(/\sdata-act-[a-z]+\s*=\s*"[^"]*"/gi, '')
        .replace(/\sdata-a\d+\s*=\s*"[^"]*"/gi, '')
        .replace(/\sdata-sweep\s*=\s*"[^"]*"/gi, '')
        .replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
    });
    order.push('__дампЛегенды');
  }
  if (on(4)) {
    // разбирающий заход: полный текст панели после обхода главной страницы
    out['__дампЛегенды'] = await page.evaluate(() => {
      const t = document.getElementById('legend').innerHTML;
      return String(t)
        .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
        .replace(/\sdata-act-[a-z]+\s*=\s*"[^"]*"/gi, '')
        .replace(/\sdata-a\d+\s*=\s*"[^"]*"/gi, '')
        .replace(/\sdata-sweep\s*=\s*"[^"]*"/gi, '')
        .replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
    });
    order.push('__дампЛегенды');
  }

  // Обход главной страницы жмёт «Сбросить» и меняет режимы. Перед разбором
  // видов состояние возвращается в исходное — иначе часть видов не строится
  // вовсе (сравнение философов падает, когда сравнивать некого).
  if (on(1)) await page.evaluate(() => {
    window.__app.selectAllPhilosophers(); window.__app.selectAllRelations();
    window.__app.selectAllRubrics(); window.__app.selectAllTraditions();
    const fm = document.getElementById('filterMode');
    if (fm) { fm.value = 'all'; window.__app.changeFilterMode('all'); }
    const sc = document.getElementById('statsScopeToggle');
    if (sc && sc.checked) { sc.checked = false; window.__app.handleMetricsScopeChange(); }
    const uw = document.getElementById('statsUseWeightsToggle');
    if (uw && uw.checked) { uw.checked = false; window.__app.handleStatsParameterChange(); }
    const rd = document.getElementById('statsRespectDirectionToggle');
    if (rd && rd.checked) { rd.checked = false; window.__app.handleStatsParameterChange(); }
  });
  if (on(1)) { await wait(2500); await record('состояние возвращено'); await record('после главной'); }

  // окно статистики: все 39 видов
  if (on(1)) {
  await page.evaluate(() => window.__app.openStatsModal());
  await wait(600);
  counts['шапка статистики'] = await safe('шапка', () => sweep('#statsModal', 'статистика')) || 0;
  let vсум = 0;
  const МЕДЛЕННЫЕ = ['closest-pairs', 'philosopher-pairs', 'philosopher-comparison', 'comparison'];
  for (const v of VIEWS) {
    await ensureStats();
    await safe('вид ' + v, () => page.evaluate(n => window.__app.switchStatsView(n), v));
    // строки близких пар считаются порциями и появляются не сразу
    await wait(МЕДЛЕННЫЕ.includes(v) ? 5000 : 1700);
    vсум += (await safe('обход ' + v, () => sweep('#statsContentArea', 'вид ' + v))) || 0;
    if (МЕДЛЕННЫЕ.includes(v)) {
      await wait(2500);
      vсум += (await safe('добор ' + v, () => sweep('#statsContentArea', 'вид ' + v))) || 0;
    }
    await record('вид ' + v);
  }
  counts['виды статистики'] = vсум;
  await page.evaluate(() => window.__app.closeStatsModal());
  await wait(400);
  }

  // окна сущностей в просмотре
  const ids = ids0;
  const cid = ids[0];
  const phil = await page.evaluate(() =>
    document.querySelector('#philosopherFilters input').id.replace(/^phil-/, ''));
  const pair = pair0;
  if (on(2)) {
  counts['окно концепции'] = await cover('концепция',
    () => page.evaluate(i => { window.__app.closeUniversalModal(); window.__app.openConceptById(i); }, cid),
    '#universalModal');
  await record('после концепции');

  // поиск внутри окна концепции: без запроса список пуст и обработчики
  // выбора недостижимы
  await page.evaluate(i => { window.__app.closeUniversalModal(); window.__app.openConceptById(i); }, cid);
  await wait(800);
  await page.evaluate(() => window.__app.handleModalSearch('и'));
  await wait(600);
  counts['поиск в окне концепции'] = await sweep('#universalModal', 'поиск в концепции');
  await record('после поиска в концепции');
  await page.evaluate(() => window.__app.closeUniversalModal());
  await wait(300);

  counts['окно философа'] = await cover('философ',
    () => page.evaluate(p => { window.__app.closeUniversalModal(); window.__app.openUniversalModal('philosopher', p, 'view'); }, phil),
    '#universalModal');
  await record('после философа');

  if (pair) {
    counts['окно связи'] = await cover('связь',
      () => page.evaluate(([s, t]) => { window.__app.closeUniversalModal();
        window.__app.openUniversalModal('connection', window.__app.findConnection(s, t, false), 'view'); }, pair),
      '#universalModal');
    await record('после связи');
    // поиск в окне связи — свои обработчики ввода и выбора
    await page.evaluate(([s, t]) => { window.__app.closeUniversalModal();
      window.__app.openUniversalModal('connection', window.__app.findConnection(s, t, false), 'view'); }, pair);
    await wait(900);
    await page.evaluate(() => { window.__app.toggleConnectionSearchSection(); window.__app.handleConnectionViewSearch('source', 'и'); });
    await wait(700);
    counts['поиск в окне связи'] = await sweep('#universalModal', 'поиск в связи');
    await record('после поиска в связи');
    await page.evaluate(() => window.__app.closeUniversalModal());
    await wait(300);
  } else { counts['окно связи'] = 'пара не найдена'; }

  // профили
  counts['профиль концепции'] = await cover('профиль концепции',
    () => page.evaluate(i => { window.__app.closeUniversalModal(); window.__app.closeConceptProfileModal();
      window.__app.showConceptProfileModal(i); }, cid), '#conceptProfileModal');
  await record('после профиля концепции');
  await page.evaluate(() => { window.__app.closeConceptProfileModal(); window.__app.closeUniversalModal(); });
  await wait(400);
  counts['профиль философа'] = await cover('профиль философа',
    () => page.evaluate(p => { window.__app.closePhilosopherProfileModal(); window.__app.closeUniversalModal();
      window.__app.showPhilosopherProfileModal(p); }, phil), '#philosopherProfileModal');
  await record('после профиля философа');
  await page.evaluate(() => { window.__app.closePhilosopherProfileModal(); window.__app.closeUniversalModal(); });
  await wait(400);

  // путь и его окно описаний
  const showPath = () => page.evaluate(list => {
    window.__app.selectCustomOption('source', list[0]);
    window.__app.selectCustomOption('target', list[80]);
    document.getElementById('respectChronology').checked = false;
    window.__app.findAndShowPath();
  }, ids);
  counts['итог пути'] = await cover('путь', showPath, '#pathResult');
  await record('после пути');
  await showPath(); await wait(1400);
  await page.evaluate(() => window.__app.showPathDescriptionsModal());
  await wait(900);
  counts['описания пути'] = await cover('описания пути',
    async () => { await showPath(); await wait(1200); await page.evaluate(() => window.__app.showPathDescriptionsModal()); },
    '#pathDescriptionsModal');
  await record('после описаний пути');
  await page.evaluate(() => window.__app.closePathDescriptionsModal());
  await wait(300);

  // поиск в легенде: без запроса нет ни одного найденного
  await page.evaluate(() => window.__app.handleLegendSearch('иде'));
  await wait(600);
  counts['найденное в легенде'] = await sweep('#legendSearchResults', 'поиск легенды');
  await record('после поиска в легенде');
  await page.evaluate(() => window.__app.clearLegendSearch());
  await wait(300);

  // выпадающий список поиска пути
  await page.evaluate(() => window.__app.showCustomSelectDropdown('source'));
  await wait(500);
  counts['выпадающий список пути'] = await sweep('#sourceSelectDropdown', 'список пути');
  await record('после списка пути');
  }

  // вход: сперва регистрация, потом admin
  if (on(3)) {
  counts['окно регистрации'] = await cover('регистрация',
    () => page.evaluate(() => { window.__app.closeAuthModal(); window.__app.openAuthModal('register'); }), '#authModal');
  await record('после окна регистрации');
  counts['окно входа'] = await cover('вход',
    () => page.evaluate(() => { window.__app.closeAuthModal(); window.__app.openAuthModal('login'); }), '#authModal');
  await record('после окна входа');
  await page.evaluate(() => window.__app.closeAuthModal());
  await wait(300);
  await page.evaluate(() => {
    window.__app.openAuthModal('login');
    document.getElementById('authLogin').value = 'admin';
    document.getElementById('authPassword').value = 'admin';
    window.__app.submitAuth();
  });
  await wait(900);
  counts['извещение после входа'] = await sweep('#authModal', 'извещение админа');
  await page.evaluate(() => window.__app.closeAuthModal());
  await wait(400);
  await record('после входа');

  // ПОД ADMIN: окна в правке — формы концепции, философа, связи
  counts['правка концепции'] = await cover('правка концепции',
    () => page.evaluate(i => { window.__app.closeUniversalModal(); window.__app.openEditConceptModal(i); }, cid),
    '#universalModal');
  await record('после правки концепции');
  counts['правка философа'] = await cover('правка философа',
    () => page.evaluate(p => { window.__app.closeUniversalModal();
      window.__app.openUniversalModal('philosopher', p, 'edit'); }, phil), '#universalModal');
  await record('после правки философа');
  if (pair) {
    counts['правка связи'] = await cover('правка связи',
      () => page.evaluate(([s, t]) => { window.__app.closeUniversalModal();
        window.__app.openEditConnectionModal(s, t); }, pair), '#universalModal');
    await record('после правки связи');
    // поиск концепции в форме правки связи
    await page.evaluate(([s, t]) => { window.__app.closeUniversalModal(); window.__app.openEditConnectionModal(s, t); }, pair);
    await wait(1100);
    // Через РАЗМЕТКУ, а не через window: handleConnectionEditSearch не
    // зовётся из атрибутов, поэтому мост его наружу не выставляет — и
    // правильно. Поле само навешивает слушатель, ему и шлём ввод.
    await page.evaluate(() => {
      const el = document.getElementById('connSourceSearch');
      if (!el) return;
      el.value = 'и';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('focus', { bubbles: false }));
    });
    await wait(700);
    counts['поиск в правке связи'] = await sweep('#universalModal', 'поиск в правке связи');
    await record('после поиска в правке связи');
    await page.evaluate(() => window.__app.closeUniversalModal());
    await wait(400);
  }
  // выбор концепции с графа: своя полоса с отменой
  // Кнопку «Выбрать на графе» ставит initConnectionSearchFields, и её
  // обработчик навешан свойством onclick, а не атрибутом. Значит, жать
  // надо саму кнопку в форме правки связи — через window сюда не попасть:
  // selectConceptOnGraph из разметки не зовётся и мостом не выставлен.
  if (pair) {
    await page.evaluate(([a, bb]) => { window.__app.closeUniversalModal();
      window.__app.openEditConnectionModal(a, bb); }, pair);
    await wait(1200);
    await page.evaluate(() => {
      const btn = document.querySelector('#universalModal .graph-select-btn');
      if (btn) btn.click();
    });
  }
  await wait(700);
  counts['выбор с графа'] = await sweep(null, 'выбор с графа');
  await record('после выбора с графа');
  await page.evaluate(() => { if (window.__app.cancelGraphSelection) window.__app.cancelGraphSelection(); });
  await wait(400);
  // наложение схожести: своя легенда с кнопками
  // Многопроходно: первый же щелчок в легенде схожести может её убрать,
  // и кнопка снятия наложения исчезнет раньше, чем до неё дойдёт черёд.
  counts['наложение схожести'] = await cover('схожесть',
    () => page.evaluate(i => window.__app.showSimilarityOverlay(i, 'profile'), cid), null);
  await record('после схожести');
  await page.evaluate(() => { if (window.__app.clearSimilarityOverlay) window.__app.clearSimilarityOverlay(); });
  await wait(400);
  // окно под admin в просмотре — там своя полоса с кнопкой правки
  counts['окно концепции под admin'] = await cover('концепция под admin',
    () => page.evaluate(i => { window.__app.closeUniversalModal(); window.__app.openConceptById(i); }, cid),
    '#universalModal');
  await record('после концепции под admin');
  counts['окно философа под admin'] = await cover('философ под admin',
    () => page.evaluate(p => { window.__app.closeUniversalModal();
      window.__app.openUniversalModal('philosopher', p, 'view'); }, phil), '#universalModal');
  await record('после философа под admin');
  await page.evaluate(() => window.__app.closeUniversalModal());
  await wait(400);

  // стопка окон: кнопка «Назад» есть только у окна, открытого ИЗ другого
  counts['стопка окон'] = await cover('стопка окон', () => page.evaluate((i, p) => {
    window.__app.closeUniversalModal();
    window.__app.openConceptById(i);
    setTimeout(() => window.__app.openUniversalModal('philosopher', p, 'view'), 300);
  }, cid, phil), '#universalModal');
  await record('после стопки окон');
  await page.evaluate(() => window.__app.closeUniversalModal());
  await wait(400);

  // добор: всё, что появилось в разметке по ходу и ещё не тронуто
  counts['добор по всей странице'] = await cover('добор', async () => {}, null, 3);
  await record('после добора');

  // ── слушатели, навешанные из кода ────────────────────────────────
  const key = async (k, label) => {
    await page.keyboard.press(k); await wait(500); await record('клавиша ' + label);
  };
  await page.evaluate(() => window.__app.openStatsModal()); await wait(600);
  await key('Escape', 'Esc при открытой статистике');
  await page.evaluate(i => window.__app.openConceptById(i), cid); await wait(800);
  await key('Escape', 'Esc при открытом окне');
  await page.evaluate(i => window.__app.openConceptById(i), cid); await wait(800);
  await page.evaluate(() => document.getElementById('modalOverlay').click());
  await wait(500); await record('клик по подложке');

  // выпадающие списки закрываются кликом мимо
  await page.evaluate(() => window.__app.showCustomSelectDropdown('source')); await wait(400);
  await page.evaluate(() => document.body.click()); await wait(400);
  await record('клик мимо выпадающего списка');

  // переключатели хронологии — слушатели на change
  await page.evaluate(() => {
    const c = document.getElementById('respectChronology');
    c.checked = !c.checked; c.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await wait(600); await record('переключатель хронологии');
  await page.evaluate(() => {
    const s = document.getElementById('chronologyModeSelect');
    s.value = 'moderate'; s.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await wait(600); await record('режим хронологии');

  // изменение размера окна
  await page.setViewport({ width: 1100, height: 720 }); await wait(900);
  await record('после изменения размера');
  await page.setViewport({ width: 1440, height: 900 }); await wait(900);
  await record('размер возвращён');

  // выход
  await page.evaluate(() => window.__app.authLogout()); await wait(600);
  await record('после выхода');

  }
  const hit = await page.evaluate(() => Object.keys(window.__hit));
  out.__hit = hit;
  out.__counts = counts;
  out.__errs = errs;
  out.__order = order;
  await page.close(); await browser.close();
  return out;
}

const [, , mode, a1, a2, a3] = process.argv;
if (mode === 'run') {
  const res = await run(a1, Number(a3 || 0));
  fs.writeFileSync(a2, JSON.stringify(res, null, 1));
  const all = JSON.parse(fs.readFileSync(process.env.KEYS || '/home/claude/handler_keys.json', 'utf8'));
  const hit = new Set(res.__hit);
  const covered = all.filter(k => hit.has(k)).length;
  console.log(`${a1} (часть ${a3 || 'вся'}): снимков ${res.__order.length}, ошибок ${res.__errs.length}`);
  console.log(`  обработчиков задето ${hit.size}; из перечня разметки ${covered} из ${all.length}`);
  console.log('  по областям:', JSON.stringify(res.__counts, null, 0).slice(0, 400));
} else if (mode === 'merge') {
  // склейка частей одной стороны в один свод
  const parts = process.argv.slice(4).filter(f => f && f !== '-').map(f => JSON.parse(fs.readFileSync(f, 'utf8')));
  const out = { __order: [], __hit: [], __errs: [], __counts: {} };
  parts.forEach((pt, i) => {
    for (const k of pt.__order) { const kk = `ч${i + 1} ▸ ${k}`; out.__order.push(kk); out[kk] = pt[k]; }
    out.__hit.push(...pt.__hit);
    out.__errs.push(...pt.__errs);
    Object.assign(out.__counts, pt.__counts);
  });
  out.__hit = [...new Set(out.__hit)];
  fs.writeFileSync(a1, JSON.stringify(out, null, 1));
  console.log(`сведено частей ${parts.length}: снимков ${out.__order.length}, ` +
    `обработчиков ${out.__hit.length}, ошибок ${out.__errs.length}`);
} else {
  const A = JSON.parse(fs.readFileSync(a1, 'utf8'));
  const B = JSON.parse(fs.readFileSync(a2, 'utf8'));
  const keys = A.__order.filter(k => B.__order.includes(k));
  let ok = 0; const bad = [];
  for (const k of keys) {
    if (A[k] === B[k]) ok++; else bad.push([k, A[k], B[k]]);
  }
  const onlyA = A.__order.filter(k => !B.__order.includes(k));
  const onlyB = B.__order.filter(k => !A.__order.includes(k));
  console.log(`обойдено: исходник ${A.__order.length}, модули ${B.__order.length}`);
  console.log(`сверено ${keys.length}: совпало ${ok}, разошлось ${bad.length}`);
  // Третий слой: снимок обхода — строка полей; разбор показывает, КАКОЕ
  // поле разъехалось, а не всю строку целиком.
  for (const [k, x, y] of bad.slice(0, 40)) console.log(объяснить(k, x, y) || `  ✗ ${k}`);
  if (onlyA.length) console.log('только у исходника:', onlyA.slice(0, 10));
  if (onlyB.length) console.log('только у модулей:', onlyB.slice(0, 10));
  const all = JSON.parse(fs.readFileSync(process.env.KEYS || '/home/claude/handler_keys.json', 'utf8'));
  const hA = new Set(A.__hit), hB = new Set(B.__hit);
  // Два обработчика в разметке несут ПОДСТАВЛЯЕМОЕ имя функции
  // (`${saveFn}()` в modalActions) — в перечне они выглядят как «…()»,
  // а на странице разворачиваются в saveConceptData(), deleteConcept(…)
  // и прочие. Считаем их покрытыми, если развёрнутые виды сработали.
  const РАЗВЁРНУТЫЕ = ['saveConceptData()', 'savePhilosopherData()', 'saveConnectionData()',
    "deleteConcept('…')", "deletePhilosopher('…')", "deleteConnection('…', '…')"];
  const развёрнутоЗадето = РАЗВЁРНУТЫЕ.filter(x =>
    hA.has('onclick :: ' + x) && hB.has('onclick :: ' + x));
  const missed = all.filter(k => !hA.has(k) && !hB.has(k) && !k.startsWith('onclick :: …'));
  console.log(`подставляемое имя функции (\`\${saveFn}()\`): развёрнутых видов сработало ${развёрнутоЗадето.length} из ${РАЗВЁРНУТЫЕ.length} на ОБЕИХ сторонах`);
  console.log(`обработчиков разметки задето: исходник ${all.filter(k => hA.has(k)).length}, модули ${all.filter(k => hB.has(k)).length}, всего в перечне ${all.length}`);
  if (missed.length) { console.log('НЕ ЗАДЕТЫ (' + missed.length + '):'); missed.forEach(k => console.log('   ' + k)); }
  console.log(`ошибки страницы: исходник ${A.__errs.length}, модули ${B.__errs.length}`);
  for (const e of [...new Set([...A.__errs, ...B.__errs])].slice(0, 8)) console.log('   ' + e);
  process.exit(bad.length || onlyA.length || onlyB.length ? 1 : 0);
}
