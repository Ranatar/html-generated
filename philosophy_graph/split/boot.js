// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S, MET } from './core/ns.js';
import { loadData } from './data/load.js';
import { buildIndexes } from './core/graph-index.js';
import { onReady, onLoad } from './core/ready.js';
import { closeAllModals } from './boot-defs.js';
import { известить, подписаться } from './core/events.js';
import { isReflexiveLink, isSymmetricLink } from './core/link-facts.js';
import { CHRONOLOGY_MODES } from './core/time.js';
import { hasUnsavedEdits } from './data/save.js';
import { resetBeyondFilter } from './filters/beyond-filter.js';
import { applyFiltersImmediate } from './filters/filters.js';
import { cancelGraphSelection } from './graph/graph-selection.js';
import { initializePhilosophyMetrics } from './metrics/link-indexes.js';
import { invalidateEverythingForScope } from './metrics/scope-reset.js';
import { selectConnectionEditConcept } from './modal/connection-edit.js';
import { selectConnectionViewConcept } from './modal/connection-view.js';
import { modalStack, openUniversalModal, popModalState } from './modal/core.js';
import { renderAuthControls } from './modal/edit-rights.js';
import { closeDetailModal, openEditConceptModal, openEditConnectionModal, showDetailModal } from './modal/entry.js';
import { makeLegendsEditable } from './modal/philosopher-view.js';
import { initPathFinder } from './paths/path-ui.js';
import { resizeCanvas } from './render/canvas-core.js';
import { dragended, dragstarted, gfxLink, gfxNode } from './render/d3-layer.js';
import { cols, groupPositions } from './render/grouping.js';
import { initGraphEventHandlers } from './render/interactions.js';
import { requestDraw, назначитьРисовальщика } from './render/loop.js';
import { saveOriginalRadii } from './render/metric-visualization.js';
import { pickNode, rebuildQuadtree } from './render/picking.js';
import { draw, updateGraphData } from './render/scene.js';
import { clearSimilarityOverlay } from './render/similarity-overlay.js';
import { maxTicks } from './render/simulation.js';
import { показанныеВопрекиОтбору } from './state/filters.js';
import { selectedEdges } from './state/render.js';
import { closeStatsModal, loadStatsContent, switchStatsView } from './stats/modal.js';
import { renderComparison } from './stats/views/comparison.js';
import { показатьПодсказку, скрытьПодсказку } from './ui/hint.js';
import { initFilters, restorePanelStates, updateFilterStats, updatePhilosopherDimming, отметитьВыбранныхВЛегенде } from './ui/legend.js';
import { labelWithAuthor } from './util/philosopher-label.js';
import { initializeCustomSelects } from './widgets/custom-select.js';

