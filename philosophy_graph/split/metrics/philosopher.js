// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { MET, S } from '../core/ns.js';
import { DISRUPTIVE_TYPES, SYSTEMATIC_TYPES } from './philosophical.js';

const CONSTRUCTIVE_TYPES = ['influence', 'develop', 'apply', 'synthesize',
      'instrument', 'exemplify', 'presuppose', 'consequence'];

const POLEMICAL_TYPES = ['critique', 'oppose', 'dialogue', 'limit',
      'internal_contradiction'];

let philosopherProfileCache = null;

function philosopherProfile(philosopherId) {

      const philosopherConcepts = S._concepts.filter(c => c.philosopher === philosopherId);
      if (philosopherConcepts.length === 0) return null;

      // В-4: профиль дополнен двумя осями, опирающимися на типы связей,
      // которые раньше не участвовали ни в одной метрике: инструментальность
      // (связи 'instrument') и дедуктивная продуктивность ('consequence').
      const metrics = philosopherConcepts.map(c => ({
      influence: MET.influenceIndex(c.id).total,
      revolutionary: MET.revolutionaryIndex(c.id).total,
      coherence: MET.internalCoherenceIndex(c.id).total,
      instrumental: MET.instrumentalIndex(c.id).total,
      deductive: MET.deductiveIndex(c.id).total
      }));

      // М20: одного среднего мало. Философ с одной яркой идеей и десятком
      // проходных усреднялся до середняка, а система с широким разбросом
      // ролей была неотличима от ровной. Добавлены разброс и пик:
      //   averages — общий уровень системы,
      //   spreads  — насколько она неоднородна,
      //   peaks  — на что способна её сильнейшая точка.
      const keys = ['influence', 'revolutionary', 'coherence', 'instrumental', 'deductive'];
      const mean = key => metrics.reduce((sum, m) => sum + m[key], 0) / metrics.length;
      const spread = key => {
        const m = mean(key);
        return Math.sqrt(metrics.reduce((s, x) => s + (x[key] - m) * (x[key] - m), 0) / metrics.length);
      };
      const peak = key => metrics.reduce((s, x) => Math.max(s, x[key]), -Infinity);

      const averages = {}, spreads = {}, peaks = {};
      for (const k of keys) { averages[k] = mean(k); spreads[k] = spread(k); peaks[k] = peak(k); }

      return {
      philosopherId,
      conceptsCount: philosopherConcepts.length,
      metrics,
      averages,
      spreads,
      peaks
      };
    }

function invalidatePhilosopherProfileCache() {
      philosopherProfileCache = null;
    }

let philosopherSystematicIndexCache = null;

MET.philosopherSystematicIndex = function philosopherSystematicIndex(philosopherId) {

      const philosopherConcepts = S._concepts.filter(c => c.philosopher === philosopherId);
      if (philosopherConcepts.length === 0) return { density: 0 };

      // В-4: раньше все внутренние связи считались одинаковыми, поэтому
      // система, где понятия друг другу противоречат, выглядела такой же
      // «систематичной», как та, где они друг друга обосновывают. Теперь
      // связи взвешены по смыслу: логико-систематические работают на
      // систему, внутренние противоречия и оппозиции — против неё.
      const conceptIds = new Set(philosopherConcepts.map(c => c.id));
      let internalLinks = 0;
      let systematicLinks = 0;
      let disruptiveLinks = 0;

      S._relations.forEach(r => {
        if (conceptIds.has(r.source) && conceptIds.has(r.target)) {
        internalLinks++;
        const w = r.weight || 1;
        if (SYSTEMATIC_TYPES.includes(r.type)) systematicLinks += w;
        else if (DISRUPTIVE_TYPES.includes(r.type)) disruptiveLinks += w;
        }
      });

      const maxPossibleLinks = (philosopherConcepts.length * (philosopherConcepts.length - 1)) / 2;

      // Знаменатель систематичности: не все мыслимые пары, а (n−1)^1.5 —
      // среднее геометрическое между связной цепочкой (n−1) и полным
      // графом (n(n−1)/2). Прежний квадратичный знаменатель заставлял
      // систематичность ПАДАТЬ с ростом системы: Спирмен с числом
      // концепций был −0.37, наверху рейтинга стояли самые малые
      // системы. С показателем 1.5 он равен +0.05.
      const _n = philosopherConcepts.length;
      const structuralBaseline = _n > 1 ? 2 * Math.pow(_n - 1, 1.5) : 0;
      const density = structuralBaseline > 0
        ? (systematicLinks - disruptiveLinks) / structuralBaseline : 0;
      // rawDensity остаётся долей проведённых связей от всех мыслимых:
      // в таком виде она осмысленна и менять её незачем
      const rawDensity = maxPossibleLinks > 0 ? internalLinks / maxPossibleLinks : 0;

      // В5: generatePhilosopherRankings читает systematic?.total, а этого
      // поля не было. getSafeValue подставлял ноль всем 56 философам,
      // и рейтинг «Самые систематичные» показывал их в порядке базы данных.
      return {
        total: density * 100,
        density: density * 100,
        rawDensity: rawDensity * 100,
        systematicLinks,
        disruptiveLinks,
        internalLinks,
        totalConcepts: philosopherConcepts.length,
        maxPossibleLinks,
        structuralBaseline
      };
    };

