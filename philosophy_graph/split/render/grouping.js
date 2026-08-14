// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';
import { resetHighlight } from './selection.js';

const groupPositions = {};

const cols = 6;

function togglePanel(panelId) {
      const panel = document.getElementById(panelId);
      const isCollapsed = panel.classList.contains('collapsed');
      
      if (isCollapsed) {
        panel.classList.remove('collapsed');
        // Меняем иконку на минус
        const btn = panel.querySelector('.collapse-btn .expand-icon');
        btn.textContent = '−';
        // Сохраняем состояние
        localStorage.setItem(`${panelId}_collapsed`, 'false');
      } else {
        panel.classList.add('collapsed');
        // Меняем иконку на плюс
        const btn = panel.querySelector('.collapse-btn .expand-icon');
        btn.textContent = '+';
        // Сохраняем состояние
        localStorage.setItem(`${panelId}_collapsed`, 'true');
      }
    }

function restorePanelStates() {
      const panels = ['pathFinder', 'statsPanel'];
      
      panels.forEach(panelId => {
        const collapsed = localStorage.getItem(`${panelId}_collapsed`) === 'true';
        if (collapsed) {
          const panel = document.getElementById(panelId);
          if (!panel) return;   // Б15: statsPanel в разметке отсутствует
          panel.classList.add('collapsed');
          const btn = panel.querySelector('.collapse-btn .expand-icon');
          if (btn) btn.textContent = '+';
        }
      });
    }

function toggleGrouping() {
      S.isGrouped = !S.isGrouped;
      const btn = document.getElementById('groupBtn');
      
      resetHighlight();
      
      if (S.isGrouped) {
        btn.classList.add('active');
        btn.textContent = '📦 Разгруппировать';
        
        // Добавляем силы группировки
        S.simulation
          .force("x", d3.forceX(d => groupPositions[d.concept].x).strength(0.3))
          .force("y", d3.forceY(d => groupPositions[d.concept].y).strength(0.3))
          .force("charge", d3.forceManyBody().strength(-200))
          .force("collision", d3.forceCollide().radius(40));
      } else {
        btn.classList.remove('active');
        btn.textContent = '📦 Группировать';
        
        // Убираем силы группировки
        S.simulation
          .force("x", null)
          .force("y", null)
          .force("charge", d3.forceManyBody().strength(-350))
          .force("collision", d3.forceCollide().radius(45))
          .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));
      }
      S.tickCount = 0;
      S.simulation.alpha(0.5).restart();
    }

export { cols, groupPositions, restorePanelStates, toggleGrouping, togglePanel };
