// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';
import { loadStatsContent } from '../stats/modal.js';

function conceptDegreeForNorm(conceptId) {
      let d = 0;
      for (const r of S._relations) {
        if (r.source === conceptId) d++;
        if (r.target === conceptId) d++;
      }
      return d;
    }

function normalizeMetricValue(conceptId, value) {
      const d = conceptDegreeForNorm(conceptId);
      return d > 0 ? value / d : 0;
    }

function applyMetricMode(conceptId, value) {
      return S.metricValueMode === 'normalized'
        ? normalizeMetricValue(conceptId, value)
        : value;
    }

function toggleMetricValueMode() {
      S.metricValueMode = S.metricValueMode === 'raw' ? 'normalized' : 'raw';
      S.generateRankingsCache = null;   // C1: рейтинги пересчитываются в новом режиме
      if (S.currentStatsView) loadStatsContent(S.currentStatsView);
    }

export { applyMetricMode, conceptDegreeForNorm, normalizeMetricValue, toggleMetricValueMode };
