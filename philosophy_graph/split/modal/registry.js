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

export { modalContentFor, modalEntityExists };
