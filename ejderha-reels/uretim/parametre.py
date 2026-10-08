"""Takip sonuçlarından her kare için miğfer / laptop parametrelerini üretir.

Kullanım: python3 -I parametre.py <iz_klasoru> <cikti.json>
Çekimler (24 fps, 1 tabanlı kare no):
  1–118   değişiklik yok (kedi; ejderhanın başı görünmüyor)
  119–144 geniş, sisli çayır: şövalyenin elinde küçük laptop
  145–168 yakın plan: konserve yerine büyük laptop
  169–251 değişiklik yok (kedi koşuyor)
  252–347 ejderha uyanır, yandan önden dönüşe geçer: miğfer + küçük laptop
  348–432 ejderha başını şövalyenin yanına indirir: miğfer + küçük laptop
"""
import json
import math
import sys

import numpy as np


def yukle(klasor, ad):
    d = json.load(open(f"{klasor}/{ad}.json"))
    kareler = sorted(int(k) for k in d)
    return kareler, np.array([[p[:2] for p in d[str(k)]] for k in kareler], dtype=float)


def yumusat(dizi, sigma=1.5):
    # zaman ekseninde gauss; kenarlarda yansıtma
    r = int(3 * sigma)
    w = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2)
    w /= w.sum()
    pad = np.concatenate([dizi[r:0:-1], dizi, dizi[-2:-r - 2:-1]])
    out = np.zeros_like(dizi)
    for i in range(len(dizi)):
        out[i] = np.tensordot(w, pad[i:i + 2 * r + 1], axes=(0, 0))
    return out


def aci(v):
    return math.atan2(v[1], v[0])


def ana(klasor):
    P = {}
    # --- laptop: şövalyenin elleri (nokta 0) ve miğferi (nokta 1); ölçek el-miğfer mesafesi / 180 ---
    for ad in ("k2", "k5", "k6"):
        ks, a = yukle(klasor, ad)
        a = yumusat(a, 2.0)
        for i, k in enumerate(ks):
            el, bas = a[i, 0], a[i, 1]
            P.setdefault(k, {})["laptop"] = {"hx": el[0], "hy": el[1], "k": float(np.hypot(*(el - bas)) / 180.0)}
    # --- yakın plan: ortalama kayma (157. kare referans) ---
    ks, a = yukle(klasor, "y3")
    a = yumusat(a, 2.0)
    ref = a[ks.index(157)]
    for i, k in enumerate(ks):
        d = (a[i, :3] - ref[:3]).mean(axis=0)
        P.setdefault(k, {})["yakin"] = {"dx": float(d[0]), "dy": float(d[1])}
    # --- son çekim: göz (0) ve burun deliği (1) ile 409. kareye göre benzerlik dönüşümü ---
    ks, a = yukle(klasor, "c6")
    a = yumusat(a[:, :2], 1.5)
    E0, N0, H0 = np.array([318.0, 325.0]), np.array([460.0, 450.0]), np.array([347.0, 188.0])
    v0 = N0 - E0
    for i, k in enumerate(ks):
        E, N = a[i, 0], a[i, 1]
        v = N - E
        sc = np.hypot(*v) / np.hypot(*v0)
        dt = aci(v) - aci(v0)
        c, s = math.cos(dt), math.sin(dt)
        r = H0 - E0
        H = E + sc * np.array([c * r[0] - s * r[1], s * r[0] + c * r[1]])
        P.setdefault(k, {})["migfer"] = {"x": H[0], "y": H[1], "s": 0.95 * sc, "rot": -0.22 + dt,
                                         "basik": 0.86, "R": 130, "bukum": 0.45, "kubbe": 1, "yaw": 0.0}
    # --- uyanma çekimi: iki göz (0,1) + burun (2); yandan -> önden ---
    ks, a = yukle(klasor, "c5")
    a = yumusat(a, 1.5)
    for i, k in enumerate(ks):
        E1, E2, N = a[i]
        M = (E1 + E2) / 2
        De = np.hypot(*(E2 - E1))
        mn = np.hypot(*(N - M))
        Sh = math.hypot(De, mn)
        f = min(1.0, max(0.0, (De / Sh - 0.40) / 0.32))  # gözler arası / baş boyu: yandan 0, önden 1
        e = (E2 - E1) / max(De, 1e-6)
        uf = np.array([e[1], -e[0]])  # göz çizgisine dik, yukarı
        if uf[1] > 0:
            uf = -uf
        up = (M - N) / max(mn, 1e-6)
        up = 0.4 * up + 0.6 * np.array([0.0, -1.0])  # yandan: kafatası gözün üstünde, biraz geride
        up /= np.hypot(*up)
        u = f * uf + (1 - f) * up
        u /= np.hypot(*u)
        burun = 1.0 if N[0] > M[0] else -1.0
        H = M + u * 0.42 * Sh + np.array([-burun * (1 - f) * 0.45 * Sh, 0.0])
        rot = math.atan2(u[0], -u[1])
        yon = 1.0 if M[0] > N[0] else -1.0
        P.setdefault(k, {})["migfer"] = {"x": H[0], "y": H[1], "s": 0.0068 * Sh, "rot": rot,
                                         "basik": 0.8, "R": 130, "bukum": 0.45, "kubbe": 1,
                                         "yaw": (1 - f) * 1.15 * yon}
    # sayıları sadeleştir
    return {str(k): {t: {a: round(float(b), 3) for a, b in v.items()} for t, v in d.items()} for k, d in sorted(P.items())}


if __name__ == "__main__":
    json.dump(ana(sys.argv[1]), open(sys.argv[2], "w"), indent=0)
