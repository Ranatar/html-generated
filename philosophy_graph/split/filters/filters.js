// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { известить } from '../core/events.js';
import { CHAIN_SEARCH, LoadingIndicator, showTemporaryMessage } from '../core/long-task.js';
import { isLinkVisible, isNodeVisible } from '../core/visibility.js';
import { confirmLongChainSearch, findChainsThroughAllPhilosophers, findUniquePhilosopherChains } from './chains.js';
import { initializePhilosophyMetrics } from '../metrics/link-indexes.js';
import { invalidateEverythingForScope } from '../metrics/scope-reset.js';
import { updateMetricsScopeHint } from '../metrics/scope.js';
import { gfxLinkAll, gfxNode } from '../render/d3-layer.js';
import { highlightConnected, resetHighlight } from '../render/selection.js';
import { pinnedVisibleNodes, показанныеВопрекиОтбору } from '../state/filters.js';
import { selectedNodes } from '../state/render.js';

function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

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

const FilterModes = {
      all: {
        name: 'Только выбранные философы',
        linkFilter: (l) => {
          // Проверка типа связи и философов
          const baseCheck = S.selectedRelations.has(l.type) &&
                   S.selectedPhilosophers.has(l.source.concept) &&
                   S.selectedPhilosophers.has(l.target.concept);
          
          if (!baseCheck) return false;

          if (!linkPassesTraditions(l, true)) return false;
          
          // Проверка рубрик
          const sourceId = l.source.id || l.source;
          const targetId = l.target.id || l.target;
          const sourceRubrics = DATA.conceptToRubrics[sourceId] || [];
          const targetRubrics = DATA.conceptToRubrics[targetId] || [];
          
          // Связь видна, если хотя бы одна рубрика source или target выбрана
          const sourceHasSelectedRubric = sourceRubrics.length === 0 || 
                           sourceRubrics.some(r => S.selectedRubrics.has(r));
          const targetHasSelectedRubric = targetRubrics.length === 0 || 
                           targetRubrics.some(r => S.selectedRubrics.has(r));
          
          return sourceHasSelectedRubric && targetHasSelectedRubric;
        }
      },
      internal: {
        name: 'Только внутренние связи',
        linkFilter: (l) => {
          // Проверка типа связи, философов и внутренней связи
          const baseCheck = S.selectedRelations.has(l.type) &&
                   S.selectedPhilosophers.has(l.source.concept) &&
                   S.selectedPhilosophers.has(l.target.concept) &&
                   l.source.concept === l.target.concept;
          
          if (!baseCheck) return false;

          if (!linkPassesTraditions(l, true)) return false;
          
          // Проверка рубрик
          const sourceId = l.source.id || l.source;
          const targetId = l.target.id || l.target;
          const sourceRubrics = DATA.conceptToRubrics[sourceId] || [];
          const targetRubrics = DATA.conceptToRubrics[targetId] || [];
          
          const sourceHasSelectedRubric = sourceRubrics.length === 0 || 
                           sourceRubrics.some(r => S.selectedRubrics.has(r));
          const targetHasSelectedRubric = targetRubrics.length === 0 || 
                           targetRubrics.some(r => S.selectedRubrics.has(r));
          
          return sourceHasSelectedRubric && targetHasSelectedRubric;
        }
      },
      context: {
        name: 'С соседними узлами',
        linkFilter: (l) => {
          // Проверка типа связи и хотя бы одного философа
          const baseCheck = S.selectedRelations.has(l.type) &&
                   (S.selectedPhilosophers.has(l.source.concept) ||
                    S.selectedPhilosophers.has(l.target.concept));
          
          if (!baseCheck) return false;

          if (!linkPassesTraditions(l, false)) return false;
          
          // Проверка рубрик
          const sourceId = l.source.id || l.source;
          const targetId = l.target.id || l.target;
          const sourceRubrics = DATA.conceptToRubrics[sourceId] || [];
          const targetRubrics = DATA.conceptToRubrics[targetId] || [];
          
          const sourceHasSelectedRubric = sourceRubrics.length === 0 || 
                           sourceRubrics.some(r => S.selectedRubrics.has(r));
          const targetHasSelectedRubric = targetRubrics.length === 0 || 
                           targetRubrics.some(r => S.selectedRubrics.has(r));
          
          return sourceHasSelectedRubric && targetHasSelectedRubric;
        }
      },
      external: {
        name: 'Только внешние связи',
        linkFilter: (l) => {
          // Проверка типа связи, философов и внешней связи
          const baseCheck = S.selectedRelations.has(l.type) &&
                   (S.selectedPhilosophers.has(l.source.concept) ||
                    S.selectedPhilosophers.has(l.target.concept)) &&
                   l.source.concept !== l.target.concept;
          
          if (!baseCheck) return false;

          if (!linkPassesTraditions(l, false)) return false;
          
          // Проверка рубрик
          const sourceId = l.source.id || l.source;
          const targetId = l.target.id || l.target;
          const sourceRubrics = DATA.conceptToRubrics[sourceId] || [];
          const targetRubrics = DATA.conceptToRubrics[targetId] || [];
          
          const sourceHasSelectedRubric = sourceRubrics.length === 0 || 
                           sourceRubrics.some(r => S.selectedRubrics.has(r));
          const targetHasSelectedRubric = targetRubrics.length === 0 || 
                           targetRubrics.some(r => S.selectedRubrics.has(r));
          
          return sourceHasSelectedRubric && targetHasSelectedRubric;
        }
      },
      within_traditions: {
        name: 'Только внутри выбранных традиций',
        linkFilter: (l) => {
          if (!S.selectedRelations.has(l.type)) return false;
          if (!S.selectedPhilosophers.has(l.source.concept)) return false;
          if (!S.selectedPhilosophers.has(l.target.concept)) return false;
          if (l.source.concept === l.target.concept) return false;
          const s = philTraditionsSelected(l.source.concept);
          const t = philTraditionsSelected(l.target.concept);
          if (!s.some(x => t.includes(x))) return false;
          const sr = DATA.conceptToRubrics[l.source.id || l.source] || [];
          const tr = DATA.conceptToRubrics[l.target.id || l.target] || [];
          return (sr.length === 0 || sr.some(r => S.selectedRubrics.has(r)))
              && (tr.length === 0 || tr.some(r => S.selectedRubrics.has(r)));
        }
      },
      between_traditions: {
        name: 'Только между выбранными традициями',
        linkFilter: (l) => {
          if (!S.selectedRelations.has(l.type)) return false;
          if (!S.selectedPhilosophers.has(l.source.concept)) return false;
          if (!S.selectedPhilosophers.has(l.target.concept)) return false;
          if (l.source.concept === l.target.concept) return false;
          const s = philTraditionsSelected(l.source.concept);
          const t = philTraditionsSelected(l.target.concept);
          if (!s.length || !t.length) return false;
          if (s.some(x => t.includes(x))) return false;
          const sr = DATA.conceptToRubrics[l.source.id || l.source] || [];
          const tr = DATA.conceptToRubrics[l.target.id || l.target] || [];
          return (sr.length === 0 || sr.some(r => S.selectedRubrics.has(r)))
              && (tr.length === 0 || tr.some(r => S.selectedRubrics.has(r)));
        }
      },
      cross_selected: {
        name: 'Межфилософские связи выбранных',
        linkFilter: (l) => {
          // Проверка типа связи, философов и межфилософской связи
          const isDifferent = S.selectedPhilosophers.size === 1 || 
                     l.source.concept !== l.target.concept;
          const baseCheck = S.selectedRelations.has(l.type) &&
                   S.selectedPhilosophers.has(l.source.concept) &&
                   S.selectedPhilosophers.has(l.target.concept) &&
                   isDifferent;
          
          if (!baseCheck) return false;

          if (!linkPassesTraditions(l, true)) return false;
          
          // Проверка рубрик
          const sourceId = l.source.id || l.source;
          const targetId = l.target.id || l.target;
          const sourceRubrics = DATA.conceptToRubrics[sourceId] || [];
          const targetRubrics = DATA.conceptToRubrics[targetId] || [];
          
          const sourceHasSelectedRubric = sourceRubrics.length === 0 || 
                           sourceRubrics.some(r => S.selectedRubrics.has(r));
          const targetHasSelectedRubric = targetRubrics.length === 0 || 
                           targetRubrics.some(r => S.selectedRubrics.has(r));
          
          return sourceHasSelectedRubric && targetHasSelectedRubric;
        }
      }
    };

