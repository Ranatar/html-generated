// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

// Модульный сценарий откладывается, а запуск ещё и ждёт fetch, поэтому
// DOMContentLoaded и load к этому времени УЖЕ ПРОШЛИ, и подписка на них
// не сработает никогда. Эти две обёртки зовут обработчик сразу, если
// событие позади, и подписываются, если ещё нет.
export function onReady(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}
export function onLoad(fn) {
  if (document.readyState === 'complete') fn();
  else window.addEventListener('load', fn);
}
