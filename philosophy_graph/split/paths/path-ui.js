// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { isSymmetricLink } from '../core/predicates.js';
import { analyzePath, analyzePathTraditions } from './analysis.js';
import { findShortestPath } from './shortest-path.js';
import { resetHighlight } from '../render/selection.js';
import { freezeSimulation, unfreezeSimulation } from '../render/simulation.js';
import { selectedSourceNode, selectedTargetNode } from '../ui/custom-select.js';

function initPathFinder() {
      const sourceSelect = document.getElementById('sourceSelect');
      const targetSelect = document.getElementById('targetSelect');
      // Б15: старые <select id="sourceSelect"/"targetSelect"> заменены
      // кастомными (sourceSelectInput / sourceSelectDropdown) и в разметке
      // ОТСУТСТВУЮТ. Без этой проверки функция бросала TypeError и уносила
      // с собой весь хвост инициализации после своего вызова:
      // restorePanelStates, второй simulation.on("end"), инициализацию
      // чекбоксов весов/направленности и обработчики режима хронологии.
      if (!sourceSelect || !targetSelect) return;
      
      DATA.nodes.forEach(node => {
        const option1 = document.createElement('option');
        option1.value = node.id;
        option1.textContent = `${node.label} (${node.concept})`;
        sourceSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = node.id;
        option2.textContent = `${node.label} (${node.concept})`;
        targetSelect.appendChild(option2);
      });
    }

