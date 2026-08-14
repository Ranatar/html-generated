// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, MET, S } from '../core/ns.js';
import { betweennessCache, closenessCache, eigenvectorCache, localCohesionCache, pageRankCache, richClubCache, weightedClusteringCache } from '../metrics/network.js';
import { updateArrows } from './d3-layer.js';
import { closeStatsModal } from '../stats/modal.js';

let originalRadii = new Map();

let originalTextDy = new Map();

function updateVisualizationControlSection() {
      const section = document.getElementById('visualizationControlSection');
      const metricLabel = document.getElementById('currentVisualizationMetric');
      
      if (!section) return; // Если секции нет в HTML
      
      if (S.isVisualizingBySize && S.currentVisualizedMetric) {
        section.style.display = 'block';
        if (metricLabel) {
          // Получаем читаемое имя метрики
          const metricNames = {
            'pagerank': 'PageRank',
            'betweenness': 'Betweenness',
            'closeness': 'Closeness',
            'eigenvector': 'Eigenvector',
            'degree': 'Степень связности',
            'weighted-clustering': 'Взвешенная кластеризация',
            'local-cohesion': 'Локальная когезия',
            'rich-club': 'Rich-Club',
            'problem-generation': 'Индекс проблемности',
            'critical-power': 'Критическая сила',
            'revolutionary': 'Индекс революционности',
            'paradigm-shift': 'Парадигмальный сдвиг',
            'influence': 'Индекс влияния',
            'foundational': 'Индекс основополагания',
            'synthetic': 'Индекс синтетичности',
            'dialogical': 'Индекс диалогичности',
            'coherence': 'Внутренняя когерентность',
            'tension': 'Индекс напряжения',
            'transformation': 'Индекс трансформации',
            'fertility': 'Концептуальная плодовитость',
            'complexity': 'Концептуальная сложность',
            'continuity': 'Индекс преемственности'
          };
          metricLabel.textContent = metricNames[S.currentVisualizedMetric] || S.currentVisualizedMetric;
        }
      } else {
        section.style.display = 'none';
      }
    }

function saveOriginalRadii() {
      if (originalRadii.size === 0) {
        // Фаза 3: радиус и dy больше не читаются из DOM — это константы
        DATA.nodes.forEach(d => {
          originalRadii.set(d.id, 18);
          originalTextDy.set(d.id, -25);
        });
        
        console.log(`💾 Сохранены исходные параметры для ${originalRadii.size} узлов`);
      }
    }

