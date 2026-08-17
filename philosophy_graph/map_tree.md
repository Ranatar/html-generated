# Карта модульного дерева `philosophy_graph`

Составлена **по собранному дереву**, а не по одностраничному исходнику:
112 модулей, 17285 строк, 618 объявлений,
624 вывозов, 587 рёбер ввоза. Составлено 2026-08-17 12:39:21.

Зачем отдельно от карты глобальных сущностей. Та описывает единый файл — 746
сущностей в одной области видимости — и нужна разбивке: по ней считается
раскладка. Но у модульного дерева есть свойства, которых у единого файла нет
вовсе: кто у кого что ввозит, какие имена вывезены впустую, насколько плотно
модули лезут в общие пространства, есть ли круги. И эта карта переживёт
одностраничную версию, когда её отпустят.

## Что держит дом

Входящая степень — из скольких модулей ввозят этот.

| Модуль | Ввозят из него |
|---|---|
| `core/ns.js` | 89 |
| `core/link-facts.js` | 19 |
| `core/events.js` | 16 |
| `metrics/link-indexes.js` | 13 |
| `render/selection.js` | 13 |
| `state/render.js` | 12 |
| `modal/core.js` | 11 |
| `render/d3-layer.js` | 10 |
| `render/loop.js` | 10 |
| `core/long-task.js` | 9 |
| `core/visibility.js` | 9 |
| `stats/results.js` | 9 |

## Самые востребованные имена

| Имя | В скольких модулях ввозится |
|---|---|
| `S` | 70 |
| `DATA` | 57 |
| `MET` | 19 |
| `известить` | 15 |
| `initializePhilosophyMetrics` | 12 |
| `isReflexiveLink` | 9 |
| `isSymmetricLink` | 9 |
| `requestDraw` | 9 |
| `selectedNodes` | 9 |
| `gfxNode` | 8 |
| `isNodeVisible` | 8 |
| `openUniversalModal` | 7 |
| `ModalContext` | 7 |
| `getContrastColor` | 7 |
| `selectedEdges` | 6 |

## Общие пространства имён

| Пространство | Полей | Самое востребованное поле | В скольких модулях |
|---|---|---|---|
| `DATA` | 16 | `nodes` | 43 |
| `S` | 79 | `_concepts` | 15 |
| `MET` | 33 | `revolutionaryIndex` | 7 |
| `VIEWS` | 6 | `generateConceptViewContent` | 1 |

## Круги в графе ввозов

Кругов нет.


## Вывоз впустую и мёртвые сущности

Различать обязательно. **Лишний вывоз** — имя вывезено, никем не ввозится,
но внутри своего модуля работает: разбивка вывозит все собственные имена
подряд, поэтому таких много (190), и это шум в списке вывоза,
а не мёртвый код. **Мёртвая сущность** — имя не помянуто нигде: ни снаружи, ни
внутри своего модуля. Таких сейчас **0**.

Отдельно считаются имена, которые держатся только приборами приёмки
(1): в дереве они выглядят мёртвыми, а на деле
их ввозят измерительные программы.

| Имя | Модуль |
|---|---|
| `actionNames` | `ui/actions.js` |

## Модули

| Модуль | Строк | Объявлений | Вывозит | Ввозит из | Пространства |
|---|---|---|---|---|---|
| `boot-defs.js` | 24 | 1 | 1 | 6 | — |
| `boot.js` | 639 | 0 | 1 | 39 | DATA:11, S:35, MET:19 |
| `core/base-cells.js` | 17 | 0 | 0 | 1 | S:7 |
| `core/events.js` | 43 | 4 | 4 | 0 | — |
| `core/graph-index.js` | 69 | 0 | 1 | 1 | DATA:14 |
| `core/link-facts.js` | 41 | 6 | 6 | 1 | DATA:1, S:3 |
| `core/long-task.js` | 120 | 3 | 3 | 0 | — |
| `core/ns.js` | 11 | 0 | 4 | 0 | — |
| `core/ready.js` | 15 | 0 | 2 | 0 | — |
| `core/relation-types.js` | 58 | 6 | 6 | 1 | DATA:2 |
| `core/search.js` | 71 | 5 | 5 | 2 | DATA:3 |
| `core/session.js` | 14 | 4 | 4 | 0 | — |
| `core/time.js` | 13 | 2 | 2 | 0 | — |
| `core/visibility.js` | 13 | 2 | 2 | 1 | S:2 |
| `data/load.js` | 16 | 1 | 1 | 1 | — |
| `data/mutate.js` | 73 | 3 | 3 | 3 | DATA:11, S:1 |
| `data/save.js` | 63 | 9 | 9 | 1 | DATA:6 |
| `dead.js` | 78 | 4 | 4 | 3 | DATA:1, S:5, MET:1 |
| `filters/beyond-filter.js` | 21 | 2 | 2 | 2 | — |
| `filters/chains.js` | 272 | 6 | 6 | 3 | DATA:3, S:2 |
| `filters/filters.js` | 453 | 14 | 14 | 12 | DATA:4, S:8 |
| `graph/click-actions.js` | 201 | 8 | 8 | 8 | S:1 |
| `graph/graph-data.js` | 109 | 10 | 10 | 6 | DATA:4, S:7 |
| `graph/graph-selection.js` | 54 | 3 | 3 | 2 | S:2 |
| `main.js` | 118 | 0 | 0 | 107 | — |
| `metrics/by-link-type.js` | 206 | 10 | 10 | 3 | S:4, MET:6 |
| `metrics/concept-dynamics.js` | 224 | 8 | 8 | 2 | S:4, MET:4 |
| `metrics/descriptions.js` | 478 | 2 | 2 | 3 | S:3 |
| `metrics/format.js` | 32 | 4 | 4 | 2 | S:3 |
| `metrics/generativity.js` | 78 | 8 | 8 | 1 | S:5 |
| `metrics/graph-cache.js` | 117 | 3 | 3 | 3 | S:3 |
| `metrics/link-indexes.js` | 120 | 4 | 4 | 4 | DATA:3, S:8 |
| `metrics/network.js` | 869 | 25 | 25 | 2 | DATA:1, S:8, MET:9 |
| `metrics/philosopher.js` | 308 | 13 | 13 | 2 | S:5, MET:9 |
| `metrics/philosophical.js` | 1037 | 23 | 23 | 3 | DATA:1, S:6, MET:10 |
| `metrics/rankings.js` | 141 | 5 | 5 | 3 | S:4, MET:9 |
| `metrics/scope-reset.js` | 63 | 3 | 3 | 11 | S:2 |
| `metrics/scope-select.js` | 98 | 6 | 6 | 1 | DATA:2, S:5 |
| `metrics/scope.js` | 134 | 7 | 7 | 7 | DATA:2, S:6 |
| `metrics/similarity-concepts.js` | 243 | 15 | 15 | 3 | S:4, MET:17 |
| `metrics/similarity-philosophers.js` | 160 | 11 | 11 | 2 | S:3, MET:3 |
| `metrics/tension-cache.js` | 13 | 1 | 1 | 1 | S:2 |
| `modal/assembly.js` | 54 | 3 | 3 | 1 | — |
| `modal/auth.js` | 162 | 10 | 10 | 4 | — |
| `modal/concept-view.js` | 335 | 1 | 1 | 5 | DATA:6, VIEWS:1 |
| `modal/connection-edit.js` | 282 | 9 | 9 | 10 | DATA:3, VIEWS:1 |
| `modal/connection-view.js` | 413 | 11 | 11 | 8 | DATA:6, VIEWS:1 |
| `modal/context.js` | 11 | 1 | 1 | 0 | — |
| `modal/core.js` | 154 | 7 | 7 | 9 | S:1 |
| `modal/descriptions.js` | 162 | 10 | 10 | 0 | — |
| `modal/dirty.js` | 110 | 5 | 5 | 3 | DATA:3 |
| `modal/edit-forms.js` | 286 | 2 | 2 | 9 | DATA:7, VIEWS:2 |
| `modal/edit-rights.js` | 53 | 3 | 3 | 3 | — |
| `modal/entry.js` | 120 | 12 | 12 | 7 | DATA:4, S:4 |
| `modal/integrity.js` | 252 | 10 | 10 | 5 | DATA:5 |
| `modal/persist.js` | 359 | 10 | 10 | 9 | DATA:9, S:1 |
| `modal/philosopher-view.js` | 619 | 4 | 4 | 10 | DATA:9, VIEWS:1 |
| `modal/profile-concept.js` | 180 | 8 | 8 | 6 | DATA:5, S:3, MET:19 |
| `modal/profile-philosopher.js` | 119 | 2 | 2 | 6 | DATA:6, S:3, MET:3 |
| `modal/search.js` | 32 | 2 | 2 | 1 | — |
| `paths/analysis.js` | 72 | 2 | 2 | 5 | DATA:5 |
| `paths/chronology.js` | 141 | 7 | 7 | 2 | DATA:3, S:1 |
| `paths/path-descriptions.js` | 167 | 4 | 4 | 6 | DATA:3, S:1 |
| `paths/path-ui.js` | 396 | 8 | 8 | 7 | DATA:5, S:7 |
| `paths/shortest-path.js` | 208 | 4 | 4 | 4 | DATA:2, S:4 |
| `render/canvas-core.js` | 20 | 2 | 2 | 2 | S:6 |
| `render/d3-layer.js` | 94 | 10 | 10 | 3 | DATA:2, S:3 |
| `render/draw-link.js` | 97 | 6 | 6 | 4 | S:2 |
| `render/geometry.js` | 93 | 6 | 6 | 1 | DATA:1, S:3 |
| `render/grouping.js` | 44 | 3 | 3 | 2 | S:3 |
| `render/interactions.js` | 90 | 5 | 5 | 10 | S:3 |
| `render/loop.js` | 20 | 4 | 4 | 0 | — |
| `render/metric-visualization.js` | 370 | 10 | 10 | 4 | DATA:4, S:3 |
| `render/picking.js` | 77 | 6 | 6 | 6 | DATA:2, S:6 |
| `render/render-state.js` | 17 | 6 | 6 | 1 | S:1 |
| `render/scene.js` | 241 | 10 | 10 | 10 | DATA:4, S:8 |
| `render/selection.js` | 257 | 8 | 8 | 7 | DATA:2, S:4 |
| `render/similarity-overlay.js` | 111 | 6 | 6 | 6 | DATA:3, S:1 |
| `render/simulation.js` | 80 | 8 | 8 | 4 | DATA:1, S:4 |
| `state/edit.js` | 12 | 1 | 1 | 0 | — |
| `state/filters.js` | 13 | 3 | 3 | 1 | S:1 |
| `state/metrics-scope.js` | 13 | 0 | 0 | 1 | S:5 |
| `state/paths.js` | 15 | 0 | 0 | 1 | S:6 |
| `state/render.js` | 23 | 2 | 2 | 1 | S:7 |
| `state/stats.js` | 33 | 0 | 0 | 1 | S:15 |
| `stats/coverage.js` | 39 | 3 | 3 | 1 | S:3 |
| `stats/modal.js` | 217 | 6 | 6 | 15 | DATA:2, S:9 |
| `stats/results.js` | 378 | 10 | 10 | 4 | S:3 |
| `stats/run.js` | 128 | 4 | 4 | 3 | S:1, MET:6 |
| `stats/views/advanced.js` | 269 | 10 | 10 | 3 | DATA:3, MET:10 |
| `stats/views/comparison.js` | 425 | 10 | 10 | 8 | DATA:4, S:11 |
| `stats/views/network.js` | 222 | 9 | 9 | 3 | DATA:2, S:2, MET:1 |
| `stats/views/philosopher.js` | 170 | 4 | 4 | 5 | DATA:3, MET:3 |
| `stats/views/philosophical.js` | 448 | 12 | 12 | 6 | DATA:3, S:2, MET:10 |
| `stats/views/rankings.js` | 141 | 2 | 2 | 5 | DATA:2, S:1 |
| `ui/about.js` | 101 | 4 | 4 | 1 | DATA:6 |
| `ui/actions-byname.js` | 20 | 2 | 0 | 2 | — |
| `ui/actions-dyn.js` | 148 | 0 | 0 | 31 | DATA:1, S:9 |
| `ui/actions-static.js` | 120 | 0 | 0 | 20 | — |
| `ui/actions.js` | 27 | 1 | 3 | 0 | — |
| `ui/delegation.js` | 70 | 3 | 1 | 1 | — |
| `ui/export.js` | 124 | 2 | 2 | 9 | DATA:4, S:3 |
| `ui/hint.js` | 34 | 3 | 3 | 1 | S:1 |
| `ui/legend.js` | 337 | 25 | 25 | 5 | DATA:7, S:9 |
| `ui/search-legend.js` | 117 | 6 | 6 | 13 | DATA:1, S:4 |
| `ui/search-link.js` | 113 | 6 | 6 | 5 | DATA:3, S:4 |
| `ui/search-philosopher.js` | 97 | 7 | 7 | 4 | DATA:3 |
| `util/color.js` | 23 | 1 | 1 | 0 | — |
| `util/html.js` | 9 | 1 | 1 | 0 | — |
| `util/philosopher-label.js` | 38 | 7 | 7 | 1 | DATA:2 |
| `util/ru.js` | 49 | 3 | 3 | 0 | — |
| `widgets/custom-select.js` | 87 | 5 | 5 | 3 | DATA:1, S:4 |

