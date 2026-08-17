# Спецификация модулей `philosophy_graph` — по собранному дереву

Составлено из готовой сборки: 112 модулей, 17285 строк.
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
| `boot-defs.js` | 24 | 1 | 6 |
| `boot.js` | 639 | 1 | 39 |
| `core/base-cells.js` | 17 | 0 | 1 |
| `core/events.js` | 43 | 4 | 0 |
| `core/graph-index.js` | 69 | 1 | 1 |
| `core/link-facts.js` | 41 | 6 | 1 |
| `core/long-task.js` | 120 | 3 | 0 |
| `core/ns.js` | 11 | 4 | 0 |
| `core/ready.js` | 15 | 2 | 0 |
| `core/relation-types.js` | 58 | 6 | 1 |
| `core/search.js` | 71 | 5 | 2 |
| `core/session.js` | 14 | 4 | 0 |
| `core/time.js` | 13 | 2 | 0 |
| `core/visibility.js` | 13 | 2 | 1 |
| `data/load.js` | 16 | 1 | 1 |
| `data/mutate.js` | 73 | 3 | 3 |
| `data/save.js` | 63 | 9 | 1 |
| `dead.js` | 78 | 4 | 3 |
| `filters/beyond-filter.js` | 21 | 2 | 2 |
| `filters/chains.js` | 272 | 6 | 3 |
| `filters/filters.js` | 453 | 14 | 12 |
| `graph/click-actions.js` | 201 | 8 | 8 |
| `graph/graph-data.js` | 109 | 10 | 6 |
| `graph/graph-selection.js` | 54 | 3 | 2 |
| `main.js` | 118 | 0 | 107 |
| `metrics/by-link-type.js` | 206 | 10 | 3 |
| `metrics/concept-dynamics.js` | 224 | 8 | 2 |
| `metrics/descriptions.js` | 478 | 2 | 3 |
| `metrics/format.js` | 32 | 4 | 2 |
| `metrics/generativity.js` | 78 | 8 | 1 |
| `metrics/graph-cache.js` | 117 | 3 | 3 |
| `metrics/link-indexes.js` | 120 | 4 | 4 |
| `metrics/network.js` | 869 | 25 | 2 |
| `metrics/philosopher.js` | 308 | 13 | 2 |
| `metrics/philosophical.js` | 1037 | 23 | 3 |
| `metrics/rankings.js` | 141 | 5 | 3 |
| `metrics/scope-reset.js` | 63 | 3 | 11 |
| `metrics/scope-select.js` | 98 | 6 | 1 |
| `metrics/scope.js` | 134 | 7 | 7 |
| `metrics/similarity-concepts.js` | 243 | 15 | 3 |
| `metrics/similarity-philosophers.js` | 160 | 11 | 2 |
| `metrics/tension-cache.js` | 13 | 1 | 1 |
| `modal/assembly.js` | 54 | 3 | 1 |
| `modal/auth.js` | 162 | 10 | 4 |
| `modal/concept-view.js` | 335 | 1 | 5 |
| `modal/connection-edit.js` | 282 | 9 | 10 |
| `modal/connection-view.js` | 413 | 11 | 8 |
| `modal/context.js` | 11 | 1 | 0 |
| `modal/core.js` | 154 | 7 | 9 |
| `modal/descriptions.js` | 162 | 10 | 0 |
| `modal/dirty.js` | 110 | 5 | 3 |
| `modal/edit-forms.js` | 286 | 2 | 9 |
| `modal/edit-rights.js` | 53 | 3 | 3 |
| `modal/entry.js` | 120 | 12 | 7 |
| `modal/integrity.js` | 252 | 10 | 5 |
| `modal/persist.js` | 359 | 10 | 9 |
| `modal/philosopher-view.js` | 619 | 4 | 10 |
| `modal/profile-concept.js` | 180 | 8 | 6 |
| `modal/profile-philosopher.js` | 119 | 2 | 6 |
| `modal/search.js` | 32 | 2 | 1 |
| `paths/analysis.js` | 72 | 2 | 5 |
| `paths/chronology.js` | 141 | 7 | 2 |
| `paths/path-descriptions.js` | 167 | 4 | 6 |
| `paths/path-ui.js` | 396 | 8 | 7 |
| `paths/shortest-path.js` | 208 | 4 | 4 |
| `render/canvas-core.js` | 20 | 2 | 2 |
| `render/d3-layer.js` | 94 | 10 | 3 |
| `render/draw-link.js` | 97 | 6 | 4 |
| `render/geometry.js` | 93 | 6 | 1 |
| `render/grouping.js` | 44 | 3 | 2 |
| `render/interactions.js` | 90 | 5 | 10 |
| `render/loop.js` | 20 | 4 | 0 |
| `render/metric-visualization.js` | 370 | 10 | 4 |
| `render/picking.js` | 77 | 6 | 6 |
| `render/render-state.js` | 17 | 6 | 1 |
| `render/scene.js` | 241 | 10 | 10 |
| `render/selection.js` | 257 | 8 | 7 |
| `render/similarity-overlay.js` | 111 | 6 | 6 |
| `render/simulation.js` | 80 | 8 | 4 |
| `state/edit.js` | 12 | 1 | 0 |
| `state/filters.js` | 13 | 3 | 1 |
| `state/metrics-scope.js` | 13 | 0 | 1 |
| `state/paths.js` | 15 | 0 | 1 |
| `state/render.js` | 23 | 2 | 1 |
| `state/stats.js` | 33 | 0 | 1 |
| `stats/coverage.js` | 39 | 3 | 1 |
| `stats/modal.js` | 217 | 6 | 15 |
| `stats/results.js` | 378 | 10 | 4 |
| `stats/run.js` | 128 | 4 | 3 |
| `stats/views/advanced.js` | 269 | 10 | 3 |
| `stats/views/comparison.js` | 425 | 10 | 8 |
| `stats/views/network.js` | 222 | 9 | 3 |
| `stats/views/philosopher.js` | 170 | 4 | 5 |
| `stats/views/philosophical.js` | 448 | 12 | 6 |
| `stats/views/rankings.js` | 141 | 2 | 5 |
| `ui/about.js` | 101 | 4 | 1 |
| `ui/actions-byname.js` | 20 | 0 | 2 |
| `ui/actions-dyn.js` | 148 | 0 | 31 |
| `ui/actions-static.js` | 120 | 0 | 20 |
| `ui/actions.js` | 27 | 3 | 0 |
| `ui/delegation.js` | 70 | 1 | 1 |
| `ui/export.js` | 124 | 2 | 9 |
| `ui/hint.js` | 34 | 3 | 1 |
| `ui/legend.js` | 337 | 25 | 5 |
| `ui/search-legend.js` | 117 | 6 | 13 |
| `ui/search-link.js` | 113 | 6 | 5 |
| `ui/search-philosopher.js` | 97 | 7 | 4 |
| `util/color.js` | 23 | 1 | 0 |
| `util/html.js` | 9 | 1 | 0 |
| `util/philosopher-label.js` | 38 | 7 | 1 |
| `util/ru.js` | 49 | 3 | 0 |
| `widgets/custom-select.js` | 87 | 5 | 3 |

## Состав, вывоз и ввоз по модулям


### `boot-defs.js`

Строк 24.

**Вывозит:** `closeAllModals`

**Ввозит:**

- из `./modal/core.js`: `closeUniversalModal`
- из `./modal/entry.js`: `closeDetailModal`, `closePhilosopherDetailModal`
- из `./modal/profile-concept.js`: `closeConceptProfileModal`
- из `./modal/profile-philosopher.js`: `closePhilosopherProfileModal`
- из `./paths/path-descriptions.js`: `closePathDescriptionsModal`
- из `./ui/about.js`: `closeAboutModal`

**Содержит:** `closeAllModals`

### `boot.js`

Строк 639.

**Вывозит:** `boot`

**Ввозит:**

- из `./core/ns.js`: `DATA`, `S`, `MET`
- из `./data/load.js`: `loadData`
- из `./core/graph-index.js`: `buildIndexes`
- из `./core/ready.js`: `onReady`, `onLoad`
- из `./boot-defs.js`: `closeAllModals`
- из `./core/events.js`: `известить`, `подписаться`
- из `./core/link-facts.js`: `isReflexiveLink`, `isSymmetricLink`
- из `./core/time.js`: `CHRONOLOGY_MODES`
- из `./data/save.js`: `hasUnsavedEdits`
- из `./filters/beyond-filter.js`: `resetBeyondFilter`
- из `./filters/filters.js`: `applyFiltersImmediate`
- из `./graph/graph-selection.js`: `cancelGraphSelection`
- из `./metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `./metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `./modal/connection-edit.js`: `selectConnectionEditConcept`
- из `./modal/connection-view.js`: `selectConnectionViewConcept`
- из `./modal/core.js`: `modalStack`, `openUniversalModal`, `popModalState`
- из `./modal/edit-rights.js`: `renderAuthControls`
- из `./modal/entry.js`: `closeDetailModal`, `openEditConceptModal`, `openEditConnectionModal`, `showDetailModal`
- из `./modal/philosopher-view.js`: `makeLegendsEditable`
- из `./paths/path-ui.js`: `initPathFinder`
- из `./render/canvas-core.js`: `resizeCanvas`
- из `./render/d3-layer.js`: `dragended`, `dragstarted`, `gfxLink`, `gfxNode`
- из `./render/grouping.js`: `cols`, `groupPositions`
- из `./render/interactions.js`: `initGraphEventHandlers`
- из `./render/loop.js`: `requestDraw`, `назначитьРисовальщика`
- из `./render/metric-visualization.js`: `saveOriginalRadii`
- из `./render/picking.js`: `pickNode`, `rebuildQuadtree`
- из `./render/scene.js`: `draw`, `updateGraphData`
- из `./render/similarity-overlay.js`: `clearSimilarityOverlay`
- из `./render/simulation.js`: `maxTicks`
- из `./state/filters.js`: `показанныеВопрекиОтбору`
- из `./state/render.js`: `selectedEdges`
- из `./stats/modal.js`: `closeStatsModal`, `loadStatsContent`, `switchStatsView`
- из `./stats/views/comparison.js`: `renderComparison`
- из `./ui/hint.js`: `показатьПодсказку`, `скрытьПодсказку`
- из `./ui/legend.js`: `initFilters`, `restorePanelStates`, `updateFilterStats`, `updatePhilosopherDimming`, `отметитьВыбранныхВЛегенде`
- из `./util/philosopher-label.js`: `labelWithAuthor`
- из `./widgets/custom-select.js`: `initializeCustomSelects`

**Содержит:** `boot`

### `core/base-cells.js`

Строк 17.

**Вывозит:** _ничего_

**Ввозит:**

- из `./ns.js`: `S`

**Содержит:** `S._conceptMap`, `S._concepts`, `S._incomingLinks`, `S._outgoingLinks`, `S._philosopherMap`, `S._philosophers`, `S._relations`

### `core/events.js`

Строк 43.

