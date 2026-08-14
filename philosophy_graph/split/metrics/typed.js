// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { MET, S } from '../core/ns.js';
import { sumWeight } from '../core/predicates.js';
import { generativity } from './generativity.js';
import { BRIDGING_MIN_EXTERNAL, BRIDGING_WEIGHT_REF } from './thresholds.js';

MET.generativeIndex = function generativeIndex(conceptId) {
      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };

      const outgoing = S._outgoingLinks.get(conceptId) || [];
      const successors = new Set();
      const successorAuthors = new Set();
      outgoing.forEach(r => {
        const target = S._conceptMap.get(r.target);
        if (!target) return;
        successors.add(target.id);
        if (target.philosopher !== concept.philosopher) successorAuthors.add(target.philosopher);
      });

      const score = generativity(conceptId);
      return {
        // Д1: поле generativityScore удалено — это total, делённый на 10
        total: score * 10,
        directSuccessors: successors.size,
        successorAuthors: successorAuthors.size,
        outgoingLinks: outgoing.length
      };
    };

let instrumentalIndexCache = null;

MET.instrumentalIndex = function instrumentalIndex(conceptId) {
      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };

      const outgoing = S._outgoingLinks.get(conceptId) || [];
      const asMethod = outgoing.filter(r => r.type === 'instrument');
      const servesAsMethod = sumWeight(asMethod);

      const domains = new Set();
      const authors = new Set();
      asMethod.forEach(r => {
        const target = S._conceptMap.get(r.target);
        if (!target) return;
        (target.rubrics || []).forEach(rub => domains.add(rub));
        if (target.philosopher !== concept.philosopher) authors.add(target.philosopher);
      });

      return {
        total: servesAsMethod * 2 + domains.size * 2 + authors.size,
        servesAsMethod,
        domainsServed: domains.size,
        crossAuthor: authors.size,
        instrumentLinks: asMethod.length
      };
    };

let traditionBridgingCache = null;

MET.traditionBridgingIndex = function traditionBridgingIndex(conceptId) {
      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };
      const own = concept.philosopher;
      const ownTraditions = (S._philosopherMap.get(own) || {}).traditions || [];

      let external = 0, crossing = 0, crossWeight = 0, extWeight = 0;
      const reached = new Set();
      const links = [...(S._outgoingLinks.get(conceptId) || []),
                     ...(S._incomingLinks.get(conceptId) || [])];
      links.forEach(r => {
        const otherId = r.source === conceptId ? r.target : r.source;
        if (otherId === conceptId) return;
        const other = S._conceptMap.get(otherId);
        if (!other || other.philosopher === own) return;
        external++;
        const w = r.weight || 2;
        extWeight += w;
        const ot = (S._philosopherMap.get(other.philosopher) || {}).traditions || [];
        if (!ownTraditions.some(t => ot.includes(t))) {
          crossing++; crossWeight += w;
          ot.forEach(t => reached.add(t));
        }
      });

      // ДОЛЯ НАСЫЩАЕТСЯ: до правки у 34 концепций все внешние связи были
      // межтрадиционными, все они получали ровно 10, и весь показываемый
      // верх таблицы состоял из одного и того же числа — колонка значения
      // не несла ничего, а порядок решал невидимый добор. Поэтому доля
      // домножена на вес свидетельств: логарифм растёт медленно и не даёт
      // числу связей перебить саму долю. Различных значений среди ненулевых
      // стало 128 из 180 против 34 одинаковых наверху.
      //
      // ЦЕНА ЧЕСТНО: связность вернулась в метрику. Ранговая корреляция с
      // общей степенью узла 0,05 → 0,33. Мера перестала быть полностью
      // ортогональной связности, и это плата за различимость.
      const enough = external >= BRIDGING_MIN_EXTERNAL;
      // Доля показывается ПО ВЕСАМ — тою же мерой, какой считается сама
      // величина. Считать её по числу связей значило бы показывать в
      // подробностях не то, по чему построен рейтинг: у весов 1, 2 и 3
      // расхождение доходит до десятка процентов.
      const share = extWeight ? crossWeight / extWeight : 0;
      return {
        total: enough
          ? 10 * share * Math.log(1 + crossWeight) / Math.log(1 + BRIDGING_WEIGHT_REF)
          : 0,
        share: Math.round(share * 100),
        crossingLinks: crossing,
        crossWeight: crossWeight,
        externalLinks: external,
        traditionsReached: reached.size,
        belowThreshold: !enough
      };
    };

function invalidateTraditionBridgingCache() {
      traditionBridgingCache = null;
    }

function invalidateInstrumentalIndexCache() {
      instrumentalIndexCache = null;
    }

let abstractionIndexCache = null;

MET.abstractionIndex = function abstractionIndex(conceptId) {
      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };

      const incoming = S._incomingLinks.get(conceptId) || [];
      const outgoing = S._outgoingLinks.get(conceptId) || [];

      const illustratedBy = sumWeight(incoming.filter(r => r.type === 'exemplify'));
      const illustrates   = sumWeight(outgoing.filter(r => r.type === 'exemplify'));

      const illustrators = new Set();
      incoming.filter(r => r.type === 'exemplify').forEach(r => {
        const source = S._conceptMap.get(r.source);
        if (source) illustrators.add(source.id);
      });

      return {
        total: illustratedBy - illustrates,
        illustratedBy,
        illustrates,
        distinctIllustrations: illustrators.size
      };
    };

function invalidateAbstractionIndexCache() {
      abstractionIndexCache = null;
    }

let deductiveIndexCache = new Map();

MET.deductiveDepth = function deductiveDepth(conceptId, seen) {
      if (seen.has(conceptId)) return 0;
      seen.add(conceptId);
      let best = 0;
      for (const r of (S._outgoingLinks.get(conceptId) || [])) {
        if (r.type !== 'consequence') continue;
        const d = 1 + MET.deductiveDepth(r.target, seen);
        if (d > best) best = d;
      }
      seen.delete(conceptId);
      return best;
    };

MET.deductiveIndex = function deductiveIndex(conceptId) {
      if (deductiveIndexCache.has(conceptId)) return deductiveIndexCache.get(conceptId);

      const concept = S._conceptMap.get(conceptId);
      if (!concept) return { total: 0 };

      const outgoing = S._outgoingLinks.get(conceptId) || [];
      const direct = outgoing.filter(r => r.type === 'consequence');
      const directConsequences = sumWeight(direct);

      const authors = new Set();
      direct.forEach(r => {
        const target = S._conceptMap.get(r.target);
        if (target) authors.add(target.philosopher);
      });

      const derivationDepth = MET.deductiveDepth(conceptId, new Set());

      const result = {
        total: directConsequences * 2 + derivationDepth * 3 + authors.size,
        directConsequences,
        derivationDepth,
        breadth: authors.size,
        consequenceLinks: direct.length
      };
      deductiveIndexCache.set(conceptId, result);
      return result;
    };

function invalidateDeductiveIndexCache() {
      deductiveIndexCache = new Map();
    }

export { abstractionIndexCache, deductiveIndexCache, instrumentalIndexCache, invalidateAbstractionIndexCache, invalidateDeductiveIndexCache, invalidateInstrumentalIndexCache, invalidateTraditionBridgingCache, traditionBridgingCache };
