// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, MET, S } from '../core/ns.js';
import { initializePhilosophyMetrics } from '../metrics/link-indexes.js';
import { metricsScopeCounts } from '../metrics/scope.js';

import { freezeSimulation, unfreezeSimulation } from '../render/simulation.js';
import { METRIC_COVERAGE_WARN, metricCoverage } from '../stats/coverage.js';

import { getContrastColor } from '../util/color.js';

const PROFILE_METRICS = [
      ['problem-generation', 'Проблемность',    () => MET.problemGenerationIndex],
      ['critical-power',   'Критическая сила',  () => MET.criticalPowerIndex],
      ['revolutionary',    'Революционность',   () => MET.revolutionaryIndex],
      ['paradigm-shift',   'Смена парадигмы',   () => MET.paradigmShiftIndex],
      ['influence',      'Влияние',       () => MET.influenceIndex],
      ['foundational',     'Фундаментальность',   () => MET.foundationalIndex],
      ['synthetic',      'Синтетичность',     () => MET.syntheticIndex],
      ['dialogical',     'Диалогичность',     () => MET.dialogicalIndex],
      ['coherence',      'Связность',       () => MET.internalCoherenceIndex],
      ['tension',      'Напряжение',      () => MET.tensionIndex],
      ['transformation',   'Трансформация',     () => MET.transformationIndex],
      ['fertility',      'Плодовитость',    () => MET.conceptualFertilityIndex],
      ['complexity',     'Сложность',       () => MET.conceptualComplexityIndex],
      ['continuity',     'Преемственность',   () => MET.conceptualContinuityIndex],
      ['generative',     'Генеративность',    () => MET.generativeIndex],
      ['instrumental',     'Инструментальность',  () => MET.instrumentalIndex],
      ['abstraction',    'Абстрактность',     () => MET.abstractionIndex],
      ['deductive',      'Дедуктивность',     () => MET.deductiveIndex],
      ['bridging',       'Мостовость',      () => MET.traditionBridgingIndex]
    ];

function metricPercentile(fn, conceptId, value) {
      const vals = [];
      for (const c of S._concepts) {
        try { const r = fn(c.id); vals.push((r && typeof r === 'object') ? (r.total || 0) : (r || 0)); }
        catch (e) { vals.push(0); }
      }
      vals.sort((a, b) => a - b);
      let lo = 0, hi = vals.length;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (vals[mid] < value) lo = mid + 1; else hi = mid; }
      return vals.length > 1 ? Math.round(lo / (vals.length - 1) * 100) : 0;
    }

function metricRank(fn, conceptId, value) {
      let above = 0, equal = 0, total = 0;
      for (const c of S._concepts) {
        let v = 0;
        try { const r = fn(c.id); v = (r && typeof r === 'object') ? (r.total || 0) : (r || 0); }
        catch (e) { v = 0; }
        total++;
        if (v > value) above++; else if (v === value) equal++;
      }
      // СРЕДНИЙ РАНГ среди равных, а не наилучший. Иначе нулевое
      // значение у метрики, где нули у четырёх сотен концепций,
      // даёт место 45 из 453 — будто понятие в первой десятой части,
      // тогда как оно в последней.
      return { rank: Math.round(above + (equal + 1) / 2), total };
    }

function toggleProfileOrder(conceptId) {
      S.profileOrderMode = S.profileOrderMode === 'rank' ? 'percentile' : 'rank';
      showConceptProfileModal(conceptId);
    }

function metricPartsText(res) {
      if (!res || typeof res !== 'object') return '';
      const flat = [];
      const walk = (obj, prefix) => {
        for (const k of Object.keys(obj)) {
          if (k === 'total') continue;
          const v = obj[k];
          if (typeof v === 'number' && v > 0) flat.push([prefix + k, v]);
          else if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, '');
        }
      };
      walk(res, '');
      if (!flat.length) return '';
      return flat.slice(0, 12).map(([k, v]) =>
        `<span>${k}: <strong>${Number.isInteger(v) ? v : v.toFixed(1)}</strong></span>`).join('');
    }

function conceptDegreesDetailed(conceptId) {
      let inD = 0, outD = 0, w = { 1: 0, 2: 0, 3: 0 };
      for (const l of DATA.links) {
        const s = l.source.id || l.source, t = l.target.id || l.target;
        if (s !== conceptId && t !== conceptId) continue;
        if (s === conceptId) outD++; else inD++;
        const wt = l.weight || 2;
        if (w[wt] !== undefined) w[wt]++;
      }
      return { inD, outD, total: inD + outD, weights: w };
    }

