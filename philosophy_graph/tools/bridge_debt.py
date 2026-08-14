#!/usr/bin/env python3
"""Счётчик долга переноса: сколько ещё осталось от старого устройства.

Гоняется по дереву исходников после каждого захода:
    python3 tools/bridge_debt.py src/

Считает три вещи, каждая из которых должна дойти до нуля:
  1. атрибуты on* в разметке — статической (.html) и порождаемой (.js);
  2. записи в window (то есть содержимое bridge.js);
  3. обращения window[выражение] — приём, который в модулях не работает.

Печатает остаток и разбивку по файлам, возвращает 1, пока долг не нулевой,
чтобы прибор годился как условие приёмки в сборке.
"""
import os, re, sys
from collections import defaultdict

ATTR = re.compile(
    r"""\bon(click|change|input|submit|keyup|keydown|keypress|focus|blur|"""
    r"""mouseover|mouseout|mouseenter|mouseleave|mousedown|mouseup|dblclick|"""
    r"""wheel|contextmenu|load|error|scroll|toggle)\s*=\s*(\\?["'])""",
    re.I)
WIN_SET = re.compile(r"""\bwindow\.([A-Za-z_$][\w$]*)\s*=(?!=)""")
WIN_DEF = re.compile(r"""defineProperty\(\s*window\s*,\s*['"]([A-Za-z_$][\w$]*)['"]""")
WIN_IDX = re.compile(r"""\bwindow\[""")
SETATTR = re.compile(r"""setAttribute\(\s*['"]on[a-z]+['"]""", re.I)

root = sys.argv[1] if len(sys.argv) > 1 else 'src'
skip_names = {'bridge.js'}          # мост считается отдельной строкой
# delegation.js подменяет window.event на время действия и тут же возвращает
# как было — это не выставление наружу, а обратное: замыкание на элемент
skip_window = {'delegation.js', '_probe-rig.js'}
attrs, wins, idxs = defaultdict(int), defaultdict(list), defaultdict(int)
bridge_names = []

for base, dirs, files in os.walk(root):
    dirs[:] = [d for d in dirs if d not in ('node_modules', '.git', 'dist')]
    for f in files:
        if not f.endswith(('.html', '.js', '.mjs')):
            continue
        if f.startswith('_ref'):        # эталонная копия для сверки — не часть сборки
            continue
        path = os.path.join(base, f)
        text = open(path, encoding='utf-8', errors='replace').read()
        # Пояснения — не разметка: ui/actions.js поминает onclick="…" в
        # рассуждении о том, чем делегирование хуже встроенного обработчика
        код = re.sub(r'/\*[\s\S]*?\*/', ' ', text)
        код = re.sub(r'(^|[^:])//[^\n]*', r'\1 ', код)
        n = len(ATTR.findall(код)) + len(SETATTR.findall(код))
        if n:
            attrs[path] += n
        names = [] if f in skip_window else WIN_SET.findall(text) + WIN_DEF.findall(text)
        if f in skip_names:
            bridge_names += names
        elif names:
            wins[path] += names
        k = len(WIN_IDX.findall(text))
        if k:
            idxs[path] += k

total_attr = sum(attrs.values())
total_win = sum(len(v) for v in wins.values())
total_idx = sum(idxs.values())
debt = total_attr + total_win + total_idx + len(bridge_names)

print(f'дерево: {root}')
print(f'  атрибуты on* в разметке      {total_attr:>5}   (было 195)')
print(f'  имён в bridge.js             {len(bridge_names):>5}   (было 108)')
print(f'  записи в window вне моста    {total_win:>5}   (должно быть 0 всегда)')
print(f'  обращения window[выражение]  {total_idx:>5}   (было 5)')
print(f'  ОСТАТОК ДОЛГА                {debt:>5}')

if attrs:
    print('\nатрибуты по файлам:')
    for p in sorted(attrs, key=lambda p: -attrs[p]):
        print(f'  {attrs[p]:>4}  {p}')
if wins:
    print('\nзаписи в window вне моста (это ошибка, а не долг):')
    for p, names in sorted(wins.items()):
        print(f'  {p}: ' + ', '.join(sorted(set(names))))
if idxs:
    print('\nwindow[выражение]:')
    for p in sorted(idxs):
        print(f'  {idxs[p]:>4}  {p}')
if bridge_names:
    print('\nещё в мосте: ' + ', '.join(sorted(set(bridge_names))))

sys.exit(0 if debt == 0 else 1)
