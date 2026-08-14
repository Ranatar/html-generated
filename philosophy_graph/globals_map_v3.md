# Карта глобальных сущностей `philosophy_graph.html`

Файл: 1 949 583 знаков, 29 646 строк; встроенный скрипт — строки 4749–29644. Составлено 2026-08-14 08:25:52 UTC.

Всего глобальных сущностей: **743** — функций 475
(из них асинхронных 12), `const` 87, `let` 117,
`var` 15, операторов верхнего уровня 46.
Обработчиков событий 38; вызовов из разметки:
статической 80, порождаемой 118.

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
| `nodes` | const | 13585 | 175 | 111 |
| `ModalContext` | const | 25797 | 63 | 24 |
| `links` | const | 13595 | 59 | 41 |
| `renderState` | const | 24030 | 55 | 29 |
| `_conceptMap` | let | 17098 | 53 | 23 |
| `concepts` | const | 5289 | 48 | 43 |
| `useWeightedPaths` | let | 13619 | 46 | 17 |
| `respectDirection` | let | 13620 | 44 | 19 |
| `relations` | const | 9029 | 43 | 40 |
| `philosopherConcepts` | const | 13539 | 43 | 25 |
| `relationTypesObj` | const | 13554 | 43 | 28 |
| `selectedPhilosophers` | let | 13654 | 42 | 12 |
| `initializePhilosophyMetrics` | function | 19873 | 40 | 40 |
| `similarityOverlay` | var | 24051 | 40 | 8 |
| `selectedNodes` | let | 24812 | 39 | 12 |


## 1. Глобальные функции

`⟲` — вызывает сама себя. Столбец «по имени» — обращения, где имя функции стоит строкой или ключом объекта (в этом файле так работает вызов через `window[имя]`).