function showConceptProfileModal(conceptId) {
      if (!DATA.concepts || !DATA.relations) initializePhilosophyMetrics();
      const node = DATA.nodes.find(n => n.id === conceptId);
      if (!node) return;
      const modal = document.getElementById('conceptProfileModal');
      const overlay = document.getElementById('modalOverlay');
      const content = document.getElementById('conceptProfileContent');
      freezeSimulation();

      const deg = conceptDegreesDetailed(conceptId);
      const color = DATA.philosopherConcepts[node.concept]
        ? DATA.philosopherConcepts[node.concept].color : '#6c5ce7';

      // D3: прежде порядок был жёстким и одинаковым для всех концепций,
      // и сильные стороны понятия приходилось выискивать глазами.
      // Теперь метрики идут по убыванию процентиля.
      const profileRows = [];
      for (const [key, label, getFn] of PROFILE_METRICS) {
        let fn; try { fn = getFn(); } catch (e) { continue; }
        if (typeof fn !== 'function') continue;
        let res, val = 0;
        try { res = fn(conceptId); val = (res && typeof res === 'object') ? (res.total || 0) : (res || 0); }
        catch (e) { continue; }
        const pct = metricPercentile(fn, conceptId, val);
        const rk = metricRank(fn, conceptId, val);
        const cov = metricCoverage(key);
        const warn = cov && cov.zeroShare > METRIC_COVERAGE_WARN;
        const norm = deg.total > 0 ? val / deg.total : 0;
        const parts = metricPartsText(res);
        profileRows.push({ pct, rank: rk.rank, html: `
          <tr class="profile-row" data-act-click="close-concept-profile-modal-2" data-a1="${key}"
            data-tip="Открыть окно статистики на вкладке «${label}»">
            <td>${label}${warn ? ' <span class="profile-warn" data-tip="Ненулевых значений ' + cov.nonZero + ' из ' + cov.total + ' — метрика предварительная">⚠️</span>' : ''}</td>
            <td class="profile-num">${val.toFixed(2)}</td>
            <td class="profile-num">${norm.toFixed(3)}</td>
            <td class="profile-num">${pct}<span class="profile-rank" data-tip="Место среди ${rk.total} концепций базы">&nbsp;(${rk.rank})</span></td>
            <td><div class="profile-bar"><span style="width:${pct}%"></span></div></td>
          </tr>
          ${parts ? `<tr><td colspan="5" class="profile-parts">${parts}</td></tr>` : ''}
        ` });
      }
      // По месту — от наивысшего к низшему; по процентилю — как прежде
      profileRows.sort(S.profileOrderMode === 'rank'
        ? (a, b) => a.rank - b.rank
        : (a, b) => b.pct - a.pct);
      const rows = profileRows.map(r => r.html).join('');

      content.innerHTML = `
        <h2>${node.label}</h2>
        <div class="philosopher-tag" style="background: ${color}; color: ${getContrastColor(color)}; cursor: pointer;"
           data-act-click="close-concept-profile-modal-3" data-a1="${node.concept}">
          ${node.concept}
        </div>
        <div class="description">
          Степень ${deg.total} (входящих ${deg.inD}, исходящих ${deg.outD}).
          Связей по весам: 3 → ${deg.weights[3]}, 2 → ${deg.weights[2]}, 1 → ${deg.weights[1]}.
          Область расчёта: ${S.metricsScope === 'filtered' ? 'подграф по фильтрам' : 'весь граф'}
          (${metricsScopeCounts().n} концепций).
        </div>
        <button class="profile-btn" data-act-click="close-concept-profile-modal-4" data-a1="${conceptId}">
          ← К описанию концепции
        </button>
        <div class="profile-section-title">Метрики концепции</div>
        <table class="profile-table">
          <thead><tr>
            <th>Метрика</th><th class="profile-num">Сырое</th>
            <th class="profile-num">На связь</th><th class="profile-num">%</th><th>Процентиль <button class="profile-order-btn" data-act-click="stop-propagation-5" data-a1="${conceptId}" data-tip="Порядок строк: по месту в рейтинге или по процентилю">${S.profileOrderMode === 'rank' ? 'по месту' : 'по процентилю'}</button></th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `;
      modal.classList.add('show');
      overlay.classList.add('show');
    }

function closeConceptProfileModal() {
      const modal = document.getElementById('conceptProfileModal');
      const overlay = document.getElementById('modalOverlay');
      document.getElementById('conceptProfileContent').innerHTML = '';
      modal.classList.remove('show');
      overlay.classList.remove('show');
      unfreezeSimulation();
    }

export { PROFILE_METRICS, closeConceptProfileModal, conceptDegreesDetailed, metricPartsText, metricPercentile, metricRank, showConceptProfileModal, toggleProfileOrder };
