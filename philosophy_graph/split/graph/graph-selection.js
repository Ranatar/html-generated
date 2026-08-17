// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';
import { известить } from '../core/events.js';

function selectConceptOnGraph(type, mode = 'edit') {
      S.graphSelectionContext = { active: true, type: type, mode: mode };

      S.gfxCanvas.style.cursor = 'crosshair';

      // Подложка лежит выше канвы и съела бы клик. На время выбора
      // пропускаем сквозь неё.
      const overlay = document.getElementById('modalOverlay');
      if (overlay) overlay.style.pointerEvents = 'none';

      // Окно занимает середину экрана — приглушаем, но не прячем:
      // должно быть видно и граф, и что форма никуда не делась.
      const modal = document.getElementById('universalModal');
      if (modal) modal.classList.add('graph-picking');

      const old = document.getElementById('graph-selection-hint');
      if (old) old.remove();
      const hint = document.createElement('div');
      hint.id = 'graph-selection-hint';
      hint.innerHTML = '🎯 Выберите '
        + (type === 'source' ? 'начальную' : 'конечную')
        + ' концепцию на графе'
        + '<button data-act-click="cancel-graph-selection" '
        + 'style="margin-left:15px;padding:4px 10px;background:white;color:#6c5ce7;'
        + 'border:none;border-radius:4px;cursor:pointer;font-weight:600;">'
        + '✖️ Отмена</button>';
      document.body.appendChild(hint);
    }

function cancelGraphSelection() {
      S.graphSelectionContext = { active: false, type: null, mode: 'edit' };

      S.gfxCanvas.style.cursor = '';
      const overlay = document.getElementById('modalOverlay');
      if (overlay) overlay.style.pointerEvents = '';
      const modal = document.getElementById('universalModal');
      if (modal) modal.classList.remove('graph-picking');
      const hint = document.getElementById('graph-selection-hint');
      if (hint) hint.remove();
    }

function handleConceptSelection(conceptId) {
      const ctx = S.graphSelectionContext;
      if (!ctx || !ctx.active) return;
      известить('концепция-выбрана-на-графе', ctx.mode, ctx.type, conceptId);
      cancelGraphSelection();
    }

export { cancelGraphSelection, handleConceptSelection, selectConceptOnGraph };
