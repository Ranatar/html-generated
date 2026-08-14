// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';
import { METRIC_FIELD_LABELS } from '../core/labels.js';
import { getMetricDescription } from '../metrics/descriptions.js';
import { applyMetricMode, toggleMetricValueMode } from '../metrics/format.js';
import { METRIC_COVERAGE_WARN } from '../metrics/thresholds.js';
import { showConceptProfileModal } from '../modal/profile-concept.js';
import { toggleMetricVisualization } from '../render/metric-visualization.js';
import { highlightNodeById } from '../render/selection.js';
import { calculateMetricFromModal } from './run.js';

let _metricCoverageCache = {};

function metricCoverage(metricKey) {
      if (_metricCoverageCache[metricKey]) return _metricCoverageCache[metricKey];
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
      _metricCoverageCache[metricKey] = res;
      return res;
    }

function invalidateMetricCoverageCache() { _metricCoverageCache = {}; }

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

function generateMetricDescriptionBlock(metricKey) {
      const desc = getMetricDescription(metricKey);
      // М4.3: раньше отсутствие записи давало пустую строку, и пропуск
      // проходил незамеченным. Теперь он виден.
      if (!desc) return `
        <div class="metric-description-box">
          <div class="metric-description-section">
            <div class="metric-description-label">📋 Что измеряет</div>
            <div class="metric-description-text">
              Описание для «${metricKey}» не задано в metricDescriptions.
            </div>
          </div>
        </div>
      `;
      
      return `
        <div class="metric-description-box">
          <div class="metric-description-section">
            <div class="metric-description-label">📋 Что измеряет</div>
            <div class="metric-description-text">${desc.description}</div>
          </div>
          
          <div class="metric-description-section">
            <div class="metric-description-label">💡 Интерпретация</div>
            <div class="metric-description-text">${desc.interpretation}</div>
          </div>
          
          <div class="metric-description-section">
            <div class="metric-description-label">🎯 Применение</div>
            <div class="metric-description-text">${desc.usage}</div>
          </div>
          
          <div class="metric-description-section">
            <div class="metric-description-label">🧮 Формула</div>
            <div class="metric-formula">${desc.formula}</div>
          </div>
        </div>
      `;
    }

