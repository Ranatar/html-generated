// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { WEIGHT_WORDS } from '../core/relation-types.js';

import { analyzePathTraditions } from './analysis.js';
import { resolvePathLinkList } from './path-ui.js';
import { freezeSimulation, unfreezeSimulation } from '../render/simulation.js';
import { getContrastColor } from '../util/color.js';

function showPathDescriptionsModal() {
      if (!S.currentPathData) return;
      
      const { path, pathNodes, respectDirection } = S.currentPathData;
      // Б9: тот же единый источник
      const pathLinkList = resolvePathLinkList(path, respectDirection);
      const modal = document.getElementById('pathDescriptionsModal');
      const overlay = document.getElementById('modalOverlay');
      const content = document.getElementById('pathDescriptionsContent');

      freezeSimulation();
      
      const modalTraditions = analyzePathTraditions(pathNodes);
      let html = '<h3>📋 Описания связей в пути</h3>';
      html += `
        <div class="path-traditions-info" style="margin-bottom:14px;">
          <strong>Традиции:</strong> цепочка проходит через
          ${modalTraditions.distinct} и делает ${modalTraditions.crossings}
          ${modalTraditions.crossings === 1 ? 'переход' : 'переходов'}
        </div>
      `;
      
      // Кнопка для показа/скрытия описаний узлов
      html += `
        <button class="toggle-nodes-descriptions-btn" data-act-click="toggle-path-nodes-descriptions">
          Показать описания узлов
        </button>
      `;
      
      // Порядок теперь тот же, что и в самом пути: узел, связь, узел, связь…
      // Прежде описание связи стояло НАД описанием узла, а у исходного узла
      // своего блока не было вовсе — он ютился внутри первого отрезка, тогда
      // как конечный получал отдельный. Читалось это как несимметричное:
      // конец пути назван, начало — нет.
      // Плашка философа — как в окне концепции под её названием: цвет несёт
      // авторство, и строка «Философ: имя» тут лишняя. Заголовок открывает
      // окно концепции: в этом окне она названа, а перейти к ней было нечем.
      const блокУзла = (узел, i, роль) => {
        const цвет = DATA.philosopherConcepts[узел.concept]
          ? DATA.philosopherConcepts[узел.concept].color : '#6c5ce7';
        const ф = DATA.philosophers.find(x => x.nameRu === узел.concept);
        return `
        <div class="path-node-full-description" id="node-desc-${i}">
          <h4 class="path-open" data-act-click="open-concept-by-id-2" data-a1="${узел.id}"
              data-tip="Открыть окно концепции">${роль}: ${узел.label}</h4>
          <div class="philosopher-tag" style="background: ${цвет}; color: ${getContrastColor(цвет)}"
               data-act-click="open-universal-modal-13" data-a1="${узел.concept}"
               data-tip="Открыть окно философа">
            ${узел.concept}${ф ? ' · ' + ф.years : ''}
          </div>
          <p><strong>Описание:</strong> ${узел.extendedDescription || 'Описание отсутствует'}</p>
        </div>
      `;
      };

      html += блокУзла(pathNodes[0], 0, 'Исходный узел');

      // Проходим по всем связям в пути
      for (let i = 0; i < pathNodes.length - 1; i++) {
        const currentNode = pathNodes[i];
        const nextNode = pathNodes[i + 1];
        
        // Б9: берём готовое ребро сегмента
        const link = pathLinkList[i];
        
        if (link) {
          const linkColor = DATA.relationTypesObj[link.type].color;
          const linkLabel = DATA.relationTypesObj[link.type].label;
          const src = link.source.id || link.source;
          const tgt = link.target.id || link.target;
          
          let arrow;
          if (link.bidirectional) {
            arrow = '↔';
          } else if (src === currentNode.id && tgt === nextNode.id) {
            arrow = '→';
          } else {
            arrow = '←';
          }
          
          html += `
            <div class="path-description-item">
              <div class="path-description-header path-open"
                   data-act-click="open-universal-modal-14" data-a1="${src}" data-a2="${tgt}"
                   data-tip="Открыть окно связи">
                <span class="path-description-nodes">${currentNode.label}</span>
                <span class="path-description-arrow" style="color: ${linkColor};">${arrow}</span>
                <span class="path-description-nodes">${nextNode.label}</span>
              </div>
              <div class="path-description-type">Тип связи: ${linkLabel} · вес ${link.weight || 2} — ${WEIGHT_WORDS[link.weight || 2]}</div>
              ${(() => {
                const s = modalTraditions.segments[i];
                if (!s || s.kind === 'internal') return '';
                return s.kind === 'crossing'
                  ? `<div class="path-description-type tradition-crossing-line">
                       Переход между традициями: ${s.from.join(', ')} → ${s.to.join(', ')}
                     </div>`
                  : `<div class="path-description-type">
                       Продолжение в традиции: ${s.shared.join(', ')}
                     </div>`;
              })()}
              ${link.description ? `
                <div class="path-description-text">${link.description}</div>
              ` : `
                <div class="path-description-text" style="color: var(--fg-muted); font-style: italic;">
                  Описание связи отсутствует
                </div>
              `}
            </div>
          `;

        }

        // Узел добавляется НЕЗАВИСИМО от того, нашлась ли связь: прежде он
        // лежал внутри ветки `if (link)`, и одна ненайденная связь уносила
        // с собой весь дальнейший перечень.
        const последний = i === pathNodes.length - 2;
        html += блокУзла(nextNode, i + 1, последний ? 'Конечный узел' : 'Узел');
      }
      
      content.innerHTML = html;
      modal.classList.add('show');
      overlay.classList.add('show');
    }

function closePathDescriptionsModal() {
      const modal = document.getElementById('pathDescriptionsModal');
      const overlay = document.getElementById('modalOverlay');
      
      modal.classList.remove('show');
      overlay.classList.remove('show');

      unfreezeSimulation();
    }

let nodesDescriptionsVisible = false;

function togglePathNodesDescriptions() {
      const nodeDescriptions = document.querySelectorAll('.path-node-full-description');
      const toggleBtn = event.target;
      
      nodesDescriptionsVisible = !nodesDescriptionsVisible;
      
      nodeDescriptions.forEach(desc => {
        if (nodesDescriptionsVisible) {
          desc.classList.add('show');
        } else {
          desc.classList.remove('show');
        }
      });
      
      toggleBtn.textContent = nodesDescriptionsVisible ? 
        'Скрыть описания узлов' : 
        'Показать описания узлов';
    }

export { closePathDescriptionsModal, nodesDescriptionsVisible, showPathDescriptionsModal, togglePathNodesDescriptions };
