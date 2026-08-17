#!/usr/bin/env node
// Полная сверка: одна и та же последовательность прогоняется по исходному
// файлу и по модульной сборке, сравниваются хеши разметки и текста.
// Расхождение любого вида — провал.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER ||
  '/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer');
const CHROME = process.env.CHROME ||
  '/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';
const BASE = process.env.BASE || 'http://127.0.0.1:8711/';

const VIEWS = ['overview', 'comparison', 'closest-pairs', 'philosopher-comparison',
  'philosopher-pairs', 'degree', 'pagerank', 'betweenness', 'closeness', 'eigenvector',
  'weighted-clustering', 'local-cohesion', 'rich-club', 'problem-generation',
  'critical-power', 'tension', 'revolutionary', 'paradigm-shift', 'influence',
  'foundational', 'synthetic', 'dialogical', 'coherence', 'transformation', 'fertility',
  'complexity', 'continuity', 'generative', 'instrumental', 'bridging', 'abstraction',
  'deductive', 'temporal-influence', 'philosopher-profile', 'philosopher-systematic',
  'philosopher-reach', 'philosopher-interdisciplinary', 'concept-rankings',
  'philosopher-rankings'];

const wait = ms => new Promise(r => setTimeout(r, ms));

// хеш нормализованной разметки: пробелы схлопнуты, порядок сохранён
import { ХЕШ as HASH, объяснить } from './snapshot.mjs';


