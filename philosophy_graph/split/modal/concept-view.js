// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, VIEWS } from '../core/ns.js';
import { medianNodeDegree, nodeDegreeOf } from '../metrics/network.js';
import { nearestConcepts } from '../metrics/similarity-concepts.js';
import { стрелкаСвязи } from './connection-view.js';

import { getContrastColor } from '../util/color.js';

function similarConceptsBlock(conceptId) {
      let byProfile, byStructure;
      try {
        byProfile = nearestConcepts(conceptId, 'profile', 5);
        byStructure = nearestConcepts(conceptId, 'structure', 5);
      } catch (e) { return ''; }
      if (!byProfile.length && !byStructure.length) return '';

      const nodeById = id => DATA.nodes.find(n => n.id === id);
      const item = (x, unit) => {
        const n = nodeById(x.id);
        if (!n) return '';
        // C5: показывается контраст, косинус — в подсказке при наведении
        const score = (x.contrast !== null && x.contrast !== undefined)
          ? ('×' + x.contrast.toFixed(1))
          : unit(x.value);
        const tip = 'косинус ' + Math.round(x.value * 100) + ' %'
              + ((x.contrast !== null && x.contrast !== undefined)
                ? '; контраст — во сколько сигм сосед выделяется среди прочих'
                : '')
              + (x.tied ? '; неразличимо с соседней строкой' : '');
        return `
          <div class="similar-item${x.tied ? ' similar-tied' : ''}" data-act-click="open-concept-by-id" data-a1="${x.id}" data-tip="${tip}">
            <span class="similar-name">${n.label}</span>
            <span class="similar-author">${n.concept}</span>
            <span class="similar-score">${score}${x.tied ? ' =' : ''}</span>
          </div>`;
      };
      const asPct = v => Math.round(v * 100) + ' %';

      return `
        <div class="rubric-section similar-section">
          <div class="similar-title">
            Похожие концепции
            <button class="similar-map-btn"
                data-act-click="show-similarity-overlay" data-a1="${conceptId}"
                data-tip="Раскрасить граф по сходству с этой концепцией">
              🗺️ Показать на графе
            </button>
          </div>
          <div class="similar-columns">
            <div class="similar-col">
              <div class="similar-col-title">По профилю метрик</div>
              <div class="similar-col-hint">Играют похожую роль в системе</div>
              ${byProfile.length
                ? byProfile.map(x => item(x, asPct)).join('')
                : `<div class="similar-empty">Профиль метрик этой концепции почти пуст (связей: ${nodeDegreeOf(conceptId)}, порог: ${medianNodeDegree()}) — сравнение по нему не показательно</div>`}
            </div>
            <div class="similar-col">
              <div class="similar-col-title">По структуре связей</div>
              <div class="similar-col-hint">Связаны с одними и теми же понятиями</div>
              ${byStructure.length
                ? byStructure.map(x => item(x, asPct)).join('')
                : '<div class="similar-empty">Нет общих соседей</div>'}
            </div>
          </div>
        </div>`;
    }