**Вывозит:** `СОБЫТИЯ_ШИНЫ`, `известить`, `подписаться`, `подписчикиШины`

**Ввозит:** _ничего_

**Содержит:** _только исполняемый код_

### `core/graph-index.js`

Строк 69.

**Вывозит:** `buildIndexes`

**Ввозит:**

- из `./ns.js`: `DATA`

**Содержит:** `buildIndexes`

### `core/link-facts.js`

Строк 41.

**Вывозит:** `isReflexiveLink`, `isSymmetricLink`, `isTypologicalLink`, `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`

**Ввозит:**

- из `./ns.js`: `DATA`, `S`

**Содержит:** `isReflexiveLink`, `isSymmetricLink`, `isTypologicalLink`, `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`

### `core/long-task.js`

Строк 120.

**Вывозит:** `CHAIN_SEARCH`, `LoadingIndicator`, `showTemporaryMessage`

**Ввозит:** _ничего_

**Содержит:** `CHAIN_SEARCH`, `LoadingIndicator`, `showTemporaryMessage`

### `core/ns.js`

Строк 11.

**Вывозит:** `DATA`, `MET`, `S`, `VIEWS`

**Ввозит:** _ничего_

**Содержит:** `DATA`, `MET`, `S`, `VIEWS`

### `core/ready.js`

Строк 15.

**Вывозит:** `onLoad`, `onReady`

**Ввозит:** _ничего_

**Содержит:** `onLoad`, `onReady`

### `core/relation-types.js`

Строк 58.

**Вывозит:** `CONN_WEIGHT_WORDS`, `LAYER_NAMES`, `RELATION_HINTS`, `WEIGHT_OPTIONS`, `WEIGHT_WORDS`, `relationHint`

**Ввозит:**

- из `./ns.js`: `DATA`

**Содержит:** `CONN_WEIGHT_WORDS`, `LAYER_NAMES`, `RELATION_HINTS`, `WEIGHT_OPTIONS`, `WEIGHT_WORDS`, `relationHint`

### `core/search.js`

Строк 71.

**Вывозит:** `displaySearchResults`, `searchNodes`, `внутренностиСтроки`, `отобратьКонцепции`, `пустойСписок`

**Ввозит:**

- из `./ns.js`: `DATA`
- из `./visibility.js`: `isNodeVisible`

**Содержит:** `displaySearchResults`, `searchNodes`

### `core/session.js`

Строк 14.

**Вывозит:** `AUTH_ADMIN`, `authAccounts`, `authSession`, `canEdit`

**Ввозит:** _ничего_

**Содержит:** `AUTH_ADMIN`, `authAccounts`, `authSession`, `canEdit`

### `core/time.js`

Строк 13.

**Вывозит:** `CHRONOLOGY_MODES`, `MATURITY_AGE`

**Ввозит:** _ничего_

**Содержит:** `CHRONOLOGY_MODES`, `MATURITY_AGE`

### `core/visibility.js`

Строк 13.

**Вывозит:** `isLinkVisible`, `isNodeVisible`

**Ввозит:**

- из `./ns.js`: `S`

**Содержит:** `S.visibleLinkSet`, `S.visibleNodeIds`, `isLinkVisible`, `isNodeVisible`

### `data/load.js`

Строк 16.

**Вывозит:** `loadData`

**Ввозит:**

- из `../core/ns.js`: `DATA`

**Содержит:** `FILES`, `loadData`

### `data/mutate.js`

Строк 73.

**Вывозит:** `afterDataChange`, `rebuildDerivedIndexes`, `rebuildPhilosopherTraditions`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/events.js`: `известить`
- из `./save.js`: `markDirty`

**Содержит:** `afterDataChange`, `rebuildDerivedIndexes`, `rebuildPhilosopherTraditions`

### `data/save.js`

Строк 63.

**Вывозит:** `DATA_SETS`, `collectData`, `dataFolder`, `deliverFile`, `downloadData`, `hasUnsaved`, `hasUnsavedEdits`, `markDirty`, `saveToFolder`

**Ввозит:**

- из `../core/ns.js`: `DATA`

**Содержит:** `DATA_SETS`, `collectData`, `dataFolder`, `deliverFile`, `downloadData`, `hasUnsaved`, `hasUnsavedEdits`, `markDirty`, `saveToFolder`

### `dead.js`

Строк 78.

**Вывозит:** `TENSION_WEIGHTS`, `findConnectedComponents`, `tensionScales`, `toggleSimilarityKind`

**Ввозит:**

- из `./core/ns.js`: `DATA`, `MET`, `S`
- из `./metrics/graph-cache.js`: `buildGlobalGraphCache`
- из `./render/similarity-overlay.js`: `showSimilarityOverlay`

**Содержит:** `TENSION_WEIGHTS`, `findConnectedComponents`, `tensionScales`, `toggleSimilarityKind`

### `filters/beyond-filter.js`

Строк 21.

**Вывозит:** `resetBeyondFilter`, `обновитьЗаметкуОбОтборе`

**Ввозит:**

- из `./filters.js`: `applyFiltersImmediate`
- из `../state/filters.js`: `pinnedVisibleNodes`, `показанныеВопрекиОтбору`

**Содержит:** `resetBeyondFilter`

### `filters/chains.js`

Строк 272.

**Вывозит:** `CHAIN_WARN_THRESHOLD`, `buildAdjacencyGraph`, `confirmLongChainSearch`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`, `processBFS`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isSymmetricLink`
- из `../core/long-task.js`: `CHAIN_SEARCH`

**Содержит:** `CHAIN_WARN_THRESHOLD`, `buildAdjacencyGraph`, `confirmLongChainSearch`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`, `processBFS`

### `filters/filters.js`

Строк 453.

**Вывозит:** `FilterModes`, `applyBasicFilter`, `applyChainVisibility`, `applyFilters`, `applyFiltersImmediate`, `cleanupInvisibleSelections`, `debounce`, `debouncedApplyFilters`, `handleChainsMode`, `handleUniqueChainsMode`, `linkPassesTraditions`, `philTraditionsSelected`, `philosopherPassesTraditions`, `refreshMetricsIfScoped`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/events.js`: `известить`
- из `../core/long-task.js`: `CHAIN_SEARCH`, `LoadingIndicator`, `showTemporaryMessage`
- из `../core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `./chains.js`: `confirmLongChainSearch`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`
- из `../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `../metrics/scope.js`: `updateMetricsScopeHint`
- из `../render/d3-layer.js`: `gfxLinkAll`, `gfxNode`
- из `../render/selection.js`: `highlightConnected`, `resetHighlight`
- из `../state/filters.js`: `pinnedVisibleNodes`, `показанныеВопрекиОтбору`
- из `../state/render.js`: `selectedNodes`

**Содержит:** `FilterModes`, `applyBasicFilter`, `applyChainVisibility`, `applyFilters`, `applyFiltersImmediate`, `cleanupInvisibleSelections`, `debounce`, `debouncedApplyFilters`, `handleChainsMode`, `handleUniqueChainsMode`, `linkPassesTraditions`, `philTraditionsSelected`, `philosopherPassesTraditions`, `refreshMetricsIfScoped`

### `graph/click-actions.js`

Строк 201.

**Вывозит:** `clickCount`, `clickTimer`, `handleLinkClick`, `handleLinkSelect`, `handleNodeClick`, `lastClickedNode`, `linkClickCount`, `linkClickTimer`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/events.js`: `известить`
- из `../core/session.js`: `canEdit`
- из `./graph-selection.js`: `handleConceptSelection`
- из `../render/d3-layer.js`: `gfxNode`
- из `../render/selection.js`: `highlightCombined`, `isEdgeConnectedToSelectedNodes`, `isNodeConnectedToSelectedEdges`
- из `../state/edit.js`: `editMode`
- из `../state/render.js`: `selectedEdges`, `selectedNodes`

**Содержит:** `clickCount`, `clickTimer`, `handleLinkClick`, `handleLinkSelect`, `handleNodeClick`, `lastClickedNode`, `linkClickCount`, `linkClickTimer`

### `graph/graph-data.js`

Строк 109.

**Вывозит:** `addLinkToGraph`, `addNodeToGraph`, `connectionsBetween`, `findConnection`, `forgetLink`, `forgetNode`, `getConceptConnections`, `traditionsOfPhilosopher`, `updateLinkOnGraph`, `updateNodeOnGraph`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/events.js`: `известить`
- из `../render/loop.js`: `requestDraw`
- из `../render/scene.js`: `updateGraphData`
- из `../state/filters.js`: `pinnedVisibleNodes`
- из `../state/render.js`: `selectedEdges`, `selectedNodes`

**Содержит:** `addLinkToGraph`, `addNodeToGraph`, `connectionsBetween`, `findConnection`, `forgetLink`, `forgetNode`, `getConceptConnections`, `traditionsOfPhilosopher`, `updateLinkOnGraph`, `updateNodeOnGraph`

### `graph/graph-selection.js`

Строк 54.

