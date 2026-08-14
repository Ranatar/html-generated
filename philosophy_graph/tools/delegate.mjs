#!/usr/bin/env node
// Перевод обработчиков разметки на делегирование.
//
// Что делает:
//  1. Ставит в дерево ui/actions.js (реестр действий) и ui/delegation.js
//     (четыре слушателя на document).
//  2. Переписывает атрибуты on* в имена действий: data-act-click и т. п.
//  3. Собирает ui/actions-<область>.js — тела действий с нужными ввозами.
//  4. Пишет actions_map.json: имя действия → исходный текст атрибута.
//     Он нужен приёмке, чтобы сверять обход с прежним перечнем.
//
// Работает заходами: сперва статическая разметка index.html, затем
// генераторы по одному. Обработчик, уже переведённый, второй раз не берётся.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.argv[2] || '/home/claude/build/src';
const ЗАХОД = process.argv[3] || 'static';

// ── что где вывозится ───────────────────────────────────────────────
const exportsOf = new Map();      // имя -> путь модуля
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'vendor') walk(p); continue; }
    if (!p.endsWith('.js')) continue;
    const rel = path.relative(ROOT, p).replace(/\\/g, '/');
    const text = fs.readFileSync(p, 'utf8');
    for (const m of text.matchAll(/^export \{([^}]*)\};?$/gm))
      for (const n of m[1].split(',').map(s => s.trim()).filter(Boolean))
        exportsOf.set(n, rel);
    for (const m of text.matchAll(/^export (?:async )?function (\w+)/gm))
      exportsOf.set(m[1], rel);
    for (const m of text.matchAll(/^export const (\w+)/gm))
      exportsOf.set(m[1], rel);
  }
})(ROOT);
const NS = ['DATA', 'S', 'MET', 'VIEWS'];
// имя → пространство: в атрибуте написано `_pairsKind='profile'`, а в
// настоящем коде это поле общего состояния
const nsOfName = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'namespaces.json'), 'utf8')); }
  catch (e) { return {}; }
})();

// ── имена действий ──────────────────────────────────────────────────
const mapFile = path.join(ROOT, 'actions_map.json');
const карта = fs.existsSync(mapFile) ? JSON.parse(fs.readFileSync(mapFile, 'utf8')) : {};
// Ключ — ПАРА «событие + код»: у поля поиска легенды один и тот же код
// висит и на oninput, и на onfocus, и это два разных обработчика.
const поИсходному = new Map(Object.entries(карта).map(([k, v]) => [v.attr + ' :: ' + v['код'], k]));

