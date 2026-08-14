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

function getContrastColor(hexColor) {
      const hex = String(hexColor || '').trim().replace('#', '');
      const full = hex.length === 3
        ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
        : hex;
      if (!/^[0-9a-fA-F]{6}$/.test(full)) return '#ffffff';

      const chan = i => {
        const c = parseInt(full.substr(i, 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      // относительная яркость заливки
      const L = 0.2126 * chan(0) + 0.7152 * chan(2) + 0.0722 * chan(4);

      // контраст к чёрному есть (L+0.05)/0.05, к белому — 1.05/(L+0.05);
      // они равны при L = sqrt(1.05*0.05) - 0.05 ≈ 0.1791
      return L > 0.1791 ? '#000000' : '#ffffff';
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

export { _ambiguousLabels, ambiguousLabels, formatBirthYear, getContrastColor, labelWithAuthor, philosopherBirth, philosopherYears, sortPhilosophersByBirth };
