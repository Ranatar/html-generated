// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, MET, S } from '../core/ns.js';
import { isSymmetricLink, otherPhilosopher, reflexiveLinkOf, sumWeight } from '../core/link-facts.js';
import { generativity, linkInInfluenceScope } from './generativity.js';

let problemGenerationIndexCache = null;

MET.problemGenerationIndex = function problemGenerationIndex(conceptId) {
      const incoming = S._incomingLinks.get(conceptId) || [];
      const outgoing = S._outgoingLinks.get(conceptId) || [];
      
      // ============================================
      // 1. ИММАНЕНТНЫЕ ПРОТИВОРЕЧИЯ (исходный подход верен!)
      // ============================================
      const internalContradictions = incoming.filter(r => 
        r.type === 'internal_contradiction'
      ).reduce((sum, r) => sum + (r.weight || 1), 0);
      
      // Также учитываем противоречия, которые эта концепция порождает
      const outgoingContradictions = outgoing.filter(r => 
        r.type === 'internal_contradiction'
      ).reduce((sum, r) => sum + (r.weight || 1), 0);
      
      // ============================================
      // 2. ПОРОЖДЕНИЕ ПРОБЛЕМАТИЗАЦИИ (новое!)
      // ============================================
      // Исходящие критики и оппозиции - активная проблемность
      const activeProblematization = outgoing.filter(r => 
        r.type === 'critique' || r.type === 'oppose'
      ).reduce((sum, r) => sum + (r.weight || 1), 0);
      
      // ============================================
      // 3. ПОЛУЧЕНИЕ КРИТИКИ (исходный подход)
      // ============================================
      const incomingCritiques = incoming.filter(r => 
        r.type === 'critique'
      ).reduce((sum, r) => sum + (r.weight || 1), 0);
      
      const incomingOppositions = incoming.filter(r => 
        r.type === 'oppose'
      ).reduce((sum, r) => sum + (r.weight || 1), 0);
      
      // ============================================
      // 4. ОГРАНИЧЕНИЯ И УСЛОВИЯ (новое!)
      // ============================================
      // Связи типа "limit" - концепция имеет признанные границы
      const acknowledgedLimits = incoming.filter(r => 
        r.type === 'limit'
      ).length;
      
      // Связи типа "condition" - концепция требует условий
      const conditionalDependencies = incoming.filter(r => 
        r.type === 'condition'
      ).length;
      
      // ============================================
      // 5. ПОРОЖДЕНИЕ РАЗВИТИЯ (новое!)
      // ============================================
      // Сколько концепций "возникли из" данной (emerge_from)
      const conceptsEmergedFrom = incoming.filter(r => 
        r.type === 'emerge_from'
      ).length;
      
      // Сколько концепций эта концепция "кульминирует в"
      const culminations = outgoing.filter(r => 
        r.type === 'culminate'
      ).length;
      
      // C2: слагаемое bidirectionalContradictions удалено. Оно
      // вычислялось и НЕ ИСПОЛЬЗОВАЛОСЬ ни в сумме, ни в возврате —
      // осталось от перестройки C7, когда логические типы передали
      // в tensionIndex.
      // ============================================
      // ВЗВЕШЕННАЯ ФОРМУЛА
      // ============================================
      // C7: прежняя формула складывала слагаемые ОБОИХ слоёв типологии
      // (A9) и потому почти дословно повторяла tensionIndex: восемь
      // совпадающих слагаемых из девяти, Пирсон 0.955. Логические типы
      // (internal_contradiction, limit, condition) описывают устройство
      // концепции внутри системы и переданы tensionIndex целиком.
      // Здесь остаётся только исторический слой: сколько СПОРА понятие
      // породило в традиции.
      const mutualPolemics = incoming.filter(r =>
        r.type === 'dialogue' && r.bidirectional
      ).length;

      const incomingDevelopments = incoming.filter(r =>
        r.type === 'develop'
      ).reduce((sum, r) => sum + (r.weight || 1), 0);

      const total = 
        incomingCritiques * 2.0 +      // Его оспаривали
        incomingOppositions * 2.0 +    // Ему противопоставляли
        mutualPolemics * 1.5 +       // Взаимная полемика
        conceptsEmergedFrom * 1.5 +    // Из него выросли новые концепции
        culminations * 1.0 +         // Он стал кульминацией чужого хода
        incomingDevelopments * 0.5;    // Его развивали
      
      return {
        total,
        incomingCritiques,
        incomingOppositions,
        mutualPolemics,
        conceptsEmergedFrom,
        culminations,
        incomingDevelopments,
        // Д1: поля critiques, oppositions и contradictions удалены —
        // они повторяли incomingCritiques, incomingOppositions и
        // internalContradictions с корреляцией 1.00. Поле raw оставлено:
        // это сумма трёх составляющих, а не копия одной из них.
        raw: incomingCritiques + incomingOppositions + internalContradictions
      };
    };

function invalidateProblemGenerationIndexCache() {
      problemGenerationIndexCache = null;
    }

let criticalPowerIndexCache = null;

