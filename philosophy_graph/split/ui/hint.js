// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';

let коробПодсказки = null;

function показатьПодсказку(эл, текст) {
      if (!коробПодсказки) {
        коробПодсказки = document.createElement('div');
        коробПодсказки.id = 'hintBox';
        document.body.appendChild(коробПодсказки);
      }
      коробПодсказки.textContent = текст;
      коробПодсказки.classList.add('show');

      // Ставим над элементом; если сверху не помещается — под ним, а по
      // горизонтали держим в пределах окна.
      const r = эл.getBoundingClientRect();
      const к = коробПодсказки.getBoundingClientRect();
      let x = r.left + r.width / 2 - к.width / 2;
      let y = r.top - к.height - 8;
      if (y < 4) y = r.bottom + 8;
      x = Math.max(4, Math.min(x, window.innerWidth - к.width - 4));
      коробПодсказки.style.left = x + 'px';
      коробПодсказки.style.top = y + 'px';
    }

function скрытьПодсказку() {
      if (коробПодсказки) коробПодсказки.classList.remove('show');
    }

S.tooltipTimeout = null;

export { коробПодсказки, показатьПодсказку, скрытьПодсказку };
