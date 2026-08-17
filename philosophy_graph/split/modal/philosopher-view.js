// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, VIEWS } from '../core/ns.js';

import { canEdit } from '../core/session.js';
import { nearestPhilosophers } from '../metrics/similarity-philosophers.js';
import { стрелкаСвязи } from './connection-view.js';

import { refreshEditHints } from './edit-rights.js';
import { openEditPhilosopherModal, showPhilosopherDetailModal } from './entry.js';

import { highlightPhilosopherOnGraph } from '../render/selection.js';

import { getContrastColor } from '../util/color.js';
import { formatBirthYear, philosopherBirth, philosopherYears, sortPhilosophersByBirth } from '../util/philosopher-label.js';
import { conjugateVerb, declinePhilosopher } from '../util/ru.js';

function традицииФилософаБлок(имя) {
      const свои = DATA_traditions_of(имя);
      if (!свои.length) {
        return `<div class="rubric-section">
          <div class="rubric-description" style="color: var(--fg-muted);">
            Этот философ пока не отнесён ни к одной традиции.
          </div>
        </div>`;
      }

      return свои.map(tr => {
        const другие = DATA.philosophers
          .filter(f => f.nameRu !== имя && (DATA.philosopherTraditions[f.nameRu] || []).includes(tr.id))
          .sort((a, b) => (a.birth || 0) - (b.birth || 0));
        return `
          <div class="rubric-section">
            <div class="rubric-title">🏛 Традиция: ${tr.name}</div>
            <div class="rubric-description">${tr.description || ''}</div>
            ${другие.length ? `
              <div class="related-concepts">
                <div class="related-title">Также в этой традиции (${другие.length}):</div>
                ${другие.map(f => `
                  <div class="concept-item" data-act-click="open-universal-modal-9" data-a1="${f.nameRu}">
                    <div class="concept-color" style="background: ${DATA.philosopherConcepts[f.nameRu]
                      ? DATA.philosopherConcepts[f.nameRu].color : '#6c5ce7'}"></div>
                    <div class="concept-name">${f.nameRu}</div>
                    <div class="concept-philosopher">${f.years}</div>
                  </div>`).join('')}
              </div>` : `
              <div class="related-concepts">
                <div class="related-title" style="color: var(--fg-muted);">
                  Других философов этой традиции в базе нет
                </div>
              </div>`}
          </div>`;
      }).join('');
    }

function DATA_traditions_of(имя) {
      const ids = DATA.philosopherTraditions[имя] || [];
      return ids.map(id => DATA.traditions.find(t => t.id === id)).filter(Boolean);
    }

function similarPhilosophersBlock(philosopherName) {
      let byProfile, byStyle, byStructure;
      try {
        byProfile = nearestPhilosophers(philosopherName, 'profile', 5);
        byStyle = nearestPhilosophers(philosopherName, 'style', 5);
        byStructure = nearestPhilosophers(philosopherName, 'structure', 5);
      } catch (e) { return ''; }
      if (!byProfile.length && !byStyle.length && !byStructure.length) return '';

      const item = x => `
        <div class="similar-item" data-act-click="show-philosopher-detail-modal" data-a1="${x.id}">
          <span class="similar-name">${x.id}</span>
          <span class="similar-score">${Math.round(x.value * 100)} %</span>
        </div>`;
      const col = (title, hint, list) => `
        <div class="similar-col">
          <div class="similar-col-title">${title}</div>
          <div class="similar-col-hint">${hint}</div>
          ${list.length ? list.map(item).join('') : '<div class="similar-empty">Нет данных</div>'}
        </div>`;

      return `
        <div class="rubric-section similar-section">
          <div class="similar-title">Близкие философы</div>
          <div class="similar-columns">
            ${col('По профилю метрик', 'Похожи показатели систем', byProfile)}
            ${col('По способу построения', 'Строят системы одними типами связей', byStyle)}
            ${col('По структуре', 'Связаны с одними и теми же авторами', byStructure)}
          </div>
        </div>`;
    }

