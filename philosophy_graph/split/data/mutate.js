// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { markDirty } from './save.js';
import { applyFiltersImmediate } from '../filters/filters.js';
import { rebuildPhilosopherTraditions } from '../filters/state.js';
import { initializePhilosophyMetrics } from '../metrics/init.js';
import { invalidateEverythingForScope } from '../metrics/scope.js';
import { selectConnectionEditConcept } from '../modal/connection-edit.js';
import { selectConnectionViewConcept } from '../modal/connection-view.js';
import { modalStack } from '../modal/context.js';
import { makeLegendsEditable } from '../modal/philosopher-view.js';
import { rebuildQuadtree } from '../render/picking.js';
import { requestDraw } from '../render/scene.js';
import { clearSimilarityOverlay } from '../render/similarity-overlay.js';
import { selectedEdges, selectedNodes } from '../state.js';
import { loadStatsContent } from '../stats/modal.js';
import { initFilters, updateFilterStats } from '../ui/legend.js';

const pinnedVisibleNodes = new Set();

function updateGraphData() {
      // nodes и links — те самые массивы, что переданы симуляции при
      // создании, так что push/splice в них уже видны. Но d3 держит
      // собственные индексы и предвычисленные силы, поэтому массивы
      // надо передать заново.
      S.simulation.nodes(DATA.nodes);
      S.simulation.force('link').links(DATA.links);

      rebuildQuadtree();   // хит-тест узлов
      S.pickDirty = true;    // хит-тест связей (карта выбора)
      requestDraw();
      S.simulation.alpha(0.3).restart();
    }

function addNodeToGraph(nodeData) {
      // Узел уже лежит в nodes; здесь только начальные координаты.
      // Без них d3 поставит его в (0,0) и рывком выбросит через весь
      // экран, а пользователь потеряет только что созданное из виду.
      pinnedVisibleNodes.add(nodeData.id);
      if (nodeData.x === undefined || nodeData.y === undefined) {
        const c = S.renderState.transform.invert([S.viewWidth / 2, S.viewHeight / 2]);
        nodeData.x = c[0] + (Math.random() - 0.5) * 60;
        nodeData.y = c[1] + (Math.random() - 0.5) * 60;
        nodeData.vx = 0;
        nodeData.vy = 0;
      }
      updateGraphData();
      updateFilterStats();
    }

function updateNodeOnGraph() {
      requestDraw();
    }

function addLinkToGraph(linkData) {
      // d3 ждёт в source/target объекты узлов, а не идентификаторы:
      // на строках сила связей молча не сработает.
      const s = DATA.nodes.find(n => n.id === (linkData.source.id || linkData.source));
      const t = DATA.nodes.find(n => n.id === (linkData.target.id || linkData.target));
      if (!s || !t) { console.error('Не найдены узлы для связи', linkData); return; }
      linkData.source = s;
      linkData.target = t;
      updateGraphData();
      updateFilterStats();
    }

function updateLinkOnGraph() {
      // Тип, вес и взаимность меняют и вид, и полосу попадания.
      S.pickDirty = true;
      requestDraw();
    }

function forgetNode(nodeId) {
      pinnedVisibleNodes.delete(nodeId);
      S.renderState.radius.delete(nodeId);
      S.renderState.labelDy.delete(nodeId);
      for (const n of Array.from(selectedNodes)) {
        if (n && n.id === nodeId) selectedNodes.delete(n);
      }
      if (S.renderState.hoveredNode && S.renderState.hoveredNode.id === nodeId) {
        S.renderState.hoveredNode = null;
      }
      for (const store of [S.renderState.nodeClasses]) {
        Object.values(store).forEach(set => { if (set) set.delete(nodeId); });
      }
      if (S.similarityOverlay && S.similarityOverlay.values) {
        S.similarityOverlay.values.delete(nodeId);
      }
      if (S.visibleNodeIds) S.visibleNodeIds.delete(nodeId);
    }

function forgetLink(link) {
      selectedEdges.delete(link);
      if (S.renderState.hoveredLink === link) S.renderState.hoveredLink = null;
      Object.values(S.renderState.linkClasses).forEach(set => {
        if (set) set.delete(link);
      });
      if (S.visibleLinkSet) S.visibleLinkSet.delete(link);
    }

