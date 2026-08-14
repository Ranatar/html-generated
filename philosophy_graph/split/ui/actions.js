// Сгенерировано tools/delegate.mjs — правки вносить туда.

// Реестр действий разметки. Разметка несёт ИМЯ ДЕЙСТВИЯ, а не имя функции,
// поэтому глобальное пространство имён ей больше не нужно.
//
// Промах по имени ОБЯЗАН шуметь: это единственное, чем делегирование хуже
// встроенного обработчика — строка data-act-click="открыть-концепцию"
// молчаливее, чем onclick="openUniversalModal(…)". Молчаливых отказов в
// этом приложении уже было довольно.
const ДЕЙСТВИЯ = new Map();

export function registerActions(map) {
  for (const имя of Object.keys(map)) {
    if (ДЕЙСТВИЯ.has(имя)) console.error('делегирование: имя действия занято —', имя);
    ДЕЙСТВИЯ.set(имя, map[имя]);
  }
}

export function runAction(имя, el, ev) {
  const fn = ДЕЙСТВИЯ.get(имя);
  if (!fn) { console.error('делегирование: неизвестное действие —', имя, el); return; }
  try { return fn(el, ev); }
  catch (e) { console.error('делегирование: действие «' + имя + '» упало —', e); }
}

export function actionNames() { return [...ДЕЙСТВИЯ.keys()]; }
