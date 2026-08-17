#!/bin/bash
# Сервер для приёмки. Модули по file:// не грузятся — без него никак.
#
# МНОГОПОТОЧНЫЙ. `python3 -m http.server` отдаёт файлы по одному, а страница
# тянет больше 120 запросов; с ростом дерева ожидание «сеть утихла» перестало
# наступать, и приборы падали по времени при сервере, отвечающем 200 на всё.
DIR="${1:-split}"
PORT="${2:-8711}"
pkill -f "serve.py $PORT" 2>/dev/null
pkill -f "http.server $PORT" 2>/dev/null
sleep 1
ЗДЕСЬ="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
setsid python3 "$ЗДЕСЬ/serve.py" "$PORT" "$DIR" >/tmp/srv.log 2>&1 </dev/null &
sleep 2
curl -s -o /dev/null -w "сервер на $PORT: %{http_code}\n" "http://127.0.0.1:$PORT/index.html"
