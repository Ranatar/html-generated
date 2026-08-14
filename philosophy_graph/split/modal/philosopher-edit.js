// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, VIEWS } from '../core/ns.js';
import { createNewConceptForPhilosopher } from './connection-edit.js';
import { openUniversalModal } from './core.js';
import { modalActions, syncPhilColorFromPicker, updatePhilColorSample } from './edit-common.js';
import { openEditConceptModal } from './entry.js';
import { deletePhilosopher, savePhilosopherData } from './persist.js';
import { escapeAttr } from '../util/html.js';

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
                  title="Просмотр"
                  data-act-click="open-universal-modal-7" data-a1="${c.id}">👁️</button>
              <button class="modal-btn-secondary" style="flex:none;padding:6px 10px;"
                  title="Редактировать"
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
