#!/usr/bin/env node
// Карта глобальных сущностей одностраничного приложения.
// Вход: html-файл с одним встроенным блоком <script>.
// Выход: json со списком глобальных сущностей, их взаимных ссылок,
// обработчиков событий и вызовов из разметки.
//
// Разбор настоящим парсером (acorn) + разрешение имён (eslint-scope),
// поэтому затенённые локальные имена не путаются с глобальными.

import fs from 'node:fs';
import * as acorn from 'acorn';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const eslintScope = require('eslint-scope');

const file = process.argv[2];
const out = process.argv[3] || 'globals_map.json';
const src = fs.readFileSync(file, 'utf8');

// ── 1. Вырезаем встроенный блок скрипта ────────────────────────────
const scriptRe = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
let m, blocks = [];
while ((m = scriptRe.exec(src)) !== null) {
  blocks.push({ start: m.index + m[0].indexOf('>') + 1, code: m[1] });
}
if (!blocks.length) { console.error('нет встроенного скрипта'); process.exit(1); }
// берём самый большой
blocks.sort((a, b) => b.code.length - a.code.length);
const block = blocks[0];
const code = block.code;
const offset = block.start;

const lineOf = (absPos) => src.slice(0, absPos).split('\n').length;
const lineIn = (pos) => lineOf(offset + pos);

// ── 2. Разбор ──────────────────────────────────────────────────────
const ast = acorn.parse(code, {
  ecmaVersion: 2023, sourceType: 'script', locations: true, ranges: true,
});
const scopeManager = eslintScope.analyze(ast, {
  ecmaVersion: 2023, sourceType: 'script', ignoreEval: true,
});
const globalScope = scopeManager.globalScope;

// ── 3. Перечень глобальных сущностей верхнего уровня ────────────────
const entities = [];   // {id,name,kind,async,line,endLine,range,params,value,label}

function snippet(node, n = 70) {
  const s = code.slice(node.range[0], node.range[1]).replace(/\s+/g, ' ').trim();
  return s.length > n ? s.slice(0, n) + '…' : s;
}
function paramsOf(fn) {
  return (fn.params || []).map(p => {
    if (p.type === 'Identifier') return p.name;
    if (p.type === 'AssignmentPattern' && p.left.type === 'Identifier') return p.left.name + '=…';
    if (p.type === 'RestElement' && p.argument.type === 'Identifier') return '...' + p.argument.name;
    if (p.type === 'ObjectPattern') return '{…}';
    if (p.type === 'ArrayPattern') return '[…]';
    return '?';
  });
}
function valueKind(init) {
  if (!init) return 'без значения';
  switch (init.type) {
    case 'ArrayExpression': return `массив (${init.elements.length})`;
    case 'ObjectExpression': return `объект (${init.properties.length})`;
    case 'Literal': return typeof init.value === 'string'
      ? `строка` : `литерал ${JSON.stringify(init.value)}`;
    case 'NewExpression': return `new ${init.callee.name || snippet(init.callee, 20)}`;
    case 'CallExpression': return `вызов ${snippet(init.callee, 30)}()`;
    case 'MemberExpression': return `ссылка ${snippet(init, 30)}`;
    case 'TemplateLiteral': return 'шаблонная строка';
    case 'UnaryExpression': case 'BinaryExpression': case 'LogicalExpression':
    case 'ConditionalExpression': return 'выражение';
    default: return init.type;
  }
}
// как назвать оператор верхнего уровня
function classifyStatement(node) {
  let kind = 'оператор', label = snippet(node, 70), event = null, target = null;
  if (node.type === 'ExpressionStatement') {
    const e = node.expression;
    if (e.type === 'CallExpression') {
      const cal = e.callee;
      if (cal.type === 'MemberExpression' && cal.property.name === 'addEventListener') {
        kind = 'обработчик';
        target = snippet(cal.object, 40);
        event = e.arguments[0] && e.arguments[0].type === 'Literal' ? e.arguments[0].value : '?';
        label = `${target}.addEventListener('${event}')`;
      } else if (cal.type === 'MemberExpression' && cal.property.name === 'on'
                 && e.arguments[0] && e.arguments[0].type === 'Literal') {
        kind = 'обработчик';
        target = snippet(cal.object, 40);
        event = e.arguments[0].value;
        label = `${target}.on('${event}')`;
      } else if (cal.type === 'MemberExpression' &&
                 ['forEach', 'map', 'filter', 'sort'].includes(cal.property.name)) {
        kind = 'построение';
        label = `${snippet(cal.object, 40)}.${cal.property.name}(…)`;
      } else if (cal.type === 'FunctionExpression' || cal.type === 'ArrowFunctionExpression') {
        kind = 'самовызов'; label = '(function(){…})()';
      } else {
        kind = 'вызов'; label = snippet(cal, 50) + '()';
      }
    } else if (e.type === 'AssignmentExpression') {
      const left = snippet(e.left, 50);
      if (/\.on[a-z]+$/i.test(left) || /^window\.on/i.test(left)) {
        kind = 'обработчик';
        event = left.split('.').pop();
        target = left.replace(/\.[^.]+$/, '');
        label = `${left} = …`;
      } else { kind = 'присваивание'; label = `${left} = …`; }
    }
  } else if (node.type === 'IfStatement') { kind = 'условие'; }
  else if (/For|While/.test(node.type)) { kind = 'цикл'; }
  else if (node.type === 'TryStatement') { kind = 'try'; }
  return { kind, label, event, target };
}

