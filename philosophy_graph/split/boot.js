// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S, MET, VIEWS } from './core/ns.js';
import { loadData } from './data/load.js';
import { buildIndexes } from './core/graph-index.js';
import { onReady, onLoad } from './core/ready.js';
import { closeAllModals } from './boot-defs.js';
import { CHRONOLOGY_MODES } from './core/labels.js';
import { isReflexiveLink, isSymmetricLink } from './core/predicates.js';
import { cancelGraphSelection } from './data/mutate.js';
import { hasUnsavedEdits } from './data/save.js';
import { CHAIN_SEARCH } from './filters/chains.js';
import { linkPassesTraditions, philTraditionsSelected } from './filters/filters.js';
import { generativity } from './metrics/generativity.js';
import { initializePhilosophyMetrics } from './metrics/init.js';
import { BRIDGING_MIN_EXTERNAL, BRIDGING_WEIGHT_REF, DISRUPTIVE_TYPES, PHIL_SIM_MIN_RUBRIC_UNION, SYSTEMATIC_TYPES } from './metrics/thresholds.js';
import { renderAuthControls } from './modal/auth.js';
import { modalStack } from './modal/context.js';
import { popModalState } from './modal/core.js';
import { makeLegendsEditable } from './modal/philosopher-view.js';
import { initPathFinder } from './paths/path-ui.js';
import { resizeCanvas } from './render/canvas-core.js';
import { dragended, dragstarted, linkHandlers, makeClassed, nodeHandlers, subSelection } from './render/d3-layer.js';
import { cols, groupPositions, restorePanelStates } from './render/grouping.js';
import { initGraphEventHandlers } from './render/interactions.js';
import { saveOriginalRadii } from './render/metric-visualization.js';
import { pickNode, rebuildQuadtree } from './render/picking.js';
import { requestDraw } from './render/scene.js';
import { maxTicks } from './render/simulation.js';
import { selectedEdges } from './state.js';
import { closeStatsModal } from './stats/modal.js';
import { initializeCustomSelects } from './ui/custom-select.js';
import { initFilters, updateFilterStats } from './ui/legend.js';
import { labelWithAuthor } from './util/format.js';

