// Сгенерировано tools/delegate.mjs — правки вносить туда.
import { registerActions } from './actions.js';
import { downloadData, saveToFolder } from '../data/save.js';
import { handleMetricsScopeChange } from '../metrics/scope.js';
import { closeUniversalModal } from '../modal/core.js';
import { closeConceptProfileModal } from '../modal/profile-concept.js';
import { closePhilosopherProfileModal } from '../modal/profile-philosopher.js';
import { closePathDescriptionsModal, findAndShowPath } from '../paths/path-ui.js';
import { toggleGrouping, togglePanel } from '../render/grouping.js';
import { resetNodeSizes } from '../render/metric-visualization.js';
import { centerGraph, resetSimulation, toggleSimulationFreeze } from '../render/simulation.js';
import { closeStatsModal, handleStatsParameterChange, openStatsModal, switchStatsView } from '../stats/modal.js';
import { filterCustomSelect, showCustomSelectDropdown } from './custom-select.js';
import { exportToPNG, exportToSVG } from './export.js';
import { changeFilterMode, deselectAllPhilosophers, deselectAllRelations, deselectAllRubrics, deselectAllTraditions, selectAllPhilosophers, selectAllRelations, selectAllRubrics, selectAllTraditions, toggleSection, toggleUniformLinkWidth } from './legend.js';
import { clearLegendSearch, handleLegendSearch } from './search-legend.js';

