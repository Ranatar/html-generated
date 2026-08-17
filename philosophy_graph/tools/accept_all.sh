#!/bin/bash
# Полная приёмка: восемь приборов, каждый по двум сторонам.
#
# ВАЖНО: каждый прогон — ОТДЕЛЬНЫЙ ЗАПУСК ПРОЦЕССА. Четырёх гигабайтов не
# хватает на 400 снимков в одном сеансе, вкладка падает на 29-м виде. По той
# же причине обход дробится на три части и сводится командой merge.
set -e
TREE_DIR="${1:-split}"
SNAPS="${2:-/tmp/приёмка}"
mkdir -p "$SNAPS"

python3 tools/make_ref.py philosophy_graph_v3.html "$TREE_DIR"
bash tools/serve.sh "$TREE_DIR"

echo "== полный обход (три части на сторону)"
for PART in 1 2 3; do
  node tools/sweep_all.mjs run _ref-orig.html "$SNAPS/o$PART.json" $PART
  node tools/sweep_all.mjs run index.html     "$SNAPS/m$PART.json" $PART
done
node tools/sweep_all.mjs merge "$SNAPS/св_и.json" - "$SNAPS/o1.json" "$SNAPS/o2.json" "$SNAPS/o3.json"
node tools/sweep_all.mjs merge "$SNAPS/св_м.json" - "$SNAPS/m1.json" "$SNAPS/m2.json" "$SNAPS/m3.json"
node tools/sweep_all.mjs diff "$SNAPS/св_и.json" "$SNAPS/св_м.json"

for PROBE in compare graph_probe probe4 probe5 probe6 probe7 probe8 css_probe; do
  echo "== $PROBE"
  node "tools/$PROBE.mjs" run _ref-orig.html "$SNAPS/${PROBE}_и.json"
  node "tools/$PROBE.mjs" run index.html     "$SNAPS/${PROBE}_м.json"
  node "tools/$PROBE.mjs" diff "$SNAPS/${PROBE}_и.json" "$SNAPS/${PROBE}_м.json"
done

echo "== утверждения о должном (второй слой)"
node tools/assert_probe.mjs index.html

echo "== свежесть карт"
node tools/maps_fresh.mjs

echo "== проверка модулей и долг"
node tools/check_modules.mjs
python3 tools/bridge_debt.py "$TREE_DIR"
rm -f "$TREE_DIR/_ref-orig.html"
