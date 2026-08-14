# Спецификация модулей `philosophy_graph` — по собранному дереву

Составлено из готовой сборки: 94 модулей, 16370 строк.
Не замысел, а описание того, что есть, — поэтому расходиться с
действительностью ей нечем. Пересобирается программой `tools/gen_spec2.mjs`
после каждой сборки.

## Как это строится

```
tools/split.mjs <дерево> <исходник> <раскладка> <карта>   разбивка
tools/delegate.mjs <дерево> static                        атрибуты страницы
tools/delegate.mjs <дерево> dyn                           атрибуты генераторов
tools/rig.mjs <дерево>                                    оснастка приборов
tools/unbridge.mjs <дерево>                               снятие моста
```

Источник — **пропатченная одностраничная версия** (`philosophy_graph_v3.html`):
она же служит эталоном приёмки. Всякая новая возможность вносится в неё, а в
сборку приезжает разбивкой — по одной реализации на возможность.

**Раскладка задаётся именами, а не строками** (`assign_names.json`, 697 имён).
Номера строк сдвигаются от любой вставки, и по замеру тридцать чужих
сущностей молча уезжали в соседние модули. Имя, которого в раскладке нет,
**останавливает сборку** с перечнем — новая сущность требует явного решения.


## Пространства имён

| Имя | Что держит |
|---|---|
| `DATA` | шесть наборов базы и девять производных указателей; заполняется при запуске |
| `S` | изменяемое состояние и отложенные ячейки — всё, что либо меняется из чужого модуля (в том числе **из разметки**), либо не может быть вычислено при ввозе |
| `MET` | метрики, к которым обращаются по имени |
| `VIEWS` | генераторы окон, к которым обращаются по имени |

Три последних заменили `window[имя]`, который в модулях не работает вовсе.


## Модули

| Модуль | Строк | Вывозит | Ввозит из |
|---|---|---|---|
| `boot-defs.js` | 18 | 1 | 5 |
| `boot.js` | 1383 | 1 | 32 |
| `core/graph-index.js` | 104 | 5 | 1 |
| `core/labels.js` | 149 | 12 | 1 |
| `core/ns.js` | 11 | 4 | 0 |
| `core/predicates.js` | 41 | 6 | 1 |
| `core/ready.js` | 15 | 2 | 0 |
| `core/session.js` | 14 | 4 | 0 |
| `core/visibility.js` | 9 | 2 | 1 |
| `data/load.js` | 16 | 1 | 1 |
| `data/mutate.js` | 237 | 13 | 16 |
| `data/save.js` | 63 | 9 | 1 |
| `dead.js` | 86 | 7 | 3 |
| `filters/chains.js` | 299 | 7 | 2 |
| `filters/filters.js` | 257 | 12 | 12 |
| `filters/state.js` | 10 | 1 | 1 |
| `graph/click-actions.js` | 200 | 8 | 7 |
| `main.js` | 100 | 0 | 89 |
| `metrics/advanced.js` | 224 | 8 | 2 |
| `metrics/cache.js` | 43 | 1 | 8 |
| `metrics/data.js` | 70 | 5 | 2 |
| `metrics/descriptions.js` | 18 | 1 | 1 |
| `metrics/format.js` | 32 | 4 | 2 |
| `metrics/generativity.js` | 75 | 6 | 2 |
| `metrics/graph-cache.js` | 117 | 3 | 3 |
| `metrics/init.js` | 77 | 1 | 4 |
| `metrics/network.js` | 846 | 23 | 2 |
| `metrics/philosopher.js` | 302 | 11 | 2 |
| `metrics/philosophical.js` | 1058 | 22 | 6 |
| `metrics/rankings.js` | 139 | 5 | 3 |
| `metrics/scope.js` | 241 | 14 | 8 |
| `metrics/similarity-concepts.js` | 243 | 15 | 3 |
| `metrics/similarity-philosophers.js` | 142 | 7 | 3 |
| `metrics/thresholds.js` | 30 | 11 | 0 |
| `metrics/typed.js` | 203 | 8 | 4 |
| `modal/auth.js` | 203 | 13 | 3 |
| `modal/concept-edit.js` | 146 | 0 | 11 |
| `modal/concept-view.js` | 340 | 1 | 12 |
| `modal/connection-edit.js` | 294 | 9 | 10 |
| `modal/connection-view.js` | 411 | 10 | 8 |
| `modal/context.js` | 15 | 3 | 0 |
| `modal/core.js` | 150 | 5 | 9 |
| `modal/dirty.js` | 110 | 5 | 3 |
| `modal/edit-common.js` | 47 | 3 | 2 |
| `modal/entry.js` | 119 | 12 | 6 |
| `modal/integrity.js` | 253 | 10 | 5 |
| `modal/persist.js` | 350 | 8 | 10 |
| `modal/philosopher-edit.js` | 123 | 0 | 7 |
| `modal/philosopher-view.js` | 555 | 2 | 12 |
| `modal/profile-concept.js` | 160 | 7 | 10 |
| `modal/profile-philosopher.js` | 119 | 2 | 7 |
| `modal/registry.js` | 38 | 2 | 1 |
| `modal/toggles.js` | 162 | 10 | 0 |
| `paths/analysis.js` | 72 | 2 | 5 |
| `paths/chronology.js` | 123 | 4 | 2 |
| `paths/path-ui.js` | 491 | 13 | 7 |
| `paths/shortest-path.js` | 178 | 4 | 3 |
| `render/canvas-core.js` | 20 | 2 | 2 |
| `render/d3-layer.js` | 67 | 7 | 2 |
| `render/geometry.js` | 183 | 18 | 3 |
| `render/grouping.js` | 78 | 5 | 2 |
| `render/interactions.js` | 90 | 5 | 10 |
| `render/metric-visualization.js` | 353 | 8 | 4 |
| `render/picking.js` | 76 | 6 | 5 |
| `render/scene.js` | 231 | 11 | 6 |
| `render/selection.js` | 188 | 7 | 2 |
| `render/similarity-overlay.js` | 111 | 6 | 6 |
| `render/simulation.js` | 77 | 8 | 4 |
| `state.js` | 16 | 3 | 0 |
| `stats/modal.js` | 216 | 6 | 14 |
| `stats/results.js` | 350 | 13 | 9 |
| `stats/run.js` | 128 | 4 | 3 |
| `stats/views/advanced.js` | 269 | 10 | 4 |
| `stats/views/comparison.js` | 426 | 10 | 9 |
| `stats/views/network.js` | 222 | 9 | 4 |
| `stats/views/philosopher.js` | 170 | 4 | 5 |
| `stats/views/philosophical.js` | 420 | 10 | 4 |
| `stats/views/rankings.js` | 141 | 2 | 7 |
| `ui/actions-byname.js` | 20 | 0 | 2 |
| `ui/actions-dyn.js` | 132 | 0 | 29 |
| `ui/actions-static.js` | 100 | 0 | 15 |
| `ui/actions.js` | 27 | 3 | 0 |
| `ui/custom-select.js` | 118 | 7 | 2 |
| `ui/delegation.js` | 70 | 1 | 1 |
| `ui/export.js` | 122 | 2 | 7 |
| `ui/feedback.js` | 34 | 1 | 0 |
| `ui/legend.js` | 292 | 22 | 4 |
| `ui/search-core.js` | 70 | 3 | 2 |
| `ui/search-legend.js` | 66 | 3 | 5 |
| `ui/search-modal.js` | 21 | 1 | 1 |
| `util/format.js` | 57 | 8 | 1 |
| `util/html.js` | 9 | 1 | 0 |
| `util/misc.js` | 20 | 2 | 0 |
| `util/ru.js` | 49 | 3 | 0 |

## Состав, вывоз и ввоз по модулям


### `boot-defs.js`

Строк 18.

**Вывозит:** `closeAllModals`

**Ввозит:**

- из `./modal/core.js`: `closeUniversalModal`
- из `./modal/entry.js`: `closeDetailModal`, `closePhilosopherDetailModal`
- из `./modal/profile-concept.js`: `closeConceptProfileModal`
- из `./modal/profile-philosopher.js`: `closePhilosopherProfileModal`
- из `./paths/path-ui.js`: `closePathDescriptionsModal`

**Содержит:** `closeAllModals`

### `boot.js`

Строк 1383.

**Вывозит:** `boot`

**Ввозит:**

- из `./core/ns.js`: `DATA`, `S`, `MET`, `VIEWS`
- из `./data/load.js`: `loadData`
- из `./core/graph-index.js`: `buildIndexes`
- из `./core/ready.js`: `onReady`, `onLoad`
- из `./boot-defs.js`: `closeAllModals`
- из `./core/labels.js`: `CHRONOLOGY_MODES`
- из `./core/predicates.js`: `isReflexiveLink`, `isSymmetricLink`
- из `./data/mutate.js`: `cancelGraphSelection`
- из `./data/save.js`: `hasUnsavedEdits`
- из `./filters/chains.js`: `CHAIN_SEARCH`
- из `./filters/filters.js`: `linkPassesTraditions`, `philTraditionsSelected`
- из `./metrics/generativity.js`: `generativity`
- из `./metrics/init.js`: `initializePhilosophyMetrics`
- из `./metrics/thresholds.js`: `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF`, `DISRUPTIVE_TYPES`, `PHIL_SIM_MIN_RUBRIC_UNION`, `SYSTEMATIC_TYPES`
- из `./modal/auth.js`: `renderAuthControls`
- из `./modal/context.js`: `modalStack`
- из `./modal/core.js`: `popModalState`
- из `./modal/philosopher-view.js`: `makeLegendsEditable`
- из `./paths/path-ui.js`: `initPathFinder`
- из `./render/canvas-core.js`: `resizeCanvas`
- из `./render/d3-layer.js`: `dragended`, `dragstarted`, `linkHandlers`, `makeClassed`, `nodeHandlers`, `subSelection`
- из `./render/grouping.js`: `cols`, `groupPositions`, `restorePanelStates`
- из `./render/interactions.js`: `initGraphEventHandlers`
- из `./render/metric-visualization.js`: `saveOriginalRadii`
- из `./render/picking.js`: `pickNode`, `rebuildQuadtree`
- из `./render/scene.js`: `requestDraw`
- из `./render/simulation.js`: `maxTicks`
- из `./state.js`: `selectedEdges`
- из `./stats/modal.js`: `closeStatsModal`
- из `./ui/custom-select.js`: `initializeCustomSelects`
- из `./ui/legend.js`: `initFilters`, `updateFilterStats`
- из `./util/format.js`: `labelWithAuthor`