**Вывозит:** `cancelGraphSelection`, `handleConceptSelection`, `selectConceptOnGraph`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/events.js`: `известить`

**Содержит:** `cancelGraphSelection`, `handleConceptSelection`, `selectConceptOnGraph`

### `main.js`

Строк 118.

**Вывозит:** _ничего_

**Ввозит:**

- из `./ui/delegation.js`: `installDelegation`
- из `./boot.js`: `boot`
- из `./boot-defs.js`: _ради побочного действия_
- из `./core/base-cells.js`: _ради побочного действия_
- из `./core/events.js`: _ради побочного действия_
- из `./core/graph-index.js`: _ради побочного действия_
- из `./core/link-facts.js`: _ради побочного действия_
- из `./core/long-task.js`: _ради побочного действия_
- из `./core/relation-types.js`: _ради побочного действия_
- из `./core/search.js`: _ради побочного действия_
- из `./core/session.js`: _ради побочного действия_
- из `./core/time.js`: _ради побочного действия_
- из `./core/visibility.js`: _ради побочного действия_
- из `./data/mutate.js`: _ради побочного действия_
- из `./data/save.js`: _ради побочного действия_
- из `./dead.js`: _ради побочного действия_
- из `./filters/beyond-filter.js`: _ради побочного действия_
- из `./filters/chains.js`: _ради побочного действия_
- из `./filters/filters.js`: _ради побочного действия_
- из `./graph/click-actions.js`: _ради побочного действия_
- из `./graph/graph-data.js`: _ради побочного действия_
- из `./graph/graph-selection.js`: _ради побочного действия_
- из `./metrics/by-link-type.js`: _ради побочного действия_
- из `./metrics/concept-dynamics.js`: _ради побочного действия_
- из `./metrics/descriptions.js`: _ради побочного действия_
- из `./metrics/format.js`: _ради побочного действия_
- из `./metrics/generativity.js`: _ради побочного действия_
- из `./metrics/graph-cache.js`: _ради побочного действия_
- из `./metrics/link-indexes.js`: _ради побочного действия_
- из `./metrics/network.js`: _ради побочного действия_
- из `./metrics/philosopher.js`: _ради побочного действия_
- из `./metrics/philosophical.js`: _ради побочного действия_
- из `./metrics/rankings.js`: _ради побочного действия_
- из `./metrics/scope-reset.js`: _ради побочного действия_
- из `./metrics/scope-select.js`: _ради побочного действия_
- из `./metrics/scope.js`: _ради побочного действия_
- из `./metrics/similarity-concepts.js`: _ради побочного действия_
- из `./metrics/similarity-philosophers.js`: _ради побочного действия_
- из `./metrics/tension-cache.js`: _ради побочного действия_
- из `./modal/assembly.js`: _ради побочного действия_
- из `./modal/auth.js`: _ради побочного действия_
- из `./modal/concept-view.js`: _ради побочного действия_
- из `./modal/connection-edit.js`: _ради побочного действия_
- из `./modal/connection-view.js`: _ради побочного действия_
- из `./modal/context.js`: _ради побочного действия_
- из `./modal/core.js`: _ради побочного действия_
- из `./modal/descriptions.js`: _ради побочного действия_
- из `./modal/dirty.js`: _ради побочного действия_
- из `./modal/edit-forms.js`: _ради побочного действия_
- из `./modal/edit-rights.js`: _ради побочного действия_
- из `./modal/entry.js`: _ради побочного действия_
- из `./modal/integrity.js`: _ради побочного действия_
- из `./modal/persist.js`: _ради побочного действия_
- из `./modal/philosopher-view.js`: _ради побочного действия_
- из `./modal/profile-concept.js`: _ради побочного действия_
- из `./modal/profile-philosopher.js`: _ради побочного действия_
- из `./modal/search.js`: _ради побочного действия_
- из `./paths/analysis.js`: _ради побочного действия_
- из `./paths/chronology.js`: _ради побочного действия_
- из `./paths/path-descriptions.js`: _ради побочного действия_
- из `./paths/path-ui.js`: _ради побочного действия_
- из `./paths/shortest-path.js`: _ради побочного действия_
- из `./render/canvas-core.js`: _ради побочного действия_
- из `./render/d3-layer.js`: _ради побочного действия_
- из `./render/draw-link.js`: _ради побочного действия_
- из `./render/geometry.js`: _ради побочного действия_
- из `./render/grouping.js`: _ради побочного действия_
- из `./render/interactions.js`: _ради побочного действия_
- из `./render/loop.js`: _ради побочного действия_
- из `./render/metric-visualization.js`: _ради побочного действия_
- из `./render/picking.js`: _ради побочного действия_
- из `./render/render-state.js`: _ради побочного действия_
- из `./render/scene.js`: _ради побочного действия_
- из `./render/selection.js`: _ради побочного действия_
- из `./render/similarity-overlay.js`: _ради побочного действия_
- из `./render/simulation.js`: _ради побочного действия_
- из `./state/edit.js`: _ради побочного действия_
- из `./state/filters.js`: _ради побочного действия_
- из `./state/metrics-scope.js`: _ради побочного действия_
- из `./state/paths.js`: _ради побочного действия_
- из `./state/render.js`: _ради побочного действия_
- из `./state/stats.js`: _ради побочного действия_
- из `./stats/coverage.js`: _ради побочного действия_
- из `./stats/modal.js`: _ради побочного действия_
- из `./stats/results.js`: _ради побочного действия_
- из `./stats/run.js`: _ради побочного действия_
- из `./stats/views/advanced.js`: _ради побочного действия_
- из `./stats/views/comparison.js`: _ради побочного действия_
- из `./stats/views/network.js`: _ради побочного действия_
- из `./stats/views/philosopher.js`: _ради побочного действия_
- из `./stats/views/philosophical.js`: _ради побочного действия_
- из `./stats/views/rankings.js`: _ради побочного действия_
- из `./ui/about.js`: _ради побочного действия_
- из `./ui/export.js`: _ради побочного действия_
- из `./ui/hint.js`: _ради побочного действия_
- из `./ui/legend.js`: _ради побочного действия_
- из `./ui/search-legend.js`: _ради побочного действия_
- из `./ui/search-link.js`: _ради побочного действия_
- из `./ui/search-philosopher.js`: _ради побочного действия_
- из `./util/color.js`: _ради побочного действия_
- из `./util/html.js`: _ради побочного действия_
- из `./util/philosopher-label.js`: _ради побочного действия_
- из `./util/ru.js`: _ради побочного действия_
- из `./widgets/custom-select.js`: _ради побочного действия_
- из `./ui/actions-byname.js`: _ради побочного действия_
- из `./ui/actions-static.js`: _ради побочного действия_
- из `./ui/actions-dyn.js`: _ради побочного действия_

**Содержит:** _только исполняемый код_

### `metrics/by-link-type.js`

Строк 206.

**Вывозит:** `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF`, `abstractionIndexCache`, `deductiveIndexCache`, `instrumentalIndexCache`, `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache`, `invalidateInstrumentalIndexCache`, `invalidateTraditionBridgingCache`, `traditionBridgingCache`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `../core/link-facts.js`: `sumWeight`
- из `./generativity.js`: `generativity`

**Содержит:** `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF`, `MET.abstractionIndex`, `MET.deductiveDepth`, `MET.deductiveIndex`, `MET.generativeIndex`, `MET.instrumentalIndex`, `MET.traditionBridgingIndex`, `abstractionIndexCache`, `deductiveIndexCache`, `instrumentalIndexCache`, `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache`, `invalidateInstrumentalIndexCache`, `invalidateTraditionBridgingCache`, `traditionBridgingCache`

### `metrics/concept-dynamics.js`

Строк 224.

**Вывозит:** `conceptualComplexityIndexCache`, `conceptualContinuityIndexCache`, `conceptualFertilityIndexCache`, `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateTransformationIndexCache`, `transformationIndexCache`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `../core/link-facts.js`: `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`

**Содержит:** `MET.conceptualComplexityIndex`, `MET.conceptualContinuityIndex`, `MET.conceptualFertilityIndex`, `MET.transformationIndex`, `conceptualComplexityIndexCache`, `conceptualContinuityIndexCache`, `conceptualFertilityIndexCache`, `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateTransformationIndexCache`, `transformationIndexCache`

### `metrics/descriptions.js`

Строк 478.

**Вывозит:** `getMetricDescription`, `metricDescriptions`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `./by-link-type.js`: `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF`
- из `./similarity-philosophers.js`: `PHIL_SIM_MIN_RUBRIC_UNION`

**Содержит:** `getMetricDescription`, `metricDescriptions`

### `metrics/format.js`

Строк 32.

**Вывозит:** `applyMetricMode`, `conceptDegreeForNorm`, `normalizeMetricValue`, `toggleMetricValueMode`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/events.js`: `известить`

**Содержит:** `applyMetricMode`, `conceptDegreeForNorm`, `normalizeMetricValue`, `toggleMetricValueMode`

### `metrics/generativity.js`

Строк 78.

**Вывозит:** `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS`, `_generativityCacheByScope`, `generativity`, `generativityScores`, `invalidateGenerativityCache`, `linkInInfluenceScope`, `sameTraditionPhil`

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS`, `_generativityCacheByScope`, `generativity`, `generativityScores`, `invalidateGenerativityCache`, `linkInInfluenceScope`, `sameTraditionPhil`

### `metrics/graph-cache.js`

Строк 117.

**Вывозит:** `buildGlobalGraphCache`, `graphCache`, `invalidateGraphCache`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/link-facts.js`: `isSymmetricLink`
- из `./scope-select.js`: `metricsLinks`, `metricsNodes`

**Содержит:** `buildGlobalGraphCache`, `graphCache`, `invalidateGraphCache`

### `metrics/link-indexes.js`

Строк 120.

