#!/usr/bin/env python3
"""Окружение сущности в ИСХОДНОМ файле — то, что предложил пользователь.

Для имени печатает: где оно лежит сейчас, и десять соседей вверх и вниз по
исходному файлу — с заголовками и пояснениями, которые стоят перед ними.

Зачем это нужно и чего от этого ждать. Соседство в едином файле — сигнал
СЛАБЫЙ: замер даёт 76 % совпадения с нынешней раскладкой, а модули разорваны
на 167 кусков вместо 87. То есть порядок в файле в целом тематический, но
доверять ему как мерилу нельзя. Ценно другое: ПОЯСНЕНИЯ соседей показывают
замысел автора — что задумывалось одним куском работы. Поэтому это подспорье
для СПОРНЫХ случаев, а не способ раскладывать всё подряд.

    python3 tools/context.py <имя> [сколько=10]
"""
import json, re, sys, pathlib

КОРЕНЬ = pathlib.Path(__file__).resolve().parent.parent


def найти(*имена):
    for м in (КОРЕНЬ, pathlib.Path('/mnt/user-data/outputs')):
        for и in имена:
            п = м / и
            if п.exists():
                return п
    return КОРЕНЬ / имена[0]


имя = sys.argv[1] if len(sys.argv) > 1 else None
сколько = int(sys.argv[2]) if len(sys.argv) > 2 else 10
if not имя:
    print(__doc__)
    sys.exit(1)

карта = json.loads(найти('globals_map_v3.json').read_text(encoding='utf-8'))
раскладка = json.loads(найти('assign_names.json').read_text(encoding='utf-8'))['по_имени']
исходник = найти('philosophy_graph_v3.html', 'build/orig_v3.html').read_text(encoding='utf-8')
строки = исходник.split('\n')

сущ = [e for e in карта['entities'] if e['decl'] != 'statement']
сущ.sort(key=lambda e: e['line'])
места = {e['name']: i for i, e in enumerate(сущ)}
if имя not in места:
    print('нет такой сущности:', имя)
    sys.exit(1)


def пояснение(e):
    """Строки комментария непосредственно перед объявлением."""
    i = e['line'] - 2          # строки нумеруются с единицы
    куски = []
    while i >= 0:
        s = строки[i].strip()
        if not s:
            if куски:
                break
            i -= 1
            continue
        if s.startswith('//') or s.startswith('*') or s.startswith('/*'):
            куски.append(s.lstrip('/* ').rstrip('*/ '))
            i -= 1
            continue
        break
    return list(reversed(куски))


центр = места[имя]
от, до = max(0, центр - сколько), min(len(сущ), центр + сколько + 1)
print(f'{имя} — сейчас в {раскладка.get(имя, "?")}, строка {сущ[центр]["line"]}\n')
print(f'Окружение в исходном файле ({до - от} сущностей):\n')
for i in range(от, до):
    e = сущ[i]
    м = раскладка.get(e['name'], '?')
    метка = '►' if i == центр else ' '
    свой = '' if м == раскладка.get(имя) else '   ← другой модуль'
    print(f'{метка} {e["line"]:>6}  {e["name"]:<34} {e["kind"]:<9} {м}{свой}')
    for c in пояснение(e)[:3]:
        print(f'            ⌐ {c[:96]}')

# сводка: сколько соседей лежат в том же модуле
свои = sum(1 for i in range(от, до) if i != центр
           and раскладка.get(сущ[i]['name']) == раскладка.get(имя))
print(f'\nиз {до - от - 1} соседей в том же модуле: {свои}')
