// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';
import { canEdit } from '../core/session.js';
import { cancelGraphSelection } from '../graph/graph-selection.js';
import { modalContentFor, modalEntityExists } from './assembly.js';
import { initConnectionSearchFields } from './connection-view.js';
import { ModalContext } from './context.js';
import { hasUnsavedChanges } from './dirty.js';
import { clearModalSearch } from './search.js';
import { freezeSimulation, unfreezeSimulation } from '../render/simulation.js';

const modalStack = [];

const MODAL_STACK_MAX = 20;

function pushModalState() {
      const modal = document.getElementById('universalModal');
      if (!modal || !modal.classList.contains('show')) return;
      if (!ModalContext.currentEntity) return;
      const top = modalStack[modalStack.length - 1];
      const cur = { entity: ModalContext.currentEntity,
              data:   ModalContext.currentData,
              mode:   ModalContext.currentMode };
      // повтор того же состояния в стек не кладём, иначе многократный
      // клик по одному узлу размножит его в истории
      if (top && top.entity === cur.entity && top.data === cur.data) return;
      modalStack.push(cur);
      if (modalStack.length > MODAL_STACK_MAX) modalStack.shift();
    }

function popModalState() {
      // уход назад из правки с несохранённым обязан спросить —
      // иначе кнопка «назад» станет способом молча потерять работу
      if (ModalContext.currentMode === 'edit' && hasUnsavedChanges()) {
        if (!confirm('У вас есть несохранённые изменения. Отменить их?')) return;
      }
      const prev = modalStack.pop();
      if (!prev) return;
      openUniversalModal(prev.entity, prev.data, prev.mode, { fromStack: true });
    }

function openUniversalModal(entityType, data, mode = 'view', opts = {}) {
      const modal   = document.getElementById('universalModal');
      const overlay = document.getElementById('modalOverlay');
      const content = document.getElementById('universalModalContent');
      if (!modal || !content) return;

      // состояние, которое сейчас на экране, уходит в историю
      if (!opts.fromStack && !opts.noPush) pushModalState();

      freezeSimulation();

      ModalContext.currentEntity = entityType;
      ModalContext.currentMode   = mode;
      ModalContext.currentData   = data;

      modal.classList.toggle('edit-mode', mode === 'edit');
      // размер окна зависит от сущности: у философа и связи содержимое
      // шире. Селектор по идентификатору здесь уже не работает — окно одно.
      modal.classList.remove('entity-philosopher', 'entity-concept',
                   'entity-connection');
      modal.classList.add('entity-' + entityType);

      let html = modalContentFor(entityType, data, mode);

      const isExistingEntity = modalEntityExists(entityType, data);

      // Слева — кнопка правки и метка режима; справа — «Назад».
      // Кнопка закрытия остаётся в самом углу и в полосу не входит.
      const leftButtons = [];
      const rightButtons = [];
      // ЗАСЛОН ПРАВКИ: без права кнопка не выводится вовсе.
      if (isExistingEntity && canEdit()) {
        leftButtons.push('<button class="mode-switch-btn" data-act-click="toggle-modal-mode">'
               + (mode === 'view' ? '\u270f\ufe0f Редактировать'
                        : '\ud83d\udc41\ufe0f Просмотр')
               + '</button>');
      }
      if (mode === 'edit') {
        leftButtons.push('<span class="modal-edit-badge">'
               + '\u270f\ufe0f Режим редактирования</span>');
      }
      if (modalStack.length > 0) {
        rightButtons.push('<button class="modal-back-btn" data-act-click="pop-modal-state" '
               + 'data-tip="Вернуться к предыдущему окну">\u2190 Назад</button>');
      }
      // Полоса выводится ВСЕГДА: она отводит содержимому верхний отступ
      // и разводит его с кнопкой закрытия даже когда своих кнопок нет.
      html = '<div class="modal-toolbar">'
           + '<div class="modal-toolbar-left">' + leftButtons.join('') + '</div>'
           + '<div class="modal-toolbar-right">' + rightButtons.join('') + '</div>'
           + '</div>' + html;

      content.innerHTML = html;
      content.scrollTop = 0;
      modal.scrollTop = 0;
      modal.classList.add('show');
      overlay.classList.add('show');

      // поля поиска концепций в окне связи навешиваются после вставки
      if (entityType === 'connection'
        && typeof initConnectionSearchFields === 'function') {
        setTimeout(() => initConnectionSearchFields(mode), 0);
      }
    }

function closeUniversalModal() {
      const modal   = document.getElementById('universalModal');
      const overlay = document.getElementById('modalOverlay');
      const content = document.getElementById('universalModalContent');
      if (!modal || !content) return;

      if (typeof clearModalSearch === 'function') clearModalSearch();

      content.innerHTML = '';
      modal.classList.remove('show', 'edit-mode', 'graph-picking',
                   'entity-philosopher', 'entity-concept',
                   'entity-connection');
      overlay.classList.remove('show');

      if (S.graphSelectionContext && S.graphSelectionContext.active
        && typeof cancelGraphSelection === 'function') {
        cancelGraphSelection();
      }

      ModalContext.currentEntity = null;
      ModalContext.currentMode   = 'view';
      ModalContext.currentData   = null;
      ModalContext.editState   = {};
      modalStack.length = 0;   // закрыли — история кончилась

      unfreezeSimulation();
    }

function toggleModalMode() {
      // ЗАСЛОН ПРАВКИ: закрыт вход в правку, но НЕ выход из неё —
      // иначе выход из учётной записи не смог бы перевести окно в просмотр.
      if (ModalContext.currentMode === 'view' && !canEdit()) return;
      const newMode = ModalContext.currentMode === 'view' ? 'edit' : 'view';

      if (ModalContext.currentMode === 'edit' && hasUnsavedChanges()) {
        if (!confirm('У вас есть несохранённые изменения. Отменить их?')) return;
      }

      // смена режима — не переход: в стек не кладётся, иначе «назад»
      // выкидывало бы из правки в просмотр того же самого
      openUniversalModal(ModalContext.currentEntity,
                 ModalContext.currentData,
                 newMode,
                 { noPush: true });
    }

export { MODAL_STACK_MAX, closeUniversalModal, modalStack, openUniversalModal, popModalState, pushModalState, toggleModalMode };
