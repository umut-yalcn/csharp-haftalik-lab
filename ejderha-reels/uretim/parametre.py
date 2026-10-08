"""Takip sonuçlarından her kare için miğfer / laptop parametrelerini üretir.

Kullanım: python3 -I parametre.py <iz_klasoru> <cikti.json> <kaynak_kareler>
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


def benzerlik(A, B):
    """A -> B en küçük kareler benzerlik dönüşümü (Umeyama). Döner: ölçek, açı, öteleme."""
    ma, mb = A.mean(0), B.mean(0)
    a, b = A - ma, B - mb
    sxx = (a * a).sum()
    c = (a[:, 0] * b[:, 0] + a[:, 1] * b[:, 1]).sum()
    d = (a[:, 0] * b[:, 1] - a[:, 1] * b[:, 0]).sum()
    th = math.atan2(d, c)
    sc = math.hypot(c, d) / max(sxx, 1e-9)
    R = np.array([[math.cos(th), -math.sin(th)], [math.sin(th), math.cos(th)]])
    t = mb - sc * R @ ma
    return sc, th, t


def kafatasi_donusumu(klasor, ad, ref):
    """Kafatası üzerindeki çok sayıda noktadan, aykırıları atarak her kare için ref -> kare dönüşümü.
    Döner: {kare: (ölçek, açı, öteleme, güven)}"""
    d = json.load(open(f"{klasor}/{ad}.json"))
    A = np.array([p[:2] for p in d[str(ref)]], dtype=float)
    out = {}
    for k, pts in d.items():
        B = np.array([p[:2] for p in pts], dtype=float)
        q = np.array([p[2] for p in pts], dtype=float)
        ok = (q > 0.6) & (B[:, 0] > 26) & (B[:, 0] < 1253) & (B[:, 1] > 26) & (B[:, 1] < 693)
        for _ in range(4):
            if ok.sum() < 3:
                break
            sc, th, t = benzerlik(A[ok], B[ok])
            R = np.array([[math.cos(th), -math.sin(th)], [math.sin(th), math.cos(th)]])
            res = np.hypot(*(B - (sc * (R @ A.T).T + t)).T)
            esik = max(2.5, 2.5 * np.median(res[ok]))
            yeni = ok & (res < esik)
            if (yeni == ok).all():
                break
            ok = yeni
        if ok.sum() < 3:
            out[int(k)] = None
            continue
        sc, th, t = benzerlik(A[ok], B[ok])
        R = np.array([[math.cos(th), -math.sin(th)], [math.sin(th), math.cos(th)]])
        res = np.hypot(*(B[ok] - (sc * (R @ A[ok].T).T + t)).T)
        guven = min(1.0, max(0.0, (ok.sum() - 3) / 4)) * min(1.0, max(0.0, (4.0 - np.median(res)) / 2.5))
        out[int(k)] = (sc, th, t, guven)
    return out


def afin_donusumu(klasor, ad, ref):
    """Kafatası noktalarından ref -> kare tam afin dönüşüm (perspektif sıkışma ve eğilme dahil).
    Döner: {kare: (6 parametre [a,b,c,d,tx,ty], güven)}; x' = a*x + b*y + tx, y' = c*x + d*y + ty"""
    d = json.load(open(f"{klasor}/{ad}.json"))
    A = np.array([p[:2] for p in d[str(ref)]], dtype=float)
    X = np.hstack([A, np.ones((len(A), 1))])
    out = {}
    for k, pts in d.items():
        B = np.array([p[:2] for p in pts], dtype=float)
        q = np.array([p[2] for p in pts], dtype=float)
        ok = (q > 0.6) & (B[:, 0] > 26) & (B[:, 0] < 1253) & (B[:, 1] > 26) & (B[:, 1] < 693)
        M = None
        for _ in range(5):
            if ok.sum() < 5:
                M = None
                break
            M, *_ = np.linalg.lstsq(X[ok], B[ok], rcond=None)
            res = np.hypot(*(B - X @ M).T)
            yeni = ok & (res < max(2.0, 2.5 * np.median(res[ok])))
            if (yeni == ok).all():
                break
            ok = yeni
        if M is None or ok.sum() < 5:
            out[int(k)] = None
            continue
        res = np.hypot(*(B[ok] - X[ok] @ M).T)
        guven = min(1.0, (ok.sum() - 4) / 4) * min(1.0, max(0.0, (3.5 - np.median(res)) / 2.0))
        out[int(k)] = ([M[0, 0], M[1, 0], M[0, 1], M[1, 1], M[2, 0], M[2, 1]], guven)
    return out


def isik_olc(kareler, P, k, ref):
    """Miğferin altındaki bölgenin parlaklığı ve kontrastı; referans kareye oranla."""
    from PIL import Image
    def olc(no):
        m = P[no]["migfer"]
        x0, x1 = int(m["x"] - 105 * m["s"]), int(m["x"] + 105 * m["s"])
        y0, y1 = int(m["y"] - 80 * m["s"]), int(m["y"] + 45 * m["s"])
        x0, y0, x1, y1 = max(0, x0), max(0, y0), min(1280, x1), min(720, y1)
        if x1 - x0 < 10 or y1 - y0 < 10:
            return None
        a = np.asarray(Image.open(f"{kareler}/{no:03d}.png").convert("L"), dtype=float)[y0:y1, x0:x1]
        return a.mean(), a.std()
    r, c = olc(ref), olc(k)
    if c is None:
        return 1.0, 0.0
    isik = min(1.25, max(0.75, c[0] / r[0])) ** 0.7
    pus = min(0.35, max(0.0, (1 - c[1] / r[1]) * 0.5))
    return isik, pus


def uygula(T, H0, s0, r0):
    sc, th, t, _ = T
    R = np.array([[math.cos(th), -math.sin(th)], [math.sin(th), math.cos(th)]])
    H = sc * R @ H0 + t
    return H[0], H[1], s0 * sc, r0 + th


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
    # --- kafatası noktalarıyla iyileştirme (miğferin oturduğu bölge doğrudan izlenir) ---
    for ad, ref, bas, son in (("d6", 409, 348, 432), ("d5", 347, 276, 347)):
        T = kafatasi_donusumu(klasor, ad, ref)
        m0 = P[ref]["migfer"]
        H0 = np.array([m0["x"], m0["y"]])
        for k in range(bas, son + 1):
            if T.get(k) is None:
                continue
            x, y, sc, rot = uygula(T[k], H0, m0["s"], m0["rot"])
            w = T[k][3]
            m = P[k]["migfer"]
            for a_, b_ in (("x", x), ("y", y), ("s", sc), ("rot", rot)):
                m[a_] = (1 - w) * m[a_] + w * b_
    # --- afin (yüzeyle birlikte sıkışma/eğilme): referans miğfer + kareye afin dönüşüm ---
    for ad, ref, bas, son in (("d6", 409, 348, 432), ("d5", 347, 276, 347)):
        T = afin_donusumu(klasor, ad, ref)
        ks = [k for k in range(bas, son + 1)]
        dizi = np.array([T[k][0] if T.get(k) else [1, 0, 0, 1, 0, 0] for k in ks], dtype=float)
        w = np.array([T[k][1] if T.get(k) else 0.0 for k in ks], dtype=float)
        dizi = yumusat(dizi, 1.2)
        w = yumusat(w[:, None], 2.0)[:, 0]
        refm = {a_: P[ref]["migfer"][a_] for a_ in ("x", "y", "s", "rot", "basik", "R", "bukum", "kubbe", "yaw")}
        for i, k in enumerate(ks):
            P[k]["migfer"]["afin"] = [round(float(v), 5) for v in dizi[i]]
            P[k]["migfer"]["afinW"] = float(w[i])
            P[k]["migfer"]["refm"] = refm
    # --- zaman yumuşatma + hız (hareket bulanıklığı için) ---
    for bas, son in ((252, 347), (348, 432)):
        ks = list(range(bas, son + 1))
        dizi = np.array([[P[k]["migfer"][a_] for a_ in ("x", "y", "s", "rot")] for k in ks])
        dizi = yumusat(dizi, 1.2)
        for i, k in enumerate(ks):
            m = P[k]["migfer"]
            m["x"], m["y"], m["s"], m["rot"] = dizi[i]
            j0, j1 = max(0, i - 1), min(len(ks) - 1, i + 1)
            m["vx"] = (dizi[j1, 0] - dizi[j0, 0]) / max(1, j1 - j0)
            m["vy"] = (dizi[j1, 1] - dizi[j0, 1]) / max(1, j1 - j0)
    # --- ışık ve sis eşleme (409. kare onaylı görünüm) ---
    kareler = sys.argv[3] if len(sys.argv) > 3 else None
    if kareler:
        for bas, son in ((252, 347), (348, 432)):
            ks = list(range(bas, son + 1))
            dizi = np.array([isik_olc(kareler, P, k, 409) for k in ks])
            dizi = yumusat(dizi, 2.0)
            for i, k in enumerate(ks):
                P[k]["migfer"]["isik"], P[k]["migfer"]["pusEk"] = float(dizi[i, 0]), float(dizi[i, 1])

    def sade(v):
        if isinstance(v, dict):
            return {a: sade(b) for a, b in v.items()}
        if isinstance(v, list):
            return v
        return round(float(v), 3)
    return {str(k): sade(d) for k, d in sorted(P.items())}


if __name__ == "__main__":
    json.dump(ana(sys.argv[1]), open(sys.argv[2], "w"), indent=0)
