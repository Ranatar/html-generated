// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';
import { arcParams, arrowPoints, arrowPointsStart, linkHasTwoHeads, linkHoverStrokeWidth, linkStrokeWidth } from './geometry.js';
import { hasLinkClass, nodeRadius } from './render-state.js';

import { selectedEdges } from '../state/render.js';

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

      // Карта сходства гасит паутину связей. Замер показывал перекос: она
      // приглушает 383 узла из 453, а все 1624 связи остаются в полную силу
      // и перетягивают внимание на то, что карта как раз отодвигает. Ярким
      // остаётся лишь то, что карта рисует сама, — дуги к ближайшим по
      // сходству (они рисуются отдельно и сюда не попадают).
      //
      // Приглушать связи ПО СХОДСТВУ нечем: у связи такого значения нет, а
      // похожие концепции чаще всего рёбрами и не соединены. Поэтому
      // признак другой, чем при щелчке: не «несмежные», а «все обычные».
      if (S.similarityOverlay) return 0.07;

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

export { drawSelfLoop, fillArrow, linkDrawAlpha, linkDrawWidth, linkVisualState, strokeLink };
