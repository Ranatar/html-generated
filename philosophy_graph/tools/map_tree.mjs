#!/usr/bin/env node
// Карта СОБРАННОГО ДЕРЕВА — не одностраничного исходника.
//
// Зачем отдельная от globals_map. Та описывает единый файл: 746 сущностей в
// одной области видимости, обращения друг к другу и вызовы из разметки. Она
// нужна разбивке — по ней считается раскладка. Но у модульного дерева есть
// свойства, которых у единого файла нет вовсе и которых та карта не видит:
//
//   • кто у кого ЧТО ввозит и насколько плотно (сцепление модулей);
//   • какие имена вывезены, но никем не ввозятся — мёртвые вывозы;
//   • сколько раз модуль лезет в общие пространства DATA, S, MET, VIEWS;
//   • есть ли круги в графе ввозов и какое имя их замыкает;
//   • какие модули держат весь дом (входящая степень).
//
// И ещё одно, важное на будущее: эта карта строится по тому, ЧТО РАБОТАЕТ, а
// не по тому, из чего собрано. Когда одностраничную версию отпустят, карта по
// исходнику исчезнет вместе с ним, а эта останется.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import * as acorn from 'acorn';
const eslintScope = require('eslint-scope');

const ДЕРЕВО = process.argv[2] || '/home/claude/build/src';
const ВЫХОД = process.argv[3] || '/home/claude/map_tree.json';

const НС = ['DATA', 'S', 'MET', 'VIEWS'];

const файлы = [];
(function walk(d) {
  for (const f of fs.readdirSync(d).sort()) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'vendor') walk(p); continue; }
    if (p.endsWith('.js') && !f.startsWith('_')) файлы.push(p);
  }
})(ДЕРЕВО);

const модули = new Map();

for (const p of файлы) {
  const rel = path.relative(ДЕРЕВО, p).replace(/\\/g, '/');
  const текст = fs.readFileSync(p, 'utf8');
  const ast = acorn.parse(текст, { ecmaVersion: 2023, sourceType: 'module', ranges: true });
  const sm = eslintScope.analyze(ast, { ecmaVersion: 2023, sourceType: 'module' });

  const ввоз = [];            // {откуда, имена:[]}
  const вывоз = new Set();
  const свои = [];            // объявления верхнего уровня
  const вНС = {};             // DATA/S/MET/VIEWS -> {поле: сколько}

  for (const узел of ast.body) {
    if (узел.type === 'ImportDeclaration') {
      const цель = path.normalize(path.join(path.dirname(rel), узел.source.value))
        .replace(/\\/g, '/');
      ввоз.push({ откуда: цель,
        имена: узел.specifiers.filter(s => s.imported).map(s => s.imported.name) });
    } else if (узел.type === 'ExportNamedDeclaration') {
      if (узел.declaration) {
        if (узел.declaration.id) вывоз.add(узел.declaration.id.name);
        for (const d of узел.declaration.declarations || [])
          if (d.id.type === 'Identifier') вывоз.add(d.id.name);
      }
      for (const s of узел.specifiers) вывоз.add(s.exported.name);
    } else if (узел.type === 'FunctionDeclaration') {
      свои.push({ имя: узел.id.name, вид: узел.async ? 'async function' : 'function',
        строк: текст.slice(0, узел.range[1]).split('\n').length
             - текст.slice(0, узел.range[0]).split('\n').length + 1 });
    } else if (узел.type === 'VariableDeclaration') {
      for (const d of узел.declarations)
        if (d.id.type === 'Identifier')
          свои.push({ имя: d.id.name, вид: узел.kind, строк: 1 });
    }
  }

  // обращения к общим пространствам и к ввезённым именам
  const ввезено = new Map();
  for (const и of ввоз) for (const н of и.имена) ввезено.set(н, и.откуда);
  const счёт = new Map();     // имя -> сколько раз помянуто
  const своиОбращения = new Map();   // все упоминания имени в этом модуле

  (function обойти(узел) {
    if (!узел || typeof узел.type !== 'string') return;
    if (узел.type === 'MemberExpression' && !узел.computed
        && узел.object.type === 'Identifier' && НС.includes(узел.object.name)
        && узел.property.type === 'Identifier') {
      вНС[узел.object.name] = вНС[узел.object.name] || {};
      вНС[узел.object.name][узел.property.name] =
        (вНС[узел.object.name][узел.property.name] || 0) + 1;
    }
    if (узел.type === 'Identifier' && ввезено.has(узел.name))
      счёт.set(узел.name, (счёт.get(узел.name) || 0) + 1);
    if (узел.type === 'Identifier') своиОбращения.set(узел.name,
      (своиОбращения.get(узел.name) || 0) + 1);
    for (const k of Object.keys(узел)) {
      if (k === 'range' || k === 'loc') continue;
      const v = узел[k];
      if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && обойти(c));
      else if (v && typeof v.type === 'string') обойти(v);
    }
  })(ast);

  модули.set(rel, {
    путь: rel, строк: текст.split('\n').length,
    вывоз: [...вывоз].sort(), ввоз,
    свои, вНС, своиОбращения: Object.fromEntries(своиОбращения),
    обращения: [...счёт.entries()].sort((a, b) => b[1] - a[1])
      .map(([имя, раз]) => ({ имя, раз, откуда: ввезено.get(имя) })),
  });
}