**Вывозит:** `buildIncomingLinks`, `buildOutgoingLinks`, `initializeMetricsData`, `initializePhilosophyMetrics`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isReflexiveLink`, `isSymmetricLink`
- из `../core/visibility.js`: `isNodeVisible`
- из `./scope-select.js`: `effectiveScopeFlags`, `transformForScope`

**Содержит:** `buildIncomingLinks`, `buildOutgoingLinks`, `initializeMetricsData`, `initializePhilosophyMetrics`

### `metrics/network.js`

Строк 869.

**Вывозит:** `betweennessCache`, `betweennessCalculating`, `bfsFromSource`, `calculateBetweennessAsync`, `closenessCache`, `closenessCalculating`, `clusteringCache`, `dijkstraFromSource`, `eigenvectorCache`, `eigenvectorCalculating`, `invalidateBetweennessCache`, `invalidateClosenessCache`, `invalidateClusteringCache`, `invalidateEigenvectorCache`, `invalidateLocalCohesionCache`, `invalidatePageRankCache`, `invalidateRichClubCache`, `invalidateWeightedClusteringCache`, `localCohesionCache`, `medianNodeDegree`, `nodeDegreeOf`, `pageRankCache`, `pageRankCalculating`, `richClubCache`, `weightedClusteringCache`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `./graph-cache.js`: `buildGlobalGraphCache`

**Содержит:** `MET.calculateBetweenness`, `MET.calculateClosenessCentrality`, `MET.calculateClusteringCoefficient`, `MET.calculateEigenvectorCentrality`, `MET.calculateLocalCohesion`, `MET.calculatePageRank`, `MET.calculateRichClubCoefficient`, `MET.calculateWeightedClustering`, `MET.calculateWeightedDegree`, `S._medianDegreeCache`, `betweennessCache`, `betweennessCalculating`, `bfsFromSource`, `calculateBetweennessAsync`, `closenessCache`, `closenessCalculating`, `clusteringCache`, `dijkstraFromSource`, `eigenvectorCache`, `eigenvectorCalculating`, `invalidateBetweennessCache`, `invalidateClosenessCache`, `invalidateClusteringCache`, `invalidateEigenvectorCache`, `invalidateLocalCohesionCache`, `invalidatePageRankCache`, `invalidateRichClubCache`, `invalidateWeightedClusteringCache`, `localCohesionCache`, `medianNodeDegree`, `nodeDegreeOf`, `pageRankCache`, `pageRankCalculating`, `richClubCache`, `weightedClusteringCache`

### `metrics/philosopher.js`

Строк 308.

**Вывозит:** `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES`, `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidateTemporalInfluencePatternCache`, `philosopherHistoricalReachIndexCache`, `philosopherInterdisciplinaryIndexCache`, `philosopherProfile`, `philosopherProfileCache`, `philosopherSystematicIndexCache`, `temporalInfluencePatternCache`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `./philosophical.js`: `DISRUPTIVE_TYPES`, `SYSTEMATIC_TYPES`

**Содержит:** `CONSTRUCTIVE_TYPES`, `MET.philosopherHistoricalReachIndex`, `MET.philosopherInterdisciplinaryIndex`, `MET.philosopherSystematicIndex`, `MET.temporalInfluencePattern`, `POLEMICAL_TYPES`, `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidateTemporalInfluencePatternCache`, `philosopherHistoricalReachIndexCache`, `philosopherInterdisciplinaryIndexCache`, `philosopherProfile`, `philosopherProfileCache`, `philosopherSystematicIndexCache`, `temporalInfluencePatternCache`

### `metrics/philosophical.js`

Строк 1037.

**Вывозит:** `DISRUPTIVE_TYPES`, `INFLUENCE_SCOPE_LABELS`, `SYSTEMATIC_TYPES`, `criticalPowerIndexCache`, `dialogicalIndexCache`, `foundationalIndexCache`, `influenceIndexCache`, `internalCoherenceIndexCache`, `invalidateCriticalPowerIndexCache`, `invalidateDialogicalIndexCache`, `invalidateFoundationalIndexCache`, `invalidateInfluenceIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateProblemGenerationIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateSyntheticIndexCache`, `invalidateTensionIndexCache`, `paradigmShiftIndexCache`, `problemGenerationIndexCache`, `revolutionaryIndexCache`, `syntheticIndexCache`, `tensionIndexCache`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `../core/link-facts.js`: `isSymmetricLink`, `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`
- из `./generativity.js`: `generativity`, `linkInInfluenceScope`

**Содержит:** `DISRUPTIVE_TYPES`, `INFLUENCE_SCOPE_LABELS`, `MET.criticalPowerIndex`, `MET.dialogicalIndex`, `MET.foundationalIndex`, `MET.influenceIndex`, `MET.internalCoherenceIndex`, `MET.paradigmShiftIndex`, `MET.problemGenerationIndex`, `MET.revolutionaryIndex`, `MET.syntheticIndex`, `MET.tensionIndex`, `SYSTEMATIC_TYPES`, `criticalPowerIndexCache`, `dialogicalIndexCache`, `foundationalIndexCache`, `influenceIndexCache`, `internalCoherenceIndexCache`, `invalidateCriticalPowerIndexCache`, `invalidateDialogicalIndexCache`, `invalidateFoundationalIndexCache`, `invalidateInfluenceIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateProblemGenerationIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateSyntheticIndexCache`, `invalidateTensionIndexCache`, `paradigmShiftIndexCache`, `problemGenerationIndexCache`, `revolutionaryIndexCache`, `syntheticIndexCache`, `tensionIndexCache`

### `metrics/rankings.js`

Строк 141.

**Вывозит:** `generatePhilosopherRankings`, `generatePhilosopherRankingsCache`, `generateRankings`, `invalidateGeneratePhilosopherRankingsCache`, `invalidateGenerateRankingsCache`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `./format.js`: `applyMetricMode`
- из `./philosopher.js`: `philosopherProfile`

**Содержит:** `S.generateRankingsCache`, `generatePhilosopherRankings`, `generatePhilosopherRankingsCache`, `generateRankings`, `invalidateGeneratePhilosopherRankingsCache`, `invalidateGenerateRankingsCache`

### `metrics/scope-reset.js`

Строк 63.

**Вывозит:** `invalidateAllMetricsCaches`, `invalidateEverythingForScope`, `invalidateMetricCoverageCache`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `./by-link-type.js`: `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache`, `invalidateInstrumentalIndexCache`, `invalidateTraditionBridgingCache`
- из `./concept-dynamics.js`: `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateTransformationIndexCache`
- из `./generativity.js`: `invalidateGenerativityCache`
- из `./graph-cache.js`: `invalidateGraphCache`
- из `./network.js`: `invalidateBetweennessCache`, `invalidateClosenessCache`, `invalidateClusteringCache`, `invalidateEigenvectorCache`, `invalidateLocalCohesionCache`, `invalidatePageRankCache`, `invalidateRichClubCache`, `invalidateWeightedClusteringCache`
- из `./philosopher.js`: `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidateTemporalInfluencePatternCache`
- из `./philosophical.js`: `invalidateCriticalPowerIndexCache`, `invalidateDialogicalIndexCache`, `invalidateFoundationalIndexCache`, `invalidateInfluenceIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateProblemGenerationIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateSyntheticIndexCache`, `invalidateTensionIndexCache`
- из `./rankings.js`: `invalidateGeneratePhilosopherRankingsCache`, `invalidateGenerateRankingsCache`
- из `./similarity-concepts.js`: `invalidateSimilarityCache`
- из `./tension-cache.js`: `invalidateTensionScales`

**Содержит:** `invalidateAllMetricsCaches`, `invalidateEverythingForScope`, `invalidateMetricCoverageCache`

### `metrics/scope-select.js`

Строк 98.

**Вывозит:** `METRIC_FLAGS`, `VIEW_METRIC`, `effectiveScopeFlags`, `metricsLinks`, `metricsNodes`, `transformForScope`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`

**Содержит:** `METRIC_FLAGS`, `VIEW_METRIC`, `effectiveScopeFlags`, `metricsLinks`, `metricsNodes`, `transformForScope`

### `metrics/scope.js`

Строк 134.

**Вывозит:** `applyMetricsScope`, `handleMetricsScopeChange`, `installMetricScopeWrappers`, `metricScopeFactor`, `metricsScopeCounts`, `updateMetricsScopeHint`, `updateScopeToggles`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `../core/events.js`: `известить`
- из `../core/visibility.js`: `isNodeVisible`
- из `./graph-cache.js`: `invalidateGraphCache`
- из `./link-indexes.js`: `initializePhilosophyMetrics`
- из `./scope-reset.js`: `invalidateEverythingForScope`
- из `./scope-select.js`: `METRIC_FLAGS`, `VIEW_METRIC`, `effectiveScopeFlags`, `transformForScope`

**Содержит:** `S.lastScopeKey`, `applyMetricsScope`, `handleMetricsScopeChange`, `installMetricScopeWrappers`, `metricScopeFactor`, `metricsScopeCounts`, `updateMetricsScopeHint`, `updateScopeToggles`

### `metrics/similarity-concepts.js`

Строк 243.

**Вывозит:** `PAIRS_CHUNK_ROWS`, `_neighborCache`, `_pairCache`, `_pairCalculating`, `_simCache`, `allConceptPairs`, `allConceptPairsAsync`, `invalidateSimilarityCache`, `nearestConcepts`, `neighborSets`, `profileIsMeaningful`, `profileSimilarity`, `similarityData`, `structuralSimilarity`, `typeProfileOf`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `./network.js`: `medianNodeDegree`, `nodeDegreeOf`
- из `./similarity-philosophers.js`: `invalidatePhilosopherSimilarityCache`

**Содержит:** `PAIRS_CHUNK_ROWS`, `_neighborCache`, `_pairCache`, `_pairCalculating`, `_simCache`, `allConceptPairs`, `allConceptPairsAsync`, `invalidateSimilarityCache`, `nearestConcepts`, `neighborSets`, `profileIsMeaningful`, `profileSimilarity`, `similarityData`, `structuralSimilarity`, `typeProfileOf`

### `metrics/similarity-philosophers.js`

Строк 160.

**Вывозит:** `PHIL_SIM_LABELS`, `PHIL_SIM_MIN_CONCEPTS`, `PHIL_SIM_MIN_RUBRIC_UNION`, `SIM_METRIC_LABELS`, `_philSimCache`, `cosineOf`, `invalidatePhilosopherSimilarityCache`, `nearestPhilosophers`, `philosopherSimilarity`, `philosopherSimilarityData`, `rubricUnionSize`

**Ввозит:**

- из `../core/ns.js`: `MET`, `S`
- из `./philosopher.js`: `philosopherProfile`

**Содержит:** `PHIL_SIM_LABELS`, `PHIL_SIM_MIN_CONCEPTS`, `PHIL_SIM_MIN_RUBRIC_UNION`, `SIM_METRIC_LABELS`, `_philSimCache`, `cosineOf`, `invalidatePhilosopherSimilarityCache`, `nearestPhilosophers`, `philosopherSimilarity`, `philosopherSimilarityData`, `rubricUnionSize`

### `metrics/tension-cache.js`

Строк 13.

**Вывозит:** `invalidateTensionScales`

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `S._tensionScales`, `S._tensionScalesComputing`, `invalidateTensionScales`

### `modal/assembly.js`

Строк 54.

**Вывозит:** `modalActions`, `modalContentFor`, `modalEntityExists`

**Ввозит:**

- из `../core/ns.js`: `VIEWS`

**Содержит:** `modalActions`, `modalContentFor`, `modalEntityExists`

### `modal/auth.js`

Строк 162.

**Вывозит:** `authError`, `authLogout`, `authModalEl`, `authModalKind`, `authNoticeAdmin`, `authNoticeMember`, `closeAuthModal`, `openAuthModal`, `showAuthNotice`, `submitAuth`

**Ввозит:**

- из `../core/session.js`: `AUTH_ADMIN`, `authAccounts`, `authSession`
- из `./context.js`: `ModalContext`
- из `./core.js`: `toggleModalMode`
- из `./edit-rights.js`: `refreshEditHints`, `refreshOpenModalToolbar`, `renderAuthControls`

**Содержит:** `authError`, `authLogout`, `authModalEl`, `authModalKind`, `authNoticeAdmin`, `authNoticeMember`, `closeAuthModal`, `openAuthModal`, `showAuthNotice`, `submitAuth`

### `modal/concept-view.js`

Строк 335.

**Вывозит:** `similarConceptsBlock`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../metrics/network.js`: `medianNodeDegree`, `nodeDegreeOf`
- из `../metrics/similarity-concepts.js`: `nearestConcepts`
- из `./connection-view.js`: `стрелкаСвязи`
- из `../util/color.js`: `getContrastColor`

**Содержит:** `VIEWS.generateConceptViewContent`, `similarConceptsBlock`

### `modal/connection-edit.js`

Строк 282.

**Вывозит:** `connEditSelectedBlock`, `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `handleConnectionEditSearch`, `onConnTypeChange`, `selectConnectionEditConcept`, `setupConnectionEditSearchHandlers`, `swapConnectionConcepts`, `updateConnEditPairNote`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../core/link-facts.js`: `isReflexiveLink`
- из `../core/relation-types.js`: `WEIGHT_OPTIONS`, `relationHint`
- из `../core/search.js`: `внутренностиСтроки`, `отобратьКонцепции`, `пустойСписок`
- из `../graph/graph-data.js`: `connectionsBetween`
- из `./assembly.js`: `modalActions`
- из `./connection-view.js`: `initConnectionSearchFields`
- из `./context.js`: `ModalContext`
- из `./core.js`: `openUniversalModal`
- из `../util/html.js`: `escapeAttr`

**Содержит:** `VIEWS.generateConnectionEditContent`, `connEditSelectedBlock`, `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `handleConnectionEditSearch`, `onConnTypeChange`, `selectConnectionEditConcept`, `setupConnectionEditSearchHandlers`, `swapConnectionConcepts`, `updateConnEditPairNote`

### `modal/connection-view.js`

Строк 413.

