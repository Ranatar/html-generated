// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, VIEWS } from '../core/ns.js';
import { isReflexiveLink } from '../core/link-facts.js';
import { WEIGHT_OPTIONS, relationHint } from '../core/relation-types.js';
import { внутренностиСтроки, отобратьКонцепции, пустойСписок } from '../core/search.js';
import { connectionsBetween } from '../graph/graph-data.js';
import { modalActions } from './assembly.js';
import { initConnectionSearchFields } from './connection-view.js';
import { ModalContext } from './context.js';
import { openUniversalModal } from './core.js';

import { escapeAttr } from '../util/html.js';

function onConnTypeChange() {
      const sel = document.getElementById('connType');
      const note = document.getElementById('connTypeNote');
      const bidir = document.getElementById('connBidirectional');
      const bidirNote = document.getElementById('connBidirNote');
      if (!sel) return;
      const t = DATA.relationTypesObj[sel.value] || {};
      if (note) {
        const parts = [];
        if (t.ground) {
          parts.push('Основание в <strong>'
            + (t.ground === 'source' ? 'источнике' : 'цели') + '</strong>: '
            + (t.ground === 'source'
               ? 'начальная концепция обосновывает конечную'
               : 'конечная концепция обосновывает начальную') + '.');
        }
        if (t.layer) parts.push('Слой: ' + t.layer + '.');
        const n = DATA.links.filter(l => l.type === sel.value).length;
        if (sel.value) parts.push('Рёбер этого типа в базе: ' + n + '.');
        note.innerHTML = parts.join(' ');
        note.style.display = parts.length ? 'block' : 'none';
      }
      if (bidir) {
        if (t.symmetric) {
          bidir.checked = true;
          bidir.disabled = true;
          if (bidirNote) {
            bidirNote.textContent = 'Тип симметричен по определению: направления у отношения нет.';
            bidirNote.style.display = 'block';
          }
        } else {
          bidir.disabled = false;
          if (bidirNote) bidirNote.style.display = 'none';
        }
      }
      updateConnEditPairNote();
    }

function updateConnEditPairNote() {
      const note = document.getElementById('connPairNote');
      if (!note) return;
      const s = ModalContext.editState.selectedSource;
      const t = ModalContext.editState.selectedTarget;
      if (!s || !t) { note.style.display = 'none'; return; }
      const found = connectionsBetween(s, t);
      const sel = document.getElementById('connType');
      const sameType = sel ? found.filter(l => l.type === sel.value).length : 0;
      const parts = [];
      if (s === t) {
        const already = DATA.links.filter(l => isReflexiveLink(l)
          && (!sel || l.type === sel.value)).length;
        parts.push('Это <strong>петля</strong> — связь концепции с самой собой. '
          + (already ? 'Петель этого типа в базе уже ' + already + '.'
                 : 'Петель этого типа в базе пока нет — будет первая.'));
      }
      if (found.length) {
        parts.push('Связей между этой парой уже ' + found.length
          + (sameType ? ', в том числе ' + sameType + ' того же типа' : '') + '.');
      }
      note.innerHTML = parts.join(' ');
      note.className = 'modal-form-note' + (parts.length ? ' warn' : '');
      note.style.display = parts.length ? 'block' : 'none';
    }

function connEditSelectedBlock(type, node) {
      const cap = type.charAt(0).toUpperCase() + type.slice(1);
      const shown = node ? 'block' : 'none';
      return `
        <div id="conn${cap}Selected" style="margin-top:10px;padding:10px;background:rgba(162,155,254,0.1);border-radius:6px;display:${shown};">
          Выбрано: <strong id="conn${cap}Label">${node ? node.label : ''}</strong>
          <div style="font-size:11px;color: var(--fg-muted);margin-top:4px;" id="conn${cap}Phil">${node ? node.concept : ''}</div>
        </div>`;
    }

