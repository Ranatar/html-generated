// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { isReflexiveLink } from '../core/predicates.js';
import { isLinkVisible, isNodeVisible } from '../core/visibility.js';
import { LABEL_ALL_ABOVE, LABEL_HIDE_BELOW, arcParams, drawSelfLoop, fillArrow, hasNodeClass, linkDrawAlpha, linkDrawWidth, linkHoverStrokeWidth, linkVisualState, nodeLabelDy, nodeRadius, strokeLink } from './geometry.js';
import { similarityColor } from './similarity-overlay.js';
import { selectedNodes } from '../state.js';

let drawScheduled = false;

function requestDraw() {
      if (drawScheduled) return;
      drawScheduled = true;
      requestAnimationFrame(() => { drawScheduled = false; draw(); });
    }

let animLoopRunning = false;

function graphIsCovered() {
      const ids = ['universalModal', 'conceptProfileModal',
             'philosopherProfileModal', 'pathDescriptionsModal'];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.classList.contains('show')) return true;
      }
      if (typeof S.isStatsModalOpen !== 'undefined' && S.isStatsModalOpen) return true;
      return false;
    }

function needsContinuousAnimation() {
      // Первым делом: закрытый граф не анимируем.
      if (graphIsCovered()) return false;
      if (S.renderState.anim) return true;
      const p = S.renderState.linkClasses["path-highlight"];
      if (p && p.size) return true;
      for (const l of DATA.links) if (l.type === "internal_contradiction" && isLinkVisible(l)) return true;
      return false;
    }

function ensureAnimLoop() {
      if (animLoopRunning) return;
      animLoopRunning = true;
      (function loop() {
        if (!needsContinuousAnimation()) { animLoopRunning = false; draw(); return; }
        draw();
        requestAnimationFrame(loop);
      })();
    }

const DRAW_ORDER = ["dimmed", "normal", "highlighted", "selected", "path"];

function renderScene(c, opts) {
      opts = opts || {};
      const tms = performance.now();
      c.lineCap = "round";
      c.lineJoin = "round";

      // §6.3 / В1: приглушённые снизу, путь сверху — подсветка больше не
      // перекрывается соседними рёбрами (осознанное отступление от Ц2)
      for (const state of DRAW_ORDER) {
        for (const l of DATA.links) {
          if (!isLinkVisible(l)) continue;
          if (linkVisualState(l) !== state) continue;
          const w = linkDrawWidth(l, state);
          c.globalAlpha = linkDrawAlpha(l, state, tms);
          c.strokeStyle = DATA.relationTypesObj[l.type].color;
          c.fillStyle   = DATA.relationTypesObj[l.type].color;
          if (l.type === "internal_contradiction") {
            c.setLineDash([8, 4]);
            c.lineDashOffset = -((tms / 20000) * 1000) % 1000;
          } else if (DATA.relationTypesObj[l.type].symmetric) {
            c.setLineDash([2, 6]);
            c.lineDashOffset = 0;
          } else if (l.bidirectional) {
            c.setLineDash([5, 5]);
            c.lineDashOffset = 0;
          } else {
            c.setLineDash([]);
            c.lineDashOffset = 0;
          }
          if (isReflexiveLink(l)) {
            // Петля: обычная линия между источником и целью
            // выродилась бы в точку, а наконечник — в мусор.
            c.setLineDash([]);
            drawSelfLoop(c, l, w, DATA.relationTypesObj[l.type].color,
                   linkDrawAlpha(l, state, tms));
          } else {
            strokeLink(c, l, w);
            c.setLineDash([]);
            fillArrow(c, l, S.renderState.hoveredLink === l ? linkHoverStrokeWidth(l) : undefined);
          }
        }
      }

      // Р3: дуги к ближайшим — заведомо иным стилем, чем настоящие связи:
      // пунктир, единый цвет, без стрелки. Рисуются под узлами.
      if (S.similarityOverlay && S.similarityOverlay.nearest.length) {
        const src = DATA.nodes.find(n => n.id === S.similarityOverlay.sourceId);
        if (src && src.x !== undefined) {
          c.setLineDash([6, 5]);
          c.lineDashOffset = 0;
          c.globalAlpha = 0.85;
          c.strokeStyle = "#ffd700";
          c.lineWidth = 1.8;
          for (const id of S.similarityOverlay.nearest) {
            const t = DATA.nodes.find(n => n.id === id);
            if (!t || t.x === undefined || !isNodeVisible(t)) continue;
            const p = arcParams(src, t);
            if (!p) continue;
            c.beginPath();
            c.arc(p.cx, p.cy, p.r, p.a0, p.a1, false);
            c.stroke();
          }
          c.setLineDash([]);
        }
      }

      // узлы
      c.globalAlpha = 1;
      c.setLineDash([]);
      for (const pass of ["dimmed", "normal", "top"]) {
        for (const d of DATA.nodes) {
          if (!isNodeVisible(d)) continue;
          const selected  = selectedNodes.has(d) || hasNodeClass("selected", d);
          const highlighted = hasNodeClass("highlighted", d);
          const dimmed    = hasNodeClass("dimmed", d) && !selected && !highlighted;
          const bucket = dimmed ? "dimmed" : (selected || highlighted ? "top" : "normal");
          if (bucket !== pass) continue;

          const r = nodeRadius(d);
          c.globalAlpha = dimmed ? 0.2 : 1;
          // Н2: порог относительный — по самой строке, а не абсолютный
          if (S.similarityOverlay && d.id !== S.similarityOverlay.sourceId) {
            const v = S.similarityOverlay.values.get(d.id);
            const below = S.similarityOverlay.kind === 'structure'
              ? !(v > 0)
              : Math.abs(v || 0) < S.similarityOverlay.dimBelow;
            if (v === undefined || below) c.globalAlpha = 0.18;
          }
          if (selected) { c.shadowColor = "#ffd700"; c.shadowBlur = 15; }
          else if (highlighted) { c.shadowColor = "rgba(255,255,255,0.8)"; c.shadowBlur = 20; }
          else { c.shadowBlur = 0; }
          c.beginPath();
          c.arc(d.x, d.y, r, 0, Math.PI * 2);
          c.fillStyle = DATA.philosopherConcepts[d.concept].color;
          c.fill();
          // Р2: сходство кодируется обводкой, заливка остаётся цветом
          // философа — иначе теряется, КТО автор похожего понятия.
          let simValue = null;
          if (S.similarityOverlay && d.id !== S.similarityOverlay.sourceId) {
            simValue = S.similarityOverlay.values.get(d.id);
          }
          if (simValue !== null && simValue !== undefined && !selected) {
            // Н2: t — доля от максимума строки, поэтому обе меры
            // разворачиваются на полную шкалу цвета и толщины
            const t = Math.max(-1, Math.min(1, simValue / S.similarityOverlay.rowMax));
            const mag = Math.abs(t);
            c.lineWidth   = 2 + mag * 5;
            c.strokeStyle = similarityColor(t);
            if (mag > 0.5) { c.shadowColor = c.strokeStyle; c.shadowBlur = 8 * mag; }
          } else if (S.similarityOverlay && d.id === S.similarityOverlay.sourceId) {
            c.lineWidth = 7;
            c.strokeStyle = "#ffd700";
            c.shadowColor = "#ffd700"; c.shadowBlur = 18;
          } else {
            c.lineWidth   = selected ? 6 : (highlighted ? 5 : 3);
            c.strokeStyle = selected ? "#ffd700" : "#fff";
          }
          c.stroke();
          c.shadowBlur = 0;
        }
      }

      // подписи с LOD (§6.7)
      const k = opts.scale !== undefined ? opts.scale : S.renderState.transform.k;
      if (opts.forceLabels || k >= LABEL_HIDE_BELOW) {
        const onlyImportant = !opts.forceLabels && k < LABEL_ALL_ABOVE;
        c.font = '600 10px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        c.textAlign = "center";
        c.fillStyle = "#fff";
        for (const d of DATA.nodes) {
          if (!isNodeVisible(d)) continue;
          const selected  = selectedNodes.has(d) || hasNodeClass("selected", d);
          const highlighted = hasNodeClass("highlighted", d);
          if (onlyImportant && !selected && !highlighted && S.renderState.hoveredNode !== d) continue;
          c.globalAlpha = (hasNodeClass("dimmed", d) && !selected && !highlighted) ? 0.2 : 1;
          const x = d.x, y = d.y + nodeLabelDy(d);
          // text-shadow: 0 0 4px black трижды
          c.shadowColor = "#000"; c.shadowBlur = 4;
          for (let i = 0; i < 3; i++) c.fillText(d.label, x, y);
          c.shadowBlur = 0;
          c.fillText(d.label, x, y);
        }
      }
      c.globalAlpha = 1;
    }

