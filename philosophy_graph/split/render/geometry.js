// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';

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

export { arcParams, arrowPoints, arrowPointsStart, linkHasTwoHeads, linkHoverStrokeWidth, linkStrokeWidth };
