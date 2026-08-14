// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../../core/ns.js';
import { PHIL_SIM_LABELS, SIM_METRIC_LABELS } from '../../core/labels.js';
import { initializePhilosophyMetrics } from '../../metrics/init.js';
import { philosopherProfile } from '../../metrics/philosopher.js';
import { _pairCalculating, allConceptPairs, allConceptPairsAsync, profileSimilarity, similarityData, structuralSimilarity } from '../../metrics/similarity-concepts.js';
import { philosopherSimilarity, philosopherSimilarityData } from '../../metrics/similarity-philosophers.js';
import { switchStatsView } from '../modal.js';
import { generateMetricDescriptionBlock } from '../results.js';
import { filterCustomSelect, showCustomSelectDropdown } from '../../ui/custom-select.js';

function generatePhilosopherComparisonContent() {
      if (!DATA.concepts || !DATA.relations) initializePhilosophyMetrics();
      const P = philosopherSimilarityData();
      if (!S._pcmpA) S._pcmpA = P.phs[0];
      if (!S._pcmpB) S._pcmpB = P.phs[1];

      const opts = sel => P.phs.map(ph =>
        `<option value="${ph}"${ph === sel ? ' selected' : ''}>${ph}</option>`).join('');

      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">👤 Сравнение философов</h3>
          <p class="stats-content-subtitle">Четыре независимые меры схожести философских систем</p>
        </div>

        ${generateMetricDescriptionBlock('philosopher-comparison')}

        <div class="cmp-selects">
          <div class="cmp-field">
            <label class="cmp-field-label">Первый философ</label>
            <select class="cmp-select" data-act-change="render-philosopher-comparison-change">${opts(S._pcmpA)}</select>
          </div>
          <span class="cmp-vs">против</span>
          <div class="cmp-field">
            <label class="cmp-field-label">Второй философ</label>
            <select class="cmp-select" data-act-change="render-philosopher-comparison-change-2">${opts(S._pcmpB)}</select>
          </div>
        </div>

        <div id="pcmpBody"></div>
      `;
    }

function renderPhilosopherComparison() {
      const box = document.getElementById('pcmpBody');
      if (!box) return;
      const P = philosopherSimilarityData();
      const a = S._pcmpA, b = S._pcmpB;
      if (!a || !b) return;

      const scores = ['profile', 'style', 'structure', 'rubrics'].map(k =>
        ({ k, v: philosopherSimilarity(a, b, k) }));

      const prA = philosopherProfile(a) || {}, prB = philosopherProfile(b) || {};
      const keys = ['influence', 'revolutionary', 'coherence', 'instrumental', 'deductive'];
      const keyLabel = { influence: 'Влияние', revolutionary: 'Революционность',
        coherence: 'Когерентность', instrumental: 'Инструментальность', deductive: 'Дедуктивность' };

      // М20: показываем не только средний уровень, но и разброс
      const maxOf = k => Math.max(
        ...P.phs.map(ph => (philosopherProfile(ph) || { averages: {} }).averages[k] || 0), 1e-9);
      const rows = keys.map(k => {
        const mx = maxOf(k);
        const va = (prA.averages || {})[k] || 0, vb = (prB.averages || {})[k] || 0;
        const sa = (prA.spreads || {})[k] || 0, sb = (prB.spreads || {})[k] || 0;
        const pa = Math.round(va / mx * 100), pb = Math.round(vb / mx * 100);
        return `
          <div class="cmp-row ${Math.abs(pa - pb) <= 15 ? 'cmp-close' : (Math.abs(pa - pb) >= 50 ? 'cmp-far' : '')}">
            <div class="cmp-label">${keyLabel[k]}</div>
            <div class="cmp-bars">
              <div class="cmp-bar cmp-bar-a" style="width:${pa}%"></div>
              <div class="cmp-bar cmp-bar-b" style="width:${pb}%"></div>
            </div>
            <div class="cmp-nums" title="среднее ± разброс">${va.toFixed(1)}±${sa.toFixed(1)} / ${vb.toFixed(1)}±${sb.toFixed(1)}</div>
          </div>`;
      }).join('');

      const styleTop = i => {
        const v = P.buildStyle[P.index.get(i)];
        const mx = v.indexOf(Math.max(...v));
        return P.types[mx];
      };

      box.innerHTML = `
        <div class="cmp-summary">
          ${scores.map(s => `
            <div class="cmp-score">
              <div class="cmp-score-value">${Math.round(s.v * 100)} %</div>
              <div class="cmp-score-label">${PHIL_SIM_LABELS[s.k]}</div>
            </div>`).join('')}
        </div>

        <div class="cmp-verdict">
          Характерный тип связи: у «${a}» — <b>${styleTop(a)}</b>, у «${b}» — <b>${styleTop(b)}</b>.
          Концепций: ${P.conceptsOf[a].length} и ${P.conceptsOf[b].length}.
        </div>

        <div class="cmp-legend">
          <span><i class="cmp-swatch cmp-bar-a"></i>${a}</span>
          <span><i class="cmp-swatch cmp-bar-b"></i>${b}</span>
          <span class="cmp-legend-hint">столбик — средний уровень относительно сильнейшего философа; цифрами среднее ± разброс по концептам</span>
        </div>

        <div class="cmp-rows">${rows}</div>
      `;
    }

function generatePhilosopherPairsContent() {
      if (!DATA.concepts || !DATA.relations) initializePhilosophyMetrics();
      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">🤝 Близкие пары философов</h3>
          <p class="stats-content-subtitle">${(() => { const _p = new Set(S._concepts.map(c => c.philosopher)).size; return _p * (_p - 1) / 2; })()} пар по четырём независимым мерам</p>
        </div>

        ${generateMetricDescriptionBlock('philosopher-pairs')}

        <div class="pairs-controls">
          <div class="pairs-modes">
            ${Object.entries(PHIL_SIM_LABELS).map(([k, l]) =>
              `<button class="pairs-btn" id="philPairsBtn_${k}"
                   data-act-click="render-philosopher-pairs" data-a1="${k}">${l}</button>`).join('')}
          </div>
        </div>

        <div id="philPairsBody"></div>
      `;
    }