// Один и тот же обработчик встречается и в статической разметке, и в
// генераторах (например «Закрыть»). Имя ему даётся ОДНО, но тело
// записывается в реестр ОДИН РАЗ — иначе реестр справедливо ругается на
// занятое имя. Признак «уже был» возвращается вместе с именем.
function имяДействия(attr, code) {
  const было = поИсходному.get(attr + ' :: ' + code);
  if (было) return было;
  // читаемое имя из первого вызова: openStatsModal() -> open-stats-modal
  const m = code.match(/([A-Za-z_$][\w$]*)\s*\(/);
  let base = (m ? m[1] : attr).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  if (attr !== 'onclick') base += '-' + attr.slice(2);   // -input, -focus, -change
  let name = base, i = 2;
  while (карта[name]) name = base + '-' + i++;
  return name;
}

// ── превращение тела ────────────────────────────────────────────────
// `${…}` в атрибуте — это подстановка; она уезжает в data-атрибут,
// а в теле остаётся чтение el.dataset.aN. Кавычки вокруг подстановки
// снимаются: значение и так строка.
function разобрать(code) {
  const args = [];
  // 1. Подстановки под пометки. Подстановка бывает ЦЕЛЫМ доводом ('${id}')
  //    и ЧАСТЬЮ строки ('phil-internal-${id}') — второе станет шаблонной.
  let t = code.replace(/\$\{([^}]*)\}/g, (all, выр) => {
    args.push(выр);
    return '\u0000' + args.length + '\u0000';
  });
  t = t.replace(/'([^']*)'/g, (all, внутри) => {
    if (!внутри.includes('\u0000')) return all;
    const цел = внутри.match(/^\u0000(\d+)\u0000$/);
    if (цел) return `el.dataset.a${цел[1]}`;
    return '`' + внутри.replace(/\u0000(\d+)\u0000/g,
      (x, n) => '${el.dataset.a' + n + '}') + '`';
  });
  t = t.replace(/\u0000(\d+)\u0000/g, (x, n) => `el.dataset.a${n}`);

  // 2. Строковые постоянные ПРЯЧУТСЯ: приставка пространства имён и
  //    подмена this/event не должны залезать внутрь строк, иначе
  //    toggleSection('rubrics') превращается в toggleSection('DATA.rubrics').
  const прятки = [];
  t = t.replace(/`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, (x) => {
    прятки.push(x);
    return '\u0001' + (прятки.length - 1) + '\u0001';
  });

  t = t
    .replace(/(?<![.\w$])([A-Za-z_$][\w$]*)(?![\w$])/g, (n) =>
      nsOfName[n] ? nsOfName[n] + '.' + n : n)
    .replace(/(?<![.\w$])this\.value(?![\w$])/g, 'el.value')
    .replace(/(?<![.\w$])this\.checked(?![\w$])/g, 'el.checked')
    .replace(/(?<![.\w$])this\.style(?![\w$])/g, 'el.style')
    .replace(/(?<![.\w$])this(?![\w$])/g, 'el')
    .replace(/(?<![.\w$])event(?![\w$])/g, 'ev');

  const body = t.replace(/\u0001(\d+)\u0001/g, (x, n) => прятки[n]);
  return { body: body.trim().replace(/;$/, ''), args };
}

function нужныеИмена(body) {
  const need = new Map(), ns = new Set();
  for (const m of body.matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)(?![\w$])/g)) {
    const n = m[1];
    if (NS.includes(n)) { ns.add(n); continue; }
    const home = exportsOf.get(n);
    if (!home) continue;
    if (!need.has(home)) need.set(home, new Set());
    need.get(home).add(n);
  }
  return { need, ns };
}

// ── постоянная оснастка ─────────────────────────────────────────────
const HEAD = '// Сгенерировано tools/delegate.mjs — правки вносить туда.\n';
fs.mkdirSync(path.join(ROOT, 'ui'), { recursive: true });

fs.writeFileSync(path.join(ROOT, 'ui/actions.js'), HEAD + `
// Реестр действий разметки. Разметка несёт ИМЯ ДЕЙСТВИЯ, а не имя функции,
// поэтому глобальное пространство имён ей больше не нужно.
//
// Промах по имени ОБЯЗАН шуметь: это единственное, чем делегирование хуже
// встроенного обработчика — строка data-act-click="открыть-концепцию"
// молчаливее, чем onclick="openUniversalModal(…)". Молчаливых отказов в
// этом приложении уже было довольно.
const ДЕЙСТВИЯ = new Map();

export function registerActions(map) {
  for (const имя of Object.keys(map)) {
    if (ДЕЙСТВИЯ.has(имя)) console.error('делегирование: имя действия занято —', имя);
    ДЕЙСТВИЯ.set(имя, map[имя]);
  }
}

export function runAction(имя, el, ev) {
  const fn = ДЕЙСТВИЯ.get(имя);
  if (!fn) { console.error('делегирование: неизвестное действие —', имя, el); return; }
  try { return fn(el, ev); }
  catch (e) { console.error('делегирование: действие «' + имя + '» упало —', e); }
}

export function actionNames() { return [...ДЕЙСТВИЯ.keys()]; }
`);

fs.writeFileSync(path.join(ROOT, 'ui/delegation.js'), HEAD + `
import { runAction } from './actions.js';

// Четыре слушателя на document — больше не нужно.
//   click, change, input   — всплывают;
//   focus НЕ всплывает, поэтому focusin.
// Разметка перерисовывается сорока генераторами, и делегированию это
// родная задача: обработчики не приходится возвращать после перерисовки.
const СОБЫТИЯ = [['click', 'click'], ['change', 'change'],
                 ['input', 'input'], ['focusin', 'focus']];

// mouseenter и mouseleave НЕ ВСПЛЫВАЮТ — делегировать их напрямую нельзя.
// Но всплывающие mouseover и mouseout дают ровно ту же семантику, если
// отбросить переходы ВНУТРИ элемента: вход считается, только когда курсор
// пришёл извне, выход — только когда ушёл наружу. Это стандартная замена,
// и она снимает последнюю нужду в глобальном имени.
const ГРАНИЦЫ = [['mouseover', 'enter'], ['mouseout', 'leave']];

// Подмена window.event на время действия.
//
// Часть кода читает НЕЯВНОЕ ГЛОБАЛЬНОЕ event и берёт из него currentTarget
// (так устроен toggleSection: const header = event.currentTarget). При
// встроенном обработчике currentTarget — сам элемент; при делегировании —
// document, потому что слушатель висит на нём. Поэтому на время вызова
// window.event подменяется прослойкой, у которой currentTarget — тот
// элемент, что нёс имя действия. Всё прочее берётся у настоящего события.
function сПодменойСобытия(ev, el, дело) {
  const своё = Object.getOwnPropertyDescriptor(window, 'event');
  const прослойка = new Proxy(ev, {
    get: function (t, p) {
      if (p === 'currentTarget') return el;
      var v = t[p];
      return typeof v === 'function' ? v.bind(t) : v;
    },
  });
  Object.defineProperty(window, 'event', { configurable: true, value: прослойка });
  try { return дело(прослойка); }
  finally {
    if (своё) Object.defineProperty(window, 'event', своё);
    else delete window.event;      // вернуть встроенный доступ через прототип
  }
}

export function installDelegation(root = document) {
  for (const [событие, признак] of ГРАНИЦЫ) {
    root.addEventListener(событие, ev => {
      const t = ev.target;
      if (!t || !t.closest) return;
      const el = t.closest('[data-act-' + признак + ']');
      if (!el) return;
      // переход внутри самого элемента границей не считается
      const другой = ev.relatedTarget;
      if (другой && el.contains(другой)) return;
      сПодменойСобытия(ev, el, прослойка =>
        runAction(el.getAttribute('data-act-' + признак), el, прослойка));
    });
  }
  for (const [событие, признак] of СОБЫТИЯ) {
    root.addEventListener(событие, ev => {
      const t = ev.target;
      if (!t || !t.closest) return;
      const el = t.closest('[data-act-' + признак + ']');
      if (!el) return;
      сПодменойСобытия(ev, el, прослойка =>
        runAction(el.getAttribute('data-act-' + признак), el, прослойка));
    });
  }
}
`);

// ── заход по статической разметке ───────────────────────────────────
const ATTR = /\bon(click|change|input|focus|mouseover|mouseout|mouseenter|mouseleave)\s*=\s*"([^"]*)"/gi;
const ПРИЗНАК = { click: 'click', change: 'change', input: 'input', focus: 'focus',
                  mouseenter: 'enter', mouseleave: 'leave' };

let переведено = 0, оставлено = 0;
const новые = [];

if (ЗАХОД === 'static') {
  const p = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  html = html.replace(ATTR, (all, ev, code) => {
    const attr = 'on' + ev.toLowerCase();
    const признак = ПРИЗНАК[ev.toLowerCase()];
    if (!признак) { оставлено++; return all; }      // наведение — забота стилей
    const { body, args } = разобрать(code);
    const имя = имяДействия(attr, code);
    карта[имя] = { код: code, attr, тело: body, аргументов: args.length, откуда: 'index.html' };
    новые.push(имя);
    переведено++;
    return `data-act-${признак}="${имя}"`;
  });
  fs.writeFileSync(p, html);
}

// ── ручная статья: modalActions ─────────────────────────────────────
// Единственное место, которое механически не переводится: в разметку
// подставляется НЕ ДАННОЕ, а ИМЯ ФУНКЦИИ и кусок исходного кода
// (`onclick="${saveFn}()"`, deleteArg = "'c1'" или "'a', 'b'"). При
// делегировании имя функции ничего не значит, а куску кода взяться неоткуда.
// Поэтому три места правятся явно: доводы передаются НАБОРОМ ЗНАЧЕНИЙ,
// а вызов идёт через таблицу имён с руганью на промах.
function ручнаяСтатья() {
  const правки = [
    ['modal/edit-common.js',
     'onclick="${saveFn}()"',
     'data-act-click="сохранить-сущность" data-a1="${saveFn}"'],
    ['modal/edit-common.js',
     'onclick="${deleteFn}(${deleteArg})"',
     'data-act-click="удалить-сущность" data-a1="${deleteFn}"' +
     ' data-a2="${(deleteArg || [])[0] || \'\'}" data-a3="${(deleteArg || [])[1] || \'\'}"'],
    ['modal/concept-edit.js',
     "conceptData && conceptData.id ? `'${conceptData.id}'` : 'null'",
     'conceptData && conceptData.id ? [conceptData.id] : []'],
    ['modal/connection-edit.js',
     "(srcId && tgtId) ? `'${srcId}', '${tgtId}'` : ''",
     '(srcId && tgtId) ? [srcId, tgtId] : []'],
    ['modal/philosopher-edit.js',
     "philosopherData ? `'${escapeAttr(philosopherName)}'` : 'null'",
     'philosopherData ? [philosopherName] : []'],
  ];
  for (const [файл, было, стало] of правки) {
    const q = path.join(ROOT, файл);
    let t = fs.readFileSync(q, 'utf8');
    if (t.includes(стало)) continue;
    if (!t.includes(было)) { console.error('ручная статья не нашла место:', файл, было.slice(0, 50)); continue; }
    fs.writeFileSync(q, t.replace(было, стало));
  }
}
ручнаяСтатья();

// таблица «имя функции → сама функция»: нужна только этой статье
{
  const имена = ['saveConceptData', 'savePhilosopherData', 'saveConnectionData',
                 'deleteConcept', 'deletePhilosopher', 'deleteConnection'];
  const need = new Map();
  for (const n of имена) {
    const home = exportsOf.get(n);
    if (!home) continue;
    if (!need.has(home)) need.set(home, new Set());
    need.get(home).add(n);
  }
  let out = HEAD + `import { registerActions } from './actions.js';\n`;
  for (const m of [...need.keys()].sort())
    out += `import { ${[...need.get(m)].sort().join(', ')} } from '${
      path.relative('ui', m).replace(/\\/g, '/').replace(/^(?!\.)/, '../')}';\n`;
  out += `
// Кнопки «Сохранить» и «Удалить» в формах правки: имя обработчика приходит
// из данных, потому что одна и та же полоса кнопок обслуживает концепции,
// философов и связи. Промах по имени — ошибка, а не тишина.
const ПОИМЕНИ = { ${имена.join(', ')} };

function вызватьПоИмени(имя, ...доводы) {
  const fn = ПОИМЕНИ[имя];
  if (!fn) { console.error('делегирование: нет функции по имени —', имя); return; }
  return fn(...доводы.filter(d => d !== undefined && d !== ''));
}

registerActions({
  'сохранить-сущность': (el) => вызватьПоИмени(el.dataset.a1),
  'удалить-сущность': (el) => вызватьПоИмени(el.dataset.a1, el.dataset.a2, el.dataset.a3),
});
`;
  fs.writeFileSync(path.join(ROOT, 'ui/actions-byname.js'), out);
  карта['сохранить-сущность'] = { attr: 'onclick', поимённо: 'save', тело: '', аргументов: 1, откуда: 'ручная статья' };
  карта['удалить-сущность'] = { attr: 'onclick', поимённо: 'delete', тело: '', аргументов: 3, откуда: 'ручная статья' };
  const mp = path.join(ROOT, 'main.js');
  let main = fs.readFileSync(mp, 'utf8');
  if (!main.includes("'./ui/actions-byname.js'"))
    fs.writeFileSync(mp, main.replace(/^import \{ boot \}/m,
      "import './ui/actions-byname.js';\nimport { boot }"));
}

