// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { MET, S } from '../core/ns.js';
import { philosopherProfile } from './philosopher.js';

const SIM_METRIC_LABELS = {
      problemGenerationIndex: 'Проблемность', criticalPowerIndex: 'Критическая сила',
      revolutionaryIndex: 'Революционность', paradigmShiftIndex: 'Сдвиг парадигмы',
      influenceIndex: 'Влияние', foundationalIndex: 'Основополагание',
      syntheticIndex: 'Синтетичность', dialogicalIndex: 'Диалогичность',
      internalCoherenceIndex: 'Когерентность', transformationIndex: 'Трансформация',
      conceptualFertilityIndex: 'Плодовитость', conceptualComplexityIndex: 'Сложность',
      conceptualContinuityIndex: 'Преемственность', instrumentalIndex: 'Инструментальность',
      abstractionIndex: 'Абстрактность', deductiveIndex: 'Дедуктивность',
      generativeIndex: 'Генеративность'
    };

const PHIL_SIM_MIN_CONCEPTS = 3;

const PHIL_SIM_MIN_RUBRIC_UNION = 3;

function rubricUnionSize(v1, v2) {
      let k = 0;
      for (let i = 0; i < v1.length; i++) if (v1[i] > 0 || v2[i] > 0) k++;
      return k;
    }

let _philSimCache = null;

function philosopherSimilarityData() {
      if (_philSimCache) return _philSimCache;

      const phs = [...new Set(S._concepts.map(c => c.philosopher))];
      const conceptsOf = {};
      phs.forEach(ph => conceptsOf[ph] = S._concepts.filter(c => c.philosopher === ph).map(c => c.id));
      const philOf = {};
      S._concepts.forEach(c => philOf[c.id] = c.philosopher);

      // — профиль метрик: среднее И разброс, чтобы форма системы не терялась (М20)
      const profRaw = phs.map(ph => {
        const pr = philosopherProfile(ph) || { averages: {}, spreads: {} };
        const a = pr.averages || {}, s = pr.spreads || {};
        return [a.influence || 0, a.revolutionary || 0, a.coherence || 0,
            a.instrumental || 0, a.deductive || 0,
            s.influence || 0, s.revolutionary || 0, s.coherence || 0,
            s.instrumental || 0, s.deductive || 0,
            MET.philosopherSystematicIndex(ph).total || 0,
            MET.philosopherHistoricalReachIndex(ph).total || 0,
            MET.philosopherInterdisciplinaryIndex(ph).total || 0];
      });

      // — способ построения: доли типов связей
      const types = [...new Set(S._relations.map(r => r.type))];
      const typeRaw = phs.map(ph => {
        const own = new Set(conceptsOf[ph]);
        const v = types.map(() => 0);
        for (const r of S._relations) {
          if (own.has(r.source) || own.has(r.target)) {
            v[types.indexOf(r.type)] += (r.weight || 1);
          }
        }
        const s = v.reduce((x, y) => x + y, 0) || 1;
        return v.map(x => x / s);
      });

      // — рубрики
      const rubrics = [...new Set(S._concepts.flatMap(c => c.rubrics || []))];
      const rubRaw = phs.map(ph => {
        const v = rubrics.map(() => 0);
        for (const id of conceptsOf[ph]) {
          const c = S._conceptMap.get(id);
          (c && c.rubrics || []).forEach(rb => v[rubrics.indexOf(rb)]++);
        }
        const s = v.reduce((x, y) => x + y, 0) || 1;
        return v.map(x => x / s);
      });

      // — структура: множество философов-соседей
      const neighbours = {};
      phs.forEach(ph => neighbours[ph] = new Set());
      for (const r of S._relations) {
        const a = philOf[r.source], b = philOf[r.target];
        if (a && b && a !== b) { neighbours[a].add(b); neighbours[b].add(a); }
      }

      // Двойное центрирование: z по столбцу, затем центр по строке.
      // Без него доли типов у всех похожи — медиана косинуса 0.741,
      // у 11 % пар выше 0.9, мера ничего не различает.
      const doubleCenter = M => {
        const k = M[0].length;
        const z = M.map(r => r.slice());
        for (let c = 0; c < k; c++) {
          const col = M.map(r => r[c]);
          const m = col.reduce((s, v) => s + v, 0) / col.length;
          const sd = Math.sqrt(col.reduce((s, v) => s + (v - m) * (v - m), 0) / col.length) || 1;
          z.forEach((r, i) => r[c] = (M[i][c] - m) / sd);
        }
        return z.map(r => {
          const m = r.reduce((s, x) => s + x, 0) / r.length;
          return r.map(x => x - m);
        });
      };

      _philSimCache = {
        phs, conceptsOf, neighbours, types, rubrics,
        profile: doubleCenter(profRaw),
        buildStyle: doubleCenter(typeRaw),
        rubricRaw: rubRaw,
        typeRaw,
        index: new Map(phs.map((p, i) => [p, i]))
      };
      return _philSimCache;
    }

function invalidatePhilosopherSimilarityCache() { _philSimCache = null; }

function cosineOf(a, b) {
      let d = 0, na = 0, nb = 0;
      for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
      return (na && nb) ? d / Math.sqrt(na * nb) : 0;
    }

function philosopherSimilarity(a, b, kind) {
      const P = philosopherSimilarityData();
      const i = P.index.get(a), j = P.index.get(b);
      if (i === undefined || j === undefined || i === j) return 0;
      if (kind === 'structure') {
        const x = P.neighbours[a], y = P.neighbours[b];
        let inter = 0; for (const z of x) if (y.has(z)) inter++;
        const un = x.size + y.size - inter;
        return un ? inter / un : 0;
      }
      if (kind === 'rubrics') {
        if (P.conceptsOf[a].length < PHIL_SIM_MIN_CONCEPTS ||
          P.conceptsOf[b].length < PHIL_SIM_MIN_CONCEPTS) return 0;
        // C4: пара, опирающаяся на две общие рубрики, косинусом не различается
        if (rubricUnionSize(P.rubricRaw[i], P.rubricRaw[j]) < PHIL_SIM_MIN_RUBRIC_UNION) return 0;
        return cosineOf(P.rubricRaw[i], P.rubricRaw[j]);
      }
      if (kind === 'style') return cosineOf(P.buildStyle[i], P.buildStyle[j]);
      return cosineOf(P.profile[i], P.profile[j]);
    }

function nearestPhilosophers(philosopherId, kind, k) {
      const P = philosopherSimilarityData();
      const out = [];
      for (const ph of P.phs) {
        if (ph === philosopherId) continue;
        const v = philosopherSimilarity(philosopherId, ph, kind);
        if (v <= 0) continue;
        out.push({ id: ph, value: v });
      }
      out.sort((x, y) => y.value - x.value);
      return out.slice(0, k || 5);
    }

const PHIL_SIM_LABELS = { profile: 'профиль метрик', style: 'способ построения',
                  structure: 'структура связей', rubrics: 'тематический охват' };

export { PHIL_SIM_LABELS, PHIL_SIM_MIN_CONCEPTS, PHIL_SIM_MIN_RUBRIC_UNION, SIM_METRIC_LABELS, _philSimCache, cosineOf, invalidatePhilosopherSimilarityCache, nearestPhilosophers, philosopherSimilarity, philosopherSimilarityData, rubricUnionSize };
