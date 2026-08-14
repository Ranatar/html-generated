#!/usr/bin/env node
// Проверяет собранные модули: нет ли имён, которые нигде не объявлены
// и не ввезены. Браузерные глобальные и d3 считаются известными.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import * as acorn from 'acorn';
const eslintScope = require('eslint-scope');

const ROOT = process.argv[2] || '/home/claude/build/src';
const KNOWN = new Set(`document window console d3 Math Object Set Map Array String Number Boolean
JSON Date Promise Infinity NaN undefined setTimeout clearTimeout setInterval clearInterval
requestAnimationFrame cancelAnimationFrame alert confirm prompt localStorage sessionStorage
fetch URL Blob FileReader Image Error TypeError RangeError isNaN parseInt parseFloat performance
Uint8Array Uint16Array Uint32Array Float32Array Float64Array Int32Array navigator location
getComputedStyle DOMParser XMLSerializer btoa atob structuredClone globalThis Symbol Intl
event CustomEvent Event MouseEvent KeyboardEvent HTMLElement Node NodeList encodeURIComponent
decodeURIComponent RegExp Function Reflect Proxy WeakMap WeakSet ResizeObserver queueMicrotask`
  .split(/\s+/).filter(Boolean));

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.js') && !p.includes('/vendor/')) files.push(p);
  }
})(ROOT);

let bad = 0, badImports = 0;
const exportsOf = new Map();

for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const ast = acorn.parse(text, { ecmaVersion: 2023, sourceType: 'module', ranges: true });
  const names = new Set();
  for (const n of ast.body) {
    if (n.type === 'ExportNamedDeclaration') {
      if (n.declaration) {
        if (n.declaration.id) names.add(n.declaration.id.name);
        for (const d of n.declaration.declarations || []) if (d.id.type === 'Identifier') names.add(d.id.name);
      }
      for (const s of n.specifiers) names.add(s.exported.name);
    }
  }
  exportsOf.set(path.relative(ROOT, f), names);
}

for (const f of files) {
  const rp = path.relative(ROOT, f);
  const text = fs.readFileSync(f, 'utf8');
  const ast = acorn.parse(text, { ecmaVersion: 2023, sourceType: 'module', ranges: true });
  const sm = eslintScope.analyze(ast, { ecmaVersion: 2023, sourceType: 'module' });
  const free = new Map();
  for (const ref of sm.globalScope.through) {
    const n = ref.identifier.name;
    if (KNOWN.has(n)) continue;
    const line = text.slice(0, ref.identifier.range[0]).split('\n').length;
    if (!free.has(n)) free.set(n, line);
  }
  if (free.size) {
    bad += free.size;
    console.log(`\n${rp}: не объявлено и не ввезено — ${free.size}`);
    for (const [n, line] of [...free].slice(0, 12)) console.log(`   стр.${line} ${n}`);
  }
  // ввозится ли то, чего нет в вывозе источника
  for (const n of ast.body) {
    if (n.type !== 'ImportDeclaration') continue;
    const target = path.normalize(path.join(path.dirname(rp), n.source.value));
    const ex = exportsOf.get(target);
    if (!ex) { console.log(`${rp}: нет такого модуля — ${n.source.value}`); badImports++; continue; }
    for (const s of n.specifiers) {
      if (s.type === 'ImportSpecifier' && !ex.has(s.imported.name)) {
        console.log(`${rp}: ввозит ${s.imported.name} из ${n.source.value}, а тот его не вывозит`);
        badImports++;
      }
    }
  }
}
console.log(`\nфайлов ${files.length} | несведённых имён ${bad} | негодных ввозов ${badImports}`);
process.exit(bad + badImports === 0 ? 0 : 1);