VIEWS.generateConnectionEditContent = function generateConnectionEditContent(connectionData) {
      const isNew = !connectionData
             || (!connectionData.source && !connectionData.from);

      const srcId = connectionData
        ? ((connectionData.source && connectionData.source.id)
           || connectionData.source || connectionData.from || null) : null;
      const tgtId = connectionData
        ? ((connectionData.target && connectionData.target.id)
           || connectionData.target || connectionData.to || null) : null;

      ModalContext.editState.selectedSource = srcId;
      ModalContext.editState.selectedTarget = tgtId;

      const srcNode = srcId ? DATA.nodes.find(n => n.id === srcId) : null;
      const tgtNode = tgtId ? DATA.nodes.find(n => n.id === tgtId) : null;

      let html = `
        <h2>${isNew ? 'Создать связь' : 'Редактировать связь'}</h2>

        <div class="modal-form-group">
          <label for="connType">Тип связи *</label>
          <select id="connType" data-act-change="on-conn-type-change-change">
            <option value="">Выберите тип связи</option>
            ${Object.entries(DATA.relationTypesObj).map(([id, data]) => `
              <option value="${id}"
                  data-tip="${escapeAttr(typeof relationHint === 'function' ? relationHint(id) : data.label)}"
                  ${connectionData && connectionData.type === id ? 'selected' : ''}>
                ${data.label}
              </option>`).join('')}
          </select>
          <div class="modal-form-note" id="connTypeNote" style="display:none;"></div>
        </div>

        <div class="modal-form-group">
          <label for="connWeight">Вес связи *</label>
          <select id="connWeight">
            ${WEIGHT_OPTIONS.map(([v, label]) => `
              <option value="${v}" ${(connectionData ? (connectionData.weight || 2) : 2) === v ? 'selected' : ''}>
                ${label}
              </option>`).join('')}
          </select>
        </div>

        <div class="modal-form-checkbox">
          <input type="checkbox" id="connBidirectional"
               ${connectionData && connectionData.bidirectional ? 'checked' : ''}>
          <label for="connBidirectional">Взаимная связь</label>
        </div>
        <div class="modal-form-note" id="connBidirNote" style="display:none;"></div>

        <div class="modal-form-group">
          <label>Начальная концепция *</label>
          <div class="modal-concept-search">
            <input type="text" id="connSourceSearch" placeholder="Поиск концепции...">
            <div class="modal-concept-search-results" id="connSourceResults"></div>
          </div>
          ${connEditSelectedBlock('source', srcNode)}
        </div>

        <div style="text-align:center;margin:15px 0;">
          <button class="modal-btn-secondary" style="padding:8px 20px;"
              data-act-click="swap-connection-concepts">⇅ Поменять местами</button>
        </div>

        <div class="modal-form-group">
          <label>Конечная концепция *</label>
          <div class="modal-concept-search">
            <input type="text" id="connTargetSearch" placeholder="Поиск концепции...">
            <div class="modal-concept-search-results" id="connTargetResults"></div>
          </div>
          ${connEditSelectedBlock('target', tgtNode)}
        </div>

        <div class="modal-form-note" id="connPairNote" style="display:none;"></div>

        <div class="modal-form-group">
          <label for="connDescription">Описание связи</label>
          <textarea id="connDescription" rows="4"
                placeholder="Две фразы: первая называет отношение и даёт краткую формулу, вторая разворачивает">${connectionData ? connectionData.description || '' : ''}</textarea>
          <div class="modal-form-note">
            Описания в базе — 190–270 знаков, две фразы.
          </div>
        </div>
      `;

      html += modalActions('saveConnectionData', 'deleteConnection',
                 (srcId && tgtId) ? [srcId, tgtId] : [],
                 isNew);

      setTimeout(() => {
        setupConnectionEditSearchHandlers();
        onConnTypeChange();
      }, 0);
      return html;
    };