**Содержит:** `boot`

### `core/graph-index.js`

Строк 104.

**Вывозит:** `buildIndexes`, `connectionsBetween`, `findConnection`, `getConceptConnections`, `traditionsOfPhilosopher`

**Ввозит:**

- из `./ns.js`: `DATA`

**Содержит:** `buildIndexes`, `connectionsBetween`, `findConnection`, `getConceptConnections`, `traditionsOfPhilosopher`

### `core/labels.js`

Строк 149.

**Вывозит:** `CHRONOLOGY_MODES`, `CONN_WEIGHT_WORDS`, `INFLUENCE_SCOPE_LABELS`, `LAYER_NAMES`, `MATURITY_AGE`, `METRIC_FIELD_LABELS`, `PHIL_SIM_LABELS`, `RELATION_HINTS`, `SIM_METRIC_LABELS`, `WEIGHT_OPTIONS`, `WEIGHT_WORDS`, `relationHint`

**Ввозит:**

- из `./ns.js`: `DATA`

**Содержит:** `CHRONOLOGY_MODES`, `CONN_WEIGHT_WORDS`, `INFLUENCE_SCOPE_LABELS`, `LAYER_NAMES`, `MATURITY_AGE`, `METRIC_FIELD_LABELS`, `PHIL_SIM_LABELS`, `RELATION_HINTS`, `SIM_METRIC_LABELS`, `WEIGHT_OPTIONS`, `WEIGHT_WORDS`, `relationHint`

### `core/ns.js`

Строк 11.

**Вывозит:** `DATA`, `MET`, `S`, `VIEWS`

**Ввозит:** _ничего_

**Содержит:** `DATA`, `MET`, `S`, `VIEWS`

### `core/predicates.js`

Строк 41.

**Вывозит:** `isReflexiveLink`, `isSymmetricLink`, `isTypologicalLink`, `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`

**Ввозит:**

- из `./ns.js`: `DATA`, `S`

**Содержит:** `isReflexiveLink`, `isSymmetricLink`, `isTypologicalLink`, `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`

### `core/ready.js`

Строк 15.

**Вывозит:** `onLoad`, `onReady`

**Ввозит:** _ничего_

**Содержит:** `onLoad`, `onReady`

### `core/session.js`

Строк 14.

**Вывозит:** `AUTH_ADMIN`, `authAccounts`, `authSession`, `canEdit`

**Ввозит:** _ничего_

**Содержит:** `AUTH_ADMIN`, `authAccounts`, `authSession`, `canEdit`

### `core/visibility.js`

Строк 9.

**Вывозит:** `isLinkVisible`, `isNodeVisible`

**Ввозит:**

- из `./ns.js`: `S`

**Содержит:** `isLinkVisible`, `isNodeVisible`

### `data/load.js`

Строк 16.

**Вывозит:** `loadData`

**Ввозит:**

- из `../core/ns.js`: `DATA`

**Содержит:** `FILES`, `loadData`

### `data/mutate.js`

Строк 237.

**Вывозит:** `addLinkToGraph`, `addNodeToGraph`, `afterDataChange`, `cancelGraphSelection`, `forgetLink`, `forgetNode`, `handleConceptSelection`, `pinnedVisibleNodes`, `rebuildDerivedIndexes`, `selectConceptOnGraph`, `updateGraphData`, `updateLinkOnGraph`, `updateNodeOnGraph`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `./save.js`: `markDirty`
- из `../filters/filters.js`: `applyFiltersImmediate`
- из `../filters/state.js`: `rebuildPhilosopherTraditions`
- из `../metrics/init.js`: `initializePhilosophyMetrics`
- из `../metrics/scope.js`: `invalidateEverythingForScope`
- из `../modal/connection-edit.js`: `selectConnectionEditConcept`
- из `../modal/connection-view.js`: `selectConnectionViewConcept`
- из `../modal/context.js`: `modalStack`
- из `../modal/philosopher-view.js`: `makeLegendsEditable`
- из `../render/picking.js`: `rebuildQuadtree`
- из `../render/scene.js`: `requestDraw`
- из `../render/similarity-overlay.js`: `clearSimilarityOverlay`
- из `../state.js`: `selectedEdges`, `selectedNodes`
- из `../stats/modal.js`: `loadStatsContent`
- из `../ui/legend.js`: `initFilters`, `updateFilterStats`

**Содержит:** `addLinkToGraph`, `addNodeToGraph`, `afterDataChange`, `cancelGraphSelection`, `forgetLink`, `forgetNode`, `handleConceptSelection`, `pinnedVisibleNodes`, `rebuildDerivedIndexes`, `selectConceptOnGraph`, `updateGraphData`, `updateLinkOnGraph`, `updateNodeOnGraph`

### `data/save.js`

Строк 63.

**Вывозит:** `DATA_SETS`, `collectData`, `dataFolder`, `deliverFile`, `downloadData`, `hasUnsaved`, `hasUnsavedEdits`, `markDirty`, `saveToFolder`

**Ввозит:**

- из `../core/ns.js`: `DATA`

**Содержит:** `DATA_SETS`, `collectData`, `dataFolder`, `deliverFile`, `downloadData`, `hasUnsaved`, `hasUnsavedEdits`, `markDirty`, `saveToFolder`

### `dead.js`

Строк 86.

**Вывозит:** `TENSION_WEIGHTS`, `_tensionScales`, `_tensionScalesComputing`, `findConnectedComponents`, `invalidateTensionScales`, `tensionScales`, `toggleSimilarityKind`

**Ввозит:**

- из `./core/ns.js`: `DATA`, `MET`, `S`
- из `./metrics/graph-cache.js`: `buildGlobalGraphCache`
- из `./render/similarity-overlay.js`: `showSimilarityOverlay`

**Содержит:** `TENSION_WEIGHTS`, `_tensionScales`, `_tensionScalesComputing`, `findConnectedComponents`, `invalidateTensionScales`, `tensionScales`, `toggleSimilarityKind`

### `filters/chains.js`

Строк 299.

**Вывозит:** `CHAIN_SEARCH`, `CHAIN_WARN_THRESHOLD`, `buildAdjacencyGraph`, `confirmLongChainSearch`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`, `processBFS`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/predicates.js`: `isSymmetricLink`

**Содержит:** `CHAIN_SEARCH`, `CHAIN_WARN_THRESHOLD`, `buildAdjacencyGraph`, `confirmLongChainSearch`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`, `processBFS`

### `filters/filters.js`

Строк 257.

**Вывозит:** `applyBasicFilter`, `applyChainVisibility`, `applyFilters`, `applyFiltersImmediate`, `cleanupInvisibleSelections`, `debouncedApplyFilters`, `handleChainsMode`, `handleUniqueChainsMode`, `linkPassesTraditions`, `philTraditionsSelected`, `philosopherPassesTraditions`, `refreshMetricsIfScoped`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `../data/mutate.js`: `pinnedVisibleNodes`
- из `./chains.js`: `CHAIN_SEARCH`, `confirmLongChainSearch`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`
- из `../metrics/init.js`: `initializePhilosophyMetrics`
- из `../metrics/scope.js`: `invalidateEverythingForScope`, `updateMetricsScopeHint`
- из `../render/selection.js`: `highlightConnected`, `resetHighlight`
- из `../state.js`: `selectedNodes`
- из `../stats/modal.js`: `loadStatsContent`
- из `../ui/feedback.js`: `showTemporaryMessage`
- из `../ui/legend.js`: `updateFilterStats`, `updatePhilosopherDimming`
- из `../util/misc.js`: `debounce`

**Содержит:** `applyBasicFilter`, `applyChainVisibility`, `applyFilters`, `applyFiltersImmediate`, `cleanupInvisibleSelections`, `debouncedApplyFilters`, `handleChainsMode`, `handleUniqueChainsMode`, `linkPassesTraditions`, `philTraditionsSelected`, `philosopherPassesTraditions`, `refreshMetricsIfScoped`

### `filters/state.js`

Строк 10.

**Вывозит:** `rebuildPhilosopherTraditions`

**Ввозит:**

- из `../core/ns.js`: `DATA`

**Содержит:** `rebuildPhilosopherTraditions`

### `graph/click-actions.js`

Строк 200.

