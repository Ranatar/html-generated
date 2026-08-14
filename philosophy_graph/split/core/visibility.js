// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.
import { S } from './ns.js';

function isNodeVisible(d) { return !S.visibleNodeIds || S.visibleNodeIds.has(d.id); }

function isLinkVisible(l) { return !S.visibleLinkSet || S.visibleLinkSet.has(l); }

export { isLinkVisible, isNodeVisible };
