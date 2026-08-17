// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';
import { isSymmetricLink } from '../core/link-facts.js';
import { metricsLinks, metricsNodes } from './scope-select.js';

function buildGlobalGraphCache() {
      if (graphCache) return graphCache;
      
      const graph = {
        adjacency: {},    // Список смежности
        inNeighbors: {},  // Входящие соседи (для направленного графа)
        outNeighbors: {},   // Исходящие соседи (для направленного графа)
        allNeighbors: {},   // Все соседи (для ненаправленного)
        edgeWeights: {}   // Веса рёбер
      };
      
      // Источник подменяем: при снятой галочке метрики читают копию,
      // а живая база остаётся нетронутой.
      const _srcNodes = metricsNodes();
      const _srcLinks = metricsLinks();

      // Инициализация
      _srcNodes.forEach(n => {
        graph.adjacency[n.id] = [];
        graph.inNeighbors[n.id] = [];
        graph.outNeighbors[n.id] = [];
        graph.allNeighbors[n.id] = [];
        graph.edgeWeights[n.id] = {};
      });
      
      // Построение графа
      _srcLinks.forEach(link => {
        const src = link.source.id || link.source;
        const tgt = link.target.id || link.target;
        const weight = link.weight || 2;
        
        // КРИТИЧНО: учитываем useWeightedPaths при построении!
        // Когда источник подменён, учёт уже сделан в данных, и эти
        // ветки применили бы его ВТОРОЙ раз.
        const _w = S.metricsScopeActive || S.useWeightedPaths;
        const distance = _w ? (4 - weight) : 1;
        const effectiveWeight = _w ? weight : 1;
        
        // Сохранение весов
        if (!graph.edgeWeights[src][tgt]) {
          graph.edgeWeights[src][tgt] = { weight: effectiveWeight, distance: distance };
        }
        
        // При подмене источника учёт направленности уже сделан в данных
        // (всем связям проставлена взаимность), и эта ветка применила бы
        // его вторым слоем.
        if (S.metricsScopeActive || S.respectDirection) {
          // Направленный граф
          graph.outNeighbors[src].push({ node: tgt, weight: effectiveWeight, distance: distance });
          graph.inNeighbors[tgt].push({ node: src, weight: effectiveWeight, distance: distance });
          
          // C1: здесь же решается проходимость при поиске пути.
          // Без isSymmetricLink симметричные связи стали бы
          // односторонними при включённой направленности.
          if (isSymmetricLink(link)) {
            graph.outNeighbors[tgt].push({ node: src, weight: effectiveWeight, distance: distance });
            graph.inNeighbors[src].push({ node: tgt, weight: effectiveWeight, distance: distance });
            
            if (!graph.edgeWeights[tgt][src]) {
              graph.edgeWeights[tgt][src] = { weight: effectiveWeight, distance: distance };
            }
          }
          
          // Для общего списка смежности
          graph.adjacency[src].push({ node: tgt, weight: effectiveWeight, distance: distance });
          graph.adjacency[tgt].push({ node: src, weight: effectiveWeight, distance: distance });
        } else {
          // Ненаправленный граф
          graph.adjacency[src].push({ node: tgt, weight: effectiveWeight, distance: distance });
          graph.adjacency[tgt].push({ node: src, weight: effectiveWeight, distance: distance });
        }

        // Неориентированная смежность нужна ВСЕГДА, а не только во
        // второй ветке: её читают обходы в неориентированном режиме,
        // кластеризация, степень связности, rich-club и локальная
        // когезия. Прежде она заполнялась лишь в else, и при подмене
        // источника (когда ветка всегда первая) все они давали нули.
        graph.allNeighbors[src].push({ node: tgt, weight: effectiveWeight, distance: distance });
        graph.allNeighbors[tgt].push({ node: src, weight: effectiveWeight, distance: distance });
      });
      
      // Удаление дубликатов
      Object.keys(graph.adjacency).forEach(nodeId => {
        const seen = new Set();
        graph.adjacency[nodeId] = graph.adjacency[nodeId].filter(neighbor => {
          if (seen.has(neighbor.node)) return false;
          seen.add(neighbor.node);
          return true;
        });
      });
      
      ['inNeighbors', 'outNeighbors', 'allNeighbors'].forEach(key => {
        Object.keys(graph[key]).forEach(nodeId => {
          const seen = new Set();
          graph[key][nodeId] = graph[key][nodeId].filter(neighbor => {
            if (seen.has(neighbor.node)) return false;
            seen.add(neighbor.node);
            return true;
          });
        });
      });
      
      graphCache = graph;
      return graph;
    }

let graphCache = null;

function invalidateGraphCache() { graphCache = null; }

export { buildGlobalGraphCache, graphCache, invalidateGraphCache };
