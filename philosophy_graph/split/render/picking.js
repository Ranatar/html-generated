// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { isReflexiveLink } from '../core/link-facts.js';
import { isLinkVisible, isNodeVisible } from '../core/visibility.js';
import { PICK_LINK_WIDTH } from './canvas-core.js';
import { drawSelfLoop, fillArrow, linkDrawWidth, linkVisualState, strokeLink } from './draw-link.js';
import { nodeRadius } from './render-state.js';

let quadtree = null;

function rebuildQuadtree() {
      quadtree = d3.quadtree()
        .x(d => d.x).y(d => d.y)
        .addAll(DATA.nodes.filter(n => isNodeVisible(n) && n.x !== undefined));
    }

function toGraph(clientX, clientY) {
      const rect = S.gfxCanvas.getBoundingClientRect();
      return S.renderState.transform.invert([clientX - rect.left, clientY - rect.top]);
    }

function pickNode(gx, gy) {
      if (!quadtree) rebuildQuadtree();
      let maxR = 18;
      for (const v of S.renderState.radius.values()) if (v > maxR) maxR = v;
      const found = quadtree.find(gx, gy, maxR + 4);
      if (!found) return null;
      const r = nodeRadius(found);
      return (Math.hypot(found.x - gx, found.y - gy) <= r + 2) ? found : null;
    }

function repaintPickCanvas() {
      const t = S.renderState.transform;
      S.pickCtx.setTransform(1, 0, 0, 1, 0, 0);
      S.pickCtx.clearRect(0, 0, S.pickCanvas.width, S.pickCanvas.height);
      S.pickCtx.setTransform(S.dpr * t.k, 0, 0, S.dpr * t.k, S.dpr * t.x, S.dpr * t.y);
      S.pickCtx.globalAlpha = 1;
      S.pickCtx.lineCap = "round";
      S.pickCtx.lineJoin = "round";
      S.pickCtx.setLineDash([]);
      for (let i = 0; i < DATA.links.length; i++) {
        const l = DATA.links[i];
        if (!isLinkVisible(l)) continue;
        const id = i + 1;
        const col = "rgb(" + ((id >> 16) & 255) + "," + ((id >> 8) & 255) + "," + (id & 255) + ")";
        S.pickCtx.strokeStyle = col;
        S.pickCtx.fillStyle = col;
        // область попадания не уже прежней :hover-зоны
        const pw = Math.max(linkDrawWidth(l, linkVisualState(l)), PICK_LINK_WIDTH);
        if (isReflexiveLink(l)) {
          // У петли source === target, дуга между узлами вырождается
          // в точку — рисовать её на карте выбора незачем, как незачем
          // и наконечник от fillArrow: он рисуется внутри drawSelfLoop.
          drawSelfLoop(S.pickCtx, l, pw, S.pickCtx.strokeStyle, 1);
        } else {
          strokeLink(S.pickCtx, l, pw);
          fillArrow(S.pickCtx, l);
        }
      }
      S.pickDirty = false;
    }

function pickLink(clientX, clientY) {
      if (S.pickDirty) repaintPickCanvas();
      const rect = S.gfxCanvas.getBoundingClientRect();
      const px = Math.round((clientX - rect.left) * S.dpr);
      const py = Math.round((clientY - rect.top) * S.dpr);
      if (px < 0 || py < 0 || px >= S.pickCanvas.width || py >= S.pickCanvas.height) return null;
      let data;
      try { data = S.pickCtx.getImageData(px, py, 1, 1).data; } catch (e) { return null; }
      const id = (data[0] << 16) | (data[1] << 8) | data[2];
      if (!id || id > DATA.links.length) return null;
      return DATA.links[id - 1];
    }

export { pickLink, pickNode, quadtree, rebuildQuadtree, repaintPickCanvas, toGraph };