export async function boot() {
  await loadData();
  buildIndexes();
  DATA.concepts.forEach(c => {
        DATA.conceptToRubrics[c.id] = c.rubrics || [];
      });
  
  DATA.rubrics.forEach(r => {
        DATA.rubricsObj[r.name] = {
          concepts: DATA.concepts.filter(c => c.rubrics && c.rubrics.includes(r.id)).map(c => c.id),
          description: r.description
        };
      });
  
  S.useWeightedPaths = true;
  
  S.respectDirection = true;
  
  S.skipTypologicalInPaths = false;
  
  S.currentChronologyMode = CHRONOLOGY_MODES.STRICT;
  
  S.selectedPhilosophers = new Set(Object.keys(DATA.philosopherConcepts));
  
  S.selectedRelations = new Set(Object.keys(DATA.relationTypesObj));
  
  S.selectedTraditions = new Set(DATA.traditions.map(t => t.id));
  
  DATA.philosophers.forEach(p => { DATA.philosopherTraditions[p.nameRu] = p.traditions || []; });
  
  S.selectedRubrics = new Set(DATA.rubrics.map(r => r.id));
  
  S.filterMode = 'all';
  
  S.LoadingIndicator = {
        create(title, subtitle, color = '#3498db') {
          const indicator = document.createElement('div');
          const id = 'loadingIndicator_' + Date.now();
          indicator.id = id;
          indicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(52, 73, 94, 0.95);
            color: white;
            padding: 25px 35px;
            border-radius: 12px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            min-width: 320px;
          `;
          indicator.innerHTML = `
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; text-align: center;">
              ${title}
            </div>
            <div style="font-size: 11px; opacity: 0.8; margin-bottom: 15px; text-align: center;">
              ${subtitle}
            </div>
            <div style="background: rgba(255,255,255,0.2); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
              <div class="progress-bar" style="background: ${color}; height: 100%; width: 0%; transition: width 0.3s ease-out;"></div>
            </div>
            <div class="progress-text" style="font-size: 12px; text-align: center; opacity: 0.9;">0%</div>
            <div style="text-align: center; margin-top: 12px;">
              <button class="cancel-btn" style="background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; padding: 5px 14px; font-size: 11px; cursor: pointer;">Прервать</button>
            </div>
          `;
          document.body.appendChild(indicator);
          // F2: прерывание расчёта
          const cancelBtn = indicator.querySelector('.cancel-btn');
          if (cancelBtn) cancelBtn.addEventListener('click', () => {
            if (typeof CHAIN_SEARCH !== 'undefined') CHAIN_SEARCH.cancel();
            cancelBtn.textContent = 'Прерывается…';
            cancelBtn.disabled = true;
          });
          
          return {
            id: id,
            updateProgress(percent) {
              const progressBar = indicator.querySelector('.progress-bar');
              const progressText = indicator.querySelector('.progress-text');
              if (progressBar) progressBar.style.width = percent + '%';
              if (progressText) progressText.textContent = Math.round(percent) + '%';
            },
            remove() {
              const elem = document.getElementById(id);
              if (elem) document.body.removeChild(elem);
            }
          };
        }
      };
  
  S.FilterModes = {
        all: {
          name: 'Только выбранные философы',
          linkFilter: (l) => {
            // Проверка типа связи и философов
            const baseCheck = S.selectedRelations.has(l.type) &&
                     S.selectedPhilosophers.has(l.source.concept) &&
                     S.selectedPhilosophers.has(l.target.concept);
            
            if (!baseCheck) return false;
  
            if (!linkPassesTraditions(l, true)) return false;
            
            // Проверка рубрик
            const sourceId = l.source.id || l.source;
            const targetId = l.target.id || l.target;
            const sourceRubrics = DATA.conceptToRubrics[sourceId] || [];
            const targetRubrics = DATA.conceptToRubrics[targetId] || [];
            
            // Связь видна, если хотя бы одна рубрика source или target выбрана
            const sourceHasSelectedRubric = sourceRubrics.length === 0 || 
                             sourceRubrics.some(r => S.selectedRubrics.has(r));
            const targetHasSelectedRubric = targetRubrics.length === 0 || 
                             targetRubrics.some(r => S.selectedRubrics.has(r));
            
            return sourceHasSelectedRubric && targetHasSelectedRubric;
          }
        },
        internal: {
          name: 'Только внутренние связи',
          linkFilter: (l) => {
            // Проверка типа связи, философов и внутренней связи
            const baseCheck = S.selectedRelations.has(l.type) &&
                     S.selectedPhilosophers.has(l.source.concept) &&
                     S.selectedPhilosophers.has(l.target.concept) &&
                     l.source.concept === l.target.concept;
            
            if (!baseCheck) return false;
  
            if (!linkPassesTraditions(l, true)) return false;
            
            // Проверка рубрик
            const sourceId = l.source.id || l.source;
            const targetId = l.target.id || l.target;
            const sourceRubrics = DATA.conceptToRubrics[sourceId] || [];
            const targetRubrics = DATA.conceptToRubrics[targetId] || [];
            
            const sourceHasSelectedRubric = sourceRubrics.length === 0 || 
                             sourceRubrics.some(r => S.selectedRubrics.has(r));
            const targetHasSelectedRubric = targetRubrics.length === 0 || 
                             targetRubrics.some(r => S.selectedRubrics.has(r));
            
            return sourceHasSelectedRubric && targetHasSelectedRubric;
          }
        },
        context: {
          name: 'С соседними узлами',
          linkFilter: (l) => {
            // Проверка типа связи и хотя бы одного философа
            const baseCheck = S.selectedRelations.has(l.type) &&
                     (S.selectedPhilosophers.has(l.source.concept) ||
                      S.selectedPhilosophers.has(l.target.concept));
            
            if (!baseCheck) return false;
  
            if (!linkPassesTraditions(l, false)) return false;
            
            // Проверка рубрик
            const sourceId = l.source.id || l.source;
            const targetId = l.target.id || l.target;
            const sourceRubrics = DATA.conceptToRubrics[sourceId] || [];
            const targetRubrics = DATA.conceptToRubrics[targetId] || [];
            
            const sourceHasSelectedRubric = sourceRubrics.length === 0 || 
                             sourceRubrics.some(r => S.selectedRubrics.has(r));
            const targetHasSelectedRubric = targetRubrics.length === 0 || 
                             targetRubrics.some(r => S.selectedRubrics.has(r));
            
            return sourceHasSelectedRubric && targetHasSelectedRubric;
          }
        },
        external: {
          name: 'Только внешние связи',
          linkFilter: (l) => {
            // Проверка типа связи, философов и внешней связи
            const baseCheck = S.selectedRelations.has(l.type) &&
                     (S.selectedPhilosophers.has(l.source.concept) ||
                      S.selectedPhilosophers.has(l.target.concept)) &&
                     l.source.concept !== l.target.concept;
            
            if (!baseCheck) return false;
  
            if (!linkPassesTraditions(l, false)) return false;
            
            // Проверка рубрик
            const sourceId = l.source.id || l.source;
            const targetId = l.target.id || l.target;
            const sourceRubrics = DATA.conceptToRubrics[sourceId] || [];
            const targetRubrics = DATA.conceptToRubrics[targetId] || [];
            
            const sourceHasSelectedRubric = sourceRubrics.length === 0 || 
                             sourceRubrics.some(r => S.selectedRubrics.has(r));
            const targetHasSelectedRubric = targetRubrics.length === 0 || 
                             targetRubrics.some(r => S.selectedRubrics.has(r));
            
            return sourceHasSelectedRubric && targetHasSelectedRubric;
          }
        },
        within_traditions: {
          name: 'Только внутри выбранных традиций',
          linkFilter: (l) => {
            if (!S.selectedRelations.has(l.type)) return false;
            if (!S.selectedPhilosophers.has(l.source.concept)) return false;
            if (!S.selectedPhilosophers.has(l.target.concept)) return false;
            if (l.source.concept === l.target.concept) return false;
            const s = philTraditionsSelected(l.source.concept);
            const t = philTraditionsSelected(l.target.concept);
            if (!s.some(x => t.includes(x))) return false;
            const sr = DATA.conceptToRubrics[l.source.id || l.source] || [];
            const tr = DATA.conceptToRubrics[l.target.id || l.target] || [];
            return (sr.length === 0 || sr.some(r => S.selectedRubrics.has(r)))
                && (tr.length === 0 || tr.some(r => S.selectedRubrics.has(r)));
          }
        },
        between_traditions: {
          name: 'Только между выбранными традициями',
          linkFilter: (l) => {
            if (!S.selectedRelations.has(l.type)) return false;
            if (!S.selectedPhilosophers.has(l.source.concept)) return false;
            if (!S.selectedPhilosophers.has(l.target.concept)) return false;
            if (l.source.concept === l.target.concept) return false;
            const s = philTraditionsSelected(l.source.concept);
            const t = philTraditionsSelected(l.target.concept);
            if (!s.length || !t.length) return false;
            if (s.some(x => t.includes(x))) return false;
            const sr = DATA.conceptToRubrics[l.source.id || l.source] || [];
            const tr = DATA.conceptToRubrics[l.target.id || l.target] || [];
            return (sr.length === 0 || sr.some(r => S.selectedRubrics.has(r)))
                && (tr.length === 0 || tr.some(r => S.selectedRubrics.has(r)));
          }
        },
        cross_selected: {
          name: 'Межфилософские связи выбранных',
          linkFilter: (l) => {
            // Проверка типа связи, философов и межфилософской связи
            const isDifferent = S.selectedPhilosophers.size === 1 || 
                       l.source.concept !== l.target.concept;
            const baseCheck = S.selectedRelations.has(l.type) &&
                     S.selectedPhilosophers.has(l.source.concept) &&
                     S.selectedPhilosophers.has(l.target.concept) &&
                     isDifferent;
            
            if (!baseCheck) return false;
  
            if (!linkPassesTraditions(l, true)) return false;
            
            // Проверка рубрик
            const sourceId = l.source.id || l.source;
            const targetId = l.target.id || l.target;
            const sourceRubrics = DATA.conceptToRubrics[sourceId] || [];
            const targetRubrics = DATA.conceptToRubrics[targetId] || [];
            
            const sourceHasSelectedRubric = sourceRubrics.length === 0 || 
                             sourceRubrics.some(r => S.selectedRubrics.has(r));
            const targetHasSelectedRubric = targetRubrics.length === 0 || 
                             targetRubrics.some(r => S.selectedRubrics.has(r));
            
            return sourceHasSelectedRubric && targetHasSelectedRubric;
          }
        }
      };
  
  S.visibleNodeIds = null;
  
  S.visibleLinkSet = null;
  
  S.metricsLinkSource = null;
  
  S.metricsNodeSource = null;
  
  S.metricsScopeActive = false;
  
  S.lastScopeKey = null;
  
  S._concepts = null;
  
  S._relations = null;
  
  S._philosophers = null;
  
  S._conceptMap = null;
  
  S._philosopherMap = null;
  
  S._incomingLinks = null;
  
  S._outgoingLinks = null;
  
  S.generateRankingsCache = null;
  
  S._medianDegreeCache = null;
  
  S.influenceScope = 'all';
  
  S.metricsScope = 'full';
  
  S.metricDescriptions = {
        'philosopher-comparison': {
          name: "Сравнение философов",
          description: "Схожесть двух философских систем по четырём независимым мерам",
          interpretation: () => `Профиль метрик отвечает, каковы системы по совокупности показателей. Способ построения — какими типами связей философ строит систему: у Аристотеля преобладает следствие, у Гераклита противопоставление, у Платона кульминация. Структура — связаны ли философы с одними и теми же авторами. Тематический охват сравнивает распределение по рубрикам. Меры почти независимы: попарные корреляции по всем ${(() => { const _p = new Set(S._concepts.map(c => c.philosopher)).size; return _p * (_p - 1) / 2; })()} парам лежат между −0.01 и 0.17.`,
          usage: () => "Проверка догадок о родстве систем и поиск неожиданных параллелей. Столбики показывают средний уровень философа по метрике относительно сильнейшего, а цифры рядом — среднее с разбросом по его концепциям: разброс отличает систему с одной яркой идеей от ровной.",
          formula: () => "Профиль: косинус по вектору из средних и разбросов пяти метрик плюс систематичность, охват и междисциплинарность, дважды центрированному. Способ построения: то же по долям 18 типов связей. Структура: |A∩B| / |A∪B| по множествам философов-соседей. Рубрики: косинус по долям рубрик, только для авторов не менее чем с тремя концепциями"
        },
        'philosopher-pairs': {
          name: "Близкие пары философов",
          description: "Рейтинг наиболее схожих пар философов по каждой из четырёх мер",
          interpretation: () => "Списки по разным мерам заметно расходятся, и это содержательно. По способу построения вверху оказываются Локк с Юмом и Дильтей с Гуссерлем, по структуре — Платон с Аристотелем и Гераклит с Уайтхедом, то есть философия процесса через двадцать пять веков.",
          usage: () => { const _p = new Set(S._concepts.map(c => c.philosopher)).size; return `Обзор родственных систем целиком. Клик по строке открывает пару в подробном сравнении. Философов всего ${_p}, поэтому все ${_p * (_p - 1) / 2} пар считаются мгновенно и фильтры не нужны.`; },
          formula: () => `Те же четыре меры, что в сравнении философов, посчитанные для всех пар и отсортированные по убыванию. C4: тематический охват при 1.37 рубрики на концепцию показывает совпадение доминирующей темы, а не родство систем; пары, у которых объединение ненулевых рубрик меньше ${PHIL_SIM_MIN_RUBRIC_UNION}, из меры исключены как неразличимые`
        },
        'closest-pairs': {
          name: "Близкие пары концепций",
          description: "Наиболее схожие пары по профилю метрик и по структуре связей",
          interpretation: () => `Профильная близость находит функциональные аналоги: понятия, играющие в своих системах одну роль, даже если между ними нет ни одной связи. Структурная близость находит понятия, окружённые одними и теми же соседями. Меры почти независимы — корреляция по всем ${(S._concepts.length * (S._concepts.length - 1) / 2).toLocaleString('ru')} парам составляет 0.05, — поэтому списки заметно расходятся, и расхождение содержательно.`,
          usage: () => "Поиск неочевидных параллелей между традициями. Фильтр связности обязателен: у малосвязных концептов почти все метрики нулевые, профили выходят одинаковыми, и без порога верх списка занимают не родственные, а просто бедные данными понятия. Порог по умолчанию равен медианной связности графа. Клик по строке открывает пару в подробном сравнении.",
          formula: () => "Профиль: косинус между дважды центрированными векторами метрик. Структура: |A∩B| / |A∪B| по множествам соседей. Отбор: обе концепции со связностью не ниже порога, для структуры дополнительно минимум общих соседей, опционально только пары разных философов"
        },
        'comparison': {
          name: "Сравнение концепций",
          description: "Функциональная схожесть двух концепций по профилю метрик и по структуре связей",
          interpretation: () => "Схожесть профиля — это корреляция между наборами метрик двух концепций: насколько похожа их роль в системе. Схожесть структуры — коэффициент Жаккара по общим соседям. Меры отвечают на разные вопросы и часто расходятся: высокая профильная при нулевой структурной означает функциональный аналог в другой традиции, у которого нет ни одной общей связи.",
          usage: () => `Поиск неочевидных параллелей между философскими системами и проверка догадок вида «X у Гуссерля работает так же, как Y у Фреге». Столбики показывают процентиль концепции по каждой метрике среди всех ${S._concepts.length}, поэтому видно не только насколько похожи, но и чем именно.`,
          formula: () => "Профиль: косинус между векторами метрик, дважды центрированными — сначала z-нормировка по каждой метрике, затем вычитание среднего профиля концепции. Это равносильно корреляции Пирсона. tensionIndex исключён из вектора: корреляция Пирсона 0.94 с problemGenerationIndex (ранговая 0.91). Структура: |A∩B| / |A∪B| по множествам соседей, плюс отдельно косинус между распределениями типов связей"
        },
        'generative': {
          name: "Генеративность (Generative Index)",
          description: "Насколько концепция является истоком, из которого расходятся другие идеи",
          interpretation: () => "PageRank, посчитанный против стрелок связей. Высокое значение = из концепции расходится многое, и притом расходится далеко: она питает идеи, которые сами оказываются плодотворными. Мера рекурсивная, поэтому отличает исток длинной традиции от понятия с несколькими тупиковыми ответвлениями.",
          usage: () => "Дополняет обычный PageRank, который в этом графе измеряет обратное — наследование. Две меры почти ортогональны (корреляция рангов −0.014): первая находит истоки, вторая точки схождения. Генеративность не обращается к датам жизни и потому свободна от смещения в пользу ранних или поздних философов.",
          formula: () => "GeI = PageRank обращённого графа × 10. Затухание 0.85, 40 итераций, вес ребра weight/3. Нормировано к среднему 1 с вычетом телепортационного пола, поэтому концепт без исходящих связей получает ноль"
        },
  
        // Фаза М6: метрики на ранее неиспользованных типах связей
        'bridging': {
          name: "Межтрадиционная мостовость (Tradition Bridging)",
          description: "Насколько внешние связи концепции ведут за пределы её собственной традиции",
          interpretation: () => "Высокое значение — понятие-переносчик, которое школы передают друг другу; низкое — понятие, работающее внутри своей традиции, даже если внешних связей у него много. Величина собрана из двух: ДОЛИ межтрадиционных связей и ВЕСА свидетельств. Одна доля насыщается — у 34 концепций все внешние связи межтрадиционные, и порознь они неразличимы, — поэтому рядом с числом показаны и доля, и число межтрадиционных связей: сто процентов при пяти связях и восемьдесят четыре при семнадцати дают близкие числа при совсем разном основании. Смотреть стоит и на низ списка: там понятия, работающие внутри своей традиции при немалом числе внешних связей. ЧЕСТНО О ЦЕНЕ: множитель свидетельств вернул в меру связность — ранговая корреляция с общей степенью узла 0,33 против 0,05 у чистой доли.",
          usage: () => `Поиск понятий, которыми традиции сообщаются между собой. Порог обязателен: доля неустойчива на малых знаменателях, и при трёх связях сто процентов ничего не значат, поэтому концепции менее чем с ${BRIDGING_MIN_EXTERNAL} внешними связями получают ноль. Дополняет betweenness: тот измеряет посредничество структурное, а здесь — содержательное.`,
          formula: () => `TB = 10 × доля × ln(1 + вес межтрадиционных) / ln(1 + ${BRIDGING_WEIGHT_REF}), где доля = вес межтрадиционных внешних связей / вес всех внешних, при числе внешних связей не менее ${BRIDGING_MIN_EXTERNAL}. Делитель — общий множитель и порядка не меняет: десятка отвечает сплошь межтрадиционной концепции с весом свидетельств ${BRIDGING_WEIGHT_REF} (наибольший в базе 47). Межтрадиционной считается связь с философом, у которого нет НИ ОДНОЙ общей традиции, — тот же критерий, что в режимах отбора и при переходах в цепочке пути. ВНИМАНИЕ: единственная метрика набора, опирающаяся на РАЗМЕТКУ традиций, то есть на содержательное суждение, а не на данные графа`
        },
        'instrumental': {
          name: "Индекс инструментальности (Instrumental Index)",
          description: "Насколько концепция служит методом для других концепций",
          interpretation: () => "Высокое значение = концепция работает как инструмент познания: через неё разбираются другие идеи. Это диалектика, феноменологическая редукция, трансцендентальный метод. Метрика отличает методологические понятия от содержательных, опираясь на связи, а не на тематическую рубрику.",
          usage: () => "Поиск методологического ядра философской системы. Полезно в паре с индексом парадигмального сдвига: методологичность плюс широкое влияние на поздних и есть смена способа мышления.",
          formula: () => "InI = исх.instrument×2 + различных_рубрик_целей×2 + целей_у_других_философов, взвешено по weight. Направление: 'instrument' идёт от метода к цели (source есть инструмент для target), поэтому считаются исходящие связи"
        },
        'abstraction': {
          name: "Индекс абстрактности (Abstraction Index)",
          description: "Положение концепции на оси «абстрактное — конкретное»",
          interpretation: () => "Шкала знаковая. Положительное значение = концепцию иллюстрируют другие, то есть она выступает общим принципом. Отрицательное = концепция сама служит иллюстрацией и потому конкретна. Около нуля — понятия среднего уровня общности либо не связанные отношением иллюстрации.",
          usage: () => "Восстановление уровней общности внутри системы: какие понятия являются принципами, какие примерами. Сортировка по возрастанию даёт самые конкретные концепции, по убыванию — самые отвлечённые.",
          formula: () => "AbI = вх.exemplify − исх.exemplify, взвешено по weight. Направление: 'exemplify' идёт от конкретного к общему (source иллюстрирует target), поэтому входящие делают концепт абстрактным, исходящие — конкретным"
        },
        'deductive': {
          name: "Индекс дедуктивной продуктивности (Deductive Index)",
          description: "Сколько следствий выводится из концепции и насколько длинны цепочки вывода",
          interpretation: () => "Высокое значение = из концепции выводится многое, и выводы порождают дальнейшие выводы. Учитывается не только число прямых следствий, но и глубина цепочки: понятие, из которого следует одно положение, а из него ещё три, дедуктивно продуктивнее понятия с тремя изолированными следствиями.",
          usage: () => "Поиск аксиоматических ядер систем. ⚠️ Направление связей типа «следствие» в базе пока непоследовательно: примерно треть рёбер читается в обратную сторону. До приведения их к единой конвенции значения этой метрики следует считать предварительными.",
          formula: () => "DeI = исх.consequence×2 + глубина_цепочки×3 + различных_философов_среди_целей, взвешено по weight. Направление по объявленной конвенции: посылка = target, поэтому выводимое из концепта — его исходящие связи"
        },
  
        // М4.1: сводные представления тоже нуждаются в описании — без него
        // блок «Что измеряет» у них пуст, а после М4.3 показывал бы предупреждение.
        'concept-rankings': {
          name: "Рейтинги концепций",
          description: "Топ-10 концепций одновременно по шести философским метрикам",
          interpretation: () => "Сводка позволяет увидеть, попадает ли концепция в верхушку сразу нескольких рейтингов. Совпадение по влиянию и фундаментальности говорит о системообразующей роли; расхождение между революционностью и основополаганием — о том, что идея скорее разрывает традицию, чем держит её.",
          usage: () => "Отправная точка для обзора: отсюда удобно переходить к отдельным метрикам за подробностями.",
          formula: () => "Для каждой из шести метрик берётся её собственный total и выбираются первые десять концептов"
        },
        'philosopher-rankings': {
          name: "Рейтинги философов",
          description: "Топ-10 философов по пяти характеристикам их концептуальных систем",
          interpretation: () => "Влиятельность и революционность усредняются по всем концептам философа, поэтому автор с одной яркой идеей и множеством проходных окажется ниже автора с ровным уровнем. Плотность системы и охват, напротив, считаются по автору целиком.",
          usage: () => "Сравнение философов между собой; для разбора отдельного автора используйте «Профиль философа».",
          formula: () => "Влиятельность и революционность — среднее по концептам автора; плотность, охват и междисциплинарность — собственные метрики уровня философа"
        },
  
        // Базовые метрики
        overview: {
          name: "Общий обзор графа",
          description: "Базовая статистика сети философских концепций",
          interpretation: () => "Общие характеристики сети: количество узлов, связей, плотность сети и средняя степень связности.",
          usage: "Используйте для понимания общей структуры и масштаба сети.",
          formula: () => "Плотность = 2E / (N × (N-1)), где E - рёбра, N - узлы"
        },
        
        degree: {
          name: "Степень связности (Degree Centrality)",
          description: "Количество связей каждого узла",
          formula: () => "deg(v) = число связей узла. При учёте направленности считаются отдельно входящие и исходящие",
          interpretation: () => {
            if (S.respectDirection) {
              return "Направленный: отдельно считаются входящие (сколько влияют на концепцию) и исходящие (на сколько влияет концепция) связи. Высокий InDegree = много ссылаются, высокий OutDegree = много цитирует других.";
            } else {
              return "Ненаправленный: общее количество связей узла. Высокая степень = концепция активно связана с другими идеями в сети.";
            }
          },
          usage: () => {
            const base = "Простейшая метрика влияния. Концепции с высокой степенью связности — это хабы сети.";
            return S.respectDirection 
              ? base + " При учёте направленности можно различить \"авторитеты\" (высокий InDegree) и \"концентраторы\" (высокий OutDegree)."
              : base;
          },
          formula: () => S.respectDirection 
            ? "Degree(v) = InDegree(v) + OutDegree(v)" 
            : "Degree(v) = |{u : (v,u) ∈ E}|"
        },
        
        pagerank: {
          name: "PageRank",
          description: "Наследуемая важность: насколько концепция вбирает в себя влияние важных предшественников",
          formula: () => "PR(v) = (1−d)/N + d·Σ PR(u)/L(u) по всем u, имеющим связь В v; d = 0.85, 20 итераций. ВАЖНО про направление: связь 'influence' идёт от старшего к младшему, поэтому ранг течёт по стрелкам и копится у НАСЛЕДНИКОВ. Высокое значение означает точку схождения традиций, а не исток. Обратный вопрос — какие концепции являются истоками — решает метрика «Генеративность»",
          interpretation: () => {
            if (S.respectDirection && S.useWeightedPaths) {
              return "Направленный взвешенный: концепция важна, если на неё ссылаются важные концепции через сильные связи. Вес связи усиливает передачу важности.";
            } else if (S.respectDirection && !S.useWeightedPaths) {
              return "Направленный: концепция важна через входящие ссылки от важных узлов. Количество ссылок важнее их силы.";
            } else if (!S.respectDirection && S.useWeightedPaths) {
              return "Ненаправленный взвешенный: важность распространяется через сильные связи в обе стороны.";
            } else {
              return "Ненаправленный: классический PageRank, все связи равноценны и симметричны.";
            }
          },
          usage: () => {
            const base = "Выявляет «авторитеты» — концепции, на которые ссылаются другие важные концепции.";
            return S.useWeightedPaths 
              ? base + " С весами показывает концепции, получающие сильное влияние от авторитетных источников."
              : base + " Без весов — чисто топологическая важность.";
          },
          formula: () => {
            const base = "PR(v) = (1-d)/N + d × Σ PR(u)/OutDegree(u)";
            return S.useWeightedPaths ? base + ", с учётом весов w(u,v)" : base;
          }
        },
        
        betweenness: {
          name: "Betweenness Centrality",
          description: "Как часто узел лежит на кратчайших путях между другими узлами",
          formula: () => "BC(v) = Σ σ(s,t|v) / σ(s,t) по всем парам s ≠ v ≠ t, где σ — число кратчайших путей",
          interpretation: () => {
            if (S.respectDirection && S.useWeightedPaths) {
              return "Направленный взвешенный: концепция — мост в НАПРАВЛЕННЫХ потоках влияния с учётом силы связей. Высокое значение = незаменимый посредник в передаче СИЛЬНОГО влияния.";
            } else if (S.respectDirection && !S.useWeightedPaths) {
              return "Направленный: концепция-мост в направленных путях влияния. Контролирует потоки идей между традициями.";
            } else if (!S.respectDirection && S.useWeightedPaths) {
              return "Ненаправленный взвешенный: посредник в сильно связанных путях. Может быть менее связан количественно, но критичен в сильных взаимосвязях.";
            } else {
              return "Ненаправленный: классический betweenness. Концепция-мост между разными частями сети.";
            }
          },
          usage: () => {
            const base = "Ищите «мосты» и «узкие места» — концепции, через которые проходит философское влияние.";
            return S.useWeightedPaths 
              ? base + " С весами выявляет мосты в СУЩЕСТВЕННЫХ (сильных) связях."
              : base;
          },
          formula: () => {
            const base = "BC(v) = Σ (σ_st(v) / σ_st)";
            return S.useWeightedPaths 
              ? base + ", где пути взвешены обратно пропорционально весам рёбер" 
              : base + ", где σ_st — число кратчайших путей s→t";
          }
        },
        
        closeness: {
          name: "Closeness Centrality",
          description: "Средняя близость узла ко всем остальным узлам",
          formula: () => "CC(v) = (N−1) / Σ d(v,u) по всем достижимым u, где d — длина кратчайшего пути",
          interpretation: () => {
            if (S.respectDirection && S.useWeightedPaths) {
              return "Направленный взвешенный: как быстро концепция ВЛИЯЕТ на остальные через сильные прямые пути. Высокое значение = эффективный источник влияния.";
            } else if (S.respectDirection && !S.useWeightedPaths) {
              return "Направленный: насколько быстро концепция может повлиять на остальную сеть через направленные пути (независимо от силы).";
            } else if (!S.respectDirection && S.useWeightedPaths) {
              return "Ненаправленный взвешенный: центральность через СИЛЬНЫЕ связи. Концепция близка к другим через фундаментальные, а не случайные связи.";
            } else {
              return "Ненаправленный: топологическая близость. Концепция в центре сети, недалеко от остальных.";
            }
          },
          usage: () => {
            const base = "Находите концепции в «центре» сети — те, от которых близко до всех остальных идей.";
            return S.useWeightedPaths 
              ? base + " С весами — концепции, центральные в СИЛЬНЫХ связях."
              : base;
          },
          formula: () => {
            const base = "CC(v) = (N-1) / Σ dist(v,u)";
            return S.useWeightedPaths 
              ? base + ", где dist — взвешенное расстояние" 
              : base;
          }
        },
        
        eigenvector: {
          name: "Eigenvector Centrality",
          description: "Влиятельность узла через связи с другими влиятельными узлами",
          formula: () => "x(v) = (1/λ)·Σ x(u) по соседям u; главный собственный вектор матрицы смежности",
          interpretation: () => {
            if (S.respectDirection && S.useWeightedPaths) {
              return "Направленный взвешенный: концепция важна, если на неё СИЛЬНО влияют другие важные концепции. Входящая связь от влиятельного узла с весом 3 даёт больше 'очков', чем с весом 1.";
            } else if (S.respectDirection && !S.useWeightedPaths) {
              return "Направленный: концепция важна через входящие связи от других важных узлов. Количество важнее силы связи.";
            } else if (!S.respectDirection && S.useWeightedPaths) {
              return "Ненаправленный взвешенный: концепция важна через СИЛЬНЫЕ связи с другими важными концепциями. Взаимное усиление через фундаментальные влияния.";
            } else {
              return "Ненаправленный: концепция важна, если связана с другими важными концепциями. Симметричное взаимное усиление, все связи равны.";
            }
          },
          usage: () => {
            const base = "Используйте для выявления концепций, которые составляют ядро философской традиции. Они важны не сами по себе, а через взаимное усиление с другими ключевыми идеями.";
            return S.useWeightedPaths 
              ? base + " С весами выделяет ядро ФУНДАМЕНТАЛЬНЫХ взаимосвязей."
              : base;
          },
          formula: () => {
            const base = "x(v) = (1/λ) × Σ A(v,u) × x(u)";
            return S.useWeightedPaths 
              ? base + ", где A — взвешенная матрица смежности" 
              : base + ", где A — бинарная матрица смежности";
          }
        },
        
        'weighted-clustering': {
          name: "Взвешенная кластеризация (Weighted Clustering)",
          description: "Плотность связей в окрестности узла с учётом весов",
          formula: () => "WC(v) = сумма весов связей между соседями v, делённая на максимально возможную",
          interpretation: () => {
            if (S.useWeightedPaths) {
              return "С весами: насколько плотны и СИЛЬНЫ связи в окрестности концепции. Высокое значение = концепция в кластере плотных И фундаментальных взаимосвязей.";
            } else {
              return "Без весов: классическая кластеризация — насколько соседи узла связаны между собой. Высокое значение = концепция в плотном кластере идей.";
            }
          },
          usage: () => {
            const base = "Основная метрика кластеризации.";
            return S.useWeightedPaths 
              ? base + " С весами выявляет концепции в плотных кластерах СИЛЬНЫХ взаимосвязей. Идеально для философских систем с градацией важности связей."
              : base + " Без весов — классическая кластеризация по топологии.";
          },
          formula: () => S.useWeightedPaths 
            ? "C_w(i) = Σ(w_ij + w_ih + w_jh)/3 / max_triangles (взвешенная)" 
            : "C(v) = 2e(v) / (k(v)(k(v)-1)) (стандартная)"
        },
        
        'local-cohesion': {
          name: "Локальная когезия (Local Cohesion Score)",
          description: "Комбинированная метрика: кластеризация × сила связей × количество соседей",
          interpretation: () => {
            return "Высокое значение = концепция одновременно: (1) в плотном кластере, (2) с сильными связями, (3) с большим числом соседей. Это \"центры философских школ\" — узлы, вокруг которых концентрируются взаимосвязанные фундаментальные идеи. Низкое = либо изолированная концепция, либо мост между группами.";
          },
          usage: () => "Используйте для поиска ядер философских школ — концепций, которые не просто связаны со многими идеями, но образуют с ними плотные, сильно связанные группы. Отличается от простой кластеризации тем, что учитывает масштаб влияния.",
          formula: () => "Cohesion = clustering × log(1 + strength) × log(1 + neighbors)"
        },
        
        'rich-club': {
          name: "Rich-Club (Клуб влиятельных)",
          description: "Степень связности узла с другими высокостепенными узлами",
          interpretation: () => {
            return "Высокое значение = концепция связана с другими центральными идеями. Это \"философская элита\" — идеи, которые не просто важны сами по себе, но образуют взаимосвязанное ядро традиции. Низкое = концепция на периферии, связана в основном с менее центральными идеями.";
          },
          usage: () => "Используйте для выявления концепций, образующих \"элитный клуб\" философской системы — взаимосвязанное ядро центральных идей. Если у Платона, Аристотеля, Канта высокий rich-club, их центральные концепции образуют плотно связанную сеть, несмотря на временную дистанцию.",
          formula: () => "RC(v) = (high_degree_neighbors / total_neighbors) × log(avg_neighbor_degree)"
        },
        
        // Философские метрики
        'problem-generation': {
          name: "Индекс проблемности (Problem Generation Index)",
          description: "Насколько концепция порождает проблемы и критику",
          interpretation: () => "Высокое значение = концепция порождает дальнейшее развитие, стимулирует попытки синтеза и порождает новые концепции. Это плодотворные проблемы, открывающие новые направления исследования. Низкое значение = концепция относительно завершена или не стимулирует развитие.",
          usage: () => "Используйте для выявления концепций, которые стали источником новых философских направлений. Высокий индекс указывает на интеллектуальную плодотворность, способность порождать новые вопросы и решения.",
          formula: () => "PGI = (internalContradictions + исх.oppose)×4.0 + двусторонние_противоречия×1.5 + активная_проблематизация×2.0 + вх.critique×1.5 + вх.oppose×2.0 + признанные_ограничения×1.0 + условные_зависимости×0.8 + вх.emerge_from×1.2 + culminate×1.0. Прежний текст описывал формулу из шести слагаемых, которой нет ни в коде, ни в архивных версиях"
        },
        
        'critical-power': {
          name: "Индекс критической силы (Critical Power Index)",
          
          description: "Измеряет способность концепции эффективно критиковать, деконструировать и опровергать другие философские идеи. В отличие от революционности (создание нового) и проблемности (порождение вопросов), критическая сила оценивает аналитическую и разрушительную мощь концепции.",
          
          interpretation: () => `Высокое значение указывает на концепции с сильным критическим потенциалом:<br><br>
        <strong>Эффективность</strong> (главное): критика порождает последствия - развития, синтезы, пересмотр идей<br>
        <strong>Качество целей</strong>: различаются критики центральных (>15 связей), средних (5-15) и периферийных (<5) концепций<br>
        <strong>Конструктивность</strong>: ratio critique/synthesize показывает тип - конструктивная (>0.5, как Кант) или деструктивная (<0.3, как Ницше)<br>
        <strong>Широта атаки</strong>: количество философов/эпох, подвергнутых критике<br>
        <strong>Временная перспектива</strong>: ретроспективная (традиции) vs синхронная (современники)<br><br>
        Индекс взвешивает активность через эффективность (реальное воздействие).`,
          
          usage: () => `<strong>Используйте для поиска:</strong><br><br>
        <strong>Деструкторы парадигм</strong> (effectiveness > 30, низкая конструктивность): Юм, Секст Эмпирик, Ницше<br>
        <strong>Конструктивные критики</strong> (effectiveness > 40, высокая конструктивность): Кант, Гегель, Деррида<br>
        <strong>Системные критики</strong> (targetedPhilosophers > 5): Аристотель, Фуко, Витгенштейн<br>
        <strong>Точечные критики</strong> (высокая effectiveness, мало целей): Рассел, Гёдель<br><br>
        <strong>Сравнение:</strong> revolutionaryIndex (создание) → problemGenerationIndex (вопросы) → criticalPowerIndex (разрушение)<br><br>
        <strong>Пороги фильтрации:</strong> total > 80 (мощные), effectiveness > 40 (эффективные), majorTargets > 2 (атакуют центр), constructivenessRatio > 0.5 (конструктивные) или < 0.3 (деструктивные)`,
          
          formula: () => `<strong>Формула:</strong><br>
        CPI = weightedCriticalActivity×1.0 + MajorTargetBonus×1.5 + <strong>Effectiveness×2.0</strong> + TargetedPhilosophers×0.8 + EraSpan/100 + constructivenessRatio-бонус(3)<br><br>
        <strong>Ключевые компоненты:</strong><br>
        <strong>WeightedActivity:</strong> Σ(critique×2 + oppose×3) × weight<br>
        <strong>MajorTargetBonus:</strong> количество критик центральных концепций (>15 связей) × 2<br>
        <strong>Effectiveness:</strong> последствия критики (develop/synthesize у целей) + собственные развития × 2<br>
        <strong>TargetedPhilosophers:</strong> уникальные философы под критикой<br>
        <strong>EraSpan:</strong> временной диапазон критикуемых (в годах)<br>
        <strong>constructivenessRatio:</strong> +3 если отношение синтезов к критикам > 0.3<br><br>
        <strong>Категории целей:</strong> Major (>15 связей), Medium (5-15), Minor (<5)<br>
        <strong>Типы:</strong> ретроспективная (философ цели родился раньше) vs синхронная (разница дат менее 30 лет)`
        },
        
        'revolutionary': {
          name: "Индекс революционности (Revolutionary Index)",
          description: "Насколько концепция порывает с традицией и создаёт новое",
          interpretation: () => "Высокое значение = концепция демонстрирует независимость от традиции, критикует доминирующие идеи, создаёт синтезы, порождает дискуссии и влияет на будущие поколения философов. Это парадигмальные сдвиги в истории философии. Низкое значение = концепция развивает существующую традицию без радикального разрыва.",
          usage: () => "Используйте для выявления переломных моментов в истории философии — концепций, которые радикально меняют направление мысли и открывают новые проблемные поля.",
          formula: () => "RI = independenceScore×2.0 + weightedCritiques×1.5 + syntheses×1.8 + dialogues×1.2 + rubricDiversity×0.8 + futureImpact×1.0 + influencedPhilosophers×0.7 + typeDiversity×0.5"
        },
        
        'paradigm-shift': {
          name: "Индекс парадигмального сдвига (Paradigm Shift Index)",
          description: "Насколько концепция меняет способ мышления (метод, а не только содержание)",
          interpretation: () => "Высокое значение = концепция меняет не просто взгляды, но сам способ мышления. Это методологические концепции, влияющие на разные области, которые принимаются многими более поздними философами. Это смена парадигмы в философии.",
          usage: () => "Используйте для поиска концепций, изменивших метод философствования. Такие идеи создают новые способы постановки вопросов и поиска ответов.",
          formula: () => "PSI = исх.instrument×2 + rubrics_breadth×2 + later_adopters. Все три компонента считаются по ИСХОДЯЩИМ связям: сдвиг парадигмы — это влияние на позднейших. Методологичность измеряется связями 'instrument', а не рубрикой"
        },
        
        'influence': {
          name: "Индекс влияния (Influence Index)",
          description: "Улучшенная метрика влияния с учётом типов связей и временной динамики",
          interpretation: () => "Высокое значение = концепция оказала сильное прямое влияние на более поздние идеи и вступила в продуктивный диалог с современниками. Учитывается тип влияния (развитие, применение, диалог) и его сила.",
          usage: () => "Более тонкая метрика влияния, чем простой подсчёт связей. Различает прямое историческое влияние и синхронный диалог. Используйте для понимания реального исторического воздействия концепций.",
          formula: () => "II = generativity×8 + вх.forward_influence + вх.contemporary_influence×0.5. Первое слагаемое — оказанное влияние через generativity: ранг, посчитанный на обращённом графе, течёт от следствия к причине и копится у истоков. Рекурсивно — питать того, кто сам многое питает, весит больше. Второе слагаемое — рецепция: входящие связи от философов, родившихся позже (веса: develop 2.5, apply 2, critique и dialogue 1.5). Прежний плоский подсчёт исходящих сохранён в подробностях как exertedFlat"
        },
        
        'foundational': {
          name: "Индекс основополагания (Foundational Index)",
          description: "Насколько концепция является основанием для других (служит предпосылкой)",
          interpretation: () => "Высокое значение = концепция служит предпосылкой, условием или основой для других идей. Это фундаментальные концепции, без которых не могут существовать другие. Из них «вырастают» новые концепции.",
          usage: () => "Используйте для поиска фундамента философских систем — базовых концепций, на которых строится здание мысли.",
          formula: () => "FI = вх.presuppose×3 + исх.condition×2 + вх.emerge_from×2.5 + вх.apply + исх.develop, всё взвешено по weight. Направления: основанием концепт является для входящих presuppose и исходящих condition — эти два типа направлены навстречу друг другу"
        },
        
        'synthetic': {
          name: "Индекс синтетичности (Synthetic Index)",
          description: "Насколько концепция перерабатывает разнородные истоки",
          interpretation: () => "Высокое значение = концепция синтезирует идеи разных философов, рубрик и традиций. Это мосты между направлениями мысли, объединяющие разнородное. Примиряет противоречия и создаёт единство из многообразия.",
          usage: () => "Используйте для поиска синтетических концепций — тех, что преодолевают дихотомии и объединяют противоположности. Это концепции-посредники между традициями.",
          formula: () => "SI = (исх.synthesize×3 + исх.mediate×2 + (вх.+исх.)complement + diverse_influences×2 + thematic_breadth) / число_входящих_связей, взвешено по weight. Синтетической работой считаются синтез, опосредование и взаимное дополнение. Нормировка на входящие снимает зависимость от степени узла: метрика отвечает, насколько разнообразны и переработаны входы, а не сколько их"
        },
        
        'dialogical': {
          name: "Индекс диалогичности (Dialogical Index)",
          description: "Насколько концепция находится в диалоге с другими",
          interpretation: () => "Высокое значение = концепция вступает в активный диалог с другими идеями, имеет двусторонние связи и дополняет другие концепции. Это не монолог, а беседа философских идей.",
          usage: () => "Используйте для выявления концепций, вокруг которых разворачивается философский диалог. Они не навязывают односторонне, а участвуют в обмене идеями.",
          formula: () => "DI = (вх.+исх.)dialogue×2 + взаимные_диалоги×3 + (вх.+исх.)complement + разных_собеседников×1.5, взвешено по weight. Диалог и дополнение симметричны, поэтому считаются в обе стороны и показываются раздельно по направлению; взаимными признаются только связи типа 'dialogue' с флагом bidirectional. Слагаемое собеседников отличает разговор с семью философами от семи реплик одному"
        },
        
        'coherence': {
          name: "Индекс внутренней когерентности (Internal Coherence Index)",
          description: "Насколько концепции философа согласованы между собой",
          interpretation: () => "Высокое значение = концепция хорошо согласована с другими идеями того же философа. Много положительных связей (предпосылки, следствия, развития) и мало противоречий. Низкое = концепция противоречит другим идеям того же автора.",
          usage: () => "Используйте для оценки систематичности мышления философа. Высокая когерентность = последовательная система, низкая = эклектика или эволюция взглядов.",
          formula: () => "ICI = (positive − negative×2) / (концептов_у_автора − 1), взвешено по weight. Считаются связи вх.+исх. внутри системы одного философа. Положительные: presuppose, consequence, develop, apply, complement, condition, exemplify, culminate, mediate, synthesize, instrument. Отрицательные: internal_contradiction, oppose. Значение может быть отрицательным — концепт конфликтует с системой автора"
        },
        
        'tension': {
          name: "Индекс напряжения (Tension Index)",
          description: "Степень внутреннего напряжения концепции по трём осям",
          interpretation: () => `Концепция измеряется по трём типам напряжения:
            <br><br><strong>🔴 Имманентное</strong> — внутренние противоречия, признанные ограничения, условные зависимости. Это структурные напряжения самой концепции.
            <br><br><strong>⚔️ Полемическое</strong> — конфликтность позиции: критика других концепций и получение критики. Это контекстуальное напряжение.
            <br><br><strong>♦️ Диалектическое</strong> — продуктивность противоречия: нерешённые напряжения, порождение новых концепций, попытки синтеза. Это креативное напряжение.
            <br><br>Высокое значение = концепция насыщена противоречиями и конфликтами. Низкое = относительная гармоничность.`,
          usage: () => "Используйте для поиска диалектически богатых концепций. Доминирующий тип напряжения характеризует природу концепции: имманентное напряжение указывает на внутренние проблемы системы, полемическое — на её конфликтность с эпохой, диалектическое — на способность порождать новое через противоречие.",
          formula: () => "TI = (Имманентное/σ₁)×1.05 + (Полемическое/σ₂)×1.10 + (Диалектическое/σ₃)×0.85. Каждый ярус делится на собственное стандартное отклонение по графу, иначе разброс ярусов различается втрое и один из них подменяет собой итог. Веса подобраны так, чтобы доли ярусов в дисперсии итога сравнялись: 0.34 / 0.32 / 0.34"
        },
        
        // Продвинутые метрики
        'transformation': {
          name: "Индекс трансформации (Transformation Index)",
          description: "Насколько концепция трансформирует заимствованные идеи",
          interpretation: () => "Высокое значение = концепция не просто принимает влияния, но активно их трансформирует, развивает, применяет, синтезирует. Это творческая переработка, а не пассивное восприятие. Соотношение выходных трансформаций к входным влияниям.",
          usage: () => "Используйте для поиска концепций, которые являются не только получателями, но и трансформаторами идей. Показывает творческую активность концепции.",
          formula: () => "TI = √(ratio × volume), где volume = исх.develop + исх.apply + исх.synthesize, а ratio = volume / вх.influence. Взвешено по weight. Среднее геометрическое вместо прежней суммы отношения и объёма: складывать безразмерную величину с сырым счётчиком некорректно"
        },
        
        'fertility': {
          name: "Индекс концептуальной плодовитости (Conceptual Fertility Index)",
          description: "Насколько концепция порождает новые концепции",
          interpretation: () => "Высокое значение = из концепции вырастает много новых идей, она активно развивается другими философами. Это интеллектуально плодородные концепции, дающие богатый урожай новых мыслей.",
          usage: () => "Используйте для поиска «материнских» концепций — тех, что порождают целые семейства новых идей. Показывает генеративный потенциал концепции.",
          formula: () => "CFI = вх.emerge_from×3 + исх.develop×2 + исх.culminate×1.5 + later_adopters, взвешено по weight. Направления: из концепта вырастает то, к чему ведут ИСХОДЯЩИЕ develop и culminate, и то, что указывает на него ВХОДЯЩИМ emerge_from. Слагаемое на типе «следствие» будет добавлено после приведения его направлений к единой конвенции (Д-1)"
        },
        
        'complexity': {
          name: "Индекс концептуальной сложности (Conceptual Complexity Index)",
          description: "Насколько концепция сложна и многоаспектна",
          interpretation: () => "Высокое значение = концепция имеет много типов связей, охватывает разные рубрики, содержит противоречия и предпосылки, связана с концепциями многих философов. Это многомерные, сложные идеи, не сводимые к простым формулам.",
          usage: () => "Используйте для оценки интеллектуальной сложности концепций. Высокая сложность = богатство содержания, но и трудность понимания.",
          formula: () => "CCI = (link_type_diversity)×2 + rubrics×3 + contradictions×5 + presuppositions×2 + related_philosophers"
        },
        
        'continuity': {
          name: "Индекс преемственности (Conceptual Continuity Index)",
          description: "Насколько концепция сохраняет преемственность через время",
          interpretation: () => "Высокое значение = концепция постоянно упоминается и развивается на протяжении многих поколений без больших разрывов. Это идеи с непрерывной традицией, сохраняющие актуальность через века. Низкое = концепция была забыта или имеет прерывистую историю.",
          usage: () => "Используйте для оценки исторической устойчивости концепций. Показывает, какие идеи сохраняют живую традицию, а какие переживают периоды забвения.",
          formula: () => "CCI = (generations − gaps) × later_references. Поколение — 50 лет. Учитываются связи в ОБЕ стороны с концептами более поздних философов: преемственность идёт исходящими связями, полемика — входящими"
        },
        
        'temporal-influence': {
          name: "Паттерн временного влияния (Temporal Influence Pattern)",
          description: "Как влияние концепции изменяется во времени",
          interpretation: () => "Классифицирует концепции по паттерну влияния во времени: lasting (устойчивое, от момента появления до далёкого будущего), fading (угасающее, сильное сразу, потом исчезает), delayed (отложенное, слабое сразу, сильное позже), normal (нормальное, стандартное распространение).",
          usage: () => "Используйте для понимания динамики влияния концепций. Разные паттерны говорят о разных механизмах распространения идей. Отложенное влияние может указывать на «опережающие время» концепции.",
          formula: () => "Распределение входящих ссылок от более поздних философов по периодам 0–50, 50–150, 150–300 и 300+ лет, дополненное разделением по смыслу связи: преемственные против полемических. Поле reception показывает, преобладало ли принятие концепта или спор с ним"
        },
        
        // Метрики философов
        'philosopher-profile': {
          name: "Профиль философа (Philosopher Profile)",
          description: "Комплексная характеристика творчества философа",
          interpretation: () => "Показывает средние значения различных метрик для всех концепций философа: влияние, революционность, когерентность. Позволяет охарактеризовать стиль мышления философа в целом.",
          usage: () => "Используйте для сравнения философов между собой и понимания их уникальных характеристик. Высокая революционность при низкой когерентности = радикальный, но эклектичный мыслитель.",
          formula: () => "По каждой из пяти метрик — влияние, революционность, внутренняя когерентность, инструментальность, дедуктивная продуктивность — считаются три величины: среднее по концептам автора (общий уровень системы), стандартное отклонение (насколько система неоднородна) и максимум (на что способна её сильнейшая точка). Одного среднего недостаточно: система с одной яркой идеей и десятком проходных даёт то же среднее, что ровная"
        },
        
        'philosopher-systematic': {
          name: "Индекс систематичности философа (Philosopher Systematic Index)",
          description: "Насколько концепции философа связаны между собой",
          interpretation: () => "Высокое значение = концепции философа образуют плотную сеть взаимных связей, работающих на систему. Это систематический мыслитель, строящий целостную архитектуру идей. Низкое = концепции слабо связаны либо противоречат друг другу. К работающим на систему отнесены связи типов «предполагает», «следствие», «условие», «иллюстрация», «инструмент», «кульминация», «опосредует», «применяет», «дополняет», «возникает из», «развитие» и «синтез»; против системы работают «внутреннее противоречие» и «противопоставление».",
          usage: () => "Используйте для различения систематических и несистематических мыслителей. Кант, Гегель, Спиноза должны иметь высокие значения.",
          formula: () => "PSI = (SYSTEMATIC_TYPES − DISRUPTIVE_TYPES) / max_possible_links × 100 %, взвешено по weight. Сырая плотность без учёта типов сохранена в подробностях как rawDensity"
        },
        
        'philosopher-reach': {
          name: "Индекс исторического охвата (Historical Reach Index)",
          description: "Временной размах влияния философа",
          interpretation: () => "Высокое значение = философ повлиял на много более поздних мыслителей на протяжении многих поколений. Это мыслители с длительным и широким влиянием. Низкое = влияние ограничено современниками или ближайшими потомками.",
          usage: () => "Используйте для оценки исторического масштаба влияния философа. Показывает, какие мыслители остаются актуальными через века.",
          formula: () => "HRI = преемственный_охват×2 + полемический_охват + generations. Охват считается по связям в ОБЕ стороны с концептами более поздних философов и разделён по смыслу: преемственность (influence, develop, apply, synthesize, instrument, exemplify, presuppose, consequence) весит вдвое против полемики (critique, oppose, dialogue, limit). Слагаемые вместо произведения: прежний множитель поколений обнулял тех, чьи последователи родились менее чем через 25 лет"
        },
        
        'philosopher-interdisciplinary': {
          name: "Индекс междисциплинарности (Interdisciplinary Index)",
          description: "Насколько философ охватывает разные тематические области",
          interpretation: () => "Высокое значение = философ работает в разных рубриках (этика, метафизика, эпистемология и т.д.) с относительно равномерным распределением. Это универсальные мыслители. Низкое = философ специализируется в узкой области.",
          usage: () => "Используйте для различения универсалов и специалистов. Учитывается как количество рубрик, так и энтропия распределения (равномерность).",
          formula: () => "IdI = rubric_count × (1 + entropy) + наведённых_мостов×0.5. Мост — различная неупорядоченная пара рубрик, соединённая связью, у которой хотя бы один конец принадлежит философу. Раньше метрика опиралась только на рубрики собственных концептов и к связям не обращалась"
        }
      };
  
  S.currentStatsView = null;
  
  S.isStatsModalOpen = false;
  
  document.addEventListener('click', function(event) {
        if (!S.isStatsModalOpen) return;
        const modal = document.getElementById('statsModal');
        if (event.target === modal) {
          closeStatsModal();
        }
      });
  
  document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && S.isStatsModalOpen) {
          closeStatsModal();
        }
      });
  
  S.metricValueMode = 'raw';
  
  S.generateRankingsMode = null;
  
  S.METRIC_COVERAGE_FN = {
        'problem-generation': MET.problemGenerationIndex,
        'critical-power': MET.criticalPowerIndex,
        'revolutionary': MET.revolutionaryIndex,
        'paradigm-shift': MET.paradigmShiftIndex,
        'influence': MET.influenceIndex,
        'foundational': MET.foundationalIndex,
        'synthetic': MET.syntheticIndex,
        'dialogical': MET.dialogicalIndex,
        'coherence': MET.internalCoherenceIndex,
        'tension': MET.tensionIndex,
        'transformation': MET.transformationIndex,
        'fertility': MET.conceptualFertilityIndex,
        'complexity': MET.conceptualComplexityIndex,
        'continuity': MET.conceptualContinuityIndex,
        'generative': MET.generativeIndex,
        'instrumental': MET.instrumentalIndex,
        'bridging': MET.traditionBridgingIndex,
        'abstraction': MET.abstractionIndex,
        'deductive': MET.deductiveIndex
      };
  
  S.metricLayoutMode = 'cards';
  
  try {
        const saved = localStorage.getItem('metricLayoutMode');
        if (saved === 'rows' || saved === 'cards') S.metricLayoutMode = saved;
      } catch (e) { /* localStorage может быть недоступен */ }
  
  S._cmpA = null;
  
  S._cmpB = null;
  
  S._pairsKind = 'profile';
  
  S._pairsMinDegree = 6;
  
  S._pairsMinShared = 3;
  
  S._pairsCrossAuthor = true;
  
  S._pairsCrossTradition = false;
  
  S._pcmpA = null;
  
  S._pcmpB = null;
  
  S._philPairsKind = 'profile';
  
  S.isVisualizingBySize = false;
  
  S.currentVisualizedMetric = null;
  
  onLoad(() => {
        saveOriginalRadii();
      });
  
  document.addEventListener('click', function(event) {
        // Для поиска в легенде
        const legendSearch = document.getElementById('legendSearch');
        const legendResults = document.getElementById('legendSearchResults');
        if (legendSearch && !legendSearch.contains(event.target) && legendResults) {
          legendResults.classList.remove('show');
        }
        
        // Для поиска в модальном окне
        const modalSearch = document.getElementById('modalSearch');
        const modalResults = document.getElementById('modalSearchResults');
        if (modalSearch && !modalSearch.contains(event.target) && modalResults) {
          modalResults.classList.remove('show');
        }
      });
  
  onReady(function() {
        // Даем время на создание графа
        setTimeout(initializeCustomSelects, 500);
      });
  
  S.viewWidth = window.innerWidth;
  
  S.viewHeight = window.innerHeight;
  
  S.gfxCanvas = document.getElementById("graphCanvas");
  
  S.ctx = S.gfxCanvas.getContext("2d");
  
  S.gfxSvg = d3.select(S.gfxCanvas);
  
  S.pickCanvas = document.createElement("canvas");
  
  S.pickCtx = S.pickCanvas.getContext("2d", { willReadFrequently: true });
  
  S.pickDirty = true;
  
  S.dpr = window.devicePixelRatio || 1;
  
  S.renderState = {
        transform: d3.zoomIdentity,
        nodeClasses: {},      // dimmed / highlighted / selected -> Set<id>
        linkClasses: {},      // dimmed / highlighted / selected / path-highlight -> Set<link>
        hoveredNode: null,
        hoveredLink: null,
        uniformLinkWidth: false,
        radius: new Map(),    // текущий радиус узла
        labelDy: new Map(),     // текущее смещение подписи
        anim: null,         // { from, to, dyFrom, dyTo, t0, dur }
      };
  
  S.arrowMode = 'default';
  
  S.arrowRadius = null;
  
  S.uniformLinkWidthActive = false;
  
  S.similarityOverlay = null;
  
  S.gfxNode = {
        classed: makeClassed("node"),
        style(name, value) { requestDraw(); return this; },
        selectAll(what) { return subSelection("node", what === "circle" ? "circle" : "text"); },
        on(name, fn) { nodeHandlers[name.split(".")[0]] = fn; return this; },
        filter(fn) {
          const hit = DATA.nodes.filter(fn);
          return { size: () => hit.length, empty: () => hit.length === 0,
               datum: () => hit[0], attr: () => {}, node: () => null };
        },
      };
  
  S.gfxLink = {
        classed: makeClassed("link"),
        style(name, value) { requestDraw(); return this; },
        on(name, fn) { linkHandlers[name.split(".")[0]] = fn; return this; },
        filter(fn) { const hit = DATA.links.filter(fn);
               return { size: () => hit.length, empty: () => hit.length === 0,
                    datum: () => hit[0], attr: () => {} }; },
      };
  
  S.gfxLinkAll = {
        classed(name, value) { S.gfxLink.classed(name, value); return S.gfxLinkAll; },
        style(name, value)   { requestDraw(); return S.gfxLinkAll; },
      };
  
  S.gfxZoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          S.renderState.transform = event.transform;
          S.pickDirty = true;
          requestDraw();
        });
  
  S.gfxSvg.call(d3.drag()
          .container(S.gfxCanvas)
          .subject((event) => {
            const g = S.renderState.transform.invert([event.x, event.y]);
            const n = pickNode(g[0], g[1]);
            if (!n) return null;
            // d3.drag запоминает захват как subject.x - pointer.x, и обе
            // величины должны быть в системе координат КОНТЕЙНЕРА, то есть
            // экранной. Узел живёт в координатах графа, поэтому субъектом
            // отдаём обёртку с экранными координатами — иначе в начале
            // перетаскивания узел прыгает на величину сдвига камеры.
            return { node: n,
                 x: S.renderState.transform.applyX(n.x),
                 y: S.renderState.transform.applyY(n.y) };
          })
          // d3.drag передаёт в обработчик датум ЭЛЕМЕНТА, а у канваса его
          // нет — перетаскиваемый узел лежит в event.subject
          .on("start", (event) => {
            const s = event.subject;
            if (s && s.node) dragstarted(event, s.node);
          })
          .on("drag",  (event) => {
            const s = event.subject;
            if (!s || !s.node) return;
            const g = S.renderState.transform.invert([event.x, event.y]);
            const d = s.node;
            d.fx = g[0]; d.fy = g[1];
            d.x  = g[0]; d.y  = g[1];
            rebuildQuadtree();
            S.pickDirty = true;
            requestDraw();
          })
          .on("end",   (event) => {
            const s = event.subject;
            if (s && s.node) dragended(event, s.node);
          }))
        .call(S.gfxZoom);
  
  resizeCanvas();
  
  S.simulation = d3.forceSimulation(DATA.nodes)
        .force("link", d3.forceLink(DATA.links).id(d => d.id).distance(160))
        .force("charge", d3.forceManyBody().strength(-350))
        .force("center", d3.forceCenter(S.viewWidth / 2, S.viewHeight / 2))
        .force("collision", d3.forceCollide().radius(45))
        .alphaDecay(0.02);
  
  S.tickCount = 0;
  
  S.simulation.on("tick", () => {
        // Ф0.5/Б12: d3-timer уже синхронизирован с кадрами, поэтому обёртка
        // requestAnimationFrame только добавляла кадр задержки, а троттлинг
        // по Date.now() стоял ДО tickCount++ — счётчик не рос на отброшенных
        // кадрах, и симуляция крутилась дольше заявленных maxTicks.
        S.tickCount++;
  
        rebuildQuadtree();
        S.pickDirty = true;
        requestDraw();
  
        if (S.tickCount >= maxTicks) {
          S.simulation.stop();
        }
      });
  
  S.simulation.on("end.stats", () => {
        console.log("Симуляция завершена после", S.tickCount, "тиков");
        console.log("Производительность - узлов:", DATA.nodes.length, "связей:", DATA.links.length);
        
        // Информация о памяти (если доступно)
        if (performance.memory) {
          console.log("Использование памяти:", 
            Math.round(performance.memory.usedJSHeapSize / 1048576), "МБ");
        }
      });
  
  initGraphEventHandlers();
  
  S.tooltip = d3.select("#tooltip");
  
  S.tooltipTimeout = null;
  
  S.gfxNode.on("mouseover", function(event, d) {
        if (S.tooltipTimeout) clearTimeout(S.tooltipTimeout);
        
        S.tooltipTimeout = setTimeout(() => {
          let simNote = '';
          if (S.similarityOverlay && d.id !== S.similarityOverlay.sourceId) {
            const sv = S.similarityOverlay.values.get(d.id);
            if (sv !== undefined) {
              const src = DATA.nodes.find(n => n.id === S.similarityOverlay.sourceId);
              simNote = `<br/><span style="color:#ffd700">Сходство с «${src ? src.label : '—'}»: ` +
                    `${sv.toFixed(3)}</span>`;
            }
          }
          S.tooltip
            .style("opacity", 1)
            .html(`<strong>${labelWithAuthor(d)}</strong><br/>${d.description}<br/><em>${d.concept}</em>${simNote}`)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 15) + "px");
        }, 100); // Небольшая задержка
      })
      .on("mouseout", function() {
        if (S.tooltipTimeout) {
          clearTimeout(S.tooltipTimeout);
          S.tooltipTimeout = null;
        }
        S.tooltip.style("opacity", 0);
      });
  
  S.gfxLink.on("mouseover", function(event, d) {
        const tooltip = document.getElementById('tooltip');
        
        // Получаем данные узлов source и target
        const sourceId = d.source.id || d.source;
        const targetId = d.target.id || d.target;
        const sourceNode = DATA.nodes.find(n => n.id === sourceId);
        const targetNode = DATA.nodes.find(n => n.id === targetId);
        
        if (!sourceNode || !targetNode) return;
        
        // Получаем название типа связи и цвет
        const relationLabel = DATA.relationTypesObj[d.type].label;
        const relationColor = DATA.relationTypesObj[d.type].color;
        
        // Создаём SVG стрелку с цветом типа связи
        const arrowWidth = 60;
        const arrowHeight = 20;
        let arrowSvg;
        
        // ДЕФЕКТ U3: у петли source === target, и стрелка «слева направо»
        // лгала бы о двух разных концах. Начертание то же, что на канве
        // (drawSelfLoop) и в окне связи: окружность над узлом, наконечник
        // в правой точке касания. Дуга 300°, потому оба флага единицы.
        const reflexive = isReflexiveLink(d);
        
        if (reflexive) {
          arrowSvg = `
            <svg width="46" height="40" style="display: block;">
              <defs>
                <marker id="arrowhead-loop-${d.type}" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="${relationColor}" />
                </marker>
              </defs>
              <circle cx="23" cy="33" r="5" fill="${relationColor}" opacity="0.35" />
              <path d="M 18 33 A 10 10 0 1 1 28 33" fill="none"
                  stroke="${relationColor}" stroke-width="2"
                  marker-end="url(#arrowhead-loop-${d.type})" />
            </svg>
          `;
        } else if (isSymmetricLink(d)) {
          // Двунаправленная стрелка: <->
          arrowSvg = `
            <svg width="${arrowWidth}" height="${arrowHeight}" style="display: block;">
              <defs>
                <!-- orient="auto" направлял бы начальный маркер ПО ходу линии,
                   и выходило >-> вместо <->. auto-start-reverse переворачивает
                   его на входе пути — для того он в SVG 2 и введён. -->
                <marker id="arrowhead-start-${d.type}" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto-start-reverse">
                  <polygon points="0 0, 6 3, 0 6" fill="${relationColor}" />
                </marker>
                <marker id="arrowhead-end-${d.type}" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="${relationColor}" />
                </marker>
              </defs>
              <line x1="10" y1="${arrowHeight/2}" x2="${arrowWidth-10}" y2="${arrowHeight/2}" 
                  stroke="${relationColor}" stroke-width="2" 
                  marker-start="url(#arrowhead-start-${d.type})" 
                  marker-end="url(#arrowhead-end-${d.type})" />
            </svg>
          `;
        } else {
          // Однонаправленная стрелка: ->
          arrowSvg = `
            <svg width="${arrowWidth}" height="${arrowHeight}" style="display: block;">
              <defs>
                <marker id="arrowhead-${d.type}" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="${relationColor}" />
                </marker>
              </defs>
              <line x1="5" y1="${arrowHeight/2}" x2="${arrowWidth-5}" y2="${arrowHeight/2}" 
                  stroke="${relationColor}" stroke-width="2" 
                  marker-end="url(#arrowhead-${d.type})" />
            </svg>
          `;
        }
        
        // Формируем красивый tooltip. У петли конец один, поэтому
        // и название концепции, и имя философа выводятся однажды:
        // прежде подсказка повторяла их дважды по обе стороны стрелки.
        let tooltipContent = reflexive ? `
          <div class="link-tooltip-header">
            <div class="link-tooltip-arrow">${arrowSvg}</div>
            <strong>${sourceNode.label}</strong>
          </div>
          <div class="link-tooltip-type" style="color: ${relationColor};">${relationLabel}</div>
          <div class="link-tooltip-philosophers" style="justify-content: center;">
            <em>(${sourceNode.concept})</em>
          </div>
        ` : `
          <div class="link-tooltip-header">
            <strong>${sourceNode.label}</strong>
            <div class="link-tooltip-arrow">${arrowSvg}</div>
            <strong>${targetNode.label}</strong>
          </div>
          <div class="link-tooltip-type" style="color: ${relationColor};">${relationLabel}</div>
          <div class="link-tooltip-philosophers">
            <em>(${sourceNode.concept})</em>
            <em>(${targetNode.concept})</em>
          </div>
        `;
        
        // Для выделенных связей добавляем описание, если оно есть
        if (selectedEdges.has(d) && d.description) {
          tooltipContent += `<div class="tooltip-description">${d.description}</div>`;
        }
        
        tooltip.innerHTML = tooltipContent;
        tooltip.style.opacity = 1;
        tooltip.style.left = (event.pageX + 15) + 'px';
        tooltip.style.top = (event.pageY - 10) + 'px';
  
        // Ф0.4: markerUnits = strokeWidth означал рост стрелки при :hover
        S.renderState.hoveredLink = d; requestDraw();
      })
      .on("mousemove", function(event) {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.left = (event.pageX + 15) + 'px';
        tooltip.style.top = (event.pageY - 10) + 'px';
      })
      .on("mouseout", function(event, d) {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.opacity = 0;
        if (S.renderState.hoveredLink === d) { S.renderState.hoveredLink = null; requestDraw(); }
      });
  
  S.philosopherNames = Object.keys(DATA.philosopherConcepts);
  
  S.rows = Math.ceil(S.philosopherNames.length / cols);
  
  S.spacingX = S.viewWidth / (cols + 1);
  
  S.spacingY = S.viewHeight / (S.rows + 1);
  
  S.philosopherNames.forEach((phil, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        groupPositions[phil] = {
          x: S.spacingX * (col + 1),
          y: S.spacingY * (row + 1)
        };
      });
  
  S.isGrouped = false;
  
  window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        // Б4: держим глобальные размеры в актуальном состоянии —
        // от них зависят все четыре функции камеры и exportToPNG
        S.viewWidth = newWidth;
        S.viewHeight = newHeight;
        resizeCanvas();
        
        // Пересчитываем позиции групп
        const newSpacingX = newWidth / (cols + 1);
        const newSpacingY = newHeight / (S.rows + 1);
        S.philosopherNames.forEach((phil, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          groupPositions[phil] = {
            x: newSpacingX * (col + 1),
            y: newSpacingY * (row + 1)
          };
        });
        
        if (S.isGrouped) {
          S.simulation
            .force("x", d3.forceX(d => groupPositions[d.concept].x).strength(0.3))
            .force("y", d3.forceY(d => groupPositions[d.concept].y).strength(0.3));
        } else {
          S.simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
        }
        
        S.simulation.alpha(0.3).restart();
      });
  
  S.PROFILE_METRICS = [
        ['problem-generation', 'Проблемность',    () => MET.problemGenerationIndex],
        ['critical-power',   'Критическая сила',  () => MET.criticalPowerIndex],
        ['revolutionary',    'Революционность',   () => MET.revolutionaryIndex],
        ['paradigm-shift',   'Смена парадигмы',   () => MET.paradigmShiftIndex],
        ['influence',      'Влияние',       () => MET.influenceIndex],
        ['foundational',     'Фундаментальность',   () => MET.foundationalIndex],
        ['synthetic',      'Синтетичность',     () => MET.syntheticIndex],
        ['dialogical',     'Диалогичность',     () => MET.dialogicalIndex],
        ['coherence',      'Связность',       () => MET.internalCoherenceIndex],
        ['tension',      'Напряжение',      () => MET.tensionIndex],
        ['transformation',   'Трансформация',     () => MET.transformationIndex],
        ['fertility',      'Плодовитость',    () => MET.conceptualFertilityIndex],
        ['complexity',     'Сложность',       () => MET.conceptualComplexityIndex],
        ['continuity',     'Преемственность',   () => MET.conceptualContinuityIndex],
        ['generative',     'Генеративность',    () => MET.generativeIndex],
        ['instrumental',     'Инструментальность',  () => MET.instrumentalIndex],
        ['abstraction',    'Абстрактность',     () => MET.abstractionIndex],
        ['deductive',      'Дедуктивность',     () => MET.deductiveIndex],
        ['bridging',       'Мостовость',      () => MET.traditionBridgingIndex]
      ];
  
  S.profileOrderMode = 'rank';
  
  window.addEventListener('beforeunload', ev => {
        if (!hasUnsavedEdits) return;
        ev.preventDefault();
        ev.returnValue = '';
      });
  
  S.graphSelectionContext = { active: false, type: null, mode: 'edit' };
  
  S.labelOf = id => {
        const n = DATA.nodes.find(x => x.id === id);
        return n ? n.label : id;
      };
  
  document.addEventListener('click', function(event) {
        document.querySelectorAll('.modal-concept-search').forEach(box => {
          if (!box.contains(event.target)) {
            box.querySelector('.modal-concept-search-results')?.classList.remove('show');
          }
        });
      });
  
  setTimeout(makeLegendsEditable, 100);
  
  renderAuthControls();
  
  document.getElementById('modalOverlay').addEventListener('click', function() {
        // Пока идёт выбор концепции на графе, подложка пропускает клики
        // к канве и закрывать окно не должна (этап 7 спецификации).
        if (S.graphSelectionContext && S.graphSelectionContext.active) return;
        closeAllModals();
      });
  
  document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (S.graphSelectionContext && S.graphSelectionContext.active) {
            if (typeof cancelGraphSelection === 'function') cancelGraphSelection();
            return;
          }
          closeAllModals();
        }
  
        // Backspace — шаг назад по истории окон. Escape по-прежнему
        // закрывает всё: это две разные привычки, и смешивать их не надо.
        if (e.key === 'Backspace') {
          const t = e.target;
          const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'
                     || t.isContentEditable);
          if (typing) return;
          if (typeof modalStack !== 'undefined' && modalStack.length > 0) {
            e.preventDefault();
            popModalState();
          }
        }
      });
  
  console.log("Инициализация графа:", DATA.nodes.length, "узлов,", DATA.links.length, "связей");
  
  initFilters();
  
  updateFilterStats();
  
  initializePhilosophyMetrics();
  
  initPathFinder();
  
  restorePanelStates();
  
  S.simulation.on("end.log", () => {
        console.log("Симуляция завершена. Запустите анализ вручную.");
      });
  
  S.legendWeightsToggle = document.getElementById('useWeightsToggle');
  
  if (S.legendWeightsToggle) S.legendWeightsToggle.checked = S.useWeightedPaths;
  
  S.legendDirectionToggle = document.getElementById('respectDirectionToggle');
  
  if (S.legendDirectionToggle) S.legendDirectionToggle.checked = S.respectDirection;
  
  saveOriginalRadii();
  
  console.log("Граф инициализирован. Используйте кнопки для запуска анализа.");
  
  console.log("Текущий режим: веса -", S.useWeightedPaths ? "ВКЛ" : "ВЫКЛ", 
            ", направленность -", S.respectDirection ? "ВКЛ" : "ВЫКЛ");
  
  document.getElementById('respectChronology').addEventListener('change', function() {
        const container = document.getElementById('chronologyModeContainer');
        container.style.display = this.checked ? 'block' : 'none';
      });
  
  document.getElementById('chronologyModeSelect').addEventListener('change', function() {
        const infoDiv = document.getElementById('chronologyModeInfo');
        const descriptions = {
          strict: '<strong>Строгий режим:</strong> учитывает реальные периоды жизни и активности философов (с 25 лет). Блокирует все анахронизмы. Пример: Гегель не может влиять на Канта. Критика, полемика и противостояние читаются в обратную сторону: критикующий позже критикуемого.',
          moderate: '<strong>Умеренный режим:</strong> допускает влияние современников в пределах ±50 лет от рождения. Менее строгий, но всё ещё блокирует явные анахронизмы.',
          loose: '<strong>Свободный режим:</strong> разрешает влияние в пределах ±100 лет. Подходит для поиска концептуальных связей без строгой хронологии.'
        };
        infoDiv.innerHTML = descriptions[this.value];
        
        // Обновляем глобальную переменную режима
        S.currentChronologyMode = this.value;
      });
  
  if (document.getElementById('respectChronology').checked) {
        document.getElementById('chronologyModeContainer').style.display = 'block';
      }
  
  console.log('Обработчики событий хронологии инициализированы');
}