function applyBasicFilter(mode) {
      const config = FilterModes[mode];
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
          // Показанное ВОПРЕКИ ОТБОРУ держится, пока его не снимут: у такой
          // концепции связи есть, и прежнее правило («есть связи — снять
          // закрепление») её тут же отпускало, а поиск получал подсветку
          // вокруг пустого места.
          if (показанныеВопрекиОтбору.has(id)) { visibleNodes.add(id); return; }
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
        if (!sourceVisible || !targetVisible) return false;
        // Показанная ВОПРЕКИ ОТБОРУ концепция должна быть видна со своими
        // связями: отбор для неё уже отменён, а связи оставались скрытыми —
        // концепция висела в пустоте, хотя соседи рядом. Показываем связь,
        // если один её конец показан поверх отбора, а другой и так виден.
        const a = l.source.id || l.source, b = l.target.id || l.target;
        if (показанныеВопрекиОтбору.has(a) || показанныеВопрекиОтбору.has(b)) return true;
        return config.linkFilter(l);
      }));

      // Применяем видимость к узлам и связям (базовый фильтр)
      gfxNode.style("display", d => isNodeVisible(d) ? null : "none");
      gfxLinkAll.style("display", l => isLinkVisible(l) ? null : "none");
    }

function applyChainVisibility(chainNodes, chainLinks) {
      // Б11: видимость цепочек — тоже в JS-состоянии
      S.visibleNodeIds = chainNodes;
      S.visibleLinkSet = chainLinks;
      gfxNode.style("display", d => isNodeVisible(d) ? null : "none");
      gfxLinkAll.style("display", l => isLinkVisible(l) ? null : "none");
    }

