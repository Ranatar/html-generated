// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { invalidateTensionScales } from '../dead.js';
import { invalidateConceptualComplexityIndexCache, invalidateConceptualContinuityIndexCache, invalidateConceptualFertilityIndexCache, invalidateTransformationIndexCache } from './advanced.js';
import { invalidateGenerativityCache } from './generativity.js';
import { invalidatePhilosopherHistoricalReachIndexCache, invalidatePhilosopherInterdisciplinaryIndexCache, invalidatePhilosopherProfileCache, invalidatePhilosopherSystematicIndexCache, invalidateTemporalInfluencePatternCache } from './philosopher.js';
import { invalidateCriticalPowerIndexCache, invalidateDialogicalIndexCache, invalidateFoundationalIndexCache, invalidateInfluenceIndexCache, invalidateInternalCoherenceIndexCache, invalidateParadigmShiftIndexCache, invalidateProblemGenerationIndexCache, invalidateRevolutionaryIndexCache, invalidateSyntheticIndexCache, invalidateTensionIndexCache } from './philosophical.js';
import { invalidateGeneratePhilosopherRankingsCache, invalidateGenerateRankingsCache } from './rankings.js';
import { invalidateSimilarityCache } from './similarity-concepts.js';
import { invalidateAbstractionIndexCache, invalidateDeductiveIndexCache, invalidateInstrumentalIndexCache, invalidateTraditionBridgingCache } from './typed.js';

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

export { invalidateAllMetricsCaches };
