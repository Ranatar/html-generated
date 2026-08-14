// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { invalidateGraphCache } from '../metrics/graph-cache.js';
import { initializePhilosophyMetrics } from '../metrics/init.js';
import { applyMetricsScope, installMetricScopeWrappers, invalidateEverythingForScope, updateMetricsScopeHint, updateScopeToggles } from '../metrics/scope.js';
import { resetNodeSizes } from '../render/metric-visualization.js';
import { ensureAnimLoop, needsContinuousAnimation } from '../render/scene.js';
import { freezeSimulation, unfreezeSimulation } from '../render/simulation.js';
import { applyMetricLayout } from './results.js';
import { generateAbstractionContent, generateBridgingContent, generateComplexityContent, generateContinuityContent, generateDeductiveContent, generateFertilityContent, generateGenerativeContent, generateInstrumentalContent, generateTemporalInfluenceContent, generateTransformationContent } from './views/advanced.js';
import { generateClosestPairsContent, generateComparisonContent, generatePhilosopherComparisonContent, generatePhilosopherPairsContent, renderClosestPairs, renderComparison, renderPhilosopherComparison, renderPhilosopherPairs } from './views/comparison.js';
import { generateBetweennessContent, generateClosenessContent, generateDegreeContent, generateEigenvectorContent, generateLocalCohesionContent, generateOverviewContent, generatePageRankContent, generateRichClubContent, generateWeightedClusteringContent } from './views/network.js';
import { generatePhilosopherInterdisciplinaryContent, generatePhilosopherProfileContent, generatePhilosopherReachContent, generatePhilosopherSystematicContent } from './views/philosopher.js';
import { generateCoherenceContent, generateCriticalPowerContent, generateDialogicalContent, generateFoundationalContent, generateInfluenceContent, generateParadigmShiftContent, generateProblemGenerationContent, generateRevolutionaryContent, generateSyntheticContent, generateTensionContent } from './views/philosophical.js';
import { generateConceptRankingsContent, generatePhilosopherRankingsContent } from './views/rankings.js';

function openStatsModal() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }

      freezeSimulation();
      
      // Синхронизируем состояния переключателей с глобальными переменными
      document.getElementById('statsUseWeightsToggle').checked = S.useWeightedPaths;
      document.getElementById('statsRespectDirectionToggle').checked = S.respectDirection;
      installMetricScopeWrappers();
      applyMetricsScope();
      setTimeout(() => updateScopeToggles(S.currentStatsView), 0);
      
      const scopeToggle = document.getElementById('statsScopeToggle');   // C3
      if (scopeToggle) scopeToggle.checked = (S.metricsScope === 'filtered');
      updateMetricsScopeHint();
      
      const modal = document.getElementById('statsModal');
      modal.classList.add('active');
      S.isStatsModalOpen = true;
      
      // Показываем обзор по умолчанию если ещё не было выбора
      if (!S.currentStatsView) {
        setTimeout(() => {
          const firstItem = document.querySelector('.stats-nav-item');
          if (firstItem) {
            firstItem.click();
          }
        }, 100);
      } else {
        // Восстанавливаем последний просмотр
        loadStatsContent(S.currentStatsView);
        updateActiveNavItem(S.currentStatsView);
      }
      
      console.log('📊 Модальное окно статистики открыто');
    }

function closeStatsModal() {
      // Возврат к живым массивам. Восстанавливать нечего: база не менялась,
      // менялась только копия, которую читали метрики.
      S.metricsLinkSource = null;
      S.metricsNodeSource = null;
      S.metricsScopeActive = false;
      S.lastScopeKey = null;
      // То же, что в unfreezeSimulation: окно статистики закрылось,
      // граф снова виден.
      if (typeof ensureAnimLoop === 'function'
        && typeof needsContinuousAnimation === 'function'
        && needsContinuousAnimation()) {
        ensureAnimLoop();
      }
      initializePhilosophyMetrics();
      invalidateGraphCache();
      // ИМЕННО invalidateEverythingForScope, а не invalidateAllMetricsCaches:
      // восьми путевых кэшей (PageRank, Betweenness, Closeness, Eigenvector,
      // Clustering, WeightedClustering, LocalCohesion, RichClub) во второй
      // НЕТ. Из-за этого после смены галочки вид показывал прежнюю таблицу
      // из старого кэша — ни пересчёта, ни кнопки «Рассчитать».
      invalidateEverythingForScope();

      const modal = document.getElementById('statsModal');
      modal.classList.remove('active');
      S.isStatsModalOpen = false;
      console.log('📊 Модальное окно статистики закрыто');

      unfreezeSimulation();
    }