function handleConnectionEditSearch(type, query) {
      const cap = type.charAt(0).toUpperCase() + type.slice(1);
      const box = document.getElementById(`conn${cap}Results`);
      if (!box) return;

      // Список выпадает весь, как в окне просмотра связи: прежде пустой
      // запрос закрывал его, а найденное урезалось шестьюдесятью строками.
      const results = отобратьКонцепции(query);

      if (!results.length) {
        box.innerHTML = пустойСписок();
        box.classList.add('show');
        return;
      }

      const other = ModalContext.editState[
        type === 'source' ? 'selectedTarget' : 'selectedSource'];
      box.innerHTML = results.map(n => {
        const связей = other ? connectionsBetween(n.id, other).length : 0;
        const хвост = связей
          ? `<div class="concept-row-note" data-tip="Связей с уже выбранной концепцией">${связей} св.</div>`
          : '';
        return `
          <div class="concept-row" data-act-click="select-connection-edit-concept" data-a1="${type}" data-a2="${n.id}">
            ${внутренностиСтроки(n, хвост)}
          </div>`;
      }).join('');
      box.classList.add('show');
    }

function selectConnectionEditConcept(type, conceptId) {
      const node = DATA.nodes.find(n => n.id === conceptId);
      if (!node) return;
      const cap = type.charAt(0).toUpperCase() + type.slice(1);
      ModalContext.editState[`selected${cap}`] = conceptId;

      const box = document.getElementById(`conn${cap}Results`);
      if (box) box.classList.remove('show');
      const input = document.getElementById(`conn${cap}Search`);
      if (input) input.value = '';
      const sel = document.getElementById(`conn${cap}Selected`);
      if (sel) {
        sel.style.display = 'block';
        document.getElementById(`conn${cap}Label`).textContent = node.label;
        document.getElementById(`conn${cap}Phil`).textContent = node.concept;
      }
      updateConnEditPairNote();
    }

function setupConnectionEditSearchHandlers() {
      [['source', 'Source'], ['target', 'Target']].forEach(([type, cap]) => {
        const input = document.getElementById(`conn${cap}Search`);
        if (!input || input.dataset.wired === '1') return;
        input.dataset.wired = '1';
        const run = e => handleConnectionEditSearch(type, e.target.value);
        input.addEventListener('input', run);
        input.addEventListener('focus', run);
      });
      if (typeof initConnectionSearchFields === 'function') {
        initConnectionSearchFields('edit');
      }
    }

function swapConnectionConcepts() {
      const s = ModalContext.editState.selectedSource;
      ModalContext.editState.selectedSource = ModalContext.editState.selectedTarget;
      ModalContext.editState.selectedTarget = s;

      [['source', 'Source'], ['target', 'Target']].forEach(([type, cap]) => {
        const id = ModalContext.editState[`selected${cap}`];
        const node = id ? DATA.nodes.find(n => n.id === id) : null;
        const sel = document.getElementById(`conn${cap}Selected`);
        if (!sel) return;
        if (node) {
          sel.style.display = 'block';
          document.getElementById(`conn${cap}Label`).textContent = node.label;
          document.getElementById(`conn${cap}Phil`).textContent = node.concept;
        } else {
          sel.style.display = 'none';
        }
      });
      updateConnEditPairNote();
    }

function createNewConceptForPhilosopher(philosopherName) {
      openUniversalModal('concept', { concept: philosopherName }, 'edit');
    }

function createNewConnectionForConcept(conceptId) {
      const node = DATA.nodes.find(n => n.id === conceptId);
      if (!node) return;
      openUniversalModal('connection', { source: conceptId, target: null,
                         type: '', weight: 2,
                         bidirectional: false, description: '' }, 'edit');
    }

export { connEditSelectedBlock, createNewConceptForPhilosopher, createNewConnectionForConcept, handleConnectionEditSearch, onConnTypeChange, selectConnectionEditConcept, setupConnectionEditSearchHandlers, swapConnectionConcepts, updateConnEditPairNote };
