#!/usr/bin/env python3
"""Переключатель заморозки — в ИСХОДНЫЙ одностраничный файл.

Тот же замысел, что и в сборке: правятся имеющиеся freezeSimulation и
unfreezeSimulation, а не заводится вторая пара поверх. Различается не
«заморожено / не заморожено», а КЕМ заморожено: окном или рукой. Замок,
поставленный рукой, закрытием окна не снимается.

Карта модулей привязана к строкам нетронутого исходника, поэтому обе
стороны патчатся отдельно, а одинаковость доказывается прибором.
"""
import re, sys, pathlib

ВХОД = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/build/orig_v2.html'
ВЫХОД = sys.argv[2] if len(sys.argv) > 2 else '/home/claude/build/orig_v3.html'

s = pathlib.Path(ВХОД).read_text(encoding='utf-8')
if 'freezeBtn' in s:
    pathlib.Path(ВЫХОД).write_text(s, encoding='utf-8')
    print('исходник: переключатель уже есть')
    sys.exit(0)

# ── 1. кнопка ───────────────────────────────────────────────────────
до = s
s = s.replace(
    '      <button onclick="centerGraph()">',
    '      <button id="freezeBtn" onclick="toggleSimulationFreeze()" '
    'title="Остановить раскладку насовсем — окна её больше не запустят">❄️ Заморозить</button>\n'
    '      <button onclick="centerGraph()">', 1)
assert s != до, 'не найдена кнопка центрирования'

# ── 2. freezeSimulation получает источник ───────────────────────────
БЫЛО_F = '''    function freezeSimulation() {
      if (simulation) {
        simulation.stop();
        // console.log("Симуляция заморожена");
      }
    }'''
СТАЛО_F = '''    // Замок: раскладка заморожена РУКОЙ и сама собой не оттает.
    let simLockedByHand = false;

    function freezeSimulation(источник) {
      if (источник === 'рука') simLockedByHand = true;
      if (simulation) simulation.stop();
    }'''
assert БЫЛО_F in s, 'не найдено тело freezeSimulation'
s = s.replace(БЫЛО_F, СТАЛО_F, 1)

# ── 3. unfreezeSimulation слушается замка ───────────────────────────
до = s
s = s.replace('    function unfreezeSimulation() {',
              '''    function unfreezeSimulation(источник) {
      // Замок сильнее окон: пока он стоит, закрытие окна раскладку не будит.
      if (simLockedByHand && источник !== 'рука') return;''', 1)
assert s != до, 'не найдена unfreezeSimulation'

# ── 4. сам переключатель ────────────────────────────────────────────
ПЕРЕКЛЮЧАТЕЛЬ = '''
    // Переключатель в панели контроля. Прекращает только СИЛУ УКЛАДКИ;
    // перерисовку не трогает — подсветка и дуги схожести продолжают жить.
    function toggleSimulationFreeze() {
      if (simLockedByHand) {
        simLockedByHand = false;
        const улеглась = !simulation || tickCount >= maxTicks;
        unfreezeSimulation('рука');
        if (улеглась) showTemporaryMessage('Раскладка уже улеглась — двигаться нечему', 2000);
      } else {
        freezeSimulation('рука');
      }
      updateFreezeButton();
    }

    function updateFreezeButton() {
      const b = document.getElementById('freezeBtn');
      if (!b) return;
      b.textContent = simLockedByHand ? '▶️ Разморозить' : '❄️ Заморозить';
      b.title = simLockedByHand
        ? 'Раскладка остановлена вручную и не оттаивает при закрытии окон'
        : 'Остановить раскладку насовсем — окна её больше не запустят';
      b.classList.toggle('frozen-by-hand', !!simLockedByHand);
    }
'''
м = re.search(r'\n    function centerGraph\(\)', s)
assert м, 'не найдена centerGraph'
s = s[:м.start()] + '\n' + ПЕРЕКЛЮЧАТЕЛЬ + s[м.start():]

pathlib.Path(ВЫХОД).write_text(s, encoding='utf-8')
print(f'исходник пропатчен → {ВЫХОД}: замок, источник у обеих функций, кнопка, переключатель')