function toggleMetricVisualization(metricKey) {
      if (S.isVisualizingBySize && S.currentVisualizedMetric === metricKey) {
        // Если уже визуализируем эту метрику - сбрасываем
        resetNodeSizes();
        return;
      }

      if (S.isStatsModalOpen) {
        closeStatsModal();
        console.log('🔽 Модальное окно закрыто для визуализации');
      }
      
      // Получаем данные метрики
      let metricData = null;
      
      switch(metricKey) {
        case 'degree':
          metricData = DATA.nodes.map(n => {
            const inDegree = DATA.links.filter(l => 
              (typeof l.target === 'object' ? l.target.id : l.target) === n.id
            ).length;
            const outDegree = DATA.links.filter(l => 
              (typeof l.source === 'object' ? l.source.id : l.source) === n.id
            ).length;
            return {
              node: n,
              value: inDegree + outDegree
            };
          });
          break;
          
        case 'pagerank':
          metricData = pageRankCache;
          break;
          
        case 'betweenness':
          metricData = betweennessCache;
          break;
          
        case 'closeness':
          metricData = closenessCache;
          break;
          
        case 'eigenvector':
          metricData = eigenvectorCache;
          break;
          
        case 'weighted-clustering':
          metricData = weightedClusteringCache;
          break;
          
        case 'local-cohesion':
          metricData = localCohesionCache;
          break;
          
        case 'rich-club':
          metricData = richClubCache;
          break;
          
        // Философские метрики
        case 'problem-generation':
        case 'critical-power':
        case 'revolutionary':
        case 'paradigm-shift':
        case 'influence':
        case 'foundational':
        case 'synthetic':
        case 'dialogical':
        case 'coherence':
        case 'tension':
        case 'transformation':
        case 'fertility':
        case 'complexity':
        case 'continuity':
        case 'generative':
        case 'instrumental':
        case 'bridging':
        case 'abstraction':
        case 'deductive':
          if (!DATA.concepts || !DATA.relations) {
            alert('Сначала инициализируйте философские метрики');
            return;
          }
          
          const metricFunctions = {
            'problem-generation': 'problemGenerationIndex',
            'critical-power': 'criticalPowerIndex',
            'revolutionary': 'revolutionaryIndex',
            'paradigm-shift': 'paradigmShiftIndex',
            'influence': 'influenceIndex',
            'foundational': 'foundationalIndex',
            'synthetic': 'syntheticIndex',
            'dialogical': 'dialogicalIndex',
            'coherence': 'internalCoherenceIndex',
            'tension': 'tensionIndex',
            'transformation': 'transformationIndex',
            'fertility': 'conceptualFertilityIndex',
            'complexity': 'conceptualComplexityIndex',
            'continuity': 'conceptualContinuityIndex',
            'generative': 'generativeIndex',
            'instrumental': 'instrumentalIndex',
            'abstraction': 'abstractionIndex',
            'deductive': 'deductiveIndex'
          };
          
          const funcName = metricFunctions[metricKey];
          // Теперь все функции глобальные, не нужен metricsObj
          
          if (funcName /*&& metricsObj*/) {
            // В2: было два вызова метрики на каждый узел вместо одного.
            // После М5.2 поля weighted больше нет — читаем только total.
            metricData = DATA.nodes.map(n => {
              const m = MET[funcName](n.id);
              return { node: n, value: (m && m.total) || 0 };
            }).filter(d => d.value > 0);
          }
          break;
      }
      
      if (!metricData || metricData.length === 0) {
        alert('Нет данных для визуализации. Сначала рассчитайте метрику.');
        return;
      }
      
      visualizeMetricBySize(metricData, metricKey);
    }

function updateVisualizationButtonText(metricKey) {
      const iconElement = document.getElementById(`visualize-icon-${metricKey}`);
      const textElement = document.getElementById(`visualize-text-${metricKey}`);
      
      if (!iconElement || !textElement) return;
      
      if (S.isVisualizingBySize && S.currentVisualizedMetric === metricKey) {
        // Визуализация активна
        iconElement.textContent = '🔄';
        textElement.textContent = 'Сбросить визуализацию';
      } else {
        // Визуализация неактивна
        iconElement.textContent = '📏';
        textElement.textContent = 'Визуализировать размером';
      }
    }

