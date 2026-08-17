// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { DATA, S } from '../core/ns.js';
import { requestDraw } from './loop.js';
import { startRadiusAnimation } from './scene.js';

const nodeHandlers = {};

const linkHandlers = {};

function makeClassed(kind) {
      return function (name, value) {
        const items = kind === "node" ? DATA.nodes : DATA.links;
        const store = kind === "node" ? S.renderState.nodeClasses : S.renderState.linkClasses;
        if (value === false)    store[name] = null;
        else if (value === true)  store[name] = new Set(kind === "node" ? DATA.nodes.map(n => n.id) : DATA.links);
        else {
          const set = new Set();
          for (const d of items) if (value(d)) set.add(kind === "node" ? d.id : d);
          store[name] = set;
        }
        requestDraw();
        return this;
      };
    }

function subSelection(kind, what) {
      let dur = 0;
      const api = {
        transition() { dur = 250; return api; },
        duration(ms) { dur = ms; return api; },
        each(fn) { for (const n of DATA.nodes) fn(n); return api; },
        attr(name, fn) {
          const target = new Map();
          for (const n of DATA.nodes) target.set(n.id, typeof fn === "function" ? fn(n) : fn);
          if (what === "circle" && name === "r") {
            const dyTarget = new Map();
            for (const n of DATA.nodes) dyTarget.set(n.id, S.renderState.labelDy.get(n.id) ?? -25);
            if (dur > 0) startRadiusAnimation(target, dyTarget, dur);
            else { S.renderState.radius = target; requestDraw(); }
          } else if (what === "text" && name === "dy") {
            if (S.renderState.anim) S.renderState.anim.dyTo = target;
            else { S.renderState.labelDy = target; requestDraw(); }
          }
          return api;
        },
      };
      return api;
    }

const gfxNode = {
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

const gfxLink = {
      classed: makeClassed("link"),
      style(name, value) { requestDraw(); return this; },
      on(name, fn) { linkHandlers[name.split(".")[0]] = fn; return this; },
      filter(fn) { const hit = DATA.links.filter(fn);
             return { size: () => hit.length, empty: () => hit.length === 0,
                  datum: () => hit[0], attr: () => {} }; },
    };

const gfxLinkAll = {
      classed(name, value) { gfxLink.classed(name, value); return gfxLinkAll; },
      style(name, value)   { requestDraw(); return gfxLinkAll; },
    };

function updateArrows() { requestDraw(); }

function dragstarted(event, d) {
      if (!event.active) {
        S.tickCount = 0; 
        S.simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

function dragended(event, d) {
      if (!event.active) S.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

export { dragended, dragstarted, gfxLink, gfxLinkAll, gfxNode, linkHandlers, makeClassed, nodeHandlers, subSelection, updateArrows };