**Вывозит:** `clickCount`, `clickTimer`, `handleLinkClick`, `handleLinkSelect`, `handleNodeClick`, `lastClickedNode`, `linkClickCount`, `linkClickTimer`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/session.js`: `canEdit`
- из `../data/mutate.js`: `handleConceptSelection`
- из `../modal/core.js`: `openUniversalModal`
- из `../modal/entry.js`: `openEditConceptModal`, `openEditConnectionModal`, `showDetailModal`
- из `../render/selection.js`: `highlightCombined`, `isEdgeConnectedToSelectedNodes`, `isNodeConnectedToSelectedEdges`
- из `../state.js`: `editMode`, `selectedEdges`, `selectedNodes`

**Содержит:** `clickCount`, `clickTimer`, `handleLinkClick`, `handleLinkSelect`, `handleNodeClick`, `lastClickedNode`, `linkClickCount`, `linkClickTimer`

### `main.js`

Строк 100.

**Вывозит:** _ничего_

**Ввозит:**

- из `./ui/delegation.js`: `installDelegation`
- из `./boot.js`: `boot`
- из `./boot-defs.js`: _ради побочного действия_
- из `./core/graph-index.js`: _ради побочного действия_
- из `./core/labels.js`: _ради побочного действия_
- из `./core/predicates.js`: _ради побочного действия_
- из `./core/session.js`: _ради побочного действия_
- из `./core/visibility.js`: _ради побочного действия_
- из `./data/mutate.js`: _ради побочного действия_
- из `./data/save.js`: _ради побочного действия_
- из `./dead.js`: _ради побочного действия_
- из `./filters/chains.js`: _ради побочного действия_
- из `./filters/filters.js`: _ради побочного действия_
- из `./filters/state.js`: _ради побочного действия_
- из `./graph/click-actions.js`: _ради побочного действия_
- из `./metrics/advanced.js`: _ради побочного действия_
- из `./metrics/cache.js`: _ради побочного действия_
- из `./metrics/data.js`: _ради побочного действия_
- из `./metrics/descriptions.js`: _ради побочного действия_
- из `./metrics/format.js`: _ради побочного действия_
- из `./metrics/generativity.js`: _ради побочного действия_
- из `./metrics/graph-cache.js`: _ради побочного действия_
- из `./metrics/init.js`: _ради побочного действия_
- из `./metrics/network.js`: _ради побочного действия_
- из `./metrics/philosopher.js`: _ради побочного действия_
- из `./metrics/philosophical.js`: _ради побочного действия_
- из `./metrics/rankings.js`: _ради побочного действия_
- из `./metrics/scope.js`: _ради побочного действия_
- из `./metrics/similarity-concepts.js`: _ради побочного действия_
- из `./metrics/similarity-philosophers.js`: _ради побочного действия_
- из `./metrics/thresholds.js`: _ради побочного действия_
- из `./metrics/typed.js`: _ради побочного действия_
- из `./modal/auth.js`: _ради побочного действия_
- из `./modal/concept-edit.js`: _ради побочного действия_
- из `./modal/concept-view.js`: _ради побочного действия_
- из `./modal/connection-edit.js`: _ради побочного действия_
- из `./modal/connection-view.js`: _ради побочного действия_
- из `./modal/context.js`: _ради побочного действия_
- из `./modal/core.js`: _ради побочного действия_
- из `./modal/dirty.js`: _ради побочного действия_
- из `./modal/edit-common.js`: _ради побочного действия_
- из `./modal/entry.js`: _ради побочного действия_
- из `./modal/integrity.js`: _ради побочного действия_
- из `./modal/persist.js`: _ради побочного действия_
- из `./modal/philosopher-edit.js`: _ради побочного действия_
- из `./modal/philosopher-view.js`: _ради побочного действия_
- из `./modal/profile-concept.js`: _ради побочного действия_
- из `./modal/profile-philosopher.js`: _ради побочного действия_
- из `./modal/registry.js`: _ради побочного действия_
- из `./modal/toggles.js`: _ради побочного действия_
- из `./paths/analysis.js`: _ради побочного действия_
- из `./paths/chronology.js`: _ради побочного действия_
- из `./paths/path-ui.js`: _ради побочного действия_
- из `./paths/shortest-path.js`: _ради побочного действия_
- из `./render/canvas-core.js`: _ради побочного действия_
- из `./render/d3-layer.js`: _ради побочного действия_
- из `./render/geometry.js`: _ради побочного действия_
- из `./render/grouping.js`: _ради побочного действия_
- из `./render/interactions.js`: _ради побочного действия_
- из `./render/metric-visualization.js`: _ради побочного действия_
- из `./render/picking.js`: _ради побочного действия_
- из `./render/scene.js`: _ради побочного действия_
- из `./render/selection.js`: _ради побочного действия_
- из `./render/similarity-overlay.js`: _ради побочного действия_
- из `./render/simulation.js`: _ради побочного действия_
- из `./state.js`: _ради побочного действия_
- из `./stats/modal.js`: _ради побочного действия_
- из `./stats/results.js`: _ради побочного действия_
- из `./stats/run.js`: _ради побочного действия_
- из `./stats/views/advanced.js`: _ради побочного действия_
- из `./stats/views/comparison.js`: _ради побочного действия_
- из `./stats/views/network.js`: _ради побочного действия_
- из `./stats/views/philosopher.js`: _ради побочного действия_
- из `./stats/views/philosophical.js`: _ради побочного действия_
- из `./stats/views/rankings.js`: _ради побочного действия_
- из `./ui/custom-select.js`: _ради побочного действия_
- из `./ui/export.js`: _ради побочного действия_
- из `./ui/feedback.js`: _ради побочного действия_
- из `./ui/legend.js`: _ради побочного действия_
- из `./ui/search-core.js`: _ради побочного действия_
- из `./ui/search-legend.js`: _ради побочного действия_
- из `./ui/search-modal.js`: _ради побочного действия_
- из `./util/format.js`: _ради побочного действия_
- из `./util/html.js`: _ради побочного действия_
- из `./util/misc.js`: _ради побочного действия_
- из `./util/ru.js`: _ради побочного действия_
- из `./ui/actions-byname.js`: _ради побочного действия_
- из `./ui/actions-static.js`: _ради побочного действия_
- из `./ui/actions-dyn.js`: _ради побочного действия_

**Содержит:** _только исполняемый код_

### `metrics/advanced.js`

Строк 224.

**Вывозит:** `conceptualComplexityIndexCache`, `conceptualContinuityIndexCache`, `conceptualFertilityIndexCache`, `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateTransformationIndexCache`, `transformationIndexCache`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `../core/predicates.js`: `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`

**Содержит:** `MET.conceptualComplexityIndex`, `MET.conceptualContinuityIndex`, `MET.conceptualFertilityIndex`, `MET.transformationIndex`, `conceptualComplexityIndexCache`, `conceptualContinuityIndexCache`, `conceptualFertilityIndexCache`, `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateTransformationIndexCache`, `transformationIndexCache`

### `metrics/cache.js`

Строк 43.

**Вывозит:** `invalidateAllMetricsCaches`

**Ввозит:**

- из `../dead.js`: `invalidateTensionScales`
- из `./advanced.js`: `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateTransformationIndexCache`
- из `./generativity.js`: `invalidateGenerativityCache`
- из `./philosopher.js`: `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidateTemporalInfluencePatternCache`
- из `./philosophical.js`: `invalidateCriticalPowerIndexCache`, `invalidateDialogicalIndexCache`, `invalidateFoundationalIndexCache`, `invalidateInfluenceIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateProblemGenerationIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateSyntheticIndexCache`, `invalidateTensionIndexCache`
- из `./rankings.js`: `invalidateGeneratePhilosopherRankingsCache`, `invalidateGenerateRankingsCache`
- из `./similarity-concepts.js`: `invalidateSimilarityCache`
- из `./typed.js`: `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache`, `invalidateInstrumentalIndexCache`, `invalidateTraditionBridgingCache`

**Содержит:** `invalidateAllMetricsCaches`

### `metrics/data.js`

Строк 70.

**Вывозит:** `buildIncomingLinks`, `buildOutgoingLinks`, `initializeMetricsData`, `medianNodeDegree`, `nodeDegreeOf`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/predicates.js`: `isReflexiveLink`, `isSymmetricLink`

**Содержит:** `buildIncomingLinks`, `buildOutgoingLinks`, `initializeMetricsData`, `medianNodeDegree`, `nodeDegreeOf`

### `metrics/descriptions.js`

Строк 18.

**Вывозит:** `getMetricDescription`

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `getMetricDescription`

### `metrics/format.js`

Строк 32.

**Вывозит:** `applyMetricMode`, `conceptDegreeForNorm`, `normalizeMetricValue`, `toggleMetricValueMode`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../stats/modal.js`: `loadStatsContent`

**Содержит:** `applyMetricMode`, `conceptDegreeForNorm`, `normalizeMetricValue`, `toggleMetricValueMode`

### `metrics/generativity.js`

Строк 75.

**Вывозит:** `_generativityCacheByScope`, `generativity`, `generativityScores`, `invalidateGenerativityCache`, `linkInInfluenceScope`, `sameTraditionPhil`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `./thresholds.js`: `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS`

**Содержит:** `_generativityCacheByScope`, `generativity`, `generativityScores`, `invalidateGenerativityCache`, `linkInInfluenceScope`, `sameTraditionPhil`

### `metrics/graph-cache.js`

Строк 117.

**Вывозит:** `buildGlobalGraphCache`, `graphCache`, `invalidateGraphCache`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/predicates.js`: `isSymmetricLink`
- из `./scope.js`: `metricsLinks`, `metricsNodes`

**Содержит:** `buildGlobalGraphCache`, `graphCache`, `invalidateGraphCache`

### `metrics/init.js`

Строк 77.

