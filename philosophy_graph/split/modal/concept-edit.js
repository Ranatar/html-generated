// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, VIEWS } from '../core/ns.js';
import { findConnection, getConceptConnections } from '../core/graph-index.js';
import { relationHint } from '../core/labels.js';
import { isReflexiveLink } from '../core/predicates.js';
import { createNewConnectionForConcept } from './connection-edit.js';
import { openUniversalModal } from './core.js';
import { modalActions } from './edit-common.js';
import { openEditConnectionModal } from './entry.js';
import { deleteConcept, deleteConnection, saveConceptData } from './persist.js';
import { philosopherYears, sortPhilosophersByBirth } from '../util/format.js';
import { escapeAttr } from '../util/html.js';

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
              <div class="connection-arrow cw-${conn.weight || 2}"
                 style="color:${t.color || '#95a5a6'};flex:none;" title="${hint}">${arrow}</div>
              <div class="modal-edit-list-item-content">
                <strong>${reflexive ? 'сама на себя' : other.label}</strong>
                <div style="font-size:11px;color: var(--fg-muted);">
                  ${t.label || conn.type} · вес ${conn.weight || 2}${conn.description ? '' : ' · без описания'}
                </div>
              </div>
              <button class="modal-btn-secondary" style="flex:none;padding:6px 10px;"
                  title="Просмотр связи"
                  data-act-click="open-universal-modal" data-a1="${srcId}" data-a2="${tgtId}">🔗</button>
              <button class="modal-btn-secondary" style="flex:none;padding:6px 10px;"
                  title="Редактировать связь"
                  data-act-click="open-edit-connection-modal" data-a1="${srcId}" data-a2="${tgtId}">✏️</button>
              <button class="modal-edit-list-btn" style="flex:none;"
                  title="Удалить связь"
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
