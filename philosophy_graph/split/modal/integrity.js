// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from '../core/ns.js';
import { isReflexiveLink } from '../core/link-facts.js';
import { isConceptIsolated } from './entry.js';
import { philosopherBirth, philosopherYears } from '../util/philosopher-label.js';
import { pluralRu } from '../util/ru.js';

function relationIndexOf(srcId, tgtId, type) {
      return DATA.relations.findIndex(r => r.source === srcId && r.target === tgtId
                     && (type === undefined || r.type === type));
    }

function activityOverlap(nameA, nameB) {
      const a = DATA.philosophers.find(p => p.nameRu === nameA);
      const b = DATA.philosophers.find(p => p.nameRu === nameB);
      if (!a || !b) return true;
      // Период ЗРЕЛОСТИ, а не жизни: прежде Конт и Кант считались
      // современниками, хотя Конту при смерти Канта было шесть лет.
      const MATURITY = 25;
      const aFrom = a.birth + MATURITY, aTo = (a.death != null ? a.death : a.birth + 80);
      const bFrom = b.birth + MATURITY, bTo = (b.death != null ? b.death : b.birth + 80);
      if (aFrom == null || bFrom == null) return true;
      return aFrom <= bTo && bFrom <= aTo;
    }

const GROUNDING_TYPES = new Set(['consequence', 'presuppose',
                     'condition', 'emerge_from']);

function groundingCyclePath(srcId, tgtId, extraType) {
      if (!GROUNDING_TYPES.has(extraType)) return null;
      // Ребро ориентируем от обосновывающего к обоснованному:
      // у ground === 'source' основание в источнике, иначе в цели.
      const dirOf = (l) => {
        const t = DATA.relationTypesObj[l.type] || {};
        const s = l.source.id || l.source, g = l.target.id || l.target;
        return t.ground === 'target' ? [g, s] : [s, g];
      };
      const adj = new Map();
      DATA.links.forEach(l => {
        if (!GROUNDING_TYPES.has(l.type)) return;
        const [from, to] = dirOf(l);
        if (!adj.has(from)) adj.set(from, []);
        adj.get(from).push(to);
      });
      const t = DATA.relationTypesObj[extraType] || {};
      const [from, to] = t.ground === 'target' ? [tgtId, srcId] : [srcId, tgtId];
      if (from === to) return null;   // петля — отдельный разговор (§6.3)

      // ищем путь to → from: вместе с новым ребром он даст цикл
      const prev = new Map(); const seen = new Set([to]); const queue = [to];
      while (queue.length) {
        const cur = queue.shift();
        if (cur === from) {
          const path = [from];
          let x = from;
          while (prev.has(x)) { x = prev.get(x); path.push(x); }
          return path.reverse().concat([to]);
        }
        (adj.get(cur) || []).forEach(nx => {
          if (seen.has(nx)) return;
          seen.add(nx); prev.set(nx, cur); queue.push(nx);
        });
      }
      return null;
    }

const nConcepts = n => pluralRu(n, 'концепцию', 'концепции', 'концепций');

const nLinks = n => pluralRu(n, 'связь', 'связи', 'связей');

const labelOf = id => {
      const n = DATA.nodes.find(x => x.id === id);
      return n ? n.label : id;
    };