**Вывозит:** `initializePhilosophyMetrics`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/visibility.js`: `isNodeVisible`
- из `./data.js`: `initializeMetricsData`
- из `./scope.js`: `effectiveScopeFlags`, `transformForScope`

**Содержит:** `initializePhilosophyMetrics`

### `metrics/network.js`

Строк 846.

**Вывозит:** `betweennessCache`, `betweennessCalculating`, `bfsFromSource`, `calculateBetweennessAsync`, `closenessCache`, `closenessCalculating`, `clusteringCache`, `dijkstraFromSource`, `eigenvectorCache`, `eigenvectorCalculating`, `invalidateBetweennessCache`, `invalidateClosenessCache`, `invalidateClusteringCache`, `invalidateEigenvectorCache`, `invalidateLocalCohesionCache`, `invalidatePageRankCache`, `invalidateRichClubCache`, `invalidateWeightedClusteringCache`, `localCohesionCache`, `pageRankCache`, `pageRankCalculating`, `richClubCache`, `weightedClusteringCache`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `./graph-cache.js`: `buildGlobalGraphCache`

**Содержит:** `MET.calculateBetweenness`, `MET.calculateClosenessCentrality`, `MET.calculateClusteringCoefficient`, `MET.calculateEigenvectorCentrality`, `MET.calculateLocalCohesion`, `MET.calculatePageRank`, `MET.calculateRichClubCoefficient`, `MET.calculateWeightedClustering`, `MET.calculateWeightedDegree`, `betweennessCache`, `betweennessCalculating`, `bfsFromSource`, `calculateBetweennessAsync`, `closenessCache`, `closenessCalculating`, `clusteringCache`, `dijkstraFromSource`, `eigenvectorCache`, `eigenvectorCalculating`, `invalidateBetweennessCache`, `invalidateClosenessCache`, `invalidateClusteringCache`, `invalidateEigenvectorCache`, `invalidateLocalCohesionCache`, `invalidatePageRankCache`, `invalidateRichClubCache`, `invalidateWeightedClusteringCache`, `localCohesionCache`, `pageRankCache`, `pageRankCalculating`, `richClubCache`, `weightedClusteringCache`

### `metrics/philosopher.js`

Строк 302.

**Вывозит:** `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidateTemporalInfluencePatternCache`, `philosopherHistoricalReachIndexCache`, `philosopherInterdisciplinaryIndexCache`, `philosopherProfile`, `philosopherProfileCache`, `philosopherSystematicIndexCache`, `temporalInfluencePatternCache`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `./thresholds.js`: `CONSTRUCTIVE_TYPES`, `DISRUPTIVE_TYPES`, `POLEMICAL_TYPES`, `SYSTEMATIC_TYPES`

**Содержит:** `MET.philosopherHistoricalReachIndex`, `MET.philosopherInterdisciplinaryIndex`, `MET.philosopherSystematicIndex`, `MET.temporalInfluencePattern`, `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidateTemporalInfluencePatternCache`, `philosopherHistoricalReachIndexCache`, `philosopherInterdisciplinaryIndexCache`, `philosopherProfile`, `philosopherProfileCache`, `philosopherSystematicIndexCache`, `temporalInfluencePatternCache`

### `metrics/philosophical.js`

Строк 1058.

**Вывозит:** `criticalPowerIndexCache`, `dialogicalIndexCache`, `foundationalIndexCache`, `influenceIndexCache`, `influenceScopeSwitcher`, `internalCoherenceIndexCache`, `invalidateCriticalPowerIndexCache`, `invalidateDialogicalIndexCache`, `invalidateFoundationalIndexCache`, `invalidateInfluenceIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateProblemGenerationIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateSyntheticIndexCache`, `invalidateTensionIndexCache`, `paradigmShiftIndexCache`, `problemGenerationIndexCache`, `revolutionaryIndexCache`, `setInfluenceScope`, `syntheticIndexCache`, `tensionIndexCache`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `../core/labels.js`: `INFLUENCE_SCOPE_LABELS`
- из `../core/predicates.js`: `isSymmetricLink`, `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`
- из `./generativity.js`: `generativity`, `linkInInfluenceScope`
- из `./rankings.js`: `invalidateGeneratePhilosopherRankingsCache`
- из `../stats/modal.js`: `loadStatsContent`

**Содержит:** `MET.criticalPowerIndex`, `MET.dialogicalIndex`, `MET.foundationalIndex`, `MET.influenceIndex`, `MET.internalCoherenceIndex`, `MET.paradigmShiftIndex`, `MET.problemGenerationIndex`, `MET.revolutionaryIndex`, `MET.syntheticIndex`, `MET.tensionIndex`, `criticalPowerIndexCache`, `dialogicalIndexCache`, `foundationalIndexCache`, `influenceIndexCache`, `influenceScopeSwitcher`, `internalCoherenceIndexCache`, `invalidateCriticalPowerIndexCache`, `invalidateDialogicalIndexCache`, `invalidateFoundationalIndexCache`, `invalidateInfluenceIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateProblemGenerationIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateSyntheticIndexCache`, `invalidateTensionIndexCache`, `paradigmShiftIndexCache`, `problemGenerationIndexCache`, `revolutionaryIndexCache`, `setInfluenceScope`, `syntheticIndexCache`, `tensionIndexCache`

### `metrics/rankings.js`

Строк 139.

**Вывозит:** `generatePhilosopherRankings`, `generatePhilosopherRankingsCache`, `generateRankings`, `invalidateGeneratePhilosopherRankingsCache`, `invalidateGenerateRankingsCache`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `./format.js`: `applyMetricMode`
- из `./philosopher.js`: `philosopherProfile`

**Содержит:** `generatePhilosopherRankings`, `generatePhilosopherRankingsCache`, `generateRankings`, `invalidateGeneratePhilosopherRankingsCache`, `invalidateGenerateRankingsCache`

### `metrics/scope.js`

Строк 241.

**Вывозит:** `METRIC_FLAGS`, `VIEW_METRIC`, `applyMetricsScope`, `effectiveScopeFlags`, `handleMetricsScopeChange`, `installMetricScopeWrappers`, `invalidateEverythingForScope`, `metricScopeFactor`, `metricsLinks`, `metricsNodes`, `metricsScopeCounts`, `transformForScope`, `updateMetricsScopeHint`, `updateScopeToggles`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `../core/visibility.js`: `isNodeVisible`
- из `./cache.js`: `invalidateAllMetricsCaches`
- из `./graph-cache.js`: `invalidateGraphCache`
- из `./init.js`: `initializePhilosophyMetrics`
- из `./network.js`: `invalidateBetweennessCache`, `invalidateClosenessCache`, `invalidateClusteringCache`, `invalidateEigenvectorCache`, `invalidateLocalCohesionCache`, `invalidatePageRankCache`, `invalidateRichClubCache`, `invalidateWeightedClusteringCache`
- из `../stats/modal.js`: `loadStatsContent`
- из `../stats/results.js`: `invalidateMetricCoverageCache`

**Содержит:** `METRIC_FLAGS`, `VIEW_METRIC`, `applyMetricsScope`, `effectiveScopeFlags`, `handleMetricsScopeChange`, `installMetricScopeWrappers`, `invalidateEverythingForScope`, `metricScopeFactor`, `metricsLinks`, `metricsNodes`, `metricsScopeCounts`, `transformForScope`, `updateMetricsScopeHint`, `updateScopeToggles`

### `metrics/similarity-concepts.js`

Строк 243.

**Вывозит:** `PAIRS_CHUNK_ROWS`, `_neighborCache`, `_pairCache`, `_pairCalculating`, `_simCache`, `allConceptPairs`, `allConceptPairsAsync`, `invalidateSimilarityCache`, `nearestConcepts`, `neighborSets`, `profileIsMeaningful`, `profileSimilarity`, `similarityData`, `structuralSimilarity`, `typeProfileOf`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `./data.js`: `medianNodeDegree`, `nodeDegreeOf`
- из `./similarity-philosophers.js`: `invalidatePhilosopherSimilarityCache`

**Содержит:** `PAIRS_CHUNK_ROWS`, `_neighborCache`, `_pairCache`, `_pairCalculating`, `_simCache`, `allConceptPairs`, `allConceptPairsAsync`, `invalidateSimilarityCache`, `nearestConcepts`, `neighborSets`, `profileIsMeaningful`, `profileSimilarity`, `similarityData`, `structuralSimilarity`, `typeProfileOf`

### `metrics/similarity-philosophers.js`

Строк 142.

**Вывозит:** `_philSimCache`, `cosineOf`, `invalidatePhilosopherSimilarityCache`, `nearestPhilosophers`, `philosopherSimilarity`, `philosopherSimilarityData`, `rubricUnionSize`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `./philosopher.js`: `philosopherProfile`
- из `./thresholds.js`: `PHIL_SIM_MIN_CONCEPTS`, `PHIL_SIM_MIN_RUBRIC_UNION`

**Содержит:** `_philSimCache`, `cosineOf`, `invalidatePhilosopherSimilarityCache`, `nearestPhilosophers`, `philosopherSimilarity`, `philosopherSimilarityData`, `rubricUnionSize`

### `metrics/thresholds.js`

Строк 30.

**Вывозит:** `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF`, `CONSTRUCTIVE_TYPES`, `DISRUPTIVE_TYPES`, `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS`, `METRIC_COVERAGE_WARN`, `PHIL_SIM_MIN_CONCEPTS`, `PHIL_SIM_MIN_RUBRIC_UNION`, `POLEMICAL_TYPES`, `SYSTEMATIC_TYPES`

**Ввозит:** _ничего_

**Содержит:** `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF`, `CONSTRUCTIVE_TYPES`, `DISRUPTIVE_TYPES`, `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS`, `METRIC_COVERAGE_WARN`, `PHIL_SIM_MIN_CONCEPTS`, `PHIL_SIM_MIN_RUBRIC_UNION`, `POLEMICAL_TYPES`, `SYSTEMATIC_TYPES`

### `metrics/typed.js`

Строк 203.

**Вывозит:** `abstractionIndexCache`, `deductiveIndexCache`, `instrumentalIndexCache`, `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache`, `invalidateInstrumentalIndexCache`, `invalidateTraditionBridgingCache`, `traditionBridgingCache`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `../core/predicates.js`: `sumWeight`
- из `./generativity.js`: `generativity`
- из `./thresholds.js`: `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF`

**Содержит:** `MET.abstractionIndex`, `MET.deductiveDepth`, `MET.deductiveIndex`, `MET.generativeIndex`, `MET.instrumentalIndex`, `MET.traditionBridgingIndex`, `abstractionIndexCache`, `deductiveIndexCache`, `instrumentalIndexCache`, `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache`, `invalidateInstrumentalIndexCache`, `invalidateTraditionBridgingCache`, `traditionBridgingCache`

### `modal/auth.js`

Строк 203.

**Вывозит:** `authError`, `authLogout`, `authModalEl`, `authModalKind`, `authNoticeAdmin`, `authNoticeMember`, `closeAuthModal`, `openAuthModal`, `refreshEditHints`, `refreshOpenModalToolbar`, `renderAuthControls`, `showAuthNotice`, `submitAuth`

**Ввозит:**

- из `../core/session.js`: `AUTH_ADMIN`, `authAccounts`, `authSession`, `canEdit`
- из `./context.js`: `ModalContext`
- из `./core.js`: `openUniversalModal`, `toggleModalMode`

**Содержит:** `authError`, `authLogout`, `authModalEl`, `authModalKind`, `authNoticeAdmin`, `authNoticeMember`, `closeAuthModal`, `openAuthModal`, `refreshEditHints`, `refreshOpenModalToolbar`, `renderAuthControls`, `showAuthNotice`, `submitAuth`

### `modal/concept-edit.js`

Строк 146.

**Вывозит:** _ничего_

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../core/graph-index.js`: `findConnection`, `getConceptConnections`
- из `../core/labels.js`: `relationHint`
- из `../core/predicates.js`: `isReflexiveLink`
- из `./connection-edit.js`: `createNewConnectionForConcept`
- из `./core.js`: `openUniversalModal`
- из `./edit-common.js`: `modalActions`
- из `./entry.js`: `openEditConnectionModal`
- из `./persist.js`: `deleteConcept`, `deleteConnection`, `saveConceptData`
- из `../util/format.js`: `philosopherYears`, `sortPhilosophersByBirth`
- из `../util/html.js`: `escapeAttr`

**Содержит:** `VIEWS.generateConceptEditContent`

### `modal/concept-view.js`

Строк 340.

**Вывозит:** `similarConceptsBlock`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../core/labels.js`: `WEIGHT_WORDS`
- из `../metrics/data.js`: `medianNodeDegree`, `nodeDegreeOf`
- из `../metrics/similarity-concepts.js`: `nearestConcepts`
- из `./core.js`: `closeUniversalModal`, `openUniversalModal`
- из `./entry.js`: `gotoNodeFromModal`, `openConceptById`, `showAllConcepts`
- из `./profile-concept.js`: `showConceptProfileModal`
- из `./toggles.js`: `toggleAllConnectionDescriptions`, `toggleConnectionDescription`, `toggleSubsection`
- из `../render/similarity-overlay.js`: `showSimilarityOverlay`
- из `../ui/search-core.js`: `clearModalSearch`
- из `../ui/search-modal.js`: `handleModalSearch`
- из `../util/format.js`: `getContrastColor`

**Содержит:** `VIEWS.generateConceptViewContent`, `similarConceptsBlock`

### `modal/connection-edit.js`

Строк 294.

**Вывозит:** `connEditSelectedBlock`, `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `handleConnectionEditSearch`, `onConnTypeChange`, `selectConnectionEditConcept`, `setupConnectionEditSearchHandlers`, `swapConnectionConcepts`, `updateConnEditPairNote`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../core/graph-index.js`: `connectionsBetween`
- из `../core/labels.js`: `WEIGHT_OPTIONS`, `relationHint`
- из `../core/predicates.js`: `isReflexiveLink`
- из `./connection-view.js`: `initConnectionSearchFields`
- из `./context.js`: `ModalContext`
- из `./core.js`: `openUniversalModal`
- из `./edit-common.js`: `modalActions`
- из `./persist.js`: `deleteConnection`, `saveConnectionData`
- из `../util/html.js`: `escapeAttr`

**Содержит:** `VIEWS.generateConnectionEditContent`, `connEditSelectedBlock`, `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `handleConnectionEditSearch`, `onConnTypeChange`, `selectConnectionEditConcept`, `setupConnectionEditSearchHandlers`, `swapConnectionConcepts`, `updateConnEditPairNote`