function renderPhilosopherPairs() {
      const box = document.getElementById('philPairsBody');
      if (!box) return;
      const P = philosopherSimilarityData();
      Object.keys(PHIL_SIM_LABELS).forEach(k =>
        document.getElementById('philPairsBtn_' + k)?.classList.toggle('active', k === S._philPairsKind));

      const all = [];
      for (let i = 0; i < P.phs.length; i++) {
        for (let j = i + 1; j < P.phs.length; j++) {
          all.push([philosopherSimilarity(P.phs[i], P.phs[j], S._philPairsKind), P.phs[i], P.phs[j]]);
        }
      }
      all.sort((x, y) => y[0] - x[0]);
      const top = all.slice(0, 30);

      box.innerHTML = `
        <div class="pairs-count">Мера: ${PHIL_SIM_LABELS[S._philPairsKind]}. Показаны первые ${top.length} из ${all.length}.</div>
        <div class="pairs-rows">
          ${top.map(([v, a, b], i) => `
            <div class="pairs-row" data-act-click="open-philosopher-pair" data-a1="${a}" data-a2="${b}" title="Открыть в сравнении философов">
              <div class="pairs-rank">#${i + 1}</div>
              <div class="pairs-names">
                <span class="pairs-name">${a}</span>
                <span class="pairs-tilde">~</span>
                <span class="pairs-name">${b}</span>
              </div>
              <div class="pairs-value">${v.toFixed(3)}</div>
              <div class="pairs-extra"></div>
            </div>`).join('')}
        </div>
      `;
    }

