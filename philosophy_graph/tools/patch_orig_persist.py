#!/usr/bin/env python3
"""Тот же ход сохранности — в ИСХОДНЫЙ одностраничный файл.

Зачем: вся приёмка построена на сверке «сборка против исходника». Если
возможность появится только в сборке, сверять станет нечего именно там,
где сделана правка. Поэтому обе стороны получают одно и то же поведение,
и расхождение снова означает ошибку переноса, а не разницу замысла.

Разница между сторонами ровно одна и она неустранима: в сборке база
читается из data/*.json, поэтому «Сохранить в папку» кладёт файлы туда же,
откуда читали. В исходнике база лежит внутри файла, и записывать в него
нечего — папка выбирается пользователем, а файлы годятся для сборки.
"""
import re, sys, pathlib

ВХОД = sys.argv[1] if len(sys.argv) > 1 else '/mnt/user-data/uploads/philosophy_graph.html'
ВЫХОД = sys.argv[2] if len(sys.argv) > 2 else '/home/claude/build/orig_v2.html'

s = pathlib.Path(ВХОД).read_text(encoding='utf-8')

if 'saveDataBtn' in s:
    pathlib.Path(ВЫХОД).write_text(s, encoding='utf-8')
    print('исходник: уже пропатчен')
    sys.exit(0)

# ── 1. кнопки в панели контроля ─────────────────────────────────────
КНОПКИ = (
    '      <button id="saveDataBtn" onclick="downloadData()" '
    'title="Отдать шесть файлов базы; положить их в data/ вручную">💾 Скачать базу</button>\n'
    '      <button id="saveFolderBtn" onclick="saveToFolder()" '
    'title="Записать базу в выбранную папку (Chrome)">📂 Сохранить в папку</button>\n'
)
до = s
s = s.replace('    <div id="exportButtons">', КНОПКИ + '    <div id="exportButtons">', 1)
assert s != до, 'не найдено место для кнопок'

# ── 2. сам код сохранности ──────────────────────────────────────────
КОД = '''
    // ── СОХРАННОСТЬ ПРАВОК ──────────────────────────────────────────
    // База правится в памяти, а деться ей некуда: страница читает данные,
    // но записывать их некому. Отсюда два хода с общим сериализатором —
    // выгрузка шести файлов и запись в выбранную папку.
    // Сохраняются ТОЛЬКО шесть исходных наборов: узлы, связи и девять
    // производных указателей пересобираются из базы, и хранить их значило
    // бы завести второй источник правды.
    const DATA_SETS = ['traditions', 'philosophers', 'rubrics',
                         'relationTypes', 'concepts', 'relations'];
    let hasUnsavedEdits = false;

    function markDirty() { hasUnsavedEdits = true; }
    function hasUnsaved() { return hasUnsavedEdits; }

    function collectData() {
      return { traditions, philosophers, rubrics, relationTypes, concepts, relations };
    }

    function deliverFile(имя, текст) {
      const blob = new Blob([текст], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = имя;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function downloadData() {
      const база = collectData();
      for (const имя of DATA_SETS) deliverFile(имя + '.json', JSON.stringify(база[имя], null, 1));
      hasUnsavedEdits = false;
      return DATA_SETS.length;
    }

    let dataFolder = null;

    async function saveToFolder() {
      if (!window.showDirectoryPicker) {
        alert('Этот браузер не умеет писать в папку. Воспользуйтесь «Скачать базу».');
        return false;
      }
      try {
        if (!dataFolder) dataFolder = await window.showDirectoryPicker({ mode: 'readwrite' });
        const база = collectData();
        for (const имя of DATA_SETS) {
          const ф = await dataFolder.getFileHandle(имя + '.json', { create: true });
          const w = await ф.createWritable();
          await w.write(JSON.stringify(база[имя], null, 1));
          await w.close();
        }
        hasUnsavedEdits = false;
        return true;
      } catch (e) {
        if (e && e.name === 'AbortError') return false;
        console.error('сохранение в папку не удалось:', e);
        alert('Сохранить не удалось: ' + (e && e.message ? e.message : e));
        return false;
      }
    }

    window.addEventListener('beforeunload', ev => {
      if (!hasUnsavedEdits) return;
      ev.preventDefault();
      ev.returnValue = '';
    });

'''

# ставим сразу перед afterDataChange, чтобы объявления были рядом с точкой правки
м = re.search(r'\n    function afterDataChange\(what\) \{', s)
assert м, 'не найдена afterDataChange'
s = s[:м.start()] + '\n' + КОД + s[м.start():]

# ── 3. пометка в единой точке изменения данных ──────────────────────
до = s
s = s.replace(
    '''    function afterDataChange(what) {
      what = what || { nodes: true, links: true };''',
    '''    function afterDataChange(what) {
      what = what || { nodes: true, links: true };

      // Единственная точка, через которую проходит всякое изменение базы:
      // отсюда и берётся признак «есть несохранённое».
      markDirty();''', 1)
assert s != до, 'не найдено тело afterDataChange'

pathlib.Path(ВЫХОД).write_text(s, encoding='utf-8')
print(f'исходник пропатчен → {ВЫХОД}: две кнопки, сериализатор, пометка в afterDataChange')
