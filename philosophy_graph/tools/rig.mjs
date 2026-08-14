#!/usr/bin/env node
// Оснастка для приборов приёмки.
//
// Мост (bridge.js) существовал ради разметки. Разметка переведена на
// делегирование и в нём больше не нуждается — но приборы приёмки зовут
// действия по имени, и им нужна точка входа. Класть её в window навсегда
// значило бы вернуть мост под другим названием.
//
// Поэтому: отдельный файл _probe-rig.js, который приборы подключают САМИ
// (модульным тегом) и который в обычной работе приложения не участвует.
// Имя начинается с подчёркивания — счётчик долга такие пропускает, как и
// эталонную копию исходника.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.argv[2] || '/home/claude/build/src';

// имена, которые зовут приборы (собраны из самих приборов)
const ИМЕНА = `selectedNodes authLogout cancelGraphSelection changeFilterMode clearLegendSearch
clearSimilarityOverlay closeAuthModal closeConceptProfileModal closePathDescriptionsModal
closePhilosopherProfileModal closeStatsModal closeUniversalModal deselectAllPhilosophers
deselectAllRubrics findAndShowPath findConnection handleConnectionViewSearch
handleLegendSearch handleMetricsScopeChange handleModalSearch handleStatsParameterChange
highlightNodeById onlyTradition openAuthModal openConceptById openEditConceptModal
openEditConnectionModal openStatsModal openUniversalModal selectAllPhilosophers
selectAllRelations selectAllRubrics selectAllTraditions selectCustomOption
showConceptProfileModal showCustomSelectDropdown showPathDescriptionsModal
showPhilosopherProfileModal showSimilarityOverlay submitAuth switchStatsView
toggleConnectionSearchSection toggleGrouping toggleMetricLayout toggleMetricValueMode
toggleModalMode getConceptConnections freezeSimulation unfreezeSimulation
pickNode pickLink toGraph`.split(/\s+/).filter(Boolean);

// где что вывозится
const exportsOf = new Map();
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'vendor') walk(p); continue; }
    if (!p.endsWith('.js') || f.startsWith('_')) continue;
    const rel = path.relative(ROOT, p).replace(/\\/g, '/');
    const text = fs.readFileSync(p, 'utf8');
    for (const m of text.matchAll(/^export \{([^}]*)\};?$/gm))
      for (const n of m[1].split(',').map(s => s.trim()).filter(Boolean))
        exportsOf.set(n, rel);
    for (const m of text.matchAll(/^export (?:async )?function (\w+)/gm)) exportsOf.set(m[1], rel);
    for (const m of text.matchAll(/^export const (\w+)/gm)) exportsOf.set(m[1], rel);
  }
})(ROOT);

const need = new Map();
const нет = [];
for (const n of ИМЕНА) {
  const home = exportsOf.get(n);
  if (!home) { нет.push(n); continue; }
  if (!need.has(home)) need.set(home, new Set());
  need.get(home).add(n);
}

let out = `// Оснастка приборов приёмки. НЕ ЧАСТЬ ПРИЛОЖЕНИЯ: подключается
// только измерительными программами, отдельным модульным тегом.
// Сгенерировано tools/rig.mjs.
import { DATA, S, MET, VIEWS } from './core/ns.js';
`;
for (const m of [...need.keys()].sort())
  out += `import { ${[...need.get(m)].sort().join(', ')} } from './${m}';\n`;
out += `
const A = { DATA, S, MET, VIEWS, ${[...need.values()].flatMap(s => [...s]).sort().join(', ')} };
const ИЗМОДУЛЕЙ = { get selectedNodes() { return typeof selectedNodes !== 'undefined' ? selectedNodes : undefined; } };

// Приборы обращаются к данным и состоянию через свойства, чтобы видеть
// СВЕЖИЕ значения, а не снимок на миг подключения.
//
// Часть имён живёт то в общем состоянии, то обычной переменной своего
// модуля — это зависит от того, пишут ли в них извне, а раскладка со
// временем меняется. Поэтому смотрим В ОБА МЕСТА: сперва S, потом вывоз.
// Иначе прибор врёт при каждой такой перестановке.
Object.defineProperties(A, {
  nodes: { get: () => DATA.nodes },
  links: { get: () => DATA.links },
  concepts: { get: () => DATA.concepts },
  relations: { get: () => DATA.relations },
  philosophers: { get: () => DATA.philosophers },
  selectedNodes: { get: () => (S.selectedNodes !== undefined ? S.selectedNodes : ИЗМОДУЛЕЙ.selectedNodes) },
  isStatsModalOpen: { get: () => S.isStatsModalOpen },
  simulation: { get: () => S.simulation },
  renderState: { get: () => S.renderState },
  gfxCanvas: { get: () => S.gfxCanvas },
  tickCount: { get: () => S.tickCount },
});

window.__app = A;
window.__appReady = true;
`;
fs.writeFileSync(path.join(ROOT, '_probe-rig.js'), out);
console.log(`оснастка: имён ${ИМЕНА.length - нет.length} из ${ИМЕНА.length}` +
  (нет.length ? `; не вывозятся: ${нет.join(', ')}` : ''));
