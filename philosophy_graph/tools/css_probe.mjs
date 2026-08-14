#!/usr/bin/env node
// Проверка разнесения стилей.
//
// Тяжёлая приёмка тут не нужна — поведение не менялось. Но и «на глаз» мало:
// порядок в таблице стилей часть смысла, при равной весомости побеждает
// последнее правило, а семь селекторов встречаются в двух главах.
// Поэтому две проверки, обе дешёвые:
//
//   1. склейка глав по порядку совпадает с исходным блоком знак в знак —
//      это делает сам разрезатель и падает, если нет;
//   2. ВЫЧИСЛЕННЫЕ стили каждого элемента на обеих страницах совпадают —
//      вот она. Берётся не картинка, а решение браузера по каждому
//      свойству: так расхождение видно и там, где глазом не заметишь.
//
// Обходятся несколько состояний: главная, окно статистики, окно концепции,
// окно философа, форма правки под admin, узкий экран.
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

// свойства, которые вообще что-то решают в облике
const СВОЙСТВА = `display position top left right bottom width height maxWidth maxHeight
minWidth minHeight margin padding border borderRadius background backgroundColor
backgroundImage color font fontSize fontWeight fontFamily lineHeight textAlign
opacity visibility overflow zIndex boxShadow textShadow transform transition
flexDirection justifyContent alignItems gap gridTemplateColumns whiteSpace
textOverflow cursor pointerEvents`.split(/\s+/).filter(Boolean);

const СНИМОК = (свойства) => `(function () {
  var свойства = ${JSON.stringify(свойства)};
  var все = document.querySelectorAll('*');
  var h = 7 >>> 0, n = 0, строки = [];
  for (var i = 0; i < все.length; i++) {
    var el = все[i];
    if (el.tagName === 'SCRIPT' || el.tagName === 'LINK' || el.tagName === 'STYLE') continue;
    var s = getComputedStyle(el);
    var путь = el.tagName + (el.id ? '#' + el.id : '') +
               (el.className && el.className.baseVal === undefined
                  ? '.' + String(el.className).trim().replace(/\\s+/g, '.') : '');
    var кусок = путь;
    for (var j = 0; j < свойства.length; j++) кусок += '|' + s[свойства[j]];
    строки.push(кусок);
    n++;
  }
  var t = строки.join('\\n');
  for (var k = 0; k < t.length; k++) h = (Math.imul(h, 31) + t.charCodeAt(k)) >>> 0;
  // куски — чтобы при расхождении было видно, в какой доле снимка оно
  var хеш = function (u) { var g = 7 >>> 0;
    for (var i = 0; i < u.length; i++) g = (Math.imul(g, 31) + u.charCodeAt(i)) >>> 0; return g; };
  var ч = [], шаг = Math.ceil(t.length / 32) || 1;
  for (var i = 0; i < t.length; i += шаг) ч.push(хеш(t.slice(i, i + шаг)));
  // накопительные: переживают сдвиг длины (см. tools/snapshot.mjs)
  var п = [];
  for (var k = шаг; k <= t.length; k += шаг) п.push(хеш(t.slice(0, k)));
  return { элементов: n, h: h, n: t.length, ч: ч, п: п };
})()`;