let stmtNo = 0;
for (const node of ast.body) {
  const base = { range: node.range, line: lineIn(node.range[0]), endLine: lineIn(node.range[1]) };
  if (node.type === 'FunctionDeclaration') {
    entities.push({ ...base, id: node.id.name, name: node.id.name,
      kind: node.async ? 'async function' : 'function',
      async: !!node.async, generator: !!node.generator,
      params: paramsOf(node), decl: 'function' });
  } else if (node.type === 'ClassDeclaration') {
    entities.push({ ...base, id: node.id.name, name: node.id.name, kind: 'class', decl: 'class' });
  } else if (node.type === 'VariableDeclaration') {
    for (const d of node.declarations) {
      const names = d.id.type === 'Identifier' ? [d.id.name]
        : code.slice(d.id.range[0], d.id.range[1]).match(/[A-Za-z_$][\w$]*/g) || ['?'];
      const isFn = d.init && (d.init.type === 'ArrowFunctionExpression' || d.init.type === 'FunctionExpression');
      for (const nm of names) {
        entities.push({ ...base,
          line: lineIn(d.range[0]), endLine: lineIn(d.range[1]),
          range: d.range, id: nm, name: nm,
          kind: isFn ? (d.init.async ? `async ${node.kind}-функция` : `${node.kind}-функция`) : node.kind,
          async: isFn ? !!d.init.async : false,
          params: isFn ? paramsOf(d.init) : null,
          value: isFn ? null : valueKind(d.init),
          decl: node.kind });
      }
    }
  } else {
    const c = classifyStatement(node);
    stmtNo += 1;
    entities.push({ ...base, id: `stmt${String(stmtNo).padStart(3, '0')}`,
      name: c.label, kind: c.kind, event: c.event, target: c.target,
      decl: 'statement', statement: true });
  }
}

// поиск сущности, охватывающей позицию
const byRange = entities.slice().sort((a, b) => a.range[0] - b.range[0]);
function ownerOf(pos) {
  let lo = 0, hi = byRange.length - 1, res = null;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1, e = byRange[mid];
    if (pos < e.range[0]) hi = mid - 1;
    else if (pos > e.range[1]) lo = mid + 1;
    else { res = e; break; }
  }
  return res;
}

// ── 4. Ссылки между глобальными сущностями ─────────────────────────
const byName = new Map();
for (const e of entities) if (!e.statement) byName.set(e.name, e);
for (const e of entities) { e.uses = new Map(); e.usedBy = new Map(); }

const declRanges = new Set();
for (const v of globalScope.variables) for (const def of v.defs)
  if (def.name) declRanges.add(def.name.range.join(':'));

const undeclared = new Map();

for (const v of globalScope.variables) {
  const target = byName.get(v.name);
  for (const ref of v.references) {
    const idn = ref.identifier;
    if (declRanges.has(idn.range.join(':'))) continue;   // само объявление
    const owner = ownerOf(idn.range[0]);
    if (!owner || !target) continue;
    const isCall = ref.identifier.parent === undefined ? null : null;
    const key = target.id;
    if (owner.id === key) { owner.recursive = true; continue; }
    const rec = owner.uses.get(key) || { count: 0, write: 0 };
    rec.count += 1; if (ref.isWrite()) rec.write += 1;
    owner.uses.set(key, rec);
    const rec2 = target.usedBy.get(owner.id) || { count: 0 };
    rec2.count += 1; target.usedBy.set(owner.id, rec2);
  }
}
// необъявленные имена (браузер, d3, опечатки)
for (const ref of globalScope.through) {
  const nm = ref.identifier.name;
  const rec = undeclared.get(nm) || { name: nm, count: 0, owners: new Set() };
  rec.count += 1;
  const o = ownerOf(ref.identifier.range[0]);
  if (o) rec.owners.add(o.id);
  undeclared.set(nm, rec);
}

