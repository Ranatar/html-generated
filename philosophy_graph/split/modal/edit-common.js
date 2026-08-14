// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { closeUniversalModal } from './core.js';
import { getContrastColor } from '../util/format.js';

function modalActions(saveFn, deleteFn, deleteArg, isNew) {
      return `
        <div class="modal-actions">
          <button class="modal-btn modal-btn-primary" data-act-click="сохранить-сущность" data-a1="${saveFn}">
            💾 Сохранить
          </button>
          <button class="modal-btn modal-btn-secondary" data-act-click="close-universal-modal">
            ✖️ Отмена
          </button>
          ${isNew ? '' : `
            <button class="modal-btn modal-btn-danger" data-act-click="удалить-сущность" data-a1="${deleteFn}" data-a2="${(deleteArg || [])[0] || ''}" data-a3="${(deleteArg || [])[1] || ''}">
              🗑️ Удалить
            </button>`}
        </div>`;
    }

function updatePhilColorSample() {
      const hexField = document.getElementById('philColorHex');
      const picker   = document.getElementById('philColor');
      const sample   = document.getElementById('philColorSample');
      const nameEl   = document.getElementById('philName');
      if (!picker || !sample) return;
      let value = picker.value;
      if (hexField && /^#[0-9a-fA-F]{6}$/.test(hexField.value.trim())) {
        value = hexField.value.trim().toLowerCase();
        picker.value = value;
      }
      if (hexField && document.activeElement !== hexField) hexField.value = value;
      sample.style.background = value;
      sample.style.color = getContrastColor(value);
      sample.textContent = (nameEl && nameEl.value.trim())
        ? nameEl.value.trim() : 'Образец подписи';
    }

function syncPhilColorFromPicker() {
      const hexField = document.getElementById('philColorHex');
      const picker   = document.getElementById('philColor');
      if (hexField && picker) hexField.value = picker.value;
      updatePhilColorSample();
    }

export { modalActions, syncPhilColorFromPicker, updatePhilColorSample };