VIEWS.generatePhilosopherViewContent = function generatePhilosopherViewContent(philosopherName) {
      // Находим данные философа
      const philosopherData = DATA.philosophers.find(p => p.nameRu === philosopherName);
      if (!philosopherData) {
        return '<p>Философ не найден</p>';
      }
      
      const philColor = DATA.philosopherConcepts[philosopherName].color;
      
      // Формируем описание с переносами строк
      const formattedDescription = philosopherData.description.replace(/\n\n/g, '<br><br>');
      
      let html = `
        <div id="philSearch">
          <div class="legend-search-header">
            <div class="legend-search-icon">🔍</div>
            <div class="legend-search-input-wrapper">
              <input type="text"
                   class="legend-search-input"
                   id="philSearchInput"
                   placeholder="Поиск других философов..."
                   data-act-input="handle-philosopher-search-input"
                   data-act-focus="handle-philosopher-search-focus">
              <span class="legend-search-clear" data-act-click="clear-philosopher-search">×</span>
              <div class="search-results" id="philSearchResults"></div>
            </div>
          </div>
        </div>
        <h2>${philosopherName}</h2>
        <div class="philosopher-tag" style="background: ${philColor}; color: ${getContrastColor(philColor)}">
          ${philosopherData.years}
        </div>
        <div class="description">${formattedDescription}</div>
        <button class="goto-node-btn" data-act-click="close-universal-modal-3" data-a1="${philosopherName}">
          📊 Статистический профиль
        </button>
      `;
      
      // ========================================
      // РАЗДЕЛ ТРАДИЦИЙ
      // ========================================
      // Признак читается как «в какой традиции его рассматривают», а не
      // «к какой школе он принадлежал» — потому и оборот безличный.
      // Поле множественное: у Хайдеггера традиций три.

      const philTraditions = (philosopherData.traditions || [])
        .map(tid => DATA.traditions.find(t => t.id === tid))
        .filter(t => t !== undefined);

      if (philTraditions.length > 0) {
        const traditionNames = philTraditions.map(t => `
            <span class="rubric-name-tooltip" data-tip="${t.description}">${t.name}</span>
        `).join(', ');

        html += `
          <div class="philosopher-section-title">
            🏛 ${philTraditions.length > 1 ? 'Традиции' : 'Традиция'}
          </div>
          <div class="description">
            Его рассматривают в следующих традициях: ${traditionNames}
          </div>
        `;
      }

      // ========================================
      // РАЗДЕЛ ВЗАИМОДЕЙСТВИЯ С ДРУГИМИ ФИЛОСОФАМИ
      // ========================================

      const philosopherConcepts_ids = DATA.nodes.filter(n => n.concept === philosopherName).map(n => n.id);

      const externalLinks = DATA.links.filter(l => {
        const srcId = l.source.id || l.source;
        const tgtId = l.target.id || l.target;
        const srcNode = DATA.nodes.find(n => n.id === srcId);
        const tgtNode = DATA.nodes.find(n => n.id === tgtId);
        
        if (!srcNode || !tgtNode) return false;
        
        return (srcNode.concept === philosopherName && tgtNode.concept !== philosopherName) ||
             (tgtNode.concept === philosopherName && srcNode.concept !== philosopherName);
      });

      if (externalLinks.length > 0) {
        const interactionsByType = {};
        
        externalLinks.forEach(link => {
          const srcId = link.source.id || link.source;
          const tgtId = link.target.id || link.target;
          const srcNode = DATA.nodes.find(n => n.id === srcId);
          const tgtNode = DATA.nodes.find(n => n.id === tgtId);
          
          const linkType = link.type;
          const isOutgoing = srcNode.concept === philosopherName;
          const otherPhilosopher = isOutgoing ? tgtNode.concept : srcNode.concept;
          
          if (!interactionsByType[linkType]) {
            interactionsByType[linkType] = {
              incoming: new Set(),
              outgoing: new Set(),
              mutual: new Set()   // B2: взаимные отношения — отдельная строка
            };
          }
          
          // B2: bidirectional означает «отношение взаимно», а не «есть оба
          // направленных отношения». Прежний код зачислял такого философа
          // и во входящие, и в исходящие, порождая утверждение, которого
          // в данных нет («Хайдеггер критиковал Левинаса»).
          // Типологическое сходство симметрично по типу, поэтому
          // попадает в ту же строку, что и взаимные отношения,
          // но со своей формулировкой (см. interactionLabels).
          if (link.bidirectional || (DATA.relationTypesObj[linkType] || {}).symmetric) {
            interactionsByType[linkType].mutual.add(otherPhilosopher);
          } else if (isOutgoing) {
            interactionsByType[linkType].outgoing.add(otherPhilosopher);
          } else {
            interactionsByType[linkType].incoming.add(otherPhilosopher);
          }
        });
        
        html += `
          <div class="philosopher-section-title">
            🔗 Взаимодействие с другими философами
          </div>
        `;
        
        Object.keys(interactionsByType).forEach(linkType => {
          const interaction = interactionsByType[linkType];

          const interactionLabels = {
          'influence': { 
            incoming: `Испытал влияние от ${declinePhilosopher(interaction.incoming.size, 'genitive')}`, 
            outgoing: `Оказал влияние на ${declinePhilosopher(interaction.outgoing.size, 'accusative')}`, 
            mutual: `Взаимное влияние с ${declinePhilosopher(interaction.mutual.size, 'instrumental')}` 
          },
          'develop': { 
            incoming: `Развивал концепции ${declinePhilosopher(interaction.incoming.size, 'genitive')}`, // D2: подлежащее — сам философ, conjugateVerb здесь неуместен
            outgoing: `Его концепции ${conjugateVerb(interaction.outgoing.size, 'развивал')} ${declinePhilosopher(interaction.outgoing.size, 'nominative')}`, 
            mutual: `Взаимное развитие концепций с ${declinePhilosopher(interaction.mutual.size, 'instrumental')}` 
          },
          'oppose': { 
            incoming: `Ему ${conjugateVerb(interaction.incoming.size, 'противостоял')} ${declinePhilosopher(interaction.incoming.size, 'nominative')}`, 
            outgoing: `Противостоял ${declinePhilosopher(interaction.outgoing.size, 'dative')}`, 
            mutual: `Взаимное противостояние с ${declinePhilosopher(interaction.mutual.size, 'instrumental')}` 
          },
          'critique': { 
            incoming: `Его ${conjugateVerb(interaction.incoming.size, 'критиковал')} ${declinePhilosopher(interaction.incoming.size, 'nominative')}`, 
            outgoing: `Критиковал ${declinePhilosopher(interaction.outgoing.size, 'accusative')}`, 
            mutual: `Взаимная критика с ${declinePhilosopher(interaction.mutual.size, 'instrumental')}` 
          },
          'dialogue': { 
            incoming: `С ним ${conjugateVerb(interaction.incoming.size, 'полемизировал')} ${declinePhilosopher(interaction.incoming.size, 'nominative')}`, 
            outgoing: `Полемизировал с ${declinePhilosopher(interaction.outgoing.size, 'instrumental')}`, 
            mutual: `Взаимная полемика с ${declinePhilosopher(interaction.mutual.size, 'instrumental')}` 
          },
          'typological': { 
            incoming: `Типологически близок к ${declinePhilosopher(interaction.incoming.size, 'dative')}`, 
            outgoing: `Типологически близок к ${declinePhilosopher(interaction.outgoing.size, 'dative')}`, 
            mutual: `Типологически близок к ${declinePhilosopher(interaction.mutual.size, 'dative')} — без исторического контакта` 
          },
          'synthesize': { 
            incoming: `Синтезировал концепции ${declinePhilosopher(interaction.incoming.size, 'genitive')}`, 
            outgoing: `Его концепции ${conjugateVerb(interaction.outgoing.size, 'синтезировал')} ${declinePhilosopher(interaction.outgoing.size, 'nominative')}`, 
            mutual: `Взаимный синтез с ${declinePhilosopher(interaction.mutual.size, 'instrumental')}` 
          },
        };

          // Функция для получения цвета философа
          const getPhilosopherColor = (philosopherName) => {
            return DATA.philosopherConcepts[philosopherName]?.color || '#6c5ce7';
          };

          const labels = interactionLabels[linkType] || {
            incoming: 'От', outgoing: 'К',
            mutual: `Взаимное отношение с ${declinePhilosopher(interaction.mutual.size, 'instrumental')}`
          };
          
          const hasIncoming = interaction.incoming.size > 0;
          const hasOutgoing = interaction.outgoing.size > 0;
          const hasMutual   = interaction.mutual.size > 0;   // B2
          
          if (!hasIncoming && !hasOutgoing && !hasMutual) return;
          
          // B2: взаимное отношение — одна строка с маркером ↔,
          // а не две противоположно направленные
          if (hasMutual) {
            const philList = sortPhilosophersByBirth(interaction.mutual)
              .map(phil => {
                const color = getPhilosopherColor(phil);
                // D5: год рождения мелким шрифтом, полные даты — в подсказке
                return `<span class="philosopher-box" style="background-color: ${color}; color: ${getContrastColor(color)};" data-tip="${phil}, ${philosopherYears(phil)}" data-act-click="open-universal-modal-10" data-a1="${phil}">${phil}<small class="phil-box-year">${formatBirthYear(philosopherBirth(phil))}</small></span>`;
              })
              .join(' ');
            html += `
              <div class="interaction-item">
                <span class="interaction-direction-label">↔ ${labels.mutual}:</span>
                <span class="philosopher-list">${philList}</span>
              </div>
            `;
          }
          
          if (hasIncoming) {
            const philList = sortPhilosophersByBirth(interaction.incoming)
              .map(phil => {
                const color = getPhilosopherColor(phil);
                // D5: год рождения мелким шрифтом, полные даты — в подсказке
                return `<span class="philosopher-box" style="background-color: ${color}; color: ${getContrastColor(color)};" data-tip="${phil}, ${philosopherYears(phil)}" data-act-click="open-universal-modal-10" data-a1="${phil}">${phil}<small class="phil-box-year">${formatBirthYear(philosopherBirth(phil))}</small></span>`;
              })
              .join(' ');
            html += `
              <div class="interaction-item">
                <span class="interaction-direction-label">← ${labels.incoming}:</span>
                <span class="philosopher-list">${philList}</span>
              </div>
            `;
          }
          
          if (hasOutgoing) {
            const philList = sortPhilosophersByBirth(interaction.outgoing)
              .map(phil => {
                const color = getPhilosopherColor(phil);
                // D5: год рождения мелким шрифтом, полные даты — в подсказке
                return `<span class="philosopher-box" style="background-color: ${color}; color: ${getContrastColor(color)};" data-tip="${phil}, ${philosopherYears(phil)}" data-act-click="open-universal-modal-10" data-a1="${phil}">${phil}<small class="phil-box-year">${formatBirthYear(philosopherBirth(phil))}</small></span>`;
              })
              .join(' ');
            html += `
              <div class="interaction-item">
                <span class="interaction-direction-label">→ ${labels.outgoing}:</span>
                <span class="philosopher-list">${philList}</span>
              </div>
            `;
          }
        });
      }
      
      // ========================================
      // РАЗДЕЛ НАПРАВЛЕНИЙ РАБОТЫ
      // ========================================
      
      const philosopherRubrics = new Set();
      DATA.nodes.filter(n => n.concept === philosopherName).forEach(n => {
        const nodeRubrics = DATA.conceptToRubrics[n.id] || [];
        nodeRubrics.forEach(rubricId => philosopherRubrics.add(rubricId));
      });
      
      if (philosopherRubrics.size > 0) {
        html += `
          <div class="philosopher-section-title">
            📚 Направления работы
          </div>
          <div class="description">
            Работал в следующих направлениях: 
        `;
        
        const rubricNames = Array.from(philosopherRubrics).map(rubricId => {
          const rubric = DATA.rubrics.find(r => r.id === rubricId);
          if (!rubric) return '';
          return `
            <span class="rubric-name-tooltip" data-tip="${rubric.description}">${rubric.name}</span>
          `;
        }).filter(r => r).join(', ');
        
        html += rubricNames + '</div>';
      }
      
      // ========================================
      // РАЗДЕЛ КОНЦЕПЦИЙ ФИЛОСОФА
      // ========================================
      
      const philosopherConceptsNodes = DATA.nodes.filter(n => n.concept === philosopherName);
      
      if (philosopherConceptsNodes.length > 0) {
        html += `
          <div class="philosopher-section-title">
            💡 Концепции философа (${philosopherConceptsNodes.length})
          </div>
          <button class="toggle-all-descriptions-btn" data-act-click="toggle-all-philosopher-concept-descriptions">
            ▼ Развернуть все описания концепций
          </button>
          <div class="philosopher-concepts-section">
        `;
        
        philosopherConceptsNodes.forEach(conceptNode => {
          html += `
            <div class="concept-details-item" data-act-click="stop-propagation-2" data-a1="${conceptNode.id}">
              <div class="concept-details-header">
                <div class="concept-details-name">${conceptNode.label}</div>
                <button class="toggle-concept-desc-btn" data-act-click="stop-propagation-3" data-a1="${conceptNode.id}">▼</button>
              </div>
              <div class="concept-short-desc">${conceptNode.description}</div>
              <div class="concept-extended-desc" id="phil-concept-desc-${conceptNode.id}">
                ${conceptNode.extendedDescription}
              </div>
            </div>
          `;
        });
        
        html += `</div>`;
      }
      
      // ========================================
      // РАЗДЕЛ СВЯЗЕЙ КОНЦЕПЦИЙ ФИЛОСОФА
      // ========================================
      
      const conceptConnections = DATA.links.filter(l => {
        const srcId = l.source.id || l.source;
        const tgtId = l.target.id || l.target;
        return philosopherConcepts_ids.includes(srcId) || philosopherConcepts_ids.includes(tgtId);
      });
      
      if (conceptConnections.length > 0) {
        const internalConnections = [];
        const externalConnectionsData = [];
        
        conceptConnections.forEach(conn => {
          const srcId = conn.source.id || conn.source;
          const tgtId = conn.target.id || conn.target;
          const srcNode = DATA.nodes.find(n => n.id === srcId);
          const tgtNode = DATA.nodes.find(n => n.id === tgtId);
          
          if (!srcNode || !tgtNode) return;
          
          if (srcNode.concept === philosopherName && tgtNode.concept === philosopherName) {
            internalConnections.push({ conn, srcNode, tgtNode });
          } else if (srcNode.concept === philosopherName || tgtNode.concept === philosopherName) {
            externalConnectionsData.push({ conn, srcNode, tgtNode });
          }
        });
        
        // D1: покрытие по подсекциям
        const philInternalDescribed = internalConnections.filter(x => x.conn.description).length;
        const philExternalDescribed = externalConnectionsData.filter(x => x.conn.description).length;
        const hasConnectionDescriptions = philInternalDescribed + philExternalDescribed > 0;
        
        html += `
          <div class="philosopher-section-title">
            🔗 Связи концепций философа (${conceptConnections.length})
          </div>
        `;
        
        if (hasConnectionDescriptions) {
          html += `
            <button class="toggle-all-descriptions-btn" data-act-click="toggle-all-philosopher-connection-descriptions">
              ▼ Развернуть все описания связей
            </button>
          `;
        }
        
        html += `<div class="connections-section">`;
        
        // ВНУТРЕННИЕ СВЯЗИ
        if (internalConnections.length > 0) {
          html += `
            <div class="connections-subsection">
              <div class="subsection-header" data-act-click="toggle-subsection-3" data-a1="${philosopherName}">
                <div class="subsection-title">
                  🔗 Связи внутри системы ${philosopherName}
                  <span style="font-weight: 400; font-size: 11px; color: var(--fg-muted);">(${internalConnections.length}, описаний: ${philInternalDescribed})</span>
                </div>
                <span class="subsection-toggle" id="toggle-phil-internal-${philosopherName}">▼</span>
              </div>
              <div class="subsection-content" id="content-phil-internal-${philosopherName}">
          `;
          
          internalConnections.forEach(({ conn, srcNode, tgtNode }) => {
            const linkColor = DATA.relationTypesObj[conn.type].color;
            const linkLabel = DATA.relationTypesObj[conn.type].label;
            const arrow = conn.bidirectional ? '↔' : '→';
            
            html += `
              <div class="connection-item">
                <div class="concept-color" style="background: ${philColor}"></div>
                <div style="flex-grow: 1; display: flex; align-items: center; gap: 8px;">
                  <span data-act-click="open-universal-modal-11" data-a1="${srcNode.id}" style="cursor: pointer;">${srcNode.label}</span>
                  ${стрелкаСвязи(arrow, linkColor, conn.weight, linkLabel, '', srcNode.id, tgtNode.id)}
                  <span data-act-click="open-universal-modal-12" data-a1="${tgtNode.id}" style="cursor: pointer;">${tgtNode.label}</span>
                </div>
                ${conn.description ? `
                  <button class="connection-toggle" data-act-click="stop-propagation-4" data-a1="${srcNode.id}" data-a2="${tgtNode.id}">
                    ▼
                  </button>
                ` : ''}
              </div>
              ${conn.description ? `
                <div class="connection-description" id="desc-phil-${srcNode.id}-${tgtNode.id}">
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
        
        // ВНЕШНИЕ СВЯЗИ
        if (externalConnectionsData.length > 0) {
          html += `
            <div class="connections-subsection">
              <div class="subsection-header" data-act-click="toggle-subsection-4" data-a1="${philosopherName}">
                <div class="subsection-title">
                  🌐 Связи с концепциями других философов
                  <span style="font-weight: 400; font-size: 11px; color: var(--fg-muted);">(${externalConnectionsData.length}, описаний: ${philExternalDescribed})</span>
                </div>
                <span class="subsection-toggle" id="toggle-phil-external-${philosopherName}">▼</span>
              </div>
              <div class="subsection-content" id="content-phil-external-${philosopherName}">
          `;
          
          externalConnectionsData.forEach(({ conn, srcNode, tgtNode }) => {
            const linkColor = DATA.relationTypesObj[conn.type].color;
            const linkLabel = DATA.relationTypesObj[conn.type].label;
            const arrow = conn.bidirectional ? '↔' : '→';
            
            html += `
              <div class="connection-item">
                <div class="concept-color" style="background: ${DATA.philosopherConcepts[srcNode.concept].color}"></div>
                <div style="flex-grow: 1; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <span data-act-click="open-universal-modal-11" data-a1="${srcNode.id}" style="cursor: pointer;">${srcNode.label}</span>
                  <span style="font-size: 10px; color: var(--fg-muted);">(${srcNode.concept})</span>
                  ${стрелкаСвязи(arrow, linkColor, conn.weight, linkLabel, '', srcNode.id, tgtNode.id)}
                  <span data-act-click="open-universal-modal-12" data-a1="${tgtNode.id}" style="cursor: pointer;">${tgtNode.label}</span>
                  <span style="font-size: 10px; color: var(--fg-muted);">(${tgtNode.concept})</span>
                </div>
                ${conn.description ? `
                  <button class="connection-toggle" data-act-click="stop-propagation-4" data-a1="${srcNode.id}" data-a2="${tgtNode.id}">
                    ▼
                  </button>
                ` : ''}
              </div>
              ${conn.description ? `
                <div class="connection-description" id="desc-phil-${srcNode.id}-${tgtNode.id}">
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

      html += традицииФилософаБлок(philosopherName);
      html += similarPhilosophersBlock(philosopherName);

      return html;
    };

function makeLegendsEditable() {
      // Записи легенды пересоздаются целиком, и старые обработчики уходят
      // вместе с узлами. А вот заголовок секции переживает пересборку,
      // и каждый вызов вешал бы на него ещё один обработчик.
      //
      // ДЕФЕКТ M-4: прежде здесь стоял querySelector('.legend-section h4'),
      // а он возвращает ПЕРВЫЙ h4 документа — «📊 Статистический анализ».
      // Проверка .includes('Философы') на нём никогда не проходила,
      // и shift+клик по заголовку «Философы:» не работал ни разу.
      const philHeader = Array.from(document.querySelectorAll('.legend-section h4'))
        .find(h => h.textContent.includes('Философ'));
      if (philHeader && philHeader.dataset.editableWired !== '1') {
        philHeader.dataset.editableWired = '1';
        philHeader.addEventListener('click', function(event) {
          // ЗАСЛОН ПРАВКИ. Право спрашивается в миг нажатия, а не при
          // навешивании: обработчик переживает вход и выход.
          if (event.shiftKey && canEdit()) {
            event.preventDefault();
            event.stopPropagation();
            openEditPhilosopherModal();
          }
        });
      }
      // Вид нажимаемого ставится по праву, а не безусловно (см.
      // refreshEditHints): невошедшему о правке не сообщается ничем.
      refreshEditHints();
      
      // Делаем каждого философа кликабельным
      document.querySelectorAll('.legend-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
          const philosopherName = checkbox.value;
          
          // ЩЕЛЧОК ПО СТРОКЕ ВЫБИРАЕТ ФИЛОСОФА НА ГРАФЕ, а не выключает
          // его. Прежде подпись была привязана к галочке (`for`), и щелчок
          // по строке снимал философа с отбора; двойной щелчок при этом
          // успевал выключить и снова включить его — мигание на ровном
          // месте. Галочка осталась галочкой, строка стала выбором.
          //
          // Порядок разбора важен: shift — правка (право спрашивается в миг
          // нажатия), ctrl — добавить к выбору, как на полотне; простой
          // щелчок — выбрать одного. Двойной щелчок открывает окно и
          // отменяет выбор, сделанный первым нажатием этой пары.
          item.addEventListener('click', function(event) {
            if (event.target.matches('input[type="checkbox"]')) return;  // галочка сама по себе
            if (event.shiftKey) {
              if (canEdit()) {     // ЗАСЛОН ПРАВКИ
                event.preventDefault();
                event.stopPropagation();
                openEditPhilosopherModal(philosopherName);
              }
              return;
            }
            event.preventDefault();
            highlightPhilosopherOnGraph(philosopherName, event.ctrlKey || event.metaKey);
          });
          
          // Обработчик двойного клика для детальной информации
          item.addEventListener('dblclick', function(event) {
            event.preventDefault();
            event.stopPropagation();
            showPhilosopherDetailModal(philosopherName);
          });
          
          // Обновляем подсказку. Про shift — только правщику.
          item.setAttribute('data-tip', canEdit()
            ? 'Щелчок — выбрать на графе, Ctrl+щелчок — добавить к выбору, двойной — окно философа, Shift+щелчок — правка'
            : 'Щелчок — выбрать на графе, Ctrl+щелчок — добавить к выбору, двойной — окно философа');
        }
      });
    }

export { DATA_traditions_of, makeLegendsEditable, similarPhilosophersBlock, традицииФилософаБлок };
