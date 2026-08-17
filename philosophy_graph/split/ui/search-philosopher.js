// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from '../core/ns.js';
import { пустойСписок } from '../core/search.js';
import { openUniversalModal } from '../modal/core.js';
import { highlightPhilosopherOnGraph } from '../render/selection.js';

function handleLegendPhilSearch(query) {
      const box = document.getElementById('legendPhilResults');
      const clearBtn = document.querySelector('#rowPhilosopher .legend-search-clear');
      if (!box) return;
      if (clearBtn) clearBtn.classList.toggle('show', !!(query && query.trim()));
      const найдено = отобратьФилософов(query);
      box.innerHTML = найдено.length
        ? найдено.map(f => {
            const цвет = DATA.philosopherConcepts[f.nameRu]
              ? DATA.philosopherConcepts[f.nameRu].color : '#6c5ce7';
            const сколько = DATA.concepts.filter(c => c.philosopher === f.id).length;
            return `
              <div class="concept-row" data-act-click="pick-philosopher-from-search" data-a1="${f.nameRu}">
                <div class="concept-row-color" style="background:${цвет};box-shadow:0 0 6px ${цвет};"></div>
                <div class="concept-row-text">
                  <div class="concept-row-label">${f.nameRu}</div>
                  <div class="concept-row-phil">${f.years} · концепций ${сколько}</div>
                </div>
              </div>`;
          }).join('')
        : пустойСписок();
      box.classList.add('show');
    }

function pickPhilosopherFromSearch(имя) {
      highlightPhilosopherOnGraph(имя);
      clearLegendPhilSearch();
    }

function clearLegendPhilSearch() {
      const поле = document.getElementById('legendPhilInput');
      const box = document.getElementById('legendPhilResults');
      if (поле) поле.value = '';
      if (box) { box.classList.remove('show'); box.innerHTML = ''; }
    }

function отобратьФилософов(query) {
      const q = (query || '').trim().toLowerCase();
      const словаЗапроса = q ? q.split(/\s+/).filter(Boolean) : [];
      const годится = p => {
        if (!словаЗапроса.length) return true;
        const слова = (p.nameRu + ' ' + (p.nameEn || '')).toLowerCase().split(/\s+/);
        return словаЗапроса.every(з => слова.some(w => w.startsWith(з)));
      };
      return DATA.philosophers.filter(годится)
        .sort((a, b) => (a.birth || 0) - (b.birth || 0));
    }

function handlePhilosopherSearch(query) {
      const box = document.getElementById('philSearchResults');
      const clearBtn = document.querySelector('#philSearch .legend-search-clear');
      if (!box) return;
      if (clearBtn) clearBtn.classList.toggle('show', !!(query && query.trim()));

      const найдено = отобратьФилософов(query);
      box.innerHTML = найдено.length
        ? найдено.map(p => {
            const цвет = DATA.philosopherConcepts[p.nameRu]
              ? DATA.philosopherConcepts[p.nameRu].color : '#6c5ce7';
            // Считаем по идентификатору философа: в concepts поле philosopher
            // хранит именно id («aristotle»), а не имя.
            const сколько = DATA.concepts.filter(c => c.philosopher === p.id).length;
            return `
              <div class="concept-row" data-act-click="select-philosopher-result" data-a1="${p.nameRu}">
                <div class="concept-row-color" style="background:${цвет};box-shadow:0 0 6px ${цвет};"></div>
                <div class="concept-row-text">
                  <div class="concept-row-label">${p.nameRu}</div>
                  <div class="concept-row-phil">${p.years} · концепций ${сколько}</div>
                </div>
              </div>`;
          }).join('')
        : пустойСписок();
      box.classList.add('show');
    }

function selectPhilosopherResult(имя) {
      clearPhilosopherSearch();
      openUniversalModal('philosopher', имя, 'view');
    }

function clearPhilosopherSearch() {
      const поле = document.getElementById('philSearchInput');
      const box = document.getElementById('philSearchResults');
      const clearBtn = document.querySelector('#philSearch .legend-search-clear');
      if (поле) поле.value = '';
      if (box) { box.classList.remove('show'); box.innerHTML = ''; }
      if (clearBtn) clearBtn.classList.remove('show');
    }

export { clearLegendPhilSearch, clearPhilosopherSearch, handleLegendPhilSearch, handlePhilosopherSearch, pickPhilosopherFromSearch, selectPhilosopherResult, отобратьФилософов };
