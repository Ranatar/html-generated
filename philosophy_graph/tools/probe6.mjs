#!/usr/bin/env node
// Шестой прибор: правка при ВЫНЕСЕННОЙ БАЗЕ.
//
// Повод — законное сомнение: правка писалась, когда данные лежали в самом
// файле, а теперь приходят из JSON по fetch. Прежние наборы жали кнопки
// правки, НО окна подтверждения ОТКЛОНЯЛИ и не проверяли, изменились ли
// данные. То есть проверялось, что обработчик не падает, а не что правка
// работает.
//
// Здесь проверяется:
//  1. ТОЖДЕСТВО ДАННЫХ. JSON не умеет undefined, NaN и прочего; при выносе
//     базы такое исчезает МОЛЧА. Сверяются все шесть наборов целиком.
//  2. ПРАВКА ДО КОНЦА: изменение концепции, создание новой, изменение связи
//     и философа, удаление — с ПРИНЯТИЕМ подтверждений, со сверкой самих
//     данных, производных указателей и того, что граф пересобрался.
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
window.__rig = { openConceptById: A.openConceptById, closeUniversalModal: A.closeUniversalModal,
  openUniversalModal: A.openUniversalModal, toggleModalMode: A.toggleModalMode,
  openEditConceptModal: A.openEditConceptModal, openEditConnectionModal: A.openEditConnectionModal,
  openAuthModal: A.openAuthModal, submitAuth: A.submitAuth, closeAuthModal: A.closeAuthModal,
  findConnection: A.findConnection,
  D: k => A.DATA[k],
  nodes: () => A.DATA.nodes,
  links: () => A.DATA.links,
  индекс: () => ({ philosopherConcepts: A.DATA.philosopherConcepts,
    conceptToRubrics: A.DATA.conceptToRubrics,
    philosopherIdToName: A.DATA.philosopherIdToName }) };
window.__rigReady = true;`;

const RIG_CLASSIC = `
window.__rig = { openConceptById: openConceptById, closeUniversalModal: closeUniversalModal,
  openUniversalModal: openUniversalModal, toggleModalMode: toggleModalMode,
  openEditConceptModal: openEditConceptModal, openEditConnectionModal: openEditConnectionModal,
  openAuthModal: openAuthModal, submitAuth: submitAuth, closeAuthModal: closeAuthModal,
  findConnection: findConnection,
  D: function (k) { return ({ concepts: concepts, relations: relations,
      philosophers: philosophers, traditions: traditions, rubrics: rubrics,
      relationTypes: relationTypes })[k]; },
  nodes: function () { return nodes; },
  links: function () { return links; },
  индекс: function () { return {
    philosopherConcepts: philosopherConcepts,
    conceptToRubrics: conceptToRubrics,
    philosopherIdToName: philosopherIdToName }; } };
