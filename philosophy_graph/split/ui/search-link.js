// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { внутренностиСтроки, отобратьКонцепции, пустойСписок } from '../core/search.js';
import { requestDraw } from '../render/loop.js';
import { highlightCombined } from '../render/selection.js';
import { selectedEdges, selectedNodes } from '../state/render.js';

const поискСвязи = { from: null, to: null };

function handleLegendLinkSearch(конец, query) {
      const box = document.getElementById(конец === 'from' ? 'legendLinkFromResults' : 'legendLinkToResults');
      if (!box) return;
      // Второй конец сужает выбор: показываем только то, с чем связь есть.
      const другой = конец === 'from' ? поискСвязи.to : поискСвязи.from;
      let набор = DATA.nodes;
      if (другой) {
        const соседи = new Set();
        DATA.links.forEach(l => {
          const a = l.source.id || l.source, b = l.target.id || l.target;
          if (a === другой.id) соседи.add(b);
          if (b === другой.id) соседи.add(a);
        });
        набор = DATA.nodes.filter(n => соседи.has(n.id));
      }
      const найдено = отобратьКонцепции(query, набор);
      box.innerHTML = найдено.length
        ? найдено.map(n => `
            <div class="concept-row" data-act-click="pick-link-end" data-a1="${конец}" data-a2="${n.id}">
              ${внутренностиСтроки(n)}
            </div>`).join('')
        : пустойСписок(другой ? 'Среди связанных ничего не найдено' : 'Ничего не найдено');
      box.classList.add('show');
    }

function pickLinkEnd(конец, id) {
      const узел = DATA.nodes.find(n => n.id === id);
      if (!узел) return;
      поискСвязи[конец] = узел;
      const поле = document.getElementById(конец === 'from' ? 'legendLinkFrom' : 'legendLinkTo');
      if (поле) поле.value = `${узел.label} (${узел.concept})`;
      const box = document.getElementById(конец === 'from' ? 'legendLinkFromResults' : 'legendLinkToResults');
      if (box) { box.classList.remove('show'); box.innerHTML = ''; }
      показатьНайденныеСвязи();
    }

function показатьНайденныеСвязи() {
      const короб = document.getElementById('legendLinkFound');
      if (!короб) return;
      const { from, to } = поискСвязи;
      if (!from || !to) { короб.innerHTML = ''; return; }

      const найденные = DATA.links.filter(l => {
        const a = l.source.id || l.source, b = l.target.id || l.target;
        return (a === from.id && b === to.id) || (a === to.id && b === from.id);
      });
      if (!найденные.length) {
        короб.innerHTML = пустойСписок('Между ними связи нет');
        return;
      }
      короб.innerHTML = найденные.map((l, k) => {
        const t = DATA.relationTypesObj[l.type] || {};
        const a = l.source.id || l.source;
        const стрелка = l.bidirectional ? '↔' : (a === from.id ? '→' : '←');
        return `
          <div class="concept-row" data-act-click="highlight-link-on-graph" data-a1="${from.id}" data-a2="${to.id}" data-a3="${k}">
            <div class="concept-row-color" style="background:${t.color || '#6c5ce7'};"></div>
            <div class="concept-row-text">
              <div class="concept-row-label">${from.label} ${стрелка} ${to.label}</div>
              <div class="concept-row-phil">${t.label || l.type} · вес ${l.weight || 2}</div>
            </div>
          </div>`;
      }).join('');
    }

function highlightLinkOnGraph(idA, idB, k) {
      const найденные = DATA.links.filter(l => {
        const a = l.source.id || l.source, b = l.target.id || l.target;
        return (a === idA && b === idB) || (a === idB && b === idA);
      });
      const связь = найденные[k] || найденные[0];
      if (!связь) return;

      selectedNodes.clear();
      selectedEdges.clear();
      selectedEdges.add(связь);
      highlightCombined();

      // Ведём к ней взгляд: середина связи в середину полотна.
      const a = связь.source, b = связь.target;
      if (a && b && a.x !== undefined && b.x !== undefined) {
        const transform = d3.zoomIdentity
          .translate(S.viewWidth / 2 - (a.x + b.x) / 2, S.viewHeight / 2 - (a.y + b.y) / 2)
          .scale(1.4);
        S.gfxSvg.transition().duration(750).call(S.gfxZoom.transform, transform);
      }
      requestDraw();
    }

function очиститьПоискСвязи() {
      поискСвязи.from = null;
      поискСвязи.to = null;
      ['legendLinkFrom', 'legendLinkTo'].forEach(id => {
        const поле = document.getElementById(id);
        if (поле) поле.value = '';
      });
      ['legendLinkFromResults', 'legendLinkToResults', 'legendLinkFound'].forEach(id => {
        const box = document.getElementById(id);
        if (box) { box.classList.remove('show'); box.innerHTML = ''; }
      });
    }

export { handleLegendLinkSearch, highlightLinkOnGraph, pickLinkEnd, очиститьПоискСвязи, поискСвязи, показатьНайденныеСвязи };
