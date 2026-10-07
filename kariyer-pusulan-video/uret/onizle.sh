#!/bin/sh
# Bir kesitten seçili kareleri çizer ve yan yana bir önizleme görseli yapar.
# Kullanım: sh onizle.sh <kesit> <kare,kare,...> <çıktı.png>
set -e
cd "$(dirname "$0")"
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node ciz.js "$1" --kareler "$2"
python3 -I -c "
import sys
from PIL import Image
k, kareler, cikti = sys.argv[1], [int(x) for x in sys.argv[2].split(',')], sys.argv[3]
ims = [Image.open(f'../cikti/kesit-{k}-kareler/{n:03d}.png').convert('RGB').resize((360, 640)) for n in kareler]
s = Image.new('RGB', (370 * len(ims) - 10, 640), 'white')
for i, im in enumerate(ims): s.paste(im, (i * 370, 0))
s.save(cikti)
" "$1" "$2" "$3"
