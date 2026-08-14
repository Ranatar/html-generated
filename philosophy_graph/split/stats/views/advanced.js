// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, MET } from '../../core/ns.js';
import { initializePhilosophyMetrics } from '../../metrics/init.js';
import { highlightNodeById } from '../../render/selection.js';
import { generateMetricDescriptionBlock, generateMetricResults, rankKeep } from '../results.js';

function generateGenerativeContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }

      const results = DATA.nodes.map(n => {
        const metric = MET.generativeIndex(n.id);
        return { node: n, value: metric.total, details: metric };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);

      return generateMetricResults(
        results.slice(0, 30),
        '🌱 Генеративность',
        'Концепции-истоки, из которых расходятся традиции',
        'generative',
        'value',
        true
      );
    }

function generateInstrumentalContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }

      const results = DATA.nodes.map(n => {
        const metric = MET.instrumentalIndex(n.id);
        return { node: n, value: metric.total, details: metric };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);

      return generateMetricResults(
        results.slice(0, 30),
        '🔧 Индекс инструментальности',
        'Концепции, служащие методом для других идей',
        'instrumental',
        'value',
        true
      );
    }

function generateBridgingContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }

      // Вес свидетельств теперь входит в саму величину, поэтому добор
      // нужен лишь на случай точного совпадения. Само число рейтинга
      // собрано из двух разных вещей — доли и числа связей, — и порознь
      // они читаются, а слитно нет: 100 % при пяти связях и 84 % при
      // семнадцати дают близкие числа при совсем разном основании.
      // Поэтому обе величины приписаны прямо к числу.
      const results = DATA.nodes.map(n => {
        const metric = MET.traditionBridgingIndex(n.id);
        return { node: n, value: metric.total, details: metric };
      }).filter(rankKeep).sort((a, b) => b.value - a.value
                || b.details.crossingLinks - a.details.crossingLinks);

      return generateMetricResults(
        results.slice(0, 30),
        '🌉 Межтрадиционная мостовость',
        'Концепции, чьи внешние связи ведут за пределы своей традиции',
        'bridging',
        'value',
        true,
        { getValueNote: item =>
            `${item.details.share} % · ${item.details.crossingLinks} связей` }
      );
    }

function generateAbstractionContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }

      // Шкала знаковая, поэтому нулевые значения отбрасывать нельзя тем же
      // фильтром: показываем и абстрактный, и конкретный полюс.
      const all = DATA.nodes.map(n => {
        const metric = MET.abstractionIndex(n.id);
        return { node: n, value: metric.total, details: metric };
      }).filter(r => r.value !== 0).sort((a, b) => b.value - a.value);

      return generateMetricResults(
        all.slice(0, 30),
        '🎚️ Индекс абстрактности',
        'Положительные значения — общие принципы, отрицательные — иллюстрации',
        'abstraction',
        'value',
        true
      );
    }

function generateDeductiveContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }

      const results = DATA.nodes.map(n => {
        const metric = MET.deductiveIndex(n.id);
        return { node: n, value: metric.total, details: metric };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);

      return generateMetricResults(
        results.slice(0, 30),
        '⛓️ Дедуктивная продуктивность',
        'Концепции, из которых выводится наибольшее число следствий',
        'deductive',
        'value',
        true
      );
    }

function generateTransformationContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.transformationIndex(n.id);
        return {
          node: n,
          value: metric.total,
          details: metric
        };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);
      
      return generateMetricResults(
        results.slice(0, 30),
        '🔄 Индекс трансформации',
        'Концепции, трансформирующие заимствованные идеи',
        'transformation',
        'value',
        true
      );
    }

function generateFertilityContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.conceptualFertilityIndex(n.id);
        return {
          node: n,
          value: metric.total,
          details: metric
        };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);
      
      return generateMetricResults(
        results.slice(0, 30),
        '🌱 Концептуальная плодовитость',
        'Концепции, порождающие новые идеи',
        'fertility',
        'value',
        true
      );
    }

function generateComplexityContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.conceptualComplexityIndex(n.id);
        return {
          node: n,
          value: metric.total,
          details: metric
        };
      }).sort((a, b) => b.value - a.value);
      
      return generateMetricResults(
        results.slice(0, 30),
        '📊 Концептуальная сложность',
        'Наиболее сложные и многоаспектные концепции',
        'complexity',
        'value',
        true
      );
    }

function generateContinuityContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.conceptualContinuityIndex(n.id);
        return {
          node: n,
          value: metric.total,
          details: metric
        };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);
      
      return generateMetricResults(
        results.slice(0, 30),
        '📜 Индекс преемственности',
        'Концепции с наибольшей исторической преемственностью',
        'continuity',
        'value',
        true
      );
    }

function generateTemporalInfluenceContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.temporalInfluencePattern(n.id);
        return {
          node: n,
          pattern: metric.pattern,
          total: metric.totalForwardReferences,
          details: metric
        };
      }).filter(r => r.total > 0).sort((a, b) => b.total - a.total);
      
      const patternLabels = {
        'lasting': '🌟 Устойчивое',
        'fading': '💨 Угасающее',
        'delayed': '⏰ Отложенное',
        'normal': '📊 Нормальное',
        'none': '❌ Отсутствует'
      };
      
      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">🕐 Временное влияние</h3>
          <p class="stats-content-subtitle">Паттерны влияния концепций во времени</p>
        </div>
        
        ${generateMetricDescriptionBlock('temporal-influence')}
        
        <table class="metric-table">
          <thead class="metric-table-header">
            <tr>
              <th>#</th>
              <th>Концепция</th>
              <th>Паттерн</th>
              <th>Ссылок</th>
            </tr>
          </thead>
          <tbody>
            ${results.slice(0, 30).map((r, i) => `
              <tr class="metric-table-row" data-act-click="highlight-node-by-id-2" data-a1="${r.node.id}">
                <td><strong>${i + 1}</strong></td>
                <td><strong>${r.node.label}</strong></td>
                <td>${patternLabels[r.pattern]}</td>
                <td class="metric-table-value">${r.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

export { generateAbstractionContent, generateBridgingContent, generateComplexityContent, generateContinuityContent, generateDeductiveContent, generateFertilityContent, generateGenerativeContent, generateInstrumentalContent, generateTemporalInfluenceContent, generateTransformationContent };
