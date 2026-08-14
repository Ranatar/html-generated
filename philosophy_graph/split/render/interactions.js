// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';
import { canEdit } from '../core/session.js';
import { cancelGraphSelection, handleConceptSelection } from '../data/mutate.js';
import { handleLinkClick, handleNodeClick } from '../graph/click-actions.js';
import { openEditConceptModal } from '../modal/entry.js';
import { linkHandlers, nodeHandlers } from './d3-layer.js';
import { pickLink, pickNode, toGraph } from './picking.js';
import { requestDraw } from './scene.js';
import { resetHighlight } from './selection.js';
import { editMode } from '../state.js';

let lastHoverNode = null;

let lastHoverLink = null;

function dispatchMove(event) {
      const p = toGraph(event.clientX, event.clientY);
      const n = pickNode(p[0], p[1]);
      const l = n ? null : pickLink(event.clientX, event.clientY);

      // dispatchMove переставляет курсор на каждом движении, поэтому
      // проверка режима нужна и здесь: иначе перекрестие мигало бы,
      // сменяясь на pointer над каждым узлом.
      S.gfxCanvas.style.cursor =
        (S.graphSelectionContext && S.graphSelectionContext.active)
          ? "crosshair"
          : ((n || l) ? "pointer" : "default");

      if (n !== lastHoverNode) {
        if (lastHoverNode && nodeHandlers.mouseout) nodeHandlers.mouseout(event, lastHoverNode);
        S.renderState.hoveredNode = n;
        if (n && nodeHandlers.mouseover) nodeHandlers.mouseover(event, n);
        lastHoverNode = n;
        requestDraw();
      }
      if (l !== lastHoverLink) {
        if (lastHoverLink && linkHandlers.mouseout) linkHandlers.mouseout(event, lastHoverLink);
        S.renderState.hoveredLink = l;
        if (l && linkHandlers.mouseover) linkHandlers.mouseover(event, l);
        lastHoverLink = l;
        requestDraw();
      } else if (l && linkHandlers.mousemove) {
        linkHandlers.mousemove(event, l);
      }
    }

function dispatchClick(event) {
      // Режим выбора концепции на графе проверяется ПЕРВЫМ, до всего
      // остального: пока он включён, клик значит только одно.
      // Порядок: режим выбора → узел → связь → фон.
      if (S.graphSelectionContext && S.graphSelectionContext.active) {
        const gp = toGraph(event.clientX, event.clientY);
        const gn = pickNode(gp[0], gp[1]);
        if (gn) handleConceptSelection(gn.id);
        else cancelGraphSelection();   // клик мимо — отмена, а не пустое ожидание
        return;
      }

      const p = toGraph(event.clientX, event.clientY);
      const n = pickNode(p[0], p[1]);
      if (n) { if (nodeHandlers.click) nodeHandlers.click(event, n); return; }
      const l = pickLink(event.clientX, event.clientY);
      if (l) { if (linkHandlers.click) linkHandlers.click(event, l); return; }
      // фон
      if (event.shiftKey && canEdit()) {           // ЗАСЛОН ПРАВКИ
        openEditConceptModal();
      } else {
        resetHighlight();
        editMode.pendingConceptSelection = [];
        requestDraw();
      }
    }

function initGraphEventHandlers() {
      S.gfxLink.on("click", handleLinkClick);
      S.gfxNode.on("click", handleNodeClick);
      S.gfxCanvas.addEventListener("mousemove", dispatchMove);
      S.gfxCanvas.addEventListener("mouseleave", (event) => {
        if (lastHoverNode && nodeHandlers.mouseout) nodeHandlers.mouseout(event, lastHoverNode);
        if (lastHoverLink && linkHandlers.mouseout) linkHandlers.mouseout(event, lastHoverLink);
        lastHoverNode = lastHoverLink = null;
        S.renderState.hoveredNode = S.renderState.hoveredLink = null;
        requestDraw();
      });
      S.gfxCanvas.addEventListener("click", dispatchClick);
    }

export { dispatchClick, dispatchMove, initGraphEventHandlers, lastHoverLink, lastHoverNode };
