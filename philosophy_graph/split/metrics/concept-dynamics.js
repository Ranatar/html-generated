// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { MET, S } from '../core/ns.js';
import { otherPhilosopher, reflexiveLinkOf, sumWeight } from '../core/link-facts.js';

let transformationIndexCache = null;

MET.transformationIndex = function transformationIndex(conceptId) {

      const incoming = S._incomingLinks.get(conceptId) || [];
      const outgoing = S._outgoingLinks.get(conceptId) || [];

      const influences = incoming.filter(r => r.type === 'influence');
      const influenceVolume = sumWeight(influences);
      const developments = sumWeight(outgoing.filter(r => r.type === 'develop'));
      // C4: см. выше — apply теперь только на петлях, а исходящие
      // списки после C3 их тоже не содержат.
      const applications = 0;
      const syntheses  = sumWeight(outgoing.filter(r => r.type === 'synthesize'));

      // М11: было total = ratio*10 + счётчики, то есть безразмерное отношение
      // складывалось с сырыми объёмами: один вход и один выход давали 11,
      // пятьдесят на пятьдесят — 60. Теперь два самостоятельных показателя,
      // а итог — их среднее геометрическое: величина растёт и от отдачи
      // на единицу заимствованного, и от абсолютного объёма переработки.
      const volume = developments + applications + syntheses;
      const transformationRatio = influenceVolume > 0 ? volume / influenceVolume : 0;

      return {
      total: Math.sqrt(transformationRatio * volume),
      ratio: transformationRatio,
      volume,
      developments,
      applications,
      syntheses,
      influences: influenceVolume
      };
    };

function invalidateTransformationIndexCache() {
      transformationIndexCache = null;
    }

let conceptualFertilityIndexCache = null;

MET.conceptualFertilityIndex = function conceptualFertilityIndex(conceptId) {

      const incoming = S._incomingLinks.get(conceptId) || [];
      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };

      const philosopher = S._philosopherMap.get(concept.philosopher);
      if (!philosopher) return { total: 0 };

      // Дефект того же класса, что М2: плодовитость — это «из меня выросло»,
      // а 'develop' идёт от предшественника к результату, значит нужны
      // ИСХОДЯЩИЕ связи. Раньше считались входящие, то есть измерялось,
      // из чего вырос сам концепт. 'emerge_from' направлен наоборот
      // (source возникает из target), поэтому там верны входящие.
      // Добавлен 'culminate': исходящая кульминация — тоже форма порождения.
      const outgoingF = S._outgoingLinks.get(conceptId) || [];
      const emergences   = sumWeight(incoming.filter(r => r.type === 'emerge_from'));
      const developments = sumWeight(outgoingF.filter(
        r => r.type === 'develop' || r.type === 'synthesize'));
      const culminations = sumWeight(outgoingF.filter(r => r.type === 'culminate'));

      const laterPhilosophers = new Set();
      outgoingF.filter(r => r.type === 'develop' || r.type === 'culminate').forEach(r => {
      const target = S._conceptMap.get(r.target);
      if (target) {
      const targetPhil = S._philosopherMap.get(target.philosopher);
      if (targetPhil && targetPhil.birth > philosopher.birth) {
      laterPhilosophers.add(target.philosopher);
      }
      }
      });
      incoming.filter(r => r.type === 'emerge_from').forEach(r => {
      const source = S._conceptMap.get(r.source);
      if (source) {
      const sourcePhil = S._philosopherMap.get(source.philosopher);
      if (sourcePhil && sourcePhil.birth > philosopher.birth) {
      laterPhilosophers.add(source.philosopher);
      }
      }
      });

      return {
      total: emergences * 3 + developments * 2 + culminations * 1.5 + laterPhilosophers.size,
      emergences,
      developments,
      culminations,
      laterAdopters: laterPhilosophers.size
      };
    };

function invalidateConceptualFertilityIndexCache() {
      conceptualFertilityIndexCache = null;
    }

let conceptualComplexityIndexCache = null;

