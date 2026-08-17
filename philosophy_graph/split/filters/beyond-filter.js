// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { applyFiltersImmediate } from './filters.js';
import { pinnedVisibleNodes, показанныеВопрекиОтбору } from '../state/filters.js';

function обновитьЗаметкуОбОтборе() {
      const раздел = document.getElementById('beyondFilterSection');
      const счёт = document.getElementById('beyondFilterCount');
      if (!раздел) return;
      if (счёт) счёт.textContent = показанныеВопрекиОтбору.size;
      раздел.style.display = показанныеВопрекиОтбору.size ? 'block' : 'none';
    }

function resetBeyondFilter() {
      показанныеВопрекиОтбору.forEach(id => pinnedVisibleNodes.delete(id));
      показанныеВопрекиОтбору.clear();
      обновитьЗаметкуОбОтборе();
      applyFiltersImmediate();
    }

export { resetBeyondFilter, обновитьЗаметкуОбОтборе };
