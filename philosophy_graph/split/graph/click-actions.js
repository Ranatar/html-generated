// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';
import { известить } from '../core/events.js';
import { canEdit } from '../core/session.js';
import { handleConceptSelection } from './graph-selection.js';
import { gfxNode } from '../render/d3-layer.js';
import { highlightCombined, isEdgeConnectedToSelectedNodes, isNodeConnectedToSelectedEdges } from '../render/selection.js';
import { editMode } from '../state/edit.js';
import { selectedEdges, selectedNodes } from '../state/render.js';

let clickTimer = null;

let clickCount = 0;

let lastClickedNode = null;

function handleNodeClick(event, d) {
      event.stopPropagation();
      
      // Обработка shift+клик для редактирования узла
      // ЗАСЛОН ПРАВКИ: без права shift не отличается от обычного клика.
      if (event.shiftKey && canEdit()) {
        clickCount++;
        
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
        }
        
        if (clickCount === 1) {
          lastClickedNode = d;
          clickTimer = setTimeout(() => {
            // Shift+ОДИНАРНЫЙ клик - ожидание следующего узла.
            // Режим выбора сюда уже не доходит: dispatchClick
            // перехватывает его первой строкой и до обработчика
            // узла дело не идёт. Проверка оставлена как страховка
            // на случай прямого вызова handleNodeClick.
            if (S.graphSelectionContext
              && S.graphSelectionContext.active) {
              handleConceptSelection(d.id);
            } else if (editMode.pendingConceptSelection.length > 0) {
              const firstConceptId = editMode.pendingConceptSelection[0];
              // Второй клик на том же узле - редактирование концепции
              if (firstConceptId === d.id) {
                editMode.pendingConceptSelection = [];
                gfxNode.classed('selected', false);
                известить('править-концепцию', d.id);
              } else {
                // Второй клик на другом узле - редактирование связи
                editMode.pendingConceptSelection = [];
                gfxNode.classed('selected', false);
                известить('править-связь', firstConceptId, d.id);
              }
            } else {
              editMode.pendingConceptSelection = [d.id];
              gfxNode.classed('selected', n => n.id === d.id);
            }
            
            clickCount = 0;
            clickTimer = null;
            lastClickedNode = null;
          }, 300);
        } else if (clickCount === 2) {
          // Shift+ДВОЙНОЙ клик - редактирование концепции
          editMode.pendingConceptSelection = [];
          gfxNode.classed('selected', false);
          известить('править-концепцию', d.id);
          
          clickCount = 0;
          clickTimer = null;
          lastClickedNode = null;
        }
        return;
      }
      
      // Отменяем выбор если кликнули без shift
      if (editMode.pendingConceptSelection.length > 0) {
        editMode.pendingConceptSelection = [];
        gfxNode.classed('selected', false);
      }
      
      // Обычная логика клика
      clickCount++;
      
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      
      if (clickCount === 1) {
        lastClickedNode = d;
        clickTimer = setTimeout(() => {
          // Одинарный клик - выделение узла с его связями
          if (event.ctrlKey || event.metaKey) {
            if (selectedNodes.has(lastClickedNode)) {
              selectedNodes.delete(lastClickedNode);
            } else {
              selectedNodes.add(lastClickedNode);
            }
          } else {
            const connectedToSelectedEdges = isNodeConnectedToSelectedEdges(lastClickedNode);
            if (connectedToSelectedEdges && selectedEdges.size > 0) {
              if (selectedNodes.size === 1 && selectedNodes.has(lastClickedNode)) {
                selectedNodes.clear();
              } else {
                selectedNodes.clear();
                selectedNodes.add(lastClickedNode);
              }
            } else {
              selectedEdges.clear();
              if (selectedNodes.size === 1 && selectedNodes.has(lastClickedNode)) {
                selectedNodes.clear();
              } else {
                selectedNodes.clear();
                selectedNodes.add(lastClickedNode);
              }
            }
          }
          
          highlightCombined();
          clickCount = 0;
          clickTimer = null;
          lastClickedNode = null;
        }, 300);
      } else if (clickCount === 2) {
        // Двойной клик - детальная информация об узле
        известить('открыть-концепцию', d);
        clickCount = 0;
        clickTimer = null;
        lastClickedNode = null;
      }
    }

let linkClickTimer = null;

let linkClickCount = 0;

function handleLinkClick(event, d) {
      event.stopPropagation();
      
      // Shift+клик - редактирование связи
      if (event.shiftKey && canEdit()) {           // ЗАСЛОН ПРАВКИ
        известить('править-связь', d.source.id || d.source, d.target.id || d.target);
        return;
      }

      // Ctrl отдан множественному выбору и до счётчика доходить не должен
      if (!event.ctrlKey && !event.metaKey) {
        linkClickCount++;
        if (linkClickTimer) { clearTimeout(linkClickTimer); linkClickTimer = null; }
        if (linkClickCount === 1) {
          linkClickTimer = setTimeout(() => {
            linkClickCount = 0;
            linkClickTimer = null;
            handleLinkSelect(event, d);
          }, 300);
          return;
        }
        // двойной клик — окно связи
        linkClickCount = 0;
        известить('открыть-связь', d);
        return;
      }
      handleLinkSelect(event, d);
    }

function handleLinkSelect(event, d) {
      // Ctrl+клик - множественный выбор узлов/связей
      if (event.ctrlKey || event.metaKey) {
        if (selectedEdges.has(d)) {
          selectedEdges.delete(d);
        } else {
          selectedEdges.add(d);
        }
      } else {
        // Обычный клик - умная логика
        const connectedToSelectedNodes = isEdgeConnectedToSelectedNodes(d);
        
        if (connectedToSelectedNodes && selectedNodes.size > 0) {
          if (selectedEdges.size === 1 && selectedEdges.has(d)) {
            selectedEdges.clear();
          } else {
            selectedEdges.clear();
            selectedEdges.add(d);
          }
        } else {
          selectedNodes.clear();
          if (selectedEdges.size === 1 && selectedEdges.has(d)) {
            selectedEdges.clear();
          } else {
            selectedEdges.clear();
            selectedEdges.add(d);
          }
        }
      }
      
      highlightCombined();
    }

export { clickCount, clickTimer, handleLinkClick, handleLinkSelect, handleNodeClick, lastClickedNode, linkClickCount, linkClickTimer };