| Имя | Вид | Стр. | Длина | Параметры | Использует | Используется в | Из разметки | По имени |
|---|---|---|---|---|---|---|---|---|
| `isSymmetricLink` | function | 13571 | 6 | (l) | `relationTypesObj` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `buildAdjacencyGraph`, `buildGlobalGraphCache`, `buildIncomingLinks`, `buildOutgoingLinks`, `tensionIndex`, `exportToSVG`, `stmt021` | — | — |
| `isTypologicalLink` | function | 13626 | 4 | (l) | `relationTypesObj` | `pathLinkAllowed` | — | — |
| `pathLinkAllowed` | function | 13630 | 9 | (l) | `skipTypologicalInPaths`, `isTypologicalLink` | `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `rebuildPhilosopherTraditions` | function | 13661 | 4 | () | `philosopherTraditions`×3, `philosophers` | `rebuildDerivedIndexes` | — | — |
| `initPathFinder` | function | 13671 | 23 | () | `nodes` | `stmt035` | — | — |
| `strictChronologyCheck` | function | 13705 | 50 | (fromPhil, toPhil) | `MATURITY_AGE`×2 | `isChronologicallyValid` | — | — |
| `moderateChronologyCheck` | function | 13762 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `looseChronologyCheck` | function | 13773 | 4 | (fromPhil, toPhil) | — | `isChronologicallyValid` | — | — |
| `isChronologicallyValid` | function | 13785 | 55 | (fromNodeId, toNodeId, mode=…, linkType=…) | `CHRONOLOGY_MODES`×3, `philosophers`×2, `nodes`×2, `MATURITY_AGE`×2, `relationTypesObj`, `currentChronologyMode`, `strictChronologyCheck`, `moderateChronologyCheck`, `looseChronologyCheck` | `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted` | — | — |
| `analyzePath` | function | 13847 | 40 | (path, mode=…) | `philosophers`×2, `nodes`×2, `isSymmetricLink`, `links`, `CHRONOLOGY_MODES`, `isChronologicallyValid` | `findAndShowPath` | — | — |
| `traditionsOfPhilosopher` | function | 13896 | 5 | (name) | `traditions`, `philosopherTraditions` | `analyzePathTraditions`×2, `connectionTraditionNote`×2 | — | — |
| `analyzePathTraditions` | function | 13902 | 21 | (pathNodes) | `philosopherTraditions`×3, `traditionsOfPhilosopher`×2, `traditions` | `findAndShowPath`, `showPathDescriptionsModal` | — | — |
| `findShortestPath` | function | 13925 | 10 | (sourceId, targetId, respectChronology=…, useDirection=…) | `useWeightedPaths`, `respectDirection`, `findShortestPathWeighted`, `findShortestPathUnweighted` | `findAndShowPath` | — | — |
| `findShortestPathWeighted` | function | 13937 | 95 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `nodes`×2, `isSymmetricLink`, `links`, `pathLinkAllowed`, `currentChronologyMode`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findShortestPathUnweighted` | function | 14034 | 53 | (sourceId, targetId, respectChronology=…, shouldRespectDirection=…) | `isSymmetricLink`, `nodes`, `links`, `pathLinkAllowed`, `currentChronologyMode`, `isChronologicallyValid` | `findShortestPath` | — | — |
| `findAndShowPath` | function | 14089 | 229 | () | `nodes`×3, `useWeightedPaths`×3, `respectDirection`×3, `currentChronologyMode`×3, `philosopherConcepts`×2, `relationTypesObj`×2, `skipTypologicalInPaths`, `analyzePath`, `analyzePathTraditions`, `findShortestPath`, `resolvePathLinkList`, `highlightPath`, `currentPathData`, `selectedSourceNode`, `selectedTargetNode`, `resetHighlight` | — | статич.×1 | — |
| `handlePathArrowHover` | function | 14323 | 39 | (event, isEntering) | `arrowHoverTimer`×4, `ARROW_HOVER_DELAY` | — | динам.×2 | — |
| `resolvePathLinkList` | function | 14367 | 20 | (path, respectDirectionFlag=…) | `isSymmetricLink`, `links` | `findAndShowPath`, `highlightPath`, `showPathDescriptionsModal` | — | — |
| `highlightPath` | function | 14389 | 15 | (path, respectDirection=…) | `resolvePathLinkList`, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `findAndShowPath` | — | — |
| `clearPathHighlight` | function | 14406 | 6 | () | `resetHighlight` | — | динам.×2 | — |
| `showPathDescriptionsModal` | function | 14417 | 104 | () | `relationTypesObj`×2, `currentPathData`×2, `analyzePathTraditions`, `resolvePathLinkList`, `freezeSimulation` | — | динам.×1 | — |
| `closePathDescriptionsModal` | function | 14523 | 9 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1 | — |
| `togglePathNodesDescriptions` | function | 14536 | 18 | () | `nodesDescriptionsVisible`×4 | — | динам.×1 | — |
| `debounce` | function | 14556 | 11 | (func, wait) | — | `debouncedApplyFilters` | — | — |
| `showTemporaryMessage` | function | 14634 | 29 | (message, duration=…) | — | `handleUniqueChainsMode`×5, `handleChainsMode`×4, `exportToPNG`×2, `showSimilarityOverlay`×2, `toggleSimulationFreeze` | — | — |
| `buildAdjacencyGraph` | function | 14670 | 35 | (filteredNodes, nodeById) | `conceptToRubrics`×2, `selectedRubrics`×2, `isSymmetricLink`, `links`, `selectedRelations` | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `processBFS` | function | 14752 | 125 | (startNode, startPhil, philsArray, adjacency, nodeById, nodesInChains, linksInChains, uniqueMode) | `CHAIN_SEARCH`×5 | `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` | — | — |
| `confirmLongChainSearch` | function | 14888 | 9 | (count) | `CHAIN_WARN_THRESHOLD` | `handleChainsMode`, `handleUniqueChainsMode` | — | — |
| `findChainsThroughAllPhilosophers` | async function | 14898 | 45 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleChainsMode`×2 | — | — |
| `findUniquePhilosopherChains` | async function | 14947 | 44 | (selectedPhils, progressCallback=…) | `nodes`, `buildAdjacencyGraph`, `CHAIN_SEARCH`, `processBFS` | `handleUniqueChainsMode` | — | — |
| `philTraditionsSelected` | function | 15000 | 4 | (name) | `selectedTraditions`, `philosopherTraditions` | `FilterModes`×4 | — | — |
| `philosopherPassesTraditions` | function | 15004 | 5 | (name) | `selectedTraditions`, `philosopherTraditions` | `linkPassesTraditions`×2, `updatePhilosopherDimming` | — | — |
| `linkPassesTraditions` | function | 15011 | 5 | (l, both) | `philosopherPassesTraditions`×2 | `FilterModes`×5 | — | — |
| `isNodeVisible` | function | 15202 | 1 | (d) | `visibleNodeIds`×2 | `renderScene`×3, `exportToSVG`×2, `applyBasicFilter`, `applyChainVisibility`, `cleanupInvisibleSelections`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `rebuildQuadtree` | — | — |
| `isLinkVisible` | function | 15203 | 1 | (l) | `visibleLinkSet`×2 | `applyBasicFilter`, `applyChainVisibility`, `exportToSVG`, `needsContinuousAnimation`, `renderScene`, `repaintPickCanvas` | — | — |
| `applyBasicFilter` | function | 15205 | 40 | (mode) | `links`×3, `pinnedVisibleNodes`×3, `relationTypesObj`, `selectedRelations`, `FilterModes`, `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `gfxNode`, `gfxLinkAll` | `handleUniqueChainsMode`×3, `handleChainsMode`, `applyFiltersImmediate` | — | — |
| `applyChainVisibility` | function | 15249 | 7 | (chainNodes, chainLinks) | `visibleNodeIds`, `visibleLinkSet`, `isNodeVisible`, `isLinkVisible`, `gfxNode`, `gfxLinkAll` | `handleChainsMode`×2, `handleUniqueChainsMode` | — | — |
| `handleChainsMode` | async function | 15260 | 59 | () | `selectedPhilosophers`×7, `showTemporaryMessage`×4, `CHAIN_SEARCH`×4, `updateFilterStats`×3, `findChainsThroughAllPhilosophers`×2, `applyChainVisibility`×2, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `applyBasicFilter` | `applyFiltersImmediate` | — | — |
| `handleUniqueChainsMode` | async function | 15323 | 65 | () | `selectedPhilosophers`×6, `showTemporaryMessage`×5, `CHAIN_SEARCH`×4, `updateFilterStats`×4, `applyBasicFilter`×3, `filterMode`, `LoadingIndicator`, `confirmLongChainSearch`, `findUniquePhilosopherChains`, `applyChainVisibility` | `applyFiltersImmediate` | — | — |
| `cleanupInvisibleSelections` | function | 15392 | 14 | () | `selectedNodes`×4, `isNodeVisible`, `highlightConnected`, `resetHighlight` | `applyFiltersImmediate` | — | — |
| `refreshMetricsIfScoped` | function | 15410 | 7 | () | `currentStatsView`×2, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `loadStatsContent` | `applyFiltersImmediate` | — | — |
| `applyFiltersImmediate` | function | 15418 | 21 | () | `filterMode`×3, `applyBasicFilter`, `handleChainsMode`, `handleUniqueChainsMode`, `cleanupInvisibleSelections`, `refreshMetricsIfScoped`, `updatePhilosopherDimming`, `updateFilterStats` | `debouncedApplyFilters`, `afterDataChange` | — | — |
| `applyFilters` | function | 15442 | 1 | () | `debouncedApplyFilters` | `togglePhilosopher`, `toggleTradition`, `selectAllTraditions`, `deselectAllTraditions`, `onlyTradition`, `addTradition`, `toggleRelation`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `selectAllRelations`, `deselectAllRelations`, `toggleRubric`, `selectAllRubrics`, `deselectAllRubrics`, `changeFilterMode` | — | — |
| `relationHint` | function | 15476 | 11 | (typeId) | `RELATION_HINTS`×2, `LAYER_NAMES`×2, `relationTypesObj`, `links` | `generateConceptEditContent`×2, `generateConnectionEditContent`×2, `generateConnectionVisualization`×2, `initFilters` | — | — |
| `initFilters` | function | 15489 | 79 | () | `traditions`, `philosophers`, `rubrics`, `philosopherConcepts`, `relationTypesObj`, `relationHint` | `afterDataChange`, `stmt032` | — | — |
| `togglePhilosopher` | function | 15570 | 8 | (philosopher) | `selectedPhilosophers`×3, `applyFilters` | — | динам.×1 | — |
| `toggleTradition` | function | 15580 | 5 | (traditionId) | `selectedTraditions`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllTraditions` | function | 15586 | 8 | () | `traditions`×2, `selectedTraditions`, `applyFilters` | — | статич.×1 | — |
| `deselectAllTraditions` | function | 15595 | 8 | () | `traditions`, `selectedTraditions`, `applyFilters` | — | статич.×1 | — |
| `traditionMembers` | function | 15607 | 4 | (traditionId) | `philosophers` | `onlyTradition`, `addTradition` | — | — |
| `syncPhilosopherCheckboxes` | function | 15612 | 6 | () | `philosopherConcepts`, `selectedPhilosophers` | `onlyTradition`, `addTradition` | — | — |
| `onlyTradition` | function | 15619 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `addTradition` | function | 15625 | 5 | (traditionId) | `selectedPhilosophers`, `applyFilters`, `traditionMembers`, `syncPhilosopherCheckboxes` | — | динам.×1 | — |
| `toggleRelation` | function | 15632 | 8 | (relationType) | `selectedRelations`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllPhilosophers` | function | 15642 | 7 | () | `philosopherConcepts`×2, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `deselectAllPhilosophers` | function | 15651 | 7 | () | `philosopherConcepts`, `selectedPhilosophers`, `applyFilters` | — | статич.×1 | — |
| `selectAllRelations` | function | 15660 | 7 | () | `relationTypesObj`×2, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRelations` | function | 15669 | 7 | () | `relationTypesObj`, `selectedRelations`, `applyFilters` | — | статич.×1 | — |
| `toggleRubric` | function | 15678 | 8 | (rubricId) | `selectedRubrics`×3, `applyFilters` | — | динам.×1 | — |
| `selectAllRubrics` | function | 15688 | 7 | () | `rubrics`×2, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `deselectAllRubrics` | function | 15697 | 7 | () | `rubrics`, `selectedRubrics`, `applyFilters` | — | статич.×1 | — |
| `toggleSection` | function | 15709 | 42 | (sectionId) | — | — | статич.×4 | — |
| `changeFilterMode` | function | 15753 | 4 | (mode) | `filterMode`, `applyFilters` | — | статич.×1 | — |
| `toggleUniformLinkWidth` | function | 15759 | 8 | () | `renderState`, `uniformLinkWidthActive`, `updateArrows` | — | статич.×1 | — |
| `updatePhilosopherDimming` | function | 15771 | 11 | () | `philosopherConcepts`, `philosopherPassesTraditions` | `applyFiltersImmediate` | — | — |
| `updateFilterStats` | function | 15784 | 11 | () | `nodes`×2, `links`×2, `visibleNodeIds`×2, `visibleLinkSet`×2 | `handleUniqueChainsMode`×4, `handleChainsMode`×3, `applyFiltersImmediate`, `addNodeToGraph`, `addLinkToGraph`, `stmt033` | — | — |
| `metricsLinks` | function | 15812 | 1 | () | `links`, `metricsLinkSource` | `buildGlobalGraphCache` | — | — |
| `metricsNodes` | function | 15813 | 1 | () | `nodes`, `metricsNodeSource` | `buildGlobalGraphCache` | — | — |
| `transformForScope` | function | 15821 | 9 | (list, useWeights, useDirection) | — | `initializePhilosophyMetrics`×2, `applyMetricsScope` | — | — |
| `effectiveScopeFlags` | function | 15834 | 8 | (viewName) | `useWeightedPaths`×2, `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC`, `currentStatsView` | `initializePhilosophyMetrics`×2, `applyMetricsScope` | — | — |
| `applyMetricsScope` | function | 15852 | 30 | (viewName) | `metricsScopeActive`×3, `lastScopeKey`×2, `metricsScope`×2, `nodes`, `links`, `metricsLinkSource`, `metricsNodeSource`, `transformForScope`, `effectiveScopeFlags`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `metricScopeFactor` | function | 15969 | 9 | (metricName) | `respectDirection`, `metricsScopeActive`, `METRIC_FLAGS` | `installMetricScopeWrappers` | — | — |
| `installMetricScopeWrappers` | function | 15986 | 18 | () | `METRIC_FLAGS`, `metricScopeFactor` | `openStatsModal` | — | — |
| `updateScopeToggles` | function | 16007 | 33 | (viewName) | `respectDirection`×2, `METRIC_FLAGS`, `VIEW_METRIC` | `openStatsModal`, `handleStatsParameterChange`, `switchStatsView` | — | — |
| `buildGlobalGraphCache` | function | 16041 | 105 | () | `graphCache`×3, `metricsScopeActive`×2, `isSymmetricLink`, `useWeightedPaths`, `respectDirection`, `metricsLinks`, `metricsNodes` | `calculateBetweennessAsync`, `calculatePageRank`, `bfsFromSource`, `calculateClosenessCentrality`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateRichClubCoefficient`, `calculateWeightedDegree`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents` | — | — |
| `calculateBetweennessAsync` | async function | 16155 | 152 | (progressCallback) | `nodes`×6, `respectDirection`×3, `betweennessCache`×3, `betweennessCalculating`×3, `useWeightedPaths`, `buildGlobalGraphCache` | `calculateBetweenness`, `runSingleMetric` | — | — |
| `calculateBetweenness` | function | 16309 | 10 | () | `betweennessCache`×2, `betweennessCalculating`, `calculateBetweennessAsync` | — | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateBetweennessCache` | function | 16321 | 4 | () | `betweennessCache`, `betweennessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculatePageRank` | function | 16334 | 111 | (iterations=…, dampingFactor=…, progressCallback=…) | `nodes`×7, `respectDirection`×4, `useWeightedPaths`×3, `pageRankCache`×3, `pageRankCalculating`×3, `buildGlobalGraphCache` | `runSingleMetric` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePageRankCache` | function | 16446 | 4 | () | `pageRankCache`, `pageRankCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `bfsFromSource` | function | 16460 | 41 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `calculateClosenessCentrality` | async function | 16506 | 68 | (progressCallback=…) | `nodes`×4, `closenessCache`×3, `closenessCalculating`×3, `useWeightedPaths`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource` | `runSingleMetric` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateClosenessCache` | function | 16575 | 4 | () | `closenessCache`, `closenessCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `calculateClusteringCoefficient` | function | 16587 | 46 | () | `clusteringCache`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion` | — | 1× (ключ объекта) в `METRIC_FLAGS` |
| `invalidateClusteringCache` | function | 16634 | 3 | () | `clusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedClustering` | function | 16651 | 74 | () | `weightedClusteringCache`×3, `nodes`, `buildGlobalGraphCache` | `runSingleMetric` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateWeightedClusteringCache` | function | 16726 | 3 | () | `weightedClusteringCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateLocalCohesion` | function | 16734 | 29 | () | `localCohesionCache`×3, `calculateClusteringCoefficient`, `calculateWeightedDegree` | `runSingleMetric` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateLocalCohesionCache` | function | 16764 | 3 | () | `localCohesionCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateRichClubCoefficient` | function | 16772 | 61 | () | `richClubCache`×3, `nodes`×2, `buildGlobalGraphCache` | `runSingleMetric` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateRichClubCache` | function | 16834 | 3 | () | `richClubCache` | `invalidateEverythingForScope`×2 | — | — |
| `calculateWeightedDegree` | function | 16842 | 52 | () | `useWeightedPaths`×3, `respectDirection`×3, `nodes`, `buildGlobalGraphCache` | `calculateLocalCohesion`, `generateDegreeContent` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `dijkstraFromSource` | function | 16901 | 47 | (sourceId) | `nodes`, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `calculateClosenessCentrality` | — | — |
| `invalidateGraphCache` | function | 16962 | 1 | () | `graphCache` | `invalidateEverythingForScope`×2, `applyMetricsScope`, `closeStatsModal` | — | — |
| `calculateEigenvectorCentrality` | async function | 16968 | 77 | (iterations=…, progressCallback=…) | `nodes`×4, `eigenvectorCache`×3, `eigenvectorCalculating`×3, `useWeightedPaths`, `respectDirection`, `buildGlobalGraphCache` | `runSingleMetric` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateEigenvectorCache` | function | 17046 | 4 | () | `eigenvectorCache`, `eigenvectorCalculating` | `invalidateEverythingForScope`×2 | — | — |
| `findConnectedComponents` | function | 17055 | 34 | () | `nodes`, `respectDirection`, `buildGlobalGraphCache` | — | — | — |
| `isReflexiveLink` | function | 17108 | 5 | (r) | — | `buildIncomingLinks`, `buildOutgoingLinks`, `renderScene`, `repaintPickCanvas`, `stmt021`, `connectionIntegrityWarnings`, `deleteConnection`, `generateConceptEditContent`, `updateConnEditPairNote`, `connectionArrowSvg`, `generateConnectionVisualization` | — | — |
| `reflexiveLinkOf` | function | 17116 | 8 | (conceptId) | `_relations` | `foundationalIndex`, `tensionIndex`, `conceptualComplexityIndex` | — | — |
| `buildIncomingLinks` | function | 17125 | 14 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `buildOutgoingLinks` | function | 17140 | 17 | () | `isSymmetricLink`, `_concepts`, `_relations`, `isReflexiveLink` | `initializeMetricsData` | — | — |
| `initializeMetricsData` | function | 17159 | 9 | (conceptsData, relationsData, philosophersData) | `_concepts`×2, `_philosophers`×2, `_relations`, `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `buildIncomingLinks`, `buildOutgoingLinks` | `initializePhilosophyMetrics` | — | — |
| `problemGenerationIndex` | function | 17177 | 106 | (conceptId) | `_incomingLinks`, `_outgoingLinks` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateProblemGenerationContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateProblemGenerationIndexCache` | function | 17284 | 3 | () | `problemGenerationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `criticalPowerIndex` | function | 17292 | 174 | (conceptId) | `_conceptMap`×5, `_philosopherMap`×4, `_incomingLinks`×2, `_outgoingLinks`×2 | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCriticalPowerContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateCriticalPowerIndexCache` | function | 17467 | 3 | () | `criticalPowerIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `revolutionaryIndex` | function | 17475 | 123 | (conceptId) | `_conceptMap`×6, `_philosopherMap`×4, `_incomingLinks`×2, `conceptToRubrics`, `_outgoingLinks` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateRevolutionaryContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateRevolutionaryIndexCache` | function | 17599 | 3 | () | `revolutionaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `paradigmShiftIndex` | function | 17606 | 48 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×2, `_incomingLinks`, `_outgoingLinks`, `sumWeight` | `similarityData`, `METRIC_COVERAGE_FN`, `generateParadigmShiftContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateParadigmShiftIndexCache` | function | 17655 | 3 | () | `paradigmShiftIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `influenceIndex` | function | 17662 | 103 | (conceptId) | `_conceptMap`×4, `_philosopherMap`×4, `influenceScope`×2, `linkInInfluenceScope`×2, `_incomingLinks`, `_outgoingLinks`, `INFLUENCE_SCOPE_LABELS`, `generativity` | `philosopherProfile`, `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInfluenceContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInfluenceIndexCache` | function | 17766 | 3 | () | `influenceIndexCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `setInfluenceScope` | function | 17778 | 12 | (scope) | `currentStatsView`×3, `influenceScope`×2, `invalidateInfluenceIndexCache`, `generateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `INFLUENCE_SCOPE_LABELS`, `loadStatsContent` | — | динам.×1 | — |
| `influenceScopeSwitcher` | function | 17791 | 14 | () | `influenceScope`×2, `INFLUENCE_SCOPE_LABELS` | `generateInfluenceContent`, `generatePhilosopherProfileContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `sumWeight` | function | 17828 | 3 | (links) | — | `foundationalIndex`×4, `dialogicalIndex`×4, `transformationIndex`×3, `conceptualFertilityIndex`×3, `syntheticIndex`×2, `internalCoherenceIndex`×2, `abstractionIndex`×2, `paradigmShiftIndex`, `instrumentalIndex`, `deductiveIndex` | — | — |
| `otherPhilosopher` | function | 17833 | 4 | (r, conceptId) | `_conceptMap`, `_philosopherMap` | `dialogicalIndex`, `conceptualContinuityIndex` | — | — |
| `foundationalIndex` | function | 17838 | 42 | (conceptId) | `sumWeight`×4, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateFoundationalContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateFoundationalIndexCache` | function | 17881 | 3 | () | `foundationalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `syntheticIndex` | function | 17888 | 66 | (conceptId) | `_conceptMap`×4, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks` | `generateRankings`, `similarityData`, `METRIC_COVERAGE_FN`, `generateSyntheticContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateSyntheticIndexCache` | function | 17955 | 3 | () | `syntheticIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `dialogicalIndex` | function | 17962 | 40 | (conceptId) | `sumWeight`×4, `_incomingLinks`, `_outgoingLinks`, `otherPhilosopher` | `similarityData`, `METRIC_COVERAGE_FN`, `generateDialogicalContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDialogicalIndexCache` | function | 18003 | 3 | () | `dialogicalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `internalCoherenceIndex` | function | 18010 | 48 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_concepts`, `_incomingLinks`, `_outgoingLinks` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateCoherenceContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateInternalCoherenceIndexCache` | function | 18059 | 3 | () | `internalCoherenceIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `tensionScales` | function | 18088 | 23 | () | `_tensionScales`×4, `_tensionScalesComputing`×3, `_concepts`, `tensionIndex` | — | — | — |
| `invalidateTensionScales` | function | 18112 | 3 | () | `_tensionScales` | `invalidateAllMetricsCaches` | — | — |
| `tensionIndex` | function | 18117 | 200 | (conceptId) | `isSymmetricLink`, `_conceptMap`, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `tensionScales`, `METRIC_COVERAGE_FN`, `generateTensionContent`, `PROFILE_METRICS` | — | 3× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `toggleMetricVisualization` |
| `invalidateTensionIndexCache` | function | 18318 | 3 | () | `tensionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherProfile` | function | 18325 | 42 | (philosopherId) | `_concepts`, `revolutionaryIndex`, `influenceIndex`, `internalCoherenceIndex`, `instrumentalIndex`, `deductiveIndex` | `renderPhilosopherComparison`×3, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherProfileContent` | — | — |
| `invalidatePhilosopherProfileCache` | function | 18368 | 3 | () | `philosopherProfileCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherSystematicIndex` | function | 18375 | 55 | (philosopherId) | `_concepts`, `_relations`, `SYSTEMATIC_TYPES`, `DISRUPTIVE_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherSystematicContent` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherSystematicIndexCache` | function | 18431 | 3 | () | `philosopherSystematicIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherHistoricalReachIndex` | function | 18438 | 59 | (philosopherId) | `_philosopherMap`×2, `_concepts`, `_relations`, `_conceptMap`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherReachContent` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherHistoricalReachIndexCache` | function | 18498 | 3 | () | `philosopherHistoricalReachIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `philosopherInterdisciplinaryIndex` | function | 18505 | 48 | (philosopherId) | `_conceptMap`×2, `_concepts`, `_relations` | `showPhilosopherProfileModal`×2, `generatePhilosopherRankings`, `philosopherSimilarityData`, `generatePhilosopherInterdisciplinaryContent` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidatePhilosopherInterdisciplinaryIndexCache` | function | 18554 | 3 | () | `philosopherInterdisciplinaryIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `temporalInfluencePattern` | function | 18561 | 57 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `_incomingLinks`, `CONSTRUCTIVE_TYPES`, `POLEMICAL_TYPES` | `generateTemporalInfluenceContent` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTemporalInfluencePatternCache` | function | 18619 | 3 | () | `temporalInfluencePatternCache` | `invalidateAllMetricsCaches` | — | — |
| `generateRankings` | function | 18626 | 31 | () | `generateRankingsCache`×2, `metricValueMode`×2, `generateRankingsMode`×2, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `applyMetricMode` | `generateConceptRankingsContent` | — | — |
| `invalidateGenerateRankingsCache` | function | 18658 | 3 | () | `generateRankingsCache` | `invalidateAllMetricsCaches` | — | — |
| `generatePhilosopherRankings` | function | 18668 | 89 | () | `generatePhilosopherRankingsCache`×3, `_concepts`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `generatePhilosopherRankingsContent` | — | — |
| `invalidateGeneratePhilosopherRankingsCache` | function | 18758 | 3 | () | `generatePhilosopherRankingsCache` | `setInfluenceScope`, `invalidateAllMetricsCaches` | — | — |
| `transformationIndex` | function | 18769 | 31 | (conceptId) | `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateTransformationContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateTransformationIndexCache` | function | 18801 | 3 | () | `transformationIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualFertilityIndex` | function | 18808 | 49 | (conceptId) | `_conceptMap`×3, `_philosopherMap`×3, `sumWeight`×3, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateFertilityContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualFertilityIndexCache` | function | 18858 | 3 | () | `conceptualFertilityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualComplexityIndex` | function | 18865 | 47 | (conceptId) | `_conceptMap`×2, `_incomingLinks`, `_outgoingLinks`, `reflexiveLinkOf` | `similarityData`, `METRIC_COVERAGE_FN`, `generateComplexityContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualComplexityIndexCache` | function | 18913 | 3 | () | `conceptualComplexityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `conceptualContinuityIndex` | function | 18924 | 63 | (conceptId) | `_conceptMap`, `_philosopherMap`, `_incomingLinks`, `_outgoingLinks`, `otherPhilosopher` | `similarityData`, `METRIC_COVERAGE_FN`, `generateContinuityContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateConceptualContinuityIndexCache` | function | 18988 | 3 | () | `conceptualContinuityIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `medianNodeDegree` | function | 19014 | 12 | () | `_medianDegreeCache`×4, `_concepts`, `_relations` | `profileIsMeaningful`, `similarConceptsBlock` | — | — |
| `nodeDegreeOf` | function | 19026 | 7 | (conceptId) | `_relations` | `profileIsMeaningful`, `similarConceptsBlock` | — | — |
| `profileIsMeaningful` | function | 19034 | 3 | (conceptId) | `medianNodeDegree`, `nodeDegreeOf` | `nearestConcepts`×2 | — | — |
| `similarityData` | function | 19039 | 48 | () | `_simCache`×4, `_concepts`, `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `abstractionIndex`, `deductiveIndex` | `allConceptPairsAsync`, `profileSimilarity`, `nearestConcepts`, `generateComparisonContent`, `renderComparison` | — | — |
| `invalidateSimilarityCache` | function | 19088 | 6 | () | `_simCache`, `_pairCache`, `_pairCalculating`, `invalidatePhilosopherSimilarityCache` | `invalidateAllMetricsCaches` | — | — |
| `allConceptPairs` | function | 19103 | 3 | () | `_pairCache` | `renderClosestPairs` | — | — |
| `allConceptPairsAsync` | async function | 19112 | 55 | (progressCallback) | `_pairCache`×4, `_pairCalculating`×3, `similarityData`, `PAIRS_CHUNK_ROWS`, `neighborSets` | `renderClosestPairs` | — | — |
| `profileSimilarity` | function | 19168 | 9 | (idA, idB) | `similarityData` | `nearestConcepts`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `neighborSets` | function | 19181 | 12 | () | `_neighborCache`×3, `_concepts`, `_relations` | `allConceptPairsAsync`, `structuralSimilarity` | — | — |
| `typeProfileOf` | function | 19194 | 7 | (conceptId) | `_incomingLinks`, `_outgoingLinks` | `structuralSimilarity`×2 | — | — |
| `structuralSimilarity` | function | 19202 | 22 | (idA, idB) | `typeProfileOf`×2, `neighborSets` | `nearestConcepts`, `renderComparison`, `showSimilarityOverlay` | — | — |
| `nearestConcepts` | function | 19225 | 51 | (conceptId, kind, k) | `profileIsMeaningful`×2, `similarityData`, `profileSimilarity`, `structuralSimilarity` | `similarConceptsBlock`×2 | — | — |
| `rubricUnionSize` | function | 19304 | 5 | (v1, v2) | — | `philosopherSimilarity` | — | — |
| `philosopherSimilarityData` | function | 19311 | 84 | () | `_concepts`×4, `_philSimCache`×4, `_relations`×3, `_conceptMap`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex` | `philosopherSimilarity`, `nearestPhilosophers`, `generatePhilosopherComparisonContent`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `invalidatePhilosopherSimilarityCache` | function | 19396 | 1 | () | `_philSimCache` | `invalidateSimilarityCache` | — | — |
| `cosineOf` | function | 19398 | 5 | (a, b) | — | `philosopherSimilarity`×3 | — | — |
| `philosopherSimilarity` | function | 19404 | 20 | (a, b, kind) | `cosineOf`×3, `PHIL_SIM_MIN_CONCEPTS`×2, `PHIL_SIM_MIN_RUBRIC_UNION`, `rubricUnionSize`, `philosopherSimilarityData` | `nearestPhilosophers`, `renderPhilosopherComparison`, `renderPhilosopherPairs` | — | — |
| `nearestPhilosophers` | function | 19425 | 12 | (philosopherId, kind, k) | `philosopherSimilarityData`, `philosopherSimilarity` | `similarPhilosophersBlock`×3 | — | — |
| `sameTraditionPhil` | function | 19458 | 6 | (a, b) | `_philosopherMap`×2 | `linkInInfluenceScope`, `generativityScores` | — | — |
| `linkInInfluenceScope` | function | 19467 | 8 | (r, ownPhilosopher, scope) | `_conceptMap`×2, `influenceScope`×2, `sameTraditionPhil` | `influenceIndex`×2 | — | — |
| `generativityScores` | function | 19484 | 42 | (scope) | `_generativityCacheByScope`×3, `_conceptMap`×2, `_concepts`, `_relations`, `sameTraditionPhil`, `GENERATIVITY_DAMPING`, `GENERATIVITY_ITERATIONS` | `generativity` | — | — |
| `generativity` | function | 19527 | 3 | (conceptId, scope) | `generativityScores` | `influenceIndex`, `generativeIndex` | — | — |
| `invalidateGenerativityCache` | function | 19531 | 3 | () | `_generativityCacheByScope` | `invalidateAllMetricsCaches` | — | — |
| `generativeIndex` | function | 19537 | 23 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `generativity` | `similarityData`, `METRIC_COVERAGE_FN`, `generateGenerativeContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `instrumentalIndex` | function | 19577 | 25 | (conceptId) | `_conceptMap`×2, `_outgoingLinks`, `sumWeight` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateInstrumentalContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `traditionBridgingIndex` | function | 19629 | 54 | (conceptId) | `_conceptMap`×2, `_philosopherMap`×2, `_incomingLinks`, `_outgoingLinks`, `BRIDGING_MIN_EXTERNAL`, `BRIDGING_WEIGHT_REF` | `METRIC_COVERAGE_FN`, `generateBridgingContent`, `PROFILE_METRICS` | — | 2× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC` |
| `invalidateTraditionBridgingCache` | function | 19684 | 3 | () | `traditionBridgingCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateInstrumentalIndexCache` | function | 19688 | 3 | () | `instrumentalIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `abstractionIndex` | function | 19699 | 23 | (conceptId) | `_conceptMap`×2, `sumWeight`×2, `_incomingLinks`, `_outgoingLinks` | `similarityData`, `METRIC_COVERAGE_FN`, `generateAbstractionContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateAbstractionIndexCache` | function | 19723 | 3 | () | `abstractionIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `deductiveDepth` | function ⟲ | 19740 | 12 | (conceptId, seen) | `_outgoingLinks` | `deductiveIndex` | — | 1× (ключ объекта) в `METRIC_FLAGS` |
| `deductiveIndex` | function | 19753 | 28 | (conceptId) | `deductiveIndexCache`×3, `_conceptMap`×2, `_outgoingLinks`, `sumWeight`, `deductiveDepth` | `philosopherProfile`, `similarityData`, `METRIC_COVERAGE_FN`, `generateDeductiveContent`, `PROFILE_METRICS` | — | 5× (ключ объекта, строка) в `METRIC_FLAGS`, `VIEW_METRIC`, `SIM_METRIC_LABELS`, `similarityData`, `toggleMetricVisualization` |
| `invalidateDeductiveIndexCache` | function | 19782 | 3 | () | `deductiveIndexCache` | `invalidateAllMetricsCaches` | — | — |
| `invalidateAllMetricsCaches` | function | 19787 | 30 | () | `invalidateProblemGenerationIndexCache`, `invalidateCriticalPowerIndexCache`, `invalidateRevolutionaryIndexCache`, `invalidateParadigmShiftIndexCache`, `invalidateInfluenceIndexCache`, `invalidateFoundationalIndexCache`, `invalidateSyntheticIndexCache`, `invalidateDialogicalIndexCache`, `invalidateInternalCoherenceIndexCache`, `invalidateTensionScales`, `invalidateTensionIndexCache`, `invalidatePhilosopherProfileCache`, `invalidatePhilosopherSystematicIndexCache`, `invalidatePhilosopherHistoricalReachIndexCache`, `invalidatePhilosopherInterdisciplinaryIndexCache`, `invalidateTemporalInfluencePatternCache`, `invalidateGenerateRankingsCache`, `invalidateGeneratePhilosopherRankingsCache`, `invalidateTransformationIndexCache`, `invalidateConceptualFertilityIndexCache`, `invalidateConceptualComplexityIndexCache`, `invalidateConceptualContinuityIndexCache`, `invalidateSimilarityCache`, `invalidateGenerativityCache`, `invalidateTraditionBridgingCache`, `invalidateInstrumentalIndexCache`, `invalidateAbstractionIndexCache`, `invalidateDeductiveIndexCache` | `invalidateEverythingForScope` | — | — |
| `metricsScopeCounts` | function | 19825 | 10 | () | `nodes`×2, `links`×2, `isNodeVisible`, `metricsScope` | `updateMetricsScopeHint`, `showConceptProfileModal` | — | — |
| `updateMetricsScopeHint` | function | 19836 | 6 | () | `metricsScopeCounts` | `refreshMetricsIfScoped`, `handleMetricsScopeChange`, `openStatsModal` | — | — |
| `invalidateEverythingForScope` | function | 19845 | 14 | () | `invalidateBetweennessCache`×2, `invalidatePageRankCache`×2, `invalidateClosenessCache`×2, `invalidateClusteringCache`×2, `invalidateWeightedClusteringCache`×2, `invalidateLocalCohesionCache`×2, `invalidateRichClubCache`×2, `invalidateGraphCache`×2, `invalidateEigenvectorCache`×2, `_medianDegreeCache`, `invalidateAllMetricsCaches`, `invalidateMetricCoverageCache` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `closeStatsModal`, `afterDataChange` | — | — |
| `handleMetricsScopeChange` | function | 19860 | 8 | () | `currentStatsView`×2, `metricsScope`, `updateMetricsScopeHint`, `invalidateEverythingForScope`, `initializePhilosophyMetrics`, `loadStatsContent` | — | статич.×1 | — |
| `initializePhilosophyMetrics` | function | 19873 | 68 | () | `nodes`×2, `links`×2, `transformForScope`×2, `effectiveScopeFlags`×2, `metricsScope`×2, `philosophers`, `isNodeVisible`, `initializeMetricsData` | `refreshMetricsIfScoped`, `applyMetricsScope`, `handleMetricsScopeChange`, `openStatsModal`, `closeStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `afterDataChange`, `stmt034` | — | — |
| `getMetricDescription` | function | 20408 | 12 | (metricKey) | `metricDescriptions` | `generateMetricDescriptionBlock` | — | — |
| `openStatsModal` | function | 20429 | 38 | () | `currentStatsView`×4, `concepts`, `relations`, `useWeightedPaths`, `respectDirection`, `applyMetricsScope`, `installMetricScopeWrappers`, `updateScopeToggles`, `metricsScope`, `updateMetricsScopeHint`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `updateActiveNavItem`, `loadStatsContent`, `freezeSimulation` | `calculateMetricFromModal`×2 | статич.×1, динам.×1 | — |
| `closeStatsModal` | function | 20469 | 30 | () | `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `metricsLinkSource`, `metricsNodeSource`, `metricsScopeActive`, `lastScopeKey`, `invalidateGraphCache`, `invalidateEverythingForScope`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `unfreezeSimulation` | `stmt009`, `stmt010`, `toggleMetricVisualization` | статич.×1 | — |
| `handleStatsParameterChange` | function | 20501 | 31 | () | `currentStatsView`×3, `useWeightedPaths`, `respectDirection`, `applyMetricsScope`, `updateScopeToggles`, `loadStatsContent`, `resetNodeSizes` | — | статич.×2 | — |
| `switchStatsView` | function | 20534 | 15 | (viewName, event) | `applyMetricsScope`, `updateScopeToggles`, `currentStatsView`, `updateActiveNavItem`, `loadStatsContent` | `calculateMetricFromModal`, `openPhilosopherPair`, `openPairInComparison` | статич.×39, динам.×1 | — |
| `updateActiveNavItem` | function | 20551 | 9 | (viewName) | — | `openStatsModal`, `switchStatsView`, `calculateMetricFromModal` | — | — |
| `loadStatsContent` | function | 20562 | 68 | (viewName) | `renderPhilosopherComparison`×2, `renderPhilosopherPairs`×2, `renderClosestPairs`×2, `renderComparison`×2, `applyMetricLayout`, `generateOverviewContent`, `generateDegreeContent`, `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | `refreshMetricsIfScoped`, `setInfluenceScope`, `handleMetricsScopeChange`, `openStatsModal`, `handleStatsParameterChange`, `switchStatsView`, `toggleMetricValueMode`, `afterDataChange` | — | — |
| `calculateMetricFromModal` | async function | 20648 | 29 | (metricKey) | `isStatsModalOpen`×2, `openStatsModal`×2, `switchStatsView`, `updateActiveNavItem`, `runSingleMetric` | — | динам.×1 | — |
| `philosopherBirth` | function | 20691 | 4 | (nameRu) | `philosophers` | `generatePhilosopherViewContent`×3, `sortPhilosophersByBirth`×2, `connectionIntegrityWarnings`×2 | — | — |
| `formatBirthYear` | function | 20697 | 3 | (b) | — | `generatePhilosopherViewContent`×3 | — | — |
| `sortPhilosophersByBirth` | function | 20700 | 3 | (list) | `philosopherBirth`×2 | `generatePhilosopherViewContent`×3, `generateConceptEditContent` | — | — |
| `philosopherYears` | function | 20703 | 4 | (nameRu) | `philosophers` | `generatePhilosopherViewContent`×3, `connectionIntegrityWarnings`×2, `generateConceptEditContent` | — | — |
| `getContrastColor` | function | 20722 | 18 | (hexColor) | — | `generatePhilosopherViewContent`×4, `showConceptProfileModal`, `showPhilosopherProfileModal`, `updatePhilColorSample`, `conceptPlate`, `generateConceptViewContent` | — | — |
| `ambiguousLabels` | function | 20748 | 7 | () | `_ambiguousLabels`×4, `nodes` | `labelWithAuthor` | — | — |
| `labelWithAuthor` | function | 20756 | 4 | (node) | `ambiguousLabels` | `stmt020` | — | — |
| `conceptDegreeForNorm` | function | 20769 | 8 | (conceptId) | `_relations` | `normalizeMetricValue` | — | — |
| `normalizeMetricValue` | function | 20777 | 4 | (conceptId, value) | `conceptDegreeForNorm` | `applyMetricMode` | — | — |
| `applyMetricMode` | function | 20781 | 5 | (conceptId, value) | `metricValueMode`, `normalizeMetricValue` | `generateMetricResults`×3, `generateRankings` | — | — |
| `toggleMetricValueMode` | function | 20786 | 5 | () | `currentStatsView`×2, `metricValueMode`×2, `generateRankingsCache`, `loadStatsContent` | — | динам.×2 | — |
| `metricCoverage` | function | 20816 | 16 | (metricKey) | `_metricCoverageCache`×3, `_concepts`×2, `METRIC_COVERAGE_FN` | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` | — | — |
| `invalidateMetricCoverageCache` | function | 20832 | 1 | () | `_metricCoverageCache` | `invalidateEverythingForScope` | — | — |
| `generateMetricCoverageBlock` | function | 20834 | 12 | (metricKey) | `METRIC_COVERAGE_WARN`, `metricCoverage` | `generateMetricResults`×2 | — | — |
| `generateMetricDescriptionBlock` | function | 20847 | 39 | (metricKey) | `getMetricDescription` | `generateMetricResults`×2, `generateCalculateButton`, `generateOverviewContent`, `generateDegreeContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent` | — | — |
| `generateCalculateButton` | function | 20888 | 18 | (metricName, metricKey, description) | `generateMetricDescriptionBlock` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent` | — | — |
| `rankKeep` | function | 20924 | 6 | (r, i) | `lastZeroCount`×2 | `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateContinuityContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent` | — | — |
| `genericDetailsHTML` | function | 21000 | 55 | (item, conceptDesc) | `METRIC_FIELD_LABELS`×5 | `generateMetricResults` | — | — |
| `applyMetricLayout` | function | 21066 | 13 | () | `metricLayoutMode` | `loadStatsContent`, `toggleMetricLayout` | — | — |
| `toggleMetricLayout` | function | 21080 | 5 | () | `metricLayoutMode`×3, `applyMetricLayout` | — | динам.×1 | — |
| `generateMetricResults` | function | 21086 | 136 | (data, title, description, metricKey, valueKey, isDecimal, options=…) | `metricValueMode`×4, `METRIC_COVERAGE_FN`×4, `metricLayoutMode`×4, `applyMetricMode`×3, `generateMetricCoverageBlock`×2, `generateMetricDescriptionBlock`×2, `lastZeroCount`×2, `genericDetailsHTML` | `generatePageRankContent`, `generateBetweennessContent`, `generateClosenessContent`, `generateEigenvectorContent`, `generateWeightedClusteringContent`, `generateLocalCohesionContent`, `generateRichClubContent`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent` | — | — |
| `toggleMetricDetails` | function | 21226 | 21 | (button) | — | — | динам.×1 | — |
| `generateOverviewContent` | function | 21256 | 36 | () | `nodes`×4, `links`×3, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generateDegreeContent` | function | 21293 | 64 | () | `useWeightedPaths`, `respectDirection`, `calculateWeightedDegree`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePageRankContent` | function | 21358 | 15 | () | `pageRankCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBetweennessContent` | function | 21374 | 15 | () | `betweennessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateClosenessContent` | function | 21390 | 15 | () | `closenessCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateEigenvectorContent` | function | 21406 | 15 | () | `eigenvectorCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateWeightedClusteringContent` | function | 21422 | 15 | () | `weightedClusteringCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateLocalCohesionContent` | function | 21438 | 15 | () | `localCohesionCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRichClubContent` | function | 21454 | 15 | () | `richClubCache`×3, `generateCalculateButton`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateProblemGenerationContent` | function | 21474 | 23 | () | `concepts`, `relations`, `nodes`, `problemGenerationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCriticalPowerContent` | function | 21498 | 23 | () | `concepts`, `relations`, `nodes`, `criticalPowerIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateRevolutionaryContent` | function | 21522 | 23 | () | `concepts`, `relations`, `nodes`, `revolutionaryIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateParadigmShiftContent` | function | 21546 | 23 | () | `concepts`, `relations`, `nodes`, `paradigmShiftIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInfluenceContent` | function | 21570 | 23 | () | `concepts`, `relations`, `nodes`, `influenceIndex`, `influenceScopeSwitcher`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFoundationalContent` | function | 21594 | 23 | () | `concepts`, `relations`, `nodes`, `foundationalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateSyntheticContent` | function | 21618 | 23 | () | `concepts`, `relations`, `nodes`, `syntheticIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDialogicalContent` | function | 21642 | 23 | () | `concepts`, `relations`, `nodes`, `dialogicalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateCoherenceContent` | function | 21666 | 23 | () | `concepts`, `relations`, `nodes`, `internalCoherenceIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTensionContent` | function | 21691 | 195 | () | `concepts`, `relations`, `nodes`, `tensionIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generatePhilosopherComparisonContent` | function | 21913 | 32 | () | `_pcmpA`×3, `_pcmpB`×3, `concepts`, `relations`, `philosopherSimilarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `renderPhilosopherComparison` | function | 21946 | 63 | () | `philosopherProfile`×3, `philosopherSimilarityData`, `philosopherSimilarity`, `_pcmpA`, `_pcmpB`, `PHIL_SIM_LABELS` | `loadStatsContent`×2 | динам.×2 | — |
| `generatePhilosopherPairsContent` | function | 22012 | 21 | () | `concepts`, `relations`, `_concepts`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `PHIL_SIM_LABELS` | `loadStatsContent` | — | — |
| `renderPhilosopherPairs` | function | 22034 | 33 | () | `_philPairsKind`×3, `PHIL_SIM_LABELS`×2, `philosopherSimilarityData`, `philosopherSimilarity` | `loadStatsContent`×2 | динам.×1 | — |
| `openPhilosopherPair` | function | 22068 | 4 | (a, b) | `switchStatsView`, `_pcmpA`, `_pcmpB` | — | динам.×1 | — |
| `generateClosestPairsContent` | function | 22073 | 40 | () | `_pairsMinDegree`×2, `_pairsMinShared`×2, `concepts`, `relations`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent` | — | — |
| `renderClosestPairs` | async function | 22114 | 96 | () | `_pairsMinDegree`×3, `nodes`×2, `philosopherTraditions`×2, `_concepts`×2, `_pairsMinShared`×2, `LoadingIndicator`, `_pairCalculating`, `allConceptPairs`, `allConceptPairsAsync`, `_pairsKind`, `_pairsCrossAuthor`, `_pairsCrossTradition` | `loadStatsContent`×2 | динам.×6 | — |
| `openPairInComparison` | function | 22211 | 4 | (a, b) | `switchStatsView`, `_cmpA`, `_cmpB` | — | динам.×1 | — |
| `generateComparisonContent` | function | 22216 | 48 | () | `_cmpA`×3, `_cmpB`×3, `concepts`, `relations`, `nodes`, `similarityData`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `renderComparison` | function | 22265 | 62 | () | `_cmpA`×4, `_cmpB`×4, `nodes`×2, `_concepts`, `SIM_METRIC_LABELS`, `similarityData`, `profileSimilarity`, `structuralSimilarity` | `loadStatsContent`×2, `selectCustomOption`×2 | — | — |
| `generateGenerativeContent` | function | 22328 | 19 | () | `concepts`, `relations`, `nodes`, `generativeIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateInstrumentalContent` | function | 22348 | 19 | () | `concepts`, `relations`, `nodes`, `instrumentalIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateBridgingContent` | function | 22368 | 28 | () | `concepts`, `relations`, `nodes`, `traditionBridgingIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateAbstractionContent` | function | 22397 | 21 | () | `concepts`, `relations`, `nodes`, `abstractionIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateDeductiveContent` | function | 22419 | 19 | () | `concepts`, `relations`, `nodes`, `deductiveIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTransformationContent` | function | 22439 | 23 | () | `concepts`, `relations`, `nodes`, `transformationIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateFertilityContent` | function | 22463 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualFertilityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateComplexityContent` | function | 22487 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualComplexityIndex`, `initializePhilosophyMetrics`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateContinuityContent` | function | 22511 | 23 | () | `concepts`, `relations`, `nodes`, `conceptualContinuityIndex`, `initializePhilosophyMetrics`, `rankKeep`, `generateMetricResults` | `loadStatsContent` | — | — |
| `generateTemporalInfluenceContent` | function | 22535 | 53 | () | `concepts`, `relations`, `nodes`, `temporalInfluencePattern`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherProfileContent` | function | 22593 | 42 | () | `concepts`, `relations`, `nodes`, `influenceScopeSwitcher`, `philosopherProfile`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherSystematicContent` | function | 22636 | 38 | () | `concepts`, `relations`, `nodes`, `philosopherSystematicIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherReachContent` | function | 22675 | 37 | () | `concepts`, `relations`, `nodes`, `philosopherHistoricalReachIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generatePhilosopherInterdisciplinaryContent` | function | 22713 | 40 | () | `concepts`, `relations`, `nodes`, `philosopherInterdisciplinaryIndex`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock`, `rankKeep` | `loadStatsContent` | — | — |
| `generateConceptRankingsContent` | function | 22758 | 77 | () | `metricValueMode`×3, `concepts`, `relations`, `influenceScopeSwitcher`, `generateRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `generatePhilosopherRankingsContent` | function | 22836 | 51 | () | `concepts`, `relations`, `influenceScopeSwitcher`, `generatePhilosopherRankings`, `initializePhilosophyMetrics`, `generateMetricDescriptionBlock` | `loadStatsContent` | — | — |
| `updateVisualizationControlSection` | function | 22899 | 40 | () | `currentVisualizedMetric`×3, `isVisualizingBySize` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `saveOriginalRadii` | function | 22941 | 11 | () | `originalRadii`×3, `nodes`, `originalTextDy` | `visualizeMetricBySize`, `stmt012`, `stmt040` | — | — |
| `toggleMetricVisualization` | function | 22954 | 126 | (metricKey) | `nodes`×2, `links`×2, `concepts`, `relations`, `betweennessCache`, `pageRankCache`, `closenessCache`, `weightedClusteringCache`, `localCohesionCache`, `richClubCache`, `eigenvectorCache`, `isStatsModalOpen`, `closeStatsModal`, `isVisualizingBySize`, `currentVisualizedMetric`, `visualizeMetricBySize`, `resetNodeSizes` | — | динам.×2 | — |
| `updateVisualizationButtonText` | function | 23082 | 16 | (metricKey) | `isVisualizingBySize`, `currentVisualizedMetric` | `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `visualizeMetricBySize` | function | 23100 | 104 | (metricData, metricName) | `gfxNode`×2, `nodes`, `isVisualizingBySize`, `currentVisualizedMetric`, `updateVisualizationControlSection`, `saveOriginalRadii`, `updateVisualizationButtonText`, `arrowMode`, `arrowRadius`, `updateArrows` | `toggleMetricVisualization` | — | — |
| `resetNodeSizes` | function | 23206 | 38 | () | `isVisualizingBySize`×2, `currentVisualizedMetric`×2, `gfxNode`×2, `originalRadii`, `originalTextDy`, `updateVisualizationControlSection`, `updateVisualizationButtonText`, `arrowMode`, `arrowRadius`, `updateArrows` | `handleStatsParameterChange`, `toggleMetricVisualization` | статич.×1 | — |
| `showProgress` | function | 23257 | 11 | (label, percent) | — | `runSingleMetric`×12 | — | — |
| `hideProgress` | function | 23270 | 4 | () | — | `runSingleMetric`×2 | — | — |
| `runSingleMetric` | async function | 23276 | 73 | (metricName) | `showProgress`×12, `hideProgress`×2, `calculateBetweennessAsync`, `calculatePageRank`, `calculateClosenessCentrality`, `calculateWeightedClustering`, `calculateLocalCohesion`, `calculateRichClubCoefficient`, `calculateEigenvectorCentrality` | `calculateMetricFromModal` | — | — |
| `highlightNodeById` | function | 23351 | 18 | (nodeId) | `selectedNodes`×2, `nodes`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected` | — | динам.×4 | — |
| `exportToPNG` | function | 23371 | 35 | () | `showTemporaryMessage`×2, `viewWidth`, `viewHeight`, `renderState`, `renderScene` | — | статич.×1 | — |
| `exportToSVG` | function | 23410 | 74 | () | `hasNodeClass`×6, `viewWidth`×3, `viewHeight`×3, `nodes`×2, `isNodeVisible`×2, `selectedNodes`×2, `philosopherConcepts`, `relationTypesObj`, `isSymmetricLink`, `links`, `isLinkVisible`, `renderState`, `nodeRadius`, `nodeLabelDy`, `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads`, `linkVisualState`, `linkDrawWidth`, `linkDrawAlpha`, `DRAW_ORDER` | — | статич.×1 | — |
| `handleLegendSearch` | function | 23489 | 15 | (query) | `searchNodes`, `displaySearchResults` | — | статич.×2 | — |
| `searchNodes` | function | 23505 | 26 | (query) | `philosopherOrder`×2, `nodes` | `handleLegendSearch`, `handleModalSearch` | — | — |
| `displaySearchResults` | function | 23532 | 19 | (results, container, context) | `philosopherConcepts` | `handleLegendSearch`, `handleModalSearch` | — | — |
| `selectSearchResult` | function | 23552 | 23 | (nodeId, context) | `selectedNodes`×2, `nodes`, `clearLegendSearch`, `clearModalSearch`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxZoom`, `highlightConnected`, `showDetailModal` | — | динам.×1 | — |
| `clearLegendSearch` | function | 23576 | 16 | () | — | `selectSearchResult` | статич.×1 | — |
| `handleModalSearch` | function | 23614 | 15 | (query) | `searchNodes`, `displaySearchResults` | — | динам.×2 | — |
| `clearModalSearch` | function | 23630 | 16 | () | — | `closeUniversalModal`×2, `selectSearchResult` | динам.×1 | — |
| `initializeCustomSelects` | function | 23654 | 16 | () | `populateCustomSelect`×2 | `stmt014` | — | — |
| `populateCustomSelect` | function | 23671 | 42 | (type, query=…) | `philosopherOrder`×2, `nodes`×2 | `initializeCustomSelects`×2, `showCustomSelectDropdown`, `filterCustomSelect` | — | — |
| `showCustomSelectDropdown` | function | 23714 | 10 | (type) | `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `filterCustomSelect` | function | 23725 | 11 | (type, query) | `populateCustomSelect` | — | статич.×2, динам.×1 | — |
| `selectCustomOption` | function | 23737 | 24 | (type, nodeId) | `renderComparison`×2, `nodes`, `_cmpA`, `_cmpB`, `selectedSourceNode`, `selectedTargetNode` | — | динам.×1 | — |
| `handleNodeClick` | function | 23796 | 116 | (event, d) | `lastClickedNode`×14, `selectedNodes`×13, `clickTimer`×12, `clickCount`×10, `editMode`×8, `gfxNode`×5, `selectedEdges`×2, `openEditConceptModal`×2, `isNodeConnectedToSelectedEdges`, `highlightCombined`, `canEdit`, `showDetailModal`, `openEditConnectionModal`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `handleLinkClick` | function | 23918 | 28 | (event, d) | `linkClickTimer`×5, `linkClickCount`×4, `handleLinkSelect`×2, `canEdit`, `openUniversalModal`, `openEditConnectionModal` | `initGraphEventHandlers` | — | — |
| `handleLinkSelect` | function | 23947 | 32 | (event, d) | `selectedEdges`×13, `selectedNodes`×2, `isEdgeConnectedToSelectedNodes`, `highlightCombined` | `handleLinkClick`×2 | — | — |
| `resizeCanvas` | function | 24017 | 11 | () | `gfxCanvas`×6, `dpr`×3, `viewWidth`×2, `viewHeight`×2, `pickCanvas`×2, `pickDirty`, `requestDraw` | `stmt016`, `stmt023` | — | — |
| `similarityColor` | function | 24061 | 9 | (t) | — | `renderScene` | — | — |
| `showSimilarityOverlay` | function | 24071 | 44 | (sourceId, kind) | `showTemporaryMessage`×2, `closeDetailModal`×2, `concepts`, `relations`, `nodes`, `_simCache`, `profileSimilarity`, `structuralSimilarity`, `initializePhilosophyMetrics`, `similarityOverlay`, `SIMILARITY_KEEP_QUANTILE`, `SIMILARITY_ARCS`, `updateSimilarityLegend`, `requestDraw` | `toggleSimilarityKind` | динам.×3 | — |
| `toggleSimilarityKind` | function | 24116 | 5 | () | `similarityOverlay`×3, `showSimilarityOverlay` | — | — | — |
| `clearSimilarityOverlay` | function | 24122 | 5 | () | `similarityOverlay`, `updateSimilarityLegend`, `requestDraw` | `afterDataChange` | динам.×1 | — |
| `updateSimilarityLegend` | function | 24128 | 35 | () | `similarityOverlay`×11, `nodes`, `SIMILARITY_ARCS` | `showSimilarityOverlay`, `clearSimilarityOverlay` | — | — |
| `nodeRadius` | function | 24167 | 1 | (d) | `renderState` | `exportToSVG`, `drawSelfLoop`, `renderScene`, `startRadiusAnimation`, `pickNode` | — | — |
| `nodeLabelDy` | function | 24168 | 1 | (d) | `renderState` | `exportToSVG`, `renderScene`, `startRadiusAnimation` | — | — |
| `hasNodeClass` | function | 24169 | 1 | (name, d) | `renderState` | `exportToSVG`×6, `renderScene`×6 | — | — |
| `hasLinkClass` | function | 24170 | 1 | (name, l) | `renderState` | `linkVisualState`×4 | — | — |
| `requestDraw` | function | 24174 | 5 | () | `drawScheduled`×3, `draw` | `subSelection`×2, `dispatchMove`×2, `stmt021`×2, `resizeCanvas`, `showSimilarityOverlay`, `clearSimilarityOverlay`, `makeClassed`, `gfxNode`, `gfxLink`, `gfxLinkAll`, `updateArrows`, `gfxZoom`, `stmt015`, `stmt017`, `dispatchClick`, `initGraphEventHandlers`, `updateGraphData`, `updateNodeOnGraph`, `updateLinkOnGraph` | — | — |
| `graphIsCovered` | function | 24190 | 10 | () | `isStatsModalOpen`×2 | `needsContinuousAnimation` | — | — |
| `needsContinuousAnimation` | function | 24201 | 9 | () | `renderState`×2, `links`, `isLinkVisible`, `graphIsCovered` | `closeStatsModal`×2, `unfreezeSimulation`×2, `ensureAnimLoop`, `draw` | — | — |
| `ensureAnimLoop` | function | 24210 | 9 | () | `animLoopRunning`×3, `draw`×2, `needsContinuousAnimation` | `closeStatsModal`×2, `unfreezeSimulation`×2, `draw`, `startRadiusAnimation` | — | — |
| `linkStrokeWidth` | function | 24221 | 4 | (d) | `renderState` | `arrowPoints`, `arrowPointsStart`, `linkDrawWidth` | — | — |
| `linkHoverStrokeWidth` | function | 24225 | 4 | (d) | `renderState` | `linkDrawWidth`, `renderScene` | — | — |
| `arcParams` | function | 24231 | 15 | (s, t) | — | `arrowPoints`, `arrowPointsStart`, `strokeLink`, `renderScene` | — | — |
| `arrowPoints` | function | 24248 | 26 | (d, swOverride) | `arrowRadius`×2, `arrowMode`, `linkStrokeWidth`, `arcParams` | `exportToSVG`, `fillArrow` | — | — |
| `arrowPointsStart` | function | 24278 | 28 | (d, swOverride) | `arrowRadius`×2, `arrowMode`, `linkStrokeWidth`, `arcParams` | `exportToSVG`, `fillArrow` | — | — |
| `linkHasTwoHeads` | function | 24309 | 5 | (l) | `relationTypesObj` | `exportToSVG`, `fillArrow` | — | — |
| `linkVisualState` | function | 24317 | 7 | (l) | `hasLinkClass`×4, `selectedEdges` | `exportToSVG`, `renderScene`, `repaintPickCanvas` | — | — |
| `linkDrawWidth` | function | 24325 | 8 | (l, state) | `renderState`×2, `linkStrokeWidth`, `linkHoverStrokeWidth` | `exportToSVG`, `renderScene`, `repaintPickCanvas` | — | — |
| `linkDrawAlpha` | function | 24334 | 7 | (l, state, tms) | `renderState` | `renderScene`×2, `exportToSVG` | — | — |
| `strokeLink` | function | 24342 | 8 | (c, l, width) | `arcParams` | `renderScene`, `repaintPickCanvas` | — | — |
| `drawSelfLoop` | function | 24354 | 27 | (c, l, sw, col, alpha) | `nodeRadius` | `renderScene`, `repaintPickCanvas` | — | — |
| `fillArrow` | function | 24382 | 13 | (c, l, sw) | `arrowPoints`, `arrowPointsStart`, `linkHasTwoHeads` | `renderScene`, `repaintPickCanvas` | — | — |
| `renderScene` | function | 24398 | 145 | (c, opts) | `similarityOverlay`×15, `hasNodeClass`×6, `relationTypesObj`×4, `nodes`×4, `isNodeVisible`×3, `renderState`×3, `linkDrawAlpha`×2, `selectedNodes`×2, `philosopherConcepts`, `links`, `isLinkVisible`, `isReflexiveLink`, `similarityColor`, `LABEL_HIDE_BELOW`, `LABEL_ALL_ABOVE`, `nodeRadius`, `nodeLabelDy`, `linkHoverStrokeWidth`, `arcParams`, `linkVisualState`, `linkDrawWidth`, `strokeLink`, `drawSelfLoop`, `fillArrow`, `DRAW_ORDER` | `exportToPNG`, `draw` | — | — |
| `draw` | function | 24544 | 10 | () | `ctx`×4, `dpr`×4, `gfxCanvas`×2, `pickDirty`, `renderState`, `needsContinuousAnimation`, `ensureAnimLoop`, `renderScene`, `stepRadiusAnimation` | `ensureAnimLoop`×2, `requestDraw` | — | — |
| `startRadiusAnimation` | function | 24556 | 6 | (toRadius, toDy, dur) | `nodes`, `renderState`, `nodeRadius`, `nodeLabelDy`, `ensureAnimLoop` | `subSelection` | — | — |
| `stepRadiusAnimation` | function | 24562 | 13 | () | `renderState`×4, `nodes` | `draw` | — | — |
| `rebuildQuadtree` | function | 24578 | 5 | () | `nodes`, `isNodeVisible`, `quadtree` | `pickNode`, `stmt015`, `stmt017`, `updateGraphData` | — | — |
| `toGraph` | function | 24584 | 4 | (clientX, clientY) | `gfxCanvas`, `renderState` | `dispatchClick`×2, `dispatchMove` | — | — |
| `pickNode` | function | 24589 | 9 | (gx, gy) | `quadtree`×2, `renderState`, `nodeRadius`, `rebuildQuadtree` | `dispatchClick`×2, `stmt015`, `dispatchMove` | — | — |
| `repaintPickCanvas` | function | 24599 | 30 | () | `pickCtx`×13, `dpr`×4, `links`×2, `pickCanvas`×2, `isLinkVisible`, `isReflexiveLink`, `pickDirty`, `PICK_LINK_WIDTH`, `renderState`, `linkVisualState`, `linkDrawWidth`, `strokeLink`, `drawSelfLoop`, `fillArrow` | `pickLink` | — | — |
| `pickLink` | function | 24630 | 12 | (clientX, clientY) | `links`×2, `pickCanvas`×2, `dpr`×2, `gfxCanvas`, `pickCtx`, `pickDirty`, `repaintPickCanvas` | `dispatchMove`, `dispatchClick` | — | — |
| `makeClassed` | function | 24648 | 15 | (kind) | `nodes`×2, `links`×2, `renderState`×2, `requestDraw` | `gfxNode`, `gfxLink` | — | — |
| `subSelection` | function | 24664 | 23 | (kind, what) | `renderState`×5, `nodes`×3, `requestDraw`×2, `startRadiusAnimation` | `gfxNode` | — | — |
| `updateArrows` | function | 24715 | 1 | () | `requestDraw` | `toggleUniformLinkWidth`, `visualizeMetricBySize`, `resetNodeSizes` | — | — |
| `dispatchMove` | function | 24825 | 30 | (event) | `linkHandlers`×6, `nodeHandlers`×4, `lastHoverNode`×4, `lastHoverLink`×4, `renderState`×2, `requestDraw`×2, `gfxCanvas`, `toGraph`, `pickNode`, `pickLink` | `initGraphEventHandlers` | — | — |
| `dispatchClick` | function | 24856 | 26 | (event) | `toGraph`×2, `pickNode`×2, `nodeHandlers`×2, `linkHandlers`×2, `editMode`, `requestDraw`, `pickLink`, `resetHighlight`, `canEdit`, `openEditConceptModal`, `cancelGraphSelection`, `handleConceptSelection` | `initGraphEventHandlers` | — | — |
| `initGraphEventHandlers` | function | 24883 | 13 | () | `gfxCanvas`×3, `lastHoverNode`×3, `lastHoverLink`×3, `renderState`×2, `nodeHandlers`×2, `linkHandlers`×2, `handleNodeClick`, `handleLinkClick`, `requestDraw`, `gfxNode`, `gfxLink`, `dispatchMove`, `dispatchClick` | `stmt019` | — | — |
| `isEdgeConnectedToNode` | function | 24900 | 5 | (edge, nodeData) | — | `isNodeConnectedToSelectedEdges`, `isEdgeConnectedToSelectedNodes` | — | — |
| `isNodeConnectedToSelectedEdges` | function | 24907 | 8 | (nodeData) | `selectedEdges`, `isEdgeConnectedToNode` | `handleNodeClick` | — | — |
| `isEdgeConnectedToSelectedNodes` | function | 24917 | 8 | (edge) | `selectedNodes`, `isEdgeConnectedToNode` | `handleLinkSelect` | — | — |
| `highlightCombined` | function | 24927 | 91 | () | `selectedNodes`×6, `selectedEdges`×5, `links`×2, `gfxNode`, `gfxLinkAll`, `resetHighlight` | `handleNodeClick`, `handleLinkSelect` | — | — |
| `highlightConnected` | function | 25020 | 34 | (selectedDataArray) | `links`, `gfxNode`, `gfxLinkAll` | `cleanupInvisibleSelections`, `highlightNodeById`, `selectSearchResult`, `gotoNodeFromModal` | — | — |
| `resetHighlight` | function | 25056 | 11 | () | `gfxNode`, `gfxLinkAll`, `selectedNodes`, `selectedEdges` | `findAndShowPath`, `highlightPath`, `clearPathHighlight`, `cleanupInvisibleSelections`, `dispatchClick`, `highlightCombined`, `resetSimulation`, `toggleGrouping` | — | — |
| `dragstarted` | function | 25227 | 8 | (event, d) | `simulation`, `tickCount` | `stmt015` | — | — |
| `dragended` | function | 25237 | 5 | (event, d) | `simulation` | `stmt015` | — | — |
| `resetSimulation` | function | 25243 | 9 | () | `nodes`, `simulation`, `tickCount`, `resetHighlight` | — | статич.×1 | — |
| `toggleSimulationFreeze` | function | 25256 | 11 | () | `замокРаскладки`×2, `showTemporaryMessage`, `simulation`, `tickCount`, `maxTicks`, `обновитьКнопкуЗаморозки`, `freezeSimulation`, `unfreezeSimulation` | — | статич.×1 | — |
| `обновитьКнопкуЗаморозки` | function | 25268 | 9 | () | `замокРаскладки`×3 | `toggleSimulationFreeze` | — | — |
| `centerGraph` | function | 25278 | 9 | () | `simulation`×2, `gfxSvg`, `gfxZoom`, `tickCount` | — | статич.×1 | — |
| `freezeSimulation` | function | 25291 | 4 | (источник) | `simulation`×2, `замокРаскладки` | `showPathDescriptionsModal`, `openStatsModal`, `toggleSimulationFreeze`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `openUniversalModal` | — | — |
| `unfreezeSimulation` | function | 25296 | 17 | (источник) | `needsContinuousAnimation`×2, `ensureAnimLoop`×2, `simulation`×2, `tickCount`, `maxTicks`, `замокРаскладки` | `closePathDescriptionsModal`, `closeStatsModal`, `toggleSimulationFreeze`, `closeConceptProfileModal`, `closePhilosopherProfileModal`, `closeUniversalModal` | — | — |
| `togglePanel` | function | 25334 | 20 | (panelId) | — | — | статич.×1 | — |
| `restorePanelStates` | function | 25356 | 14 | () | — | `stmt036` | — | — |
| `toggleGrouping` | function | 25371 | 31 | () | `simulation`×3, `isGrouped`×3, `groupPositions`×2, `tickCount`, `resetHighlight` | — | статич.×1 | — |
| `openConceptById` | function | 25435 | 4 | (conceptId) | `nodes`, `showDetailModal` | — | динам.×1 | — |
| `similarConceptsBlock` | function | 25440 | 58 | (conceptId) | `nearestConcepts`×2, `nodes`, `medianNodeDegree`, `nodeDegreeOf` | `generateConceptViewContent` | — | — |
| `metricPercentile` | function | 25527 | 11 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `metricRank` | function | 25543 | 15 | (fn, conceptId, value) | `_concepts` | `showConceptProfileModal` | — | — |
| `toggleProfileOrder` | function | 25562 | 4 | (conceptId) | `profileOrderMode`×2, `showConceptProfileModal` | — | динам.×1 | — |
| `metricPartsText` | function | 25568 | 16 | (res) | — | `showConceptProfileModal` | — | — |
| `conceptDegreesDetailed` | function | 25585 | 11 | (conceptId) | `links` | `showConceptProfileModal` | — | — |
| `showConceptProfileModal` | function | 25597 | 74 | (conceptId) | `philosopherConcepts`×2, `profileOrderMode`×2, `concepts`, `relations`, `nodes`, `metricsScope`, `metricsScopeCounts`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `metricPercentile`, `metricRank`, `metricPartsText`, `conceptDegreesDetailed` | `toggleProfileOrder` | динам.×2 | — |
| `closeConceptProfileModal` | function | 25672 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×3 | — |
| `showPhilosopherProfileModal` | function | 25681 | 98 | (philosopherName) | `philosopherConcepts`×2, `_concepts`×2, `philosopherSystematicIndex`×2, `philosopherHistoricalReachIndex`×2, `philosopherInterdisciplinaryIndex`×2, `philosophers`, `rubrics`, `concepts`, `relations`, `nodes`, `metricsScope`, `initializePhilosophyMetrics`, `getContrastColor`, `METRIC_COVERAGE_WARN`, `metricCoverage`, `freezeSimulation`, `PROFILE_METRICS`, `profileOrderMode` | — | динам.×2 | — |
| `closePhilosopherProfileModal` | function | 25780 | 8 | () | `unfreezeSimulation` | `closeAllModals`×2 | статич.×1, динам.×1 | — |
| `pushModalState` | function | 25811 | 14 | () | `modalStack`×5, `ModalContext`×4, `MODAL_STACK_MAX` | `openUniversalModal` | — | — |
| `popModalState` | function | 25826 | 10 | () | `ModalContext`, `modalStack`, `openUniversalModal`, `hasUnsavedChanges` | `stmt030` | динам.×1 | — |
| `modalEntityExists` | function | 25846 | 13 | (entityType, data) | — | `saveConnectionData`×2, `openUniversalModal`, `hasUnsavedChanges`, `savePhilosopherData`, `saveConceptData` | — | — |
| `modalContentFor` | function | 25864 | 18 | (entityType, data, mode) | — | `openUniversalModal` | — | — |
| `canEdit` | function | 25908 | 3 | () | `authSession`×2 | `makeLegendsEditable`×3, `handleNodeClick`, `handleLinkClick`, `dispatchClick`, `refreshEditHints`, `openUniversalModal`, `toggleModalMode`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal` | — | — |
| `authModalEl` | function | 25914 | 1 | () | — | `openAuthModal`, `closeAuthModal`, `showAuthNotice` | — | — |
| `openAuthModal` | function | 25916 | 29 | (kind) | `authModalKind`, `authModalEl`, `submitAuth` | — | динам.×2 | — |
| `closeAuthModal` | function | 25946 | 10 | () | `authModalEl` | — | динам.×2 | — |
| `authError` | function | 25957 | 4 | (text) | — | `submitAuth`×5 | — | 1× (строка) в `authError` |
| `showAuthNotice` | function | 25964 | 14 | (title, bodyHtml) | `authModalKind`, `authModalEl` | `authNoticeMember`, `authNoticeAdmin` | — | — |
| `authNoticeMember` | function | 25979 | 6 | (login) | `showAuthNotice` | `submitAuth`×2 | — | — |
| `authNoticeAdmin` | function | 25986 | 13 | () | `showAuthNotice` | `submitAuth` | — | — |
| `submitAuth` | function | 26002 | 42 | () | `authError`×5, `authAccounts`×4, `AUTH_ADMIN`×3, `authSession`×3, `renderAuthControls`×3, `refreshEditHints`×3, `authNoticeMember`×2, `authModalKind`, `authNoticeAdmin`, `refreshOpenModalToolbar` | `openAuthModal` | динам.×1 | — |
| `authLogout` | function | 26045 | 24 | () | `ModalContext`×2, `authSession`, `refreshOpenModalToolbar`, `renderAuthControls`, `refreshEditHints`, `toggleModalMode` | — | динам.×1 | — |
| `refreshOpenModalToolbar` | function | 26072 | 9 | () | `ModalContext`×4, `openUniversalModal` | `submitAuth`, `authLogout` | — | — |
| `renderAuthControls` | function | 26084 | 15 | () | `authSession` | `submitAuth`×3, `authLogout`, `stmt028` | — | — |
| `refreshEditHints` | function | 26105 | 15 | () | `canEdit` | `submitAuth`×3, `authLogout`, `makeLegendsEditable` | — | — |
| `openUniversalModal` | function | 26121 | 64 | (entityType, data, mode=…, opts=…) | `ModalContext`×3, `initConnectionSearchFields`×2, `freezeSimulation`, `modalStack`, `pushModalState`, `modalEntityExists`, `modalContentFor`, `canEdit` | `saveConceptData`×2, `saveConnectionData`×2, `handleLinkClick`, `popModalState`, `refreshOpenModalToolbar`, `toggleModalMode`, `showDetailModal`, `showPhilosopherDetailModal`, `openEditPhilosopherModal`, `openEditConceptModal`, `openEditConnectionModal`, `savePhilosopherData`, `deleteConnection`, `createNewConceptForPhilosopher`, `createNewConnectionForConcept` | динам.×19 | — |
| `closeUniversalModal` | function | 26187 | 27 | () | `ModalContext`×4, `clearModalSearch`×2, `cancelGraphSelection`×2, `unfreezeSimulation`, `modalStack` | `closeAllModals`×2, `closeDetailModal`, `closePhilosopherDetailModal`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | статич.×1, динам.×3 | — |
| `toggleModalMode` | function | 26216 | 17 | () | `ModalContext`×5, `canEdit`, `openUniversalModal`, `hasUnsavedChanges` | `authLogout` | динам.×1 | — |
| `hasUnsavedChanges` | function | 26235 | 20 | () | `ModalContext`×3, `modalEntityExists`, `hasFilledFields`, `hasPhilosopherChanges`, `hasConceptChanges`, `hasConnectionChanges` | `popModalState`, `toggleModalMode` | — | — |
| `hasFilledFields` | function | 26256 | 10 | () | — | `hasUnsavedChanges` | — | — |
| `hasPhilosopherChanges` | function | 26267 | 22 | (original) | `philosophers` | `hasUnsavedChanges` | — | — |
| `hasConceptChanges` | function | 26290 | 19 | (original) | `conceptToRubrics` | `hasUnsavedChanges` | — | — |
| `hasConnectionChanges` | function | 26310 | 27 | (original) | `ModalContext`×2, `relationTypesObj` | `hasUnsavedChanges` | — | — |
| `generateId` | function | 26339 | 3 | (prefix=…) | — | `savePhilosopherData`, `saveConceptData` | — | — |
| `findConnection` | function | 26343 | 9 | (sourceId, targetId, bidirectional=…) | `links` | `deleteConnection`×3, `openEditConnectionModal`, `saveConnectionData` | динам.×1 | — |
| `getConceptConnections` | function | 26353 | 7 | (conceptId) | `links` | `isConceptIsolated`, `getIsolatedConceptsAfterDeletion`, `deletePhilosopher`, `deleteConcept`, `deleteConnection`, `generateConceptEditContent` | — | — |
| `isConceptIsolated` | function | 26361 | 3 | (conceptId) | `getConceptConnections` | `conceptIntegrityWarnings` | — | — |
| `getIsolatedConceptsAfterDeletion` | function | 26368 | 15 | (philosopherName) | `nodes`, `getConceptConnections` | `deletePhilosopher` | — | — |
| `showDetailModal` | function | 26389 | 3 | (conceptData) | `openUniversalModal` | `selectSearchResult`, `handleNodeClick`, `openConceptById` | — | — |
| `showPhilosopherDetailModal` | function | 26393 | 3 | (philosopherName) | `openUniversalModal` | `makeLegendsEditable` | динам.×1 | — |
| `closeDetailModal` | function | 26397 | 1 | () | `closeUniversalModal` | `showSimilarityOverlay`×2, `closeAllModals`×2, `gotoNodeFromModal` | — | — |
| `closePhilosopherDetailModal` | function | 26398 | 1 | () | `closeUniversalModal` | `closeAllModals`×2 | — | — |
| `openEditPhilosopherModal` | function | 26400 | 4 | (philosopherName=…) | `canEdit`, `openUniversalModal` | `makeLegendsEditable`×2 | — | — |
| `openEditConceptModal` | function | 26405 | 6 | (concept=…) | `nodes`, `canEdit`, `openUniversalModal` | `handleNodeClick`×2, `dispatchClick` | динам.×1 | — |
| `openEditConnectionModal` | function | 26412 | 6 | (a=…, b=…) | `canEdit`, `openUniversalModal`, `findConnection` | `handleNodeClick`, `handleLinkClick` | динам.×1 | — |
| `updateGraphData` | function | 26437 | 13 | () | `simulation`×3, `nodes`, `links`, `pickDirty`, `requestDraw`, `rebuildQuadtree` | `addNodeToGraph`, `addLinkToGraph`, `afterDataChange` | — | — |
| `addNodeToGraph` | function | 26451 | 15 | (nodeData) | `updateFilterStats`, `viewWidth`, `viewHeight`, `renderState`, `pinnedVisibleNodes`, `updateGraphData` | `saveConceptData` | — | — |
| `updateNodeOnGraph` | function | 26469 | 3 | () | `requestDraw` | `saveConceptData` | — | — |
| `addLinkToGraph` | function | 26473 | 11 | (linkData) | `nodes`×2, `updateFilterStats`, `updateGraphData` | `saveConnectionData` | — | — |
| `updateLinkOnGraph` | function | 26485 | 5 | () | `pickDirty`, `requestDraw` | `saveConnectionData` | — | — |
| `forgetNode` | function | 26496 | 18 | (nodeId) | `renderState`×6, `similarityOverlay`×3, `visibleNodeIds`×2, `selectedNodes`×2, `pinnedVisibleNodes` | `removeConceptEverywhere` | — | — |
| `forgetLink` | function | 26515 | 8 | (link) | `renderState`×3, `visibleLinkSet`×2, `selectedEdges` | `removeLinkEverywhere` | — | — |
| `rebuildDerivedIndexes` | function | 26528 | 36 | (what) | `philosopherIdToName`×3, `philosopherConcepts`×3, `philosopherOrder`×3, `linkColors`×3, `conceptToRubrics`×3, `rubricsObj`×3, `concepts`×2, `philosophers`, `rubrics`, `relationTypes`, `rebuildPhilosopherTraditions` | `afterDataChange` | — | — |
| `пометитьИзменение` | function | 26582 | 1 | () | `естьНесохранённое` | `afterDataChange` | — | — |
| `естьПравки` | function | 26583 | 1 | () | `естьНесохранённое` | — | — | — |
| `собратьБазу` | function | 26585 | 3 | () | `traditions`, `philosophers`, `rubrics`, `relationTypes`, `concepts`, `relations` | `скачатьБазу`, `сохранитьВПапку` | — | — |
| `отдатьФайл` | function | 26589 | 11 | (имя, текст) | — | `скачатьБазу` | — | — |
| `скачатьБазу` | function | 26601 | 6 | () | `НАБОРЫ_БАЗЫ`×2, `естьНесохранённое`, `собратьБазу`, `отдатьФайл` | — | — | — |
| `сохранитьВПапку` | async function | 26610 | 23 | () | `папкаБазы`×3, `НАБОРЫ_БАЗЫ`, `естьНесохранённое`, `собратьБазу` | — | — | — |
| `afterDataChange` | function | 26641 | 41 | (what) | `selectedPhilosophers`×2, `currentStatsView`×2, `similarityOverlay`×2, `modalStack`×2, `philosopherConcepts`, `applyFiltersImmediate`, `initFilters`, `invalidateEverythingForScope`, `initializePhilosophyMetrics`, `isStatsModalOpen`, `loadStatsContent`, `clearSimilarityOverlay`, `updateGraphData`, `rebuildDerivedIndexes`, `пометитьИзменение`, `makeLegendsEditable` | `saveConceptData`×2, `saveConnectionData`×2, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `selectConceptOnGraph` | function | 26700 | 28 | (type, mode=…) | `gfxCanvas` | `initConnectionSearchFields`×2 | — | — |
| `cancelGraphSelection` | function | 26729 | 11 | () | `gfxCanvas` | `closeUniversalModal`×2, `stmt030`×2, `dispatchClick`, `handleConceptSelection` | динам.×1 | — |
| `handleConceptSelection` | function | 26746 | 14 | (conceptId) | `selectConnectionEditConcept`×2, `selectConnectionViewConcept`×2, `cancelGraphSelection` | `handleNodeClick`, `dispatchClick` | — | — |
| `escapeAttr` | function | 26774 | 4 | (s) | — | `generatePhilosopherEditContent`×3, `generateConceptEditContent`×3, `generateConnectionEditContent` | динам.×1 | — |
| `relationIndexOf` | function | 26788 | 4 | (srcId, tgtId, type) | `relations` | `removeLinkEverywhere`, `saveConnectionData` | — | — |
| `activityOverlap` | function | 26796 | 12 | (nameA, nameB) | `philosophers`×2 | `connectionIntegrityWarnings` | — | — |
| `groundingCyclePath` | function | 26814 | 37 | (srcId, tgtId, extraType) | `relationTypesObj`×2, `GROUNDING_TYPES`×2, `links` | `connectionIntegrityWarnings` | — | — |
| `pluralRu` | function | 26855 | 7 | (count, one, few, many) | — | `nConcepts`, `nLinks` | — | — |
| `nConcepts` | const-функция | 26862 | 1 | (n) | `pluralRu` | `philosopherIntegrityWarnings`, `deletePhilosopher` | — | — |
| `nLinks` | const-функция | 26863 | 1 | (n) | `pluralRu` | `deleteConcept` | — | — |
| `labelOf` | const-функция | 26865 | 4 | (id) | `nodes` | `connectionIntegrityWarnings` | — | — |
| `connectionIntegrityWarnings` | function | 26874 | 138 | (srcId, tgtId, type, weight, bidir, original) | `links`×4, `nodes`×2, `philosopherBirth`×2, `philosopherYears`×2, `relationTypesObj`, `isReflexiveLink`, `activityOverlap`, `groundingCyclePath`, `labelOf` | `saveConnectionData` | — | — |
| `conceptIntegrityWarnings` | function | 27013 | 18 | (label, philosopher, original) | `nodes`, `isConceptIsolated` | `saveConceptData` | — | — |
| `philosopherIntegrityWarnings` | function | 27032 | 16 | (name, birth, death, original) | `nodes`, `nConcepts` | `savePhilosopherData` | — | — |
| `confirmWarnings` | function | 27050 | 5 | (title, warnings) | — | `savePhilosopherData`, `saveConceptData`, `saveConnectionData` | — | — |
| `savePhilosopherData` | function | 27060 | 82 | () | `philosophers`×7, `selectedPhilosophers`×3, `concepts`, `nodes`, `ModalContext`, `modalEntityExists`, `openUniversalModal`, `generateId`, `afterDataChange`, `philosopherIntegrityWarnings`, `confirmWarnings` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `deletePhilosopher` | function | 27143 | 37 | (philosopherName) | `philosophers`×3, `philosopherConcepts`, `philosopherOrder`, `nodes`, `selectedPhilosophers`, `ModalContext`, `closeUniversalModal`, `getConceptConnections`, `getIsolatedConceptsAfterDeletion`, `afterDataChange`, `nConcepts`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | — | 1× (строка) в `generatePhilosopherEditContent` |
| `removeConceptEverywhere` | function | 27187 | 8 | (conceptId) | `concepts`×2, `nodes`×2, `conceptToRubrics`, `forgetNode` | `deletePhilosopher`, `deleteConcept` | — | — |
| `removeLinkEverywhere` | function | 27196 | 9 | (link) | `links`×2, `relations`, `forgetLink`, `relationIndexOf` | `deletePhilosopher`, `deleteConcept`, `deleteConnection` | — | — |
| `saveConceptData` | function | 27206 | 57 | () | `nodes`×5, `concepts`×4, `conceptToRubrics`×2, `openUniversalModal`×2, `afterDataChange`×2, `philosophers`, `ModalContext`, `modalEntityExists`, `generateId`, `addNodeToGraph`, `updateNodeOnGraph`, `conceptIntegrityWarnings`, `confirmWarnings` | — | — | 1× (строка) в `generateConceptEditContent` |
| `deleteConcept` | function | 27264 | 19 | (conceptId) | `ModalContext`×2, `nodes`, `closeUniversalModal`, `getConceptConnections`, `afterDataChange`, `nLinks`, `removeConceptEverywhere`, `removeLinkEverywhere` | — | — | 1× (строка) в `generateConceptEditContent` |
| `saveConnectionData` | function | 27288 | 71 | () | `ModalContext`×6, `relations`×4, `nodes`×2, `links`×2, `modalEntityExists`×2, `openUniversalModal`×2, `afterDataChange`×2, `relationTypesObj`, `findConnection`, `addLinkToGraph`, `updateLinkOnGraph`, `relationIndexOf`, `connectionIntegrityWarnings`, `confirmWarnings` | — | — | 1× (строка) в `generateConnectionEditContent` |
| `deleteConnection` | function | 27360 | 45 | (sourceId=…, targetId=…) | `ModalContext`×6, `nodes`×3, `findConnection`×3, `relationTypesObj`, `links`, `isReflexiveLink`, `openUniversalModal`, `closeUniversalModal`, `getConceptConnections`, `afterDataChange`, `removeLinkEverywhere` | — | динам.×1 | 1× (строка) в `generateConnectionEditContent` |
| `modalActions` | function | 27408 | 15 | (saveFn, deleteFn, deleteArg, isNew) | — | `generatePhilosopherEditContent`, `generateConceptEditContent`, `generateConnectionEditContent` | — | — |
| `updatePhilColorSample` | function | 27428 | 17 | () | `getContrastColor` | `syncPhilColorFromPicker`, `generatePhilosopherEditContent` | динам.×2 | — |
| `syncPhilColorFromPicker` | function | 27446 | 6 | () | `updatePhilColorSample` | — | динам.×1 | — |
| `generatePhilosopherEditContent` | function | 27453 | 113 | (philosopherName) | `escapeAttr`×3, `traditions`, `philosophers`, `nodes`, `modalActions`, `updatePhilColorSample` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 27571 | 132 | (conceptData) | `philosopherConcepts`×3, `escapeAttr`×3, `relationHint`×2, `rubrics`, `relationTypesObj`, `nodes`, `conceptToRubrics`, `isReflexiveLink`, `sortPhilosophersByBirth`, `philosopherYears`, `getConceptConnections`, `modalActions` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `onConnTypeChange` | function | 27711 | 37 | () | `relationTypesObj`, `links`, `updateConnEditPairNote` | `generateConnectionEditContent` | динам.×1 | — |
| `updateConnEditPairNote` | function | 27750 | 25 | () | `ModalContext`×2, `links`, `isReflexiveLink`, `connectionsBetween` | `onConnTypeChange`, `selectConnectionEditConcept`, `swapConnectionConcepts` | — | — |
| `connEditSelectedBlock` | function | 27776 | 9 | (type, node) | — | `generateConnectionEditContent`×2 | — | — |
| `generateConnectionEditContent` | function | 27786 | 96 | (connectionData) | `nodes`×2, `relationHint`×2, `ModalContext`×2, `connEditSelectedBlock`×2, `relationTypesObj`, `WEIGHT_OPTIONS`, `escapeAttr`, `modalActions`, `onConnTypeChange`, `setupConnectionEditSearchHandlers` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `handleConnectionEditSearch` | function | 27887 | 42 | (type, query) | `philosopherConcepts`×2, `philosopherOrder`×2, `nodes`, `ModalContext`, `connectionsBetween` | `setupConnectionEditSearchHandlers` | — | — |
| `selectConnectionEditConcept` | function | 27930 | 18 | (type, conceptId) | `nodes`, `ModalContext`, `updateConnEditPairNote` | `handleConceptSelection`×2 | динам.×1 | — |
| `setupConnectionEditSearchHandlers` | function | 27949 | 13 | () | `initConnectionSearchFields`×2, `handleConnectionEditSearch` | `generateConnectionEditContent` | — | — |
| `swapConnectionConcepts` | function | 27963 | 20 | () | `ModalContext`×5, `nodes`, `updateConnEditPairNote` | — | динам.×1 | — |
| `createNewConceptForPhilosopher` | function | 27985 | 3 | (philosopherName) | `openUniversalModal` | — | динам.×1 | — |
| `createNewConnectionForConcept` | function | 27989 | 7 | (conceptId) | `nodes`, `openUniversalModal` | — | динам.×1 | — |
| `connectionsBetween` | function | 28008 | 8 | (sourceId, targetId) | `links` | `updateConnEditPairNote`, `handleConnectionEditSearch`, `generateConnectionVisualization`, `updateConnectionVisualization` | — | — |
| `conceptCircle` | function | 28017 | 6 | (node, size) | `philosopherConcepts`×2 | `conceptPlate` | — | — |
| `conceptPlate` | function | 28024 | 16 | (node) | `philosopherConcepts`×2, `getContrastColor`, `conceptCircle` | `generateConnectionVisualization`×3 | — | — |
| `connectionTraditionNote` | function | 28048 | 13 | (aPhil, bPhil) | `philosopherTraditions`×2, `traditionsOfPhilosopher`×2, `traditions` | `generateConnectionVisualization` | — | — |
| `connectionArrowSvg` | function | 28063 | 60 | (conn, index) | `relationTypesObj`, `isReflexiveLink` | `generateConnectionVisualization` | — | — |
| `generateConnectionVisualization` | function | 28124 | 75 | (sourceNode, targetNode, connectionData) | `conceptPlate`×3, `relationHint`×2, `relationTypesObj`, `isReflexiveLink`, `CONN_WEIGHT_WORDS`, `connectionsBetween`, `connectionTraditionNote`, `connectionArrowSvg` | `generateConnectionViewContent`, `updateConnectionVisualization` | — | — |
| `generateConnectionViewContent` | function | 28200 | 81 | (connectionData) | `nodes`×2, `ModalContext`×2, `generateConnectionVisualization` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionSearchSection` | function | 28293 | 8 | () | — | — | динам.×1 | — |
| `handleConnectionViewSearch` | function | 28313 | 60 | (type, query) | `philosopherConcepts`×2, `philosopherOrder`×2, `nodes`×2, `links`, `ModalContext` | — | динам.×2 | — |
| `selectConnectionViewConcept` | function | 28374 | 33 | (type, conceptId) | `ModalContext`×3, `nodes`, `updateConnectionVisualization` | `handleConceptSelection`×2 | динам.×1 | — |
| `updateConnectionVisualization` | function | 28408 | 18 | () | `nodes`×2, `ModalContext`, `connectionsBetween`, `generateConnectionVisualization` | `selectConnectionViewConcept` | — | — |
| `initConnectionSearchFields` | function | 28430 | 18 | (mode=…) | `selectConceptOnGraph`×2 | `openUniversalModal`×2, `setupConnectionEditSearchHandlers`×2 | — | — |
| `generateConceptViewContent` | function | 28454 | 264 | (conceptData) | `philosopherConcepts`×5, `relationTypesObj`×4, `nodes`×2, `conceptToRubrics`×2, `WEIGHT_WORDS`×2, `rubrics`, `links`, `getContrastColor`, `similarConceptsBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `toggleConnectionDescription` | function | 28720 | 12 | (id) | — | — | динам.×4 | — |
| `toggleAllRoot` | function | 28736 | 7 | (btn) | — | `toggleAllConnectionDescriptions`, `toggleAllPhilosopherConceptDescriptions`, `toggleAllPhilosopherConnectionDescriptions` | — | — |
| `toggleAllConnectionDescriptions` | function | 28747 | 37 | (btn) | `allDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleSubsection` | function | 28786 | 14 | (sectionId) | — | — | динам.×4 | — |
| `gotoNodeFromModal` | function | 28802 | 23 | (nodeId) | `selectedNodes`×2, `nodes`, `viewWidth`, `viewHeight`, `gfxSvg`, `gfxNode`, `gfxZoom`, `highlightConnected`, `closeDetailModal` | — | динам.×1 | — |
| `showAllConcepts` | function | 28827 | 28 | (rubricId, currentConceptId) | `rubrics`, `philosopherConcepts`, `nodes`, `conceptToRubrics` | — | динам.×1 | — |
| `conjugateVerb` | function | 28858 | 9 | (count, singularForm) | — | `generatePhilosopherViewContent`×5 | — | — |
| `declinePhilosopher` | function | 28869 | 26 | (count, grammaticalCase) | — | `generatePhilosopherViewContent`×22 | — | — |
| `similarPhilosophersBlock` | function | 28900 | 31 | (philosopherName) | `nearestPhilosophers`×3 | `generatePhilosopherViewContent` | — | — |
| `generatePhilosopherViewContent` | function | 28936 | 449 | (philosopherName) | `declinePhilosopher`×22, `nodes`×9, `relationTypesObj`×5, `conjugateVerb`×5, `getContrastColor`×4, `philosopherConcepts`×3, `philosopherBirth`×3, `formatBirthYear`×3, `sortPhilosophersByBirth`×3, `philosopherYears`×3, `links`×2, `WEIGHT_WORDS`×2, `traditions`, `philosophers`, `rubrics`, `conceptToRubrics`, `similarPhilosophersBlock` | — | — | вероятно через `window[…]` в `modalContentFor` |
| `togglePhilosopherConceptDescription` | function | 29387 | 12 | (conceptId) | — | — | динам.×1 | — |
| `toggleAllPhilosopherConceptDescriptions` | function | 29403 | 32 | (btn) | `allPhilosopherConceptDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `toggleAllPhilosopherConnectionDescriptions` | function | 29439 | 31 | (btn) | `allPhilosopherConnectionDescriptionsExpanded`×4, `toggleAllRoot` | — | динам.×1 | — |
| `makeLegendsEditable` | function | 29471 | 56 | () | `canEdit`×3, `openEditPhilosopherModal`×2, `refreshEditHints`, `showPhilosopherDetailModal` | `afterDataChange`, `stmt027` | — | — |
| `closeAllModals` | function | 29537 | 8 | () | `closePathDescriptionsModal`×2, `closeConceptProfileModal`×2, `closePhilosopherProfileModal`×2, `closeUniversalModal`×2, `closeDetailModal`×2, `closePhilosopherDetailModal`×2 | `stmt029`, `stmt030` | — | — |


## 2. Глобальные константы и переменные

| Имя | Вид | Стр. | Значение | Использует | Используется в |
|---|---|---|---|---|---|
| `traditions` | const | 4754 | массив (22) | — | `selectAllTraditions`×2, `selectedTraditions`, `traditionsOfPhilosopher`, `analyzePathTraditions`, `initFilters`, `deselectAllTraditions`, `собратьБазу`, `generatePhilosopherEditContent`, `connectionTraditionNote`, `generatePhilosopherViewContent` |
| `philosophers` | const | 4867 | массив (57) | — | `savePhilosopherData`×7, `deletePhilosopher`×3, `isChronologicallyValid`×2, `analyzePath`×2, `activityOverlap`×2, `stmt001`, `stmt002`, `stmt003`, `stmt008`, `rebuildPhilosopherTraditions`, `initFilters`, `traditionMembers`, `initializePhilosophyMetrics`, `philosopherBirth`, `philosopherYears`, `showPhilosopherProfileModal`, `hasPhilosopherChanges`, `rebuildDerivedIndexes`, `собратьБазу`, `saveConceptData`, `generatePhilosopherEditContent`, `generatePhilosopherViewContent` |
| `rubrics` | const | 5160 | массив (15) | — | `selectAllRubrics`×2, `stmt007`, `selectedRubrics`, `initFilters`, `deselectAllRubrics`, `showPhilosopherProfileModal`, `rebuildDerivedIndexes`, `собратьБазу`, `generateConceptEditContent`, `generateConceptViewContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `relationTypes` | const | 5249 | массив (21) | — | `stmt004`, `stmt005`, `rebuildDerivedIndexes`, `собратьБазу` |
| `concepts` | const | 5289 | массив (453) | — | `saveConceptData`×4, `rebuildDerivedIndexes`×2, `removeConceptEverywhere`×2, `nodes`, `stmt006`, `stmt007`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `собратьБазу`, `savePhilosopherData` |
| `relations` | const | 9029 | массив (1624) | — | `saveConnectionData`×4, `links`, `openStatsModal`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generatePhilosopherComparisonContent`, `generatePhilosopherPairsContent`, `generateClosestPairsContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `generateConceptRankingsContent`, `generatePhilosopherRankingsContent`, `toggleMetricVisualization`, `showSimilarityOverlay`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `собратьБазу`, `relationIndexOf`, `removeLinkEverywhere` |
| `philosopherIdToName` | const | 13533 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt001`, `nodes` |
| `philosopherConcepts` | const | 13539 | объект (0) | — | `generateConceptViewContent`×5, `rebuildDerivedIndexes`×3, `generateConceptEditContent`×3, `generatePhilosopherViewContent`×3, `findAndShowPath`×2, `selectAllPhilosophers`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal`×2, `handleConnectionEditSearch`×2, `conceptCircle`×2, `conceptPlate`×2, `handleConnectionViewSearch`×2, `stmt002`, `selectedPhilosophers`, `initFilters`, `syncPhilosopherCheckboxes`, `deselectAllPhilosophers`, `updatePhilosopherDimming`, `exportToSVG`, `displaySearchResults`, `renderScene`, `philosopherNames`, `afterDataChange`, `deletePhilosopher`, `showAllConcepts` |
| `philosopherOrder` | const | 13548 | объект (0) | — | `rebuildDerivedIndexes`×3, `searchNodes`×2, `populateCustomSelect`×2, `handleConnectionEditSearch`×2, `handleConnectionViewSearch`×2, `stmt003`, `deletePhilosopher` |
| `relationTypesObj` | const | 13554 | объект (0) | — | `generatePhilosopherViewContent`×5, `renderScene`×4, `generateConceptViewContent`×4, `findAndShowPath`×2, `showPathDescriptionsModal`×2, `selectAllRelations`×2, `stmt021`×2, `groundingCyclePath`×2, `stmt004`, `isSymmetricLink`, `isTypologicalLink`, `selectedRelations`, `isChronologicallyValid`, `applyBasicFilter`, `relationHint`, `initFilters`, `deselectAllRelations`, `exportToSVG`, `linkHasTwoHeads`, `hasConnectionChanges`, `connectionIntegrityWarnings`, `saveConnectionData`, `deleteConnection`, `generateConceptEditContent`, `onConnTypeChange`, `generateConnectionEditContent`, `connectionArrowSvg`, `generateConnectionVisualization` |
| `linkColors` | const | 13579 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt005` |
| `nodes` | const | 13585 | вызов concepts.map() | `concepts`, `philosopherIdToName` | `generatePhilosopherViewContent`×9, `calculatePageRank`×7, `calculateBetweennessAsync`×6, `saveConceptData`×5, `calculateClosenessCentrality`×4, `calculateEigenvectorCentrality`×4, `generateOverviewContent`×4, `renderScene`×4, `findAndShowPath`×3, `subSelection`×3, `deleteConnection`×3, `isChronologicallyValid`×2, `analyzePath`×2, `findShortestPathWeighted`×2, `updateFilterStats`×2, `calculateRichClubCoefficient`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `renderClosestPairs`×2, `renderComparison`×2, `toggleMetricVisualization`×2, `exportToSVG`×2, `populateCustomSelect`×2, `makeClassed`×2, `stmt021`×2, `addLinkToGraph`×2, `connectionIntegrityWarnings`×2, `removeConceptEverywhere`×2, `saveConnectionData`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `handleConnectionViewSearch`×2, `updateConnectionVisualization`×2, `generateConceptViewContent`×2, `initPathFinder`, `findShortestPathUnweighted`, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains`, `metricsNodes`, `applyMetricsScope`, `bfsFromSource`, `calculateClusteringCoefficient`, `calculateWeightedClustering`, `calculateWeightedDegree`, `dijkstraFromSource`, `findConnectedComponents`, `ambiguousLabels`, `generateProblemGenerationContent`, `generateCriticalPowerContent`, `generateRevolutionaryContent`, `generateParadigmShiftContent`, `generateInfluenceContent`, `generateFoundationalContent`, `generateSyntheticContent`, `generateDialogicalContent`, `generateCoherenceContent`, `generateTensionContent`, `generateComparisonContent`, `generateGenerativeContent`, `generateInstrumentalContent`, `generateBridgingContent`, `generateAbstractionContent`, `generateDeductiveContent`, `generateTransformationContent`, `generateFertilityContent`, `generateComplexityContent`, `generateContinuityContent`, `generateTemporalInfluenceContent`, `generatePhilosopherProfileContent`, `generatePhilosopherSystematicContent`, `generatePhilosopherReachContent`, `generatePhilosopherInterdisciplinaryContent`, `saveOriginalRadii`, `visualizeMetricBySize`, `highlightNodeById`, `searchNodes`, `selectSearchResult`, `selectCustomOption`, `showSimilarityOverlay`, `updateSimilarityLegend`, `startRadiusAnimation`, `stepRadiusAnimation`, `rebuildQuadtree`, `gfxNode`, `simulation`, `stmt018`, `stmt020`, `resetSimulation`, `openConceptById`, `similarConceptsBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal`, `getIsolatedConceptsAfterDeletion`, `openEditConceptModal`, `updateGraphData`, `labelOf`, `conceptIntegrityWarnings`, `philosopherIntegrityWarnings`, `savePhilosopherData`, `deletePhilosopher`, `deleteConcept`, `generatePhilosopherEditContent`, `generateConceptEditContent`, `handleConnectionEditSearch`, `selectConnectionEditConcept`, `swapConnectionConcepts`, `createNewConnectionForConcept`, `selectConnectionViewConcept`, `gotoNodeFromModal`, `showAllConcepts`, `stmt031` |
| `links` | const | 13595 | вызов relations.map() | `relations` | `connectionIntegrityWarnings`×4, `applyBasicFilter`×3, `generateOverviewContent`×3, `updateFilterStats`×2, `metricsScopeCounts`×2, `initializePhilosophyMetrics`×2, `toggleMetricVisualization`×2, `repaintPickCanvas`×2, `pickLink`×2, `makeClassed`×2, `highlightCombined`×2, `removeLinkEverywhere`×2, `saveConnectionData`×2, `generatePhilosopherViewContent`×2, `analyzePath`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `resolvePathLinkList`, `buildAdjacencyGraph`, `relationHint`, `metricsLinks`, `applyMetricsScope`, `exportToSVG`, `needsContinuousAnimation`, `renderScene`, `gfxLink`, `simulation`, `stmt018`, `highlightConnected`, `conceptDegreesDetailed`, `findConnection`, `getConceptConnections`, `updateGraphData`, `groundingCyclePath`, `deleteConnection`, `onConnTypeChange`, `updateConnEditPairNote`, `connectionsBetween`, `handleConnectionViewSearch`, `generateConceptViewContent`, `stmt031` |
| `conceptToRubrics` | const | 13605 | объект (0) | — | `FilterModes`×14, `rebuildDerivedIndexes`×3, `buildAdjacencyGraph`×2, `saveConceptData`×2, `generateConceptViewContent`×2, `stmt006`, `revolutionaryIndex`, `hasConceptChanges`, `removeConceptEverywhere`, `generateConceptEditContent`, `showAllConcepts`, `generatePhilosopherViewContent` |
| `rubricsObj` | const | 13611 | объект (0) | — | `rebuildDerivedIndexes`×3, `stmt007` |
| `useWeightedPaths` | let | 13619 | литерал true | — | `metricDescriptions`×23, `findAndShowPath`×3, `calculatePageRank`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `findShortestPath`, `buildGlobalGraphCache`, `calculateBetweennessAsync`, `bfsFromSource`, `calculateClosenessCentrality`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt038`, `stmt042` |
| `respectDirection` | let | 13620 | литерал true | — | `metricDescriptions`×15, `calculatePageRank`×4, `findAndShowPath`×3, `calculateBetweennessAsync`×3, `calculateWeightedDegree`×3, `effectiveScopeFlags`×2, `updateScopeToggles`×2, `findShortestPath`, `metricScopeFactor`, `buildGlobalGraphCache`, `bfsFromSource`, `dijkstraFromSource`, `calculateEigenvectorCentrality`, `findConnectedComponents`, `openStatsModal`, `handleStatsParameterChange`, `generateDegreeContent`, `stmt039`, `stmt042` |
| `skipTypologicalInPaths` | let | 13625 | литерал false | — | `pathLinkAllowed`, `findAndShowPath` |
| `CHRONOLOGY_MODES` | const | 13641 | объект (3) | — | `isChronologicallyValid`×3, `currentChronologyMode`, `analyzePath` |
| `currentChronologyMode` | let | 13648 | ссылка CHRONOLOGY_MODES.STRICT | `CHRONOLOGY_MODES` | `findAndShowPath`×3, `isChronologicallyValid`, `findShortestPathWeighted`, `findShortestPathUnweighted`, `stmt044` |
| `MATURITY_AGE` | const | 13651 | литерал 25 | — | `strictChronologyCheck`×2, `isChronologicallyValid`×2 |
| `selectedPhilosophers` | let | 13654 | new Set | `philosopherConcepts` | `FilterModes`×15, `handleChainsMode`×7, `handleUniqueChainsMode`×6, `togglePhilosopher`×3, `savePhilosopherData`×3, `afterDataChange`×2, `syncPhilosopherCheckboxes`, `onlyTradition`, `addTradition`, `selectAllPhilosophers`, `deselectAllPhilosophers`, `deletePhilosopher` |
| `selectedRelations` | let | 13655 | new Set | `relationTypesObj` | `FilterModes`×7, `toggleRelation`×3, `buildAdjacencyGraph`, `applyBasicFilter`, `selectAllRelations`, `deselectAllRelations` |
| `selectedTraditions` | let | 13656 | new Set | `traditions` | `toggleTradition`×3, `philTraditionsSelected`, `philosopherPassesTraditions`, `selectAllTraditions`, `deselectAllTraditions` |
| `philosopherTraditions` | const | 13659 | объект (0) | — | `rebuildPhilosopherTraditions`×3, `analyzePathTraditions`×3, `renderClosestPairs`×2, `connectionTraditionNote`×2, `stmt008`, `traditionsOfPhilosopher`, `philTraditionsSelected`, `philosopherPassesTraditions` |
| `selectedRubrics` | let | 13665 | new Set | `rubrics` | `FilterModes`×14, `toggleRubric`×3, `buildAdjacencyGraph`×2, `selectAllRubrics`, `deselectAllRubrics` |
| `filterMode` | let | 13668 | строка | — | `applyFiltersImmediate`×3, `handleChainsMode`, `handleUniqueChainsMode`, `changeFilterMode` |
| `arrowHoverTimer` | let | 14320 | литерал null | — | `handlePathArrowHover`×4 |
| `ARROW_HOVER_DELAY` | const | 14321 | литерал 800 | — | `handlePathArrowHover` |
| `currentPathData` | let | 14414 | литерал null | — | `showPathDescriptionsModal`×2, `findAndShowPath` |
| `nodesDescriptionsVisible` | let | 14534 | литерал false | — | `togglePathNodesDescriptions`×4 |
| `LoadingIndicator` | const | 14571 | объект (1) | `CHAIN_SEARCH`×2 | `handleChainsMode`, `handleUniqueChainsMode`, `renderClosestPairs` |
| `CHAIN_SEARCH` | const | 14724 | объект (11) | — | `processBFS`×5, `handleChainsMode`×4, `handleUniqueChainsMode`×4, `LoadingIndicator`×2, `findChainsThroughAllPhilosophers`, `findUniquePhilosopherChains` |
| `CHAIN_WARN_THRESHOLD` | const | 14886 | литерал 15 | — | `confirmLongChainSearch` |
| `FilterModes` | const | 15017 | объект (7) | `selectedPhilosophers`×15, `conceptToRubrics`×14, `selectedRubrics`×14, `selectedRelations`×7, `linkPassesTraditions`×5, `philTraditionsSelected`×4 | `applyBasicFilter` |
| `visibleNodeIds` | var | 15199 | литерал null | — | `isNodeVisible`×2, `updateFilterStats`×2, `forgetNode`×2, `applyBasicFilter`, `applyChainVisibility` |
| `visibleLinkSet` | var | 15200 | литерал null | — | `isLinkVisible`×2, `updateFilterStats`×2, `forgetLink`×2, `applyBasicFilter`, `applyChainVisibility` |
| `debouncedApplyFilters` | const | 15440 | вызов debounce() | `debounce`, `applyFiltersImmediate` | `applyFilters` |
| `RELATION_HINTS` | const | 15447 | объект (21) | — | `relationHint`×2 |
| `LAYER_NAMES` | const | 15470 | объект (4) | — | `relationHint`×2 |
| `metricsLinkSource` | let | 15808 | литерал null | — | `metricsLinks`, `applyMetricsScope`, `closeStatsModal` |
| `metricsNodeSource` | let | 15809 | литерал null | — | `metricsNodes`, `applyMetricsScope`, `closeStatsModal` |
| `metricsScopeActive` | let | 15810 | литерал false | — | `applyMetricsScope`×3, `buildGlobalGraphCache`×2, `metricScopeFactor`, `closeStatsModal` |
| `lastScopeKey` | let | 15849 | литерал null | — | `applyMetricsScope`×2, `closeStatsModal` |
| `METRIC_FLAGS` | const | 15897 | объект (33) | — | `effectiveScopeFlags`, `metricScopeFactor`, `installMetricScopeWrappers`, `updateScopeToggles` |
| `VIEW_METRIC` | const | 15946 | объект (31) | — | `effectiveScopeFlags`, `updateScopeToggles` |
| `betweennessCache` | let | 16148 | литерал null | — | `calculateBetweennessAsync`×3, `generateBetweennessContent`×3, `calculateBetweenness`×2, `invalidateBetweennessCache`, `toggleMetricVisualization` |
| `betweennessCalculating` | let | 16149 | литерал false | — | `calculateBetweennessAsync`×3, `calculateBetweenness`, `invalidateBetweennessCache` |
| `pageRankCache` | let | 16327 | литерал null | — | `calculatePageRank`×3, `generatePageRankContent`×3, `invalidatePageRankCache`, `toggleMetricVisualization` |
| `pageRankCalculating` | let | 16328 | литерал false | — | `calculatePageRank`×3, `invalidatePageRankCache` |
| `closenessCache` | let | 16452 | литерал null | — | `calculateClosenessCentrality`×3, `generateClosenessContent`×3, `invalidateClosenessCache`, `toggleMetricVisualization` |
| `closenessCalculating` | let | 16453 | литерал false | — | `calculateClosenessCentrality`×3, `invalidateClosenessCache` |
| `clusteringCache` | let | 16581 | литерал null | — | `calculateClusteringCoefficient`×3, `invalidateClusteringCache` |
| `weightedClusteringCache` | let | 16643 | литерал null | — | `calculateWeightedClustering`×3, `generateWeightedClusteringContent`×3, `invalidateWeightedClusteringCache`, `toggleMetricVisualization` |
| `localCohesionCache` | let | 16644 | литерал null | — | `calculateLocalCohesion`×3, `generateLocalCohesionContent`×3, `invalidateLocalCohesionCache`, `toggleMetricVisualization` |
| `richClubCache` | let | 16645 | литерал null | — | `calculateRichClubCoefficient`×3, `generateRichClubContent`×3, `invalidateRichClubCache`, `toggleMetricVisualization` |
| `eigenvectorCache` | let | 16950 | литерал null | — | `calculateEigenvectorCentrality`×3, `generateEigenvectorContent`×3, `invalidateEigenvectorCache`, `toggleMetricVisualization` |
| `eigenvectorCalculating` | let | 16951 | литерал false | — | `calculateEigenvectorCentrality`×3, `invalidateEigenvectorCache` |
| `graphCache` | let | 16953 | литерал null | — | `buildGlobalGraphCache`×3, `invalidateGraphCache` |
| `_concepts` | let | 17095 | литерал null | — | `metricDescriptions`×5, `philosopherSimilarityData`×4, `initializeMetricsData`×2, `metricCoverage`×2, `renderClosestPairs`×2, `showPhilosopherProfileModal`×2, `buildIncomingLinks`, `buildOutgoingLinks`, `internalCoherenceIndex`, `tensionScales`, `philosopherProfile`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `generateRankings`, `generatePhilosopherRankings`, `medianNodeDegree`, `similarityData`, `neighborSets`, `generativityScores`, `generatePhilosopherPairsContent`, `renderComparison`, `metricPercentile`, `metricRank` |
| `_relations` | let | 17096 | литерал null | — | `philosopherSimilarityData`×3, `reflexiveLinkOf`, `buildIncomingLinks`, `buildOutgoingLinks`, `initializeMetricsData`, `philosopherSystematicIndex`, `philosopherHistoricalReachIndex`, `philosopherInterdisciplinaryIndex`, `medianNodeDegree`, `nodeDegreeOf`, `neighborSets`, `generativityScores`, `conceptDegreeForNorm` |
| `_philosophers` | let | 17097 | литерал null | — | `initializeMetricsData`×2 |
| `_conceptMap` | let | 17098 | литерал null | — | `revolutionaryIndex`×6, `criticalPowerIndex`×5, `influenceIndex`×4, `syntheticIndex`×4, `paradigmShiftIndex`×3, `conceptualFertilityIndex`×3, `internalCoherenceIndex`×2, `philosopherInterdisciplinaryIndex`×2, `temporalInfluencePattern`×2, `conceptualComplexityIndex`×2, `linkInInfluenceScope`×2, `generativityScores`×2, `generativeIndex`×2, `instrumentalIndex`×2, `traditionBridgingIndex`×2, `abstractionIndex`×2, `deductiveIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `tensionIndex`, `philosopherHistoricalReachIndex`, `conceptualContinuityIndex`, `philosopherSimilarityData` |
| `_philosopherMap` | let | 17099 | литерал null | — | `criticalPowerIndex`×4, `revolutionaryIndex`×4, `influenceIndex`×4, `conceptualFertilityIndex`×3, `paradigmShiftIndex`×2, `philosopherHistoricalReachIndex`×2, `temporalInfluencePattern`×2, `sameTraditionPhil`×2, `traditionBridgingIndex`×2, `initializeMetricsData`, `otherPhilosopher`, `conceptualContinuityIndex` |
| `_incomingLinks` | let | 17100 | литерал null | — | `criticalPowerIndex`×2, `revolutionaryIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `temporalInfluencePattern`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `traditionBridgingIndex`, `abstractionIndex` |
| `_outgoingLinks` | let | 17101 | литерал null | — | `criticalPowerIndex`×2, `initializeMetricsData`, `problemGenerationIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `typeProfileOf`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveDepth`, `deductiveIndex` |
| `problemGenerationIndexCache` | let | 17174 | литерал null | — | `invalidateProblemGenerationIndexCache` |
| `criticalPowerIndexCache` | let | 17289 | литерал null | — | `invalidateCriticalPowerIndexCache` |
| `revolutionaryIndexCache` | let | 17472 | литерал null | — | `invalidateRevolutionaryIndexCache` |
| `paradigmShiftIndexCache` | let | 17604 | литерал null | — | `invalidateParadigmShiftIndexCache` |
| `influenceIndexCache` | let | 17660 | литерал null | — | `invalidateInfluenceIndexCache` |
| `foundationalIndexCache` | let | 17807 | литерал null | — | `invalidateFoundationalIndexCache` |
| `SYSTEMATIC_TYPES` | const | 17815 | массив (12) | — | `philosopherSystematicIndex` |
| `DISRUPTIVE_TYPES` | const | 17818 | массив (2) | — | `philosopherSystematicIndex` |
| `CONSTRUCTIVE_TYPES` | const | 17820 | массив (8) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `POLEMICAL_TYPES` | const | 17822 | массив (5) | — | `philosopherHistoricalReachIndex`, `temporalInfluencePattern` |
| `syntheticIndexCache` | let | 17886 | литерал null | — | `invalidateSyntheticIndexCache` |
| `dialogicalIndexCache` | let | 17960 | литерал null | — | `invalidateDialogicalIndexCache` |
| `internalCoherenceIndexCache` | let | 18008 | литерал null | — | `invalidateInternalCoherenceIndexCache` |
| `tensionIndexCache` | let | 18064 | литерал null | — | `invalidateTensionIndexCache` |
| `TENSION_WEIGHTS` | const | 18079 | объект (3) | — | — |
| `_tensionScales` | let | 18085 | литерал null | — | `tensionScales`×4, `invalidateTensionScales` |
| `_tensionScalesComputing` | let | 18086 | литерал false | — | `tensionScales`×3 |
| `philosopherProfileCache` | let | 18323 | литерал null | — | `invalidatePhilosopherProfileCache` |
| `philosopherSystematicIndexCache` | let | 18373 | литерал null | — | `invalidatePhilosopherSystematicIndexCache` |
| `philosopherHistoricalReachIndexCache` | let | 18436 | литерал null | — | `invalidatePhilosopherHistoricalReachIndexCache` |
| `philosopherInterdisciplinaryIndexCache` | let | 18503 | литерал null | — | `invalidatePhilosopherInterdisciplinaryIndexCache` |
| `temporalInfluencePatternCache` | let | 18559 | литерал null | — | `invalidateTemporalInfluencePatternCache` |
| `generateRankingsCache` | let | 18624 | литерал null | — | `generateRankings`×2, `setInfluenceScope`, `invalidateGenerateRankingsCache`, `toggleMetricValueMode` |
| `generatePhilosopherRankingsCache` | let | 18663 | литерал null | — | `generatePhilosopherRankings`×3, `invalidateGeneratePhilosopherRankingsCache` |
| `transformationIndexCache` | let | 18767 | литерал null | — | `invalidateTransformationIndexCache` |
| `conceptualFertilityIndexCache` | let | 18806 | литерал null | — | `invalidateConceptualFertilityIndexCache` |
| `conceptualComplexityIndexCache` | let | 18863 | литерал null | — | `invalidateConceptualComplexityIndexCache` |
| `conceptualContinuityIndexCache` | let | 18918 | литерал null | — | `invalidateConceptualContinuityIndexCache` |
| `SIM_METRIC_LABELS` | const | 18997 | объект (17) | — | `renderComparison` |
| `_medianDegreeCache` | let | 19013 | литерал null | — | `medianNodeDegree`×4, `invalidateEverythingForScope` |
| `_simCache` | let | 19037 | литерал null | — | `similarityData`×4, `invalidateSimilarityCache`, `showSimilarityOverlay` |
| `_pairCache` | let | 19098 | литерал null | — | `allConceptPairsAsync`×4, `invalidateSimilarityCache`, `allConceptPairs` |
| `_pairCalculating` | let | 19099 | литерал false | — | `allConceptPairsAsync`×3, `invalidateSimilarityCache`, `renderClosestPairs` |
| `PAIRS_CHUNK_ROWS` | const | 19110 | литерал 15 | — | `allConceptPairsAsync` |
| `_neighborCache` | let | 19180 | литерал null | — | `neighborSets`×3 |
| `PHIL_SIM_MIN_CONCEPTS` | const | 19284 | литерал 3 | — | `philosopherSimilarity`×2 |
| `PHIL_SIM_MIN_RUBRIC_UNION` | const | 19303 | литерал 3 | — | `philosopherSimilarity`, `metricDescriptions` |
| `_philSimCache` | let | 19309 | литерал null | — | `philosopherSimilarityData`×4, `invalidatePhilosopherSimilarityCache` |
| `influenceScope` | var | 19453 | строка | — | `influenceIndex`×2, `setInfluenceScope`×2, `influenceScopeSwitcher`×2, `linkInInfluenceScope`×2 |
| `INFLUENCE_SCOPE_LABELS` | const | 19454 | объект (3) | — | `influenceIndex`, `setInfluenceScope`, `influenceScopeSwitcher` |
| `GENERATIVITY_DAMPING` | const | 19476 | литерал 0.85 | — | `generativityScores` |
| `GENERATIVITY_ITERATIONS` | const | 19477 | литерал 40 | — | `generativityScores` |
| `_generativityCacheByScope` | let | 19482 | new Map | — | `generativityScores`×3, `invalidateGenerativityCache` |
| `instrumentalIndexCache` | let | 19575 | литерал null | — | `invalidateInstrumentalIndexCache` |
| `BRIDGING_MIN_EXTERNAL` | const | 19621 | литерал 5 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `BRIDGING_WEIGHT_REF` | const | 19626 | литерал 50 | — | `metricDescriptions`×2, `traditionBridgingIndex` |
| `traditionBridgingCache` | let | 19627 | литерал null | — | `invalidateTraditionBridgingCache` |
| `abstractionIndexCache` | let | 19697 | литерал null | — | `invalidateAbstractionIndexCache` |
| `deductiveIndexCache` | let | 19735 | new Map | — | `deductiveIndex`×3, `invalidateDeductiveIndexCache` |
| `metricsScope` | let | 19823 | строка | — | `applyMetricsScope`×2, `initializePhilosophyMetrics`×2, `refreshMetricsIfScoped`, `metricsScopeCounts`, `handleMetricsScopeChange`, `openStatsModal`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `metricDescriptions` | const | 19950 | объект (39) | `useWeightedPaths`×23, `respectDirection`×15, `_concepts`×5, `BRIDGING_MIN_EXTERNAL`×2, `BRIDGING_WEIGHT_REF`×2, `PHIL_SIM_MIN_RUBRIC_UNION` | `getMetricDescription` |
| `currentStatsView` | let | 20425 | литерал null | — | `openStatsModal`×4, `setInfluenceScope`×3, `handleStatsParameterChange`×3, `refreshMetricsIfScoped`×2, `handleMetricsScopeChange`×2, `toggleMetricValueMode`×2, `afterDataChange`×2, `effectiveScopeFlags`, `switchStatsView` |
| `isStatsModalOpen` | let | 20426 | литерал false | — | `calculateMetricFromModal`×2, `graphIsCovered`×2, `refreshMetricsIfScoped`, `openStatsModal`, `closeStatsModal`, `stmt009`, `stmt010`, `toggleMetricVisualization`, `afterDataChange` |
| `WEIGHT_WORDS` | const | 20686 | объект (3) | — | `generateConceptViewContent`×2, `generatePhilosopherViewContent`×2 |
| `_ambiguousLabels` | let | 20747 | литерал null | — | `ambiguousLabels`×4 |
| `metricValueMode` | let | 20766 | строка | — | `generateMetricResults`×4, `generateConceptRankingsContent`×3, `generateRankings`×2, `toggleMetricValueMode`×2, `applyMetricMode` |
| `generateRankingsMode` | let | 20767 | литерал null | — | `generateRankings`×2 |
| `METRIC_COVERAGE_FN` | const | 20792 | объект (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `generateMetricResults`×4, `metricCoverage` |
| `METRIC_COVERAGE_WARN` | const | 20813 | литерал 0.5 | — | `generateMetricCoverageBlock`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `_metricCoverageCache` | let | 20814 | объект (0) | — | `metricCoverage`×3, `invalidateMetricCoverageCache` |
| `lastZeroCount` | let | 20923 | литерал 0 | — | `rankKeep`×2, `generateMetricResults`×2 |
| `METRIC_FIELD_LABELS` | const | 20936 | объект (100) | — | `genericDetailsHTML`×5 |
| `metricLayoutMode` | let | 21060 | строка | — | `generateMetricResults`×4, `toggleMetricLayout`×3, `stmt011`, `applyMetricLayout` |
| `_cmpA` | let | 21891 | литерал null | — | `renderComparison`×4, `generateComparisonContent`×3, `openPairInComparison`, `selectCustomOption` |
| `_cmpB` | let | 21891 | литерал null | — | `renderComparison`×4, `generateComparisonContent`×3, `openPairInComparison`, `selectCustomOption` |
| `_pairsKind` | var | 21903 | строка | — | `renderClosestPairs` |
| `_pairsMinDegree` | var | 21904 | литерал 6 | — | `renderClosestPairs`×3, `generateClosestPairsContent`×2 |
| `_pairsMinShared` | var | 21905 | литерал 3 | — | `generateClosestPairsContent`×2, `renderClosestPairs`×2 |
| `_pairsCrossAuthor` | var | 21906 | литерал true | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pairsCrossTradition` | var | 21907 | литерал false | — | `generateClosestPairsContent`, `renderClosestPairs` |
| `_pcmpA` | var | 21909 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `_pcmpB` | var | 21909 | литерал null | — | `generatePhilosopherComparisonContent`×3, `renderPhilosopherComparison`, `openPhilosopherPair` |
| `PHIL_SIM_LABELS` | const | 21910 | объект (4) | — | `renderPhilosopherPairs`×2, `renderPhilosopherComparison`, `generatePhilosopherPairsContent` |
| `_philPairsKind` | var | 22010 | строка | — | `renderPhilosopherPairs`×3 |
| `isVisualizingBySize` | let | 22893 | литерал false | — | `resetNodeSizes`×2, `updateVisualizationControlSection`, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `currentVisualizedMetric` | let | 22894 | литерал null | — | `updateVisualizationControlSection`×3, `resetNodeSizes`×2, `toggleMetricVisualization`, `updateVisualizationButtonText`, `visualizeMetricBySize` |
| `originalRadii` | let | 22895 | new Map | — | `saveOriginalRadii`×3, `resetNodeSizes` |
| `originalTextDy` | let | 22896 | new Map | — | `saveOriginalRadii`, `resetNodeSizes` |
| `selectedSourceNode` | let | 23651 | литерал null | — | `findAndShowPath`, `selectCustomOption` |
| `selectedTargetNode` | let | 23652 | литерал null | — | `findAndShowPath`, `selectCustomOption` |
| `editMode` | let | 23779 | объект (5) | — | `handleNodeClick`×8, `dispatchClick` |
| `clickTimer` | let | 23792 | литерал null | — | `handleNodeClick`×12 |
| `clickCount` | let | 23793 | литерал 0 | — | `handleNodeClick`×10 |
| `lastClickedNode` | let | 23794 | литерал null | — | `handleNodeClick`×14 |
| `linkClickTimer` | let | 23915 | литерал null | — | `handleLinkClick`×5 |
| `linkClickCount` | let | 23916 | литерал 0 | — | `handleLinkClick`×4 |
| `viewWidth` | let | 23992 | ссылка window.innerWidth | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `spacingX`, `stmt023`, `addNodeToGraph`, `gotoNodeFromModal` |
| `viewHeight` | let | 23993 | ссылка window.innerHeight | — | `exportToSVG`×3, `resizeCanvas`×2, `highlightNodeById`, `exportToPNG`, `selectSearchResult`, `simulation`, `spacingY`, `stmt023`, `addNodeToGraph`, `gotoNodeFromModal` |
| `gfxCanvas` | const | 24002 | вызов document.getElementById() | — | `resizeCanvas`×6, `initGraphEventHandlers`×3, `draw`×2, `ctx`, `gfxSvg`, `toGraph`, `pickLink`, `stmt015`, `dispatchMove`, `selectConceptOnGraph`, `cancelGraphSelection` |
| `ctx` | const | 24003 | вызов gfxCanvas.getContext() | `gfxCanvas` | `draw`×4 |
| `gfxSvg` | const | 24004 | вызов d3.select() | `gfxCanvas` | `highlightNodeById`, `selectSearchResult`, `stmt015`, `centerGraph`, `gotoNodeFromModal` |
| `pickCanvas` | const | 24007 | вызов document.createElement() | — | `resizeCanvas`×2, `repaintPickCanvas`×2, `pickLink`×2, `pickCtx` |
| `pickCtx` | const | 24008 | вызов pickCanvas.getContext() | `pickCanvas` | `repaintPickCanvas`×13, `pickLink` |
| `pickDirty` | let | 24009 | литерал true | — | `resizeCanvas`, `draw`, `repaintPickCanvas`, `pickLink`, `gfxZoom`, `stmt015`, `stmt017`, `updateGraphData`, `updateLinkOnGraph` |
| `PICK_LINK_WIDTH` | const | 24013 | литерал 10 | — | `repaintPickCanvas` |
| `dpr` | let | 24015 | выражение | — | `draw`×4, `repaintPickCanvas`×4, `resizeCanvas`×3, `pickLink`×2 |
| `renderState` | const | 24030 | объект (9) | — | `forgetNode`×6, `subSelection`×5, `stepRadiusAnimation`×4, `stmt015`×4, `renderScene`×3, `stmt021`×3, `forgetLink`×3, `needsContinuousAnimation`×2, `linkDrawWidth`×2, `makeClassed`×2, `dispatchMove`×2, `initGraphEventHandlers`×2, `toggleUniformLinkWidth`, `exportToPNG`, `exportToSVG`, `nodeRadius`, `nodeLabelDy`, `hasNodeClass`, `hasLinkClass`, `linkStrokeWidth`, `linkHoverStrokeWidth`, `linkDrawAlpha`, `draw`, `startRadiusAnimation`, `toGraph`, `pickNode`, `repaintPickCanvas`, `gfxZoom`, `addNodeToGraph` |
| `arrowMode` | var | 24044 | строка | — | `visualizeMetricBySize`, `resetNodeSizes`, `arrowPoints`, `arrowPointsStart` |
| `arrowRadius` | var | 24045 | литерал null | — | `arrowPoints`×2, `arrowPointsStart`×2, `visualizeMetricBySize`, `resetNodeSizes` |
| `uniformLinkWidthActive` | var | 24046 | литерал false | — | `toggleUniformLinkWidth` |
| `similarityOverlay` | var | 24051 | литерал null | — | `renderScene`×15, `updateSimilarityLegend`×11, `stmt020`×4, `toggleSimilarityKind`×3, `forgetNode`×3, `afterDataChange`×2, `showSimilarityOverlay`, `clearSimilarityOverlay` |
| `SIMILARITY_KEEP_QUANTILE` | const | 24057 | литерал 0.85 | — | `showSimilarityOverlay` |
| `SIMILARITY_ARCS` | const | 24058 | литерал 6 | — | `showSimilarityOverlay`, `updateSimilarityLegend` |
| `LABEL_HIDE_BELOW` | const | 24164 | литерал 0.6 | — | `renderScene` |
| `LABEL_ALL_ABOVE` | const | 24165 | литерал 1 | — | `renderScene` |
| `drawScheduled` | let | 24173 | литерал false | — | `requestDraw`×3 |
| `animLoopRunning` | let | 24182 | литерал false | — | `ensureAnimLoop`×3 |
| `DRAW_ORDER` | const | 24396 | массив (5) | — | `exportToSVG`, `renderScene` |
| `quadtree` | let | 24577 | литерал null | — | `pickNode`×2, `rebuildQuadtree` |
| `nodeHandlers` | const | 24646 | объект (0) | — | `dispatchMove`×4, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxNode` |
| `linkHandlers` | const | 24646 | объект (0) | — | `dispatchMove`×6, `dispatchClick`×2, `initGraphEventHandlers`×2, `gfxLink` |
| `gfxNode` | const | 24688 | объект (5) | `nodes`, `requestDraw`, `nodeHandlers`, `makeClassed`, `subSelection` | `handleNodeClick`×5, `visualizeMetricBySize`×2, `resetNodeSizes`×2, `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightNodeById`, `initGraphEventHandlers`, `highlightCombined`, `highlightConnected`, `resetHighlight`, `stmt020`, `gotoNodeFromModal` |
| `gfxLink` | const | 24700 | объект (4) | `links`, `requestDraw`, `linkHandlers`, `makeClassed` | `gfxLinkAll`, `initGraphEventHandlers`, `stmt021` |
| `gfxLinkAll` | const | 24710 | объект (2) | `requestDraw`, `gfxLink` | `highlightPath`, `applyBasicFilter`, `applyChainVisibility`, `highlightCombined`, `highlightConnected`, `resetHighlight` |
| `gfxZoom` | const | 24718 | вызов d3.zoom() .scaleExtent([0.1, 4…() | `pickDirty`, `renderState`, `requestDraw` | `highlightNodeById`, `selectSearchResult`, `stmt015`, `centerGraph`, `gotoNodeFromModal` |
| `simulation` | let | 24773 | вызов d3.forceSimulation(nodes) .for…() | `nodes`, `links`, `viewWidth`, `viewHeight` | `toggleGrouping`×3, `stmt023`×3, `updateGraphData`×3, `stmt017`×2, `centerGraph`×2, `freezeSimulation`×2, `unfreezeSimulation`×2, `stmt018`, `dragstarted`, `dragended`, `resetSimulation`, `toggleSimulationFreeze`, `stmt037` |
| `tickCount` | let | 24781 | литерал 0 | — | `stmt017`×2, `stmt018`, `dragstarted`, `resetSimulation`, `toggleSimulationFreeze`, `centerGraph`, `unfreezeSimulation`, `toggleGrouping` |
| `maxTicks` | const | 24782 | литерал 300 | — | `stmt017`, `toggleSimulationFreeze`, `unfreezeSimulation` |
| `selectedNodes` | let | 24812 | new Set | — | `handleNodeClick`×13, `highlightCombined`×6, `cleanupInvisibleSelections`×4, `highlightNodeById`×2, `exportToSVG`×2, `selectSearchResult`×2, `handleLinkSelect`×2, `renderScene`×2, `forgetNode`×2, `gotoNodeFromModal`×2, `isEdgeConnectedToSelectedNodes`, `resetHighlight` |
| `selectedEdges` | let | 24815 | new Set | — | `handleLinkSelect`×13, `highlightCombined`×5, `handleNodeClick`×2, `linkVisualState`, `isNodeConnectedToSelectedEdges`, `resetHighlight`, `stmt021`, `forgetLink` |
| `lastHoverNode` | let | 24823 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `lastHoverLink` | let | 24823 | литерал null | — | `dispatchMove`×4, `initGraphEventHandlers`×3 |
| `tooltip` | const | 25069 | вызов d3.select() | — | `stmt020`×2 |
| `tooltipTimeout` | let | 25070 | литерал null | — | `stmt020`×6 |
| `замокРаскладки` | let | 25289 | литерал false | — | `обновитьКнопкуЗаморозки`×3, `toggleSimulationFreeze`×2, `freezeSimulation`, `unfreezeSimulation` |
| `philosopherNames` | const | 25315 | вызов Object.keys() | `philosopherConcepts` | `rows`, `stmt022`, `stmt023` |
| `groupPositions` | const | 25316 | объект (0) | — | `stmt023`×3, `toggleGrouping`×2, `stmt022` |
| `cols` | const | 25317 | литерал 6 | — | `stmt023`×3, `stmt022`×2, `rows`, `spacingX` |
| `rows` | const | 25318 | вызов Math.ceil() | `philosopherNames`, `cols` | `spacingY`, `stmt023` |
| `spacingX` | const | 25319 | выражение | `viewWidth`, `cols` | `stmt022` |
| `spacingY` | const | 25320 | выражение | `viewHeight`, `rows` | `stmt022` |
| `isGrouped` | let | 25331 | литерал false | — | `toggleGrouping`×3, `stmt023` |
| `PROFILE_METRICS` | const | 25505 | массив (19) | `problemGenerationIndex`, `criticalPowerIndex`, `revolutionaryIndex`, `paradigmShiftIndex`, `influenceIndex`, `foundationalIndex`, `syntheticIndex`, `dialogicalIndex`, `internalCoherenceIndex`, `tensionIndex`, `transformationIndex`, `conceptualFertilityIndex`, `conceptualComplexityIndex`, `conceptualContinuityIndex`, `generativeIndex`, `instrumentalIndex`, `traditionBridgingIndex`, `abstractionIndex`, `deductiveIndex` | `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `profileOrderMode` | let | 25561 | строка | — | `toggleProfileOrder`×2, `showConceptProfileModal`×2, `showPhilosopherProfileModal` |
| `ModalContext` | const | 25797 | объект (4) | — | `saveConnectionData`×6, `deleteConnection`×6, `toggleModalMode`×5, `swapConnectionConcepts`×5, `pushModalState`×4, `refreshOpenModalToolbar`×4, `closeUniversalModal`×4, `openUniversalModal`×3, `hasUnsavedChanges`×3, `selectConnectionViewConcept`×3, `authLogout`×2, `hasConnectionChanges`×2, `deleteConcept`×2, `updateConnEditPairNote`×2, `generateConnectionEditContent`×2, `generateConnectionViewContent`×2, `popModalState`, `savePhilosopherData`, `deletePhilosopher`, `saveConceptData`, `handleConnectionEditSearch`, `selectConnectionEditConcept`, `handleConnectionViewSearch`, `updateConnectionVisualization` |
| `modalStack` | const | 25808 | массив (0) | — | `pushModalState`×5, `afterDataChange`×2, `stmt030`×2, `popModalState`, `openUniversalModal`, `closeUniversalModal` |
| `MODAL_STACK_MAX` | const | 25809 | литерал 20 | — | `pushModalState` |
| `AUTH_ADMIN` | const | 25903 | объект (2) | — | `submitAuth`×3 |
| `authAccounts` | const | 25904 | new Map | — | `submitAuth`×4 |
| `authSession` | let | 25905 | объект (1) | — | `submitAuth`×3, `canEdit`×2, `authLogout`, `renderAuthControls` |
| `authModalKind` | let | 25906 | строка | — | `openAuthModal`, `showAuthNotice`, `submitAuth` |
| `pinnedVisibleNodes` | const | 26435 | new Set | — | `applyBasicFilter`×3, `addNodeToGraph`, `forgetNode` |
| `НАБОРЫ_БАЗЫ` | const | 26578 | массив (6) | — | `скачатьБазу`×2, `сохранитьВПапку` |
| `естьНесохранённое` | let | 26580 | литерал false | — | `пометитьИзменение`, `естьПравки`, `скачатьБазу`, `сохранитьВПапку`, `stmt024` |
| `папкаБазы` | let | 26608 | литерал null | — | `сохранитьВПапку`×3 |
| `WEIGHT_OPTIONS` | const | 26768 | массив (3) | — | `generateConnectionEditContent` |
| `GROUNDING_TYPES` | const | 26811 | new Set | — | `groundingCyclePath`×2 |
| `CONN_WEIGHT_WORDS` | const | 28005 | объект (3) | — | `generateConnectionVisualization` |
| `allDescriptionsExpanded` | let | 28745 | литерал false | — | `toggleAllConnectionDescriptions`×4 |
| `allPhilosopherConceptDescriptionsExpanded` | let | 29401 | литерал false | — | `toggleAllPhilosopherConceptDescriptions`×4 |
| `allPhilosopherConnectionDescriptionsExpanded` | let | 29437 | литерал false | — | `toggleAllPhilosopherConnectionDescriptions`×4 |
| `legendWeightsToggle` | const | 29601 | вызов document.getElementById() | — | `stmt038`×2 |
| `legendDirectionToggle` | const | 29603 | вызов document.getElementById() | — | `stmt039`×2 |


