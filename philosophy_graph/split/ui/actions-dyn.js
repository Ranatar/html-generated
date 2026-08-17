// Сгенерировано tools/delegate.mjs — правки вносить туда.
import { registerActions } from './actions.js';
import { DATA, S } from '../core/ns.js';
import { findConnection } from '../graph/graph-data.js';
import { cancelGraphSelection } from '../graph/graph-selection.js';
import { toggleMetricValueMode } from '../metrics/format.js';
import { authLogout, closeAuthModal, openAuthModal, submitAuth } from '../modal/auth.js';
import { createNewConceptForPhilosopher, createNewConnectionForConcept, onConnTypeChange, selectConnectionEditConcept, swapConnectionConcepts } from '../modal/connection-edit.js';
import { handleConnectionViewSearch, selectConnectionViewConcept, toggleConnectionSearchSection } from '../modal/connection-view.js';
import { closeUniversalModal, openUniversalModal, popModalState, toggleModalMode } from '../modal/core.js';
import { toggleAllConnectionDescriptions, toggleAllPhilosopherConceptDescriptions, toggleAllPhilosopherConnectionDescriptions, toggleConnectionDescription, togglePhilosopherConceptDescription, toggleSubsection } from '../modal/descriptions.js';
import { syncPhilColorFromPicker, updatePhilColorSample } from '../modal/edit-forms.js';
import { gotoNodeFromModal, openConceptById, openEditConceptModal, openEditConnectionModal, showAllConcepts, showPhilosopherDetailModal } from '../modal/entry.js';
import { deleteConnection } from '../modal/persist.js';
import { closeConceptProfileModal, showConceptProfileModal, toggleProfileOrder } from '../modal/profile-concept.js';
import { closePhilosopherProfileModal, showPhilosopherProfileModal } from '../modal/profile-philosopher.js';
import { clearModalSearch, handleModalSearch } from '../modal/search.js';
import { showPathDescriptionsModal, togglePathNodesDescriptions } from '../paths/path-descriptions.js';
import { clearPathHighlight, handlePathArrowHover } from '../paths/path-ui.js';
import { toggleMetricVisualization } from '../render/metric-visualization.js';
import { highlightNodeById } from '../render/selection.js';
import { clearSimilarityOverlay, showSimilarityOverlay } from '../render/similarity-overlay.js';
import { openStatsModal, switchStatsView } from '../stats/modal.js';
import { toggleMetricDetails, toggleMetricLayout } from '../stats/results.js';
import { calculateMetricFromModal } from '../stats/run.js';
import { openPairInComparison, openPhilosopherPair, renderClosestPairs, renderPhilosopherComparison, renderPhilosopherPairs } from '../stats/views/comparison.js';
import { setInfluenceScope } from '../stats/views/philosophical.js';
import { addTradition, onlyTradition, togglePhilosopher, toggleRelation, toggleRubric, toggleTradition } from './legend.js';
import { selectSearchResult } from './search-legend.js';
import { highlightLinkOnGraph, pickLinkEnd } from './search-link.js';
import { clearPhilosopherSearch, handlePhilosopherSearch, pickPhilosopherFromSearch, selectPhilosopherResult } from './search-philosopher.js';
import { filterCustomSelect, selectCustomOption, showCustomSelectDropdown } from '../widgets/custom-select.js';

