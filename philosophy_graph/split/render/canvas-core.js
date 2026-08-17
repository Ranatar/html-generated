// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';
import { requestDraw } from './loop.js';

const PICK_LINK_WIDTH = 10;

function resizeCanvas() {
      S.dpr = window.devicePixelRatio || 1;
      S.gfxCanvas.width  = Math.max(1, Math.round(S.viewWidth  * S.dpr));
      S.gfxCanvas.height = Math.max(1, Math.round(S.viewHeight * S.dpr));
      S.gfxCanvas.style.width  = S.viewWidth  + "px";
      S.gfxCanvas.style.height = S.viewHeight + "px";
      S.pickCanvas.width  = S.gfxCanvas.width;
      S.pickCanvas.height = S.gfxCanvas.height;
      S.pickDirty = true;
      requestDraw();
    }

export { PICK_LINK_WIDTH, resizeCanvas };
