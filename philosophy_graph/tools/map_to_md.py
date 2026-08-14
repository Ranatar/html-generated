#!/usr/bin/env python3
# Превращает globals_map.json в md-таблицы.
import json, sys, re
from collections import defaultdict

src = sys.argv[1] if len(sys.argv) > 1 else 'globals_map.json'
dst = sys.argv[2] if len(sys.argv) > 2 else 'globals_map.md'
d = json.load(open(src, encoding='utf-8'))
E = {e['id']: e for e in d['entities']}


def esc(s):
    return str(s).replace('|', '\\|').replace('\n', ' ')


def lst(items, key='name'):
    """список имён с кратностью: имя ×3"""
    if not items:
        return '—'
    out = []
    for it in items:
        n = it[key]
        c = it.get('count', 1)
        out.append(f'`{n}`' + (f'×{c}' if c > 1 else ''))
    return ', '.join(out)


def table(head, rows):
    if not rows:
        return '_нет_\n'
    s = '| ' + ' | '.join(head) + ' |\n'
    s += '|' + '|'.join(['---'] * len(head)) + '|\n'
    for r in rows:
        s += '| ' + ' | '.join(esc(c) for c in r) + ' |\n'
    return s


L = []
mc = d['meta']['counts']
L.append('# Карта глобальных сущностей `philosophy_graph.html`\n')
L.append(("Файл: {b} знаков, {l} строк; встроенный скрипт — строки {f}–{t}. "
          "Составлено {g} UTC.\n").format(
    b=format(d['meta']['bytes'], ',').replace(',', ' '),
    l=format(d['meta']['lines'] - 1, ',').replace(',', ' '),
    f=d['meta']['scriptFrom'], t=d['meta']['scriptTo'],
    g=d['meta']['generated'][:19].replace('T', ' ')))
L.append(f"""Всего глобальных сущностей: **{mc['total']}** — функций {mc['functions']}
(из них асинхронных {mc['async']}), `const` {mc['const']}, `let` {mc['let']},
`var` {mc['var']}, операторов верхнего уровня {mc['statements']}.
Обработчиков событий {len(d['listeners'])}; вызовов из разметки:
статической {mc['htmlStatic']}, порождаемой {mc['htmlDynamic']}.

Столбец «использует» — глобальные имена, к которым сущность обращается
(×N — число обращений); «используется в» — обратная связь. Обращения из
строк разметки в AST не видны и учтены отдельным столбцом «из разметки».
""")

# ── 0. оглавление и опоры ─────────────────────────────────────────
L.append("""**Разделы.** [1. Функции](#1-глобальные-функции) ·
[2. Константы и переменные](#2-глобальные-константы-и-переменные) ·
[3. Операторы верхнего уровня](#3-операторы-верхнего-уровня) ·
[4. Обработчики событий](#4-обработчики-событий-навешанные-из-кода) ·
[4б. Обращение по имени](#4б-обращение-к-функциям-по-имени-window) ·
[5. Вызовы из разметки](#5-функции-вызываемые-из-разметки) ·
[6. Разметка построчно](#6-все-обработчики-в-разметке-построчно) ·
[7. Диагностика](#7-диагностика)\n""")

hot = sorted(d['entities'], key=lambda e: -sum(u['count'] for u in e['usedBy']))[:15]
L.append('\n## 0. На чём всё держится\n')
L.append('Пятнадцать сущностей с наибольшим числом обращений.\n')
L.append(table(['Имя', 'Вид', 'Стр.', 'Обращений', 'Из скольких сущностей'],
               [[f"`{e['name']}`", e['kind'], e['line'],
                 sum(u['count'] for u in e['usedBy']), len(e['usedBy'])] for e in hot]))

