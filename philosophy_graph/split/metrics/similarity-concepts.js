// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { MET, S } from '../core/ns.js';
import { medianNodeDegree, nodeDegreeOf } from './network.js';
import { invalidatePhilosopherSimilarityCache } from './similarity-philosophers.js';

function profileIsMeaningful(conceptId) {
      return nodeDegreeOf(conceptId) >= medianNodeDegree();
    }

let _simCache = null;

function similarityData() {
      if (_simCache) return _simCache;

      const fns = {
        problemGenerationIndex: MET.problemGenerationIndex, criticalPowerIndex: MET.criticalPowerIndex, revolutionaryIndex: MET.revolutionaryIndex, paradigmShiftIndex: MET.paradigmShiftIndex,
        influenceIndex: MET.influenceIndex, foundationalIndex: MET.foundationalIndex, syntheticIndex: MET.syntheticIndex, dialogicalIndex: MET.dialogicalIndex,
        internalCoherenceIndex: MET.internalCoherenceIndex, transformationIndex: MET.transformationIndex, conceptualFertilityIndex: MET.conceptualFertilityIndex,
        conceptualComplexityIndex: MET.conceptualComplexityIndex, conceptualContinuityIndex: MET.conceptualContinuityIndex, instrumentalIndex: MET.instrumentalIndex,
        abstractionIndex: MET.abstractionIndex, deductiveIndex: MET.deductiveIndex, generativeIndex: MET.generativeIndex
      };
      const names = Object.keys(fns);
      const ids = S._concepts.map(c => c.id);

      const raw = names.map(n => ids.map(id => {
        try { const v = fns[n](id).total; return Number.isFinite(v) ? v : 0; }
        catch (e) { return 0; }
      }));

      // 1. z-нормировка по каждой метрике
      const z = raw.map(a => {
        const m = a.reduce((s, v) => s + v, 0) / a.length;
        const sd = Math.sqrt(a.reduce((s, v) => s + (v - m) * (v - m), 0) / a.length) || 1;
        return a.map(v => (v - m) / sd);
      });

      // 2. центрирование профиля каждого концепта: сравниваем форму, а не величину
      const V = ids.map((_, i) => {
        const v = z.map(a => a[i]);
        const m = v.reduce((s, x) => s + x, 0) / v.length;
        return v.map(x => x - m);
      });
      const norms = V.map(v => Math.sqrt(v.reduce((s, x) => s + x * x, 0)));
      const nonZero = ids.map((_, i) => raw.filter(a => a[i] !== 0).length);

      // перцентиль сырого значения — для читаемых столбиков в сравнении
      const pct = raw.map(a => {
        const sorted = [...a].sort((x, y) => x - y);
        return a.map(v => {
          let lo = 0, hi = sorted.length;
          while (lo < hi) { const mid = (lo + hi) >> 1; if (sorted[mid] < v) lo = mid + 1; else hi = mid; }
          return Math.round(lo / (sorted.length - 1) * 100);
        });
      });

      _simCache = { names, ids, index: new Map(ids.map((id, i) => [id, i])),
              raw, z, V, norms, nonZero, pct };
      return _simCache;
    }

function invalidateSimilarityCache() {
      invalidatePhilosopherSimilarityCache();
      _simCache = null;
      _pairCache = null;
      _pairCalculating = false;
    }

let _pairCache = null;

let _pairCalculating = false;

function allConceptPairs() {
      return _pairCache;
    }

const PAIRS_CHUNK_ROWS = 15;

async function allConceptPairsAsync(progressCallback) {
      if (_pairCache) return _pairCache;
      if (_pairCalculating) return null;
      _pairCalculating = true;

      try {
        // Фаза 1: подготовка метрик. Дорога сама по себе — 17 метрик
        // на все концепты, среди них дедуктивная с обходом графа.
        if (progressCallback) progressCallback(2);
        await new Promise(r => setTimeout(r, 0));
        const D = similarityData();
        const N = neighborSets();
        if (progressCallback) progressCallback(15);
        await new Promise(r => setTimeout(r, 0));

        // Фаза 2: перебор пар
        const ids = D.ids, n = ids.length;
        const total = n * (n - 1) / 2;

        const ia = new Uint16Array(total), ja = new Uint16Array(total);
        const pv = new Float32Array(total), jv = new Float32Array(total);
        const sh = new Uint16Array(total);
        const deg = ids.map(id => (N.get(id) || new Set()).size);

        let k = 0;
        for (let i = 0; i < n; i++) {
          const a = N.get(ids[i]), Vi = D.V[i], ni = D.norms[i];
          for (let j = i + 1; j < n; j++) {
            let s = 0; const Vj = D.V[j];
            for (let m = 0; m < Vi.length; m++) s += Vi[m] * Vj[m];
            pv[k] = (ni && D.norms[j]) ? s / (ni * D.norms[j]) : 0;

            const b = N.get(ids[j]);
            let inter = 0;
            for (const x of a) if (b.has(x)) inter++;
            const un = a.size + b.size - inter;
            jv[k] = un ? inter / un : 0;
            sh[k] = inter;

            ia[k] = i; ja[k] = j; k++;
          }

          if ((i + 1) % PAIRS_CHUNK_ROWS === 0) {
            if (progressCallback) progressCallback(15 + 85 * (i + 1) / n);
            await new Promise(r => setTimeout(r, 0));
          }
        }

        _pairCache = { ids, ia, ja, pv, jv, sh, deg, total };
        if (progressCallback) progressCallback(100);
        return _pairCache;
      } finally {
        _pairCalculating = false;
      }
    }

