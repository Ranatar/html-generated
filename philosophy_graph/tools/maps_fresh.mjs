#!/usr/bin/env node
// Свежесть карт — проверкой, а не на глаз.
//
// Повод. Карты складываются по-разному, и устаревают они тоже по-разному:
//
//   assign_names.json  — раскладка. Устареть НЕЗАМЕТНО не может: новое имя
//                        останавливает сборку с перечнем.
//   globals_map_v3     — из неё разбивка берёт метрики, зовомые по имени,
//                        обработчики разметки (а из них — ячейки общего
//                        состояния) и имена для моста. Устареет — сборка
//                        соберётся, но пространства и состояние окажутся
//                        посчитаны по вчерашнему коду.
//   css_map.json       — описательная: её не читает НИКТО (главы разрезатель
//                        берёт из css_map.mjs). Значит, устареть может совсем
//                        молча — и это худший случай из трёх.
//   map_tree           — по собранному дереву; устаревает при каждой сборке.
//   module-spec-v2.md  — то же.
//
// Отметка времени в сравнении не участвует: она различается всегда.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const КОРЕНЬ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Файл может лежать и рядом с набором, и в выкладке: ищем в обоих местах.
// Прибор, не нашедший файл, обязан сказать «не нашёл», а не «устарел» —
// первая же проба дала именно такую ложную тревогу.
const МЕСТА = [КОРЕНЬ, '/mnt/user-data/outputs'];
const есть = (...в) => {
  for (const м of МЕСТА) for (const x of в) {
    const п = path.join(м, x);
    if (fs.existsSync(п)) return п;
  }
  return path.join(КОРЕНЬ, в[в.length - 1]);
};

const ИСХОДНИК = есть('philosophy_graph_v3.html', 'build/orig_v3.html');
const ДЕРЕВО = есть('split', 'build/src');
const ВРЕМ = '/tmp/свежесть';
fs.mkdirSync(ВРЕМ, { recursive: true });

// Сравнение устойчиво к порядку ключей — но НЕ ценой их потери. Первая
// попытка передавала список ключей вторым доводом JSON.stringify: он там
// работает ОТБОРОМ, и всё вложенное просто выпадало из сравнения. Прибор
// показывал «свежая» на нарочно испорченной карте — проверено.
const упорядочить = (з) => {
  if (Array.isArray(з)) return з.map(упорядочить);
  if (з && typeof з === 'object')
    return Object.fromEntries(Object.keys(з).sort().map(k => [k, упорядочить(з[k])]));
  return з;
};
const без = (о) => {
  const к = JSON.parse(JSON.stringify(о));
  if (к.meta) { delete к.meta.generated; delete к.meta.file; }   // путь и время — не содержание
  if (к.меры) delete к.меры.составлено;
  return JSON.stringify(упорядочить(к));
};

const карты = [
  { имя: 'globals_map_v3.json', как: ['map_globals.mjs', [ИСХОДНИК, path.join(ВРЕМ, 'g.json')]],
    новый: path.join(ВРЕМ, 'g.json'),
    зачем: 'из неё разбивка берёт метрики по имени, обработчики разметки и ячейки состояния' },
  { имя: 'css_map.json', как: ['css_map.mjs', [ИСХОДНИК, path.join(ВРЕМ, 'c.json')]],
    новый: path.join(ВРЕМ, 'c.json'),
    зачем: 'описательная; её не читает никто, поэтому устареет молча' },
  { имя: 'map_tree.json', как: ['map_tree.mjs', [ДЕРЕВО, path.join(ВРЕМ, 't.json')]],
    новый: path.join(ВРЕМ, 't.json'),
    зачем: 'по собранному дереву; устаревает при каждой сборке' },
];

let плохо = 0;
for (const к of карты) {
  const старый = path.join(КОРЕНЬ, к.имя);
  if (!fs.existsSync(старый)) {
    console.log(`? ${к.имя} — НЕ НАЙДЕНА (искал рядом с набором и в выкладке)`);
    плохо++; continue;
  }
  try {
    execFileSync('node', [path.join(КОРЕНЬ, 'tools', к.как[0]), ...к.как[1]], { stdio: 'pipe' });
  } catch (e) {
    console.log(`✗ ${к.имя} — пересобрать не удалось: ${String(e.message).split('\n')[0]}`);
    плохо++; continue;
  }
  const а = без(JSON.parse(fs.readFileSync(старый, 'utf8')));
  const б = без(JSON.parse(fs.readFileSync(к.новый, 'utf8')));
  if (а === б) console.log(`✓ ${к.имя} — свежая`);
  else { console.log(`✗ ${к.имя} — УСТАРЕЛА (${к.зачем})`); плохо++; }
}

// спецификация модулей — текстом
{
  const старый = есть('module-spec-v2.md');
  const новый = path.join(ВРЕМ, 'spec.md');
  execFileSync('node', [path.join(КОРЕНЬ, 'tools/gen_spec2.mjs'), ДЕРЕВО, новый], { stdio: 'pipe' });
  if (!fs.existsSync(старый)) {
    console.log('? module-spec-v2.md — НЕ НАЙДЕНА (искал рядом с набором и в выкладке)');
    плохо++;
  } else {
    const свежа = fs.readFileSync(старый, 'utf8') === fs.readFileSync(новый, 'utf8');
    console.log(`${свежа ? '✓' : '✗'} module-spec-v2.md — ${свежа ? 'свежая' : 'УСТАРЕЛА'}`);
    if (!свежа) плохо++;
  }
}

console.log(плохо ? `\nустаревших карт: ${плохо} — пересоберите их` : '\nвсе карты свежие');
process.exit(плохо ? 1 : 0);
