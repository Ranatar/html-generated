// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from '../core/ns.js';
import { traditionsOfPhilosopher } from '../core/graph-index.js';
import { CHRONOLOGY_MODES } from '../core/labels.js';
import { isSymmetricLink } from '../core/predicates.js';
import { isChronologicallyValid } from './chronology.js';

function analyzePath(path, mode = CHRONOLOGY_MODES.STRICT) {
      const warnings = [];
      
      for (let i = 0; i < path.length - 1; i++) {
        const fromId = path[i];
        const toId = path[i + 1];
        
        // B1: анахронизм определяется с учётом типа ребра. Для
        // ретроспективных типов (критика, полемика, противостояние)
        // анахронизмом является ПРЯМОЙ порядок, а не обратный.
        const edge = DATA.links.find(l => {
          const s = l.source.id || l.source, t = l.target.id || l.target;
          return (s === fromId && t === toId) || (isSymmetricLink(l) && t === fromId && s === toId);
        });
        const edgeType = edge ? edge.type : null;
        
        if (!isChronologicallyValid(fromId, toId, mode, edgeType)) {
          const fromNode = DATA.nodes.find(n => n.id === fromId);
          const toNode = DATA.nodes.find(n => n.id === toId);
          
          if (fromNode && toNode) {
            const fromPhil = DATA.philosophers.find(p => p.nameRu === fromNode.concept);
            const toPhil = DATA.philosophers.find(p => p.nameRu === toNode.concept);
            
            if (fromPhil && toPhil) {
              warnings.push({
                from: fromNode.label,
                to: toNode.label,
                fromPhil: fromNode.concept,
                toPhil: toNode.concept,
                fromYears: `${fromPhil.birth}-${fromPhil.death}`,
                toYears: `${toPhil.birth}-${toPhil.death}`
              });
            }
          }
        }
      }
      
      return warnings;
    }

function analyzePathTraditions(pathNodes) {
      const segments = [];
      for (let i = 0; i < pathNodes.length - 1; i++) {
        const a = pathNodes[i].concept, b = pathNodes[i + 1].concept;
        if (a === b) { segments.push({ kind: 'internal' }); continue; }
        const ta = DATA.philosopherTraditions[a] || [], tb = DATA.philosopherTraditions[b] || [];
        const shared = ta.filter(x => tb.includes(x));
        segments.push(shared.length
          ? { kind: 'shared', shared: shared.map(id =>
              (DATA.traditions.find(t => t.id === id) || {}).name).filter(Boolean) }
          : { kind: 'crossing', from: traditionsOfPhilosopher(a),
              to: traditionsOfPhilosopher(b) });
      }
      // Различных традиций и переходов считаем ПОРОЗНЬ: цепочка может выйти
      // из традиции и вернуться в неё, и слитный счёт тогда солгал бы.
      const distinct = new Set();
      pathNodes.forEach(n => (DATA.philosopherTraditions[n.concept] || [])
        .forEach(id => distinct.add(id)));
      return { segments, crossings: segments.filter(s => s.kind === 'crossing').length,
               distinct: distinct.size };
    }

export { analyzePath, analyzePathTraditions };