registerActions({
  "select-search-result": (el, ev) => { selectSearchResult(el.dataset.a1, el.dataset.a2); },
  "cancel-graph-selection": (el, ev) => { cancelGraphSelection(); },
  "close-auth-modal": (el, ev) => { closeAuthModal(); },
  "submit-auth": (el, ev) => { submitAuth(); },
  "open-concept-by-id": (el, ev) => { openConceptById(el.dataset.a1); },
  "show-similarity-overlay": (el, ev) => { showSimilarityOverlay(el.dataset.a1,'profile'); },
  "handle-modal-search-input": (el, ev) => { handleModalSearch(el.value); },
  "handle-modal-search-focus": (el, ev) => { handleModalSearch(el.value); },
  "clear-modal-search": (el, ev) => { clearModalSearch(); },
  "open-universal-modal": (el, ev) => { openUniversalModal('philosopher', el.dataset.a1, 'view'); },
  "goto-node-from-modal": (el, ev) => { gotoNodeFromModal(el.dataset.a1); },
  "close-universal-modal-2": (el, ev) => { closeUniversalModal(); setTimeout(() => showConceptProfileModal(el.dataset.a1), 100); },
  "toggle-all-connection-descriptions": (el, ev) => { toggleAllConnectionDescriptions(el); },
  "toggle-subsection": (el, ev) => { toggleSubsection(`internal-${el.dataset.a1}`); },
  "open-universal-modal-2": (el, ev) => { openUniversalModal('concept', DATA.nodes.find(n => n.id === el.dataset.a1), 'view'); },
  "stop-propagation": (el, ev) => { ev.stopPropagation(); toggleConnectionDescription(`${el.dataset.a1}-${el.dataset.a2}`); },
  "toggle-subsection-2": (el, ev) => { toggleSubsection(`external-${el.dataset.a1}`); },
  "open-universal-modal-3": (el, ev) => { openUniversalModal('concept', DATA.nodes.find(n => n.id === el.dataset.a1), 'view'); },
  "show-all-concepts": (el, ev) => { showAllConcepts(el.dataset.a1, el.dataset.a2); },
  "on-conn-type-change-change": (el, ev) => { onConnTypeChange(); },
  "swap-connection-concepts": (el, ev) => { swapConnectionConcepts(); },
  "select-connection-edit-concept": (el, ev) => { selectConnectionEditConcept(el.dataset.a1, el.dataset.a2); },
  "open-universal-modal-4": (el, ev) => { openUniversalModal('connection', findConnection(el.dataset.a1, el.dataset.a2, false), 'view'); },
  "open-universal-modal-5": (el, ev) => { openUniversalModal('concept', DATA.nodes.find(n => n.id === el.dataset.a1), 'view'); },
  "open-universal-modal-6": (el, ev) => { openUniversalModal('philosopher', el.dataset.a1, 'view'); },
  "toggle-connection-search-section": (el, ev) => { toggleConnectionSearchSection(); },
  "handle-connection-view-search-input": (el, ev) => { handleConnectionViewSearch(el.dataset.a1, el.value); },
  "handle-connection-view-search-focus": (el, ev) => { handleConnectionViewSearch(el.dataset.a1, el.value); },
  "select-connection-view-concept": (el, ev) => { selectConnectionViewConcept(el.dataset.a1, el.dataset.a2); },
  "toggle-modal-mode": (el, ev) => { toggleModalMode(); },
  "pop-modal-state": (el, ev) => { popModalState(); },
  "update-phil-color-sample-input": (el, ev) => { updatePhilColorSample(); },
  "sync-phil-color-from-picker-input": (el, ev) => { syncPhilColorFromPicker(); },
  "open-universal-modal-7": (el, ev) => { openUniversalModal('concept', DATA.nodes.find(n => n.id === el.dataset.a1), 'view'); },
  "open-edit-concept-modal": (el, ev) => { openEditConceptModal(el.dataset.a1); },
  "create-new-concept-for-philosopher": (el, ev) => { createNewConceptForPhilosopher(el.dataset.a1); },
  "open-universal-modal-8": (el, ev) => { openUniversalModal('connection', findConnection(el.dataset.a1, el.dataset.a2, false), 'view'); },
  "open-edit-connection-modal": (el, ev) => { openEditConnectionModal(el.dataset.a1, el.dataset.a2); },
  "delete-connection": (el, ev) => { deleteConnection(el.dataset.a1, el.dataset.a2); },
  "create-new-connection-for-concept": (el, ev) => { createNewConnectionForConcept(el.dataset.a1); },
  "open-auth-modal": (el, ev) => { openAuthModal('login'); },
  "open-auth-modal-2": (el, ev) => { openAuthModal('register'); },
  "auth-logout": (el, ev) => { authLogout(); },
  "open-universal-modal-9": (el, ev) => { openUniversalModal('philosopher', el.dataset.a1, 'view'); },
  "show-philosopher-detail-modal": (el, ev) => { showPhilosopherDetailModal(el.dataset.a1); },
  "handle-philosopher-search-input": (el, ev) => { handlePhilosopherSearch(el.value); },
  "handle-philosopher-search-focus": (el, ev) => { handlePhilosopherSearch(el.value); },
  "clear-philosopher-search": (el, ev) => { clearPhilosopherSearch(); },
  "close-universal-modal-3": (el, ev) => { closeUniversalModal(); setTimeout(() => showPhilosopherProfileModal(el.dataset.a1), 100); },
  "open-universal-modal-10": (el, ev) => { openUniversalModal('philosopher', el.dataset.a1, 'view'); },
  "toggle-all-philosopher-concept-descriptions": (el, ev) => { toggleAllPhilosopherConceptDescriptions(el); },
  "stop-propagation-2": (el, ev) => { ev.stopPropagation(); openUniversalModal('concept', DATA.nodes.find(n => n.id === el.dataset.a1), 'view'); },
  "stop-propagation-3": (el, ev) => { ev.stopPropagation(); togglePhilosopherConceptDescription(el.dataset.a1); },
  "toggle-all-philosopher-connection-descriptions": (el, ev) => { toggleAllPhilosopherConnectionDescriptions(el); },
  "toggle-subsection-3": (el, ev) => { toggleSubsection(`phil-internal-${el.dataset.a1}`); },
  "open-universal-modal-11": (el, ev) => { openUniversalModal('concept', DATA.nodes.find(n => n.id === el.dataset.a1), 'view'); },
  "open-universal-modal-12": (el, ev) => { openUniversalModal('concept', DATA.nodes.find(n => n.id === el.dataset.a1), 'view'); },
  "stop-propagation-4": (el, ev) => { ev.stopPropagation(); toggleConnectionDescription(`phil-${el.dataset.a1}-${el.dataset.a2}`); },
  "toggle-subsection-4": (el, ev) => { toggleSubsection(`phil-external-${el.dataset.a1}`); },
  "close-concept-profile-modal-2": (el, ev) => { closeConceptProfileModal(); setTimeout(() => { if (!S.isStatsModalOpen) openStatsModal(); switchStatsView(el.dataset.a1); }, 120); },
  "close-concept-profile-modal-3": (el, ev) => { closeConceptProfileModal(); setTimeout(() => showPhilosopherProfileModal(el.dataset.a1), 100); },
  "close-concept-profile-modal-4": (el, ev) => { closeConceptProfileModal(); setTimeout(() => openUniversalModal('concept', DATA.nodes.find(n => n.id === el.dataset.a1), 'view'), 100); },
  "stop-propagation-5": (el, ev) => { ev.stopPropagation(); toggleProfileOrder(el.dataset.a1); },
  "close-philosopher-profile-modal-2": (el, ev) => { closePhilosopherProfileModal(); setTimeout(() => openUniversalModal('philosopher', el.dataset.a1, 'view'), 100); },
  "toggle-path-nodes-descriptions": (el, ev) => { togglePathNodesDescriptions(); },
  "open-concept-by-id-2": (el, ev) => { openConceptById(el.dataset.a1); },
  "open-universal-modal-13": (el, ev) => { openUniversalModal('philosopher', el.dataset.a1, 'view'); },
  "open-universal-modal-14": (el, ev) => { openUniversalModal('connection', findConnection(el.dataset.a1, el.dataset.a2, false), 'view'); },
  "clear-path-highlight": (el, ev) => { clearPathHighlight(); },
  "open-concept-by-id-3": (el, ev) => { openConceptById(el.dataset.a1); },
  "open-universal-modal-15": (el, ev) => { openUniversalModal('connection', findConnection(el.dataset.a1, el.dataset.a2, false), 'view'); },
  "handle-path-arrow-hover-mouseenter": (el, ev) => { handlePathArrowHover(ev, true); },
  "handle-path-arrow-hover-mouseleave": (el, ev) => { handlePathArrowHover(ev, false); },
  "show-path-descriptions-modal": (el, ev) => { showPathDescriptionsModal(); },
  "show-similarity-overlay-2": (el, ev) => { showSimilarityOverlay(el.dataset.a1,'profile'); },
  "show-similarity-overlay-3": (el, ev) => { showSimilarityOverlay(el.dataset.a1,'structure'); },
  "clear-similarity-overlay": (el, ev) => { clearSimilarityOverlay(); },
  "calculate-metric-from-modal": (el, ev) => { calculateMetricFromModal(el.dataset.a1); },
  "toggle-metric-visualization": (el, ev) => { toggleMetricVisualization(el.dataset.a1); },
  "toggle-metric-layout": (el, ev) => { toggleMetricLayout(); },
  "toggle-metric-value-mode": (el, ev) => { toggleMetricValueMode(); },
  "highlight-node-by-id": (el, ev) => { highlightNodeById(el.dataset.a1); },
  "stop-propagation-6": (el, ev) => { ev.stopPropagation(); showConceptProfileModal(el.dataset.a1); },
  "stop-propagation-7": (el, ev) => { ev.stopPropagation(); toggleMetricDetails(el); },
  "highlight-node-by-id-2": (el, ev) => { highlightNodeById(el.dataset.a1); },
  "render-philosopher-comparison-change": (el, ev) => { S._pcmpA=el.value; renderPhilosopherComparison(); },
  "render-philosopher-comparison-change-2": (el, ev) => { S._pcmpB=el.value; renderPhilosopherComparison(); },
  "render-philosopher-pairs": (el, ev) => { S._philPairsKind=el.dataset.a1; renderPhilosopherPairs(); },
  "open-philosopher-pair": (el, ev) => { openPhilosopherPair(el.dataset.a1,el.dataset.a2); },
  "render-closest-pairs": (el, ev) => { S._pairsKind='profile'; renderClosestPairs(); },
  "render-closest-pairs-2": (el, ev) => { S._pairsKind='structure'; renderClosestPairs(); },
  "render-closest-pairs-input": (el, ev) => { S._pairsMinDegree=+el.value; renderClosestPairs(); },
  "render-closest-pairs-input-2": (el, ev) => { S._pairsMinShared=+el.value; renderClosestPairs(); },
  "render-closest-pairs-change": (el, ev) => { S._pairsCrossAuthor=el.checked; renderClosestPairs(); },
  "render-closest-pairs-change-2": (el, ev) => { S._pairsCrossTradition=el.checked; renderClosestPairs(); },
  "open-pair-in-comparison": (el, ev) => { openPairInComparison(el.dataset.a1,el.dataset.a2); },
  "show-custom-select-dropdown-focus-3": (el, ev) => { showCustomSelectDropdown(el.dataset.a1); },
  "filter-custom-select-input-3": (el, ev) => { filterCustomSelect(el.dataset.a1, el.value); },
  "highlight-node-by-id-3": (el, ev) => { highlightNodeById(el.dataset.a1); },
  "set-influence-scope": (el, ev) => { setInfluenceScope(el.dataset.a1); },
  "highlight-node-by-id-4": (el, ev) => { highlightNodeById(el.dataset.a1); },
  "toggle-philosopher-change": (el, ev) => { togglePhilosopher(el.dataset.a1); },
  "toggle-relation-change": (el, ev) => { toggleRelation(el.dataset.a1); },
  "toggle-tradition-change": (el, ev) => { toggleTradition(el.dataset.a1); },
  "only-tradition": (el, ev) => { onlyTradition(el.dataset.a1); },
  "add-tradition": (el, ev) => { addTradition(el.dataset.a1); },
  "toggle-rubric-change": (el, ev) => { toggleRubric(el.dataset.a1); },
  "pick-link-end": (el, ev) => { pickLinkEnd(el.dataset.a1, el.dataset.a2); },
  "highlight-link-on-graph": (el, ev) => { highlightLinkOnGraph(el.dataset.a1, el.dataset.a2, el.dataset.a3); },
  "pick-philosopher-from-search": (el, ev) => { pickPhilosopherFromSearch(el.dataset.a1); },
  "select-philosopher-result": (el, ev) => { selectPhilosopherResult(el.dataset.a1); },
  "select-custom-option": (el, ev) => { selectCustomOption(el.dataset.a1, el.dataset.a2); },
});