### `modal/connection-view.js`

Строк 411.

**Вывозит:** `conceptCircle`, `conceptPlate`, `connectionArrowSvg`, `connectionTraditionNote`, `generateConnectionVisualization`, `handleConnectionViewSearch`, `initConnectionSearchFields`, `selectConnectionViewConcept`, `toggleConnectionSearchSection`, `updateConnectionVisualization`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../core/graph-index.js`: `connectionsBetween`, `traditionsOfPhilosopher`
- из `../core/labels.js`: `CONN_WEIGHT_WORDS`, `relationHint`
- из `../core/predicates.js`: `isReflexiveLink`
- из `../data/mutate.js`: `selectConceptOnGraph`
- из `./context.js`: `ModalContext`
- из `./core.js`: `openUniversalModal`
- из `../util/format.js`: `getContrastColor`

**Содержит:** `VIEWS.generateConnectionViewContent`, `conceptCircle`, `conceptPlate`, `connectionArrowSvg`, `connectionTraditionNote`, `generateConnectionVisualization`, `handleConnectionViewSearch`, `initConnectionSearchFields`, `selectConnectionViewConcept`, `toggleConnectionSearchSection`, `updateConnectionVisualization`

### `modal/context.js`

Строк 15.

**Вывозит:** `MODAL_STACK_MAX`, `ModalContext`, `modalStack`

**Ввозит:** _ничего_

**Содержит:** `MODAL_STACK_MAX`, `ModalContext`, `modalStack`

### `modal/core.js`

Строк 150.

**Вывозит:** `closeUniversalModal`, `openUniversalModal`, `popModalState`, `pushModalState`, `toggleModalMode`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/session.js`: `canEdit`
- из `../data/mutate.js`: `cancelGraphSelection`
- из `./connection-view.js`: `initConnectionSearchFields`
- из `./context.js`: `MODAL_STACK_MAX`, `ModalContext`, `modalStack`
- из `./dirty.js`: `hasUnsavedChanges`
- из `./registry.js`: `modalContentFor`, `modalEntityExists`
- из `../render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `../ui/search-core.js`: `clearModalSearch`

**Содержит:** `closeUniversalModal`, `openUniversalModal`, `popModalState`, `pushModalState`, `toggleModalMode`

### `modal/dirty.js`

Строк 110.

**Вывозит:** `hasConceptChanges`, `hasConnectionChanges`, `hasFilledFields`, `hasPhilosopherChanges`, `hasUnsavedChanges`

**Ввозит:**

- из `../core/ns.js`: `DATA`
- из `./context.js`: `ModalContext`
- из `./registry.js`: `modalEntityExists`

**Содержит:** `hasConceptChanges`, `hasConnectionChanges`, `hasFilledFields`, `hasPhilosopherChanges`, `hasUnsavedChanges`

### `modal/edit-common.js`

Строк 47.

**Вывозит:** `modalActions`, `syncPhilColorFromPicker`, `updatePhilColorSample`

**Ввозит:**

- из `./core.js`: `closeUniversalModal`
- из `../util/format.js`: `getContrastColor`

**Содержит:** `modalActions`, `syncPhilColorFromPicker`, `updatePhilColorSample`

### `modal/entry.js`

Строк 119.

**Вывозит:** `closeDetailModal`, `closePhilosopherDetailModal`, `getIsolatedConceptsAfterDeletion`, `gotoNodeFromModal`, `isConceptIsolated`, `openConceptById`, `openEditConceptModal`, `openEditConnectionModal`, `openEditPhilosopherModal`, `showAllConcepts`, `showDetailModal`, `showPhilosopherDetailModal`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/graph-index.js`: `findConnection`, `getConceptConnections`
- из `../core/session.js`: `canEdit`
- из `./core.js`: `closeUniversalModal`, `openUniversalModal`
- из `../render/selection.js`: `highlightConnected`
- из `../state.js`: `selectedNodes`

**Содержит:** `closeDetailModal`, `closePhilosopherDetailModal`, `getIsolatedConceptsAfterDeletion`, `gotoNodeFromModal`, `isConceptIsolated`, `openConceptById`, `openEditConceptModal`, `openEditConnectionModal`, `openEditPhilosopherModal`, `showAllConcepts`, `showDetailModal`, `showPhilosopherDetailModal`

### `modal/integrity.js`

Строк 253.

**Вывозит:** `GROUNDING_TYPES`, `activityOverlap`, `conceptIntegrityWarnings`, `confirmWarnings`, `connectionIntegrityWarnings`, `groundingCyclePath`, `nConcepts`, `nLinks`, `philosopherIntegrityWarnings`, `relationIndexOf`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/predicates.js`: `isReflexiveLink`
- из `./entry.js`: `isConceptIsolated`
- из `../util/format.js`: `philosopherBirth`, `philosopherYears`
- из `../util/ru.js`: `pluralRu`

**Содержит:** `GROUNDING_TYPES`, `activityOverlap`, `conceptIntegrityWarnings`, `confirmWarnings`, `connectionIntegrityWarnings`, `groundingCyclePath`, `nConcepts`, `nLinks`, `philosopherIntegrityWarnings`, `relationIndexOf`

### `modal/persist.js`

Строк 350.

**Вывозит:** `deleteConcept`, `deleteConnection`, `deletePhilosopher`, `removeConceptEverywhere`, `removeLinkEverywhere`, `saveConceptData`, `saveConnectionData`, `savePhilosopherData`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/graph-index.js`: `findConnection`, `getConceptConnections`
- из `../core/predicates.js`: `isReflexiveLink`
- из `../data/mutate.js`: `addLinkToGraph`, `addNodeToGraph`, `afterDataChange`, `forgetLink`, `forgetNode`, `updateLinkOnGraph`, `updateNodeOnGraph`
- из `./context.js`: `ModalContext`
- из `./core.js`: `closeUniversalModal`, `openUniversalModal`
- из `./entry.js`: `getIsolatedConceptsAfterDeletion`
- из `./integrity.js`: `conceptIntegrityWarnings`, `confirmWarnings`, `connectionIntegrityWarnings`, `nConcepts`, `nLinks`, `philosopherIntegrityWarnings`, `relationIndexOf`
- из `./registry.js`: `modalEntityExists`
- из `../util/misc.js`: `generateId`

**Содержит:** `deleteConcept`, `deleteConnection`, `deletePhilosopher`, `removeConceptEverywhere`, `removeLinkEverywhere`, `saveConceptData`, `saveConnectionData`, `savePhilosopherData`

### `modal/philosopher-edit.js`

Строк 123.

**Вывозит:** _ничего_

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `./connection-edit.js`: `createNewConceptForPhilosopher`
- из `./core.js`: `openUniversalModal`
- из `./edit-common.js`: `modalActions`, `syncPhilColorFromPicker`, `updatePhilColorSample`
- из `./entry.js`: `openEditConceptModal`
- из `./persist.js`: `deletePhilosopher`, `savePhilosopherData`
- из `../util/html.js`: `escapeAttr`

**Содержит:** `VIEWS.generatePhilosopherEditContent`

### `modal/philosopher-view.js`

Строк 555.

**Вывозит:** `makeLegendsEditable`, `similarPhilosophersBlock`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../core/labels.js`: `WEIGHT_WORDS`
- из `../core/predicates.js`: `otherPhilosopher`
- из `../core/session.js`: `canEdit`
- из `../metrics/similarity-philosophers.js`: `nearestPhilosophers`
- из `./auth.js`: `refreshEditHints`
- из `./core.js`: `closeUniversalModal`, `openUniversalModal`
- из `./entry.js`: `openEditPhilosopherModal`, `showPhilosopherDetailModal`
- из `./profile-philosopher.js`: `showPhilosopherProfileModal`
- из `./toggles.js`: `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions`, `toggleConnectionDescription`, `togglePhilosopherConceptDescription`, `toggleSubsection`
- из `../util/format.js`: `formatBirthYear`, `getContrastColor`, `philosopherBirth`, `philosopherYears`, `sortPhilosophersByBirth`
- из `../util/ru.js`: `conjugateVerb`, `declinePhilosopher`

**Содержит:** `VIEWS.generatePhilosopherViewContent`, `makeLegendsEditable`, `similarPhilosophersBlock`

### `modal/profile-concept.js`

Строк 160.

**Вывозит:** `closeConceptProfileModal`, `conceptDegreesDetailed`, `metricPartsText`, `metricPercentile`, `metricRank`, `showConceptProfileModal`, `toggleProfileOrder`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../metrics/init.js`: `initializePhilosophyMetrics`
- из `../metrics/scope.js`: `metricsScopeCounts`
- из `../metrics/thresholds.js`: `METRIC_COVERAGE_WARN`
- из `./core.js`: `openUniversalModal`
- из `./profile-philosopher.js`: `showPhilosopherProfileModal`
- из `../render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `../stats/modal.js`: `openStatsModal`, `switchStatsView`
- из `../stats/results.js`: `metricCoverage`
- из `../util/format.js`: `getContrastColor`

**Содержит:** `closeConceptProfileModal`, `conceptDegreesDetailed`, `metricPartsText`, `metricPercentile`, `metricRank`, `showConceptProfileModal`, `toggleProfileOrder`

### `modal/profile-philosopher.js`

Строк 119.

**Вывозит:** `closePhilosopherProfileModal`, `showPhilosopherProfileModal`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `../metrics/init.js`: `initializePhilosophyMetrics`
- из `../metrics/thresholds.js`: `METRIC_COVERAGE_WARN`
- из `./core.js`: `openUniversalModal`
- из `../render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `../stats/results.js`: `metricCoverage`
- из `../util/format.js`: `getContrastColor`

