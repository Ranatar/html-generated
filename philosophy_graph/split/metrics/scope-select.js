// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';

function metricsLinks() { return S.metricsLinkSource || DATA.links; }

function metricsNodes() { return S.metricsNodeSource || DATA.nodes; }

function transformForScope(list, useWeights, useDirection) {
      if (useWeights && useDirection) return list;
      return list.map(r => {
        const copy = Object.assign({}, r);
        if (!useWeights) copy.weight = 1;
        if (!useDirection) copy.bidirectional = true;
        return copy;
      });
    }

function effectiveScopeFlags(viewName) {
      const f = METRIC_FLAGS[VIEW_METRIC[viewName || S.currentStatsView]];
      if (!f) return { weights: S.useWeightedPaths, direction: S.respectDirection };
      return {
        weights:   f.weights === 'yes' ? S.useWeightedPaths : true,
        direction: f.direction === 'no' ? true : S.respectDirection
      };
    }

const METRIC_FLAGS = {
      // путевые: галочки применимы начисто, это их родная область
      calculateWeightedDegree:    { weights: 'yes', direction: 'yes' },
      calculatePageRank:        { weights: 'yes', direction: 'yes' },
      calculateBetweenness:       { weights: 'yes', direction: 'yes' },
      calculateClosenessCentrality:   { weights: 'yes', direction: 'yes' },
      calculateEigenvectorCentrality: { weights: 'yes', direction: 'yes' },
      calculateClusteringCoefficient: { weights: 'yes', direction: 'yes' },
      calculateWeightedClustering:  { weights: 'yes', direction: 'yes' },
      calculateRichClubCoefficient:   { weights: 'yes', direction: 'yes' },
      calculateLocalCohesion:     { weights: 'yes', direction: 'yes' },

      // определены через ОДНО направление — галочка направленности гаснет
      influenceIndex:      { weights: 'yes', direction: 'no' },
      conceptualFertilityIndex:  { weights: 'yes',  direction: 'no' },
      conceptualContinuityIndex: { weights: 'no',  direction: 'no' },
      deductiveIndex:      { weights: 'yes',  direction: 'no' },
      generativeIndex:       { weights: 'yes',  direction: 'no' },
      instrumentalIndex:     { weights: 'yes',  direction: 'no' },
      traditionBridgingIndex:  { weights: 'yes',  direction: 'no' },

      // складывают входящие с исходящими — при снятой направленности вдвое
      abstractionIndex:      { weights: 'yes', direction: 'no' },   // разностная метрика: без направленности тождественный ноль
      criticalPowerIndex:    { weights: 'yes', direction: 'halve' },
      dialogicalIndex:       { weights: 'yes',  direction: 'halve' },
      internalCoherenceIndex:  { weights: 'yes',  direction: 'halve' },
      paradigmShiftIndex:    { weights: 'yes',  direction: 'halve' },
      problemGenerationIndex:  { weights: 'yes', direction: 'halve' },
      revolutionaryIndex:    { weights: 'yes', direction: 'halve' },
      syntheticIndex:      { weights: 'no',  direction: 'halve' },
      transformationIndex:     { weights: 'yes',  direction: 'halve' },

      // то же, но с ненаправленными слагаемыми от петель — приблизительно
      conceptualComplexityIndex: { weights: 'no', direction: 'approx' },
      foundationalIndex:     { weights: 'yes', direction: 'approx' },
      tensionIndex:        { weights: 'yes', direction: 'approx' },

      // Вес в формуле не участвует вовсе (ни одного упоминания weight),
      // а направленность существенна.
      temporalInfluencePattern:  { weights: 'no',  direction: 'yes' },

      // не читают ни весов, ни направления
      deductiveDepth:          { weights: 'no', direction: 'no' },
      philosopherHistoricalReachIndex:   { weights: 'no', direction: 'no' },
      philosopherInterdisciplinaryIndex: { weights: 'no', direction: 'no' },
      philosopherSystematicIndex:    { weights: 'no', direction: 'no' }
    };

const VIEW_METRIC = {
      'degree': 'calculateWeightedDegree', 'pagerank': 'calculatePageRank',
      'betweenness': 'calculateBetweenness', 'closeness': 'calculateClosenessCentrality',
      'eigenvector': 'calculateEigenvectorCentrality',
      'weighted-clustering': 'calculateWeightedClustering',
      'local-cohesion': 'calculateLocalCohesion', 'rich-club': 'calculateRichClubCoefficient',
      'influence': 'influenceIndex', 'tension': 'tensionIndex',
      'coherence': 'internalCoherenceIndex', 'complexity': 'conceptualComplexityIndex',
      'problem-generation': 'problemGenerationIndex', 'critical-power': 'criticalPowerIndex',
      'revolutionary': 'revolutionaryIndex', 'paradigm-shift': 'paradigmShiftIndex',
      'foundational': 'foundationalIndex', 'synthetic': 'syntheticIndex',
      'dialogical': 'dialogicalIndex', 'transformation': 'transformationIndex',
      'fertility': 'conceptualFertilityIndex', 'continuity': 'conceptualContinuityIndex',
      'generative': 'generativeIndex', 'instrumental': 'instrumentalIndex',
      'abstraction': 'abstractionIndex', 'deductive': 'deductiveIndex',
      'bridging': 'traditionBridgingIndex',
      'temporal-influence': 'temporalInfluencePattern',
      'philosopher-systematic': 'philosopherSystematicIndex',
      'philosopher-reach': 'philosopherHistoricalReachIndex',
      'philosopher-interdisciplinary': 'philosopherInterdisciplinaryIndex'
    };

export { METRIC_FLAGS, VIEW_METRIC, effectiveScopeFlags, metricsLinks, metricsNodes, transformForScope };
