// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { relationHint } from '../core/relation-types.js';
import { applyFilters, philosopherPassesTraditions } from '../filters/filters.js';
import { updateArrows } from '../render/d3-layer.js';
import { выбранныеФилософы } from '../state/filters.js';

function отметитьВыбранныхВЛегенде() {
      document.querySelectorAll('#philosopherFilters .legend-item').forEach(item => {
        const cb = item.querySelector('input[type="checkbox"]');
        item.classList.toggle('phil-chosen', !!cb && выбранныеФилософы.has(cb.value));
      });
    }

function initFilters() {
      // ДЕФЕКТ U-3: прежде функция ДОПИСЫВАЛА в контейнеры, не очищая их.
      // В unimod она вызывается из savePhilosopherData, и замер показал
      // рост легенды с 42 записей до 84 за одно сохранение; каждое
      // следующее добавляло ещё столько же. Очистка нужна и здесь:
      // afterDataChange зовёт initFilters после всякой правки философов.
      ['philosopherFilters', 'relationFilters', 'rubricFilters'].forEach(id => {
        const box = document.getElementById(id);
        if (box) box.innerHTML = '';
      });

      // Создаем фильтры философов
      const philContainer = document.getElementById('philosopherFilters');
      Object.entries(DATA.philosopherConcepts).forEach(([name, data]) => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
          <input type="checkbox" id="phil-${name}" value="${name}" checked data-act-change="toggle-philosopher-change" data-a1="${name}">
          <label class="phil-row-label">
            <div class="legend-color" style="background: ${data.color}"></div>
            <span>${name}<small style="color: var(--fg-muted); font-size: 9px;"> (${data.years})</small></span>
          </label>
        `;
        philContainer.appendChild(item);
      });
    
      // Создаем фильтры связей — с подсказкой о смысле типа
      const relContainer = document.getElementById('relationFilters');
      Object.entries(DATA.relationTypesObj).forEach(([type, typeData]) => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        const hint = relationHint(type).replace(/"/g, '&quot;');
        item.innerHTML = `
          <input type="checkbox" id="rel-${type}" checked data-act-change="toggle-relation-change" data-a1="${type}">
          <label for="rel-${type}" data-tip="${hint}">
            <div class="legend-line" style="background: ${typeData.color}"></div>
            <span>${typeData.label}<span class="legend-hint-mark">?</span></span>
          </label>
        `;
        relContainer.appendChild(item);
      });

      // Создаем фильтры традиций
      const tradContainer = document.getElementById('traditionFilters');
      if (tradContainer) {
        DATA.traditions.forEach(tr => {
          const members = DATA.philosophers.filter(p => (p.traditions || []).includes(tr.id));
          const item = document.createElement('div');
          item.className = 'legend-item';
          const hint = (tr.description || '').replace(/"/g, '&quot;');
          item.innerHTML = `
            <input type="checkbox" id="trad-${tr.id}" checked data-act-change="toggle-tradition-change" data-a1="${tr.id}">
            <label for="trad-${tr.id}" data-tip="${hint}" style="flex:1;">
              <span>${tr.name}<small style="color: var(--fg-muted);font-size:9px;"> (${members.length})</small></span>
            </label>
            <button class="tradition-pick" data-tip="Оставить в отборе только этих философов"
                data-act-click="only-tradition" data-a1="${tr.id}">=</button>
            <button class="tradition-pick" data-tip="Добавить этих к выбранным философам"
                data-act-click="add-tradition" data-a1="${tr.id}">+</button>
          `;
          tradContainer.appendChild(item);
        });
      }

      // Создаем фильтры рубрик
      const rubricContainer = document.getElementById('rubricFilters');
      DATA.rubrics.forEach(rubric => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
          <input type="checkbox" id="rubric-${rubric.id}" checked data-act-change="toggle-rubric-change" data-a1="${rubric.id}">
          <label for="rubric-${rubric.id}">
            <span>${rubric.name}</span>
          </label>
        `;
        rubricContainer.appendChild(item);
      });

    }

function togglePhilosopher(philosopher) {
      if (S.selectedPhilosophers.has(philosopher)) {
        S.selectedPhilosophers.delete(philosopher);
      } else {
        S.selectedPhilosophers.add(philosopher);
      }
      applyFilters();
    }

function toggleTradition(traditionId) {
      if (S.selectedTraditions.has(traditionId)) S.selectedTraditions.delete(traditionId);
      else S.selectedTraditions.add(traditionId);
      applyFilters();
    }

function selectAllTraditions() {
      S.selectedTraditions = new Set(DATA.traditions.map(t => t.id));
      DATA.traditions.forEach(t => {
        const cb = document.getElementById('trad-' + t.id);
        if (cb) cb.checked = true;
      });
      applyFilters();
    }

function deselectAllTraditions() {
      S.selectedTraditions.clear();
      DATA.traditions.forEach(t => {
        const cb = document.getElementById('trad-' + t.id);
        if (cb) cb.checked = false;
      });
      applyFilters();
    }

function traditionMembers(traditionId) {
      return DATA.philosophers.filter(p => (p.traditions || []).includes(traditionId))
                 .map(p => p.nameRu);
    }

function syncPhilosopherCheckboxes() {
      Object.keys(DATA.philosopherConcepts).forEach(name => {
        const cb = document.getElementById('phil-' + name);
        if (cb) cb.checked = S.selectedPhilosophers.has(name);
      });
    }

function onlyTradition(traditionId) {
      S.selectedPhilosophers = new Set(traditionMembers(traditionId));
      syncPhilosopherCheckboxes();
      applyFilters();
    }