MET.criticalPowerIndex = function criticalPowerIndex(conceptId) {
      const incoming = S._incomingLinks.get(conceptId) || [];
      const outgoing = S._outgoingLinks.get(conceptId) || [];
      const concept = S._conceptMap.get(conceptId);
      const philosopher = S._philosopherMap.get(concept?.philosopher);
      
      // ============================================
      // 1. ОБЪЁМ КРИТИЧЕСКОЙ АКТИВНОСТИ
      // ============================================
      const critiques = outgoing.filter(r => r.type === 'critique');
      const oppositions = outgoing.filter(r => r.type === 'oppose');
      
      const rawCriticalActivity = critiques.length + oppositions.length;
      
      const weightedCriticalActivity = outgoing.reduce((sum, r) => {
        const typeWeight = {
          'critique': 2,
          'oppose': 3
        }[r.type] || 0;
        return sum + typeWeight * (r.weight || 1);
      }, 0);
      
      // ============================================
      // 2. КАЧЕСТВО ЦЕЛЕЙ (улучшено)
      // ============================================
      // Не просто средняя влиятельность, а распределение
      const targetAnalysis = critiques.concat(oppositions).reduce((acc, r) => {
        const targetIn = S._incomingLinks.get(r.target) || [];
        const targetInfluence = targetIn.length;
        
        // Категоризация целей
        if (targetInfluence > 15) acc.majorTargets++; // Центральные концепции
        else if (targetInfluence > 5) acc.mediumTargets++;
        else acc.minorTargets++;
        
        acc.totalTargetInfluence += targetInfluence;
        
        return acc;
      }, { majorTargets: 0, mediumTargets: 0, minorTargets: 0, totalTargetInfluence: 0 });
      
      const averageTargetInfluence = rawCriticalActivity > 0
        ? targetAnalysis.totalTargetInfluence / rawCriticalActivity
        : 0;
      
      // Бонус за критику центральных концепций
      const majorTargetBonus = targetAnalysis.majorTargets * 2.0;
      
      // ============================================
      // 3. ЭФФЕКТИВНОСТЬ КРИТИКИ (новое!)
      // ============================================
      // Породила ли критика последствия?
      const criticalConsequences = critiques.concat(oppositions).reduce((sum, r) => {
        const targetOut = S._outgoingLinks.get(r.target) || [];
        
        // Цель критики породила ответы/развития ПОСЛЕ критики?
        // (упрощение: считаем все исходящие от цели)
        const targetResponses = targetOut.filter(link => 
          link.type === 'develop' || 
          link.type === 'synthesize' ||
          link.type === 'complement'
        ).length;
        
        return sum + targetResponses;
      }, 0);
      
      // Породила ли сама критическая концепция развития?
      const ownDevelopments = outgoing.filter(r => 
        r.type === 'develop' || r.type === 'synthesize'
      ).length;
      
      // Эффективность = критика стимулировала изменения
      const effectiveness = criticalConsequences + ownDevelopments * 2;
      
      // ============================================
      // 4. ШИРОТА КРИТИЧЕСКОЙ АТАКИ (новое!)
      // ============================================
      // Сколько РАЗНЫХ философов/эпох критикует?
      const targetedPhilosophers = new Set(
        critiques.concat(oppositions).map(r => {
          const target = S._conceptMap.get(r.target);
          return target?.philosopher;
        }).filter(Boolean)
      ).size;
      
      // Временной диапазон критикуемых
      const targetedEras = critiques.concat(oppositions).map(r => {
        const target = S._conceptMap.get(r.target);
        const targetPhil = S._philosopherMap.get(target?.philosopher);
        return targetPhil?.birth;
      }).filter(Boolean);
      
      const eraSpan = targetedEras.length > 0
        ? Math.max(...targetedEras) - Math.min(...targetedEras)
        : 0;
      
      // ============================================
      // 5. КОНСТРУКТИВНОСТЬ КРИТИКИ (новое!)
      // ============================================
      // Критика + синтез = конструктивная критика (Кант)
      // Критика без синтеза = деструктивная критика (Ницше, скептики)
      const synthesesAfterCritique = outgoing.filter(r => 
        r.type === 'synthesize'
      ).length;
      
      const constructivenessRatio = rawCriticalActivity > 0
        ? synthesesAfterCritique / rawCriticalActivity
        : 0;
      
      // ============================================
      // 6. ВРЕМЕННАЯ ПЕРСПЕКТИВА (новое!)
      // ============================================
      // Критика философов из прошлого (ретроспективная)
      const retroactiveCritiques = critiques.concat(oppositions).filter(r => {
        const target = S._conceptMap.get(r.target);
        const targetPhil = S._philosopherMap.get(target?.philosopher);
        return targetPhil && philosopher && targetPhil.birth < philosopher.birth;
      }).length;
      
      // Критика современников (синхронная)
      const contemporaryCritiques = critiques.concat(oppositions).filter(r => {
        const target = S._conceptMap.get(r.target);
        const targetPhil = S._philosopherMap.get(target?.philosopher);
        return targetPhil && philosopher && 
          Math.abs(targetPhil.birth - philosopher.birth) < 30;
      }).length;
      
      // ============================================
      // ИНТЕГРАЛЬНЫЙ ИНДЕКС
      // ============================================
      const total = 
        weightedCriticalActivity * 1.0 +    // Базовая активность
        majorTargetBonus * 1.5 +         // Критика центральных концепций
        effectiveness * 2.0 +          // Эффективность (главное!)
        targetedPhilosophers * 0.8 +       // Широта атаки
        eraSpan / 100 +              // Временной диапазон
        (constructivenessRatio > 0.3 ? 3 : 0);   // Бонус за конструктивность
      
      return {
        total,
        
        // Активность
        rawCriticalActivity,
        weightedCriticalActivity,
        
        // Качество целей
        targets: {
          majorTargets: targetAnalysis.majorTargets,
          mediumTargets: targetAnalysis.mediumTargets,
          minorTargets: targetAnalysis.minorTargets,
          averageInfluence: averageTargetInfluence
        },
        
        // Эффективность
        effectiveness,
        criticalConsequences,
        ownDevelopments,
        
        // Широта
        targetedPhilosophers,
        eraSpan,
        
        // Тип критики
        constructivenessRatio,
        retroactiveCritiques,
        contemporaryCritiques,
        
        // Для обратной совместимости
        // Д1: поля raw и weightedActivity удалены — они возвращали ровно
        // те же значения, что rawCriticalActivity и weightedCriticalActivity
        // (корреляция 1.00). Из пятнадцати полей метрики восемь пар имели
        // корреляцию выше 0.95; здесь убраны две буквальные.
        targetInfluence: averageTargetInfluence
      };
    };

