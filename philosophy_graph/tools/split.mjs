#!/usr/bin/env node
// Разбивка philosophy_graph.html на ES6-модули.
//
// Правила (все механические, никакого ручного переписывания):
//  1. Модуль сущности берётся из assign2.json (карта + спецификация).
//  2. Данные (6 массивов) уезжают в JSON и грузятся fetch'ем в DATA.
//  3. Пространства имён: DATA — данные и производные указатели,
//     S — изменяемое и отложенное, MET — метрики, зовомые по имени,
//     VIEWS — генераторы окон, зовомые по имени.
//  4. Объявление, чей начальный вид не чист (трогает document/d3/DATA),
//     становится ячейкой S и заполняется при запуске.
//  5. ВЕСЬ исполняемый код верхнего уровня переезжает в boot.js в том же
//     порядке — так порядок запуска сохраняется дословно.
//  6. Модули после этого содержат только объявления, поэтому взаимные
//     импорты безопасны.
//  7. bridge.js выставляет в window то, что зовёт разметка, — через
//     геттеры и сеттеры, поэтому разметку править не нужно.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import * as acorn from 'acorn';
const eslintScope = require('eslint-scope');

const SRC = process.argv[3] || '/home/claude/build/orig_v3.html';
const OUT = process.argv[2] || '/home/claude/build/src';
const src = fs.readFileSync(SRC, 'utf8');

// ── разбор ─────────────────────────────────────────────────────────
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
let blocks = [], m;
while ((m = re.exec(src)) !== null) blocks.push({ i: m.index, all: m[0], code: m[1] });
const blk = blocks.slice().sort((a, b) => b.code.length - a.code.length)[0];
const code = blk.code;
const codeStart = blk.i + blk.all.indexOf('>') + 1;

const ast = acorn.parse(code, { ecmaVersion: 2023, sourceType: 'script', ranges: true });
const sm = eslintScope.analyze(ast, { ecmaVersion: 2023, sourceType: 'script' });
const gs = sm.globalScope;

// РАСКЛАДКА ПО ИМЕНАМ, а не по строкам. Имена устойчивы, номера строк —
// нет: одна вставка в исходник сдвигает всё после себя, и тридцать чужих
// сущностей молча уезжают в соседние модули (замерено). Диапазоны нужны
// были ровно один раз — чтобы разложить 730 сущностей впервые.
const assignNames = JSON.parse(fs.readFileSync(
  process.argv[4] || '/home/claude/assign_names.json', 'utf8')).по_имени;
const mapJson = JSON.parse(fs.readFileSync(
  process.argv[5] || '/home/claude/globals_map_v3.json', 'utf8'));
const assign2 = { state: [] };

// ── перечень сущностей верхнего уровня (тот же порядок, что в карте) ─
const entities = [];   // {name|null, kind, range, node, decl}
let stmtNo = 0;
for (const node of ast.body) {
  if (node.type === 'FunctionDeclaration') {
    entities.push({ name: node.id.name, decl: 'function', node, range: node.range, async: node.async });
  } else if (node.type === 'VariableDeclaration') {
    for (const dcl of node.declarations) {
      if (dcl.id.type !== 'Identifier') continue;
      entities.push({ name: dcl.id.name, decl: node.kind, node: dcl, range: dcl.range,
                      declNode: node, init: dcl.init });
    }
  } else {
    stmtNo++;
    entities.push({ name: null, id: `stmt${String(stmtNo).padStart(3, '0')}`, decl: 'statement',
                    node, range: node.range });
  }
}
const byName = new Map(entities.filter(e => e.name).map(e => [e.name, e]));

// Мёртвые сущности живут в dead.js — это записано в раскладке, а не
// перечнем внутри программы: раскладка должна быть единственным источником.

// ── пространства имён ──────────────────────────────────────────────
const RAW_DATA = ['traditions', 'philosophers', 'rubrics', 'relationTypes', 'concepts', 'relations'];
const DERIVED = ['philosopherIdToName', 'philosopherConcepts', 'philosopherOrder',
                 'relationTypesObj', 'linkColors', 'conceptToRubrics', 'rubricsObj',
                 'philosopherTraditions', 'nodes', 'links'];
const DATA_NAMES = new Set([...RAW_DATA, ...DERIVED]);

