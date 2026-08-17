#!/usr/bin/env python3
"""Многопоточный сервер для приборов.

`python3 -m http.server` однопоточен: он отдаёт файлы по одному, а страница
тянет 120 с лишним запросов — сто модулей, десять глав стилей, шесть наборов
базы и d3. С ростом дерева ожидание «сеть утихла» перестало наступать вовсе:
приборы падали по времени, хотя сервер отвечал 200 на каждый запрос.

Здесь тот же обработчик, но с потоком на запрос.
"""
import sys, os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class Тихий(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass


if __name__ == '__main__':
    порт = int(sys.argv[1]) if len(sys.argv) > 1 else 8711
    корень = sys.argv[2] if len(sys.argv) > 2 else '.'
    # Путь разворачиваем ДО смены папки: относительный путь, посчитанный
    # после chdir, указывает уже не туда, и сервер падал с «нет такого
    # файла», отвечая при этом «000» на любой запрос.
    корень = os.path.abspath(корень)
    if not os.path.isdir(корень):
        print('нет такой папки:', корень, file=sys.stderr)
        sys.exit(1)
    os.chdir(корень)
    ThreadingHTTPServer(('127.0.0.1', порт), Тихий).serve_forever()