function invalidatePhilosopherSystematicIndexCache() {
      philosopherSystematicIndexCache = null;
    }

let philosopherHistoricalReachIndexCache = null;

MET.philosopherHistoricalReachIndex = function philosopherHistoricalReachIndex(philosopherId) {

      const philosopher = S._philosopherMap.get(philosopherId);
      if (!philosopher) return { total: 0 };

      const philosopherConcepts = S._concepts.filter(c => c.philosopher === philosopherId);
      const conceptIds = new Set(philosopherConcepts.map(c => c.id));

      // В-4: охват разделён по смыслу связи. Преемственность (influence,
      // develop, apply, synthesize, instrument, exemplify, presuppose,
      // consequence) весит больше полемики (critique, oppose, dialogue,
      // limit): быть продолженным — не то же, что быть оспоренным.
      const influencedPhilosophers = new Set();
      const constructiveReach = new Set();
      const polemicalReach = new Set();
      const influencedYears = [];

      // М18: считались только ВХОДЯЩИЕ связи от более поздних философов.
      // Но типы делятся по направлению во времени: 'critique', 'oppose' и
      // 'dialogue' идут от младшего к старшему (127, 32 и 155 рёбер), а
      // 'influence' и 'develop' — от старшего к младшему (339 и 207).
      // Прежняя формула ловила полемику и теряла преемственность: 546 рёбер
      // оставались вне охвата. Теперь учитываются связи в обе стороны —
      // важен факт связи с более поздним философом, а не её направление.
      S._relations.forEach(r => {
      const mine = conceptIds.has(r.source) ? r.source
             : (conceptIds.has(r.target) ? r.target : null);
      if (!mine) return;
      const otherId = mine === r.source ? r.target : r.source;
      const otherConcept = S._conceptMap.get(otherId);
      if (!otherConcept) return;
      if (conceptIds.has(otherId)) return;      // внутри одного автора
      const otherPhil = S._philosopherMap.get(otherConcept.philosopher);
      if (otherPhil && otherPhil.birth > philosopher.birth) {
      influencedPhilosophers.add(otherConcept.philosopher);
      influencedYears.push(otherPhil.birth);
      if (CONSTRUCTIVE_TYPES.includes(r.type)) constructiveReach.add(otherConcept.philosopher);
      else if (POLEMICAL_TYPES.includes(r.type)) polemicalReach.add(otherConcept.philosopher);
      }
      });

      const latestInfluence = influencedYears.length > 0 ? Math.max(...influencedYears) : philosopher.birth;
      const timeSpan = latestInfluence - philosopher.birth;
      const generations = Math.floor(timeSpan / 25);

      // М19: было произведение, и множитель generations = floor(разрыв / 25)
      // обнулял результат, если самый поздний последователь родился менее
      // чем через 25 лет. Так одиннадцать философов с реальными
      // последователями получали ровно ноль. Теперь слагаемые.
      return {
      total: constructiveReach.size * 2 + polemicalReach.size + generations,
      constructiveReach: constructiveReach.size,
      polemicalReach: polemicalReach.size,
      influencedPhilosophersCount: influencedPhilosophers.size,
      timeSpan,
      generations,
      latestInfluence
      };
    };

function invalidatePhilosopherHistoricalReachIndexCache() {
      philosopherHistoricalReachIndexCache = null;
    }

let philosopherInterdisciplinaryIndexCache = null;

