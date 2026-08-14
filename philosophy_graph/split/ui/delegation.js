// Сгенерировано tools/delegate.mjs — правки вносить туда.

import { runAction } from './actions.js';

// Четыре слушателя на document — больше не нужно.
//   click, change, input   — всплывают;
//   focus НЕ всплывает, поэтому focusin.
// Разметка перерисовывается сорока генераторами, и делегированию это
// родная задача: обработчики не приходится возвращать после перерисовки.
const СОБЫТИЯ = [['click', 'click'], ['change', 'change'],
                 ['input', 'input'], ['focusin', 'focus']];

// mouseenter и mouseleave НЕ ВСПЛЫВАЮТ — делегировать их напрямую нельзя.
// Но всплывающие mouseover и mouseout дают ровно ту же семантику, если
// отбросить переходы ВНУТРИ элемента: вход считается, только когда курсор
// пришёл извне, выход — только когда ушёл наружу. Это стандартная замена,
// и она снимает последнюю нужду в глобальном имени.
const ГРАНИЦЫ = [['mouseover', 'enter'], ['mouseout', 'leave']];

// Подмена window.event на время действия.
//
// Часть кода читает НЕЯВНОЕ ГЛОБАЛЬНОЕ event и берёт из него currentTarget
// (так устроен toggleSection: const header = event.currentTarget). При
// встроенном обработчике currentTarget — сам элемент; при делегировании —
// document, потому что слушатель висит на нём. Поэтому на время вызова
// window.event подменяется прослойкой, у которой currentTarget — тот
// элемент, что нёс имя действия. Всё прочее берётся у настоящего события.
function сПодменойСобытия(ev, el, дело) {
  const своё = Object.getOwnPropertyDescriptor(window, 'event');
  const прослойка = new Proxy(ev, {
    get: function (t, p) {
      if (p === 'currentTarget') return el;
      var v = t[p];
      return typeof v === 'function' ? v.bind(t) : v;
    },
  });
  Object.defineProperty(window, 'event', { configurable: true, value: прослойка });
  try { return дело(прослойка); }
  finally {
    if (своё) Object.defineProperty(window, 'event', своё);
    else delete window.event;      // вернуть встроенный доступ через прототип
  }
}

export function installDelegation(root = document) {
  for (const [событие, признак] of ГРАНИЦЫ) {
    root.addEventListener(событие, ev => {
      const t = ev.target;
      if (!t || !t.closest) return;
      const el = t.closest('[data-act-' + признак + ']');
      if (!el) return;
      // переход внутри самого элемента границей не считается
      const другой = ev.relatedTarget;
      if (другой && el.contains(другой)) return;
      сПодменойСобытия(ev, el, прослойка =>
        runAction(el.getAttribute('data-act-' + признак), el, прослойка));
    });
  }
  for (const [событие, признак] of СОБЫТИЯ) {
    root.addEventListener(событие, ev => {
      const t = ev.target;
      if (!t || !t.closest) return;
      const el = t.closest('[data-act-' + признак + ']');
      if (!el) return;
      сПодменойСобытия(ev, el, прослойка =>
        runAction(el.getAttribute('data-act-' + признак), el, прослойка));
    });
  }
}