function findAndShowPath() {
      // ИЗМЕНЕНО: используем новые переменные вместо старых select
      const sourceId = selectedSourceNode;
      const targetId = selectedTargetNode;
      
      const resultDiv = document.getElementById('pathResult');
      
      const respectChronology = document.getElementById('respectChronology').checked;
      const respectDirectionPath = document.getElementById('respectDirectionPath').checked;
      const useWeightsPath = document.getElementById('useWeightsPath').checked;
      const skipTypoEl = document.getElementById('skipTypologicalPath');
      S.skipTypologicalInPaths = !!(skipTypoEl && skipTypoEl.checked);
      
      // Получаем выбранный режим хронологии
      const selectedChronologyMode = document.getElementById('chronologyModeSelect').value;
      
      if (!sourceId || !targetId) {
        alert('Пожалуйста, выберите обе концепции');
        return;
      }
      
      if (sourceId === targetId) {
        alert('Начальная и конечная концепции должны быть разными');
        return;
      }
      
      // Временно меняем глобальные переменные для поиска пути
      const originalWeights = S.useWeightedPaths;
      const originalDirection = S.respectDirection;
      const originalChronologyMode = S.currentChronologyMode; // НОВОЕ: Сохраняем режим
      
      S.useWeightedPaths = useWeightsPath;
      S.respectDirection = respectDirectionPath;
      S.currentChronologyMode = selectedChronologyMode; // НОВОЕ: Устанавливаем выбранный режим
      
      const path = findShortestPath(sourceId, targetId, respectChronology, respectDirectionPath);
      
      // Восстанавливаем глобальные переменные
      S.useWeightedPaths = originalWeights;
      S.respectDirection = originalDirection;
      S.currentChronologyMode = originalChronologyMode; // НОВОЕ: Восстанавливаем режим
      
      if (!path) {
        const sourceNode = DATA.nodes.find(n => n.id === sourceId);
        const targetNode = DATA.nodes.find(n => n.id === targetId);
        
        let message = 'Эти концепции не связаны';
        if (respectChronology && respectDirectionPath) {
          message += ' хронологически корректным путём с учётом направленности связей.';
        } else if (respectChronology) {
          message += ' хронологически корректным путём.';
        } else if (respectDirectionPath) {
          message += ' с учётом направленности связей.';
        } else {
          message += ' в графе.';
        }

        resultDiv.innerHTML = `
          <div class="path-length">❌ Путь не найден</div>
          <div class="path-chain">${message}<br><br>
          <small style="color: var(--fg-muted);">Попробуйте снять ограничения ниже.</small></div>
          <button data-act-click="clear-path-highlight" style="width: 100%; margin-top: 10px; background: rgba(255,255,255,0.06); color: #e0e0e0; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 12px;">
            Очистить
          </button>
        `;
        resultDiv.classList.add('show');
        resetHighlight();
        return;
      }
      
      // Анализируем путь на анахронизмы
      const anachronismWarnings = analyzePath(path, selectedChronologyMode);

      // Формируем визуальное представление пути
      const pathNodes = path.map(id => DATA.nodes.find(n => n.id === id));
      // Б9: рёбра пути вычисляются один раз на все три потребителя
      const pathLinkList = resolvePathLinkList(path, respectDirectionPath);
      const pathTraditions = analyzePathTraditions(pathNodes);
      const pathTraditionSegments = pathTraditions.segments;
      
      // Создаём HTML с узлами и стрелками
      let pathHTML = '';
      
      for (let i = 0; i < pathNodes.length; i++) {
        const node = pathNodes[i];
        const philosopherColor = DATA.philosopherConcepts[node.concept].color;
        
        // Добавляем узел с философом
        pathHTML += `
          <span class="path-node-container">
            <span class="path-philosopher">${node.concept}</span>
            <span class="path-node" style="border-color: ${philosopherColor};" title="${node.concept}: ${node.description}">
              ${node.label}
            </span>
          </span>
        `;
        
        // Добавляем стрелку, если это не последний узел
        if (i < pathNodes.length - 1) {
          const currentNode = pathNodes[i];
          const nextNode = pathNodes[i + 1];
          
          // Б9: берём готовое ребро сегмента
          const link = pathLinkList[i];
          
          if (link) {
            const linkColor = DATA.relationTypesObj[link.type].color;
            const linkLabel = DATA.relationTypesObj[link.type].label;
            const linkDescription = link.description || '';
            const src = link.source.id || link.source;
            const tgt = link.target.id || link.target;
            
            // Переход между традициями метится на самой стрелке
            const trSeg = pathTraditionSegments ? pathTraditionSegments[i] : null;
            const trCross = trSeg && trSeg.kind === 'crossing';
            const trHint = !trSeg ? ''
              : trSeg.kind === 'crossing'
                ? 'Переход между традициями: ' + trSeg.from.join(', ')
                  + ' → ' + trSeg.to.join(', ')
                : trSeg.kind === 'shared'
                  ? 'Продолжение в традиции: ' + trSeg.shared.join(', ')
                  : 'Внутри одной системы';

            // Определяем направление стрелки
            let arrow;
            if (link.bidirectional) {
              arrow = '↔';
            } else if (src === currentNode.id && tgt === nextNode.id) {
              arrow = '→';
            } else {
              arrow = '←';
            }
            
            // Используем data-атрибуты для хранения информации о связи
            pathHTML += `
              <span class="path-arrow ${link.bidirectional ? 'bidirectional' : ''}${trCross ? ' tradition-crossing' : ''}" 
                  style="color: ${linkColor};" 
                  title="${trHint}"
                  data-link-type="${linkLabel}"
                  data-link-description="${linkDescription.replace(/"/g, '&quot;').replace(/'/g, '&#39;')}"
                  data-act-enter="handle-path-arrow-hover-mouseenter"
                  data-act-leave="handle-path-arrow-hover-mouseleave">
                ${arrow}
              </span>
            `;
          } else {
            pathHTML += `<span class="path-arrow" style="color: var(--fg-muted);">→</span>`;
          }
        }
      }
      
      // Добавляем информацию о хронологии и режиме
      const years = pathNodes.map(n => DATA.philosopherConcepts[n.concept].years);
      const modeNames = {
        strict: 'строгий',
        moderate: 'умеренный', 
        loose: 'свободный'
      };
      
      const chronologyInfo = respectChronology ? 
        `<div style="margin-top: 8px; font-size: 10px; color: var(--fg-muted);">
          <strong>Хронология:</strong> ${years[0]} → ${years[years.length - 1]}<br>
          <strong>Режим:</strong> ${modeNames[selectedChronologyMode]}
        </div>` : '';
      
      // Сводка по традициям. Различных традиций и переходов — порознь:
      // путь «феноменология → аналитическая → феноменология» имеет два
      // перехода при двух традициях, и слитный счёт солгал бы.
      const crossingList = pathTraditions.segments
        .map((s, k) => ({ s, k }))
        .filter(x => x.s.kind === 'crossing');
      const traditionsInfo = `
        <div class="path-traditions-info">
          <strong>Традиции:</strong> различных ${pathTraditions.distinct},
          переходов ${pathTraditions.crossings}
          ${crossingList.length ? '<div class="path-traditions-list">'
            + crossingList.map(x => `
                <div class="path-traditions-item">
                  ${pathNodes[x.k].concept} <em>(${x.s.from.join(', ')})</em>
                  → ${pathNodes[x.k + 1].concept} <em>(${x.s.to.join(', ')})</em>
                </div>`).join('')
            + '</div>' : ''}
        </div>
      `;

      // Формируем предупреждения об анахронизмах
      let warningsHTML = '';
      if (anachronismWarnings.length > 0) {
        warningsHTML = `
          <div class="anachronism-warnings">
            <div class="anachronism-warnings-title">Обнаружены анахронизмы</div>
            ${anachronismWarnings.map(w => `
              <div class="anachronism-item">
                <strong>${w.from}</strong> (${w.fromPhil}, ${w.fromYears}) → 
                <strong>${w.to}</strong> (${w.toPhil}, ${w.toYears})
              </div>
            `).join('')}
            <div style="font-size: 9px; color: #856404; margin-top: 6px; font-style: italic;">
              Эти переходы могут быть хронологически некорректны в строгом режиме.
            </div>
          </div>
        `;
      }
      
      resultDiv.innerHTML = `
        <div class="path-length">✅ Длина пути: ${path.length} концепций</div>
        <div class="path-chain" style="line-height: 2;">${pathHTML}</div>
        ${chronologyInfo}
        ${traditionsInfo}
        ${warningsHTML}
        <button class="path-btn path-btn-blue" data-act-click="show-path-descriptions-modal">
          📋 Показать все описания связей
        </button>
        <button class="path-btn path-btn-red" data-act-click="clear-path-highlight">
          🔄 Сбросить подсветку
        </button>
      `;

      currentPathData = {
        path: path,
        pathNodes: pathNodes,
        respectDirection: respectDirectionPath
      };

      resultDiv.classList.add('show');
      
      // Подсвечиваем путь на графе
      highlightPath(path, respectDirectionPath);
    }