function invalidateCriticalPowerIndexCache() {
      criticalPowerIndexCache = null;
    }

let revolutionaryIndexCache = null;

MET.revolutionaryIndex = function revolutionaryIndex(conceptId) {
      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };

      const philosopher = S._philosopherMap.get(concept.philosopher);
      if (!philosopher) return { total: 0 };

      const incoming = S._incomingLinks.get(conceptId) || [];
      const outgoing = S._outgoingLinks.get(conceptId) || [];

      // ============================================
      // 1. НЕЗАВИСИМОСТЬ ОТ ТРАДИЦИИ (исправлено)
      // ============================================
      const weightedOppositionsToEarlier = incoming.filter(r => {
        const source = S._conceptMap.get(r.source);
        if (!source) return false;
        const sourcePhil = S._philosopherMap.get(source.philosopher);
        return sourcePhil && r.type === 'oppose' && sourcePhil.birth < philosopher.birth;
      }).reduce((sum, r) => sum + (r.weight || 1), 0);

      const weightedInfluencesFromEarlier = incoming.filter(r => {
        const source = S._conceptMap.get(r.source);
        if (!source) return false;
        const sourcePhil = S._philosopherMap.get(source.philosopher);
        return sourcePhil && r.type === 'influence' && sourcePhil.birth < philosopher.birth;
      }).reduce((sum, r) => sum + (r.weight || 1), 0);

      // Баланс: революционность = оппозиции минус укоренённость
      // Используем разность вместо деления (избегаем деления на 0)
      const independenceScore = weightedOppositionsToEarlier - weightedInfluencesFromEarlier * 0.5;

      // ============================================
      // 2. КРИТИКА ДОМИНИРУЮЩИХ ИДЕЙ (улучшено)
      // ============================================
      const weightedCritiquesOfInfluential = outgoing.filter(r => {
        if (r.type !== 'critique' && r.type !== 'oppose') return false;
        const targetIn = S._incomingLinks.get(r.target) || [];
        return targetIn.length > 10; // Целится в "узлы" графа
      }).reduce((sum, r) => sum + (r.weight || 1), 0);

      // ============================================
      // 3. СИНТЕТИЧЕСКАЯ НОВИЗНА (взвешенная)
      // ============================================
      // Синтез считается на стороне синтезирующего и только пучком
      const revSynthPhils = new Set(
        incoming.filter(r => r.type === 'synthesize')
            .map(r => (S._conceptMap.get(r.source) || {}).philosopher)
            .filter(Boolean));
      const weightedSyntheses = revSynthPhils.size >= 2
        ? incoming.filter(r => r.type === 'synthesize')
              .reduce((sum, r) => sum + (r.weight || 1), 0)
        : 0;

      // ============================================
      // 4. ДИСКУССИОННОСТЬ (новое)
      // ============================================
      // Двунаправленные диалоги - признак спорной новизны
      const bidirectionalDialogues = [...incoming, ...outgoing].filter(r => 
        r.type === 'dialogue' && r.bidirectional
      ).length / 2; // Делим на 2, т.к. каждая связь учитывается дважды

      // ============================================
      // 5. МЕЖДИСЦИПЛИНАРНОСТЬ (новое)
      // ============================================
      // Революционные концепции часто выходят за пределы одной рубрики
      const rubricDiversity = (DATA.conceptToRubrics[conceptId] || []).length;

      // ============================================
      // 6. ДОЛГОСРОЧНОЕ ВЛИЯНИЕ (новое)
      // ============================================
      // Влияние на философов через >50 лет - признак парадигмального сдвига
      const futureImpact = outgoing.filter(r => {
        const target = S._conceptMap.get(r.target);
        if (!target) return false;
        const targetPhil = S._philosopherMap.get(target.philosopher);
        return targetPhil && (targetPhil.birth - philosopher.birth) > 50;
      }).length;

      // ============================================
      // 7. ШИРОТА ВЛИЯНИЯ (новое)
      // ============================================
      // Количество различных философов, на которых повлияла концепция
      const influencedPhilosophersCount = new Set(
        outgoing.map(r => {
          const target = S._conceptMap.get(r.target);
          return target?.philosopher;
        }).filter(Boolean)
      ).size;

      // ============================================
      // 8. РАЗНООБРАЗИЕ ОТНОШЕНИЙ (новое)
      // ============================================
      // Концепция, участвующая в разных типах связей, концептуально богаче
      const outgoingTypeDiversity = new Set(outgoing.map(r => r.type)).size;

      // ============================================
      // ИТОГОВАЯ ФОРМУЛА
      // ============================================
      const total = 
        independenceScore * 2.0 +          // Автономия от традиции
        weightedCritiquesOfInfluential * 1.5 +     // Атака на центральные узлы
        weightedSyntheses * 1.8 +          // Синтетическая креативность
        bidirectionalDialogues * 1.2 +         // Порождение дискуссий
        rubricDiversity * 0.8 +            // Выход за дисциплинарные рамки
        futureImpact * 1.0 +             // Влияние через поколения
        influencedPhilosophersCount * 0.7 +      // Широта воздействия
        outgoingTypeDiversity * 0.5;         // Концептуальное богатство

      return {
        total,
        // Компоненты для анализа
        independenceScore,
        weightedOppositionsToEarlier,
        weightedInfluencesFromEarlier,
        weightedCritiquesOfInfluential,
        weightedSyntheses,
        bidirectionalDialogues,
        rubricDiversity,
        futureImpact,
        influencedPhilosophersCount,
        outgoingTypeDiversity
      };
    };

