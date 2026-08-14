// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { isLinkVisible, isNodeVisible } from '../core/visibility.js';
import { pinnedVisibleNodes } from '../data/mutate.js';
import { CHAIN_SEARCH, confirmLongChainSearch, findChainsThroughAllPhilosophers, findUniquePhilosopherChains } from './chains.js';
import { initializePhilosophyMetrics } from '../metrics/init.js';
import { invalidateEverythingForScope, updateMetricsScopeHint } from '../metrics/scope.js';
import { highlightConnected, resetHighlight } from '../render/selection.js';
import { selectedNodes } from '../state.js';
import { loadStatsContent } from '../stats/modal.js';
import { showTemporaryMessage } from '../ui/feedback.js';
import { updateFilterStats, updatePhilosopherDimming } from '../ui/legend.js';
import { debounce } from '../util/misc.js';

function philTraditionsSelected(name) {
      const tl = DATA.philosopherTraditions[name] || [];
      return tl.filter(t => S.selectedTraditions.has(t));
    }

function philosopherPassesTraditions(name) {
      const tl = DATA.philosopherTraditions[name] || [];
      // Философ без традиций проходит всегда — иначе он исчезает молча.
      return tl.length === 0 || tl.some(t => S.selectedTraditions.has(t));
    }

function linkPassesTraditions(l, both) {
      const s = philosopherPassesTraditions(l.source.concept);
      const t = philosopherPassesTraditions(l.target.concept);
      return both ? (s && t) : (s || t);
    }

function applyBasicFilter(mode) {
      const config = S.FilterModes[mode];
      if (!config) return;
      
      const allRelationsSelected = S.selectedRelations.size === Object.keys(DATA.relationTypesObj).length;
      
      // Фильтруем связи по правилам режима
      const validLinks = DATA.links.filter(config.linkFilter);
      
      // Собираем видимые узлы из валидных связей
      const visibleNodes = new Set();
      validLinks.forEach(l => {
        visibleNodes.add(l.source.id || l.source);
        visibleNodes.add(l.target.id || l.target);
      });
      
      // Отдельно — свежесозданные узлы без связей: видимые узлы
      // собираются из концов связей, а у только что созданной концепции
      // связей ещё нет, и она исчезала бы с экрана в тот же миг.
      if (typeof pinnedVisibleNodes !== 'undefined') {
        Array.from(pinnedVisibleNodes).forEach(id => {
          const linked = DATA.links.some(l => (l.source.id || l.source) === id
                        || (l.target.id || l.target) === id);
          if (linked) pinnedVisibleNodes.delete(id);
          else visibleNodes.add(id);
        });
      }

      // Б11: фиксируем видимость в JS-состоянии
      S.visibleNodeIds = visibleNodes;
      S.visibleLinkSet = new Set(DATA.links.filter(l => {
        const sourceVisible = visibleNodes.has(l.source.id || l.source);
        const targetVisible = visibleNodes.has(l.target.id || l.target);
        return config.linkFilter(l) && sourceVisible && targetVisible;
      }));

      // Применяем видимость к узлам и связям (базовый фильтр)
      S.gfxNode.style("display", d => isNodeVisible(d) ? null : "none");
      S.gfxLinkAll.style("display", l => isLinkVisible(l) ? null : "none");
    }

function applyChainVisibility(chainNodes, chainLinks) {
      // Б11: видимость цепочек — тоже в JS-состоянии
      S.visibleNodeIds = chainNodes;
      S.visibleLinkSet = chainLinks;
      S.gfxNode.style("display", d => isNodeVisible(d) ? null : "none");
      S.gfxLinkAll.style("display", l => isLinkVisible(l) ? null : "none");
    }

async function handleChainsMode() {
      if (S.selectedPhilosophers.size === 1 || S.selectedPhilosophers.size === 2) {
        // Быстрый синхронный режим для 1-2 философов
        const { nodes: chainNodes, links: chainLinks } = 
          await findChainsThroughAllPhilosophers(S.selectedPhilosophers);
        applyChainVisibility(chainNodes, chainLinks);
        updateFilterStats();
      } else {
        // F2: предупреждение при большом выборе
        if (!confirmLongChainSearch(S.selectedPhilosophers.size)) {
          S.filterMode = 'all';
          const sel = document.getElementById('filterMode');
          if (sel) sel.value = 'all';
          applyBasicFilter('all');
          updateFilterStats();
          return;
        }
        // Асинхронный режим с прогрессом для 3+ философов
        const indicator = S.LoadingIndicator.create(
          ' Поиск сквозных цепочек',
          `Анализ связей между ${S.selectedPhilosophers.size} философами`
        );
        
        // F5: работа вынесена из setTimeout в честный промис — прежде
        // функция была объявлена async, но возвращала управление до
        // начала расчёта, и await на ней ничего не гарантировал.
        await new Promise(resolve => setTimeout(resolve, 50));
        await (async () => {
          try {
            const { nodes: chainNodes, links: chainLinks } = 
              await findChainsThroughAllPhilosophers(
                S.selectedPhilosophers, 
                (progress) => indicator.updateProgress(progress)
              );
            
            applyChainVisibility(chainNodes, chainLinks);
            indicator.remove();
            updateFilterStats();
            
            if (chainNodes.size === 0) {
              // F3: три разных исхода различаются явно
              if (CHAIN_SEARCH.cancelled) {
                showTemporaryMessage('⏹ Поиск прерван. Найденное — неполно, ответ неизвестен.');
              } else if (CHAIN_SEARCH.aborted) {
                showTemporaryMessage(`⏱ Поиск остановлен по пределу времени (${CHAIN_SEARCH.timeBudgetMs / 1000} с, раскрыто ${CHAIN_SEARCH.expanded.toLocaleString('ru')} состояний). Цепочки могут существовать — выберите меньше философов.`);
              } else {
                // Быстрая стратегия отсечения неполна, поэтому
                // пустой результат здесь — не доказательство
                showTemporaryMessage(`⚠️ Цепочек через все ${S.selectedPhilosophers.size} выбранных систем быстрым поиском не найдено. Поиск неполон по устройству: он может пропускать решения. Попробуйте выбрать меньше философов.`);
              }
            }
          } catch (error) {
            console.error('Ошибка при поиске цепочек:', error);
            indicator.remove();
            showTemporaryMessage('❌ Ошибка при поиске цепочек');
          }
        })();
      }
    }