**Вывозит:** `conceptCircle`, `conceptPlate`, `connectionArrowSvg`, `connectionTraditionNote`, `generateConnectionVisualization`, `handleConnectionViewSearch`, `initConnectionSearchFields`, `selectConnectionViewConcept`, `toggleConnectionSearchSection`, `updateConnectionVisualization`, `стрелкаСвязи`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../core/link-facts.js`: `isReflexiveLink`
- из `../core/relation-types.js`: `CONN_WEIGHT_WORDS`, `WEIGHT_WORDS`, `relationHint`
- из `../core/search.js`: `внутренностиСтроки`, `отобратьКонцепции`, `пустойСписок`
- из `../graph/graph-data.js`: `connectionsBetween`, `traditionsOfPhilosopher`
- из `../graph/graph-selection.js`: `selectConceptOnGraph`
- из `./context.js`: `ModalContext`
- из `../util/color.js`: `getContrastColor`

**Содержит:** `VIEWS.generateConnectionViewContent`, `conceptCircle`, `conceptPlate`, `connectionArrowSvg`, `connectionTraditionNote`, `generateConnectionVisualization`, `handleConnectionViewSearch`, `initConnectionSearchFields`, `selectConnectionViewConcept`, `toggleConnectionSearchSection`, `updateConnectionVisualization`

### `modal/context.js`

Строк 11.

**Вывозит:** `ModalContext`

**Ввозит:** _ничего_

**Содержит:** `ModalContext`

### `modal/core.js`

Строк 154.

**Вывозит:** `MODAL_STACK_MAX`, `closeUniversalModal`, `modalStack`, `openUniversalModal`, `popModalState`, `pushModalState`, `toggleModalMode`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/session.js`: `canEdit`
- из `../graph/graph-selection.js`: `cancelGraphSelection`
- из `./assembly.js`: `modalContentFor`, `modalEntityExists`
- из `./connection-view.js`: `initConnectionSearchFields`
- из `./context.js`: `ModalContext`
- из `./dirty.js`: `hasUnsavedChanges`
- из `./search.js`: `clearModalSearch`
- из `../render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`

**Содержит:** `MODAL_STACK_MAX`, `closeUniversalModal`, `modalStack`, `openUniversalModal`, `popModalState`, `pushModalState`, `toggleModalMode`

### `modal/descriptions.js`

Строк 162.

**Вывозит:** `allDescriptionsExpanded`, `allPhilosopherConceptDescriptionsExpanded`, `allPhilosopherConnectionDescriptionsExpanded`, `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions`, `toggleAllRoot`, `toggleConnectionDescription`, `togglePhilosopherConceptDescription`, `toggleSubsection`

**Ввозит:** _ничего_

**Содержит:** `allDescriptionsExpanded`, `allPhilosopherConceptDescriptionsExpanded`, `allPhilosopherConnectionDescriptionsExpanded`, `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions`, `toggleAllRoot`, `toggleConnectionDescription`, `togglePhilosopherConceptDescription`, `toggleSubsection`

### `modal/dirty.js`

Строк 110.

**Вывозит:** `hasConceptChanges`, `hasConnectionChanges`, `hasFilledFields`, `hasPhilosopherChanges`, `hasUnsavedChanges`

**Ввозит:**

- из `../core/ns.js`: `DATA`
- из `./assembly.js`: `modalEntityExists`
- из `./context.js`: `ModalContext`

**Содержит:** `hasConceptChanges`, `hasConnectionChanges`, `hasFilledFields`, `hasPhilosopherChanges`, `hasUnsavedChanges`

### `modal/edit-forms.js`

Строк 286.

**Вывозит:** `syncPhilColorFromPicker`, `updatePhilColorSample`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../core/link-facts.js`: `isReflexiveLink`
- из `../core/relation-types.js`: `relationHint`
- из `../graph/graph-data.js`: `getConceptConnections`
- из `./assembly.js`: `modalActions`
- из `./connection-view.js`: `стрелкаСвязи`
- из `../util/color.js`: `getContrastColor`
- из `../util/html.js`: `escapeAttr`
- из `../util/philosopher-label.js`: `philosopherYears`, `sortPhilosophersByBirth`

**Содержит:** `VIEWS.generateConceptEditContent`, `VIEWS.generatePhilosopherEditContent`, `syncPhilColorFromPicker`, `updatePhilColorSample`

### `modal/edit-rights.js`

Строк 53.

**Вывозит:** `refreshEditHints`, `refreshOpenModalToolbar`, `renderAuthControls`

**Ввозит:**

- из `../core/session.js`: `authSession`, `canEdit`
- из `./context.js`: `ModalContext`
- из `./core.js`: `openUniversalModal`

**Содержит:** `refreshEditHints`, `refreshOpenModalToolbar`, `renderAuthControls`

### `modal/entry.js`

Строк 120.

**Вывозит:** `closeDetailModal`, `closePhilosopherDetailModal`, `getIsolatedConceptsAfterDeletion`, `gotoNodeFromModal`, `isConceptIsolated`, `openConceptById`, `openEditConceptModal`, `openEditConnectionModal`, `openEditPhilosopherModal`, `showAllConcepts`, `showDetailModal`, `showPhilosopherDetailModal`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/session.js`: `canEdit`
- из `../graph/graph-data.js`: `findConnection`, `getConceptConnections`
- из `./core.js`: `closeUniversalModal`, `openUniversalModal`
- из `../render/d3-layer.js`: `gfxNode`
- из `../render/selection.js`: `highlightConnected`
- из `../state/render.js`: `selectedNodes`

**Содержит:** `closeDetailModal`, `closePhilosopherDetailModal`, `getIsolatedConceptsAfterDeletion`, `gotoNodeFromModal`, `isConceptIsolated`, `openConceptById`, `openEditConceptModal`, `openEditConnectionModal`, `openEditPhilosopherModal`, `showAllConcepts`, `showDetailModal`, `showPhilosopherDetailModal`

### `modal/integrity.js`

Строк 252.

**Вывозит:** `GROUNDING_TYPES`, `activityOverlap`, `conceptIntegrityWarnings`, `connectionIntegrityWarnings`, `groundingCyclePath`, `labelOf`, `nConcepts`, `nLinks`, `philosopherIntegrityWarnings`, `relationIndexOf`

**Ввозит:**

- из `../core/ns.js`: `DATA`
- из `../core/link-facts.js`: `isReflexiveLink`
- из `./entry.js`: `isConceptIsolated`
- из `../util/philosopher-label.js`: `philosopherBirth`, `philosopherYears`
- из `../util/ru.js`: `pluralRu`

**Содержит:** `GROUNDING_TYPES`, `activityOverlap`, `conceptIntegrityWarnings`, `connectionIntegrityWarnings`, `groundingCyclePath`, `labelOf`, `nConcepts`, `nLinks`, `philosopherIntegrityWarnings`, `relationIndexOf`

### `modal/persist.js`

Строк 359.

**Вывозит:** `confirmWarnings`, `deleteConcept`, `deleteConnection`, `deletePhilosopher`, `generateId`, `removeConceptEverywhere`, `removeLinkEverywhere`, `saveConceptData`, `saveConnectionData`, `savePhilosopherData`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isReflexiveLink`
- из `../data/mutate.js`: `afterDataChange`
- из `../graph/graph-data.js`: `addLinkToGraph`, `addNodeToGraph`, `findConnection`, `forgetLink`, `forgetNode`, `getConceptConnections`, `updateLinkOnGraph`, `updateNodeOnGraph`
- из `./assembly.js`: `modalEntityExists`
- из `./context.js`: `ModalContext`
- из `./core.js`: `closeUniversalModal`, `openUniversalModal`
- из `./entry.js`: `getIsolatedConceptsAfterDeletion`
- из `./integrity.js`: `conceptIntegrityWarnings`, `connectionIntegrityWarnings`, `nConcepts`, `nLinks`, `philosopherIntegrityWarnings`, `relationIndexOf`

**Содержит:** `confirmWarnings`, `deleteConcept`, `deleteConnection`, `deletePhilosopher`, `generateId`, `removeConceptEverywhere`, `removeLinkEverywhere`, `saveConceptData`, `saveConnectionData`, `savePhilosopherData`

### `modal/philosopher-view.js`

Строк 619.

**Вывозит:** `DATA_traditions_of`, `makeLegendsEditable`, `similarPhilosophersBlock`, `традицииФилософаБлок`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `VIEWS`
- из `../core/session.js`: `canEdit`
- из `../metrics/similarity-philosophers.js`: `nearestPhilosophers`
- из `./connection-view.js`: `стрелкаСвязи`
- из `./edit-rights.js`: `refreshEditHints`
- из `./entry.js`: `openEditPhilosopherModal`, `showPhilosopherDetailModal`
- из `../render/selection.js`: `highlightPhilosopherOnGraph`
- из `../util/color.js`: `getContrastColor`
- из `../util/philosopher-label.js`: `formatBirthYear`, `philosopherBirth`, `philosopherYears`, `sortPhilosophersByBirth`
- из `../util/ru.js`: `conjugateVerb`, `declinePhilosopher`

**Содержит:** `DATA_traditions_of`, `VIEWS.generatePhilosopherViewContent`, `makeLegendsEditable`, `similarPhilosophersBlock`

### `modal/profile-concept.js`

Строк 180.

**Вывозит:** `PROFILE_METRICS`, `closeConceptProfileModal`, `conceptDegreesDetailed`, `metricPartsText`, `metricPercentile`, `metricRank`, `showConceptProfileModal`, `toggleProfileOrder`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../metrics/scope.js`: `metricsScopeCounts`
- из `../render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `../stats/coverage.js`: `METRIC_COVERAGE_WARN`, `metricCoverage`
- из `../util/color.js`: `getContrastColor`

**Содержит:** `PROFILE_METRICS`, `closeConceptProfileModal`, `conceptDegreesDetailed`, `metricPartsText`, `metricPercentile`, `metricRank`, `showConceptProfileModal`, `toggleProfileOrder`

### `modal/profile-philosopher.js`

Строк 119.

**Вывозит:** `closePhilosopherProfileModal`, `showPhilosopherProfileModal`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `./profile-concept.js`: `PROFILE_METRICS`
- из `../render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `../stats/coverage.js`: `METRIC_COVERAGE_WARN`, `metricCoverage`
- из `../util/color.js`: `getContrastColor`

**Содержит:** `closePhilosopherProfileModal`, `showPhilosopherProfileModal`

### `modal/search.js`

Строк 32.

**Вывозит:** `clearModalSearch`, `handleModalSearch`

**Ввозит:**

- из `../core/search.js`: `displaySearchResults`, `отобратьКонцепции`

**Содержит:** `clearModalSearch`, `handleModalSearch`

### `paths/analysis.js`

Строк 72.

**Вывозит:** `analyzePath`, `analyzePathTraditions`

**Ввозит:**

- из `../core/ns.js`: `DATA`
- из `../core/link-facts.js`: `isSymmetricLink`
- из `../core/time.js`: `CHRONOLOGY_MODES`
- из `../graph/graph-data.js`: `traditionsOfPhilosopher`
- из `./chronology.js`: `isChronologicallyValid`

