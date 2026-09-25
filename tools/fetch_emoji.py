"""Scarica le emoji Fluent 3D (Microsoft, licenza MIT) per le emoji usate nell'app e le salva ridotte in emoji/.
Uso: node tools/scan-emoji.mjs && python tools/fetch_emoji.py"""
import json, os, io, urllib.request, urllib.parse, concurrent.futures as cf
from PIL import Image
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SIZE = 160
fmap = {k.replace('️', ''): v for k, v in json.load(open(os.path.join(ROOT, 'tools', 'fluent_map.json'), encoding='utf-8')).items()}
need = json.load(open(os.path.join(ROOT, 'emoji', 'needed.json'), encoding='utf-8'))
missing, have = [], []
def one(item):
    e, f = item['e'], item['file']
    out = os.path.join(ROOT, 'emoji', f + '.png')
    if os.path.exists(out) or os.path.exists(os.path.join(ROOT, 'emoji', f + '.svg')):
        return f, True
    p = fmap.get(e.replace('️', ''))
    if not p:
        return f, False
    url = 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/' + urllib.parse.quote(p)
    data = urllib.request.urlopen(url, timeout=30).read()
    im = Image.open(io.BytesIO(data)).convert('RGBA')
    im.thumbnail((SIZE, SIZE), Image.LANCZOS)
    im.save(out, optimize=True)
    return f, True
with cf.ThreadPoolExecutor(16) as ex:
    for (f, ok), item in zip(ex.map(one, need), need):
        (have if ok else missing).append(item)
json.dump(sorted(f for f in os.listdir(os.path.join(ROOT, 'emoji')) if f.endswith(('.png', '.svg'))), open(os.path.join(ROOT, 'emoji', 'index.json'), 'w'))
print(f'{len(have)} emoji pronte, mancanti:', [m['file'] for m in missing])
