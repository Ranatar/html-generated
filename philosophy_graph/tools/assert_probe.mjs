#!/usr/bin/env node
// УТВЕРЖДЕНИЯ О ДОЛЖНОМ — второй слой приёмки.
//
// Чем отличается от первых двух. Сравнение двух страниц отвечает «одинаково
// ли», эталон — «стало ли иначе, чем было». Оба молчат о том, ПРАВИЛЬНО ли:
// эталон, снятый с испорченной стороны, закрепит поломку как норму, а
// сравнение двух одинаково испорченных страниц её не заметит. Так у нас уже
// трижды и выходило — разбор собственного onclick в подсветке вкладок,
// пустая проверка подсветки узла, пропавшая кнопка «Нормировать».
//
// Здесь записано, что ДОЛЖНО быть верно, числами и условиями. Утверждения
// переживают намеренные правки (менять их приходится осознанно, по одному),
// не нуждаются ни в исходнике, ни в эталоне и говорят о деле, а не о прошлом.
//
//   node tools/assert_probe.mjs <страница>        по умолчанию index.html
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER ||
  '/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer');

const CHROME = process.env.CHROME ||
  '/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';
const BASE = process.env.BASE || 'http://127.0.0.1:8711/';
const СТРАНИЦА = process.argv[2] || 'index.html';
const wait = ms => new Promise(r => setTimeout(r, ms));

// ── ожидаемое. Меняется ОСОЗНАННО, по одному числу ──────────────────
const ЖДЁМ = {
  концепций: 453, связей: 1624, философов: 57, традиций: 22, рубрик: 15, типовСвязей: 21,
  вкладокСтатистики: 39,
  таблицСтилей: 10,
  порогКонтраста: 4.5,
};

const проверки = [];
const проверить = (имя, годно, ждали, вышло) =>
  проверки.push({ имя, годно: !!годно, ждали, вышло });

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const ошибки = [];
page.on('pageerror', e => ошибки.push(String(e).split('\n')[0]));
page.on('console', m => {
  const u = (m.location() && m.location().url) || '';
  if (m.type() === 'error' && !u.includes('favicon')) ошибки.push('console: ' + m.text().slice(0, 140));
});
page.on('requestfailed', r => {
  if (!r.url().endsWith('favicon.ico')) ошибки.push('не загрузилось: ' + r.url().split('/').pop());
});
page.on('dialog', async d => { try { await d.accept(); } catch (e) {} });

await page.goto(BASE + СТРАНИЦА, { waitUntil: 'networkidle0', timeout: 60000 });
await wait(4000);

const модуль = !СТРАНИЦА.startsWith('_ref');
await page.addScriptTag(модуль
  ? { type: 'module', content: `
      import { DATA, S } from './core/ns.js';
      import { actionNames } from './ui/actions.js';
      import { openStatsModal, closeStatsModal, switchStatsView } from './stats/modal.js';
      import { openConceptById } from './modal/entry.js';
      import { closeUniversalModal, openUniversalModal } from './modal/core.js';
      import { openEditConceptModal } from './modal/entry.js';
      import { openAuthModal, submitAuth, closeAuthModal } from './modal/auth.js';
      import { collectData, hasUnsaved } from './data/save.js';
      import { handleLegendSearch } from './ui/search-legend.js';
      window.__t = { DATA, S, actionNames, openStatsModal, closeStatsModal, switchStatsView,
        openConceptById, closeUniversalModal, openUniversalModal, openEditConceptModal,
        openAuthModal, submitAuth, closeAuthModal, collectData, hasUnsaved, handleLegendSearch };
      window.__tReady = true;` }
  : { content: `
      window.__t = { DATA: { concepts: concepts, relations: relations, philosophers: philosophers,
          traditions: traditions, rubrics: rubrics, relationTypes: relationTypes,
          nodes: nodes, links: links, conceptToRubrics: conceptToRubrics,
          philosopherIdToName: philosopherIdToName },
        actionNames: function () { return []; },
        openStatsModal: openStatsModal, closeStatsModal: closeStatsModal,
        switchStatsView: switchStatsView, openConceptById: openConceptById,
        closeUniversalModal: closeUniversalModal, openUniversalModal: openUniversalModal,
        openEditConceptModal: openEditConceptModal, openAuthModal: openAuthModal,
        submitAuth: submitAuth, closeAuthModal: closeAuthModal,
        collectData: collectData, hasUnsaved: hasUnsaved, handleLegendSearch: handleLegendSearch };
      window.__tReady = true;` });
