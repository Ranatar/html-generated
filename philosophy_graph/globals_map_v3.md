# Карта глобальных сущностей `philosophy_graph.html`

Файл: 2 007 631 знаков, 30 818 строк; встроенный скрипт — строки 5083–30816. Составлено 2026-08-16 21:31:54 UTC.

Всего глобальных сущностей: **813** — функций 511
(из них асинхронных 12), `const` 92, `let` 120,
`var` 15, операторов верхнего уровня 72.
Обработчиков событий 41; вызовов из разметки:
статической 96, порождаемой 128.

Столбец «использует» — глобальные имена, к которым сущность обращается
(×N — число обращений); «используется в» — обратная связь. Обращения из
строк разметки в AST не видны и учтены отдельным столбцом «из разметки».

**Разделы.** [1. Функции](#1-глобальные-функции) ·
[2. Константы и переменные](#2-глобальные-константы-и-переменные) ·
[3. Операторы верхнего уровня](#3-операторы-верхнего-уровня) ·
[4. Обработчики событий](#4-обработчики-событий-навешанные-из-кода) ·
[4б. Обращение по имени](#4б-обращение-к-функциям-по-имени-window) ·
[5. Вызовы из разметки](#5-функции-вызываемые-из-разметки) ·
[6. Разметка построчно](#6-все-обработчики-в-разметке-построчно) ·
[7. Диагностика](#7-диагностика)


## 0. На чём всё держится

Пятнадцать сущностей с наибольшим числом обращений.

| Имя | Вид | Стр. | Обращений | Из скольких сущностей |
|---|---|---|---|---|
| `nodes` | const | 13919 | 177 | 113 |
| `links` | const | 13929 | 63 | 45 |
| `ModalContext` | const | 26875 | 63 | 24 |
| `renderState` | const | 25074 | 55 | 29 |
| `_conceptMap` | let | 18032 | 53 | 23 |
| `concepts` | const | 5623 | 51 | 46 |
| `philosopherConcepts` | const | 13873 | 48 | 27 |
| `useWeightedPaths` | let | 13953 | 46 | 17 |
| `relations` | const | 9363 | 44 | 41 |
| `relationTypesObj` | const | 13888 | 44 | 29 |
| `respectDirection` | let | 13954 | 44 | 19 |
| `selectedPhilosophers` | let | 14022 | 42 | 12 |
| `philosophers` | const | 5201 | 41 | 28 |
| `similarityOverlay` | var | 25095 | 41 | 9 |
| `selectedNodes` | let | 25878 | 41 | 14 |


## 1. Глобальные функции

`⟲` — вызывает сама себя. Столбец «по имени» — обращения, где имя функции стоит строкой или ключом объекта (в этом файле так работает вызов через `window[имя]`).

| Имя | Вид | Стр. | Длина | Параметры | Использует | Используется в | Из разметки | По имени |
|---|---|---|---|---|---|---|---|---|
| `isSymmetricLink` | function | 13905 | 6 | (l) | `relationTypesObj` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `buildAdjacencyGraph`, `buildGlobalGraphCache`, `buildIncomingLinks`, `buildOutgoingLinks`, `tensionIndex`, `exportToSVG`, `stmt021` | — | — |
| `isTypologicalLink` | function | 13960 | 4 | (l) | `relationTypesObj` | `pathLinkAllowed` | — | — |
| `pathLinkAllowed` | function | 13964 | 9 | (l) | `skipTypologicalInPaths`, `isTypologicalLink` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `летУзла` | function | 13997 | 6 | (id) | `philosophers`, `DATA_nodes_find` | `findShortestPathWeighted`×3, `findShortestPathUnweighted`×3, `шагБезРазрыва` | — | — |
| `DATA_nodes_find` | function | 14004 | 1 | (id) | `nodes` | `шагБезРазрыва`×2, `летУзла` | — | — |
| `шагБезРазрыва` | function | 14006 | 8 | (отId, кId, ход, крайний) | `DATA_nodes_find`×2, `летУзла` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `rebuildPhilosopherTraditions` | function | 14029 | 4 | () | `philosopherTraditions`×3, `philosophers` | `rebuildDerivedIndexes` | — | — |
| `initPathFinder` | function | 14039 | 23 | () | `nodes` | `stmt061` | — | — |
| `strictChronologyCheck` | function | 14073 | 50 | (fromPhil, toPhil) | `MATURITY_AGE`×2 | `isChronologicallyValid` | — | — |
| `moderateChronologyCheck` | function | 14130 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `looseChronologyCheck` | function | 14141 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `isChronologicallyValid` | function | 14153 | 55 | (fromNodeId, toNodeId, mode=…, linkType=…) | `CHRONOLOGY_MODES`×3, `philosophers`×2, `nodes`×2, `MATURITY_AGE`×2, `relationTypesObj`, `currentChronologyMode`, `strictChronologyCheck`, `moderateChronologyCheck`, `looseChronologyCheck` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `analyzePath` | function | 14215 | 40 | (path, mode=…) | `philosophers`×2, `nodes`×2, `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `isChronologicallyValid` | `findAndShowPath` | — | — |
| `traditionsOfPhilosopher` | function | 14264 | 5 | (name) | `traditions`, `philosopherTraditions` | `analyzePathTraditions`×2, `connectionTraditionNote`×2 | — | — |
| `analyzePathTraditions` | function | 14270 | 21 | (pathNodes) | `philosopherTraditions`×3, `traditionsOfPhilosopher`×2, `traditions` | `findAndShowPath`, `showPathDescriptionsModal` | — | — |
| `findShortestPath` | function | 14293 | 10 | (sourceId, targetId, respectChronology=…, useDirection=…) | `useWeightedPaths`, `respectDirection`, `findShortestPathWeighted`, `findShortestPathUnweighted` | `findAndShowPath` | — | — |
| `findShortestPathWeighted` | function | 14305 | 111 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `летУзла`×3, `nodes`×2, `currentChronologyMode`×2, `isSymmetricLink`, `links`, `pathLinkAllowed`, `CHRONOLOGY_MODES`, `шагБезРазрыва`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findShortestPathUnweighted` | function | 14418 | 66 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `летУзла`×3, `currentChronologyMode`×2, `isSymmetricLink`, `nodes`, `links`, `pathLinkAllowed`, `CHRONOLOGY_MODES`, `шагБезРазрыва`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findAndShowPath` | function | 14486 | 264 | () | `nodes`×3, `useWeightedPaths`×3, `respectDirection`×3, `currentChronologyMode`×3, `philosophers`×2, `philosopherConcepts`×2, `relationTypesObj`×2, `skipTypologicalInPaths`, `analyzePath`, `analyzePathTraditions`, `findShortestPath`, `resolvePathLinkList`, `highlightPath`, `currentPathData`, `selectedSourceNode`, `selectedTargetNode`, `resetHighlight` | — | статич.×1 | — |
| `handlePathArrowHover` | function | 14755 | 39 | (event, isEntering) | `arrowHoverTimer`×4, `ARROW_HOVER_DELAY` | — | динам.×2 | — |
| `resolvePathLinkList` | function | 14799 | 26 | (path, respectDirectionFlag=…) | `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `currentChronologyMode` | `findAndShowPath`, `highlightPath`, `showPathDescriptionsModal` | — | — |
| `highlightPath` | function | 14827 | 15 | (path, respectDirection=…) | `resolvePathLinkList`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `findAndShowPath` | — | — |
| `clearPathHighlight` | function | 14844 | 6 | () | `resetHighlight` | — | динам.×2 | — |
| `showPathDescriptionsModal` | function | 14855 | 124 | () | `philosopherConcepts`×2, `relationTypesObj`×2, `currentPathData`×2, `philosophers`, `analyzePathTraditions`, `resolvePathLinkList`, `WEIGHT_WORDS`, `getContrastColor`, `freezeSimulation` | — | динам.×1 | — |
| `closePathDescriptionsModal` | function | 14981 | 9 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1 | — |
| `togglePathNodesDescriptions` | function | 14994 | 18 | () | `nodesDescriptionsVisible`×4 | — | динам.×1 | — |
| `toggleLegendSearch` | function | 15021 | 14 | () | `setSearchKind`, `clearLegendPhilSearch`, `очиститьПоискСвязи`, `clearLegendSearch` | — | статич.×1 | — |
| `setSearchKind` | function | 15036 | 16 | (вид) | `видПоиска`, `clearLegendPhilSearch`, `очиститьПоискСвязи`, `clearLegendSearch` | `toggleLegendSearch` | статич.×3 | — |
| `handleLegendPhilSearch` | function | 15054 | 23 | (query) | `philosopherConcepts`×2, `concepts`, `пустойСписок`, `отобратьФилософов` | — | статич.×2 | — |
| `pickPhilosopherFromSearch` | function | 15079 | 4 | (имя) | `clearLegendPhilSearch`, `highlightPhilosopherOnGraph` | — | динам.×1 | — |
| `clearLegendPhilSearch` | function | 15084 | 6 | () | — | `toggleLegendSearch`, `setSearchKind`, `pickPhilosopherFromSearch` | статич.×1 | — |
| `отметитьВыбранныхВЛегенде` | function | 15102 | 6 | () | `выбранныеФилософы` | `stmt046` | — | — |
| `highlightPhilosopherOnGraph` | function | 15109 | 56 | (имя, добавить) | `выбранныеФилософы`×8, `известить`×2, `requestDraw`×2, `gfxNode`×2, `gfxLinkAll`×2, `resetHighlight`×2, `nodes`, `links`, `showTemporaryMessage`, `selectedNodes`, `selectedEdges` | `pickPhilosopherFromSearch`, `makeLegendsEditable` | — | — |
| `handleLegendLinkSearch` | function | 15169 | 24 | (конец, query) | `nodes`×2, `поискСвязи`×2, `links`, `отобратьКонцепции`, `внутренностиСтроки`, `пустойСписок` | — | статич.×4 | — |
| `pickLinkEnd` | function | 15194 | 10 | (конец, id) | `nodes`, `поискСвязи`, `показатьНайденныеСвязи` | — | динам.×1 | — |
| `показатьНайденныеСвязи` | function | 15205 | 28 | () | `relationTypesObj`, `links`, `поискСвязи`, `пустойСписок` | `pickLinkEnd` | — | — |
| `highlightLinkOnGraph` | function | 15234 | 23 | (idA, idB, k) | `selectedEdges`×2, `links`, `viewWidth`, `viewHeight`, `gfxSvg`, `requestDraw`, `gfxZoom`, `selectedNodes`, `highlightCombined` | — | динам.×1 | — |
| `очиститьПоискСвязи` | function | 15258 | 12 | () | `поискСвязи`×2 | `toggleLegendSearch`, `setSearchKind` | — | — |
| `обновитьЗаметкуОбОтборе` | function | 15281 | 7 | () | `показанныеВопрекиОтбору`×2 | `resetBeyondFilter`, `selectSearchResult` | — | — |
| `resetBeyondFilter` | function | 15293 | 6 | () | `показанныеВопрекиОтбору`×2, `обновитьЗаметкуОбОтборе`, `applyFiltersImmediate`, `pinnedVisibleNodes` | `stmt047` | статич.×1 | — |
| `собратьОПроекте` | function | 15305 | 80 | () | `philosophers`×2, `traditions`, `rubrics`, `relationTypes`, `concepts`, `relations` | `openAboutModal` | — | — |
| `openAboutModal` | function | 15386 | 5 | () | `собратьОПроекте` | — | статич.×1 | — |
| `closeAboutModal` | function | 15392 | 3 | () | — | `closeAllModals`×2, `onAboutBackdropClick` | статич.×1 | — |
| `onAboutBackdropClick` | function | 15398 | 3 | (ev) | `closeAboutModal` | — | статич.×1 | — |
| `показатьПодсказку` | function | 15407 | 20 | (эл, текст) | `коробПодсказки`×9 | `stmt049` | — | — |
| `скрытьПодсказку` | function | 15428 | 3 | () | `коробПодсказки`×2 | `stmt050`, `stmt051` | — | — |
| `подписаться` | function | 15457 | 8 | (событие, дело) | `подписчикиШины`×3, `СОБЫТИЯ_ШИНЫ` | `stmt033`, `stmt034`, `stmt035`, `stmt036`, `stmt037`, `stmt038`, `stmt039`, `stmt040`, `stmt041`, `stmt042`, `stmt043`, `stmt044`, `stmt045`, `stmt046`, `stmt047`, `stmt052`, `stmt053`, `stmt054`, `stmt055`, `stmt056`, `stmt057`, `stmt058` | — | — |
| `известить` | function | 15466 | 10 | (событие, ...доводы) | `СОБЫТИЯ_ШИНЫ`, `подписчикиШины` | `handleUniqueChainsMode`×4, `handleNodeClick`×4, `handleChainsMode`×3, `highlightPhilosopherOnGraph`×2, `handleLinkClick`×2, `refreshMetricsIfScoped`, `applyFiltersImmediate`, `setInfluenceScope`, `handleMetricsScopeChange`, `stmt009`, `toggleMetricValueMode`, `openPhilosopherPair`, `openPairInComparison`, `toggleMetricVisualization`, `selectCustomOption`, `showSimilarityOverlay`, `dispatchClick`, `highlightCombined`, `addNodeToGraph`, `addLinkToGraph`, `afterDataChange`, `handleConceptSelection` | — | — |
| `debounce` | function | 15477 | 11 | (func, wait) | — | `debouncedApplyFilters` | — | — |
| `showTemporaryMessage` | function | 15555 | 29 | (message, duration=…) | — | `handleUniqueChainsMode`×5, `handleChainsMode`×4, `exportToPNG`×2, `showSimilarityOverlay`×2, `highlightPhilosopherOnGraph`, `selectSearchResult`, `toggleSimulationFreeze` | — | — |
| `buildAdjacencyGraph` | function | 15591 | 35 | (filteredNodes, nodeById) | `conceptToRubrics`×2, `selectedRubrics`×2, `isSymmetricLink`, `links`, `selectedRelations` | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `processBFS` | function | 15673 | 125 | (startNode, startPhil, philsArray, adjacency, nodeById, nodesInChains, linksInChains, uniqueMode) | `CHAIN_SEARCH`×5 | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `confirmLongChainSearch` | function | 15809 | 9 | (count) | `CHAIN_WARN_THRESHOLD` | `handleChainsMode`, `handleUniqueChainsMode` | — | — |
| `findChainsThroughAllPhilosophers` | async function | 15819 | 45 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleChainsMode`×2 | — | — |
| `findUniquePhilosopherChains` | async function | 15868 | 44 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleUniqueChainsMode` | — | — |
| `philTraditionsSelected` | function | 15921 | 4 | (name) | `selectedTraditions`, `philosopherTraditions` | `FilterModes`×4 | — | — |
| `philosopherPassesTraditions` | function | 15925 | 5 | (name) | `selectedTraditions`, `philosopherTraditions` | `linkPassesTraditions`×2, `updatePhilosopherDimming` | — | — |
| `linkPassesTraditions` | function | 15932 | 5 | (l, both) | `philosopherPassesTraditions`×2 | `FilterModes`×5 | — | — |
| `isNodeVisible` | function | 16123 | 1 | (d) | `visibleNodeIds`×2 | `renderScene`×3, `exportToSVG`×2, `applyBasicFilter`, `applyChainVisibility`, `cleanupInvisibleSelections`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `displaySearchResults`, `selectSearchResult`, `rebuildQuadtree` | — | — |
| `isLinkVisible` | function | 16124 | 1 | (l) | `visibleLinkSet`×2 | `applyBasicFilter`, `applyChainVisibility`, `exportToSVG`, `needsContinuousAnimation`, `renderScene`, `repaintPickCanvas` | — | — |
| `applyBasicFilter` | function | 16126 | 52 | (mode) | `links`×3, `показанныеВопрекиОтбору`×3, `pinnedVisibleNodes`×3, `relationTypesObj`, `selectedRelations`, `FilterModes`, `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `gfxNode`, `gfxLinkAll` | `handleUniqueChainsMode`×3, `handleChainsMode`, `applyFiltersImmediate` | — | — |
| `applyChainVisibility` | function | 16182 | 7 | (chainNodes, chainLinks) | `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `gfxNode`, `gfxLinkAll` | `handleChainsMode`×2, `handleUniqueChainsMode` | — | — |
| `handleChainsMode` | async function | 16193 | 59 | () | `selectedPhilosophers`×7, `showTemporaryMessage`×4, `CHAIN_SEARCH`×4, `известить`×3, `findChainsThroughAllPhilosophers`×2, `applyChainVisibility`×2, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `applyBasicFilter` | `applyFiltersImmediate` | — | — |
| `handleUniqueChainsMode` | async function | 16256 | 65 | () | `selectedPhilosophers`×6, `showTemporaryMessage`×5, `известить`×4, `CHAIN_SEARCH`×4, `applyBasicFilter`×3, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `findUniquePhilosopherChains`, `applyChainVisibility` | `applyFiltersImmediate` | — | — |
| `cleanupInvisibleSelections` | function | 16325 | 14 | () | `selectedNodes`×4, `isNodeVisible`, `highlightConnected`, `resetHighlight` | `applyFiltersImmediate` | — | — |
| `refreshMetricsIfScoped` | function | 16343 | 7 | () | `известить`, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `applyFiltersImmediate` | — | — |
| `applyFiltersImmediate` | function | 16351 | 21 | () | `filterMode`×3, `известить`, `applyBasicFilter`, `handleChainsMode`, `handleUniqueChainsMode`, `cleanupInvisibleSelections`, `refreshMetricsIfScoped` | `resetBeyondFilter`, `debouncedApplyFilters`, `selectSearchResult`, `stmt040` | — | — |
| `applyFilters` | function | 16375 | 1 | () | `debouncedApplyFilters` | `togglePhilosopher`, `toggleTradition`, `selectAllTraditions`, `deselectAllTraditions`, `onlyTradition`, `addTradition`, `toggleRelation`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `selectAllRelations`, `deselectAllRelations`, `toggleRubric`, `selectAllRubrics`, `deselectAllRubrics`, `changeFilterMode` | — | — |
| `relationHint` | function | 16409 | 11 | (typeId) | `RELATION_HINTS`×2, `LAYER_NAMES`×2, `relationTypesObj`, `links` | `generateConceptEditContent`×2, `generateConnectionEditContent`×2, `generateConnectionVisualization`×2, `initFilters` | — | — |
| `initFilters` | function | 16422 | 79 | () | `traditions`, `philosophers`, `rubrics`, `philosopherConcepts`, `relationTypesObj`, `relationHint` | `stmt032`, `stmt039` | — | — |
| `togglePhilosopher` | function | 16503 | 8 | (philosopher) | `selectedPhilosophers`×3, `applyFilters` | — | динам.×1 | — |
| `toggleTradition` | function | 16513 | 5 | (traditionId) | `selectedTraditions`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllTraditions` | function | 16519 | 8 | () | `traditions`×2, `selectedTraditions`, `applyFilters` | — | статич.×1 | — |
| `deselectAllTraditions` | function | 16528 | 8 | () | `traditions`, `selectedTraditions`, `applyFilters` | — | статич.×1 | — |
| `traditionMembers` | function | 16540 | 4 | (traditionId) | `philosophers` | `onlyTradition`, `addTradition` | — | — |
| `syncPhilosopherCheckboxes` | function | 16545 | 6 | () | `philosopherConcepts`, `selectedPhilosophers` | `onlyTradition`, `addTradition` | — | — |
| `onlyTradition` | function | 16552 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `addTradition` | function | 16558 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `toggleRelation` | function | 16565 | 8 | (relationType) | `selectedRelations`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllPhilosophers` | function | 16575 | 7 | () | `philosopherConcepts`×2, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `deselectAllPhilosophers` | function | 16584 | 7 | () | `philosopherConcepts`, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `selectAllRelations` | function | 16593 | 7 | () | `relationTypesObj`×2, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRelations` | function | 16602 | 7 | () | `relationTypesObj`, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `toggleRubric` | function | 16611 | 8 | (rubricId) | `selectedRubrics`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllRubrics` | function | 16621 | 7 | () | `rubrics`×2, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRubrics` | function | 16630 | 7 | () | `rubrics`, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `toggleSection` | function | 16642 | 42 | (sectionId) | — | — | статич.×4 | — |
| `changeFilterMode` | function | 16686 | 4 | (mode) | `filterMode`, `applyFilters` | — | статич.×1 | — |
| `toggleUniformLinkWidth` | function | 16692 | 8 | () | `renderState`, `uniformLinkWidthActive`, `updateArrows` | — | статич.×1 | — |
| `updatePhilosopherDimming` | function | 16704 | 12 | () | `philosopherConcepts`, `philosopherPassesTraditions` | `stmt034` | — | — |
| `updateFilterStats` | function | 16718 | 11 | () | `nodes`×2, `links`×2, `visibleNodeIds`×2, `visibleLinkSet`×2 | `stmt033`, `stmt036`, `stmt059` | — | — |
| `metricsLinks` | function | 16746 | 1 | () | `links`, `metricsLinkSource` | `buildGlobalGraphCache` | — | — |
| `metricsNodes` | function | 16747 | 1 | () | `nodes`, `metricsNodeSource` | `buildGlobalGraphCache` | — | — |
| `transformForScope` | function | 16755 | 9 | (list, useWeights, useDirection) | — | `initializePhilosophyMetrics`×2, `applyMetricsScope` | — | — |
| `effectiveScopeFlags` | function | 16768 | 8 | (viewName) | `useWeightedPaths`×2, `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC`, `currentStatsView` | `initializePhilosophyMetrics`×2, `applyMetricsScope` | — | — |
| `applyMetricsScope` | function | 16786 | 30 | (viewName) | `metricsScopeActive`×3, `lastScopeKey`×2, `metricsScope`×2, `nodes`, `links`, `metricsLinkSource`, `metricsNodeSource`, `transformForScope`, `effectiveScopeFlags`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `metricScopeFactor` | function | 16903 | 9 | (metricName) | `respectDirection`, `metricsScopeActive`, `METRIC_FLAGS` | `installMetricScopeWrappers` | — | — |
| `installMetricScopeWrappers` | function | 16920 | 18 | () | `METRIC_FLAGS`, `metricScopeFactor` | `openStatsModal` | — | — |
| `updateScopeToggles` | function | 16941 | 33 | (viewName) | `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `buildGlobalGraphCache` | function | 16975 | 105 | () | `graphCache`×3, `metricsScopeActive`×2, `isSymmetricLink`, `useWeightedPaths`, `respectDirection`, `metricsLinks`, `metricsNodes` | `calculateBetweennessAsync`, `calculatePageRank`, `bfsFromSource`, `calculateClosenessCentrality`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateRichClubCoefficient`, `calculateWeightedDegree`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents` | — | — |
| `calculateBetweennessAsync` | async function | 17089 | 152 | (progressCallback) | `nodes`×6, `respectDirection`×3, `betweennessCache`×3, `betweennessCalculating`×3, `useWeightedPaths`, `buildGlobalGraphCache` | `calculateBetweenness`, `runSingleMetric` | — | — |
| `calculateBetweenness` | function | 17243 | 10 | () | `betweennessCache`×2, `betweennessCalculating`, `calculateBetweennessAsync` | — | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateBetweennessCache` | function | 17255 | 4 | () | `betweennessCache`, `betweennessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculatePageRank` | function | 17268 | 111 | (iterations=…, dampingFactor=…, progressCallback=…) | `nodes`×7, `respectDirection`×4, `useWeightedPaths`×3, `pageRankCache`×3, `pageRankCalculating`×3, `buildGlobalGraphCache` | `runSingleMetric` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePageRankCache` | function | 17380 | 4 | () | `pageRankCache`, `pageRankCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `bfsFromSource` | function | 17394 | 41 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `calculateClosenessCentrality` | async function | 17440 | 68 | (progressCallback=…) | `nodes`×4, `closenessCache`×3, `closenessCalculating`×3, `useWeightedPaths`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource` | `runSingleMetric` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateClosenessCache` | function | 17509 | 4 | () | `closenessCache`, `closenessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculateClusteringCoefficient` | function | 17521 | 46 | () | `clusteringCache`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion` | — | 1× (ключ объекта) в `METRIC_FLAGS` |
| `invalidateClusteringCache` | function | 17568 | 3 | () | `clusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedClustering` | function | 17585 | 74 | () | `weightedClusteringCache`×3, `nodes`, `buildGlobalGraphCache` | `runSingleMetric` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateWeightedClusteringCache` | function | 17660 | 3 | () | `weightedClusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateLocalCohesion` | function | 17668 | 29 | () | `localCohesionCache`×3, `calculateClusteringCoefficient`, `calculateWeightedDegree` | `runSingleMetric` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateLocalCohesionCache` | function | 17698 | 3 | () | `localCohesionCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateRichClubCoefficient` | function | 17706 | 61 | () | `richClubCache`×3, `nodes`×2, `buildGlobalGraphCache` | `runSingleMetric` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateRichClubCache` | function | 17768 | 3 | () | `richClubCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedDegree` | function | 17776 | 52 | () | `useWeightedPaths`×3, `respectDirection`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion`, `generateDegreeContent` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `dijkstraFromSource` | function | 17835 | 47 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `invalidateGraphCache` | function | 17896 | 1 | () | `graphCache` | `invalidateEverythingForScope`×2, `applyMetricsScope`, `closeStatsModal` | — | — |
| `calculateEigenvectorCentrality` | async function | 17902 | 77 | (iterations=…, progressCallback=…) | `nodes`×4, `eigenvectorCache`×3, `eigenvectorCalculating`×3, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `runSingleMetric` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateEigenvectorCache` | function | 17980 | 4 | () | `eigenvectorCache`, `eigenvectorCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `findConnectedComponents` | function | 17989 | 34 | () | `nodes`, `respectDirection`, `buildGlobalGraphCache` | — | — | — |
| `isReflexiveLink` | function | 18042 | 5 | (r) | — | `buildIncomingLinks`, `buildOutgoingLinks`, `renderScene`, `repaintPickCanvas`, `stmt021`, `connectionIntegrityWarnings`, `deleteConnection`, `generateConceptEditContent`, `updateConnEditPairNote`, `connectionArrowSvg`, `generateConnectionVisualization` | — | — |
| `reflexiveLinkOf` | function | 18050 | 8 | (conceptId) | `_relations` | `foundationalIndex`, `tensionIndex`, `conceptualComplexityIndex` | — | — |
| `buildIncomingLinks` | function | 18059 | 14 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `buildOutgoingLinks` | function | 18074 | 17 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `initializeMetricsData` | function | 18093 | 9 | (conceptsData, relationsData, philosophersData) | `_concepts`×2, `_philosophers`×2, `_relations`, `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `buildIncomingLinks`, `buildOutgoingLinks` | `initializePhilosophyMetrics` | — | — |
| `problemGenerationIndex` | function | 18111 | 106 | (conceptId) | `_incomingLinks`, `_outgoingLinks` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateProblemGenerationContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateProblemGenerationIndexCache` | function | 18218 | 3 | () | `problemGenerationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `criticalPowerIndex` | function | 18226 | 174 | (conceptId) | `_conceptMap`×5, `_philosopherMap`×4, `_incomingLinks`×2, `_outgoingLinks`×2 | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCriticalPowerContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateCriticalPowerIndexCache` | function | 18401 | 3 | () | `criticalPowerIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `revolutionaryIndex` | function | 18409 | 123 | (conceptId) | `_conceptMap`×6, `_philosopherMap`×4, `_incomingLinks`×2, `conceptToRubrics`, `_outgoingLinks` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateRevolutionaryContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateRevolutionaryIndexCache` | function | 18533 | 3 | () | `revolutionaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `paradigmShiftIndex` | function | 18540 | 48 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×2, `_incomingLinks`, `_outgoingLinks`, `sumWeight` | `similarityData`, `METRIC_COVERAGE_FN`, `generateParadigmShiftContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateParadigmShiftIndexCache` | function | 18589 | 3 | () | `paradigmShiftIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `influenceIndex` | function | 18596 | 103 | (conceptId) | `_conceptMap`×4, `_philosopherMap`×4, `influenceScope`×2, `linkInInfluenceScope`×2, `_incomingLinks`, `_outgoingLinks`, `INFLUENCE_SCOPE_LABELS`, `generativity` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInfluenceContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInfluenceIndexCache` | function | 18700 | 3 | () | `influenceIndexCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `setInfluenceScope` | function | 18712 | 10 | (scope) | `influenceScope`×2, `известить`, `invalidateInfluenceIndexCache`, `generateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `INFLUENCE_SCOPE_LABELS` | — | динам.×1 | — |
| `influenceScopeSwitcher` | function | 18723 | 14 | () | `influenceScope`×2, `INFLUENCE_SCOPE_LABELS` | `generateInfluenceContent`, `generatePhilosopherProfileContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `sumWeight` | function | 18760 | 3 | (links) | — | `foundationalIndex`×4, `dialogicalIndex`×4, `transformationIndex`×3, `conceptualFertilityIndex`×3, `syntheticIndex`×2, `internalCoherenceIndex`×2, `abstractionIndex`×2, `paradigmShiftIndex`, `instrumentalIndex`, `deductiveIndex` | — | — |
| `otherPhilosopher` | function | 18765 | 4 | (r, conceptId) | `_conceptMap`, `_philosopherMap` | `dialogicalIndex`, `conceptualContinuityIndex` | — | — |
| `foundationalIndex` | function | 18770 | 42 | (conceptId) | `sumWeight`×4, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateFoundationalContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateFoundationalIndexCache` | function | 18813 | 3 | () | `foundationalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `syntheticIndex` | function | 18820 | 66 | (conceptId) | `_conceptMap`×4, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateSyntheticContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateSyntheticIndexCache` | function | 18887 | 3 | () | `syntheticIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `dialogicalIndex` | function | 18894 | 40 | (conceptId) | `sumWeight`×4, `_incomingLinks`, `_outgoingLinks`, `otherPhilosopher` | `similarityData`, `METRIC_COVERAGE_FN`, `generateDialogicalContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDialogicalIndexCache` | function | 18935 | 3 | () | `dialogicalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `internalCoherenceIndex` | function | 18942 | 48 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_concepts`, `_incomingLinks`, `_outgoingLinks` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCoherenceContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInternalCoherenceIndexCache` | function | 18991 | 3 | () | `internalCoherenceIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `tensionScales` | function | 19020 | 23 | () | `_tensionScales`×4, `_tensionScalesComputing`×3, `_concepts`, `tensionIndex` | — | — | — |
| `invalidateTensionScales` | function | 19044 | 3 | () | `_tensionScales` | `invalidateAllMetricsCaches` | — | — |
| `tensionIndex` | function | 19049 | 200 | (conceptId) | `isSymmetricLink`, `_conceptMap`, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `tensionScales`, `METRIC_COVERAGE_FN`, `generateTensionContent`, `PROFILE_METRICS` | — | 3× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `toggleMetricVisualization` |
| `invalidateTensionIndexCache` | function | 19250 | 3 | () | `tensionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherProfile` | function | 19257 | 42 | (philosopherId) | `_concepts`, `revolutionaryIndex`, `influenceIndex`, `internalCoherenceIndex`, `instrumentalIndex`, `deductiveIndex` | `renderPhilosopherComparison`×3, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherProfileContent` | — | — |
| `invalidatePhilosopherProfileCache` | function | 19300 | 3 | () | `philosopherProfileCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherSystematicIndex` | function | 19307 | 55 | (philosopherId) | `_concepts`, `_relations`, `SYSTEMATIC_TYPES`, `DISRUPTIVE_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherSystematicContent` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherSystematicIndexCache` | function | 19363 | 3 | () | `philosopherSystematicIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherHistoricalReachIndex` | function | 19370 | 59 | (philosopherId) | `_philosopherMap`×2, `_concepts`, `_relations`, `_conceptMap`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherReachContent` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherHistoricalReachIndexCache` | function | 19430 | 3 | () | `philosopherHistoricalReachIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherInterdisciplinaryIndex` | function | 19437 | 48 | (philosopherId) | `_conceptMap`×2, `_concepts`, `_relations` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherInterdisciplinaryContent` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherInterdisciplinaryIndexCache` | function | 19486 | 3 | () | `philosopherInterdisciplinaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `temporalInfluencePattern` | function | 19493 | 57 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `_incomingLinks`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `generateTemporalInfluenceContent` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTemporalInfluencePatternCache` | function | 19551 | 3 | () | `temporalInfluencePatternCache` | `invalidateAllMetricsCaches` | — | — |
| `generateRankings` | function | 19558 | 31 | () | `generateRankingsCache`×2, `metricValueMode`×2, `generateRankingsMode`×2, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `applyMetricMode` | `generateConceptRankingsContent` | — | — |
| `invalidateGenerateRankingsCache` | function | 19590 | 3 | () | `generateRankingsCache` | `invalidateAllMetricsCaches` | — | — |
| `generatePhilosopherRankings` | function | 19600 | 89 | () | `generatePhilosopherRankingsCache`×3, `_concepts`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `generatePhilosopherRankingsContent` | — | — |
| `invalidateGeneratePhilosopherRankingsCache` | function | 19690 | 3 | () | `generatePhilosopherRankingsCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `transformationIndex` | function | 19701 | 31 | (conceptId) | `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateTransformationContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateTransformationIndexCache` | function | 19733 | 3 | () | `transformationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualFertilityIndex` | function | 19740 | 49 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×3, `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateFertilityContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualFertilityIndexCache` | function | 19790 | 3 | () | `conceptualFertilityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualComplexityIndex` | function | 19797 | 47 | (conceptId) | `_conceptMap`×2, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `similarityData`, `METRIC_COVERAGE_FN`, `generateComplexityContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualComplexityIndexCache` | function | 19845 | 3 | () | `conceptualComplexityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualContinuityIndex` | function | 19856 | 63 | (conceptId) | `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `otherPhilosopher` | `similarityData`, `METRIC_COVERAGE_FN`, `generateContinuityContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualContinuityIndexCache` | function | 19920 | 3 | () | `conceptualContinuityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `medianNodeDegree` | function | 19946 | 12 | () | `_medianDegreeCache`×4, `_concepts`, `_relations` | `profileIsMeaningful`, `similarConceptsBlock` | — | — |
| `nodeDegreeOf` | function | 19958 | 7 | (conceptId) | `_relations` | `profileIsMeaningful`, `similarConceptsBlock` | — | — |
| `profileIsMeaningful` | function | 19966 | 3 | (conceptId) | `medianNodeDegree`, `nodeDegreeOf` | `nearestConcepts`×2 | — | — |
| `similarityData` | function | 19971 | 48 | () | `_simCache`×4, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `abstractionIndex`, `deductiveIndex` | `allConceptPairsAsync`, `profileSimilarity`, `nearestConcepts`, `generateComparisonContent`, `renderComparison` | — | — |
| `invalidateSimilarityCache` | function | 20020 | 6 | () | `_simCache`, `_pairCache`, `_pairCalculating`, `invalidatePhilosopherSimilarityCache` | `invalidateAllMetricsCaches` | — | — |
| `allConceptPairs` | function | 20035 | 3 | () | `_pairCache` | `renderClosestPairs` | — | — |
| `allConceptPairsAsync` | async function | 20044 | 55 | (progressCallback) | `_pairCache`×4, `_pairCalculating`×3, `similarityData`, `PAIRS_CHUNK_ROWS`, `neighborSets` | `renderClosestPairs` | — | — |
| `profileSimilarity` | function | 20100 | 9 | (idA, idB) | `similarityData` | `nearestConcepts`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `neighborSets` | function | 20113 | 12 | () | `_neighborCache`×3, `_concepts`, `_relations` | `allConceptPairsAsync`, `structuralSimilarity` | — | — |
| `typeProfileOf` | function | 20126 | 7 | (conceptId) | `_incomingLinks`, `_outgoingLinks` | `structuralSimilarity`×2 | — | — |
| `structuralSimilarity` | function | 20134 | 22 | (idA, idB) | `typeProfileOf`×2, `neighborSets` | `nearestConcepts`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `nearestConcepts` | function | 20157 | 51 | (conceptId, kind, k) | `profileIsMeaningful`×2, `similarityData`, `profileSimilarity`, `structuralSimilarity` | `similarConceptsBlock`×2 | — | — |
| `rubricUnionSize` | function | 20236 | 5 | (v1, v2) | — | `philosopherSimilarity` | — | — |
| `philosopherSimilarityData` | function | 20243 | 84 | () | `_concepts`×4, `_philSimCache`×4, `_relations`×3, `_conceptMap`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `philosopherSimilarity`, `nearestPhilosophers`, `generatePhilosopherComparisonContent`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `invalidatePhilosopherSimilarityCache` | function | 20328 | 1 | () | `_philSimCache` | `invalidateSimilarityCache` | — | — |
| `cosineOf` | function | 20330 | 5 | (a, b) | — | `philosopherSimilarity`×3 | — | — |
| `philosopherSimilarity` | function | 20336 | 20 | (a, b, kind) | `cosineOf`×3, `PHIL_SIM_MIN_CONCEPTS`×2, `PHIL_SIM_MIN_RUBRIC_UNION`, `rubricUnionSize`, `philosopherSimilarityData` | `nearestPhilosophers`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `nearestPhilosophers` | function | 20357 | 12 | (philosopherId, kind, k) | `philosopherSimilarityData`, `philosopherSimilarity` | `similarPhilosophersBlock`×3 | — | — |
| `sameTraditionPhil` | function | 20390 | 6 | (a, b) | `_philosopherMap`×2 | `linkInInfluenceScope`, `generativityScores` | — | — |
| `linkInInfluenceScope` | function | 20399 | 8 | (r, ownPhilosopher, scope) | `_conceptMap`×2, `influenceScope`×2, `sameTraditionPhil` | `influenceIndex`×2 | — | — |
| `generativityScores` | function | 20416 | 42 | (scope) | `_generativityCacheByScope`×3, `_conceptMap`×2, `_concepts`, `_relations`, `sameTraditionPhil`, `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS` | `generativity` | — | — |
| `generativity` | function | 20459 | 3 | (conceptId, scope) | `generativityScores` | `influenceIndex`, `generativeIndex` | — | — |
| `invalidateGenerativityCache` | function | 20463 | 3 | () | `_generativityCacheByScope` | `invalidateAllMetricsCaches` | — | — |
| `generativeIndex` | function | 20469 | 23 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `generativity` | `similarityData`, `METRIC_COVERAGE_FN`, `generateGenerativeContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `instrumentalIndex` | function | 20509 | 25 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `sumWeight` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInstrumentalContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `traditionBridgingIndex` | function | 20561 | 54 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `_incomingLinks`, `_outgoingLinks`, `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF` | `METRIC_COVERAGE_FN`, `generateBridgingContent`, `PROFILE_METRICS` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTraditionBridgingCache` | function | 20616 | 3 | () | `traditionBridgingCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateInstrumentalIndexCache` | function | 20620 | 3 | () | `instrumentalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `abstractionIndex` | function | 20631 | 23 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateAbstractionContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateAbstractionIndexCache` | function | 20655 | 3 | () | `abstractionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `deductiveDepth` | function ⟲ | 20672 | 12 | (conceptId, seen) | `_outgoingLinks` | `deductiveIndex` | — | 1× (ключ объекта) в `METRIC_FLAGS` |
| `deductiveIndex` | function | 20685 | 28 | (conceptId) | `deductiveIndexCache`×3, `_conceptMap`×2, `_outgoingLinks`, `sumWeight`, `deductiveDepth` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateDeductiveContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDeductiveIndexCache` | function | 20714 | 3 | () | `deductiveIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateAllMetricsCaches` | function | 20719 | 30 | () | `invalidateProblemGenerationIndexCache`, `invalidateCriticalPowerIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateInfluenceIndexCache`, `invalidateFoundationalIndexCache`, `invalidateSyntheticIndexCache`, `invalidateDialogicalIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateTensionScales`, `invalidateTensionIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidateTemporalInfluencePatternCache`, `invalidateGenerateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `invalidateTransformationIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateSimilarityCache`, `invalidateGenerativityCache`, `invalidateTraditionBridgingCache`, `invalidateInstrumentalIndexCache`, `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache` | `invalidateEverythingForScope` | — | — |
| `metricsScopeCounts` | function | 20757 | 10 | () | `nodes`×2, `links`×2, `isNodeVisible`, `metricsScope` | `updateMetricsScopeHint`, `showConceptProfileModal` | — | — |
| `updateMetricsScopeHint` | function | 20768 | 6 | () | `metricsScopeCounts` | `refreshMetricsIfScoped`, `handleMetricsScopeChange`, `openStatsModal` | — | — |
| `invalidateEverythingForScope` | function | 20777 | 14 | () | `invalidateBetweennessCache`×2, `invalidatePageRankCache`×2, `invalidateClosenessCache`×2, `invalidateClusteringCache`×2, `invalidateWeightedClusteringCache`×2, `invalidateLocalCohesionCache`×2, `invalidateRichClubCache`×2, `invalidateGraphCache`×2, `invalidateEigenvectorCache`×2, `_medianDegreeCache`, `invalidateAllMetricsCaches`, `invalidateMetricCoverageCache` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `closeStatsModal`, `stmt035` | — | — |
| `handleMetricsScopeChange` | function | 20792 | 8 | () | `известить`, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | — | статич.×1 | — |
| `initializePhilosophyMetrics` | function | 20805 | 68 | () | `nodes`×2, `links`×2, `transformForScope`×2, `effectiveScopeFlags`×2, `metricsScope`×2, `philosophers`, `isNodeVisible`, `initializeMetricsData` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `openStatsModal`, `closeStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `stmt035`, `stmt060` | — | — |
| `getMetricDescription` | function | 21340 | 12 | (metricKey) | `metricDescriptions` | `generateMetricDescriptionBlock` | — | — |
| `openStatsModal` | function | 21361 | 38 | () | `currentStatsView`×4, `concepts`, `relations`, `useWeightedPaths`, `respectDirection`, `applyMetricsScope`, `installMetricScopeWrappers`, `updateScopeToggles`, `metricsScope`, `updateMetricsScopeHint`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `updateActiveNavItem`, `loadStatsContent`, `freezeSimulation` | `calculateMetricFromModal`×2 | статич.×1, динам.×1 | — |
| `closeStatsModal` | function | 21401 | 30 | () | `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `metricsLinkSource`, `metricsNodeSource`, `metricsScopeActive`, `lastScopeKey`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `unfreezeSimulation` | `stmt010`, `stmt052` | статич.×1 | — |
| `handleStatsParameterChange` | function | 21433 | 31 | () | `currentStatsView`×3, `useWeightedPaths`, `respectDirection`, `applyMetricsScope`, `updateScopeToggles`, `loadStatsContent`, `resetNodeSizes` | — | статич.×2 | — |
| `switchStatsView` | function | 21466 | 15 | (viewName, event) | `applyMetricsScope`, `updateScopeToggles`, `currentStatsView`, `updateActiveNavItem`, `loadStatsContent` | `calculateMetricFromModal`, `stmt045` | статич.×39, динам.×1 | — |
| `updateActiveNavItem` | function | 21483 | 10 | (viewName) | — | `openStatsModal`, `switchStatsView`, `calculateMetricFromModal` | — | — |
| `loadStatsContent` | function | 21495 | 68 | (viewName) | `renderPhilosopherComparison`×2, `renderPhilosopherPairs`×2, `renderClosestPairs`×2, `renderComparison`×2, `applyMetricLayout`, `generateOverviewContent`, `generateDegreeContent`, `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView`, `stmt042`, `stmt058` | — | — |
| `calculateMetricFromModal` | async function | 21581 | 29 | (metricKey) | `isStatsModalOpen`×2, `openStatsModal`×2, `switchStatsView`, `updateActiveNavItem`, `runSingleMetric` | — | динам.×1 | — |
| `стрелкаСвязи` | function | 21630 | 18 | (глиф, цвет, вес, подпись, ещё, откуда, куда) | `WEIGHT_WORDS` | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2, `generateConceptEditContent` | — | — |
| `philosopherBirth` | function | 21652 | 4 | (nameRu) | `philosophers` | `generatePhilosopherViewContent`×3, `sortPhilosophersByBirth`×2, `connectionIntegrityWarnings`×2 | — | — |
| `formatBirthYear` | function | 21658 | 3 | (b) | — | `generatePhilosopherViewContent`×3 | — | — |
| `sortPhilosophersByBirth` | function | 21661 | 3 | (list) | `philosopherBirth`×2 | `generatePhilosopherViewContent`×3, `generateConceptEditContent` | — | — |
| `philosopherYears` | function | 21664 | 4 | (nameRu) | `philosophers` | `generatePhilosopherViewContent`×3, `connectionIntegrityWarnings`×2, `generateConceptEditContent` | — | — |
| `getContrastColor` | function | 21683 | 18 | (hexColor) | — | `generatePhilosopherViewContent`×4, `showPathDescriptionsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `updatePhilColorSample`, `conceptPlate`, `generateConceptViewContent` | — | — |
| `ambiguousLabels` | function | 21709 | 7 | () | `_ambiguousLabels`×4, `nodes` | `labelWithAuthor` | — | — |
| `labelWithAuthor` | function | 21717 | 4 | (node) | `ambiguousLabels` | `stmt020` | — | — |
| `conceptDegreeForNorm` | function | 21730 | 8 | (conceptId) | `_relations` | `normalizeMetricValue` | — | — |
| `normalizeMetricValue` | function | 21738 | 4 | (conceptId, value) | `conceptDegreeForNorm` | `applyMetricMode` | — | — |
| `applyMetricMode` | function | 21742 | 5 | (conceptId, value) | `metricValueMode`, `normalizeMetricValue` | `generateMetricResults`×3, `generateRankings` | — | — |
| `toggleMetricValueMode` | function | 21747 | 5 | () | `metricValueMode`×2, `известить`, `generateRankingsCache` | — | динам.×2 | — |
| `metricCoverage` | function | 21777 | 16 | (metricKey) | `_metricCoverageCache`×3, `_concepts`×2, `METRIC_COVERAGE_FN` | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` | — | — |
| `invalidateMetricCoverageCache` | function | 21793 | 1 | () | `_metricCoverageCache` | `invalidateEverythingForScope` | — | — |
| `generateMetricCoverageBlock` | function | 21795 | 12 | (metricKey) | `METRIC_COVERAGE_WARN`, `metricCoverage` | `generateMetricResults`×2 | — | — |
| `generateMetricDescriptionBlock` | function | 21808 | 39 | (metricKey) | `getMetricDescription` | `generateMetricResults`×2, `generateCalculateButton`, `generateOverviewContent`, `generateDegreeContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `generateCalculateButton` | function | 21849 | 18 | (metricName, metricKey, description) | `generateMetricDescriptionBlock` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent` | — | — |
| `rankKeep` | function | 21885 | 6 | (r, i) | `lastZeroCount`×2 | `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateContinuityContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent` | — | — |
| `genericDetailsHTML` | function | 21961 | 55 | (item, conceptDesc) | `METRIC_FIELD_LABELS`×5 | `generateMetricResults` | — | — |
| `applyMetricLayout` | function | 22027 | 13 | () | `metricLayoutMode` | `loadStatsContent`, `toggleMetricLayout` | — | — |
| `toggleMetricLayout` | function | 22041 | 5 | () | `metricLayoutMode`×3, `applyMetricLayout` | — | динам.×1 | — |
| `generateMetricResults` | function | 22047 | 136 | (data, title, description, metricKey, valueKey, isDecimal, options=…) | `metricValueMode`×4, `METRIC_COVERAGE_FN`×4, `metricLayoutMode`×4, `applyMetricMode`×3, `generateMetricCoverageBlock`×2, `generateMetricDescriptionBlock`×2, `lastZeroCount`×2, `genericDetailsHTML` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent` | — | — |
| `toggleMetricDetails` | function | 22187 | 21 | (button) | — | — | динам.×1 | — |
| `generateOverviewContent` | function | 22217 | 36 | () | `nodes`×4, `links`×3, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generateDegreeContent` | function | 22254 | 64 | () | `useWeightedPaths`, `respectDirection`, `calculateWeightedDegree`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePageRankContent` | function | 22319 | 15 | () | `pageRankCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBetweennessContent` | function | 22335 | 15 | () | `betweennessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateClosenessContent` | function | 22351 | 15 | () | `closenessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateEigenvectorContent` | function | 22367 | 15 | () | `eigenvectorCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateWeightedClusteringContent` | function | 22383 | 15 | () | `weightedClusteringCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateLocalCohesionContent` | function | 22399 | 15 | () | `localCohesionCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRichClubContent` | function | 22415 | 15 | () | `richClubCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateProblemGenerationContent` | function | 22435 | 23 | () | `concepts`, `relations`, `nodes`, `problemGenerationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCriticalPowerContent` | function | 22459 | 23 | () | `concepts`, `relations`, `nodes`, `criticalPowerIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRevolutionaryContent` | function | 22483 | 23 | () | `concepts`, `relations`, `nodes`, `revolutionaryIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateParadigmShiftContent` | function | 22507 | 23 | () | `concepts`, `relations`, `nodes`, `paradigmShiftIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInfluenceContent` | function | 22531 | 23 | () | `concepts`, `relations`, `nodes`, `influenceIndex`, `influenceScopeSwitcher`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFoundationalContent` | function | 22555 | 23 | () | `concepts`, `relations`, `nodes`, `foundationalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateSyntheticContent` | function | 22579 | 23 | () | `concepts`, `relations`, `nodes`, `syntheticIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDialogicalContent` | function | 22603 | 23 | () | `concepts`, `relations`, `nodes`, `dialogicalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCoherenceContent` | function | 22627 | 23 | () | `concepts`, `relations`, `nodes`, `internalCoherenceIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTensionContent` | function | 22652 | 195 | () | `concepts`, `relations`, `nodes`, `tensionIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generatePhilosopherComparisonContent` | function | 22874 | 32 | () | `_pcmpA`×3, `_pcmpB`×3, `concepts`, `relations`, `philosopherSimilarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `renderPhilosopherComparison` | function | 22907 | 63 | () | `philosopherProfile`×3, `philosopherSimilarityData`, `philosopherSimilarity`, `_pcmpA`, `_pcmpB`, `PHIL_SIM_LABELS` | `loadStatsContent`×2 | динам.×2 | — |
| `generatePhilosopherPairsContent` | function | 22973 | 21 | () | `concepts`, `relations`, `_concepts`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `PHIL_SIM_LABELS` | `loadStatsContent` | — | — |
| `renderPhilosopherPairs` | function | 22995 | 33 | () | `_philPairsKind`×3, `PHIL_SIM_LABELS`×2, `philosopherSimilarityData`, `philosopherSimilarity` | `loadStatsContent`×2 | динам.×1 | — |
| `openPhilosopherPair` | function | 23029 | 4 | (a, b) | `известить`, `_pcmpA`, `_pcmpB` | — | динам.×1 | — |
| `generateClosestPairsContent` | function | 23034 | 40 | () | `_pairsMinDegree`×2, `_pairsMinShared`×2, `concepts`, `relations`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent` | — | — |
| `renderClosestPairs` | async function | 23075 | 96 | () | `_pairsMinDegree`×3, `nodes`×2, `philosopherTraditions`×2, `_concepts`×2, `_pairsMinShared`×2, `LoadingIndicator`, `_pairCalculating`, `allConceptPairs`, `allConceptPairsAsync`, `_pairsKind`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent`×2 | динам.×6 | — |
| `openPairInComparison` | function | 23172 | 4 | (a, b) | `известить`, `_cmpA`, `_cmpB` | — | динам.×1 | — |
| `generateComparisonContent` | function | 23177 | 48 | () | `_cmpA`×3, `_cmpB`×3, `concepts`, `relations`, `nodes`, `similarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `renderComparison` | function | 23226 | 62 | () | `_cmpA`×4, `_cmpB`×4, `nodes`×2, `_concepts`, `SIM_METRIC_LABELS`, `similarityData`, `profileSimilarity`, `structuralSimilarity` | `loadStatsContent`×2, `stmt044` | — | — |
| `generateGenerativeContent` | function | 23289 | 19 | () | `concepts`, `relations`, `nodes`, `generativeIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInstrumentalContent` | function | 23309 | 19 | () | `concepts`, `relations`, `nodes`, `instrumentalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBridgingContent` | function | 23329 | 28 | () | `concepts`, `relations`, `nodes`, `traditionBridgingIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateAbstractionContent` | function | 23358 | 21 | () | `concepts`, `relations`, `nodes`, `abstractionIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDeductiveContent` | function | 23380 | 19 | () | `concepts`, `relations`, `nodes`, `deductiveIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTransformationContent` | function | 23400 | 23 | () | `concepts`, `relations`, `nodes`, `transformationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFertilityContent` | function | 23424 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualFertilityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateComplexityContent` | function | 23448 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualComplexityIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateContinuityContent` | function | 23472 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualContinuityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTemporalInfluenceContent` | function | 23496 | 53 | () | `concepts`, `relations`, `nodes`, `temporalInfluencePattern`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherProfileContent` | function | 23554 | 42 | () | `concepts`, `relations`, `nodes`, `influenceScopeSwitcher`, `philosopherProfile`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherSystematicContent` | function | 23597 | 38 | () | `concepts`, `relations`, `nodes`, `philosopherSystematicIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherReachContent` | function | 23636 | 37 | () | `concepts`, `relations`, `nodes`, `philosopherHistoricalReachIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generatePhilosopherInterdisciplinaryContent` | function | 23674 | 40 | () | `concepts`, `relations`, `nodes`, `philosopherInterdisciplinaryIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generateConceptRankingsContent` | function | 23719 | 77 | () | `metricValueMode`×3, `concepts`, `relations`, `influenceScopeSwitcher`, `generateRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherRankingsContent` | function | 23797 | 51 | () | `concepts`, `relations`, `influenceScopeSwitcher`, `generatePhilosopherRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `updateVisualizationControlSection` | function | 23860 | 40 | () | `currentVisualizedMetric`×3, `isVisualizingBySize` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `saveOriginalRadii` | function | 23902 | 11 | () | `originalRadii`×3, `nodes`, `originalTextDy` | `visualizeMetricBySize`, `stmt012`, `stmt066` | — | — |
| `toggleMetricVisualization` | function | 23915 | 132 | (metricKey) | `nodes`×2, `links`×2, `concepts`, `relations`, `известить`, `betweennessCache`, `pageRankCache`, `closenessCache`, `weightedClusteringCache`, `localCohesionCache`, `richClubCache`, `eigenvectorCache`, `isStatsModalOpen`, `isVisualizingBySize`, `currentVisualizedMetric`, `visualizeMetricBySize`, `resetNodeSizes` | — | динам.×2 | — |
| `updateVisualizationButtonText` | function | 24049 | 16 | (metricKey) | `isVisualizingBySize`, `currentVisualizedMetric` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `visualizeMetricBySize` | function | 24067 | 110 | (metricData, metricName) | `gfxNode`×2, `nodes`, `isVisualizingBySize`, `currentVisualizedMetric`, `updateVisualizationControlSection`, `saveOriginalRadii`, `updateVisualizationButtonText`, `arrowMode`, `arrowRadius`, `updateArrows` | `toggleMetricVisualization` | — | — |
| `resetNodeSizes` | function | 24179 | 39 | () | `isVisualizingBySize`×2, `currentVisualizedMetric`×2, `gfxNode`×2, `originalRadii`, `originalTextDy`, `updateVisualizationControlSection`, `updateVisualizationButtonText`, `arrowMode`, `arrowRadius`, `updateArrows` | `handleStatsParameterChange`, `toggleMetricVisualization` | статич.×1 | — |
| `showProgress` | function | 24231 | 11 | (label, percent) | — | `runSingleMetric`×12 | — | — |
| `hideProgress` | function | 24244 | 4 | () | — | `runSingleMetric`×2 | — | — |
| `runSingleMetric` | async function | 24250 | 73 | (metricName) | `showProgress`×12, `hideProgress`×2, `calculateBetweennessAsync`, `calculatePageRank`, `calculateClosenessCentrality`, `calculateWeightedClustering`, `calculateLocalCohesion`, `calculateRichClubCoefficient`, `calculateEigenvectorCentrality` | `calculateMetricFromModal` | — | — |
| `highlightNodeById` | function | 24325 | 18 | (nodeId) | `selectedNodes`×2, `nodes`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected` | — | динам.×4 | — |
| `exportToPNG` | function | 24345 | 35 | () | `showTemporaryMessage`×2, `viewWidth`, `viewHeight`, `renderState`, `renderScene` | — | статич.×1 | — |
| `exportToSVG` | function | 24384 | 74 | () | `hasNodeClass`×6, `viewWidth`×3, `viewHeight`×3, `nodes`×2, `isNodeVisible`×2, `selectedNodes`×2, `philosopherConcepts`, `relationTypesObj`, `isSymmetricLink`, `links`, `isLinkVisible`, `renderState`, `nodeRadius`, `nodeLabelDy`, `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`, `linkVisualState`, `linkDrawWidth`, `linkDrawAlpha`, `DRAW_ORDER` | — | статич.×1 | — |
| `handleLegendSearch` | function | 24463 | 12 | (query) | `отобратьКонцепции`, `displaySearchResults` | — | статич.×2 | — |
| `отобратьКонцепции` | function | 24488 | 20 | (query, pool) | `philosopherOrder`×2, `nodes` | `handleLegendLinkSearch`, `handleLegendSearch`, `searchNodes`, `handleModalSearch`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `внутренностиСтроки` | function | 24517 | 11 | (n, хвост) | `philosopherConcepts`×2 | `handleLegendLinkSearch`, `displaySearchResults`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `пустойСписок` | function | 24529 | 3 | (текст) | — | `handleLegendPhilSearch`, `handleLegendLinkSearch`, `показатьНайденныеСвязи`, `displaySearchResults`, `handlePhilosopherSearch`, `populateCustomSelect`, `handleConnectionEditSearch`, `handleConnectionViewSearch` | — | — |
| `searchNodes` | function | 24533 | 3 | (query) | `отобратьКонцепции` | — | — | — |
| `displaySearchResults` | function | 24537 | 23 | (results, container, context) | `isNodeVisible`, `внутренностиСтроки`, `пустойСписок` | `handleLegendSearch`, `handleModalSearch` | — | — |
| `selectSearchResult` | function | 24561 | 35 | (nodeId, context) | `selectedNodes`×2, `nodes`, `показанныеВопрекиОтбору`, `обновитьЗаметкуОбОтборе`, `showTemporaryMessage`, `isNodeVisible`, `applyFiltersImmediate`, `clearLegendSearch`, `clearModalSearch`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxZoom`, `highlightConnected`, `showDetailModal`, `pinnedVisibleNodes` | — | динам.×1 | — |
| `clearLegendSearch` | function | 24597 | 16 | () | — | `toggleLegendSearch`, `setSearchKind`, `selectSearchResult` | статич.×1 | — |
| `отобратьФилософов` | function | 24639 | 11 | (query) | `philosophers` | `handleLegendPhilSearch`, `handlePhilosopherSearch` | — | — |
| `handlePhilosopherSearch` | function | 24651 | 26 | (query) | `philosopherConcepts`×2, `concepts`, `пустойСписок`, `отобратьФилософов` | — | динам.×2 | — |
| `selectPhilosopherResult` | function | 24678 | 4 | (имя) | `clearPhilosopherSearch`, `openUniversalModal` | — | динам.×1 | — |
| `clearPhilosopherSearch` | function | 24683 | 8 | () | — | `selectPhilosopherResult` | динам.×1 | — |
| `handleModalSearch` | function | 24692 | 9 | (query) | `отобратьКонцепции`, `displaySearchResults` | — | динам.×2 | — |
| `clearModalSearch` | function | 24702 | 16 | () | — | `closeUniversalModal`×2, `selectSearchResult` | динам.×1 | — |
| `initializeCustomSelects` | function | 24726 | 16 | () | `populateCustomSelect`×2 | `stmt014` | — | — |
| `populateCustomSelect` | function | 24743 | 14 | (type, query=…) | `отобратьКонцепции`, `внутренностиСтроки`, `пустойСписок` | `initializeCustomSelects`×2, `showCustomSelectDropdown`, `filterCustomSelect` | — | — |
| `showCustomSelectDropdown` | function | 24758 | 10 | (type) | `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `filterCustomSelect` | function | 24769 | 11 | (type, query) | `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `selectCustomOption` | function | 24781 | 24 | (type, nodeId) | `nodes`, `известить`, `_cmpA`, `_cmpB`, `selectedSourceNode`, `selectedTargetNode` | — | динам.×1 | — |
| `handleNodeClick` | function | 24840 | 116 | (event, d) | `lastClickedNode`×14, `selectedNodes`×13, `clickTimer`×12, `clickCount`×10, `editMode`×8, `gfxNode`×5, `известить`×4, `selectedEdges`×2, `isNodeConnectedToSelectedEdges`, `highlightCombined`, `canEdit`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `handleLinkClick` | function | 24962 | 28 | (event, d) | `linkClickTimer`×5, `linkClickCount`×4, `известить`×2, `handleLinkSelect`×2, `canEdit` | `initGraphEventHandlers` | — | — |
| `handleLinkSelect` | function | 24991 | 32 | (event, d) | `selectedEdges`×13, `selectedNodes`×2, `isEdgeConnectedToSelectedNodes`, `highlightCombined` | `handleLinkClick`×2 | — | — |
| `resizeCanvas` | function | 25061 | 11 | () | `gfxCanvas`×6, `dpr`×3, `viewWidth`×2, `viewHeight`×2, `pickCanvas`×2, `pickDirty`, `requestDraw` | `stmt016`, `stmt023` | — | — |
| `similarityColor` | function | 25105 | 9 | (t) | — | `renderScene` | — | — |
| `showSimilarityOverlay` | function | 25115 | 44 | (sourceId, kind) | `showTemporaryMessage`×2, `concepts`, `relations`, `nodes`, `известить`, `_simCache`, `profileSimilarity`, `structuralSimilarity`, `initializePhilosophyMetrics`, `similarityOverlay`, `SIMILARITY_KEEP_QUANTILE`, `SIMILARITY_ARCS`, `updateSimilarityLegend`, `requestDraw` | `toggleSimilarityKind` | динам.×3 | — |
| `toggleSimilarityKind` | function | 25160 | 5 | () | `similarityOverlay`×3, `showSimilarityOverlay` | — | — | — |
| `clearSimilarityOverlay` | function | 25166 | 5 | () | `similarityOverlay`, `updateSimilarityLegend`, `requestDraw` | `stmt037` | динам.×1 | — |
| `updateSimilarityLegend` | function | 25172 | 35 | () | `similarityOverlay`×11, `nodes`, `SIMILARITY_ARCS` | `showSimilarityOverlay`, `clearSimilarityOverlay` | — | — |
| `nodeRadius` | function | 25211 | 1 | (d) | `renderState` | `exportToSVG`, `drawSelfLoop`, `renderScene`, `startRadiusAnimation`, `pickNode` | — | — |
| `nodeLabelDy` | function | 25212 | 1 | (d) | `renderState` | `exportToSVG`, `renderScene`, `startRadiusAnimation` | — | — |
| `hasNodeClass` | function | 25213 | 1 | (name, d) | `renderState` | `exportToSVG`×6, `renderScene`×6 | — | — |
| `hasLinkClass` | function | 25214 | 1 | (name, l) | `renderState` | `linkVisualState`×4 | — | — |
| `назначитьРисовальщика` | function | 25222 | 1 | (дело) | `рисовальщик` | `stmt048` | — | — |
| `requestDraw` | function | 25224 | 9 | () | `drawScheduled`×3, `рисовальщик`×2 | `highlightPhilosopherOnGraph`×2, `subSelection`×2, `dispatchMove`×2, `stmt021`×2, `highlightLinkOnGraph`, `resizeCanvas`, `showSimilarityOverlay`, `clearSimilarityOverlay`, `makeClassed`, `gfxNode`, `gfxLink`, `gfxLinkAll`, `updateArrows`, `gfxZoom`, `stmt015`, `stmt017`, `dispatchClick`, `initGraphEventHandlers`, `updateGraphData`, `updateNodeOnGraph`, `updateLinkOnGraph` | — | — |
| `graphIsCovered` | function | 25244 | 10 | () | `isStatsModalOpen`×2 | `needsContinuousAnimation` | — | — |
| `needsContinuousAnimation` | function | 25255 | 9 | () | `renderState`×2, `links`, `isLinkVisible`, `graphIsCovered` | `closeStatsModal`×2, `unfreezeSimulation`×2, `ensureAnimLoop`, `draw` | — | — |
| `ensureAnimLoop` | function | 25264 | 9 | () | `animLoopRunning`×3, `draw`×2, `needsContinuousAnimation` | `closeStatsModal`×2, `unfreezeSimulation`×2, `draw`, `startRadiusAnimation` | — | — |
| `linkStrokeWidth` | function | 25275 | 4 | (d) | `renderState` | `arrowPoints`, `arrowPointsStart`, `linkDrawWidth` | — | — |
| `linkHoverStrokeWidth` | function | 25279 | 4 | (d) | `renderState` | `linkDrawWidth`, `renderScene` | — | — |
| `arcParams` | function | 25285 | 15 | (s, t) | — | `arrowPoints`, `arrowPointsStart`, `strokeLink`, `renderScene` | — | — |
| `arrowPoints` | function | 25302 | 26 | (d, swOverride) | `arrowRadius`×2, `arrowMode`, `linkStrokeWidth`, `arcParams` | `exportToSVG`, `fillArrow` | — | — |
| `arrowPointsStart` | function | 25332 | 28 | (d, swOverride) | `arrowRadius`×2, `arrowMode`, `linkStrokeWidth`, `arcParams` | `exportToSVG`, `fillArrow` | — | — |
| `linkHasTwoHeads` | function | 25363 | 5 | (l) | `relationTypesObj` | `exportToSVG`, `fillArrow` | — | — |
| `linkVisualState` | function | 25371 | 7 | (l) | `hasLinkClass`×4, `selectedEdges` | `exportToSVG`, `renderScene`, `repaintPickCanvas` | — | — |
| `linkDrawWidth` | function | 25379 | 8 | (l, state) | `renderState`×2, `linkStrokeWidth`, `linkHoverStrokeWidth` | `exportToSVG`, `renderScene`, `repaintPickCanvas` | — | — |
| `linkDrawAlpha` | function | 25388 | 19 | (l, state, tms) | `renderState`, `similarityOverlay` | `renderScene`×2, `exportToSVG` | — | — |
| `strokeLink` | function | 25408 | 8 | (c, l, width) | `arcParams` | `renderScene`, `repaintPickCanvas` | — | — |
| `drawSelfLoop` | function | 25420 | 27 | (c, l, sw, col, alpha) | `nodeRadius` | `renderScene`, `repaintPickCanvas` | — | — |
| `fillArrow` | function | 25448 | 13 | (c, l, sw) | `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads` | `renderScene`, `repaintPickCanvas` | — | — |
| `renderScene` | function | 25464 | 145 | (c, opts) | `similarityOverlay`×15, `hasNodeClass`×6, `relationTypesObj`×4, `nodes`×4, `isNodeVisible`×3, `renderState`×3, `linkDrawAlpha`×2, `selectedNodes`×2, `philosopherConcepts`, `links`, `isLinkVisible`, `isReflexiveLink`, `similarityColor`, `LABEL_HIDE_BELOW`, `LABEL_ALL_ABOVE`, `nodeRadius`, `nodeLabelDy`, `linkHoverStrokeWidth`, `arcParams`, `linkVisualState`, `linkDrawWidth`, `strokeLink`, `drawSelfLoop`, `fillArrow`, `DRAW_ORDER` | `exportToPNG`, `draw` | — | — |
| `draw` | function | 25610 | 10 | () | `ctx`×4, `dpr`×4, `gfxCanvas`×2, `pickDirty`, `renderState`, `needsContinuousAnimation`, `ensureAnimLoop`, `renderScene`, `stepRadiusAnimation` | `ensureAnimLoop`×2, `stmt048` | — | — |
| `startRadiusAnimation` | function | 25622 | 6 | (toRadius, toDy, dur) | `nodes`, `renderState`, `nodeRadius`, `nodeLabelDy`, `ensureAnimLoop` | `subSelection` | — | — |
| `stepRadiusAnimation` | function | 25628 | 13 | () | `renderState`×4, `nodes` | `draw` | — | — |
| `rebuildQuadtree` | function | 25644 | 5 | () | `nodes`, `isNodeVisible`, `quadtree` | `pickNode`, `stmt015`, `stmt017`, `updateGraphData` | — | — |
| `toGraph` | function | 25650 | 4 | (clientX, clientY) | `gfxCanvas`, `renderState` | `dispatchClick`×2, `dispatchMove` | — | — |
| `pickNode` | function | 25655 | 9 | (gx, gy) | `quadtree`×2, `renderState`, `nodeRadius`, `rebuildQuadtree` | `dispatchClick`×2, `stmt015`, `dispatchMove` | — | — |
| `repaintPickCanvas` | function | 25665 | 30 | () | `pickCtx`×13, `dpr`×4, `links`×2, `pickCanvas`×2, `isLinkVisible`, `isReflexiveLink`, `pickDirty`, `PICK_LINK_WIDTH`, `renderState`, `linkVisualState`, `linkDrawWidth`, `strokeLink`, `drawSelfLoop`, `fillArrow` | `pickLink` | — | — |
| `pickLink` | function | 25696 | 12 | (clientX, clientY) | `links`×2, `pickCanvas`×2, `dpr`×2, `gfxCanvas`, `pickCtx`, `pickDirty`, `repaintPickCanvas` | `dispatchMove`, `dispatchClick` | — | — |
| `makeClassed` | function | 25714 | 15 | (kind) | `nodes`×2, `links`×2, `renderState`×2, `requestDraw` | `gfxNode`, `gfxLink` | — | — |
| `subSelection` | function | 25730 | 23 | (kind, what) | `renderState`×5, `nodes`×3, `requestDraw`×2, `startRadiusAnimation` | `gfxNode` | — | — |
| `updateArrows` | function | 25781 | 1 | () | `requestDraw` | `toggleUniformLinkWidth`, `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `dispatchMove` | function | 25891 | 30 | (event) | `linkHandlers`×6, `nodeHandlers`×4, `lastHoverNode`×4, `lastHoverLink`×4, `renderState`×2, `requestDraw`×2, `gfxCanvas`, `toGraph`, `pickNode`, `pickLink` | `initGraphEventHandlers` | — | — |
| `dispatchClick` | function | 25922 | 26 | (event) | `toGraph`×2, `pickNode`×2, `nodeHandlers`×2, `linkHandlers`×2, `известить`, `editMode`, `requestDraw`, `pickLink`, `resetHighlight`, `canEdit`, `cancelGraphSelection`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `initGraphEventHandlers` | function | 25949 | 13 | () | `gfxCanvas`×3, `lastHoverNode`×3, `lastHoverLink`×3, `renderState`×2, `nodeHandlers`×2, `linkHandlers`×2, `handleNodeClick`, `handleLinkClick`, `requestDraw`, `gfxNode`, `gfxLink`, `dispatchMove`, `dispatchClick` | `stmt019` | — | — |
| `isEdgeConnectedToNode` | function | 25966 | 5 | (edge, nodeData) | — | `isNodeConnectedToSelectedEdges`, `isEdgeConnectedToSelectedNodes` | — | — |
| `isNodeConnectedToSelectedEdges` | function | 25973 | 8 | (nodeData) | `selectedEdges`, `isEdgeConnectedToNode` | `handleNodeClick` | — | — |
| `isEdgeConnectedToSelectedNodes` | function | 25983 | 8 | (edge) | `selectedNodes`, `isEdgeConnectedToNode` | `handleLinkSelect` | — | — |
| `highlightCombined` | function | 25993 | 98 | () | `selectedNodes`×6, `selectedEdges`×5, `links`×2, `известить`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `highlightLinkOnGraph`, `handleNodeClick`, `handleLinkSelect` | — | — |
| `highlightConnected` | function | 26093 | 34 | (selectedDataArray) | `links`, `gfxNode`, `gfxLinkAll` | `cleanupInvisibleSelections`, `highlightNodeById`, `selectSearchResult`, `gotoNodeFromModal` | — | — |
| `resetHighlight` | function | 26129 | 11 | () | `gfxNode`, `gfxLinkAll`, `selectedNodes`, `selectedEdges` | `highlightPhilosopherOnGraph`×2, `findAndShowPath`, `highlightPath`, `clearPathHighlight`, `cleanupInvisibleSelections`, `dispatchClick`, `highlightCombined`, `resetSimulation`, `toggleGrouping` | — | — |
| `dragstarted` | function | 26300 | 8 | (event, d) | `simulation`, `tickCount` | `stmt015` | — | — |
| `dragended` | function | 26310 | 5 | (event, d) | `simulation` | `stmt015` | — | — |
| `resetSimulation` | function | 26316 | 9 | () | `nodes`, `simulation`, `tickCount`, `resetHighlight` | — | статич.×1 | — |
| `toggleSimulationFreeze` | function | 26329 | 11 | () | `simLockedByHand`×2, `showTemporaryMessage`, `simulation`, `tickCount`, `maxTicks`, `updateFreezeButton`, `freezeSimulation`, `unfreezeSimulation` | — | статич.×1 | — |
| `updateFreezeButton` | function | 26341 | 12 | () | `simLockedByHand`×3 | `toggleSimulationFreeze` | — | — |
| `centerGraph` | function | 26354 | 9 | () | `simulation`×2, `gfxSvg`, `gfxZoom`, `tickCount` | — | статич.×1 | — |
| `freezeSimulation` | function | 26367 | 4 | (источник) | `simulation`×2, `simLockedByHand` | `showPathDescriptionsModal`, `openStatsModal`, `toggleSimulationFreeze`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `openUniversalModal` | — | — |
| `unfreezeSimulation` | function | 26372 | 17 | (источник) | `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `simulation`×2, `tickCount`, `maxTicks`, `simLockedByHand` | `closePathDescriptionsModal`, `closeStatsModal`, `toggleSimulationFreeze`, `closeConceptProfileModal`, `closePhilosopherProfileModal`, `closeUniversalModal` | — | — |
| `togglePanel` | function | 26410 | 20 | (panelId) | — | — | статич.×1 | — |
| `restorePanelStates` | function | 26432 | 14 | () | — | `stmt062` | — | — |
| `toggleGrouping` | function | 26447 | 33 | () | `simulation`×3, `isGrouped`×3, `groupPositions`×2, `tickCount`, `resetHighlight` | — | статич.×1 | — |
| `openConceptById` | function | 26513 | 4 | (conceptId) | `nodes`, `showDetailModal` | — | динам.×3 | — |
| `similarConceptsBlock` | function | 26518 | 58 | (conceptId) | `nearestConcepts`×2, `nodes`, `medianNodeDegree`, `nodeDegreeOf` | `generateConceptViewContent` | — | — |
| `metricPercentile` | function | 26605 | 11 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `metricRank` | function | 26621 | 15 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `toggleProfileOrder` | function | 26640 | 4 | (conceptId) | `profileOrderMode`×2, `showConceptProfileModal` | — | динам.×1 | — |
| `metricPartsText` | function | 26646 | 16 | (res) | — | `showConceptProfileModal` | — | — |
| `conceptDegreesDetailed` | function | 26663 | 11 | (conceptId) | `links` | `showConceptProfileModal` | — | — |
| `showConceptProfileModal` | function | 26675 | 74 | (conceptId) | `philosopherConcepts`×2, `profileOrderMode`×2, `concepts`, `relations`, `nodes`, `metricsScope`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `metricPercentile`, `metricRank`, `metricPartsText`, `conceptDegreesDetailed` | `toggleProfileOrder` | динам.×2 | — |
| `closeConceptProfileModal` | function | 26750 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×3 | — |
| `showPhilosopherProfileModal` | function | 26759 | 98 | (philosopherName) | `philosopherConcepts`×2, `_concepts`×2, `philosopherSystematicIndex`×2, `philosopherHistoricalReachIndex`×2, `philosopherInterdisciplinaryIndex`×2, `philosophers`, `rubrics`, `concepts`, `relations`, `nodes`, `metricsScope`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `profileOrderMode` | — | динам.×2 | — |
| `closePhilosopherProfileModal` | function | 26858 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×1 | — |
| `pushModalState` | function | 26889 | 14 | () | `modalStack`×5, `ModalContext`×4, `MODAL_STACK_MAX` | `openUniversalModal` | — | — |
| `popModalState` | function | 26904 | 10 | () | `ModalContext`, `modalStack`, `openUniversalModal`, `hasUnsavedChanges` | `stmt030` | динам.×1 | — |
| `modalEntityExists` | function | 26924 | 13 | (entityType, data) | — | `saveConnectionData`×2, `openUniversalModal`, `hasUnsavedChanges`, `savePhilosopherData`, `saveConceptData` | — | — |
| `modalContentFor` | function | 26942 | 18 | (entityType, data, mode) | — | `openUniversalModal` | — | — |
| `canEdit` | function | 26986 | 3 | () | `authSession`×2 | `makeLegendsEditable`×3, `handleNodeClick`, `handleLinkClick`, `dispatchClick`, `refreshEditHints`, `openUniversalModal`, `toggleModalMode`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal` | — | — |
| `authModalEl` | function | 26992 | 1 | () | — | `openAuthModal`, `closeAuthModal`, `showAuthNotice` | — | — |
| `openAuthModal` | function | 26994 | 29 | (kind) | `authModalKind`, `authModalEl`, `submitAuth` | — | динам.×2 | — |
| `closeAuthModal` | function | 27024 | 10 | () | `authModalEl` | — | динам.×2 | — |
| `authError` | function | 27035 | 4 | (text) | — | `submitAuth`×5 | — | 1× (строка) в `authError` |
| `showAuthNotice` | function | 27042 | 14 | (title, bodyHtml) | `authModalKind`, `authModalEl` | `authNoticeMember`, `authNoticeAdmin` | — | — |
| `authNoticeMember` | function | 27057 | 6 | (login) | `showAuthNotice` | `submitAuth`×2 | — | — |
| `authNoticeAdmin` | function | 27064 | 13 | () | `showAuthNotice` | `submitAuth` | — | — |
| `submitAuth` | function | 27080 | 42 | () | `authError`×5, `authAccounts`×4, `AUTH_ADMIN`×3, `authSession`×3, `renderAuthControls`×3, `refreshEditHints`×3, `authNoticeMember`×2, `authModalKind`, `authNoticeAdmin`, `refreshOpenModalToolbar` | `openAuthModal` | динам.×1 | — |
| `authLogout` | function | 27123 | 24 | () | `ModalContext`×2, `authSession`, `refreshOpenModalToolbar`, `renderAuthControls`, `refreshEditHints`, `toggleModalMode` | — | динам.×1 | — |
| `refreshOpenModalToolbar` | function | 27150 | 9 | () | `ModalContext`×4, `openUniversalModal` | `submitAuth`, `authLogout` | — | — |
| `renderAuthControls` | function | 27162 | 18 | () | `authSession` | `submitAuth`×3, `authLogout`, `stmt028` | — | — |
| `refreshEditHints` | function | 27186 | 15 | () | `canEdit` | `submitAuth`×3, `authLogout`, `makeLegendsEditable` | — | — |
| `openUniversalModal` | function | 27202 | 64 | (entityType, data, mode=…, opts=…) | `ModalContext`×3, `initConnectionSearchFields`×2, `freezeSimulation`, `modalStack`, `pushModalState`, `modalEntityExists`, `modalContentFor`, `canEdit` | `saveConceptData`×2, `saveConnectionData`×2, `selectPhilosopherResult`, `popModalState`, `refreshOpenModalToolbar`, `toggleModalMode`, `showDetailModal`, `showPhilosopherDetailModal`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `savePhilosopherData`, `deleteConnection`, `createNewConceptForPhilosopher`, `createNewConnectionForConcept`, `stmt055` | динам.×24 | — |
| `closeUniversalModal` | function | 27268 | 27 | () | `ModalContext`×4, `clearModalSearch`×2, `cancelGraphSelection`×2, `unfreezeSimulation`, `modalStack` | `closeAllModals`×2, `closeDetailModal`, `closePhilosopherDetailModal`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | статич.×1, динам.×3 | — |
| `toggleModalMode` | function | 27297 | 17 | () | `ModalContext`×5, `canEdit`, `openUniversalModal`, `hasUnsavedChanges` | `authLogout` | динам.×1 | — |
| `hasUnsavedChanges` | function | 27316 | 20 | () | `ModalContext`×3, `modalEntityExists`, `hasFilledFields`, `hasPhilosopherChanges`, `hasConceptChanges`, `hasConnectionChanges` | `popModalState`, `toggleModalMode` | — | — |
| `hasFilledFields` | function | 27337 | 10 | () | — | `hasUnsavedChanges` | — | — |
| `hasPhilosopherChanges` | function | 27348 | 22 | (original) | `philosophers` | `hasUnsavedChanges` | — | — |
| `hasConceptChanges` | function | 27371 | 19 | (original) | `conceptToRubrics` | `hasUnsavedChanges` | — | — |
| `hasConnectionChanges` | function | 27391 | 27 | (original) | `ModalContext`×2, `relationTypesObj` | `hasUnsavedChanges` | — | — |
| `generateId` | function | 27420 | 3 | (prefix=…) | — | `savePhilosopherData`, `saveConceptData` | — | — |
| `findConnection` | function | 27424 | 9 | (sourceId, targetId, bidirectional=…) | `links` | `deleteConnection`×3, `openEditConnectionModal`, `saveConnectionData` | динам.×4 | — |
| `getConceptConnections` | function | 27434 | 7 | (conceptId) | `links` | `isConceptIsolated`, `getIsolatedConceptsAfterDeletion`, `deletePhilosopher`, `deleteConcept`, `deleteConnection`, `generateConceptEditContent` | — | — |
| `isConceptIsolated` | function | 27442 | 3 | (conceptId) | `getConceptConnections` | `conceptIntegrityWarnings` | — | — |
| `getIsolatedConceptsAfterDeletion` | function | 27449 | 15 | (philosopherName) | `nodes`, `getConceptConnections` | `deletePhilosopher` | — | — |
| `showDetailModal` | function | 27470 | 3 | (conceptData) | `openUniversalModal` | `selectSearchResult`, `openConceptById`, `stmt054` | — | — |
| `showPhilosopherDetailModal` | function | 27474 | 3 | (philosopherName) | `openUniversalModal` | `makeLegendsEditable` | динам.×1 | — |
| `closeDetailModal` | function | 27478 | 1 | () | `closeUniversalModal` | `closeAllModals`×2, `gotoNodeFromModal`, `stmt053` | — | — |
| `closePhilosopherDetailModal` | function | 27479 | 1 | () | `closeUniversalModal` | `closeAllModals`×2 | — | — |
| `openEditPhilosopherModal` | function | 27481 | 4 | (philosopherName=…) | `canEdit`, `openUniversalModal` | `makeLegendsEditable`×2 | — | — |
| `openEditConceptModal` | function | 27486 | 6 | (concept=…) | `nodes`, `canEdit`, `openUniversalModal` | `stmt056` | динам.×1 | — |
| `openEditConnectionModal` | function | 27493 | 6 | (a=…, b=…) | `canEdit`, `openUniversalModal`, `findConnection` | `stmt057` | динам.×1 | — |
| `updateGraphData` | function | 27518 | 13 | () | `simulation`×3, `nodes`, `links`, `pickDirty`, `requestDraw`, `rebuildQuadtree` | `addNodeToGraph`, `addLinkToGraph`, `stmt041` | — | — |
| `addNodeToGraph` | function | 27532 | 15 | (nodeData) | `известить`, `viewWidth`, `viewHeight`, `renderState`, `pinnedVisibleNodes`, `updateGraphData` | `saveConceptData` | — | — |
| `updateNodeOnGraph` | function | 27550 | 3 | () | `requestDraw` | `saveConceptData` | — | — |
| `addLinkToGraph` | function | 27554 | 11 | (linkData) | `nodes`×2, `известить`, `updateGraphData` | `saveConnectionData` | — | — |
| `updateLinkOnGraph` | function | 27566 | 5 | () | `pickDirty`, `requestDraw` | `saveConnectionData` | — | — |
| `forgetNode` | function | 27577 | 18 | (nodeId) | `renderState`×6, `similarityOverlay`×3, `visibleNodeIds`×2, `selectedNodes`×2, `pinnedVisibleNodes` | `removeConceptEverywhere` | — | — |
| `forgetLink` | function | 27596 | 8 | (link) | `renderState`×3, `visibleLinkSet`×2, `selectedEdges` | `removeLinkEverywhere` | — | — |
| `rebuildDerivedIndexes` | function | 27609 | 36 | (what) | `philosopherIdToName`×3, `philosopherConcepts`×3, `philosopherOrder`×3, `linkColors`×3, `conceptToRubrics`×3, `rubricsObj`×3, `concepts`×2, `philosophers`, `rubrics`, `relationTypes`, `rebuildPhilosopherTraditions` | `afterDataChange` | — | — |
| `markDirty` | function | 27663 | 1 | () | `hasUnsavedEdits` | `afterDataChange` | — | — |
| `hasUnsaved` | function | 27664 | 1 | () | `hasUnsavedEdits` | — | — | — |
| `collectData` | function | 27666 | 3 | () | `traditions`, `philosophers`, `rubrics`, `relationTypes`, `concepts`, `relations` | `downloadData`, `saveToFolder` | — | — |
| `deliverFile` | function | 27670 | 11 | (имя, текст) | — | `downloadData` | — | — |
| `downloadData` | function | 27682 | 6 | () | `DATA_SETS`×2, `hasUnsavedEdits`, `collectData`, `deliverFile` | — | статич.×1 | — |
| `saveToFolder` | async function | 27691 | 23 | () | `dataFolder`×3, `DATA_SETS`, `hasUnsavedEdits`, `collectData` | — | статич.×1 | — |
| `afterDataChange` | function | 27722 | 23 | (what) | `selectedPhilosophers`×2, `philosopherConcepts`, `известить`, `rebuildDerivedIndexes`, `markDirty` | `saveConceptData`×2, `saveConnectionData`×2, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `selectConceptOnGraph` | function | 27763 | 28 | (type, mode=…) | `gfxCanvas` | `initConnectionSearchFields`×2 | — | — |
| `cancelGraphSelection` | function | 27792 | 11 | () | `gfxCanvas` | `closeUniversalModal`×2, `stmt030`×2, `dispatchClick`, `handleConceptSelection` | динам.×1 | — |
| `handleConceptSelection` | function | 27809 | 6 | (conceptId) | `известить`, `cancelGraphSelection` | `handleNodeClick`, `dispatchClick` | — | — |
| `escapeAttr` | function | 27829 | 4 | (s) | — | `generatePhilosopherEditContent`×3, `generateConceptEditContent`×3, `generateConnectionEditContent` | динам.×1 | — |
| `relationIndexOf` | function | 27843 | 4 | (srcId, tgtId, type) | `relations` | `removeLinkEverywhere`, `saveConnectionData` | — | — |
| `activityOverlap` | function | 27851 | 12 | (nameA, nameB) | `philosophers`×2 | `connectionIntegrityWarnings` | — | — |
| `groundingCyclePath` | function | 27869 | 37 | (srcId, tgtId, extraType) | `relationTypesObj`×2, `GROUNDING_TYPES`×2, `links` | `connectionIntegrityWarnings` | — | — |
| `pluralRu` | function | 27910 | 7 | (count, one, few, many) | — | `nConcepts`, `nLinks` | — | — |
| `nConcepts` | const-функция | 27917 | 1 | (n) | `pluralRu` | `philosopherIntegrityWarnings`, `deletePhilosopher` | — | — |
| `nLinks` | const-функция | 27918 | 1 | (n) | `pluralRu` | `deleteConcept` | — | — |
| `labelOf` | const-функция | 27920 | 4 | (id) | `nodes` | `connectionIntegrityWarnings` | — | — |
| `connectionIntegrityWarnings` | function | 27929 | 138 | (srcId, tgtId, type, weight, bidir, original) | `links`×4, `nodes`×2, `philosopherBirth`×2, `philosopherYears`×2, `relationTypesObj`, `isReflexiveLink`, `activityOverlap`, `groundingCyclePath`, `labelOf` | `saveConnectionData` | — | — |
| `conceptIntegrityWarnings` | function | 28068 | 18 | (label, philosopher, original) | `nodes`, `isConceptIsolated` | `saveConceptData` | — | — |
| `philosopherIntegrityWarnings` | function | 28087 | 16 | (name, birth, death, original) | `nodes`, `nConcepts` | `savePhilosopherData` | — | — |
| `confirmWarnings` | function | 28105 | 5 | (title, warnings) | — | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `savePhilosopherData` | function | 28115 | 82 | () | `philosophers`×7, `selectedPhilosophers`×3, `concepts`, `nodes`, `ModalContext`, `modalEntityExists`, `openUniversalModal`, `generateId`, `afterDataChange`, `philosopherIntegrityWarnings`, `confirmWarnings` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `deletePhilosopher` | function | 28198 | 37 | (philosopherName) | `philosophers`×3, `philosopherConcepts`, `philosopherOrder`, `nodes`, `selectedPhilosophers`, `ModalContext`, `closeUniversalModal`, `getConceptConnections`, `getIsolatedConceptsAfterDeletion`, `afterDataChange`, `nConcepts`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `removeConceptEverywhere` | function | 28242 | 8 | (conceptId) | `concepts`×2, `nodes`×2, `conceptToRubrics`, `forgetNode` | `deletePhilosopher`, `deleteConcept` | — | — |
| `removeLinkEverywhere` | function | 28251 | 9 | (link) | `links`×2, `relations`, `forgetLink`, `relationIndexOf` | `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `saveConceptData` | function | 28261 | 57 | () | `nodes`×5, `concepts`×4, `conceptToRubrics`×2, `openUniversalModal`×2, `afterDataChange`×2, `philosophers`, `ModalContext`, `modalEntityExists`, `generateId`, `addNodeToGraph`, `updateNodeOnGraph`, `conceptIntegrityWarnings`, `confirmWarnings` | — | — | 1× (строка) в `generateConceptEditContent` |
| `deleteConcept` | function | 28319 | 19 | (conceptId) | `ModalContext`×2, `nodes`, `closeUniversalModal`, `getConceptConnections`, `afterDataChange`, `nLinks`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | — | 1× (строка) в `generateConceptEditContent` |
| `saveConnectionData` | function | 28343 | 71 | () | `ModalContext`×6, `relations`×4, `nodes`×2, `links`×2, `modalEntityExists`×2, `openUniversalModal`×2, `afterDataChange`×2, `relationTypesObj`, `findConnection`, `addLinkToGraph`, `updateLinkOnGraph`, `relationIndexOf`, `connectionIntegrityWarnings`, `confirmWarnings` | — | — | 1× (строка) в `generateConnectionEditContent` |
| `deleteConnection` | function | 28415 | 45 | (sourceId=…, targetId=…) | `ModalContext`×6, `nodes`×3, `findConnection`×3, `relationTypesObj`, `links`, `isReflexiveLink`, `openUniversalModal`, `closeUniversalModal`, `getConceptConnections`, `afterDataChange`, `removeLinkEverywhere` | — | динам.×1 | 1× (строка) в `generateConnectionEditContent` |
| `modalActions` | function | 28463 | 15 | (saveFn, deleteFn, deleteArg, isNew) | — | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `updatePhilColorSample` | function | 28483 | 17 | () | `getContrastColor` | `syncPhilColorFromPicker`, `generatePhilosopherEditContent` | динам.×2 | — |
| `syncPhilColorFromPicker` | function | 28501 | 6 | () | `updatePhilColorSample` | — | динам.×1 | — |
| `generatePhilosopherEditContent` | function | 28508 | 113 | (philosopherName) | `escapeAttr`×3, `traditions`, `philosophers`, `nodes`, `modalActions`, `updatePhilColorSample` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 28626 | 131 | (conceptData) | `philosopherConcepts`×3, `escapeAttr`×3, `relationHint`×2, `rubrics`, `relationTypesObj`, `nodes`, `conceptToRubrics`, `isReflexiveLink`, `стрелкаСвязи`, `sortPhilosophersByBirth`, `philosopherYears`, `getConceptConnections`, `modalActions` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `onConnTypeChange` | function | 28765 | 37 | () | `relationTypesObj`, `links`, `updateConnEditPairNote` | `generateConnectionEditContent` | динам.×1 | — |
| `updateConnEditPairNote` | function | 28804 | 25 | () | `ModalContext`×2, `links`, `isReflexiveLink`, `connectionsBetween` | `onConnTypeChange`, `selectConnectionEditConcept`, `swapConnectionConcepts` | — | — |
| `connEditSelectedBlock` | function | 28830 | 9 | (type, node) | — | `generateConnectionEditContent`×2 | — | — |
| `generateConnectionEditContent` | function | 28840 | 96 | (connectionData) | `nodes`×2, `relationHint`×2, `ModalContext`×2, `connEditSelectedBlock`×2, `relationTypesObj`, `WEIGHT_OPTIONS`, `escapeAttr`, `modalActions`, `onConnTypeChange`, `setupConnectionEditSearchHandlers` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `handleConnectionEditSearch` | function | 28941 | 29 | (type, query) | `отобратьКонцепции`, `внутренностиСтроки`, `пустойСписок`, `ModalContext`, `connectionsBetween` | `setupConnectionEditSearchHandlers` | — | — |
| `selectConnectionEditConcept` | function | 28971 | 18 | (type, conceptId) | `nodes`, `ModalContext`, `updateConnEditPairNote` | `stmt043` | динам.×1 | — |
| `setupConnectionEditSearchHandlers` | function | 28990 | 13 | () | `initConnectionSearchFields`×2, `handleConnectionEditSearch` | `generateConnectionEditContent` | — | — |
| `swapConnectionConcepts` | function | 29004 | 20 | () | `ModalContext`×5, `nodes`, `updateConnEditPairNote` | — | динам.×1 | — |
| `createNewConceptForPhilosopher` | function | 29026 | 3 | (philosopherName) | `openUniversalModal` | — | динам.×1 | — |
| `createNewConnectionForConcept` | function | 29030 | 7 | (conceptId) | `nodes`, `openUniversalModal` | — | динам.×1 | — |
| `connectionsBetween` | function | 29049 | 8 | (sourceId, targetId) | `links` | `updateConnEditPairNote`, `handleConnectionEditSearch`, `generateConnectionVisualization`, `updateConnectionVisualization` | — | — |
| `conceptCircle` | function | 29058 | 6 | (node, size) | `philosopherConcepts`×2 | `conceptPlate` | — | — |
| `conceptPlate` | function | 29065 | 16 | (node) | `philosopherConcepts`×2, `getContrastColor`, `conceptCircle` | `generateConnectionVisualization`×3 | — | — |
| `connectionTraditionNote` | function | 29089 | 13 | (aPhil, bPhil) | `philosopherTraditions`×2, `traditionsOfPhilosopher`×2, `traditions` | `generateConnectionVisualization` | — | — |
| `connectionArrowSvg` | function | 29104 | 60 | (conn, index) | `relationTypesObj`, `isReflexiveLink` | `generateConnectionVisualization` | — | — |
| `generateConnectionVisualization` | function | 29165 | 75 | (sourceNode, targetNode, connectionData) | `conceptPlate`×3, `relationHint`×2, `relationTypesObj`, `isReflexiveLink`, `CONN_WEIGHT_WORDS`, `connectionsBetween`, `connectionTraditionNote`, `connectionArrowSvg` | `generateConnectionViewContent`, `updateConnectionVisualization` | — | — |
| `generateConnectionViewContent` | function | 29241 | 81 | (connectionData) | `nodes`×2, `ModalContext`×2, `generateConnectionVisualization` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionSearchSection` | function | 29334 | 8 | () | — | — | динам.×1 | — |
| `handleConnectionViewSearch` | function | 29354 | 42 | (type, query) | `nodes`×2, `links`, `отобратьКонцепции`, `внутренностиСтроки`, `пустойСписок`, `ModalContext` | — | динам.×2 | — |
| `selectConnectionViewConcept` | function | 29397 | 33 | (type, conceptId) | `ModalContext`×3, `nodes`, `updateConnectionVisualization` | `stmt043` | динам.×1 | — |
| `updateConnectionVisualization` | function | 29431 | 18 | () | `nodes`×2, `ModalContext`, `connectionsBetween`, `generateConnectionVisualization` | `selectConnectionViewConcept` | — | — |
| `initConnectionSearchFields` | function | 29453 | 18 | (mode=…) | `selectConceptOnGraph`×2 | `openUniversalModal`×2, `setupConnectionEditSearchHandlers`×2 | — | — |
| `generateConceptViewContent` | function | 29477 | 265 | (conceptData) | `philosopherConcepts`×5, `relationTypesObj`×4, `nodes`×2, `conceptToRubrics`×2, `стрелкаСвязи`×2, `rubrics`, `links`, `getContrastColor`, `similarConceptsBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionDescription` | function | 29744 | 12 | (id) | — | — | динам.×4 | — |
| `toggleAllRoot` | function | 29760 | 7 | (btn) | — | `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions` | — | — |
| `toggleAllConnectionDescriptions` | function | 29771 | 37 | (btn) | `allDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleSubsection` | function | 29810 | 14 | (sectionId) | — | — | динам.×4 | — |
| `gotoNodeFromModal` | function | 29826 | 23 | (nodeId) | `selectedNodes`×2, `nodes`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected`, `closeDetailModal` | — | динам.×1 | — |
| `showAllConcepts` | function | 29851 | 28 | (rubricId, currentConceptId) | `rubrics`, `philosopherConcepts`, `nodes`, `conceptToRubrics` | — | динам.×1 | — |
| `conjugateVerb` | function | 29882 | 9 | (count, singularForm) | — | `generatePhilosopherViewContent`×5 | — | — |
| `declinePhilosopher` | function | 29893 | 26 | (count, grammaticalCase) | — | `generatePhilosopherViewContent`×22 | — | — |
| `традицииФилософаБлок` | function | 29928 | 37 | (имя) | `philosopherConcepts`×2, `philosophers`, `philosopherTraditions`, `DATA_traditions_of` | `generatePhilosopherViewContent` | — | — |
| `DATA_traditions_of` | function | 29967 | 4 | (имя) | `traditions`, `philosopherTraditions` | `традицииФилософаБлок` | — | — |
| `similarPhilosophersBlock` | function | 29972 | 31 | (philosopherName) | `nearestPhilosophers`×3 | `generatePhilosopherViewContent` | — | — |
| `generatePhilosopherViewContent` | function | 30008 | 453 | (philosopherName) | `declinePhilosopher`×22, `nodes`×9, `relationTypesObj`×5, `conjugateVerb`×5, `getContrastColor`×4, `philosopherConcepts`×3, `philosopherBirth`×3, `formatBirthYear`×3, `sortPhilosophersByBirth`×3, `philosopherYears`×3, `links`×2, `стрелкаСвязи`×2, `traditions`, `philosophers`, `rubrics`, `conceptToRubrics`, `традицииФилософаБлок`, `similarPhilosophersBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `togglePhilosopherConceptDescription` | function | 30463 | 12 | (conceptId) | — | — | динам.×1 | — |
| `toggleAllPhilosopherConceptDescriptions` | function | 30479 | 32 | (btn) | `allPhilosopherConceptDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleAllPhilosopherConnectionDescriptions` | function | 30515 | 31 | (btn) | `allPhilosopherConnectionDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `makeLegendsEditable` | function | 30547 | 71 | () | `canEdit`×3, `openEditPhilosopherModal`×2, `highlightPhilosopherOnGraph`, `refreshEditHints`, `showPhilosopherDetailModal` | `stmt027`, `stmt039` | — | — |
| `closeAllModals` | function | 30628 | 13 | () | `closePathDescriptionsModal`×2, `closeAboutModal`×2, `closeConceptProfileModal`×2, `closePhilosopherProfileModal`×2, `closeUniversalModal`×2, `closeDetailModal`×2, `closePhilosopherDetailModal`×2 | `stmt029`, `stmt030` | — | — |


## 2. Глобальные константы и переменные

| Имя | Вид | Стр. | Значение | Использует | Используется в |
|---|---|---|---|---|---|
| `traditions` | const | 5088 | массив (22) | — | `selectAllTraditions`×2, `selectedTraditions`, `traditionsOfPhilosopher`, `analyzePathTraditions`, `собратьОПроекте`, `initFilters`, `deselectAllTraditions`, `collectData`, `generatePhilosopherEditContent`, `connectionTraditionNote`, `DATA_traditions_of`, `generatePhilosopherViewContent` |
| `philosophers` | const | 5201 | массив (57) | — | `savePhilosopherData`×7, `deletePhilosopher`×3, `isChronologicallyValid`×2, `analyzePath`×2, `findAndShowPath`×2, `собратьОПроекте`×2, `activityOverlap`×2, `stmt001`, `stmt002`, `stmt003`, `летУзла`, `stmt008`, `rebuildPhilosopherTraditions`, `showPathDescriptionsModal`, `initFilters`, `traditionMembers`, `initializePhilosophyMetrics`, `philosopherBirth`, `philosopherYears`, `отобратьФилософов`, `showPhilosopherProfileModal`, `hasPhilosopherChanges`, `rebuildDerivedIndexes`, `collectData`, `saveConceptData`, `generatePhilosopherEditContent`, `традицииФилософаБлок`, `generatePhilosopherViewContent` |
| `rubrics` | const | 5494 | массив (15) | — | `selectAllRubrics`×2, `stmt007`, `selectedRubrics`, `собратьОПроекте`, `initFilters`, `deselectAllRubrics`, `showPhilosopherProfileModal`, `rebuildDerivedIndexes`, `collectData`, `generateConceptEditContent`, `generateConceptViewContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `relationTypes` | const | 5583 | массив (21) | — | `stmt004`, `stmt005`, `собратьОПроекте`, `rebuildDerivedIndexes`, `collectData` |
| `concepts` | const | 5623 | массив (453) | — | `saveConceptData`×4, `rebuildDerivedIndexes`×2, `removeConceptEverywhere`×2, `nodes`, `stmt006`, `stmt007`, `handleLegendPhilSearch`, `собратьОПроекте`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `handlePhilosopherSearch`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `collectData`, `savePhilosopherData` |
| `relations` | const | 9363 | массив (1624) | — | `saveConnectionData`×4, `links`, `собратьОПроекте`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `collectData`, `relationIndexOf`, `removeLinkEverywhere` |
| `philosopherIdToName` | const | 13867 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt001`, `nodes` |
| `philosopherConcepts` | const | 13873 | объект (0) | — | `generateConceptViewContent`×5, `rebuildDerivedIndexes`×3, `generateConceptEditContent`×3, `generatePhilosopherViewContent`×3, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `handleLegendPhilSearch`×2, `selectAllPhilosophers`×2, `внутренностиСтроки`×2, `handlePhilosopherSearch`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal`×2, `conceptCircle`×2, `conceptPlate`×2, `традицииФилософаБлок`×2, `stmt002`, `selectedPhilosophers`, `initFilters`, `syncPhilosopherCheckboxes`, `deselectAllPhilosophers`, `updatePhilosopherDimming`, `exportToSVG`, `renderScene`, `philosopherNames`, `afterDataChange`, `deletePhilosopher`, `showAllConcepts` |
| `philosopherOrder` | const | 13882 | объект (0) | — | `rebuildDerivedIndexes`×3, `отобратьКонцепции`×2, `stmt003`, `deletePhilosopher` |
| `relationTypesObj` | const | 13888 | объект (0) | — | `generatePhilosopherViewContent`×5, `renderScene`×4, `generateConceptViewContent`×4, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `selectAllRelations`×2, `stmt021`×2, `groundingCyclePath`×2, `stmt004`, `isSymmetricLink`, `isTypologicalLink`, `selectedRelations`, `isChronologicallyValid`, `показатьНайденныеСвязи`, `applyBasicFilter`, `relationHint`, `initFilters`, `deselectAllRelations`, `exportToSVG`, `linkHasTwoHeads`, `hasConnectionChanges`, `connectionIntegrityWarnings`, `saveConnectionData`, `deleteConnection`, `generateConceptEditContent`, `onConnTypeChange`, `generateConnectionEditContent`, `connectionArrowSvg`, `generateConnectionVisualization` |
| `linkColors` | const | 13913 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt005` |
| `nodes` | const | 13919 | вызов concepts.map() | `concepts`, `philosopherIdToName` | `generatePhilosopherViewContent`×9, `calculatePageRank`×7, `calculateBetweennessAsync`×6, `saveConceptData`×5, `calculateClosenessCentrality`×4, `calculateEigenvectorCentrality`×4, `generateOverviewContent`×4, `renderScene`×4, `findAndShowPath`×3, `subSelection`×3, `deleteConnection`×3, `isChronologicallyValid`×2, `analyzePath`×2, `findShortestPathWeighted`×2, `handleLegendLinkSearch`×2, `updateFilterStats`×2, `calculateRichClubCoefficient`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `renderClosestPairs`×2, `renderComparison`×2, `toggleMetricVisualization`×2, `exportToSVG`×2, `makeClassed`×2, `stmt021`×2, `addLinkToGraph`×2, `connectionIntegrityWarnings`×2, `removeConceptEverywhere`×2, `saveConnectionData`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `handleConnectionViewSearch`×2, `updateConnectionVisualization`×2, `generateConceptViewContent`×2, `DATA_nodes_find`, `initPathFinder`, `findShortestPathUnweighted`, `highlightPhilosopherOnGraph`, `pickLinkEnd`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`, `metricsNodes`, `applyMetricsScope`, `bfsFromSource`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateWeightedDegree`, `dijkstraFromSource`, `findConnectedComponents`, `ambiguousLabels`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `saveOriginalRadii`, `visualizeMetricBySize`, `highlightNodeById`, `отобратьКонцепции`, `selectSearchResult`, `selectCustomOption`, `showSimilarityOverlay`, `updateSimilarityLegend`, `startRadiusAnimation`, `stepRadiusAnimation`, `rebuildQuadtree`, `gfxNode`, `simulation`, `stmt018`, `stmt020`, `resetSimulation`, `openConceptById`, `similarConceptsBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `getIsolatedConceptsAfterDeletion`, `openEditConceptModal`, `updateGraphData`, `labelOf`, `conceptIntegrityWarnings`, `philosopherIntegrityWarnings`, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `generatePhilosopherEditContent`, `generateConceptEditContent`, `selectConnectionEditConcept`, `swapConnectionConcepts`, `createNewConnectionForConcept`, `selectConnectionViewConcept`, `gotoNodeFromModal`, `showAllConcepts`, `stmt031` |
| `links` | const | 13929 | вызов relations.map() | `relations` | `connectionIntegrityWarnings`×4, `applyBasicFilter`×3, `generateOverviewContent`×3, `updateFilterStats`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `toggleMetricVisualization`×2, `repaintPickCanvas`×2, `pickLink`×2, `makeClassed`×2, `highlightCombined`×2, `removeLinkEverywhere`×2, `saveConnectionData`×2, `generatePhilosopherViewContent`×2, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `highlightPhilosopherOnGraph`, `handleLegendLinkSearch`, `показатьНайденныеСвязи`, `highlightLinkOnGraph`, `buildAdjacencyGraph`, `relationHint`, `metricsLinks`, `applyMetricsScope`, `exportToSVG`, `needsContinuousAnimation`, `renderScene`, `gfxLink`, `simulation`, `stmt018`, `highlightConnected`, `conceptDegreesDetailed`, `findConnection`, `getConceptConnections`, `updateGraphData`, `groundingCyclePath`, `deleteConnection`, `onConnTypeChange`, `updateConnEditPairNote`, `connectionsBetween`, `handleConnectionViewSearch`, `generateConceptViewContent`, `stmt031` |
| `conceptToRubrics` | const | 13939 | объект (0) | — | `FilterModes`×14, `rebuildDerivedIndexes`×3, `buildAdjacencyGraph`×2, `saveConceptData`×2, `generateConceptViewContent`×2, `stmt006`, `revolutionaryIndex`, `hasConceptChanges`, `removeConceptEverywhere`, `generateConceptEditContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `rubricsObj` | const | 13945 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt007` |
| `useWeightedPaths` | let | 13953 | литерал true | — | `metricDescriptions`×23, `findAndShowPath`×3, `calculatePageRank`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `findShortestPath`, `buildGlobalGraphCache`, `calculateBetweennessAsync`, `bfsFromSource`, `calculateClosenessCentrality`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt064`, `stmt068` |
| `respectDirection` | let | 13954 | литерал true | — | `metricDescriptions`×15, `calculatePageRank`×4, `findAndShowPath`×3, `calculateBetweennessAsync`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `updateScopeToggles`×2, `findShortestPath`, `metricScopeFactor`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt065`, `stmt068` |
| `skipTypologicalInPaths` | let | 13959 | литерал false | — | `pathLinkAllowed`, `findAndShowPath` |
| `CHRONOLOGY_MODES` | const | 13975 | объект (4) | — | `isChronologicallyValid`×3, `currentChronologyMode`, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList` |
| `currentChronologyMode` | let | 14016 | ссылка CHRONOLOGY_MODES.STRICT | `CHRONOLOGY_MODES` | `findAndShowPath`×3, `findShortestPathWeighted`×2, `findShortestPathUnweighted`×2, `isChronologicallyValid`, `resolvePathLinkList`, `stmt070` |
| `MATURITY_AGE` | const | 14019 | литерал 25 | — | `strictChronologyCheck`×2, `isChronologicallyValid`×2 |
| `selectedPhilosophers` | let | 14022 | new Set | `philosopherConcepts` | `FilterModes`×15, `handleChainsMode`×7, `handleUniqueChainsMode`×6, `togglePhilosopher`×3, `savePhilosopherData`×3, `afterDataChange`×2, `syncPhilosopherCheckboxes`, `onlyTradition`, `addTradition`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `deletePhilosopher` |
| `selectedRelations` | let | 14023 | new Set | `relationTypesObj` | `FilterModes`×7, `toggleRelation`×3, `buildAdjacencyGraph`, `applyBasicFilter`, `selectAllRelations`, `deselectAllRelations` |
| `selectedTraditions` | let | 14024 | new Set | `traditions` | `toggleTradition`×3, `philTraditionsSelected`, `philosopherPassesTraditions`, `selectAllTraditions`, `deselectAllTraditions` |
| `philosopherTraditions` | const | 14027 | объект (0) | — | `rebuildPhilosopherTraditions`×3, `analyzePathTraditions`×3, `renderClosestPairs`×2, `connectionTraditionNote`×2, `stmt008`, `traditionsOfPhilosopher`, `philTraditionsSelected`, `philosopherPassesTraditions`, `традицииФилософаБлок`, `DATA_traditions_of` |
| `selectedRubrics` | let | 14033 | new Set | `rubrics` | `FilterModes`×14, `toggleRubric`×3, `buildAdjacencyGraph`×2, `selectAllRubrics`, `deselectAllRubrics` |
| `filterMode` | let | 14036 | строка | — | `applyFiltersImmediate`×3, `handleChainsMode`, `handleUniqueChainsMode`, `changeFilterMode` |
| `arrowHoverTimer` | let | 14752 | литерал null | — | `handlePathArrowHover`×4 |
| `ARROW_HOVER_DELAY` | const | 14753 | литерал 800 | — | `handlePathArrowHover` |
| `currentPathData` | let | 14852 | литерал null | — | `showPathDescriptionsModal`×2, `findAndShowPath` |
| `nodesDescriptionsVisible` | let | 14992 | литерал false | — | `togglePathNodesDescriptions`×4 |
| `видПоиска` | let | 15019 | строка | — | `setSearchKind` |
| `выбранныеФилософы` | const | 15098 | new Set | — | `highlightPhilosopherOnGraph`×8, `отметитьВыбранныхВЛегенде` |
| `поискСвязи` | const | 15167 | объект (2) | — | `handleLegendLinkSearch`×2, `очиститьПоискСвязи`×2, `pickLinkEnd`, `показатьНайденныеСвязи` |
| `показанныеВопрекиОтбору` | const | 15279 | new Set | — | `applyBasicFilter`×3, `обновитьЗаметкуОбОтборе`×2, `resetBeyondFilter`×2, `selectSearchResult`, `stmt047` |
| `коробПодсказки` | let | 15405 | литерал null | — | `показатьПодсказку`×9, `скрытьПодсказку`×2 |
| `СОБЫТИЯ_ШИНЫ` | const | 15439 | массив (14) | — | `подписаться`, `известить` |
| `подписчикиШины` | const | 15455 | new Map | — | `подписаться`×3, `известить` |
| `LoadingIndicator` | const | 15492 | объект (1) | `CHAIN_SEARCH`×2 | `handleChainsMode`, `handleUniqueChainsMode`, `renderClosestPairs` |
| `CHAIN_SEARCH` | const | 15645 | объект (11) | — | `processBFS`×5, `handleChainsMode`×4, `handleUniqueChainsMode`×4, `LoadingIndicator`×2, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` |
| `CHAIN_WARN_THRESHOLD` | const | 15807 | литерал 15 | — | `confirmLongChainSearch` |
| `FilterModes` | const | 15938 | объект (7) | `selectedPhilosophers`×15, `conceptToRubrics`×14, `selectedRubrics`×14, `selectedRelations`×7, `linkPassesTraditions`×5, `philTraditionsSelected`×4 | `applyBasicFilter` |
| `visibleNodeIds` | var | 16120 | литерал null | — | `isNodeVisible`×2, `updateFilterStats`×2, `forgetNode`×2, `applyBasicFilter`, `applyChainVisibility` |
| `visibleLinkSet` | var | 16121 | литерал null | — | `isLinkVisible`×2, `updateFilterStats`×2, `forgetLink`×2, `applyBasicFilter`, `applyChainVisibility` |
| `debouncedApplyFilters` | const | 16373 | вызов debounce() | `debounce`, `applyFiltersImmediate` | `applyFilters` |
| `RELATION_HINTS` | const | 16380 | объект (21) | — | `relationHint`×2 |
| `LAYER_NAMES` | const | 16403 | объект (4) | — | `relationHint`×2 |
| `metricsLinkSource` | let | 16742 | литерал null | — | `metricsLinks`, `applyMetricsScope`, `closeStatsModal` |
| `metricsNodeSource` | let | 16743 | литерал null | — | `metricsNodes`, `applyMetricsScope`, `closeStatsModal` |
| `metricsScopeActive` | let | 16744 | литерал false | — | `applyMetricsScope`×3, `buildGlobalGraphCache`×2, `metricScopeFactor`, `closeStatsModal` |
| `lastScopeKey` | let | 16783 | литерал null | — | `applyMetricsScope`×2, `closeStatsModal` |
| `METRIC_FLAGS` | const | 16831 | объект (33) | — | `effectiveScopeFlags`, `metricScopeFactor`, `installMetricScopeWrappers`, `updateScopeToggles` |
| `VIEW_METRIC` | const | 16880 | объект (31) | — | `effectiveScopeFlags`, `updateScopeToggles` |
| `betweennessCache` | let | 17082 | литерал null | — | `calculateBetweennessAsync`×3, `generateBetweennessContent`×3, `calculateBetweenness`×2, `invalidateBetweennessCache`, `toggleMetricVisualization` |
| `betweennessCalculating` | let | 17083 | литерал false | — | `calculateBetweennessAsync`×3, `calculateBetweenness`, `invalidateBetweennessCache` |
| `pageRankCache` | let | 17261 | литерал null | — | `calculatePageRank`×3, `generatePageRankContent`×3, `invalidatePageRankCache`, `toggleMetricVisualization` |
| `pageRankCalculating` | let | 17262 | литерал false | — | `calculatePageRank`×3, `invalidatePageRankCache` |
| `closenessCache` | let | 17386 | литерал null | — | `calculateClosenessCentrality`×3, `generateClosenessContent`×3, `invalidateClosenessCache`, `toggleMetricVisualization` |
| `closenessCalculating` | let | 17387 | литерал false | — | `calculateClosenessCentrality`×3, `invalidateClosenessCache` |
| `clusteringCache` | let | 17515 | литерал null | — | `calculateClusteringCoefficient`×3, `invalidateClusteringCache` |
| `weightedClusteringCache` | let | 17577 | литерал null | — | `calculateWeightedClustering`×3, `generateWeightedClusteringContent`×3, `invalidateWeightedClusteringCache`, `toggleMetricVisualization` |
| `localCohesionCache` | let | 17578 | литерал null | — | `calculateLocalCohesion`×3, `generateLocalCohesionContent`×3, `invalidateLocalCohesionCache`, `toggleMetricVisualization` |
| `richClubCache` | let | 17579 | литерал null | — | `calculateRichClubCoefficient`×3, `generateRichClubContent`×3, `invalidateRichClubCache`, `toggleMetricVisualization` |
| `eigenvectorCache` | let | 17884 | литерал null | — | `calculateEigenvectorCentrality`×3, `generateEigenvectorContent`×3, `invalidateEigenvectorCache`, `toggleMetricVisualization` |
| `eigenvectorCalculating` | let | 17885 | литерал false | — | `calculateEigenvectorCentrality`×3, `invalidateEigenvectorCache` |
| `graphCache` | let | 17887 | литерал null | — | `buildGlobalGraphCache`×3, `invalidateGraphCache` |
| `_concepts` | let | 18029 | литерал null | — | `metricDescriptions`×5, `philosopherSimilarityData`×4, `initializeMetricsData`×2, `metricCoverage`×2, `renderClosestPairs`×2, `showPhilosopherProfileModal`×2, `buildIncomingLinks`, `buildOutgoingLinks`, `internalCoherenceIndex`, `tensionScales`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `generateRankings`, `generatePhilosopherRankings`, `medianNodeDegree`, `similarityData`, `neighborSets`, `generativityScores`, `generatePhilosopherPairsContent`, `renderComparison`, `metricPercentile`, `metricRank` |
| `_relations` | let | 18030 | литерал null | — | `philosopherSimilarityData`×3, `reflexiveLinkOf`, `buildIncomingLinks`, `buildOutgoingLinks`, `initializeMetricsData`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `medianNodeDegree`, `nodeDegreeOf`, `neighborSets`, `generativityScores`, `conceptDegreeForNorm` |
| `_philosophers` | let | 18031 | литерал null | — | `initializeMetricsData`×2 |
| `_conceptMap` | let | 18032 | литерал null | — | `revolutionaryIndex`×6, `criticalPowerIndex`×5, `influenceIndex`×4, `syntheticIndex`×4, `paradigmShiftIndex`×3, `conceptualFertilityIndex`×3, `internalCoherenceIndex`×2, `philosopherInterdisciplinaryIndex`×2, `temporalInfluencePattern`×2, `conceptualComplexityIndex`×2, `linkInInfluenceScope`×2, `generativityScores`×2, `generativeIndex`×2, `instrumentalIndex`×2, `traditionBridgingIndex`×2, `abstractionIndex`×2, `deductiveIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `tensionIndex`, `philosopherHistoricalReachIndex`, `conceptualContinuityIndex`, `philosopherSimilarityData` |
| `_philosopherMap` | let | 18033 | литерал null | — | `criticalPowerIndex`×4, `revolutionaryIndex`×4, `influenceIndex`×4, `conceptualFertilityIndex`×3, `paradigmShiftIndex`×2, `philosopherHistoricalReachIndex`×2, `temporalInfluencePattern`×2, `sameTraditionPhil`×2, `traditionBridgingIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `conceptualContinuityIndex` |
| `_incomingLinks` | let | 18034 | литерал null | — | `criticalPowerIndex`×2, `revolutionaryIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `temporalInfluencePattern`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `traditionBridgingIndex`, `abstractionIndex` |
| `_outgoingLinks` | let | 18035 | литерал null | — | `criticalPowerIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveDepth`, `deductiveIndex` |
| `problemGenerationIndexCache` | let | 18108 | литерал null | — | `invalidateProblemGenerationIndexCache` |
| `criticalPowerIndexCache` | let | 18223 | литерал null | — | `invalidateCriticalPowerIndexCache` |
| `revolutionaryIndexCache` | let | 18406 | литерал null | — | `invalidateRevolutionaryIndexCache` |
| `paradigmShiftIndexCache` | let | 18538 | литерал null | — | `invalidateParadigmShiftIndexCache` |
| `influenceIndexCache` | let | 18594 | литерал null | — | `invalidateInfluenceIndexCache` |
| `foundationalIndexCache` | let | 18739 | литерал null | — | `invalidateFoundationalIndexCache` |
| `SYSTEMATIC_TYPES` | const | 18747 | массив (12) | — | `philosopherSystematicIndex` |
| `DISRUPTIVE_TYPES` | const | 18750 | массив (2) | — | `philosopherSystematicIndex` |
| `CONSTRUCTIVE_TYPES` | const | 18752 | массив (8) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `POLEMICAL_TYPES` | const | 18754 | массив (5) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `syntheticIndexCache` | let | 18818 | литерал null | — | `invalidateSyntheticIndexCache` |
| `dialogicalIndexCache` | let | 18892 | литерал null | — | `invalidateDialogicalIndexCache` |
| `internalCoherenceIndexCache` | let | 18940 | литерал null | — | `invalidateInternalCoherenceIndexCache` |
| `tensionIndexCache` | let | 18996 | литерал null | — | `invalidateTensionIndexCache` |
| `TENSION_WEIGHTS` | const | 19011 | объект (3) | — | — |
| `_tensionScales` | let | 19017 | литерал null | — | `tensionScales`×4, `invalidateTensionScales` |
| `_tensionScalesComputing` | let | 19018 | литерал false | — | `tensionScales`×3 |
| `philosopherProfileCache` | let | 19255 | литерал null | — | `invalidatePhilosopherProfileCache` |
| `philosopherSystematicIndexCache` | let | 19305 | литерал null | — | `invalidatePhilosopherSystematicIndexCache` |
| `philosopherHistoricalReachIndexCache` | let | 19368 | литерал null | — | `invalidatePhilosopherHistoricalReachIndexCache` |
| `philosopherInterdisciplinaryIndexCache` | let | 19435 | литерал null | — | `invalidatePhilosopherInterdisciplinaryIndexCache` |
| `temporalInfluencePatternCache` | let | 19491 | литерал null | — | `invalidateTemporalInfluencePatternCache` |
| `generateRankingsCache` | let | 19556 | литерал null | — | `generateRankings`×2, `setInfluenceScope`, `invalidateGenerateRankingsCache`, `toggleMetricValueMode` |
| `generatePhilosopherRankingsCache` | let | 19595 | литерал null | — | `generatePhilosopherRankings`×3, `invalidateGeneratePhilosopherRankingsCache` |
| `transformationIndexCache` | let | 19699 | литерал null | — | `invalidateTransformationIndexCache` |
| `conceptualFertilityIndexCache` | let | 19738 | литерал null | — | `invalidateConceptualFertilityIndexCache` |
| `conceptualComplexityIndexCache` | let | 19795 | литерал null | — | `invalidateConceptualComplexityIndexCache` |
| `conceptualContinuityIndexCache` | let | 19850 | литерал null | — | `invalidateConceptualContinuityIndexCache` |
| `SIM_METRIC_LABELS` | const | 19929 | объект (17) | — | `renderComparison` |
| `_medianDegreeCache` | let | 19945 | литерал null | — | `medianNodeDegree`×4, `invalidateEverythingForScope` |
| `_simCache` | let | 19969 | литерал null | — | `similarityData`×4, `invalidateSimilarityCache`, `showSimilarityOverlay` |
| `_pairCache` | let | 20030 | литерал null | — | `allConceptPairsAsync`×4, `invalidateSimilarityCache`, `allConceptPairs` |
| `_pairCalculating` | let | 20031 | литерал false | — | `allConceptPairsAsync`×3, `invalidateSimilarityCache`, `renderClosestPairs` |
| `PAIRS_CHUNK_ROWS` | const | 20042 | литерал 15 | — | `allConceptPairsAsync` |
| `_neighborCache` | let | 20112 | литерал null | — | `neighborSets`×3 |
| `PHIL_SIM_MIN_CONCEPTS` | const | 20216 | литерал 3 | — | `philosopherSimilarity`×2 |
| `PHIL_SIM_MIN_RUBRIC_UNION` | const | 20235 | литерал 3 | — | `philosopherSimilarity`, `metricDescriptions` |
| `_philSimCache` | let | 20241 | литерал null | — | `philosopherSimilarityData`×4, `invalidatePhilosopherSimilarityCache` |
| `influenceScope` | var | 20385 | строка | — | `influenceIndex`×2, `setInfluenceScope`×2, `influenceScopeSwitcher`×2, `linkInInfluenceScope`×2 |
| `INFLUENCE_SCOPE_LABELS` | const | 20386 | объект (3) | — | `influenceIndex`, `setInfluenceScope`, `influenceScopeSwitcher` |
| `GENERATIVITY_DAMPING` | const | 20408 | литерал 0.85 | — | `generativityScores` |
| `GENERATIVITY_ITERATIONS` | const | 20409 | литерал 40 | — | `generativityScores` |
| `_generativityCacheByScope` | let | 20414 | new Map | — | `generativityScores`×3, `invalidateGenerativityCache` |
| `instrumentalIndexCache` | let | 20507 | литерал null | — | `invalidateInstrumentalIndexCache` |
| `BRIDGING_MIN_EXTERNAL` | const | 20553 | литерал 5 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `BRIDGING_WEIGHT_REF` | const | 20558 | литерал 50 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `traditionBridgingCache` | let | 20559 | литерал null | — | `invalidateTraditionBridgingCache` |
| `abstractionIndexCache` | let | 20629 | литерал null | — | `invalidateAbstractionIndexCache` |
| `deductiveIndexCache` | let | 20667 | new Map | — | `deductiveIndex`×3, `invalidateDeductiveIndexCache` |
| `metricsScope` | let | 20755 | строка | — | `applyMetricsScope`×2, `initializePhilosophyMetrics`×2, `refreshMetricsIfScoped`, `metricsScopeCounts`, `handleMetricsScopeChange`, `openStatsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `metricDescriptions` | const | 20882 | объект (39) | `useWeightedPaths`×23, `respectDirection`×15, `_concepts`×5, `BRIDGING_MIN_EXTERNAL`×2, `BRIDGING_WEIGHT_REF`×2, `PHIL_SIM_MIN_RUBRIC_UNION` | `getMetricDescription` |
| `currentStatsView` | let | 21357 | литерал null | — | `openStatsModal`×4, `handleStatsParameterChange`×3, `stmt042`×2, `stmt058`×2, `effectiveScopeFlags`, `switchStatsView` |
| `isStatsModalOpen` | let | 21358 | литерал false | — | `calculateMetricFromModal`×2, `graphIsCovered`×2, `openStatsModal`, `closeStatsModal`, `stmt009`, `stmt010`, `toggleMetricVisualization`, `stmt042`, `stmt058` |
| `WEIGHT_WORDS` | const | 21619 | объект (3) | — | `showPathDescriptionsModal`, `стрелкаСвязи` |
| `_ambiguousLabels` | let | 21708 | литерал null | — | `ambiguousLabels`×4 |
| `metricValueMode` | let | 21727 | строка | — | `generateMetricResults`×4, `generateConceptRankingsContent`×3, `generateRankings`×2, `toggleMetricValueMode`×2, `applyMetricMode` |
| `generateRankingsMode` | let | 21728 | литерал null | — | `generateRankings`×2 |
| `METRIC_COVERAGE_FN` | const | 21753 | объект (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `generateMetricResults`×4, `metricCoverage` |
| `METRIC_COVERAGE_WARN` | const | 21774 | литерал 0.5 | — | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `_metricCoverageCache` | let | 21775 | объект (0) | — | `metricCoverage`×3, `invalidateMetricCoverageCache` |
| `lastZeroCount` | let | 21884 | литерал 0 | — | `rankKeep`×2, `generateMetricResults`×2 |
| `METRIC_FIELD_LABELS` | const | 21897 | объект (100) | — | `genericDetailsHTML`×5 |
| `metricLayoutMode` | let | 22021 | строка | — | `generateMetricResults`×4, `toggleMetricLayout`×3, `stmt011`, `applyMetricLayout` |
| `_cmpA` | let | 22852 | литерал null | — | `renderComparison`×4, `generateComparisonContent`×3, `openPairInComparison`, `selectCustomOption` |
| `_cmpB` | let | 22852 | литерал null | — | `renderComparison`×4, `generateComparisonContent`×3, `openPairInComparison`, `selectCustomOption` |
| `_pairsKind` | var | 22864 | строка | — | `renderClosestPairs` |
| `_pairsMinDegree` | var | 22865 | литерал 6 | — | `renderClosestPairs`×3, `generateClosestPairsContent`×2 |
| `_pairsMinShared` | var | 22866 | литерал 3 | — | `generateClosestPairsContent`×2, `renderClosestPairs`×2 |
| `_pairsCrossAuthor` | var | 22867 | литерал true | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pairsCrossTradition` | var | 22868 | литерал false | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pcmpA` | var | 22870 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `_pcmpB` | var | 22870 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `PHIL_SIM_LABELS` | const | 22871 | объект (4) | — | `renderPhilosopherPairs`×2, `renderPhilosopherComparison`, `generatePhilosopherPairsContent` |
| `_philPairsKind` | var | 22971 | строка | — | `renderPhilosopherPairs`×3 |
| `isVisualizingBySize` | let | 23854 | литерал false | — | `resetNodeSizes`×2, `updateVisualizationControlSection`, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `currentVisualizedMetric` | let | 23855 | литерал null | — | `updateVisualizationControlSection`×3, `resetNodeSizes`×2, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `originalRadii` | let | 23856 | new Map | — | `saveOriginalRadii`×3, `resetNodeSizes` |
| `originalTextDy` | let | 23857 | new Map | — | `saveOriginalRadii`, `resetNodeSizes` |
| `selectedSourceNode` | let | 24723 | литерал null | — | `findAndShowPath`, `selectCustomOption` |
| `selectedTargetNode` | let | 24724 | литерал null | — | `findAndShowPath`, `selectCustomOption` |
| `editMode` | let | 24823 | объект (5) | — | `handleNodeClick`×8, `dispatchClick` |
| `clickTimer` | let | 24836 | литерал null | — | `handleNodeClick`×12 |
| `clickCount` | let | 24837 | литерал 0 | — | `handleNodeClick`×10 |
| `lastClickedNode` | let | 24838 | литерал null | — | `handleNodeClick`×14 |
| `linkClickTimer` | let | 24959 | литерал null | — | `handleLinkClick`×5 |
| `linkClickCount` | let | 24960 | литерал 0 | — | `handleLinkClick`×4 |
| `viewWidth` | let | 25036 | ссылка window.innerWidth | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightLinkOnGraph`, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `spacingX`, `stmt023`, `addNodeToGraph`, `gotoNodeFromModal` |
| `viewHeight` | let | 25037 | ссылка window.innerHeight | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightLinkOnGraph`, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `spacingY`, `stmt023`, `addNodeToGraph`, `gotoNodeFromModal` |
| `gfxCanvas` | const | 25046 | вызов document.getElementById() | — | `resizeCanvas`×6, `initGraphEventHandlers`×3, `draw`×2, `ctx`, `gfxSvg`, `toGraph`, `pickLink`, `stmt015`, `dispatchMove`, `selectConceptOnGraph`, `cancelGraphSelection` |
| `ctx` | const | 25047 | вызов gfxCanvas.getContext() | `gfxCanvas` | `draw`×4 |
| `gfxSvg` | const | 25048 | вызов d3.select() | `gfxCanvas` | `highlightLinkOnGraph`, `highlightNodeById`, `selectSearchResult`, `stmt015`, `centerGraph`, `gotoNodeFromModal` |
| `pickCanvas` | const | 25051 | вызов document.createElement() | — | `resizeCanvas`×2, `repaintPickCanvas`×2, `pickLink`×2, `pickCtx` |
| `pickCtx` | const | 25052 | вызов pickCanvas.getContext() | `pickCanvas` | `repaintPickCanvas`×13, `pickLink` |
| `pickDirty` | let | 25053 | литерал true | — | `resizeCanvas`, `draw`, `repaintPickCanvas`, `pickLink`, `gfxZoom`, `stmt015`, `stmt017`, `updateGraphData`, `updateLinkOnGraph` |
| `PICK_LINK_WIDTH` | const | 25057 | литерал 10 | — | `repaintPickCanvas` |
| `dpr` | let | 25059 | выражение | — | `draw`×4, `repaintPickCanvas`×4, `resizeCanvas`×3, `pickLink`×2 |
| `renderState` | const | 25074 | объект (9) | — | `forgetNode`×6, `subSelection`×5, `stepRadiusAnimation`×4, `stmt015`×4, `renderScene`×3, `stmt021`×3, `forgetLink`×3, `needsContinuousAnimation`×2, `linkDrawWidth`×2, `makeClassed`×2, `dispatchMove`×2, `initGraphEventHandlers`×2, `toggleUniformLinkWidth`, `exportToPNG`, `exportToSVG`, `nodeRadius`, `nodeLabelDy`, `hasNodeClass`, `hasLinkClass`, `linkStrokeWidth`, `linkHoverStrokeWidth`, `linkDrawAlpha`, `draw`, `startRadiusAnimation`, `toGraph`, `pickNode`, `repaintPickCanvas`, `gfxZoom`, `addNodeToGraph` |
| `arrowMode` | var | 25088 | строка | — | `visualizeMetricBySize`, `resetNodeSizes`, `arrowPoints`, `arrowPointsStart` |
| `arrowRadius` | var | 25089 | литерал null | — | `arrowPoints`×2, `arrowPointsStart`×2, `visualizeMetricBySize`, `resetNodeSizes` |
| `uniformLinkWidthActive` | var | 25090 | литерал false | — | `toggleUniformLinkWidth` |
| `similarityOverlay` | var | 25095 | литерал null | — | `renderScene`×15, `updateSimilarityLegend`×11, `stmt020`×4, `toggleSimilarityKind`×3, `forgetNode`×3, `stmt037`×2, `showSimilarityOverlay`, `clearSimilarityOverlay`, `linkDrawAlpha` |
| `SIMILARITY_KEEP_QUANTILE` | const | 25101 | литерал 0.85 | — | `showSimilarityOverlay` |
| `SIMILARITY_ARCS` | const | 25102 | литерал 6 | — | `showSimilarityOverlay`, `updateSimilarityLegend` |
| `LABEL_HIDE_BELOW` | const | 25208 | литерал 0.6 | — | `renderScene` |
| `LABEL_ALL_ABOVE` | const | 25209 | литерал 1 | — | `renderScene` |
| `drawScheduled` | let | 25217 | литерал false | — | `requestDraw`×3 |
| `рисовальщик` | let | 25221 | литерал null | — | `requestDraw`×2, `назначитьРисовальщика` |
| `animLoopRunning` | let | 25236 | литерал false | — | `ensureAnimLoop`×3 |
| `DRAW_ORDER` | const | 25462 | массив (5) | — | `exportToSVG`, `renderScene` |
| `quadtree` | let | 25643 | литерал null | — | `pickNode`×2, `rebuildQuadtree` |
| `nodeHandlers` | const | 25712 | объект (0) | — | `dispatchMove`×4, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxNode` |
| `linkHandlers` | const | 25712 | объект (0) | — | `dispatchMove`×6, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxLink` |
| `gfxNode` | const | 25754 | объект (5) | `nodes`, `requestDraw`, `nodeHandlers`, `makeClassed`, `subSelection` | `handleNodeClick`×5, `highlightPhilosopherOnGraph`×2, `visualizeMetricBySize`×2, `resetNodeSizes`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightNodeById`, `initGraphEventHandlers`, `highlightCombined`, `highlightConnected`, `resetHighlight`, `stmt020`, `gotoNodeFromModal` |
| `gfxLink` | const | 25766 | объект (4) | `links`, `requestDraw`, `linkHandlers`, `makeClassed` | `gfxLinkAll`, `initGraphEventHandlers`, `stmt021` |
| `gfxLinkAll` | const | 25776 | объект (2) | `requestDraw`, `gfxLink` | `highlightPhilosopherOnGraph`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightCombined`, `highlightConnected`, `resetHighlight` |
| `gfxZoom` | const | 25784 | вызов d3.zoom() .scaleExtent([0.1, 4…() | `pickDirty`, `renderState`, `requestDraw` | `highlightLinkOnGraph`, `highlightNodeById`, `selectSearchResult`, `stmt015`, `centerGraph`, `gotoNodeFromModal` |
| `simulation` | let | 25839 | вызов d3.forceSimulation(nodes) .for…() | `nodes`, `links`, `viewWidth`, `viewHeight` | `toggleGrouping`×3, `stmt023`×3, `updateGraphData`×3, `stmt017`×2, `centerGraph`×2, `freezeSimulation`×2, `unfreezeSimulation`×2, `stmt018`, `dragstarted`, `dragended`, `resetSimulation`, `toggleSimulationFreeze`, `stmt063` |
| `tickCount` | let | 25847 | литерал 0 | — | `stmt017`×2, `stmt018`, `dragstarted`, `resetSimulation`, `toggleSimulationFreeze`, `centerGraph`, `unfreezeSimulation`, `toggleGrouping` |
| `maxTicks` | const | 25848 | литерал 300 | — | `stmt017`, `toggleSimulationFreeze`, `unfreezeSimulation` |
| `selectedNodes` | let | 25878 | new Set | — | `handleNodeClick`×13, `highlightCombined`×6, `cleanupInvisibleSelections`×4, `highlightNodeById`×2, `exportToSVG`×2, `selectSearchResult`×2, `handleLinkSelect`×2, `renderScene`×2, `forgetNode`×2, `gotoNodeFromModal`×2, `highlightPhilosopherOnGraph`, `highlightLinkOnGraph`, `isEdgeConnectedToSelectedNodes`, `resetHighlight` |
| `selectedEdges` | let | 25881 | new Set | — | `handleLinkSelect`×13, `highlightCombined`×5, `highlightLinkOnGraph`×2, `handleNodeClick`×2, `highlightPhilosopherOnGraph`, `linkVisualState`, `isNodeConnectedToSelectedEdges`, `resetHighlight`, `stmt021`, `forgetLink` |
| `lastHoverNode` | let | 25889 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `lastHoverLink` | let | 25889 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `tooltip` | const | 26142 | вызов d3.select() | — | `stmt020`×2 |
| `tooltipTimeout` | let | 26143 | литерал null | — | `stmt020`×6 |
| `simLockedByHand` | let | 26365 | литерал false | — | `updateFreezeButton`×3, `toggleSimulationFreeze`×2, `freezeSimulation`, `unfreezeSimulation` |
| `philosopherNames` | const | 26391 | вызов Object.keys() | `philosopherConcepts` | `rows`, `stmt022`, `stmt023` |
| `groupPositions` | const | 26392 | объект (0) | — | `stmt023`×3, `toggleGrouping`×2, `stmt022` |
| `cols` | const | 26393 | литерал 6 | — | `stmt023`×3, `stmt022`×2, `rows`, `spacingX` |
| `rows` | const | 26394 | вызов Math.ceil() | `philosopherNames`, `cols` | `spacingY`, `stmt023` |
| `spacingX` | const | 26395 | выражение | `viewWidth`, `cols` | `stmt022` |
| `spacingY` | const | 26396 | выражение | `viewHeight`, `rows` | `stmt022` |
| `isGrouped` | let | 26407 | литерал false | — | `toggleGrouping`×3, `stmt023` |
| `PROFILE_METRICS` | const | 26583 | массив (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `profileOrderMode` | let | 26639 | строка | — | `toggleProfileOrder`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal` |
| `ModalContext` | const | 26875 | объект (4) | — | `saveConnectionData`×6, `deleteConnection`×6, `toggleModalMode`×5, `swapConnectionConcepts`×5, `pushModalState`×4, `refreshOpenModalToolbar`×4, `closeUniversalModal`×4, `openUniversalModal`×3, `hasUnsavedChanges`×3, `selectConnectionViewConcept`×3, `authLogout`×2, `hasConnectionChanges`×2, `deleteConcept`×2, `updateConnEditPairNote`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `popModalState`, `savePhilosopherData`, `deletePhilosopher`, `saveConceptData`, `handleConnectionEditSearch`, `selectConnectionEditConcept`, `handleConnectionViewSearch`, `updateConnectionVisualization` |
| `modalStack` | const | 26886 | массив (0) | — | `pushModalState`×5, `stmt030`×2, `stmt038`×2, `popModalState`, `openUniversalModal`, `closeUniversalModal` |
| `MODAL_STACK_MAX` | const | 26887 | литерал 20 | — | `pushModalState` |
| `AUTH_ADMIN` | const | 26981 | объект (2) | — | `submitAuth`×3 |
| `authAccounts` | const | 26982 | new Map | — | `submitAuth`×4 |
| `authSession` | let | 26983 | объект (1) | — | `submitAuth`×3, `canEdit`×2, `authLogout`, `renderAuthControls` |
| `authModalKind` | let | 26984 | строка | — | `openAuthModal`, `showAuthNotice`, `submitAuth` |
| `pinnedVisibleNodes` | const | 27516 | new Set | — | `applyBasicFilter`×3, `resetBeyondFilter`, `selectSearchResult`, `addNodeToGraph`, `forgetNode` |
| `DATA_SETS` | const | 27659 | массив (6) | — | `downloadData`×2, `saveToFolder` |
| `hasUnsavedEdits` | let | 27661 | литерал false | — | `markDirty`, `hasUnsaved`, `downloadData`, `saveToFolder`, `stmt024` |
| `dataFolder` | let | 27689 | литерал null | — | `saveToFolder`×3 |
| `WEIGHT_OPTIONS` | const | 27823 | массив (3) | — | `generateConnectionEditContent` |
| `GROUNDING_TYPES` | const | 27866 | new Set | — | `groundingCyclePath`×2 |
| `CONN_WEIGHT_WORDS` | const | 29046 | объект (3) | — | `generateConnectionVisualization` |
| `allDescriptionsExpanded` | let | 29769 | литерал false | — | `toggleAllConnectionDescriptions`×4 |
| `allPhilosopherConceptDescriptionsExpanded` | let | 30477 | литерал false | — | `toggleAllPhilosopherConceptDescriptions`×4 |
| `allPhilosopherConnectionDescriptionsExpanded` | let | 30513 | литерал false | — | `toggleAllPhilosopherConnectionDescriptions`×4 |
| `legendWeightsToggle` | const | 30772 | вызов document.getElementById() | — | `stmt064`×2 |
| `legendDirectionToggle` | const | 30774 | вызов document.getElementById() | — | `stmt065`×2 |


## 3. Операторы верхнего уровня

Исполняемый код вне функций: производные словари (`relationTypesObj`
и подобные), навешивание обработчиков, запуск раскладки, стартовые вызовы.
Порядок в таблице — порядок исполнения при загрузке страницы.

| Метка | Вид | Стр. | Длина | Что делает | Использует |
|---|---|---|---|---|---|
| stmt001 | построение | 13868 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherIdToName` |
| stmt002 | построение | 13874 | 6 | `philosophers.forEach(…)` | `philosophers`, `philosopherConcepts` |
| stmt003 | построение | 13883 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherOrder` |
| stmt004 | построение | 13889 | 10 | `relationTypes.forEach(…)` | `relationTypes`, `relationTypesObj` |
| stmt005 | построение | 13914 | 3 | `relationTypes.forEach(…)` | `relationTypes`, `linkColors` |
| stmt006 | построение | 13940 | 3 | `concepts.forEach(…)` | `concepts`, `conceptToRubrics` |
| stmt007 | построение | 13946 | 6 | `rubrics.forEach(…)` | `rubrics`, `concepts`, `rubricsObj` |
| stmt008 | построение | 14028 | 1 | `philosophers.forEach(…)` | `philosophers`, `philosopherTraditions` |
| stmt009 | обработчик | 21565 | 7 | `document.addEventListener('click')` | `известить`, `isStatsModalOpen` |
| stmt010 | обработчик | 21574 | 5 | `document.addEventListener('keydown')` | `isStatsModalOpen`, `closeStatsModal` |
| stmt011 | try | 22022 | 4 | `try { const saved = localStorage.getItem('metricLayoutMode'); if (save…` | `metricLayoutMode` |
| stmt012 | обработчик | 24220 | 3 | `window.addEventListener('load')` | `saveOriginalRadii` |
| stmt013 | обработчик | 24615 | 15 | `document.addEventListener('click')` | — |
| stmt014 | обработчик | 24807 | 4 | `document.addEventListener('DOMContentLoaded')` | `initializeCustomSelects` |
| stmt015 | вызов | 25794 | 37 | `gfxSvg.call(d3.drag() .container(gfxCanvas) .subje…()` | `renderState`×4, `gfxCanvas`, `gfxSvg`, `pickDirty`, `requestDraw`, `rebuildQuadtree`, `pickNode`, `gfxZoom`, `dragstarted`, `dragended` |
| stmt016 | вызов | 25832 | 1 | `resizeCanvas()` | `resizeCanvas` |
| stmt017 | обработчик | 25850 | 15 | `simulation.on('tick')` | `simulation`×2, `tickCount`×2, `pickDirty`, `requestDraw`, `rebuildQuadtree`, `maxTicks` |
| stmt018 | обработчик | 25866 | 10 | `simulation.on('end.stats')` | `nodes`, `links`, `simulation`, `tickCount` |
| stmt019 | вызов | 25963 | 1 | `initGraphEventHandlers()` | `initGraphEventHandlers` |
| stmt020 | обработчик | 26145 | 27 | `gfxNode.on("mouseover", function(event, ….on('mouseout')` | `tooltipTimeout`×6, `similarityOverlay`×4, `tooltip`×2, `nodes`, `labelWithAuthor`, `gfxNode` |
| stmt021 | обработчик | 26174 | 125 | `gfxLink.on("mouseover", function(event, ….on('mouseout')` | `renderState`×3, `relationTypesObj`×2, `nodes`×2, `requestDraw`×2, `isSymmetricLink`, `isReflexiveLink`, `gfxLink`, `selectedEdges` |
| stmt022 | построение | 26398 | 8 | `philosopherNames.forEach(…)` | `cols`×2, `philosopherNames`, `groupPositions`, `spacingX`, `spacingY` |
| stmt023 | обработчик | 26481 | 31 | `window.addEventListener('resize')` | `simulation`×3, `groupPositions`×3, `cols`×3, `viewWidth`, `viewHeight`, `resizeCanvas`, `philosopherNames`, `rows`, `isGrouped` |
| stmt024 | обработчик | 27715 | 5 | `window.addEventListener('beforeunload')` | `hasUnsavedEdits` |
| stmt025 | присваивание | 27761 | 1 | `window.graphSelectionContext = …` | — |
| stmt026 | обработчик | 29326 | 7 | `document.addEventListener('click')` | — |
| stmt027 | вызов | 30619 | 1 | `setTimeout()` | `makeLegendsEditable` |
| stmt028 | вызов | 30620 | 1 | `renderAuthControls()` | `renderAuthControls` |
| stmt029 | обработчик | 30643 | 6 | `document.getElementById('modalOverlay').addEventListener('click')` | `closeAllModals` |
| stmt030 | обработчик | 30651 | 22 | `document.addEventListener('keydown')` | `modalStack`×2, `cancelGraphSelection`×2, `popModalState`, `closeAllModals` |
| stmt031 | вызов | 30675 | 1 | `console.log()` | `nodes`, `links` |
| stmt032 | вызов | 30676 | 1 | `initFilters()` | `initFilters` |
| stmt033 | вызов | 30679 | 1 | `подписаться()` | `подписаться`, `updateFilterStats` |
| stmt034 | вызов | 30680 | 1 | `подписаться()` | `подписаться`, `updatePhilosopherDimming` |
| stmt035 | вызов | 30685 | 4 | `подписаться()` | `подписаться`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` |
| stmt036 | вызов | 30690 | 1 | `подписаться()` | `подписаться`, `updateFilterStats` |
| stmt037 | вызов | 30694 | 3 | `подписаться()` | `similarityOverlay`×2, `подписаться`, `clearSimilarityOverlay` |
| stmt038 | вызов | 30697 | 3 | `подписаться()` | `modalStack`×2, `подписаться` |
| stmt039 | вызов | 30700 | 6 | `подписаться()` | `подписаться`, `initFilters`, `makeLegendsEditable` |
| stmt040 | вызов | 30706 | 1 | `подписаться()` | `подписаться`, `applyFiltersImmediate` |
| stmt041 | вызов | 30707 | 1 | `подписаться()` | `подписаться`, `updateGraphData` |
| stmt042 | вызов | 30708 | 3 | `подписаться()` | `currentStatsView`×2, `подписаться`, `isStatsModalOpen`, `loadStatsContent` |
| stmt043 | вызов | 30715 | 4 | `подписаться()` | `подписаться`, `selectConnectionEditConcept`, `selectConnectionViewConcept` |
| stmt044 | вызов | 30719 | 1 | `подписаться()` | `подписаться`, `renderComparison` |
| stmt045 | вызов | 30720 | 1 | `подписаться()` | `подписаться`, `switchStatsView` |
| stmt046 | вызов | 30721 | 1 | `подписаться()` | `отметитьВыбранныхВЛегенде`, `подписаться` |
| stmt047 | вызов | 30722 | 6 | `подписаться()` | `показанныеВопрекиОтбору`, `resetBeyondFilter`, `подписаться` |
| stmt048 | вызов | 30729 | 1 | `назначитьРисовальщика()` | `назначитьРисовальщика`, `draw` |
| stmt049 | обработчик | 30731 | 4 | `document.addEventListener('mouseover')` | `показатьПодсказку` |
| stmt050 | обработчик | 30735 | 4 | `document.addEventListener('mouseout')` | `скрытьПодсказку` |
| stmt051 | обработчик | 30739 | 1 | `document.addEventListener('scroll')` | `скрытьПодсказку` |
| stmt052 | вызов | 30740 | 1 | `подписаться()` | `подписаться`, `closeStatsModal` |
| stmt053 | вызов | 30741 | 1 | `подписаться()` | `подписаться`, `closeDetailModal` |
| stmt054 | вызов | 30743 | 1 | `подписаться()` | `подписаться`, `showDetailModal` |
| stmt055 | вызов | 30744 | 1 | `подписаться()` | `подписаться`, `openUniversalModal` |
| stmt056 | вызов | 30745 | 1 | `подписаться()` | `подписаться`, `openEditConceptModal` |
| stmt057 | вызов | 30746 | 1 | `подписаться()` | `подписаться`, `openEditConnectionModal` |
| stmt058 | вызов | 30748 | 3 | `подписаться()` | `currentStatsView`×2, `подписаться`, `isStatsModalOpen`, `loadStatsContent` |
| stmt059 | вызов | 30752 | 1 | `updateFilterStats()` | `updateFilterStats` |
| stmt060 | вызов | 30754 | 1 | `initializePhilosophyMetrics()` | `initializePhilosophyMetrics` |
| stmt061 | вызов | 30757 | 1 | `initPathFinder()` | `initPathFinder` |
| stmt062 | вызов | 30760 | 1 | `restorePanelStates()` | `restorePanelStates` |
| stmt063 | обработчик | 30763 | 3 | `simulation.on('end.log')` | `simulation` |
| stmt064 | условие | 30773 | 1 | `if (legendWeightsToggle) legendWeightsToggle.checked = useWeightedPath…` | `legendWeightsToggle`×2, `useWeightedPaths` |
| stmt065 | условие | 30775 | 1 | `if (legendDirectionToggle) legendDirectionToggle.checked = respectDire…` | `legendDirectionToggle`×2, `respectDirection` |
| stmt066 | вызов | 30778 | 1 | `saveOriginalRadii()` | `saveOriginalRadii` |
| stmt067 | вызов | 30780 | 1 | `console.log()` | — |
| stmt068 | вызов | 30781 | 2 | `console.log()` | `useWeightedPaths`, `respectDirection` |
| stmt069 | обработчик | 30789 | 4 | `document.getElementById('respectChronolo….addEventListener('change')` | — |
| stmt070 | обработчик | 30795 | 13 | `document.getElementById('chronologyModeS….addEventListener('change')` | `currentChronologyMode` |
| stmt071 | условие | 30810 | 3 | `if (document.getElementById('respectChronology').checked) { document.g…` | — |
| stmt072 | вызов | 30814 | 1 | `console.log()` | — |


## 4. Обработчики событий, навешанные из кода

| Стр. | Событие | Цель | Способ | Обработчик | Где навешан |
|---|---|---|---|---|---|
| 15528 | `click` | `cancelBtn` | addEventListener | функция на месте | `LoadingIndicator` |
| 21565 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt009` |
| 21574 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt010` |
| 24220 | `load` | `window` | addEventListener | функция на месте | верхний уровень: `stmt012` |
| 24615 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt013` |
| 24734 | `click` | `document` | addEventListener | функция на месте | `initializeCustomSelects` |
| 24807 | `DOMContentLoaded` | `document` | addEventListener | функция на месте | верхний уровень: `stmt014` |
| 25784 | `zoom` | `d3.zoom() .scaleExtent([0.1, 4])` | .on() | функция на месте | `gfxZoom` |
| 25794 | `end` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt015` |
| 25794 | `drag` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt015` |
| 25794 | `start` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt015` |
| 25850 | `tick` | `simulation` | .on() | функция на месте | верхний уровень: `stmt017` |
| 25866 | `end.stats` | `simulation` | .on() | функция на месте | верхний уровень: `stmt018` |
| 25950 | `click` | `gfxLink` | .on() | handleLinkClick | `initGraphEventHandlers` |
| 25951 | `click` | `gfxNode` | .on() | handleNodeClick | `initGraphEventHandlers` |
| 25952 | `mousemove` | `gfxCanvas` | addEventListener | dispatchMove | `initGraphEventHandlers` |
| 25953 | `mouseleave` | `gfxCanvas` | addEventListener | функция на месте | `initGraphEventHandlers` |
| 25960 | `click` | `gfxCanvas` | addEventListener | dispatchClick | `initGraphEventHandlers` |
| 26145 | `mouseout` | `gfxNode.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt020` |
| 26145 | `mouseover` | `gfxNode` | .on() | функция на месте | верхний уровень: `stmt020` |
| 26174 | `mouseout` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt021` |
| 26174 | `mousemove` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt021` |
| 26174 | `mouseover` | `gfxLink` | .on() | функция на месте | верхний уровень: `stmt021` |
| 26481 | `resize` | `window` | addEventListener | функция на месте | верхний уровень: `stmt023` |
| 27018 | `keydown` | `f` | addEventListener | функция на месте | `openAuthModal` |
| 27715 | `beforeunload` | `window` | addEventListener | функция на месте | верхний уровень: `stmt024` |
| 28996 | `input` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 28997 | `focus` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 29326 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt026` |
| 29464 | `click` | `btn` | свойство | функция на месте | `initConnectionSearchFields` |
| 30560 | `click` | `philHeader` | addEventListener | функция на месте | `makeLegendsEditable` |
| 30590 | `click` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 30605 | `dblclick` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 30643 | `click` | `document.getElementById('modalOverlay')` | addEventListener | функция на месте | верхний уровень: `stmt029` |
| 30651 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt030` |
| 30731 | `mouseover` | `document` | addEventListener | функция на месте | верхний уровень: `stmt049` |
| 30735 | `mouseout` | `document` | addEventListener | функция на месте | верхний уровень: `stmt050` |
| 30739 | `scroll` | `document` | addEventListener | скрытьПодсказку | верхний уровень: `stmt051` |
| 30763 | `end.log` | `simulation` | .on() | функция на месте | верхний уровень: `stmt063` |
| 30789 | `change` | `document.getElementById('respectChronology')` | addEventListener | функция на месте | верхний уровень: `stmt069` |
| 30795 | `change` | `document.getElementById('chronologyModeSelect…` | addEventListener | функция на месте | верхний уровень: `stmt070` |


## 4б. Обращение к функциям по имени (`window[…]`)

Пять точек, где имя функции склеивается из кусков и вызывается
через `window[…]`. Прямых ссылок на такие функции в коде нет — без этой
таблицы карта показала бы их покойниками.

| Стр. | Где | Выражение | Действие |
|---|---|---|---|
| 16922 | `installMetricScopeWrappers` | `window[name]` | чтение |
| 16935 | `installMetricScopeWrappers` | `window[name]` | запись |
| 24027 | `toggleMetricVisualization` | `window[funcName]` | чтение |
| 26946 | `modalContentFor` | `window[name]` | чтение |
| 26952 | `modalContentFor` | `window[fallbackName]` | чтение |


Имена функций, встречающиеся строкой или ключом объекта:

| Имя функции | Раз | Где |
|---|---|---|
| `influenceIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `conceptualFertilityIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `conceptualContinuityIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `deductiveIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `generativeIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `instrumentalIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `abstractionIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `criticalPowerIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `dialogicalIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `internalCoherenceIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `paradigmShiftIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `problemGenerationIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `revolutionaryIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `syntheticIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `transformationIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `conceptualComplexityIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `foundationalIndex` | 5 | `METRIC_FLAGS` (ключ объекта), `SIM_METRIC_LABELS` (ключ объекта), `VIEW_METRIC` (строка), `similarityData` (ключ объекта), `toggleMetricVisualization` (строка) |
| `tensionIndex` | 3 | `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка), `toggleMetricVisualization` (строка) |
| `calculateWeightedDegree` | 2 | `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculatePageRank` | 2 | `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculateBetweenness` | 2 | `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculateClosenessCentrality` | 2 | `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculateEigenvectorCentrality` | 2 | `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculateWeightedClustering` | 2 | `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculateRichClubCoefficient` | 2 | `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculateLocalCohesion` | 2 | `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `traditionBridgingIndex` | 2 | `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `temporalInfluencePattern` | 2 | `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `philosopherHistoricalReachIndex` | 2 | `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `philosopherInterdisciplinaryIndex` | 2 | `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `philosopherSystematicIndex` | 2 | `METRIC_FLAGS` (ключ объекта), `VIEW_METRIC` (строка) |
| `calculateClusteringCoefficient` | 1 | `METRIC_FLAGS` (ключ объекта) |
| `deductiveDepth` | 1 | `METRIC_FLAGS` (ключ объекта) |
| `authError` | 1 | `authError` (строка) |
| `savePhilosopherData` | 1 | `generatePhilosopherEditContent` (строка) |
| `deletePhilosopher` | 1 | `generatePhilosopherEditContent` (строка) |
| `saveConceptData` | 1 | `generateConceptEditContent` (строка) |
| `deleteConcept` | 1 | `generateConceptEditContent` (строка) |
| `saveConnectionData` | 1 | `generateConnectionEditContent` (строка) |
| `deleteConnection` | 1 | `generateConnectionEditContent` (строка) |


## 5. Функции, вызываемые из разметки

«Статич.» — атрибуты в разметке страницы; «динам.» — атрибуты внутри
строк и шаблонов, которые собирает код. «Порождается в» — сущности,
в теле которых эта разметка написана.

| Имя | Определена глобально | Статич. | Динам. | Атрибуты | Порождается в |
|---|---|---|---|---|---|
| `switchStatsView` | да | 39 | 1 | `onclick` | `showConceptProfileModal` |
| `openUniversalModal` | да | 0 | 24 | `onclick` | `conceptPlate`, `findAndShowPath`, `generateConceptEditContent`, `generateConceptViewContent`, `generatePhilosopherEditContent`, `generatePhilosopherViewContent`, `showAllConcepts`, `showConceptProfileModal`, `showPathDescriptionsModal`, `showPhilosopherProfileModal`, `стрелкаСвязи`, `традицииФилософаБлок` |
| `renderClosestPairs` | да | 0 | 6 | `onchange`, `onclick`, `oninput` | `generateClosestPairsContent` |
| `setTimeout` | **НЕТ** | 0 | 6 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `closeUniversalModal` | да | 1 | 3 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent`, `modalActions` |
| `closeConceptProfileModal` | да | 1 | 3 | `onclick` | `showConceptProfileModal` |
| `handleLegendLinkSearch` | да | 4 | 0 | `onfocus`, `oninput` | — |
| `toggleSection` | да | 4 | 0 | `onclick` | — |
| `findConnection` | да | 0 | 4 | `onclick` | `findAndShowPath`, `generateConceptEditContent`, `showPathDescriptionsModal`, `стрелкаСвязи` |
| `highlightNodeById` | да | 0 | 4 | `onclick` | `generateConceptRankingsContent`, `generateDegreeContent`, `generateMetricResults`, `generateTemporalInfluenceContent` |
| `toggleSubsection` | да | 0 | 4 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent` |
| `toggleConnectionDescription` | да | 0 | 4 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent` |
| `setSearchKind` | да | 3 | 0 | `onclick` | — |
| `showCustomSelectDropdown` | да | 2 | 1 | `onfocus` | `generateComparisonContent` |
| `filterCustomSelect` | да | 2 | 1 | `oninput` | `generateComparisonContent` |
| `openConceptById` | да | 0 | 3 | `onclick` | `findAndShowPath`, `showPathDescriptionsModal`, `similarConceptsBlock` |
| `showSimilarityOverlay` | да | 0 | 3 | `onclick` | `similarConceptsBlock`, `updateSimilarityLegend` |
| `closePhilosopherProfileModal` | да | 1 | 1 | `onclick` | `showPhilosopherProfileModal` |
| `handleLegendSearch` | да | 2 | 0 | `onfocus`, `oninput` | — |
| `handleLegendPhilSearch` | да | 2 | 0 | `onfocus`, `oninput` | — |
| `openStatsModal` | да | 1 | 1 | `onclick` | `showConceptProfileModal` |
| `handleStatsParameterChange` | да | 2 | 0 | `onchange` | — |
| `clearPathHighlight` | да | 0 | 2 | `onclick` | `findAndShowPath` |
| `handlePathArrowHover` | да | 0 | 2 | `onmouseenter`, `onmouseleave` | `findAndShowPath` |
| `toggleMetricVisualization` | да | 0 | 2 | `onclick` | `generateMetricResults` |
| `toggleMetricValueMode` | да | 0 | 2 | `onclick` | `generateConceptRankingsContent`, `generateMetricResults` |
| `showConceptProfileModal` | да | 0 | 2 | `onclick` | `generateConceptViewContent`, `generateMetricResults` |
| `renderPhilosopherComparison` | да | 0 | 2 | `onchange` | `generatePhilosopherComparisonContent` |
| `showPhilosopherProfileModal` | да | 0 | 2 | `onclick` | `generatePhilosopherViewContent`, `showConceptProfileModal` |
| `closeAuthModal` | да | 0 | 2 | `onclick` | `openAuthModal`, `showAuthNotice` |
| `openAuthModal` | да | 0 | 2 | `onclick` | `renderAuthControls` |
| `updatePhilColorSample` | да | 0 | 2 | `oninput` | `generatePhilosopherEditContent` |
| `handleConnectionViewSearch` | да | 0 | 2 | `onfocus`, `oninput` | `generateConnectionViewContent` |
| `handleModalSearch` | да | 0 | 2 | `onfocus`, `oninput` | `generateConceptViewContent` |
| `handlePhilosopherSearch` | да | 0 | 2 | `onfocus`, `oninput` | `generatePhilosopherViewContent` |
| `closePathDescriptionsModal` | да | 1 | 0 | `onclick` | — |
| `toggleLegendSearch` | да | 1 | 0 | `onclick` | — |
| `clearLegendSearch` | да | 1 | 0 | `onclick` | — |
| `clearLegendPhilSearch` | да | 1 | 0 | `onclick` | — |
| `resetBeyondFilter` | да | 1 | 0 | `onclick` | — |
| `resetNodeSizes` | да | 1 | 0 | `onclick` | — |
| `selectAllPhilosophers` | да | 1 | 0 | `onclick` | — |
| `deselectAllPhilosophers` | да | 1 | 0 | `onclick` | — |
| `changeFilterMode` | да | 1 | 0 | `onchange` | — |
| `toggleUniformLinkWidth` | да | 1 | 0 | `onchange` | — |
| `selectAllRelations` | да | 1 | 0 | `onclick` | — |
| `deselectAllRelations` | да | 1 | 0 | `onclick` | — |
| `selectAllRubrics` | да | 1 | 0 | `onclick` | — |
| `deselectAllRubrics` | да | 1 | 0 | `onclick` | — |
| `selectAllTraditions` | да | 1 | 0 | `onclick` | — |
| `deselectAllTraditions` | да | 1 | 0 | `onclick` | — |
| `togglePanel` | да | 1 | 0 | `onclick` | — |
| `findAndShowPath` | да | 1 | 0 | `onclick` | — |
| `resetSimulation` | да | 1 | 0 | `onclick` | — |
| `toggleSimulationFreeze` | да | 1 | 0 | `onclick` | — |
| `centerGraph` | да | 1 | 0 | `onclick` | — |
| `toggleGrouping` | да | 1 | 0 | `onclick` | — |
| `downloadData` | да | 1 | 0 | `onclick` | — |
| `saveToFolder` | да | 1 | 0 | `onclick` | — |
| `exportToPNG` | да | 1 | 0 | `onclick` | — |
| `exportToSVG` | да | 1 | 0 | `onclick` | — |
| `openAboutModal` | да | 1 | 0 | `onclick` | — |
| `onAboutBackdropClick` | да | 1 | 0 | `onclick` | — |
| `closeAboutModal` | да | 1 | 0 | `onclick` | — |
| `handleMetricsScopeChange` | да | 1 | 0 | `onchange` | — |
| `closeStatsModal` | да | 1 | 0 | `onclick` | — |
| `showPathDescriptionsModal` | да | 0 | 1 | `onclick` | `findAndShowPath` |
| `togglePathNodesDescriptions` | да | 0 | 1 | `onclick` | `showPathDescriptionsModal` |
| `pickPhilosopherFromSearch` | да | 0 | 1 | `onclick` | `handleLegendPhilSearch` |
| `pickLinkEnd` | да | 0 | 1 | `onclick` | `handleLegendLinkSearch` |
| `highlightLinkOnGraph` | да | 0 | 1 | `onclick` | `показатьНайденныеСвязи` |
| `togglePhilosopher` | да | 0 | 1 | `onchange` | `initFilters` |
| `toggleRelation` | да | 0 | 1 | `onchange` | `initFilters` |
| `toggleTradition` | да | 0 | 1 | `onchange` | `initFilters` |
| `onlyTradition` | да | 0 | 1 | `onclick` | `initFilters` |
| `addTradition` | да | 0 | 1 | `onclick` | `initFilters` |
| `toggleRubric` | да | 0 | 1 | `onchange` | `initFilters` |
| `setInfluenceScope` | да | 0 | 1 | `onclick` | `influenceScopeSwitcher` |
| `calculateMetricFromModal` | да | 0 | 1 | `onclick` | `generateCalculateButton` |
| `toggleMetricLayout` | да | 0 | 1 | `onclick` | `generateMetricResults` |
| `toggleMetricDetails` | да | 0 | 1 | `onclick` | `generateMetricResults` |
| `renderPhilosopherPairs` | да | 0 | 1 | `onclick` | `generatePhilosopherPairsContent` |
| `openPhilosopherPair` | да | 0 | 1 | `onclick` | `renderPhilosopherPairs` |
| `openPairInComparison` | да | 0 | 1 | `onclick` | `renderClosestPairs` |
| `selectSearchResult` | да | 0 | 1 | `onclick` | `displaySearchResults` |
| `selectPhilosopherResult` | да | 0 | 1 | `onclick` | `handlePhilosopherSearch` |
| `selectCustomOption` | да | 0 | 1 | `onclick` | `populateCustomSelect` |
| `clearSimilarityOverlay` | да | 0 | 1 | `onclick` | `updateSimilarityLegend` |
| `toggleProfileOrder` | да | 0 | 1 | `onclick` | `showConceptProfileModal` |
| `submitAuth` | да | 0 | 1 | `onclick` | `openAuthModal` |
| `authLogout` | да | 0 | 1 | `onclick` | `renderAuthControls` |
| `toggleModalMode` | да | 0 | 1 | `onclick` | `openUniversalModal` |
| `popModalState` | да | 0 | 1 | `onclick` | `openUniversalModal` |
| `cancelGraphSelection` | да | 0 | 1 | `onclick` | `selectConceptOnGraph` |
| `syncPhilColorFromPicker` | да | 0 | 1 | `oninput` | `generatePhilosopherEditContent` |
| `openEditConceptModal` | да | 0 | 1 | `onclick` | `generatePhilosopherEditContent` |
| `createNewConceptForPhilosopher` | да | 0 | 1 | `onclick` | `generatePhilosopherEditContent` |
| `escapeAttr` | да | 0 | 1 | `onclick` | `generatePhilosopherEditContent` |
| `openEditConnectionModal` | да | 0 | 1 | `onclick` | `generateConceptEditContent` |
| `deleteConnection` | да | 0 | 1 | `onclick` | `generateConceptEditContent` |
| `createNewConnectionForConcept` | да | 0 | 1 | `onclick` | `generateConceptEditContent` |
| `onConnTypeChange` | да | 0 | 1 | `onchange` | `generateConnectionEditContent` |
| `swapConnectionConcepts` | да | 0 | 1 | `onclick` | `generateConnectionEditContent` |
| `selectConnectionEditConcept` | да | 0 | 1 | `onclick` | `handleConnectionEditSearch` |
| `toggleConnectionSearchSection` | да | 0 | 1 | `onclick` | `generateConnectionViewContent` |
| `selectConnectionViewConcept` | да | 0 | 1 | `onclick` | `handleConnectionViewSearch` |
| `clearModalSearch` | да | 0 | 1 | `onclick` | `generateConceptViewContent` |
| `gotoNodeFromModal` | да | 0 | 1 | `onclick` | `generateConceptViewContent` |
| `toggleAllConnectionDescriptions` | да | 0 | 1 | `onclick` | `generateConceptViewContent` |
| `showAllConcepts` | да | 0 | 1 | `onclick` | `generateConceptViewContent` |
| `showPhilosopherDetailModal` | да | 0 | 1 | `onclick` | `similarPhilosophersBlock` |
| `clearPhilosopherSearch` | да | 0 | 1 | `onclick` | `generatePhilosopherViewContent` |
| `toggleAllPhilosopherConceptDescriptions` | да | 0 | 1 | `onclick` | `generatePhilosopherViewContent` |
| `togglePhilosopherConceptDescription` | да | 0 | 1 | `onclick` | `generatePhilosopherViewContent` |
| `toggleAllPhilosopherConnectionDescriptions` | да | 0 | 1 | `onclick` | `generatePhilosopherViewContent` |


## 6. Все обработчики в разметке построчно

| Стр. | Атрибут | Порождается в | Код |
|---|---|---|---|
| 1313 | `onmouseover` | (страница) | `this.style.background=…` |
| 4419 | `onclick` | (страница) | `closeUniversalModal()` |
| 4428 | `onclick` | (страница) | `closeConceptProfileModal()` |
| 4433 | `onclick` | (страница) | `closePhilosopherProfileModal()` |
| 4439 | `onclick` | (страница) | `closePathDescriptionsModal()` |
| 4447 | `onclick` | (страница) | `toggleLegendSearch()` |
| 4452 | `onclick` | (страница) | `setSearchKind('philosopher')` |
| 4454 | `onclick` | (страница) | `setSearchKind('concept')` |
| 4456 | `onclick` | (страница) | `setSearchKind('connection')` |
| 4465 | `oninput` | (страница) | `handleLegendSearch(this.value)` |
| 4466 | `onfocus` | (страница) | `handleLegendSearch(this.value)` |
| 4467 | `onclick` | (страница) | `clearLegendSearch()` |
| 4477 | `oninput` | (страница) | `handleLegendPhilSearch(this.value)` |
| 4478 | `onfocus` | (страница) | `handleLegendPhilSearch(this.value)` |
| 4479 | `onclick` | (страница) | `clearLegendPhilSearch()` |
| 4490 | `oninput` | (страница) | `handleLegendLinkSearch('from', this.value)` |
| 4491 | `onfocus` | (страница) | `handleLegendLinkSearch('from', this.value)` |
| 4500 | `oninput` | (страница) | `handleLegendLinkSearch('to', this.value)` |
| 4501 | `onfocus` | (страница) | `handleLegendLinkSearch('to', this.value)` |
| 4512 | `onclick` | (страница) | `openStatsModal()` |
| 4524 | `onclick` | (страница) | `resetBeyondFilter()` |
| 4536 | `onclick` | (страница) | `resetNodeSizes()` |
| 4543 | `onclick` | (страница) | `toggleSection('philosophers')` |
| 4548 | `onclick` | (страница) | `selectAllPhilosophers()` |
| 4549 | `onclick` | (страница) | `deselectAllPhilosophers()` |
| 4560 | `onchange` | (страница) | `changeFilterMode(this.value)` |
| 4591 | `onchange` | (страница) | `toggleUniformLinkWidth()` |
| 4599 | `onclick` | (страница) | `toggleSection('relations')` |
| 4604 | `onclick` | (страница) | `selectAllRelations()` |
| 4605 | `onclick` | (страница) | `deselectAllRelations()` |
| 4626 | `onclick` | (страница) | `toggleSection('rubrics')` |
| 4631 | `onclick` | (страница) | `selectAllRubrics()` |
| 4632 | `onclick` | (страница) | `deselectAllRubrics()` |
| 4639 | `onclick` | (страница) | `toggleSection('traditions')` |
| 4644 | `onclick` | (страница) | `selectAllTraditions()` |
| 4645 | `onclick` | (страница) | `deselectAllTraditions()` |
| 4665 | `onclick` | (страница) | `togglePanel('pathFinder')` |
| 4678 | `onfocus` | (страница) | `showCustomSelectDropdown('source')` |
| 4679 | `oninput` | (страница) | `filterCustomSelect('source', this.value)` |
| 4692 | `onfocus` | (страница) | `showCustomSelectDropdown('target')` |
| 4693 | `oninput` | (страница) | `filterCustomSelect('target', this.value)` |
| 4698 | `onclick` | (страница) | `findAndShowPath()` |
| 4741 | `onclick` | (страница) | `resetSimulation()` |
| 4742 | `onclick` | (страница) | `toggleSimulationFreeze()` |
| 4743 | `onclick` | (страница) | `centerGraph()` |
| 4744 | `onclick` | (страница) | `toggleGrouping()` |
| 4745 | `onclick` | (страница) | `downloadData()` |
| 4746 | `onclick` | (страница) | `saveToFolder()` |
| 4748 | `onclick` | (страница) | `exportToPNG()` |
| 4749 | `onclick` | (страница) | `exportToSVG()` |
| 4752 | `onclick` | (страница) | `openAboutModal()` |
| 4755 | `onclick` | (страница) | `onAboutBackdropClick(event)` |
| 4757 | `onclick` | (страница) | `closeAboutModal()` |
| 4785 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 4791 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 4797 | `onchange` | (страница) | `handleMetricsScopeChange()` |
| 4803 | `onclick` | (страница) | `closeStatsModal()` |
| 4817 | `onclick` | (страница) | `switchStatsView('overview')` |
| 4821 | `onclick` | (страница) | `switchStatsView('comparison')` |
| 4825 | `onclick` | (страница) | `switchStatsView('closest-pairs')` |
| 4829 | `onclick` | (страница) | `switchStatsView('philosopher-comparison')` |
| 4833 | `onclick` | (страница) | `switchStatsView('philosopher-pairs')` |
| 4837 | `onclick` | (страница) | `switchStatsView('degree')` |
| 4841 | `onclick` | (страница) | `switchStatsView('pagerank')` |
| 4845 | `onclick` | (страница) | `switchStatsView('betweenness')` |
| 4849 | `onclick` | (страница) | `switchStatsView('closeness')` |
| 4853 | `onclick` | (страница) | `switchStatsView('eigenvector')` |
| 4857 | `onclick` | (страница) | `switchStatsView('weighted-clustering')` |
| 4861 | `onclick` | (страница) | `switchStatsView('local-cohesion')` |
| 4865 | `onclick` | (страница) | `switchStatsView('rich-club')` |
| 4877 | `onclick` | (страница) | `switchStatsView('problem-generation')` |
| 4881 | `onclick` | (страница) | `switchStatsView('critical-power')` |
| 4885 | `onclick` | (страница) | `switchStatsView('tension')` |
| 4897 | `onclick` | (страница) | `switchStatsView('revolutionary')` |
| 4901 | `onclick` | (страница) | `switchStatsView('paradigm-shift')` |
| 4913 | `onclick` | (страница) | `switchStatsView('influence')` |
| 4917 | `onclick` | (страница) | `switchStatsView('foundational')` |
| 4929 | `onclick` | (страница) | `switchStatsView('synthetic')` |
| 4933 | `onclick` | (страница) | `switchStatsView('dialogical')` |
| 4945 | `onclick` | (страница) | `switchStatsView('coherence')` |
| 4957 | `onclick` | (страница) | `switchStatsView('transformation')` |
| 4961 | `onclick` | (страница) | `switchStatsView('fertility')` |
| 4973 | `onclick` | (страница) | `switchStatsView('complexity')` |
| 4977 | `onclick` | (страница) | `switchStatsView('continuity')` |
| 4981 | `onclick` | (страница) | `switchStatsView('generative')` |
| 4985 | `onclick` | (страница) | `switchStatsView('instrumental')` |
| 4989 | `onclick` | (страница) | `switchStatsView('bridging')` |
| 4993 | `onclick` | (страница) | `switchStatsView('abstraction')` |
| 4997 | `onclick` | (страница) | `switchStatsView('deductive')` |
| 5009 | `onclick` | (страница) | `switchStatsView('temporal-influence')` |
| 5021 | `onclick` | (страница) | `switchStatsView('philosopher-profile')` |
| 5025 | `onclick` | (страница) | `switchStatsView('philosopher-systematic')` |
| 5029 | `onclick` | (страница) | `switchStatsView('philosopher-reach')` |
| 5033 | `onclick` | (страница) | `switchStatsView('philosopher-interdisciplinary')` |
| 5045 | `onclick` | (страница) | `switchStatsView('concept-rankings')` |
| 5049 | `onclick` | (страница) | `switchStatsView('philosopher-rankings')` |
| 14547 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 14578 | `onclick` | `findAndShowPath` | `openConceptById('${node.id}')` |
| 14625 | `onclick` | `findAndShowPath` | `openUniversalModal('connection', findConnection('${currentNode.id}', '${nextNode.id}', false), 'view')` |
| 14629 | `onmouseenter` | `findAndShowPath` | `handlePathArrowHover(event, true)` |
| 14630 | `onmouseleave` | `findAndShowPath` | `handlePathArrowHover(event, false)` |
| 14731 | `onclick` | `findAndShowPath` | `showPathDescriptionsModal()` |
| 14734 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 14879 | `onclick` | `showPathDescriptionsModal` | `togglePathNodesDescriptions()` |
| 14898 | `onclick` | `showPathDescriptionsModal` | `openConceptById('${узел.id}')` |
| 14901 | `onclick` | `showPathDescriptionsModal` | `openUniversalModal('philosopher', '${узел.concept}', 'view')` |
| 14938 | `onclick` | `showPathDescriptionsModal` | `openUniversalModal('connection', findConnection('${src}', '${tgt}', false), 'view')` |
| 15066 | `onclick` | `handleLegendPhilSearch` | `pickPhilosopherFromSearch('${f.nameRu}')` |
| 15187 | `onclick` | `handleLegendLinkSearch` | `pickLinkEnd('${конец}', '${n.id}')` |
| 15224 | `onclick` | `показатьНайденныеСвязи` | `highlightLinkOnGraph('${from.id}', '${to.id}', ${k})` |
| 16439 | `onchange` | `initFilters` | `togglePhilosopher('${name}')` |
| 16455 | `onchange` | `initFilters` | `toggleRelation('${type}')` |
| 16473 | `onchange` | `initFilters` | `toggleTradition('${tr.id}')` |
| 16478 | `onclick` | `initFilters` | `onlyTradition('${tr.id}')` |
| 16480 | `onclick` | `initFilters` | `addTradition('${tr.id}')` |
| 16492 | `onchange` | `initFilters` | `toggleRubric('${rubric.id}')` |
| 18729 | `onclick` | `influenceScopeSwitcher` | `setInfluenceScope('${k}')` |
| 21641 | `onclick` | `стрелкаСвязи` | `openUniversalModal('connection', findConnection('${откуда}', '${куда}', false), 'view')` |
| 21861 | `onclick` | `generateCalculateButton` | `calculateMetricFromModal('${metricKey}')` |
| 22067 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 22099 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 22104 | `onclick` | `generateMetricResults` | `toggleMetricLayout()` |
| 22111 | `onclick` | `generateMetricResults` | `toggleMetricValueMode()` |
| 22155 | `onclick` | `generateMetricResults` | `highlightNodeById('${item.node.id}')` |
| 22163 | `onclick` | `generateMetricResults` | `event.stopPropagation(); showConceptProfileModal('${item.node.id}');` |
| 22170 | `onclick` | `generateMetricResults` | `event.stopPropagation(); toggleMetricDetails(this);` |
| 22307 | `onclick` | `generateDegreeContent` | `highlightNodeById('${d.node.id}')` |
| 22894 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpA=this.value; renderPhilosopherComparison();` |
| 22899 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpB=this.value; renderPhilosopherComparison();` |
| 22987 | `onclick` | `generatePhilosopherPairsContent` | `_philPairsKind='${k}'; renderPhilosopherPairs();` |
| 23015 | `onclick` | `renderPhilosopherPairs` | `openPhilosopherPair('${a}','${b}')` |
| 23046 | `onclick` | `generateClosestPairsContent` | `_pairsKind='profile'; renderClosestPairs();` |
| 23047 | `onclick` | `generateClosestPairsContent` | `_pairsKind='structure'; renderClosestPairs();` |
| 23052 | `oninput` | `generateClosestPairsContent` | `_pairsMinDegree=+this.value; renderClosestPairs();` |
| 23057 | `oninput` | `generateClosestPairsContent` | `_pairsMinShared=+this.value; renderClosestPairs();` |
| 23061 | `onchange` | `generateClosestPairsContent` | `_pairsCrossAuthor=this.checked; renderClosestPairs();` |
| 23066 | `onchange` | `generateClosestPairsContent` | `_pairsCrossTradition=this.checked; renderClosestPairs();` |
| 23150 | `onclick` | `renderClosestPairs` | `openPairInComparison('${a}','${b}')` |
| 23201 | `onfocus` | `generateComparisonContent` | `showCustomSelectDropdown('${slot}')` |
| 23202 | `oninput` | `generateComparisonContent` | `filterCustomSelect('${slot}', this.value)` |
| 23538 | `onclick` | `generateTemporalInfluenceContent` | `highlightNodeById('${r.node.id}')` |
| 23727 | `onclick` | `generateConceptRankingsContent` | `toggleMetricValueMode()` |
| 23768 | `onclick` | `generateConceptRankingsContent` | `highlightNodeById('${item.id}')` |
| 24553 | `onclick` | `displaySearchResults` | `selectSearchResult('${node.id}', '${context}')` |
| 24666 | `onclick` | `handlePhilosopherSearch` | `selectPhilosopherResult('${p.nameRu}')` |
| 24752 | `onclick` | `populateCustomSelect` | `selectCustomOption('${type}', '${n.id}')` |
| 25186 | `onclick` | `updateSimilarityLegend` | `showSimilarityOverlay('${similarityOverlay.sourceId}','profile')` |
| 25188 | `onclick` | `updateSimilarityLegend` | `showSimilarityOverlay('${similarityOverlay.sourceId}','structure')` |
| 25204 | `onclick` | `updateSimilarityLegend` | `clearSimilarityOverlay()` |
| 26540 | `onclick` | `similarConceptsBlock` | `openConceptById('${x.id}')` |
| 26553 | `onclick` | `similarConceptsBlock` | `showSimilarityOverlay('${conceptId}','profile')` |
| 26705 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => { if (!isStatsModalOpen) openStatsModal(); switchStatsView('${key}'); }, 120);` |
| 26725 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => showPhilosopherProfileModal('${node.concept}'), 100);` |
| 26734 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => openUniversalModal('concept', nodes.find(n => n.id === '${conceptId}'), 'view'), 100);` |
| 26741 | `onclick` | `showConceptProfileModal` | `event.stopPropagation(); toggleProfileOrder('${conceptId}')` |
| 26838 | `onclick` | `showPhilosopherProfileModal` | `closePhilosopherProfileModal(); setTimeout(() => openUniversalModal('philosopher', '${philosopherName}', 'view'), 100);` |
| 27008 | `onclick` | `openAuthModal` | `closeAuthModal()` |
| 27009 | `onclick` | `openAuthModal` | `submitAuth()` |
| 27050 | `onclick` | `showAuthNotice` | `closeAuthModal()` |
| 27170 | `onclick` | `renderAuthControls` | `openAuthModal(\'login\')` |
| 27171 | `onclick` | `renderAuthControls` | `openAuthModal(\'register\')` |
| 27174 | `onclick` | `renderAuthControls` | `authLogout()` |
| 27234 | `onclick` | `openUniversalModal` | `toggleModalMode()` |
| 27244 | `onclick` | `openUniversalModal` | `popModalState()` |
| 27785 | `onclick` | `selectConceptOnGraph` | `cancelGraphSelection()` |
| 28466 | `onclick` | `modalActions` | `${saveFn}()` |
| 28469 | `onclick` | `modalActions` | `closeUniversalModal()` |
| 28473 | `onclick` | `modalActions` | `${deleteFn}(${deleteArg})` |
| 28521 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 28529 | `oninput` | `generatePhilosopherEditContent` | `syncPhilColorFromPicker()` |
| 28533 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 28599 | `onclick` | `generatePhilosopherEditContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view')` |
| 28602 | `onclick` | `generatePhilosopherEditContent` | `openEditConceptModal('${c.id}')` |
| 28607 | `onclick` | `generatePhilosopherEditContent` | `createNewConceptForPhilosopher('${escapeAttr(philosopherName)}')` |
| 28717 | `onclick` | `generateConceptEditContent` | `openUniversalModal('connection', findConnection('${srcId}', '${tgtId}', false), 'view')` |
| 28720 | `onclick` | `generateConceptEditContent` | `openEditConnectionModal('${srcId}', '${tgtId}')` |
| 28723 | `onclick` | `generateConceptEditContent` | `deleteConnection('${srcId}', '${tgtId}')` |
| 28746 | `onclick` | `generateConceptEditContent` | `createNewConnectionForConcept('${conceptData.id}')` |
| 28862 | `onchange` | `generateConnectionEditContent` | `onConnTypeChange()` |
| 28902 | `onclick` | `generateConnectionEditContent` | `swapConnectionConcepts()` |
| 28964 | `onclick` | `handleConnectionEditSearch` | `selectConnectionEditConcept('${type}', '${n.id}')` |
| 29072 | `onclick` | `conceptPlate` | `openUniversalModal('concept', nodes.find(n => n.id === '${node.id}'), 'view');` |
| 29076 | `onclick` | `conceptPlate` | `openUniversalModal('philosopher', '${node.concept}', 'view');` |
| 29270 | `onclick` | `generateConnectionViewContent` | `toggleConnectionSearchSection()` |
| 29293 | `oninput` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 29294 | `onfocus` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 29391 | `onclick` | `handleConnectionViewSearch` | `selectConnectionViewConcept('${type}', '${n.id}')` |
| 29491 | `oninput` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 29492 | `onfocus` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 29493 | `onclick` | `generateConceptViewContent` | `clearModalSearch()` |
| 29500 | `onclick` | `generateConceptViewContent` | `openUniversalModal('philosopher', '${conceptData.concept}', 'view');` |
| 29505 | `onclick` | `generateConceptViewContent` | `gotoNodeFromModal('${conceptData.id}')` |
| 29508 | `onclick` | `generateConceptViewContent` | `closeUniversalModal(); setTimeout(() => showConceptProfileModal('${conceptData.id}'), 100);` |
| 29559 | `onclick` | `generateConceptViewContent` | `toggleAllConnectionDescriptions(this)` |
| 29569 | `onclick` | `generateConceptViewContent` | `toggleSubsection('internal-${conceptData.id}')` |
| 29602 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 29607 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 29630 | `onclick` | `generateConceptViewContent` | `toggleSubsection('external-${conceptData.id}')` |
| 29660 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 29665 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 29713 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 29721 | `onclick` | `generateConceptViewContent` | `showAllConcepts('${rubricData.id}', '${conceptData.id}')` |
| 29868 | `onclick` | `showAllConcepts` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 29950 | `onclick` | `традицииФилософаБлок` | `openUniversalModal('philosopher', '${f.nameRu}', 'view');` |
| 29982 | `onclick` | `similarPhilosophersBlock` | `showPhilosopherDetailModal('${x.id}')` |
| 30029 | `oninput` | `generatePhilosopherViewContent` | `handlePhilosopherSearch(this.value)` |
| 30030 | `onfocus` | `generatePhilosopherViewContent` | `handlePhilosopherSearch(this.value)` |
| 30031 | `onclick` | `generatePhilosopherViewContent` | `clearPhilosopherSearch()` |
| 30041 | `onclick` | `generatePhilosopherViewContent` | `closeUniversalModal(); setTimeout(() => showPhilosopherProfileModal('${philosopherName}'), 100);` |
| 30197 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 30213 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 30229 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 30283 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConceptDescriptions(this)` |
| 30291 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); openUniversalModal('concept', nodes.find(n => n.id === '${conceptNode.id}'), 'view');` |
| 30294 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); togglePhilosopherConceptDescription('${conceptNode.id}')` |
| 30349 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConnectionDescriptions(this)` |
| 30361 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-internal-${philosopherName}')` |
| 30380 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${srcNode.id}'), 'view');` |
| 30382 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${tgtNode.id}'), 'view');` |
| 30385 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |
| 30408 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-external-${philosopherName}')` |
| 30427 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${srcNode.id}'), 'view');` |
| 30430 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${tgtNode.id}'), 'view');` |
| 30434 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |


## 7. Диагностика


### 7.1. Ни разу не упомянуты (кандидаты в покойники)

Учтены прямые ссылки, вызовы из разметки и обращения по имени
(строкой или ключом объекта). Остаться в списке законно может лишь то,
что зовётся из консоли или по имени, склеенному из кусков, — последнее
помечено в столбце «оговорка».

| Имя | Вид | Стр. | Длина | Оговорка |
|---|---|---|---|---|
| `findConnectedComponents` | function | 17989 | 34 | — |
| `TENSION_WEIGHTS` | const | 19011 | 5 | — |
| `tensionScales` | function | 19020 | 23 | — |
| `searchNodes` | function | 24533 | 3 | — |
| `toggleSimilarityKind` | function | 25160 | 5 | — |
| `hasUnsaved` | function | 27664 | 1 | — |
| `generatePhilosopherEditContent` | function | 28508 | 113 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 28626 | 131 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionEditContent` | function | 28840 | 96 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionViewContent` | function | 29241 | 81 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptViewContent` | function | 29477 | 265 | вероятно цель `window[…]` в `modalContentFor` |
| `generatePhilosopherViewContent` | function | 30008 | 453 | вероятно цель `window[…]` в `modalContentFor` |


### 7.2. Имена из разметки без глобального определения

| Имя | Статич. | Динам. | Порождается в |
|---|---|---|---|
| `setTimeout` | 0 | 6 | `generateConceptViewContent`, `generatePhilosopherViewContent`, `showConceptProfileModal`, `showPhilosopherProfileModal` |


### 7.3. Необъявленные имена, используемые в скрипте

Обычные глобальные объекты браузера и `d3`; сюда же попадут опечатки.


| Имя | Обращений |
|---|---|
| `document` | 297 |
| `Math` | 128 |
| `Set` | 106 |
| `Object` | 63 |
| `undefined` | 46 |
| `window` | 43 |
| `console` | 43 |
| `Map` | 39 |
| `setTimeout` | 35 |
| `Array` | 28 |
| `d3` | 27 |
| `alert` | 23 |
| `Promise` | 18 |
| `Boolean` | 12 |
| `Infinity` | 11 |
| `String` | 8 |
| `clearTimeout` | 8 |
| `Number` | 8 |
| `URL` | 6 |
| `confirm` | 6 |
| `Date` | 5 |
| `parseInt` | 5 |
| `localStorage` | 5 |
| `performance` | 5 |
| `event` | 4 |
| `Uint16Array` | 3 |
| `Float32Array` | 2 |
| `Blob` | 2 |
| `requestAnimationFrame` | 2 |
| `JSON` | 2 |
| `isNaN` | 1 |