## Состав модулей

Что в модуле ОБЪЯВЛЕНО. В JSON это лежало с самого начала (поле `свои`),
но в читаемый вид не выводилось — упущение, а не замысел: состав и есть
самое нужное, когда ищешь, где живёт сущность.


### `boot-defs.js` — 24 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `closeAllModals` | function | 13 | да |

### `core/events.js` — 43 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `известить` | function | 10 | да |
| `подписаться` | function | 8 | да |
| `СОБЫТИЯ_ШИНЫ` | const | 1 | да |
| `подписчикиШины` | const | 1 | да |

### `core/link-facts.js` — 41 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `reflexiveLinkOf` | function | 8 | да |
| `isSymmetricLink` | function | 6 | да |
| `isReflexiveLink` | function | 5 | да |
| `isTypologicalLink` | function | 4 | да |
| `otherPhilosopher` | function | 4 | да |
| `sumWeight` | function | 3 | да |

### `core/long-task.js` — 120 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showTemporaryMessage` | function | 29 | да |
| `LoadingIndicator` | const | 1 | да |
| `CHAIN_SEARCH` | const | 1 | да |

### `core/relation-types.js` — 58 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `relationHint` | function | 11 | да |
| `RELATION_HINTS` | const | 1 | да |
| `LAYER_NAMES` | const | 1 | да |
| `WEIGHT_WORDS` | const | 1 | да |
| `WEIGHT_OPTIONS` | const | 1 | да |
| `CONN_WEIGHT_WORDS` | const | 1 | да |

### `core/search.js` — 71 строк, объявлений 5

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `displaySearchResults` | function | 23 | да |
| `отобратьКонцепции` | function | 20 | да |
| `внутренностиСтроки` | function | 11 | да |
| `пустойСписок` | function | 3 | да |
| `searchNodes` | function | 3 | да |

### `core/session.js` — 14 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `canEdit` | function | 3 | да |
| `AUTH_ADMIN` | const | 1 | да |
| `authAccounts` | const | 1 | да |
| `authSession` | let | 1 | да |

### `core/time.js` — 13 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `CHRONOLOGY_MODES` | const | 1 | да |
| `MATURITY_AGE` | const | 1 | да |

### `core/visibility.js` — 13 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `isNodeVisible` | function | 1 | да |
| `isLinkVisible` | function | 1 | да |

### `data/load.js` — 16 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `FILES` | const | 1 | — |

### `data/mutate.js` — 73 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `rebuildDerivedIndexes` | function | 36 | да |
| `afterDataChange` | function | 23 | да |
| `rebuildPhilosopherTraditions` | function | 4 | да |

### `data/save.js` — 63 строк, объявлений 9

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `saveToFolder` | async function | 23 | да |
| `deliverFile` | function | 11 | да |
| `downloadData` | function | 6 | да |
| `collectData` | function | 3 | да |
| `DATA_SETS` | const | 1 | да |
| `hasUnsavedEdits` | let | 1 | да |
| `markDirty` | function | 1 | да |
| `hasUnsaved` | function | 1 | да |
| `dataFolder` | let | 1 | да |

### `dead.js` — 78 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `findConnectedComponents` | function | 34 | да |
| `tensionScales` | function | 23 | да |
| `toggleSimilarityKind` | function | 5 | да |
| `TENSION_WEIGHTS` | const | 1 | да |

### `filters/beyond-filter.js` — 21 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `обновитьЗаметкуОбОтборе` | function | 7 | да |
| `resetBeyondFilter` | function | 6 | да |

### `filters/chains.js` — 272 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `processBFS` | function | 125 | да |
| `findChainsThroughAllPhilosophers` | async function | 45 | да |
| `findUniquePhilosopherChains` | async function | 44 | да |
| `buildAdjacencyGraph` | function | 35 | да |
| `confirmLongChainSearch` | function | 9 | да |
| `CHAIN_WARN_THRESHOLD` | const | 1 | да |

### `filters/filters.js` — 453 строк, объявлений 14

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `handleUniqueChainsMode` | async function | 65 | да |
| `handleChainsMode` | async function | 59 | да |
| `applyBasicFilter` | function | 52 | да |
| `applyFiltersImmediate` | function | 21 | да |
| `cleanupInvisibleSelections` | function | 14 | да |
| `debounce` | function | 11 | да |
| `applyChainVisibility` | function | 7 | да |
| `refreshMetricsIfScoped` | function | 7 | да |
| `philosopherPassesTraditions` | function | 5 | да |
| `linkPassesTraditions` | function | 5 | да |
| `philTraditionsSelected` | function | 4 | да |
| `FilterModes` | const | 1 | да |
| `debouncedApplyFilters` | const | 1 | да |
| `applyFilters` | function | 1 | да |

### `graph/click-actions.js` — 201 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `handleNodeClick` | function | 116 | да |
| `handleLinkSelect` | function | 32 | да |
| `handleLinkClick` | function | 28 | да |
| `clickTimer` | let | 1 | да |
| `clickCount` | let | 1 | да |
| `lastClickedNode` | let | 1 | да |
| `linkClickTimer` | let | 1 | да |
| `linkClickCount` | let | 1 | да |

### `graph/graph-data.js` — 109 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `forgetNode` | function | 18 | да |
| `addNodeToGraph` | function | 15 | да |
| `addLinkToGraph` | function | 11 | да |
| `findConnection` | function | 9 | да |
| `forgetLink` | function | 8 | да |
| `connectionsBetween` | function | 8 | да |
| `getConceptConnections` | function | 7 | да |
| `traditionsOfPhilosopher` | function | 5 | да |
| `updateLinkOnGraph` | function | 5 | да |
| `updateNodeOnGraph` | function | 3 | да |

### `graph/graph-selection.js` — 54 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `selectConceptOnGraph` | function | 28 | да |
| `cancelGraphSelection` | function | 11 | да |
| `handleConceptSelection` | function | 6 | да |

### `metrics/by-link-type.js` — 206 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `invalidateTraditionBridgingCache` | function | 3 | да |
| `invalidateInstrumentalIndexCache` | function | 3 | да |
| `invalidateAbstractionIndexCache` | function | 3 | да |
| `invalidateDeductiveIndexCache` | function | 3 | да |
| `instrumentalIndexCache` | let | 1 | да |
| `BRIDGING_MIN_EXTERNAL` | const | 1 | да |
| `BRIDGING_WEIGHT_REF` | const | 1 | да |
| `traditionBridgingCache` | let | 1 | да |
| `abstractionIndexCache` | let | 1 | да |
| `deductiveIndexCache` | let | 1 | да |

### `metrics/concept-dynamics.js` — 224 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `invalidateTransformationIndexCache` | function | 3 | да |
| `invalidateConceptualFertilityIndexCache` | function | 3 | да |
| `invalidateConceptualComplexityIndexCache` | function | 3 | да |
| `invalidateConceptualContinuityIndexCache` | function | 3 | да |
| `transformationIndexCache` | let | 1 | да |
| `conceptualFertilityIndexCache` | let | 1 | да |
| `conceptualComplexityIndexCache` | let | 1 | да |
| `conceptualContinuityIndexCache` | let | 1 | да |

### `metrics/descriptions.js` — 478 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `getMetricDescription` | function | 12 | да |
| `metricDescriptions` | const | 1 | да |

### `metrics/format.js` — 32 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `conceptDegreeForNorm` | function | 8 | да |
| `applyMetricMode` | function | 5 | да |
| `toggleMetricValueMode` | function | 5 | да |
| `normalizeMetricValue` | function | 4 | да |

### `metrics/generativity.js` — 78 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generativityScores` | function | 42 | да |
| `linkInInfluenceScope` | function | 8 | да |
| `sameTraditionPhil` | function | 6 | да |
| `generativity` | function | 3 | да |
| `invalidateGenerativityCache` | function | 3 | да |
| `GENERATIVITY_DAMPING` | const | 1 | да |
| `GENERATIVITY_ITERATIONS` | const | 1 | да |
| `_generativityCacheByScope` | let | 1 | да |

### `metrics/graph-cache.js` — 117 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `buildGlobalGraphCache` | function | 105 | да |
| `graphCache` | let | 1 | да |
| `invalidateGraphCache` | function | 1 | да |

### `metrics/link-indexes.js` — 120 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `initializePhilosophyMetrics` | function | 68 | да |
| `buildOutgoingLinks` | function | 17 | да |
| `buildIncomingLinks` | function | 14 | да |
| `initializeMetricsData` | function | 9 | да |

### `metrics/network.js` — 869 строк, объявлений 25

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `calculateBetweennessAsync` | async function | 152 | да |
| `dijkstraFromSource` | function | 47 | да |
| `bfsFromSource` | function | 41 | да |
| `medianNodeDegree` | function | 12 | да |
| `nodeDegreeOf` | function | 7 | да |
| `invalidateBetweennessCache` | function | 4 | да |
| `invalidatePageRankCache` | function | 4 | да |
| `invalidateClosenessCache` | function | 4 | да |
| `invalidateEigenvectorCache` | function | 4 | да |
| `invalidateClusteringCache` | function | 3 | да |
| `invalidateWeightedClusteringCache` | function | 3 | да |
| `invalidateLocalCohesionCache` | function | 3 | да |
| `invalidateRichClubCache` | function | 3 | да |
| `betweennessCache` | let | 1 | да |
| `betweennessCalculating` | let | 1 | да |
| `pageRankCache` | let | 1 | да |
| `pageRankCalculating` | let | 1 | да |
| `closenessCache` | let | 1 | да |
| `closenessCalculating` | let | 1 | да |
| `clusteringCache` | let | 1 | да |
| `weightedClusteringCache` | let | 1 | да |
| `localCohesionCache` | let | 1 | да |
| `richClubCache` | let | 1 | да |
| `eigenvectorCache` | let | 1 | да |
| `eigenvectorCalculating` | let | 1 | да |

### `metrics/philosopher.js` — 308 строк, объявлений 13

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `philosopherProfile` | function | 42 | да |
| `invalidatePhilosopherProfileCache` | function | 3 | да |
| `invalidatePhilosopherSystematicIndexCache` | function | 3 | да |
| `invalidatePhilosopherHistoricalReachIndexCache` | function | 3 | да |
| `invalidatePhilosopherInterdisciplinaryIndexCache` | function | 3 | да |
| `invalidateTemporalInfluencePatternCache` | function | 3 | да |
| `CONSTRUCTIVE_TYPES` | const | 1 | да |
| `POLEMICAL_TYPES` | const | 1 | да |
| `philosopherProfileCache` | let | 1 | да |
| `philosopherSystematicIndexCache` | let | 1 | да |
| `philosopherHistoricalReachIndexCache` | let | 1 | да |
| `philosopherInterdisciplinaryIndexCache` | let | 1 | да |
| `temporalInfluencePatternCache` | let | 1 | да |

### `metrics/philosophical.js` — 1037 строк, объявлений 23

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `invalidateProblemGenerationIndexCache` | function | 3 | да |
| `invalidateCriticalPowerIndexCache` | function | 3 | да |
| `invalidateRevolutionaryIndexCache` | function | 3 | да |
| `invalidateParadigmShiftIndexCache` | function | 3 | да |
| `invalidateInfluenceIndexCache` | function | 3 | да |
| `invalidateFoundationalIndexCache` | function | 3 | да |
| `invalidateSyntheticIndexCache` | function | 3 | да |
| `invalidateDialogicalIndexCache` | function | 3 | да |
| `invalidateInternalCoherenceIndexCache` | function | 3 | да |
| `invalidateTensionIndexCache` | function | 3 | да |
| `problemGenerationIndexCache` | let | 1 | да |
| `criticalPowerIndexCache` | let | 1 | да |
| `revolutionaryIndexCache` | let | 1 | да |
| `paradigmShiftIndexCache` | let | 1 | да |
| `influenceIndexCache` | let | 1 | да |
| `foundationalIndexCache` | let | 1 | да |
| `SYSTEMATIC_TYPES` | const | 1 | да |
| `DISRUPTIVE_TYPES` | const | 1 | да |
| `syntheticIndexCache` | let | 1 | да |
| `dialogicalIndexCache` | let | 1 | да |
| `internalCoherenceIndexCache` | let | 1 | да |
| `tensionIndexCache` | let | 1 | да |
| `INFLUENCE_SCOPE_LABELS` | const | 1 | да |

