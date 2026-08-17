// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, MET, S } from '../core/ns.js';
import { initializePhilosophyMetrics } from '../metrics/link-indexes.js';

import { PROFILE_METRICS } from './profile-concept.js';
import { freezeSimulation, unfreezeSimulation } from '../render/simulation.js';
import { METRIC_COVERAGE_WARN, metricCoverage } from '../stats/coverage.js';
import { getContrastColor } from '../util/color.js';

function showPhilosopherProfileModal(philosopherName) {
      if (!DATA.concepts || !DATA.relations) initializePhilosophyMetrics();
      const modal = document.getElementById('philosopherProfileModal');
      const overlay = document.getElementById('modalOverlay');
      const content = document.getElementById('philosopherProfileContent');
      const philData = DATA.philosophers.find(x => x.nameRu === philosopherName);
      if (!philData) return;
      freezeSimulation();

      const own = DATA.nodes.filter(n => n.concept === philosopherName);
      const color = DATA.philosopherConcepts[philosopherName]
        ? DATA.philosopherConcepts[philosopherName].color : '#6c5ce7';

      const philMetrics = [];
      const push = (label, fn) => {
        if (typeof fn !== 'function') return;
        try {
          const r = fn(philosopherName);
          const v = (r && typeof r === 'object') ? (r.total !== undefined ? r.total : 0) : (r || 0);
          philMetrics.push([label, v]);
        } catch (e) { /* метрика недоступна — пропускаем */ }
      };
      push('Систематичность', typeof MET.philosopherSystematicIndex === 'function' ? MET.philosopherSystematicIndex : null);
      push('Исторический охват', typeof MET.philosopherHistoricalReachIndex === 'function' ? MET.philosopherHistoricalReachIndex : null);
      push('Междисциплинарность', typeof MET.philosopherInterdisciplinaryIndex === 'function' ? MET.philosopherInterdisciplinaryIndex : null);

      // Средние по концепциям автора, с местом среди всех философов.
      // Как и в профиле концепции: место точнее процентиля, потому что
      // не огрубляет длинные хвосты одинаковых значений.
      const philAvg = (fn, list) => {
        let sum = 0, cnt = 0;
        for (const n of list) {
          try { const r = fn(n.id); sum += (r && typeof r === 'object') ? (r.total || 0) : (r || 0); cnt++; }
          catch (e) { /* пропуск */ }
        }
        return cnt ? sum / cnt : null;
      };
      const allPhil = [...new Set(S._concepts.map(c => c.philosopher))];
      const philRows = [];
      for (const [key, label, getFn] of PROFILE_METRICS) {
        let fn; try { fn = getFn(); } catch (e) { continue; }
        if (typeof fn !== 'function' || !own.length) continue;
        const avg = philAvg(fn, own);
        if (avg === null) continue;
        let above = 0, equal = 0, total = 0;
        for (const pid of allPhil) {
          const list = S._concepts.filter(c => c.philosopher === pid);
          const v = philAvg(fn, list);
          if (v === null) continue;
          total++;
          if (v > avg) above++; else if (v === avg) equal++;
        }
        const rank = Math.round(above + (equal + 1) / 2);
        const cov = metricCoverage(key);
        const warn = cov && cov.zeroShare > METRIC_COVERAGE_WARN;
        philRows.push({ rank, avg, html: `<tr><td>${label}${warn ? ' <span class="profile-warn">⚠️</span>' : ''}</td>
              <td class="profile-num">${avg.toFixed(2)}<span class="profile-rank" data-tip="Место среди ${total} философов">&nbsp;(${rank})</span></td></tr>` });
      }
      philRows.sort(S.profileOrderMode === 'rank'
        ? (a, b) => a.rank - b.rank
        : (a, b) => b.avg - a.avg);
      const avgRows = philRows.map(r => r.html).join('');

      // Распределение по рубрикам
      const rubCount = {};
      own.forEach(n => (n.rubrics || []).forEach(r => rubCount[r] = (rubCount[r] || 0) + 1));
      const rubList = Object.entries(rubCount).sort((a, b) => b[1] - a[1])
        .map(([r, c]) => {
          const rd = DATA.rubrics.find(x => x.id === r);
          return `<span>${rd ? rd.name : r}: <strong>${c}</strong></span>`;
        }).join('');

      content.innerHTML = `
        <h2>${philosopherName}</h2>
        <div class="philosopher-tag" style="background: ${color}; color: ${getContrastColor(color)}">${philData.years}</div>
        <div class="description">
          Концепций: ${own.length}. Ненулевых рубрик: ${Object.keys(rubCount).length}.
          Область расчёта: ${S.metricsScope === 'filtered' ? 'подграф по фильтрам' : 'весь граф'}.
        </div>
        <button class="profile-btn" data-act-click="close-philosopher-profile-modal-2" data-a1="${philosopherName}">
          ← К портрету философа
        </button>
        ${philMetrics.length ? `
        <div class="profile-section-title">Метрики философа</div>
        <table class="profile-table"><tbody>
          ${philMetrics.map(([l, v]) => `<tr><td>${l}</td><td class="profile-num">${(+v).toFixed(3)}</td></tr>`).join('')}
        </tbody></table>` : ''}
        <div class="profile-section-title">Среднее по его концепциям</div>
        <table class="profile-table">
          <thead><tr><th>Метрика</th><th class="profile-num">Среднее</th></tr></thead>
          <tbody>${avgRows}</tbody>
        </table>
        <div class="profile-section-title">Распределение по рубрикам</div>
        <div class="profile-parts">${rubList || 'нет рубрик'}</div>
      `;
      modal.classList.add('show');
      overlay.classList.add('show');
    }

function closePhilosopherProfileModal() {
      const modal = document.getElementById('philosopherProfileModal');
      const overlay = document.getElementById('modalOverlay');
      document.getElementById('philosopherProfileContent').innerHTML = '';
      modal.classList.remove('show');
      overlay.classList.remove('show');
      unfreezeSimulation();
    }

export { closePhilosopherProfileModal, showPhilosopherProfileModal };
