// Оснастка приборов приёмки. НЕ ЧАСТЬ ПРИЛОЖЕНИЯ: подключается
// только измерительными программами, отдельным модульным тегом.
// Сгенерировано tools/rig.mjs.
import { DATA, S, MET, VIEWS } from './core/ns.js';
import { findConnection, getConceptConnections } from './core/graph-index.js';
import { cancelGraphSelection } from './data/mutate.js';
import { toggleMetricValueMode } from './metrics/format.js';
import { handleMetricsScopeChange } from './metrics/scope.js';
import { authLogout, closeAuthModal, openAuthModal, submitAuth } from './modal/auth.js';
import { handleConnectionViewSearch, toggleConnectionSearchSection } from './modal/connection-view.js';
import { closeUniversalModal, openUniversalModal, toggleModalMode } from './modal/core.js';
import { openConceptById, openEditConceptModal, openEditConnectionModal } from './modal/entry.js';
import { closeConceptProfileModal, showConceptProfileModal } from './modal/profile-concept.js';
import { closePhilosopherProfileModal, showPhilosopherProfileModal } from './modal/profile-philosopher.js';
import { closePathDescriptionsModal, findAndShowPath, showPathDescriptionsModal } from './paths/path-ui.js';
import { toggleGrouping } from './render/grouping.js';
import { pickLink, pickNode, toGraph } from './render/picking.js';
import { highlightNodeById } from './render/selection.js';
import { clearSimilarityOverlay, showSimilarityOverlay } from './render/similarity-overlay.js';
import { freezeSimulation, unfreezeSimulation } from './render/simulation.js';
import { selectedNodes } from './state.js';
import { closeStatsModal, handleStatsParameterChange, openStatsModal, switchStatsView } from './stats/modal.js';
import { toggleMetricLayout } from './stats/results.js';
import { selectCustomOption, showCustomSelectDropdown } from './ui/custom-select.js';
import { changeFilterMode, deselectAllPhilosophers, deselectAllRubrics, onlyTradition, selectAllPhilosophers, selectAllRelations, selectAllRubrics, selectAllTraditions } from './ui/legend.js';
import { clearLegendSearch, handleLegendSearch } from './ui/search-legend.js';
import { handleModalSearch } from './ui/search-modal.js';

const A = { DATA, S, MET, VIEWS, authLogout, cancelGraphSelection, changeFilterMode, clearLegendSearch, clearSimilarityOverlay, closeAuthModal, closeConceptProfileModal, closePathDescriptionsModal, closePhilosopherProfileModal, closeStatsModal, closeUniversalModal, deselectAllPhilosophers, deselectAllRubrics, findAndShowPath, findConnection, freezeSimulation, getConceptConnections, handleConnectionViewSearch, handleLegendSearch, handleMetricsScopeChange, handleModalSearch, handleStatsParameterChange, highlightNodeById, onlyTradition, openAuthModal, openConceptById, openEditConceptModal, openEditConnectionModal, openStatsModal, openUniversalModal, pickLink, pickNode, selectAllPhilosophers, selectAllRelations, selectAllRubrics, selectAllTraditions, selectCustomOption, selectedNodes, showConceptProfileModal, showCustomSelectDropdown, showPathDescriptionsModal, showPhilosopherProfileModal, showSimilarityOverlay, submitAuth, switchStatsView, toGraph, toggleConnectionSearchSection, toggleGrouping, toggleMetricLayout, toggleMetricValueMode, toggleModalMode, unfreezeSimulation };
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