**Содержит:** `analyzePath`, `analyzePathTraditions`

### `paths/chronology.js`

Строк 141.

**Вывозит:** `DATA_nodes_find`, `isChronologicallyValid`, `looseChronologyCheck`, `moderateChronologyCheck`, `strictChronologyCheck`, `летУзла`, `шагБезРазрыва`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/time.js`: `CHRONOLOGY_MODES`, `MATURITY_AGE`

**Содержит:** `DATA_nodes_find`, `isChronologicallyValid`, `looseChronologyCheck`, `moderateChronologyCheck`, `strictChronologyCheck`

### `paths/path-descriptions.js`

Строк 167.

**Вывозит:** `closePathDescriptionsModal`, `nodesDescriptionsVisible`, `showPathDescriptionsModal`, `togglePathNodesDescriptions`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/relation-types.js`: `WEIGHT_WORDS`
- из `./analysis.js`: `analyzePathTraditions`
- из `./path-ui.js`: `resolvePathLinkList`
- из `../render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `../util/color.js`: `getContrastColor`

**Содержит:** `closePathDescriptionsModal`, `nodesDescriptionsVisible`, `showPathDescriptionsModal`, `togglePathNodesDescriptions`

### `paths/path-ui.js`

Строк 396.

**Вывозит:** `ARROW_HOVER_DELAY`, `arrowHoverTimer`, `clearPathHighlight`, `findAndShowPath`, `handlePathArrowHover`, `highlightPath`, `initPathFinder`, `resolvePathLinkList`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isSymmetricLink`
- из `../core/time.js`: `CHRONOLOGY_MODES`
- из `./analysis.js`: `analyzePath`, `analyzePathTraditions`
- из `./shortest-path.js`: `findShortestPath`
- из `../render/d3-layer.js`: `gfxLinkAll`, `gfxNode`
- из `../render/selection.js`: `resetHighlight`

**Содержит:** `ARROW_HOVER_DELAY`, `arrowHoverTimer`, `clearPathHighlight`, `findAndShowPath`, `handlePathArrowHover`, `highlightPath`, `initPathFinder`, `resolvePathLinkList`

### `paths/shortest-path.js`

Строк 208.

**Вывозит:** `findShortestPath`, `findShortestPathUnweighted`, `findShortestPathWeighted`, `pathLinkAllowed`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isSymmetricLink`, `isTypologicalLink`
- из `../core/time.js`: `CHRONOLOGY_MODES`
- из `./chronology.js`: `isChronologicallyValid`, `летУзла`, `шагБезРазрыва`

**Содержит:** `findShortestPath`, `findShortestPathUnweighted`, `findShortestPathWeighted`, `pathLinkAllowed`

### `render/canvas-core.js`

Строк 20.

**Вывозит:** `PICK_LINK_WIDTH`, `resizeCanvas`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `./loop.js`: `requestDraw`

**Содержит:** `PICK_LINK_WIDTH`, `resizeCanvas`

### `render/d3-layer.js`

Строк 94.

**Вывозит:** `dragended`, `dragstarted`, `gfxLink`, `gfxLinkAll`, `gfxNode`, `linkHandlers`, `makeClassed`, `nodeHandlers`, `subSelection`, `updateArrows`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `./loop.js`: `requestDraw`
- из `./scene.js`: `startRadiusAnimation`

**Содержит:** `dragended`, `dragstarted`, `gfxLink`, `gfxLinkAll`, `gfxNode`, `linkHandlers`, `makeClassed`, `nodeHandlers`, `subSelection`, `updateArrows`

### `render/draw-link.js`

Строк 97.

**Вывозит:** `drawSelfLoop`, `fillArrow`, `linkDrawAlpha`, `linkDrawWidth`, `linkVisualState`, `strokeLink`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `./geometry.js`: `arcParams`, `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`, `linkHoverStrokeWidth`, `linkStrokeWidth`
- из `./render-state.js`: `hasLinkClass`, `nodeRadius`
- из `../state/render.js`: `selectedEdges`

**Содержит:** `drawSelfLoop`, `fillArrow`, `linkDrawAlpha`, `linkDrawWidth`, `linkVisualState`, `strokeLink`

### `render/geometry.js`

Строк 93.

**Вывозит:** `arcParams`, `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`, `linkHoverStrokeWidth`, `linkStrokeWidth`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`

**Содержит:** `arcParams`, `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`, `linkHoverStrokeWidth`, `linkStrokeWidth`

### `render/grouping.js`

Строк 44.

**Вывозит:** `cols`, `groupPositions`, `toggleGrouping`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `./selection.js`: `resetHighlight`

**Содержит:** `cols`, `groupPositions`, `toggleGrouping`

### `render/interactions.js`

Строк 90.

**Вывозит:** `dispatchClick`, `dispatchMove`, `initGraphEventHandlers`, `lastHoverLink`, `lastHoverNode`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../core/events.js`: `известить`
- из `../core/session.js`: `canEdit`
- из `../graph/click-actions.js`: `handleLinkClick`, `handleNodeClick`
- из `../graph/graph-selection.js`: `cancelGraphSelection`, `handleConceptSelection`
- из `./d3-layer.js`: `gfxLink`, `gfxNode`, `linkHandlers`, `nodeHandlers`
- из `./loop.js`: `requestDraw`
- из `./picking.js`: `pickLink`, `pickNode`, `toGraph`
- из `./selection.js`: `resetHighlight`
- из `../state/edit.js`: `editMode`

**Содержит:** `dispatchClick`, `dispatchMove`, `initGraphEventHandlers`, `lastHoverLink`, `lastHoverNode`

### `render/loop.js`

Строк 20.

**Вывозит:** `drawScheduled`, `requestDraw`, `назначитьРисовальщика`, `рисовальщик`

**Ввозит:** _ничего_

**Содержит:** `drawScheduled`, `requestDraw`

### `render/metric-visualization.js`

Строк 370.

**Вывозит:** `currentVisualizedMetric`, `isVisualizingBySize`, `originalRadii`, `originalTextDy`, `resetNodeSizes`, `saveOriginalRadii`, `toggleMetricVisualization`, `updateVisualizationButtonText`, `updateVisualizationControlSection`, `visualizeMetricBySize`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `MET`, `S`
- из `../core/events.js`: `известить`
- из `../metrics/network.js`: `betweennessCache`, `closenessCache`, `eigenvectorCache`, `localCohesionCache`, `pageRankCache`, `richClubCache`, `weightedClusteringCache`
- из `./d3-layer.js`: `gfxNode`, `updateArrows`

**Содержит:** `currentVisualizedMetric`, `isVisualizingBySize`, `originalRadii`, `originalTextDy`, `resetNodeSizes`, `saveOriginalRadii`, `toggleMetricVisualization`, `updateVisualizationButtonText`, `updateVisualizationControlSection`, `visualizeMetricBySize`

### `render/picking.js`

Строк 77.

**Вывозит:** `pickLink`, `pickNode`, `quadtree`, `rebuildQuadtree`, `repaintPickCanvas`, `toGraph`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isReflexiveLink`
- из `../core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `./canvas-core.js`: `PICK_LINK_WIDTH`
- из `./draw-link.js`: `drawSelfLoop`, `fillArrow`, `linkDrawWidth`, `linkVisualState`, `strokeLink`
- из `./render-state.js`: `nodeRadius`

**Содержит:** `pickLink`, `pickNode`, `quadtree`, `rebuildQuadtree`, `repaintPickCanvas`, `toGraph`

### `render/render-state.js`

Строк 17.

**Вывозит:** `LABEL_ALL_ABOVE`, `LABEL_HIDE_BELOW`, `hasLinkClass`, `hasNodeClass`, `nodeLabelDy`, `nodeRadius`

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `LABEL_ALL_ABOVE`, `LABEL_HIDE_BELOW`, `hasLinkClass`, `hasNodeClass`, `nodeLabelDy`, `nodeRadius`

### `render/scene.js`

Строк 241.

**Вывозит:** `DRAW_ORDER`, `animLoopRunning`, `draw`, `ensureAnimLoop`, `graphIsCovered`, `needsContinuousAnimation`, `renderScene`, `startRadiusAnimation`, `stepRadiusAnimation`, `updateGraphData`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isReflexiveLink`
- из `../core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `./draw-link.js`: `drawSelfLoop`, `fillArrow`, `linkDrawAlpha`, `linkDrawWidth`, `linkVisualState`, `strokeLink`
- из `./geometry.js`: `arcParams`, `linkHoverStrokeWidth`
- из `./loop.js`: `requestDraw`
- из `./picking.js`: `rebuildQuadtree`
- из `./render-state.js`: `LABEL_ALL_ABOVE`, `LABEL_HIDE_BELOW`, `hasNodeClass`, `nodeLabelDy`, `nodeRadius`
- из `./similarity-overlay.js`: `similarityColor`
- из `../state/render.js`: `selectedNodes`

**Содержит:** `DRAW_ORDER`, `animLoopRunning`, `draw`, `ensureAnimLoop`, `graphIsCovered`, `needsContinuousAnimation`, `renderScene`, `startRadiusAnimation`, `stepRadiusAnimation`, `updateGraphData`

### `render/selection.js`

Строк 257.

**Вывозит:** `highlightCombined`, `highlightConnected`, `highlightNodeById`, `highlightPhilosopherOnGraph`, `isEdgeConnectedToNode`, `isEdgeConnectedToSelectedNodes`, `isNodeConnectedToSelectedEdges`, `resetHighlight`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/events.js`: `известить`
- из `../core/long-task.js`: `showTemporaryMessage`
- из `./d3-layer.js`: `gfxLinkAll`, `gfxNode`
- из `./loop.js`: `requestDraw`
- из `../state/filters.js`: `выбранныеФилософы`
- из `../state/render.js`: `selectedEdges`, `selectedNodes`

**Содержит:** `highlightCombined`, `highlightConnected`, `highlightNodeById`, `highlightPhilosopherOnGraph`, `isEdgeConnectedToNode`, `isEdgeConnectedToSelectedNodes`, `isNodeConnectedToSelectedEdges`, `resetHighlight`

### `render/similarity-overlay.js`

Строк 111.

**Вывозит:** `SIMILARITY_ARCS`, `SIMILARITY_KEEP_QUANTILE`, `clearSimilarityOverlay`, `showSimilarityOverlay`, `similarityColor`, `updateSimilarityLegend`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/events.js`: `известить`
- из `../core/long-task.js`: `showTemporaryMessage`
- из `../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../metrics/similarity-concepts.js`: `_simCache`, `profileSimilarity`, `structuralSimilarity`
- из `./loop.js`: `requestDraw`

**Содержит:** `SIMILARITY_ARCS`, `SIMILARITY_KEEP_QUANTILE`, `clearSimilarityOverlay`, `showSimilarityOverlay`, `similarityColor`, `updateSimilarityLegend`

### `render/simulation.js`

Строк 80.

**Вывозит:** `centerGraph`, `freezeSimulation`, `maxTicks`, `resetSimulation`, `simLockedByHand`, `toggleSimulationFreeze`, `unfreezeSimulation`, `updateFreezeButton`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/long-task.js`: `showTemporaryMessage`
- из `./scene.js`: `ensureAnimLoop`, `needsContinuousAnimation`
- из `./selection.js`: `resetHighlight`

