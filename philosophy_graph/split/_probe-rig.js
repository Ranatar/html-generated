// Оснастка приборов приёмки. НЕ ЧАСТЬ ПРИЛОЖЕНИЯ: подключается
// только измерительными программами, отдельным модульным тегом.
// Сгенерировано tools/rig.mjs.
import { DATA, S, MET, VIEWS } from './core/ns.js';
import { isLinkVisible, isNodeVisible } from './core/visibility.js';
import { DATA_SETS, collectData, hasUnsaved } from './data/save.js';
import { resetBeyondFilter } from './filters/beyond-filter.js';
import { findConnection, getConceptConnections } from './graph/graph-data.js';
import { cancelGraphSelection } from './graph/graph-selection.js';
import { toggleMetricValueMode } from './metrics/format.js';
import { handleMetricsScopeChange } from './metrics/scope.js';
import { authLogout, closeAuthModal, openAuthModal, submitAuth } from './modal/auth.js';
import { handleConnectionViewSearch, toggleConnectionSearchSection } from './modal/connection-view.js';
import { closeUniversalModal, openUniversalModal, toggleModalMode } from './modal/core.js';
import { openConceptById, openEditConceptModal, openEditConnectionModal } from './modal/entry.js';
import { closeConceptProfileModal, showConceptProfileModal } from './modal/profile-concept.js';
import { closePhilosopherProfileModal, showPhilosopherProfileModal } from './modal/profile-philosopher.js';
import { handleModalSearch } from './modal/search.js';
import { closePathDescriptionsModal, showPathDescriptionsModal } from './paths/path-descriptions.js';
import { findAndShowPath } from './paths/path-ui.js';
import { findShortestPath } from './paths/shortest-path.js';
import { linkDrawAlpha, linkVisualState } from './render/draw-link.js';
import { toggleGrouping } from './render/grouping.js';
import { pickLink, pickNode, toGraph } from './render/picking.js';
import { hasNodeClass } from './render/render-state.js';
import { highlightConnected, highlightNodeById, highlightPhilosopherOnGraph, resetHighlight } from './render/selection.js';
import { clearSimilarityOverlay, showSimilarityOverlay } from './render/similarity-overlay.js';
import { freezeSimulation, unfreezeSimulation } from './render/simulation.js';
import { selectedEdges, selectedNodes } from './state/render.js';
import { closeStatsModal, handleStatsParameterChange, openStatsModal, switchStatsView } from './stats/modal.js';
import { toggleMetricLayout } from './stats/results.js';
import { closeAboutModal, openAboutModal } from './ui/about.js';
import { actionNames } from './ui/actions.js';
import { exportToPNG, exportToSVG } from './ui/export.js';
import { changeFilterMode, deselectAllPhilosophers, deselectAllRubrics, onlyTradition, selectAllPhilosophers, selectAllRelations, selectAllRubrics, selectAllTraditions, togglePhilosopher } from './ui/legend.js';
import { clearLegendSearch, handleLegendSearch, selectSearchResult, setSearchKind, toggleLegendSearch } from './ui/search-legend.js';
import { handleLegendLinkSearch, pickLinkEnd } from './ui/search-link.js';
import { clearPhilosopherSearch, handleLegendPhilSearch, handlePhilosopherSearch } from './ui/search-philosopher.js';
import { selectCustomOption, showCustomSelectDropdown } from './widgets/custom-select.js';

const A = { DATA, S, MET, VIEWS, DATA_SETS, actionNames, authLogout, cancelGraphSelection, changeFilterMode, clearLegendSearch, clearPhilosopherSearch, clearSimilarityOverlay, closeAboutModal, closeAuthModal, closeConceptProfileModal, closePathDescriptionsModal, closePhilosopherProfileModal, closeStatsModal, closeUniversalModal, collectData, deselectAllPhilosophers, deselectAllRubrics, exportToPNG, exportToSVG, findAndShowPath, findConnection, findShortestPath, freezeSimulation, getConceptConnections, handleConnectionViewSearch, handleLegendLinkSearch, handleLegendPhilSearch, handleLegendSearch, handleMetricsScopeChange, handleModalSearch, handlePhilosopherSearch, handleStatsParameterChange, hasNodeClass, hasUnsaved, highlightConnected, highlightNodeById, highlightPhilosopherOnGraph, isLinkVisible, isNodeVisible, linkDrawAlpha, linkVisualState, onlyTradition, openAboutModal, openAuthModal, openConceptById, openEditConceptModal, openEditConnectionModal, openStatsModal, openUniversalModal, pickLink, pickLinkEnd, pickNode, resetBeyondFilter, resetHighlight, selectAllPhilosophers, selectAllRelations, selectAllRubrics, selectAllTraditions, selectCustomOption, selectSearchResult, selectedEdges, selectedNodes, setSearchKind, showConceptProfileModal, showCustomSelectDropdown, showPathDescriptionsModal, showPhilosopherProfileModal, showSimilarityOverlay, submitAuth, switchStatsView, toGraph, toggleConnectionSearchSection, toggleGrouping, toggleLegendSearch, toggleMetricLayout, toggleMetricValueMode, toggleModalMode, togglePhilosopher, unfreezeSimulation };
const ИЗМОДУЛЕЙ = { get selectedNodes() { return typeof selectedNodes !== 'undefined' ? selectedNodes : undefined; },
                    get selectedEdges() { return typeof selectedEdges !== 'undefined' ? selectedEdges : undefined; } };

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
  selectedEdges: { get: () => (S.selectedEdges !== undefined ? S.selectedEdges : ИЗМОДУЛЕЙ.selectedEdges) },
  isStatsModalOpen: { get: () => S.isStatsModalOpen },
  simulation: { get: () => S.simulation },
  renderState: { get: () => S.renderState },
  gfxCanvas: { get: () => S.gfxCanvas },
  tickCount: { get: () => S.tickCount },
});

window.__app = A;
window.__appReady = true;
