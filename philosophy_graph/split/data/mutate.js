// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { известить } from '../core/events.js';
import { markDirty } from './save.js';

function rebuildPhilosopherTraditions() {
      Object.keys(DATA.philosopherTraditions).forEach(k => delete DATA.philosopherTraditions[k]);
      DATA.philosophers.forEach(p => { DATA.philosopherTraditions[p.nameRu] = p.traditions || []; });
    }

function rebuildDerivedIndexes(what) {
      what = what || {};

      if (what.philosophers) {
        Object.keys(DATA.philosopherConcepts).forEach(k => delete DATA.philosopherConcepts[k]);
        Object.keys(DATA.philosopherOrder).forEach(k => delete DATA.philosopherOrder[k]);
        Object.keys(DATA.philosopherIdToName).forEach(k => delete DATA.philosopherIdToName[k]);
        DATA.philosophers.forEach(p => {
          // схема metrics15, а не unimod: здесь запись беднее —
          // только цвет и годы; birth и death берутся из philosophers
          DATA.philosopherConcepts[p.nameRu] = { color: p.color, years: p.years };
          DATA.philosopherOrder[p.nameRu] = p.birth;
          DATA.philosopherIdToName[p.id] = p.nameRu;
        });
        rebuildPhilosopherTraditions();
      }

      if (what.nodes) {
        Object.keys(DATA.conceptToRubrics).forEach(k => delete DATA.conceptToRubrics[k]);
        DATA.concepts.forEach(c => { DATA.conceptToRubrics[c.id] = c.rubrics || []; });

        Object.keys(DATA.rubricsObj).forEach(k => delete DATA.rubricsObj[k]);
        DATA.rubrics.forEach(r => {
          DATA.rubricsObj[r.name] = {
            concepts: DATA.concepts.filter(c => (c.rubrics || []).includes(r.id))
                      .map(c => c.id),
            description: r.description
          };
        });
      }

      if (what.relationTypes) {
        Object.keys(DATA.linkColors).forEach(k => delete DATA.linkColors[k]);
        DATA.relationTypes.forEach(rt => { DATA.linkColors[rt.id] = rt.color; });
      }
    }

function afterDataChange(what) {
      what = what || { nodes: true, links: true };

      // Единственная точка, через которую проходит всякое изменение базы:
      // отсюда и берётся признак «есть несохранённое».
      markDirty();

      rebuildDerivedIndexes(what);


      // Новый философ должен попасть в множество выбранных, иначе будет
      // отфильтрован сразу после создания. Это забота самих данных.
      if (what.philosophers) {
        Object.keys(DATA.philosopherConcepts).forEach(name => {
          if (!S.selectedPhilosophers.has(name)) S.selectedPhilosophers.add(name);
        });
      }

      // Дальше — не наше дело. Слой данных не обязан знать ни о карте
      // сходства, ни о стопке окон, ни о легенде, ни о панели статистики.
      // Он извещает; кто отзовётся — решает сборка.
      известить('данные-изменились', what);
    }

export { afterDataChange, rebuildDerivedIndexes, rebuildPhilosopherTraditions };
