// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, MET } from '../../core/ns.js';
import { initializePhilosophyMetrics } from '../../metrics/init.js';
import { philosopherProfile } from '../../metrics/philosopher.js';
import { influenceScopeSwitcher } from '../../metrics/philosophical.js';
import { generateMetricDescriptionBlock, rankKeep } from '../results.js';

function generatePhilosopherProfileContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const philosophers = Array.from(new Set(DATA.nodes.map(n => n.concept)));
      const profiles = philosophers.map(p => {
        const profile = philosopherProfile(p);
        return profile ? { philosopher: p, ...profile } : null;
      }).filter(p => p !== null).sort((a, b) => b.averages.influence - a.averages.influence);
      
      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">📖 Профили философов</h3>
          <p class="stats-content-subtitle">Комплексная характеристика творчества философов</p>
        </div>
        
        ${generateMetricDescriptionBlock('philosopher-profile')}
        ${influenceScopeSwitcher()}
        
        <div class="metric-results-grid">
          ${profiles.slice(0, 24).map((p, i) => `
            <div class="metric-result-card metric-card-badges">
              <div class="metric-result-rank">#${i + 1}</div>
              <div class="metric-result-name">${p.philosopher}</div>
              <div class="metric-result-details">
                <div class="metric-result-detail-badge">
                  Влияние: ${p.averages.influence.toFixed(2)}
                </div>
                <div class="metric-result-detail-badge">
                  Революционность: ${p.averages.revolutionary.toFixed(2)}
                </div>
                <div class="metric-result-detail-badge">
                  Когерентность: ${p.averages.coherence.toFixed(2)}
                </div>
              </div>
              <div class="metric-result-philosopher">Концепций: ${p.conceptsCount}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

function generatePhilosopherSystematicContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const philosophers = Array.from(new Set(DATA.nodes.map(n => n.concept)));
      const results = philosophers.map(p => {
        const metric = MET.philosopherSystematicIndex(p);
        return {
          philosopher: p,
          value: metric.density,
          details: metric
        };
      }).sort((a, b) => b.value - a.value);
      
      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">📚 Систематичность философов</h3>
          <p class="stats-content-subtitle">Плотность внутренних связей между концепциями философа</p>
        </div>
        
        ${generateMetricDescriptionBlock('philosopher-systematic')}
        
        <div class="metric-results-grid">
          ${results.slice(0, 24).map((r, i) => `
            <div class="metric-result-card">
              <div class="metric-result-rank">#${i + 1}</div>
              <div class="metric-result-name">${r.philosopher}</div>
              <div class="metric-result-value">${r.value.toFixed(2)}%</div>
              <div class="metric-result-philosopher">
                Концепций: ${r.details.totalConcepts}, 
                Связей: ${r.details.internalLinks}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

function generatePhilosopherReachContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const philosophers = Array.from(new Set(DATA.nodes.map(n => n.concept)));
      const results = philosophers.map(p => {
        const metric = MET.philosopherHistoricalReachIndex(p);
        return {
          philosopher: p,
          value: metric.total,
          details: metric
        };
      }).filter(rankKeep).sort((a, b) => b.value - a.value);
      
      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">🌍 Исторический охват философов</h3>
          <p class="stats-content-subtitle">Временной размах влияния философа</p>
        </div>
        
        ${generateMetricDescriptionBlock('philosopher-reach')}
        
        <div class="metric-results-grid">
          ${results.slice(0, 24).map((r, i) => `
            <div class="metric-result-card">
              <div class="metric-result-rank">#${i + 1}</div>
              <div class="metric-result-name">${r.philosopher}</div>
              <div class="metric-result-value">${r.details.generations}</div>
              <div class="metric-result-philosopher">
                Поколений, влиял на ${r.details.influencedPhilosophersCount} философов
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

function generatePhilosopherInterdisciplinaryContent() {
      if (!DATA.concepts || !DATA.relations) {
        initializePhilosophyMetrics();
      }
      
      const philosophers = Array.from(new Set(DATA.nodes.map(n => n.concept)));
      const results = philosophers.map(p => {
        const metric = MET.philosopherInterdisciplinaryIndex(p);
        return {
          philosopher: p,
          value: metric.total,
          details: metric
        };
      // В6: фильтр был закомментирован, хотя соседние представления его
      // применяют. Приведено к общему поведению.
      }).filter(rankKeep).sort((a, b) => b.value - a.value);
      
      return `
        <div class="stats-content-header">
          <h3 class="stats-content-title">🔬 Междисциплинарность философов</h3>
          <p class="stats-content-subtitle">Охват различных тематических областей</p>
        </div>
        
        ${generateMetricDescriptionBlock('philosopher-interdisciplinary')}
        
        <div class="metric-results-grid">
          ${results.slice(0, 24).map((r, i) => `
            <div class="metric-result-card">
              <div class="metric-result-rank">#${i + 1}</div>
              <div class="metric-result-name">${r.philosopher}</div>
              <div class="metric-result-value">${r.value.toFixed(2)}</div>
              <div class="metric-result-philosopher">
                Рубрик: ${r.details.rubricCount}, 
                Энтропия: ${r.details.entropy.toFixed(2)}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

export { generatePhilosopherInterdisciplinaryContent, generatePhilosopherProfileContent, generatePhilosopherReachContent, generatePhilosopherSystematicContent };
