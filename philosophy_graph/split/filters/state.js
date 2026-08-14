// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from '../core/ns.js';

function rebuildPhilosopherTraditions() {
      Object.keys(DATA.philosopherTraditions).forEach(k => delete DATA.philosopherTraditions[k]);
      DATA.philosophers.forEach(p => { DATA.philosopherTraditions[p.nameRu] = p.traditions || []; });
    }

export { rebuildPhilosopherTraditions };
