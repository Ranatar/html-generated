// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA } from './ns.js';

function traditionsOfPhilosopher(name) {
      return (DATA.philosopherTraditions[name] || [])
        .map(id => (DATA.traditions.find(t => t.id === id) || {}).name)
        .filter(Boolean);
    }

function findConnection(sourceId, targetId, bidirectional = true) {
      return DATA.links.find(l => {
        const srcId = l.source.id || l.source;
        const tgtId = l.target.id || l.target;
        if (srcId === sourceId && tgtId === targetId) return true;
        if (bidirectional && srcId === targetId && tgtId === sourceId) return true;
        return false;
      }) || null;
    }

function getConceptConnections(conceptId) {
      return DATA.links.filter(l => {
        const srcId = l.source.id || l.source;
        const tgtId = l.target.id || l.target;
        return srcId === conceptId || tgtId === conceptId;
      });
    }

function connectionsBetween(sourceId, targetId) {
      return DATA.links.filter(l => {
        const s = l.source.id || l.source;
        const t = l.target.id || l.target;
        return (s === sourceId && t === targetId)
          || (s === targetId && t === sourceId);
      });
    }

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

export { connectionsBetween, findConnection, getConceptConnections, traditionsOfPhilosopher };
