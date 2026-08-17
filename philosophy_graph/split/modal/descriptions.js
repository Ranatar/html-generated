// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

function toggleConnectionDescription(id) {
      const descElement = document.getElementById(`desc-${id}`);
      const toggleBtn = event.target;
      
      if (descElement.classList.contains('show')) {
        descElement.classList.remove('show');
        toggleBtn.classList.remove('expanded');
      } else {
        descElement.classList.add('show');
        toggleBtn.classList.add('expanded');
      }
    }

function toggleAllRoot(btn) {
      if (btn && btn.nodeType === 1) {
        return btn.closest('.toggle-all-descriptions-btn') || btn;
      }
      const t = window.event && window.event.target;
      return t ? (t.closest('.toggle-all-descriptions-btn') || t) : null;
    }

let allDescriptionsExpanded = false;

function toggleAllConnectionDescriptions(btn) {
      // ДЕФЕКТ U1: искался #detailModal, а окна концепции и философа
      // слиты в #universalModal — getElementById отдавал null, и
      // querySelectorAll на нём бросал TypeError. Область берём от
      // самой кнопки: она лежит внутри содержимого нужного окна.
      const toggleAllBtn = toggleAllRoot(btn);
      if (!toggleAllBtn) return;
      const modal = toggleAllBtn.closest('.modal-content') || document;
      const descriptions = modal.querySelectorAll('.connection-description');
      const toggleButtons = modal.querySelectorAll('.connection-toggle');
      
      // Состояние читается из DOM, а не из глобального флага: окно
      // пересобирается при каждом открытии, а флаг переживал закрытие,
      // и первый щелчок в новом окне сворачивал вместо разворачивания.
      allDescriptionsExpanded =
        ![...descriptions].every(d => d.classList.contains('show'));
      
      descriptions.forEach(desc => {
        if (allDescriptionsExpanded) {
          desc.classList.add('show');
        } else {
          desc.classList.remove('show');
        }
      });
      
      toggleButtons.forEach(btn => {
        if (allDescriptionsExpanded) {
          btn.classList.add('expanded');
        } else {
          btn.classList.remove('expanded');
        }
      });
      
      toggleAllBtn.textContent = allDescriptionsExpanded ? 
        '▲ Свернуть все описания связей' : 
        '▼ Развернуть все описания связей';
    }

function toggleSubsection(sectionId) {
      const content = document.getElementById(`content-${sectionId}`);
      const toggle = document.getElementById(`toggle-${sectionId}`);
      
      if (!content || !toggle) return;
      
      if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        toggle.classList.remove('collapsed');
      } else {
        content.classList.add('collapsed');
        toggle.classList.add('collapsed');
      }
    }

function togglePhilosopherConceptDescription(conceptId) {
      const descElement = document.getElementById(`phil-concept-desc-${conceptId}`);
      const toggleBtn = event.target;
      
      if (descElement.classList.contains('show')) {
        descElement.classList.remove('show');
        toggleBtn.classList.remove('expanded');
      } else {
        descElement.classList.add('show');
        toggleBtn.classList.add('expanded');
      }
    }

let allPhilosopherConceptDescriptionsExpanded = false;

function toggleAllPhilosopherConceptDescriptions(btn) {
      // ДЕФЕКТ U1: см. toggleAllConnectionDescriptions —
      // #philosopherDetailModal тоже слит в #universalModal.
      const toggleAllBtn = toggleAllRoot(btn);
      if (!toggleAllBtn) return;
      const modal = toggleAllBtn.closest('.modal-content') || document;
      const descriptions = modal.querySelectorAll('.concept-extended-desc');
      const toggleButtons = modal.querySelectorAll('.toggle-concept-desc-btn');
      
      allPhilosopherConceptDescriptionsExpanded =
        ![...descriptions].every(d => d.classList.contains('show'));
      
      descriptions.forEach(desc => {
        if (allPhilosopherConceptDescriptionsExpanded) {
          desc.classList.add('show');
        } else {
          desc.classList.remove('show');
        }
      });
      
      toggleButtons.forEach(btn => {
        if (allPhilosopherConceptDescriptionsExpanded) {
          btn.classList.add('expanded');
        } else {
          btn.classList.remove('expanded');
        }
      });
      
      toggleAllBtn.textContent = allPhilosopherConceptDescriptionsExpanded ? 
        '▲ Свернуть все описания концепций' : 
        '▼ Развернуть все описания концепций';
    }

let allPhilosopherConnectionDescriptionsExpanded = false;

function toggleAllPhilosopherConnectionDescriptions(btn) {
      // ДЕФЕКТ U1: то же самое для связей философа.
      const toggleAllBtn = toggleAllRoot(btn);
      if (!toggleAllBtn) return;
      const modal = toggleAllBtn.closest('.modal-content') || document;
      const descriptions = modal.querySelectorAll('.connection-description');
      const toggleButtons = modal.querySelectorAll('.connection-toggle');
      
      allPhilosopherConnectionDescriptionsExpanded =
        ![...descriptions].every(d => d.classList.contains('show'));
      
      descriptions.forEach(desc => {
        if (allPhilosopherConnectionDescriptionsExpanded) {
          desc.classList.add('show');
        } else {
          desc.classList.remove('show');
        }
      });
      
      toggleButtons.forEach(btn => {
        if (allPhilosopherConnectionDescriptionsExpanded) {
          btn.classList.add('expanded');
        } else {
          btn.classList.remove('expanded');
        }
      });
      
      toggleAllBtn.textContent = allPhilosopherConnectionDescriptionsExpanded ? 
        '▲ Свернуть все описания связей' : 
        '▼ Развернуть все описания связей';
    }

export { allDescriptionsExpanded, allPhilosopherConceptDescriptionsExpanded, allPhilosopherConnectionDescriptionsExpanded, toggleAllConnectionDescriptions, toggleAllPhilosopherConceptDescriptions, toggleAllPhilosopherConnectionDescriptions, toggleAllRoot, toggleConnectionDescription, togglePhilosopherConceptDescription, toggleSubsection };
