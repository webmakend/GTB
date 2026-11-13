"""Bouwt index.html uit src/template.html + data/game.json.
Gebruik: python3 tools/build.py"""
import pathlib
root=pathlib.Path(__file__).resolve().parent.parent
t=(root/'src'/'template.html').read_text(encoding='utf-8')
w=(root/'data'/'game.json').read_text(encoding='utf-8')
(root/'index.html').write_text(t.replace('__WORLD__',w),encoding='utf-8')
print('index.html gebouwd')