async function run(страница) {
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
    if (m.type() === 'error' && !u.includes('favicon')) errs.push('console: ' + m.text().slice(0, 140));
  });
  page.on('requestfailed', r => {
    if (!r.url().endsWith('favicon.ico')) errs.push('не загрузилось: ' + r.url().split('/').pop());
  });

  await page.goto(BASE + страница, { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(4000);

  const модуль = !страница.startsWith('_ref');
  await page.addScriptTag(модуль
    ? { type: 'module', content: `
        import { openStatsModal, closeStatsModal } from './stats/modal.js';
        import { openConceptById } from './modal/entry.js';
        import { closeUniversalModal, openUniversalModal } from './modal/core.js';
        import { openEditConceptModal } from './modal/entry.js';
        import { openAuthModal, submitAuth, closeAuthModal } from './modal/auth.js';
        import { DATA } from './core/ns.js';
        window.__a = { openStatsModal, closeStatsModal, openConceptById, closeUniversalModal,
          openUniversalModal, openEditConceptModal, openAuthModal, submitAuth, closeAuthModal,
          первая: () => DATA.concepts[0].id, философ: () => DATA.philosophers[0].nameRu };
        window.__aReady = true;` }
    : { content: `
        window.__a = { openStatsModal: openStatsModal, closeStatsModal: closeStatsModal,
          openConceptById: openConceptById, closeUniversalModal: closeUniversalModal,
          openUniversalModal: openUniversalModal, openEditConceptModal: openEditConceptModal,
          openAuthModal: openAuthModal, submitAuth: submitAuth, closeAuthModal: closeAuthModal,
          первая: function () { return concepts[0].id; },
          философ: function () { return philosophers[0].nameRu; } };
        window.__aReady = true;` });
  await page.waitForFunction('window.__aReady === true', { timeout: 20000 });

  const out = {};
  const снять = async имя => { out[имя] = await page.evaluate(СНИМОК(СВОЙСТВА)); };

  await снять('главная');

  await page.evaluate(() => window.__a.openStatsModal());
  await wait(1500);
  await снять('окно статистики');
  await page.evaluate(() => window.__a.closeStatsModal());
  await wait(500);

  const id = await page.evaluate(() => window.__a.первая());
  await page.evaluate(i => window.__a.openConceptById(i), id);
  await wait(1200);
  await снять('окно концепции');
  await page.evaluate(() => window.__a.closeUniversalModal());
  await wait(400);

  const ф = await page.evaluate(() => window.__a.философ());
  await page.evaluate(p => window.__a.openUniversalModal('philosopher', p, 'view'), ф);
  await wait(1400);
  await снять('окно философа');
  await page.evaluate(() => window.__a.closeUniversalModal());
  await wait(400);

  await page.evaluate(() => {
    window.__a.openAuthModal('login');
    document.getElementById('authLogin').value = 'admin';
    document.getElementById('authPassword').value = 'admin';
    window.__a.submitAuth();
  });
  await wait(900);
  await page.evaluate(() => window.__a.closeAuthModal());
  await wait(400);
  await page.evaluate(i => window.__a.openEditConceptModal(i), id);
  await wait(1400);
  await снять('форма правки');
  await page.evaluate(() => window.__a.closeUniversalModal());
  await wait(400);

  await page.setViewport({ width: 700, height: 600 });
  await wait(1200);
  await снять('узкий экран');

  out.__errs = errs;
  await page.close(); await browser.close();
  return out;
}

const [, , режим, а1, а2] = process.argv;
if (режим === 'run') {
  const r = await run(а1);
  fs.writeFileSync(а2, JSON.stringify(r, null, 1));
  const с = Object.keys(r).filter(k => k !== '__errs');
  console.log(`${а1}: состояний ${с.length}, элементов ` +
    с.map(k => r[k].элементов).join('/') + `, ошибок ${r.__errs.length}`);
} else {
  const A = JSON.parse(fs.readFileSync(а1, 'utf8'));
  const B = JSON.parse(fs.readFileSync(а2, 'utf8'));
  const ключи = Object.keys(A).filter(k => k !== '__errs');
  let ок = 0; const плохо = [];
  for (const k of ключи) {
    if (JSON.stringify(A[k]) === JSON.stringify(B[k])) ок++;
    else плохо.push([k, A[k], B[k]]);
  }
  console.log(`вычисленные стили: сверено ${ключи.length} состояний, совпало ${ок}, разошлось ${плохо.length}`);
  for (const [k, x, y] of плохо) console.log(объяснить(k, x, y) || `  ✗ ${k}`);
  console.log(`ошибки: исходник ${A.__errs.length}, сборка ${B.__errs.length}`);
  for (const e of [...new Set([...A.__errs, ...B.__errs])].slice(0, 6)) console.log('   ' + e);
  process.exit(плохо.length || A.__errs.length || B.__errs.length ? 1 : 0);
}
