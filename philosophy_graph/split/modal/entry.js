// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { canEdit } from '../core/session.js';
import { findConnection, getConceptConnections } from '../graph/graph-data.js';
import { closeUniversalModal, openUniversalModal } from './core.js';
import { gfxNode } from '../render/d3-layer.js';
import { highlightConnected } from '../render/selection.js';
import { selectedNodes } from '../state/render.js';

function openConceptById(conceptId) {
      const node = DATA.nodes.find(n => n.id === conceptId);
      if (node) showDetailModal(node);
    }

function isConceptIsolated(conceptId) {
      return getConceptConnections(conceptId).length === 0;
    }

function getIsolatedConceptsAfterDeletion(philosopherName) {
      const own  = DATA.nodes.filter(n => n.concept === philosopherName);
      const ownIds = new Set(own.map(c => c.id));
      const isolated = [];
      own.forEach(concept => {
        const external = getConceptConnections(concept.id).filter(conn => {
          const srcId = conn.source.id || conn.source;
          const tgtId = conn.target.id || conn.target;
          const other = srcId === concept.id ? tgtId : srcId;
          return !ownIds.has(other);
        });
        if (external.length === 0) isolated.push(concept);
      });
      return isolated;
    }

function showDetailModal(conceptData) {
      openUniversalModal('concept', conceptData, 'view');
    }

function showPhilosopherDetailModal(philosopherName) {
      openUniversalModal('philosopher', philosopherName, 'view');
    }

function closeDetailModal()      { closeUniversalModal(); }

function closePhilosopherDetailModal() { closeUniversalModal(); }

function openEditPhilosopherModal(philosopherName = null) {
      if (!canEdit()) return;                       // ЗАСЛОН ПРАВКИ
      openUniversalModal('philosopher', philosopherName, 'edit');
    }

function openEditConceptModal(concept = null) {
      if (!canEdit()) return;                       // ЗАСЛОН ПРАВКИ
      const data = (typeof concept === 'string')
        ? DATA.nodes.find(n => n.id === concept) : concept;
      openUniversalModal('concept', data, 'edit');
    }

function openEditConnectionModal(a = null, b = null) {
      if (!canEdit()) return;                       // ЗАСЛОН ПРАВКИ
      const data = (typeof a === 'string' && typeof b === 'string')
        ? findConnection(a, b, true) : a;
      openUniversalModal('connection', data, 'edit');
    }

function gotoNodeFromModal(nodeId) {
      closeDetailModal();
      
      setTimeout(() => {
        const nodeData = DATA.nodes.find(n => n.id === nodeId);
        if (nodeData) {
          // Выделяем узел
          selectedNodes.clear();
          selectedNodes.add(nodeData);
          highlightConnected([nodeData]);
          
          // Центрируем на узле
          const nodeElement = gfxNode.filter(d => d.id === nodeId);
          if (nodeElement.size() > 0) {
            const d = nodeElement.datum();
            const transform = d3.zoomIdentity
              .translate(S.viewWidth / 2 - d.x, S.viewHeight / 2 - d.y)
              .scale(1.5);
            S.gfxSvg.transition().duration(750).call(S.gfxZoom.transform, transform);
          }
        }
      }, 100);
    }

function showAllConcepts(rubricId, currentConceptId) {
      const rubricData = DATA.rubrics.find(r => r.id === rubricId);
      if (!rubricData) return;
      
      const relatedConcepts = DATA.nodes.filter(n => {
        const nRubrics = DATA.conceptToRubrics[n.id] || [];
        return nRubrics.includes(rubricId) && n.id !== currentConceptId;
      });
      
      const containerId = `show-all-${rubricId}-container`;
      const buttonId = `show-all-${rubricId}`;
      const container = document.getElementById(containerId);
      const button = document.getElementById(buttonId);
      
      if (container && button) {
        // Показываем все концепции
        container.innerHTML = relatedConcepts.map(c => `
          <div class="concept-item" data-act-click="open-universal-modal-3" data-a1="${c.id}">
            <div class="concept-color" style="background: ${DATA.philosopherConcepts[c.concept].color}"></div>
            <div class="concept-name">${c.label}</div>
            <div class="concept-philosopher">${c.concept}</div>
          </div>
        `).join('');
        
        // Скрываем кнопку
        button.style.display = 'none';
      }
    }

export { closeDetailModal, closePhilosopherDetailModal, getIsolatedConceptsAfterDeletion, gotoNodeFromModal, isConceptIsolated, openConceptById, openEditConceptModal, openEditConnectionModal, openEditPhilosopherModal, showAllConcepts, showDetailModal, showPhilosopherDetailModal };