async function handleUniqueChainsMode() {
      if (S.selectedPhilosophers.size === 1) {
        // Для 1 философа - показываем внутренние связи
        applyBasicFilter('internal');
        updateFilterStats();
        return;
      }
      
      if (S.selectedPhilosophers.size === 2) {
        // Для 2 философов - как cross_selected
        applyBasicFilter('cross_selected');
        updateFilterStats();
        return;
      }
      
      // F2: предупреждение при большом выборе
      if (!confirmLongChainSearch(S.selectedPhilosophers.size)) {
        S.filterMode = 'all';
        const sel = document.getElementById('filterMode');
        if (sel) sel.value = 'all';
        applyBasicFilter('all');
        updateFilterStats();
        return;
      }
      
      // Для 3+ философов - поиск уникальных цепочек с прогрессом
      const indicator = S.LoadingIndicator.create(
        '⚡ Поиск уникальных цепочек',
        `Однократное участие каждого из ${S.selectedPhilosophers.size} философов`,
        '#9b59b6'
      );
      
      // F5: честный await вместо setTimeout с промисом, разрешающимся сразу
      await new Promise(resolve => setTimeout(resolve, 50));
      await (async () => {
        try {
          const { nodes: chainNodes, links: chainLinks } = 
            await findUniquePhilosopherChains(
              S.selectedPhilosophers,
              (progress) => indicator.updateProgress(progress)
            );
          
          applyChainVisibility(chainNodes, chainLinks);
          indicator.remove();
          updateFilterStats();
          
          if (chainNodes.size === 0) {
            // F3: «нет решения» и «поиск прерван» — разные ответы
            if (CHAIN_SEARCH.cancelled) {
              showTemporaryMessage('⏹ Поиск прерван. Ответ неизвестен: цепочка может существовать.');
            } else if (CHAIN_SEARCH.aborted) {
              showTemporaryMessage(`⏱ Поиск остановлен по пределу времени (${CHAIN_SEARCH.timeBudgetMs / 1000} с, раскрыто ${CHAIN_SEARCH.expanded.toLocaleString('ru')} состояний). Ответ неизвестен — попробуйте выбрать меньше философов.`);
            } else {
              showTemporaryMessage(`⚠️ Цепочки, проходящей через все ${S.selectedPhilosophers.size} выбранных систем ровно по одному разу, не существует. Поиск исчерпан полностью. Уменьшите набор философов.`);
            }
          } else {
            showTemporaryMessage(`✅ Найдено ${chainNodes.size} узлов в уникальных цепочках`, 2000);
          }
        } catch (error) {
          console.error('Ошибка при поиске уникальных цепочек:', error);
          indicator.remove();
          showTemporaryMessage('❌ Ошибка при поиске уникальных цепочек');
        }
      })();
    }

function cleanupInvisibleSelections() {
      // Б11: состояние читается из JS, а не обходом DOM
      selectedNodes.forEach(node => {
        if (!isNodeVisible(node)) {
          selectedNodes.delete(node);
        }
      });

      if (selectedNodes.size === 0) {
        resetHighlight();
      } else {
        highlightConnected(Array.from(selectedNodes));
      }
    }

function refreshMetricsIfScoped() {
      if (S.metricsScope !== 'filtered') return;
      initializePhilosophyMetrics();
      invalidateEverythingForScope();
      updateMetricsScopeHint();
      if (S.isStatsModalOpen && S.currentStatsView) loadStatsContent(S.currentStatsView);
    }

function applyFiltersImmediate() {
      // Специальные режимы с цепочками
      if (S.filterMode === 'chains') {
        handleChainsMode();
        return;
      }
      
      if (S.filterMode === 'unique_chains') {
        handleUniqueChainsMode();
        return;
      }
      
      // Базовые режимы фильтрации
      applyBasicFilter(S.filterMode);
      
      // Общая пост-обработка
      updateFilterStats();
      updatePhilosopherDimming();
      cleanupInvisibleSelections();
      refreshMetricsIfScoped();   // C3
    }

const debouncedApplyFilters = debounce(applyFiltersImmediate, 150);

function applyFilters() { debouncedApplyFilters(); }

export { applyBasicFilter, applyChainVisibility, applyFilters, applyFiltersImmediate, cleanupInvisibleSelections, debouncedApplyFilters, handleChainsMode, handleUniqueChainsMode, linkPassesTraditions, philTraditionsSelected, philosopherPassesTraditions, refreshMetricsIfScoped };