// ── заход по порождаемой разметке ───────────────────────────────────
// Атрибуты живут в шаблонных строках сорока генераторов. Подстановки
// `${…}` уезжают в data-атрибуты, а тело действия читает их из dataset.
// Кавычки вокруг подстановки снимаются: значение и так строка.
const ATTR_JS = /\bon(click|change|input|focus|mouseenter|mouseleave)\s*=\s*(\\?")((?:[^"\\]|\\.)*?)\2/g;

if (ЗАХОД === 'dyn') {
  const файлы = [];
  (function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const q = path.join(d, f);
      if (fs.statSync(q).isDirectory()) { if (f !== 'vendor') walk(q); continue; }
      if (q.endsWith('.js') && !f.startsWith('_ref')) файлы.push(q);
    }
  })(ROOT);

  for (const q of файлы) {
    const rel = path.relative(ROOT, q).replace(/\\/g, '/');
    if (rel.startsWith('ui/actions')) continue;
    let text = fs.readFileSync(q, 'utf8');
    let изменён = false;
    text = text.replace(ATTR_JS, (all, ev, кав, code) => {
      const attr = 'on' + ev.toLowerCase();
      const признак = ПРИЗНАК[ev.toLowerCase()];
      if (!признак) { оставлено++; return all; }
      const чистый = code.replace(/\\"/g, '"').replace(/\\'/g, "'");
      const { body, args } = разобрать(чистый);
      const имя = имяДействия(attr, чистый);
      const уже = карта[имя] !== undefined;
      карта[имя] = { код: чистый, attr, тело: body, аргументов: args.length, откуда: rel };
      поИсходному.set(attr + ' :: ' + чистый, имя);
      if (!уже) новые.push(имя);
      переведено++;
      изменён = true;
      let out = `data-act-${признак}=${кав}${имя}${кав}`;
      args.forEach((выр, i) => { out += ` data-a${i + 1}=${кав}\${${выр}}${кав}`; });
      return out;
    });
    if (изменён) fs.writeFileSync(q, text);
  }
}

