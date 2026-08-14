// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { renderComparison } from '../stats/views/comparison.js';

let selectedSourceNode = null;

let selectedTargetNode = null;

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
      
      // Фильтруем и сортируем узлы
      let filteredNodes = DATA.nodes;
      
      if (query && query.trim() !== '') {
        const lowerQuery = query.toLowerCase();
        filteredNodes = DATA.nodes.filter(node => {
          const labelWords = node.label.toLowerCase().split(/\s+/);
          const philosopherWords = node.concept.toLowerCase().split(/\s+/);
          
          const labelMatch = labelWords.some(word => word.startsWith(lowerQuery));
          const philosopherMatch = philosopherWords.some(word => word.startsWith(lowerQuery));
          
          return labelMatch || philosopherMatch;
        });
      }
      
      // Сортировка по хронологии философа, затем по названию
      const sortedNodes = filteredNodes.sort((a, b) => {
        const aOrder = DATA.philosopherOrder[a.concept] || 0;
        const bOrder = DATA.philosopherOrder[b.concept] || 0;
        
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
        return a.label.localeCompare(b.label);
      });
      
      if (sortedNodes.length === 0) {
        dropdown.innerHTML = '<div class="search-no-results">Ничего не найдено</div>';
      } else {
        dropdown.innerHTML = sortedNodes.map(node => `
          <div class="custom-select-option" data-act-click="select-custom-option" data-a1="${type}" data-a2="${node.id}">
            <div class="custom-select-option-label">${node.label}</div>
            <div class="custom-select-option-philosopher">${node.concept}</div>
          </div>
        `).join('');
      }
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
        selectedSourceNode = nodeId;
      } else if (type === 'target') {
        selectedTargetNode = nodeId;
      } else if (type === 'cmpA' || type === 'cmpB') {
        // П2: те же поля обслуживают сравнение концепций
        if (type === 'cmpA') S._cmpA = nodeId; else S._cmpB = nodeId;
        if (typeof renderComparison === 'function') renderComparison();
      }
    }

export { filterCustomSelect, initializeCustomSelects, populateCustomSelect, selectCustomOption, selectedSourceNode, selectedTargetNode, showCustomSelectDropdown };
