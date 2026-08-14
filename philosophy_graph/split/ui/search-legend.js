// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { showDetailModal } from '../modal/entry.js';
import { highlightConnected } from '../render/selection.js';
import { selectedNodes } from '../state.js';
import { clearModalSearch, displaySearchResults, searchNodes } from './search-core.js';

function handleLegendSearch(query) {
      const resultsContainer = document.getElementById('legendSearchResults');
      const clearBtn = document.querySelector('#legendSearch .legend-search-clear');
      
      if (!query || query.trim() === '') {
        resultsContainer.classList.remove('show');
        clearBtn.classList.remove('show');
        return;
      }
      
      clearBtn.classList.add('show');
      
      const results = searchNodes(query);
      displaySearchResults(results, resultsContainer, 'legend');
    }

function selectSearchResult(nodeId, context) {
      const nodeData = DATA.nodes.find(n => n.id === nodeId);
      if (!nodeData) return;
      
      if (context === 'legend') {
        // Выделяем узел и центрируем
        selectedNodes.clear();
        selectedNodes.add(nodeData);
        highlightConnected([nodeData]);
        
        const transform = d3.zoomIdentity
          .translate(S.viewWidth / 2 - nodeData.x, S.viewHeight / 2 - nodeData.y)
          .scale(1.5);
        S.gfxSvg.transition().duration(750).call(S.gfxZoom.transform, transform);
        
        clearLegendSearch();
        
      } else if (context === 'modal') {
        // Переходим к детальной информации об узле
        showDetailModal(nodeData);
        clearModalSearch();
      }
    }

function clearLegendSearch() {
      const searchInput = document.getElementById('legendSearchInput');
      const resultsContainer = document.getElementById('legendSearchResults');
      const clearBtn = document.querySelector('#legendSearch .legend-search-clear');
      
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

export { clearLegendSearch, handleLegendSearch, selectSearchResult };