function invalidateRevolutionaryIndexCache() {
      revolutionaryIndexCache = null;
    }

let paradigmShiftIndexCache = null;

MET.paradigmShiftIndex = function paradigmShiftIndex(conceptId) {

      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };

      const philosopher = S._philosopherMap.get(concept.philosopher);
      if (!philosopher) return { total: 0 };

      const outgoing = S._outgoingLinks.get(conceptId) || [];
      const incoming = S._incomingLinks.get(conceptId) || [];

      // М12: раньше методологичность задавалась плоским +5 за рубрику 'method',
      // что составляло треть шкалы. Теперь она измеряется: исходящие связи
      // 'instrument' означают «я есть инструмент для X». Рубрика сохранена
      // в деталях как справочный признак, но в сумму не входит.
      const isMethodological = (concept.rubrics || []).includes('method');
      const instrumentality = sumWeight(outgoing.filter(r => r.type === 'instrument'));

      const influencedRubrics = new Set();
      outgoing.filter(r => r.type === 'influence' || r.type === 'apply').forEach(r => {
      const target = S._conceptMap.get(r.target);
      if (target) {
      (target.rubrics || []).forEach(rub => influencedRubrics.add(rub));
      }
      });

      // М3: широта рубрик бралась из ИСХОДЯЩИХ, а последователи — из ВХОДЯЩИХ.
      // Одновременно верными эти направления быть не могут. Сдвиг парадигмы —
      // это «после меня стали думать иначе», поэтому оба компонента исходящие.
      const laterPhilosophers = new Set();
      outgoing.forEach(r => {
      const target = S._conceptMap.get(r.target);
      if (target) {
      const targetPhil = S._philosopherMap.get(target.philosopher);
      if (targetPhil && targetPhil.birth > philosopher.birth) {
      laterPhilosophers.add(target.philosopher);
      }
      }
      });

      return {
      total: instrumentality * 2 + influencedRubrics.size * 2 + laterPhilosophers.size,
      instrumentality,
      isMethodological,
      rubricsBreadth: influencedRubrics.size,
      laterAdopters: laterPhilosophers.size
      };
    };

function invalidateParadigmShiftIndexCache() {
      paradigmShiftIndexCache = null;
    }

let influenceIndexCache = null;