## 3. Операторы верхнего уровня

Исполняемый код вне функций: производные словари (`relationTypesObj`
и подобные), навешивание обработчиков, запуск раскладки, стартовые вызовы.
Порядок в таблице — порядок исполнения при загрузке страницы.

| Метка | Вид | Стр. | Длина | Что делает | Использует |
|---|---|---|---|---|---|
| stmt001 | построение | 13534 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherIdToName` |
| stmt002 | построение | 13540 | 6 | `philosophers.forEach(…)` | `philosophers`, `philosopherConcepts` |
| stmt003 | построение | 13549 | 3 | `philosophers.forEach(…)` | `philosophers`, `philosopherOrder` |
| stmt004 | построение | 13555 | 10 | `relationTypes.forEach(…)` | `relationTypes`, `relationTypesObj` |
| stmt005 | построение | 13580 | 3 | `relationTypes.forEach(…)` | `relationTypes`, `linkColors` |
| stmt006 | построение | 13606 | 3 | `concepts.forEach(…)` | `concepts`, `conceptToRubrics` |
| stmt007 | построение | 13612 | 6 | `rubrics.forEach(…)` | `rubrics`, `concepts`, `rubricsObj` |
| stmt008 | построение | 13660 | 1 | `philosophers.forEach(…)` | `philosophers`, `philosopherTraditions` |
| stmt009 | обработчик | 20632 | 7 | `document.addEventListener('click')` | `isStatsModalOpen`, `closeStatsModal` |
| stmt010 | обработчик | 20641 | 5 | `document.addEventListener('keydown')` | `isStatsModalOpen`, `closeStatsModal` |
| stmt011 | try | 21061 | 4 | `try { const saved = localStorage.getItem('metricLayoutMode'); if (save…` | `metricLayoutMode` |
| stmt012 | обработчик | 23246 | 3 | `window.addEventListener('load')` | `saveOriginalRadii` |
| stmt013 | обработчик | 23594 | 15 | `document.addEventListener('click')` | — |
| stmt014 | обработчик | 23763 | 4 | `document.addEventListener('DOMContentLoaded')` | `initializeCustomSelects` |
| stmt015 | вызов | 24728 | 37 | `gfxSvg.call(d3.drag() .container(gfxCanvas) .subje…()` | `renderState`×4, `gfxCanvas`, `gfxSvg`, `pickDirty`, `requestDraw`, `rebuildQuadtree`, `pickNode`, `gfxZoom`, `dragstarted`, `dragended` |
| stmt016 | вызов | 24766 | 1 | `resizeCanvas()` | `resizeCanvas` |
| stmt017 | обработчик | 24784 | 15 | `simulation.on('tick')` | `simulation`×2, `tickCount`×2, `pickDirty`, `requestDraw`, `rebuildQuadtree`, `maxTicks` |
| stmt018 | обработчик | 24800 | 10 | `simulation.on('end.stats')` | `nodes`, `links`, `simulation`, `tickCount` |
| stmt019 | вызов | 24897 | 1 | `initGraphEventHandlers()` | `initGraphEventHandlers` |
| stmt020 | обработчик | 25072 | 27 | `gfxNode.on("mouseover", function(event, ….on('mouseout')` | `tooltipTimeout`×6, `similarityOverlay`×4, `tooltip`×2, `nodes`, `labelWithAuthor`, `gfxNode` |
| stmt021 | обработчик | 25101 | 125 | `gfxLink.on("mouseover", function(event, ….on('mouseout')` | `renderState`×3, `relationTypesObj`×2, `nodes`×2, `requestDraw`×2, `isSymmetricLink`, `isReflexiveLink`, `gfxLink`, `selectedEdges` |
| stmt022 | построение | 25322 | 8 | `philosopherNames.forEach(…)` | `cols`×2, `philosopherNames`, `groupPositions`, `spacingX`, `spacingY` |
| stmt023 | обработчик | 25403 | 31 | `window.addEventListener('resize')` | `simulation`×3, `groupPositions`×3, `cols`×3, `viewWidth`, `viewHeight`, `resizeCanvas`, `philosopherNames`, `rows`, `isGrouped` |
| stmt024 | обработчик | 26634 | 5 | `window.addEventListener('beforeunload')` | `естьНесохранённое` |
| stmt025 | присваивание | 26698 | 1 | `window.graphSelectionContext = …` | — |
| stmt026 | обработчик | 28285 | 7 | `document.addEventListener('click')` | — |
| stmt027 | вызов | 29528 | 1 | `setTimeout()` | `makeLegendsEditable` |
| stmt028 | вызов | 29529 | 1 | `renderAuthControls()` | `renderAuthControls` |
| stmt029 | обработчик | 29547 | 6 | `document.getElementById('modalOverlay').addEventListener('click')` | `closeAllModals` |
| stmt030 | обработчик | 29555 | 22 | `document.addEventListener('keydown')` | `modalStack`×2, `cancelGraphSelection`×2, `popModalState`, `closeAllModals` |
| stmt031 | вызов | 29579 | 1 | `console.log()` | `nodes`, `links` |
| stmt032 | вызов | 29580 | 1 | `initFilters()` | `initFilters` |
| stmt033 | вызов | 29581 | 1 | `updateFilterStats()` | `updateFilterStats` |
| stmt034 | вызов | 29583 | 1 | `initializePhilosophyMetrics()` | `initializePhilosophyMetrics` |
| stmt035 | вызов | 29586 | 1 | `initPathFinder()` | `initPathFinder` |
| stmt036 | вызов | 29589 | 1 | `restorePanelStates()` | `restorePanelStates` |
| stmt037 | обработчик | 29592 | 3 | `simulation.on('end.log')` | `simulation` |
| stmt038 | условие | 29602 | 1 | `if (legendWeightsToggle) legendWeightsToggle.checked = useWeightedPath…` | `legendWeightsToggle`×2, `useWeightedPaths` |
| stmt039 | условие | 29604 | 1 | `if (legendDirectionToggle) legendDirectionToggle.checked = respectDire…` | `legendDirectionToggle`×2, `respectDirection` |
| stmt040 | вызов | 29607 | 1 | `saveOriginalRadii()` | `saveOriginalRadii` |
| stmt041 | вызов | 29609 | 1 | `console.log()` | — |
| stmt042 | вызов | 29610 | 2 | `console.log()` | `useWeightedPaths`, `respectDirection` |
| stmt043 | обработчик | 29618 | 4 | `document.getElementById('respectChronolo….addEventListener('change')` | — |
| stmt044 | обработчик | 29624 | 12 | `document.getElementById('chronologyModeS….addEventListener('change')` | `currentChronologyMode` |
| stmt045 | условие | 29638 | 3 | `if (document.getElementById('respectChronology').checked) { document.g…` | — |
| stmt046 | вызов | 29642 | 1 | `console.log()` | — |


## 4. Обработчики событий, навешанные из кода

| Стр. | Событие | Цель | Способ | Обработчик | Где навешан |
|---|---|---|---|---|---|
| 14607 | `click` | `cancelBtn` | addEventListener | функция на месте | `LoadingIndicator` |
| 20632 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt009` |
| 20641 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt010` |
| 23246 | `load` | `window` | addEventListener | функция на месте | верхний уровень: `stmt012` |
| 23594 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt013` |
| 23662 | `click` | `document` | addEventListener | функция на месте | `initializeCustomSelects` |
| 23763 | `DOMContentLoaded` | `document` | addEventListener | функция на месте | верхний уровень: `stmt014` |
| 24718 | `zoom` | `d3.zoom() .scaleExtent([0.1, 4])` | .on() | функция на месте | `gfxZoom` |
| 24728 | `end` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt015` |
| 24728 | `drag` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt015` |
| 24728 | `start` | `d3.drag() .container(gfxCanvas) .subject((eve…` | .on() | функция на месте | верхний уровень: `stmt015` |
| 24784 | `tick` | `simulation` | .on() | функция на месте | верхний уровень: `stmt017` |
| 24800 | `end.stats` | `simulation` | .on() | функция на месте | верхний уровень: `stmt018` |
| 24884 | `click` | `gfxLink` | .on() | handleLinkClick | `initGraphEventHandlers` |
| 24885 | `click` | `gfxNode` | .on() | handleNodeClick | `initGraphEventHandlers` |
| 24886 | `mousemove` | `gfxCanvas` | addEventListener | dispatchMove | `initGraphEventHandlers` |
| 24887 | `mouseleave` | `gfxCanvas` | addEventListener | функция на месте | `initGraphEventHandlers` |
| 24894 | `click` | `gfxCanvas` | addEventListener | dispatchClick | `initGraphEventHandlers` |
| 25072 | `mouseout` | `gfxNode.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt020` |
| 25072 | `mouseover` | `gfxNode` | .on() | функция на месте | верхний уровень: `stmt020` |
| 25101 | `mouseout` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt021` |
| 25101 | `mousemove` | `gfxLink.on("mouseover", function(event, d) { …` | .on() | функция на месте | верхний уровень: `stmt021` |
| 25101 | `mouseover` | `gfxLink` | .on() | функция на месте | верхний уровень: `stmt021` |
| 25403 | `resize` | `window` | addEventListener | функция на месте | верхний уровень: `stmt023` |
| 25940 | `keydown` | `f` | addEventListener | функция на месте | `openAuthModal` |
| 26634 | `beforeunload` | `window` | addEventListener | функция на месте | верхний уровень: `stmt024` |
| 27955 | `input` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 27956 | `focus` | `input` | addEventListener | run | `setupConnectionEditSearchHandlers` |
| 28285 | `click` | `document` | addEventListener | функция на месте | верхний уровень: `stmt026` |
| 28441 | `click` | `btn` | свойство | функция на месте | `initConnectionSearchFields` |
| 29484 | `click` | `philHeader` | addEventListener | функция на месте | `makeLegendsEditable` |
| 29505 | `click` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 29514 | `dblclick` | `item` | addEventListener | функция на месте | `makeLegendsEditable` |
| 29547 | `click` | `document.getElementById('modalOverlay')` | addEventListener | функция на месте | верхний уровень: `stmt029` |
| 29555 | `keydown` | `document` | addEventListener | функция на месте | верхний уровень: `stmt030` |
| 29592 | `end.log` | `simulation` | .on() | функция на месте | верхний уровень: `stmt037` |
| 29618 | `change` | `document.getElementById('respectChronology')` | addEventListener | функция на месте | верхний уровень: `stmt043` |
| 29624 | `change` | `document.getElementById('chronologyModeSelect…` | addEventListener | функция на месте | верхний уровень: `stmt044` |


## 4б. Обращение к функциям по имени (`window[…]`)

Пять точек, где имя функции склеивается из кусков и вызывается
через `window[…]`. Прямых ссылок на такие функции в коде нет — без этой
таблицы карта показала бы их покойниками.

| Стр. | Где | Выражение | Действие |
|---|---|---|---|
| 15988 | `installMetricScopeWrappers` | `window[name]` | чтение |
| 16001 | `installMetricScopeWrappers` | `window[name]` | запись |
| 23066 | `toggleMetricVisualization` | `window[funcName]` | чтение |
| 25868 | `modalContentFor` | `window[name]` | чтение |
| 25874 | `modalContentFor` | `window[fallbackName]` | чтение |


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
| `openUniversalModal` | да | 0 | 19 | `onclick` | `conceptPlate`, `generateConceptEditContent`, `generateConceptViewContent`, `generatePhilosopherEditContent`, `generatePhilosopherViewContent`, `showAllConcepts`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `renderClosestPairs` | да | 0 | 6 | `onchange`, `onclick`, `oninput` | `generateClosestPairsContent` |
| `setTimeout` | **НЕТ** | 0 | 6 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent`, `showConceptProfileModal`, `showPhilosopherProfileModal` |
| `closeUniversalModal` | да | 1 | 3 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent`, `modalActions` |
| `closeConceptProfileModal` | да | 1 | 3 | `onclick` | `showConceptProfileModal` |
| `toggleSection` | да | 4 | 0 | `onclick` | — |
| `highlightNodeById` | да | 0 | 4 | `onclick` | `generateConceptRankingsContent`, `generateDegreeContent`, `generateMetricResults`, `generateTemporalInfluenceContent` |
| `toggleSubsection` | да | 0 | 4 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent` |
| `toggleConnectionDescription` | да | 0 | 4 | `onclick` | `generateConceptViewContent`, `generatePhilosopherViewContent` |
| `showCustomSelectDropdown` | да | 2 | 1 | `onfocus` | `generateComparisonContent` |
| `filterCustomSelect` | да | 2 | 1 | `oninput` | `generateComparisonContent` |
| `showSimilarityOverlay` | да | 0 | 3 | `onclick` | `similarConceptsBlock`, `updateSimilarityLegend` |
| `closePhilosopherProfileModal` | да | 1 | 1 | `onclick` | `showPhilosopherProfileModal` |
| `handleLegendSearch` | да | 2 | 0 | `onfocus`, `oninput` | — |
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
| `closePathDescriptionsModal` | да | 1 | 0 | `onclick` | — |
| `clearLegendSearch` | да | 1 | 0 | `onclick` | — |
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
| `exportToPNG` | да | 1 | 0 | `onclick` | — |
| `exportToSVG` | да | 1 | 0 | `onclick` | — |
| `handleMetricsScopeChange` | да | 1 | 0 | `onchange` | — |
| `closeStatsModal` | да | 1 | 0 | `onclick` | — |
| `showPathDescriptionsModal` | да | 0 | 1 | `onclick` | `findAndShowPath` |
| `togglePathNodesDescriptions` | да | 0 | 1 | `onclick` | `showPathDescriptionsModal` |
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
| `selectCustomOption` | да | 0 | 1 | `onclick` | `populateCustomSelect` |
| `clearSimilarityOverlay` | да | 0 | 1 | `onclick` | `updateSimilarityLegend` |
| `openConceptById` | да | 0 | 1 | `onclick` | `similarConceptsBlock` |
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
| `findConnection` | да | 0 | 1 | `onclick` | `generateConceptEditContent` |
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
| `toggleAllPhilosopherConceptDescriptions` | да | 0 | 1 | `onclick` | `generatePhilosopherViewContent` |
| `togglePhilosopherConceptDescription` | да | 0 | 1 | `onclick` | `generatePhilosopherViewContent` |
| `toggleAllPhilosopherConnectionDescriptions` | да | 0 | 1 | `onclick` | `generatePhilosopherViewContent` |


## 6. Все обработчики в разметке построчно

| Стр. | Атрибут | Порождается в | Код |
|---|---|---|---|
| 4153 | `onclick` | (страница) | `closeUniversalModal()` |
| 4162 | `onclick` | (страница) | `closeConceptProfileModal()` |
| 4167 | `onclick` | (страница) | `closePhilosopherProfileModal()` |
| 4173 | `onclick` | (страница) | `closePathDescriptionsModal()` |
| 4188 | `oninput` | (страница) | `handleLegendSearch(this.value)` |
| 4189 | `onfocus` | (страница) | `handleLegendSearch(this.value)` |
| 4190 | `onclick` | (страница) | `clearLegendSearch()` |
| 4198 | `onclick` | (страница) | `openStatsModal()` |
| 4210 | `onclick` | (страница) | `resetNodeSizes()` |
| 4217 | `onclick` | (страница) | `toggleSection('philosophers')` |
| 4222 | `onclick` | (страница) | `selectAllPhilosophers()` |
| 4223 | `onclick` | (страница) | `deselectAllPhilosophers()` |
| 4234 | `onchange` | (страница) | `changeFilterMode(this.value)` |
| 4265 | `onchange` | (страница) | `toggleUniformLinkWidth()` |
| 4273 | `onclick` | (страница) | `toggleSection('relations')` |
| 4278 | `onclick` | (страница) | `selectAllRelations()` |
| 4279 | `onclick` | (страница) | `deselectAllRelations()` |
| 4300 | `onclick` | (страница) | `toggleSection('rubrics')` |
| 4305 | `onclick` | (страница) | `selectAllRubrics()` |
| 4306 | `onclick` | (страница) | `deselectAllRubrics()` |
| 4313 | `onclick` | (страница) | `toggleSection('traditions')` |
| 4318 | `onclick` | (страница) | `selectAllTraditions()` |
| 4319 | `onclick` | (страница) | `deselectAllTraditions()` |
| 4339 | `onclick` | (страница) | `togglePanel('pathFinder')` |
| 4352 | `onfocus` | (страница) | `showCustomSelectDropdown('source')` |
| 4353 | `oninput` | (страница) | `filterCustomSelect('source', this.value)` |
| 4366 | `onfocus` | (страница) | `showCustomSelectDropdown('target')` |
| 4367 | `oninput` | (страница) | `filterCustomSelect('target', this.value)` |
| 4372 | `onclick` | (страница) | `findAndShowPath()` |
| 4414 | `onclick` | (страница) | `resetSimulation()` |
| 4415 | `onclick` | (страница) | `toggleSimulationFreeze()` |
| 4416 | `onclick` | (страница) | `centerGraph()` |
| 4417 | `onclick` | (страница) | `toggleGrouping()` |
| 4418 | `onclick` | (страница) | `скачатьБазу()` |
| 4419 | `onclick` | (страница) | `сохранитьВПапку()` |
| 4421 | `onclick` | (страница) | `exportToPNG()` |
| 4422 | `onclick` | (страница) | `exportToSVG()` |
| 4451 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 4457 | `onchange` | (страница) | `handleStatsParameterChange()` |
| 4463 | `onchange` | (страница) | `handleMetricsScopeChange()` |
| 4469 | `onclick` | (страница) | `closeStatsModal()` |
| 4483 | `onclick` | (страница) | `switchStatsView('overview')` |
| 4487 | `onclick` | (страница) | `switchStatsView('comparison')` |
| 4491 | `onclick` | (страница) | `switchStatsView('closest-pairs')` |
| 4495 | `onclick` | (страница) | `switchStatsView('philosopher-comparison')` |
| 4499 | `onclick` | (страница) | `switchStatsView('philosopher-pairs')` |
| 4503 | `onclick` | (страница) | `switchStatsView('degree')` |
| 4507 | `onclick` | (страница) | `switchStatsView('pagerank')` |
| 4511 | `onclick` | (страница) | `switchStatsView('betweenness')` |
| 4515 | `onclick` | (страница) | `switchStatsView('closeness')` |
| 4519 | `onclick` | (страница) | `switchStatsView('eigenvector')` |
| 4523 | `onclick` | (страница) | `switchStatsView('weighted-clustering')` |
| 4527 | `onclick` | (страница) | `switchStatsView('local-cohesion')` |
| 4531 | `onclick` | (страница) | `switchStatsView('rich-club')` |
| 4543 | `onclick` | (страница) | `switchStatsView('problem-generation')` |
| 4547 | `onclick` | (страница) | `switchStatsView('critical-power')` |
| 4551 | `onclick` | (страница) | `switchStatsView('tension')` |
| 4563 | `onclick` | (страница) | `switchStatsView('revolutionary')` |
| 4567 | `onclick` | (страница) | `switchStatsView('paradigm-shift')` |
| 4579 | `onclick` | (страница) | `switchStatsView('influence')` |
| 4583 | `onclick` | (страница) | `switchStatsView('foundational')` |
| 4595 | `onclick` | (страница) | `switchStatsView('synthetic')` |
| 4599 | `onclick` | (страница) | `switchStatsView('dialogical')` |
| 4611 | `onclick` | (страница) | `switchStatsView('coherence')` |
| 4623 | `onclick` | (страница) | `switchStatsView('transformation')` |
| 4627 | `onclick` | (страница) | `switchStatsView('fertility')` |
| 4639 | `onclick` | (страница) | `switchStatsView('complexity')` |
| 4643 | `onclick` | (страница) | `switchStatsView('continuity')` |
| 4647 | `onclick` | (страница) | `switchStatsView('generative')` |
| 4651 | `onclick` | (страница) | `switchStatsView('instrumental')` |
| 4655 | `onclick` | (страница) | `switchStatsView('bridging')` |
| 4659 | `onclick` | (страница) | `switchStatsView('abstraction')` |
| 4663 | `onclick` | (страница) | `switchStatsView('deductive')` |
| 4675 | `onclick` | (страница) | `switchStatsView('temporal-influence')` |
| 4687 | `onclick` | (страница) | `switchStatsView('philosopher-profile')` |
| 4691 | `onclick` | (страница) | `switchStatsView('philosopher-systematic')` |
| 4695 | `onclick` | (страница) | `switchStatsView('philosopher-reach')` |
| 4699 | `onclick` | (страница) | `switchStatsView('philosopher-interdisciplinary')` |
| 4711 | `onclick` | (страница) | `switchStatsView('concept-rankings')` |
| 4715 | `onclick` | (страница) | `switchStatsView('philosopher-rankings')` |
| 14150 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 14229 | `onmouseenter` | `findAndShowPath` | `handlePathArrowHover(event, true)` |
| 14230 | `onmouseleave` | `findAndShowPath` | `handlePathArrowHover(event, false)` |
| 14299 | `onclick` | `findAndShowPath` | `showPathDescriptionsModal()` |
| 14299 | `onmouseover` | `findAndShowPath` | `this.style.background='#2980b9'` |
| 14299 | `onmouseout` | `findAndShowPath` | `this.style.background='#3498db'` |
| 14302 | `onclick` | `findAndShowPath` | `clearPathHighlight()` |
| 14302 | `onmouseover` | `findAndShowPath` | `this.style.background='#c0392b'` |
| 14302 | `onmouseout` | `findAndShowPath` | `this.style.background='#e74c3c'` |
| 14441 | `onclick` | `showPathDescriptionsModal` | `togglePathNodesDescriptions()` |
| 15506 | `onchange` | `initFilters` | `togglePhilosopher('${name}')` |
| 15522 | `onchange` | `initFilters` | `toggleRelation('${type}')` |
| 15540 | `onchange` | `initFilters` | `toggleTradition('${tr.id}')` |
| 15545 | `onclick` | `initFilters` | `onlyTradition('${tr.id}')` |
| 15547 | `onclick` | `initFilters` | `addTradition('${tr.id}')` |
| 15559 | `onchange` | `initFilters` | `toggleRubric('${rubric.id}')` |
| 17797 | `onclick` | `influenceScopeSwitcher` | `setInfluenceScope('${k}')` |
| 20900 | `onclick` | `generateCalculateButton` | `calculateMetricFromModal('${metricKey}')` |
| 21106 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 21138 | `onclick` | `generateMetricResults` | `toggleMetricVisualization('${metricKey}')` |
| 21143 | `onclick` | `generateMetricResults` | `toggleMetricLayout()` |
| 21150 | `onclick` | `generateMetricResults` | `toggleMetricValueMode()` |
| 21194 | `onclick` | `generateMetricResults` | `highlightNodeById('${item.node.id}')` |
| 21202 | `onclick` | `generateMetricResults` | `event.stopPropagation(); showConceptProfileModal('${item.node.id}');` |
| 21209 | `onclick` | `generateMetricResults` | `event.stopPropagation(); toggleMetricDetails(this);` |
| 21346 | `onclick` | `generateDegreeContent` | `highlightNodeById('${d.node.id}')` |
| 21933 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpA=this.value; renderPhilosopherComparison();` |
| 21938 | `onchange` | `generatePhilosopherComparisonContent` | `_pcmpB=this.value; renderPhilosopherComparison();` |
| 22026 | `onclick` | `generatePhilosopherPairsContent` | `_philPairsKind='${k}'; renderPhilosopherPairs();` |
| 22054 | `onclick` | `renderPhilosopherPairs` | `openPhilosopherPair('${a}','${b}')` |
| 22085 | `onclick` | `generateClosestPairsContent` | `_pairsKind='profile'; renderClosestPairs();` |
| 22086 | `onclick` | `generateClosestPairsContent` | `_pairsKind='structure'; renderClosestPairs();` |
| 22091 | `oninput` | `generateClosestPairsContent` | `_pairsMinDegree=+this.value; renderClosestPairs();` |
| 22096 | `oninput` | `generateClosestPairsContent` | `_pairsMinShared=+this.value; renderClosestPairs();` |
| 22100 | `onchange` | `generateClosestPairsContent` | `_pairsCrossAuthor=this.checked; renderClosestPairs();` |
| 22105 | `onchange` | `generateClosestPairsContent` | `_pairsCrossTradition=this.checked; renderClosestPairs();` |
| 22189 | `onclick` | `renderClosestPairs` | `openPairInComparison('${a}','${b}')` |
| 22240 | `onfocus` | `generateComparisonContent` | `showCustomSelectDropdown('${slot}')` |
| 22241 | `oninput` | `generateComparisonContent` | `filterCustomSelect('${slot}', this.value)` |
| 22577 | `onclick` | `generateTemporalInfluenceContent` | `highlightNodeById('${r.node.id}')` |
| 22766 | `onclick` | `generateConceptRankingsContent` | `toggleMetricValueMode()` |
| 22807 | `onclick` | `generateConceptRankingsContent` | `highlightNodeById('${item.id}')` |
| 23540 | `onclick` | `displaySearchResults` | `selectSearchResult('${node.id}', '${context}')` |
| 23706 | `onclick` | `populateCustomSelect` | `selectCustomOption('${type}', '${node.id}')` |
| 24142 | `onclick` | `updateSimilarityLegend` | `showSimilarityOverlay('${similarityOverlay.sourceId}','profile')` |
| 24144 | `onclick` | `updateSimilarityLegend` | `showSimilarityOverlay('${similarityOverlay.sourceId}','structure')` |
| 24160 | `onclick` | `updateSimilarityLegend` | `clearSimilarityOverlay()` |
| 25462 | `onclick` | `similarConceptsBlock` | `openConceptById('${x.id}')` |
| 25475 | `onclick` | `similarConceptsBlock` | `showSimilarityOverlay('${conceptId}','profile')` |
| 25627 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => { if (!isStatsModalOpen) openStatsModal(); switchStatsView('${key}'); }, 120);` |
| 25647 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => showPhilosopherProfileModal('${node.concept}'), 100);` |
| 25656 | `onclick` | `showConceptProfileModal` | `closeConceptProfileModal(); setTimeout(() => openUniversalModal('concept', nodes.find(n => n.id === '${conceptId}'), 'view'), 100);` |
| 25663 | `onclick` | `showConceptProfileModal` | `event.stopPropagation(); toggleProfileOrder('${conceptId}')` |
| 25760 | `onclick` | `showPhilosopherProfileModal` | `closePhilosopherProfileModal(); setTimeout(() => openUniversalModal('philosopher', '${philosopherName}', 'view'), 100);` |
| 25930 | `onclick` | `openAuthModal` | `closeAuthModal()` |
| 25931 | `onclick` | `openAuthModal` | `submitAuth()` |
| 25972 | `onclick` | `showAuthNotice` | `closeAuthModal()` |
| 26090 | `onclick` | `renderAuthControls` | `openAuthModal(\'login\')` |
| 26091 | `onclick` | `renderAuthControls` | `openAuthModal(\'register\')` |
| 26094 | `onclick` | `renderAuthControls` | `authLogout()` |
| 26153 | `onclick` | `openUniversalModal` | `toggleModalMode()` |
| 26163 | `onclick` | `openUniversalModal` | `popModalState()` |
| 26722 | `onclick` | `selectConceptOnGraph` | `cancelGraphSelection()` |
| 27411 | `onclick` | `modalActions` | `${saveFn}()` |
| 27414 | `onclick` | `modalActions` | `closeUniversalModal()` |
| 27418 | `onclick` | `modalActions` | `${deleteFn}(${deleteArg})` |
| 27466 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 27474 | `oninput` | `generatePhilosopherEditContent` | `syncPhilColorFromPicker()` |
| 27478 | `oninput` | `generatePhilosopherEditContent` | `updatePhilColorSample()` |
| 27544 | `onclick` | `generatePhilosopherEditContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view')` |
| 27547 | `onclick` | `generatePhilosopherEditContent` | `openEditConceptModal('${c.id}')` |
| 27552 | `onclick` | `generatePhilosopherEditContent` | `createNewConceptForPhilosopher('${escapeAttr(philosopherName)}')` |
| 27663 | `onclick` | `generateConceptEditContent` | `openUniversalModal('connection', findConnection('${srcId}', '${tgtId}', false), 'view')` |
| 27666 | `onclick` | `generateConceptEditContent` | `openEditConnectionModal('${srcId}', '${tgtId}')` |
| 27669 | `onclick` | `generateConceptEditContent` | `deleteConnection('${srcId}', '${tgtId}')` |
| 27692 | `onclick` | `generateConceptEditContent` | `createNewConnectionForConcept('${conceptData.id}')` |
| 27808 | `onchange` | `generateConnectionEditContent` | `onConnTypeChange()` |
| 27848 | `onclick` | `generateConnectionEditContent` | `swapConnectionConcepts()` |
| 27918 | `onclick` | `handleConnectionEditSearch` | `selectConnectionEditConcept('${type}', '${n.id}')` |
| 28031 | `onclick` | `conceptPlate` | `openUniversalModal('concept', nodes.find(n => n.id === '${node.id}'), 'view');` |
| 28035 | `onclick` | `conceptPlate` | `openUniversalModal('philosopher', '${node.concept}', 'view');` |
| 28229 | `onclick` | `generateConnectionViewContent` | `toggleConnectionSearchSection()` |
| 28252 | `oninput` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 28253 | `onfocus` | `generateConnectionViewContent` | `handleConnectionViewSearch('${type}', this.value)` |
| 28363 | `onclick` | `handleConnectionViewSearch` | `selectConnectionViewConcept('${type}', '${n.id}')` |
| 28468 | `oninput` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 28469 | `onfocus` | `generateConceptViewContent` | `handleModalSearch(this.value)` |
| 28470 | `onclick` | `generateConceptViewContent` | `clearModalSearch()` |
| 28477 | `onclick` | `generateConceptViewContent` | `openUniversalModal('philosopher', '${conceptData.concept}', 'view');` |
| 28482 | `onclick` | `generateConceptViewContent` | `gotoNodeFromModal('${conceptData.id}')` |
| 28485 | `onclick` | `generateConceptViewContent` | `closeUniversalModal(); setTimeout(() => showConceptProfileModal('${conceptData.id}'), 100);` |
| 28536 | `onclick` | `generateConceptViewContent` | `toggleAllConnectionDescriptions(this)` |
| 28546 | `onclick` | `generateConceptViewContent` | `toggleSubsection('internal-${conceptData.id}')` |
| 28577 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 28582 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 28605 | `onclick` | `generateConceptViewContent` | `toggleSubsection('external-${conceptData.id}')` |
| 28636 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${connectedNode.id}'), 'view');` |
| 28641 | `onclick` | `generateConceptViewContent` | `event.stopPropagation(); toggleConnectionDescription('${conceptData.id}-${connectedNode.id}')` |
| 28689 | `onclick` | `generateConceptViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 28697 | `onclick` | `generateConceptViewContent` | `showAllConcepts('${rubricData.id}', '${conceptData.id}')` |
| 28844 | `onclick` | `showAllConcepts` | `openUniversalModal('concept', nodes.find(n => n.id === '${c.id}'), 'view');` |
| 28910 | `onclick` | `similarPhilosophersBlock` | `showPhilosopherDetailModal('${x.id}')` |
| 28954 | `onclick` | `generatePhilosopherViewContent` | `closeUniversalModal(); setTimeout(() => showPhilosopherProfileModal('${philosopherName}'), 100);` |
| 29113 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 29129 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 29145 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('philosopher', '${phil}', 'view');` |
| 29202 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConceptDescriptions(this)` |
| 29210 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); openUniversalModal('concept', nodes.find(n => n.id === '${conceptNode.id}'), 'view');` |
| 29213 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); togglePhilosopherConceptDescription('${conceptNode.id}')` |
| 29268 | `onclick` | `generatePhilosopherViewContent` | `toggleAllPhilosopherConnectionDescriptions(this)` |
| 29280 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-internal-${philosopherName}')` |
| 29299 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${srcNode.id}'), 'view');` |
| 29304 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${tgtNode.id}'), 'view');` |
| 29307 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |
| 29330 | `onclick` | `generatePhilosopherViewContent` | `toggleSubsection('phil-external-${philosopherName}')` |
| 29349 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${srcNode.id}'), 'view');` |
| 29355 | `onclick` | `generatePhilosopherViewContent` | `openUniversalModal('concept', nodes.find(n => n.id === '${tgtNode.id}'), 'view');` |
| 29359 | `onclick` | `generatePhilosopherViewContent` | `event.stopPropagation(); toggleConnectionDescription('phil-${srcNode.id}-${tgtNode.id}')` |


## 7. Диагностика


### 7.1. Ни разу не упомянуты (кандидаты в покойники)

Учтены прямые ссылки, вызовы из разметки и обращения по имени
(строкой или ключом объекта). Остаться в списке законно может лишь то,
что зовётся из консоли или по имени, склеенному из кусков, — последнее
помечено в столбце «оговорка».

| Имя | Вид | Стр. | Длина | Оговорка |
|---|---|---|---|---|
| `findConnectedComponents` | function | 17055 | 34 | — |
| `TENSION_WEIGHTS` | const | 18079 | 5 | — |
| `tensionScales` | function | 18088 | 23 | — |
| `toggleSimilarityKind` | function | 24116 | 5 | — |
| `естьПравки` | function | 26583 | 1 | — |
| `скачатьБазу` | function | 26601 | 6 | — |
| `сохранитьВПапку` | async function | 26610 | 23 | — |
| `generatePhilosopherEditContent` | function | 27453 | 113 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptEditContent` | function | 27571 | 132 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionEditContent` | function | 27786 | 96 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConnectionViewContent` | function | 28200 | 81 | вероятно цель `window[…]` в `modalContentFor` |
| `generateConceptViewContent` | function | 28454 | 264 | вероятно цель `window[…]` в `modalContentFor` |
| `generatePhilosopherViewContent` | function | 28936 | 449 | вероятно цель `window[…]` в `modalContentFor` |


### 7.2. Имена из разметки без глобального определения

| Имя | Статич. | Динам. | Порождается в |
|---|---|---|---|
| `setTimeout` | 0 | 6 | `generateConceptViewContent`, `generatePhilosopherViewContent`, `showConceptProfileModal`, `showPhilosopherProfileModal` |


### 7.3. Необъявленные имена, используемые в скрипте

Обычные глобальные объекты браузера и `d3`; сюда же попадут опечатки.


| Имя | Обращений |
|---|---|
| `document` | 267 |
| `Math` | 120 |
| `Set` | 101 |
| `Object` | 62 |
| `undefined` | 44 |
| `window` | 42 |
| `console` | 39 |
| `Map` | 38 |
| `setTimeout` | 35 |
| `Array` | 28 |
| `d3` | 26 |
| `alert` | 23 |
| `Promise` | 18 |
| `Infinity` | 11 |
| `Boolean` | 9 |
| `clearTimeout` | 8 |
| `Number` | 8 |
| `String` | 6 |
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