**Содержит:** `closePhilosopherProfileModal`, `showPhilosopherProfileModal`

### `modal/registry.js`

Строк 38.

**Вывозит:** `modalContentFor`, `modalEntityExists`

**Ввозит:**

- из `../core/ns.js`: `VIEWS`

**Содержит:** `modalContentFor`, `modalEntityExists`

### `modal/toggles.js`

Строк 162.

**Вывозит:** `allDescriptionsExpanded`, `allPhilosopherConceptDescriptionsExpanded`, `allPhilosopherConnectionDescriptionsExpanded`, `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions`, `toggleAllRoot`, `toggleConnectionDescription`, `togglePhilosopherConceptDescription`, `toggleSubsection`

**Ввозит:** _ничего_

**Содержит:** `allDescriptionsExpanded`, `allPhilosopherConceptDescriptionsExpanded`, `allPhilosopherConnectionDescriptionsExpanded`, `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions`, `toggleAllRoot`, `toggleConnectionDescription`, `togglePhilosopherConceptDescription`, `toggleSubsection`

### `paths/analysis.js`

Строк 72.

**Вывозит:** `analyzePath`, `analyzePathTraditions`

**Ввозит:**

- из `../core/ns.js`: `DATA`
- из `../core/graph-index.js`: `traditionsOfPhilosopher`
- из `../core/labels.js`: `CHRONOLOGY_MODES`
- из `../core/predicates.js`: `isSymmetricLink`
- из `./chronology.js`: `isChronologicallyValid`

**Содержит:** `analyzePath`, `analyzePathTraditions`

### `paths/chronology.js`

Строк 123.

**Вывозит:** `isChronologicallyValid`, `looseChronologyCheck`, `moderateChronologyCheck`, `strictChronologyCheck`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/labels.js`: `CHRONOLOGY_MODES`, `MATURITY_AGE`

**Содержит:** `isChronologicallyValid`, `looseChronologyCheck`, `moderateChronologyCheck`, `strictChronologyCheck`

### `paths/path-ui.js`

Строк 491.

**Вывозит:** `ARROW_HOVER_DELAY`, `arrowHoverTimer`, `clearPathHighlight`, `closePathDescriptionsModal`, `currentPathData`, `findAndShowPath`, `handlePathArrowHover`, `highlightPath`, `initPathFinder`, `nodesDescriptionsVisible`, `resolvePathLinkList`, `showPathDescriptionsModal`, `togglePathNodesDescriptions`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/predicates.js`: `isSymmetricLink`
- из `./analysis.js`: `analyzePath`, `analyzePathTraditions`
- из `./shortest-path.js`: `findShortestPath`
- из `../render/selection.js`: `resetHighlight`
- из `../render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `../ui/custom-select.js`: `selectedSourceNode`, `selectedTargetNode`

**Содержит:** `ARROW_HOVER_DELAY`, `arrowHoverTimer`, `clearPathHighlight`, `closePathDescriptionsModal`, `currentPathData`, `findAndShowPath`, `handlePathArrowHover`, `highlightPath`, `initPathFinder`, `nodesDescriptionsVisible`, `resolvePathLinkList`, `showPathDescriptionsModal`, `togglePathNodesDescriptions`

### `paths/shortest-path.js`

Строк 178.

**Вывозит:** `findShortestPath`, `findShortestPathUnweighted`, `findShortestPathWeighted`, `pathLinkAllowed`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/predicates.js`: `isSymmetricLink`, `isTypologicalLink`
- из `./chronology.js`: `isChronologicallyValid`

**Содержит:** `findShortestPath`, `findShortestPathUnweighted`, `findShortestPathWeighted`, `pathLinkAllowed`

### `render/canvas-core.js`

Строк 20.

**Вывозит:** `PICK_LINK_WIDTH`, `resizeCanvas`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `./scene.js`: `requestDraw`

**Содержит:** `PICK_LINK_WIDTH`, `resizeCanvas`

### `render/d3-layer.js`

Строк 67.

**Вывозит:** `dragended`, `dragstarted`, `linkHandlers`, `makeClassed`, `nodeHandlers`, `subSelection`, `updateArrows`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `./scene.js`: `requestDraw`, `startRadiusAnimation`

**Содержит:** `dragended`, `dragstarted`, `linkHandlers`, `makeClassed`, `nodeHandlers`, `subSelection`, `updateArrows`

### `render/geometry.js`

Строк 183.

**Вывозит:** `LABEL_ALL_ABOVE`, `LABEL_HIDE_BELOW`, `arcParams`, `arrowPoints`, `arrowPointsStart`, `drawSelfLoop`, `fillArrow`, `hasLinkClass`, `hasNodeClass`, `linkDrawAlpha`, `linkDrawWidth`, `linkHasTwoHeads`, `linkHoverStrokeWidth`, `linkStrokeWidth`, `linkVisualState`, `nodeLabelDy`, `nodeRadius`, `strokeLink`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `./scene.js`: `draw`
- из `../state.js`: `selectedEdges`

**Содержит:** `LABEL_ALL_ABOVE`, `LABEL_HIDE_BELOW`, `arcParams`, `arrowPoints`, `arrowPointsStart`, `drawSelfLoop`, `fillArrow`, `hasLinkClass`, `hasNodeClass`, `linkDrawAlpha`, `linkDrawWidth`, `linkHasTwoHeads`, `linkHoverStrokeWidth`, `linkStrokeWidth`, `linkVisualState`, `nodeLabelDy`, `nodeRadius`, `strokeLink`

### `render/grouping.js`

Строк 78.

**Вывозит:** `cols`, `groupPositions`, `restorePanelStates`, `toggleGrouping`, `togglePanel`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `./selection.js`: `resetHighlight`

**Содержит:** `cols`, `groupPositions`, `restorePanelStates`, `toggleGrouping`, `togglePanel`

### `render/interactions.js`

Строк 90.

**Вывозит:** `dispatchClick`, `dispatchMove`, `initGraphEventHandlers`, `lastHoverLink`, `lastHoverNode`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/session.js`: `canEdit`
- из `../data/mutate.js`: `cancelGraphSelection`, `handleConceptSelection`
- из `../graph/click-actions.js`: `handleLinkClick`, `handleNodeClick`
- из `../modal/entry.js`: `openEditConceptModal`
- из `./d3-layer.js`: `linkHandlers`, `nodeHandlers`
- из `./picking.js`: `pickLink`, `pickNode`, `toGraph`
- из `./scene.js`: `requestDraw`
- из `./selection.js`: `resetHighlight`
- из `../state.js`: `editMode`

**Содержит:** `dispatchClick`, `dispatchMove`, `initGraphEventHandlers`, `lastHoverLink`, `lastHoverNode`

### `render/metric-visualization.js`

Строк 353.

**Вывозит:** `originalRadii`, `originalTextDy`, `resetNodeSizes`, `saveOriginalRadii`, `toggleMetricVisualization`, `updateVisualizationButtonText`, `updateVisualizationControlSection`, `visualizeMetricBySize`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `../metrics/network.js`: `betweennessCache`, `closenessCache`, `eigenvectorCache`, `localCohesionCache`, `pageRankCache`, `richClubCache`, `weightedClusteringCache`
- из `./d3-layer.js`: `updateArrows`
- из `../stats/modal.js`: `closeStatsModal`

**Содержит:** `originalRadii`, `originalTextDy`, `resetNodeSizes`, `saveOriginalRadii`, `toggleMetricVisualization`, `updateVisualizationButtonText`, `updateVisualizationControlSection`, `visualizeMetricBySize`

### `render/picking.js`

Строк 76.

**Вывозит:** `pickLink`, `pickNode`, `quadtree`, `rebuildQuadtree`, `repaintPickCanvas`, `toGraph`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/predicates.js`: `isReflexiveLink`
- из `../core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `./canvas-core.js`: `PICK_LINK_WIDTH`
- из `./geometry.js`: `drawSelfLoop`, `fillArrow`, `linkDrawWidth`, `linkVisualState`, `nodeRadius`, `strokeLink`

**Содержит:** `pickLink`, `pickNode`, `quadtree`, `rebuildQuadtree`, `repaintPickCanvas`, `toGraph`

### `render/scene.js`

Строк 231.

**Вывозит:** `DRAW_ORDER`, `animLoopRunning`, `draw`, `drawScheduled`, `ensureAnimLoop`, `graphIsCovered`, `needsContinuousAnimation`, `renderScene`, `requestDraw`, `startRadiusAnimation`, `stepRadiusAnimation`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/predicates.js`: `isReflexiveLink`
- из `../core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `./geometry.js`: `LABEL_ALL_ABOVE`, `LABEL_HIDE_BELOW`, `arcParams`, `drawSelfLoop`, `fillArrow`, `hasNodeClass`, `linkDrawAlpha`, `linkDrawWidth`, `linkHoverStrokeWidth`, `linkVisualState`, `nodeLabelDy`, `nodeRadius`, `strokeLink`
- из `./similarity-overlay.js`: `similarityColor`
- из `../state.js`: `selectedNodes`

**Содержит:** `DRAW_ORDER`, `animLoopRunning`, `draw`, `drawScheduled`, `ensureAnimLoop`, `graphIsCovered`, `needsContinuousAnimation`, `renderScene`, `requestDraw`, `startRadiusAnimation`, `stepRadiusAnimation`

### `render/selection.js`

Строк 188.

**Вывозит:** `highlightCombined`, `highlightConnected`, `highlightNodeById`, `isEdgeConnectedToNode`, `isEdgeConnectedToSelectedNodes`, `isNodeConnectedToSelectedEdges`, `resetHighlight`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../state.js`: `selectedEdges`, `selectedNodes`

**Содержит:** `highlightCombined`, `highlightConnected`, `highlightNodeById`, `isEdgeConnectedToNode`, `isEdgeConnectedToSelectedNodes`, `isNodeConnectedToSelectedEdges`, `resetHighlight`

### `render/similarity-overlay.js`

Строк 111.