await page.waitForFunction('window.__tReady === true', { timeout: 20000 });

// ── 1. база загрузилась и указатели пересобраны ─────────────────────
{
  const d = await page.evaluate(() => {
    const D = window.__t.DATA;
    return { концепций: D.concepts.length, связей: D.relations.length,
      философов: D.philosophers.length, традиций: D.traditions.length,
      рубрик: D.rubrics.length, типовСвязей: D.relationTypes.length,
      узлов: D.nodes.length, рёбер: D.links.length,
      рубрикиУзлов: Object.keys(D.conceptToRubrics).length,
      именаФилософов: Object.keys(D.philosopherIdToName).length };
  });
  for (const k of ['концепций', 'связей', 'философов', 'традиций', 'рубрик', 'типовСвязей'])
    проверить('база: ' + k, d[k] === ЖДЁМ[k], ЖДЁМ[k], d[k]);
  // узлы и связи — производные: их число обязано совпасть с базой
  проверить('указатели: узлов столько же, сколько концепций',
    d.узлов === d.концепций, d.концепций, d.узлов);
  проверить('указатели: рёбер столько же, сколько связей',
    d.рёбер === d.связей, d.связей, d.рёбер);
  проверить('указатели: рубрики есть у каждой концепции',
    d.рубрикиУзлов === d.концепций, d.концепций, d.рубрикиУзлов);
  проверить('указатели: имя есть у каждого философа',
    d.именаФилософов === d.философов, d.философов, d.именаФилософов);
}

// ── 2. глобального хода нет, действия все известны ──────────────────
if (модуль) {
  const g = await page.evaluate(() => {
    const свои = window.__t.actionNames();
    const набор = new Set(свои);
    const неизвестные = [];
    for (const el of document.querySelectorAll('*'))
      for (const пр of ['click', 'change', 'input', 'focus', 'enter', 'leave']) {
        const имя = el.getAttribute('data-act-' + пр);
        if (имя && !набор.has(имя)) неизвестные.push(имя);
      }
    const вРазметке = document.querySelectorAll(
      '[onclick],[onchange],[oninput],[onfocus],[onmouseover],[onmouseout]').length;
    return { действий: свои.length, неизвестные: [...new Set(неизвестные)], вРазметке };
  });
  проверить('делегирование: все имена действий известны реестру',
    g.неизвестные.length === 0, 0, g.неизвестные.length + (g.неизвестные[0] ? ' (' + g.неизвестные[0] + ')' : ''));
  проверить('в разметке нет встроенных обработчиков', g.вРазметке === 0, 0, g.вРазметке);
  проверить('реестр действий не пуст', g.действий > 100, '>100', g.действий);
}

// ── 3. таблицы стилей подключены ────────────────────────────────────
if (модуль) {
  const n = await page.evaluate(() => document.styleSheets.length);
  проверить('стилей подключено', n === ЖДЁМ.таблицСтилей, ЖДЁМ.таблицСтилей, n);
}

// ── 4. панели отрисованы по данным ──────────────────────────────────
{
  const п = await page.evaluate(() => ({
    философы: document.querySelectorAll('#philosopherFilters input').length,
    связи: document.querySelectorAll('#relationFilters input').length,
    рубрики: document.querySelectorAll('#rubricFilters input').length,
    традиции: document.querySelectorAll('#traditionFilters input').length,
    источник: document.querySelectorAll('#sourceSelectDropdown .custom-select-option').length,
    цель: document.querySelectorAll('#targetSelectDropdown .custom-select-option').length,
    вкладок: document.querySelectorAll('.stats-nav-item').length,
  }));
  проверить('легенда: галочек философов', п.философы === ЖДЁМ.философов, ЖДЁМ.философов, п.философы);
  проверить('легенда: галочек типов связей', п.связи === ЖДЁМ.типовСвязей, ЖДЁМ.типовСвязей, п.связи);
  проверить('легенда: галочек рубрик', п.рубрики === ЖДЁМ.рубрик, ЖДЁМ.рубрик, п.рубрики);
  проверить('легенда: галочек традиций', п.традиции === ЖДЁМ.традиций, ЖДЁМ.традиций, п.традиции);
  проверить('поиск пути: список источника полон', п.источник === ЖДЁМ.концепций, ЖДЁМ.концепций, п.источник);
  проверить('поиск пути: список цели полон', п.цель === ЖДЁМ.концепций, ЖДЁМ.концепций, п.цель);
  проверить('статистика: вкладок', п.вкладок === ЖДЁМ.вкладокСтатистики, ЖДЁМ.вкладокСтатистики, п.вкладок);
}

