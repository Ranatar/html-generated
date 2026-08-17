// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from '../core/ns.js';

function philosopherBirth(nameRu) {
      const p = DATA.philosophers.find(x => x.nameRu === nameRu);
      return p ? p.birth : 0;
    }

function formatBirthYear(b) {
      return b < 0 ? (-b) + ' до н.э.' : String(b);
    }

function sortPhilosophersByBirth(list) {
      return Array.from(list).sort((a, b) => philosopherBirth(a) - philosopherBirth(b));
    }

function philosopherYears(nameRu) {
      const p = DATA.philosophers.find(x => x.nameRu === nameRu);
      return p ? p.years : '';
    }

let _ambiguousLabels = null;

function ambiguousLabels() {
      if (_ambiguousLabels) return _ambiguousLabels;
      const cnt = new Map();
      DATA.nodes.forEach(n => cnt.set(n.label, (cnt.get(n.label) || 0) + 1));
      _ambiguousLabels = new Set([...cnt.entries()].filter(e => e[1] > 1).map(e => e[0]));
      return _ambiguousLabels;
    }

function labelWithAuthor(node) {
      return ambiguousLabels().has(node.label)
        ? `${node.label} (${node.concept})` : node.label;
    }

export { _ambiguousLabels, ambiguousLabels, formatBirthYear, labelWithAuthor, philosopherBirth, philosopherYears, sortPhilosophersByBirth };