function profileSimilarity(idA, idB) {
      const D = similarityData();
      const i = D.index.get(idA), j = D.index.get(idB);
      if (i === undefined || j === undefined) return 0;
      if (!D.norms[i] || !D.norms[j]) return 0;
      let s = 0;
      for (let k = 0; k < D.V[i].length; k++) s += D.V[i][k] * D.V[j][k];
      return s / (D.norms[i] * D.norms[j]);
    }

let _neighborCache = null;

function neighborSets() {
      if (_neighborCache) return _neighborCache;
      const m = new Map(S._concepts.map(c => [c.id, new Set()]));
      for (const r of S._relations) {
        if (m.has(r.source) && m.has(r.target)) {
          m.get(r.source).add(r.target);
          m.get(r.target).add(r.source);
        }
      }
      _neighborCache = m;
      return m;
    }

function typeProfileOf(conceptId) {
      const links = (S._incomingLinks.get(conceptId) || [])
        .concat(S._outgoingLinks.get(conceptId) || []);
      const v = {};
      for (const r of links) v[r.type] = (v[r.type] || 0) + (r.weight || 1);
      return v;
    }

function structuralSimilarity(idA, idB) {
      const N = neighborSets();
      const a = N.get(idA), b = N.get(idB);
      if (!a || !b) return { jaccard: 0, shared: 0, typeCosine: 0 };

      let inter = 0;
      for (const x of a) if (b.has(x)) inter++;
      const union = a.size + b.size - inter;
      const jaccard = union ? inter / union : 0;

      // близость распределения типов связей
      const ta = typeProfileOf(idA), tb = typeProfileOf(idB);
      const keys = new Set([...Object.keys(ta), ...Object.keys(tb)]);
      let dot = 0, na = 0, nb = 0;
      for (const k of keys) {
        const x = ta[k] || 0, y = tb[k] || 0;
        dot += x * y; na += x * x; nb += y * y;
      }
      const typeCosine = (na && nb) ? dot / Math.sqrt(na * nb) : 0;

      return { jaccard, shared: inter, typeCosine };
    }

function nearestConcepts(conceptId, kind, k) {
      const D = similarityData();
      const src = D.index.get(conceptId);
      if (src === undefined) return [];

      // C5: у малосвязной концепции почти все метрики нулевые, а ноль
      // после z-нормировки даёт одну и ту же константу −mean/sd. Профили
      // таких концепций сходятся к общей точке, и косинус между ними
      // стремится к единице. Замерено: Спирмен(степень, верхнее сходство)
      // = −0.48, у 47 концепций из 453 верх ≥ 95 %, все степени 1–2.
      // Профильная колонка строится только для связных концепций —
      // и для источника, и для кандидатов.
      if (kind === 'profile' && !profileIsMeaningful(conceptId)) return [];

      const out = [];
      for (let i = 0; i < D.ids.length; i++) {
        if (i === src) continue;
        const id = D.ids[i];
        if (kind === 'profile' && !profileIsMeaningful(id)) continue;
        const value = kind === 'profile'
          ? profileSimilarity(conceptId, id)
          : structuralSimilarity(conceptId, id).jaccard;
        if (value <= 0) continue;
        out.push({ id, value });
      }
      out.sort((a, b) => b.value - a.value);

      // C5: контраст — насколько сосед выделяется среди прочих ИМЕННО
      // для этой концепции. Косинус сам по себе несравним между
      // концепциями разной связности, контраст — сравним (Спирмен со
      // степенью −0.12 против −0.48). Это монотонное преобразование при
      // фиксированной концепции, поэтому порядок соседей не меняется.
      if (out.length > 2) {
        const vals = out.map(x => x.value);
        const m = vals.reduce((s, v) => s + v, 0) / vals.length;
        const sd = Math.sqrt(vals.reduce((s, v) => s + (v - m) * (v - m), 0) / vals.length) || 1;
        out.forEach(x => { x.contrast = (x.value - m) / sd; });
      } else {
        out.forEach(x => { x.contrast = null; });
      }

      const res = out.slice(0, k || 5);
      // C5: точные ничьи (9 случаев по графу) помечаются как неразличимые
      for (let i = 1; i < res.length; i++) {
        if (Math.abs(res[i].value - res[i - 1].value) < 5e-4) {
          res[i].tied = true;
          res[i - 1].tied = true;
        }
      }
      return res;
    }

export { PAIRS_CHUNK_ROWS, _neighborCache, _pairCache, _pairCalculating, _simCache, allConceptPairs, allConceptPairsAsync, invalidateSimilarityCache, nearestConcepts, neighborSets, profileIsMeaningful, profileSimilarity, similarityData, structuralSimilarity, typeProfileOf };
