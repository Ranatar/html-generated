// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { известить } from '../core/events.js';
import { внутренностиСтроки, отобратьКонцепции, пустойСписок } from '../core/search.js';

function initializeCustomSelects() {
      // Инициализация выпадающих списков с полным списком узлов
      populateCustomSelect('source');
      populateCustomSelect('target');
      
      // П3: обработчик перечислял source и target поимённо и потому не знал
      // о списках, созданных позже — представление статистики рисуется
      // динамически. Теперь закрываются все, кроме того, внутри которого клик.
      document.addEventListener('click', function(event) {
        document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
          if (!wrapper.contains(event.target)) {
            wrapper.querySelector('.custom-select-dropdown')?.classList.remove('show');
          }
        });
      });
    }

function populateCustomSelect(type, query = '') {
      const dropdown = document.getElementById(`${type}SelectDropdown`);
      if (!dropdown) return;

      // Тот же отбор и та же строка, что везде: прежде здесь список
      // выпадал весь, но без цветного кружка философа.
      const узлы = отобратьКонцепции(query);
      dropdown.innerHTML = узлы.length
        ? узлы.map(n => `
            <div class="concept-row" data-act-click="select-custom-option" data-a1="${type}" data-a2="${n.id}">
              ${внутренностиСтроки(n)}
            </div>`).join('')
        : пустойСписок();
    }

function showCustomSelectDropdown(type) {
      const dropdown = document.getElementById(`${type}SelectDropdown`);
      const input = document.getElementById(`${type}SelectInput`);
      
      if (!dropdown || !input) return;
      
      // Показываем все опции при фокусе
      populateCustomSelect(type, input.value);
      dropdown.classList.add('show');
    }

function filterCustomSelect(type, query) {
      const dropdown = document.getElementById(`${type}SelectDropdown`);
      
      if (!dropdown) return;
      
      populateCustomSelect(type, query);
      
      if (!dropdown.classList.contains('show')) {
        dropdown.classList.add('show');
      }
    }

function selectCustomOption(type, nodeId) {
      const node = DATA.nodes.find(n => n.id === nodeId);
      if (!node) return;
      
      const input = document.getElementById(`${type}SelectInput`);
      const dropdown = document.getElementById(`${type}SelectDropdown`);
      
      if (input) {
        input.value = `${node.label} (${node.concept})`;
      }
      if (dropdown) {
        dropdown.classList.remove('show');
      }
      
      if (type === 'source') {
        S.selectedSourceNode = nodeId;
      } else if (type === 'target') {
        S.selectedTargetNode = nodeId;
      } else if (type === 'cmpA' || type === 'cmpB') {
        // П2: те же поля обслуживают сравнение концепций
        if (type === 'cmpA') S._cmpA = nodeId; else S._cmpB = nodeId;
        известить('сравнение-обновить');
      }
    }

export { filterCustomSelect, initializeCustomSelects, populateCustomSelect, selectCustomOption, showCustomSelectDropdown };
