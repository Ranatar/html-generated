// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from './ns.js';

export function buildIndexes() {
  DATA.philosopherIdToName = {};
  
  DATA.philosophers.forEach(p => {
        DATA.philosopherIdToName[p.id] = p.nameRu;
      });
  
  DATA.philosopherConcepts = {};
  
  DATA.philosophers.forEach(p => {
        DATA.philosopherConcepts[p.nameRu] = {
          color: p.color,
          years: p.years
        };
      });
  
  DATA.philosopherOrder = {};
  
  DATA.philosophers.forEach(p => {
        DATA.philosopherOrder[p.nameRu] = p.birth;
      });
  
  DATA.relationTypesObj = {};
  
  DATA.relationTypes.forEach(rt => {
        DATA.relationTypesObj[rt.id] = {
          color: rt.color,
          label: rt.label,
          layer: rt.layer,    // A9: нужен для B1 и для будущей проверки целостности
          temporal: rt.temporal,
          symmetric: rt.symmetric === true,
          ground: rt.ground || null
        };
      });
  
  DATA.linkColors = {};
  
  DATA.relationTypes.forEach(rt => {
        DATA.linkColors[rt.id] = rt.color;
      });
  
  DATA.nodes = DATA.concepts.map(c => ({
        id: c.id,
        label: c.label,
        concept: DATA.philosopherIdToName[c.philosopher], // Преобразуем id в имя
        rubrics: c.rubrics || [],
        description: c.description,
        extendedDescription: c.extendedDescription
      }));
  
  DATA.links = DATA.relations.map(r => ({
        source: r.source,
        target: r.target,
        type: r.type,
        weight: r.weight || 2, // Вес по умолчанию, если не указан
        bidirectional: r.bidirectional || false,
        description: r.description,
      }));
  
  DATA.conceptToRubrics = {};
  
  DATA.rubricsObj = {};
  
  DATA.philosopherTraditions = {};
}
