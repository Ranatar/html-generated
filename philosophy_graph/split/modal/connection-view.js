// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, VIEWS } from '../core/ns.js';
import { connectionsBetween, traditionsOfPhilosopher } from '../core/graph-index.js';
import { CONN_WEIGHT_WORDS, relationHint } from '../core/labels.js';
import { isReflexiveLink } from '../core/predicates.js';
import { selectConceptOnGraph } from '../data/mutate.js';
import { ModalContext } from './context.js';
import { openUniversalModal } from './core.js';
import { getContrastColor } from '../util/format.js';

function conceptCircle(node, size) {
      const color = DATA.philosopherConcepts[node.concept]
        ? DATA.philosopherConcepts[node.concept].color : '#6c5ce7';
      return `<div style="width:${size}px;height:${size}px;border-radius:50%;`
         + `background:${color};margin:0 auto 8px;box-shadow:0 0 15px ${color};"></div>`;
    }

function conceptPlate(node) {
      const color = DATA.philosopherConcepts[node.concept]
        ? DATA.philosopherConcepts[node.concept].color : '#6c5ce7';
      return `
        <div style="text-align:center;flex:1;min-width:0;">
          ${conceptCircle(node, 40)}
          <div style="font-weight:600;color:#a29bfe;font-size:13px;cursor:pointer;margin-bottom:4px;word-break:break-word;"
             data-act-click="open-universal-modal-5" data-a1="${node.id}">
            ${node.label}
          </div>
          <div class="philosopher-tag" style="display:inline-block;background:${color};color:${getContrastColor(color)};font-size:10px;padding:2px 8px;cursor:pointer;"
             data-act-click="open-universal-modal-6" data-a1="${node.concept}">
            ${node.concept}
          </div>
        </div>`;
    }

function connectionTraditionNote(aPhil, bPhil) {
      if (aPhil === bPhil) return { crossing: false, text: 'внутри одной системы' };
      const ta = DATA.philosopherTraditions[aPhil] || [];
      const tb = DATA.philosopherTraditions[bPhil] || [];
      const shared = ta.filter(x => tb.includes(x))
        .map(id => (DATA.traditions.find(t => t.id === id) || {}).name)
        .filter(Boolean);
      if (shared.length) return { crossing: false, text: 'общая — ' + shared.join(', ') };
      const from = traditionsOfPhilosopher(aPhil);
      const to = traditionsOfPhilosopher(bPhil);
      return { crossing: true,
           text: (from.join(', ') || '—') + ' → ' + (to.join(', ') || '—') };
    }

function connectionArrowSvg(conn, index) {
      const t = DATA.relationTypesObj[conn.type] || {};
      const color = t.color || '#95a5a6';
      const label = t.label || conn.type;
      const sw = 2 + (conn.weight || 2) * 0.6;   // вес виден толщиной
      const id = `conn-viz-${index}`;

      if (isReflexiveLink(conn)) {
        // Петля: у связи source === target, и стрелка «слева направо»
        // для неё лгала бы о двух разных концах.
        return `
          <svg width="160" height="90" style="display:block;margin:0 auto;" role="img">
            <defs>
              <marker id="${id}-loop" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                <polygon points="0,0 10,5 0,10" fill="${color}" />
              </marker>
            </defs>
            <path d="M 60 70 A 30 30 0 1 1 100 70" fill="none"
                stroke="${color}" stroke-width="${sw}"
                marker-end="url(#${id}-loop)" />
            <text x="80" y="16" text-anchor="middle" fill="${color}"
                font-size="11px" font-weight="600">${label}</text>
          </svg>`;
      }

      const W = 260, H = 60;
      if (conn.bidirectional || t.symmetric) {
        // orient="auto-start-reverse" разворачивает начальный маркер;
        // с обычным auto вышло бы >-> вместо <->
        return `
          <svg width="${W}" height="${H}" style="display:block;margin:0 auto;" role="img">
            <defs>
              <marker id="${id}-s" markerWidth="10" markerHeight="10" refX="1" refY="5" orient="auto-start-reverse">
                <polygon points="0,0 10,5 0,10" fill="${color}" />
              </marker>
              <marker id="${id}-e" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                <polygon points="0,0 10,5 0,10" fill="${color}" />
              </marker>
            </defs>
            <line x1="20" y1="${H / 2}" x2="${W - 20}" y2="${H / 2}"
                stroke="${color}" stroke-width="${sw}"
                marker-start="url(#${id}-s)" marker-end="url(#${id}-e)" />
            <text x="${W / 2}" y="${H / 2 - 10}" text-anchor="middle"
                fill="${color}" font-size="11px" font-weight="600">${label}</text>
          </svg>`;
      }
      return `
        <svg width="${W}" height="${H}" style="display:block;margin:0 auto;" role="img">
          <defs>
            <marker id="${id}-e" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <polygon points="0,0 10,5 0,10" fill="${color}" />
            </marker>
          </defs>
          <line x1="20" y1="${H / 2}" x2="${W - 20}" y2="${H / 2}"
              stroke="${color}" stroke-width="${sw}"
              marker-end="url(#${id}-e)" />
          <text x="${W / 2}" y="${H / 2 - 10}" text-anchor="middle"
              fill="${color}" font-size="11px" font-weight="600">${label}</text>
        </svg>`;
    }