### `metrics/rankings.js` — 141 строк, объявлений 5

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generatePhilosopherRankings` | function | 89 | да |
| `generateRankings` | function | 31 | да |
| `invalidateGenerateRankingsCache` | function | 3 | да |
| `invalidateGeneratePhilosopherRankingsCache` | function | 3 | да |
| `generatePhilosopherRankingsCache` | let | 1 | да |

### `metrics/scope-reset.js` — 63 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `invalidateAllMetricsCaches` | function | 30 | да |
| `invalidateEverythingForScope` | function | 14 | да |
| `invalidateMetricCoverageCache` | function | 1 | да |

### `metrics/scope-select.js` — 98 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `transformForScope` | function | 9 | да |
| `effectiveScopeFlags` | function | 8 | да |
| `metricsLinks` | function | 1 | да |
| `metricsNodes` | function | 1 | да |
| `METRIC_FLAGS` | const | 1 | да |
| `VIEW_METRIC` | const | 1 | да |

### `metrics/scope.js` — 134 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `updateScopeToggles` | function | 33 | да |
| `applyMetricsScope` | function | 30 | да |
| `installMetricScopeWrappers` | function | 18 | да |
| `metricsScopeCounts` | function | 10 | да |
| `metricScopeFactor` | function | 9 | да |
| `handleMetricsScopeChange` | function | 8 | да |
| `updateMetricsScopeHint` | function | 6 | да |

### `metrics/similarity-concepts.js` — 243 строк, объявлений 15

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `allConceptPairsAsync` | async function | 55 | да |
| `nearestConcepts` | function | 51 | да |
| `similarityData` | function | 48 | да |
| `structuralSimilarity` | function | 22 | да |
| `neighborSets` | function | 12 | да |
| `profileSimilarity` | function | 9 | да |
| `typeProfileOf` | function | 7 | да |
| `invalidateSimilarityCache` | function | 6 | да |
| `profileIsMeaningful` | function | 3 | да |
| `allConceptPairs` | function | 3 | да |
| `_simCache` | let | 1 | да |
| `_pairCache` | let | 1 | да |
| `_pairCalculating` | let | 1 | да |
| `PAIRS_CHUNK_ROWS` | const | 1 | да |
| `_neighborCache` | let | 1 | да |

### `metrics/similarity-philosophers.js` — 160 строк, объявлений 11

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `philosopherSimilarityData` | function | 84 | да |
| `philosopherSimilarity` | function | 20 | да |
| `nearestPhilosophers` | function | 12 | да |
| `rubricUnionSize` | function | 5 | да |
| `cosineOf` | function | 5 | да |
| `SIM_METRIC_LABELS` | const | 1 | да |
| `PHIL_SIM_MIN_CONCEPTS` | const | 1 | да |
| `PHIL_SIM_MIN_RUBRIC_UNION` | const | 1 | да |
| `_philSimCache` | let | 1 | да |
| `invalidatePhilosopherSimilarityCache` | function | 1 | да |
| `PHIL_SIM_LABELS` | const | 1 | да |

### `metrics/tension-cache.js` — 13 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `invalidateTensionScales` | function | 3 | да |

### `modal/assembly.js` — 54 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `modalContentFor` | function | 18 | да |
| `modalActions` | function | 15 | да |
| `modalEntityExists` | function | 13 | да |

### `modal/auth.js` — 162 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `submitAuth` | function | 42 | да |
| `openAuthModal` | function | 29 | да |
| `authLogout` | function | 24 | да |
| `showAuthNotice` | function | 14 | да |
| `authNoticeAdmin` | function | 13 | да |
| `closeAuthModal` | function | 10 | да |
| `authNoticeMember` | function | 6 | да |
| `authError` | function | 4 | да |
| `authModalKind` | let | 1 | да |
| `authModalEl` | function | 1 | да |

### `modal/concept-view.js` — 335 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `similarConceptsBlock` | function | 58 | да |

### `modal/connection-edit.js` — 282 строк, объявлений 9

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `onConnTypeChange` | function | 37 | да |
| `handleConnectionEditSearch` | function | 29 | да |
| `updateConnEditPairNote` | function | 25 | да |
| `swapConnectionConcepts` | function | 20 | да |
| `selectConnectionEditConcept` | function | 18 | да |
| `setupConnectionEditSearchHandlers` | function | 13 | да |
| `connEditSelectedBlock` | function | 9 | да |
| `createNewConnectionForConcept` | function | 7 | да |
| `createNewConceptForPhilosopher` | function | 3 | да |

### `modal/connection-view.js` — 413 строк, объявлений 11

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generateConnectionVisualization` | function | 75 | да |
| `connectionArrowSvg` | function | 60 | да |
| `handleConnectionViewSearch` | function | 42 | да |
| `selectConnectionViewConcept` | function | 33 | да |
| `стрелкаСвязи` | function | 18 | да |
| `updateConnectionVisualization` | function | 18 | да |
| `initConnectionSearchFields` | function | 18 | да |
| `conceptPlate` | function | 16 | да |
| `connectionTraditionNote` | function | 13 | да |
| `toggleConnectionSearchSection` | function | 8 | да |
| `conceptCircle` | function | 6 | да |

### `modal/context.js` — 11 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `ModalContext` | const | 1 | да |

### `modal/core.js` — 154 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `openUniversalModal` | function | 64 | да |
| `closeUniversalModal` | function | 27 | да |
| `toggleModalMode` | function | 17 | да |
| `pushModalState` | function | 14 | да |
| `popModalState` | function | 10 | да |
| `modalStack` | const | 1 | да |
| `MODAL_STACK_MAX` | const | 1 | да |

### `modal/descriptions.js` — 162 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `toggleAllConnectionDescriptions` | function | 37 | да |
| `toggleAllPhilosopherConceptDescriptions` | function | 32 | да |
| `toggleAllPhilosopherConnectionDescriptions` | function | 31 | да |
| `toggleSubsection` | function | 14 | да |
| `toggleConnectionDescription` | function | 12 | да |
| `togglePhilosopherConceptDescription` | function | 12 | да |
| `toggleAllRoot` | function | 7 | да |
| `allDescriptionsExpanded` | let | 1 | да |
| `allPhilosopherConceptDescriptionsExpanded` | let | 1 | да |
| `allPhilosopherConnectionDescriptionsExpanded` | let | 1 | да |

### `modal/dirty.js` — 110 строк, объявлений 5

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `hasConnectionChanges` | function | 27 | да |
| `hasPhilosopherChanges` | function | 22 | да |
| `hasUnsavedChanges` | function | 20 | да |
| `hasConceptChanges` | function | 19 | да |
| `hasFilledFields` | function | 10 | да |

### `modal/edit-forms.js` — 286 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `updatePhilColorSample` | function | 17 | да |
| `syncPhilColorFromPicker` | function | 6 | да |

### `modal/edit-rights.js` — 53 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderAuthControls` | function | 18 | да |
| `refreshEditHints` | function | 15 | да |
| `refreshOpenModalToolbar` | function | 9 | да |

### `modal/entry.js` — 120 строк, объявлений 12

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showAllConcepts` | function | 28 | да |
| `gotoNodeFromModal` | function | 23 | да |
| `getIsolatedConceptsAfterDeletion` | function | 15 | да |
| `openEditConceptModal` | function | 6 | да |
| `openEditConnectionModal` | function | 6 | да |
| `openConceptById` | function | 4 | да |
| `openEditPhilosopherModal` | function | 4 | да |
| `isConceptIsolated` | function | 3 | да |
| `showDetailModal` | function | 3 | да |
| `showPhilosopherDetailModal` | function | 3 | да |
| `closeDetailModal` | function | 1 | да |
| `closePhilosopherDetailModal` | function | 1 | да |

### `modal/integrity.js` — 252 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `connectionIntegrityWarnings` | function | 138 | да |
| `groundingCyclePath` | function | 37 | да |
| `conceptIntegrityWarnings` | function | 18 | да |
| `philosopherIntegrityWarnings` | function | 16 | да |
| `activityOverlap` | function | 12 | да |
| `relationIndexOf` | function | 4 | да |
| `GROUNDING_TYPES` | const | 1 | да |
| `nConcepts` | const | 1 | да |
| `nLinks` | const | 1 | да |
| `labelOf` | const | 1 | да |

### `modal/persist.js` — 359 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `savePhilosopherData` | function | 82 | да |
| `saveConnectionData` | function | 71 | да |
| `saveConceptData` | function | 57 | да |
| `deleteConnection` | function | 45 | да |
| `deletePhilosopher` | function | 37 | да |
| `deleteConcept` | function | 19 | да |
| `removeLinkEverywhere` | function | 9 | да |
| `removeConceptEverywhere` | function | 8 | да |
| `confirmWarnings` | function | 5 | да |
| `generateId` | function | 3 | да |

### `modal/philosopher-view.js` — 619 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `makeLegendsEditable` | function | 71 | да |
| `традицииФилософаБлок` | function | 37 | да |
| `similarPhilosophersBlock` | function | 31 | да |
| `DATA_traditions_of` | function | 4 | да |

### `modal/profile-concept.js` — 180 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showConceptProfileModal` | function | 74 | да |
| `metricPartsText` | function | 16 | да |
| `metricRank` | function | 15 | да |
| `metricPercentile` | function | 11 | да |
| `conceptDegreesDetailed` | function | 11 | да |
| `closeConceptProfileModal` | function | 8 | да |
| `toggleProfileOrder` | function | 4 | да |
| `PROFILE_METRICS` | const | 1 | да |

### `modal/profile-philosopher.js` — 119 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showPhilosopherProfileModal` | function | 98 | да |
| `closePhilosopherProfileModal` | function | 8 | да |

### `modal/search.js` — 32 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `clearModalSearch` | function | 16 | да |
| `handleModalSearch` | function | 9 | да |

### `paths/analysis.js` — 72 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `analyzePath` | function | 40 | да |
| `analyzePathTraditions` | function | 21 | да |

### `paths/chronology.js` — 141 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `isChronologicallyValid` | function | 55 | да |
| `strictChronologyCheck` | function | 50 | да |
| `шагБезРазрыва` | function | 8 | да |
| `летУзла` | function | 6 | да |
| `moderateChronologyCheck` | function | 4 | да |
| `looseChronologyCheck` | function | 4 | да |
| `DATA_nodes_find` | function | 1 | да |

### `paths/path-descriptions.js` — 167 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showPathDescriptionsModal` | function | 124 | да |
| `togglePathNodesDescriptions` | function | 18 | да |
| `closePathDescriptionsModal` | function | 9 | да |
| `nodesDescriptionsVisible` | let | 1 | да |

### `paths/path-ui.js` — 396 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `findAndShowPath` | function | 264 | да |
| `handlePathArrowHover` | function | 39 | да |
| `resolvePathLinkList` | function | 26 | да |
| `initPathFinder` | function | 23 | да |
| `highlightPath` | function | 15 | да |
| `clearPathHighlight` | function | 6 | да |
| `arrowHoverTimer` | let | 1 | да |
| `ARROW_HOVER_DELAY` | const | 1 | да |

### `paths/shortest-path.js` — 208 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `findShortestPathWeighted` | function | 111 | да |
| `findShortestPathUnweighted` | function | 66 | да |
| `findShortestPath` | function | 10 | да |
| `pathLinkAllowed` | function | 9 | да |

### `render/canvas-core.js` — 20 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `resizeCanvas` | function | 11 | да |
| `PICK_LINK_WIDTH` | const | 1 | да |

### `render/d3-layer.js` — 94 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `subSelection` | function | 23 | да |
| `makeClassed` | function | 15 | да |
| `dragstarted` | function | 8 | да |
| `dragended` | function | 5 | да |
| `nodeHandlers` | const | 1 | да |
| `linkHandlers` | const | 1 | да |
| `gfxNode` | const | 1 | да |
| `gfxLink` | const | 1 | да |
| `gfxLinkAll` | const | 1 | да |
| `updateArrows` | function | 1 | да |

### `render/draw-link.js` — 97 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `drawSelfLoop` | function | 27 | да |
| `linkDrawAlpha` | function | 19 | да |
| `fillArrow` | function | 13 | да |
| `linkDrawWidth` | function | 8 | да |
| `strokeLink` | function | 8 | да |
| `linkVisualState` | function | 7 | да |

### `render/geometry.js` — 93 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `arrowPointsStart` | function | 28 | да |
| `arrowPoints` | function | 26 | да |
| `arcParams` | function | 15 | да |
| `linkHasTwoHeads` | function | 5 | да |
| `linkStrokeWidth` | function | 4 | да |
| `linkHoverStrokeWidth` | function | 4 | да |

### `render/grouping.js` — 44 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `toggleGrouping` | function | 33 | да |
| `groupPositions` | const | 1 | да |
| `cols` | const | 1 | да |

### `render/interactions.js` — 90 строк, объявлений 5

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `dispatchMove` | function | 30 | да |
| `dispatchClick` | function | 26 | да |
| `initGraphEventHandlers` | function | 13 | да |
| `lastHoverNode` | let | 1 | да |
| `lastHoverLink` | let | 1 | да |

### `render/loop.js` — 20 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `requestDraw` | function | 9 | да |
| `drawScheduled` | let | 1 | да |
| `рисовальщик` | let | 1 | да |
| `назначитьРисовальщика` | function | 1 | да |

### `render/metric-visualization.js` — 370 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `toggleMetricVisualization` | function | 132 | да |
| `visualizeMetricBySize` | function | 110 | да |
| `updateVisualizationControlSection` | function | 40 | да |
| `resetNodeSizes` | function | 39 | да |
| `updateVisualizationButtonText` | function | 16 | да |
| `saveOriginalRadii` | function | 11 | да |
| `isVisualizingBySize` | let | 1 | да |
| `currentVisualizedMetric` | let | 1 | да |
| `originalRadii` | let | 1 | да |
| `originalTextDy` | let | 1 | да |

