// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { draw } from './scene.js';
import { selectedEdges } from '../state.js';

const LABEL_HIDE_BELOW = 0.6;

const LABEL_ALL_ABOVE = 1.0;

function nodeRadius(d)  { return S.renderState.radius.get(d.id)  ?? 18;  }

function nodeLabelDy(d) { return S.renderState.labelDy.get(d.id) ?? -25; }

function hasNodeClass(name, d) { const s = S.renderState.nodeClasses[name]; return !!s && s.has(d.id); }

function hasLinkClass(name, l) { const s = S.renderState.linkClasses[name]; return !!s && s.has(l); }

function linkStrokeWidth(d) {
      if (S.renderState.uniformLinkWidth) return 2;
      return d.weight === 3 ? 5 : (d.weight === 1 ? 2 : 3);
    }

function linkHoverStrokeWidth(d) {
      if (S.renderState.uniformLinkWidth) return 2;
      return d.weight === 3 ? 12 : (d.weight === 1 ? 8 : 10);
    }

function arcParams(s, t) {
      const dx = t.x - s.x, dy = t.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (!dist) return null;
      const r = dist * 1.5;
      const mx = (s.x + t.x) / 2, my = (s.y + t.y) / 2;
      const hx = (s.x - t.x) / 2, hy = (s.y - t.y) / 2;
      const h2 = hx * hx + hy * hy;
      let f = (r * r - h2) / h2;
      f = f < 0 ? 0 : Math.sqrt(f);
      const cx = mx + f * hy, cy = my - f * hx;
      return { cx, cy, r,
           a0: Math.atan2(s.y - cy, s.x - cx),
           a1: Math.atan2(t.y - cy, t.x - cx) };
    }

function arrowPoints(d, swOverride) {
      const s = d.source, t = d.target;
      if (!s || !t || s.x === undefined || t.x === undefined) return null;
      const p = arcParams(s, t);
      if (!p) return null;
      let Tx = -(t.y - p.cy), Ty = (t.x - p.cx);
      const len = Math.sqrt(Tx * Tx + Ty * Ty);
      if (!len) return null;
      Tx /= len; Ty /= len;
      const Nx = -Ty, Ny = Tx;

      let refX, refY, k, tri;
      if (S.arrowMode === 'metric') {
        const r = (S.arrowRadius && S.arrowRadius.get(t.id)) || 8;
        refX = r + 8; refY = 3; k = 1;
        tri = [[0, 0], [9, 3], [0, 6]];
      } else {
        refX = 26; refY = 0;
        k = 0.6 * (swOverride !== undefined ? swOverride : linkStrokeWidth(d));
        tri = [[0, -5], [10, 0], [0, 5]];
      }
      return tri.map(v => {
        const ox = (v[0] - refX) * k, oy = (v[1] - refY) * k;
        return [t.x + Tx * ox + Nx * oy, t.y + Ty * ox + Ny * oy];
      });
    }

function arrowPointsStart(d, swOverride) {
      const s = d.source, t = d.target;
      if (!s || !t || s.x === undefined || t.x === undefined) return null;
      const p = arcParams(s, t);
      if (!p) return null;
      // Касательная в точке источника, взятая с обратным знаком:
      // наконечник смотрит наружу, от цели к источнику.
      let Tx = (s.y - p.cy), Ty = -(s.x - p.cx);
      const len = Math.sqrt(Tx * Tx + Ty * Ty);
      if (!len) return null;
      Tx /= len; Ty /= len;
      const Nx = -Ty, Ny = Tx;

      let refX, refY, k, tri;
      if (S.arrowMode === 'metric') {
        const r = (S.arrowRadius && S.arrowRadius.get(s.id)) || 8;
        refX = r + 8; refY = 3; k = 1;
        tri = [[0, 0], [9, 3], [0, 6]];
      } else {
        refX = 26; refY = 0;
        k = 0.6 * (swOverride !== undefined ? swOverride : linkStrokeWidth(d));
        tri = [[0, -5], [10, 0], [0, 5]];
      }
      return tri.map(v => {
        const ox = (v[0] - refX) * k, oy = (v[1] - refY) * k;
        return [s.x + Tx * ox + Nx * oy, s.y + Ty * ox + Ny * oy];
      });
    }