function rebuildDerivedIndexes(what) {
      what = what || {};

      if (what.philosophers) {
        Object.keys(DATA.philosopherConcepts).forEach(k => delete DATA.philosopherConcepts[k]);
        Object.keys(DATA.philosopherOrder).forEach(k => delete DATA.philosopherOrder[k]);
        Object.keys(DATA.philosopherIdToName).forEach(k => delete DATA.philosopherIdToName[k]);
        DATA.philosophers.forEach(p => {
          // схема metrics15, а не unimod: здесь запись беднее —
          // только цвет и годы; birth и death берутся из philosophers
          DATA.philosopherConcepts[p.nameRu] = { color: p.color, years: p.years };
          DATA.philosopherOrder[p.nameRu] = p.birth;
          DATA.philosopherIdToName[p.id] = p.nameRu;
        });
        rebuildPhilosopherTraditions();
      }

      if (what.nodes) {
        Object.keys(DATA.conceptToRubrics).forEach(k => delete DATA.conceptToRubrics[k]);
        DATA.concepts.forEach(c => { DATA.conceptToRubrics[c.id] = c.rubrics || []; });

        Object.keys(DATA.rubricsObj).forEach(k => delete DATA.rubricsObj[k]);
        DATA.rubrics.forEach(r => {
          DATA.rubricsObj[r.name] = {
            concepts: DATA.concepts.filter(c => (c.rubrics || []).includes(r.id))
                      .map(c => c.id),
            description: r.description
          };
        });
      }

      if (what.relationTypes) {
        Object.keys(DATA.linkColors).forEach(k => delete DATA.linkColors[k]);
        DATA.relationTypes.forEach(rt => { DATA.linkColors[rt.id] = rt.color; });
      }
    }

function afterDataChange(what) {
      what = what || { nodes: true, links: true };

      // Единственная точка, через которую проходит всякое изменение базы:
      // отсюда и берётся признак «есть несохранённое».
      markDirty();

      rebuildDerivedIndexes(what);

      // Метрики: и данные движка, и все кэши. Одного вызова довольно:
      // invalidateEverythingForScope через invalidateAllMetricsCaches
      // покрывает все 38 функций сброса (проверено замером).
      initializePhilosophyMetrics();
      invalidateEverythingForScope();

      // Карта сходства на графе построена по прежним данным и после
      // удаления концепции указывает в пустоту.
      if (typeof S.similarityOverlay !== 'undefined' && S.similarityOverlay) {
        clearSimilarityOverlay();
      }

      // История переходов может вести к удалённому.
      if (typeof modalStack !== 'undefined') modalStack.length = 0;

      // Легенда и фильтры. Новый философ должен попасть и в множество
      // выбранных, иначе будет отфильтрован сразу после создания.
      if (what.philosophers) {
        Object.keys(DATA.philosopherConcepts).forEach(name => {
          if (!S.selectedPhilosophers.has(name)) S.selectedPhilosophers.add(name);
        });
        initFilters();
        setTimeout(makeLegendsEditable, 100);
      }
      applyFiltersImmediate();

      // Граф.
      updateGraphData();

      // Открытая панель статистики.
      if (S.isStatsModalOpen && S.currentStatsView) loadStatsContent(S.currentStatsView);
    }

function selectConceptOnGraph(type, mode = 'edit') {
      S.graphSelectionContext = { active: true, type: type, mode: mode };

      S.gfxCanvas.style.cursor = 'crosshair';

      // Подложка лежит выше канвы и съела бы клик. На время выбора
      // пропускаем сквозь неё.
      const overlay = document.getElementById('modalOverlay');
      if (overlay) overlay.style.pointerEvents = 'none';

      // Окно занимает середину экрана — приглушаем, но не прячем:
      // должно быть видно и граф, и что форма никуда не делась.
      const modal = document.getElementById('universalModal');
      if (modal) modal.classList.add('graph-picking');

      const old = document.getElementById('graph-selection-hint');
      if (old) old.remove();
      const hint = document.createElement('div');
      hint.id = 'graph-selection-hint';
      hint.innerHTML = '🎯 Выберите '
        + (type === 'source' ? 'начальную' : 'конечную')
        + ' концепцию на графе'
        + '<button data-act-click="cancel-graph-selection" '
        + 'style="margin-left:15px;padding:4px 10px;background:white;color:#6c5ce7;'
        + 'border:none;border-radius:4px;cursor:pointer;font-weight:600;">'
        + '✖️ Отмена</button>';
      document.body.appendChild(hint);
    }

function cancelGraphSelection() {
      S.graphSelectionContext = { active: false, type: null, mode: 'edit' };

      S.gfxCanvas.style.cursor = '';
      const overlay = document.getElementById('modalOverlay');
      if (overlay) overlay.style.pointerEvents = '';
      const modal = document.getElementById('universalModal');
      if (modal) modal.classList.remove('graph-picking');
      const hint = document.getElementById('graph-selection-hint');
      if (hint) hint.remove();
    }

function handleConceptSelection(conceptId) {
      const ctx = S.graphSelectionContext;
      if (!ctx || !ctx.active) return;
      if (ctx.mode === 'view') {
        if (typeof selectConnectionViewConcept === 'function') {
          selectConnectionViewConcept(ctx.type, conceptId);
        }
      } else {
        if (typeof selectConnectionEditConcept === 'function') {
          selectConnectionEditConcept(ctx.type, conceptId);
        }
      }
      cancelGraphSelection();
    }

export { addLinkToGraph, addNodeToGraph, afterDataChange, cancelGraphSelection, forgetLink, forgetNode, handleConceptSelection, pinnedVisibleNodes, rebuildDerivedIndexes, selectConceptOnGraph, updateGraphData, updateLinkOnGraph, updateNodeOnGraph };