**Содержит:** `centerGraph`, `freezeSimulation`, `maxTicks`, `resetSimulation`, `simLockedByHand`, `toggleSimulationFreeze`, `unfreezeSimulation`, `updateFreezeButton`

### `state/edit.js`

Строк 12.

**Вывозит:** `editMode`

**Ввозит:** _ничего_

**Содержит:** `editMode`

### `state/filters.js`

Строк 13.

**Вывозит:** `pinnedVisibleNodes`, `выбранныеФилософы`, `показанныеВопрекиОтбору`

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `S.filterMode`, `pinnedVisibleNodes`

### `state/metrics-scope.js`

Строк 13.

**Вывозит:** _ничего_

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `S.influenceScope`, `S.metricsLinkSource`, `S.metricsNodeSource`, `S.metricsScope`, `S.metricsScopeActive`

### `state/paths.js`

Строк 15.

**Вывозит:** _ничего_

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `S.currentPathData`, `S.respectDirection`, `S.selectedSourceNode`, `S.selectedTargetNode`, `S.skipTypologicalInPaths`, `S.useWeightedPaths`

### `state/render.js`

Строк 23.

**Вывозит:** `selectedEdges`, `selectedNodes`

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `S.arrowMode`, `S.arrowRadius`, `S.isGrouped`, `S.pickDirty`, `S.similarityOverlay`, `S.tickCount`, `S.uniformLinkWidthActive`, `selectedEdges`, `selectedNodes`

### `state/stats.js`

Строк 33.

**Вывозит:** _ничего_

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `S._cmpA`, `S._cmpB`, `S._pairsCrossAuthor`, `S._pairsCrossTradition`, `S._pairsKind`, `S._pairsMinDegree`, `S._pairsMinShared`, `S._pcmpA`, `S._pcmpB`, `S._philPairsKind`, `S.currentStatsView`, `S.generateRankingsMode`, `S.isStatsModalOpen`, `S.metricValueMode`, `S.profileOrderMode`

### `stats/coverage.js`

Строк 39.

**Вывозит:** `METRIC_COVERAGE_WARN`, `generateMetricCoverageBlock`, `metricCoverage`

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `METRIC_COVERAGE_WARN`, `S._metricCoverageCache`, `generateMetricCoverageBlock`, `metricCoverage`

### `stats/modal.js`

Строк 217.

**Вывозит:** `closeStatsModal`, `handleStatsParameterChange`, `loadStatsContent`, `openStatsModal`, `switchStatsView`, `updateActiveNavItem`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../metrics/graph-cache.js`: `invalidateGraphCache`
- из `../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `../metrics/scope.js`: `applyMetricsScope`, `installMetricScopeWrappers`, `updateMetricsScopeHint`, `updateScopeToggles`
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

Строк 378.

**Вывозит:** `METRIC_FIELD_LABELS`, `applyMetricLayout`, `generateCalculateButton`, `generateMetricDescriptionBlock`, `generateMetricResults`, `genericDetailsHTML`, `lastZeroCount`, `rankKeep`, `toggleMetricDetails`, `toggleMetricLayout`

**Ввозит:**

- из `../core/ns.js`: `S`
- из `../metrics/descriptions.js`: `getMetricDescription`
- из `../metrics/format.js`: `applyMetricMode`
- из `./coverage.js`: `generateMetricCoverageBlock`

**Содержит:** `METRIC_FIELD_LABELS`, `S.metricLayoutMode`, `applyMetricLayout`, `generateCalculateButton`, `generateMetricDescriptionBlock`, `generateMetricResults`, `genericDetailsHTML`, `lastZeroCount`, `rankKeep`, `toggleMetricDetails`, `toggleMetricLayout`

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
- из `../../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../results.js`: `generateMetricDescriptionBlock`, `generateMetricResults`, `rankKeep`

**Содержит:** `generateAbstractionContent`, `generateBridgingContent`, `generateComplexityContent`, `generateContinuityContent`, `generateDeductiveContent`, `generateFertilityContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateTemporalInfluenceContent`, `generateTransformationContent`

### `stats/views/comparison.js`

Строк 425.

**Вывозит:** `generateClosestPairsContent`, `generateComparisonContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `openPairInComparison`, `openPhilosopherPair`, `renderClosestPairs`, `renderComparison`, `renderPhilosopherComparison`, `renderPhilosopherPairs`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `S`
- из `../../core/events.js`: `известить`
- из `../../core/long-task.js`: `LoadingIndicator`
- из `../../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../../metrics/philosopher.js`: `philosopherProfile`
- из `../../metrics/similarity-concepts.js`: `_pairCalculating`, `allConceptPairs`, `allConceptPairsAsync`, `profileSimilarity`, `similarityData`, `structuralSimilarity`
- из `../../metrics/similarity-philosophers.js`: `PHIL_SIM_LABELS`, `SIM_METRIC_LABELS`, `philosopherSimilarity`, `philosopherSimilarityData`
- из `../results.js`: `generateMetricDescriptionBlock`

**Содержит:** `generateClosestPairsContent`, `generateComparisonContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `openPairInComparison`, `openPhilosopherPair`, `renderClosestPairs`, `renderComparison`, `renderPhilosopherComparison`, `renderPhilosopherPairs`

### `stats/views/network.js`

Строк 222.

**Вывозит:** `generateBetweennessContent`, `generateClosenessContent`, `generateDegreeContent`, `generateEigenvectorContent`, `generateLocalCohesionContent`, `generateOverviewContent`, `generatePageRankContent`, `generateRichClubContent`, `generateWeightedClusteringContent`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `MET`, `S`
- из `../../metrics/network.js`: `betweennessCache`, `closenessCache`, `eigenvectorCache`, `localCohesionCache`, `pageRankCache`, `richClubCache`, `weightedClusteringCache`
- из `../results.js`: `generateCalculateButton`, `generateMetricDescriptionBlock`, `generateMetricResults`

**Содержит:** `generateBetweennessContent`, `generateClosenessContent`, `generateDegreeContent`, `generateEigenvectorContent`, `generateLocalCohesionContent`, `generateOverviewContent`, `generatePageRankContent`, `generateRichClubContent`, `generateWeightedClusteringContent`

### `stats/views/philosopher.js`

Строк 170.

**Вывозит:** `generatePhilosopherInterdisciplinaryContent`, `generatePhilosopherProfileContent`, `generatePhilosopherReachContent`, `generatePhilosopherSystematicContent`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `MET`
- из `../../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../../metrics/philosopher.js`: `philosopherProfile`
- из `../results.js`: `generateMetricDescriptionBlock`, `rankKeep`
- из `./philosophical.js`: `influenceScopeSwitcher`

**Содержит:** `generatePhilosopherInterdisciplinaryContent`, `generatePhilosopherProfileContent`, `generatePhilosopherReachContent`, `generatePhilosopherSystematicContent`

### `stats/views/philosophical.js`

Строк 448.

**Вывозит:** `generateCoherenceContent`, `generateCriticalPowerContent`, `generateDialogicalContent`, `generateFoundationalContent`, `generateInfluenceContent`, `generateParadigmShiftContent`, `generateProblemGenerationContent`, `generateRevolutionaryContent`, `generateSyntheticContent`, `generateTensionContent`, `influenceScopeSwitcher`, `setInfluenceScope`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `MET`, `S`
- из `../../core/events.js`: `известить`
- из `../../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../../metrics/philosophical.js`: `INFLUENCE_SCOPE_LABELS`, `invalidateInfluenceIndexCache`
- из `../../metrics/rankings.js`: `invalidateGeneratePhilosopherRankingsCache`
- из `../results.js`: `generateMetricResults`, `rankKeep`

**Содержит:** `generateCoherenceContent`, `generateCriticalPowerContent`, `generateDialogicalContent`, `generateFoundationalContent`, `generateInfluenceContent`, `generateParadigmShiftContent`, `generateProblemGenerationContent`, `generateRevolutionaryContent`, `generateSyntheticContent`, `generateTensionContent`, `influenceScopeSwitcher`, `setInfluenceScope`

### `stats/views/rankings.js`

Строк 141.

**Вывозит:** `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`

**Ввозит:**

- из `../../core/ns.js`: `DATA`, `S`
- из `../../metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `../../metrics/rankings.js`: `generatePhilosopherRankings`, `generateRankings`
- из `../results.js`: `generateMetricDescriptionBlock`
- из `./philosophical.js`: `influenceScopeSwitcher`

**Содержит:** `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`

### `ui/about.js`

Строк 101.

**Вывозит:** `closeAboutModal`, `onAboutBackdropClick`, `openAboutModal`, `собратьОПроекте`

**Ввозит:**

- из `../core/ns.js`: `DATA`

**Содержит:** `closeAboutModal`, `onAboutBackdropClick`, `openAboutModal`

### `ui/actions-byname.js`

Строк 20.

**Вывозит:** _ничего_

**Ввозит:**

- из `./actions.js`: `registerActions`
- из `../modal/persist.js`: `deleteConcept`, `deleteConnection`, `deletePhilosopher`, `saveConceptData`, `saveConnectionData`, `savePhilosopherData`

**Содержит:** _только исполняемый код_

### `ui/actions-dyn.js`

Строк 148.

**Вывозит:** _ничего_

**Ввозит:**

- из `./actions.js`: `registerActions`
- из `../core/ns.js`: `DATA`, `S`
- из `../graph/graph-data.js`: `findConnection`
- из `../graph/graph-selection.js`: `cancelGraphSelection`
- из `../metrics/format.js`: `toggleMetricValueMode`
- из `../modal/auth.js`: `authLogout`, `closeAuthModal`, `openAuthModal`, `submitAuth`
- из `../modal/connection-edit.js`: `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `onConnTypeChange`, `selectConnectionEditConcept`, `swapConnectionConcepts`
- из `../modal/connection-view.js`: `handleConnectionViewSearch`, `selectConnectionViewConcept`, `toggleConnectionSearchSection`
- из `../modal/core.js`: `closeUniversalModal`, `openUniversalModal`, `popModalState`, `toggleModalMode`
- из `../modal/descriptions.js`: `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions`, `toggleConnectionDescription`, `togglePhilosopherConceptDescription`, `toggleSubsection`
- из `../modal/edit-forms.js`: `syncPhilColorFromPicker`, `updatePhilColorSample`
- из `../modal/entry.js`: `gotoNodeFromModal`, `openConceptById`, `openEditConceptModal`, `openEditConnectionModal`, `showAllConcepts`, `showPhilosopherDetailModal`
- из `../modal/persist.js`: `deleteConnection`
- из `../modal/profile-concept.js`: `closeConceptProfileModal`, `showConceptProfileModal`, `toggleProfileOrder`
- из `../modal/profile-philosopher.js`: `closePhilosopherProfileModal`, `showPhilosopherProfileModal`
- из `../modal/search.js`: `clearModalSearch`, `handleModalSearch`
- из `../paths/path-descriptions.js`: `showPathDescriptionsModal`, `togglePathNodesDescriptions`
- из `../paths/path-ui.js`: `clearPathHighlight`, `handlePathArrowHover`
- из `../render/metric-visualization.js`: `toggleMetricVisualization`
- из `../render/selection.js`: `highlightNodeById`
- из `../render/similarity-overlay.js`: `clearSimilarityOverlay`, `showSimilarityOverlay`
- из `../stats/modal.js`: `openStatsModal`, `switchStatsView`
- из `../stats/results.js`: `toggleMetricDetails`, `toggleMetricLayout`
- из `../stats/run.js`: `calculateMetricFromModal`
- из `../stats/views/comparison.js`: `openPairInComparison`, `openPhilosopherPair`, `renderClosestPairs`, `renderPhilosopherComparison`, `renderPhilosopherPairs`
- из `../stats/views/philosophical.js`: `setInfluenceScope`
- из `./legend.js`: `addTradition`, `onlyTradition`, `togglePhilosopher`, `toggleRelation`, `toggleRubric`, `toggleTradition`
- из `./search-legend.js`: `selectSearchResult`
- из `./search-link.js`: `highlightLinkOnGraph`, `pickLinkEnd`
- из `./search-philosopher.js`: `clearPhilosopherSearch`, `handlePhilosopherSearch`, `pickPhilosopherFromSearch`, `selectPhilosopherResult`
- из `../widgets/custom-select.js`: `filterCustomSelect`, `selectCustomOption`, `showCustomSelectDropdown`