let arrowHoverTimer = null;

const ARROW_HOVER_DELAY = 800;

function handlePathArrowHover(event, isEntering) {
      const arrowElement = event.target;
      const tooltip = document.getElementById('tooltip');
      
      if (isEntering) {
        const linkType = arrowElement.dataset.linkType;
        const linkDescription = arrowElement.dataset.linkDescription;
        
        // Получаем позицию элемента
        const rect = arrowElement.getBoundingClientRect();
        
        // Позиционируем tooltip
        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - 10) + 'px';
        tooltip.style.transform = 'translate(-50%, -100%)'; // Центрируем и поднимаем над элементом
        
        // Сначала показываем тип связи
        tooltip.innerHTML = linkType;
        tooltip.style.opacity = 1;
        
        // Через задержку показываем description, если он есть
        if (linkDescription && linkDescription.trim() !== '') {
          arrowHoverTimer = setTimeout(() => {
            tooltip.innerHTML = `<strong>${linkType}</strong><br><br>${linkDescription}`;
            // Перепозиционируем после изменения содержимого
            const newRect = arrowElement.getBoundingClientRect();
            tooltip.style.left = (newRect.left + newRect.width / 2) + 'px';
            tooltip.style.top = (newRect.top - 10) + 'px';
          }, ARROW_HOVER_DELAY);
        }
      } else {
        // Убираем tooltip
        tooltip.style.opacity = 0;
        if (arrowHoverTimer) {
          clearTimeout(arrowHoverTimer);
          arrowHoverTimer = null;
        }
      }
    }