# ── 1. функции ────────────────────────────────────────────────────
funcs = [e for e in d['entities'] if 'функция' in e['kind'] or 'function' in e['kind']]
funcs.sort(key=lambda e: e['line'])
rows = []
for e in funcs:
    mk = e.get('fromMarkup')
    mk_s = '—'
    if mk:
        parts = []
        if mk['static']:
            parts.append(f"статич.×{mk['static']}")
        if mk['dynamic']:
            parts.append(f"динам.×{mk['dynamic']}")
        mk_s = ', '.join(parts)
    rows.append([
        f"`{e['name']}`",
        e['kind'] + (' ⟲' if e.get('recursive') else ''),
        e['line'],
        e['lines'],
        '(' + ', '.join(e.get('params') or []) + ')',
        lst(e['uses']),
        lst(e['usedBy']),
        mk_s,
        (f"{e['byName']['count']}× ({', '.join(e['byName']['how'])}) в "
         + ', '.join('`' + o + '`' for o in e['byName']['owners'])) if e.get('byName')
        else ('вероятно через `window[…]` в ' + ', '.join('`' + o + '`' for o in e['dispatchGuess'])
              if e.get('dispatchGuess') and not e['usedBy'] else '—'),
    ])
L.append('\n## 1. Глобальные функции\n')
L.append('`⟲` — вызывает сама себя. Столбец «по имени» — обращения, '
         'где имя функции стоит строкой или ключом объекта '
         '(в этом файле так работает вызов через `window[имя]`).\n')
L.append(table(['Имя', 'Вид', 'Стр.', 'Длина', 'Параметры',
                'Использует', 'Используется в', 'Из разметки', 'По имени'], rows))

# ── 2. константы и переменные ─────────────────────────────────────
data = [e for e in d['entities']
        if e['decl'] in ('const', 'let', 'var') and 'функция' not in e['kind']]
data.sort(key=lambda e: e['line'])
rows = [[f"`{e['name']}`", e['kind'], e['line'], e.get('value', '—'),
         lst(e['uses']), lst(e['usedBy'])] for e in data]
L.append('\n## 2. Глобальные константы и переменные\n')
L.append(table(['Имя', 'Вид', 'Стр.', 'Значение', 'Использует', 'Используется в'], rows))

# ── 3. операторы верхнего уровня ──────────────────────────────────
stmts = [e for e in d['entities'] if e['decl'] == 'statement']
rows = [[e['id'], e['kind'], e['line'], e['lines'], f"`{e['name']}`",
         lst(e['uses'])] for e in stmts]
L.append('\n## 3. Операторы верхнего уровня\n')
L.append("""Исполняемый код вне функций: производные словари (`relationTypesObj`
и подобные), навешивание обработчиков, запуск раскладки, стартовые вызовы.
Порядок в таблице — порядок исполнения при загрузке страницы.\n""")
L.append(table(['Метка', 'Вид', 'Стр.', 'Длина', 'Что делает', 'Использует'], rows))

# ── 4. обработчики событий ────────────────────────────────────────
ls = sorted(d['listeners'], key=lambda x: x['line'])
rows = [[x['line'], f"`{x['event']}`", f"`{x['target']}`", x.get('via', ''),
         x['handler'],
         ('верхний уровень: ' if x['top'] else '') + f"`{x['owner']}`" if x['owner'] else '—']
        for x in ls]
L.append('\n## 4. Обработчики событий, навешанные из кода\n')
L.append(table(['Стр.', 'Событие', 'Цель', 'Способ', 'Обработчик', 'Где навешан'], rows))

# ── 4б. косвенные обращения по имени ──────────────────────────────
L.append('\n## 4б. Обращение к функциям по имени (`window[…]`)\n')
L.append("""Пять точек, где имя функции склеивается из кусков и вызывается
через `window[…]`. Прямых ссылок на такие функции в коде нет — без этой
таблицы карта показала бы их покойниками.\n""")
L.append(table(['Стр.', 'Где', 'Выражение', 'Действие'],
               [[x['line'], f"`{x['owner']}`", f"`{x['expr']}`",
                 'запись' if x['write'] else 'чтение'] for x in d['dispatch']]))
