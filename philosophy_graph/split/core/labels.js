// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from './ns.js';

const CHRONOLOGY_MODES = {
      STRICT: 'strict',     // Строгая: учёт реальных периодов активности
      MODERATE: 'moderate',   // Умеренная: окно ±50 лет от рождения
      LOOSE: 'loose'      // Свободная: окно ±100 лет от рождения
    };

const MATURITY_AGE = 25;

const RELATION_HINTS = {
      'influence':        'X повлиял на Y: воздействие без прямого продолжения понятия',
      'develop':        'Y развивает X: понятие подхвачено под своим или почти своим именем',
      'critique':         'X критикует Y: разбор доводов, а не просто иная позиция',
      'oppose':         'X противостоит Y: противопоставление позиций без разбора',
      'dialogue':         'X обсуждает Y не в критическом ключе',
      'synthesize':       'X синтезирован в Y. Синтезом считается ПУЧОК: два и более источника у одной цели',
      'typological':      'X и Y сходны, сложившись независимо: прямого заимствования не было',
      'typological_opposition': 'X и Y противоположны, сложившись независимо: прямого заимствования не было',
      'consequence':      'Из X следует Y: источник — основание, цель — вывод',
      'presuppose':       'X предполагает Y: источник зависим, основание в цели',
      'condition':        'X есть условие Y',
      'emerge_from':      'X возникает из Y',
      'culminate':        'X достигает вершины в Y',
      'exemplify':        'X иллюстрирует Y: частное и общее',
      'apply':          'X применяет себя к себе: самоприменение метода. Между РАЗНЫМИ понятиями пользуйтесь instrument',
      'instrument':       'X служит орудием для Y',
      'limit':          'X ограничивает Y',
      'complement':       'X и Y дополняют друг друга: построены независимо и поддерживают друг друга',
      'correlative':      'X и Y определимы только друг через друга: соотносительная пара, обоснования тут нет ни в одну сторону',
      'mediate':        'X опосредует Y',
      'internal_contradiction': 'X и Y противоречат друг другу внутри одной системы'
    };

const LAYER_NAMES = {
      historical:  'исторический слой — связывает людей',
      logical:   'логический слой — связывает положения внутри системы',
      typological: 'типологический слой — связывает системы без линии передачи',
      both:    'оба слоя — и между философами, и внутри одной системы'
    };

function relationHint(typeId) {
      const t = DATA.relationTypesObj[typeId] || {};
      const parts = [];
      if (RELATION_HINTS[typeId]) parts.push(RELATION_HINTS[typeId]);
      if (LAYER_NAMES[t.layer]) parts.push(LAYER_NAMES[t.layer]);
      if (t.ground) parts.push('основание в ' + (t.ground === 'source' ? 'источнике' : 'цели'));
      if (t.symmetric) parts.push('симметричен: направления у отношения нет');
      const n = DATA.links.filter(l => l.type === typeId).length;
      if (n) parts.push('рёбер в базе: ' + n);
      return parts.join('\n');
    }

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

const INFLUENCE_SCOPE_LABELS = {
      all: 'вся', within: 'внутри традиций', cross: 'за пределы традиций'
    };

const WEIGHT_WORDS = { 1: 'слабая связь', 2: 'обычная связь', 3: 'сильная связь' };