MET.influenceIndex = function influenceIndex(conceptId) {

      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };

      const philosopher = S._philosopherMap.get(concept.philosopher);
      if (!philosopher) return { total: 0 };

      const incoming = (S._incomingLinks.get(conceptId) || [])
        .filter(r => linkInInfluenceScope(r, concept.philosopher));

      const forwardInfluence = incoming.reduce((sum, r) => {
      const source = S._conceptMap.get(r.source);
      if (!source) return sum;
      const sourcePhil = S._philosopherMap.get(source.philosopher);
      if (!sourcePhil) return sum;

      if (sourcePhil.birth > philosopher.birth) {
      // М5: вес 'influence': 3 был максимальным в таблице, но применялся
      // к ВХОДЯЩЕЙ связи от более позднего философа. Такая связь
      // анахронична: 'influence' идёт от старшего к младшему в 339 случаях
      // из 362. Во всём графе таких рёбер 5, то есть самый тяжёлый вес
      // был приложен к пустому множеству. Метрика фактически измеряет
      // рецепцию через develop / apply / critique — см. открытый вопрос В-3.
      // 'synthesize' прежде проваливался в вес по умолчанию 1 — наравне
      // со случайным упоминанием. Быть синтезированным в чужую систему
      // есть сильнейшая форма рецепции, выше развития.
      const typeWeight = {
      'synthesize': 3,
      'develop': 2.5,
      'apply': 2,
      'critique': 1.5,
      'dialogue': 1.5
      }[r.type] || 1;
      return sum + typeWeight * (r.weight || 1);
      }
      return sum;
      }, 0);

      const contemporaryInfluence = incoming.reduce((sum, r) => {
      const source = S._conceptMap.get(r.source);
      if (!source) return sum;
      const sourcePhil = S._philosopherMap.get(source.philosopher);
      if (!sourcePhil) return sum;

      const timeDiff = Math.abs(sourcePhil.birth - philosopher.birth);
      if (timeDiff < 50) {
      const typeWeight = {
      'dialogue': 2,
      'critique': 1.5,
      'synthesize': 2
      }[r.type] || 1;
      return sum + typeWeight * (r.weight || 1);
      }
      return sum;
      }, 0);

      // В-3: до сих пор метрика измеряла только рецепцию — входящие связи
      // от родившихся позже. Но 'influence' направлен от старшего к младшему
      // (source старше в 339 случаях из 362), значит собственное влияние
      // концепта — это его ИСХОДЯЩИЕ связи к более поздним. Добавлено
      // вторым слагаемым, и метрика наконец оправдывает своё название.
      const outgoingLinks = (S._outgoingLinks.get(conceptId) || [])
        .filter(r => linkInInfluenceScope(r, concept.philosopher));
      const exertedInfluence = outgoingLinks.reduce((sum, r) => {
      const target = S._conceptMap.get(r.target);
      if (!target) return sum;
      const targetPhil = S._philosopherMap.get(target.philosopher);
      if (!targetPhil) return sum;
      if (targetPhil.birth > philosopher.birth) {
      const typeWeight = {
      'influence': 3,
      'develop': 2.5,
      'apply': 2,
      'instrument': 1.5
      }[r.type] || 1;
      return sum + typeWeight * (r.weight || 1);
      }
      return sum;
      }, 0);

      const totalIncoming = incoming.length;

      // Г2: плоская сумма заменена генеративностью. Коэффициент 8 подобран
      // так, чтобы среднее слагаемого сохранилось: генеративность нормирована
      // к среднему 1, а прежняя плоская сумма давала в среднем 7.78.
      // Прежний расчёт сохранён в подробностях как exertedFlat — по нему
      // видно, насколько рекурсия расходится с простым подсчётом связей.
      const EXERTED_SCALE = 8;
      const exertedRecursive = generativity(conceptId, S.influenceScope) * EXERTED_SCALE;

      const totalIncomingKept = totalIncoming;

      return {
      total: exertedRecursive + forwardInfluence + contemporaryInfluence * 0.5,
      scope: INFLUENCE_SCOPE_LABELS[S.influenceScope],
      exerted: exertedRecursive,
      exertedFlat: exertedInfluence,
      forward: forwardInfluence,
      contemporary: contemporaryInfluence,
      incoming: totalIncoming
      };
    };

function invalidateInfluenceIndexCache() {
      influenceIndexCache = null;
    }

let foundationalIndexCache = null;

const SYSTEMATIC_TYPES = ['presuppose', 'consequence', 'condition', 'exemplify',
      'instrument', 'culminate', 'mediate', 'apply', 'complement', 'emerge_from',
      'develop', 'synthesize'];

const DISRUPTIVE_TYPES = ['internal_contradiction', 'oppose'];

MET.foundationalIndex = function foundationalIndex(conceptId) {

      const outgoing = S._outgoingLinks.get(conceptId) || [];
      const incoming = S._incomingLinks.get(conceptId) || [];

      // М1: 'presuppose' идёт ОТ зависимого К основанию (source предполагает
      //   target), поэтому основанием концепт является для ВХОДЯЩИХ связей.
      //   Раньше считались исходящие, то есть измерялась зависимость.
      // М2: 'develop' идёт от предшественника к результату (source развивается
      //   в target), поэтому порождающим концепт является для ИСХОДЯЩИХ.
      //   Раньше считались входящие, то есть измерялась производность.
      // 'condition' направлен противоположно 'presuppose' (source ЕСТЬ условие
      //   target) — здесь исходящие верны. Это ловушка В-1 спецификации.
      const presuppositions = sumWeight(incoming.filter(r => r.type === 'presuppose'));
      const conditions    = sumWeight(outgoing.filter(r => r.type === 'condition'));
      const emergences    = sumWeight(incoming.filter(r => r.type === 'emerge_from'));
      // C4: apply остался только на петлях (D7), а входящие списки
      // петель не содержат — слагаемое было бы вечным нулём.
      // Смысл несёт selfApplication через reflexiveLinkOf.
      const applications  = 0;
      // Быть синтезированным чужой системой — такой же признак
      // основоположности, как быть развитым
      const developments  = sumWeight(outgoing.filter(
        r => r.type === 'develop' || r.type === 'synthesize'));

      // Самообоснование: causa sui есть предельный случай того же,
      // что считает член presuppositions — понятие, на котором держатся
      // другие и вдобавок оно само. Вес тот же, 3: самообоснование
      // не сильнее внешнего обоснования, оно замыкает его на себя.
      const _rfl = reflexiveLinkOf(conceptId);
      const selfGrounding = (_rfl && _rfl.type === 'presuppose') ? (_rfl.weight || 2) : 0;

      return {
      total: (presuppositions + selfGrounding) * 3 + conditions * 2 + emergences * 2.5 + applications + developments,
      selfGrounding,
      presuppositions,
      conditions,
      emergences,
      applications,
      developments
      };
    };

function invalidateFoundationalIndexCache() {
      foundationalIndexCache = null;
    }

let syntheticIndexCache = null;

