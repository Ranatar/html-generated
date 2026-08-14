// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from '../core/ns.js';
import { ModalContext } from './context.js';
import { modalEntityExists } from './registry.js';

function hasUnsavedChanges() {
      if (ModalContext.currentMode !== 'edit') return false;

      const entityType   = ModalContext.currentEntity;
      const originalData = ModalContext.currentData;

      // Создание новой сущности: сверять не с чем, поэтому изменением
      // считается всякое заполненное поле. Признак берётся из общей
      // функции — см. комментарий к modalEntityExists.
      if (!modalEntityExists(entityType, originalData)) {
        return hasFilledFields();
      }

      switch (entityType) {
        case 'philosopher': return hasPhilosopherChanges(originalData);
        case 'concept':   return hasConceptChanges(originalData);
        case 'connection':  return hasConnectionChanges(originalData);
        default:      return false;
      }
    }

function hasFilledFields() {
      const inputs = document.querySelectorAll(
        '#universalModalContent input, #universalModalContent textarea, '
        + '#universalModalContent select');
      for (const input of inputs) {
        if (input.type === 'checkbox' || input.type === 'radio') continue;
        if ((input.value || '').trim().length > 0) return true;
      }
      return false;
    }

function hasPhilosopherChanges(original) {
      const philosopherData = DATA.philosophers.find(p => p.nameRu === original);
      if (!philosopherData) return false;

      const nameInput  = document.getElementById('philName');
      const colorInput = document.getElementById('philColor');
      const birthInput = document.getElementById('philBirth');
      const deathInput = document.getElementById('philDeath');
      const descInput  = document.getElementById('philDescription');
      if (!nameInput || !colorInput || !descInput) return false;

      const num = el => {
        if (!el) return null;
        const v = parseInt(el.value, 10);
        return Number.isNaN(v) ? null : v;
      };
      return nameInput.value.trim() !== philosopherData.nameRu
        || colorInput.value.toLowerCase() !== String(philosopherData.color).toLowerCase()
        || num(birthInput) !== (philosopherData.birth ?? null)
        || num(deathInput) !== (philosopherData.death ?? null)
        || descInput.value.trim() !== (philosopherData.description || '').trim();
    }

function hasConceptChanges(original) {
      const labelInput = document.getElementById('conceptLabel');
      const philSelect = document.getElementById('conceptPhilosopher');
      const rubrSelect = document.getElementById('conceptRubric');
      const descInput  = document.getElementById('conceptDescription');
      const extInput   = document.getElementById('conceptExtendedDescription');
      if (!labelInput || !philSelect) return false;

      const selected = rubrSelect
        ? Array.from(rubrSelect.selectedOptions).map(o => o.value).sort()
        : [];
      const was = (DATA.conceptToRubrics[original.id] || []).slice().sort();

      return labelInput.value.trim() !== original.label
        || philSelect.value !== original.concept
        || selected.join('\u0000') !== was.join('\u0000')
        || (descInput ? descInput.value.trim() !== (original.description || '').trim() : false)
        || (extInput  ? extInput.value.trim()  !== (original.extendedDescription || '').trim() : false);
    }

function hasConnectionChanges(original) {
      const typeSel   = document.getElementById('connType');
      const weightSel = document.getElementById('connWeight');
      const bidirBox  = document.getElementById('connBidirectional');
      const descInput = document.getElementById('connDescription');
      if (!typeSel || !weightSel) return false;

      const srcNow = ModalContext.editState.selectedSource;
      const tgtNow = ModalContext.editState.selectedTarget;
      const srcWas = original.source ? (original.source.id || original.source) : null;
      const tgtWas = original.target ? (original.target.id || original.target) : null;

      // У симметричного типа взаимность не выбирают: форма ставит флажок
      // сама и блокирует его, а сохранение всё равно запишет true.
      // Сравнивать тут нечего — иначе всякая связь симметричного типа
      // с bidirectional: false объявлялась бы изменённой сразу при открытии.
      const t = DATA.relationTypesObj[typeSel.value] || {};
      const bidirChanged = (bidirBox && !t.symmetric)
        ? bidirBox.checked !== !!original.bidirectional : false;

      return typeSel.value !== original.type
        || parseInt(weightSel.value, 10) !== (original.weight || 2)
        || bidirChanged
        || (descInput ? descInput.value.trim() !== (original.description || '').trim() : false)
        || (srcNow !== undefined && srcNow !== srcWas)
        || (tgtNow !== undefined && tgtNow !== tgtWas);
    }

export { hasConceptChanges, hasConnectionChanges, hasFilledFields, hasPhilosopherChanges, hasUnsavedChanges };
