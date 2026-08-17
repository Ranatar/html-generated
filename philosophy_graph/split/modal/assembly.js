// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { VIEWS } from '../core/ns.js';

function modalEntityExists(entityType, data) {
      switch (entityType) {
        case 'philosopher':
          return !!data && typeof data === 'string' && data.length > 0;
        case 'concept':
          return !!(data && data.id);
        case 'connection':
          return !!(data && (data.source || data.from)
                   && (data.target || data.to));
        default:
          return false;
      }
    }

function modalContentFor(entityType, data, mode) {
      const name = 'generate'
             + entityType.charAt(0).toUpperCase() + entityType.slice(1)
             + (mode === 'edit' ? 'Edit' : 'View') + 'Content';
      const fn = VIEWS[name];
      if (typeof fn === 'function') return fn(data);

      const fallbackName = 'generate'
             + entityType.charAt(0).toUpperCase() + entityType.slice(1)
             + 'ViewContent';
      const fallback = VIEWS[fallbackName];
      const note = `<div class="modal-form-note warn">`
             + `Этот вид окна ещё не подключён (${name}).</div>`;
      if (mode === 'edit' && typeof fallback === 'function') {
        return note + fallback(data);
      }
      return note;
    }

function modalActions(saveFn, deleteFn, deleteArg, isNew) {
      return `
        <div class="modal-actions">
          <button class="modal-btn modal-btn-primary" data-act-click="сохранить-сущность" data-a1="${saveFn}">
            💾 Сохранить
          </button>
          <button class="modal-btn modal-btn-secondary" data-act-click="close-universal-modal">
            ✖️ Отмена
          </button>
          ${isNew ? '' : `
            <button class="modal-btn modal-btn-danger" data-act-click="удалить-сущность" data-a1="${deleteFn}" data-a2="${(deleteArg || [])[0] || ''}" data-a3="${(deleteArg || [])[1] || ''}">
              🗑️ Удалить
            </button>`}
        </div>`;
    }

export { modalActions, modalContentFor, modalEntityExists };