nr = {}
for r in d['nameRefs']:
    nr.setdefault(r['name'], []).append(r)
L.append('\nИмена функций, встречающиеся строкой или ключом объекта:\n')
L.append(table(['Имя функции', 'Раз', 'Где'],
               [[f"`{k}`", len(v),
                 ', '.join(sorted({(f"`{x['owner']}`" if x['owner'] else '(верхний уровень)')
                                   + f" ({x['how']})" for x in v}))]
                for k, v in sorted(nr.items(), key=lambda kv: -len(kv[1]))]))

# ── 5. вызовы из разметки, сводка по именам ───────────────────────
rows = []
for r in d['markup']['byName']:
    rows.append([f"`{r['name']}`",
                 'да' if r['defined'] else '**НЕТ**',
                 r['static'], r['dynamic'],
                 ', '.join('`' + a + '`' for a in sorted(r['attrs'])),
                 ', '.join('`' + p + '`' for p in r['producers']) or '—'])
L.append('\n## 5. Функции, вызываемые из разметки\n')
L.append("""«Статич.» — атрибуты в разметке страницы; «динам.» — атрибуты внутри
строк и шаблонов, которые собирает код. «Порождается в» — сущности,
в теле которых эта разметка написана.\n""")
L.append(table(['Имя', 'Определена глобально', 'Статич.', 'Динам.',
                'Атрибуты', 'Порождается в'], rows))

# ── 6. подробности разметки ───────────────────────────────────────
rows = [[h['line'], f"`{h['attr']}`", '(страница)', f"`{h['code']}`"]
        for h in d['markup']['static']]
rows += [[h['line'], f"`{h['attr']}`", f"`{h['producer']}`", f"`{h['code']}`"]
         for h in d['markup']['dynamic']]
rows.sort(key=lambda r: r[0])
L.append('\n## 6. Все обработчики в разметке построчно\n')
L.append(table(['Стр.', 'Атрибут', 'Порождается в', 'Код'], rows))

# ── 7. диагностика ────────────────────────────────────────────────
dead = [e for e in d['entities']
        if e['decl'] != 'statement' and not e['usedBy']
        and not e.get('fromMarkup') and not e.get('byName')]
dead.sort(key=lambda e: e['line'])
L.append('\n## 7. Диагностика\n')
L.append('\n### 7.1. Ни разу не упомянуты (кандидаты в покойники)\n')
L.append("""Учтены прямые ссылки, вызовы из разметки и обращения по имени
(строкой или ключом объекта). Остаться в списке законно может лишь то,
что зовётся из консоли или по имени, склеенному из кусков, — последнее
помечено в столбце «оговорка».\n""")
L.append(table(['Имя', 'Вид', 'Стр.', 'Длина', 'Оговорка'],
               [[f"`{e['name']}`", e['kind'], e['line'], e['lines'],
                 ('вероятно цель `window[…]` в ' +
                  ', '.join('`' + o + '`' for o in e['dispatchGuess']))
                 if e.get('dispatchGuess') else '—'] for e in dead]))

L.append('\n### 7.2. Имена из разметки без глобального определения\n')
undef = [r for r in d['markup']['byName'] if not r['defined']]
L.append(table(['Имя', 'Статич.', 'Динам.', 'Порождается в'],
               [[f"`{r['name']}`", r['static'], r['dynamic'],
                 ', '.join('`' + p + '`' for p in r['producers']) or '—'] for r in undef])
         if undef else '_нет_\n')

L.append('\n### 7.3. Необъявленные имена, используемые в скрипте\n')
L.append('Обычные глобальные объекты браузера и `d3`; сюда же попадут опечатки.\n\n')
L.append(table(['Имя', 'Обращений'],
               [[f"`{r['name']}`", r['count']] for r in d['undeclared']]))

open(dst, 'w', encoding='utf-8').write('\n'.join(L))
print('записано', dst)
