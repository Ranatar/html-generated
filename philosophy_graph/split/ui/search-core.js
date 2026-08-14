// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from '../core/ns.js';
import { selectSearchResult } from './search-legend.js';

function searchNodes(query) {
      const lowerQuery = query.toLowerCase();
      
      return DATA.nodes.filter(node => {
        // Разбиваем название концепции и имя философа на слова
        const labelWords = node.label.toLowerCase().split(/\s+/);
        const philosopherWords = node.concept.toLowerCase().split(/\s+/);
        
        // Проверяем, начинается ли хотя бы одно слово с запроса
        const labelMatch = labelWords.some(word => word.startsWith(lowerQuery));
        const philosopherMatch = philosopherWords.some(word => word.startsWith(lowerQuery));
        
        return labelMatch || philosopherMatch;
      }).sort((a, b) => {
        // Сначала сортируем по хронологии философа
        const aOrder = DATA.philosopherOrder[a.concept] || 0;
        const bOrder = DATA.philosopherOrder[b.concept] || 0;
        
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
        
        // Затем по названию концепции
        return a.label.localeCompare(b.label);
      });
    }

function displaySearchResults(results, container, context) {
      if (results.length === 0) {
        container.innerHTML = '<div class="search-no-results">Ничего не найдено</div>';
        container.classList.add('show');
        return;
      }
      
      container.innerHTML = results.map(node => `
        <div class="search-result-item" data-act-click="select-search-result" data-a1="${node.id}" data-a2="${context}">
          <div class="search-result-color" style="background: ${DATA.philosopherConcepts[node.concept].color}"></div>
          <div class="search-result-content">
            <div class="search-result-label">${node.label}</div>
            <div class="search-result-philosopher">${node.concept}</div>
          </div>
        </div>
      `).join('');
      
      container.classList.add('show');
    }

function clearModalSearch() {
      const searchInput = document.getElementById('modalSearchInput');
      const resultsContainer = document.getElementById('modalSearchResults');
      const clearBtn = document.querySelector('#modalSearch .legend-search-clear');
      
      if (searchInput) {
        searchInput.value = '';
      }
      if (resultsContainer) {
        resultsContainer.classList.remove('show');
        resultsContainer.innerHTML = '';
      }
      if (clearBtn) {
        clearBtn.classList.remove('show');
      }
    }

export { clearModalSearch, displaySearchResults, searchNodes };