MET.syntheticIndex = function syntheticIndex(conceptId) {

      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };

      const incoming = S._incomingLinks.get(conceptId) || [];
      const outgoing = S._outgoingLinks.get(conceptId) || [];

      // В-2: к синтетической работе отнесены не только 'synthesize' (6 рёбер
      // во всём графе, слагаемое было почти мёртвым), но и 'mediate' —
      // опосредование двух понятий третьим (16 рёбер), и 'complement' —
      // взаимное дополнение (4 ребра, симметричен, потому обе стороны).
      // Синтез принадлежит ТОМУ, КТО СИНТЕЗИРУЕТ, то есть цели ребра,
      // и требует пучка: одно ребро — ещё не соединение нескольких в одно.
      // Считаем число РАЗЛИЧНЫХ философов, чьи понятия сошлись.
      const synthesizedFrom = new Set(
        incoming.filter(r => r.type === 'synthesize')
            .map(r => (S._conceptMap.get(r.source) || {}).philosopher)
            .filter(Boolean));
      const syntheses   = synthesizedFrom.size >= 2 ? synthesizedFrom.size * 2 : 0;
      const mediations  = sumWeight(outgoing.filter(r => r.type === 'mediate'));
      const complements = sumWeight(incoming.concat(outgoing).filter(r => r.type === 'complement'));
      // М1.3: тип связи 'reconcile' не существует ни в relationTypes, ни в данных
      // (0 рёбер), поэтому слагаемое reconciliations*2 всегда было нулевым.

      const influenceSources = new Set(
      incoming
      .filter(r => r.type === 'influence' || r.type === 'develop')
      .map(r => {
      const src = S._conceptMap.get(r.source);
      return src ? src.philosopher : null;
      })
      .filter(p => p !== null)
      );

      const sourceRubrics = new Set();
      incoming
      .filter(r => r.type === 'influence' || r.type === 'develop')
      .forEach(r => {
      const source = S._conceptMap.get(r.source);
      if (source) {
      (source.rubrics || []).forEach(rub => sourceRubrics.add(rub));
      }
      });

      // В-2: итог нормирован на число входящих связей. Без нормировки
      // слагаемые diverseInfluences и thematicBreadth растут вместе со
      // входящей степенью, и метрика в значительной мере повторяла её
      // (корреляция рангов со степенью узла была 0.62 — вторая по величине
      // в наборе). Нормировка отвечает на вопрос «насколько разнообразны и
      // переработаны входы», а не «сколько их».
      const incomingCount = incoming.length;
      const rawSynthetic = syntheses * 3 + mediations * 2 + complements
                 + influenceSources.size * 2 + sourceRubrics.size;

      return {
      total: rawSynthetic / Math.max(1, incomingCount),
      rawSynthetic,
      syntheses,
      mediations,
      complements,
      diverseInfluences: influenceSources.size,
      thematicBreadth: sourceRubrics.size,
      incomingCount
      };
    };

function invalidateSyntheticIndexCache() {
      syntheticIndexCache = null;
    }

let dialogicalIndexCache = null;

MET.dialogicalIndex = function dialogicalIndex(conceptId) {

      const incoming = S._incomingLinks.get(conceptId) || [];
      const outgoing = S._outgoingLinks.get(conceptId) || [];

      // М8: диалоги считались только ВХОДЯЩИЕ, хотя диалог симметричен:
      //   концепт, сам вступающий в диалог, получал ноль.
      // М9: 'bidirectional' бралось из входящих связей ЛЮБОГО типа, поэтому
      //   двунаправленный диалог засчитывался дважды. Теперь только диалоги.
      // М10: 'complement' суммировался в обе стороны, а 'dialogue' — в одну.
      //   Теперь единый подход ко всем компонентам.
      const all = incoming.concat(outgoing);
      const dialogueLinks = all.filter(r => r.type === 'dialogue');
      const dialogues = sumWeight(dialogueLinks);
      const mutualDialogues = dialogueLinks.filter(r => r.bidirectional).length;
      const complements = sumWeight(all.filter(r => r.type === 'complement'));

      // Д4: симметрия была введена в фазе М3, но в панели её не было видно —
      // диалоги схлопывались в одно число. Разделяем по направлению и
      // добавляем широту круга собеседников: прежде метрика на 96 %
      // определялась общим объёмом диалогов.
      const dialoguesIn  = sumWeight(incoming.filter(r => r.type === 'dialogue'));
      const dialoguesOut = sumWeight(outgoing.filter(r => r.type === 'dialogue'));

      const interlocutors = new Set();
      dialogueLinks.forEach(r => {
      const phil = otherPhilosopher(r, conceptId);
      if (phil) interlocutors.add(phil.nameRu || phil.id);
      });

      return {
      total: dialogues * 2 + mutualDialogues * 3 + complements + interlocutors.size * 1.5,
      dialogues,
      dialoguesIn,
      dialoguesOut,
      mutualDialogues,
      complements,
      interlocutors: interlocutors.size
      };
    };

function invalidateDialogicalIndexCache() {
      dialogicalIndexCache = null;
    }

let internalCoherenceIndexCache = null;

