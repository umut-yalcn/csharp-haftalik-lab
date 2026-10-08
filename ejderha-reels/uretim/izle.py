"""Nokta takibi (OpenCV yok; numpy ile yama eşleme).

Kullanım: python3 -I izle.py <kareler_klasoru> <cikti.json> <ref_kare> <bas> <son> x1,y1 x2,y2 ...
Referans karedeki noktalar ileri ve geri doğru kare kare izlenir. Her adımda şablon bir önceki
karedeki yamadan alınır (poz değişimine uyum), referans yamayla karıştırılarak kayma azaltılır.
Alt piksel konum, eşleme yüzeyine parabol oturtularak bulunur.
"""
import json
import sys

import numpy as np
from numpy.lib.stride_tricks import sliding_window_view
from PIL import Image, ImageFilter

YAMA = 23   # yarıçap -> 47x47 yama
ARA = 26    # arama yarıçapı


def gri(klasor, i):
    im = Image.open(f"{klasor}/{i:03d}.png").convert("L").filter(ImageFilter.GaussianBlur(1.0))
    return np.asarray(im, dtype=np.float32)


def yama(a, x, y):
    x, y = int(round(x)), int(round(y))
    h, w = a.shape
    x = min(max(x, YAMA), w - YAMA - 1)
    y = min(max(y, YAMA), h - YAMA - 1)
    return a[y - YAMA:y + YAMA + 1, x - YAMA:x + YAMA + 1]


def eslestir(a, sablon, x, y):
    h, w = a.shape
    x0, y0 = int(round(x)), int(round(y))
    xa, xb = max(YAMA, x0 - ARA), min(w - YAMA - 1, x0 + ARA)
    ya, yb = max(YAMA, y0 - ARA), min(h - YAMA - 1, y0 + ARA)
    bolge = a[ya - YAMA:yb + YAMA + 1, xa - YAMA:xb + YAMA + 1]
    pen = sliding_window_view(bolge, sablon.shape)
    s = sablon - sablon.mean()
    p = pen - pen.mean(axis=(2, 3), keepdims=True)
    ncc = (p * s).sum(axis=(2, 3)) / (np.sqrt((p * p).sum(axis=(2, 3)) * (s * s).sum()) + 1e-6)
    j, i = np.unravel_index(np.argmax(ncc), ncc.shape)

    def alt(v, k, n):
        if 0 < k < n - 1:
            d = v[k - 1] - 2 * v[k] + v[k + 1]
            if d < 0:
                return k + 0.5 * (v[k - 1] - v[k + 1]) / d
        return float(k)

    ii = alt(ncc[j, :], i, ncc.shape[1])
    jj = alt(ncc[:, i], j, ncc.shape[0])
    return xa + ii, ya + jj, float(ncc[j, i])


def izle(klasor, ref, bas, son, noktalar):
    sonuc = {ref: [list(p) + [1.0] for p in noktalar]}
    ra = gri(klasor, ref)
    ref_sablon = [yama(ra, x, y) for x, y in noktalar]
    for yon, aralik in ((1, range(ref + 1, son + 1)), (-1, range(ref - 1, bas - 1, -1))):
        onceki = ra
        konum = [tuple(p) for p in noktalar]
        for i in aralik:
            a = gri(klasor, i)
            yeni = []
            for k, (x, y) in enumerate(konum):
                sablon = 0.7 * yama(onceki, x, y) + 0.3 * ref_sablon[k]
                nx, ny, q = eslestir(a, sablon, x, y)
                yeni.append((nx, ny, q))
            sonuc[i] = [list(p) for p in yeni]
            konum = [(p[0], p[1]) for p in yeni]
            onceki = a
    return {str(k): v for k, v in sorted(sonuc.items())}


if __name__ == "__main__":
    klasor, cikti, ref, bas, son = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
    noktalar = [tuple(float(v) for v in p.split(",")) for p in sys.argv[6:]]
    json.dump(izle(klasor, ref, bas, son, noktalar), open(cikti, "w"))
