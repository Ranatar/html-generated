// Сгенерировано tools/delegate.mjs — правки вносить туда.
import { registerActions } from './actions.js';
import { deleteConcept, deleteConnection, deletePhilosopher, saveConceptData, saveConnectionData, savePhilosopherData } from '../modal/persist.js';

// Кнопки «Сохранить» и «Удалить» в формах правки: имя обработчика приходит
// из данных, потому что одна и та же полоса кнопок обслуживает концепции,
// философов и связи. Промах по имени — ошибка, а не тишина.
const ПОИМЕНИ = { saveConceptData, savePhilosopherData, saveConnectionData, deleteConcept, deletePhilosopher, deleteConnection };

function вызватьПоИмени(имя, ...доводы) {
  const fn = ПОИМЕНИ[имя];
  if (!fn) { console.error('делегирование: нет функции по имени —', имя); return; }
  return fn(...доводы.filter(d => d !== undefined && d !== ''));
}

registerActions({
  'сохранить-сущность': (el) => вызватьПоИмени(el.dataset.a1),
  'удалить-сущность': (el) => вызватьПоИмени(el.dataset.a1, el.dataset.a2, el.dataset.a3),
});