function linkHasTwoHeads(l) {
      if (l.bidirectional) return true;
      const t = DATA.relationTypesObj[l.type];
      return !!(t && t.symmetric);
    }

function linkVisualState(l) {
      if (hasLinkClass("path-highlight", l)) return "path";
      if (selectedEdges.has(l) || hasLinkClass("selected", l)) return "selected";
      if (hasLinkClass("highlighted", l)) return "highlighted";
      if (hasLinkClass("dimmed", l)) return "dimmed";
      return "normal";
    }

function linkDrawWidth(l, state) {
      if (state === "path") return 6;
      if (S.renderState.uniformLinkWidth) return 2;
      if (S.renderState.hoveredLink === l) return linkHoverStrokeWidth(l);
      if (state === "selected") return 5;
      if (state === "highlighted") return 4;
      return linkStrokeWidth(l);
    }

function linkDrawAlpha(l, state, tms) {
      if (state === "path") return 0.8 + 0.2 * Math.cos(2 * Math.PI * tms / 1500);
      if (state === "selected" || state === "highlighted") return 1;
      if (state === "dimmed") return 0.1;
      if (S.renderState.hoveredLink === l) return 0.9;
      return 0.4;
    }

function strokeLink(c, l, width) {
      const p = arcParams(l.source, l.target);
      if (!p) return;
      c.beginPath();
      c.arc(p.cx, p.cy, p.r, p.a0, p.a1, false);
      c.lineWidth = width;
      c.stroke();
    }

function drawSelfLoop(c, l, sw, col, alpha) {
      const n = l.source;
      if (!n || n.x === undefined) return;
      const r = nodeRadius(n) || 18;
      const R = r * 2;            // радиус петли — двойной радиус узла
      const cx = n.x, cy = n.y - r * Math.sqrt(3);   // центр выше узла
      const A0 = 2 * Math.PI / 3;       // левая точка касания
      const A1 = Math.PI / 3;         // правая точка касания
      c.save();
      c.globalAlpha = alpha;
      c.strokeStyle = col; c.lineWidth = sw;
      c.beginPath();
      c.arc(cx, cy, R, A0, A1, false);    // от левой через верх к правой
      c.stroke();
      // Наконечник в точке входа справа, по касательной внутрь узла
      const ax = cx + R * Math.cos(A1), ay = cy + R * Math.sin(A1);
      const tx = -Math.sin(A1), ty = Math.cos(A1);
      const nx = -ty, ny = tx;
      const k = Math.max(5, sw * 2.6);
      c.beginPath();
      c.moveTo(ax + tx * k, ay + ty * k);
      c.lineTo(ax - tx * k * 0.3 + nx * k * 0.55, ay - ty * k * 0.3 + ny * k * 0.55);
      c.lineTo(ax - tx * k * 0.3 - nx * k * 0.55, ay - ty * k * 0.3 - ny * k * 0.55);
      c.closePath();
      c.fillStyle = col; c.fill();
      c.restore();
    }

function fillArrow(c, l, sw) {
      const draw = pts => {
        if (!pts) return;
        c.beginPath();
        c.moveTo(pts[0][0], pts[0][1]);
        c.lineTo(pts[1][0], pts[1][1]);
        c.lineTo(pts[2][0], pts[2][1]);
        c.closePath();
        c.fill();
      };
      draw(arrowPoints(l, sw));
      if (linkHasTwoHeads(l)) draw(arrowPointsStart(l, sw));
    }

export { LABEL_ALL_ABOVE, LABEL_HIDE_BELOW, arcParams, arrowPoints, arrowPointsStart, drawSelfLoop, fillArrow, hasLinkClass, hasNodeClass, linkDrawAlpha, linkDrawWidth, linkHasTwoHeads, linkHoverStrokeWidth, linkStrokeWidth, linkVisualState, nodeLabelDy, nodeRadius, strokeLink };
