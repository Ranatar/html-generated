// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { isSymmetricLink } from '../core/link-facts.js';
import { CHAIN_SEARCH } from '../core/long-task.js';

function buildAdjacencyGraph(filteredNodes, nodeById) {
      // pathLinkAllowed отсекает петли и, при включённом переключателе,
      // типологические связи — та же логика, что в поиске пути
      const adjacency = new Map();
      filteredNodes.forEach(n => adjacency.set(n.id, []));
      
      DATA.links.forEach(l => {
        if (!S.selectedRelations.has(l.type)) return;
        
        // Проверка рубрик
        const sourceId = l.source.id || l.source;
        const targetId = l.target.id || l.target;
        const sourceRubrics = DATA.conceptToRubrics[sourceId] || [];
        const targetRubrics = DATA.conceptToRubrics[targetId] || [];
        
        const sourceHasSelectedRubric = sourceRubrics.length === 0 || 
                         sourceRubrics.some(r => S.selectedRubrics.has(r));
        const targetHasSelectedRubric = targetRubrics.length === 0 || 
                         targetRubrics.some(r => S.selectedRubrics.has(r));
        
        if (!sourceHasSelectedRubric || !targetHasSelectedRubric) return;
        
        if (!nodeById.has(sourceId) || !nodeById.has(targetId)) return;
        
        if (!adjacency.has(sourceId)) adjacency.set(sourceId, []);
        adjacency.get(sourceId).push({ nodeId: targetId, link: l });
        
        if (isSymmetricLink(l)) {
          if (!adjacency.has(targetId)) adjacency.set(targetId, []);
          adjacency.get(targetId).push({ nodeId: sourceId, link: l });
        }
      });
      
      return adjacency;
    }

function processBFS(startNode, startPhil, philsArray, adjacency, nodeById, 
              nodesInChains, linksInChains, uniqueMode) {
      // F5: состояние пути — БИТОВАЯ МАСКА посещённых философов, а не Set.
      // «Этот философ уже был» и доминирование по включению сводятся
      // к двум операциям И. Замер: на множествах 6 тыс. раскрытий
      // в секунду, на масках — 360 тыс.
      const philIndex = new Map(philsArray.map((ph, i) => [ph, i]));
      const bitOf = c => ((c < 32 ? (1 << c) : (1 << (c - 32))) >>> 0);
      const colourOf = id => {
        const n = nodeById.get(id);
        if (!n) return -1;
        const c = philIndex.get(n.concept);
        return c === undefined ? -1 : c;
      };
      const c0 = colourOf(startNode.id);
      const lo0 = (c0 >= 0 && c0 < 32) ? bitOf(c0) : 0;
      const hi0 = (c0 >= 32) ? bitOf(c0) : 0;
      
      const queue = [{
        nodeId: startNode.id,
        path: [startNode.id],
        linkPath: [],
        lo: lo0, hi: hi0, count: c0 >= 0 ? 1 : 0
      }];
      
      // ДВЕ СТРАТЕГИИ ОТСЕЧЕНИЯ, выбор по режиму.
      //
      // 'exact' — доминирование по ВКЛЮЧЕНИЮ: состояние отбрасывается,
      // только если тот же узел уже достигался НАДмножеством философов.
      // Полно и корректно. Применяется в уникальном режиме, где путь
      // не длиннее числа философов: замер — 33 системы исчерпываются
      // за 5.3 с, ложных «цепочек нет» не бывает.
      //
      // 'fast' — прежнее правило «набор больше по мощности». НЕПОЛНО:
      // теряет пути, пришедшие в узел с равным по мощности, но иным
      // набором. Применяется в режиме «Связанные сети», где путь
      // достигает 160–228 узлов и точное отсечение нежизнеспособно:
      // замер при 57 философах — 194 узла за 25 с у быстрой стратегии
      // против нуля за 60 с у точной. Пустой результат в этом режиме
      // НИКОГДА не выдаётся за доказательство отсутствия.
      //
      // Маска рассчитана на 64 философа; сверх того — только быстрая.
      const strategy = (uniqueMode && philsArray.length <= 64) ? 'exact' : 'fast';
      CHAIN_SEARCH.strategy = strategy;
      
      const visited = new Map();
      visited.set(startNode.id, strategy === 'exact' ? [lo0, hi0] : (c0 >= 0 ? 1 : 0));
      
      const isDominated = (id, lo, hi) => {
        const seen = visited.get(id);
        if (seen === undefined) return false;
        for (let i = 0; i < seen.length; i += 2) {
          if (((seen[i] & lo) >>> 0) === lo && ((seen[i + 1] & hi) >>> 0) === hi) return true;
        }
        return false;
      };
      const remember = (id, lo, hi) => {
        const seen = visited.get(id);
        if (seen === undefined) { visited.set(id, [lo, hi]); return; }
        // ранее виденные подмножества больше не нужны — новое их покрывает
        const kept = [];
        for (let i = 0; i < seen.length; i += 2) {
          if (!(((lo & seen[i]) >>> 0) === seen[i] && ((hi & seen[i + 1]) >>> 0) === seen[i + 1])) {
            kept.push(seen[i], seen[i + 1]);
          }
        }
        kept.push(lo, hi);
        visited.set(id, kept);
      };
      
      // F5: в уникальном режиме философ входит в путь не более одного раза,
      // поэтому путь физически не может быть длиннее их числа. Прежний
      // множитель 3 не ограничивал ничего. В неуникальном режиме философы
      // повторяются, и множитель 4 содержателен — он не трогается.
      const maxDepth = uniqueMode ? philsArray.length : philsArray.length * 4;
      
      while (queue.length > 0) {
        // F5: предел работы. Различаем «решений нет» и «поиск прерван»
        if (CHAIN_SEARCH.aborted || CHAIN_SEARCH.cancelled) return;
        if (CHAIN_SEARCH.outOfTime()) { CHAIN_SEARCH.aborted = true; return; }
        
        const { nodeId, path, linkPath, lo, hi, count } = queue.shift();
        
        if (path.length > maxDepth) continue;
        
        if (count === philsArray.length) {
          path.forEach(n => nodesInChains.add(n));
          linkPath.forEach(l => linksInChains.add(l));
          continue;
        }
        
        const neighbors = adjacency.get(nodeId) || [];
        for (const { nodeId: nextId, link } of neighbors) {
          if (path.includes(nextId)) continue;
          
          const c = colourOf(nextId);
          if (c < 0) continue;
          const bit = bitOf(c);
          const had = c < 32 ? (lo & bit) !== 0 : (hi & bit) !== 0;
          
          // КРИТИЧНО: проверка уникальности философа в uniqueMode
          if (uniqueMode && had) continue;
          
          const nlo = c < 32 ? ((lo | bit) >>> 0) : lo;
          const nhi = c >= 32 ? ((hi | bit) >>> 0) : hi;
          const ncount = had ? count : count + 1;
          
          if (strategy === 'exact') {
            if (isDominated(nextId, nlo, nhi)) continue;
            remember(nextId, nlo, nhi);
          } else {
            const prev = visited.get(nextId);
            if (prev !== undefined && ncount <= prev) continue;
            visited.set(nextId, ncount);
          }
          
          queue.push({
            nodeId: nextId,
            path: [...path, nextId],
            linkPath: [...linkPath, link],
            lo: nlo, hi: nhi, count: ncount
          });
        }
      }
    }