function handleStatsParameterChange() {
      const newWeights = document.getElementById('statsUseWeightsToggle').checked;
      const newDirection = document.getElementById('statsRespectDirectionToggle').checked;
      
      // Обновляем глобальные переменные
      S.useWeightedPaths = newWeights;
      S.respectDirection = newDirection;
      
      // Обновляем основные переключатели в легенде (если есть)
      const mainWeightsToggle = document.getElementById('useWeightsToggle');
      const mainDirectionToggle = document.getElementById('respectDirectionToggle');
      if (mainWeightsToggle) mainWeightsToggle.checked = newWeights;
      if (mainDirectionToggle) mainDirectionToggle.checked = newDirection;
      
      // Учёт переносится в ДАННЫЕ: метрики переводятся на копию
      // либо возвращаются к живым массивам. Формулы не трогаются.
      applyMetricsScope();
      
      // Если визуализация активна, сбрасываем её
      if (window.isVisualizingBySize) {
        resetNodeSizes();
      }
      
      console.log('⚙️ Параметры изменены: веса =', newWeights, ', направленность =', newDirection);
      
      // Перезагружаем текущий контент с новыми параметрами
      if (S.currentStatsView) {
        loadStatsContent(S.currentStatsView);
        updateScopeToggles(S.currentStatsView);
      }
    }

function switchStatsView(viewName, event) {
      // Подсветку ставим ПО ИМЕНИ ВИДА, а не по событию: пункты зовут
      // switchStatsView('имя') без второго довода, и параметр event
      // всегда undefined.
      updateActiveNavItem(viewName);
      
      S.currentStatsView = viewName;
      // Область учёта зависит от вида: у метрик, объявленных
      // неприменимыми к галочке, данные остаются непреобразованными.
      applyMetricsScope(viewName);
      loadStatsContent(viewName);
      updateScopeToggles(viewName);
      
      console.log('📊 Переключение на метрику:', viewName);
    }

function updateActiveNavItem(viewName) {
      // Имя вида берётся из СОБСТВЕННОГО признака вкладки, а не из текста её
      // обработчика: разбирать onclick — значит намертво привязать разметку к
      // способу навешивания. При делегировании атрибута onclick нет вовсе, и
      // выбранная вкладка переставала подсвечиваться.
      document.querySelectorAll('.stats-nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === viewName) item.classList.add('active');
      });
    }

function loadStatsContent(viewName) {
      const contentArea = document.getElementById('statsContentArea');
      let content = '';
      
      // Определяем функцию генератора для каждой метрики
      const generators = {
        'overview': generateOverviewContent,
        'degree': generateDegreeContent,
        'pagerank': generatePageRankContent,
        'betweenness': generateBetweennessContent,
        'closeness': generateClosenessContent,
        'eigenvector': generateEigenvectorContent,
        'weighted-clustering': generateWeightedClusteringContent,
        'local-cohesion': generateLocalCohesionContent,
        'rich-club': generateRichClubContent,
        'problem-generation': generateProblemGenerationContent,
        'critical-power': generateCriticalPowerContent,
        'revolutionary': generateRevolutionaryContent,
        'paradigm-shift': generateParadigmShiftContent,
        'influence': generateInfluenceContent,
        'foundational': generateFoundationalContent,
        'synthetic': generateSyntheticContent,
        'dialogical': generateDialogicalContent,
        'coherence': generateCoherenceContent,
        'tension': generateTensionContent,
        'transformation': generateTransformationContent,
        'fertility': generateFertilityContent,
        'complexity': generateComplexityContent,
        'continuity': generateContinuityContent,
        'comparison': generateComparisonContent,
        'closest-pairs': generateClosestPairsContent,
        'philosopher-comparison': generatePhilosopherComparisonContent,
        'philosopher-pairs': generatePhilosopherPairsContent,
        'generative': generateGenerativeContent,
        'instrumental': generateInstrumentalContent,
        'bridging': generateBridgingContent,
        'abstraction': generateAbstractionContent,
        'deductive': generateDeductiveContent,
        'temporal-influence': generateTemporalInfluenceContent,
        'philosopher-profile': generatePhilosopherProfileContent,
        'philosopher-systematic': generatePhilosopherSystematicContent,
        'philosopher-reach': generatePhilosopherReachContent,
        'philosopher-interdisciplinary': generatePhilosopherInterdisciplinaryContent,
        'concept-rankings': generateConceptRankingsContent,
        'philosopher-rankings': generatePhilosopherRankingsContent
      };
      
      const generator = generators[viewName];
      if (generator) {
        content = generator();
      } else {
        content = `
          <div class="empty-state">
            <div class="empty-state-icon">🚧</div>
            <div class="empty-state-text">Метрика в разработке</div>
            <div class="empty-state-hint">Эта метрика будет добавлена в следующей версии</div>
          </div>
        `;
      }
      
      contentArea.innerHTML = content;
      applyMetricLayout();
      if (typeof renderComparison === 'function' && document.getElementById('cmpBody')) renderComparison();
      if (typeof renderClosestPairs === 'function' && document.getElementById('pairsBody')) renderClosestPairs();
      if (typeof renderPhilosopherComparison === 'function' && document.getElementById('pcmpBody')) renderPhilosopherComparison();
      if (typeof renderPhilosopherPairs === 'function' && document.getElementById('philPairsBody')) renderPhilosopherPairs();
      contentArea.scrollTop = 0; // Скроллим наверх при смене контента
    }

export { closeStatsModal, handleStatsParameterChange, loadStatsContent, openStatsModal, switchStatsView, updateActiveNavItem };
