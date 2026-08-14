// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, MET } from '../../core/ns.js';
import { initializePhilosophyMetrics } from '../../metrics/init.js';
import { influenceScopeSwitcher } from '../../metrics/philosophical.js';
import { generateMetricResults, rankKeep } from '../results.js';

function generateProblemGenerationContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.problemGenerationIndex(n.id);
        return {
          node: n,
          value: metric.total,
          details: metric
        };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);
      
      return generateMetricResults(
        results.slice(0, 30),
        '💥 Индекс проблемности',
        'Концепции, породившие наибольший спор в традиции',
        'problem-generation',
        'value',
        true
      );
    }

function generateCriticalPowerContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.criticalPowerIndex(n.id);
        return {
          node: n,
          value: metric.total,
          details: metric
        };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);
      
      return generateMetricResults(
        results.slice(0, 30),
        '⚔️ Критическая сила',
        'Концепции с наибольшей критической мощью',
        'critical-power',
        'value',
        true
      );
    }

function generateRevolutionaryContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.revolutionaryIndex(n.id);
        return {
          node: n,
          value: metric.total,
          details: metric
        };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);
      
      return generateMetricResults(
        results.slice(0, 30),
        '🌟 Индекс революционности',
        'Наиболее революционные концепции, порывающие с традицией',
        'revolutionary',
        'value',
        true
      );
    }

function generateParadigmShiftContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.paradigmShiftIndex(n.id);
        return {
          node: n,
          value: metric.total,
          details: metric
        };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);
      
      return generateMetricResults(
        results.slice(0, 30),
        '🌐 Парадигмальный сдвиг',
        'Концепции, изменившие способ мышления',
        'paradigm-shift',
        'value',
        true
      );
    }

function generateInfluenceContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.influenceIndex(n.id);
        return {
          node: n,
          value: metric.total,
          details: metric
        };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);
      
      return influenceScopeSwitcher() + generateMetricResults(
        results.slice(0, 30),
        '🎭 Индекс влияния',
        'Концепции с наибольшим историческим влиянием',
        'influence',
        'value',
        true
      );
    }

function generateFoundationalContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.foundationalIndex(n.id);
        return {
          node: n,
          value: metric.total,
          details: metric
        };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);
      
      return generateMetricResults(
        results.slice(0, 30),
        '🏛️ Индекс основополагания',
        'Фундаментальные концепции, на которых строятся другие',
        'foundational',
        'value',
        true
      );
    }

function generateSyntheticContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.syntheticIndex(n.id);
        return {
          node: n,
          value: metric.total,
          details: metric
        };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);
      
      return generateMetricResults(
        results.slice(0, 30),
        '🔗 Индекс синтетичности',
        'Концепции, синтезирующие разные традиции',
        'synthetic',
        'value',
        true
      );
    }

function generateDialogicalContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.dialogicalIndex(n.id);
        return {
          node: n,
          value: metric.total,
          details: metric
        };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);
      
      return generateMetricResults(
        results.slice(0, 30),
        '💬 Индекс диалогичности',
        'Концепции в активном философском диалоге',
        'dialogical',
        'value',
        true
      );
    }

function generateCoherenceContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.internalCoherenceIndex(n.id);
        return {
          node: n,
          value: metric.total,
          details: metric
        };
      }).sort((a, b) => b.value - a.value);
      
      return generateMetricResults(
        results.slice(0, 30),
        '✨ Внутренняя когерентность',
        'Концепции с наименьшим количеством противоречий',
        'coherence',
        'value',
        true
      );
    }

function generateTensionContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const results = DATA.nodes.map(n => {
        const metric = MET.tensionIndex(n.id);
        return {
          node: n,
          value: metric.total,
          details: metric,
          dominantType: metric.analytics.dominantType,
          immanent: metric.immanentTension,
          polemical: metric.polemicalTension,
          dialectical: metric.dialecticalTension
        };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);
      
      const typeIcons = {
        'immanent': '🔴',
        'polemical': '⚖️',   // C7: опосредование, а не полемика
        'dialectical': '♦️'
      };
      
      // C7: ярусы переопределены по слоям A9
      const typeLabels = {
        'immanent': 'Противоречие',
        'polemical': 'Опосредование',
        'dialectical': 'Разрешено'
      };
      
      // Функция для генерации HTML деталей напряжения
      const getTensionDetailsHTML = (item, index) => {
        const r = item;
        const details = r.details;
        const ratio = details.analytics.tensionResolutionRatio;
        const ratioPercent = Math.round(ratio * 100);
        const typeLabel = typeLabels[r.dominantType] || 'Смешанное';
        
        // Вычисляем проценты для визуальной шкалы
        // C7: итог теперь РАЗНОСТЬ, поэтому доли берутся от суммы ярусов,
        // иначе при сильном разрешении полосы уходят за 100 %.
        const _tierSum = (r.immanent + r.polemical + r.dialectical) || 1;
        const immanentPercent = (r.immanent / _tierSum * 100).toFixed(1);
        const polemicalPercent = (r.polemical / _tierSum * 100).toFixed(1);
        const dialecticalPercent = (r.dialectical / _tierSum * 100).toFixed(1);
        
        return `
          <div class="metric-detail-panel tension-detail">
            <!-- Визуальная шкала напряжения -->
            <div class="tension-breakdown-section">
              <div class="tension-breakdown-bar">
                <div class="tension-segment tension-immanent" 
                   style="width: ${immanentPercent}%"
                   title="Противоречие: ${r.immanent.toFixed(1)}">
                </div>
                <div class="tension-segment tension-polemical" 
                   style="width: ${polemicalPercent}%"
                   title="Опосредование: ${r.polemical.toFixed(1)}">
                </div>
                <div class="tension-segment tension-dialectical" 
                   style="width: ${dialecticalPercent}%"
                   title="Разрешение: ${r.dialectical.toFixed(1)}">
                </div>
              </div>
              
              <div class="tension-badges">
                <div class="tension-badge tension-badge-immanent">
                  🔴 ${r.immanent.toFixed(1)}
                </div>
                <div class="tension-badge tension-badge-polemical">
                  ⚔️ ${r.polemical.toFixed(1)}
                </div>
                <div class="tension-badge tension-badge-dialectical">
                  ♦️ ${r.dialectical.toFixed(1)}
                </div>
              </div>
            </div>
            
            <!-- Имманентное напряжение -->
            <div class="tension-detail-section">
              <h4 class="tension-detail-title">🔴 Противоречие: ${r.immanent.toFixed(1)}</h4>
              <div class="tension-detail-list">
                ${details.immanent.internalContradictions > 0 ? 
                  `<div class="tension-detail-item">
                    <span class="tension-detail-label">Внутренние противоречия:</span>
                    <span class="tension-detail-value">${details.immanent.internalContradictions.toFixed(1)}</span>
                  </div>` : ''}
                ${details.immanent.acknowledgedLimits > 0 ? 
                  `<div class="tension-detail-item">
                    <span class="tension-detail-label">Признанные ограничения:</span>
                    <span class="tension-detail-value">${details.immanent.acknowledgedLimits}</span>
                  </div>` : ''}
                ${details.immanent.conditionalDependencies > 0 ? 
                  `<div class="tension-detail-item">
                    <span class="tension-detail-label">Условные зависимости:</span>
                    <span class="tension-detail-value">${details.immanent.conditionalDependencies}</span>
                  </div>` : ''}
                ${details.immanent.mediations > 0 ? 
                  `<div class="tension-detail-item">
                    <span class="tension-detail-label">Опосредования:</span>
                    <span class="tension-detail-value">${details.immanent.mediations}</span>
                  </div>` : ''}
                ${details.immanent.complementarityNeeds > 0 ? 
                  `<div class="tension-detail-item">
                    <span class="tension-detail-label">Потребность в дополнении:</span>
                    <span class="tension-detail-value">${details.immanent.complementarityNeeds}</span>
                  </div>` : ''}
              </div>
            </div>
            
            <!-- C7: опосредование (логический слой) -->
            <div class="tension-detail-section">
              <h4 class="tension-detail-title">⚖️ Опосредование: ${r.polemical.toFixed(1)}</h4>
              <div class="tension-detail-list">
                ${details.polemical.mediations > 0 ? 
                  `<div class="tension-detail-item">
                    <span class="tension-detail-label">Опосредования:</span>
                    <span class="tension-detail-value">${details.polemical.mediations}</span>
                  </div>` : ''}
                ${details.polemical.complementarityNeeds > 0 ? 
                  `<div class="tension-detail-item">
                    <span class="tension-detail-label">Потребность в дополнении:</span>
                    <span class="tension-detail-value">${details.polemical.complementarityNeeds}</span>
                  </div>` : ''}
                ${details.polemical.mediations === 0 && details.polemical.complementarityNeeds === 0 ?
                  `<div class="tension-detail-item">
                    <span class="tension-detail-label">Опосредующих связей нет</span>
                    <span class="tension-detail-value">—</span>
                  </div>` : ''}
              </div>
            </div>
            
            <!-- C7: разрешение — то, что снято внутри самой системы -->
            <div class="tension-detail-section">
              <h4 class="tension-detail-title">♦️ Разрешение: ${r.dialectical.toFixed(1)}</h4>
              <div class="tension-detail-list">
                ${details.dialectical.syntheses > 0 ? 
                  `<div class="tension-detail-item">
                    <span class="tension-detail-label">Синтезы:</span>
                    <span class="tension-detail-value">${details.dialectical.syntheses}</span>
                  </div>` : ''}
                ${details.dialectical.culminations > 0 ? 
                  `<div class="tension-detail-item">
                    <span class="tension-detail-label">Кульминации:</span>
                    <span class="tension-detail-value">${details.dialectical.culminations}</span>
                  </div>` : ''}
                <div class="tension-detail-item">
                  <span class="tension-detail-label">Остаток (итог метрики):</span>
                  <span class="tension-detail-value">${details.dialectical.unresolvedTension.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            <!-- Аналитика -->
            <div class="tension-analytics-section">
              <div class="tension-analytics-item">
                <span class="tension-analytics-label">Доминирующий тип:</span>
                <span class="tension-analytics-value">${typeLabel}</span>
              </div>
              <div class="tension-analytics-item">
                <span class="tension-analytics-label">Баланс Н/Р:</span>
                <span class="tension-analytics-value">${ratioPercent}%</span>
              </div>
              <div class="tension-analytics-item">
                <span class="tension-analytics-label">Средняя интенсивность:</span>
                <span class="tension-analytics-value">${details.analytics.averageIntensity.toFixed(2)}</span>
              </div>
            </div>
            
            <!-- Описание концепции -->
            ${r.node.description ? 
              `<div class="metric-concept-description">
                <strong>О концепции:</strong>
                <p>${r.node.description}</p>
              </div>` : ''}
          </div>
        `;
      };
      
      // Используем универсальную функцию generateMetricResults
      return generateMetricResults(
        results.slice(0, 30),
        '⚖️ Индекс напряжения',
        'Концепции с наибольшим внутренним напряжением',
        'tension',
        'value',
        true,
        {
          isComposite: true,
          getDetailsHTML: getTensionDetailsHTML,
          getConceptDescription: (item) => item.node.description
        }
      );
    }

export { generateCoherenceContent, generateCriticalPowerContent, generateDialogicalContent, generateFoundationalContent, generateInfluenceContent, generateParadigmShiftContent, generateProblemGenerationContent, generateRevolutionaryContent, generateSyntheticContent, generateTensionContent };
