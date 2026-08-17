#!/usr/bin/env node
// Перестановки состава модулей.
//
// Главное, что надо понимать: КОД ПО ФАЙЛАМ НЕ ПЕРЕНОСИТСЯ РУКАМИ. Дерево
// целиком порождается из одностраничного исходника по раскладке
// «имя → модуль» (assign_names.json). Значит, перенести сущность в другой
// модуль, переименовать модуль, слить два в один или отщепить новый — это
// правка раскладки и пересборка. Вывозы и ввозы разбивка считает заново
// сама: она знает, кто к кому обращается, и расставит их без нас.
//
// Отсюда и вся программа: она правит раскладку, а не файлы.
//
//   node tools/remap.mjs где <имя...>
//   node tools/remap.mjs состав <модуль>
//   node tools/remap.mjs перенести <модуль-цель> <имя...>
//   node tools/remap.mjs переименовать <старый> <новый>
//   node tools/remap.mjs слить <из> [<из2>...] <в>
//   node tools/remap.mjs отщепить <новый-модуль> <имя...>
//   node tools/remap.mjs проверить
//   node tools/remap.mjs собрать            (пересборка + проверки)
//
// Любая правка сперва показывается и требует подтверждения ключом --да,
// иначе только сообщает, что сделала бы.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// корень — от самой программы: набор должен работать из любой папки
const КОРЕНЬ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Пути ищутся сперва в корне набора, потом в build/ — так одинаково
// работает и разложенный архив, и рабочая папка, где сборка лежит в build/.
const найти = (...варианты) => {
  for (const в of варианты) if (fs.existsSync(path.join(КОРЕНЬ, в))) return path.join(КОРЕНЬ, в);
  return path.join(КОРЕНЬ, варианты[варианты.length - 1]);
};
const ФАЙЛ_РАСКЛАДКИ = найти('assign_names.json');
const КАРТА = найти('globals_map_v3.json');
const ИСХОДНИК = найти('philosophy_graph_v3.html', 'build/orig_v3.html');
// Дерево ищется по существующему; если его нет вовсе — кладём рядом с
// набором, в split/. Иначе первая же сборка уезжает в build/src, которого
// в разложенном архиве нет, и человек ищет её глазами.
const ДЕРЕВО = fs.existsSync(path.join(КОРЕНЬ, 'build/src'))
  ? path.join(КОРЕНЬ, 'build/src') : path.join(КОРЕНЬ, 'split');

const дов = process.argv.slice(2);
const делать = дов.includes('--да');
const арг = дов.filter(d => d !== '--да');
const команда = арг[0];

const раскладка = JSON.parse(fs.readFileSync(ФАЙЛ_РАСКЛАДКИ, 'utf8'));
const поИмени = раскладка.по_имени;
const карта = JSON.parse(fs.readFileSync(КАРТА, 'utf8'));
const естьВИсходнике = new Set(
  карта.entities.filter(e => e.decl !== 'statement').map(e => e.name));

const модули = () => {
  const m = new Map();
  for (const [имя, мод] of Object.entries(поИмени)) {
    if (!m.has(мод)) m.set(мод, []);
    m.get(мод).push(имя);
  }
  return m;
};

function записать(что) {
  if (!делать) {
    console.log('\n(показ; чтобы применить, добавьте ключ --да)');
    return;
  }
  fs.writeFileSync(ФАЙЛ_РАСКЛАДКИ, JSON.stringify(раскладка, null, 1));
  console.log('\nраскладка записана: ' + что);
  console.log('дальше: node tools/remap.mjs собрать');
}

function проверитьИмена(имена) {
  const нет = имена.filter(n => !(n in поИмени));
  const чужие = имена.filter(n => (n in поИмени) && !естьВИсходнике.has(n));
  if (нет.length) {
    console.error('нет в раскладке: ' + нет.join(', '));
    process.exit(1);
  }
  if (чужие.length) console.error('внимание: нет в текущем исходнике: ' + чужие.join(', '));
}

