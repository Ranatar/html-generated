// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { isNodeVisible } from '../core/visibility.js';
import { initializeMetricsData } from './data.js';
import { effectiveScopeFlags, transformForScope } from './scope.js';

function initializePhilosophyMetrics() {
      try {
        // C3: при области 'filtered' метрики строятся по видимому подграфу
        const _scopeNodes = S.metricsScope === 'filtered'
          ? DATA.nodes.filter(n => isNodeVisible(n)) : DATA.nodes;
        const _scopeIds = new Set(_scopeNodes.map(n => n.id));
        const _scopeLinks = S.metricsScope === 'filtered'
          ? DATA.links.filter(l => _scopeIds.has(l.source.id || l.source)
                   && _scopeIds.has(l.target.id || l.target))
          : DATA.links;

        const conceptsData = _scopeNodes.map(n => ({
          id: n.id,
          label: n.label,
          philosopher: n.concept,
          rubrics: n.rubrics || []
        }));
        
        const relationsData = _scopeLinks.map(l => ({
          source: typeof l.source === 'object' ? l.source.id : l.source,
          target: typeof l.target === 'object' ? l.target.id : l.target,
          type: l.type || 'influence',
          weight: l.weight || 1,
          bidirectional: l.bidirectional || false
        }));
        
        // Область учёта: при снятой галочке метрики получают
        // преобразованную копию (веса равными либо все связи взаимными).
        // Живые массивы при этом не трогаются.
        const _eff = (typeof effectiveScopeFlags === 'function')
          ? effectiveScopeFlags() : { weights: true, direction: true };
        const relationsScoped = (typeof transformForScope === 'function')
          ? transformForScope(relationsData, _eff.weights, _eff.direction)
          : relationsData;

        // ИСПРАВЛЕНО: используем реальные данные философов
        const philosopherNameMap = {};
        DATA.philosophers.forEach(p => {
          philosopherNameMap[p.nameRu] = p;
        });
        
        const uniquePhilosophers = Array.from(new Set(_scopeNodes.map(n => n.concept)));
        const philosophersData = uniquePhilosophers.map(concept => {
          const philData = philosopherNameMap[concept];
          return {
            id: concept,
            name: concept,
            birth: philData ? philData.birth : 0,
            death: philData ? philData.death : 0,
            // Метрики работают не на живых записях, а на ПРОЕКЦИИ, и всякое
            // новое поле надо вносить в неё явно — как внесены rubrics в
            // conceptsData. Без этой строки мостовость считала все внешние
            // связи межтрадиционными: у всех философов список традиций был
            // пуст, общих не находилось ни у кого, и метрика давала ровно
            // 100 % у всех 293 концепций. Поймано распределением, а не глазом.
            traditions: philData ? (philData.traditions || []) : []
          };
        });
        
        initializeMetricsData(conceptsData, relationsScoped, philosophersData);
        
        console.log('✅ Философские метрики инициализированы');
        return true;
      } catch (error) {
        console.error('❌ Ошибка при инициализации метрик:', error);
        return false;
      }
    }

export { initializePhilosophyMetrics };