registerActions({
  "close-universal-modal": (el, ev) => { closeUniversalModal(); },
  "close-concept-profile-modal": (el, ev) => { closeConceptProfileModal(); },
  "close-philosopher-profile-modal": (el, ev) => { closePhilosopherProfileModal(); },
  "close-path-descriptions-modal": (el, ev) => { closePathDescriptionsModal(); },
  "handle-legend-search-input": (el, ev) => { handleLegendSearch(el.value); },
  "handle-legend-search-focus": (el, ev) => { handleLegendSearch(el.value); },
  "clear-legend-search": (el, ev) => { clearLegendSearch(); },
  "open-stats-modal": (el, ev) => { openStatsModal(); },
  "reset-node-sizes": (el, ev) => { resetNodeSizes(); },
  "toggle-section": (el, ev) => { toggleSection('philosophers'); },
  "select-all-philosophers": (el, ev) => { selectAllPhilosophers(); },
  "deselect-all-philosophers": (el, ev) => { deselectAllPhilosophers(); },
  "change-filter-mode-change": (el, ev) => { changeFilterMode(el.value); },
  "toggle-uniform-link-width-change": (el, ev) => { toggleUniformLinkWidth(); },
  "toggle-section-2": (el, ev) => { toggleSection('relations'); },
  "select-all-relations": (el, ev) => { selectAllRelations(); },
  "deselect-all-relations": (el, ev) => { deselectAllRelations(); },
  "toggle-section-3": (el, ev) => { toggleSection('rubrics'); },
  "select-all-rubrics": (el, ev) => { selectAllRubrics(); },
  "deselect-all-rubrics": (el, ev) => { deselectAllRubrics(); },
  "toggle-section-4": (el, ev) => { toggleSection('traditions'); },
  "select-all-traditions": (el, ev) => { selectAllTraditions(); },
  "deselect-all-traditions": (el, ev) => { deselectAllTraditions(); },
  "toggle-panel": (el, ev) => { togglePanel('pathFinder'); },
  "show-custom-select-dropdown-focus": (el, ev) => { showCustomSelectDropdown('source'); },
  "filter-custom-select-input": (el, ev) => { filterCustomSelect('source', el.value); },
  "show-custom-select-dropdown-focus-2": (el, ev) => { showCustomSelectDropdown('target'); },
  "filter-custom-select-input-2": (el, ev) => { filterCustomSelect('target', el.value); },
  "find-and-show-path": (el, ev) => { findAndShowPath(); },
  "reset-simulation": (el, ev) => { resetSimulation(); },
  "toggle-simulation-freeze": (el, ev) => { toggleSimulationFreeze(); },
  "center-graph": (el, ev) => { centerGraph(); },
  "toggle-grouping": (el, ev) => { toggleGrouping(); },
  "download-data": (el, ev) => { downloadData(); },
  "save-to-folder": (el, ev) => { saveToFolder(); },
  "export-to-png": (el, ev) => { exportToPNG(); },
  "export-to-svg": (el, ev) => { exportToSVG(); },
  "handle-stats-parameter-change-change": (el, ev) => { handleStatsParameterChange(); },
  "handle-stats-parameter-change-change-2": (el, ev) => { handleStatsParameterChange(); },
  "handle-metrics-scope-change-change": (el, ev) => { handleMetricsScopeChange(); },
  "close-stats-modal": (el, ev) => { closeStatsModal(); },
  "switch-stats-view": (el, ev) => { switchStatsView('overview'); },
  "switch-stats-view-2": (el, ev) => { switchStatsView('comparison'); },
  "switch-stats-view-3": (el, ev) => { switchStatsView('closest-pairs'); },
  "switch-stats-view-4": (el, ev) => { switchStatsView('philosopher-comparison'); },
  "switch-stats-view-5": (el, ev) => { switchStatsView('philosopher-pairs'); },
  "switch-stats-view-6": (el, ev) => { switchStatsView('degree'); },
  "switch-stats-view-7": (el, ev) => { switchStatsView('pagerank'); },
  "switch-stats-view-8": (el, ev) => { switchStatsView('betweenness'); },
  "switch-stats-view-9": (el, ev) => { switchStatsView('closeness'); },
  "switch-stats-view-10": (el, ev) => { switchStatsView('eigenvector'); },
  "switch-stats-view-11": (el, ev) => { switchStatsView('weighted-clustering'); },
  "switch-stats-view-12": (el, ev) => { switchStatsView('local-cohesion'); },
  "switch-stats-view-13": (el, ev) => { switchStatsView('rich-club'); },
  "switch-stats-view-14": (el, ev) => { switchStatsView('problem-generation'); },
  "switch-stats-view-15": (el, ev) => { switchStatsView('critical-power'); },
  "switch-stats-view-16": (el, ev) => { switchStatsView('tension'); },
  "switch-stats-view-17": (el, ev) => { switchStatsView('revolutionary'); },
  "switch-stats-view-18": (el, ev) => { switchStatsView('paradigm-shift'); },
  "switch-stats-view-19": (el, ev) => { switchStatsView('influence'); },
  "switch-stats-view-20": (el, ev) => { switchStatsView('foundational'); },
  "switch-stats-view-21": (el, ev) => { switchStatsView('synthetic'); },
  "switch-stats-view-22": (el, ev) => { switchStatsView('dialogical'); },
  "switch-stats-view-23": (el, ev) => { switchStatsView('coherence'); },
  "switch-stats-view-24": (el, ev) => { switchStatsView('transformation'); },
  "switch-stats-view-25": (el, ev) => { switchStatsView('fertility'); },
  "switch-stats-view-26": (el, ev) => { switchStatsView('complexity'); },
  "switch-stats-view-27": (el, ev) => { switchStatsView('continuity'); },
  "switch-stats-view-28": (el, ev) => { switchStatsView('generative'); },
  "switch-stats-view-29": (el, ev) => { switchStatsView('instrumental'); },
  "switch-stats-view-30": (el, ev) => { switchStatsView('bridging'); },
  "switch-stats-view-31": (el, ev) => { switchStatsView('abstraction'); },
  "switch-stats-view-32": (el, ev) => { switchStatsView('deductive'); },
  "switch-stats-view-33": (el, ev) => { switchStatsView('temporal-influence'); },
  "switch-stats-view-34": (el, ev) => { switchStatsView('philosopher-profile'); },
  "switch-stats-view-35": (el, ev) => { switchStatsView('philosopher-systematic'); },
  "switch-stats-view-36": (el, ev) => { switchStatsView('philosopher-reach'); },
  "switch-stats-view-37": (el, ev) => { switchStatsView('philosopher-interdisciplinary'); },
  "switch-stats-view-38": (el, ev) => { switchStatsView('concept-rankings'); },
  "switch-stats-view-39": (el, ev) => { switchStatsView('philosopher-rankings'); },
});