// ── команды ────────────────────────────────────────────────────────
if (команда === 'где') {
  for (const n of арг.slice(1)) {
    const e = карта.entities.find(x => x.name === n);
    console.log(`${n}: ${поИмени[n] || 'НЕ РАЗЛОЖЕНО'}` +
      (e ? `  (строк ${e.lines}, обращений извне ${e.usedBy.length})` : '  (нет в исходнике)'));
  }

} else if (команда === 'состав') {
  const мод = арг[1];
  const свои = (модули().get(мод) || []).sort();
  console.log(`${мод}: ${свои.length} имён`);
  for (const n of свои) {
    const e = карта.entities.find(x => x.name === n);
    console.log('  ' + n + (e ? `  (строк ${e.lines})` : ''));
  }

} else if (команда === 'перенести') {
  const цель = арг[1], имена = арг.slice(2);
  if (!цель || !имена.length) { console.error('нужны модуль и хотя бы одно имя'); process.exit(1); }
  проверитьИмена(имена);
  for (const n of имена) {
    console.log(`  ${n}: ${поИмени[n]} → ${цель}`);
    поИмени[n] = цель;
  }
  записать(`перенесено имён: ${имена.length} → ${цель}`);

} else if (команда === 'переименовать') {
  const [, старый, новый] = арг;
  const свои = модули().get(старый) || [];
  if (!свои.length) { console.error('нет такого модуля: ' + старый); process.exit(1); }
  console.log(`${старый} → ${новый}: имён ${свои.length}`);
  for (const n of свои) поИмени[n] = новый;
  записать(`модуль переименован: ${старый} → ${новый}`);

} else if (команда === 'слить') {
  const цель = арг[арг.length - 1], источники = арг.slice(1, -1);
  if (!источники.length) { console.error('нужны хотя бы один источник и цель'); process.exit(1); }
  let всего = 0;
  for (const из of источники) {
    const свои = модули().get(из) || [];
    if (!свои.length) { console.error('нет такого модуля: ' + из); process.exit(1); }
    console.log(`${из} → ${цель}: имён ${свои.length}`);
    for (const n of свои) поИмени[n] = цель;
    всего += свои.length;
  }
  записать(`слито имён: ${всего} → ${цель}`);

} else if (команда === 'отщепить') {
  const новый = арг[1], имена = арг.slice(2);
  if (!новый || !имена.length) { console.error('нужны новый модуль и хотя бы одно имя'); process.exit(1); }
  проверитьИмена(имена);
  const откуда = new Set(имена.map(n => поИмени[n]));
  console.log(`новый модуль ${новый}: имён ${имена.length} из ${[...откуда].join(', ')}`);
  for (const n of имена) поИмени[n] = новый;
  записать(`отщеплён ${новый}`);

} else if (команда === 'проверить') {
  let бед = 0;
  const нетВИсходнике = Object.keys(поИмени).filter(n => !естьВИсходнике.has(n));
  const нетВРаскладке = [...естьВИсходнике].filter(n => !(n in поИмени));
  if (нетВРаскладке.length) {
    бед++;
    console.log(`СУЩНОСТИ БЕЗ МОДУЛЯ (${нетВРаскладке.length}) — сборка на них остановится:`);
    нетВРаскладке.forEach(n => console.log('   ' + n));
  }
  if (нетВИсходнике.length) {
    console.log(`в раскладке есть, в исходнике нет (${нетВИсходнике.length}) — безвредно, но стоит убрать:`);
    нетВИсходнике.slice(0, 20).forEach(n => console.log('   ' + n));
  }
  const m = модули();
  console.log(`\nмодулей ${m.size}, имён ${Object.keys(поИмени).length}`);
  const мелкие = [...m].filter(([, v]) => v.length === 1).map(([k]) => k);
  if (мелкие.length) console.log(`модули из одного имени (${мелкие.length}): ${мелкие.join(', ')}`);
  process.exit(бед ? 1 : 0);

} else if (команда === 'собрать') {
  const шаги = [
    ['split.mjs', [ДЕРЕВО, ИСХОДНИК, ФАЙЛ_РАСКЛАДКИ, КАРТА]],
    ['delegate.mjs', [ДЕРЕВО, 'static']],
    ['delegate.mjs', [ДЕРЕВО, 'dyn']],
    ['rig.mjs', [ДЕРЕВО]],
    ['unbridge.mjs', [ДЕРЕВО]],
    ['prune_imports.mjs', [ДЕРЕВО]],
    ['split_css.mjs', [ДЕРЕВО]],
  ];
  fs.rmSync(ДЕРЕВО, { recursive: true, force: true });
  for (const [программа, доводы] of шаги) {
    const out = execFileSync('node', [path.join(КОРЕНЬ, 'tools', программа), ...доводы],
      { encoding: 'utf8' });
    console.log(out.trim().split('\n').pop());
  }
  console.log(execFileSync('node', [path.join(КОРЕНЬ, 'tools/check_modules.mjs')],
    { encoding: 'utf8' }).trim().split('\n').pop());
  console.log('\nдальше — приёмка: приборы sweep_all, compare, graph_probe, probe4…probe8');

} else {
  console.log(fs.readFileSync(new URL(import.meta.url), 'utf8')
    .split('\n').filter(l => l.startsWith('//')).map(l => l.slice(3)).join('\n'));
}