// ── кого ввозят и насколько плотно ──────────────────────────────────
const ввозятИмя = new Map();      // имя -> [модули]
const ребро = new Map();          // «из→в» -> число имён
for (const [rel, м] of модули)
  for (const и of м.ввоз) {
    ребро.set(rel + '→' + и.откуда, и.имена.length);
    for (const н of и.имена) {
      if (!ввозятИмя.has(н)) ввозятИмя.set(н, []);
      ввозятИмя.get(н).push(rel);
    }
  }

// Два разных случая, которые легко спутать:
//
//   ЛИШНИЙ ВЫВОЗ — имя вывезено, никем не ввозится, но внутри своего модуля
//   работает. Разбивка вывозит ВСЕ собственные имена подряд, поэтому таких
//   много; это шум в списке вывоза, а не мёртвый код.
//
//   МЁРТВАЯ СУЩНОСТЬ — имя не помянуто нигде: ни снаружи, ни внутри своего
//   модуля. Вот это стоит разбирать.
const лишниеВывозы = [], мёртвыеСущности = [];
for (const [rel, м] of модули)
  for (const н of м.вывоз) {
    if ((ввозятИмя.get(н) || []).length) continue;
    // объявление само себя поминает один раз — обращением это не считается
    const внутри = (м.своиОбращения[н] || 0) - 1;
    (внутри > 0 ? лишниеВывозы : мёртвыеСущности).push({ имя: н, модуль: rel, внутри });
  }

// круги в графе ввозов
const граф = new Map([...модули.keys()].map(k => [k, new Set()]));
for (const [rel, м] of модули)
  for (const и of м.ввоз) if (граф.has(и.откуда)) граф.get(rel).add(и.откуда);
const круги = [];
{
  const idx = new Map(), low = new Map(), на = new Map(), ст = [];
  let счёт = 0;
  const сильно = (v) => {
    const stack = [[v, [...граф.get(v)][Symbol.iterator]()]];
    idx.set(v, счёт); low.set(v, счёт++); ст.push(v); на.set(v, true);
    while (stack.length) {
      const [узел, it] = stack[stack.length - 1];
      let вперёд = false;
      for (const w of it) {
        if (!idx.has(w)) {
          idx.set(w, счёт); low.set(w, счёт++); ст.push(w); на.set(w, true);
          stack.push([w, [...граф.get(w)][Symbol.iterator]()]); вперёд = true; break;
        } else if (на.get(w)) low.set(узел, Math.min(low.get(узел), idx.get(w)));
      }
      if (вперёд) continue;
      stack.pop();
      if (stack.length) {
        const p = stack[stack.length - 1][0];
        low.set(p, Math.min(low.get(p), low.get(узел)));
      }
      if (low.get(узел) === idx.get(узел)) {
        const c = [];
        for (;;) { const w = ст.pop(); на.set(w, false); c.push(w); if (w === узел) break; }
        if (c.length > 1) круги.push(c);
      }
    }
  };
  for (const v of граф.keys()) if (!idx.has(v)) сильно(v);
}

// поля общих пространств
const поляНС = {};
for (const н of НС) поляНС[н] = {};
for (const [rel, м] of модули)
  for (const н of НС)
    for (const [поле, раз] of Object.entries(м.вНС[н] || {})) {
      поляНС[н][поле] = поляНС[н][поле] || { раз: 0, модулей: new Set() };
      поляНС[н][поле].раз += раз;
      поляНС[н][поле].модулей.add(rel);
    }