MET.philosopherInterdisciplinaryIndex = function philosopherInterdisciplinaryIndex(philosopherId) {

      const philosopherConcepts = S._concepts.filter(c => c.philosopher === philosopherId);
      if (philosopherConcepts.length === 0) return { total: 0 };

      const rubrics = new Set();
      philosopherConcepts.forEach(c => {
      (c.rubrics || []).forEach(r => rubrics.add(r));
      });

      const rubricDistribution = {};
      philosopherConcepts.forEach(c => {
      (c.rubrics || []).forEach(r => {
      rubricDistribution[r] = (rubricDistribution[r] || 0) + 1;
      });
      });

      const entropy = Object.values(rubricDistribution).length > 0 ? 
      Object.values(rubricDistribution).reduce((sum, count) => {
        const p = count / philosopherConcepts.length;
        return sum - p * Math.log2(p);
      }, 0)
        : 0;

      // В-4: раньше метрика смотрела только на рубрики собственных концептов
      // и не обращалась к связям вовсе. Междисциплинарность — это ещё и
      // наведение мостов: связь, соединяющая понятие одной рубрики с
      // понятием другой. Считаем число различных неупорядоченных пар рубрик,
      // которые философ соединил своими связями.
      const bridged = new Set();
      const own = new Set(philosopherConcepts.map(c => c.id));
      S._relations.forEach(r => {
      if (!own.has(r.source) && !own.has(r.target)) return;
      const a = S._conceptMap.get(r.source), b = S._conceptMap.get(r.target);
      if (!a || !b) return;
      (a.rubrics || []).forEach(ra => (b.rubrics || []).forEach(rb => {
      if (ra !== rb) bridged.add([ra, rb].sort().join('|'));
      }));
      });

      return {
      total: rubrics.size * (1 + entropy) + bridged.size * 0.5,
      rubricCount: rubrics.size,
      entropy,
      bridgedPairs: bridged.size,
      distribution: rubricDistribution
      };
    };

function invalidatePhilosopherInterdisciplinaryIndexCache() {
      philosopherInterdisciplinaryIndexCache = null;
    }

let temporalInfluencePatternCache = null;

MET.temporalInfluencePattern = function temporalInfluencePattern(conceptId) {

      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { pattern: 'none', periods: {} };

      const philosopher = S._philosopherMap.get(concept.philosopher);
      if (!philosopher) return { pattern: 'none', periods: {} };

      const incoming = S._incomingLinks.get(conceptId) || [];

      const periods = {
      immediate: 0,
      near: 0,
      medium: 0,
      long: 0
      };
      // В-4: к распределению по времени добавлено распределение по смыслу
      // связи — принимали концепт или спорили с ним.
      let constructive = 0, polemical = 0;

      incoming.forEach(r => {
      const source = S._conceptMap.get(r.source);
      if (source) {
      const sourcePhil = S._philosopherMap.get(source.philosopher);
      if (sourcePhil) {
      const timeDiff = sourcePhil.birth - philosopher.birth;

      if (timeDiff > 0) {
      if (timeDiff <= 50) periods.immediate++;
      else if (timeDiff <= 150) periods.near++;
      else if (timeDiff <= 300) periods.medium++;
      else periods.long++;
      if (CONSTRUCTIVE_TYPES.includes(r.type)) constructive++;
      else if (POLEMICAL_TYPES.includes(r.type)) polemical++;
      }
      }
      }
      });

      let pattern = 'none';
      if (periods.immediate > 0 && periods.long > 0) pattern = 'lasting';
      else if (periods.immediate > 0 && periods.near === 0) pattern = 'fading';
      else if (periods.immediate === 0 && periods.medium > 0) pattern = 'delayed';
      else if (periods.immediate > 0) pattern = 'normal';

      const reception = constructive > polemical * 1.5 ? 'принятие'
              : polemical > constructive * 1.5 ? 'полемика' : 'смешанная';

      return {
      pattern,
      periods,
      constructive,
      polemical,
      reception,
      totalForwardReferences: Object.values(periods).reduce((a, b) => a + b, 0)
      };
    };

function invalidateTemporalInfluencePatternCache() {
      temporalInfluencePatternCache = null;
    }

export { CONSTRUCTIVE_TYPES, POLEMICAL_TYPES, invalidatePhilosopherHistoricalReachIndexCache, invalidatePhilosopherInterdisciplinaryIndexCache, invalidatePhilosopherProfileCache, invalidatePhilosopherSystematicIndexCache, invalidateTemporalInfluencePatternCache, philosopherHistoricalReachIndexCache, philosopherInterdisciplinaryIndexCache, philosopherProfile, philosopherProfileCache, philosopherSystematicIndexCache, temporalInfluencePatternCache };