// ── 5. КАЖДАЯ вкладка даёт содержимое и подсвечивается ──────────────
{
  await page.evaluate(() => window.__t.openStatsModal());
  await wait(1200);
  const виды = await page.evaluate(() =>
    [...document.querySelectorAll('.stats-nav-item')].map(e =>
      e.dataset.view || ((e.getAttribute('onclick') || '').match(/'([^']+)'/) || [])[1]).filter(Boolean));
  проверить('у каждой вкладки есть имя вида', виды.length === ЖДЁМ.вкладокСтатистики,
    ЖДЁМ.вкладокСтатистики, виды.length);
  const пустые = [], безПодсветки = [];
  for (const в of виды) {
    await page.evaluate(n => window.__t.switchStatsView(n), в);
    await wait(1400);
    const r = await page.evaluate(() => ({
      длина: (document.getElementById('statsContentArea').textContent || '').trim().length,
      активных: document.querySelectorAll('.stats-nav-item.active').length,
    }));
    if (r.длина < 100) пустые.push(в);
    if (r.активных !== 1) безПодсветки.push(в + ':' + r.активных);
  }
  проверить('каждая вкладка даёт непустое содержимое', пустые.length === 0, 0,
    пустые.length + (пустые[0] ? ' (' + пустые[0] + ')' : ''));
  проверить('ровно одна вкладка подсвечена в каждом виде', безПодсветки.length === 0, 0,
    безПодсветки.length + (безПодсветки[0] ? ' (' + безПодсветки[0] + ')' : ''));
  await page.evaluate(() => window.__t.closeStatsModal());
  await wait(500);
}

// ── 6. окна открываются и говорят о том, что открыли ────────────────
{
  const id = await page.evaluate(() => window.__t.DATA.concepts[0].id);
  const имя = await page.evaluate(() => window.__t.DATA.concepts[0].label);
  await page.evaluate(i => window.__t.openConceptById(i), id);
  await wait(1100);
  const о = await page.evaluate(() => ({
    видно: getComputedStyle(document.getElementById('universalModal')).display !== 'none',
    текст: (document.getElementById('universalModalContent').textContent || ''),
  }));
  проверить('окно концепции открылось', о.видно, true, о.видно);
  проверить('окно концепции называет свою концепцию',
    о.текст.includes(имя), 'содержит «' + имя + '»', о.текст.slice(0, 40).trim() + '…');
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(400);

  const ф = await page.evaluate(() => window.__t.DATA.philosophers[0].nameRu);
  await page.evaluate(p => window.__t.openUniversalModal('philosopher', p, 'view'), ф);
  await wait(1300);
  const оф = await page.evaluate(() =>
    (document.getElementById('universalModalContent').textContent || ''));
  проверить('окно философа называет своего философа',
    оф.includes(ф), 'содержит «' + ф + '»', оф.slice(0, 40).trim() + '…');
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(400);
}

// ── 7. поиск находит именно то, что искали ──────────────────────────
{
  const r = await page.evaluate(() => {
    window.__t.handleLegendSearch('иде');
    const узлы = [...document.querySelectorAll('#legendSearchResults .search-result-item')];
    return { сколько: узлы.length,
      мимо: узлы.filter(e => !e.textContent.toLowerCase().includes('иде')).length };
  });
  проверить('поиск в легенде что-то находит', r.сколько > 0, '>0', r.сколько);
  проверить('в найденном нет посторонних', r.мимо === 0, 0, r.мимо);
}

// ── 8. права: без входа правка недоступна, под admin доступна ───────
{
  await page.evaluate(() => window.__t.closeUniversalModal());
  const id = await page.evaluate(() => window.__t.DATA.concepts[0].id);
  await page.evaluate(i => window.__t.openConceptById(i), id);
  await wait(900);
  const без = await page.evaluate(() =>
    !!document.querySelector('#universalModal .modal-toolbar .modal-edit-btn, #universalModal .modal-toolbar button[title*="едакт"]'));
  проверить('без входа кнопки правки нет', без === false, false, без);
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);

  await page.evaluate(() => {
    window.__t.openAuthModal('login');
    document.getElementById('authLogin').value = 'admin';
    document.getElementById('authPassword').value = 'admin';
    window.__t.submitAuth();
  });
  await wait(900);
  await page.evaluate(() => window.__t.closeAuthModal());
  await wait(400);
  await page.evaluate(i => window.__t.openConceptById(i), id);
  await wait(900);
  const под = await page.evaluate(() =>
    (document.querySelector('#universalModal .modal-toolbar') || {}).innerHTML || '');
  проверить('под admin в полосе окна что-то появилось', под.length > 20, '>20 знаков', под.length);
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
}

// ── 9. правка доходит до данных ─────────────────────────────────────
{
  const id = await page.evaluate(() => window.__t.DATA.concepts[0].id);
  await page.evaluate(i => window.__t.openEditConceptModal(i), id);
  await wait(1300);
  await page.evaluate(() => {
    document.getElementById('conceptLabel').value = 'ПРОВЕРКА ВТОРОГО СЛОЯ';
    const b = [...document.querySelectorAll('#universalModal button')]
      .find(x => /Сохранить/.test(x.textContent));
    if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await wait(2000);
  const п = await page.evaluate(i => {
    const D = window.__t.DATA;
    const c = D.concepts.find(x => x.id === i), n = D.nodes.find(x => x.id === i);
    return { вБазе: c ? c.label : null, наГрафе: n ? n.label : null,
      несохранённое: window.__t.hasUnsaved(),
      наборов: Object.keys(window.__t.collectData()).length };
  }, id);
  проверить('правка записалась в базу', п.вБазе === 'ПРОВЕРКА ВТОРОГО СЛОЯ',
    'ПРОВЕРКА ВТОРОГО СЛОЯ', п.вБазе);
  проверить('правка дошла до узла графа', п.наГрафе === 'ПРОВЕРКА ВТОРОГО СЛОЯ',
    'ПРОВЕРКА ВТОРОГО СЛОЯ', п.наГрафе);
  проверить('база помечена несохранённой', п.несохранённое === true, true, п.несохранённое);
  проверить('сериализатор отдаёт шесть наборов', п.наборов === 6, 6, п.наборов);
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(400);
}

// ── 10. контраст подписей не ниже порога ───────────────────────────
{
  const плохие = await page.evaluate(порог => {
    const яркость = c => {
      const m = c.match(/[\d.]+/g).map(Number);
      const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]);
    };
    const фон = el => {
      let e = el;
      while (e) {
        const c = getComputedStyle(e).backgroundColor;
        const m = c.match(/[\d.]+/g);
        if (m && (m.length < 4 || Number(m[3]) > 0.5)) return c;
        e = e.parentElement;
      }
      return 'rgb(0,0,0)';
    };
    const плохо = [];
    for (const el of document.querySelectorAll('#legend *, #controls *, #pathFinder *')) {
      const t = [...el.childNodes].filter(n => n.nodeType === 3)
        .map(n => n.textContent.trim()).join('');
      if (!t) continue;
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) continue;
      const a = яркость(s.color), b = яркость(фон(el));
      const k = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      if (k < порог) плохо.push(t.slice(0, 30) + ' — ' + k.toFixed(2));
    }
    return плохо;
  }, ЖДЁМ.порогКонтраста);
  проверить(`контраст подписей не ниже ${ЖДЁМ.порогКонтраста}`,
    плохие.length === 0, 0, плохие.length + (плохие[0] ? ' (' + плохие[0] + ')' : ''));
}

// ── 11. страница не ругалась ────────────────────────────────────────
проверить('ошибок страницы нет', ошибки.length === 0, 0,
  ошибки.length + (ошибки[0] ? ' (' + ошибки[0].slice(0, 60) + ')' : ''));

await page.close(); await browser.close();

const плохо = проверки.filter(п => !п.годно);
for (const п of проверки)
  console.log(`${п.годно ? '✓' : '✗'} ${п.имя}: ждали ${п.ждали}, вышло ${п.вышло}`);
console.log(`\nутверждений ${проверки.length}, не сошлось ${плохо.length}`);
process.exit(плохо.length ? 1 : 0);