**Содержит:** _только исполняемый код_

### `ui/actions-static.js`

Строк 120.

**Вывозит:** _ничего_

**Ввозит:**

- из `./actions.js`: `registerActions`
- из `../data/save.js`: `downloadData`, `saveToFolder`
- из `../filters/beyond-filter.js`: `resetBeyondFilter`
- из `../metrics/scope.js`: `handleMetricsScopeChange`
- из `../modal/core.js`: `closeUniversalModal`
- из `../modal/profile-concept.js`: `closeConceptProfileModal`
- из `../modal/profile-philosopher.js`: `closePhilosopherProfileModal`
- из `../paths/path-descriptions.js`: `closePathDescriptionsModal`
- из `../paths/path-ui.js`: `findAndShowPath`
- из `../render/grouping.js`: `toggleGrouping`
- из `../render/metric-visualization.js`: `resetNodeSizes`
- из `../render/simulation.js`: `centerGraph`, `resetSimulation`, `toggleSimulationFreeze`
- из `../stats/modal.js`: `closeStatsModal`, `handleStatsParameterChange`, `openStatsModal`, `switchStatsView`
- из `./about.js`: `closeAboutModal`, `onAboutBackdropClick`, `openAboutModal`
- из `./export.js`: `exportToPNG`, `exportToSVG`
- из `./legend.js`: `changeFilterMode`, `deselectAllPhilosophers`, `deselectAllRelations`, `deselectAllRubrics`, `deselectAllTraditions`, `selectAllPhilosophers`, `selectAllRelations`, `selectAllRubrics`, `selectAllTraditions`, `togglePanel`, `toggleSection`, `toggleUniformLinkWidth`
- из `./search-legend.js`: `clearLegendSearch`, `handleLegendSearch`, `setSearchKind`, `toggleLegendSearch`
- из `./search-link.js`: `handleLegendLinkSearch`
- из `./search-philosopher.js`: `clearLegendPhilSearch`, `handleLegendPhilSearch`
- из `../widgets/custom-select.js`: `filterCustomSelect`, `showCustomSelectDropdown`

**Содержит:** _только исполняемый код_

### `ui/actions.js`

Строк 27.

**Вывозит:** `actionNames`, `registerActions`, `runAction`

**Ввозит:** _ничего_

**Содержит:** `actionNames`, `registerActions`, `runAction`

### `ui/delegation.js`

Строк 70.

**Вывозит:** `installDelegation`

**Ввозит:**

- из `./actions.js`: `runAction`

**Содержит:** `installDelegation`

### `ui/export.js`

Строк 124.

**Вывозит:** `exportToPNG`, `exportToSVG`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/link-facts.js`: `isSymmetricLink`
- из `../core/long-task.js`: `showTemporaryMessage`
- из `../core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `../render/draw-link.js`: `linkDrawAlpha`, `linkDrawWidth`, `linkVisualState`
- из `../render/geometry.js`: `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`
- из `../render/render-state.js`: `hasNodeClass`, `nodeLabelDy`, `nodeRadius`
- из `../render/scene.js`: `DRAW_ORDER`, `renderScene`
- из `../state/render.js`: `selectedNodes`

**Содержит:** `exportToPNG`, `exportToSVG`

### `ui/hint.js`

Строк 34.

**Вывозит:** `коробПодсказки`, `показатьПодсказку`, `скрытьПодсказку`

**Ввозит:**

- из `../core/ns.js`: `S`

**Содержит:** `S.tooltipTimeout`

### `ui/legend.js`

Строк 337.

**Вывозит:** `addTradition`, `changeFilterMode`, `deselectAllPhilosophers`, `deselectAllRelations`, `deselectAllRubrics`, `deselectAllTraditions`, `initFilters`, `onlyTradition`, `restorePanelStates`, `selectAllPhilosophers`, `selectAllRelations`, `selectAllRubrics`, `selectAllTraditions`, `syncPhilosopherCheckboxes`, `togglePanel`, `togglePhilosopher`, `toggleRelation`, `toggleRubric`, `toggleSection`, `toggleTradition`, `toggleUniformLinkWidth`, `traditionMembers`, `updateFilterStats`, `updatePhilosopherDimming`, `отметитьВыбранныхВЛегенде`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/relation-types.js`: `relationHint`
- из `../filters/filters.js`: `applyFilters`, `philosopherPassesTraditions`
- из `../render/d3-layer.js`: `updateArrows`
- из `../state/filters.js`: `выбранныеФилософы`

**Содержит:** `addTradition`, `changeFilterMode`, `deselectAllPhilosophers`, `deselectAllRelations`, `deselectAllRubrics`, `deselectAllTraditions`, `initFilters`, `onlyTradition`, `restorePanelStates`, `selectAllPhilosophers`, `selectAllRelations`, `selectAllRubrics`, `selectAllTraditions`, `syncPhilosopherCheckboxes`, `togglePanel`, `togglePhilosopher`, `toggleRelation`, `toggleRubric`, `toggleSection`, `toggleTradition`, `toggleUniformLinkWidth`, `traditionMembers`, `updateFilterStats`, `updatePhilosopherDimming`

### `ui/search-legend.js`

Строк 117.

**Вывозит:** `clearLegendSearch`, `handleLegendSearch`, `selectSearchResult`, `setSearchKind`, `toggleLegendSearch`, `видПоиска`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/long-task.js`: `showTemporaryMessage`
- из `../core/search.js`: `displaySearchResults`, `отобратьКонцепции`
- из `../core/visibility.js`: `isNodeVisible`
- из `../filters/beyond-filter.js`: `обновитьЗаметкуОбОтборе`
- из `../filters/filters.js`: `applyFiltersImmediate`
- из `../modal/entry.js`: `showDetailModal`
- из `../modal/search.js`: `clearModalSearch`
- из `../render/selection.js`: `highlightConnected`
- из `../state/filters.js`: `pinnedVisibleNodes`, `показанныеВопрекиОтбору`
- из `../state/render.js`: `selectedNodes`
- из `./search-link.js`: `очиститьПоискСвязи`
- из `./search-philosopher.js`: `clearLegendPhilSearch`

**Содержит:** `clearLegendSearch`, `handleLegendSearch`, `selectSearchResult`, `setSearchKind`, `toggleLegendSearch`

### `ui/search-link.js`

Строк 113.

**Вывозит:** `handleLegendLinkSearch`, `highlightLinkOnGraph`, `pickLinkEnd`, `очиститьПоискСвязи`, `поискСвязи`, `показатьНайденныеСвязи`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/search.js`: `внутренностиСтроки`, `отобратьКонцепции`, `пустойСписок`
- из `../render/loop.js`: `requestDraw`
- из `../render/selection.js`: `highlightCombined`
- из `../state/render.js`: `selectedEdges`, `selectedNodes`

**Содержит:** `handleLegendLinkSearch`, `highlightLinkOnGraph`, `pickLinkEnd`

### `ui/search-philosopher.js`

Строк 97.

**Вывозит:** `clearLegendPhilSearch`, `clearPhilosopherSearch`, `handleLegendPhilSearch`, `handlePhilosopherSearch`, `pickPhilosopherFromSearch`, `selectPhilosopherResult`, `отобратьФилософов`

**Ввозит:**

- из `../core/ns.js`: `DATA`
- из `../core/search.js`: `пустойСписок`
- из `../modal/core.js`: `openUniversalModal`
- из `../render/selection.js`: `highlightPhilosopherOnGraph`

**Содержит:** `clearLegendPhilSearch`, `clearPhilosopherSearch`, `handleLegendPhilSearch`, `handlePhilosopherSearch`, `pickPhilosopherFromSearch`, `selectPhilosopherResult`

### `util/color.js`

Строк 23.

**Вывозит:** `getContrastColor`

**Ввозит:** _ничего_

**Содержит:** `getContrastColor`

### `util/html.js`

Строк 9.

**Вывозит:** `escapeAttr`

**Ввозит:** _ничего_

**Содержит:** `escapeAttr`

### `util/philosopher-label.js`

Строк 38.

**Вывозит:** `_ambiguousLabels`, `ambiguousLabels`, `formatBirthYear`, `labelWithAuthor`, `philosopherBirth`, `philosopherYears`, `sortPhilosophersByBirth`

**Ввозит:**

- из `../core/ns.js`: `DATA`

**Содержит:** `_ambiguousLabels`, `ambiguousLabels`, `formatBirthYear`, `labelWithAuthor`, `philosopherBirth`, `philosopherYears`, `sortPhilosophersByBirth`

### `util/ru.js`

Строк 49.

**Вывозит:** `conjugateVerb`, `declinePhilosopher`, `pluralRu`

**Ввозит:** _ничего_

**Содержит:** `conjugateVerb`, `declinePhilosopher`, `pluralRu`

### `widgets/custom-select.js`

Строк 87.

**Вывозит:** `filterCustomSelect`, `initializeCustomSelects`, `populateCustomSelect`, `selectCustomOption`, `showCustomSelectDropdown`

**Ввозит:**

- из `../core/ns.js`: `DATA`, `S`
- из `../core/events.js`: `известить`
- из `../core/search.js`: `внутренностиСтроки`, `отобратьКонцепции`, `пустойСписок`

**Содержит:** `filterCustomSelect`, `initializeCustomSelects`, `populateCustomSelect`, `selectCustomOption`, `showCustomSelectDropdown`