// метрики, зовомые по имени: ключи METRIC_FLAGS + словарь в toggleMetricVisualization
const metFlags = byName.get('METRIC_FLAGS');
const MET_NAMES = new Set();
for (const p of metFlags.init.properties) {
  const n = p.key.name || p.key.value;
  if (byName.has(n)) MET_NAMES.add(n);
}
for (const r of mapJson.nameRefs) if (byName.has(r.name)) {
  const e = byName.get(r.name);
  if (/Index$|^calculate|^generativity$|^deductiveDepth$|Pattern$/.test(r.name) && e.decl === 'function')
    MET_NAMES.add(r.name);
}
const VIEW_NAMES = new Set(['generateConceptViewContent', 'generatePhilosopherViewContent',
  'generateConnectionViewContent', 'generateConceptEditContent',
  'generatePhilosopherEditContent', 'generateConnectionEditContent']);

// ── карта модулей (нужна до отбора отложенного) ─────────────────────
const moduleOfLate = new Map();     // имя сущности | stmtNNN -> модуль
const безМодуля = [];
for (const e of entities) {
  if (e.decl === 'statement') { moduleOfLate.set(e.id, 'boot.js'); continue; }
  if (RAW_DATA.includes(e.name)) continue;
  const m = assignNames[e.name];
  if (!m) { безМодуля.push(e.name + ' (стр. ' + lineIn(e.range[0]) + ')'); continue; }
  moduleOfLate.set(e.name, m);
}
if (безМодуля.length) {
  // Новая сущность требует ЯВНОГО решения, куда её отнести: молча
  // расселять по соседству — как раз то, от чего уходим.
  console.error('нет модуля для ' + безМодуля.length + ' имён:\n  ' + безМодуля.join('\n  '));
  process.exit(1);
}

// изменяемое и отложенное
const STATE_NAMES = new Set(assign2.state.filter(n => byName.has(n)));

// РАЗМЕТКА ТОЖЕ ПИШЕТ В ГЛОБАЛЬНЫЕ, а этих записей в коде нет вовсе:
// `oninput="_pairsMinDegree=+this.value; renderClosestPairs()"` живёт в
// строке шаблона, разбор её не видит. Такие имена обязаны стать ячейками
// общего состояния: после делегирования тело действия — настоящий код в
// чужом модуле, а присвоить ввезённому имени нельзя.
for (const h of [...mapJson.markup.static, ...mapJson.markup.dynamic]) {
  for (const m of h.code.matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)\s*=(?!=)/g)) {
    if (byName.has(m[1])) STATE_NAMES.add(m[1]);
  }
}

// ВВЕЗЁННОМУ ИМЕНИ ПРИСВОИТЬ НЕЛЬЗЯ: всякое let/var, в которое пишут
// из чужого модуля, обязано стать ячейкой S. Считается по окончательной
// раскладке, а не по черновой (иначе visibleNodeIds уезжает в core/,
// а пишет в него filters/ — и присвоение падает уже в браузере).
{
  // ВЕСЬ код верхнего уровня уезжает в boot.js, поэтому его записи в
  // модульные let становятся МЕЖМОДУЛЬНЫМИ, даже если спека держала
  // оператор и переменную в одном модуле. Иначе обработчик наведения
  // падает на первом же движении мыши: tooltipTimeout ввезён, а ему
  // присваивают.
  const homeOfEntity = (e) => e.decl === 'statement' ? 'boot.js'
    : (moduleOfLate.get(e.name) || null);
  for (const e of mapJson.entities) {
    const src = homeOfEntity(e);
    for (const u of e.uses || []) {
      if (!u.writes) continue;
      const t = byName.get(u.name);
      if (!t || (t.decl !== 'let' && t.decl !== 'var')) continue;
      const home = moduleOfLate.get(u.name);
      if (home && src && home !== src) STATE_NAMES.add(u.name);
    }
  }
}

// имена, к которым обращается начальный вид объявления
function initRefs(e) {
  const out = new Set();
  if (!e.init) return out;
  (function walk(n) {
    if (!n || typeof n.type !== 'string') return;
    if (n.type === 'Identifier') out.add(n.name);
    if (n.type === 'MemberExpression' && !n.computed) { walk(n.object); return; }
    if (n.type === 'Property' && !n.computed && n.key.type === 'Identifier') { walk(n.value); return; }
    for (const k of Object.keys(n)) {
      if (k === 'range') continue;
      const v = n[k];
      if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walk(c));
      else if (v && typeof v.type === 'string') walk(v);
    }
  })(e.init);
  return out;
}
const ENV = new Set(['document', 'window', 'd3', 'localStorage', 'performance', 'navigator']);

