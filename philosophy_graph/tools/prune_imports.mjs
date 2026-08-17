#!/usr/bin/env node
// Уборка призрачных ввозов — по РАЗБОРУ ОБЛАСТЕЙ ВИДИМОСТИ, не по тексту.
//
// Откуда призраки. Разбивка ищет нужные ввозы по тексту модуля и находит
// имена внутри шаблонных строк разметки: `onclick="selectSearchResult(...)"`
// выглядит как обращение. Пока обработчики были встроены, ввоз и правда был
// нужен; после делегирования разметка несёт ИМЯ ДЕЙСТВИЯ, тело живёт в
// ui/actions-*.js, и ввоз остаётся висеть.
//
// Первая проба искала имя в тексте — и пропускала худший случай: ввезённое
// имя ЗАТЕНЕНО местным объявлением. `render/geometry.js` ввозил `draw` из
// scene.js, а внутри функции объявлял свой `const draw` — по тексту имя
// есть, по делу ввоз мёртв, и держал ложное ребро в круге.
//
// Поэтому здесь настоящий разбор: считаются ССЫЛКИ на ввезённое имя в
// области видимости модуля. Ноль ссылок — ввоз уходит.
//
// Вред призрака не в лишней строке, а в ЛОЖНОМ СЦЕПЛЕНИИ: карта дерева
// считает его связью, и в графе появляются рёбра и круги, которых нет.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import * as acorn from 'acorn';
const eslintScope = require('eslint-scope');

const ДЕРЕВО = process.argv[2] || '/home/claude/build/src';
const файлы = [];
(function walk(d) {
  for (const f of fs.readdirSync(d).sort()) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'vendor') walk(p); continue; }
    if (p.endsWith('.js') && !f.startsWith('_')) файлы.push(p);
  }
})(ДЕРЕВО);

let убрано = 0, тронуто = 0, затенённых = 0;
for (const p of файлы) {
  const текст = fs.readFileSync(p, 'utf8');
  let ast;
  try { ast = acorn.parse(текст, { ecmaVersion: 2023, sourceType: 'module', ranges: true }); }
  catch (e) { console.error('не разобрался:', p, e.message); continue; }
  const sm = eslintScope.analyze(ast, { ecmaVersion: 2023, sourceType: 'module' });
  const модульная = sm.globalScope.childScopes.find(s => s.type === 'module') || sm.globalScope;

  const мёртвые = new Set();
  for (const v of модульная.variables) {
    const ввезена = v.defs.some(d => d.type === 'ImportBinding');
    if (!ввезена) continue;
    if (v.references.length === 0) {
      мёртвые.add(v.name);
      // затенение видно так: имя в тексте есть, ссылок в области — нет
      if (new RegExp('(?<![\\w$])' + v.name.replace(/[$]/g, '\\$') + '(?![\\w$])')
          .test(текст.replace(/^import .*$/gm, ''))) затенённых++;
    }
  }
  if (!мёртвые.size) continue;

  const стало = текст.replace(/^import \{([^}]*)\} from '([^']*)';$/gm, (вся, имена, откуда) => {
    const все = имена.split(',').map(s => s.trim()).filter(Boolean);
    const нужные = все.filter(н => !мёртвые.has(н.split(' as ').pop().trim()));
    if (нужные.length === все.length) return вся;
    убрано += все.length - нужные.length;
    // Ввоз ради побочного действия не выдумываем: модуль и так ввозится из main.js
    return нужные.length ? `import { ${нужные.join(', ')} } from '${откуда}';` : '';
  }).replace(/\n{3,}/g, '\n\n');

  fs.writeFileSync(p, стало);
  тронуто++;
}
console.log(`призрачных ввозов убрано: ${убрано} в ${тронуто} модулях` +
  (затенённых ? `; из них затенённых местным именем: ${затенённых}` : ''));