const METRIC_FIELD_LABELS = {
      total: 'Итог',
      dialoguesIn: 'Диалогов входящих', dialoguesOut: 'Диалогов исходящих',
      interlocutors: 'Разных собеседников',
      rawCriticalActivity: 'Критическая активность (сырая)',
      weightedCriticalActivity: 'Критическая активность (взвешенная)',
      criticalConsequences: 'Следствий критики', ownDevelopments: 'Собственных развитий',
      targetedPhilosophers: 'Философов под критикой', targetInfluence: 'Влиятельность целей',
      retroactiveCritiques: 'Критика предшественников', contemporaryCritiques: 'Критика современников',
      constructivenessRatio: 'Доля конструктивного', targets: 'Цели критики',
      immanent: 'Имманентный ярус', polemical: 'Полемический ярус',
      dialectical: 'Диалектический ярус', analytics: 'Производные показатели',
      positive: 'Поддерживающих связей', negative: 'Конфликтующих связей',
      authorSize: 'Концептов у автора',
      presuppositions: 'Предпосылок (вх.)', conditions: 'Условий (исх.)',
      emergences: 'Возникновений из него', applications: 'Применений',
      developments: 'Развитий', culminations: 'Кульминаций',
      dialogues: 'Диалогов', mutualDialogues: 'Взаимных диалогов',
      complements: 'Дополнений', syntheses: 'Синтезов',
      diverseInfluences: 'Разных истоков', thematicBreadth: 'Тематическая широта',
      ratio: 'Отдача на заимствование', volume: 'Объём переработки',
      influences: 'Заимствований', forward: 'Влияние на поздних',
      contemporary: 'Диалог с современниками', incoming: 'Входящих связей',
      instrumentality: 'Инструментальность', rubricsBreadth: 'Широта рубрик',
      scope: 'Взгляд',
      share: 'Доля межтрадиционных по весу, %', crossingLinks: 'Межтрадиционных связей',
      crossWeight: 'Вес межтрадиционных связей',
      externalLinks: 'Внешних связей', traditionsReached: 'Достигнуто традиций',
      belowThreshold: 'Ниже порога связности',
      laterAdopters: 'Поздних последователей', isMethodological: 'Рубрика «метод»',
      immanentTension: 'Противоречие', polemicalTension: 'Опосредование',
      dialecticalTension: 'Разрешение',
      internalContradictions: 'Внутренних противоречий',
      outgoingContradictions: 'Исходящих противоречий',
      incomingCritiques: 'Полученной критики', incomingOppositions: 'Полученных оппозиций',
      acknowledgedLimits: 'Признанных ограничений',
      conditionalDependencies: 'Условных зависимостей',
      conceptsEmergedFrom: 'Порождённых концептов',
      independenceScore: 'Независимость от традиции', rubricDiversity: 'Разнообразие рубрик',
      futureImpact: 'Влияние в будущее',
      effectiveness: 'Эффективность критики', targets: 'Целей критики',
      majorTargets: 'Центральных целей', eraSpan: 'Временной размах, лет',
      weightedActivity: 'Взвешенная активность',
      generativityScore: 'Генеративность (среднее по графу = 1)',
      directSuccessors: 'Прямых преемников', successorAuthors: 'Авторов среди преемников',
      outgoingLinks: 'Исходящих связей', exertedFlat: 'Оказанное влияние (плоский подсчёт)',
      rawSynthetic: 'Синтетическая работа (до нормировки)',
      mediations: 'Опосредований', incomingCount: 'Входящих связей',
      exerted: 'Оказанное влияние',
      rawDensity: 'Плотность без учёта типов, %',
      systematicLinks: 'Систематических связей', disruptiveLinks: 'Разрушающих связей',
      constructiveReach: 'Преемственный охват', polemicalReach: 'Полемический охват',
      bridgedPairs: 'Наведено мостов между рубриками',
      constructive: 'Преемственных ссылок', polemical: 'Полемических ссылок',
      servesAsMethod: 'Служит методом для', domainsServed: 'Затронуто рубрик',
      crossAuthor: 'Целей у других авторов', instrumentLinks: 'Связей «инструмент»',
      illustratedBy: 'Его иллюстрируют', illustrates: 'Сам иллюстрирует',
      distinctIllustrations: 'Разных иллюстраций',
      directConsequences: 'Прямых следствий', derivationDepth: 'Глубина вывода',
      breadth: 'Философов среди целей', consequenceLinks: 'Связей «следствие»',
      generations: 'Поколений', gaps: 'Пропусков', laterReferences: 'Ссылок из будущего',
      coverage: 'Покрытие поколений',
    };

const PHIL_SIM_LABELS = { profile: 'профиль метрик', style: 'способ построения',
                  structure: 'структура связей', rubrics: 'тематический охват' };

const WEIGHT_OPTIONS = [
      [1, '1 — слабая связь'],
      [2, '2 — обычная связь'],
      [3, '3 — сильная связь']
    ];

const CONN_WEIGHT_WORDS = { 1: 'слабая', 2: 'обычная', 3: 'сильная' };

export { CHRONOLOGY_MODES, CONN_WEIGHT_WORDS, INFLUENCE_SCOPE_LABELS, LAYER_NAMES, MATURITY_AGE, METRIC_FIELD_LABELS, PHIL_SIM_LABELS, RELATION_HINTS, SIM_METRIC_LABELS, WEIGHT_OPTIONS, WEIGHT_WORDS, relationHint };
