#!/bin/bash
# Сервер для приёмки. Модули по file:// не грузятся — без него никак.
DIR="${1:-split}"
PORT="${2:-8711}"
pkill -f "http.server $PORT" 2>/dev/null
cd "$DIR" && setsid python3 -m http.server "$PORT" >/tmp/srv.log 2>&1 </dev/null &
sleep 2
curl -s -o /dev/null -w "сервер на $PORT: %{http_code}\n" "http://127.0.0.1:$PORT/index.html"
