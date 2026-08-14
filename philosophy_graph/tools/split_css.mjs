#!/usr/bin/env node
// Разнесение стилей по файлам.
//
// Главы режутся ПО ГРАНИЦАМ и подключаются В ТОМ ЖЕ ПОРЯДКЕ, поэтому
// склейка файлов даёт исходный текст ЗНАК В ЗНАК — это и проверяется тут же.
// Иначе каскад молча поменялся бы: семь селекторов встречаются в двух главах
// (`.stats-modal-header` и соседи), и при равной весомости побеждает
// последний. Переставь главы — победит другой.
//
// Границы задаются ЯКОРЯМИ (кусками текста), а не номерами строк: вставка в
// начало таблицы иначе сдвинула бы всё.
import fs from 'node:fs';
import path from 'node:path';
import { ГЛАВЫ } from './css_map.mjs';

const ДЕРЕВО = process.argv[2] || '/home/claude/build/src';
const ФАЙЛ = path.join(ДЕРЕВО, 'index.html');

let html = fs.readFileSync(ФАЙЛ, 'utf8');
if (html.includes('css/01-base.css')) {
  console.log('стили уже разнесены');
  process.exit(0);
}
const a = html.indexOf('<style>'), b = html.indexOf('</style>');
if (a < 0 || b < 0) { console.error('нет блока стилей'); process.exit(1); }
const css = html.slice(a + 7, b);

const границы = [];
for (const [имя, якорь, описание] of ГЛАВЫ) {
  if (якорь === null) { границы.push({ имя, описание, от: 0 }); continue; }
  const i = css.indexOf(якорь);
  if (i < 0) { console.error('якорь не найден: ' + якорь); process.exit(1); }
  границы.push({ имя, описание, от: i });
}
for (let i = 0; i < границы.length; i++)
  границы[i].до = i + 1 < границы.length ? границы[i + 1].от : css.length;

const папка = path.join(ДЕРЕВО, 'css');
fs.mkdirSync(папка, { recursive: true });

// Глава не должна начинаться ВНУТРИ пояснения: обрывок «*/» в начале файла
// браузер считает ошибкой и отбрасывает правила пачками. Проверяем по счёту
// открытий и закрытий в предшествующем тексте.
for (const г of границы) {
  const до = css.slice(0, г.от);
  const откр = (до.match(/\/\*/g) || []).length, закр = (до.match(/\*\//g) || []).length;
  if (откр !== закр) {
    console.error(`глава ${г.имя} начинается внутри пояснения — якорь надо сдвинуть к его началу`);
    process.exit(1);
  }
}

const куски = [];
for (const г of границы) {
  const кусок = css.slice(г.от, г.до);
  куски.push(кусок);
  const шапка = `/* ${г.имя} — ${г.описание}\n` +
    `   Часть таблицы стилей philosophy_graph. ПОРЯДОК ПОДКЛЮЧЕНИЯ ЗНАЧИМ:\n` +
    `   склейка глав по порядку обязана совпадать с исходным блоком. */\n`;
  fs.writeFileSync(path.join(папка, г.имя + '.css'), шапка + кусок);
}

// ПРОВЕРКА ТУТ ЖЕ: склейка без шапок обязана дать исходный текст
const склейка = куски.join('');
if (склейка !== css) {
  console.error('склейка глав НЕ СОВПАЛА с исходным блоком — каскад изменился бы');
  process.exit(1);
}

const ссылки = границы.map(г =>
  `  <link rel="stylesheet" href="./css/${г.имя}.css">`).join('\n');
html = html.slice(0, a) + '<!-- стили разнесены по главам; порядок значим -->\n' +
  ссылки + '\n  ' + html.slice(b + '</style>'.length);
fs.writeFileSync(ФАЙЛ, html);

// Пустой .nojekyll: без него GitHub Pages пропускает всё, что начинается
// с подчёркивания, и оснастка приборов _probe-rig.js не публикуется.
fs.writeFileSync(path.join(ДЕРЕВО, '.nojekyll'), '');

console.log(`стилей разнесено: ${границы.length} глав, ${css.length} знаков; ` +
  `склейка совпала с исходным блоком знак в знак`);
