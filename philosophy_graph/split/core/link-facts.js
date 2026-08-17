// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from './ns.js';

function isSymmetricLink(l) {
      if (!l) return false;
      if (l.bidirectional) return true;
      const t = DATA.relationTypesObj[l.type];
      return !!(t && t.symmetric);
    }

function isTypologicalLink(l) {
      const t = DATA.relationTypesObj[l && l.type];
      return !!(t && t.layer === 'typological');
    }

function isReflexiveLink(r) {
      const s = (r.source && r.source.id) || r.source;
      const t = (r.target && r.target.id) || r.target;
      return s === t;
    }

function reflexiveLinkOf(conceptId) {
      for (const r of S._relations) {
        const s = (r.source && r.source.id) || r.source;
        const t = (r.target && r.target.id) || r.target;
        if (s === conceptId && t === conceptId) return r;
      }
      return null;
    }

function sumWeight(links) {
      return links.reduce((s, r) => s + (r.weight || 1), 0);
    }

function otherPhilosopher(r, conceptId) {
      const other = S._conceptMap.get(r.source === conceptId ? r.target : r.source);
      return other ? S._philosopherMap.get(other.philosopher) : null;
    }

export { isReflexiveLink, isSymmetricLink, isTypologicalLink, otherPhilosopher, reflexiveLinkOf, sumWeight };
