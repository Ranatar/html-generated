// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { selectedEdges, selectedNodes } from '../state.js';

function highlightNodeById(nodeId) {
      const nodeData = DATA.nodes.find(n => n.id === nodeId);
      if (nodeData) {
        selectedNodes.clear();
        selectedNodes.add(nodeData);
        highlightConnected([nodeData]);
        
        // Центрируем на узле
        const nodeElement = S.gfxNode.filter(d => d.id === nodeId);
        if (nodeElement.size() > 0) {
          const d = nodeElement.datum();
          const transform = d3.zoomIdentity
            .translate(S.viewWidth / 2 - d.x, S.viewHeight / 2 - d.y)
            .scale(1.5);
          S.gfxSvg.transition().duration(750).call(S.gfxZoom.transform, transform);
        }
      }
    }

function isEdgeConnectedToNode(edge, nodeData) {
      const sourceId = edge.source.id || edge.source;
      const targetId = edge.target.id || edge.target;
      return sourceId === nodeData.id || targetId === nodeData.id;
    }

function isNodeConnectedToSelectedEdges(nodeData) {
      for (const edge of selectedEdges) {
        if (isEdgeConnectedToNode(edge, nodeData)) {
          return true;
        }
      }
      return false;
    }

function isEdgeConnectedToSelectedNodes(edge) {
      for (const nodeData of selectedNodes) {
        if (isEdgeConnectedToNode(edge, nodeData)) {
          return true;
        }
      }
      return false;
    }

function highlightCombined() {
      // Если ничего не выделено - сбрасываем всё
      if (selectedNodes.size === 0 && selectedEdges.size === 0) {
        resetHighlight();
        return;
      }
      
      const highlightedNodes = new Set();
      const highlightedLinks = new Set();
      
      // КЛЮЧЕВАЯ ЛОГИКА: если выделены И узлы, И связи одновременно,
      // показываем ТОЛЬКО выделенные элементы (свёрнутое окружение)
      const isCollapsedMode = selectedNodes.size > 0 && selectedEdges.size > 0;
      
      if (isCollapsedMode) {
        // Режим с узлами и связями: показываем выделенные узлы с их окружением + выделенные связи
        
        // Добавляем выделенные узлы и их окружение
        selectedNodes.forEach(nodeData => {
          highlightedNodes.add(nodeData.id);
          
          // Находим все связанные узлы и связи для каждого выделенного узла
          DATA.links.forEach(l => {
            const sourceId = l.source.id || l.source;
            const targetId = l.target.id || l.target;
            
            if (sourceId === nodeData.id) {
              highlightedNodes.add(targetId);
              highlightedLinks.add(l);
            } else if (targetId === nodeData.id) {
              highlightedNodes.add(sourceId);
              highlightedLinks.add(l);
            }
          });
        });
        
        // Добавляем выделенные связи и их узлы
        selectedEdges.forEach(edge => {
          const sourceId = edge.source.id || edge.source;
          const targetId = edge.target.id || edge.target;
          
          highlightedNodes.add(sourceId);
          highlightedNodes.add(targetId);
          highlightedLinks.add(edge);
        });
        
      } else if (selectedNodes.size > 0) {
        // Только узлы выделены: показываем полное окружение
        
        selectedNodes.forEach(selectedData => {
          highlightedNodes.add(selectedData.id);
          
          // Находим все связанные узлы и связи
          DATA.links.forEach(l => {
            const sourceId = l.source.id || l.source;
            const targetId = l.target.id || l.target;
            
            if (sourceId === selectedData.id) {
              highlightedNodes.add(targetId);
              highlightedLinks.add(l);
            } else if (targetId === selectedData.id) {
              highlightedNodes.add(sourceId);
              highlightedLinks.add(l);
            }
          });
        });
        
      } else {
        // Только связи выделены: показываем связи и их узлы
        
        selectedEdges.forEach(edge => {
          const sourceId = edge.source.id || edge.source;
          const targetId = edge.target.id || edge.target;
          
          highlightedNodes.add(sourceId);
          highlightedNodes.add(targetId);
          highlightedLinks.add(edge);
        });
      }
      
      // Применяем стили
      const selectedNodeIds = new Set(Array.from(selectedNodes).map(n => n.id));
      
      S.gfxNode.classed("dimmed", d => !highlightedNodes.has(d.id))
        .classed("highlighted", d => highlightedNodes.has(d.id))
        .classed("selected", d => selectedNodeIds.has(d.id));
      
      S.gfxLinkAll.classed("dimmed", l => !highlightedLinks.has(l))
        .classed("highlighted", l => highlightedLinks.has(l))
        .classed("selected", l => selectedEdges.has(l));
    }

function highlightConnected(selectedDataArray) {
      const connectedNodes = new Set();
      const connectedLinks = new Set();
      
      // Обрабатываем каждый выбранный узел
      selectedDataArray.forEach(selectedData => {
        connectedNodes.add(selectedData.id);
        
        // Находим все связанные узлы и связи
        DATA.links.forEach(l => {
          const sourceId = l.source.id || l.source;
          const targetId = l.target.id || l.target;
          
          if (sourceId === selectedData.id) {
            connectedNodes.add(targetId);
            connectedLinks.add(l);
          } else if (targetId === selectedData.id) {
            connectedNodes.add(sourceId);
            connectedLinks.add(l);
          }
        });
      });
      
      // Применяем стили пакетно для лучшей производительности
      const selectedIds = new Set(selectedDataArray.map(sd => sd.id));

      S.gfxNode.classed("dimmed", d => !connectedNodes.has(d.id))
        .classed("highlighted", d => connectedNodes.has(d.id))
        .classed("selected", d => selectedIds.has(d.id));

      // Применяем стили к видимому пути внутри группы
      S.gfxLinkAll.classed("dimmed", l => !connectedLinks.has(l))
        .classed("highlighted", l => connectedLinks.has(l));
    }

function resetHighlight() {
      selectedNodes.clear();
      selectedEdges.clear();
      S.gfxNode.classed("dimmed", false)
        .classed("highlighted", false)
        .classed("selected", false);
      S.gfxLinkAll.classed("dimmed", false)
        .classed("highlighted", false)
        .classed("selected", false)
        .classed("path-highlight", false);
    }

export { highlightCombined, highlightConnected, highlightNodeById, isEdgeConnectedToNode, isEdgeConnectedToSelectedNodes, isNodeConnectedToSelectedEdges, resetHighlight };
