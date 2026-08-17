// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../../core/ns.js';

import { initializePhilosophyMetrics } from '../../metrics/link-indexes.js';
import { generatePhilosopherRankings, generateRankings } from '../../metrics/rankings.js';

import { generateMetricDescriptionBlock } from '../results.js';
import { influenceScopeSwitcher } from './philosophical.js';

function generateConceptRankingsContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const rankings = generateRankings();
      const normBtn = `
        <button class="stats-action-btn secondary metric-norm-btn"
            data-act-click="toggle-metric-value-mode"
            data-tip="Сырое значение растёт вместе с числом связей; нормированное делится на степень узла и сравнимо между концепциями">
          <span class="layout-icon">${S.metricValueMode === 'raw' ? '÷' : '×'}</span>
          <span class="layout-text">${S.metricValueMode === 'raw' ? 'Нормировать' : 'Сырые значения'}</span>
        </button>`;
      
      const categories = [
        { key: 'mostInfluential', title: '💫 Самые влиятельные', color: '#6c5ce7' },
        { key: 'mostRevolutionary', title: '🔥 Самые революционные', color: '#e74c3c' },
        { key: 'mostProblematic', title: '⚡ Самые проблемные', color: '#f39c12' },
        { key: 'mostSynthetic', title: '🧩 Самые синтетические', color: '#27ae60' },
        { key: 'mostFoundational', title: '🏛️ Самые фундаментальные', color: '#3498db' },
        { key: 'mostCritical', title: '⚔️ Самые критические', color: '#c0392b' }
      ];
      
      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">🏅 Рейтинги концепций</h3>
          <p class="stats-content-subtitle">Топ-10 концепций по различным метрикам${S.metricValueMode === 'normalized' ? ' · нормировано на степень узла' : ''}</p>
          <div class="stats-content-actions">${normBtn}</div>
        </div>

        ${generateMetricDescriptionBlock('concept-rankings')}
        
        ${categories.map(cat => `
          <div style="margin-bottom: 40px;">
            <h4 style="color: ${cat.color}; font-size: 18px; margin-bottom: 15px;">
              ${cat.title}
            </h4>
            ${cat.key === 'mostInfluential' ? influenceScopeSwitcher() : ''}
            <table class="metric-table">
              <thead class="metric-table-header">
                <tr>
                  <th>#</th>
                  <th>Концепция</th>
                  <th>Значение</th>
                  <th>Философ</th>
                </tr>
              </thead>
              <tbody>
                ${rankings[cat.key].slice(0, 10).map((item, i) => `
                  <tr class="metric-table-row" data-act-click="highlight-node-by-id-4" data-a1="${item.id}">
                    <td><strong>${i + 1}</strong></td>
                    <td><strong>${item.label}</strong></td>
                    <td class="metric-table-value">${
                      (() => {
                        // Маппинг ключей категорий на ключи в объекте
                        const keyMap = {
                          'mostInfluential': 'influence',
                          'mostRevolutionary': 'revolutionary',
                          'mostProblematic': 'problematic',
                          'mostSynthetic': 'synthetic',
                          'mostFoundational': 'foundational',
                          'mostCritical': 'critical'
                        };
                        const valueKey = keyMap[cat.key];
                        return item[valueKey] ? item[valueKey].toFixed(2) : '0.00';
                      })()
                    }</td>
                    
                    <td>${item.philosopher}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}
      `;
    }

function generatePhilosopherRankingsContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const rankings = generatePhilosopherRankings();
      
      const categories = [
        { key: 'mostInfluential', title: '💫 Самые влиятельные', color: '#6c5ce7', valueKey: 'influence' },
        { key: 'mostRevolutionary', title: '🔥 Самые революционные', color: '#e74c3c', valueKey: 'revolutionary' },
        { key: 'mostSystematic', title: '📚 Самые систематичные', color: '#3498db', valueKey: 'systematic' },
        { key: 'greatestHistoricalReach', title: '🌍 С наибольшим охватом', color: '#27ae60', valueKey: 'historicalReach' },
        { key: 'mostInterdisciplinary', title: '🔬 Самые междисциплинарные', color: '#f39c12', valueKey: 'interdisciplinary' }
      ];
      
      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">🎖️ Рейтинги философов</h3>
          <p class="stats-content-subtitle">Топ-10 философов по различным характеристикам</p>
        </div>

        ${generateMetricDescriptionBlock('philosopher-rankings')}
        
        ${categories.map(cat => `
          <div style="margin-bottom: 40px;">
            <h4 style="color: ${cat.color}; font-size: 18px; margin-bottom: 15px;">
              ${cat.title}
            </h4>
            ${cat.key === 'mostInfluential' ? influenceScopeSwitcher() : ''}
            <table class="metric-table">
              <thead class="metric-table-header">
                <tr>
                  <th>#</th>
                  <th>Философ</th>
                  <th>Значение</th>
                </tr>
              </thead>
              <tbody>
                ${rankings[cat.key].slice(0, 10).map((item, i) => `
                  <tr class="metric-table-row">
                    <td><strong>${i + 1}</strong></td>
                    <td><strong>${item.name}</strong></td>
                    <td class="metric-table-value">${(item[cat.valueKey] || 0).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}
      `;
    }

export { generateConceptRankingsContent, generatePhilosopherRankingsContent };