// отложено: трогает окружение, данные или другую отложенную ячейку.
// Считается до неподвижной точки — иначе `const ctx = gfxCanvas.getContext()`
// исполнится при ввозе модуля, когда gfxCanvas ещё пуст.
{
  let changed = true;
  while (changed) {
    changed = false;
    for (const e of entities) {
      if (!e.name || e.decl === 'function' || e.decl === 'statement') continue;
      if (DATA_NAMES.has(e.name) || MET_NAMES.has(e.name) || VIEW_NAMES.has(e.name)) continue;
      if (STATE_NAMES.has(e.name)) continue;
      let defer = (e.decl === 'let' || e.decl === 'var') && !e.init;
      if (!defer) {
        for (const r of initRefs(e)) {
          // MET и VIEWS заполняются при исполнении тел модулей, поэтому
          // объявление, читающее их в начальном виде, тоже откладывается:
          // иначе METRIC_COVERAGE_FN соберётся из одних undefined.
          if (ENV.has(r) || DATA_NAMES.has(r) || STATE_NAMES.has(r)
              || MET_NAMES.has(r) || VIEW_NAMES.has(r)) { defer = true; break; }
        }
      }
      if (defer) { STATE_NAMES.add(e.name); changed = true; }
    }
  }
}
for (const n of DATA_NAMES) STATE_NAMES.delete(n);
for (const n of MET_NAMES) STATE_NAMES.delete(n);

const nsOf = (n) => DATA_NAMES.has(n) ? 'DATA' : MET_NAMES.has(n) ? 'MET'
  : VIEW_NAMES.has(n) ? 'VIEWS' : STATE_NAMES.has(n) ? 'S' : null;

// ── карта модулей ──────────────────────────────────────────────────
const moduleOf = moduleOfLate;
function modPath(mod) {
  if (mod === 'data/*.json') return 'core/store.js';
  if (mod === 'main.js') return 'boot-defs.js';   // main.js пишется отдельно
  return mod;
}

// ── переименование ссылок ──────────────────────────────────────────
// собираем правки как {start,end,text}
const edits = [];
const declIdRanges = new Set();
for (const v of gs.variables) for (const def of v.defs) if (def.name) declIdRanges.add(def.name.range.join(':'));

// найти узел-родителя для сокращённой записи свойств
const shorthandKeys = new Set();
(function walk(n) {
  if (!n || typeof n.type !== 'string') return;
  if (n.type === 'Property' && n.shorthand && n.value && n.value.type === 'Identifier')
    shorthandKeys.add(n.value.range.join(':'));
  for (const k of Object.keys(n)) {
    if (k === 'range') continue;
    const v = n[k];
    if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walk(c));
    else if (v && typeof v.type === 'string') walk(v);
  }
})(ast);

for (const v of gs.variables) {
  const ns = nsOf(v.name);
  if (!ns) continue;
  for (const ref of v.references) {
    const id = ref.identifier;
    if (declIdRanges.has(id.range.join(':'))) continue;
    const key = id.range.join(':');
    const text = shorthandKeys.has(key) ? `${v.name}: ${ns}.${v.name}` : `${ns}.${v.name}`;
    edits.push({ start: id.range[0], end: id.range[1], text });
  }
}
edits.sort((a, b) => a.start - b.start);