function resolvePathLinkList(path, respectDirectionFlag = true) {
      const list = [];
      for (let i = 0; i < path.length - 1; i++) {
        const a = typeof path[i] === 'object' ? path[i].id : path[i];
        const b = typeof path[i + 1] === 'object' ? path[i + 1].id : path[i + 1];
        list.push(DATA.links.find(l => {
          const src = l.source.id || l.source;
          const tgt = l.target.id || l.target;
          if (respectDirectionFlag) {
            // C1: прежде читался только флаг. После снятия флага
            // у симметричных типов (D8) ребро, пройденное назад,
            // возвращалось бы null и путь рвался.
            return (src === a && tgt === b) ||
                 (isSymmetricLink(l) && src === b && tgt === a);
          }
          return (src === a && tgt === b) || (src === b && tgt === a);
        }) || null);
      }
      return list;
    }

function highlightPath(path, respectDirection = true) {
      resetHighlight();
      
      const pathSet = new Set(path);
      // Б9: единый источник набора рёбер пути
      const pathLinks = new Set(resolvePathLinkList(path, respectDirection).filter(Boolean));
      
      // Применяем стили
      S.gfxNode.classed("dimmed", d => !pathSet.has(d.id))
        .classed("highlighted", d => pathSet.has(d.id));
      
      // Применяем к видимому пути внутри группы
      S.gfxLinkAll.classed("dimmed", l => !pathLinks.has(l))
        .classed("path-highlight", l => pathLinks.has(l));
    }

function clearPathHighlight() {
      resetHighlight();
      const resultDiv = document.getElementById('pathResult');
      resultDiv.classList.remove('show');
      resultDiv.innerHTML = '';
    }

let currentPathData = null;

function showPathDescriptionsModal() {
      if (!currentPathData) return;
      
      const { path, pathNodes, respectDirection } = currentPathData;
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
              <div class="path-description-header">
                <span class="path-description-nodes">${currentNode.label}</span>
                <span class="path-description-arrow" style="color: ${linkColor};">${arrow}</span>
                <span class="path-description-nodes">${nextNode.label}</span>
              </div>
              <div class="path-description-type">Тип связи: ${linkLabel}</div>
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
              
              <!-- Скрытые описания узлов -->
              <div class="path-node-full-description" id="node-desc-${i}">
                <h4>Узел: ${currentNode.label}</h4>
                <p><strong>Философ:</strong> ${currentNode.concept}</p>
                <p><strong>Описание:</strong> ${currentNode.extendedDescription || 'Описание отсутствует'}</p>
              </div>
            </div>
          `;
        }
      }
      
      // Добавляем описание последнего узла
      const lastNode = pathNodes[pathNodes.length - 1];
      html += `
        <div class="path-node-full-description" id="node-desc-${pathNodes.length - 1}">
          <h4>Конечный узел: ${lastNode.label}</h4>
          <p><strong>Философ:</strong> ${lastNode.concept}</p>
          <p><strong>Описание:</strong> ${lastNode.extendedDescription || 'Описание отсутствует'}</p>
        </div>
      `;
      
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

export { ARROW_HOVER_DELAY, arrowHoverTimer, clearPathHighlight, closePathDescriptionsModal, currentPathData, findAndShowPath, handlePathArrowHover, highlightPath, initPathFinder, nodesDescriptionsVisible, resolvePathLinkList, showPathDescriptionsModal, togglePathNodesDescriptions };