// ── сборка модуля с телами ──────────────────────────────────────────
if (новые.length) {
  const файл = `ui/actions-${ЗАХОД}.js`;
  const need = new Map(), ns = new Set();
  for (const имя of новые) {
    const r = нужныеИмена(карта[имя].тело);
    for (const [m, s] of r.need) {
      if (!need.has(m)) need.set(m, new Set());
      s.forEach(x => need.get(m).add(x));
    }
    r.ns.forEach(x => ns.add(x));
  }
  const rel = to => {
    let r = path.relative(path.dirname(файл), to).replace(/\\/g, '/');
    return r.startsWith('.') ? r : './' + r;
  };
  let out = HEAD + `import { registerActions } from './actions.js';\n`;
  if (ns.size) out += `import { ${[...ns].sort().join(', ')} } from '${rel('core/ns.js')}';\n`;
  for (const m of [...need.keys()].sort())
    out += `import { ${[...need.get(m)].sort().join(', ')} } from '${rel(m)}';\n`;
  out += `\nregisterActions({\n`;
  for (const имя of новые)
    out += `  ${JSON.stringify(имя)}: (el, ev) => { ${карта[имя].тело}; },\n`;
  out += `});\n`;
  fs.writeFileSync(path.join(ROOT, файл), out);

  // подключить в main.js и поставить делегирование
  const mp = path.join(ROOT, 'main.js');
  let main = fs.readFileSync(mp, 'utf8');
  if (!main.includes(`'./${файл}'`))
    main = main.replace(/^import \{ boot \}/m, `import './${файл}';\nimport { boot }`);
  if (!main.includes('installDelegation'))
    main = main.replace(/^import \{ boot \}/m,
      `import { installDelegation } from './ui/delegation.js';\nimport { boot }`);
  if (!main.includes('installDelegation()'))
    main = main.replace(/^installBridge\(\);.*$/m,
      'installDelegation();      // делегирование: разметка несёт имя действия\n$&');
  fs.writeFileSync(mp, main);
}

fs.writeFileSync(mapFile, JSON.stringify(карта, null, 1));
console.log(`заход «${ЗАХОД}»: переведено ${переведено}, оставлено ${оставлено}, ` +
  `всего в реестре ${Object.keys(карта).length}`);
