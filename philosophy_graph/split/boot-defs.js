// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { closeUniversalModal } from './modal/core.js';
import { closeDetailModal, closePhilosopherDetailModal } from './modal/entry.js';
import { closeConceptProfileModal } from './modal/profile-concept.js';
import { closePhilosopherProfileModal } from './modal/profile-philosopher.js';
import { closePathDescriptionsModal } from './paths/path-descriptions.js';
import { closeAboutModal } from './ui/about.js';

function closeAllModals() {
      // Окно «О проекте» закрывается наравне с прочими: Escape и щелчок по
      // подложке. Прежде его брал только крестик — оно не входило в этот
      // перечень, а перечень и есть единственное место, куда вписывается
      // всякое новое окно.
      if (typeof closeAboutModal === 'function')       closeAboutModal();
      if (typeof closeDetailModal === 'function')      closeDetailModal();
      if (typeof closePhilosopherDetailModal === 'function')  closePhilosopherDetailModal();
      if (typeof closeConceptProfileModal === 'function')   closeConceptProfileModal();
      if (typeof closePhilosopherProfileModal === 'function') closePhilosopherProfileModal();
      if (typeof closePathDescriptionsModal === 'function')   closePathDescriptionsModal();
      if (typeof closeUniversalModal === 'function')      closeUniversalModal();
    }

export { closeAllModals };
