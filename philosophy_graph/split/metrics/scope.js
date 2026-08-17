// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, MET, S } from '../core/ns.js';
import { известить } from '../core/events.js';
import { isNodeVisible } from '../core/visibility.js';
import { invalidateGraphCache } from './graph-cache.js';
import { initializePhilosophyMetrics } from './link-indexes.js';
import { invalidateEverythingForScope } from './scope-reset.js';
import { METRIC_FLAGS, VIEW_METRIC, effectiveScopeFlags, transformForScope } from './scope-select.js';

S.lastScopeKey = null;

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

function handleMetricsScopeChange() {
      const el = document.getElementById('statsScopeToggle');
      S.metricsScope = (el && el.checked) ? 'filtered' : 'full';
      initializePhilosophyMetrics();
      invalidateEverythingForScope();
      updateMetricsScopeHint();
      известить('статистика-устарела');
    }

export { applyMetricsScope, handleMetricsScopeChange, installMetricScopeWrappers, metricScopeFactor, metricsScopeCounts, updateMetricsScopeHint, updateScopeToggles };