### `render/picking.js` — 77 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `repaintPickCanvas` | function | 30 | да |
| `pickLink` | function | 12 | да |
| `pickNode` | function | 9 | да |
| `rebuildQuadtree` | function | 5 | да |
| `toGraph` | function | 4 | да |
| `quadtree` | let | 1 | да |

### `render/render-state.js` — 17 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `LABEL_HIDE_BELOW` | const | 1 | да |
| `LABEL_ALL_ABOVE` | const | 1 | да |
| `nodeRadius` | function | 1 | да |
| `nodeLabelDy` | function | 1 | да |
| `hasNodeClass` | function | 1 | да |
| `hasLinkClass` | function | 1 | да |

### `render/scene.js` — 241 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderScene` | function | 145 | да |
| `stepRadiusAnimation` | function | 13 | да |
| `updateGraphData` | function | 13 | да |
| `graphIsCovered` | function | 10 | да |
| `draw` | function | 10 | да |
| `needsContinuousAnimation` | function | 9 | да |
| `ensureAnimLoop` | function | 9 | да |
| `startRadiusAnimation` | function | 6 | да |
| `animLoopRunning` | let | 1 | да |
| `DRAW_ORDER` | const | 1 | да |

### `render/selection.js` — 257 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `highlightCombined` | function | 98 | да |
| `highlightPhilosopherOnGraph` | function | 56 | да |
| `highlightConnected` | function | 34 | да |
| `highlightNodeById` | function | 18 | да |
| `resetHighlight` | function | 11 | да |
| `isNodeConnectedToSelectedEdges` | function | 8 | да |
| `isEdgeConnectedToSelectedNodes` | function | 8 | да |
| `isEdgeConnectedToNode` | function | 5 | да |

### `render/similarity-overlay.js` — 111 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `showSimilarityOverlay` | function | 44 | да |
| `updateSimilarityLegend` | function | 35 | да |
| `similarityColor` | function | 9 | да |
| `clearSimilarityOverlay` | function | 5 | да |
| `SIMILARITY_KEEP_QUANTILE` | const | 1 | да |
| `SIMILARITY_ARCS` | const | 1 | да |

### `render/simulation.js` — 80 строк, объявлений 8

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `unfreezeSimulation` | function | 17 | да |
| `updateFreezeButton` | function | 12 | да |
| `toggleSimulationFreeze` | function | 11 | да |
| `resetSimulation` | function | 9 | да |
| `centerGraph` | function | 9 | да |
| `freezeSimulation` | function | 4 | да |
| `maxTicks` | const | 1 | да |
| `simLockedByHand` | let | 1 | да |

### `state/edit.js` — 12 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `editMode` | let | 1 | да |

### `state/filters.js` — 13 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `выбранныеФилософы` | const | 1 | да |
| `показанныеВопрекиОтбору` | const | 1 | да |
| `pinnedVisibleNodes` | const | 1 | да |

### `state/render.js` — 23 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `selectedNodes` | let | 1 | да |
| `selectedEdges` | let | 1 | да |

### `stats/coverage.js` — 39 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `metricCoverage` | function | 16 | да |
| `generateMetricCoverageBlock` | function | 12 | да |
| `METRIC_COVERAGE_WARN` | const | 1 | да |

### `stats/modal.js` — 217 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `loadStatsContent` | function | 68 | да |
| `openStatsModal` | function | 38 | да |
| `handleStatsParameterChange` | function | 31 | да |
| `closeStatsModal` | function | 30 | да |
| `switchStatsView` | function | 15 | да |
| `updateActiveNavItem` | function | 10 | да |

### `stats/results.js` — 378 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generateMetricResults` | function | 136 | да |
| `genericDetailsHTML` | function | 55 | да |
| `generateMetricDescriptionBlock` | function | 39 | да |
| `toggleMetricDetails` | function | 21 | да |
| `generateCalculateButton` | function | 18 | да |
| `applyMetricLayout` | function | 13 | да |
| `rankKeep` | function | 6 | да |
| `toggleMetricLayout` | function | 5 | да |
| `lastZeroCount` | let | 1 | да |
| `METRIC_FIELD_LABELS` | const | 1 | да |

### `stats/run.js` — 128 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `runSingleMetric` | async function | 73 | да |
| `calculateMetricFromModal` | async function | 29 | да |
| `showProgress` | function | 11 | да |
| `hideProgress` | function | 4 | да |

### `stats/views/advanced.js` — 269 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generateTemporalInfluenceContent` | function | 53 | да |
| `generateBridgingContent` | function | 28 | да |
| `generateTransformationContent` | function | 23 | да |
| `generateFertilityContent` | function | 23 | да |
| `generateComplexityContent` | function | 23 | да |
| `generateContinuityContent` | function | 23 | да |
| `generateAbstractionContent` | function | 21 | да |
| `generateGenerativeContent` | function | 19 | да |
| `generateInstrumentalContent` | function | 19 | да |
| `generateDeductiveContent` | function | 19 | да |

### `stats/views/comparison.js` — 425 строк, объявлений 10

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `renderClosestPairs` | async function | 96 | да |
| `renderPhilosopherComparison` | function | 63 | да |
| `renderComparison` | function | 62 | да |
| `generateComparisonContent` | function | 48 | да |
| `generateClosestPairsContent` | function | 40 | да |
| `renderPhilosopherPairs` | function | 33 | да |
| `generatePhilosopherComparisonContent` | function | 32 | да |
| `generatePhilosopherPairsContent` | function | 21 | да |
| `openPhilosopherPair` | function | 4 | да |
| `openPairInComparison` | function | 4 | да |

### `stats/views/network.js` — 222 строк, объявлений 9

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generateDegreeContent` | function | 64 | да |
| `generateOverviewContent` | function | 36 | да |
| `generatePageRankContent` | function | 15 | да |
| `generateBetweennessContent` | function | 15 | да |
| `generateClosenessContent` | function | 15 | да |
| `generateEigenvectorContent` | function | 15 | да |
| `generateWeightedClusteringContent` | function | 15 | да |
| `generateLocalCohesionContent` | function | 15 | да |
| `generateRichClubContent` | function | 15 | да |

### `stats/views/philosopher.js` — 170 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generatePhilosopherProfileContent` | function | 42 | да |
| `generatePhilosopherInterdisciplinaryContent` | function | 40 | да |
| `generatePhilosopherSystematicContent` | function | 38 | да |
| `generatePhilosopherReachContent` | function | 37 | да |

### `stats/views/philosophical.js` — 448 строк, объявлений 12

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generateTensionContent` | function | 195 | да |
| `generateProblemGenerationContent` | function | 23 | да |
| `generateCriticalPowerContent` | function | 23 | да |
| `generateRevolutionaryContent` | function | 23 | да |
| `generateParadigmShiftContent` | function | 23 | да |
| `generateInfluenceContent` | function | 23 | да |
| `generateFoundationalContent` | function | 23 | да |
| `generateSyntheticContent` | function | 23 | да |
| `generateDialogicalContent` | function | 23 | да |
| `generateCoherenceContent` | function | 23 | да |
| `influenceScopeSwitcher` | function | 14 | да |
| `setInfluenceScope` | function | 10 | да |

### `stats/views/rankings.js` — 141 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `generateConceptRankingsContent` | function | 77 | да |
| `generatePhilosopherRankingsContent` | function | 51 | да |

### `ui/about.js` — 101 строк, объявлений 4

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `собратьОПроекте` | function | 81 | да |
| `openAboutModal` | function | 5 | да |
| `closeAboutModal` | function | 3 | да |
| `onAboutBackdropClick` | function | 3 | да |

### `ui/actions-byname.js` — 20 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `вызватьПоИмени` | function | 5 | — |
| `ПОИМЕНИ` | const | 1 | — |

### `ui/actions.js` — 27 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `ДЕЙСТВИЯ` | const | 1 | — |

### `ui/delegation.js` — 70 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `сПодменойСобытия` | function | 16 | — |
| `СОБЫТИЯ` | const | 1 | — |
| `ГРАНИЦЫ` | const | 1 | — |

### `ui/export.js` — 124 строк, объявлений 2

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `exportToSVG` | function | 74 | да |
| `exportToPNG` | function | 35 | да |

### `ui/hint.js` — 34 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `показатьПодсказку` | function | 20 | да |
| `скрытьПодсказку` | function | 3 | да |
| `коробПодсказки` | let | 1 | да |

### `ui/legend.js` — 337 строк, объявлений 25

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `initFilters` | function | 79 | да |
| `toggleSection` | function | 42 | да |
| `togglePanel` | function | 20 | да |
| `restorePanelStates` | function | 14 | да |
| `updatePhilosopherDimming` | function | 12 | да |
| `updateFilterStats` | function | 11 | да |
| `togglePhilosopher` | function | 8 | да |
| `selectAllTraditions` | function | 8 | да |
| `deselectAllTraditions` | function | 8 | да |
| `toggleRelation` | function | 8 | да |
| `toggleRubric` | function | 8 | да |
| `toggleUniformLinkWidth` | function | 8 | да |
| `selectAllPhilosophers` | function | 7 | да |
| `deselectAllPhilosophers` | function | 7 | да |
| `selectAllRelations` | function | 7 | да |
| `deselectAllRelations` | function | 7 | да |
| `selectAllRubrics` | function | 7 | да |
| `deselectAllRubrics` | function | 7 | да |
| `отметитьВыбранныхВЛегенде` | function | 6 | да |
| `syncPhilosopherCheckboxes` | function | 6 | да |
| `toggleTradition` | function | 5 | да |
| `onlyTradition` | function | 5 | да |
| `addTradition` | function | 5 | да |
| `traditionMembers` | function | 4 | да |
| `changeFilterMode` | function | 4 | да |

### `ui/search-legend.js` — 117 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `selectSearchResult` | function | 35 | да |
| `setSearchKind` | function | 16 | да |
| `clearLegendSearch` | function | 16 | да |
| `toggleLegendSearch` | function | 14 | да |
| `handleLegendSearch` | function | 12 | да |
| `видПоиска` | let | 1 | да |

### `ui/search-link.js` — 113 строк, объявлений 6

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `показатьНайденныеСвязи` | function | 28 | да |
| `handleLegendLinkSearch` | function | 24 | да |
| `highlightLinkOnGraph` | function | 23 | да |
| `очиститьПоискСвязи` | function | 12 | да |
| `pickLinkEnd` | function | 10 | да |
| `поискСвязи` | const | 1 | да |

### `ui/search-philosopher.js` — 97 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `handlePhilosopherSearch` | function | 26 | да |
| `handleLegendPhilSearch` | function | 23 | да |
| `отобратьФилософов` | function | 11 | да |
| `clearPhilosopherSearch` | function | 8 | да |
| `clearLegendPhilSearch` | function | 6 | да |
| `pickPhilosopherFromSearch` | function | 4 | да |
| `selectPhilosopherResult` | function | 4 | да |

### `util/color.js` — 23 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `getContrastColor` | function | 18 | да |

### `util/html.js` — 9 строк, объявлений 1

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `escapeAttr` | function | 4 | да |

### `util/philosopher-label.js` — 38 строк, объявлений 7

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `ambiguousLabels` | function | 7 | да |
| `philosopherBirth` | function | 4 | да |
| `philosopherYears` | function | 4 | да |
| `labelWithAuthor` | function | 4 | да |
| `formatBirthYear` | function | 3 | да |
| `sortPhilosophersByBirth` | function | 3 | да |
| `_ambiguousLabels` | let | 1 | да |

### `util/ru.js` — 49 строк, объявлений 3

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `declinePhilosopher` | function | 26 | да |
| `conjugateVerb` | function | 9 | да |
| `pluralRu` | function | 7 | да |

### `widgets/custom-select.js` — 87 строк, объявлений 5

| Имя | Вид | Строк | Вывозится |
|---|---|---|---|
| `selectCustomOption` | function | 24 | да |
| `initializeCustomSelects` | function | 16 | да |
| `populateCustomSelect` | function | 14 | да |
| `filterCustomSelect` | function | 11 | да |
| `showCustomSelectDropdown` | function | 10 | да |

## Ввоз по модулям


### `boot-defs.js`

- из `modal/core.js`: `closeUniversalModal`
- из `modal/entry.js`: `closeDetailModal`, `closePhilosopherDetailModal`
- из `modal/profile-concept.js`: `closeConceptProfileModal`
- из `modal/profile-philosopher.js`: `closePhilosopherProfileModal`
- из `paths/path-descriptions.js`: `closePathDescriptionsModal`
- из `ui/about.js`: `closeAboutModal`

Чаще всего поминает: `closeUniversalModal`×4, `closeDetailModal`×4, `closePhilosopherDetailModal`×4, `closeConceptProfileModal`×4, `closePhilosopherProfileModal`×4

### `boot.js`

- из `core/ns.js`: `DATA`, `S`, `MET`
- из `data/load.js`: `loadData`
- из `core/graph-index.js`: `buildIndexes`
- из `core/ready.js`: `onReady`, `onLoad`
- из `boot-defs.js`: `closeAllModals`
- из `core/events.js`: `известить`, `подписаться`
- из `core/link-facts.js`: `isReflexiveLink`, `isSymmetricLink`
- из `core/time.js`: `CHRONOLOGY_MODES`
- из `data/save.js`: `hasUnsavedEdits`
- из `filters/beyond-filter.js`: `resetBeyondFilter`
- из `filters/filters.js`: `applyFiltersImmediate`
- из `graph/graph-selection.js`: `cancelGraphSelection`
- из `metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `modal/connection-edit.js`: `selectConnectionEditConcept`
- из `modal/connection-view.js`: `selectConnectionViewConcept`
- из `modal/core.js`: `modalStack`, `openUniversalModal`, `popModalState`
- из `modal/edit-rights.js`: `renderAuthControls`
- из `modal/entry.js`: `closeDetailModal`, `openEditConceptModal`, `openEditConnectionModal`, `showDetailModal`
- из `modal/philosopher-view.js`: `makeLegendsEditable`
- из `paths/path-ui.js`: `initPathFinder`
- из `render/canvas-core.js`: `resizeCanvas`
- из `render/d3-layer.js`: `dragended`, `dragstarted`, `gfxLink`, `gfxNode`
- из `render/grouping.js`: `cols`, `groupPositions`
- из `render/interactions.js`: `initGraphEventHandlers`
- из `render/loop.js`: `requestDraw`, `назначитьРисовальщика`
- из `render/metric-visualization.js`: `saveOriginalRadii`
- из `render/picking.js`: `pickNode`, `rebuildQuadtree`
- из `render/scene.js`: `draw`, `updateGraphData`
- из `render/similarity-overlay.js`: `clearSimilarityOverlay`
- из `render/simulation.js`: `maxTicks`
- из `state/filters.js`: `показанныеВопрекиОтбору`
- из `state/render.js`: `selectedEdges`
- из `stats/modal.js`: `closeStatsModal`, `loadStatsContent`, `switchStatsView`
- из `stats/views/comparison.js`: `renderComparison`
- из `ui/hint.js`: `показатьПодсказку`, `скрытьПодсказку`
- из `ui/legend.js`: `initFilters`, `restorePanelStates`, `updateFilterStats`, `updatePhilosopherDimming`, `отметитьВыбранныхВЛегенде`
- из `util/philosopher-label.js`: `labelWithAuthor`
- из `widgets/custom-select.js`: `initializeCustomSelects`

