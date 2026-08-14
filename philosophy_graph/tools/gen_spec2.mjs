#!/usr/bin/env node
// Спецификация модулей — ИЗ СОБРАННОГО ДЕРЕВА, а не из замысла.
//
// Прежняя спека описывала предполагаемую раскладку и потому устаревала при
// всякой правке. Эта читает готовое дерево: что в модуле лежит, что он
// вывозит и что ввозит. Расходиться с действительностью ей нечем.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.argv[2] || '/home/claude/build/src';
const OUT = process.argv[3] || '/mnt/user-data/outputs/module-spec-v2.md';

const файлы = [];
(function walk(d) {
  for (const f of fs.readdirSync(d).sort()) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'vendor') walk(p); continue; }
    if (p.endsWith('.js') && !f.startsWith('_')) файлы.push(p);
  }
})(ROOT);

const модули = [];
for (const p of файлы) {
  const rel = path.relative(ROOT, p).replace(/\\/g, '/');
  const text = fs.readFileSync(p, 'utf8');
  const строк = text.split('\n').length;

  const вывоз = new Set();
  for (const m of text.matchAll(/^export \{([^}]*)\};?$/gm))
    for (const n of m[1].split(',').map(s => s.trim()).filter(Boolean)) вывоз.add(n);
  for (const m of text.matchAll(/^export (?:async )?function (\w+)/gm)) вывоз.add(m[1]);
  for (const m of text.matchAll(/^export const (\w+)/gm)) вывоз.add(m[1]);

  const ввоз = [];
  for (const m of text.matchAll(/^import \{([^}]*)\} from '([^']*)';$/gm))
    ввоз.push({ откуда: m[2], имена: m[1].split(',').map(s => s.trim()).filter(Boolean) });
  for (const m of text.matchAll(/^import '([^']*)';$/gm))
    ввоз.push({ откуда: m[1], имена: [] });

  // объявления верхнего уровня
  const свои = [];
  for (const m of text.matchAll(/^(?:export )?(?:async )?function (\w+)/gm)) свои.push(m[1]);
  for (const m of text.matchAll(/^(?:export )?(?:const|let|var) (\w+)/gm)) свои.push(m[1]);
  for (const m of text.matchAll(/^(DATA|S|MET|VIEWS)\.(\w+) =/gm)) свои.push(m[1] + '.' + m[2]);

  модули.push({ rel, строк, вывоз: [...вывоз].sort(), ввоз, свои: [...new Set(свои)].sort() });
}

const L = [];
const w = s => L.push(s);
const всего = модули.reduce((a, m) => a + m.строк, 0);

w('# Спецификация модулей `philosophy_graph` — по собранному дереву\n');
w(`Составлено из готовой сборки: ${модули.length} модулей, ${всего} строк.
Не замысел, а описание того, что есть, — поэтому расходиться с
действительностью ей нечем. Пересобирается программой \`tools/gen_spec2.mjs\`
после каждой сборки.\n`);

w('## Как это строится\n');
w(`\`\`\`
tools/split.mjs <дерево> <исходник> <раскладка> <карта>   разбивка
tools/delegate.mjs <дерево> static                        атрибуты страницы
tools/delegate.mjs <дерево> dyn                           атрибуты генераторов
tools/rig.mjs <дерево>                                    оснастка приборов
tools/unbridge.mjs <дерево>                               снятие моста
\`\`\`

Источник — **пропатченная одностраничная версия** (\`philosophy_graph_v3.html\`):
она же служит эталоном приёмки. Всякая новая возможность вносится в неё, а в
сборку приезжает разбивкой — по одной реализации на возможность.

**Раскладка задаётся именами, а не строками** (\`assign_names.json\`, 697 имён).
Номера строк сдвигаются от любой вставки, и по замеру тридцать чужих
сущностей молча уезжали в соседние модули. Имя, которого в раскладке нет,
**останавливает сборку** с перечнем — новая сущность требует явного решения.
`);

w('\n## Пространства имён\n');
w(`| Имя | Что держит |
|---|---|
| \`DATA\` | шесть наборов базы и девять производных указателей; заполняется при запуске |
| \`S\` | изменяемое состояние и отложенные ячейки — всё, что либо меняется из чужого модуля (в том числе **из разметки**), либо не может быть вычислено при ввозе |
| \`MET\` | метрики, к которым обращаются по имени |
| \`VIEWS\` | генераторы окон, к которым обращаются по имени |

Три последних заменили \`window[имя]\`, который в модулях не работает вовсе.
`);

w('\n## Модули\n');
w('| Модуль | Строк | Вывозит | Ввозит из |');
w('|---|---|---|---|');
for (const m of модули)
  w(`| \`${m.rel}\` | ${m.строк} | ${m.вывоз.length} | ${m.ввоз.length} |`);

w('\n## Состав, вывоз и ввоз по модулям\n');
for (const m of модули) {
  w(`\n### \`${m.rel}\`\n`);
  w(`Строк ${m.строк}.\n`);
  w('**Вывозит:** ' + (m.вывоз.length ? m.вывоз.map(n => '`' + n + '`').join(', ') : '_ничего_') + '\n');
  if (m.ввоз.length) {
    w('**Ввозит:**\n');
    for (const и of m.ввоз)
      w(`- из \`${и.откуда}\`: ` + (и.имена.length ? и.имена.map(n => '`' + n + '`').join(', ') : '_ради побочного действия_'));
  } else w('**Ввозит:** _ничего_');
  w('\n**Содержит:** ' + (m.свои.length ? m.свои.map(n => '`' + n + '`').join(', ') : '_только исполняемый код_'));
}

fs.writeFileSync(OUT, L.join('\n'));
console.log(`спецификация: ${модули.length} модулей, ${всего} строк → ${OUT}`);
