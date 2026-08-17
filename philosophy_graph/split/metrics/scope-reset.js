// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';
import { invalidateAbstractionIndexCache, invalidateDeductiveIndexCache, invalidateInstrumentalIndexCache, invalidateTraditionBridgingCache } from './by-link-type.js';
import { invalidateConceptualComplexityIndexCache, invalidateConceptualContinuityIndexCache, invalidateConceptualFertilityIndexCache, invalidateTransformationIndexCache } from './concept-dynamics.js';
import { invalidateGenerativityCache } from './generativity.js';
import { invalidateGraphCache } from './graph-cache.js';
import { invalidateBetweennessCache, invalidateClosenessCache, invalidateClusteringCache, invalidateEigenvectorCache, invalidateLocalCohesionCache, invalidatePageRankCache, invalidateRichClubCache, invalidateWeightedClusteringCache } from './network.js';
import { invalidatePhilosopherHistoricalReachIndexCache, invalidatePhilosopherInterdisciplinaryIndexCache, invalidatePhilosopherProfileCache, invalidatePhilosopherSystematicIndexCache, invalidateTemporalInfluencePatternCache } from './philosopher.js';
import { invalidateCriticalPowerIndexCache, invalidateDialogicalIndexCache, invalidateFoundationalIndexCache, invalidateInfluenceIndexCache, invalidateInternalCoherenceIndexCache, invalidateParadigmShiftIndexCache, invalidateProblemGenerationIndexCache, invalidateRevolutionaryIndexCache, invalidateSyntheticIndexCache, invalidateTensionIndexCache } from './philosophical.js';
import { invalidateGeneratePhilosopherRankingsCache, invalidateGenerateRankingsCache } from './rankings.js';
import { invalidateSimilarityCache } from './similarity-concepts.js';
import { invalidateTensionScales } from './tension-cache.js';

function invalidateAllMetricsCaches() {
      invalidateSimilarityCache();
      invalidateTensionScales();
      invalidateGenerativityCache();
      invalidateInstrumentalIndexCache();
      invalidateTraditionBridgingCache();
      invalidateAbstractionIndexCache();
      invalidateDeductiveIndexCache();
      invalidateProblemGenerationIndexCache();
      invalidateCriticalPowerIndexCache();
      invalidateRevolutionaryIndexCache();
      invalidateParadigmShiftIndexCache();
      invalidateInfluenceIndexCache();
      invalidateFoundationalIndexCache();
      invalidateSyntheticIndexCache();
      invalidateDialogicalIndexCache();
      invalidateInternalCoherenceIndexCache();
      invalidateTensionIndexCache();
      invalidatePhilosopherProfileCache();
      invalidatePhilosopherSystematicIndexCache();
      invalidatePhilosopherHistoricalReachIndexCache();
      invalidatePhilosopherInterdisciplinaryIndexCache();
      invalidateTemporalInfluencePatternCache();
      invalidateGenerateRankingsCache();
      invalidateTransformationIndexCache();
      invalidateConceptualFertilityIndexCache();
      invalidateConceptualComplexityIndexCache();
      invalidateConceptualContinuityIndexCache();
      invalidateGeneratePhilosopherRankingsCache();
    }

function invalidateEverythingForScope() {
      invalidateAllMetricsCaches();
      invalidateMetricCoverageCache();
      if (typeof invalidateBetweennessCache === 'function') invalidateBetweennessCache();
      if (typeof invalidatePageRankCache === 'function') invalidatePageRankCache();
      if (typeof invalidateClosenessCache === 'function') invalidateClosenessCache();
      if (typeof invalidateClusteringCache === 'function') invalidateClusteringCache();
      if (typeof invalidateWeightedClusteringCache === 'function') invalidateWeightedClusteringCache();
      if (typeof invalidateLocalCohesionCache === 'function') invalidateLocalCohesionCache();
      if (typeof invalidateRichClubCache === 'function') invalidateRichClubCache();
      if (typeof invalidateEigenvectorCache === 'function') invalidateEigenvectorCache();
      if (typeof invalidateGraphCache === 'function') invalidateGraphCache();
      S._medianDegreeCache = null;   // C5: порог связности зависит от области
    }

function invalidateMetricCoverageCache() { S._metricCoverageCache = {}; }

export { invalidateAllMetricsCaches, invalidateEverythingForScope, invalidateMetricCoverageCache };