MET.conceptualComplexityIndex = function conceptualComplexityIndex(conceptId) {

      const incoming = S._incomingLinks.get(conceptId) || [];
      const outgoing = S._outgoingLinks.get(conceptId) || [];
      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };

      const incomingTypes = new Set(incoming.map(r => r.type)).size;
      const outgoingTypes = new Set(outgoing.map(r => r.type)).size;
      const rubricCount = (concept.rubrics || []).length;

      const contradictions = incoming.filter(r => 
      r.type === 'internal_contradiction'
      ).length;

      const presuppositions = incoming.filter(r => 
      r.type === 'presuppose' || r.type === 'condition'
      ).length;

      const relatedPhilosophers = new Set();
      incoming.concat(outgoing).forEach(r => {
      const other = S._conceptMap.get(
      r.source === conceptId ? r.target : r.source
      );
      if (other) {
      relatedPhilosophers.add(other.philosopher);
      }
      });

      // Самоприменение: правило, распространяющееся на себя, устроено
      // сложнее правила, которое этого не выдерживает. Вес 2 — как
      // у предпосылок и вдвое меньше противоречий.
      const _rflC = reflexiveLinkOf(conceptId);
      const selfApplication = (_rflC && _rflC.type === 'apply') ? (_rflC.weight || 2) : 0;

      return {
      total: (incomingTypes + outgoingTypes) * 2 + rubricCount * 3 + 
      contradictions * 5 + presuppositions * 2 + relatedPhilosophers.size +
      selfApplication * 2,
      selfApplication,
      linkTypeDiversity: incomingTypes + outgoingTypes,
      rubricCount,
      contradictions,
      presuppositions,
      relatedPhilosophers: relatedPhilosophers.size
      };
    };

function invalidateConceptualComplexityIndexCache() {
      conceptualComplexityIndexCache = null;
    }

let conceptualContinuityIndexCache = null;

MET.conceptualContinuityIndex = function conceptualContinuityIndex(conceptId) {
      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0, generations: 0, gaps: 0, laterReferences: 0 };

      const philosopher = S._philosopherMap.get(concept.philosopher);
      if (!philosopher) return { total: 0, generations: 0, gaps: 0, laterReferences: 0 };

      // Дефект того же класса, что М18: считались только ВХОДЯЩИЕ ссылки,
      // то есть полемическая рецепция ('critique', 'dialogue', 'oppose' идут
      // от младшего к старшему), тогда как преемственность ('influence',
      // 'develop') направлена от старшего к младшему и оставалась незамеченной.
      const incoming = S._incomingLinks.get(conceptId) || [];
      const outgoingC = S._outgoingLinks.get(conceptId) || [];

      // Группируем ссылки по временным периодам (поколениям по 50 лет)
      const generations = new Map();

      incoming.concat(outgoingC).forEach(r => {
        const otherPhil = otherPhilosopher(r, conceptId);
        {
          const sourcePhil = otherPhil;
          if (sourcePhil && sourcePhil.birth > philosopher.birth) {
            const yearsDiff = sourcePhil.birth - philosopher.birth;
            const generation = Math.floor(yearsDiff / 50);
            
            if (!generations.has(generation)) {
              generations.set(generation, 0);
            }
            generations.set(generation, generations.get(generation) + 1);
          }
        }
      });

      if (generations.size === 0) {
        return { total: 0, generations: 0, gaps: 0, laterReferences: 0 };
      }

      // Определяем количество поколений с ссылками
      const maxGeneration = Math.max(...Array.from(generations.keys()));
      const generationsCount = maxGeneration + 1;
      
      // Подсчитываем пропуски (поколения без ссылок)
      let gaps = 0;
      for (let i = 0; i <= maxGeneration; i++) {
        if (!generations.has(i)) {
          gaps++;
        }
      }
      
      // Общее количество ссылок из будущего
      const laterReferences = Array.from(generations.values()).reduce((sum, count) => sum + count, 0);
      
      // Индекс: чем больше поколений и меньше пропусков, тем выше
      const continuityScore = (generationsCount - gaps) * laterReferences;
      
      return {
        total: continuityScore,
        generations: generationsCount,
        gaps: gaps,
        laterReferences: laterReferences,
        coverage: generationsCount > 0 ? (generationsCount - gaps) / generationsCount : 0
      };
    };

function invalidateConceptualContinuityIndexCache() {
      conceptualContinuityIndexCache = null;
    }

export { conceptualComplexityIndexCache, conceptualContinuityIndexCache, conceptualFertilityIndexCache, invalidateConceptualComplexityIndexCache, invalidateConceptualContinuityIndexCache, invalidateConceptualFertilityIndexCache, invalidateTransformationIndexCache, transformationIndexCache };