**Вывозит:** `SIMILARITY_ARCS`, `SIMILARITY_KEEP_QUANTILE`, `clearSimilarityOverlay`, `showSimilarityOverlay`, `similarityColor`, `updateSimilarityLegend`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../metrics/init.js`: `initializePhilosophyMetrics`
- из `../metrics/similarity-concepts.js`: `_simCache`, `profileSimilarity`, `structuralSimilarity`
- из `../modal/entry.js`: `closeDetailModal`
- из `./scene.js`: `requestDraw`
- из `../ui/feedback.js`: `showTemporaryMessage`

**Содержит:** `SIMILARITY_ARCS`, `SIMILARITY_KEEP_QUANTILE`, `clearSimilarityOverlay`, `showSimilarityOverlay`, `similarityColor`, `updateSimilarityLegend`

### `render/simulation.js`

Строк 77.

**Вывозит:** `centerGraph`, `freezeSimulation`, `maxTicks`, `resetSimulation`, `simLockedByHand`, `toggleSimulationFreeze`, `unfreezeSimulation`, `updateFreezeButton`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `./scene.js`: `ensureAnimLoop`, `needsContinuousAnimation`
- из `./selection.js`: `resetHighlight`
- из `../ui/feedback.js`: `showTemporaryMessage`

**Содержит:** `centerGraph`, `freezeSimulation`, `maxTicks`, `resetSimulation`, `simLockedByHand`, `toggleSimulationFreeze`, `unfreezeSimulation`, `updateFreezeButton`

### `state.js`

Строк 16.

**Вывозит:** `editMode`, `selectedEdges`, `selectedNodes`

**Ввозит:** _ничего_

**Содержит:** `editMode`, `selectedEdges`, `selectedNodes`

### `stats/modal.js`

Строк 216.

**Вывозит:** `closeStatsModal`, `handleStatsParameterChange`, `loadStatsContent`, `openStatsModal`, `switchStatsView`, `updateActiveNavItem`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../metrics/graph-cache.js`: `invalidateGraphCache`
- из `../metrics/init.js`: `initializePhilosophyMetrics`
- из `../metrics/scope.js`: `applyMetricsScope`, `installMetricScopeWrappers`, `invalidateEverythingForScope`, `updateMetricsScopeHint`, `updateScopeToggles`
- из `../render/metric-visualization.js`: `resetNodeSizes`
- из `../render/scene.js`: `ensureAnimLoop`, `needsContinuousAnimation`
- из `../render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `./results.js`: `applyMetricLayout`
- из `./views/advanced.js`: `generateAbstractionContent`, `generateBridgingContent`, `generateComplexityContent`, `generateContinuityContent`, `generateDeductiveContent`, `generateFertilityContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateTemporalInfluenceContent`, `generateTransformationContent`
- из `./views/comparison.js`: `generateClosestPairsContent`, `generateComparisonContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `renderClosestPairs`, `renderComparison`, `renderPhilosopherComparison`, `renderPhilosopherPairs`
- из `./views/network.js`: `generateBetweennessContent`, `generateClosenessContent`, `generateDegreeContent`, `generateEigenvectorContent`, `generateLocalCohesionContent`, `generateOverviewContent`, `generatePageRankContent`, `generateRichClubContent`, `generateWeightedClusteringContent`
- из `./views/philosopher.js`: `generatePhilosopherInterdisciplinaryContent`, `generatePhilosopherProfileContent`, `generatePhilosopherReachContent`, `generatePhilosopherSystematicContent`
- из `./views/philosophical.js`: `generateCoherenceContent`, `generateCriticalPowerContent`, `generateDialogicalContent`, `generateFoundationalContent`, `generateInfluenceContent`, `generateParadigmShiftContent`, `generateProblemGenerationContent`, `generateRevolutionaryContent`, `generateSyntheticContent`, `generateTensionContent`
- из `./views/rankings.js`: `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`

**Содержит:** `closeStatsModal`, `handleStatsParameterChange`, `loadStatsContent`, `openStatsModal`, `switchStatsView`, `updateActiveNavItem`

### `stats/results.js`

Строк 350.

**Вывозит:** `_metricCoverageCache`, `applyMetricLayout`, `generateCalculateButton`, `generateMetricCoverageBlock`, `generateMetricDescriptionBlock`, `generateMetricResults`, `genericDetailsHTML`, `invalidateMetricCoverageCache`, `lastZeroCount`, `metricCoverage`, `rankKeep`, `toggleMetricDetails`, `toggleMetricLayout`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/labels.js`: `METRIC_FIELD_LABELS`
- из `../metrics/descriptions.js`: `getMetricDescription`
- из `../metrics/format.js`: `applyMetricMode`, `toggleMetricValueMode`
- из `../metrics/thresholds.js`: `METRIC_COVERAGE_WARN`
- из `../modal/profile-concept.js`: `showConceptProfileModal`
- из `../render/metric-visualization.js`: `toggleMetricVisualization`
- из `../render/selection.js`: `highlightNodeById`
- из `./run.js`: `calculateMetricFromModal`

**Содержит:** `_metricCoverageCache`, `applyMetricLayout`, `generateCalculateButton`, `generateMetricCoverageBlock`, `generateMetricDescriptionBlock`, `generateMetricResults`, `genericDetailsHTML`, `invalidateMetricCoverageCache`, `lastZeroCount`, `metricCoverage`, `rankKeep`, `toggleMetricDetails`, `toggleMetricLayout`

### `stats/run.js`

Строк 128.

**Вывозит:** `calculateMetricFromModal`, `hideProgress`, `runSingleMetric`, `showProgress`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `../metrics/network.js`: `calculateBetweennessAsync`
- из `./modal.js`: `openStatsModal`, `switchStatsView`, `updateActiveNavItem`

**Содержит:** `calculateMetricFromModal`, `hideProgress`, `runSingleMetric`, `showProgress`

### `stats/views/advanced.js`

Строк 269.

**Вывозит:** `generateAbstractionContent`, `generateBridgingContent`, `generateComplexityContent`, `generateContinuityContent`, `generateDeductiveContent`, `generateFertilityContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateTemporalInfluenceContent`, `generateTransformationContent`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `MET`
- из `../../metrics/init.js`: `initializePhilosophyMetrics`
- из `../../render/selection.js`: `highlightNodeById`
- из `../results.js`: `generateMetricDescriptionBlock`, `generateMetricResults`, `rankKeep`

**Содержит:** `generateAbstractionContent`, `generateBridgingContent`, `generateComplexityContent`, `generateContinuityContent`, `generateDeductiveContent`, `generateFertilityContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateTemporalInfluenceContent`, `generateTransformationContent`

### `stats/views/comparison.js`

Строк 426.

**Вывозит:** `generateClosestPairsContent`, `generateComparisonContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `openPairInComparison`, `openPhilosopherPair`, `renderClosestPairs`, `renderComparison`, `renderPhilosopherComparison`, `renderPhilosopherPairs`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `S`
- из `../../core/labels.js`: `PHIL_SIM_LABELS`, `SIM_METRIC_LABELS`
- из `../../metrics/init.js`: `initializePhilosophyMetrics`
- из `../../metrics/philosopher.js`: `philosopherProfile`
- из `../../metrics/similarity-concepts.js`: `_pairCalculating`, `allConceptPairs`, `allConceptPairsAsync`, `profileSimilarity`, `similarityData`, `structuralSimilarity`
- из `../../metrics/similarity-philosophers.js`: `philosopherSimilarity`, `philosopherSimilarityData`
- из `../modal.js`: `switchStatsView`
- из `../results.js`: `generateMetricDescriptionBlock`
- из `../../ui/custom-select.js`: `filterCustomSelect`, `showCustomSelectDropdown`

**Содержит:** `generateClosestPairsContent`, `generateComparisonContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `openPairInComparison`, `openPhilosopherPair`, `renderClosestPairs`, `renderComparison`, `renderPhilosopherComparison`, `renderPhilosopherPairs`

### `stats/views/network.js`

Строк 222.

**Вывозит:** `generateBetweennessContent`, `generateClosenessContent`, `generateDegreeContent`, `generateEigenvectorContent`, `generateLocalCohesionContent`, `generateOverviewContent`, `generatePageRankContent`, `generateRichClubContent`, `generateWeightedClusteringContent`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `MET`, `S`
- из `../../metrics/network.js`: `betweennessCache`, `closenessCache`, `eigenvectorCache`, `localCohesionCache`, `pageRankCache`, `richClubCache`, `weightedClusteringCache`
- из `../../render/selection.js`: `highlightNodeById`
- из `../results.js`: `generateCalculateButton`, `generateMetricDescriptionBlock`, `generateMetricResults`

**Содержит:** `generateBetweennessContent`, `generateClosenessContent`, `generateDegreeContent`, `generateEigenvectorContent`, `generateLocalCohesionContent`, `generateOverviewContent`, `generatePageRankContent`, `generateRichClubContent`, `generateWeightedClusteringContent`

### `stats/views/philosopher.js`

Строк 170.

**Вывозит:** `generatePhilosopherInterdisciplinaryContent`, `generatePhilosopherProfileContent`, `generatePhilosopherReachContent`, `generatePhilosopherSystematicContent`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `MET`
- из `../../metrics/init.js`: `initializePhilosophyMetrics`
- из `../../metrics/philosopher.js`: `philosopherProfile`
- из `../../metrics/philosophical.js`: `influenceScopeSwitcher`
- из `../results.js`: `generateMetricDescriptionBlock`, `rankKeep`

**Содержит:** `generatePhilosopherInterdisciplinaryContent`, `generatePhilosopherProfileContent`, `generatePhilosopherReachContent`, `generatePhilosopherSystematicContent`

### `stats/views/philosophical.js`

Строк 420.

**Вывозит:** `generateCoherenceContent`, `generateCriticalPowerContent`, `generateDialogicalContent`, `generateFoundationalContent`, `generateInfluenceContent`, `generateParadigmShiftContent`, `generateProblemGenerationContent`, `generateRevolutionaryContent`, `generateSyntheticContent`, `generateTensionContent`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `MET`
- из `../../metrics/init.js`: `initializePhilosophyMetrics`
- из `../../metrics/philosophical.js`: `influenceScopeSwitcher`
- из `../results.js`: `generateMetricResults`, `rankKeep`

**Содержит:** `generateCoherenceContent`, `generateCriticalPowerContent`, `generateDialogicalContent`, `generateFoundationalContent`, `generateInfluenceContent`, `generateParadigmShiftContent`, `generateProblemGenerationContent`, `generateRevolutionaryContent`, `generateSyntheticContent`, `generateTensionContent`

### `stats/views/rankings.js`

Строк 141.

**Вывозит:** `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `S`
- из `../../metrics/format.js`: `toggleMetricValueMode`
- из `../../metrics/init.js`: `initializePhilosophyMetrics`
- из `../../metrics/philosophical.js`: `influenceScopeSwitcher`
- из `../../metrics/rankings.js`: `generatePhilosopherRankings`, `generateRankings`
- из `../../render/selection.js`: `highlightNodeById`
- из `../results.js`: `generateMetricDescriptionBlock`