function addTradition(traditionId) {
      traditionMembers(traditionId).forEach(name => S.selectedPhilosophers.add(name));
      syncPhilosopherCheckboxes();
      applyFilters();
    }

function toggleRelation(relationType) {
      if (S.selectedRelations.has(relationType)) {
        S.selectedRelations.delete(relationType);
      } else {
        S.selectedRelations.add(relationType);
      }
      applyFilters();
    }

function selectAllPhilosophers() {
      S.selectedPhilosophers = new Set(Object.keys(DATA.philosopherConcepts));
      Object.keys(DATA.philosopherConcepts).forEach(name => {
        document.getElementById(`phil-${name}`).checked = true;
      });
      applyFilters();
    }

function deselectAllPhilosophers() {
      S.selectedPhilosophers.clear();
      Object.keys(DATA.philosopherConcepts).forEach(name => {
        document.getElementById(`phil-${name}`).checked = false;
      });
      applyFilters();
    }

function selectAllRelations() {
      S.selectedRelations = new Set(Object.keys(DATA.relationTypesObj));
      Object.keys(DATA.relationTypesObj).forEach(type => {
        document.getElementById(`rel-${type}`).checked = true;
      });
      applyFilters();
    }

function deselectAllRelations() {
      S.selectedRelations.clear();
      Object.keys(DATA.relationTypesObj).forEach(type => {
        document.getElementById(`rel-${type}`).checked = false;
      });
      applyFilters();
    }

function toggleRubric(rubricId) {
      if (S.selectedRubrics.has(rubricId)) {
        S.selectedRubrics.delete(rubricId);
      } else {
        S.selectedRubrics.add(rubricId);
      }
      applyFilters();
    }

function selectAllRubrics() {
      S.selectedRubrics = new Set(DATA.rubrics.map(r => r.id));
      DATA.rubrics.forEach(rubric => {
        document.getElementById(`rubric-${rubric.id}`).checked = true;
      });
      applyFilters();
    }

function deselectAllRubrics() {
      S.selectedRubrics.clear();
      DATA.rubrics.forEach(rubric => {
        document.getElementById(`rubric-${rubric.id}`).checked = false;
      });
      applyFilters();
    }

function toggleSection(sectionId) {
      const header = event.currentTarget;
      const content = document.getElementById(`${sectionId}-content`);
      
      if (!content) {
        console.error(`Секция ${sectionId}-content не найдена`);
        return;
      }
      
      // Переключаем классы
      const isCollapsed = content.classList.contains('collapsed');
      
      if (isCollapsed) {
        // Разворачиваем
        content.classList.remove('collapsed');
        header.classList.remove('collapsed');
        
        // Устанавливаем max-height равным реальной высоте контента
        const scrollHeight = content.scrollHeight;
        content.style.maxHeight = scrollHeight + 'px';
        
        // После окончания анимации убираем ограничение
        setTimeout(() => {
          if (!content.classList.contains('collapsed')) {
            content.style.maxHeight = 'none';
          }
        }, 300); // 300ms - длительность transition
        
      } else {
        // Перед сворачиванием устанавливаем текущую высоту
        const scrollHeight = content.scrollHeight;
        content.style.maxHeight = scrollHeight + 'px';
        
        // Принудительный reflow для применения стиля
        content.offsetHeight;
        
        // Сворачиваем
        content.classList.add('collapsed');
        header.classList.add('collapsed');
        content.style.maxHeight = '0px';
      }
    }

function changeFilterMode(mode) {
      S.filterMode = mode;
      applyFilters();
    }

function toggleUniformLinkWidth() {
      const isUniform = document.getElementById('uniformLinkWidth').checked;
      
      S.renderState.uniformLinkWidth = isUniform;
      // Ф0.4: маркеры масштабировались stroke-width, теперь размер считаем сами
      S.uniformLinkWidthActive = isUniform;
      updateArrows();
    }

function updatePhilosopherDimming() {
      Object.keys(DATA.philosopherConcepts).forEach(name => {
        const cb = document.getElementById('phil-' + name);
        if (!cb) return;
        const row = cb.closest('.legend-item');
        if (!row) return;
        const dim = cb.checked && !philosopherPassesTraditions(name);
        row.style.opacity = dim ? '0.35' : '';
        if (dim) row.setAttribute('data-tip', 'Отсечён отбором по традициям');
        else row.removeAttribute('data-tip');
      });
    }

function updateFilterStats() {
      // Б11: счётчики берутся из JS-состояния, а не обходом 2008 элементов
      const visibleNodesCount = S.visibleNodeIds ? S.visibleNodeIds.size : DATA.nodes.length;
      const visibleLinksCount = S.visibleLinkSet ? S.visibleLinkSet.size : DATA.links.length;
      
      const totalNodes = DATA.nodes.length;
      const totalLinks = DATA.links.length;
      
      document.getElementById('filterStats').textContent = 
        `Показано: ${visibleNodesCount}/${totalNodes} концепций, ${visibleLinksCount}/${totalLinks} связей`;
    }

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

export { addTradition, changeFilterMode, deselectAllPhilosophers, deselectAllRelations, deselectAllRubrics, deselectAllTraditions, initFilters, onlyTradition, restorePanelStates, selectAllPhilosophers, selectAllRelations, selectAllRubrics, selectAllTraditions, syncPhilosopherCheckboxes, togglePanel, togglePhilosopher, toggleRelation, toggleRubric, toggleSection, toggleTradition, toggleUniformLinkWidth, traditionMembers, updateFilterStats, updatePhilosopherDimming, отметитьВыбранныхВЛегенде };
