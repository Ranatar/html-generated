// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, VIEWS } from '../core/ns.js';
import { isReflexiveLink } from '../core/link-facts.js';
import { relationHint } from '../core/relation-types.js';
import { getConceptConnections } from '../graph/graph-data.js';
import { modalActions } from './assembly.js';

import { стрелкаСвязи } from './connection-view.js';

import { getContrastColor } from '../util/color.js';
import { escapeAttr } from '../util/html.js';
import { philosopherYears, sortPhilosophersByBirth } from '../util/philosopher-label.js';

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

VIEWS.generatePhilosopherEditContent = function generatePhilosopherEditContent(philosopherName) {
      const philosopherData = philosopherName
        ? DATA.philosophers.find(p => p.nameRu === philosopherName) : null;
      const isNew = !philosopherData;

      let html = `
        <h2>${isNew ? 'Создать философа' : 'Редактировать философа'}</h2>

        <div class="modal-form-group">
          <label for="philName">Имя *</label>
          <input type="text" id="philName"
               value="${escapeAttr(philosopherData ? philosopherData.nameRu : '')}"
               placeholder="Например: Иммануил Кант"
               data-act-input="update-phil-color-sample-input">
        </div>

        <div class="modal-form-group">
          <label for="philColor">Цвет системы</label>
          <div class="modal-form-color-row">
            <input type="color" id="philColor"
                 value="${(philosopherData ? philosopherData.color : '#6c5ce7').toLowerCase()}"
                 data-act-input="sync-phil-color-from-picker-input">
            <input type="text" id="philColorHex"
                 value="${(philosopherData ? philosopherData.color : '#6c5ce7').toLowerCase()}"
                 placeholder="#6c5ce7"
                 data-act-input="update-phil-color-sample-input">
            <div class="modal-form-color-sample" id="philColorSample"></div>
          </div>
          <div class="modal-form-note">
            Заливки в базе идут от тёмных до очень светлых; подпись
            на плашке считается по яркости, и образец показывает,
            каким цветом она выйдет.
          </div>
        </div>

        <div class="modal-form-inline">
          <div class="modal-form-group">
            <label for="philBirth">Год рождения</label>
            <input type="number" id="philBirth"
                 value="${philosopherData && philosopherData.birth != null ? philosopherData.birth : ''}"
                 placeholder="1724">
          </div>
          <div class="modal-form-group">
            <label for="philDeath">Год смерти</label>
            <input type="number" id="philDeath"
                 value="${philosopherData && philosopherData.death != null ? philosopherData.death : ''}"
                 placeholder="1804">
          </div>
        </div>
        <div class="modal-form-note">
          До нашей эры — отрицательным числом: −515 выведется как «515 до н.э.».
        </div>

        <div class="modal-form-group">
          <label for="philTraditions">Традиции</label>
          <select id="philTraditions" multiple size="6">
            ${DATA.traditions.map(t => {
              const on = philosopherData
                && (philosopherData.traditions || []).includes(t.id);
              return `<option value="${t.id}" ${on ? 'selected' : ''}>${t.name}</option>`;
            }).join('')}
          </select>
          <div class="modal-form-note">
            Традиций может быть несколько — держите Ctrl. Признак читается
            как «в какой традиции его рассматривают», а не «к какой школе он
            принадлежал»: второе для доброй половины корпуса просто ложно.
          </div>
        </div>

        <div class="modal-form-group">
          <label for="philDescription">Описание</label>
          <textarea id="philDescription" rows="10"
                placeholder="Подробное описание философа...">${philosopherData ? philosopherData.description || '' : ''}</textarea>
        </div>
      `;

      if (philosopherData) {
        const own = DATA.nodes.filter(n => n.concept === philosopherName);
        html += `
          <div class="modal-section-title">
            💡 Концепции философа (${own.length})
          </div>
          <div class="modal-edit-list">`;
        own.forEach(c => {
          html += `
            <div class="modal-edit-list-item">
              <div class="modal-edit-list-item-content">
                <strong>${c.label}</strong>${c.description ? ' — ' + c.description : ''}
              </div>
              <button class="modal-btn-secondary" style="flex:none;padding:6px 10px;"
                  data-tip="Просмотр"
                  data-act-click="open-universal-modal-7" data-a1="${c.id}">👁️</button>
              <button class="modal-btn-secondary" style="flex:none;padding:6px 10px;"
                  data-tip="Редактировать"
                  data-act-click="open-edit-concept-modal" data-a1="${c.id}">✏️</button>
            </div>`;
        });
        html += `
            <button class="modal-edit-list-btn-add"
                data-act-click="create-new-concept-for-philosopher" data-a1="${escapeAttr(philosopherName)}">
              + Добавить концепцию
            </button>
          </div>`;
      }

      html += modalActions('savePhilosopherData', 'deletePhilosopher',
                 philosopherData ? [philosopherName] : [],
                 isNew);

      // образец подписи рисуется после вставки разметки
      setTimeout(updatePhilColorSample, 0);
      return html;
    };