VIEWS.generateConceptViewContent = function generateConceptViewContent(conceptData) {
      if (!conceptData) return '<p>Концепция не найдена</p>';
      // Получаем рубрики этой концепции
      const conceptRubrics = DATA.conceptToRubrics[conceptData.id] || [];
      
      let html = `
        <div id="modalSearch">
          <div class="legend-search-header">
            <div class="legend-search-icon">🔍</div>
            <div class="legend-search-input-wrapper">
              <input type="text" 
                   class="legend-search-input" 
                   id="modalSearchInput" 
                   placeholder="Поиск других концепций..."
                   data-act-input="handle-modal-search-input"
                   data-act-focus="handle-modal-search-focus">
              <span class="legend-search-clear" data-act-click="clear-modal-search">×</span>
              <div class="search-results" id="modalSearchResults"></div>
            </div>
          </div>
        </div>
        <h2>${conceptData.label}</h2>
        <div class="philosopher-tag" style="background: ${DATA.philosopherConcepts[conceptData.concept].color}; color: ${getContrastColor(DATA.philosopherConcepts[conceptData.concept].color)}; cursor: pointer;" 
           data-act-click="open-universal-modal" data-a1="${conceptData.concept}"
           data-tip="Кликните для просмотра информации о философе">
          ${conceptData.concept}
        </div>
        <div class="description">${conceptData.extendedDescription}</div>
        <button class="goto-node-btn" data-act-click="goto-node-from-modal" data-a1="${conceptData.id}">
          🎯 Перейти к узлу
        </button>
        <button class="goto-node-btn" data-act-click="close-universal-modal-2" data-a1="${conceptData.id}">
          📊 Статистический профиль
        </button>
      `;
      
      // Секция связей узла - МОДИФИЦИРОВАННАЯ ВЕРСИЯ
      const nodeConnections = DATA.links.filter(l => {
        const src = l.source.id || l.source;
        const tgt = l.target.id || l.target;
        return src === conceptData.id || tgt === conceptData.id;
      });

      if (nodeConnections.length > 0) {
        // Разделяем связи на внутренние и внешние
        const internalConnections = [];
        const externalConnections = [];
        
        nodeConnections.forEach(conn => {
          const src = conn.source.id || conn.source;
          const tgt = conn.target.id || conn.target;
          const isSource = src === conceptData.id;
          const connectedNodeId = isSource ? tgt : src;
          const connectedNode = DATA.nodes.find(n => n.id === connectedNodeId);
          
          if (!connectedNode) return;
          
          // Проверяем, тот же философ или нет
          if (connectedNode.concept === conceptData.concept) {
            internalConnections.push({ conn, connectedNode, isSource });
          } else {
            externalConnections.push({ conn, connectedNode, isSource });
          }
        });
        
        // D1: покрытие описаниями считается по КАЖДОЙ подсекции отдельно.
        // Прежде кнопка «развернуть все» показывалась по наличию описаний
        // хотя бы у одной связи узла — и висела над внешним блоком,
        // где раскрывать нечего (у Dasein: внутренних 10 из 10 с описанием,
        // внешних 0 из 18).
        const internalDescribed = internalConnections.filter(x => x.conn.description).length;
        const externalDescribed = externalConnections.filter(x => x.conn.description).length;
        const hasDescriptions = internalDescribed + externalDescribed > 0;
        
        html += `
          <div class="connections-section">
            <div class="connections-title">📊 Связи узла (${nodeConnections.length})</div>
        `;
        
        // Добавляем кнопку для раскрытия/свертывания всех описаний, если есть descriptions
        if (hasDescriptions) {
          html += `
            <button class="toggle-all-descriptions-btn" data-act-click="toggle-all-connection-descriptions">
              ▼ Развернуть все описания связей
            </button>
          `;
        }
        
        // ВНУТРЕННИЕ СВЯЗИ (того же философа)
        if (internalConnections.length > 0) {
          html += `
            <div class="connections-subsection">
              <div class="subsection-header" data-act-click="toggle-subsection" data-a1="${conceptData.id}">
                <div class="subsection-title">
                  🔗 Связи внутри системы ${conceptData.concept}
                  <span style="font-weight: 400; font-size: 11px; color: var(--fg-muted);">(${internalConnections.length}, описаний: ${internalDescribed})</span>
                </div>
                <span class="subsection-toggle" id="toggle-internal-${conceptData.id}">▼</span>
              </div>
              <div class="subsection-content" id="content-internal-${conceptData.id}">
          `;
          
          internalConnections.forEach(({ conn, connectedNode, isSource }) => {
            // Пара концов нужна стрелке, чтобы открыть окно связи. Выше
            // объявления с теми же именами живут в ДРУГОМ обходе — проверка
            // модулей это и поймала, когда я взял их оттуда.
            const src = conn.source.id || conn.source;
            const tgt = conn.target.id || conn.target;
            const linkColor = DATA.relationTypesObj[conn.type].color;
            const linkLabel = DATA.relationTypesObj[conn.type].label;
            
            // Определяем направление стрелки
            let arrow = '';
            if (conn.bidirectional) {
              arrow = '↔';
            } else if (isSource) {
              arrow = '→';
            } else {
              arrow = '←';
            }
            
            html += `
              <div class="connection-item">
                <div class="concept-color" style="background: ${DATA.philosopherConcepts[connectedNode.concept].color}"></div>
                ${стрелкаСвязи(arrow, linkColor, conn.weight, linkLabel, '', src, tgt)}
                <div style="flex-grow: 1;" data-act-click="open-universal-modal-2" data-a1="${connectedNode.id}">
                  <div class="concept-name">${connectedNode.label}</div>
                  <div class="concept-philosopher">${connectedNode.concept}</div>
                </div>
                ${conn.description ? `
                  <button class="connection-toggle" data-act-click="stop-propagation" data-a1="${conceptData.id}" data-a2="${connectedNode.id}">
                    ▼
                  </button>
                ` : ''}
              </div>
              ${conn.description ? `
                <div class="connection-description" id="desc-${conceptData.id}-${connectedNode.id}">
                  ${conn.description}
                </div>
              ` : ''}
            `;
          });
          
          html += `
              </div>
            </div>
          `;
        }
        
        // ВНЕШНИЕ СВЯЗИ (с другими философами)
        if (externalConnections.length > 0) {
          html += `
            <div class="connections-subsection">
              <div class="subsection-header" data-act-click="toggle-subsection-2" data-a1="${conceptData.id}">
                <div class="subsection-title">
                  🌐 Связи с концепциями других философов
                  <span style="font-weight: 400; font-size: 11px; color: var(--fg-muted);">(${externalConnections.length}, описаний: ${externalDescribed})</span>
                </div>
                <span class="subsection-toggle" id="toggle-external-${conceptData.id}">▼</span>
              </div>
              <div class="subsection-content" id="content-external-${conceptData.id}">
          `;
          
          externalConnections.forEach(({ conn, connectedNode, isSource }) => {
            const src = conn.source.id || conn.source;
            const tgt = conn.target.id || conn.target;
            const linkColor = DATA.relationTypesObj[conn.type].color;
            const linkLabel = DATA.relationTypesObj[conn.type].label;
            
            // Определяем направление стрелки
            let arrow = '';
            if (conn.bidirectional) {
              arrow = '↔';
            } else if (isSource) {
              arrow = '→';
            } else {
              arrow = '←';
            }
            
            html += `
              <div class="connection-item">
                <div class="concept-color" style="background: ${DATA.philosopherConcepts[connectedNode.concept].color}"></div>
                ${стрелкаСвязи(arrow, linkColor, conn.weight, linkLabel, '', src, tgt)}
                <div style="flex-grow: 1;" data-act-click="open-universal-modal-2" data-a1="${connectedNode.id}">
                  <div class="concept-name">${connectedNode.label}</div>
                  <div class="concept-philosopher">${connectedNode.concept}</div>
                </div>
                ${conn.description ? `
                  <button class="connection-toggle" data-act-click="stop-propagation" data-a1="${conceptData.id}" data-a2="${connectedNode.id}">
                    ▼
                  </button>
                ` : ''}
              </div>
              ${conn.description ? `
                <div class="connection-description" id="desc-${conceptData.id}-${connectedNode.id}">
                  ${conn.description}
                </div>
              ` : ''}
            `;
          });
          
          html += `
              </div>
            </div>
          `;
        }
        
        html += `</div>`;
      }
      
      // Секция рубрик (без изменений)
      if (conceptRubrics.length > 0) {
        const rubricDataArray = conceptRubrics.map(rubricId => 
          DATA.rubrics.find(r => r.id === rubricId)
        ).filter(r => r !== undefined);
        
        rubricDataArray.forEach(rubricData => {
          const relatedConcepts = DATA.nodes.filter(n => {
            const nRubrics = DATA.conceptToRubrics[n.id] || [];
            return nRubrics.includes(rubricData.id) && n.id !== conceptData.id;
          });
          
          const showAllId = `show-all-${rubricData.id}`;
          const initialDisplay = 10;
          const hasMore = relatedConcepts.length > initialDisplay;
          
          html += `
            <div class="rubric-section">
              <div class="rubric-title">📚 Рубрика: ${rubricData.name}</div>
              <div class="rubric-description">${rubricData.description}</div>
              
              ${relatedConcepts.length > 0 ? `
                <div class="related-concepts">
                  <div class="related-title">Также в этой рубрике (${relatedConcepts.length}):</div>
                  <div id="${showAllId}-container">
                    ${relatedConcepts.slice(0, initialDisplay).map(c => `
                      <div class="concept-item" data-act-click="open-universal-modal-3" data-a1="${c.id}">
                        <div class="concept-color" style="background: ${DATA.philosopherConcepts[c.concept].color}"></div>
                        <div class="concept-name">${c.label}</div>
                        <div class="concept-philosopher">${c.concept}</div>
                      </div>
                    `).join('')}
                  </div>
                  ${hasMore ? `
                    <button class="show-all-concepts-btn" id="${showAllId}" data-act-click="show-all-concepts" data-a1="${rubricData.id}" data-a2="${conceptData.id}">
                      Показать все (${relatedConcepts.length})
                    </button>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          `;
        });
      } else {
        html += `<div class="rubric-section">
          <div class="rubric-description" style="color: var(--fg-muted);">
            Эта концепция пока не отнесена к какой-либо рубрике.
          </div>
        </div>`;
      }

      html += similarConceptsBlock(conceptData.id);

      return html;
    };

export { similarConceptsBlock };