function generateCalculateButton(metricName, metricKey, description) {
      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">${metricName}</h3>
          <p class="stats-content-subtitle">${description}</p>
        </div>
        
        ${generateMetricDescriptionBlock(metricKey)}
        
        <div class="empty-state">
          <div class="empty-state-icon">📊</div>
          <div class="empty-state-text">Метрика ещё не рассчитана</div>
          <button class="calculate-metric-btn" data-act-click="calculate-metric-from-modal" data-a1="${metricKey}">
            ⚡ Рассчитать ${metricName}
          </button>
        </div>
      `;
    }

let lastZeroCount = 0;

function rankKeep(r, i) {
      if (i === 0) lastZeroCount = 0;
      const keep = r.value > 0;
      if (!keep) lastZeroCount++;
      return keep;
    }

function genericDetailsHTML(item, conceptDesc) {
      const d = item && item.details;
      const rows = [];
      const groups = [];

      // Д2: раньше отрисовщик пропускал всё, что не число и не логическое
      // значение, поэтому вложенные разборы вычислялись и не показывались —
      // например criticalPowerIndex.targets с разбивкой по целям критики.
      const chipOf = (label, value) =>
        `<span class="metric-detail-chip"><b>${value}</b> ${label}</span>`;
      const numeric = v => typeof v === 'number' && Number.isFinite(v) && v !== 0;
      const shownNumber = v => Number.isInteger(v) ? v : v.toFixed(2);

      if (d && typeof d === 'object') {
        for (const [k, v] of Object.entries(d)) {
          if (k === 'total' || k === 'weighted' || v === undefined || v === null) continue;

          if (typeof v === 'boolean') {
            rows.push([METRIC_FIELD_LABELS[k] || k, v ? 'да' : 'нет']);
          } else if (numeric(v)) {
            rows.push([METRIC_FIELD_LABELS[k] || k, shownNumber(v)]);
          } else if (Array.isArray(v)) {
            if (v.length) groups.push([METRIC_FIELD_LABELS[k] || k,
              [[`${v.length}`, 'элементов']]]);
          } else if (typeof v === 'object') {
            const sub = Object.entries(v)
              .filter(([, x]) => numeric(x) || typeof x === 'boolean')
              .map(([sk, sx]) => [
                typeof sx === 'boolean' ? (sx ? 'да' : 'нет') : shownNumber(sx),
                METRIC_FIELD_LABELS[sk] || sk
              ]);
            if (sub.length) groups.push([METRIC_FIELD_LABELS[k] || k, sub]);
          }
        }
      }

      const chips = rows.map(([l, v]) => chipOf(l, v)).join(' ');
      const groupsHTML = groups.map(([title, pairs]) => `
        <div class="metric-detail-group">
          <div class="metric-detail-group-title">${title}</div>
          <div class="metric-detail-chips">
            ${pairs.map(([v, l]) => chipOf(l, v)).join(' ')}
          </div>
        </div>
      `).join('');

      return `
        <div class="metric-detail-panel simple-detail">
          ${chips ? `<div class="metric-detail-chips">${chips}</div>` : ''}
          ${groupsHTML}
          ${conceptDesc ? `<div class="metric-concept-description">
            <strong>О концепции:</strong><p>${conceptDesc}</p></div>` : ''}
        </div>
      `;
    }

function applyMetricLayout() {
      const isRows = S.metricLayoutMode === 'rows';
      document.querySelectorAll('.metric-results-grid').forEach(grid => {
        grid.classList.toggle('rows', isRows);
      });
      document.querySelectorAll('.metric-layout-btn').forEach(btn => {
        const icon = btn.querySelector('.layout-icon');
        const label = btn.querySelector('.layout-text');
        if (icon) icon.textContent = isRows ? '▦' : '▤';
        if (label) label.textContent = isRows ? 'Плитками' : 'Строками';
        btn.title = isRows ? 'Показать плитками' : 'Показать строками';
      });
    }

function toggleMetricLayout() {
      S.metricLayoutMode = S.metricLayoutMode === 'rows' ? 'cards' : 'rows';
      try { localStorage.setItem('metricLayoutMode', S.metricLayoutMode); } catch (e) {}
      applyMetricLayout();
    }

function generateMetricResults(data, title, description, metricKey, valueKey, isDecimal, options = {}) {
      const {
        isComposite = false,
        getDetailsHTML = null,
        getConceptDescription = (item) => item.node.description || null,
        // Приписка к самому числу: короткая, из тех величин, из которых
        // число собрано. Нужна там, где одно число рейтинга без разбора
        // читается неверно — см. мостовость.
        getValueNote = null
      } = options;
      
      if (!data || data.length === 0) {
        return `
          <div class="stats-content-header">
            <h3 class="stats-content-title">${title}</h3>
            <p class="stats-content-subtitle">${description}</p>
            
            <div class="stats-content-actions">
              <button class="stats-action-btn secondary" 
                  id="visualize-btn-${metricKey}"
                  data-act-click="toggle-metric-visualization" data-a1="${metricKey}">
                <span id="visualize-icon-${metricKey}">📏</span>
                <span id="visualize-text-${metricKey}">Визуализировать размером</span>
              </button>
            </div>
          </div>
          
          ${generateMetricDescriptionBlock(metricKey)}
          ${generateMetricCoverageBlock(metricKey)}
          
          <div class="empty-state">
            <div class="empty-state-icon">📊</div>
            <div class="empty-state-text">Нет данных для отображения</div>
          </div>
        `;
      }
      
      // C1: при нормировке порядок строк должен соответствовать
      // показываемой величине, иначе рейтинг противоречит сам себе
      if (S.metricValueMode === 'normalized' && S.METRIC_COVERAGE_FN[metricKey]) {
        data = data.slice().sort((a, b) =>
          applyMetricMode(b.node.id, b[valueKey]) - applyMetricMode(a.node.id, a[valueKey]));
      }

      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">${title}</h3>
          <p class="stats-content-subtitle">${description}${S.metricValueMode === 'normalized' && S.METRIC_COVERAGE_FN[metricKey] ? ' · нормировано на степень узла' : ''}</p>
          
          <div class="stats-content-actions">
            <button class="stats-action-btn secondary" 
                id="visualize-btn-${metricKey}"
                data-act-click="toggle-metric-visualization" data-a1="${metricKey}">
              <span id="visualize-icon-${metricKey}">📏</span>
              <span id="visualize-text-${metricKey}">Визуализировать размером</span>
            </button>
            <button class="stats-action-btn secondary metric-layout-btn"
                data-act-click="toggle-metric-layout"
                title="${S.metricLayoutMode === 'rows' ? 'Показать плитками' : 'Показать строками'}">
              <span class="layout-icon">${S.metricLayoutMode === 'rows' ? '▦' : '▤'}</span>
              <span class="layout-text">${S.metricLayoutMode === 'rows' ? 'Плитками' : 'Строками'}</span>
            </button>
            ${S.METRIC_COVERAGE_FN[metricKey] ? `
            <button class="stats-action-btn secondary metric-norm-btn"
                data-act-click="toggle-metric-value-mode"
                title="Сырое значение растёт вместе с числом связей автора; нормированное делится на степень узла и сравнимо между авторами">
              <span class="layout-icon">${S.metricValueMode === 'raw' ? '÷' : '×'}</span>
              <span class="layout-text">${S.metricValueMode === 'raw' ? 'Нормировать' : 'Сырые значения'}</span>
            </button>` : ''}
          </div>
        </div>
        
        ${generateMetricDescriptionBlock(metricKey)}
        ${generateMetricCoverageBlock(metricKey)}

        ${lastZeroCount > 0 ? `
          <div class="metric-zero-note">
            Ещё ${lastZeroCount} концептов имеют нулевое значение этой метрики
            и в таблицу не попали.
          </div>
        ` : ''}

        <div class="metric-results-grid ${S.metricLayoutMode === 'rows' ? 'rows' : ''}${getValueNote ? ' value-notes' : ''}">
          ${data.map((item, index) => {
            const rawValue = item[valueKey];
            // C1: показ зависит от режима; сортировка данных остаётся
            // сырой, поэтому при нормировке порядок пересчитывается ниже
            const value = S.METRIC_COVERAGE_FN[metricKey]
              ? applyMetricMode(item.node.id, rawValue) : rawValue;
            const displayValue = isDecimal ? value.toFixed(4) : Math.round(value);
            const conceptDesc = getConceptDescription(item);
            const hasDetails = isComposite || conceptDesc || !!(item && item.details);

            // Генерируем HTML для деталей
            let detailsHTML = '';
            if (hasDetails) {
              if (isComposite && getDetailsHTML) {
                // Составная метрика со своим разбором (tension)
                detailsHTML = getDetailsHTML(item, index);
              } else {
                // М5.1: остальные метрики получают универсальный разбор
                detailsHTML = genericDetailsHTML(item, conceptDesc);
              }
            }
            
            return `
              <div class="metric-result-card ${hasDetails ? 'has-details' : ''}" 
                 data-concept-id="${item.node.id}"
                 data-act-click="highlight-node-by-id" data-a1="${item.node.id}">
                <div class="metric-result-rank">#${index + 1}</div>
                <div class="metric-result-name">${item.node.label}</div>
                <div class="metric-result-value">${displayValue}${
                  getValueNote ? `<span class="metric-value-note">${getValueNote(item)}</span>` : ''}</div>
                <div class="metric-result-philosopher">${item.node.concept}</div>
                
                <button class="metric-expand-btn" 
                    data-act-click="stop-propagation-6" data-a1="${item.node.id}"
                    title="Статистический профиль концепции"
                    style="right: 34px;">
                  <span class="expand-icon">📊</span>
                </button>
                ${hasDetails ? `
                  <button class="metric-expand-btn" 
                      data-act-click="stop-propagation-7"
                      title="Показать детали">
                    <span class="expand-icon">▼</span>
                  </button>
                ` : ''}
                
                ${hasDetails ? detailsHTML : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

function toggleMetricDetails(button) {
      const card = button.closest('.metric-result-card');
      const panel = card.querySelector('.metric-detail-panel');
      const icon = button.querySelector('.expand-icon');
      
      if (!panel) return;
      
      const isExpanded = card.classList.contains('expanded');
      
      if (isExpanded) {
        // Сворачиваем
        panel.style.display = 'none';
        icon.textContent = '▼';
        card.classList.remove('expanded');
      } else {
        // Разворачиваем
        panel.style.display = 'block';
        icon.textContent = '▲';
        card.classList.add('expanded');
      }
    }

export { _metricCoverageCache, applyMetricLayout, generateCalculateButton, generateMetricCoverageBlock, generateMetricDescriptionBlock, generateMetricResults, genericDetailsHTML, invalidateMetricCoverageCache, lastZeroCount, metricCoverage, rankKeep, toggleMetricDetails, toggleMetricLayout };