// отметка «вызывается как функция» — по узлам CallExpression
const callCounts = new Map();          // owner.id -> Map(name->count)
(function walkCalls(node, parent) {
  if (!node || typeof node.type !== 'string') return;
  if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
    const o = ownerOf(node.range[0]);
    if (o && byName.has(node.callee.name)) {
      const mm = callCounts.get(o.id) || new Map();
      mm.set(node.callee.name, (mm.get(node.callee.name) || 0) + 1);
      callCounts.set(o.id, mm);
    }
  }
  for (const k of Object.keys(node)) {
    if (k === 'range' || k === 'loc') continue;
    const v = node[k];
    if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walkCalls(c, node));
    else if (v && typeof v.type === 'string') walkCalls(v, node);
  }
})(ast, null);

// ── 5. Обработчики, навешанные не на верхнем уровне ─────────────────
const listeners = [];
(function walkListeners(node) {
  if (!node || typeof node.type !== 'string') return;
  if (node.type === 'CallExpression' && node.callee.type === 'MemberExpression'
      && node.callee.property.name === 'addEventListener') {
    const o = ownerOf(node.range[0]);
    const ev = node.arguments[0] && node.arguments[0].type === 'Literal'
      ? node.arguments[0].value : snippet(node.arguments[0] || node, 20);
    listeners.push({
      target: snippet(node.callee.object, 45), event: ev,
      owner: o ? o.id : null, top: !!(o && o.statement),
      line: lineIn(node.range[0]),
      handler: node.arguments[1]
        ? (node.arguments[1].type === 'Identifier' ? node.arguments[1].name : 'функция на месте')
        : '?',
      via: 'addEventListener',
    });
  }
  if (node.type === 'CallExpression' && node.callee.type === 'MemberExpression'
      && node.callee.property.name === 'on' && node.arguments[0]
      && node.arguments[0].type === 'Literal') {
    const o = ownerOf(node.range[0]);
    listeners.push({
      target: snippet(node.callee.object, 45), event: node.arguments[0].value,
      owner: o ? o.id : null, top: !!(o && o.statement), line: lineIn(node.range[0]),
      handler: node.arguments[1] && node.arguments[1].type === 'Identifier'
        ? node.arguments[1].name : 'функция на месте', via: '.on()',
    });
  }
  if (node.type === 'AssignmentExpression' && node.left.type === 'MemberExpression'
      && node.left.property && /^on[a-z]+$/.test(node.left.property.name || '')) {
    const o = ownerOf(node.range[0]);
    listeners.push({
      target: snippet(node.left.object, 45), event: node.left.property.name.slice(2),
      owner: o ? o.id : null, top: !!(o && o.statement), line: lineIn(node.range[0]),
      handler: node.right.type === 'Identifier' ? node.right.name : 'функция на месте',
      via: 'свойство',
    });
  }
  for (const k of Object.keys(node)) {
    if (k === 'range' || k === 'loc') continue;
    const v = node[k];
    if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walkListeners(c));
    else if (v && typeof v.type === 'string') walkListeners(v);
  }
})(ast);

