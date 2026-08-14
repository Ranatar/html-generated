// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { closeUniversalModal } from './modal/core.js';
import { closeDetailModal, closePhilosopherDetailModal } from './modal/entry.js';
import { closeConceptProfileModal } from './modal/profile-concept.js';
import { closePhilosopherProfileModal } from './modal/profile-philosopher.js';
import { closePathDescriptionsModal } from './paths/path-ui.js';

function closeAllModals() {
      if (typeof closeDetailModal === 'function')      closeDetailModal();
      if (typeof closePhilosopherDetailModal === 'function')  closePhilosopherDetailModal();
      if (typeof closeConceptProfileModal === 'function')   closeConceptProfileModal();
      if (typeof closePhilosopherProfileModal === 'function') closePhilosopherProfileModal();
      if (typeof closePathDescriptionsModal === 'function')   closePathDescriptionsModal();
      if (typeof closeUniversalModal === 'function')      closeUniversalModal();
    }

export { closeAllModals };
