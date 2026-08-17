// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { известить } from '../core/events.js';
import { showTemporaryMessage } from '../core/long-task.js';
import { gfxLinkAll, gfxNode } from './d3-layer.js';
import { requestDraw } from './loop.js';
import { выбранныеФилософы } from '../state/filters.js';
import { selectedEdges, selectedNodes } from '../state/render.js';

function highlightPhilosopherOnGraph(имя, добавить) {
      if (добавить) {
        if (выбранныеФилософы.has(имя)) выбранныеФилософы.delete(имя);
        else выбранныеФилософы.add(имя);
      } else {
        выбранныеФилософы.clear();
        выбранныеФилософы.add(имя);
      }
      if (!выбранныеФилософы.size) {
        известить('философы-выбраны');
        resetHighlight();
        requestDraw();
        return;
      }

      const свои = DATA.nodes.filter(n => выбранныеФилософы.has(n.concept));
      if (!свои.length) return;

      selectedNodes.clear();
      selectedEdges.clear();
      resetHighlight();

      const мои = new Set(свои.map(n => n.id));
      const конец = l => [l.source.id || l.source, l.target.id || l.target];
      const касается = l => { const [a, b] = конец(l); return мои.has(a) || мои.has(b); };
      const внутри  = l => { const [a, b] = конец(l); return мои.has(a) && мои.has(b); };

      // СОСЕДИ ПО ВНЕШНИМ СВЯЗЯМ НЕ ГАСЯТСЯ. Прежде они гасли до 0,2, а сами
      // связи оставались обычными — выходили «связи в никуда». У концепций
      // четыре состояния, и третье как раз впору: выбранная (жёлтый ободок,
      // толщина 6), подсвеченная (белый ободок 5 со свечением), обычная
      // (белый 3), приглушённая (0,2). Жёлтый остаётся ТОЛЬКО за явным
      // выбором — концепции философа берут подсвеченное состояние, соседи
      // остаются обычными, и связь к ним ведёт к видимому.
      const соседи = new Set();
      DATA.links.forEach(l => {
        const [a, b] = конец(l);
        if (мои.has(a) && !мои.has(b)) соседи.add(b);
        if (мои.has(b) && !мои.has(a)) соседи.add(a);
      });

      известить('философы-выбраны');
      gfxNode.classed('highlighted', d => мои.has(d.id));
      gfxNode.classed('dimmed', d => !мои.has(d.id) && !соседи.has(d.id));
      gfxLinkAll.classed('highlighted', внутри);
      gfxLinkAll.classed('dimmed', l => !касается(l));

      requestDraw();
      // Поле поиска чистит ВЫЗЫВАЮЩИЙ: подсветка на графе не должна знать о
      // легенде — иначе она тянет за собой ввоз снизу вверх (замер: одно
      // ребро 5→6 появилось ровно из-за этой строки).
      const имена = [...выбранныеФилософы];
      showTemporaryMessage(имена.length === 1
        ? `${имена[0]}: концепций ${свои.length}, соседей ${соседи.size}`
        : `Выбрано философов: ${имена.length}, концепций ${свои.length}`);
    }

function highlightNodeById(nodeId) {
      const nodeData = DATA.nodes.find(n => n.id === nodeId);
      if (nodeData) {
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
        // Показ поверх отбора держался РАДИ выделения: концепцию показали,
        // чтобы её было видно выбранной. Выделения нет — нужды в ней нет,
        // и кнопка «Вернуть отбор» предлагала бы отменить то, чего уже не
        // делают. Сброс идёт ЗДЕСЬ, а не в resetHighlight: тот зовётся и
        // при НОВОЙ подсветке, и показ снимался бы в тот же миг, что и
        // ставился (проверено — снимался).
        известить('выделение-снято');
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
      
      gfxNode.classed("dimmed", d => !highlightedNodes.has(d.id))
        .classed("highlighted", d => highlightedNodes.has(d.id))
        .classed("selected", d => selectedNodeIds.has(d.id));
      
      gfxLinkAll.classed("dimmed", l => !highlightedLinks.has(l))
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

      gfxNode.classed("dimmed", d => !connectedNodes.has(d.id))
        .classed("highlighted", d => connectedNodes.has(d.id))
        .classed("selected", d => selectedIds.has(d.id));

      // Применяем стили к видимому пути внутри группы
      gfxLinkAll.classed("dimmed", l => !connectedLinks.has(l))
        .classed("highlighted", l => connectedLinks.has(l));
    }

function resetHighlight() {
      selectedNodes.clear();
      selectedEdges.clear();
      gfxNode.classed("dimmed", false)
        .classed("highlighted", false)
        .classed("selected", false);
      gfxLinkAll.classed("dimmed", false)
        .classed("highlighted", false)
        .classed("selected", false)
        .classed("path-highlight", false);
    }

export { highlightCombined, highlightConnected, highlightNodeById, highlightPhilosopherOnGraph, isEdgeConnectedToNode, isEdgeConnectedToSelectedNodes, isNodeConnectedToSelectedEdges, resetHighlight };