function connectionIntegrityWarnings(srcId, tgtId, type, weight, bidir, original) {
      const w = [];
      const t = DATA.relationTypesObj[type] || {};
      const srcNode = DATA.nodes.find(n => n.id === srcId);
      const tgtNode = DATA.nodes.find(n => n.id === tgtId);
      if (!srcNode || !tgtNode) return w;

      const isSame = l => l === original;

      // 1. дубль того же типа
      const dup = DATA.links.filter(l => !isSame(l) && l.type === type
        && (l.source.id || l.source) === srcId
        && (l.target.id || l.target) === tgtId);
      if (dup.length) {
        w.push('Связь типа «' + (t.label || type) + '» между этими концепциями уже есть.');
      }

      // 2. встречная того же типа у несимметричного типа
      if (!t.symmetric && srcId !== tgtId) {
        const back = DATA.links.filter(l => !isSame(l) && l.type === type
          && (l.source.id || l.source) === tgtId
          && (l.target.id || l.target) === srcId);
        if (back.length) {
          w.push('Есть встречная связь того же типа — возможно, имелась в виду '
             + 'взаимность (флажок), а не второе ребро.');
        }
      }

      // 3. Прежде здесь стояло предупреждение «флаг взаимности будет
      // выставлен» — и сохранение действительно записывало
      // bidirectional: true у симметричных типов (так требовал §8.3 п. 5
      // спецификации). Замер показал, что это ПОРТИЛО БЫ ДАННЫЕ: у 84
      // существующих связей симметричных типов флаг стоит в false
      // намеренно. В базе это два разных утверждения: symmetric — что
      // у ТИПА нет направления, bidirectional — что взаимность есть
      // ИСТОРИЧЕСКИЙ ФАКТ. Для обхода и отрисовки они сливаются
      // (isSymmetricLink), для метрик и проверок — нет. Поэтому флаг
      // у симметричных типов не трогается вовсе, а форма лишь поясняет,
      // почему его нельзя выбрать.

      // 4. цикл порядка обоснования
      const cycle = groundingCyclePath(srcId, tgtId, type);
      if (cycle && cycle.length > 2) {
        const names = cycle.map(labelOf);
        const shown = names.length > 6
          ? names.slice(0, 5).join(' ⇒ ') + ' ⇒ … ⇒ ' + names[names.length - 1]
          : names.join(' ⇒ ');
        w.push('Замыкается цикл обоснования длиной ' + (cycle.length - 1) + ': ' + shown);
      }

      // 5. синтез-одиночка
      if (type === 'synthesize') {
        // Подсказка говорит «два и более ИСТОЧНИКА у одной цели» —
        // источника, не философа. Спинозовская «Субстанция» из двух
        // картезианских субстанций есть правильный пучок, а прежняя
        // проверка требовала двух разных философов и объявляла её
        // одиночкой.
        const others = DATA.links.filter(l => !isSame(l) && l.type === 'synthesize'
          && (l.target.id || l.target) === tgtId);
        if (others.length === 0) {
          w.push('Синтез есть соединение нескольких в одно: у цели нет второго '
             + 'входящего synthesize от другого философа, и одиночная связь '
             + 'синтезом не является.');
        }
      }

      // 6. Внешний тип внутри одной системы. Признак берётся ИЗ ПОЛЯ
      // layer, а не из зашитого списка: у develop и critique объявлено
      // layer: 'both', то есть внутрисистемное употребление им разрешено
      // (поздний критикует раннего себя), и списком это не выражалось.
      if (t.layer === 'historical' && srcNode.concept === tgtNode.concept) {
        w.push('«' + (t.label || type) + '» — исторический тип: он связывает '
           + 'людей, а оба конца принадлежат одному философу.');
      }

      // 7. внутренний тип между системами
      if (type === 'internal_contradiction' && srcNode.concept !== tgtNode.concept) {
        w.push('Внутреннее противоречие — внутрисистемный тип, а концы принадлежат '
           + 'разным философам.');
      }

      // 8. Хронология. У разных типов КОНВЕНЦИЯ НАПРАВЛЕНИЯ РАЗНАЯ,
      // и одна проверка на всех была бы грубее предмета. Замер по базе
      // (пары философов с известными годами, разные системы):
      //   влияние   источник раньше 328 / позже 4
      //   развитие  209 / 0
      //   синтез    19 / 2      ← прямая конвенция
      //   критика   4 / 113
      //   диалог    23 / 131
      //   противопоставление 6 / 45
      //   типологическое противопоставление 0 / 8   ← обратная
      // При непересекающихся периодах нарушений НЕТ НИ ОДНОГО — разбор
      // направлений был доведён до конца, и проверка это подтверждает.
      // Конвенция направления берётся ИЗ ПОЛЯ temporal, а не из зашитых
      // списков: прежде я выводил её пересчётом годов рождения и дважды
      // ошибся — диалог объявлен up_to_contemporary, а типологическое
      // противопоставление не имеет temporal вовсе.
      const tp = t.temporal || null;
      if (tp && srcNode.concept !== tgtNode.concept
        && !activityOverlap(srcNode.concept, tgtNode.concept)) {
        const bs = philosopherBirth(srcNode.concept);
        const bt = philosopherBirth(tgtNode.concept);
        if (bs != null && bt != null && bs !== bt) {
          const ys = philosopherYears(srcNode.concept);
          const yt = philosopherYears(tgtNode.concept);
          if (tp === 'forward' && bs > bt) {
            w.push('У типа «' + (t.label || type) + '» источник должен быть '
               + 'РАНЬШЕ цели, а ' + srcNode.concept + ' (' + ys + ') жил позже, '
               + 'чем ' + tgtNode.concept + ' (' + yt + '), и периоды '
               + 'не пересекаются.');
          } else if ((tp === 'retrospective' || tp === 'up_to_contemporary')
                 && bs < bt) {
            w.push('У типа «' + (t.label || type) + '» источник не может быть '
               + 'РАНЬШЕ цели, а ' + srcNode.concept + ' (' + ys + ') жил '
               + 'раньше, чем ' + tgtNode.concept + ' (' + yt + '), '
               + 'и периоды не пересекаются.');
          } else if (tp === 'contemporary') {
            w.push('У типа «' + (t.label || type) + '» концы должны быть '
               + 'современниками, а периоды ' + srcNode.concept + ' и '
               + tgtNode.concept + ' не пересекаются.');
          }
        }
      }

      // Проверка 9 (направление против ground по началу описания)
      // УДАЛЕНА: описания ещё будут править, и расхождение говорило бы
      // о состоянии текста, а не связи.
      // петля — отдельная строка, всегда впереди
      if (srcId === tgtId) {
        const already = DATA.links.filter(l => !isSame(l) && isReflexiveLink(l)
                        && l.type === type).length;
        w.unshift('Связь концепции с самой собой (петля). '
          + (already ? 'Петель этого типа в базе уже ' + already + '.'
                 : 'Петель типа «' + (t.label || type) + '» в базе пока нет — '
                 + 'это будет первая.'));
      }
      return w;
    }

