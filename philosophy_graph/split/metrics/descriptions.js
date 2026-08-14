// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';

function getMetricDescription(metricKey) {
      const desc = S.metricDescriptions[metricKey];
      if (!desc) return null;
      
      return {
        name: desc.name,
        description: desc.description,
        interpretation: typeof desc.interpretation === 'function' ? desc.interpretation() : desc.interpretation,
        usage: typeof desc.usage === 'function' ? desc.usage() : desc.usage,
        formula: typeof desc.formula === 'function' ? desc.formula() : desc.formula
      };
    }

export { getMetricDescription };