Чаще всего поминает: `S`×104, `DATA`×25, `подписаться`×24, `MET`×21, `cols`×9

### `core/base-cells.js`

- из `core/ns.js`: `S`

Чаще всего поминает: `S`×9

### `core/graph-index.js`

- из `core/ns.js`: `DATA`

Чаще всего поминает: `DATA`×25

### `core/link-facts.js`

- из `core/ns.js`: `DATA`, `S`

Чаще всего поминает: `S`×5, `DATA`×4

### `core/relation-types.js`

- из `core/ns.js`: `DATA`

Чаще всего поминает: `DATA`×4

### `core/search.js`

- из `core/ns.js`: `DATA`
- из `core/visibility.js`: `isNodeVisible`

Чаще всего поминает: `DATA`×7, `isNodeVisible`×3

### `core/visibility.js`

- из `core/ns.js`: `S`

Чаще всего поминает: `S`×8

### `data/load.js`

- из `core/ns.js`: `DATA`

Чаще всего поминает: `DATA`×4

### `data/mutate.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/events.js`: `известить`
- из `data/save.js`: `markDirty`

Чаще всего поминает: `DATA`×30, `S`×4, `известить`×3, `markDirty`×3

### `data/save.js`

- из `core/ns.js`: `DATA`

Чаще всего поминает: `DATA`×8

### `dead.js`

- из `core/ns.js`: `DATA`, `MET`, `S`
- из `metrics/graph-cache.js`: `buildGlobalGraphCache`
- из `render/similarity-overlay.js`: `showSimilarityOverlay`

Чаще всего поминает: `S`×14, `DATA`×3, `MET`×3, `buildGlobalGraphCache`×3, `showSimilarityOverlay`×3

### `filters/beyond-filter.js`

- из `filters/filters.js`: `applyFiltersImmediate`
- из `state/filters.js`: `pinnedVisibleNodes`, `показанныеВопрекиОтбору`

Чаще всего поминает: `показанныеВопрекиОтбору`×6, `applyFiltersImmediate`×3, `pinnedVisibleNodes`×3

### `filters/chains.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/link-facts.js`: `isSymmetricLink`
- из `core/long-task.js`: `CHAIN_SEARCH`

Чаще всего поминает: `CHAIN_SEARCH`×9, `DATA`×7, `S`×5, `isSymmetricLink`×3

### `filters/filters.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/events.js`: `известить`
- из `core/long-task.js`: `CHAIN_SEARCH`, `LoadingIndicator`, `showTemporaryMessage`
- из `core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `filters/chains.js`: `confirmLongChainSearch`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`
- из `metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `metrics/scope.js`: `updateMetricsScopeHint`
- из `render/d3-layer.js`: `gfxLinkAll`, `gfxNode`
- из `render/selection.js`: `highlightConnected`, `resetHighlight`
- из `state/filters.js`: `pinnedVisibleNodes`, `показанныеВопрекиОтбору`
- из `state/render.js`: `selectedNodes`

Чаще всего поминает: `S`×64, `DATA`×22, `известить`×11, `showTemporaryMessage`×11, `CHAIN_SEARCH`×10

### `graph/click-actions.js`

- из `core/ns.js`: `S`
- из `core/events.js`: `известить`
- из `core/session.js`: `canEdit`
- из `graph/graph-selection.js`: `handleConceptSelection`
- из `render/d3-layer.js`: `gfxNode`
- из `render/selection.js`: `highlightCombined`, `isEdgeConnectedToSelectedNodes`, `isNodeConnectedToSelectedEdges`
- из `state/edit.js`: `editMode`
- из `state/render.js`: `selectedEdges`, `selectedNodes`

Чаще всего поминает: `selectedEdges`×17, `selectedNodes`×17, `editMode`×10, `известить`×8, `gfxNode`×7

### `graph/graph-data.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/events.js`: `известить`
- из `render/loop.js`: `requestDraw`
- из `render/scene.js`: `updateGraphData`
- из `state/filters.js`: `pinnedVisibleNodes`
- из `state/render.js`: `selectedEdges`, `selectedNodes`

Чаще всего поминает: `S`×22, `DATA`×9, `известить`×4, `requestDraw`×4, `updateGraphData`×4

### `graph/graph-selection.js`

- из `core/ns.js`: `S`
- из `core/events.js`: `известить`

Чаще всего поминает: `S`×7, `известить`×3

### `main.js`

- из `boot-defs.js`: _ради побочного действия_
- из `core/base-cells.js`: _ради побочного действия_
- из `core/events.js`: _ради побочного действия_
- из `core/graph-index.js`: _ради побочного действия_
- из `core/link-facts.js`: _ради побочного действия_
- из `core/long-task.js`: _ради побочного действия_
- из `core/relation-types.js`: _ради побочного действия_
- из `core/search.js`: _ради побочного действия_
- из `core/session.js`: _ради побочного действия_
- из `core/time.js`: _ради побочного действия_
- из `core/visibility.js`: _ради побочного действия_
- из `data/mutate.js`: _ради побочного действия_
- из `data/save.js`: _ради побочного действия_
- из `dead.js`: _ради побочного действия_
- из `filters/beyond-filter.js`: _ради побочного действия_
- из `filters/chains.js`: _ради побочного действия_
- из `filters/filters.js`: _ради побочного действия_
- из `graph/click-actions.js`: _ради побочного действия_
- из `graph/graph-data.js`: _ради побочного действия_
- из `graph/graph-selection.js`: _ради побочного действия_
- из `metrics/by-link-type.js`: _ради побочного действия_
- из `metrics/concept-dynamics.js`: _ради побочного действия_
- из `metrics/descriptions.js`: _ради побочного действия_
- из `metrics/format.js`: _ради побочного действия_
- из `metrics/generativity.js`: _ради побочного действия_
- из `metrics/graph-cache.js`: _ради побочного действия_
- из `metrics/link-indexes.js`: _ради побочного действия_
- из `metrics/network.js`: _ради побочного действия_
- из `metrics/philosopher.js`: _ради побочного действия_
- из `metrics/philosophical.js`: _ради побочного действия_
- из `metrics/rankings.js`: _ради побочного действия_
- из `metrics/scope-reset.js`: _ради побочного действия_
- из `metrics/scope-select.js`: _ради побочного действия_
- из `metrics/scope.js`: _ради побочного действия_
- из `metrics/similarity-concepts.js`: _ради побочного действия_
- из `metrics/similarity-philosophers.js`: _ради побочного действия_
- из `metrics/tension-cache.js`: _ради побочного действия_
- из `modal/assembly.js`: _ради побочного действия_
- из `modal/auth.js`: _ради побочного действия_
- из `modal/concept-view.js`: _ради побочного действия_
- из `modal/connection-edit.js`: _ради побочного действия_
- из `modal/connection-view.js`: _ради побочного действия_
- из `modal/context.js`: _ради побочного действия_
- из `modal/core.js`: _ради побочного действия_
- из `modal/descriptions.js`: _ради побочного действия_
- из `modal/dirty.js`: _ради побочного действия_
- из `modal/edit-forms.js`: _ради побочного действия_
- из `modal/edit-rights.js`: _ради побочного действия_
- из `modal/entry.js`: _ради побочного действия_
- из `modal/integrity.js`: _ради побочного действия_
- из `modal/persist.js`: _ради побочного действия_
- из `modal/philosopher-view.js`: _ради побочного действия_
- из `modal/profile-concept.js`: _ради побочного действия_
- из `modal/profile-philosopher.js`: _ради побочного действия_
- из `modal/search.js`: _ради побочного действия_
- из `paths/analysis.js`: _ради побочного действия_
- из `paths/chronology.js`: _ради побочного действия_
- из `paths/path-descriptions.js`: _ради побочного действия_
- из `paths/path-ui.js`: _ради побочного действия_
- из `paths/shortest-path.js`: _ради побочного действия_
- из `render/canvas-core.js`: _ради побочного действия_
- из `render/d3-layer.js`: _ради побочного действия_
- из `render/draw-link.js`: _ради побочного действия_
- из `render/geometry.js`: _ради побочного действия_
- из `render/grouping.js`: _ради побочного действия_
- из `render/interactions.js`: _ради побочного действия_
- из `render/loop.js`: _ради побочного действия_
- из `render/metric-visualization.js`: _ради побочного действия_
- из `render/picking.js`: _ради побочного действия_
- из `render/render-state.js`: _ради побочного действия_
- из `render/scene.js`: _ради побочного действия_
- из `render/selection.js`: _ради побочного действия_
- из `render/similarity-overlay.js`: _ради побочного действия_
- из `render/simulation.js`: _ради побочного действия_
- из `state/edit.js`: _ради побочного действия_
- из `state/filters.js`: _ради побочного действия_
- из `state/metrics-scope.js`: _ради побочного действия_
- из `state/paths.js`: _ради побочного действия_
- из `state/render.js`: _ради побочного действия_
- из `state/stats.js`: _ради побочного действия_
- из `stats/coverage.js`: _ради побочного действия_
- из `stats/modal.js`: _ради побочного действия_
- из `stats/results.js`: _ради побочного действия_
- из `stats/run.js`: _ради побочного действия_
- из `stats/views/advanced.js`: _ради побочного действия_
- из `stats/views/comparison.js`: _ради побочного действия_
- из `stats/views/network.js`: _ради побочного действия_
- из `stats/views/philosopher.js`: _ради побочного действия_
- из `stats/views/philosophical.js`: _ради побочного действия_
- из `stats/views/rankings.js`: _ради побочного действия_
- из `ui/about.js`: _ради побочного действия_
- из `ui/export.js`: _ради побочного действия_
- из `ui/hint.js`: _ради побочного действия_
- из `ui/legend.js`: _ради побочного действия_
- из `ui/search-legend.js`: _ради побочного действия_
- из `ui/search-link.js`: _ради побочного действия_
- из `ui/search-philosopher.js`: _ради побочного действия_
- из `util/color.js`: _ради побочного действия_
- из `util/html.js`: _ради побочного действия_
- из `util/philosopher-label.js`: _ради побочного действия_
- из `util/ru.js`: _ради побочного действия_
- из `widgets/custom-select.js`: _ради побочного действия_
- из `ui/actions-byname.js`: _ради побочного действия_
- из `ui/actions-static.js`: _ради побочного действия_
- из `ui/delegation.js`: `installDelegation`
- из `ui/actions-dyn.js`: _ради побочного действия_
- из `boot.js`: `boot`

Чаще всего поминает: `installDelegation`×3, `boot`×3

### `metrics/by-link-type.js`

- из `core/ns.js`: `MET`, `S`
- из `core/link-facts.js`: `sumWeight`
- из `metrics/generativity.js`: `generativity`

Чаще всего поминает: `S`×22, `MET`×10, `sumWeight`×6, `generativity`×3

### `metrics/concept-dynamics.js`

- из `core/ns.js`: `MET`, `S`
- из `core/link-facts.js`: `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`

Чаще всего поминает: `S`×20, `sumWeight`×8, `MET`×6, `otherPhilosopher`×3, `reflexiveLinkOf`×3

### `metrics/descriptions.js`

- из `core/ns.js`: `S`
- из `metrics/by-link-type.js`: `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF`
- из `metrics/similarity-philosophers.js`: `PHIL_SIM_MIN_RUBRIC_UNION`

Чаще всего поминает: `S`×45, `BRIDGING_MIN_EXTERNAL`×4, `BRIDGING_WEIGHT_REF`×4, `PHIL_SIM_MIN_RUBRIC_UNION`×3

### `metrics/format.js`

- из `core/ns.js`: `S`
- из `core/events.js`: `известить`

Чаще всего поминает: `S`×7, `известить`×3

### `metrics/generativity.js`

- из `core/ns.js`: `S`

Чаще всего поминает: `S`×12

### `metrics/graph-cache.js`

- из `core/ns.js`: `S`
- из `core/link-facts.js`: `isSymmetricLink`
- из `metrics/scope-select.js`: `metricsLinks`, `metricsNodes`

Чаще всего поминает: `S`×6, `isSymmetricLink`×3, `metricsLinks`×3, `metricsNodes`×3

### `metrics/link-indexes.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/link-facts.js`: `isReflexiveLink`, `isSymmetricLink`
- из `core/visibility.js`: `isNodeVisible`
- из `metrics/scope-select.js`: `effectiveScopeFlags`, `transformForScope`

Чаще всего поминает: `S`×17, `DATA`×7, `isReflexiveLink`×4, `isSymmetricLink`×4, `effectiveScopeFlags`×4

### `metrics/network.js`

- из `core/ns.js`: `DATA`, `MET`, `S`
- из `metrics/graph-cache.js`: `buildGlobalGraphCache`

Чаще всего поминает: `S`×39, `DATA`×30, `MET`×13, `buildGlobalGraphCache`×12

### `metrics/philosopher.js`

- из `core/ns.js`: `MET`, `S`
- из `metrics/philosophical.js`: `DISRUPTIVE_TYPES`, `SYSTEMATIC_TYPES`

Чаще всего поминает: `S`×19, `MET`×11, `DISRUPTIVE_TYPES`×3, `SYSTEMATIC_TYPES`×3

### `metrics/philosophical.js`

- из `core/ns.js`: `DATA`, `MET`, `S`
- из `core/link-facts.js`: `isSymmetricLink`, `otherPhilosopher`, `reflexiveLinkOf`, `sumWeight`
- из `metrics/generativity.js`: `generativity`, `linkInInfluenceScope`

Чаще всего поминает: `S`×67, `sumWeight`×15, `MET`×12, `reflexiveLinkOf`×4, `linkInInfluenceScope`×4

### `metrics/rankings.js`

- из `core/ns.js`: `MET`, `S`
- из `metrics/format.js`: `applyMetricMode`
- из `metrics/philosopher.js`: `philosopherProfile`

Чаще всего поминает: `S`×12, `MET`×11, `applyMetricMode`×3, `philosopherProfile`×3

### `metrics/scope-reset.js`

- из `core/ns.js`: `S`
- из `metrics/by-link-type.js`: `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache`, `invalidateInstrumentalIndexCache`, `invalidateTraditionBridgingCache`
- из `metrics/concept-dynamics.js`: `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateTransformationIndexCache`
- из `metrics/generativity.js`: `invalidateGenerativityCache`
- из `metrics/graph-cache.js`: `invalidateGraphCache`
- из `metrics/network.js`: `invalidateBetweennessCache`, `invalidateClosenessCache`, `invalidateClusteringCache`, `invalidateEigenvectorCache`, `invalidateLocalCohesionCache`, `invalidatePageRankCache`, `invalidateRichClubCache`, `invalidateWeightedClusteringCache`
- из `metrics/philosopher.js`: `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidateTemporalInfluencePatternCache`
- из `metrics/philosophical.js`: `invalidateCriticalPowerIndexCache`, `invalidateDialogicalIndexCache`, `invalidateFoundationalIndexCache`, `invalidateInfluenceIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateProblemGenerationIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateSyntheticIndexCache`, `invalidateTensionIndexCache`
- из `metrics/rankings.js`: `invalidateGeneratePhilosopherRankingsCache`, `invalidateGenerateRankingsCache`
- из `metrics/similarity-concepts.js`: `invalidateSimilarityCache`
- из `metrics/tension-cache.js`: `invalidateTensionScales`

Чаще всего поминает: `S`×4, `invalidateGraphCache`×4, `invalidateBetweennessCache`×4, `invalidateClosenessCache`×4, `invalidateClusteringCache`×4

### `metrics/scope-select.js`

- из `core/ns.js`: `DATA`, `S`

Чаще всего поминает: `S`×9, `DATA`×4

### `metrics/scope.js`

- из `core/ns.js`: `DATA`, `MET`, `S`
- из `core/events.js`: `известить`
- из `core/visibility.js`: `isNodeVisible`
- из `metrics/graph-cache.js`: `invalidateGraphCache`
- из `metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `metrics/scope-select.js`: `METRIC_FLAGS`, `VIEW_METRIC`, `effectiveScopeFlags`, `transformForScope`