**Содержит:** `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`

### `ui/actions-byname.js`

Строк 20.

**Вывозит:** _ничего_

**Ввозит:**

- из `./actions.js`: `registerActions`
- из `../modal/persist.js`: `deleteConcept`, `deleteConnection`, `deletePhilosopher`, `saveConceptData`, `saveConnectionData`, `savePhilosopherData`

**Содержит:** _только исполняемый код_

### `ui/actions-dyn.js`

Строк 132.

**Вывозит:** _ничего_

**Ввозит:**

- из `./actions.js`: `registerActions`
- из `../core/ns.js`: `DATA`, `S`
- из `../core/graph-index.js`: `findConnection`
- из `../data/mutate.js`: `cancelGraphSelection`
- из `../metrics/format.js`: `toggleMetricValueMode`
- из `../metrics/philosophical.js`: `setInfluenceScope`
- из `../modal/auth.js`: `authLogout`, `closeAuthModal`, `openAuthModal`, `submitAuth`
- из `../modal/connection-edit.js`: `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `onConnTypeChange`, `selectConnectionEditConcept`, `swapConnectionConcepts`
- из `../modal/connection-view.js`: `handleConnectionViewSearch`, `selectConnectionViewConcept`, `toggleConnectionSearchSection`
- из `../modal/core.js`: `closeUniversalModal`, `openUniversalModal`, `popModalState`, `toggleModalMode`
- из `../modal/edit-common.js`: `syncPhilColorFromPicker`, `updatePhilColorSample`
- из `../modal/entry.js`: `gotoNodeFromModal`, `openConceptById`, `openEditConceptModal`, `openEditConnectionModal`, `showAllConcepts`, `showPhilosopherDetailModal`
- из `../modal/persist.js`: `deleteConnection`
- из `../modal/profile-concept.js`: `closeConceptProfileModal`, `showConceptProfileModal`, `toggleProfileOrder`
- из `../modal/profile-philosopher.js`: `closePhilosopherProfileModal`, `showPhilosopherProfileModal`
- из `../modal/toggles.js`: `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions`, `toggleConnectionDescription`, `togglePhilosopherConceptDescription`, `toggleSubsection`
- из `../paths/path-ui.js`: `clearPathHighlight`, `handlePathArrowHover`, `showPathDescriptionsModal`, `togglePathNodesDescriptions`
- из `../render/metric-visualization.js`: `toggleMetricVisualization`
- из `../render/selection.js`: `highlightNodeById`
- из `../render/similarity-overlay.js`: `clearSimilarityOverlay`, `showSimilarityOverlay`
- из `../stats/modal.js`: `openStatsModal`, `switchStatsView`
- из `../stats/results.js`: `toggleMetricDetails`, `toggleMetricLayout`
- из `../stats/run.js`: `calculateMetricFromModal`
- из `../stats/views/comparison.js`: `openPairInComparison`, `openPhilosopherPair`, `renderClosestPairs`, `renderPhilosopherComparison`, `renderPhilosopherPairs`
- из `./custom-select.js`: `filterCustomSelect`, `selectCustomOption`, `showCustomSelectDropdown`
- из `./legend.js`: `addTradition`, `onlyTradition`, `togglePhilosopher`, `toggleRelation`, `toggleRubric`, `toggleTradition`
- из `./search-core.js`: `clearModalSearch`
- из `./search-legend.js`: `selectSearchResult`
- из `./search-modal.js`: `handleModalSearch`

**Содержит:** _только исполняемый код_

### `ui/actions-static.js`

Строк 100.

**Вывозит:** _ничего_

**Ввозит:**

- из `./actions.js`: `registerActions`
- из `../data/save.js`: `downloadData`, `saveToFolder`
- из `../metrics/scope.js`: `handleMetricsScopeChange`
- из `../modal/core.js`: `closeUniversalModal`
- из `../modal/profile-concept.js`: `closeConceptProfileModal`
- из `../modal/profile-philosopher.js`: `closePhilosopherProfileModal`
- из `../paths/path-ui.js`: `closePathDescriptionsModal`, `findAndShowPath`
- из `../render/grouping.js`: `toggleGrouping`, `togglePanel`
- из `../render/metric-visualization.js`: `resetNodeSizes`
- из `../render/simulation.js`: `centerGraph`, `resetSimulation`, `toggleSimulationFreeze`
- из `../stats/modal.js`: `closeStatsModal`, `handleStatsParameterChange`, `openStatsModal`, `switchStatsView`
- из `./custom-select.js`: `filterCustomSelect`, `showCustomSelectDropdown`
- из `./export.js`: `exportToPNG`, `exportToSVG`
- из `./legend.js`: `changeFilterMode`, `deselectAllPhilosophers`, `deselectAllRelations`, `deselectAllRubrics`, `deselectAllTraditions`, `selectAllPhilosophers`, `selectAllRelations`, `selectAllRubrics`, `selectAllTraditions`, `toggleSection`, `toggleUniformLinkWidth`
- из `./search-legend.js`: `clearLegendSearch`, `handleLegendSearch`

**Содержит:** _только исполняемый код_

### `ui/actions.js`

Строк 27.

**Вывозит:** `actionNames`, `registerActions`, `runAction`

**Ввозит:** _ничего_

**Содержит:** `actionNames`, `registerActions`, `runAction`

### `ui/custom-select.js`

Строк 118.

**Вывозит:** `filterCustomSelect`, `initializeCustomSelects`, `populateCustomSelect`, `selectCustomOption`, `selectedSourceNode`, `selectedTargetNode`, `showCustomSelectDropdown`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../stats/views/comparison.js`: `renderComparison`

**Содержит:** `filterCustomSelect`, `initializeCustomSelects`, `populateCustomSelect`, `selectCustomOption`, `selectedSourceNode`, `selectedTargetNode`, `showCustomSelectDropdown`

### `ui/delegation.js`

Строк 70.

**Вывозит:** `installDelegation`

**Ввозит:**

- из `./actions.js`: `runAction`

**Содержит:** `installDelegation`

### `ui/export.js`

Строк 122.

**Вывозит:** `exportToPNG`, `exportToSVG`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/predicates.js`: `isSymmetricLink`
- из `../core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `../render/geometry.js`: `arrowPoints`, `arrowPointsStart`, `hasNodeClass`, `linkDrawAlpha`, `linkDrawWidth`, `linkHasTwoHeads`, `linkVisualState`, `nodeLabelDy`, `nodeRadius`
- из `../render/scene.js`: `DRAW_ORDER`, `renderScene`
- из `../state.js`: `selectedNodes`
- из `./feedback.js`: `showTemporaryMessage`

**Содержит:** `exportToPNG`, `exportToSVG`

### `ui/feedback.js`

Строк 34.

**Вывозит:** `showTemporaryMessage`

**Ввозит:** _ничего_

**Содержит:** `showTemporaryMessage`

### `ui/legend.js`

Строк 292.

**Вывозит:** `addTradition`, `changeFilterMode`, `deselectAllPhilosophers`, `deselectAllRelations`, `deselectAllRubrics`, `deselectAllTraditions`, `initFilters`, `onlyTradition`, `selectAllPhilosophers`, `selectAllRelations`, `selectAllRubrics`, `selectAllTraditions`, `syncPhilosopherCheckboxes`, `togglePhilosopher`, `toggleRelation`, `toggleRubric`, `toggleSection`, `toggleTradition`, `toggleUniformLinkWidth`, `traditionMembers`, `updateFilterStats`, `updatePhilosopherDimming`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/labels.js`: `relationHint`
- из `../filters/filters.js`: `applyFilters`, `philosopherPassesTraditions`
- из `../render/d3-layer.js`: `updateArrows`

**Содержит:** `addTradition`, `changeFilterMode`, `deselectAllPhilosophers`, `deselectAllRelations`, `deselectAllRubrics`, `deselectAllTraditions`, `initFilters`, `onlyTradition`, `selectAllPhilosophers`, `selectAllRelations`, `selectAllRubrics`, `selectAllTraditions`, `syncPhilosopherCheckboxes`, `togglePhilosopher`, `toggleRelation`, `toggleRubric`, `toggleSection`, `toggleTradition`, `toggleUniformLinkWidth`, `traditionMembers`, `updateFilterStats`, `updatePhilosopherDimming`

### `ui/search-core.js`

Строк 70.

**Вывозит:** `clearModalSearch`, `displaySearchResults`, `searchNodes`

**Ввозит:**

- из `../core/ns.js`: `DATA`
- из `./search-legend.js`: `selectSearchResult`

**Содержит:** `clearModalSearch`, `displaySearchResults`, `searchNodes`

### `ui/search-legend.js`

Строк 66.

**Вывозит:** `clearLegendSearch`, `handleLegendSearch`, `selectSearchResult`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../modal/entry.js`: `showDetailModal`
- из `../render/selection.js`: `highlightConnected`
- из `../state.js`: `selectedNodes`
- из `./search-core.js`: `clearModalSearch`, `displaySearchResults`, `searchNodes`

**Содержит:** `clearLegendSearch`, `handleLegendSearch`, `selectSearchResult`

### `ui/search-modal.js`

Строк 21.

**Вывозит:** `handleModalSearch`

**Ввозит:**

- из `./search-core.js`: `displaySearchResults`, `searchNodes`

**Содержит:** `handleModalSearch`

### `util/format.js`

Строк 57.

**Вывозит:** `_ambiguousLabels`, `ambiguousLabels`, `formatBirthYear`, `getContrastColor`, `labelWithAuthor`, `philosopherBirth`, `philosopherYears`, `sortPhilosophersByBirth`

**Ввозит:**

- из `../core/ns.js`: `DATA`

**Содержит:** `_ambiguousLabels`, `ambiguousLabels`, `formatBirthYear`, `getContrastColor`, `labelWithAuthor`, `philosopherBirth`, `philosopherYears`, `sortPhilosophersByBirth`

### `util/html.js`

Строк 9.

**Вывозит:** `escapeAttr`

**Ввозит:** _ничего_

**Содержит:** `escapeAttr`

### `util/misc.js`

Строк 20.

**Вывозит:** `debounce`, `generateId`

**Ввозит:** _ничего_

**Содержит:** `debounce`, `generateId`

### `util/ru.js`

Строк 49.

**Вывозит:** `conjugateVerb`, `declinePhilosopher`, `pluralRu`

**Ввозит:** _ничего_

**Содержит:** `conjugateVerb`, `declinePhilosopher`, `pluralRu`