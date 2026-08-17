// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { известить } from '../core/events.js';
import { requestDraw } from '../render/loop.js';
import { updateGraphData } from '../render/scene.js';
import { pinnedVisibleNodes } from '../state/filters.js';
import { selectedEdges, selectedNodes } from '../state/render.js';

function traditionsOfPhilosopher(name) {
      return (DATA.philosopherTraditions[name] || [])
        .map(id => (DATA.traditions.find(t => t.id === id) || {}).name)
        .filter(Boolean);
    }

function findConnection(sourceId, targetId, bidirectional = true) {
      return DATA.links.find(l => {
        const srcId = l.source.id || l.source;
        const tgtId = l.target.id || l.target;
        if (srcId === sourceId && tgtId === targetId) return true;
        if (bidirectional && srcId === targetId && tgtId === sourceId) return true;
        return false;
      }) || null;
    }

function getConceptConnections(conceptId) {
      return DATA.links.filter(l => {
        const srcId = l.source.id || l.source;
        const tgtId = l.target.id || l.target;
        return srcId === conceptId || tgtId === conceptId;
      });
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
      известить('фильтры-применены');
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
      известить('фильтры-применены');
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

function connectionsBetween(sourceId, targetId) {
      return DATA.links.filter(l => {
        const s = l.source.id || l.source;
        const t = l.target.id || l.target;
        return (s === sourceId && t === targetId)
          || (s === targetId && t === sourceId);
      });
    }

export { addLinkToGraph, addNodeToGraph, connectionsBetween, findConnection, forgetLink, forgetNode, getConceptConnections, traditionsOfPhilosopher, updateLinkOnGraph, updateNodeOnGraph };