Чаще всего поминает: `S`×18, `DATA`×8, `METRIC_FLAGS`×5, `MET`×4, `initializePhilosophyMetrics`×4

### `metrics/similarity-concepts.js`

- из `core/ns.js`: `MET`, `S`
- из `metrics/network.js`: `medianNodeDegree`, `nodeDegreeOf`
- из `metrics/similarity-philosophers.js`: `invalidatePhilosopherSimilarityCache`

Чаще всего поминает: `MET`×19, `S`×7, `medianNodeDegree`×3, `nodeDegreeOf`×3, `invalidatePhilosopherSimilarityCache`×3

### `metrics/similarity-philosophers.js`

- из `core/ns.js`: `MET`, `S`
- из `metrics/philosopher.js`: `philosopherProfile`

Чаще всего поминает: `S`×10, `MET`×5, `philosopherProfile`×3

### `metrics/tension-cache.js`

- из `core/ns.js`: `S`

Чаще всего поминает: `S`×5

### `modal/assembly.js`

- из `core/ns.js`: `VIEWS`

Чаще всего поминает: `VIEWS`×4

### `modal/auth.js`

- из `core/session.js`: `AUTH_ADMIN`, `authAccounts`, `authSession`
- из `modal/context.js`: `ModalContext`
- из `modal/core.js`: `toggleModalMode`
- из `modal/edit-rights.js`: `refreshEditHints`, `refreshOpenModalToolbar`, `renderAuthControls`

Чаще всего поминает: `authAccounts`×6, `authSession`×6, `refreshEditHints`×6, `renderAuthControls`×6, `AUTH_ADMIN`×5

### `modal/concept-view.js`

- из `core/ns.js`: `DATA`, `VIEWS`
- из `metrics/network.js`: `medianNodeDegree`, `nodeDegreeOf`
- из `metrics/similarity-concepts.js`: `nearestConcepts`
- из `modal/connection-view.js`: `стрелкаСвязи`
- из `util/color.js`: `getContrastColor`

Чаще всего поминает: `DATA`×18, `nearestConcepts`×4, `стрелкаСвязи`×4, `VIEWS`×3, `medianNodeDegree`×3

### `modal/connection-edit.js`

- из `core/ns.js`: `DATA`, `VIEWS`
- из `core/link-facts.js`: `isReflexiveLink`
- из `core/relation-types.js`: `WEIGHT_OPTIONS`, `relationHint`
- из `core/search.js`: `внутренностиСтроки`, `отобратьКонцепции`, `пустойСписок`
- из `graph/graph-data.js`: `connectionsBetween`
- из `modal/assembly.js`: `modalActions`
- из `modal/connection-view.js`: `initConnectionSearchFields`
- из `modal/context.js`: `ModalContext`
- из `modal/core.js`: `openUniversalModal`
- из `util/html.js`: `escapeAttr`

Чаще всего поминает: `ModalContext`×13, `DATA`×11, `relationHint`×4, `connectionsBetween`×4, `initConnectionSearchFields`×4

### `modal/connection-view.js`

- из `core/ns.js`: `DATA`, `VIEWS`
- из `core/link-facts.js`: `isReflexiveLink`
- из `core/relation-types.js`: `CONN_WEIGHT_WORDS`, `WEIGHT_WORDS`, `relationHint`
- из `core/search.js`: `внутренностиСтроки`, `отобратьКонцепции`, `пустойСписок`
- из `graph/graph-data.js`: `connectionsBetween`, `traditionsOfPhilosopher`
- из `graph/graph-selection.js`: `selectConceptOnGraph`
- из `modal/context.js`: `ModalContext`
- из `util/color.js`: `getContrastColor`

Чаще всего поминает: `DATA`×19, `ModalContext`×9, `isReflexiveLink`×4, `relationHint`×4, `connectionsBetween`×4

### `modal/core.js`

- из `core/ns.js`: `S`
- из `core/session.js`: `canEdit`
- из `graph/graph-selection.js`: `cancelGraphSelection`
- из `modal/assembly.js`: `modalContentFor`, `modalEntityExists`
- из `modal/connection-view.js`: `initConnectionSearchFields`
- из `modal/context.js`: `ModalContext`
- из `modal/dirty.js`: `hasUnsavedChanges`
- из `modal/search.js`: `clearModalSearch`
- из `render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`

Чаще всего поминает: `ModalContext`×19, `S`×4, `canEdit`×4, `cancelGraphSelection`×4, `initConnectionSearchFields`×4

### `modal/dirty.js`

- из `core/ns.js`: `DATA`
- из `modal/assembly.js`: `modalEntityExists`
- из `modal/context.js`: `ModalContext`

Чаще всего поминает: `ModalContext`×7, `DATA`×5, `modalEntityExists`×3

### `modal/edit-forms.js`

- из `core/ns.js`: `DATA`, `VIEWS`
- из `core/link-facts.js`: `isReflexiveLink`
- из `core/relation-types.js`: `relationHint`
- из `graph/graph-data.js`: `getConceptConnections`
- из `modal/assembly.js`: `modalActions`
- из `modal/connection-view.js`: `стрелкаСвязи`
- из `util/color.js`: `getContrastColor`
- из `util/html.js`: `escapeAttr`
- из `util/philosopher-label.js`: `philosopherYears`, `sortPhilosophersByBirth`

Чаще всего поминает: `DATA`×12, `escapeAttr`×7, `VIEWS`×4, `relationHint`×4, `modalActions`×4

### `modal/edit-rights.js`

- из `core/session.js`: `authSession`, `canEdit`
- из `modal/context.js`: `ModalContext`
- из `modal/core.js`: `openUniversalModal`

Чаще всего поминает: `ModalContext`×6, `authSession`×3, `canEdit`×3, `openUniversalModal`×3

### `modal/entry.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/session.js`: `canEdit`
- из `graph/graph-data.js`: `findConnection`, `getConceptConnections`
- из `modal/core.js`: `closeUniversalModal`, `openUniversalModal`
- из `render/d3-layer.js`: `gfxNode`
- из `render/selection.js`: `highlightConnected`
- из `state/render.js`: `selectedNodes`

Чаще всего поминает: `DATA`×10, `openUniversalModal`×7, `S`×6, `canEdit`×5, `getConceptConnections`×4

### `modal/integrity.js`

- из `core/ns.js`: `DATA`
- из `core/link-facts.js`: `isReflexiveLink`
- из `modal/entry.js`: `isConceptIsolated`
- из `util/philosopher-label.js`: `philosopherBirth`, `philosopherYears`
- из `util/ru.js`: `pluralRu`

Чаще всего поминает: `DATA`×18, `philosopherBirth`×4, `philosopherYears`×4, `pluralRu`×4, `isReflexiveLink`×3

### `modal/persist.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/link-facts.js`: `isReflexiveLink`
- из `data/mutate.js`: `afterDataChange`
- из `graph/graph-data.js`: `addLinkToGraph`, `addNodeToGraph`, `findConnection`, `forgetLink`, `forgetNode`, `getConceptConnections`, `updateLinkOnGraph`, `updateNodeOnGraph`
- из `modal/assembly.js`: `modalEntityExists`
- из `modal/context.js`: `ModalContext`
- из `modal/core.js`: `closeUniversalModal`, `openUniversalModal`
- из `modal/entry.js`: `getIsolatedConceptsAfterDeletion`
- из `modal/integrity.js`: `conceptIntegrityWarnings`, `connectionIntegrityWarnings`, `nConcepts`, `nLinks`, `philosopherIntegrityWarnings`, `relationIndexOf`

Чаще всего поминает: `DATA`×52, `ModalContext`×19, `afterDataChange`×10, `openUniversalModal`×8, `S`×6

### `modal/philosopher-view.js`

