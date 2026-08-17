// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, MET, S } from '../../core/ns.js';
import { betweennessCache, closenessCache, eigenvectorCache, localCohesionCache, pageRankCache, richClubCache, weightedClusteringCache } from '../../metrics/network.js';

import { generateCalculateButton, generateMetricDescriptionBlock, generateMetricResults } from '../results.js';

function generateOverviewContent() {
      const avgDegree = (DATA.links.length * 2 / DATA.nodes.length).toFixed(2);
      const density = (DATA.links.length / ((DATA.nodes.length * (DATA.nodes.length - 1)) / 2) * 100).toFixed(3);
      
      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">📈 Общий обзор графа</h3>
          <p class="stats-content-subtitle">Базовая статистика сети философских концепций</p>
        </div>
        
        ${generateMetricDescriptionBlock('overview')}
        
        <div class="metric-results-grid">
          <div class="metric-result-card">
            <div class="metric-result-rank">Узлы</div>
            <div class="metric-result-value">${DATA.nodes.length}</div>
            <div class="metric-result-philosopher">Всего концепций</div>
          </div>
          <div class="metric-result-card">
            <div class="metric-result-rank">Связи</div>
            <div class="metric-result-value">${DATA.links.length}</div>
            <div class="metric-result-philosopher">Всего отношений</div>
          </div>
          <div class="metric-result-card">
            <div class="metric-result-rank">Плотность</div>
            <div class="metric-result-value">${density}%</div>
            <div class="metric-result-philosopher">Плотность сети</div>
          </div>
          <div class="metric-result-card">
            <div class="metric-result-rank">Средняя степень</div>
            <div class="metric-result-value">${avgDegree}</div>
            <div class="metric-result-philosopher">Связей на узел</div>
          </div>
        </div>
      `;
    }

function generateDegreeContent() {
      // Берём метрику, а не считаем своё: calculateWeightedDegree читает
      // обе галочки и отдаёт уже отсортированный массив по всем узлам.
      const _wd = MET.calculateWeightedDegree();
      const _weighted = S.useWeightedPaths;
      const _directed = S.respectDirection;
      const degreeData = _wd.map(d => ({
        node: d.node,
        inDegree:  _weighted ? d.inWeight  : d.inCount,
        outDegree:   _weighted ? d.outWeight   : d.outCount,
        totalDegree: _weighted ? d.totalWeight : d.totalCount
      })).sort((a, b) => b.totalDegree - a.totalDegree);

      // Без учёта направленности входящие и исходящие совпадают по
      // построению, и две одинаковые колонки только сбивают с толку —
      // показываем одну.
      const _headCells = _directed
        ? `<th>${_weighted ? 'Вес входящих' : 'Входящих'}</th>
           <th>${_weighted ? 'Вес исходящих' : 'Исходящих'}</th>
           <th>Всего</th>`
        : `<th>${_weighted ? 'Вес связей' : 'Связей'}</th>`;
      const _rowCells = d => _directed
        ? `<td>${_fmtDeg(d.inDegree)}</td>
           <td>${_fmtDeg(d.outDegree)}</td>
           <td class="metric-table-value">${_fmtDeg(d.totalDegree)}</td>`
        : `<td class="metric-table-value">${_fmtDeg(d.totalDegree)}</td>`;
      const _fmtDeg = v => Number.isInteger(v) ? v : (+v).toFixed(1);
      
      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">🔗 Степень связности</h3>
          <p class="stats-content-subtitle">${
            _directed
              ? (_weighted ? 'Сумма весов входящих и исходящих связей'
                     : 'Количество входящих и исходящих связей')
              : (_weighted ? 'Сумма весов связей узла (направленность не учитывается)'
                     : 'Количество связей узла (направленность не учитывается)')
          }</p>
        </div>
        
        ${generateMetricDescriptionBlock('degree')}
        
        <table class="metric-table">
          <thead class="metric-table-header">
            <tr>
              <th>#</th>
              <th>Концепция</th>
              <th>Философ</th>
              ${_headCells}
            </tr>
          </thead>
          <tbody>
            ${degreeData.slice(0, 20).map((d, i) => `
              <tr class="metric-table-row" data-act-click="highlight-node-by-id-3" data-a1="${d.node.id}">
                <td><strong>${i + 1}</strong></td>
                <td><strong>${d.node.label}</strong></td>
                <td>${d.node.concept}</td>
                ${_rowCells(d)}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

function generatePageRankContent() {
      if (!pageRankCache || pageRankCache.length === 0) {
        return generateCalculateButton('PageRank', 'pagerank', 
          'Алгоритм PageRank определяет важность узлов на основе количества и качества входящих связей');
      }
      
      return generateMetricResults(
        pageRankCache.slice(0, 30),
        '⭐ PageRank',
        'Важность узлов на основе входящих связей',
        'pagerank',
        'value',
        true
      );
    }

function generateBetweennessContent() {
      if (!betweennessCache || betweennessCache.length === 0) {
        return generateCalculateButton('Betweenness Centrality', 'betweenness',
          'Метрика показывает, насколько часто узел находится на кратчайших путях между другими узлами');
      }
      
      return generateMetricResults(
        betweennessCache.slice(0, 30),
        '🌉 Betweenness Centrality',
        'Узлы-посредники в сети',
        'betweenness',
        'value',
        true
      );
    }

function generateClosenessContent() {
      if (!closenessCache || closenessCache.length === 0) {
        return generateCalculateButton('Closeness Centrality', 'closeness',
          'Метрика измеряет среднюю дистанцию от узла до всех остальных узлов');
      }
      
      return generateMetricResults(
        closenessCache.slice(0, 30),
        '🎯 Closeness Centrality',
        'Центральность по близости',
        'closeness',
        'value',
        true
      );
    }

function generateEigenvectorContent() {
      if (!eigenvectorCache || eigenvectorCache.length === 0) {
        return generateCalculateButton('Eigenvector Centrality', 'eigenvector',
          'Мера влияния узла в сети: важность определяется важностью соседей');
      }
      
      return generateMetricResults(
        eigenvectorCache.slice(0, 30),
        '🏆 Eigenvector Centrality',
        'Влияние через влиятельных соседей',
        'eigenvector',
        'value',
        true
      );
    }

function generateWeightedClusteringContent() {
      if (!weightedClusteringCache || weightedClusteringCache.length === 0) {
        return generateCalculateButton('Weighted Clustering', 'weighted-clustering',
          'Плотность связей в окрестности узла с учётом весов');
      }
      
      return generateMetricResults(
        weightedClusteringCache.slice(0, 30),
        '🕸️ Взвешенная кластеризация',
        'Плотность связей с учётом весов',
        'weighted-clustering',
        'value',
        true
      );
    }

function generateLocalCohesionContent() {
      if (!localCohesionCache || localCohesionCache.length === 0) {
        return generateCalculateButton('Local Cohesion', 'local-cohesion',
          'Комбинированная метрика: кластеризация × сила связей × количество соседей');
      }
      
      return generateMetricResults(
        localCohesionCache.slice(0, 30),
        '🔵 Локальная когезия',
        'Центры философских школ',
        'local-cohesion',
        'value',
        true
      );
    }

function generateRichClubContent() {
      if (!richClubCache || richClubCache.length === 0) {
        return generateCalculateButton('Rich-Club', 'rich-club',
          'Степень связности узла с другими высокостепенными узлами');
      }
      
      return generateMetricResults(
        richClubCache.slice(0, 30),
        '👑 Rich-Club',
        'Философская элита сети',
        'rich-club',
        'value',
        true
      );
    }

export { generateBetweennessContent, generateClosenessContent, generateDegreeContent, generateEigenvectorContent, generateLocalCohesionContent, generateOverviewContent, generatePageRankContent, generateRichClubContent, generateWeightedClusteringContent };