const CHAIN_WARN_THRESHOLD = 15;

function confirmLongChainSearch(count) {
      if (count <= CHAIN_WARN_THRESHOLD) return true;
      return window.confirm(
        'Выбрано философов: ' + count + '.\n\n' +
        'Поиск цепочек через такое число систем может занять десятки секунд ' +
        'и не гарантирует результата. Расчёт можно будет прервать кнопкой.\n\n' +
        'Продолжить?'
      );
    }

async function findChainsThroughAllPhilosophers(selectedPhils, progressCallback = null) {
      CHAIN_SEARCH.reset(false);
      const philsArray = Array.from(selectedPhils);
      const nodesInChains = new Set();
      const linksInChains = new Set();
      
      const filteredNodes = DATA.nodes.filter(n => selectedPhils.has(n.concept));
      const nodeById = new Map();
      filteredNodes.forEach(n => nodeById.set(n.id, n));
      
      const adjacency = buildAdjacencyGraph(filteredNodes, nodeById);
      
      const allStartNodes = [];
      philsArray.forEach(startPhil => {
        const philStartNodes = filteredNodes.filter(n => n.concept === startPhil);
        philStartNodes.forEach(node => {
          allStartNodes.push({ phil: startPhil, node: node });
        });
      });
      
      const totalStartNodes = allStartNodes.length;
      let processedStartNodes = 0;
      
      const CHUNK_SIZE = progressCallback ? 5 : allStartNodes.length;
      
      for (let i = 0; i < allStartNodes.length; i += CHUNK_SIZE) {
        const chunk = allStartNodes.slice(i, Math.min(i + CHUNK_SIZE, allStartNodes.length));
        
        chunk.forEach(({ phil: startPhil, node: startNode }) => {
          processBFS(startNode, startPhil, philsArray, adjacency, nodeById, 
                nodesInChains, linksInChains, false);
          processedStartNodes++;
        });
        
        if (progressCallback) {
          const progress = (processedStartNodes / totalStartNodes) * 100;
          progressCallback(progress);
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
      
      if (progressCallback) progressCallback(100);
      
      return { nodes: nodesInChains, links: linksInChains };
    }

async function findUniquePhilosopherChains(selectedPhils, progressCallback = null) {
      CHAIN_SEARCH.reset(true);
      const philsArray = Array.from(selectedPhils);
      const nodesInChains = new Set();
      const linksInChains = new Set();
      
      const filteredNodes = DATA.nodes.filter(n => selectedPhils.has(n.concept));
      const nodeById = new Map();
      filteredNodes.forEach(n => nodeById.set(n.id, n));
      
      const adjacency = buildAdjacencyGraph(filteredNodes, nodeById);
      
      const allStartNodes = [];
      philsArray.forEach(startPhil => {
        const philStartNodes = filteredNodes.filter(n => n.concept === startPhil);
        philStartNodes.forEach(node => {
          allStartNodes.push({ phil: startPhil, node: node });
        });
      });
      
      const totalStartNodes = allStartNodes.length;
      let processedStartNodes = 0;
      const CHUNK_SIZE = progressCallback ? 5 : allStartNodes.length;
      
      for (let i = 0; i < allStartNodes.length; i += CHUNK_SIZE) {
        const chunk = allStartNodes.slice(i, Math.min(i + CHUNK_SIZE, allStartNodes.length));
        
        chunk.forEach(({ phil: startPhil, node: startNode }) => {
          processBFS(startNode, startPhil, philsArray, adjacency, nodeById, 
                nodesInChains, linksInChains, true); // true = unique mode
          processedStartNodes++;
        });
        
        if (progressCallback) {
          const progress = (processedStartNodes / totalStartNodes) * 100;
          progressCallback(progress);
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
      
      if (progressCallback) progressCallback(100);
      
      return { nodes: nodesInChains, links: linksInChains };
    }

export { CHAIN_WARN_THRESHOLD, buildAdjacencyGraph, confirmLongChainSearch, findChainsThroughAllPhilosophers, findUniquePhilosopherChains, processBFS };
