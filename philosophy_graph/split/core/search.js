// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from './ns.js';
import { isNodeVisible } from './visibility.js';

function отобратьКонцепции(query, pool) {
      const q = (query || '').trim().toLowerCase();
      const набор = pool || DATA.nodes;
      // Запрос делится на слова, и КАЖДОЕ должно найти себе слово в названии
      // или в имени философа. Прежде запрос сравнивался целиком с началом
      // каждого отдельного слова, и «миф о пещере» не находил ничего: ни
      // одно слово с этой строки не начинается. Теперь находит — и порядок
      // слов не важен, «пещере миф» тоже.
      const словаЗапроса = q ? q.split(/\s+/).filter(Boolean) : [];
      const годится = n => {
        if (!словаЗапроса.length) return true;   // пустой запрос = показать всё
        const слова = (n.label + ' ' + n.concept).toLowerCase().split(/\s+/);
        return словаЗапроса.every(з => слова.some(w => w.startsWith(з)));
      };
      return набор.filter(годится).sort((a, b) => {
        const ao = DATA.philosopherOrder[a.concept] || 0;
        const bo = DATA.philosopherOrder[b.concept] || 0;
        return ao !== bo ? ao - bo : a.label.localeCompare(b.label);
      });
    }

function внутренностиСтроки(n, хвост) {
      const цвет = DATA.philosopherConcepts[n.concept]
        ? DATA.philosopherConcepts[n.concept].color : '#6c5ce7';
      return `
          <div class="concept-row-color" style="background:${цвет};box-shadow:0 0 6px ${цвет};"></div>
          <div class="concept-row-text">
            <div class="concept-row-label">${n.label}</div>
            <div class="concept-row-phil">${n.concept}</div>
          </div>
          ${хвост || ''}`;
    }

function пустойСписок(текст) {
      return `<div class="concept-row-empty">${текст || 'Ничего не найдено'}</div>`;
    }

function searchNodes(query) {
      return отобратьКонцепции(query);
    }

function displaySearchResults(results, container, context) {
      if (results.length === 0) {
        container.innerHTML = пустойСписок();
        container.classList.add('show');
        return;
      }
      
      // Скрытые отбором ПОКАЗЫВАЮТСЯ в списке: поиск для того и нужен, чтобы
      // находить. Но помечаются — иначе выбор такой концепции выглядел бы
      // поломкой: соседи подсвечиваются, а сама она не появляется.
      container.innerHTML = results.map(node => {
        const скрыта = !isNodeVisible(node);
        const хвост = скрыта
          ? '<div class="concept-row-note" title="">скрыта отбором</div>' : '';
        return `
        <div class="concept-row${скрыта ? ' hidden-by-filter' : ''}"
             data-act-click="select-search-result" data-a1="${node.id}" data-a2="${context}">
          ${внутренностиСтроки(node, хвост)}
        </div>`;
      }).join('');
      
      container.classList.add('show');
    }

export { displaySearchResults, searchNodes, внутренностиСтроки, отобратьКонцепции, пустойСписок };
