// Сгенерировано из philosophy_graph.html — правки вносить сюда, не в исходник.

import { DATA } from '../core/ns.js';

const FILES = ["traditions","philosophers","rubrics","relationTypes","concepts","relations"];

export async function loadData(base = './data/') {
  const got = await Promise.all(FILES.map(n =>
    fetch(base + n + '.json').then(r => {
      if (!r.ok) throw new Error('не читается ' + n + '.json: ' + r.status);
      return r.json();
    })));
  FILES.forEach((n, i) => { DATA[n] = got[i]; });
  return DATA;
}