VIEWS.generateConceptEditContent = function generateConceptEditContent(conceptData) {
      const isNew = !conceptData || !conceptData.id;
      const preset = (conceptData && conceptData.concept) || '';

      let html = `
        <h2>${isNew ? 'Создать концепцию' : 'Редактировать концепцию'}</h2>

        <div class="modal-form-group">
          <label for="conceptLabel">Название концепции *</label>
          <input type="text" id="conceptLabel"
               value="${escapeAttr(conceptData ? conceptData.label : '')}"
               placeholder="Например: Категорический императив">
        </div>

        <div class="modal-form-group">
          <label for="conceptPhilosopher">Философ *</label>
          <select id="conceptPhilosopher">
            <option value="">Выберите философа</option>
            ${sortPhilosophersByBirth(Object.keys(DATA.philosopherConcepts)).map(phil => `
              <option value="${escapeAttr(phil)}" ${preset === phil ? 'selected' : ''}>
                ${phil} (${philosopherYears(phil)})
              </option>`).join('')}
          </select>
        </div>

        <div class="modal-form-group">
          <label for="conceptRubric">Рубрики</label>
          <select id="conceptRubric" multiple size="5">
            ${DATA.rubrics.map(r => {
              const on = conceptData && conceptData.id
                && (DATA.conceptToRubrics[conceptData.id] || []).includes(r.id);
              return `<option value="${r.id}" ${on ? 'selected' : ''}>${r.name}</option>`;
            }).join('')}
          </select>
          <div class="modal-form-note">
            Рубрик у концепции может быть несколько — держите Ctrl.
          </div>
        </div>

        <div class="modal-form-group">
          <label for="conceptDescription">Краткое описание</label>
          <textarea id="conceptDescription" rows="2"
                placeholder="Краткое описание концепции">${conceptData ? conceptData.description || '' : ''}</textarea>
        </div>

        <div class="modal-form-group">
          <label for="conceptExtendedDescription">Расширенное описание</label>
          <textarea id="conceptExtendedDescription" rows="6"
                placeholder="Подробное описание концепции">${conceptData ? conceptData.extendedDescription || '' : ''}</textarea>
        </div>
      `;

      if (conceptData && conceptData.id) {
        const own = getConceptConnections(conceptData.id);
        const internal = [], external = [];
        own.forEach(conn => {
          const srcId = conn.source.id || conn.source;
          const tgtId = conn.target.id || conn.target;
          const otherId = srcId === conceptData.id ? tgtId : srcId;
          const other = DATA.nodes.find(n => n.id === otherId);
          if (!other) return;
          const rec = { conn, other, isSource: srcId === conceptData.id,
                  reflexive: isReflexiveLink(conn) };
          (other.concept === conceptData.concept ? internal : external).push(rec);
        });

        const row = ({ conn, other, isSource, reflexive }) => {
          const t = DATA.relationTypesObj[conn.type] || {};
          const srcId = conn.source.id || conn.source;
          const tgtId = conn.target.id || conn.target;
          const arrow = reflexive ? '↺'
                : (conn.bidirectional || t.symmetric ? '↔' : (isSource ? '→' : '←'));
          const hint = escapeAttr(typeof relationHint === 'function'
            ? relationHint(conn.type) : (t.label || conn.type));
          const color = DATA.philosopherConcepts[other.concept]
            ? DATA.philosopherConcepts[other.concept].color : '#6c5ce7';
          // U-1: сюда в unimod подставлялся JSON.stringify(conn),
          // и двойные кавычки JSON обрывали атрибут onclick.
          // Передаём пару идентификаторов.
          return `
            <div class="modal-edit-list-item">
              <div class="concept-color" style="background:${color};flex:none;"></div>
              ${стрелкаСвязи(arrow, t.color || '#95a5a6', conn.weight, hint, 'flex:none;')}
              <div class="modal-edit-list-item-content">
                <strong>${reflexive ? 'сама на себя' : other.label}</strong>
                <div style="font-size:11px;color: var(--fg-muted);">
                  ${t.label || conn.type} · вес ${conn.weight || 2}${conn.description ? '' : ' · без описания'}
                </div>
              </div>
              <button class="modal-btn-secondary" style="flex:none;padding:6px 10px;"
                  data-tip="Просмотр связи"
                  data-act-click="open-universal-modal-8" data-a1="${srcId}" data-a2="${tgtId}">🔗</button>
              <button class="modal-btn-secondary" style="flex:none;padding:6px 10px;"
                  data-tip="Редактировать связь"
                  data-act-click="open-edit-connection-modal" data-a1="${srcId}" data-a2="${tgtId}">✏️</button>
              <button class="modal-edit-list-btn" style="flex:none;"
                  data-tip="Удалить связь"
                  data-act-click="delete-connection" data-a1="${srcId}" data-a2="${tgtId}">🗑️</button>
            </div>`;
        };

        html += `<div class="modal-section-title">🔗 Связи концепции (${own.length})</div>
             <div class="modal-edit-list">`;
        if (internal.length) {
          html += `<div class="modal-edit-list-header"><div class="modal-edit-list-title">
               Внутри системы ${conceptData.concept} (${internal.length})</div></div>`;
          html += internal.map(row).join('');
        }
        if (external.length) {
          html += `<div class="modal-edit-list-header" style="margin-top:10px;">
               <div class="modal-edit-list-title">С другими системами (${external.length})</div></div>`;
          html += external.map(row).join('');
        }
        if (!own.length) {
          html += `<div style="padding:12px;color: var(--fg-muted);font-size:12px;">
                Связей нет: концепция изолирована.
               </div>`;
        }
        html += `
            <button class="modal-edit-list-btn-add"
                data-act-click="create-new-connection-for-concept" data-a1="${conceptData.id}">
              + Добавить связь
            </button>
          </div>`;
      }

      html += modalActions('saveConceptData', 'deleteConcept',
                 conceptData && conceptData.id ? [conceptData.id] : [],
                 isNew);
      return html;
    };

export { syncPhilColorFromPicker, updatePhilColorSample };