function conceptIntegrityWarnings(label, philosopher, original) {
      const w = [];
      const id = original ? original.id : null;
      const sameLabel = DATA.nodes.filter(n => n.id !== id && n.label === label);
      if (sameLabel.length) {
        const others = [...new Set(sameLabel.map(n => n.concept))];
        w.push('Метка «' + label + '» уже есть у ' + others.join(', ')
           + ': в окнах к ней будет приписан автор.');
      }
      if (id && isConceptIsolated(id)) {
        w.push('У концепции нет ни одной связи — она останется изолированной.');
      }
      if (!id) {
        w.push('У новой концепции связей пока нет; на графе она будет видна, '
           + 'но в метрики войдёт как изолированная, пока связь не появится.');
      }
      return w;
    }

function philosopherIntegrityWarnings(name, birth, death, original) {
      const w = [];
      if (birth != null && death != null && death < birth) {
        w.push('Год смерти раньше года рождения.');
      }
      if (original && name !== original) {
        const own = DATA.nodes.filter(n => n.concept === original).length;
        w.push('Переименование затронет ' + nConcepts(own) + ': у каждой '
           + 'обновится ссылка на философа.');
      }
      if (!original) {
        w.push('У нового философа пока нет ни одной концепции — '
           + 'в легенде он появится, но на графе показывать нечего.');
      }
      return w;
    }

export { GROUNDING_TYPES, activityOverlap, conceptIntegrityWarnings, connectionIntegrityWarnings, groundingCyclePath, labelOf, nConcepts, nLinks, philosopherIntegrityWarnings, relationIndexOf };