async function run(page, label) {
  const out = {};
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).split('\n')[0]));
  page.on('error', e => { console.log('  КРАХ ВКЛАДКИ:', e.message); errs.push('крах: ' + e.message); });
  page.on('console', m => {
    const u = (m.location() && m.location().url) || '';
    if (m.type() === 'error' && !u.includes('favicon')) errs.push('console: ' + m.text().slice(0, 160));
  });
  await page.goto(BASE + label, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await wait(4000);


  // Оснастка: у переведённой сборки точки входа даёт _probe-rig.js
  // (мост снят), у исходника всё и так лежит в window.
  if (label.startsWith('_ref')) {
    // У исходника функции лежат в window, а вот объявления let и const —
    // НЕТ: они живут в общей лексической области сценариев. Достать их
    // можно только из другого обычного сценария, что и делается.
    await page.addScriptTag({ content: `
      window.__app = new Proxy({}, {
        get: function (t, p) {
          switch (p) {
            case 'selectedNodes': return selectedNodes;
            case 'nodes': return nodes;
            case 'links': return links;
            case 'concepts': return concepts;
            case 'relations': return relations;
            case 'philosophers': return philosophers;
            case 'isStatsModalOpen': return isStatsModalOpen;
            case 'renderState': return renderState;
            case 'simulation': return simulation;
            case 'tickCount': return tickCount;
          }
          var v = window[p];
          return typeof v === 'function' ? v.bind(window) : v;
        }
      });
      window.__appReady = true;` });
    await page.waitForFunction('window.__appReady === true', { timeout: 20000 });
  } else {
    await page.addScriptTag({ type: 'module', content:
      "import './_probe-rig.js';" });
    await page.waitForFunction('window.__appReady === true', { timeout: 20000 });
  }

  let шаг = 0;
  const H = async (expr) => {
    шаг++;
    if (process.env.SHOW) console.error('шаг', шаг, '|', String(expr).replace(/\s+/g, ' ').slice(0, 70));
    try { return await page.evaluate(`(${HASH})(${expr})`); }
    catch (e) { return { h: 'ОШИБКА', n: e.message.slice(0, 80) }; }
  };

  out['загрузка: панель фильтров'] = await H(`document.getElementById('legend').innerHTML`);
  out['загрузка: счётчик'] = await H(`document.getElementById('filterStats').textContent`);
  out['загрузка: кнопки входа'] = await H(`document.getElementById('authButtons').innerHTML`);
  // Не ДЛИНА разметки, а сама разметка: длина меняется от одной лишь формы
  // записи обработчика (onclick="…" против data-act-click="…" плюс data-a*),
  // а хеш такие атрибуты вычёркивает.
  out['загрузка: списки пути'] = await H(
    `document.getElementById('sourceSelectDropdown').innerHTML +
     document.getElementById('targetSelectDropdown').innerHTML`);

  // Все виды статистики по очереди, в одном сеансе
  await page.evaluate(() => window.__app.openStatsModal());
  for (const v of VIEWS) {
    try {
      await page.evaluate(n => window.__app.switchStatsView(n), v);
      await wait(2200);
      out['вид: ' + v] = await H(`document.getElementById('statsContentArea').innerHTML`);
    } catch (e) {
      out['вид: ' + v] = { h: 'СБОЙ', n: e.message.slice(0, 60) };
      console.log(`  сбой на виде ${v}: ${e.message.slice(0, 80)}`);
      break;
    }
  }
  // переключатели поверх видов
  await page.evaluate(() => window.__app.switchStatsView('influence'));
  await wait(2500);
  await page.evaluate(() => window.__app.toggleMetricValueMode());
  await wait(2000);
  out['вид influence: нормировка'] = await H(`document.getElementById('statsContentArea').innerHTML`);
  await page.evaluate(() => window.__app.toggleMetricLayout());
  await wait(1500);
  out['вид influence: строками'] = await H(`document.getElementById('statsContentArea').innerHTML`);
  await page.evaluate(() => { window.__app.toggleMetricLayout(); window.__app.toggleMetricValueMode(); });
  await wait(1500);
  await page.evaluate(() => { document.getElementById('statsScopeToggle').checked = true; window.__app.handleMetricsScopeChange(); });
  await wait(2500);
  out['вид influence: с учётом фильтров'] = await H(`document.getElementById('statsContentArea').innerHTML`);
  await page.evaluate(() => { document.getElementById('statsScopeToggle').checked = false; window.__app.handleMetricsScopeChange(); });
  await wait(2000);
  await page.evaluate(() => window.__app.closeStatsModal());
  await wait(500);

  // окна сущностей
  // Идентификатор берётся из обеих записей: у исходника он внутри onclick,
  // у переведённой сборки — в data-a2.
  const ids = await page.evaluate(() =>
    [...document.querySelectorAll('#sourceSelectDropdown .concept-row')]
      .slice(0, 400).map(o => {
        const d = o.getAttribute('data-a2');
        if (d) return d;
        const m = (o.getAttribute('onclick') || '').match(/'([^']+)'\s*\)$/);
        return m ? m[1] : null;
      }).filter(Boolean));
  const pick = [ids[0], ids[17], ids[123], ids[300]];
  for (const id of pick) {
    await page.evaluate(i => window.__app.openConceptById(i), id);
    await wait(900);
    out['окно концепции ' + id] = await H(`document.getElementById('universalModalContent').innerHTML`);
    await page.evaluate(() => window.__app.closeUniversalModal());
    await wait(200);
    await page.evaluate(i => window.__app.showConceptProfileModal(i), id);
    await wait(1200);
    out['профиль концепции ' + id] = await H(`document.getElementById('conceptProfileContent').innerHTML`);
    await page.evaluate(() => window.__app.closeConceptProfileModal());
    await wait(200);
  }
  const phils = await page.evaluate(() =>
    [...document.querySelectorAll('#philosopherFilters input')].map(i => i.id.replace(/^phil-/, '')).slice(0, 3));
  for (const ph of phils) {
    await page.evaluate(p => window.__app.openUniversalModal('philosopher', p, 'view'), ph);
    await wait(1000);
    out['окно философа ' + ph] = await H(`document.getElementById('universalModalContent').innerHTML`);
    await page.evaluate(() => window.__app.closeUniversalModal());
    await wait(200);
    await page.evaluate(p => window.__app.showPhilosopherProfileModal(p), ph);
    await wait(1400);
    out['профиль философа ' + ph] = await H(`document.getElementById('philosopherProfileContent').innerHTML`);
    await page.evaluate(() => window.__app.closePhilosopherProfileModal());
    await wait(200);
  }

  // Окно связи. Пару связанных концепций берём ИЗ РАЗМЕТКИ уже открытого
  // окна концепции: в списке связей стоит toggleConnectionDescription
  // с обоими концами. Так шаг не зависит от того, что случайно оказалось
  // в window, — а оказывается там разное: в исходнике это всякое
  // объявление функции, в сборке только то, что выставил мост.
  out['окно связи'] = await (async () => {
    await page.evaluate(i => window.__app.openConceptById(i), pick[0]);
    await wait(900);
    const pair = await page.evaluate(id => {
      const пары = [];
      const html = document.getElementById('universalModalContent').innerHTML;
      for (const one of (html.match(/toggleConnectionDescription\('([^']+)'\)/g) || []))
        пары.push(one.slice(one.indexOf("('") + 2, one.lastIndexOf("')")));
      for (const el of document.querySelectorAll('#universalModalContent [data-a1]')) {
        const a1 = el.dataset.a1, a2 = el.dataset.a2;
        if (a1 && a2) пары.push(a1 + '-' + a2);
        else if (a1 && a1.indexOf('-') > 0) пары.push(a1);
      }
      for (const p of пары) if (p.startsWith(id + '-')) return [id, p.slice(id.length + 1)];
      return null;
    }, pick[0]);
    await page.evaluate(() => window.__app.closeUniversalModal());
    await wait(200);
    if (!pair) return { h: 'НЕТ ПАРЫ', n: 0 };
    await page.evaluate(([s_, t_]) =>
      window.__app.openUniversalModal('connection', window.__app.findConnection(s_, t_, false), 'view'), pair);
    await wait(900);
    const r = await H(`document.getElementById('universalModalContent').innerHTML`);
    await page.evaluate(() => window.__app.closeUniversalModal());
    await wait(200);
    return r;
  })();

  // фильтры
  await page.evaluate(() => window.__app.deselectAllPhilosophers());
  await wait(900);
  out['фильтр: никого'] = await H(`document.getElementById('filterStats').textContent`);
  await page.evaluate(() => window.__app.selectAllPhilosophers());
  await wait(900);
  out['фильтр: все'] = await H(`document.getElementById('filterStats').textContent`);
  for (const mode of ['internal', 'context', 'external', 'cross_selected',
                      'within_traditions', 'between_traditions']) {
    await page.evaluate(m => { document.getElementById('filterMode').value = m; window.__app.changeFilterMode(m); }, mode);
    await wait(1200);
    out['режим ' + mode] = await H(`document.getElementById('filterStats').textContent`);
  }
  await page.evaluate(() => { document.getElementById('filterMode').value = 'all'; window.__app.changeFilterMode('all'); });
  await wait(1000);
  await page.evaluate(() => window.__app.deselectAllRubrics());
  await wait(900);
  out['фильтр: рубрики сняты'] = await H(`document.getElementById('filterStats').textContent`);
  await page.evaluate(() => window.__app.selectAllRubrics());
  await wait(900);
  await page.evaluate(() => { window.__app.onlyTradition('rationalism'); });
  await wait(1000);
  out['традиция: только рационализм'] = await H(`document.getElementById('filterStats').textContent`);
  await page.evaluate(() => window.__app.selectAllPhilosophers());
  await wait(900);

  // поиск
  for (const q of ['иде', 'бытие', 'сво']) {
    await page.evaluate(s => window.__app.handleLegendSearch(s), q);
    await wait(500);
    out['поиск легенды «' + q + '»'] = await H(`document.getElementById('legendSearchResults').innerHTML`);
  }
  await page.evaluate(() => window.__app.clearLegendSearch());

  // путь
  await page.evaluate(ids => {
    window.__app.selectCustomOption('source', ids[0]);
    window.__app.selectCustomOption('target', ids[1]);
    document.getElementById('respectChronology').checked = false;
    window.__app.findAndShowPath();
  }, [ids[0], ids[123]]);
  await wait(1500);
  out['путь без хронологии'] = await H(`document.getElementById('pathResult').innerHTML`);
  await page.evaluate(() => {
    document.getElementById('respectChronology').checked = true;
    document.getElementById('useWeightsPath').checked = false;
    window.__app.findAndShowPath();
  });
  await wait(1500);
  out['путь без весов'] = await H(`document.getElementById('pathResult').innerHTML`);

  // вход и права
  await page.evaluate(() => {
    window.__app.openAuthModal('login');
    document.getElementById('authLogin').value = 'admin';
    document.getElementById('authPassword').value = 'admin';
    window.__app.submitAuth();
  });
  await wait(800);
  out['после входа: кнопки'] = await H(`document.getElementById('authButtons').innerHTML`);
  await page.evaluate(i => window.__app.openConceptById(i), pick[0]);
  await wait(900);
  out['окно под admin'] = await H(`document.querySelector('#universalModal .modal-toolbar').innerHTML`);
  await page.evaluate(() => window.__app.toggleModalMode());
  await wait(1200);
  out['форма правки концепции'] = await H(`document.getElementById('universalModalContent').innerHTML`);
  await page.evaluate(() => { window.__app.ModalContext = window.__app.ModalContext; });
  await page.evaluate(() => window.__app.closeUniversalModal());
  await wait(300);
  await page.evaluate(() => window.__app.authLogout());
  await wait(500);
  out['после выхода: кнопки'] = await H(`document.getElementById('authButtons').innerHTML`);

  // подсветка и граф
  await page.evaluate(i => window.__app.highlightNodeById(i), pick[1]);
  await wait(700);
  out['подсветка узла'] = await H(`String(window.__app.selectedNodes ? window.__app.selectedNodes.size : 'нет')`);
  await page.evaluate(() => window.__app.toggleGrouping());
  await wait(1200);
  await page.evaluate(() => window.__app.toggleGrouping());
  await wait(800);
  out['после группировки: счётчик'] = await H(`document.getElementById('filterStats').textContent`);
  await page.evaluate(i => window.__app.showSimilarityOverlay(i, 'profile'), pick[0]);
  await wait(1200);
  out['наложение схожести'] = await H(`(document.getElementById('similarityLegend')||{}).innerHTML || 'нет'`);
  await page.evaluate(() => window.__app.clearSimilarityOverlay());

  out.__errs = errs;
  return out;
}

import fs from 'node:fs';

const MODE = process.argv[2];

if (MODE === 'run') {
  const page_ = process.argv[3], outFile = process.argv[4];
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu',
           '--js-flags=--max-old-space-size=2048'],
  });
  const pg = await browser.newPage();
  await pg.setViewport({ width: 1440, height: 900 });
  const res = await run(pg, page_);
  await pg.close(); await browser.close();
  fs.writeFileSync(outFile, JSON.stringify(res, null, 1));
  console.log(`снято ${Object.keys(res).length - 1} снимков с ${page_}; ошибок ${res.__errs.length}`);
  process.exit(0);
}

{
  const orig = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
  const mods = JSON.parse(fs.readFileSync(process.argv[4], 'utf8'));
  const keys = Object.keys(orig).filter(k => k !== '__errs');
  let ok = 0; const bad = [];
  for (const k of keys) {
    const a = orig[k], b = mods[k];
    if (a && b && a.h === b.h && a.n === b.n) ok++;
    else bad.push([k, a, b]);
  }
  console.log(`сверено ${keys.length} снимков: совпало ${ok}, разошлось ${bad.length}`);
  for (const [k, a, b] of bad)
    console.log(`  ✗ ${k}: исходник ${JSON.stringify(a)} | модули ${JSON.stringify(b)}`);
  console.log(`ошибки страницы: исходник ${orig.__errs.length}, модули ${mods.__errs.length}`);
  for (const e of [...new Set(orig.__errs)].slice(0, 5)) console.log('   исходник: ' + e);
  for (const e of [...new Set(mods.__errs)].slice(0, 5)) console.log('   модули:   ' + e);
  process.exit(bad.length || mods.__errs.length ? 1 : 0);
}
