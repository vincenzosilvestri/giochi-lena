"""Genera i file audio mancanti in voice/ dal catalogo (voce neurale Microsoft via edge-tts).
Uso: python tools/gen_voice.py [--force]   Richiede: pip install edge-tts"""
import asyncio, json, os, sys
import edge_tts

VOICES = {'it': ('it-IT-IsabellaNeural', '-6%', '+6Hz'), 'fr': ('fr-FR-DeniseNeural', '-6%', '+4Hz')}
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'voice')

async def one(sem, item, force):
    path = os.path.join(ROOT, item['h'] + '.mp3')
    if os.path.exists(path) and not force:
        return 0
    async with sem:
        for attempt in range(3):
            try:
                voice, rate, pitch = VOICES[item.get('lang', 'it')]
                await edge_tts.Communicate(item['text'], voice, rate=rate, pitch=pitch).save(path)
                return 1
            except Exception as e:
                if attempt == 2:
                    print('ERRORE', item['text'], e)
                await asyncio.sleep(2)
    return 0

async def main():
    force = '--force' in sys.argv
    catalog = json.load(open(os.path.join(ROOT, 'catalog.json'), encoding='utf-8'))
    keep = {c['h'] + '.mp3' for c in catalog}
    for f in os.listdir(ROOT):
        if f.endswith('.mp3') and f not in keep:
            os.remove(os.path.join(ROOT, f))
    sem = asyncio.Semaphore(6)
    made = sum(await asyncio.gather(*(one(sem, c, force) for c in catalog)))
    print(f'generati {made}, totale {len(catalog)}')

asyncio.run(main())
