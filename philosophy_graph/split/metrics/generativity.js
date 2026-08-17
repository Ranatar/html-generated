// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';

function sameTraditionPhil(a, b) {
      if (a === b) return true;
      const ta = (S._philosopherMap.get(a) || {}).traditions || [];
      const tb = (S._philosopherMap.get(b) || {}).traditions || [];
      return ta.some(x => tb.includes(x));
    }

function linkInInfluenceScope(r, ownPhilosopher, scope) {
      if ((scope || S.influenceScope) === 'all') return true;
      const s = S._conceptMap.get(r.source), t = S._conceptMap.get(r.target);
      if (!s || !t) return false;
      const other = s.philosopher === ownPhilosopher ? t.philosopher : s.philosopher;
      const same = sameTraditionPhil(ownPhilosopher, other);
      return (scope || S.influenceScope) === 'within' ? same : !same;
    }

const GENERATIVITY_DAMPING = 0.85;

const GENERATIVITY_ITERATIONS = 40;

let _generativityCacheByScope = new Map();

function generativityScores(scope) {
      const sc = scope || 'all';
      if (_generativityCacheByScope.has(sc)) return _generativityCacheByScope.get(sc);

      const ids = S._concepts.map(c => c.id);
      const N = ids.length;
      const idx = new Map(ids.map((id, i) => [id, i]));
      const out = ids.map(() => []);

      // Рёбра обращены: из target в source
      for (const r of S._relations) {
        const s = idx.get(r.target), t = idx.get(r.source);
        if (s === undefined || t === undefined) continue;
        if (sc !== 'all') {
          const sc2 = S._conceptMap.get(r.source), tc = S._conceptMap.get(r.target);
          if (!sc2 || !tc) continue;
          const same = sameTraditionPhil(sc2.philosopher, tc.philosopher);
          if (sc === 'within' ? !same : same) continue;
        }
        out[s].push({ t, w: (r.weight || 1) / 3 });
      }

      const norm = out.map(o => o.reduce((s, e) => s + e.w, 0) || 1);
      const d = GENERATIVITY_DAMPING;
      let pr = new Array(N).fill(1 / N);

      for (let it = 0; it < GENERATIVITY_ITERATIONS; it++) {
        const np = new Array(N).fill((1 - d) / N);
        for (let i = 0; i < N; i++) {
          for (const e of out[i]) np[e.t] += d * pr[i] * e.w / norm[i];
        }
        pr = np;
      }

      // Приводим к среднему 1 и вычитаем телепортационный пол, чтобы
      // концепт, из которого ничего не исходит, получал ровно ноль.
      const floor = 1 - d;
      const res = new Map(ids.map((id, i) =>
        [id, Math.max(0, pr[i] * N - floor)]));
      _generativityCacheByScope.set(sc, res);
      return res;
    }

function generativity(conceptId, scope) {
      return generativityScores(scope || 'all').get(conceptId) || 0;
    }

function invalidateGenerativityCache() {
      _generativityCacheByScope = new Map();
    }

export { GENERATIVITY_DAMPING, GENERATIVITY_ITERATIONS, _generativityCacheByScope, generativity, generativityScores, invalidateGenerativityCache, linkInInfluenceScope, sameTraditionPhil };
