// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { isSymmetricLink } from '../core/predicates.js';
import { isLinkVisible, isNodeVisible } from '../core/visibility.js';
import { arrowPoints, arrowPointsStart, hasNodeClass, linkDrawAlpha, linkDrawWidth, linkHasTwoHeads, linkVisualState, nodeLabelDy, nodeRadius } from '../render/geometry.js';
import { DRAW_ORDER, renderScene } from '../render/scene.js';
import { selectedNodes } from '../state.js';
import { showTemporaryMessage } from './feedback.js';

function exportToPNG() {
      try {
        const scale = 4;
        const c = document.createElement('canvas');
        c.width  = S.viewWidth  * scale;
        c.height = S.viewHeight * scale;
        const cc = c.getContext('2d');

        // Б7: тот же градиент, что у body
        const bg = cc.createLinearGradient(0, 0, c.width, c.height);
        bg.addColorStop(0,   '#0f0c29');
        bg.addColorStop(0.5, '#302b63');
        bg.addColorStop(1,   '#24243e');
        cc.fillStyle = bg;
        cc.fillRect(0, 0, c.width, c.height);

        const t = S.renderState.transform;
        cc.setTransform(scale * t.k, 0, 0, scale * t.k, scale * t.x, scale * t.y);
        renderScene(cc, { forceLabels: true, scale: t.k });

        c.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.download = `philosophy-graph-${new Date().toISOString().slice(0,10)}.png`;
          a.href = url;
          a.click();
          URL.revokeObjectURL(url);
          if (typeof showTemporaryMessage === 'function')
            showTemporaryMessage('PNG сохранён');
        });
      } catch (e) {
        console.error('Ошибка экспорта PNG:', e);
        alert('Не удалось экспортировать PNG: ' + e.message);
      }
    }

function exportToSVG() {
      const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const num = v => Math.round(v * 100) / 100;
      const out = [];

      out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${S.viewWidth}" height="${S.viewHeight}" ` +
           `viewBox="0 0 ${S.viewWidth} ${S.viewHeight}">`);
      out.push('<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">' +
           '<stop offset="0" stop-color="#0f0c29"/><stop offset="0.5" stop-color="#302b63"/>' +
           '<stop offset="1" stop-color="#24243e"/></linearGradient></defs>');
      out.push(`<rect width="${S.viewWidth}" height="${S.viewHeight}" fill="url(#bg)"/>`);

      const t = S.renderState.transform;
      out.push(`<g transform="translate(${num(t.x)},${num(t.y)}) scale(${num(t.k)})">`);

      for (const state of DRAW_ORDER) {
        for (const l of DATA.links) {
          if (!isLinkVisible(l)) continue;
          if (linkVisualState(l) !== state) continue;
          const s = l.source, tg = l.target;
          if (!s || s.x === undefined || tg.x === undefined) continue;
          const dx = tg.x - s.x, dy = tg.y - s.y;
          const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
          const col = DATA.relationTypesObj[l.type].color;
          const w = linkDrawWidth(l, state);
          const op = state === 'path' ? 1 : linkDrawAlpha(l, state, 0);
          const dash = l.type === 'internal_contradiction' ? ' stroke-dasharray="8,4"'
                 : (isSymmetricLink(l) ? ' stroke-dasharray="5,5"' : '');
          out.push(`<path d="M${num(s.x)},${num(s.y)}A${num(dr)},${num(dr)} 0 0,1 ${num(tg.x)},${num(tg.y)}" ` +
               `fill="none" stroke="${col}" stroke-width="${num(w)}" stroke-opacity="${num(op)}" ` +
               `stroke-linecap="round" stroke-linejoin="round"${dash}/>`);
          const heads = [arrowPoints(l)];
          if (linkHasTwoHeads(l)) heads.push(arrowPointsStart(l));
          for (const pts of heads) {
            if (pts) out.push(`<path d="M${num(pts[0][0])},${num(pts[0][1])}L${num(pts[1][0])},${num(pts[1][1])}` +
                      `L${num(pts[2][0])},${num(pts[2][1])}Z" fill="${col}" fill-opacity="${num(op)}"/>`);
          }
        }
      }

      for (const d of DATA.nodes) {
        if (!isNodeVisible(d) || d.x === undefined) continue;
        const selected  = selectedNodes.has(d) || hasNodeClass('selected', d);
        const highlighted = hasNodeClass('highlighted', d);
        const dimmed    = hasNodeClass('dimmed', d) && !selected && !highlighted;
        const op = dimmed ? 0.2 : 1;
        out.push(`<circle cx="${num(d.x)}" cy="${num(d.y)}" r="${num(nodeRadius(d))}" ` +
             `fill="${DATA.philosopherConcepts[d.concept].color}" ` +
             `stroke="${selected ? '#ffd700' : '#fff'}" ` +
             `stroke-width="${selected ? 6 : (highlighted ? 5 : 3)}" opacity="${op}"/>`);
      }
      for (const d of DATA.nodes) {
        if (!isNodeVisible(d) || d.x === undefined) continue;
        const selected  = selectedNodes.has(d) || hasNodeClass('selected', d);
        const highlighted = hasNodeClass('highlighted', d);
        const op = (hasNodeClass('dimmed', d) && !selected && !highlighted) ? 0.2 : 1;
        out.push(`<text x="${num(d.x)}" y="${num(d.y + nodeLabelDy(d))}" text-anchor="middle" ` +
             `font-family="Segoe UI, Tahoma, Geneva, Verdana, sans-serif" font-size="10" ` +
             `font-weight="600" fill="#fff" opacity="${op}" ` +
             `style="paint-order:stroke" stroke="#000" stroke-width="2.5" ` +
             `stroke-opacity="0.85">${esc(d.label)}</text>`);
      }

      out.push('</g></svg>');

      const blob = new Blob([out.join('\n')], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download = 'philosophy-graph.svg';
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    }

export { exportToPNG, exportToSVG };
