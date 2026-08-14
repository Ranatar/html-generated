#!/usr/bin/env node
// Снятие моста.
//
// Мост существовал ради разметки: встроенный обработчик исполняется в
// глобальной области и другого способа дозваться до функции не имеет.
// После делегирования разметка зовёт действия по имени из реестра, и
// глобальные имена ей не нужны. Приборы приёмки получили собственную
// оснастку (_probe-rig.js), которая частью приложения не является.
//
// Остаётся ровно то, что ещё зовётся из встроенных атрибутов, — сейчас
// это одна пара mouseenter/mouseleave у стрелки пути (эти события не
// всплывают, делегированием не покрываются).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.argv[2] || '/home/claude/build/src';

// кого ещё зовут встроенные атрибуты
const ATTR = /\bon(mouseover|mouseout|mouseenter|mouseleave|click|change|input|focus)\s*=\s*(\\?")((?:[^"\\]|\\.)*?)\2/g;
const нужны = new Set();
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'vendor') walk(p); continue; }
    if (!/\.(js|html)$/.test(p) || f.startsWith('_')) continue;
    const rel = path.relative(ROOT, p).replace(/\\/g, '/');
    // bridge.js — сам предмет правки; actions.js поминает встроенный
    // обработчик В ПОЯСНЕНИИ, и принимать пояснение за разметку не надо
    if (rel === 'bridge.js' || rel === 'ui/actions.js') continue;
    const text = fs.readFileSync(p, 'utf8');
    for (const m of text.matchAll(ATTR))
      for (const n of m[3].matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(/g))
        нужны.add(n[1]);
  }
})(ROOT);

const b = path.join(ROOT, 'bridge.js');
const было = fs.readFileSync(b, 'utf8');
const строки = было.split('\n');

const оставить = строки.filter(l => {
  const m = l.match(/^\s*window\.(\w+) = \w+;$/) ||
            l.match(/defineProperty\(window, '(\w+)'/);
  if (!m) return true;
  return нужны.has(m[1]);
});
// подчистить ставшие лишними ввозы
let text = оставить.join('\n');
text = text.replace(/^import \{([^}]*)\} from '([^']*)';$/gm, (all, имена, откуда) => {
  const нужное = имена.split(',').map(s => s.trim()).filter(n =>
    new RegExp('window\\.' + n + ' =|' + n + ';').test(text.replace(all, '')) && нужны.has(n));
  return нужное.length ? `import { ${нужное.join(', ')} } from '${откуда}';` : '';
}).replace(/\n{3,}/g, '\n\n');

if (нужны.size === 0) {
  // Мост не нужен вовсе: ни один встроенный атрибут не зовёт функцию.
  // Оставлять его «маленьким» смысла нет — это тот же глобальный ход,
  // только уже, и он держал бы за собой ввоз, точку установки и оговорку
  // в README. Удаляем целиком.
  fs.unlinkSync(b);
  const mp = path.join(ROOT, 'main.js');
  const main = fs.readFileSync(mp, 'utf8')
    .replace(/^import \{ installBridge \} from '\.\/bridge\.js';\n/m, '')
    .replace(/^installBridge\(\);.*\n/m, '')
    .replace(/\n{3,}/g, '\n\n');
  fs.writeFileSync(mp, main);
  console.log('мост снят целиком: bridge.js удалён, установка убрана из main.js');
  process.exit(0);
}

fs.writeFileSync(b, text);
const сталоИмён = (text.match(/window\.\w+ =|defineProperty\(window/g) || []).length;
const былоИмён = (было.match(/window\.\w+ =|defineProperty\(window/g) || []).length;
console.log(`мост: имён ${былоИмён} → ${сталоИмён}` +
  (нужны.size ? `; ещё зовутся из встроенных атрибутов: ${[...нужны].join(', ')}` : ''));
