// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { showTemporaryMessage } from '../core/long-task.js';
import { displaySearchResults, отобратьКонцепции } from '../core/search.js';
import { isNodeVisible } from '../core/visibility.js';
import { обновитьЗаметкуОбОтборе } from '../filters/beyond-filter.js';
import { applyFiltersImmediate } from '../filters/filters.js';
import { showDetailModal } from '../modal/entry.js';
import { clearModalSearch } from '../modal/search.js';
import { highlightConnected } from '../render/selection.js';
import { pinnedVisibleNodes, показанныеВопрекиОтбору } from '../state/filters.js';
import { selectedNodes } from '../state/render.js';
import { очиститьПоискСвязи } from './search-link.js';
import { clearLegendPhilSearch } from './search-philosopher.js';

let видПоиска = 'concept';

function toggleLegendSearch() {
      const тело = document.getElementById('searchBody');
      const открыт = тело.style.display !== 'none';
      тело.style.display = открыт ? 'none' : 'block';
      if (открыт) {
        clearLegendSearch();
        clearLegendPhilSearch();
        очиститьПоискСвязи();
      } else {
        setSearchKind('concept');   // по умолчанию — концепции
        const поле = document.getElementById('legendSearchInput');
        if (поле) поле.focus();
      }
    }

function setSearchKind(вид) {
      видПоиска = вид;
      const строки = { philosopher: 'rowPhilosopher', concept: 'rowConcept', connection: 'rowConnection' };
      Object.entries(строки).forEach(([к, id]) => {
        const el = document.getElementById(id);
        if (el) el.style.display = (к === вид) ? (к === 'connection' ? 'block' : 'flex') : 'none';
      });
      ['Philosopher', 'Concept', 'Connection'].forEach(к => {
        const b = document.getElementById('kind' + к);
        if (b) b.classList.toggle('active', к.toLowerCase() === вид);
      });
      // Найденное прежним видом убираем: оно уже не про то, что спрашивают.
      clearLegendSearch();
      clearLegendPhilSearch();
      очиститьПоискСвязи();
    }

function handleLegendSearch(query) {
      const resultsContainer = document.getElementById('legendSearchResults');
      const clearBtn = document.querySelector('#legendSearch .legend-search-clear');
      
      // Пустой запрос больше не закрывает список: он выпадает весь, как в
      // окне просмотра связи. Крестик очистки показывается только когда
      // есть что чистить.
      if (query && query.trim()) clearBtn.classList.add('show');
      else clearBtn.classList.remove('show');

      displaySearchResults(отобратьКонцепции(query), resultsContainer, 'legend');
    }

function selectSearchResult(nodeId, context) {
      const nodeData = DATA.nodes.find(n => n.id === nodeId);
      if (!nodeData) return;
      
      if (context === 'legend') {
        // Скрытую отбором показываем ВОПРЕКИ отбору. Прежде два правила
        // спорили молча: подсветка считала узел участником, отрисовка его
        // не рисовала — соседи загорались вокруг пустого места. Пометка
        // держится в легенде, пока её не снимут.
        if (!isNodeVisible(nodeData)) {
          pinnedVisibleNodes.add(nodeData.id);
          показанныеВопрекиОтбору.add(nodeData.id);
          applyFiltersImmediate();
          обновитьЗаметкуОбОтборе();
          showTemporaryMessage(`«${nodeData.label}» скрыта отбором и показана поверх него`);
        }

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

export { clearLegendSearch, handleLegendSearch, selectSearchResult, setSearchKind, toggleLegendSearch, видПоиска };