function generateConnectionVisualization(sourceNode, targetNode, connectionData) {
      const sourceId = sourceNode.id;
      const targetId = targetNode.id;
      const found = connectionsBetween(sourceId, targetId);

      let html = `<div id="connectionVisualization">
        <div class="modal-section-title" style="margin-bottom:15px;">
          🔗 ${found.length === 1 ? 'Связь' : `Найденные связи (${found.length})`}
        </div>`;

      if (found.length === 0) {
        html += `<div style="text-align:center;color:#e74c3c;padding:40px;font-size:13px;">
              ⚠️ Связь между выбранными концепциями не найдена
             </div></div>`;
        return html;
      }

      found.forEach((conn, index) => {
        const t = DATA.relationTypesObj[conn.type] || {};
        const srcId = conn.source.id || conn.source;
        const reflexive = isReflexiveLink(conn);
        // направление показывается относительно выбранного порядка концов
        const forward = srcId === sourceId;
        const dispSrc = reflexive ? sourceNode : (forward ? sourceNode : targetNode);
        const dispTgt = reflexive ? sourceNode : (forward ? targetNode : sourceNode);
        const hint = (typeof relationHint === 'function'
          ? relationHint(conn.type) : (t.label || conn.type))
          .replace(/"/g, '&quot;');
        const weightWord = CONN_WEIGHT_WORDS[conn.weight || 2] || 'обычная';
        const groundWord = t.ground
          ? (t.ground === 'source' ? 'в источнике' : 'в цели') : null;
        // Слой — свойство ТИПА, и оно уже читается из подсказки к строке
        // «Тип»; о самой связи оно не говорит ничего. Пересечение традиций,
        // наоборот, есть свойство именно этой связи и больше нигде в окне
        // не показано.
        const trNote = connectionTraditionNote(dispSrc.concept, dispTgt.concept);

        html += `
          <div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:20px;margin-bottom:15px;border:1px solid rgba(255,255,255,0.1);">
            <div style="display:flex;justify-content:space-around;align-items:flex-start;gap:10px;margin-bottom:10px;">
              ${reflexive ? '' : conceptPlate(dispSrc)}
              <div style="flex:1.4;display:flex;align-items:center;justify-content:center;" title="${hint}">
                ${connectionArrowSvg(conn, index)}
              </div>
              ${reflexive ? conceptPlate(dispSrc) : conceptPlate(dispTgt)}
            </div>

            <div style="margin-top:15px;padding-top:15px;border-top:1px solid rgba(255,255,255,0.1);">
              <div style="display:flex;flex-wrap:wrap;gap:8px 20px;font-size:12px;color: var(--fg-muted);">
                <div><strong>Тип:</strong> <span title="${hint}" style="border-bottom: 1px dotted var(--fg-muted);cursor:help;">${t.label || conn.type}</span></div>
                <div><strong>Вес:</strong> ${conn.weight || 2} — ${weightWord}</div>
                <div><strong>Направление:</strong> ${
                  reflexive ? 'рефлексивная (петля)'
                  : (conn.bidirectional ? 'взаимная'
                     : (t.symmetric ? 'тип симметричен' : 'односторонняя'))
                }</div>
                ${groundWord ? `<div><strong>Основание:</strong> ${groundWord}</div>` : ''}
                <div><strong>Традиции:</strong> ${trNote.crossing
                  ? `<span style="color:#f39c12;">пересекает — ${trNote.text}</span>`
                  : trNote.text}</div>
              </div>
              ${conn.description ? `
                <div class="connection-description show" style="margin-top:10px;padding:10px;background:rgba(108,92,231,0.1);border-radius:6px;font-size:12px;color:#e0e0e0;line-height:1.5;">
                  ${conn.description}
                </div>` : `
                <div style="margin-top:10px;font-size:11px;color: var(--fg-muted);font-style:italic;">
                  Описания у этой связи нет
                </div>`}
            </div>
          </div>`;
      });

      html += `</div>`;
      return html;
    }

VIEWS.generateConnectionViewContent = function generateConnectionViewContent(connectionData) {
      const has = connectionData
           && (connectionData.source || connectionData.from)
           && (connectionData.target || connectionData.to);

      let html = `<h2>Просмотр связи</h2>`;

      if (has) {
        const sourceId = (connectionData.source && connectionData.source.id)
                || connectionData.source || connectionData.from;
        const targetId = (connectionData.target && connectionData.target.id)
                || connectionData.target || connectionData.to;
        const sourceNode = DATA.nodes.find(n => n.id === sourceId);
        const targetNode = DATA.nodes.find(n => n.id === targetId);
        if (!sourceNode || !targetNode) {
          return '<p>Ошибка: не удалось найти концепции связи</p>';
        }

        // Пересобираем целиком, а не дописываем: признак собственного
        // выбора от ПРЕДЫДУЩЕГО окна переживал открытие нового и сужал
        // поиск по концепции, которой в этой связи уже нет.
        ModalContext.editState.connectionView = {
          selectedSource: sourceId, selectedTarget: targetId,
          pickedSource: false, pickedTarget: false
        };

        html += generateConnectionVisualization(sourceNode, targetNode, connectionData);
        html += `
          <div class="modal-section-title" style="margin-top:25px;cursor:pointer;"
             data-act-click="toggle-connection-search-section">
            🔍 Поиск другой связи
            <span id="toggleConnectionSearch" style="float:right;">▼</span>
          </div>
          <div id="connectionSearchSection" style="display:none;">`;
      } else {
        ModalContext.editState.connectionView = {
          selectedSource: null, selectedTarget: null,
          pickedSource: false, pickedTarget: false
        };
        html += `
          <div class="modal-section-title" style="margin-top:0;">🔍 Поиск связи</div>
          <div id="connectionSearchSection">`;
      }

      const field = (type, label) => {
        const cap = type.charAt(0).toUpperCase() + type.slice(1);
        return `
          <div class="modal-form-group" style="margin-bottom:0;">
            <label>${label}</label>
            <div class="modal-concept-search">
              <input type="text" id="connView${cap}Search"
                   placeholder="Поиск концепции..."
                   data-act-input="handle-connection-view-search-input" data-a1="${type}"
                   data-act-focus="handle-connection-view-search-focus" data-a1="${type}">
              <div class="modal-concept-search-results" id="connView${cap}Results"></div>
            </div>
            <div id="connView${cap}Selected" style="margin-top:10px;padding:10px;background:rgba(162,155,254,0.1);border-radius:6px;display:none;">
              <strong id="connView${cap}Label"></strong>
              <div style="font-size:11px;color: var(--fg-muted);margin-top:4px;" id="connView${cap}Phil"></div>
            </div>
          </div>`;
      };

      html += `
        <div class="modal-form-inline" style="margin:15px 0 25px;">
          ${field('source', 'Начальная концепция')}
          ${field('target', 'Конечная концепция')}
        </div>
      </div>`;

      if (!has) {
        html += `
          <div id="connectionVisualization" style="min-height:150px;">
            <div style="text-align:center;color: var(--fg-muted);padding:40px;font-size:13px;">
              Выберите обе концепции для отображения связи
            </div>
          </div>`;
      }

      return html;
    };

function toggleConnectionSearchSection() {
      const section = document.getElementById('connectionSearchSection');
      const toggle  = document.getElementById('toggleConnectionSearch');
      if (!section) return;
      const hidden = section.style.display === 'none';
      section.style.display = hidden ? 'block' : 'none';
      if (toggle) toggle.textContent = hidden ? '▲' : '▼';
    }

function handleConnectionViewSearch(type, query) {
      const cap = type.charAt(0).toUpperCase() + type.slice(1);
      const box = document.getElementById(`connView${cap}Results`);
      if (!box) return;

      const otherType = type === 'source' ? 'target' : 'source';
      const otherCap  = otherType.charAt(0).toUpperCase() + otherType.slice(1);
      const state = ModalContext.editState.connectionView || {};
      // именно picked, а не selected: предустановка не в счёт
      const other = state[`picked${otherCap}`] ? state[`selected${otherCap}`] : null;

      let pool = DATA.nodes;
      if (other) {
        const linked = new Set();
        DATA.links.forEach(l => {
          const s = l.source.id || l.source, t = l.target.id || l.target;
          if (s === other) linked.add(t);
          if (t === other) linked.add(s);
        });
        pool = DATA.nodes.filter(n => linked.has(n.id));
      }

      // Список выпадает сразу весь, как в панели поиска пути: по фокусу,
      // без запроса, в хронологическом порядке философов. Печать ужимает.
      // Прежде пустой запрос просто закрывал список, и выбрать глазами
      // было нечего. Отсечки по числу тоже нет: панель поиска пути
      // выводит все 453 и прокручивается.
      const q = (query || '').trim().toLowerCase();
      const results = pool.filter(n => !q
          || n.label.toLowerCase().split(/\s+/).some(w => w.startsWith(q))
          || n.concept.toLowerCase().split(/\s+/).some(w => w.startsWith(q)))
        .sort((a, b) => {
          const ao = DATA.philosopherOrder[a.concept] || 0;
          const bo = DATA.philosopherOrder[b.concept] || 0;
          return ao !== bo ? ao - bo : a.label.localeCompare(b.label);
        });

      if (!results.length) {
        box.innerHTML = '<div style="padding:15px;text-align:center;color: var(--fg-muted);font-size:11px;">'
                + (other ? 'Среди связанных концепций ничего не найдено'
                     : 'Ничего не найдено') + '</div>';
        box.classList.add('show');
        return;
      }

      box.innerHTML = results.map(n => {
        const color = DATA.philosopherConcepts[n.concept]
          ? DATA.philosopherConcepts[n.concept].color : '#6c5ce7';
        return `
          <div class="modal-concept-search-item"
             data-act-click="select-connection-view-concept" data-a1="${type}" data-a2="${n.id}">
            <div style="width:12px;height:12px;border-radius:50%;background:${color};box-shadow:0 0 6px ${color};flex:none;"></div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:600;color:#e0e0e0;font-size:13px;">${n.label}</div>
              <div style="font-size:11px;color: var(--fg-muted);font-style:italic;">${n.concept}</div>
            </div>
          </div>`;
      }).join('');
      box.classList.add('show');
    }

function selectConnectionViewConcept(type, conceptId) {
      const node = DATA.nodes.find(n => n.id === conceptId);
      if (!node) return;
      const cap = type.charAt(0).toUpperCase() + type.slice(1);

      if (!ModalContext.editState.connectionView) {
        ModalContext.editState.connectionView = {};
      }
      const st = ModalContext.editState.connectionView;
      st[`selected${cap}`] = conceptId;
      // Собственный выбор — в отличие от предустановленного конца
      // открытой связи: сужает поиск только он.
      st[`picked${cap}`] = true;

      const box = document.getElementById(`connView${cap}Results`);
      if (box) box.classList.remove('show');
      const input = document.getElementById(`connView${cap}Search`);
      if (input) input.value = '';
      const sel = document.getElementById(`connView${cap}Selected`);
      if (sel) {
        sel.style.display = 'block';
        document.getElementById(`connView${cap}Label`).textContent = node.label;
        document.getElementById(`connView${cap}Phil`).textContent = node.concept;
      }
      // Второе поле объявляет сужение, чтобы оно не было молчаливым.
      const otherCap = cap === 'Source' ? 'Target' : 'Source';
      const otherInput = document.getElementById(`connView${otherCap}Search`);
      if (otherInput) {
        otherInput.placeholder = 'Связанные с «' + node.label + '»...';
      }

      updateConnectionVisualization();
    }

function updateConnectionVisualization() {
      const state = ModalContext.editState.connectionView || {};
      const s = state.selectedSource, t = state.selectedTarget;
      const box = document.getElementById('connectionVisualization');
      if (!box) return;
      if (!s || !t) {
        box.innerHTML = `<div style="text-align:center;color: var(--fg-muted);padding:40px;font-size:13px;">
                  Выберите обе концепции для отображения связи
                 </div>`;
        return;
      }
      const sn = DATA.nodes.find(n => n.id === s), tn = DATA.nodes.find(n => n.id === t);
      if (!sn || !tn) return;
      const found = connectionsBetween(s, t);
      // Перерисовываем на месте: полное переоткрытие окна сбросило бы
      // введённое в полях поиска и положило бы лишнюю запись в стек.
      box.outerHTML = generateConnectionVisualization(sn, tn, found[0] || null);
    }

function initConnectionSearchFields(mode = 'edit') {
      if (typeof selectConceptOnGraph !== 'function') return;
      const prefix = mode === 'view' ? 'connView' : 'conn';
      ['Source', 'Target'].forEach(cap => {
        const input = document.getElementById(`${prefix}${cap}Search`);
        if (!input) return;
        const holder = input.parentElement;
        if (!holder || holder.querySelector('.graph-select-btn')) return;
        const btn = document.createElement('button');
        btn.className = 'modal-btn-secondary graph-select-btn';
        btn.innerHTML = '🎯 Выбрать на графе';
        btn.onclick = e => {
          e.preventDefault();
          selectConceptOnGraph(cap.toLowerCase(), mode);
        };
        holder.appendChild(btn);
      });
    }

export { conceptCircle, conceptPlate, connectionArrowSvg, connectionTraditionNote, generateConnectionVisualization, handleConnectionViewSearch, initConnectionSearchFields, selectConnectionViewConcept, toggleConnectionSearchSection, updateConnectionVisualization };
