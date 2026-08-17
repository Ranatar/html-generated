// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, MET, S } from '../core/ns.js';
import { buildGlobalGraphCache } from './graph-cache.js';

let betweennessCache = null;

let betweennessCalculating = false;

async function calculateBetweennessAsync(progressCallback) {
      if (betweennessCache) return betweennessCache;
      if (betweennessCalculating) return null;
      
      betweennessCalculating = true;
      const betweenness = {};
      DATA.nodes.forEach(n => betweenness[n.id] = 0);
      
      // Предварительное построение графа
      const graph = buildGlobalGraphCache();
      
      let processedNodes = 0;
      const totalNodes = DATA.nodes.length;
      
      // Для каждого исходного узла - модифицированный алгоритм Брандеса
      for (let sourceIdx = 0; sourceIdx < DATA.nodes.length; sourceIdx++) {
        const source = DATA.nodes[sourceIdx];
        
        const S = []; // Стек узлов в порядке невозрастающего расстояния
        const P = {}; // Предшественники на кратчайших путях
        const sigma = {}; // Количество кратчайших путей
        const d = {}; // Расстояния
        const delta = {}; // Зависимости
        
        DATA.nodes.forEach(n => {
          P[n.id] = [];
          sigma[n.id] = 0;
          d[n.id] = Infinity;
          delta[n.id] = 0;
        });
        
        sigma[source.id] = 1;
        d[source.id] = 0;
        
        // ✅ УЛУЧШЕНО: Для взвешенных графов используем приоритетную очередь
        if (S.useWeightedPaths) {
          // Алгоритм с приоритетной очередью (модифицированный Дейкстра)
          const pq = [[0, source.id]];
          const visited = new Set();
          
          while (pq.length > 0) {
            pq.sort((a, b) => a[0] - b[0]);
            const [currentDist, v] = pq.shift();
            
            if (visited.has(v)) continue;
            visited.add(v);
            S.push(v);
            
            // Получаем соседей из предпостроенного графа
            let neighbors;
            if (S.respectDirection) {
              neighbors = graph.outNeighbors[v] || [];
            } else {
              neighbors = graph.allNeighbors[v] || [];
            }
            
            neighbors.forEach(({ node: w, distance }) => {
              const weight = distance;
              const newDist = d[v] + weight;
              
              // Путь к w найден впервые или улучшен?
              if (d[w] === Infinity) {
                d[w] = newDist;
                pq.push([newDist, w]);
              }
              
              // Кратчайший путь к w через v?
              if (Math.abs(d[w] - newDist) < 1e-10) {  // Учитываем погрешность float
                sigma[w] += sigma[v];
                P[w].push(v);
              }
            });
          }
        } else {
          // Для невзвешенных графов используем обычный BFS
          const Q = [source.id];
          
          while (Q.length > 0) {
            const v = Q.shift();
            S.push(v);
            
            // Получаем соседей из предпостроенного графа
            let neighbors;
            if (S.respectDirection) {
              neighbors = graph.outNeighbors[v] || [];
            } else {
              neighbors = graph.allNeighbors[v] || [];
            }
            
            neighbors.forEach(({ node: w, distance }) => {
              const weight = 1;  // Для невзвешенного графа
              
              // Путь к w найден впервые?
              if (d[w] === Infinity) {
                Q.push(w);
                d[w] = d[v] + weight;
              }
              
              // Кратчайший путь к w через v?
              if (d[w] === d[v] + weight) {
                sigma[w] += sigma[v];
                P[w].push(v);
              }
            });
          }
        }
        
        // Накопление (обратный проход) - одинаково для обоих случаев
        while (S.length > 0) {
          const w = S.pop();
          P[w].forEach(v => {
            delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
          });
          if (w !== source.id) {
            betweenness[w] += delta[w];
          }
        }
        
        processedNodes++;
        
        // Обновляем прогресс каждые 10 узлов
        if (processedNodes % 10 === 0) {
          if (progressCallback) {
            progressCallback(processedNodes, totalNodes);
          }
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
      
      // Нормализация
      const normFactor = S.respectDirection ? 1.0 : 2.0;
      Object.keys(betweenness).forEach(key => {
        betweenness[key] /= normFactor;
      });
      
      const result = Object.entries(betweenness)
        .map(([id, value]) => ({
          node: DATA.nodes.find(n => n.id === id),
          value: value,
          count: Math.round(value)
        }))
        .sort((a, b) => b.value - a.value);
      
      betweennessCache = result;
      betweennessCalculating = false;
      
      if (progressCallback) {
        progressCallback(totalNodes, totalNodes);
      }
      
      return result;
    }

MET.calculateBetweenness = function calculateBetweenness() {
      if (betweennessCache) return betweennessCache;
      
      // Если кэша нет - запускаем асинхронный расчёт
      if (!betweennessCalculating) {
        calculateBetweennessAsync();
      }
      
      return null; // Вернём null, пока идёт расчёт
    };

function invalidateBetweennessCache() {
      betweennessCache = null;
      betweennessCalculating = false;
    }

let pageRankCache = null;

let pageRankCalculating = false;

MET.calculatePageRank = function calculatePageRank(iterations = 20, dampingFactor = 0.85, progressCallback = null) {
      if (pageRankCache) return Promise.resolve(pageRankCache);
      if (pageRankCalculating) return Promise.resolve(null);
      
      pageRankCalculating = true;
      
      return new Promise(async (resolve) => {
        const pageRank = {};
        const graph = buildGlobalGraphCache();
        
        // Инициализация равномерным распределением
        DATA.nodes.forEach(n => {
          pageRank[n.id] = 1.0 / DATA.nodes.length;
        });
        
        // Выбор стратегии нормализации         
        let normalizationStrategy;
        
        if (S.respectDirection) {
          // СТРАТЕГИЯ 1: НАПРАВЛЕННЫЙ ГРАФ (стандартный PageRank) - Нормализация по количеству исходящих ребер
          normalizationStrategy = {};
          DATA.nodes.forEach(node => {
            const outNeighbors = graph.outNeighbors[node.id] || [];
            normalizationStrategy[node.id] = outNeighbors.length > 0 ? outNeighbors.length : 1;
          });
          
        } else {
          // СТРАТЕГИЯ 2: НЕНАПРАВЛЕННЫЙ ГРАФ (Weighted PageRank) - Нормализация по СУММЕ ВЕСОВ ребер для создания асимметрии
          normalizationStrategy = {};
          DATA.nodes.forEach(node => {
            let weightSum = 0;
            const neighbors = graph.allNeighbors[node.id] || [];
            
            neighbors.forEach(({ weight }) => {
              // В ненаправленном графе используем веса для дифференциации
              weightSum += S.useWeightedPaths ? weight : 1;
            });
            
            normalizationStrategy[node.id] = weightSum > 0 ? weightSum : 1;
          });
        }
        
        // ОБЩИЙ ИТЕРАТИВНЫЙ АЛГОРИТМ         
        for (let iter = 0; iter < iterations; iter++) {
          const newPageRank = {};
          
          DATA.nodes.forEach(node => {
            let sum = 0;
            
            // Получаем входящих соседей в зависимости от режима
            const incomingNeighbors = S.respectDirection 
              ? (graph.inNeighbors[node.id] || [])
              : (graph.allNeighbors[node.id] || []);
            
            // Суммируем вклады от всех входящих соседей
            incomingNeighbors.forEach(({ node: neighbor, weight }) => {
              const normalizationFactor = normalizationStrategy[neighbor];
              
              if (S.respectDirection) {
                // Для направленного: вес ребра учитывается через деление на 3 (нормализация к диапазону [0.33, 0.67, 1.0] для весов 1-3)
                const edgeWeight = S.useWeightedPaths ? weight / 3.0 : 1.0;
                sum += (pageRank[neighbor] * edgeWeight) / normalizationFactor;
              } else {
                // Для ненаправленного: вес ребра используется в нормализации (создает асимметрию даже при симметричной структуре)
                const edgeWeight = S.useWeightedPaths ? weight : 1;
                sum += (pageRank[neighbor] * edgeWeight) / normalizationFactor;
              }
            });
            
            // Формула PageRank: (1-d)/N + d × sum
            newPageRank[node.id] = (1 - dampingFactor) / DATA.nodes.length + dampingFactor * sum;
          });
          
          // Обновить значения
          Object.keys(newPageRank).forEach(key => {
            pageRank[key] = newPageRank[key];
          });
          
          // Обновление прогресса
          if (progressCallback && iter % 5 === 0) {
            progressCallback(iter, iterations);
            await new Promise(res => setTimeout(res, 0));
          }
        }
        
        // ФИНАЛЬНАЯ НОРМАЛИЗАЦИЯ - Для ненаправленного графа нормализуем сумму к 1 для лучшей читаемости
        if (!S.respectDirection) {
          const totalPR = Object.values(pageRank).reduce((a, b) => a + b, 0);
          if (totalPR > 0) {
            Object.keys(pageRank).forEach(key => {
              pageRank[key] /= totalPR;
            });
          }
        }
        
        // Формирование результата
        const result = Object.entries(pageRank)
          .map(([id, value]) => ({
            node: DATA.nodes.find(n => n.id === id),
            value: value
          }))
          .sort((a, b) => b.value - a.value);
        
        pageRankCache = result;
        pageRankCalculating = false;
        
        if (progressCallback) progressCallback(iterations, iterations);
        
        resolve(result);
      });
    };

function invalidatePageRankCache() {
      pageRankCache = null;
      pageRankCalculating = false;
    }

let closenessCache = null;

let closenessCalculating = false;

function bfsFromSource(sourceId) {
      const graph = buildGlobalGraphCache();
      const distances = {};
      const visited = new Set();
      const queue = [sourceId];
      
      DATA.nodes.forEach(n => {
        distances[n.id] = Infinity;
      });
      distances[sourceId] = 0;
      visited.add(sourceId);
      
      while (queue.length > 0) {
        const current = queue.shift();
        const currentDist = distances[current];
        
        // Получаем соседей в зависимости от режима
        let neighbors;
        if (S.respectDirection) {
          neighbors = graph.outNeighbors[current] || [];
        } else {
          neighbors = graph.allNeighbors[current] || [];
        }
        
        neighbors.forEach(({ node: neighbor, distance }) => {
          const edgeWeight = S.useWeightedPaths ? distance : 1;
          const newDist = currentDist + edgeWeight;
          
          if (newDist < distances[neighbor]) {
            distances[neighbor] = newDist;
            
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push(neighbor);
            }
          }
        });
      }
      
      return distances;
    }

MET.calculateClosenessCentrality = async function calculateClosenessCentrality(progressCallback = null) {
      if (closenessCache) return closenessCache;
      if (closenessCalculating) return null;
      
      closenessCalculating = true;
      const closeness = {};
      
      // Предварительное построение графа
      buildGlobalGraphCache();
      
      let processedNodes = 0;
      const totalNodes = DATA.nodes.length;
      
      // Для каждого узла запускаем алгоритм поиска кратчайших путей
      for (let i = 0; i < DATA.nodes.length; i++) {
        const source = DATA.nodes[i];
        
        // ✅ ИСПРАВЛЕНО: используем Дейкстру для взвешенных графов
        const distances = S.useWeightedPaths 
          ? dijkstraFromSource(source.id)  // Для взвешенных графов
          : bfsFromSource(source.id);     // Для невзвешенных графов
        
        // Подсчёт метрики
        let totalDistance = 0;
        let reachableNodes = 0;
        
        Object.entries(distances).forEach(([targetId, dist]) => {
          if (targetId !== source.id && dist !== Infinity) {
            totalDistance += dist;
            reachableNodes++;
          }
        });
        
        // Нормализованная closeness (Wasserman & Faust, 1994)
        if (reachableNodes > 0) {
          // ✅ УЛУЧШЕНО: более понятная формула
          // normalizedCloseness = (reachableNodes^2) / ((N-1) * totalDistance)
          const normalizedCloseness = (reachableNodes * reachableNodes) / 
                         ((DATA.nodes.length - 1) * totalDistance);
          
          closeness[source.id] = {
            value: normalizedCloseness,
            node: source,
            reachable: reachableNodes
          };
        } else {
          closeness[source.id] = { value: 0, node: source, reachable: 0 };
        }
        
        processedNodes++;
        
        // Обновление прогресса реже - каждые 10 узлов
        if (processedNodes % 10 === 0) {
          if (progressCallback) {
            progressCallback(processedNodes, totalNodes);
          }
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
      
      const result = Object.values(closeness).sort((a, b) => b.value - a.value);
      closenessCache = result;
      closenessCalculating = false;
      
      if (progressCallback) progressCallback(totalNodes, totalNodes);
      
      return result;
    };

function invalidateClosenessCache() {
      closenessCache = null;
      closenessCalculating = false;
    }

let clusteringCache = null;

MET.calculateClusteringCoefficient = function calculateClusteringCoefficient() {
      if (clusteringCache) return clusteringCache;
      
      const clustering = {};
      const graph = buildGlobalGraphCache();
      
      DATA.nodes.forEach(node => {
        // Получаем всех соседей из предпостроенного графа
        const neighbors = new Set();
        graph.adjacency[node.id].forEach(({ node: neighbor }) => {
          neighbors.add(neighbor);
        });
        
        const k = neighbors.size;
        if (k < 2) {
          clustering[node.id] = { value: 0, node: node, neighbors: k };
          return;
        }
        
        // Подсчитать связи между соседями, используя предпостроенный граф
        let edgesBetweenNeighbors = 0;
        const neighborArray = Array.from(neighbors);
        
        for (let i = 0; i < neighborArray.length; i++) {
          const neighborAdjacency = new Set(
            graph.adjacency[neighborArray[i]].map(({ node }) => node)
          );
          
          for (let j = i + 1; j < neighborArray.length; j++) {
            if (neighborAdjacency.has(neighborArray[j])) {
              edgesBetweenNeighbors++;
            }
          }
        }
        
        clustering[node.id] = {
          value: (2.0 * edgesBetweenNeighbors) / (k * (k - 1)),
          node: node,
          neighbors: k
        };
      });
      
      const result = Object.values(clustering).sort((a, b) => b.value - a.value);
      clusteringCache = result;
      return result;
    };

function invalidateClusteringCache() {
      clusteringCache = null;
    }

let weightedClusteringCache = null;

let localCohesionCache = null;

let richClubCache = null;

MET.calculateWeightedClustering = function calculateWeightedClustering() {
      if (weightedClusteringCache) return weightedClusteringCache;
      
      const clustering = {};
      const graph = buildGlobalGraphCache();
      
      DATA.nodes.forEach(node => {
        // Получаем всех соседей
        const neighbors = new Set();
        const neighborWeights = new Map(); // Веса связей с соседями
        
        graph.adjacency[node.id].forEach(({ node: neighbor, weight }) => {
          neighbors.add(neighbor);
          neighborWeights.set(neighbor, weight);
        });
        
        const k = neighbors.size;
        if (k < 2) {
          clustering[node.id] = { 
            value: 0, 
            node: node, 
            neighbors: k,
            strength: 0,
            triangleStrength: 0
          };
          return;
        }
        
        // Подсчитываем strength узла (сумма весов)
        let strength = 0;
        neighborWeights.forEach(w => strength += w);
        
        // Подсчитываем взвешенную кластеризацию
        let weightedTriangles = 0;
        const neighborArray = Array.from(neighbors);
        
        for (let i = 0; i < neighborArray.length; i++) {
          const neighborAdjacency = new Map();
          graph.adjacency[neighborArray[i]].forEach(({ node, weight }) => {
            neighborAdjacency.set(node, weight);
          });
          
          for (let j = i + 1; j < neighborArray.length; j++) {
            if (neighborAdjacency.has(neighborArray[j])) {
              // Треугольник найден: node - neighborArray[i] - neighborArray[j] - node
              const w_ij = neighborWeights.get(neighborArray[i]);
              const w_ih = neighborWeights.get(neighborArray[j]);
              const w_jh = neighborAdjacency.get(neighborArray[j]);
              
              // Средний вес треугольника
              const triangleWeight = (w_ij + w_ih + w_jh) / 3.0;
              weightedTriangles += triangleWeight;
            }
          }
        }
        
        // Нормализация
        const maxPossibleTriangles = (k * (k - 1)) / 2;
        const normalizedValue = weightedTriangles / maxPossibleTriangles;
        
        clustering[node.id] = {
          value: normalizedValue,
          node: node,
          neighbors: k,
          strength: strength,
          triangleStrength: weightedTriangles,
          maxTriangles: maxPossibleTriangles
        };
      });
      
      const result = Object.values(clustering).sort((a, b) => b.value - a.value);
      weightedClusteringCache = result;
      return result;
    };

function invalidateWeightedClusteringCache() {
      weightedClusteringCache = null;
    }

MET.calculateLocalCohesion = function calculateLocalCohesion() {
      if (localCohesionCache) return localCohesionCache;
      
      const clustering = MET.calculateClusteringCoefficient();
      const weightedDegree = MET.calculateWeightedDegree();
      
      const cohesion = clustering.map(c => {
        const wd = weightedDegree.find(w => w.node.id === c.node.id);
        
        // Логарифм для сглаживания разброса
        const strengthBonus = Math.log(1 + (wd?.totalWeight || 0));
        const degreeBonus = Math.log(1 + c.neighbors);
        
        const cohesionScore = c.value * strengthBonus * degreeBonus;
        
        return {
          node: c.node,
          value: cohesionScore,
          clustering: c.value,
          strength: wd?.totalWeight || 0,
          neighbors: c.neighbors,
          rawScore: c.value * (wd?.totalWeight || 0)
        };
      });
      
      const result = cohesion.sort((a, b) => b.value - a.value);
      localCohesionCache = result;
      return result;
    };

function invalidateLocalCohesionCache() {
      localCohesionCache = null;
    }

MET.calculateRichClubCoefficient = function calculateRichClubCoefficient() {
      if (richClubCache) return richClubCache;
      
      const graph = buildGlobalGraphCache();
      const degrees = new Map();
      
      // Подсчёт степеней
      DATA.nodes.forEach(node => {
        const neighborCount = (graph.adjacency[node.id] || []).length;
        degrees.set(node.id, neighborCount);
      });
      
      const richClub = DATA.nodes.map(node => {
        const neighbors = graph.adjacency[node.id] || [];
        const myDegree = degrees.get(node.id);
        
        if (neighbors.length === 0) {
          return {
            node: node,
            value: 0,
            degree: 0,
            avgNeighborDegree: 0
          };
        }
        
        // Средняя степень соседей
        let neighborDegreeSum = 0;
        let highDegreeNeighbors = 0;
        
        neighbors.forEach(({ node: neighborId }) => {
          const neighborDegree = degrees.get(neighborId) || 0;
          neighborDegreeSum += neighborDegree;
          
          // Считаем "богатых" соседей (степень выше или равна моей)
          if (neighborDegree >= myDegree) {
            highDegreeNeighbors++;
          }
        });
        
        const avgNeighborDegree = neighborDegreeSum / neighbors.length;
        
        // Rich-club score: отношение богатых соседей к общему числу
        const richClubRatio = highDegreeNeighbors / neighbors.length;
        
        // Комбинированная метрика
        const combinedScore = richClubRatio * Math.log(1 + avgNeighborDegree);
        
        return {
          node: node,
          value: combinedScore,
          richClubRatio: richClubRatio,
          degree: myDegree,
          avgNeighborDegree: avgNeighborDegree,
          highDegreeNeighbors: highDegreeNeighbors
        };
      });
      
      const result = richClub.sort((a, b) => b.value - a.value);
      richClubCache = result;
      return result;
    };

function invalidateRichClubCache() {
      richClubCache = null;
    }

MET.calculateWeightedDegree = function calculateWeightedDegree() {
      const weightedDegree = {};
      const graph = buildGlobalGraphCache();
      
      DATA.nodes.forEach(node => {
        let inWeight = 0;
        let outWeight = 0;
        let inCount = 0;
        let outCount = 0;
        
        if (S.respectDirection) {
          // Используем предпостроенные списки
          const inNeighbors = graph.inNeighbors[node.id] || [];
          const outNeighbors = graph.outNeighbors[node.id] || [];
          
          inNeighbors.forEach(({ weight }) => {
            inWeight += S.useWeightedPaths ? weight : 1;
            inCount++;
          });
          
          outNeighbors.forEach(({ weight }) => {
            outWeight += S.useWeightedPaths ? weight : 1;
            outCount++;
          });
        } else {
          // ✅ ИСПРАВЛЕНО: Для ненаправленного графа
          const allNeighbors = graph.allNeighbors[node.id] || [];
          
          allNeighbors.forEach(({ weight }) => {
            const w = S.useWeightedPaths ? weight : 1;
            inWeight += w;
            inCount++;
          });
          
          // В ненаправленном графе in = out
          outWeight = inWeight;
          outCount = inCount;
        }
        
        weightedDegree[node.id] = {
          inWeight: inWeight,
          outWeight: outWeight,
          totalWeight: S.respectDirection ? (inWeight + outWeight) : inWeight,
          inCount: inCount,
          outCount: outCount,
          totalCount: S.respectDirection ? (inCount + outCount) : inCount,
          node: node
        };
      });
      
      return Object.values(weightedDegree).sort((a, b) => b.totalWeight - a.totalWeight);
    };

function dijkstraFromSource(sourceId) {
      const graph = buildGlobalGraphCache();
      const distances = {};
      const visited = new Set();
      
      // Инициализация расстояний
      DATA.nodes.forEach(n => {
        distances[n.id] = Infinity;
      });
      distances[sourceId] = 0;
      
      // Приоритетная очередь: массив пар [distance, nodeId]
      const priorityQueue = [[0, sourceId]];
      
      while (priorityQueue.length > 0) {
        // Сортируем очередь и берем узел с минимальным расстоянием
        priorityQueue.sort((a, b) => a[0] - b[0]);
        const [currentDist, current] = priorityQueue.shift();
        
        // Пропускаем, если уже посетили
        if (visited.has(current)) continue;
        visited.add(current);
        
        // Получаем соседей в зависимости от режима
        let neighbors;
        if (S.respectDirection) {
          neighbors = graph.outNeighbors[current] || [];
        } else {
          neighbors = graph.allNeighbors[current] || [];
        }
        
        // Релаксация ребер
        neighbors.forEach(({ node: neighbor, distance }) => {
          if (visited.has(neighbor)) return;
          
          const edgeWeight = S.useWeightedPaths ? distance : 1;
          const newDist = currentDist + edgeWeight;
          
          if (newDist < distances[neighbor]) {
            distances[neighbor] = newDist;
            priorityQueue.push([newDist, neighbor]);
          }
        });
      }
      
      return distances;
    }

let eigenvectorCache = null;

let eigenvectorCalculating = false;

MET.calculateEigenvectorCentrality = async function calculateEigenvectorCentrality(iterations = 100, progressCallback = null) {
      if (eigenvectorCache) return eigenvectorCache;
      if (eigenvectorCalculating) return null;
      
      eigenvectorCalculating = true;
      
      return new Promise(async (resolve) => {
        const eigenvector = {};
        
        // Инициализация равными значениями
        DATA.nodes.forEach(n => {
          eigenvector[n.id] = 1.0 / Math.sqrt(DATA.nodes.length);
        });
        
        // Использовать предпостроенный граф
        const graph = buildGlobalGraphCache();
        
        // Power iteration method
        for (let iter = 0; iter < iterations; iter++) {
          const newEigenvector = {};
          
          // Вычисляем новые значения
          DATA.nodes.forEach(node => {
            let sum = 0;
            
            // Получаем входящих соседей из предпостроенного графа
            const neighbors = S.respectDirection 
              ? (graph.inNeighbors[node.id] || [])
              : (graph.allNeighbors[node.id] || []);
            
            neighbors.forEach(({ node: neighbor, weight }) => {
              const edgeWeight = S.useWeightedPaths ? weight / 3.0 : 1.0;
              sum += eigenvector[neighbor] * edgeWeight;
            });
            
            newEigenvector[node.id] = sum;
          });
          
          // Нормализация (L2 norm)
          let norm = 0;
          Object.values(newEigenvector).forEach(val => {
            norm += val * val;
          });
          norm = Math.sqrt(norm);
          
          // Избегаем деления на ноль
          if (norm < 1e-10) {
            console.warn('Eigenvector: норма слишком мала, прерываем итерации');
            break;
          }
          
          Object.keys(newEigenvector).forEach(key => {
            eigenvector[key] = newEigenvector[key] / norm;
          });
          
          // Обновляем прогресс реже - каждые 10 итераций
          if (progressCallback && iter % 10 === 0) {
            progressCallback(iter, iterations);
            await new Promise(res => setTimeout(res, 0));
          }
        }
        
        const result = Object.entries(eigenvector)
          .map(([id, value]) => ({
            node: DATA.nodes.find(n => n.id === id),
            value: value
          }))
          .sort((a, b) => b.value - a.value);
        
        eigenvectorCache = result;
        eigenvectorCalculating = false;
        
        if (progressCallback) progressCallback(iterations, iterations);
        
        resolve(result);
      });
    };

function invalidateEigenvectorCache() {
      eigenvectorCache = null;
      eigenvectorCalculating = false;
    }

S._medianDegreeCache = null;

function medianNodeDegree() {
      if (S._medianDegreeCache !== null) return S._medianDegreeCache;
      const deg = new Map();
      S._concepts.forEach(c => deg.set(c.id, 0));
      S._relations.forEach(r => {
        if (deg.has(r.source)) deg.set(r.source, deg.get(r.source) + 1);
        if (deg.has(r.target)) deg.set(r.target, deg.get(r.target) + 1);
      });
      const a = [...deg.values()].sort((x, y) => x - y);
      S._medianDegreeCache = a.length ? a[Math.floor(a.length / 2)] : 0;
      return S._medianDegreeCache;
    }

function nodeDegreeOf(conceptId) {
      let d = 0;
      S._relations.forEach(r => {
        if (r.source === conceptId || r.target === conceptId) d++;
      });
      return d;
    }

export { betweennessCache, betweennessCalculating, bfsFromSource, calculateBetweennessAsync, closenessCache, closenessCalculating, clusteringCache, dijkstraFromSource, eigenvectorCache, eigenvectorCalculating, invalidateBetweennessCache, invalidateClosenessCache, invalidateClusteringCache, invalidateEigenvectorCache, invalidateLocalCohesionCache, invalidatePageRankCache, invalidateRichClubCache, invalidateWeightedClusteringCache, localCohesionCache, medianNodeDegree, nodeDegreeOf, pageRankCache, pageRankCalculating, richClubCache, weightedClusteringCache };