window.__rigReady = true;`;

async function run(label) {
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
    if (m.type() === 'error' && !u.includes('favicon')) errs.push('console: ' + m.text().slice(0, 160));
  });
  // ПОДТВЕРЖДЕНИЯ ПРИНИМАЮТСЯ: иначе правка до данных не доходит
  const окна = [];
  page.on('dialog', async d => {
    окна.push(d.type() + ':' + d.message().slice(0, 80));
    try { await d.accept(); } catch (e) {}
  });

  await page.goto(BASE + label, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await wait(4000);
  await page.addScriptTag(label.startsWith('_ref')
    ? { content: RIG_CLASSIC } : { type: 'module', content: RIG_MODULE });
  await page.waitForFunction('window.__rigReady === true', { timeout: 20000 });

  const out = {};
  const H = async expr => {
    try { return await page.evaluate(`(${HASH})(${expr})`); }
    catch (e) { return { h: 'ОШИБКА', n: 0, v: e.message.slice(0, 90) }; }
  };

  // ── 1. тождество данных ───────────────────────────────────────────
  for (const набор of ['philosophers', 'traditions', 'rubrics', 'relationTypes',
                       'concepts', 'relations']) {
    out['данные: ' + набор] = await H(
      `JSON.stringify(window.__rig.D(${JSON.stringify(набор)}))`);
  }
  // ключи с undefined JSON теряет молча — считаем их отдельно
  out['данные: ключей всего'] = await H(`(function(){
    var n = 0;
    ['philosophers','traditions','rubrics','relationTypes','concepts','relations']
      .forEach(function (k) {
        (window.__rig.D(k) || []).forEach(function (o) { n += Object.keys(o).length; });
      });
    return String(n); })()`);
  out['данные: производные указатели'] = await H(`(function(){
    var i = window.__rig.индекс();
    return Object.keys(i.philosopherConcepts).length + '|' +
           Object.keys(i.conceptToRubrics).length + '|' +
           Object.keys(i.philosopherIdToName).length; })()`);
  out['данные: узлов и связей'] = await H(
    `window.__rig.nodes().length + '|' + window.__rig.links().length`);

  // ── 2. вход ───────────────────────────────────────────────────────
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

  // ── 3. правка существующей концепции ──────────────────────────────
  {
    await page.evaluate(id => { window.__rig.closeUniversalModal(); window.__rig.openEditConceptModal(id); }, первая);
    await wait(1300);
    out['правка: форма открылась'] = await H(
      `String(!!document.getElementById('conceptLabel'))`);
    await page.evaluate(() => {
      document.getElementById('conceptLabel').value = 'ПРОВЕРКА ПРАВКИ';
      const d = document.getElementById('conceptDescription');
      if (d) d.value = 'описание изменено прибором';
      const b = [...document.querySelectorAll('#universalModal button')]
        .find(x => /Сохранить/.test(x.textContent));
      if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    });
    await wait(2000);
    out['правка: запись в данных'] = await H(`(function(){
      var c = window.__rig.D('concepts').find(function (x) { return x.id === ${JSON.stringify(первая)}; });
      return c ? c.label + '|' + (c.description || '').slice(0, 30) : 'нет'; })()`);
    out['правка: узел графа'] = await H(`(function(){
      var n = window.__rig.nodes().find(function (x) { return x.id === ${JSON.stringify(первая)}; });
      return n ? n.label : 'нет'; })()`);
    // Новое имя концепции должно всплыть ВЕЗДЕ, где она поминается:
    // в самом окне концепции, в разделе концепций окна философа, в списке
    // связей. Легенда тут ни при чём — концепций в ней нет.
    await page.evaluate(() => window.__rig.closeUniversalModal());
    await wait(300);
    await page.evaluate(id => window.__rig.openConceptById(id), первая);
    await wait(900);
    out['правка: имя в окне концепции'] = await H(
      `String(document.getElementById('universalModalContent').textContent.indexOf('ПРОВЕРКА ПРАВКИ') >= 0)`);
    const философ = await page.evaluate(id => {
      const n = window.__rig.nodes().find(x => x.id === id);
      return n ? n.concept : null;
    }, первая);
    out['__философ'] = философ;
    await page.evaluate(() => window.__rig.closeUniversalModal());
    await wait(300);
    await page.evaluate(p => window.__rig.openUniversalModal('philosopher', p, 'view'), философ);
    await wait(1100);
    out['правка: имя в окне философа'] = await H(
      `String(document.getElementById('universalModalContent').textContent.indexOf('ПРОВЕРКА ПРАВКИ') >= 0)`);
    await page.evaluate(() => window.__rig.closeUniversalModal());
    await wait(300);
    // список связей: берём связь, где эта концепция — один из концов
    const св = await page.evaluate(id => {
      const l = window.__rig.links().find(x =>
        (x.source.id || x.source) === id || (x.target.id || x.target) === id);
      return l ? [l.source.id || l.source, l.target.id || l.target] : null;
    }, первая);
    if (св) {
      await page.evaluate(([a, b]) => window.__rig.openUniversalModal(
        'connection', window.__rig.findConnection(a, b, false), 'view'), св);
      await wait(1000);
      out['правка: имя в окне связи'] = await H(
        `String(document.getElementById('universalModalContent').textContent.indexOf('ПРОВЕРКА ПРАВКИ') >= 0)`);
      await page.evaluate(() => window.__rig.closeUniversalModal());
      await wait(300);
    }
  }

  // ── 4. создание новой концепции ───────────────────────────────────
  {
    const было = await page.evaluate(() => window.__rig.D('concepts').length);
    await page.evaluate(() => {
      window.__rig.closeUniversalModal();
      window.__rig.openUniversalModal('concept', null, 'edit');
    });
    await wait(1300);
    out['создание: форма пустая'] = await H(
      `String((document.getElementById('conceptLabel') || {}).value === '')`);
    await page.evaluate(() => {
      document.getElementById('conceptLabel').value = 'НОВАЯ КОНЦЕПЦИЯ ПРИБОРА';
      const p = document.getElementById('conceptPhilosopher');
      if (p && p.options.length) p.value = p.options[1] ? p.options[1].value : p.options[0].value;
      const d = document.getElementById('conceptDescription');
      if (d) d.value = 'создано прибором';
      const b = [...document.querySelectorAll('#universalModal button')]
        .find(x => /Сохранить/.test(x.textContent));
      if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    });
    await wait(2500);
    const стало = await page.evaluate(() => window.__rig.D('concepts').length);
    out['создание: прибавилось концепций'] = await H(JSON.stringify(стало - было));
    out['создание: узел появился'] = await H(`(function(){
      var n = window.__rig.nodes().filter(function (x) { return x.label === 'НОВАЯ КОНЦЕПЦИЯ ПРИБОРА'; });
      return String(n.length); })()`);
    out['создание: производные пересобраны'] = await H(`(function(){
      var n = window.__rig.nodes().find(function (x) { return x.label === 'НОВАЯ КОНЦЕПЦИЯ ПРИБОРА'; });
      if (!n) return 'узла нет';
      var i = window.__rig.индекс();
      return String(Object.prototype.hasOwnProperty.call(i.conceptToRubrics, n.id)); })()`);
    await page.evaluate(() => window.__rig.closeUniversalModal());
    await wait(400);
  }

  // ── 4б. переименование философа: вот ЗДЕСЬ должна обновиться легенда ──
  {
    const имя = await page.evaluate(() => window.__rig.D('philosophers')[0].nameRu);
    out['__философ2'] = имя;
    await page.evaluate(p => {
      window.__rig.closeUniversalModal();
      window.__rig.openUniversalModal('philosopher', p, 'edit');
    }, имя);
    await wait(1400);
    out['философ: форма открылась'] = await H(
      `String(!!document.getElementById('philName'))`);
    await page.evaluate(() => {
      const el = document.getElementById('philName');
      if (el) el.value = 'ФИЛОСОФ ПРИБОРА';
      const b = [...document.querySelectorAll('#universalModal button')]
        .find(x => /Сохранить/.test(x.textContent));
      if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    });
    await wait(2500);
    out['философ: запись в данных'] = await H(`(function(){
      return String(window.__rig.D('philosophers').some(function (p) {
        return p.nameRu === 'ФИЛОСОФ ПРИБОРА'; })); })()`);
    out['философ: подпись в легенде'] = await H(`(function(){
      return String(document.getElementById('legend').textContent.indexOf('ФИЛОСОФ ПРИБОРА') >= 0); })()`);
    out['философ: узлы переподписаны'] = await H(`(function(){
      return String(window.__rig.nodes().filter(function (n) {
        return n.concept === 'ФИЛОСОФ ПРИБОРА'; }).length); })()`);
    await page.evaluate(() => window.__rig.closeUniversalModal());
    await wait(400);
  }

  // ── 5. правка связи ───────────────────────────────────────────────
  {
    const пара = await page.evaluate(() => {
      const l = window.__rig.links()[0];
      if (!l) return null;
      return [l.source.id || l.source, l.target.id || l.target];
    });
    out['__связь'] = пара ? пара.join('→') : 'нет';
    if (пара) {
      await page.evaluate(([a, b]) => {
        window.__rig.closeUniversalModal();
        window.__rig.openEditConnectionModal(a, b);
      }, пара);
      await wait(1400);
      out['правка связи: форма открылась'] = await H(
        `String(!!document.querySelector('#universalModal select, #universalModal input'))`);
      await page.evaluate(() => {
        const d = document.getElementById('connectionDescription');
        if (d) d.value = 'связь изменена прибором';
        const b = [...document.querySelectorAll('#universalModal button')]
          .find(x => /Сохранить/.test(x.textContent));
        if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      });
      await wait(2000);
      out['правка связи: запись в данных'] = await H(`(function(){
        var r = window.__rig.D('relations').find(function (x) {
          return x.source === ${JSON.stringify(пара[0])} && x.target === ${JSON.stringify(пара[1])}; });
        return r ? String((r.description || '').slice(0, 30)) : 'нет'; })()`);
      await page.evaluate(() => window.__rig.closeUniversalModal());
      await wait(400);
    }
  }

  // ── 6. удаление созданной концепции ───────────────────────────────
  {
    const id = await page.evaluate(() => {
      const n = window.__rig.nodes().find(x => x.label === 'НОВАЯ КОНЦЕПЦИЯ ПРИБОРА');
      return n ? n.id : null;
    });
    if (id) {
      const было = await page.evaluate(() => window.__rig.D('concepts').length);
      await page.evaluate(i => { window.__rig.closeUniversalModal(); window.__rig.openEditConceptModal(i); }, id);
      await wait(1300);
      await page.evaluate(() => {
        const b = [...document.querySelectorAll('#universalModal button')]
          .find(x => /Удалить/.test(x.textContent));
        if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      });
      await wait(2500);
      const стало = await page.evaluate(() => window.__rig.D('concepts').length);
      out['удаление: убавилось концепций'] = await H(JSON.stringify(было - стало));
      out['удаление: узел исчез'] = await H(`(function(){
        return String(window.__rig.nodes().filter(function (x) {
          return x.label === 'НОВАЯ КОНЦЕПЦИЯ ПРИБОРА'; }).length); })()`);
      await page.evaluate(() => window.__rig.closeUniversalModal());
      await wait(400);
    } else {
      out['удаление: убавилось концепций'] = await H(JSON.stringify('создание не удалось'));
    }
  }

  out['окна подтверждения'] = await H(JSON.stringify(окна.length > 0 ? 'были' : 'ни одного'));
  out.__окна = окна;
  out.__errs = errs;
  await page.close(); await browser.close();
  return out;
}

const [, , mode, a1, a2] = process.argv;
if (mode === 'run') {
  const res = await run(a1);
  fs.writeFileSync(a2, JSON.stringify(res, null, 1));
  console.log(`${a1}: снимков ${Object.keys(res).length - 2}, ошибок ${res.__errs.length}, ` +
    `окон подтверждения ${res.__окна.length}`);
} else {
  const A = JSON.parse(fs.readFileSync(a1, 'utf8'));
  const B = JSON.parse(fs.readFileSync(a2, 'utf8'));
  const keys = Object.keys(A).filter(k => k !== '__errs' && !k.startsWith('__'));
  let ok = 0; const bad = [];
  for (const k of keys) {
    if (JSON.stringify(A[k]) === JSON.stringify(B[k])) ok++; else bad.push([k, A[k], B[k]]);
  }
  console.log(`правка при вынесенной базе: сверено ${keys.length}, совпало ${ok}, разошлось ${bad.length}`);
  for (const [k, x, y] of bad) console.log(объяснить(k, x, y) || `  ✗ ${k}`);
  console.log(`окон подтверждения: исходник ${A.__окна.length}, модули ${B.__окна.length}`);
  const оа = A.__окна.join('\n'), об = B.__окна.join('\n');
  if (оа !== об) {
    console.log('  ✗ окна подтверждения РАЗНЫЕ');
    console.log('    исходник:', A.__окна.slice(0, 6));
    console.log('    модули  :', B.__окна.slice(0, 6));
  }
  console.log(`ошибки: исходник ${A.__errs.length}, модули ${B.__errs.length}`);
  for (const e of [...new Set([...A.__errs, ...B.__errs])].slice(0, 8)) console.log('   ' + e);
  process.exit(bad.length || оа !== об || A.__errs.length || B.__errs.length ? 1 : 0);
}
