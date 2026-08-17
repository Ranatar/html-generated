// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, MET, S } from './core/ns.js';
import { buildGlobalGraphCache } from './metrics/graph-cache.js';
import { showSimilarityOverlay } from './render/similarity-overlay.js';

function findConnectedComponents() {
      const visited = new Set();
      const components = [];
      const graph = buildGlobalGraphCache();
      
      DATA.nodes.forEach(node => {
        if (visited.has(node.id)) return;
        
        const component = [];
        const queue = [node.id];
        visited.add(node.id);
        
        while (queue.length > 0) {
          const current = queue.shift();
          component.push(current);
          
          // Получаем соседей из предпостроенного графа
          const neighbors = S.respectDirection 
            ? (graph.outNeighbors[current] || [])
            : (graph.allNeighbors[current] || []);
          
          neighbors.forEach(({ node: neighbor }) => {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push(neighbor);
            }
          });
        }
        
        components.push(component);
      });
      
      return components;
    }

const TENSION_WEIGHTS = {
      immanent: 1.05,    // внутренние противоречия концепта
      polemical: 1.10,   // столкновения с чужими концептами
      dialectical: 0.85  // снятие противоречий через синтез и опосредование
    };

function tensionScales() {
      if (S._tensionScales) return S._tensionScales;
      // Защита от рекурсии: пока считаем сигмы, tensionIndex вызывается
      // ради самих ярусов, а его total нам не нужен.
      if (S._tensionScalesComputing) return { imm: 1, pol: 1, dial: 1 };

      S._tensionScalesComputing = true;
      const imm = [], pol = [], dial = [];
      for (const c of S._concepts) {
        const t = MET.tensionIndex(c.id);
        imm.push(t.immanentTension || 0);
        pol.push(t.polemicalTension || 0);
        dial.push(t.dialecticalTension || 0);
      }
      S._tensionScalesComputing = false;

      const sigma = a => {
        const m = a.reduce((s, v) => s + v, 0) / a.length;
        return Math.sqrt(a.reduce((s, v) => s + (v - m) * (v - m), 0) / a.length) || 1;
      };
      S._tensionScales = { imm: sigma(imm), pol: sigma(pol), dial: sigma(dial) };
      return S._tensionScales;
    }

function toggleSimilarityKind() {
      if (!S.similarityOverlay) return;
      showSimilarityOverlay(S.similarityOverlay.sourceId,
        S.similarityOverlay.kind === 'profile' ? 'structure' : 'profile');
    }

export { TENSION_WEIGHTS, findConnectedComponents, tensionScales, toggleSimilarityKind };
