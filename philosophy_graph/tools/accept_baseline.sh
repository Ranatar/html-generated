#!/bin/bash
# Приёмка ПО ЭТАЛОНАМ — без второй страницы.
#
# Отличие от accept_all.sh: там сравниваются две живые страницы, здесь —
# сборка против замороженных снимков. Это дешевле вдвое (один прогон вместо
# двух) и не требует одностраничного исходника.
#
# ВАЖНО, ЧТО ЭТО ЛОВИТ И ЧЕГО НЕТ. Эталон отвечает «стало ли иначе, чем
# было», а не «правильно ли». Приборы, завязанные на раскладку графа
# (graph_probe, probe4, probe5), эталонами НЕ проверяются: координаты у двух
# прогонов разные. Они остаются на сравнении с исходником — см. accept_all.sh.
set -e
TREE_DIR="${1:-split}"
SNAPS="${2:-/tmp/по-эталонам}"
mkdir -p "$SNAPS"
bash tools/serve.sh "$TREE_DIR"

echo "== полный обход (три части)"
for PART in 1 2 3; do
  node tools/sweep_all.mjs run index.html "$SNAPS/m$PART.json" $PART
done
node tools/sweep_all.mjs merge "$SNAPS/свод.json" - \
  "$SNAPS/m1.json" "$SNAPS/m2.json" "$SNAPS/m3.json"
node tools/baseline.mjs проверить sweep_all "$SNAPS/свод.json"

for PROBE in compare probe6 probe7 probe8 css_probe; do
  echo "== $PROBE"
  node "tools/$PROBE.mjs" run index.html "$SNAPS/$PROBE.json"
  node tools/baseline.mjs проверить "$PROBE" "$SNAPS/$PROBE.json"
done

echo "== утверждения о должном (второй слой)"
node tools/assert_probe.mjs index.html

echo "== свежесть карт"
node tools/maps_fresh.mjs

echo "== проверка модулей и долг"
node tools/check_modules.mjs
python3 tools/bridge_debt.py "$TREE_DIR"
echo
echo "Приборы графа эталонами не проверяются — для них нужен accept_all.sh."
