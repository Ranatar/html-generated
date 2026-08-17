// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { displaySearchResults, отобратьКонцепции } from '../core/search.js';

function handleModalSearch(query) {
      const resultsContainer = document.getElementById('modalSearchResults');
      const clearBtn = document.querySelector('#modalSearch .legend-search-clear');
      
      if (query && query.trim()) clearBtn.classList.add('show');
      else clearBtn.classList.remove('show');

      displaySearchResults(отобратьКонцепции(query), resultsContainer, 'modal');
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

export { clearModalSearch, handleModalSearch };
