#!/usr/bin/env node
// Слои и рёбра, идущие снизу вверх.
//
// Круг в графе ввозов сам по себе ничего не подсказывает: в него попала
// половина дерева, и «развязывать» его нечего, пока не сказано, ЧТО СЧИТАТЬ
// низом, а что верхом. Поэтому здесь объявлен порядок слоёв, а прибор
// показывает ровно те рёбра, которые ему противоречат: кто из низа обращается
// к верху. Их немного, и это и есть весь список работ.
//
//   node tools/layers.mjs                     список нарушающих рёбер
//   node tools/layers.mjs имя <сущность>      куда ходит и откуда ходят к ней
//   node tools/layers.mjs если <сущность> <модуль>   что даст перенос
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const КОРЕНЬ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const есть = (...в) => {
  for (const м of [КОРЕНЬ, '/mnt/user-data/outputs'])
    for (const x of в) { const п = path.join(м, x); if (fs.existsSync(п)) return п; }
  return path.join(КОРЕНЬ, в[0]);
};

// ДВА СЧЁТА, И ОНИ РАЗНЫЕ.
//
//   по ОБРАЩЕНИЯМ (globals_map): кто кого зовёт в едином файле. Показывает
//   замысел, но врёт про дерево: имя, ставшее ячейкой общего состояния
//   (S.LoadingIndicator), зовётся без всякого ввоза, и ребра там нет.
//
//   по ВВОЗАМ (map_tree): что модуль ДЕЙСТВИТЕЛЬНО тянет из другого. Вот это
//   и есть сцепление, которое надо развязывать.
//
// Первый счёт оставлен для команды «имя» — он объясняет, ОТКУДА зовут.
// Перечень работ и оценка переноса считаются по второму.
const карта = JSON.parse(fs.readFileSync(есть('globals_map_v3.json'), 'utf8'));
const раскладка = JSON.parse(fs.readFileSync(есть('assign_names.json'), 'utf8')).по_имени;
const дерево = JSON.parse(fs.readFileSync(есть('map_tree.json'), 'utf8'));

// ПОРЯДОК СЛОЁВ — единственное, что здесь объявлено руками. Всё прочее
// считается. Чем меньше число, тем ниже слой: низ не должен знать о верхе.
export const СЛОИ = [
  ['core/', 0], ['util/', 0],
  ['data/', 1], ['state.js', 1], ['state/', 1],
  ['metrics/', 2],
  ['render/', 3], ['graph/', 3], ['filters/', 3],
  // widgets/ — то, чем ПОЛЬЗУЮТСЯ экраны: выпадающий список концепций и ему
  // подобное. Отделено от ui/, где живут сборщики экранов (легенда): экран,
  // зовущий виджет, — это вниз, а не вверх, и слои должны это различать.
  ['widgets/', 4], ['paths/', 4],
  ['stats/', 5], ['modal/', 5],
  ['ui/', 6],
  ['boot.js', 9], ['boot-defs.js', 9], ['main.js', 9], ['dead.js', 9],
];
export function слой(модуль) {
  for (const [п, н] of СЛОИ) if (модуль === п || модуль.startsWith(п)) return н;
  return 3;
}

// граф модулей по обращениям сущностей
const рёбра = new Map();      // «кто→кому» -> {раз, примеры:[]}
for (const e of карта.entities) {
  if (e.decl === 'statement') continue;
  const мой = раскладка[e.name];
  if (!мой) continue;
  for (const u of e.usedBy || []) {
    const чей = раскладка[u.name];
    if (!чей || чей === мой) continue;
    const к = чей + '→' + мой;
    if (!рёбра.has(к)) рёбра.set(к, { из: чей, в: мой, раз: 0, примеры: [] });
    const р = рёбра.get(к);
    р.раз += u.count;
    if (р.примеры.length < 4) р.примеры.push(`${u.name}→${e.name}`);
  }
}

const назад = [...рёбра.values()].filter(р => слой(р.из) < слой(р.в))
  .sort((a, b) => b.раз - a.раз);

// рёбра ПО НАСТОЯЩИМ ВВОЗАМ дерева
// dead.js из счёта исключён: он не часть устройства, а склад того, к чему
// никто не обращается. Ребро metrics/cache.js → dead.js — след общего сброса
// кешей, и лечится оно решением о судьбе мёртвого кода, а не слоями.
const ввозНазад = [];
for (const м of дерево.модули)
  for (const и of м.ввоз) {
    if (м.путь === 'dead.js' || и.откуда === 'dead.js') continue;
    if (слой(м.путь) < слой(и.откуда))
      ввозНазад.push({ из: м.путь, в: и.откуда, имена: и.имена });
  }
ввозНазад.sort((a, b) => b.имена.length - a.имена.length);

const [, , команда, а1, а2] = process.argv;