// Приборы приёмки ввозят кое-что напрямую (actionNames, freezeSimulation и
// прочее) — в дереве это выглядит мёртвым, а на деле работает. Смотрим, кого
// зовут они, и не записываем таких в покойники.
const зовутПриборы = new Set();
{
  const каталог = path.resolve(ДЕРЕВО, '..', '..', 'tools');
  const рядом = [caталогЕсть(каталог), path.join(path.dirname(ДЕРЕВО), 'tools'),
                 path.resolve(ДЕРЕВО, '..', 'tools')].filter(Boolean);
  for (const к of рядом) {
    if (!fs.existsSync(к)) continue;
    for (const f of fs.readdirSync(к)) {
      if (!f.endsWith('.mjs')) continue;
      const t = fs.readFileSync(path.join(к, f), 'utf8');
      for (const m of t.matchAll(/import \{([^}]*)\} from '\.\/[^']*'/g))
        for (const н of m[1].split(',').map(x => x.trim()).filter(Boolean)) зовутПриборы.add(н);
    }
    break;
  }
  // ОСНАСТКА ТЕПЕРЬ ЕДИНСТВЕННАЯ, КТО ВВОЗИТ ИМЕНА ДЛЯ ПРИБОРОВ. Пока каждый
  // прибор ввозил модули сам, их ввозы находились обходом tools/. После того
  // как зашитые пути оттуда убрали, приборы читают всё через window.__app, и
  // здесь не находилось НИЧЕГО: actionNames тут же попал в «мёртвые», хотя
  // держится ровно приборами. Файлы с подчёркивания карта не читает намеренно
  // (это не часть приложения) — поэтому оснастку разбираем отдельно.
  const оснастка = path.join(ДЕРЕВО, '_probe-rig.js');
  if (fs.existsSync(оснастка)) {
    const t = fs.readFileSync(оснастка, 'utf8');
    for (const m of t.matchAll(/import \{([^}]*)\} from '\.\/[^']*'/g))
      for (const н of m[1].split(',').map(x => x.trim().split(/\s+as\s+/)[0]).filter(Boolean))
        зовутПриборы.add(н);
  }
}
function caталогЕсть(п) { return fs.existsSync(п) ? п : null; }

const мёртвыеБезПриборов = мёртвыеСущности.filter(x => !зовутПриборы.has(x.имя));
const держатсяПриборами = мёртвыеСущности.filter(x => зовутПриборы.has(x.имя));

const итог = {
  меры: {
    модулей: модули.size,
    строк: [...модули.values()].reduce((a, м) => a + м.строк, 0),
    объявлений: [...модули.values()].reduce((a, м) => a + м.свои.length, 0),
    вывозов: [...модули.values()].reduce((a, м) => a + м.вывоз.length, 0),
    рёбер: ребро.size,
    круговыхГрупп: круги.length,
    лишнихВывозов: лишниеВывозы.length,
    мёртвыхСущностей: мёртвыеБезПриборов.length,
    держатсяПриборами: держатсяПриборами.length,
    составлено: new Date().toISOString().slice(0, 19).replace('T', ' '),
  },
  модули: [...модули.values()].map(м => ({
    путь: м.путь, строк: м.строк,
    объявлений: м.свои.length, вывозит: м.вывоз.length,
    ввозитИз: м.ввоз.length,
    вНС: Object.fromEntries(НС.map(н => [н, Object.keys(м.вНС[н] || {}).length])
      .filter(([, v]) => v)),
    вывоз: м.вывоз, ввоз: м.ввоз, свои: м.свои,
    чащеВсего: м.обращения.slice(0, 5),
  })),
  самыеВостребованные: [...ввозятИмя.entries()]
    .map(([имя, где]) => ({ имя, ввозятМодулей: где.length }))
    .sort((a, b) => b.ввозятМодулей - a.ввозятМодулей).slice(0, 25),
  держатДом: [...модули.keys()].map(k => ({
    модуль: k,
    ввозятИзНего: [...модули.values()].filter(м => м.ввоз.some(и => и.откуда === k)).length,
  })).sort((a, b) => b.ввозятИзНего - a.ввозятИзНего).slice(0, 15),
  круги: круги.map(c => c.sort()),
  лишниеВывозы,
  мёртвыеСущности: мёртвыеБезПриборов,
  держатсяТолькоПриборами: держатсяПриборами,
  пространства: Object.fromEntries(НС.map(н => [н, {
    полей: Object.keys(поляНС[н]).length,
    самые: Object.entries(поляНС[н])
      .map(([поле, v]) => ({ поле, раз: v.раз, модулей: v.модулей.size }))
      .sort((a, b) => b.модулей - a.модулей).slice(0, 10),
  }])),
};

fs.writeFileSync(ВЫХОД, JSON.stringify(итог, null, 1));
console.log(`дерево: ${итог.меры.модулей} модулей, ${итог.меры.строк} строк, ` +
  `${итог.меры.объявлений} объявлений, ${итог.меры.вывозов} вывозов, ` +
  `${итог.меры.рёбер} рёбер ввоза`);
console.log(`круговых групп: ${итог.меры.круговыхГрупп}; ` +
  `лишних вывозов: ${итог.меры.лишнихВывозов}; ` +
  `МЁРТВЫХ СУЩНОСТЕЙ: ${итог.меры.мёртвыхСущностей}` +
  (итог.меры.держатсяПриборами ? `; держатся приборами: ${итог.меры.держатсяПриборами}` : ''));
for (const н of НС)
  console.log(`  ${н}: полей ${итог.пространства[н].полей}`);
