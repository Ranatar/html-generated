// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { isSymmetricLink, isTypologicalLink } from '../core/predicates.js';
import { isChronologicallyValid } from './chronology.js';

function pathLinkAllowed(l) {
      // Петля не ведёт никуда: путь через неё удлиняется, ничего
      // не достигая, а при взвешенном поиске даёт нулевое приращение
      // расстояния и может зациклить обход.
      const s = (l.source && l.source.id) || l.source;
      const t = (l.target && l.target.id) || l.target;
      if (s === t) return false;
      return !(S.skipTypologicalInPaths && isTypologicalLink(l));
    }

function findShortestPath(sourceId, targetId, respectChronology = true, useDirection = null) {
      // Используем глобальный параметр, если не передан явно
      const shouldRespectDirection = useDirection !== null ? useDirection : S.respectDirection;
      
      if (S.useWeightedPaths) {
        return findShortestPathWeighted(sourceId, targetId, respectChronology, shouldRespectDirection);
      } else {
        return findShortestPathUnweighted(sourceId, targetId, respectChronology, shouldRespectDirection);
      }
    }

function findShortestPathWeighted(sourceId, targetId, respectChronology = true, shouldRespectDirection = true) {
      if (sourceId === targetId) return [sourceId];
      
      const distances = {};
      const previous = {};
      const unvisited = new Set();
      
      DATA.nodes.forEach(n => {
        distances[n.id] = Infinity;
        previous[n.id] = null;
        unvisited.add(n.id);
      });
      
      distances[sourceId] = 0;
      
      while (unvisited.size > 0) {
        // Найти узел с минимальным расстоянием
        let current = null;
        let minDist = Infinity;
        unvisited.forEach(nodeId => {
          if (distances[nodeId] < minDist) {
            minDist = distances[nodeId];
            current = nodeId;
          }
        });
        
        if (current === null || distances[current] === Infinity) break;
        if (current === targetId) break;
        
        unvisited.delete(current);
        
        const currentNode = DATA.nodes.find(n => n.id === current);
        
        // Обновить расстояния до соседей
        DATA.links.forEach(link => {
          if (!pathLinkAllowed(link)) return;
          const src = link.source.id || link.source;
          const tgt = link.target.id || link.target;
          
          let neighbor = null;
          let canTraverse = false;
          
          if (shouldRespectDirection) {
            // Учитываем направленность
            if (src === current) {
              neighbor = tgt;
              canTraverse = true;
            } else if (isSymmetricLink(link) && tgt === current) {
              neighbor = src;
              canTraverse = true;
            }
          } else {
            // Не учитываем направленность - граф ненаправленный
            if (src === current) {
              neighbor = tgt;
              canTraverse = true;
            } else if (tgt === current) {
              neighbor = src;
              canTraverse = true;
            }
          }
          
          if (canTraverse && neighbor && unvisited.has(neighbor)) {
            // Преобразуем вес: больший вес = меньшая "стоимость" связи
            const weight = link.weight || 2;
            const cost = 4 - weight;
            const alt = distances[current] + cost;
            
            if (respectChronology) {
              // B1: тип ребра определяет, в какую сторону оно читается
              if (!isChronologicallyValid(current, neighbor, S.currentChronologyMode, link.type)) {
                return; // Пропускаем этот переход как хронологически некорректный
              }
            }
            
            if (alt < distances[neighbor]) {
              distances[neighbor] = alt;
              previous[neighbor] = current;
            }
          }
        });
      }
      
      // Восстановить путь
      if (distances[targetId] === Infinity) return null;
      
      const path = [];
      let current = targetId;
      while (current !== null) {
        path.unshift(current);
        current = previous[current];
      }
      
      return path;
    }

function findShortestPathUnweighted(sourceId, targetId, respectChronology = true, shouldRespectDirection = true) {
      if (sourceId === targetId) return [sourceId];
      
      const queue = [[sourceId]];
      const visited = new Set([sourceId]);
      
      // B1: список смежности хранит тип ребра — он нужен для проверки хронологии
      const adjacency = {};
      DATA.nodes.forEach(n => adjacency[n.id] = []);
      
      DATA.links.forEach(l => {
        if (!pathLinkAllowed(l)) return;
        const src = l.source.id || l.source;
        const tgt = l.target.id || l.target;
        
        if (shouldRespectDirection) {
          adjacency[src].push({ id: tgt, type: l.type });
          if (isSymmetricLink(l)) {
            adjacency[tgt].push({ id: src, type: l.type });
          }
        } else {
          adjacency[src].push({ id: tgt, type: l.type });
          adjacency[tgt].push({ id: src, type: l.type });
        }
      });
      
      while (queue.length > 0) {
        const path = queue.shift();
        const currentNodeId = path[path.length - 1];
        
        if (currentNodeId === targetId) {
          return path;
        }
        
        const neighbors = adjacency[currentNodeId] || [];
        for (const edge of neighbors) {
          const neighborId = edge.id;
          if (!visited.has(neighborId)) {
            if (respectChronology) {
              // B1: тип ребра определяет, в какую сторону оно читается
              if (!isChronologicallyValid(currentNodeId, neighborId, S.currentChronologyMode, edge.type)) {
                continue; // Пропускаем этот переход как хронологически некорректный
              }
            }
            
            visited.add(neighborId);
            queue.push([...path, neighborId]);
          }
        }
      }
      
      return null;
    }

export { findShortestPath, findShortestPathUnweighted, findShortestPathWeighted, pathLinkAllowed };
