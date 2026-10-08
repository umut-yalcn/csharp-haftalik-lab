"""Miğferin oturduğu kafatası bölgesinden izlenmeye uygun (dokulu) noktalar seçer.

Kullanım: python3 -I nokta_sec.py <kare.png> x0 y0 x1 y1 [adet] [aralik]
Çıktı: "x,y x,y ..." (izle.py'ye doğrudan verilebilir)
"""
import sys

import numpy as np
from PIL import Image, ImageFilter

yol = sys.argv[1]
x0, y0, x1, y1 = map(int, sys.argv[2:6])
adet = int(sys.argv[6]) if len(sys.argv) > 6 else 12
aralik = int(sys.argv[7]) if len(sys.argv) > 7 else 26
a = np.asarray(Image.open(yol).convert("L").filter(ImageFilter.GaussianBlur(1.0)), dtype=np.float32)
gy, gx = np.gradient(a)
# yapı tensörünün küçük özdeğeri (Shi-Tomasi): köşe benzeri, iki yönde dokulu noktalar
k = 7
def kutu(m):
    c = np.cumsum(np.cumsum(np.pad(m, ((1, 0), (1, 0))), 0), 1)
    return c[k:, k:] - c[:-k, k:] - c[k:, :-k] + c[:-k, :-k]
xx, yy, xy = kutu(gx * gx), kutu(gy * gy), kutu(gx * gy)
tr, det = xx + yy, xx * yy - xy * xy
kucuk = tr / 2 - np.sqrt(np.maximum(tr * tr / 4 - det, 0))
o = k // 2
skor = np.zeros_like(a)
skor[o:o + kucuk.shape[0], o:o + kucuk.shape[1]] = kucuk
h, w = a.shape
x0, x1 = max(x0, 26), min(x1, w - 27)
y0, y1 = max(y0, 26), min(y1, h - 27)
bolge = skor[y0:y1, x0:x1].copy()
secilen = []
while len(secilen) < adet:
    j, i = np.unravel_index(np.argmax(bolge), bolge.shape)
    if bolge[j, i] <= 0:
        break
    secilen.append((x0 + i, y0 + j))
    bolge[max(0, j - aralik):j + aralik, max(0, i - aralik):i + aralik] = 0
print(" ".join(f"{x},{y}" for x, y in secilen))