// ── 5б. Косвенные ссылки: имя сущности внутри строки или ключом объекта ──
// В этом файле генераторы и метрики зовутся через window[имя], поэтому
// имя-строка — такая же связь, как прямой вызов, и без неё карта врёт.
const isFnName = (n) => byName.has(n) && /function|функция/.test(byName.get(n).kind);
const nameRefs = [];      // {name, owner, line, how}
const dispatch = [];      // window[выражение]
(function walkNames(node, parent) {
  if (!node || typeof node.type !== 'string') return;
  if (node.type === 'Literal' && typeof node.value === 'string' && isFnName(node.value)) {
    const isKey = parent && parent.type === 'Property' && parent.key === node;
    const o = ownerOf(node.range[0]);
    nameRefs.push({ name: node.value, owner: o ? o.id : null, line: lineIn(node.range[0]),
      how: isKey ? 'ключ объекта' : 'строка' });
  }
  if (node.type === 'Property' && !node.computed && node.key.type === 'Identifier'
      && isFnName(node.key.name)) {
    const o = ownerOf(node.key.range[0]);
    nameRefs.push({ name: node.key.name, owner: o ? o.id : null,
      line: lineIn(node.key.range[0]), how: 'ключ объекта' });
  }
  if (node.type === 'MemberExpression' && node.computed
      && node.object.type === 'Identifier' && node.object.name === 'window') {
    const o = ownerOf(node.range[0]);
    dispatch.push({ owner: o ? o.id : null, line: lineIn(node.range[0]),
      expr: snippet(node, 45),
      write: !!(parent && parent.type === 'AssignmentExpression' && parent.left === node) });
  }
  for (const k of Object.keys(node)) {
    if (k === 'range' || k === 'loc') continue;
    const v = node[k];
    if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walkNames(c, node));
    else if (v && typeof v.type === 'string') walkNames(v, node);
  }
})(ast, null);