export async function boot() {
  await loadData();
  buildIndexes();
  DATA.concepts.forEach(c => {
        DATA.conceptToRubrics[c.id] = c.rubrics || [];
      });
  
  DATA.rubrics.forEach(r => {
        DATA.rubricsObj[r.name] = {
          concepts: DATA.concepts.filter(c => c.rubrics && c.rubrics.includes(r.id)).map(c => c.id),
          description: r.description
        };
      });
  
  S.currentChronologyMode = CHRONOLOGY_MODES.STRICT;
  
  S.selectedPhilosophers = new Set(Object.keys(DATA.philosopherConcepts));
  
  S.selectedRelations = new Set(Object.keys(DATA.relationTypesObj));
  
  S.selectedTraditions = new Set(DATA.traditions.map(t => t.id));
  
  DATA.philosophers.forEach(p => { DATA.philosopherTraditions[p.nameRu] = p.traditions || []; });
  
  S.selectedRubrics = new Set(DATA.rubrics.map(r => r.id));
  
  document.addEventListener('click', function(event) {
        if (!S.isStatsModalOpen) return;
        const modal = document.getElementById('statsModal');
        if (event.target === modal) {
          известить('закрыть-статистику');
        }
      });
  
  document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && S.isStatsModalOpen) {
          closeStatsModal();
        }
      });
  
  S.METRIC_COVERAGE_FN = {
        'problem-generation': MET.problemGenerationIndex,
        'critical-power': MET.criticalPowerIndex,
        'revolutionary': MET.revolutionaryIndex,
        'paradigm-shift': MET.paradigmShiftIndex,
        'influence': MET.influenceIndex,
        'foundational': MET.foundationalIndex,
        'synthetic': MET.syntheticIndex,
        'dialogical': MET.dialogicalIndex,
        'coherence': MET.internalCoherenceIndex,
        'tension': MET.tensionIndex,
        'transformation': MET.transformationIndex,
        'fertility': MET.conceptualFertilityIndex,
        'complexity': MET.conceptualComplexityIndex,
        'continuity': MET.conceptualContinuityIndex,
        'generative': MET.generativeIndex,
        'instrumental': MET.instrumentalIndex,
        'bridging': MET.traditionBridgingIndex,
        'abstraction': MET.abstractionIndex,
        'deductive': MET.deductiveIndex
      };
  
  try {
        const saved = localStorage.getItem('metricLayoutMode');
        if (saved === 'rows' || saved === 'cards') S.metricLayoutMode = saved;
      } catch (e) { /* localStorage может быть недоступен */ }
  
  onLoad(() => {
        saveOriginalRadii();
      });
  
  document.addEventListener('click', function(event) {
        // Для поиска в легенде
        const legendSearch = document.getElementById('legendSearch');
        const legendResults = document.getElementById('legendSearchResults');
        if (legendSearch && !legendSearch.contains(event.target) && legendResults) {
          legendResults.classList.remove('show');
        }
        
        // Для поиска в модальном окне
        const modalSearch = document.getElementById('modalSearch');
        const modalResults = document.getElementById('modalSearchResults');
        if (modalSearch && !modalSearch.contains(event.target) && modalResults) {
          modalResults.classList.remove('show');
        }
      });
  
  onReady(function() {
        // Даем время на создание графа
        setTimeout(initializeCustomSelects, 500);
      });
  
  S.viewWidth = window.innerWidth;
  
  S.viewHeight = window.innerHeight;
  
  S.gfxCanvas = document.getElementById("graphCanvas");
  
  S.ctx = S.gfxCanvas.getContext("2d");
  
  S.gfxSvg = d3.select(S.gfxCanvas);
  
  S.pickCanvas = document.createElement("canvas");
  
  S.pickCtx = S.pickCanvas.getContext("2d", { willReadFrequently: true });
  
  S.dpr = window.devicePixelRatio || 1;
  
  S.renderState = {
        transform: d3.zoomIdentity,
        nodeClasses: {},      // dimmed / highlighted / selected -> Set<id>
        linkClasses: {},      // dimmed / highlighted / selected / path-highlight -> Set<link>
        hoveredNode: null,
        hoveredLink: null,
        uniformLinkWidth: false,
        radius: new Map(),    // текущий радиус узла
        labelDy: new Map(),     // текущее смещение подписи
        anim: null,         // { from, to, dyFrom, dyTo, t0, dur }
      };
  
  S.gfxZoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          S.renderState.transform = event.transform;
          S.pickDirty = true;
          requestDraw();
        });
  
  S.gfxSvg.call(d3.drag()
          .container(S.gfxCanvas)
          .subject((event) => {
            const g = S.renderState.transform.invert([event.x, event.y]);
            const n = pickNode(g[0], g[1]);
            if (!n) return null;
            // d3.drag запоминает захват как subject.x - pointer.x, и обе
            // величины должны быть в системе координат КОНТЕЙНЕРА, то есть
            // экранной. Узел живёт в координатах графа, поэтому субъектом
            // отдаём обёртку с экранными координатами — иначе в начале
            // перетаскивания узел прыгает на величину сдвига камеры.
            return { node: n,
                 x: S.renderState.transform.applyX(n.x),
                 y: S.renderState.transform.applyY(n.y) };
          })
          // d3.drag передаёт в обработчик датум ЭЛЕМЕНТА, а у канваса его
          // нет — перетаскиваемый узел лежит в event.subject
          .on("start", (event) => {
            const s = event.subject;
            if (s && s.node) dragstarted(event, s.node);
          })
          .on("drag",  (event) => {
            const s = event.subject;
            if (!s || !s.node) return;
            const g = S.renderState.transform.invert([event.x, event.y]);
            const d = s.node;
            d.fx = g[0]; d.fy = g[1];
            d.x  = g[0]; d.y  = g[1];
            rebuildQuadtree();
            S.pickDirty = true;
            requestDraw();
          })
          .on("end",   (event) => {
            const s = event.subject;
            if (s && s.node) dragended(event, s.node);
          }))
        .call(S.gfxZoom);
  
  resizeCanvas();
  
  S.simulation = d3.forceSimulation(DATA.nodes)
        .force("link", d3.forceLink(DATA.links).id(d => d.id).distance(160))
        .force("charge", d3.forceManyBody().strength(-350))
        .force("center", d3.forceCenter(S.viewWidth / 2, S.viewHeight / 2))
        .force("collision", d3.forceCollide().radius(45))
        .alphaDecay(0.02);
  
  S.simulation.on("tick", () => {
        // Ф0.5/Б12: d3-timer уже синхронизирован с кадрами, поэтому обёртка
        // requestAnimationFrame только добавляла кадр задержки, а троттлинг
        // по Date.now() стоял ДО tickCount++ — счётчик не рос на отброшенных
        // кадрах, и симуляция крутилась дольше заявленных maxTicks.
        S.tickCount++;
  
        rebuildQuadtree();
        S.pickDirty = true;
        requestDraw();
  
        if (S.tickCount >= maxTicks) {
          S.simulation.stop();
        }
      });
  
  S.simulation.on("end.stats", () => {
        console.log("Симуляция завершена после", S.tickCount, "тиков");
        console.log("Производительность - узлов:", DATA.nodes.length, "связей:", DATA.links.length);
        
        // Информация о памяти (если доступно)
        if (performance.memory) {
          console.log("Использование памяти:", 
            Math.round(performance.memory.usedJSHeapSize / 1048576), "МБ");
        }
      });
  
  initGraphEventHandlers();
  
  S.tooltip = d3.select("#tooltip");
  
  gfxNode.on("mouseover", function(event, d) {
        if (S.tooltipTimeout) clearTimeout(S.tooltipTimeout);
        
        S.tooltipTimeout = setTimeout(() => {
          let simNote = '';
          if (S.similarityOverlay && d.id !== S.similarityOverlay.sourceId) {
            const sv = S.similarityOverlay.values.get(d.id);
            if (sv !== undefined) {
              const src = DATA.nodes.find(n => n.id === S.similarityOverlay.sourceId);
              simNote = `<br/><span style="color:#ffd700">Сходство с «${src ? src.label : '—'}»: ` +
                    `${sv.toFixed(3)}</span>`;
            }
          }
          S.tooltip
            .style("opacity", 1)
            .html(`<strong>${labelWithAuthor(d)}</strong><br/>${d.description}<br/><em>${d.concept}</em>${simNote}`)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 15) + "px");
        }, 100); // Небольшая задержка
      })
      .on("mouseout", function() {
        if (S.tooltipTimeout) {
          clearTimeout(S.tooltipTimeout);
          S.tooltipTimeout = null;
        }
        S.tooltip.style("opacity", 0);
      });
  
  gfxLink.on("mouseover", function(event, d) {
        const tooltip = document.getElementById('tooltip');
        
        // Получаем данные узлов source и target
        const sourceId = d.source.id || d.source;
        const targetId = d.target.id || d.target;
        const sourceNode = DATA.nodes.find(n => n.id === sourceId);
        const targetNode = DATA.nodes.find(n => n.id === targetId);
        
        if (!sourceNode || !targetNode) return;
        
        // Получаем название типа связи и цвет
        const relationLabel = DATA.relationTypesObj[d.type].label;
        const relationColor = DATA.relationTypesObj[d.type].color;
        
        // Создаём SVG стрелку с цветом типа связи
        const arrowWidth = 60;
        const arrowHeight = 20;
        let arrowSvg;
        
        // ДЕФЕКТ U3: у петли source === target, и стрелка «слева направо»
        // лгала бы о двух разных концах. Начертание то же, что на канве
        // (drawSelfLoop) и в окне связи: окружность над узлом, наконечник
        // в правой точке касания. Дуга 300°, потому оба флага единицы.
        const reflexive = isReflexiveLink(d);
        
        if (reflexive) {
          arrowSvg = `
            <svg width="46" height="40" style="display: block;">
              <defs>
                <marker id="arrowhead-loop-${d.type}" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="${relationColor}" />
                </marker>
              </defs>
              <circle cx="23" cy="33" r="5" fill="${relationColor}" opacity="0.35" />
              <path d="M 18 33 A 10 10 0 1 1 28 33" fill="none"
                  stroke="${relationColor}" stroke-width="2"
                  marker-end="url(#arrowhead-loop-${d.type})" />
            </svg>
          `;
        } else if (isSymmetricLink(d)) {
          // Двунаправленная стрелка: <->
          arrowSvg = `
            <svg width="${arrowWidth}" height="${arrowHeight}" style="display: block;">
              <defs>
                <!-- orient="auto" направлял бы начальный маркер ПО ходу линии,
                   и выходило >-> вместо <->. auto-start-reverse переворачивает
                   его на входе пути — для того он в SVG 2 и введён. -->
                <marker id="arrowhead-start-${d.type}" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto-start-reverse">
                  <polygon points="0 0, 6 3, 0 6" fill="${relationColor}" />
                </marker>
                <marker id="arrowhead-end-${d.type}" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="${relationColor}" />
                </marker>
              </defs>
              <line x1="10" y1="${arrowHeight/2}" x2="${arrowWidth-10}" y2="${arrowHeight/2}" 
                  stroke="${relationColor}" stroke-width="2" 
                  marker-start="url(#arrowhead-start-${d.type})" 
                  marker-end="url(#arrowhead-end-${d.type})" />
            </svg>
          `;
        } else {
          // Однонаправленная стрелка: ->
          arrowSvg = `
            <svg width="${arrowWidth}" height="${arrowHeight}" style="display: block;">
              <defs>
                <marker id="arrowhead-${d.type}" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="${relationColor}" />
                </marker>
              </defs>
              <line x1="5" y1="${arrowHeight/2}" x2="${arrowWidth-5}" y2="${arrowHeight/2}" 
                  stroke="${relationColor}" stroke-width="2" 
                  marker-end="url(#arrowhead-${d.type})" />
            </svg>
          `;
        }
        
        // Формируем красивый tooltip. У петли конец один, поэтому
        // и название концепции, и имя философа выводятся однажды:
        // прежде подсказка повторяла их дважды по обе стороны стрелки.
        let tooltipContent = reflexive ? `
          <div class="link-tooltip-header">
            <div class="link-tooltip-arrow">${arrowSvg}</div>
            <strong>${sourceNode.label}</strong>
          </div>
          <div class="link-tooltip-type" style="color: ${relationColor};">${relationLabel}</div>
          <div class="link-tooltip-philosophers" style="justify-content: center;">
            <em>(${sourceNode.concept})</em>
          </div>
        ` : `
          <div class="link-tooltip-header">
            <strong>${sourceNode.label}</strong>
            <div class="link-tooltip-arrow">${arrowSvg}</div>
            <strong>${targetNode.label}</strong>
          </div>
          <div class="link-tooltip-type" style="color: ${relationColor};">${relationLabel}</div>
          <div class="link-tooltip-philosophers">
            <em>(${sourceNode.concept})</em>
            <em>(${targetNode.concept})</em>
          </div>
        `;
        
        // Для выделенных связей добавляем описание, если оно есть
        if (selectedEdges.has(d) && d.description) {
          tooltipContent += `<div class="tooltip-description">${d.description}</div>`;
        }
        
        tooltip.innerHTML = tooltipContent;
        tooltip.style.opacity = 1;
        tooltip.style.left = (event.pageX + 15) + 'px';
        tooltip.style.top = (event.pageY - 10) + 'px';
  
        // Ф0.4: markerUnits = strokeWidth означал рост стрелки при :hover
        S.renderState.hoveredLink = d; requestDraw();
      })
      .on("mousemove", function(event) {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.left = (event.pageX + 15) + 'px';
        tooltip.style.top = (event.pageY - 10) + 'px';
      })
      .on("mouseout", function(event, d) {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.opacity = 0;
        if (S.renderState.hoveredLink === d) { S.renderState.hoveredLink = null; requestDraw(); }
      });
  
  S.philosopherNames = Object.keys(DATA.philosopherConcepts);
  
  S.rows = Math.ceil(S.philosopherNames.length / cols);
  
  S.spacingX = S.viewWidth / (cols + 1);
  
  S.spacingY = S.viewHeight / (S.rows + 1);
  
  S.philosopherNames.forEach((phil, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        groupPositions[phil] = {
          x: S.spacingX * (col + 1),
          y: S.spacingY * (row + 1)
        };
      });
  
  window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        // Б4: держим глобальные размеры в актуальном состоянии —
        // от них зависят все четыре функции камеры и exportToPNG
        S.viewWidth = newWidth;
        S.viewHeight = newHeight;
        resizeCanvas();
        
        // Пересчитываем позиции групп
        const newSpacingX = newWidth / (cols + 1);
        const newSpacingY = newHeight / (S.rows + 1);
        S.philosopherNames.forEach((phil, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          groupPositions[phil] = {
            x: newSpacingX * (col + 1),
            y: newSpacingY * (row + 1)
          };
        });
        
        if (S.isGrouped) {
          S.simulation
            .force("x", d3.forceX(d => groupPositions[d.concept].x).strength(0.3))
            .force("y", d3.forceY(d => groupPositions[d.concept].y).strength(0.3));
        } else {
          S.simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
        }
        
        S.simulation.alpha(0.3).restart();
      });
  
  window.addEventListener('beforeunload', ev => {
        if (!hasUnsavedEdits) return;
        ev.preventDefault();
        ev.returnValue = '';
      });
  
  S.graphSelectionContext = { active: false, type: null, mode: 'edit' };
  
  document.addEventListener('click', function(event) {
        document.querySelectorAll('.modal-concept-search').forEach(box => {
          if (!box.contains(event.target)) {
            box.querySelector('.modal-concept-search-results')?.classList.remove('show');
          }
        });
      });
  
  setTimeout(makeLegendsEditable, 100);
  
  renderAuthControls();
  
  document.getElementById('modalOverlay').addEventListener('click', function() {
        // Пока идёт выбор концепции на графе, подложка пропускает клики
        // к канве и закрывать окно не должна (этап 7 спецификации).
        if (S.graphSelectionContext && S.graphSelectionContext.active) return;
        closeAllModals();
      });
  
  document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (S.graphSelectionContext && S.graphSelectionContext.active) {
            if (typeof cancelGraphSelection === 'function') cancelGraphSelection();
            return;
          }
          closeAllModals();
        }
  
        // Backspace — шаг назад по истории окон. Escape по-прежнему
        // закрывает всё: это две разные привычки, и смешивать их не надо.
        if (e.key === 'Backspace') {
          const t = e.target;
          const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'
                     || t.isContentEditable);
          if (typing) return;
          if (typeof modalStack !== 'undefined' && modalStack.length > 0) {
            e.preventDefault();
            popModalState();
          }
        }
      });
  
  console.log("Инициализация графа:", DATA.nodes.length, "узлов,", DATA.links.length, "связей");
  
  initFilters();
  
  подписаться('фильтры-применены', updateFilterStats);
  
  подписаться('фильтры-применены', updatePhilosopherDimming);
  
  подписаться('данные-изменились', () => {
        initializePhilosophyMetrics();
        invalidateEverythingForScope();
      });
  
  подписаться('данные-изменились', updateFilterStats);
  
  подписаться('данные-изменились', () => {
        if (typeof S.similarityOverlay !== 'undefined' && S.similarityOverlay) clearSimilarityOverlay();
      });
  
  подписаться('данные-изменились', () => {
        if (typeof modalStack !== 'undefined') modalStack.length = 0;
      });
  
  подписаться('данные-изменились', (what) => {
        if (what && what.philosophers) {
          initFilters();
          setTimeout(makeLegendsEditable, 100);
        }
      });
  
  подписаться('данные-изменились', () => applyFiltersImmediate());
  
  подписаться('данные-изменились', () => updateGraphData());
  
  подписаться('данные-изменились', () => {
        if (S.isStatsModalOpen && S.currentStatsView) loadStatsContent(S.currentStatsView);
      });
  
  подписаться('концепция-выбрана-на-графе', (режим, тип, id) => {
        if (режим === 'view') selectConnectionViewConcept(тип, id);
        else selectConnectionEditConcept(тип, id);
      });
  
  подписаться('сравнение-обновить', () => renderComparison());
  
  подписаться('переключить-вид', (вид) => switchStatsView(вид));
  
  подписаться('философы-выбраны', () => отметитьВыбранныхВЛегенде());
  
  подписаться('выделение-снято', () => {
        // Показ поверх отбора держался ради выделения; выделения нет — нет и
        // нужды в нём. Подписка, а не прямой вызов: отрисовка не должна знать
        // об отборе, иначе выходит круг (замер: четыре модуля в кольце).
        if (показанныеВопрекиОтбору.size) resetBeyondFilter();
      });
  
  назначитьРисовальщика(draw);
  
  document.addEventListener('mouseover', ev => {
        const эл = ev.target && ev.target.closest && ev.target.closest('[data-tip]');
        if (эл) показатьПодсказку(эл, эл.getAttribute('data-tip'));
      });
  
  document.addEventListener('mouseout', ev => {
        const эл = ev.target && ev.target.closest && ev.target.closest('[data-tip]');
        if (эл && !эл.contains(ev.relatedTarget)) скрытьПодсказку();
      });
  
  document.addEventListener('scroll', скрытьПодсказку, true);
  
  подписаться('закрыть-статистику', () => closeStatsModal());
  
  подписаться('закрыть-окна', () => closeDetailModal());
  
  подписаться('открыть-концепцию', (узел) => showDetailModal(узел));
  
  подписаться('открыть-связь', (связь) => openUniversalModal('connection', связь, 'view'));
  
  подписаться('править-концепцию', (id) => openEditConceptModal(id));
  
  подписаться('править-связь', (a, b) => openEditConnectionModal(a, b));
  
  подписаться('статистика-устарела', () => {
        if (S.isStatsModalOpen && S.currentStatsView) loadStatsContent(S.currentStatsView);
      });
  
  updateFilterStats();
  
  initializePhilosophyMetrics();
  
  initPathFinder();
  
  restorePanelStates();
  
  S.simulation.on("end.log", () => {
        console.log("Симуляция завершена. Запустите анализ вручную.");
      });
  
  S.legendWeightsToggle = document.getElementById('useWeightsToggle');
  
  if (S.legendWeightsToggle) S.legendWeightsToggle.checked = S.useWeightedPaths;
  
  S.legendDirectionToggle = document.getElementById('respectDirectionToggle');
  
  if (S.legendDirectionToggle) S.legendDirectionToggle.checked = S.respectDirection;
  
  saveOriginalRadii();
  
  console.log("Граф инициализирован. Используйте кнопки для запуска анализа.");
  
  console.log("Текущий режим: веса -", S.useWeightedPaths ? "ВКЛ" : "ВЫКЛ", 
            ", направленность -", S.respectDirection ? "ВКЛ" : "ВЫКЛ");
  
  document.getElementById('respectChronology').addEventListener('change', function() {
        const container = document.getElementById('chronologyModeContainer');
        container.style.display = this.checked ? 'block' : 'none';
      });
  
  document.getElementById('chronologyModeSelect').addEventListener('change', function() {
        const infoDiv = document.getElementById('chronologyModeInfo');
        const descriptions = {
          strict: '<strong>Строгий режим:</strong> учитывает реальные периоды жизни и активности философов (с 25 лет). Блокирует все анахронизмы. Пример: Гегель не может влиять на Канта. Критика, полемика и противостояние читаются в обратную сторону: критикующий позже критикуемого.',
          moderate: '<strong>Умеренный режим:</strong> допускает влияние современников в пределах ±50 лет от рождения. Менее строгий, но всё ещё блокирует явные анахронизмы.',
          loose: '<strong>Свободный режим:</strong> разрешает влияние в пределах ±100 лет. Подходит для поиска концептуальных связей без строгой хронологии.',
          seamless: '<strong>Без разрывов:</strong> проверяется не отдельная связь, а весь путь: годы идут только в одну сторону. Если цель раньше источника, путь читается как родословная — «восходит к», и связи проходятся против стрелки. Прочие режимы проверяют каждую связь по отдельности, поэтому путь может уйти вперёд на века и вернуться назад.'
        };
        infoDiv.innerHTML = descriptions[this.value];
        
        // Обновляем глобальную переменную режима
        S.currentChronologyMode = this.value;
      });
  
  if (document.getElementById('respectChronology').checked) {
        document.getElementById('chronologyModeContainer').style.display = 'block';
      }
  
  console.log('Обработчики событий хронологии инициализированы');
}