- из `core/ns.js`: `DATA`, `VIEWS`
- из `core/session.js`: `canEdit`
- из `metrics/similarity-philosophers.js`: `nearestPhilosophers`
- из `modal/connection-view.js`: `стрелкаСвязи`
- из `modal/edit-rights.js`: `refreshEditHints`
- из `modal/entry.js`: `openEditPhilosopherModal`, `showPhilosopherDetailModal`
- из `render/selection.js`: `highlightPhilosopherOnGraph`
- из `util/color.js`: `getContrastColor`
- из `util/philosopher-label.js`: `formatBirthYear`, `philosopherBirth`, `philosopherYears`, `sortPhilosophersByBirth`
- из `util/ru.js`: `conjugateVerb`, `declinePhilosopher`

Чаще всего поминает: `DATA`×31, `declinePhilosopher`×24, `conjugateVerb`×7, `getContrastColor`×6, `canEdit`×5

### `modal/profile-concept.js`

- из `core/ns.js`: `DATA`, `MET`, `S`
- из `metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `metrics/scope.js`: `metricsScopeCounts`
- из `render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `stats/coverage.js`: `METRIC_COVERAGE_WARN`, `metricCoverage`
- из `util/color.js`: `getContrastColor`

Чаще всего поминает: `MET`×21, `S`×9, `DATA`×8, `initializePhilosophyMetrics`×3, `metricsScopeCounts`×3

### `modal/profile-philosopher.js`

- из `core/ns.js`: `DATA`, `MET`, `S`
- из `metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `modal/profile-concept.js`: `PROFILE_METRICS`
- из `render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `stats/coverage.js`: `METRIC_COVERAGE_WARN`, `metricCoverage`
- из `util/color.js`: `getContrastColor`

Чаще всего поминает: `DATA`×9, `MET`×8, `S`×6, `initializePhilosophyMetrics`×3, `PROFILE_METRICS`×3

### `modal/search.js`

- из `core/search.js`: `displaySearchResults`, `отобратьКонцепции`

Чаще всего поминает: `displaySearchResults`×3, `отобратьКонцепции`×3

### `paths/analysis.js`

- из `core/ns.js`: `DATA`
- из `core/link-facts.js`: `isSymmetricLink`
- из `core/time.js`: `CHRONOLOGY_MODES`
- из `graph/graph-data.js`: `traditionsOfPhilosopher`
- из `paths/chronology.js`: `isChronologicallyValid`

Чаще всего поминает: `DATA`×11, `traditionsOfPhilosopher`×4, `isSymmetricLink`×3, `CHRONOLOGY_MODES`×3, `isChronologicallyValid`×3

### `paths/chronology.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/time.js`: `CHRONOLOGY_MODES`, `MATURITY_AGE`

Чаще всего поминает: `DATA`×9, `MATURITY_AGE`×6, `CHRONOLOGY_MODES`×5, `S`×3

### `paths/path-descriptions.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/relation-types.js`: `WEIGHT_WORDS`
- из `paths/analysis.js`: `analyzePathTraditions`
- из `paths/path-ui.js`: `resolvePathLinkList`
- из `render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `util/color.js`: `getContrastColor`

Чаще всего поминает: `DATA`×7, `S`×4, `WEIGHT_WORDS`×3, `analyzePathTraditions`×3, `resolvePathLinkList`×3

### `paths/path-ui.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/link-facts.js`: `isSymmetricLink`
- из `core/time.js`: `CHRONOLOGY_MODES`
- из `paths/analysis.js`: `analyzePath`, `analyzePathTraditions`
- из `paths/shortest-path.js`: `findShortestPath`
- из `render/d3-layer.js`: `gfxLinkAll`, `gfxNode`
- из `render/selection.js`: `resetHighlight`

Чаще всего поминает: `S`×16, `DATA`×13, `resetHighlight`×5, `isSymmetricLink`×3, `CHRONOLOGY_MODES`×3

### `paths/shortest-path.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/link-facts.js`: `isSymmetricLink`, `isTypologicalLink`
- из `core/time.js`: `CHRONOLOGY_MODES`
- из `paths/chronology.js`: `isChronologicallyValid`, `летУзла`, `шагБезРазрыва`

Чаще всего поминает: `S`×9, `летУзла`×8, `DATA`×7, `isSymmetricLink`×4, `CHRONOLOGY_MODES`×4

### `render/canvas-core.js`

- из `core/ns.js`: `S`
- из `render/loop.js`: `requestDraw`

Чаще всего поминает: `S`×18, `requestDraw`×3

### `render/d3-layer.js`

- из `core/ns.js`: `DATA`, `S`
- из `render/loop.js`: `requestDraw`
- из `render/scene.js`: `startRadiusAnimation`

Чаще всего поминает: `S`×12, `DATA`×11, `requestDraw`×9, `startRadiusAnimation`×3

### `render/draw-link.js`

- из `core/ns.js`: `S`
- из `render/geometry.js`: `arcParams`, `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`, `linkHoverStrokeWidth`, `linkStrokeWidth`
- из `render/render-state.js`: `hasLinkClass`, `nodeRadius`
- из `state/render.js`: `selectedEdges`

Чаще всего поминает: `S`×6, `hasLinkClass`×6, `arcParams`×3, `arrowPoints`×3, `arrowPointsStart`×3

### `render/geometry.js`

- из `core/ns.js`: `DATA`, `S`

Чаще всего поминает: `S`×10, `DATA`×3

### `render/grouping.js`

- из `core/ns.js`: `S`
- из `render/selection.js`: `resetHighlight`

Чаще всего поминает: `S`×9, `resetHighlight`×3

### `render/interactions.js`

- из `core/ns.js`: `S`
- из `core/events.js`: `известить`
- из `core/session.js`: `canEdit`
- из `graph/click-actions.js`: `handleLinkClick`, `handleNodeClick`
- из `graph/graph-selection.js`: `cancelGraphSelection`, `handleConceptSelection`
- из `render/d3-layer.js`: `gfxLink`, `gfxNode`, `linkHandlers`, `nodeHandlers`
- из `render/loop.js`: `requestDraw`
- из `render/picking.js`: `pickLink`, `pickNode`, `toGraph`
- из `render/selection.js`: `resetHighlight`
- из `state/edit.js`: `editMode`

Чаще всего поминает: `S`×14, `linkHandlers`×12, `nodeHandlers`×10, `requestDraw`×6, `pickNode`×5

### `render/metric-visualization.js`

- из `core/ns.js`: `DATA`, `MET`, `S`
- из `core/events.js`: `известить`
- из `metrics/network.js`: `betweennessCache`, `closenessCache`, `eigenvectorCache`, `localCohesionCache`, `pageRankCache`, `richClubCache`, `weightedClusteringCache`
- из `render/d3-layer.js`: `gfxNode`, `updateArrows`

Чаще всего поминает: `DATA`×10, `S`×7, `gfxNode`×6, `updateArrows`×4, `MET`×3

### `render/picking.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/link-facts.js`: `isReflexiveLink`
- из `core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `render/canvas-core.js`: `PICK_LINK_WIDTH`
- из `render/draw-link.js`: `drawSelfLoop`, `fillArrow`, `linkDrawWidth`, `linkVisualState`, `strokeLink`
- из `render/render-state.js`: `nodeRadius`

Чаще всего поминает: `S`×33, `DATA`×7, `isReflexiveLink`×3, `isLinkVisible`×3, `isNodeVisible`×3

### `render/render-state.js`

- из `core/ns.js`: `S`

Чаще всего поминает: `S`×6

### `render/scene.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/link-facts.js`: `isReflexiveLink`
- из `core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `render/draw-link.js`: `drawSelfLoop`, `fillArrow`, `linkDrawAlpha`, `linkDrawWidth`, `linkVisualState`, `strokeLink`
- из `render/geometry.js`: `arcParams`, `linkHoverStrokeWidth`
- из `render/loop.js`: `requestDraw`
- из `render/picking.js`: `rebuildQuadtree`
- из `render/render-state.js`: `LABEL_ALL_ABOVE`, `LABEL_HIDE_BELOW`, `hasNodeClass`, `nodeLabelDy`, `nodeRadius`
- из `render/similarity-overlay.js`: `similarityColor`
- из `state/render.js`: `selectedNodes`

Чаще всего поминает: `S`×45, `DATA`×17, `hasNodeClass`×8, `isNodeVisible`×5, `isLinkVisible`×4

### `render/selection.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/events.js`: `известить`
- из `core/long-task.js`: `showTemporaryMessage`
- из `render/d3-layer.js`: `gfxLinkAll`, `gfxNode`
- из `render/loop.js`: `requestDraw`
- из `state/filters.js`: `выбранныеФилософы`
- из `state/render.js`: `selectedEdges`, `selectedNodes`

Чаще всего поминает: `selectedNodes`×13, `выбранныеФилософы`×10, `selectedEdges`×10, `DATA`×8, `gfxNode`×8

### `render/similarity-overlay.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/events.js`: `известить`
- из `core/long-task.js`: `showTemporaryMessage`
- из `metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `metrics/similarity-concepts.js`: `_simCache`, `profileSimilarity`, `structuralSimilarity`
- из `render/loop.js`: `requestDraw`

Чаще всего поминает: `S`×15, `DATA`×6, `showTemporaryMessage`×4, `requestDraw`×4, `известить`×3

### `render/simulation.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/long-task.js`: `showTemporaryMessage`
- из `render/scene.js`: `ensureAnimLoop`, `needsContinuousAnimation`
- из `render/selection.js`: `resetHighlight`

Чаще всего поминает: `S`×16, `ensureAnimLoop`×4, `needsContinuousAnimation`×4, `DATA`×3, `showTemporaryMessage`×3

### `state/filters.js`

- из `core/ns.js`: `S`

Чаще всего поминает: `S`×3

### `state/metrics-scope.js`

- из `core/ns.js`: `S`

Чаще всего поминает: `S`×7

### `state/paths.js`

- из `core/ns.js`: `S`

Чаще всего поминает: `S`×8

### `state/render.js`

- из `core/ns.js`: `S`

Чаще всего поминает: `S`×9

### `state/stats.js`

- из `core/ns.js`: `S`

Чаще всего поминает: `S`×17

### `stats/coverage.js`

- из `core/ns.js`: `S`

Чаще всего поминает: `S`×9

### `stats/modal.js`

- из `core/ns.js`: `DATA`, `S`
- из `metrics/graph-cache.js`: `invalidateGraphCache`
- из `metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `metrics/scope-reset.js`: `invalidateEverythingForScope`
- из `metrics/scope.js`: `applyMetricsScope`, `installMetricScopeWrappers`, `updateMetricsScopeHint`, `updateScopeToggles`
- из `render/metric-visualization.js`: `resetNodeSizes`
- из `render/scene.js`: `ensureAnimLoop`, `needsContinuousAnimation`
- из `render/simulation.js`: `freezeSimulation`, `unfreezeSimulation`
- из `stats/results.js`: `applyMetricLayout`
- из `stats/views/advanced.js`: `generateAbstractionContent`, `generateBridgingContent`, `generateComplexityContent`, `generateContinuityContent`, `generateDeductiveContent`, `generateFertilityContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateTemporalInfluenceContent`, `generateTransformationContent`
- из `stats/views/comparison.js`: `generateClosestPairsContent`, `generateComparisonContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `renderClosestPairs`, `renderComparison`, `renderPhilosopherComparison`, `renderPhilosopherPairs`
- из `stats/views/network.js`: `generateBetweennessContent`, `generateClosenessContent`, `generateDegreeContent`, `generateEigenvectorContent`, `generateLocalCohesionContent`, `generateOverviewContent`, `generatePageRankContent`, `generateRichClubContent`, `generateWeightedClusteringContent`
- из `stats/views/philosopher.js`: `generatePhilosopherInterdisciplinaryContent`, `generatePhilosopherProfileContent`, `generatePhilosopherReachContent`, `generatePhilosopherSystematicContent`
- из `stats/views/philosophical.js`: `generateCoherenceContent`, `generateCriticalPowerContent`, `generateDialogicalContent`, `generateFoundationalContent`, `generateInfluenceContent`, `generateParadigmShiftContent`, `generateProblemGenerationContent`, `generateRevolutionaryContent`, `generateSyntheticContent`, `generateTensionContent`
- из `stats/views/rankings.js`: `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`

Чаще всего поминает: `S`×21, `applyMetricsScope`×5, `updateScopeToggles`×5, `DATA`×4, `initializePhilosophyMetrics`×4

### `stats/results.js`

- из `core/ns.js`: `S`
- из `metrics/descriptions.js`: `getMetricDescription`
- из `metrics/format.js`: `applyMetricMode`
- из `stats/coverage.js`: `generateMetricCoverageBlock`

Чаще всего поминает: `S`×19, `applyMetricMode`×5, `generateMetricCoverageBlock`×4, `getMetricDescription`×3

### `stats/run.js`

- из `core/ns.js`: `MET`, `S`
- из `metrics/network.js`: `calculateBetweennessAsync`
- из `stats/modal.js`: `openStatsModal`, `switchStatsView`, `updateActiveNavItem`

