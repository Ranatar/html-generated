// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { CHRONOLOGY_MODES, MATURITY_AGE } from '../core/labels.js';

function strictChronologyCheck(fromPhil, toPhil) {
      // Периоды активной деятельности (с MATURITY_AGE лет до смерти)
      const fromActiveStart = fromPhil.birth + MATURITY_AGE;
      const fromActiveEnd = fromPhil.death;
      const toActiveStart = toPhil.birth + MATURITY_AGE;
      const toActiveEnd = toPhil.death;
      
      // Случай 1: fromPhil умер до начала активности toPhil
      // Посмертное влияние через тексты и идеи
      if (fromActiveEnd < toActiveStart) {
        return true;
      }
      
      // Случай 2: fromPhil стал активным раньше toPhil И дожил хотя бы до начала активности toPhil
      // Старший современник может влиять на младшего
      if (fromActiveStart < toActiveStart && fromActiveEnd >= toActiveStart) {
        return true;
      }
      
      // Случай 3: Они стали активными одновременно (в пределах 5 лет)
      // Возможно взаимное влияние ровесников
      if (Math.abs(fromActiveStart - toActiveStart) <= 5) {
        // Но если один умер значительно раньше другого, то только старший влияет на младшего
        if (fromActiveEnd < toActiveEnd - 10) {
          // fromPhil умер раньше - может влиять
          return true;
        } else if (toActiveEnd < fromActiveEnd - 10) {
          // toPhil умер раньше - fromPhil НЕ может влиять на него
          return false;
        }
        // Умерли примерно в одно время - взаимное влияние допустимо
        return true;
      }
      
      // Случай 4: fromPhil стал активным ПОЗЖЕ toPhil
      // Младший современник НЕ может влиять на старшего, КРОМЕ особых случаев
      if (fromActiveStart > toActiveStart) {
        // Если toPhil всё ещё был активен, когда fromPhil начал свою деятельность,
        // И toPhil прожил достаточно долго после начала активности fromPhil (минимум 10 лет),
        // то возможно обратное влияние (младший на старшего)
        if (fromActiveStart < toActiveEnd && (toActiveEnd - fromActiveStart) >= 10) {
          return true;
        }
        // Иначе - младший НЕ может влиять на старшего
        return false;
      }
      
      // Все остальные случаи - анахронизм
      return false;
    }

function moderateChronologyCheck(fromPhil, toPhil) {
      // toPhil должен родиться не раньше чем за 50 лет до fromPhil
      return toPhil.birth >= fromPhil.birth - 50;
    }

function looseChronologyCheck(fromPhil, toPhil) {
      // toPhil должен родиться не раньше чем за 100 лет до fromPhil
      return toPhil.birth >= fromPhil.birth - 100;
    }

function isChronologicallyValid(fromNodeId, toNodeId, mode = S.currentChronologyMode, linkType = null) {
      const fromNode = DATA.nodes.find(n => n.id === fromNodeId);
      const toNode = DATA.nodes.find(n => n.id === toNodeId);
      
      if (!fromNode || !toNode) return true; // Если узлы не найдены, разрешаем
      
      // Находим данные философов по имени (nameRu)
      let fromPhil = DATA.philosophers.find(p => p.nameRu === fromNode.concept);
      let toPhil = DATA.philosophers.find(p => p.nameRu === toNode.concept);
      
      if (!fromPhil || !toPhil) return true; // Если философы не найдены, разрешаем
      
      // Если один и тот же философ - всегда разрешаем
      if (fromPhil.id === toPhil.id) return true;
      
      // B1: направление ребра означает разное для разных типов. influence
      // и develop идут вперёд во времени, critique/oppose/dialogue —
      // ретроспективно (Кант критикует Ансельма, Деррида — Платона).
      // Единая проверка блокировала 241 ребро из 1590 (15.2 %): critique 112,
      // dialogue 95, oppose 26 — весь ретроспективно-критический слой.
      if (linkType) {
        const td = DATA.relationTypesObj[linkType];
        const temporal = td ? td.temporal : undefined;
        // Логический слой: связь внутри системы, хронологии не имеет.
        // Типологический: контакта не было, значит и анахронизма нет.
        // Общее правило — тип без временной конвенции не проверяется.
        if (td && (td.layer === 'logical' || td.layer === 'typological' || !td.temporal)) return true;
        if (temporal === 'retrospective') {
          // Читается назад: проверяем как влияние цели на источник
          const t = fromPhil; fromPhil = toPhil; toPhil = t;
        } else if (temporal === 'contemporary') {
          // Полемика предполагает пересечение периодов активности;
          // при отсутствии пересечения читается ретроспективно
          const fs = fromPhil.birth + MATURITY_AGE, fe = fromPhil.death;
          const ts = toPhil.birth + MATURITY_AGE, te = toPhil.death;
          if (fs <= te && ts <= fe) return true;
          const t = fromPhil; fromPhil = toPhil; toPhil = t;
        }
      }
      
      // Применяем соответствующую проверку
      switch(mode) {
        case CHRONOLOGY_MODES.STRICT:
          return strictChronologyCheck(fromPhil, toPhil);
          
        case CHRONOLOGY_MODES.MODERATE:
          return moderateChronologyCheck(fromPhil, toPhil);
          
        case CHRONOLOGY_MODES.LOOSE:
          return looseChronologyCheck(fromPhil, toPhil);
          
        default:
          return true; // По умолчанию разрешаем
      }
    }

export { isChronologicallyValid, looseChronologyCheck, moderateChronologyCheck, strictChronologyCheck };