if (команда === 'имя') {
  const e = карта.entities.find(x => x.name === а1);
  if (!e) { console.error('нет такой сущности: ' + а1); process.exit(1); }
  const мой = раскладка[а1];
  console.log(`${а1} — модуль ${мой} (слой ${слой(мой)}), строк ${e.lines}`);
  const кто = new Map();
  for (const u of e.usedBy || []) {
    const м = раскладка[u.name] || '?';
    кто.set(м, (кто.get(м) || 0) + u.count);
  }
  console.log('  к ней обращаются из:');
  for (const [м, c] of [...кто].sort((a, b) => b[1] - a[1]))
    console.log(`    ${String(c).padStart(3)}  ${м} (слой ${слой(м)})${слой(м) < слой(мой) ? '  ← СНИЗУ ВВЕРХ' : ''}`);
  const куда = new Map();
  for (const u of e.uses || []) {
    const м = раскладка[u.name] || '?';
    куда.set(м, (куда.get(м) || 0) + (u.count || 1));
  }
  if (куда.size) {
    console.log('  сама обращается в:');
    for (const [м, c] of [...куда].sort((a, b) => b[1] - a[1]))
      console.log(`    ${String(c).padStart(3)}  ${м} (слой ${слой(м)})${слой(м) > слой(мой) ? '  ← СНИЗУ ВВЕРХ' : ''}`);
  }

} else if (команда === 'если') {
  const было = раскладка[а1];
  if (!было) { console.error('нет в раскладке: ' + а1); process.exit(1); }
  const счёт = (r) => {
    let n = 0;
    for (const e of карта.entities) {
      if (e.decl === 'statement') continue;
      const мой = r[e.name]; if (!мой) continue;
      for (const u of e.usedBy || []) {
        const чей = r[u.name];
        if (!чей || чей === мой) continue;
        if (слой(чей) < слой(мой)) n += u.count;
      }
    }
    return n;
  };
  const до = счёт(раскладка);
  const после = счёт({ ...раскладка, [а1]: а2 });
  console.log(`${а1}: ${было} → ${а2}`);
  console.log(`обращений снизу вверх: ${до} → ${после} (${после - до >= 0 ? '+' : ''}${после - до})`);

} else if (команда === 'предложить') {
  // Для каждой сущности, к которой обращаются СНИЗУ, прикидываем перенос в
  // модуль самого нижнего из обращающихся — и считаем, сколько обращений
  // снизу вверх исчезнет. Это подсказка, а не решение: числа не знают, что
  // сущность значит.
  const счёт = (r) => {
    let n = 0;
    for (const e of карта.entities) {
      if (e.decl === 'statement') continue;
      const мой = r[e.name]; if (!мой) continue;
      for (const u of e.usedBy || []) {
        const чей = r[u.name];
        if (!чей || чей === мой) continue;
        if (слой(чей) < слой(мой)) n += u.count;
      }
    }
    return n;
  };
  const было = счёт(раскладка);
  const предложения = [];
  for (const e of карта.entities) {
    if (e.decl === 'statement') continue;
    const мой = раскладка[e.name]; if (!мой) continue;
    const снизу = (e.usedBy || []).map(u => раскладка[u.name]).filter(Boolean)
      .filter(м => слой(м) < слой(мой));
    if (!снизу.length) continue;
    const цель = снизу.sort((a, b) => слой(a) - слой(b))[0];
    const стало = счёт({ ...раскладка, [e.name]: цель });
    if (стало < было)
      предложения.push({ имя: e.name, из: мой, в: цель, выигрыш: было - стало, строк: e.lines });
  }
  предложения.sort((a, b) => b.выигрыш - a.выигрыш);
  console.log(`обращений снизу вверх сейчас: ${было}\n`);
  console.log('перенос                                       выигрыш  строк');
  for (const п of предложения.slice(0, 20))
    console.log(`${(п.имя + ': ' + п.из + ' → ' + п.в).padEnd(64)} ${String(п.выигрыш).padStart(4)}  ${п.строк}`);
  console.log('\nЭто ПОДСКАЗКА: числа не знают, что сущность значит.');

} else if (команда === 'ввозы') {
  console.log(`рёбер ввоза СНИЗУ ВВЕРХ: ${ввозНазад.length}, имён в них ` +
    `${ввозНазад.reduce((a, р) => a + р.имена.length, 0)}\n`);
  for (const р of ввозНазад)
    console.log(`${String(р.имена.length).padStart(3)}  ${р.из} (${слой(р.из)}) → ` +
      `${р.в} (${слой(р.в)}): ${р.имена.join(', ')}`);

} else {
  console.log('счёт ПО ВВОЗАМ ДЕРЕВА (это и есть сцепление):');
  console.log(`  рёбер снизу вверх ${ввозНазад.length}, имён ` +
    `${ввозНазад.reduce((a, р) => a + р.имена.length, 0)}`);
  console.log('счёт по обращениям в едином файле (показывает замысел):');
  console.log(`межмодульных рёбер ${рёбра.size}, из них СНИЗУ ВВЕРХ ${назад.length}; ` +
    `обращений в них ${назад.reduce((a, р) => a + р.раз, 0)}\n`);
  for (const р of назад)
    console.log(`${String(р.раз).padStart(4)}  ${р.из} (${слой(р.из)}) → ${р.в} (${слой(р.в)})\n` +
      `      ${р.примеры.join(', ')}`);
}