MET.internalCoherenceIndex = function internalCoherenceIndex(conceptId) {

      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };

      const incoming = S._incomingLinks.get(conceptId) || [];
      const outgoing = S._outgoingLinks.get(conceptId) || [];

      const internalLinks = incoming.concat(outgoing).filter(r => {
      const other = S._conceptMap.get(r.source === conceptId ? r.target : r.source);
      return other && other.philosopher === concept.philosopher;
      });

      // М15: веса учитываются. В список «положительных» добавлены пропущенные
      // 'synthesize' и 'instrument'. 'critique' и 'limit' внутри одной системы
      // сознательно оставлены нейтральными: критика собственного понятия не
      // обязательно означает несогласованность.
      const positive = sumWeight(internalLinks.filter(r =>
      // C5: взаимоопределение говорит о связности ядра системы —
      // понятия, держащиеся друг за друга. Обоснованием оно не является
      // (у типа нет ground), поэтому в дедуктивные метрики не входит,
      // а в связность — входит наравне с complement.
      ['presuppose', 'consequence', 'develop', 'apply', 'complement', 'correlative',
      'condition', 'exemplify', 'culminate', 'mediate',
      'synthesize', 'instrument'].includes(r.type)
      ));

      const negative = sumWeight(internalLinks.filter(r =>
      ['internal_contradiction', 'oppose'].includes(r.type)
      ));

      // М6: раньше это была сырая сумма, поэтому философ с тридцатью
      // концептами автоматически оказывался «связнее» философа с пятью.
      // Нормируем на размер системы автора.
      const authorSize = S._concepts.filter(c => c.philosopher === concept.philosopher).length;
      const coherenceScore = (positive - negative * 2) / Math.max(1, authorSize - 1);

      // М7: Math.max(0, …) схлопывал всё несогласованное в ноль и оставлял
      // 11 различных значений на весь корпус. Отрицательное значение
      // содержательно: концепт конфликтует с системой своего автора.
      return {
      // Д1: поле coherenceScore удалено — оно совпадало с total
      total: coherenceScore,
      positive,
      negative,
      authorSize
      };
    };

function invalidateInternalCoherenceIndexCache() {
      internalCoherenceIndexCache = null;
    }

let tensionIndexCache = null;

