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

await page.goto(BASE + СТРАНИЦА, { waitUntil: 'domcontentloaded', timeout: 60000 });
// Ждём не «сеть утихла», а разметку плюс паузу: с ростом дерева (сто с
// лишним модулей) простой сети не наступал вовсе, и приборы падали по
// времени при сервере, отвечающем 200 на каждый запрос.
await wait(6500);

const модуль = !СТРАНИЦА.startsWith('_ref');
await page.addScriptTag(модуль
  ? { type: 'module', content: `
      // ПУТЕЙ К МОДУЛЯМ ЗДЕСЬ БОЛЬШЕ НЕТ. Оснастка _probe-rig.js порождается
      // из дерева и потому знает, где что лежит, а прибор — нет и знать не
      // должен: раскладка меняется, и всякий зашитый путь становится миной.
      import './_probe-rig.js';
      window.__t = window.__app;
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
    источник: document.querySelectorAll('#sourceSelectDropdown .concept-row').length,
    цель: document.querySelectorAll('#targetSelectDropdown .concept-row').length,
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
    const узлы = [...document.querySelectorAll('#legendSearchResults .concept-row')];
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

// ── 9б. визуализация метрики размером: кнопка сброса в легенде ──────
{
  // Тонкое место, дважды ломавшееся: раздел легенды обновлялся ДО смены
  // признаков, а данные метрики брались ПОСЛЕ закрытия окна статистики —
  // которое эти данные и стирает. Утверждение держит оба конца: включили —
  // раздел виден и назван; сбросили — исчез.
  await page.evaluate(() => window.__t.openStatsModal());
  await wait(1000);
  await page.evaluate(() => window.__t.switchStatsView('pagerank'));
  await wait(2000);
  await page.evaluate(() => {
    const b = document.querySelector('#statsContentArea button');
    if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await wait(3000);
  const естьКнопка = await page.evaluate(() =>
    document.querySelectorAll('#statsContentArea [id^="visualize-btn-"]').length);
  проверить('вид метрики даёт кнопку визуализации', естьКнопка === 1, 1, естьКнопка);

  await page.evaluate(() => {
    const b = document.querySelector('#statsContentArea [id^="visualize-btn-"]');
    if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await wait(1800);
  const после = await page.evaluate(() => {
    const s = document.getElementById('visualizationControlSection');
    return { виден: !!s && getComputedStyle(s).display !== 'none',
      метка: ((document.getElementById('currentVisualizationMetric') || {}).textContent || '').trim(),
      окно: getComputedStyle(document.getElementById('statsModal')).display };
  });
  проверить('после визуализации: окно статистики закрылось', после.окно === 'none', 'none', после.окно);
  проверить('после визуализации: раздел сброса в легенде виден', после.виден, true, после.виден);
  проверить('после визуализации: названа метрика', после.метка === 'PageRank', 'PageRank', после.метка);

  await page.evaluate(() => {
    const b = document.querySelector('#visualizationControlSection button');
    if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await wait(1200);
  const снят = await page.evaluate(() => {
    const s = document.getElementById('visualizationControlSection');
    return !s || getComputedStyle(s).display === 'none';
  });
  проверить('после сброса: раздел скрыт', снят, true, снят);
}

// ── 9в. приглушение: щелчок и карта сходства ────────────────────────
{
  // Два выделения устроены РАЗНО, и это намеренно. Щелчок говорит «вот
  // соседи по связям» — там гаснут несмежные связи (класс dimmed). Карта
  // сходства говорит «вот похожие по смыслу» — там гаснут непохожие узлы,
  // а связи гаснут ВСЕ: приглушать их по сходству нечем, у связи такого
  // значения нет. Замер держит оба конца, чтобы они не разъехались.
  const мера = () => page.evaluate(() => {
    const св = {};
    for (const l of window.__t.DATA.links) {
      const a = window.__t.linkDrawAlpha(l, window.__t.linkVisualState(l), 0).toFixed(2);
      св[a] = (св[a] || 0) + 1;
    }
    return { связей: window.__t.DATA.links.length, прозрачность: св,
      карта: !!window.__t.S.similarityOverlay };
  });

  const исходно = await мера();
  проверить('исходно все связи в полную силу',
    исходно.прозрачность['0.40'] === исходно.связей, исходно.связей, исходно.прозрачность['0.40']);

  const id = await page.evaluate(() => window.__t.DATA.nodes[5].id);
  await page.evaluate(i => {
    const n = window.__t.DATA.nodes.find(x => x.id === i);
    window.__t.highlightConnected([n]);
  }, id);
  await wait(700);
  const щелчок = await мера();
  проверить('щелчок по узлу гасит несмежные связи',
    (щелчок.прозрачность['0.10'] || 0) > 1000, '>1000', щелчок.прозрачность['0.10'] || 0);
  проверить('щелчок оставляет смежные яркими',
    (щелчок.прозрачность['1.00'] || 0) > 0, '>0', щелчок.прозрачность['1.00'] || 0);
  await page.evaluate(() => window.__t.resetHighlight());
  await wait(500);

  await page.evaluate(i => window.__t.showSimilarityOverlay(i, 'profile'), id);
  await wait(2500);
  const карта = await мера();
  проверить('карта сходства включилась', карта.карта, true, карта.карта);
  проверить('при карте сходства гаснут ВСЕ обычные связи',
    (карта.прозрачность['0.07'] || 0) === карта.связей, карта.связей, карта.прозрачность['0.07'] || 0);
  await page.evaluate(() => window.__t.clearSimilarityOverlay());
  await wait(600);
  const после = await мера();
  проверить('после снятия карты связи вернулись',
    после.прозрачность['0.40'] === после.связей, после.связей, после.прозрачность['0.40']);
}

// ── 9г. стрелка связи: ровно ОДНА подсказка ────────────────────────
{
  // Было две разом: собственный тёмный ярлык и встроенная подсказка браузера
  // (title) — светлая, с тёмным текстом. Плюс жирность ярлыка гуляла: cw-1/2/3
  // задавали вес шрифта на самой стрелке, а ярлык лежал внутри и наследовал.
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
  const ид = await page.evaluate(() => {
    const счёт = {};
    for (const l of window.__t.DATA.links) {
      const a = l.source.id || l.source;
      счёт[a] = (счёт[a] || 0) + 1;
    }
    return Object.entries(счёт).sort((x, y) => y[1] - x[1])[0][0];
  });
  await page.evaluate(i => window.__t.openConceptById(i), ид);
  await wait(1200);
  const с = await page.evaluate(() => {
    const стрелки = [...document.querySelectorAll('#universalModalContent .connection-arrow')];
    return {
      стрелок: стрелки.length,
      встроенных: стрелки.filter(e => e.getAttribute('title')).length,
      своих: стрелки.map(e => e.querySelectorAll('.connection-arrow-tooltip').length),
      весаЯрлыков: [...new Set(стрелки.map(e => {
        const t = e.querySelector('.connection-arrow-tooltip');
        return t ? getComputedStyle(t).fontWeight : '—';
      }))],
      фоны: [...new Set(стрелки.map(e => {
        const t = e.querySelector('.connection-arrow-tooltip');
        return t ? getComputedStyle(t).backgroundColor : '—';
      }))],
      весаГлифов: [...new Set(стрелки.map(e => {
        const g = e.querySelector('.connection-arrow-glyph');
        return g ? getComputedStyle(g).fontWeight : '—';
      }))],
    };
  });
  проверить('стрелки связей есть', с.стрелок > 0, '>0', с.стрелок);
  проверить('встроенных подсказок браузера нет', с.встроенных === 0, 0, с.встроенных);
  проверить('вес связи по-прежнему виден в глифе',
    с.весаГлифов.length > 1, '>1 разных', с.весаГлифов.join(','));

  // ЕДИНАЯ ПОДСКАЗКА. Было три способа разом: встроенные подсказки браузера
  // (светлые, вида страница не задаёт), свой ярлык у стрелки связи и такой
  // же у рубрики; на стрелке всплывали обе. Теперь один короб на странице.
  const встроенныхВсего = await page.evaluate(() => document.querySelectorAll('[title]').length);
  const своихЯрлыков = await page.evaluate(() =>
    document.querySelectorAll('.connection-arrow-tooltip, .rubric-tooltip-text').length);
  const сЕдиной = await page.evaluate(() => document.querySelectorAll('[data-tip]').length);
  проверить('на странице нет встроенных подсказок', встроенныхВсего === 0, 0, встроенныхВсего);
  проверить('старых ярлыков не осталось', своихЯрлыков === 0, 0, своихЯрлыков);
  проверить('единая подсказка расставлена', сЕдиной > 100, '>100', сЕдиной);

  const короб = await page.evaluate(() => {
    const эл = document.querySelector('#universalModalContent .connection-arrow[data-tip]')
      || document.querySelector('[data-tip]');
    эл.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
    const h = document.getElementById('hintBox');
    if (!h) return { есть: false };
    const s = getComputedStyle(h);
    return { есть: true, виден: s.visibility !== 'hidden' && s.opacity !== '0',
      фон: s.backgroundColor, вес: s.fontWeight, перенос: s.whiteSpace, ширина: s.maxWidth,
      текст: h.textContent.length };
  });
  проверить('подсказка показывается', короб.есть && короб.виден, true, короб.виден);
  проверить('подсказка на тёмном фоне', короб.фон === 'rgba(0, 0, 0, 0.92)', 'rgba(0, 0, 0, 0.92)', короб.фон);
  проверить('вес шрифта подсказки один', короб.вес === '400', '400', короб.вес);
  проверить('длинный текст переносится', короб.перенос === 'normal', 'normal', короб.перенос);
  проверить('в подсказке есть текст', короб.текст > 0, '>0', короб.текст);
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
}

// ── 9д. стрелка связи — вход в окно связи ──────────────────────────
{
  // Прежде войти в окно связи можно было лишь с полотна да из формы правки
  // концепции: в списках связей сама связь была видна, а открыть её нечем —
  // щелчок по строке вёл к соседней КОНЦЕПЦИИ.
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
  const ид = await page.evaluate(() => {
    const c = {};
    for (const l of window.__t.DATA.links) { const a = l.source.id || l.source; c[a] = (c[a] || 0) + 1; }
    return Object.entries(c).sort((x, y) => y[1] - x[1])[0][0];
  });
  await page.evaluate(i => window.__t.openConceptById(i), ид);
  await wait(1200);
  const стрелок = await page.evaluate(() =>
    document.querySelectorAll('#universalModalContent .connection-arrow').length);
  const щёлк = await page.evaluate(() =>
    document.querySelectorAll('#universalModalContent .connection-arrow.clickable').length);
  проверить('в окне концепции есть стрелки связей', стрелок > 0, '>0', стрелок);
  проверить('все стрелки открывают связь', щёлк === стрелок, стрелок, щёлк);

  await page.evaluate(() => {
    const el = document.querySelector('#universalModalContent .connection-arrow.clickable');
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await wait(1200);
  const текст = await page.evaluate(() =>
    document.getElementById('universalModalContent').textContent);
  проверить('щелчок по стрелке открыл окно связи',
    текст.includes('Просмотр связи'), 'содержит «Просмотр связи»', текст.trim().slice(0, 30));
  проверить('в окне связи есть возврат назад',
    текст.includes('Назад'), 'содержит «Назад»', текст.includes('Назад'));
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
}

// ── 9е. окно пути: порядок «узел → связь → узел» ───────────────────
{
  // Прежде описание связи стояло НАД описанием её узла, а у исходного узла
  // своего блока не было вовсе — он ютился внутри первого отрезка, тогда как
  // конечный получал отдельный. Читалось как несимметричное.
  const ид = await page.evaluate(() => window.__t.DATA.nodes.map(n => n.id));
  await page.evaluate(i => window.__t.selectCustomOption('source', i), ид[0]);
  await page.evaluate(i => window.__t.selectCustomOption('target', i), ид[120]);
  await page.evaluate(() => {
    const c = document.getElementById('respectChronology');
    if (c) c.checked = false;
    window.__t.findAndShowPath();
  });
  await wait(2000);
  await page.evaluate(() => window.__t.showPathDescriptionsModal());
  await wait(1000);
  const п = await page.evaluate(() => {
    const c = document.getElementById('pathDescriptionsContent');
    const ряд = [...c.children]
      .filter(e => e.classList.contains('path-node-full-description')
                || e.classList.contains('path-description-item'))
      .map(e => e.classList.contains('path-node-full-description') ? 'узел' : 'связь');
    const первый = c.querySelector('.path-node-full-description h4');
    const узлы = [...c.querySelectorAll('.path-node-full-description h4')].map(h => h.textContent);
    return { ряд, первый: первый ? первый.textContent.split(':')[0] : '—',
      последний: узлы.length ? узлы[узлы.length - 1].split(':')[0] : '—' };
  });
  проверить('окно пути начинается с исходного узла',
    п.первый === 'Исходный узел', 'Исходный узел', п.первый);
  проверить('окно пути кончается конечным узлом',
    п.последний === 'Конечный узел', 'Конечный узел', п.последний);
  проверить('порядок чередуется узел → связь → узел',
    п.ряд.length > 2 && п.ряд.every((в, i) => в === (i % 2 ? 'связь' : 'узел')),
    'узел,связь,узел…', п.ряд.slice(0, 5).join(','));
  await page.evaluate(() => window.__t.closePathDescriptionsModal());
  // Возвращаем состояние: галочка хронологии нужна следующим утверждениям.
  // Проверки идут по одной странице и обязаны оставлять её как взяли.
  await page.evaluate(() => {
    const c = document.getElementById('respectChronology');
    if (c && !c.checked) { c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  await wait(400);
}

// ── 9ж. описания не вылезают за край поля ──────────────────────────
{
  // `width:100%` при боковых отступах даёт коробку ШИРЕ родителя на сумму
  // отступов (замер: 541 против 517) — описание вылезало за край.
  const ид = await page.evaluate(() => {
    let лучший = null, дл = 0;
    for (const r of window.__t.DATA.relations) {
      const d = (r.description || '').length;
      if (d > дл) { дл = d; лучший = r.source; }
    }
    return лучший;
  });
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
  await page.evaluate(i => window.__t.openConceptById(i), ид);
  await wait(1200);
  await page.evaluate(() =>
    document.querySelectorAll('.connection-description').forEach(e => e.classList.add('show')));
  await wait(500);
  const пере = await page.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll('#universalModalContent *')) {
      if (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1) {
        const s = getComputedStyle(el);
        if (s.overflowX === 'auto' || s.overflowX === 'scroll') continue;
        n++;
      }
    }
    return n;
  });
  проверить('в окне концепции ничто не вылезает за край', пере === 0, 0, пере);
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);
}

// ── 9з. режим «без разрывов»: время идёт в одну сторону ────────────
{
  // Прочие режимы проверяют РЕБРО — нет ли анахронизма в отдельной связи.
  // Ребро может быть безупречным, а путь ломаным: −428 → 1788 → 121, и
  // каждый шаг законен (замер: разрыв в 82 % путей, прыжок до 2496 лет).
  // Здесь проверяется ПУТЬ. Ход выбирается по концам: цель раньше источника
  // — ищем ход назад, и путь читается как родословная «восходит к».
  // Считаем В СТРАНИЦЕ: годы живут в её данных, а не здесь.
  const монотонен = (путь, ход) => page.evaluate(([п, х]) => {
    let край = null, ломано = false;
    for (const id of п) {
      const n = window.__t.DATA.nodes.find(x => x.id === id);
      const ф = n && window.__t.DATA.philosophers.find(y => y.nameRu === n.concept);
      const г = ф ? ф.birth : null;
      if (г === null) continue;
      if (край !== null && (х > 0 ? г < край : г > край)) ломано = true;
      край = край === null ? г : (х > 0 ? Math.max(край, г) : Math.min(край, г));
    }
    return !ломано;
  }, [путь, ход]);
  const прогнать = (a, b, режим) => page.evaluate(([и, ц, р]) => {
    window.__t.S.currentChronologyMode = р;
    const путь = window.__t.findShortestPath(и, ц, true, true);
    window.__t.S.currentChronologyMode = 'strict';
    return путь;
  }, [a, b, режим]);

  const строгий = await прогнать('eidos', 'logos_marcus', 'strict');
  проверить('строгий режим путь находит', !!строгий && строгий.length > 1, true, !!строгий);
  const строгийЛоман = строгий ? !(await монотонен(строгий, +1)) : false;
  проверить('строгий режим ДОПУСКАЕТ разрыв хронологии', строгийЛоман, true, строгийЛоман);

  const вперёд = await прогнать('eidos', 'logos_marcus', 'seamless');
  проверить('без разрывов: путь вперёд найден', !!вперёд && вперёд.length > 1, true, !!вперёд);
  const вперёдМоно = вперёд ? await монотонен(вперёд, +1) : false;
  проверить('без разрывов: путь вперёд монотонен', вперёдМоно, true, вперёдМоно);

  const назад = await прогнать('logos_marcus', 'eidos', 'seamless');
  проверить('без разрывов: обратный путь найден', !!назад && назад.length > 1, true, !!назад);
  const назадМоно = назад ? await монотонен(назад, -1) : false;
  проверить('без разрывов: обратный путь монотонен назад', назадМоно, true, назадМоно);
}

// ── 9и. шапка пути показывает ХОД времени, а не только концы ───────
{
  // Прежде писалось «428-348 до н.э. → 121-180», и путь, ушедший в 1788 год
  // и вернувшийся в 121-й, выглядел безупречно: прыжок прятался между
  // концами. Годы у каждого узла загромоздили бы цепочку — они собраны в
  // одну строку, подряд идущие повторы слиты.
  const шапка = async (режим) => {
    await page.evaluate(() => {
      const c = document.getElementById('respectChronology');
      if (c && !c.checked) { c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); }
    });
    await page.evaluate(р => {
      const e = document.getElementById('chronologyModeSelect');
      e.value = р;
      e.dispatchEvent(new Event('change', { bubbles: true }));
    }, режим);
    await page.evaluate(i => window.__t.selectCustomOption('source', i), 'eidos');
    await page.evaluate(i => window.__t.selectCustomOption('target', i), 'logos_marcus');
    await page.evaluate(() => window.__t.findAndShowPath());
    await wait(2200);
    return page.evaluate(() => {
      const т = document.getElementById('pathResult').textContent.replace(/\s+/g, ' ');
      const i = т.indexOf('Ход времени');
      return i < 0 ? '' : т.slice(i, i + 120);
    });
  };
  const строгая = await шапка('strict');
  проверить('шапка называет ход времени', строгая.startsWith('Ход времени'),
    'начинается с «Ход времени»', строгая.slice(0, 24));
  проверить('в строгом режиме разрыв назван',
    /разрывов: \d/.test(строгая), 'есть «разрывов: N»', строгая.slice(0, 70));
  проверить('промежуточный год виден, а не только концы',
    строгая.includes('1788'), 'содержит 1788', строгая.slice(0, 60));

  const без = await шапка('seamless');
  проверить('без разрывов: в шапке нет счётчика разрывов',
    !/разрывов: \d/.test(без), 'нет «разрывов»', без.slice(0, 70));
  await page.evaluate(() => {
    const e = document.getElementById('chronologyModeSelect');
    e.value = 'strict';
    e.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

// ── 9к. панель контроля: значки, подсказки, место, справка ─────────
{
  // Панель стояла слева внизу и перекрывалась легендой. После сжатия
  // подписей до значков она уместилась справа внизу — на месте плашки
  // подсказок, которую заменило окно «О проекте».
  const п = await page.evaluate(() => {
    const c = document.getElementById('controls'), l = document.getElementById('legend');
    const rc = c.getBoundingClientRect(), rl = l.getBoundingClientRect();
    const кнопки = [...c.querySelectorAll('button')];
    return {
      справа: Math.round(window.innerWidth - rc.right),
      снизу: Math.round(window.innerHeight - rc.bottom),
      ширина: Math.round(rc.width),
      перекрывает: !(rc.right < rl.left || rc.left > rl.right
                  || rc.bottom < rl.top || rc.top > rl.bottom),
      кнопок: кнопки.length,
      безПодсказки: кнопки.filter(x => !x.getAttribute('data-tip')).length,
      сПодписью: кнопки.filter(x => /[A-Za-zА-Яа-я]/.test(x.textContent)).map(x => x.textContent.trim()),
      плашка: !!document.getElementById('info'),
    };
  });
  проверить('панель контроля стоит справа внизу',
    п.справа <= 24 && п.снизу <= 24, '≤24 и ≤24', п.справа + ' и ' + п.снизу);
  проверить('панель не перекрывает легенду', п.перекрывает === false, false, п.перекрывает);
  проверить('панель узкая', п.ширина <= 380, '≤380', п.ширина);
  проверить('у каждой кнопки панели есть подсказка', п.безПодсказки === 0, 0, п.безПодсказки);
  проверить('подписи остались только у PNG, SVG и JSON',
    п.сПодписью.length === 3 && п.сПодписью.every(t => /PNG|SVG|JSON/.test(t)),
    'PNG, SVG, JSON', п.сПодписью.join(' / '));
  проверить('плашка подсказок убрана', п.плашка === false, false, п.плашка);

  await page.evaluate(() => window.__t.openAboutModal());
  await wait(600);
  const о = await page.evaluate(() => {
    const t = document.getElementById('aboutContent').textContent;
    return {
      открыто: document.getElementById('aboutModal').classList.contains('show'),
      разделов: document.querySelectorAll('#aboutContent h3').length,
      числаИзДанных: ['453', '1624', '57'].every(n => t.includes(n)),
      проПравку: /едактир/.test(t),
      знаков: t.length,
    };
  });
  проверить('окно «О проекте» открывается', о.открыто, true, о.открыто);
  проверить('в нём есть разделы управления', о.разделов >= 5, '≥5', о.разделов);
  проверить('числа взяты из данных', о.числаИзДанных, true, о.числаИзДанных);
  проверить('о правке в окне не говорится', о.проПравку === false, false, о.проПравку);
  await page.evaluate(() => window.__t.closeAboutModal());
  await wait(300);
}

// ── 9л. четыре замечания по панели и подсказке ─────────────────────
{
  // 1. Кнопки не отращивают подписи. Заморозка и группировка переписывали
  //    себе текст при нажатии, и панель на глазах раздувалась.
  const подписи = () => page.evaluate(() =>
    [...document.querySelectorAll('#controls button')]
      .map(x => x.textContent.trim()).filter(t => /[A-Za-zА-Яа-я]/.test(t)));
  const до = await подписи();
  await page.evaluate(() => {
    document.getElementById('freezeBtn').click();
    document.getElementById('groupBtn').click();
  });
  await wait(900);
  const после = await подписи();
  проверить('нажатия не добавляют подписей на кнопки',
    после.join('|') === до.join('|'), до.join('|'), после.join('|'));
  await page.evaluate(() => {
    document.getElementById('freezeBtn').click();
    document.getElementById('groupBtn').click();
  });
  await wait(600);

  // 2. Подсказка поверх ВСЕГО: панель при наведении поднимается до 9999,
  //    окно правки до 10001 — подсказка пряталась под тем, к чему относится.
  const п = await page.evaluate(() => {
    document.getElementById('freezeBtn')
      .dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
    const h = document.getElementById('hintBox');
    const s = getComputedStyle(h);
    const слои = [...document.querySelectorAll('*')]
      .map(e => Number(getComputedStyle(e).zIndex))
      .filter(z => Number.isFinite(z));
    return { слой: Number(s.zIndex), наибольшийПрочий: Math.max(...слои.filter(z => z < 100000)),
      сквозной: s.pointerEvents };
  });
  проверить('подсказка выше любого другого слоя',
    п.слой > п.наибольшийПрочий, '> ' + п.наибольшийПрочий, п.слой);
  проверить('подсказка не перехватывает мышь', п.сквозной === 'none', 'none', п.сквозной);

  // 3. Выпадающие списки рисуются в тёмной коже: их рисует не страница,
  //    а система, и без объявления схемы список оставался белым.
  const в = await page.evaluate(() => ({
    схема: getComputedStyle(document.documentElement).colorScheme,
    фонПункта: getComputedStyle(document.querySelector('#chronologyModeSelect option')).backgroundColor,
  }));
  проверить('странице объявлена тёмная кожа', в.схема === 'dark', 'dark', в.схема);
  проверить('пункты списка тёмные',
    в.фонПункта === 'rgb(20, 18, 28)', 'rgb(20, 18, 28)', в.фонПункта);
}

// ── 9м. окно описаний пути не теряет блоки при ходе против стрелки ──
{
  // В режиме без разрывов путь идёт по годам, и ребро сплошь и рядом
  // пройдено против своей стрелки. Разбор рёбер об этом не знал и возвращал
  // null — в окне описаний оставался ОДИН исходный узел.
  await page.evaluate(() => {
    const e = document.getElementById('chronologyModeSelect');
    e.value = 'seamless';
    e.dispatchEvent(new Event('change', { bubbles: true }));
    const c = document.getElementById('respectChronology');
    if (c && !c.checked) { c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  await page.evaluate(i => window.__t.selectCustomOption('source', i), 'intentionality_brentano');
  await page.evaluate(i => window.__t.selectCustomOption('target', i), 'one_being');
  await page.evaluate(() => window.__t.findAndShowPath());
  await wait(2400);
  await page.evaluate(() => window.__t.showPathDescriptionsModal());
  await wait(1100);
  const о = await page.evaluate(() => {
    const c = document.getElementById('pathDescriptionsContent');
    return {
      узлов: c.querySelectorAll('.path-node-full-description').length,
      связей: c.querySelectorAll('.path-description-item').length,
      узловВПути: document.querySelectorAll('#pathResult .path-node').length,
    };
  });
  проверить('в окне описаний столько же узлов, сколько в пути',
    о.узлов === о.узловВПути, о.узловВПути, о.узлов);
  проверить('связей на одну меньше, чем узлов',
    о.связей === о.узлов - 1, о.узлов - 1, о.связей);
  await page.evaluate(() => window.__t.closePathDescriptionsModal());
  await page.evaluate(() => {
    const e = document.getElementById('chronologyModeSelect');
    e.value = 'strict';
    e.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await wait(400);
}

// ── 9н. поиск: многословный запрос, поиск философов, скрытые отбором ──
{
  // МНОГОСЛОВНЫЙ ЗАПРОС. Прежде запрос сравнивался ЦЕЛИКОМ с началом каждого
  // отдельного слова, и «миф о пещере» не находил ничего. Изъян был и в
  // нетронутом исходнике — проверено.
  const найдено = (q) => page.evaluate(з => {
    window.__t.handleLegendSearch(з);
    return document.querySelectorAll('#legendSearchResults .concept-row').length;
  }, q);
  проверить('многословный запрос находит', await найдено('миф о пещере') > 0, '>0',
    await найдено('миф о пещере'));
  проверить('порядок слов в запросе не важен', await найдено('пещере миф') > 0, '>0',
    await найдено('пещере миф'));

  // СКРЫТАЯ ОТБОРОМ. Два правила спорили молча: подсветка считала узел
  // участником, отрисовка его не рисовала — соседи загорались вокруг пустого
  // места. Теперь строка помечена, а выбор показывает концепцию поверх отбора.
  await page.evaluate(() => window.__t.togglePhilosopher('Платон'));
  await wait(1400);
  const п = await page.evaluate(() => {
    window.__t.handleLegendSearch('миф о пещере');
    const r = document.querySelector('#legendSearchResults .concept-row');
    return { помечена: !!r && r.classList.contains('hidden-by-filter'),
      приписка: r ? (r.querySelector('.concept-row-note') || {}).textContent : null };
  });
  проверить('скрытая отбором помечена в списке', п.помечена, true, п.помечена);
  проверить('пометка названа словами', п.приписка === 'скрыта отбором',
    'скрыта отбором', п.приписка);

  await page.evaluate(() => {
    const n = window.__t.DATA.nodes.find(x => x.label === 'Миф о пещере');
    window.__t.selectSearchResult(n.id, 'legend');
  });
  await wait(1500);
  const в = await page.evaluate(() => {
    const n = window.__t.DATA.nodes.find(x => x.label === 'Миф о пещере');
    const s = document.getElementById('beyondFilterSection');
    return { видима: window.__t.isNodeVisible(n),
      раздел: !!s && getComputedStyle(s).display !== 'none',
      счёт: (document.getElementById('beyondFilterCount') || {}).textContent };
  });
  проверить('выбранная скрытая концепция показана', в.видима, true, в.видима);
  проверить('в легенде появился раздел о показе поверх отбора', в.раздел, true, в.раздел);
  проверить('раздел считает показанные', в.счёт === '1', '1', в.счёт);

  await page.evaluate(() => window.__t.resetBeyondFilter());
  await wait(1200);
  const с = await page.evaluate(() => {
    const n = window.__t.DATA.nodes.find(x => x.label === 'Миф о пещере');
    const s = document.getElementById('beyondFilterSection');
    return { видима: window.__t.isNodeVisible(n),
      раздел: !!s && getComputedStyle(s).display !== 'none' };
  });
  проверить('возврат отбора снова прячет концепцию', с.видима === false, false, с.видима);
  проверить('раздел исчезает вместе с показанными', с.раздел === false, false, с.раздел);
  await page.evaluate(() => window.__t.togglePhilosopher('Платон'));
  await wait(1200);

  // ПОИСК ФИЛОСОФОВ В ОКНЕ ФИЛОСОФА — устроен как поиск концепций.
  await page.evaluate(() => window.__t.openUniversalModal('philosopher', 'Платон', 'view'));
  await wait(1200);
  const ф = await page.evaluate(() => {
    window.__t.handlePhilosopherSearch('арист');
    const rs = [...document.querySelectorAll('#philSearchResults .concept-row')];
    return { строк: rs.length,
      кружок: rs[0] ? !!rs[0].querySelector('.concept-row-color') : false,
      текст: rs[0] ? rs[0].textContent.replace(/\s+/g, ' ').trim() : '' };
  });
  проверить('поиск философов находит', ф.строк > 0, '>0', ф.строк);
  проверить('у строки философа есть кружок цвета', ф.кружок, true, ф.кружок);
  проверить('строка называет годы и число концепций',
    /\d+.*·.*концепций \d+/.test(ф.текст), 'годы · концепций N', ф.текст.slice(0, 46));
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(400);
}

// ── 9о. поиск в легенде по трём сущностям ──────────────────────────
{
  // Поле прежде висело всегда и искало только концепции. Теперь оно
  // раскрывается кнопкой, а внутри три вида: философ, концепция, связь.
  const скрыт = await page.evaluate(() =>
    getComputedStyle(document.getElementById('searchBody')).display === 'none');
  проверить('поиск в легенде свёрнут по умолчанию', скрыт, true, скрыт);

  await page.evaluate(() => window.__t.toggleLegendSearch());
  await wait(500);
  const р = await page.evaluate(() => ({
    видно: getComputedStyle(document.getElementById('searchBody')).display !== 'none',
    вид: ([...document.querySelectorAll('.search-kind')]
      .find(b => b.classList.contains('active')) || {}).textContent.trim(),
    концепция: getComputedStyle(document.getElementById('rowConcept')).display !== 'none',
    философ: getComputedStyle(document.getElementById('rowPhilosopher')).display !== 'none',
    связь: getComputedStyle(document.getElementById('rowConnection')).display !== 'none',
  }));
  проверить('раскрывается кнопкой', р.видно, true, р.видно);
  проверить('по умолчанию ищет концепции', р.вид === 'Концепция', 'Концепция', р.вид);
  проверить('видна только строка концепции',
    р.концепция && !р.философ && !р.связь, 'только концепция',
    `${р.концепция}/${р.философ}/${р.связь}`);

  // СВЯЗЬ — две строки, как в окне связи; выбор подсвечивает её на графе.
  await page.evaluate(() => window.__t.setSearchKind('connection'));
  await wait(400);
  const строк = await page.evaluate(() =>
    document.querySelectorAll('#rowConnection input').length);
  проверить('у поиска связи две строки', строк === 2, 2, строк);

  const пара = await page.evaluate(() => {
    const l = window.__t.DATA.links[0];
    return [l.source.id || l.source, l.target.id || l.target];
  });
  await page.evaluate(([a]) => window.__t.pickLinkEnd('from', a), пара);
  await page.evaluate(([, c]) => window.__t.pickLinkEnd('to', c), пара);
  await wait(700);
  const найдено = await page.evaluate(() =>
    document.querySelectorAll('#legendLinkFound .concept-row').length);
  проверить('связь между двумя концами найдена', найдено > 0, '>0', найдено);

  await page.evaluate(() => {
    document.querySelector('#legendLinkFound .concept-row')
      .dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });
  await wait(1200);
  const св = await page.evaluate(() => {
    const по = {};
    for (const l of window.__t.DATA.links) {
      const s = window.__t.linkVisualState(l);
      по[s] = (по[s] || 0) + 1;
    }
    return по;
  });
  проверить('выбранная связь выделена на графе', (св.selected || 0) === 1, 1, св.selected || 0);
  проверить('прочие связи приглушены', (св.dimmed || 0) > 1000, '>1000', св.dimmed || 0);

  // ФИЛОСОФ — три уровня, которые в отрисовке уже есть: его связи
  // подсвечены (1,0), внешние обычные (0,4), прочие приглушены (0,1).
  await page.evaluate(() => window.__t.setSearchKind('philosopher'));
  await page.evaluate(() => window.__t.highlightPhilosopherOnGraph('Платон'));
  await wait(1000);
  const ф = await page.evaluate(() => {
    const по = {};
    for (const l of window.__t.DATA.links) {
      const s = window.__t.linkVisualState(l);
      по[s] = (по[s] || 0) + 1;
    }
    return по;
  });
  проверить('внутренние связи философа подсвечены',
    (ф.highlighted || 0) > 0, '>0', ф.highlighted || 0);
  проверить('внешние связи остаются обычными', (ф.normal || 0) > 0, '>0', ф.normal || 0);
  проверить('посторонние связи приглушены', (ф.dimmed || 0) > 1000, '>1000', ф.dimmed || 0);
  проверить('три уровня различны',
    new Set([ф.highlighted, ф.normal, ф.dimmed]).size === 3, '3 разных',
    [ф.highlighted, ф.normal, ф.dimmed].join('/'));

  await page.evaluate(() => window.__t.toggleLegendSearch());
  await wait(400);
}

// ── 9п. три уровня у КОНЦЕПЦИЙ и связи скрытой отбором ─────────────
{
  // У концепций ЧЕТЫРЕ состояния: выбранная (жёлтый ободок, толщина 6),
  // подсвеченная (белый 5 со свечением), обычная (белый 3), приглушённая
  // (0,2). Жёлтый оставлен ТОЛЬКО за явным выбором. При выборе философа его
  // концепции берут подсвеченное состояние, соседи по внешним связям —
  // обычное: прежде они гасли, и связи к ним выглядели «в никуда».
  const состояния = () => page.evaluate(() => {
    const у = { подсвечено: 0, обычные: 0, приглушено: 0 };
    for (const n of window.__t.DATA.nodes) {
      if (window.__t.hasNodeClass('highlighted', n)) у.подсвечено++;
      else if (window.__t.hasNodeClass('dimmed', n)) у.приглушено++;
      else у.обычные++;
    }
    return у;
  });
  await page.evaluate(() => window.__t.highlightPhilosopherOnGraph('Платон'));
  await wait(900);
  const один = await состояния();
  проверить('концепции философа подсвечены', один.подсвечено > 0, '>0', один.подсвечено);
  проверить('соседи по внешним связям НЕ гаснут', один.обычные > 0, '>0', один.обычные);
  проверить('прочие концепции приглушены', один.приглушено > 100, '>100', один.приглушено);

  // CTRL добавляет философа к выбору, как на полотне добавляются узлы.
  await page.evaluate(() => window.__t.highlightPhilosopherOnGraph('Аристотель', true));
  await wait(900);
  const двое = await состояния();
  проверить('ctrl добавляет второго философа',
    двое.подсвечено > один.подсвечено, '>' + один.подсвечено, двое.подсвечено);
  проверить('соседей стало больше', двое.обычные > один.обычные, '>' + один.обычные, двое.обычные);

  // СВЯЗИ показанной вопреки отбору концепции. Прежде она висела в пустоте:
  // отбор для узла отменён, а связи оставались скрытыми.
  await page.evaluate(() => window.__t.highlightPhilosopherOnGraph('Платон'));
  await page.evaluate(() => window.__t.togglePhilosopher('Платон'));
  await wait(1400);
  await page.evaluate(() => {
    window.__t.handleLegendSearch('миф о пещере');
    const n = window.__t.DATA.nodes.find(x => x.label === 'Миф о пещере');
    window.__t.selectSearchResult(n.id, 'legend');
  });
  await wait(1500);
  const св = await page.evaluate(() => {
    const n = window.__t.DATA.nodes.find(x => x.label === 'Миф о пещере');
    const свои = window.__t.DATA.links.filter(l => {
      const a = l.source.id || l.source, b = l.target.id || l.target;
      return a === n.id || b === n.id;
    });
    return { видима: window.__t.isNodeVisible(n), всего: свои.length,
      видимых: свои.filter(l => window.__t.isLinkVisible(l)).length };
  });
  проверить('показанная вопреки отбору видима', св.видима, true, св.видима);
  проверить('её связи к видимым соседям тоже видны',
    св.видимых > 0, '>0', св.видимых + ' из ' + св.всего);

  await page.evaluate(() => window.__t.resetBeyondFilter());
  await page.evaluate(() => window.__t.togglePhilosopher('Платон'));
  await wait(1200);
}

// ── 9р. легенда, окно справки, традиции, описания пути ─────────────
{
  // ЛЕГЕНДА во всю высоту окна: было 85vh, и при 1080 точках внизу
  // пропадало 80 — при содержимом в 3200 точек это просто терянная высота.
  const л = await page.evaluate(() => {
    const r = document.getElementById('legend').getBoundingClientRect();
    return { верх: Math.round(r.top), низ: Math.round(window.innerHeight - r.bottom) };
  });
  проверить('легенда отступает сверху и снизу одинаково',
    Math.abs(л.верх - л.низ) <= 2, 'разница ≤2', Math.abs(л.верх - л.низ));
  проверить('легенда не вылезает за нижний край', л.низ >= 0, '≥0', л.низ);

  // ОКНО СПРАВКИ закрывается наравне с прочими.
  await page.evaluate(() => window.__t.openAboutModal());
  await wait(500);
  await page.keyboard.press('Escape');
  await wait(500);
  const поEsc = await page.evaluate(() =>
    document.getElementById('aboutModal').classList.contains('show'));
  проверить('окно справки закрывается по Esc', поEsc === false, false, поEsc);

  await page.evaluate(() => window.__t.openAboutModal());
  await wait(400);
  await page.evaluate(() => document.getElementById('aboutModal')
    .dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })));
  await wait(400);
  const поЩелчку = await page.evaluate(() =>
    document.getElementById('aboutModal').classList.contains('show'));
  проверить('окно справки закрывается щелчком мимо', поЩелчку === false, false, поЩелчку);

  // РАЗДЕЛ ТРАДИЦИЙ в окне философа — по образцу рубрик в окне концепции.
  await page.evaluate(() => window.__t.openUniversalModal('philosopher', 'Платон', 'view'));
  await wait(1200);
  const т = await page.evaluate(() => {
    const t = document.getElementById('universalModalContent').textContent;
    const разделов = [...document.querySelectorAll('#universalModalContent .rubric-title')]
      .filter(e => e.textContent.includes('Традиция')).length;
    return { разделов, естьПеречень: /Также в этой традиции/.test(t) };
  });
  проверить('в окне философа есть раздел традиций', т.разделов > 0, '>0', т.разделов);
  проверить('в разделе перечислены философы традиции',
    т.естьПеречень, true, т.естьПеречень);
  await page.evaluate(() => window.__t.closeUniversalModal());
  await wait(300);

  // ОПИСАНИЯ ПУТИ: плашка философа, вес связи, нажимаемые заголовки.
  await page.evaluate(() => {
    const c = document.getElementById('respectChronology');
    if (c && !c.checked) { c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  const ид = await page.evaluate(() => window.__t.DATA.nodes.map(n => n.id));
  await page.evaluate(i => window.__t.selectCustomOption('source', i), ид[0]);
  await page.evaluate(i => window.__t.selectCustomOption('target', i), ид[120]);
  await page.evaluate(() => window.__t.findAndShowPath());
  await wait(2400);
  await page.evaluate(() => window.__t.showPathDescriptionsModal());
  await wait(1100);
  const о = await page.evaluate(() => {
    const c = document.getElementById('pathDescriptionsContent');
    return {
      плашек: c.querySelectorAll('.philosopher-tag').length,
      узлов: c.querySelectorAll('.path-node-full-description').length,
      нажимаемых: c.querySelectorAll('.path-open').length,
      весНазван: /вес \d+ —/.test(c.textContent),
      естьФилософСтрокой: /Философ:/.test(c.textContent),
    };
  });
  проверить('у каждого узла плашка философа', о.плашек === о.узлов, о.узлов, о.плашек);
  проверить('строка «Философ:» убрана', о.естьФилософСтрокой === false, false, о.естьФилософСтрокой);
  проверить('вес связи назван', о.весНазван, true, о.весНазван);
  проверить('заголовки нажимаемы', о.нажимаемых >= о.узлов, '≥' + о.узлов, о.нажимаемых);
  await page.evaluate(() => window.__t.closePathDescriptionsModal());
  await wait(400);

  // ПАНЕЛЬ ПУТИ: узлы и стрелки тоже открывают свои окна.
  const п = await page.evaluate(() => ({
    узлов: document.querySelectorAll('#pathResult .path-node.path-open').length,
    стрелок: document.querySelectorAll('#pathResult .path-arrow.path-open').length,
  }));
  проверить('узлы в панели пути нажимаемы', п.узлов > 0, '>0', п.узлов);
  проверить('стрелки в панели пути нажимаемы', п.стрелок > 0, '>0', п.стрелок);
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

      // СМЫСЛОВОЙ ЦВЕТ ПОРОГУ НЕ ПОДЧИНЯЕТСЯ. Цвет стрелки пути и подписи
      // философа берётся ИЗ ДАННЫХ — от типа связи, от философа, — и несёт
      // смысл: пять типов из 21 темнее порога (emerge_from даёт 1,78,
      // dialogue 2,1). Поднять их значило бы переписать палитру, то есть
      // сменить смысловое кодирование ради оформления. Такие места
      // пропускаются намеренно; читаемость там — отдельный вопрос, и решать
      // его надо обводкой или тенью, а не подменой цвета.
      if (el.style && el.style.color) continue;
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