function openPhilosopherPair(a, b) {
      S._pcmpA = a; S._pcmpB = b;
      switchStatsView('philosopher-comparison');
    }

function generateClosestPairsContent() {
      if (!DATA.concepts || !DATA.relations) initializePhilosophyMetrics();
      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">🔗 Близкие пары концепций</h3>
          <p class="stats-content-subtitle">Наиболее схожие пары по профилю метрик и по структуре связей</p>
        </div>

        ${generateMetricDescriptionBlock('closest-pairs')}

        <div class="pairs-controls">
          <div class="pairs-modes">
            <button class="pairs-btn" id="pairsBtnProfile" data-act-click="render-closest-pairs">По профилю</button>
            <button class="pairs-btn" id="pairsBtnStructure" data-act-click="render-closest-pairs-2">По структуре</button>
          </div>
          <label class="pairs-filter">
            Минимальная связность узла: <b id="pairsDegVal">${S._pairsMinDegree}</b>
            <input type="range" min="1" max="20" value="${S._pairsMinDegree}"
                 data-act-input="render-closest-pairs-input">
          </label>
          <label class="pairs-filter" id="pairsSharedFilter">
            Минимум общих соседей: <b id="pairsShVal">${S._pairsMinShared}</b>
            <input type="range" min="0" max="10" value="${S._pairsMinShared}"
                 data-act-input="render-closest-pairs-input-2">
          </label>
          <label class="pairs-check">
            <input type="checkbox" ${S._pairsCrossAuthor ? 'checked' : ''}
                 data-act-change="render-closest-pairs-change">
            только между разными философами
          </label>
          <label class="pairs-check">
            <input type="checkbox" ${S._pairsCrossTradition ? 'checked' : ''}
                 data-act-change="render-closest-pairs-change-2">
            только между разными традициями
          </label>
        </div>

        <div id="pairsBody"></div>
      `;
    }

async function renderClosestPairs() {
      const box = document.getElementById('pairsBody');
      if (!box) return;

      let P = allConceptPairs();

      // Первое построение считает все пары концепций и занимает несколько секунд.
      // Дальше всё берётся из кеша, поэтому ползунки работают мгновенно.
      if (!P) {
        if (_pairCalculating) {
          box.innerHTML = '<div class="pairs-count">Расчёт уже идёт…</div>';
          return;
        }
        const indicator = S.LoadingIndicator.create(
          'Расчёт близости концепций',
          `Сравнение ${(S._concepts.length * (S._concepts.length - 1) / 2).toLocaleString('ru')} пар по 17 метрикам и по общим соседям`,
          '#6c5ce7'
        );
        try {
          P = await allConceptPairsAsync(pct => indicator.updateProgress(pct));
        } catch (e) {
          console.error('Ошибка расчёта пар:', e);
        } finally {
          indicator.remove();
        }
        if (!P) {
          box.innerHTML = '<div class="pairs-count">Не удалось построить матрицу пар.</div>';
          return;
        }
      }
      const isProfile = S._pairsKind === 'profile';
      const philOf = {};
      DATA.nodes.forEach(n => philOf[n.id] = n.concept);
      const labOf = {};
      DATA.nodes.forEach(n => labOf[n.id] = n.label);

      document.getElementById('pairsBtnProfile')?.classList.toggle('active', isProfile);
      document.getElementById('pairsBtnStructure')?.classList.toggle('active', !isProfile);
      const shFilter = document.getElementById('pairsSharedFilter');
      if (shFilter) shFilter.style.display = isProfile ? 'none' : '';
      const dv = document.getElementById('pairsDegVal'); if (dv) dv.textContent = S._pairsMinDegree;
      const sv = document.getElementById('pairsShVal'); if (sv) sv.textContent = S._pairsMinShared;

      const picked = [];
      for (let k = 0; k < P.total; k++) {
        const i = P.ia[k], j = P.ja[k];
        if (P.deg[i] < S._pairsMinDegree || P.deg[j] < S._pairsMinDegree) continue;
        const a = P.ids[i], b = P.ids[j];
        if (S._pairsCrossAuthor && philOf[a] === philOf[b]) continue;
        if (S._pairsCrossTradition) {
          // Тот же критерий, что в режиме «между традициями» и при переходах
          // в цепочке пути: общей традиции нет ни одной.
          const ta = DATA.philosopherTraditions[philOf[a]] || [];
          const tb = DATA.philosopherTraditions[philOf[b]] || [];
          if (!ta.length || !tb.length || ta.some(x => tb.includes(x))) continue;
        }
        if (!isProfile) {
          if (P.sh[k] < S._pairsMinShared) continue;
          if (P.jv[k] <= 0) continue;
        }
        picked.push([isProfile ? P.pv[k] : P.jv[k], k]);
      }
      picked.sort((x, y) => y[0] - x[0]);
      const top = picked.slice(0, 40);

      if (!top.length) {
        box.innerHTML = '<div class="empty-state"><div class="empty-state-text">Под эти условия не подходит ни одна пара</div>' +
          '<div class="empty-state-hint">Ослабьте фильтры связности или общих соседей</div></div>';
        return;
      }

      const rows = top.map(([v, k], idx) => {
        const a = P.ids[P.ia[k]], b = P.ids[P.ja[k]];
        const same = philOf[a] === philOf[b];
        return `
          <div class="pairs-row" data-act-click="open-pair-in-comparison" data-a1="${a}" data-a2="${b}"
             title="Открыть в сравнении концепций">
            <div class="pairs-rank">#${idx + 1}</div>
            <div class="pairs-names">
              <span class="pairs-name">${labOf[a]}</span>
              <span class="pairs-author">${philOf[a]}</span>
              <span class="pairs-tilde">~</span>
              <span class="pairs-name">${labOf[b]}</span>
              <span class="pairs-author">${philOf[b]}</span>
              ${same ? '<span class="pairs-same">один автор</span>' : ''}
            </div>
            <div class="pairs-value">${v.toFixed(3)}</div>
            <div class="pairs-extra">${isProfile ? '' : P.sh[k] + ' общ.'}</div>
          </div>`;
      }).join('');

      box.innerHTML = `
        <div class="pairs-count">Подошло пар: ${picked.length} из ${P.total}. Показаны первые ${top.length}.</div>
        <div class="pairs-rows">${rows}</div>
      `;
    }

function openPairInComparison(a, b) {
      S._cmpA = a; S._cmpB = b;
      switchStatsView('comparison');
    }

function generateComparisonContent() {
      if (!DATA.concepts || !DATA.relations) initializePhilosophyMetrics();
      const D = similarityData();

      // П2: тот же механизм, что в панели поиска пути — поле с поиском
      // по началу слова и выпадающий список в хронологическом порядке.
      // Обычный <select> на несколько сотен строк листать неудобно.
      if (!S._cmpA) S._cmpA = D.ids[0];
      if (!S._cmpB) S._cmpB = D.ids[1];

      const captionOf = id => {
        const n = DATA.nodes.find(x => x.id === id);
        return n ? `${n.label} (${n.concept})` : '';
      };
      const selectField = (slot, label) => `
        <div class="cmp-field">
          <label class="cmp-field-label">${label}</label>
          <div class="custom-select-wrapper">
            <input type="text"
                 class="custom-select-input"
                 id="${slot}SelectInput"
                 placeholder="Начните вводить название..."
                 autocomplete="off"
                 value="${captionOf(slot === 'cmpA' ? S._cmpA : S._cmpB)}"
                 data-act-focus="show-custom-select-dropdown-focus-3" data-a1="${slot}"
                 data-act-input="filter-custom-select-input-3" data-a1="${slot}">
            <span class="custom-select-arrow">▼</span>
            <div class="custom-select-dropdown" id="${slot}SelectDropdown"></div>
          </div>
        </div>`;

      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">⚖️ Сравнение концепций</h3>
          <p class="stats-content-subtitle">Функциональная схожесть по профилю метрик и по структуре связей</p>
        </div>

        ${generateMetricDescriptionBlock('comparison')}

        <div class="cmp-selects">
          ${selectField('cmpA', 'Первая концепция')}
          <span class="cmp-vs">против</span>
          ${selectField('cmpB', 'Вторая концепция')}
        </div>

        <div id="cmpBody"></div>
      `;
    }

