// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { известить } from '../core/events.js';
import { showTemporaryMessage } from '../core/long-task.js';
import { initializePhilosophyMetrics } from '../metrics/link-indexes.js';
import { _simCache, profileSimilarity, structuralSimilarity } from '../metrics/similarity-concepts.js';
import { requestDraw } from './loop.js';

const SIMILARITY_KEEP_QUANTILE = 0.85;

const SIMILARITY_ARCS = 6;

function similarityColor(t) {
      const x = Math.max(-1, Math.min(1, t));
      // Полюса: синий #3b6fd4, красный #d63b3b, середина белая.
      const from = x < 0 ? [59, 111, 212] : [255, 255, 255];
      const to   = x < 0 ? [255, 255, 255] : [214, 59, 59];
      const p = x < 0 ? 1 + x : x;
      const mix = i => Math.round(from[i] + (to[i] - from[i]) * p);
      return `rgb(${mix(0)},${mix(1)},${mix(2)})`;
    }

function showSimilarityOverlay(sourceId, kind) {
      if (!DATA.concepts || !DATA.relations) initializePhilosophyMetrics();
      // Первый вызов строит все 17 метрик на весь корпус. Это заметно
      // быстрее полной матрицы пар, но не мгновенно, поэтому предупреждаем.
      if (!_simCache && typeof showTemporaryMessage === 'function') {
        showTemporaryMessage('Считаю метрики для карты сходства…', 1500);
      }
      const values = new Map();
      for (const n of DATA.nodes) {
        if (n.id === sourceId) continue;
        const v = kind === 'structure'
          ? structuralSimilarity(sourceId, n.id).jaccard
          : profileSimilarity(sourceId, n.id);
        values.set(n.id, v);
      }
      const nearest = [...values.entries()]
        .filter(([, v]) => v > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, SIMILARITY_ARCS)
        .map(([id]) => id);

      // Н1: нормировка по строке. Меры живут на несопоставимых шкалах —
      // медианный максимум строки 0.858 у профиля и 0.25 у жаккара, —
      // поэтому цвет и ширина считаются от максимума этой конкретной строки.
      const mags = [...values.values()].map(Math.abs);
      const rowMax = mags.length ? Math.max(...mags) : 1;

      // Порог приглушения тоже относительный. Для структуры отсекаются
      // только настоящие нули: ненулевых соседей у медианного узла 43,
      // и все они содержательны.
      let dimBelow;
      if (kind === 'structure') {
        dimBelow = 0;
      } else {
        const sorted = [...mags].sort((a, b) => a - b);
        dimBelow = sorted[Math.floor(SIMILARITY_KEEP_QUANTILE * (sorted.length - 1))] || 0;
      }

      S.similarityOverlay = { sourceId, kind, values, nearest,
                  rowMax: rowMax || 1, dimBelow };
      известить('закрыть-окна');
      requestDraw();
      updateSimilarityLegend();
    }

function clearSimilarityOverlay() {
      S.similarityOverlay = null;
      requestDraw();
      updateSimilarityLegend();
    }

function updateSimilarityLegend() {
      let box = document.getElementById('similarityLegend');
      if (!S.similarityOverlay) { if (box) box.remove(); return; }
      if (!box) {
        box = document.createElement('div');
        box.id = 'similarityLegend';
        document.body.appendChild(box);
      }
      const src = DATA.nodes.find(n => n.id === S.similarityOverlay.sourceId);
      const isProfile = S.similarityOverlay.kind === 'profile';
      box.innerHTML = `
        <div class="simleg-title">Сходство с «${src ? src.label : '—'}»</div>
        <div class="simleg-mode">
          <button class="simleg-btn ${isProfile ? 'active' : ''}"
              data-act-click="show-similarity-overlay-2" data-a1="${S.similarityOverlay.sourceId}">По профилю</button>
          <button class="simleg-btn ${!isProfile ? 'active' : ''}"
              data-act-click="show-similarity-overlay-3" data-a1="${S.similarityOverlay.sourceId}">По структуре</button>
        </div>
        <div class="simleg-scale ${isProfile ? '' : 'one-sided'}"></div>
        <div class="simleg-ticks">
          <span>${isProfile ? '−' + S.similarityOverlay.rowMax.toFixed(2) : '0'}</span>
          <span>${isProfile ? '0' : ''}</span>
          <span>${S.similarityOverlay.rowMax.toFixed(2)}</span>
        </div>
        <div class="simleg-hint">
          Шкала нормирована по этой концепции: край соответствует её
          максимальному сходству ${S.similarityOverlay.rowMax.toFixed(2)}.
          Показано ${[...S.similarityOverlay.values.values()].filter(v =>
            isProfile ? Math.abs(v) >= S.similarityOverlay.dimBelow : v > 0).length}
          концепций из ${S.similarityOverlay.values.size}.
          Пунктиром — ${SIMILARITY_ARCS} ближайших. Заливка узла — цвет философа.
        </div>
        <button class="simleg-close" data-act-click="clear-similarity-overlay">Скрыть карту сходства</button>
      `;
    }

export { SIMILARITY_ARCS, SIMILARITY_KEEP_QUANTILE, clearSimilarityOverlay, showSimilarityOverlay, similarityColor, updateSimilarityLegend };
