// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { displaySearchResults, searchNodes } from './search-core.js';

function handleModalSearch(query) {
      const resultsContainer = document.getElementById('modalSearchResults');
      const clearBtn = document.querySelector('#modalSearch .legend-search-clear');
      
      if (!query || query.trim() === '') {
        resultsContainer.classList.remove('show');
        clearBtn.classList.remove('show');
        return;
      }
      
      clearBtn.classList.add('show');
      
      const results = searchNodes(query);
      displaySearchResults(results, resultsContainer, 'modal');
    }

export { handleModalSearch };