MET.tensionIndex = function tensionIndex(conceptId) {
      const incoming = S._incomingLinks.get(conceptId) || [];
      const outgoing = S._outgoingLinks.get(conceptId) || [];
      const concept = S._conceptMap.get(conceptId);
      
      // ============================================
      // УРОВЕНЬ 1: ИММАНЕНТНОЕ НАПРЯЖЕНИЕ
      // (внутренняя противоречивость концепции)
      // ============================================
      
      // 1.1 Внутренние противоречия (главный источник)
      // Самоопровержение и самоограничение. Формула уже берёт
      // противоречия с обеих сторон разом и уже даёт надбавку
      // за взаимность; петля есть предельный случай взаимности,
      // и надбавка 1.5 причитается ей по построению.
      const _rflT = reflexiveLinkOf(conceptId);
      const selfContradiction = (_rflT && _rflT.type === 'internal_contradiction')
        ? (_rflT.weight || 2) * 1.5 : 0;
      const selfLimit = (_rflT && _rflT.type === 'limit') ? (_rflT.weight || 2) : 0;

      const internalContradictions = [...incoming, ...outgoing].filter(r => 
        r.type === 'internal_contradiction'
      ).reduce((sum, r) => {
        // Симметричность и есть взаимность: у internal_contradiction
        // она свойство типа, поэтому надбавка полагается всем.
        const bidirectionalBonus = isSymmetricLink(r) ? 1.5 : 1;
        return sum + (r.weight || 1) * bidirectionalBonus;
      }, 0);
      
      // 1.2 Ограничения (напряжение границ)
      const acknowledgedLimits = [...incoming, ...outgoing].filter(r => 
        r.type === 'limit'
      ).length;
      
      // 1.3 Условность (зависимость от предпосылок)
      const conditionalDependencies = incoming.filter(r => 
        r.type === 'condition'
      ).length;
      
      // 1.4 Опосредование (стоять между противоположностями)
      const mediations = [...incoming, ...outgoing].filter(r => 
        r.type === 'mediate'
      ).length;
      
      // 1.5 Потребность в дополнении (неполнота)
      const complementarityNeeds = [...incoming, ...outgoing].filter(r => 
        r.type === 'complement'
      ).length;
      
      // C7: ярус переименован по существу. Прежде «имманентное напряжение»
      // соседствовало с «полемическим», то есть с историческим слоем, —
      // и обе метрики измеряли одно. Теперь tensionIndex целиком лежит
      // в логическом слое (A9) и распадается на противоречие,
      // опосредование и разрешение.
      const immanentTension = 
        internalContradictions * 3.0 +
        acknowledgedLimits * 1.5 +
        conditionalDependencies * 1.2;
      
      // ============================================
      // УРОВЕНЬ 2: ПОЛЕМИЧЕСКОЕ НАПРЯЖЕНИЕ
      // (конфликтность позиции)
      // ============================================
      
      // 2.1 Исходящая агрессия (активная критика)
      const outgoingConflict = outgoing.filter(r => 
        r.type === 'oppose' || r.type === 'critique'
      ).reduce((sum, r) => sum + (r.weight || 1), 0);
      
      // 2.2 Входящая критика (оспариваемость)
      const incomingConflict = incoming.filter(r => 
        r.type === 'oppose' || r.type === 'critique'
      ).reduce((sum, r) => sum + (r.weight || 1), 0);
      
      // 2.3 Взаимная полемика (двусторонние споры)
      const mutualPolemics = incoming.filter(r => 
        r.type === 'dialogue' && r.bidirectional
      ).length;
      
      // C7: полемика (critique/oppose/dialogue) — исторический слой,
      // передана problemGenerationIndex. Здесь её место занимает
      // опосредование: понятие, стоящее между противоположностями
      // или требующее дополнения, несёт напряжение по самому устройству.
      const polemicalTension = 
        mediations * 2.0 +
        complementarityNeeds * 1.0;
      
      // ============================================
      // УРОВЕНЬ 3: ДИАЛЕКТИЧЕСКОЕ НАПРЯЖЕНИЕ
      // (продуктивность противоречия)
      // ============================================
      
      // 3.1 Синтезы (попытки разрешения)
      const syntheses = outgoing.filter(r => 
        r.type === 'synthesize'
      ).length;
      
      // 3.2 Кульминации (переходы к новому качеству)
      const culminations = outgoing.filter(r => 
        r.type === 'culminate'
      ).length;
      
      // 3.3 Порождение новых концепций
      const emergentConcepts = incoming.filter(r => 
        r.type === 'emerge_from'
      ).length;
      
      // 3.4 Развития (попытки преодолеть противоречие)
      const developments = outgoing.filter(r => 
        r.type === 'develop'
      ).length;
      
      // C7: разрешение — то, что автор системы успел снять сам.
      // Внешние конфликты убраны из подсчёта: они историчны.
      const totalContradictions = internalContradictions;
      const resolutionAttempts = syntheses * 2.0 + culminations * 1.5;
      const unresolvedTension = Math.max(
        immanentTension + polemicalTension - resolutionAttempts, 0);
      
      const dialecticalTension = resolutionAttempts;
      
      // ============================================
      // ИНТЕГРАЛЬНЫЙ ИНДЕКС
      // ============================================
      
      // Взвешенная сумма трёх типов напряжения
      // Д3: ярусы нормируются на собственную сигму по графу, иначе
      // разброс различается втрое и диалектический ярус подменяет собой
      // итог (корреляция 0.979 при прежних коэффициентах).
      // C7: ярусная нормировка на собственную сигму больше не нужна —
      // ярусов в прежнем смысле нет, есть одна разность в общих единицах.
      // TENSION_WEIGHTS и tensionScales() сохранены: первые применяются
      // к слагаемым напряжения, вторые остаются для обратной совместимости
      // вызовов и не участвуют в итоге.
      const total = unresolvedTension;
      
      // ============================================
      // ДОПОЛНИТЕЛЬНЫЕ АНАЛИТИЧЕСКИЕ МЕТРИКИ
      // ============================================
      
      // Баланс между напряжением и разрешением
      const tensionResolutionRatio = totalContradictions > 0 
        ? resolutionAttempts / totalContradictions 
        : 0;
      
      // Доминирующий тип напряжения
      // C7: три исхода — противоречие, опосредование, снятое напряжение
      const dominantType = 
        resolutionAttempts >= immanentTension + polemicalTension ? 'dialectical' :
        immanentTension >= polemicalTension ? 'immanent' : 'polemical';
      
      // Интенсивность (средний вес связей)
      // C7: интенсивность считается по тем же типам, что и сам индекс
      const allTensionLinks = [
        ...incoming.filter(r => ['internal_contradiction', 'limit', 'condition', 'mediate', 'complement'].includes(r.type)),
        ...outgoing.filter(r => ['internal_contradiction', 'limit', 'mediate', 'complement'].includes(r.type))
      ];
      const averageIntensity = allTensionLinks.length > 0
        ? allTensionLinks.reduce((sum, r) => sum + (r.weight || 1), 0) / allTensionLinks.length
        : 0;
      
      return {
        // Общий индекс
        total,
        
        // Три уровня напряжения
        immanentTension,
        polemicalTension,
        dialecticalTension,
        
        // Компоненты имманентного напряжения
        immanent: {
          internalContradictions,
          acknowledgedLimits,
          conditionalDependencies
        },
        
        // C7: ярус опосредования (прежде — полемического напряжения)
        polemical: {
          mediations,
          complementarityNeeds
        },
        
        // Компоненты диалектического напряжения
        dialectical: {
          syntheses,
          culminations,
          resolutionAttempts,
          unresolvedTension
        },
        
        // Аналитические метрики
        analytics: {
          dominantType,
          tensionResolutionRatio,
          averageIntensity,
          totalContradictions
        }
      };
    };

function invalidateTensionIndexCache() {
      tensionIndexCache = null;
    }

const INFLUENCE_SCOPE_LABELS = {
      all: 'вся', within: 'внутри традиций', cross: 'за пределы традиций'
    };

export { DISRUPTIVE_TYPES, INFLUENCE_SCOPE_LABELS, SYSTEMATIC_TYPES, criticalPowerIndexCache, dialogicalIndexCache, foundationalIndexCache, influenceIndexCache, internalCoherenceIndexCache, invalidateCriticalPowerIndexCache, invalidateDialogicalIndexCache, invalidateFoundationalIndexCache, invalidateInfluenceIndexCache, invalidateInternalCoherenceIndexCache, invalidateParadigmShiftIndexCache, invalidateProblemGenerationIndexCache, invalidateRevolutionaryIndexCache, invalidateSyntheticIndexCache, invalidateTensionIndexCache, paradigmShiftIndexCache, problemGenerationIndexCache, revolutionaryIndexCache, syntheticIndexCache, tensionIndexCache };