async function handleChainsMode() {
      if (S.selectedPhilosophers.size === 1 || S.selectedPhilosophers.size === 2) {
        // Быстрый синхронный режим для 1-2 философов
        const { nodes: chainNodes, links: chainLinks } = 
          await findChainsThroughAllPhilosophers(S.selectedPhilosophers);
        applyChainVisibility(chainNodes, chainLinks);
        известить('фильтры-применены');
      } else {
        // F2: предупреждение при большом выборе
        if (!confirmLongChainSearch(S.selectedPhilosophers.size)) {
          S.filterMode = 'all';
          const sel = document.getElementById('filterMode');
          if (sel) sel.value = 'all';
          applyBasicFilter('all');
          известить('фильтры-применены');
          return;
        }
        // Асинхронный режим с прогрессом для 3+ философов
        const indicator = LoadingIndicator.create(
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
            известить('фильтры-применены');
            
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
        известить('фильтры-применены');
        return;
      }
      
      if (S.selectedPhilosophers.size === 2) {
        // Для 2 философов - как cross_selected
        applyBasicFilter('cross_selected');
        известить('фильтры-применены');
        return;
      }
      
      // F2: предупреждение при большом выборе
      if (!confirmLongChainSearch(S.selectedPhilosophers.size)) {
        S.filterMode = 'all';
        const sel = document.getElementById('filterMode');
        if (sel) sel.value = 'all';
        applyBasicFilter('all');
        известить('фильтры-применены');
        return;
      }
      
      // Для 3+ философов - поиск уникальных цепочек с прогрессом
      const indicator = LoadingIndicator.create(
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
          известить('фильтры-применены');
          
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
      известить('статистика-устарела');
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
      
      // Общая пост-обработка: фильтры не зовут легенду напрямую — они
      // извещают, а подписку ставит сборка (см. шину событий).
      известить('фильтры-применены');
      cleanupInvisibleSelections();
      refreshMetricsIfScoped();   // C3
    }

const debouncedApplyFilters = debounce(applyFiltersImmediate, 150);

function applyFilters() { debouncedApplyFilters(); }

export { FilterModes, applyBasicFilter, applyChainVisibility, applyFilters, applyFiltersImmediate, cleanupInvisibleSelections, debounce, debouncedApplyFilters, handleChainsMode, handleUniqueChainsMode, linkPassesTraditions, philTraditionsSelected, philosopherPassesTraditions, refreshMetricsIfScoped };