function visualizeMetricBySize(metricData, metricName) {
      updateVisualizationControlSection();
      saveOriginalRadii();
      
      // Создаём мапу значений
      const valueMap = new Map();
      metricData.forEach(item => {
        valueMap.set(item.node.id, item.value);
      });
      
      // Находим min и max
      const values = Array.from(valueMap.values()).filter(v => v > 0);
      if (values.length === 0) return;
      
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      
      // Вычисляем статистику для определения дисперсии
      const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
      const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      const coefficientOfVariation = stdDev / mean; // Коэффициент вариации

      console.log(`📊 Статистика метрики "${metricName}":`, {
        min: minValue.toFixed(4),
        max: maxValue.toFixed(4),
        mean: mean.toFixed(4),
        stdDev: stdDev.toFixed(4),
        cv: coefficientOfVariation.toFixed(4)
      });

      // Масштабируем радиусы от 8 до 40
      const minRadius = 8;
      const maxRadius = 40;

      // Функция масштабирования с адаптацией к дисперсии
      const scaleRadius = (value) => {
        if (maxValue === minValue) return 18;
        
        // Нормализуем значение в диапазон [0, 1]
        const normalized = (value - minValue) / (maxValue - minValue);
        
        // Выбираем стратегию масштабирования в зависимости от коэффициента вариации
        let scaled;
        
        if (coefficientOfVariation < 0.2) {
          // МАЛАЯ ДИСПЕРСИЯ: используем степенное усиление контраста
          // Усиливаем различия между значениями
          const power = 2.5; // Увеличиваем контраст
          scaled = Math.pow(normalized, 1 / power); // Обратная степень для усиления малых различий
          
          console.log(`🔍 Малая дисперсия (CV=${coefficientOfVariation.toFixed(3)}), применяем степенное усиление`);
        } else if (coefficientOfVariation > 1.5) {
          // БОЛЬШАЯ ДИСПЕРСИЯ: используем логарифмическое сжатие
          // Сжимаем большие различия для лучшей читаемости
          const logBase = 10;
          scaled = Math.log(1 + normalized * (logBase - 1)) / Math.log(logBase);
          
          console.log(`📉 Большая дисперсия (CV=${coefficientOfVariation.toFixed(3)}), применяем логарифмическое сжатие`);
        } else {
          // СРЕДНЯЯ ДИСПЕРСИЯ: используем слегка усиленное линейное масштабирование
          const power = 1.5;
          scaled = Math.pow(normalized, 1 / power);
          
          console.log(`📊 Средняя дисперсия (CV=${coefficientOfVariation.toFixed(3)}), применяем умеренное усиление`);
        }
        
        return minRadius + scaled * (maxRadius - minRadius);
      };
      
      // Применяем новые радиусы
      S.gfxNode.selectAll("circle")
        .transition()
        .duration(500)
        .attr("r", d => {
          const value = valueMap.get(d.id) || 0;
          return value > 0 ? scaleRadius(value) : 8;
        });
      
      // Обновляем позицию текста
      S.gfxNode.selectAll("text")
        .transition()
        .duration(500)
        .attr("dy", d => {
          const value = valueMap.get(d.id) || 0;
          const radius = value > 0 ? scaleRadius(value) : 8;
          return -(radius + 7);
        });
      
      // Ф0.4: вместо персонального маркера на каждое ребро в defs — режим геометрии стрелок
      S.arrowMode = 'metric';
      S.arrowRadius = new Map(DATA.nodes.map(n => {
        const v = valueMap.get(n.id) || 0;
        return [n.id, v > 0 ? scaleRadius(v) : 8];
      }));
      updateArrows();
      
      S.isVisualizingBySize = true;
      S.currentVisualizedMetric = metricName;

      updateVisualizationButtonText(metricName);
      
      console.log(`✅ Визуализация метрики "${metricName}" размером узлов активирована`);
    }

function resetNodeSizes() {

      updateVisualizationControlSection();

      if (!S.isVisualizingBySize) return;

      const oldMetric = S.currentVisualizedMetric;
      
      S.isVisualizingBySize = false;
      S.currentVisualizedMetric = null;
      
      // Восстановить радиусы
      S.gfxNode.selectAll("circle")
        .transition()
        .duration(500)
        .attr("r", d => originalRadii.get(d.id) || 18);
      
      // Восстановить позицию текста (используем сохраненные значения)
      S.gfxNode.selectAll("text")
        .transition()
        .duration(500)
        .attr("dy", d => {
          const originalDy = originalTextDy.get(d.id) || -25;
          return originalDy;
        });
      
      // Ф0.4: возврат к базовой геометрии стрелок
      // (заодно снят Б13 — удаление маркеров эвристикой по числу дефисов в id)
      S.arrowMode = 'default';
      S.arrowRadius = null;
      updateArrows();

      if (oldMetric) {
        updateVisualizationButtonText(oldMetric);
      }
      
      console.log('✅ Оригинальные размеры узлов восстановлены');
    }

export { originalRadii, originalTextDy, resetNodeSizes, saveOriginalRadii, toggleMetricVisualization, updateVisualizationButtonText, updateVisualizationControlSection, visualizeMetricBySize };
