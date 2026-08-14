// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';
import { isReflexiveLink, isSymmetricLink } from '../core/predicates.js';

function buildIncomingLinks() {
      const incoming = new Map();
      S._concepts.forEach(c => incoming.set(c.id, []));
      S._relations.forEach(r => {
        if (isReflexiveLink(r)) return;
        if (!incoming.has(r.target)) incoming.set(r.target, []);
        incoming.get(r.target).push(r);
        if (isSymmetricLink(r)) {
          if (!incoming.has(r.source)) incoming.set(r.source, []);
          incoming.get(r.source).push({...r, source: r.target, target: r.source});
        }
      });
      return incoming;
    }

function buildOutgoingLinks() {
      const outgoing = new Map();
      S._concepts.forEach(c => outgoing.set(c.id, []));
      // C3: комментарий обещал исключение петель, а кода не было:
      // во входящих списках петель 0 из 23, в исходящих 23 из 23,
      // и степень выхода у 23 концепций была завышена на единицу.
      S._relations.forEach(r => {
        if (isReflexiveLink(r)) return;
        if (!outgoing.has(r.source)) outgoing.set(r.source, []);
        outgoing.get(r.source).push(r);
        if (isSymmetricLink(r)) {
          if (!outgoing.has(r.target)) outgoing.set(r.target, []);
          outgoing.get(r.target).push({...r, source: r.target, target: r.source});
        }
      });
      return outgoing;
    }

function initializeMetricsData(conceptsData, relationsData, philosophersData) {
      S._concepts = conceptsData;
      S._relations = relationsData;
      S._philosophers = philosophersData;
      S._conceptMap = new Map(S._concepts.map(c => [c.id, c]));
      S._philosopherMap = new Map(S._philosophers.map(p => [p.id, p]));
      S._incomingLinks = buildIncomingLinks();
      S._outgoingLinks = buildOutgoingLinks();
    }

function medianNodeDegree() {
      if (S._medianDegreeCache !== null) return S._medianDegreeCache;
      const deg = new Map();
      S._concepts.forEach(c => deg.set(c.id, 0));
      S._relations.forEach(r => {
        if (deg.has(r.source)) deg.set(r.source, deg.get(r.source) + 1);
        if (deg.has(r.target)) deg.set(r.target, deg.get(r.target) + 1);
      });
      const a = [...deg.values()].sort((x, y) => x - y);
      S._medianDegreeCache = a.length ? a[Math.floor(a.length / 2)] : 0;
      return S._medianDegreeCache;
    }

function nodeDegreeOf(conceptId) {
      let d = 0;
      S._relations.forEach(r => {
        if (r.source === conceptId || r.target === conceptId) d++;
      });
      return d;
    }

export { buildIncomingLinks, buildOutgoingLinks, initializeMetricsData, medianNodeDegree, nodeDegreeOf };
