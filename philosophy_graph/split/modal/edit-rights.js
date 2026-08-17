// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { authSession, canEdit } from '../core/session.js';

import { ModalContext } from './context.js';
import { openUniversalModal } from './core.js';

function refreshOpenModalToolbar() {
      const modal = document.getElementById('universalModal');
      if (!modal || !modal.classList.contains('show')) return;
      if (!ModalContext.currentEntity) return;
      openUniversalModal(ModalContext.currentEntity,
                 ModalContext.currentData,
                 ModalContext.currentMode,
                 { noPush: true });
    }

function renderAuthControls() {
      const box = document.getElementById('authButtons');
      if (!box) return;
      const u = authSession.user;
      // Только значки, как и прочие кнопки панели; что делает каждая —
      // говорит подсказка при наведении.
      if (!u) {
        box.innerHTML =
          '<button data-act-click="open-auth-modal" data-tip="Вход">🔑</button>'
        + '<button data-act-click="open-auth-modal-2" data-tip="Регистрация">📝</button>';
      } else {
        box.innerHTML =
          '<button data-act-click="auth-logout" data-tip="Выйти из учётной записи">🚪</button>'
        + '<span id="authWho" data-tip="' + u.login
        + (u.role === 'admin' ? ' · правка открыта' : '') + '">' + u.login
        + (u.role === 'admin' ? ' · правка открыта' : '') + '</span>';
      }
    }

function refreshEditHints() {
      const may = canEdit();
      const philHeader = Array.from(document.querySelectorAll('.legend-section h4'))
        .find(h => h.textContent.includes('Философ'));
      if (philHeader) {
        philHeader.style.cursor = may ? 'pointer' : '';
        if (may) philHeader.setAttribute('data-tip', 'Shift+клик для добавления философа');
        else philHeader.removeAttribute('data-tip');
      }
      document.querySelectorAll('.legend-item').forEach(item => {
        item.setAttribute('data-tip', may
          ? 'Двойной клик — подробности, Shift+клик — правка'
          : 'Двойной клик — подробности');
      });
    }

export { refreshEditHints, refreshOpenModalToolbar, renderAuthControls };