function renderComparison() {
      const box = document.getElementById('cmpBody');
      if (!box) return;
      const D = similarityData();
      const a = DATA.nodes.find(n => n.id === S._cmpA), b = DATA.nodes.find(n => n.id === S._cmpB);
      if (!a || !b) { box.innerHTML = ''; return; }

      const prof = profileSimilarity(S._cmpA, S._cmpB);
      const st = structuralSimilarity(S._cmpA, S._cmpB);
      const ia = D.index.get(S._cmpA), ib = D.index.get(S._cmpB);

      // расхождение мер само по себе содержательно
      let verdict;
      if (prof > 0.6 && st.jaccard < 0.05)
        verdict = 'Функциональные аналоги без общих соседей: похожая роль в разных участках графа.';
      else if (prof < 0.2 && st.jaccard > 0.2)
        verdict = 'Общее окружение при разных ролях: соседи те же, но ведут себя понятия по-разному.';
      else if (prof > 0.6 && st.jaccard > 0.2)
        verdict = 'Близнецы: и роль, и окружение совпадают.';
      else verdict = 'Существенного сходства ни по профилю, ни по структуре не видно.';

      const rows = D.names.map((n, k) => {
        const pa = D.pct[k][ia], pb = D.pct[k][ib];
        const diff = Math.abs(pa - pb);
        return `
          <div class="cmp-row ${diff <= 15 ? 'cmp-close' : (diff >= 50 ? 'cmp-far' : '')}">
            <div class="cmp-label">${SIM_METRIC_LABELS[n] || n}</div>
            <div class="cmp-bars">
              <div class="cmp-bar cmp-bar-a" style="width:${pa}%"></div>
              <div class="cmp-bar cmp-bar-b" style="width:${pb}%"></div>
            </div>
            <div class="cmp-nums">${pa} / ${pb}</div>
          </div>`;
      }).join('');

      box.innerHTML = `
        <div class="cmp-summary">
          <div class="cmp-score">
            <div class="cmp-score-value">${Math.round(prof * 100)} %</div>
            <div class="cmp-score-label">схожесть профиля</div>
          </div>
          <div class="cmp-score">
            <div class="cmp-score-value">${Math.round(st.jaccard * 100)} %</div>
            <div class="cmp-score-label">схожесть структуры<br><span>общих соседей: ${st.shared}</span></div>
          </div>
          <div class="cmp-score">
            <div class="cmp-score-value">${Math.round(st.typeCosine * 100)} %</div>
            <div class="cmp-score-label">близость типов связей</div>
          </div>
        </div>

        <div class="cmp-verdict">${verdict}</div>

        <div class="cmp-legend">
          <span><i class="cmp-swatch cmp-bar-a"></i>${a.label} (${a.concept})</span>
          <span><i class="cmp-swatch cmp-bar-b"></i>${b.label} (${b.concept})</span>
          <span class="cmp-legend-hint">столбики — процентиль концепции по метрике среди всех ${S._concepts.length}</span>
        </div>

        <div class="cmp-rows">${rows}</div>
      `;
    }

export { generateClosestPairsContent, generateComparisonContent, generatePhilosopherComparisonContent, generatePhilosopherPairsContent, openPairInComparison, openPhilosopherPair, renderClosestPairs, renderComparison, renderPhilosopherComparison, renderPhilosopherPairs };
