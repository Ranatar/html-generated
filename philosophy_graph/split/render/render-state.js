// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from '../core/ns.js';

const LABEL_HIDE_BELOW = 0.6;

const LABEL_ALL_ABOVE = 1.0;

function nodeRadius(d)  { return S.renderState.radius.get(d.id)  ?? 18;  }

function nodeLabelDy(d) { return S.renderState.labelDy.get(d.id) ?? -25; }

function hasNodeClass(name, d) { const s = S.renderState.nodeClasses[name]; return !!s && s.has(d.id); }

function hasLinkClass(name, l) { const s = S.renderState.linkClasses[name]; return !!s && s.has(l); }

export { LABEL_ALL_ABOVE, LABEL_HIDE_BELOW, hasLinkClass, hasNodeClass, nodeLabelDy, nodeRadius };