Чаще всего поминает: `MET`×8, `S`×4, `openStatsModal`×4, `calculateBetweennessAsync`×3, `switchStatsView`×3

### `stats/views/advanced.js`

- из `core/ns.js`: `DATA`, `MET`
- из `metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `stats/results.js`: `generateMetricDescriptionBlock`, `generateMetricResults`, `rankKeep`

Чаще всего поминает: `DATA`×32, `MET`×12, `initializePhilosophyMetrics`×12, `generateMetricResults`×11, `rankKeep`×9

### `stats/views/comparison.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/events.js`: `известить`
- из `core/long-task.js`: `LoadingIndicator`
- из `metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `metrics/philosopher.js`: `philosopherProfile`
- из `metrics/similarity-concepts.js`: `_pairCalculating`, `allConceptPairs`, `allConceptPairsAsync`, `profileSimilarity`, `similarityData`, `structuralSimilarity`
- из `metrics/similarity-philosophers.js`: `PHIL_SIM_LABELS`, `SIM_METRIC_LABELS`, `philosopherSimilarity`, `philosopherSimilarityData`
- из `stats/results.js`: `generateMetricDescriptionBlock`

Чаще всего поминает: `S`×49, `DATA`×17, `initializePhilosophyMetrics`×6, `PHIL_SIM_LABELS`×6, `generateMetricDescriptionBlock`×6

### `stats/views/network.js`

- из `core/ns.js`: `DATA`, `MET`, `S`
- из `metrics/network.js`: `betweennessCache`, `closenessCache`, `eigenvectorCache`, `localCohesionCache`, `pageRankCache`, `richClubCache`, `weightedClusteringCache`
- из `stats/results.js`: `generateCalculateButton`, `generateMetricDescriptionBlock`, `generateMetricResults`

Чаще всего поминает: `DATA`×9, `generateCalculateButton`×9, `generateMetricResults`×9, `betweennessCache`×5, `closenessCache`×5

### `stats/views/philosopher.js`

- из `core/ns.js`: `DATA`, `MET`
- из `metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `metrics/philosopher.js`: `philosopherProfile`
- из `stats/results.js`: `generateMetricDescriptionBlock`, `rankKeep`
- из `stats/views/philosophical.js`: `influenceScopeSwitcher`

Чаще всего поминает: `DATA`×14, `initializePhilosophyMetrics`×6, `generateMetricDescriptionBlock`×6, `MET`×5, `rankKeep`×4

### `stats/views/philosophical.js`

- из `core/ns.js`: `DATA`, `MET`, `S`
- из `core/events.js`: `известить`
- из `metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `metrics/philosophical.js`: `INFLUENCE_SCOPE_LABELS`, `invalidateInfluenceIndexCache`
- из `metrics/rankings.js`: `invalidateGeneratePhilosopherRankingsCache`
- из `stats/results.js`: `generateMetricResults`, `rankKeep`

Чаще всего поминает: `DATA`×32, `MET`×12, `initializePhilosophyMetrics`×12, `generateMetricResults`×12, `rankKeep`×11

### `stats/views/rankings.js`

- из `core/ns.js`: `DATA`, `S`
- из `metrics/link-indexes.js`: `initializePhilosophyMetrics`
- из `metrics/rankings.js`: `generatePhilosopherRankings`, `generateRankings`
- из `stats/results.js`: `generateMetricDescriptionBlock`
- из `stats/views/philosophical.js`: `influenceScopeSwitcher`

Чаще всего поминает: `DATA`×6, `S`×5, `initializePhilosophyMetrics`×4, `generateMetricDescriptionBlock`×4, `influenceScopeSwitcher`×4

### `ui/about.js`

- из `core/ns.js`: `DATA`

Чаще всего поминает: `DATA`×9

### `ui/actions-byname.js`

- из `ui/actions.js`: `registerActions`
- из `modal/persist.js`: `deleteConcept`, `deleteConnection`, `deletePhilosopher`, `saveConceptData`, `saveConnectionData`, `savePhilosopherData`

Чаще всего поминает: `deleteConcept`×4, `deleteConnection`×4, `deletePhilosopher`×4, `saveConceptData`×4, `saveConnectionData`×4

### `ui/actions-dyn.js`

- из `ui/actions.js`: `registerActions`
- из `core/ns.js`: `DATA`, `S`
- из `graph/graph-data.js`: `findConnection`
- из `graph/graph-selection.js`: `cancelGraphSelection`
- из `metrics/format.js`: `toggleMetricValueMode`
- из `modal/auth.js`: `authLogout`, `closeAuthModal`, `openAuthModal`, `submitAuth`
- из `modal/connection-edit.js`: `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `onConnTypeChange`, `selectConnectionEditConcept`, `swapConnectionConcepts`
- из `modal/connection-view.js`: `handleConnectionViewSearch`, `selectConnectionViewConcept`, `toggleConnectionSearchSection`
- из `modal/core.js`: `closeUniversalModal`, `openUniversalModal`, `popModalState`, `toggleModalMode`
- из `modal/descriptions.js`: `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions`, `toggleConnectionDescription`, `togglePhilosopherConceptDescription`, `toggleSubsection`
- из `modal/edit-forms.js`: `syncPhilColorFromPicker`, `updatePhilColorSample`
- из `modal/entry.js`: `gotoNodeFromModal`, `openConceptById`, `openEditConceptModal`, `openEditConnectionModal`, `showAllConcepts`, `showPhilosopherDetailModal`
- из `modal/persist.js`: `deleteConnection`
- из `modal/profile-concept.js`: `closeConceptProfileModal`, `showConceptProfileModal`, `toggleProfileOrder`
- из `modal/profile-philosopher.js`: `closePhilosopherProfileModal`, `showPhilosopherProfileModal`
- из `modal/search.js`: `clearModalSearch`, `handleModalSearch`
- из `paths/path-descriptions.js`: `showPathDescriptionsModal`, `togglePathNodesDescriptions`
- из `paths/path-ui.js`: `clearPathHighlight`, `handlePathArrowHover`
- из `render/metric-visualization.js`: `toggleMetricVisualization`
- из `render/selection.js`: `highlightNodeById`
- из `render/similarity-overlay.js`: `clearSimilarityOverlay`, `showSimilarityOverlay`
- из `stats/modal.js`: `openStatsModal`, `switchStatsView`
- из `stats/results.js`: `toggleMetricDetails`, `toggleMetricLayout`
- из `stats/run.js`: `calculateMetricFromModal`
- из `stats/views/comparison.js`: `openPairInComparison`, `openPhilosopherPair`, `renderClosestPairs`, `renderPhilosopherComparison`, `renderPhilosopherPairs`
- из `stats/views/philosophical.js`: `setInfluenceScope`
- из `ui/legend.js`: `addTradition`, `onlyTradition`, `togglePhilosopher`, `toggleRelation`, `toggleRubric`, `toggleTradition`
- из `ui/search-legend.js`: `selectSearchResult`
- из `ui/search-link.js`: `highlightLinkOnGraph`, `pickLinkEnd`
- из `ui/search-philosopher.js`: `clearPhilosopherSearch`, `handlePhilosopherSearch`, `pickPhilosopherFromSearch`, `selectPhilosopherResult`
- из `widgets/custom-select.js`: `filterCustomSelect`, `selectCustomOption`, `showCustomSelectDropdown`

Чаще всего поминает: `openUniversalModal`×20, `S`×12, `DATA`×10, `renderClosestPairs`×8, `findConnection`×6

### `ui/actions-static.js`

- из `ui/actions.js`: `registerActions`
- из `data/save.js`: `downloadData`, `saveToFolder`
- из `filters/beyond-filter.js`: `resetBeyondFilter`
- из `metrics/scope.js`: `handleMetricsScopeChange`
- из `modal/core.js`: `closeUniversalModal`
- из `modal/profile-concept.js`: `closeConceptProfileModal`
- из `modal/profile-philosopher.js`: `closePhilosopherProfileModal`
- из `paths/path-descriptions.js`: `closePathDescriptionsModal`
- из `paths/path-ui.js`: `findAndShowPath`
- из `render/grouping.js`: `toggleGrouping`
- из `render/metric-visualization.js`: `resetNodeSizes`
- из `render/simulation.js`: `centerGraph`, `resetSimulation`, `toggleSimulationFreeze`
- из `stats/modal.js`: `closeStatsModal`, `handleStatsParameterChange`, `openStatsModal`, `switchStatsView`
- из `ui/about.js`: `closeAboutModal`, `onAboutBackdropClick`, `openAboutModal`
- из `ui/export.js`: `exportToPNG`, `exportToSVG`
- из `ui/legend.js`: `changeFilterMode`, `deselectAllPhilosophers`, `deselectAllRelations`, `deselectAllRubrics`, `deselectAllTraditions`, `selectAllPhilosophers`, `selectAllRelations`, `selectAllRubrics`, `selectAllTraditions`, `togglePanel`, `toggleSection`, `toggleUniformLinkWidth`
- из `ui/search-legend.js`: `clearLegendSearch`, `handleLegendSearch`, `setSearchKind`, `toggleLegendSearch`
- из `ui/search-link.js`: `handleLegendLinkSearch`
- из `ui/search-philosopher.js`: `clearLegendPhilSearch`, `handleLegendPhilSearch`
- из `widgets/custom-select.js`: `filterCustomSelect`, `showCustomSelectDropdown`

Чаще всего поминает: `switchStatsView`×41, `toggleSection`×6, `handleLegendLinkSearch`×6, `setSearchKind`×5, `handleStatsParameterChange`×4

### `ui/delegation.js`

- из `ui/actions.js`: `runAction`

Чаще всего поминает: `runAction`×4

### `ui/export.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/link-facts.js`: `isSymmetricLink`
- из `core/long-task.js`: `showTemporaryMessage`
- из `core/visibility.js`: `isLinkVisible`, `isNodeVisible`
- из `render/draw-link.js`: `linkDrawAlpha`, `linkDrawWidth`, `linkVisualState`
- из `render/geometry.js`: `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`
- из `render/render-state.js`: `hasNodeClass`, `nodeLabelDy`, `nodeRadius`
- из `render/scene.js`: `DRAW_ORDER`, `renderScene`
- из `state/render.js`: `selectedNodes`

Чаще всего поминает: `S`×12, `hasNodeClass`×8, `DATA`×7, `showTemporaryMessage`×4, `isNodeVisible`×4

### `ui/hint.js`

- из `core/ns.js`: `S`

Чаще всего поминает: `S`×3

### `ui/legend.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/relation-types.js`: `relationHint`
- из `filters/filters.js`: `applyFilters`, `philosopherPassesTraditions`
- из `render/d3-layer.js`: `updateArrows`
- из `state/filters.js`: `выбранныеФилософы`

Чаще всего поминает: `S`×32, `DATA`×26, `applyFilters`×17, `relationHint`×3, `philosopherPassesTraditions`×3

### `ui/search-legend.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/long-task.js`: `showTemporaryMessage`
- из `core/search.js`: `displaySearchResults`, `отобратьКонцепции`
- из `core/visibility.js`: `isNodeVisible`
- из `filters/beyond-filter.js`: `обновитьЗаметкуОбОтборе`
- из `filters/filters.js`: `applyFiltersImmediate`
- из `modal/entry.js`: `showDetailModal`
- из `modal/search.js`: `clearModalSearch`
- из `render/selection.js`: `highlightConnected`
- из `state/filters.js`: `pinnedVisibleNodes`, `показанныеВопрекиОтбору`
- из `state/render.js`: `selectedNodes`
- из `ui/search-link.js`: `очиститьПоискСвязи`
- из `ui/search-philosopher.js`: `clearLegendPhilSearch`

Чаще всего поминает: `S`×6, `selectedNodes`×4, `очиститьПоискСвязи`×4, `clearLegendPhilSearch`×4, `DATA`×3

### `ui/search-link.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/search.js`: `внутренностиСтроки`, `отобратьКонцепции`, `пустойСписок`
- из `render/loop.js`: `requestDraw`
- из `render/selection.js`: `highlightCombined`
- из `state/render.js`: `selectedEdges`, `selectedNodes`

Чаще всего поминает: `DATA`×9, `S`×6, `пустойСписок`×4, `selectedEdges`×4, `внутренностиСтроки`×3

### `ui/search-philosopher.js`

- из `core/ns.js`: `DATA`
- из `core/search.js`: `пустойСписок`
- из `modal/core.js`: `openUniversalModal`
- из `render/selection.js`: `highlightPhilosopherOnGraph`

Чаще всего поминает: `DATA`×9, `пустойСписок`×4, `openUniversalModal`×3, `highlightPhilosopherOnGraph`×3

### `util/philosopher-label.js`

- из `core/ns.js`: `DATA`

Чаще всего поминает: `DATA`×5

### `widgets/custom-select.js`

- из `core/ns.js`: `DATA`, `S`
- из `core/events.js`: `известить`
- из `core/search.js`: `внутренностиСтроки`, `отобратьКонцепции`, `пустойСписок`

Чаще всего поминает: `S`×6, `DATA`×3, `известить`×3, `внутренностиСтроки`×3, `отобратьКонцепции`×3