function draw() {
      stepRadiusAnimation();
      const t = S.renderState.transform;
      S.ctx.setTransform(1, 0, 0, 1, 0, 0);
      S.ctx.clearRect(0, 0, S.gfxCanvas.width, S.gfxCanvas.height);
      S.ctx.setTransform(S.dpr * t.k, 0, 0, S.dpr * t.k, S.dpr * t.x, S.dpr * t.y);
      renderScene(S.ctx, {});
      S.pickDirty = true;
      if (needsContinuousAnimation()) ensureAnimLoop();
    }

function startRadiusAnimation(toRadius, toDy, dur) {
      const from = new Map(), dyFrom = new Map();
      for (const n of DATA.nodes) { from.set(n.id, nodeRadius(n)); dyFrom.set(n.id, nodeLabelDy(n)); }
      S.renderState.anim = { from, to: toRadius, dyFrom, dyTo: toDy, t0: performance.now(), dur: dur || 500 };
      ensureAnimLoop();
    }

function stepRadiusAnimation() {
      const a = S.renderState.anim;
      if (!a) return;
      const p = Math.min(1, (performance.now() - a.t0) / a.dur);
      const e = p * p * (3 - 2 * p);
      for (const n of DATA.nodes) {
        const f = a.from.get(n.id) ?? 18, t = a.to.get(n.id) ?? 18;
        S.renderState.radius.set(n.id, f + (t - f) * e);
        const fd = a.dyFrom.get(n.id) ?? -25, td = a.dyTo.get(n.id) ?? -25;
        S.renderState.labelDy.set(n.id, fd + (td - fd) * e);
      }
      if (p >= 1) S.renderState.anim = null;
    }

export { DRAW_ORDER, animLoopRunning, draw, drawScheduled, ensureAnimLoop, graphIsCovered, needsContinuousAnimation, renderScene, requestDraw, startRadiusAnimation, stepRadiusAnimation };