// Пять мест зовут по склеенному имени через window[…]. В модулях это не
// работает вовсе, поэтому обращение переводится на нужное пространство имён.
const NS_DISPATCH = {
  modalContentFor: [[/window\[/g, 'VIEWS[']],
  installMetricScopeWrappers: [[/window\[/g, 'MET[']],
  toggleMetricVisualization: [[/window\[/g, 'MET[']],
};

// Единственный намеренный глобальный объект в window: не мост, а состояние
// выбора концепции с графа. Уезжает в S вместе с остальным изменяемым.
const WINDOW_PROPS = [[/\bwindow\.graphSelectionContext\b/g, 'S.graphSelectionContext']];

function render(from, to) {          // кусок исходника с применёнными правками
  let out = '', pos = from;
  for (const ed of edits) {
    if (ed.start < from || ed.end > to) continue;
    out += code.slice(pos, ed.start) + ed.text;
    pos = ed.end;
  }
  out += code.slice(pos, to);
  for (const [re_, to_] of WINDOW_PROPS) out = out.replace(re_, to_);
  return out;
}

// ── данные в JSON ──────────────────────────────────────────────────
fs.mkdirSync(path.join(OUT, 'data'), { recursive: true });
{
  const parts = RAW_DATA.map(n => code.slice(byName.get(n).declNode.range[0], byName.get(n).range[1]) + ';');
  const script = parts.join('\n') + '\n' +
    `module.exports = {${RAW_DATA.join(',')}};`;
  fs.writeFileSync('/tmp/data_extract.cjs', script);
  const data = require('/tmp/data_extract.cjs');
  for (const n of RAW_DATA)
    fs.writeFileSync(path.join(OUT, 'data', n + '.json'), JSON.stringify(data[n], null, 1));
}

// ── распределение текста по модулям ────────────────────────────────
const files = new Map();            // путь -> массив кусков
const bootChunks = [];              // {line, text}
const add = (mod, text) => {
  const p = modPath(mod);
  if (!files.has(p)) files.set(p, []);
  files.get(p).push(text);
};

// Операторы, строящие производные указатели, — это все, что стоят ДО
// объявления links. Привязка к соседу устойчива к вставкам где угодно ещё,
// в отличие от перечня stmt001…stmt008.
const границаИндекса = (byName.get('links') || { range: [0, 0] }).range[1];
const indexChunks = [];

for (const e of entities) {
  const mod = moduleOf.get(e.name || e.id);
  if (e.decl === 'statement') {
    const text = render(e.range[0], e.range[1]);
    if (e.range[0] < границаИндекса) indexChunks.push(text);
    else bootChunks.push({ line: e.range[0], text });
    continue;
  }
  if (RAW_DATA.includes(e.name)) continue;                 // уехало в JSON
  const ns = nsOf(e.name);
  if (DERIVED.includes(e.name)) {
    indexChunks.push(`DATA.${e.name} = ` + render(e.init.range[0], e.init.range[1]) + ';');
    continue;
  }
  if (e.decl === 'function') {
    let body = render(e.range[0], e.range[1]);
    for (const [re_, to_] of (NS_DISPATCH[e.name] || [])) body = body.replace(re_, to_);
    if (ns) add(mod, `${ns}.${e.name} = ` + body.replace(/^(async\s+)?function\s+/, (s, a) => (a || '') + 'function ') + ';');
    else add(mod, body);
  } else {
    const init = e.init ? render(e.init.range[0], e.init.range[1]) : 'undefined';
    if (ns === 'S') {
      bootChunks.push({ line: e.range[0], text: `S.${e.name} = ${init};` });
    } else if (ns) {
      add(mod, `${ns}.${e.name} = ${init};`);
    } else {
      add(mod, `${e.declNode.kind} ${e.name} = ${init};`);
    }
  }
}

// ── что каждый модуль должен ввозить ───────────────────────────────
const homeOf = new Map();           // имя -> модуль (для не-пространственных)
for (const e of entities) if (e.name && !nsOf(e.name) && !RAW_DATA.includes(e.name))
  homeOf.set(e.name, modPath(moduleOf.get(e.name)));

function importsFor(text, selfPath) {
  const need = new Map();           // модуль -> Set(имена)
  const ns = new Set();
  // Имя, помянутое в ПОЯСНЕНИИ, ввоза не требует: без этого
  // metrics/philosophical.js ввозил TENSION_WEIGHTS ради одной строки
  // комментария о том, что эта постоянная сохранена намеренно.
  text = text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
  for (const [name, home] of homeOf) {
    if (home === selfPath) continue;
    if (new RegExp('(?<![.\\w$])' + name.replace(/\$/g, '\\$') + '(?![\\w$])').test(text)) {
      if (!need.has(home)) need.set(home, new Set());
      need.get(home).add(name);
    }
  }
  for (const n of ['DATA', 'S', 'MET', 'VIEWS'])
    if (new RegExp('(?<![.\\w$])' + n + '[.\\[]').test(text)) ns.add(n);
  return { need, ns };
}
function rel(from, to) {
  let r = path.relative(path.dirname(from), to).replace(/\\/g, '/');
  if (!r.startsWith('.')) r = './' + r;
  return r;
}

// ── сборка файлов ──────────────────────────────────────────────────
const HEAD = '// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.\n';

// пространства имён
fs.mkdirSync(path.join(OUT, 'core'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'core/ns.js'), HEAD + `
// DATA   — данные и производные указатели (заполняются при запуске)
// S      — изменяемое состояние и отложенные ячейки
// MET    — метрики, к которым обращаются по имени
// VIEWS  — генераторы окон, к которым обращаются по имени
export const DATA = {};
export const S = {};
export const MET = {};
export const VIEWS = {};
`);

// загрузка данных
fs.writeFileSync(path.join(OUT, 'data/load.js'), HEAD + `
import { DATA } from '../core/ns.js';

const FILES = ${JSON.stringify(RAW_DATA)};

export async function loadData(base = './data/') {
  const got = await Promise.all(FILES.map(n =>
    fetch(base + n + '.json').then(r => {
      if (!r.ok) throw new Error('не читается ' + n + '.json: ' + r.status);
      return r.json();
    })));
  FILES.forEach((n, i) => { DATA[n] = got[i]; });
  return DATA;
}
`);

// производные указатели
{
  const body = indexChunks.join('\n\n');
  const { need, ns } = importsFor(body, 'core/graph-index.js');
  let head = HEAD + `import { ${[...ns, 'DATA'].filter((v, i, a) => a.indexOf(v) === i).join(', ')} } from './ns.js';\n`;
  for (const [mod, names] of need)
    head += `import { ${[...names].sort().join(', ')} } from '${rel('core/graph-index.js', mod)}';\n`;
  const prev = files.get('core/graph-index.js') || [];
  files.set('core/graph-index.js', prev);
  fs.mkdirSync(path.join(OUT, 'core'), { recursive: true });
  files.set('core/graph-index.js', [...prev,
    `export function buildIndexes() {\n${body.split('\n').map(l => '  ' + l).join('\n')}\n}`]);
}

// остальные модули
for (const [p, chunks] of files) {
  const body = chunks.join('\n\n');
  const { need, ns } = importsFor(body, p);
  let head = HEAD;
  if (ns.size) head += `import { ${[...ns].sort().join(', ')} } from '${rel(p, 'core/ns.js')}';\n`;
  for (const [mod, names] of [...need].sort())
    head += `import { ${[...names].sort().join(', ')} } from '${rel(p, mod)}';\n`;
  // экспортируем всё своё непространственное
  const own = entities.filter(e => e.name && homeOf.get(e.name) === p).map(e => e.name);
  const tail = own.length ? `\nexport { ${own.sort().join(', ')} };\n` : '';
  const full = head + '\n' + body + '\n' + tail;
  const fp = path.join(OUT, p);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, full);
}

// вспомогательное: события загрузки к моменту запуска уже прошли
fs.writeFileSync(path.join(OUT, 'core/ready.js'), HEAD + `
// Модульный сценарий откладывается, а запуск ещё и ждёт fetch, поэтому
// DOMContentLoaded и load к этому времени УЖЕ ПРОШЛИ, и подписка на них
// не сработает никогда. Эти две обёртки зовут обработчик сразу, если
// событие позади, и подписываются, если ещё нет.
export function onReady(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}
export function onLoad(fn) {
  if (document.readyState === 'complete') fn();
  else window.addEventListener('load', fn);
}
`);

// запуск
{
  bootChunks.sort((a, b) => a.line - b.line);
  let body = bootChunks.map(c => c.text).join('\n\n');
  body = body
    .replace(/document\.addEventListener\(\s*'DOMContentLoaded'\s*,\s*/g, 'onReady(')
    .replace(/window\.addEventListener\(\s*'load'\s*,\s*/g, 'onLoad(');
  const { need, ns } = importsFor(body, 'boot.js');
  let head = HEAD;
  head += `import { DATA, S, MET, VIEWS } from './core/ns.js';\n`;
  head += `import { loadData } from './data/load.js';\n`;
  head += `import { buildIndexes } from './core/graph-index.js';\n`;
  head += `import { onReady, onLoad } from './core/ready.js';\n`;
  for (const [mod, names] of [...need].sort())
    if (mod !== 'core/graph-index.js')
      head += `import { ${[...names].sort().join(', ')} } from '${rel('boot.js', mod)}';\n`;
    else
      head += `import { ${[...names].sort().join(', ')} } from './core/graph-index.js';\n`;
  fs.writeFileSync(path.join(OUT, 'boot.js'), head + `
export async function boot() {
  await loadData();
  buildIndexes();
${body.split('\n').map(l => '  ' + l).join('\n')}
}
`);
}

// мост в разметку: остаётся ТОЛЬКО пока в разметке есть встроенные
// обработчики. После делегирования его снимает tools/unbridge.mjs.
{
  // Имена из атрибутов — и ЕЩЁ имена, которые разметка подставляет строкой.
  // modalActions пишет onclick="${saveFn}()", и в разборе разметки такого
  // имени не видно вовсе. Без этого saveConceptData и пять его товарищей
  // не попадают в мост, а нажатие «Сохранить» даёт ReferenceError.
  const строкой = mapJson.nameRefs
    .filter(r => byName.has(r.name) && byName.get(r.name).decl === 'function')
    .map(r => r.name);
  const fns = [...new Set([
    ...mapJson.markup.byName.filter(r => r.defined).map(r => r.name),
    ...строкой,
  ])];
  const vars = fns.filter(n => nsOf(n));
  const plain = fns.filter(n => !nsOf(n));
  const extra = ['nodes', 'links', 'concepts', 'relations', 'philosophers',
    'isStatsModalOpen', '_pcmpA', '_pcmpB', '_pairsKind', '_philPairsKind',
    '_pairsMinDegree', '_pairsMinShared', '_pairsCrossAuthor', '_pairsCrossTradition',
    'graphSelectionContext'].filter(n => byName.has(n) || DATA_NAMES.has(n));
  const need = new Map();
  for (const n of plain) {
    const home = homeOf.get(n);
    if (!home) continue;
    if (!need.has(home)) need.set(home, new Set());
    need.get(home).add(n);
  }
  let head = HEAD + `// ДОЛГ. Выставляет в window то, что ещё зовёт разметка.\n` +
    `// Считается tools/bridge_debt.py, цель — ноль.\n` +
    `import { DATA, S, MET, VIEWS } from './core/ns.js';\n`;
  for (const [mod, names] of [...need].sort())
    head += `import { ${[...names].sort().join(', ')} } from '${rel('bridge.js', mod)}';\n`;
  let body = '\nexport function installBridge() {\n';
  for (const n of plain) if (homeOf.has(n)) body += `  window.${n} = ${n};\n`;
  for (const n of [...new Set([...vars, ...extra])]) {
    const ns = nsOf(n);
    if (!ns) continue;
    body += `  Object.defineProperty(window, '${n}', { configurable: true, ` +
      `get: () => ${ns}.${n}, set: v => { ${ns}.${n} = v; } });\n`;
  }
  body += '}\n';
  fs.writeFileSync(path.join(OUT, 'bridge.js'), head + body);
}

// точка входа
{
// Модули, которые только записывают себя в MET/VIEWS, никто не ввозит по
// имени — без явного ввоза их тело не исполнится и запись не случится.
const all = [...files.keys()].sort();
fs.writeFileSync(path.join(OUT, 'main.js'), HEAD + `
${all.map(p => `import './${p}';`).join('\n')}

import { boot } from './boot.js';
import { installBridge } from './bridge.js';

installBridge();          // ДОЛГ: пока разметка зовёт функции по имени
boot().catch(err => {
  console.error('запуск не удался:', err);
  const el = document.getElementById('filterStats');
  if (el) el.textContent = 'Ошибка запуска: ' + err.message;
});
`);
}

// index.html — разметка без скрипта; d3 переезжает из сети к себе
{
  fs.mkdirSync(path.join(OUT, 'vendor'), { recursive: true });
  fs.copyFileSync('/home/claude/node_modules/d3/dist/d3.min.js',
                  path.join(OUT, 'vendor/d3.min.js'));
  let html = src.slice(0, blk.i) + '  <script type="module" src="./main.js"></script>' +
    src.slice(blk.i + blk.all.length);
  html = html.replace(/<script src="https:\/\/cdnjs\.cloudflare\.com[^"]*d3[^"]*"><\/script>/,
                      '<script src="./vendor/d3.min.js"></script>');
  fs.writeFileSync(path.join(OUT, 'index.html'), html);
}

// перечень имён по пространствам — нужен переводу на делегирование:
// тела действий пишутся настоящим кодом, и `_pairsKind='profile'` из
// атрибута обязано стать `S._pairsKind='profile'`
{
  const ns = {};
  for (const n of DATA_NAMES) ns[n] = 'DATA';
  for (const n of MET_NAMES) ns[n] = 'MET';
  for (const n of VIEW_NAMES) ns[n] = 'VIEWS';
  for (const n of STATE_NAMES) ns[n] = 'S';
  fs.writeFileSync(path.join(OUT, 'namespaces.json'), JSON.stringify(ns, null, 1));
}

console.log('модулей записано:', files.size + 5,
  '| в boot:', bootChunks.length,
  '| DATA:', DATA_NAMES.size, '| S:', STATE_NAMES.size,
  '| MET:', MET_NAMES.size, '| VIEWS:', VIEW_NAMES.size);
