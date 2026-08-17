// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

let drawScheduled = false;

let рисовальщик = null;

function назначитьРисовальщика(дело) { рисовальщик = дело; }

function requestDraw() {
      if (drawScheduled) return;
      drawScheduled = true;
      requestAnimationFrame(() => {
        drawScheduled = false;
        if (рисовальщик) рисовальщик();
        else console.error('цикл кадров: рисовальщик не назначен');
      });
    }

export { drawScheduled, requestDraw, назначитьРисовальщика, рисовальщик };
