// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, MET, S } from '../core/ns.js';
import { isNodeVisible } from '../core/visibility.js';
import { invalidateAllMetricsCaches } from './cache.js';
import { invalidateGraphCache } from './graph-cache.js';
import { initializePhilosophyMetrics } from './init.js';
import { invalidateBetweennessCache, invalidateClosenessCache, invalidateClusteringCache, invalidateEigenvectorCache, invalidateLocalCohesionCache, invalidatePageRankCache, invalidateRichClubCache, invalidateWeightedClusteringCache } from './network.js';
import { loadStatsContent } from '../stats/modal.js';
import { invalidateMetricCoverageCache } from '../stats/results.js';

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

function applyMetricsScope(viewName) {
      const eff = effectiveScopeFlags(viewName);
      const useWeights   = eff.weights;
      const useDirection = eff.direction;

      const key = (useWeights ? 'w' : '-') + (useDirection ? 'd' : '-')
            + '|' + (typeof S.metricsScope !== 'undefined' ? S.metricsScope : '');
      if (key === S.lastScopeKey) return;   // ничего не изменилось
      S.lastScopeKey = key;
      S.metricsScopeActive = !(useWeights && useDirection);

      // ВАЖНО: подготовку данных делает initializePhilosophyMetrics —
      // она приводит поля к тому виду, которого ждут метрики
      // (philosopher хранится ИМЕНЕМ, а не идентификатором) и учитывает
      // область metricsScope. Звать initializeMetricsData напрямую
      // сырыми массивами нельзя: у concepts[].philosopher лежит
      // идентификатор, и в рейтингах философов появлялась латиница,
      // а философские метрики обращались в ноль.
      S.metricsLinkSource = S.metricsScopeActive
        ? transformForScope(DATA.links, useWeights, useDirection) : null;
      S.metricsNodeSource = S.metricsScopeActive ? DATA.nodes : null;
      initializePhilosophyMetrics();
      invalidateGraphCache();
      // ИМЕННО invalidateEverythingForScope, а не invalidateAllMetricsCaches:
      // восьми путевых кэшей (PageRank, Betweenness, Closeness, Eigenvector,
      // Clustering, WeightedClustering, LocalCohesion, RichClub) во второй
      // НЕТ. Из-за этого после смены галочки вид показывал прежнюю таблицу
      // из старого кэша — ни пересчёта, ни кнопки «Рассчитать».
      invalidateEverythingForScope();
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

function metricScopeFactor(metricName) {
      // Когда копия снята (окно закрыто), поправки быть не должно:
      // иначе делитель продолжал бы действовать на живых данных.
      if (!S.metricsScopeActive) return 1;
      if (S.respectDirection) return 1;
      const f = METRIC_FLAGS[metricName];
      if (!f) return 1;
      return (f.direction === 'halve' || f.direction === 'approx') ? 0.5 : 1;
    }

function installMetricScopeWrappers() {
      Object.keys(METRIC_FLAGS).forEach(name => {
        const fn = MET[name];
        if (typeof fn !== 'function' || fn.__scopeWrapped) return;
        const wrapped = function () {
          const v = fn.apply(this, arguments);
          const k = metricScopeFactor(name);
          if (k === 1 || v == null) return v;
          if (typeof v === 'number') return v * k;
          if (typeof v === 'object' && typeof v.total === 'number') {
            return Object.assign({}, v, { total: v.total * k });
          }
          return v;
        };
        wrapped.__scopeWrapped = true;
        MET[name] = wrapped;
      });
    }

function updateScopeToggles(viewName) {
      const metricName = VIEW_METRIC[viewName];
      const f = metricName ? METRIC_FLAGS[metricName] : null;
      const w = document.getElementById('statsUseWeightsToggle');
      const d = document.getElementById('statsRespectDirectionToggle');
      const note = document.getElementById('statsScopeNote');
      if (!w || !d) return;

      const wOn = !f || f.weights === 'yes';
      const dOn = !f || f.direction === 'yes' || f.direction === 'halve'
              || f.direction === 'approx';
      w.disabled = !wOn;
      d.disabled = !dOn;
      const dim = el => { const lab = el.closest('label') || el.parentElement;
        if (lab) lab.style.opacity = el.disabled ? '0.4' : ''; };
      dim(w); dim(d);

      if (!note) return;
      const msgs = [];
      if (!wOn) msgs.push('вес в этой метрике не участвует');
      if (!dOn && f) msgs.push('метрика определена через одно направление, '
                  + 'поэтому учёт направленности к ней неприменим');
      if (dOn && f && f.direction === 'halve' && !S.respectDirection) {
        msgs.push('без учёта направленности каждая связь попадает и во входящие, '
            + 'и в исходящие, поэтому величина поделена пополам');
      }
      if (dOn && f && f.direction === 'approx' && !S.respectDirection) {
        msgs.push('величина поделена пополам приблизительно: к направленным '
            + 'слагаемым здесь примешаны ненаправленные (петли)');
      }
      note.innerHTML = msgs.length ? '⚠️ ' + msgs.join('; ') : '';
      note.style.display = msgs.length ? 'block' : 'none';
    }

function metricsScopeCounts() {
      if (S.metricsScope === 'full') {
        return { n: DATA.nodes.length, l: DATA.links.length };
      }
      const vis = DATA.nodes.filter(n => isNodeVisible(n));
      const visIds = new Set(vis.map(n => n.id));
      const ls = DATA.links.filter(l =>
        visIds.has(l.source.id || l.source) && visIds.has(l.target.id || l.target));
      return { n: vis.length, l: ls.length };
    }

function updateMetricsScopeHint() {
      const hint = document.getElementById('statsScopeHint');
      if (!hint) return;
      const c = metricsScopeCounts();
      hint.textContent = `${c.n} концепций, ${c.l} связей`;
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

function handleMetricsScopeChange() {
      const el = document.getElementById('statsScopeToggle');
      S.metricsScope = (el && el.checked) ? 'filtered' : 'full';
      initializePhilosophyMetrics();
      invalidateEverythingForScope();
      updateMetricsScopeHint();
      if (S.currentStatsView) loadStatsContent(S.currentStatsView);
    }

export { METRIC_FLAGS, VIEW_METRIC, applyMetricsScope, effectiveScopeFlags, handleMetricsScopeChange, installMetricScopeWrappers, invalidateEverythingForScope, metricScopeFactor, metricsLinks, metricsNodes, metricsScopeCounts, transformForScope, updateMetricsScopeHint, updateScopeToggles };
