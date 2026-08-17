// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';

const METRIC_COVERAGE_WARN = 0.5;

S._metricCoverageCache = {};

function metricCoverage(metricKey) {
      if (S._metricCoverageCache[metricKey]) return S._metricCoverageCache[metricKey];
      const fn = S.METRIC_COVERAGE_FN[metricKey];
      if (!fn) return null;
      let nonZero = 0;
      const total = S._concepts.length;
      for (const c of S._concepts) {
        let v = 0;
        try { const r = fn(c.id); v = (r && typeof r === 'object') ? (r.total || 0) : (r || 0); }
        catch (e) { v = 0; }
        if (v > 0) nonZero++;
      }
      const res = { nonZero, total, zeroShare: total ? (total - nonZero) / total : 0 };
      S._metricCoverageCache[metricKey] = res;
      return res;
    }

function generateMetricCoverageBlock(metricKey) {
      const cov = metricCoverage(metricKey);
      if (!cov) return '';
      const pct = Math.round(cov.zeroShare * 100);
      const warn = cov.zeroShare > METRIC_COVERAGE_WARN;
      return `
        <div class="metric-coverage-note${warn ? ' metric-coverage-warn' : ''}">
          ${warn ? '⚠️ ' : ''}Ненулевых значений: <strong>${cov.nonZero}</strong> из ${cov.total}
          (нулей ${pct} %).${warn ? ' Метрика опирается на редкие типы связей — считайте её предварительной: ноль здесь означает отсутствие связей нужного типа, а не измеренный ноль.' : ''}
        </div>
      `;
    }

export { METRIC_COVERAGE_WARN, generateMetricCoverageBlock, metricCoverage };