// обрывки строк в функциях, где есть window[…]: по ним узнаются склеенные имена
const dispatchOwners = new Set(dispatch.map(x => x.owner).filter(Boolean));
const fragments = new Map();   // owner -> Set(обрывок)
for (const oid of dispatchOwners) {
  const ent = entities.find(e => e.id === oid);
  if (!ent) continue;
  const text = code.slice(ent.range[0], ent.range[1]);
  const set = new Set();
  for (const mm of text.matchAll(/['"]([A-Za-z][\w$]*)['"]/g)) set.add(mm[1]);
  fragments.set(oid, [...set]);
}

const nameRefsBy = new Map();
for (const r of nameRefs) {
  const rec = nameRefsBy.get(r.name) || { count: 0, owners: new Set(), hows: new Set() };
  rec.count += 1; if (r.owner) rec.owners.add(r.owner); rec.hows.add(r.how);
  nameRefsBy.set(r.name, rec);
}

// ── 6. Вызовы из разметки: статической и порождаемой ────────────────
const HANDLER_ATTR = /\bon(click|change|input|submit|keyup|keydown|keypress|focus|blur|mouseover|mouseout|mouseenter|mouseleave|mousedown|mouseup|dblclick|wheel|contextmenu|load|error|scroll|toggle)\s*=\s*(\\?["'])([\s\S]{0,600}?)\2/gi;
const KW = new Set(['if','for','while','return','typeof','function','new','catch','switch','this','event','true','false','null','undefined','else','do','delete','void','in','of','instanceof','try','await','case','const','let','var']);

function callsIn(text) {
  const found = new Map();
  const re = /(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(/g; let mm;
  while ((mm = re.exec(text)) !== null) {
    const nm = mm[1];
    if (KW.has(nm)) continue;
    found.set(nm, (found.get(nm) || 0) + 1);
  }
  return [...found.keys()];
}

const htmlStatic = [], htmlDynamic = [];
// статическая разметка = всё вне блока скрипта
const staticParts = [
  { text: src.slice(0, offset), base: 0 },
  { text: src.slice(offset + code.length), base: offset + code.length },
];
for (const part of staticParts) {
  let mm; HANDLER_ATTR.lastIndex = 0;
  while ((mm = HANDLER_ATTR.exec(part.text)) !== null) {
    const abs = part.base + mm.index;
    htmlStatic.push({
      attr: 'on' + mm[1].toLowerCase(), line: lineOf(abs),
      code: mm[3].replace(/\s+/g, ' ').trim().slice(0, 160),
      calls: callsIn(mm[3]),
    });
  }
}
// порождаемая разметка = внутри скрипта (строки и шаблоны)
{
  let mm; HANDLER_ATTR.lastIndex = 0;
  while ((mm = HANDLER_ATTR.exec(code)) !== null) {
    const o = ownerOf(mm.index);
    htmlDynamic.push({
      attr: 'on' + mm[1].toLowerCase(), line: lineIn(mm.index),
      producer: o ? o.id : '(верхний уровень)',
      code: mm[3].replace(/\s+/g, ' ').trim().slice(0, 160),
      calls: callsIn(mm[3]),
    });
  }
}
// setAttribute('onclick', …)
{
  const re = /setAttribute\(\s*['"]on([a-z]+)['"]\s*,/gi; let mm;
  while ((mm = re.exec(code)) !== null) {
    const o = ownerOf(mm.index);
    htmlDynamic.push({ attr: 'on' + mm[1], line: lineIn(mm.index),
      producer: o ? o.id : '(верхний уровень)', code: 'setAttribute(…)', calls: [] });
  }
}

// сводка по именам, вызываемым из разметки
const fromMarkup = new Map();
for (const h of [...htmlStatic, ...htmlDynamic]) {
  for (const nm of h.calls) {
    const rec = fromMarkup.get(nm) || { name: nm, static: 0, dynamic: 0, producers: new Set(), attrs: new Set(), defined: byName.has(nm) };
    if (h.producer) { rec.dynamic += 1; rec.producers.add(h.producer); }
    else rec.static += 1;
    rec.attrs.add(h.attr);
    fromMarkup.set(nm, rec);
  }
}

// ── 7. Сборка json ─────────────────────────────────────────────────
const list = entities.map(e => {
  const calls = callCounts.get(e.id) || new Map();
  return {
    id: e.id,
    name: e.name,
    kind: e.kind,
    decl: e.decl,
    async: !!e.async,
    line: e.line,
    endLine: e.endLine,
    lines: e.endLine - e.line + 1,
    params: e.params || undefined,
    value: e.value || undefined,
    event: e.event || undefined,
    target: e.target || undefined,
    recursive: e.recursive || undefined,
    uses: [...e.uses.entries()].map(([n, r]) => ({
      name: n, count: r.count, writes: r.write || undefined,
      calls: calls.get(n) || 0,
    })).sort((a, b) => b.count - a.count),
    usedBy: [...e.usedBy.entries()].map(([n, r]) => ({ name: n, count: r.count }))
      .sort((a, b) => b.count - a.count),
    dispatchGuess: (() => {
      const hits = [];
      for (const [oid, frs] of fragments) {
        const pre = frs.filter(f => e.name.startsWith(f) && f.length > 3);
        const post = frs.filter(f => e.name.endsWith(f) && f.length > 3);
        if (pre.length && post.length) hits.push(oid);
      }
      return hits.length ? hits : undefined;
    })(),
    byName: nameRefsBy.has(e.name)
      ? { count: nameRefsBy.get(e.name).count,
          how: [...nameRefsBy.get(e.name).hows],
          owners: [...nameRefsBy.get(e.name).owners] }
      : undefined,
    fromMarkup: fromMarkup.has(e.name)
      ? { static: fromMarkup.get(e.name).static, dynamic: fromMarkup.get(e.name).dynamic,
          producers: [...fromMarkup.get(e.name).producers] }
      : undefined,
  };
});

const result = {
  meta: {
    file, bytes: src.length, lines: src.split('\n').length,
    scriptFrom: lineOf(offset), scriptTo: lineOf(offset + code.length),
    generated: new Date().toISOString(),
    counts: {
      total: list.length,
      functions: list.filter(e => /function/.test(e.kind)).length,
      async: list.filter(e => e.async).length,
      const: list.filter(e => e.kind === 'const').length,
      let: list.filter(e => e.kind === 'let').length,
      var: list.filter(e => e.kind === 'var').length,
      classes: list.filter(e => e.kind === 'class').length,
      statements: list.filter(e => e.decl === 'statement').length,
      htmlStatic: htmlStatic.length,
      htmlDynamic: htmlDynamic.length,
    },
  },
  entities: list,
  listeners,
  markup: {
    byName: [...fromMarkup.values()].map(r => ({
      name: r.name, defined: r.defined, static: r.static, dynamic: r.dynamic,
      attrs: [...r.attrs], producers: [...r.producers].sort(),
    })).sort((a, b) => (b.static + b.dynamic) - (a.static + a.dynamic)),
    static: htmlStatic,
    dynamic: htmlDynamic,
  },
  nameRefs,
  dispatch,
  undeclared: [...undeclared.values()].map(r => ({
    name: r.name, count: r.count, owners: [...r.owners].slice(0, 12),
  })).sort((a, b) => b.count - a.count),
};

fs.writeFileSync(out, JSON.stringify(result, null, 2));
console.log('сущностей:', list.length,
  '| функций:', result.meta.counts.functions,
  '| операторов:', result.meta.counts.statements,
  '| разметка стат./динам.:', htmlStatic.length, '/', htmlDynamic.length,
  '| слушателей:', listeners.length,
  '| ссылок по имени:', nameRefs.length, '| window[…]:', dispatch.length);
