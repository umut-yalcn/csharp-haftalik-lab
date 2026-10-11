"""Seslendirme kliplerinde vurgunun hangi kelimeye düştüğünü ölçer (kulak yerine sayısal analiz).
Yöntem: enerji zarfından hece çekirdekleri bulunur; Türkçede hece sayısı = ünlü sayısı olduğundan
çekirdekler metindeki kelimelere sırayla dağıtılır. Her hece için ses perdesi (F0), yükseklik (dB) ve
süre ölçülür; z-puanlarının toplamı 'vurgu puanı'dır. Kelime puanı = hecelerinin en yükseği.
Kullanım: python3 -I vurgu_analiz.py
"""
import re, subprocess, sys
import numpy as np

SR = 16000
UNLU = set("aeıioöuüâîûAEIİOÖUÜÂÎÛ")
METIN = {
 "S1": "Bir fırsatı kaçırmış olabilir misin", "S2": "Bir staj Bir burs Bir eğitim",
 "S3": "Belki de o tek başvuru", "S4": "Ve bugün iki bin beş yüz kişi Kariyer Pusulan'da",
 "S5": "İki bin beş yüz farklı hedef farklı hikâye farklı gelecek",
 "S6": "Ama mesele iki bin beş yüz değil Sıradaki fırsatı bulmak", "S7": "Keşfet Kaydet Başvur",
 "S8": "İyi ki varsınız Daha yeni başlıyoruz", "S9": "İki bin beş yüz kişi pusulasını buldu Sıradaki sen misin",
}
HEDEF = {"S1": ["kaçırmış"], "S2": ["staj", "burs", "eğitim"], "S3": ["tek"], "S4": ["iki", "bin", "beş", "yüz"],
         "S5": ["hedef", "hikâye", "gelecek"], "S6": ["değil", "Sıradaki"], "S7": [], "S8": ["yeni"], "S9": ["sen"]}

def oku(p):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)

def f0(w):
    w = w - w.mean()
    if np.sqrt((w * w).mean()) < 0.01: return np.nan
    c = np.correlate(w, w, "full")[len(w) - 1:]
    lo, hi = SR // 350, SR // 65
    k = lo + int(np.argmax(c[lo:hi]))
    return SR / k if c[k] > 0.35 * c[0] else np.nan

def analiz(ad, metin):
    x = oku(f"klipler/{ad}.mp3")
    hop, win = 80, 320
    # ünlü bandı (300–2500 Hz) enerjisi: hece çekirdekleri burada belirgin
    n = (len(x) - win) // hop
    pen = np.hanning(win); fr = np.fft.rfftfreq(win, 1 / SR); band = (fr > 300) & (fr < 2500)
    e = np.array([np.sqrt((np.abs(np.fft.rfft(x[i*hop:i*hop+win] * pen))[band] ** 2).mean()) for i in range(n)])
    db = 20 * np.log10(e + 1e-6)
    s = np.convolve(db, np.ones(3) / 3, "same")
    esik = s.max() - 32
    tepe = []
    for i in range(3, n - 3):
        if s[i] > esik and s[i] == s[max(0, i-6):i+7].max():
            sol = s[max(0, i-12):i].min(); sag = s[i+1:i+13].min()
            if s[i] - max(sol, sag) > 2.0:  # belirginlik: iki yanında çukur olan tepe
                tepe.append(i)
    kel = metin.split()
    hece = [sum(ch in UNLU for ch in w) or 1 for w in kel]
    # tepe sayısını hece sayısına yaklaştır: fazla ise en zayıfları at, az ise uyar
    while len(tepe) > sum(hece):
        tepe.remove(min(tepe, key=lambda i: s[i]))
    ozel = []
    for i in tepe:
        a, b = i, i
        while a > 0 and s[a] > s[i] - 6 and i - a < 25: a -= 1
        while b < n - 1 and s[b] > s[i] - 6 and b - i < 25: b += 1
        seg = x[a*hop:b*hop+win]
        ozel.append((s[i], np.nanmedian([f0(seg[j:j+640]) for j in range(0, max(1, len(seg)-640), 80)] or [np.nan]), (b - a) * hop / SR, i * hop / SR))
    O = np.array([[o[0], o[1], o[2]] for o in ozel], float)
    O[:, 1] = np.where(np.isnan(O[:, 1]), np.nanmean(O[:, 1]), O[:, 1])
    z = (O - O.mean(0)) / (O.std(0) + 1e-6)
    puan = z[:, 0] + z[:, 1] + 0.7 * z[:, 2]
    sonuc, j = [], 0
    for w, h in zip(kel, hece):
        p = puan[j:j+h]; t = [o[3] for o in ozel[j:j+h]]
        sonuc.append((w, float(p.max()) if len(p) else float("nan"), t[0] if t else None)); j += h
    return sonuc, len(tepe), sum(hece)

for ad, m in METIN.items():
    s, bulunan, beklenen = analiz(ad, m)
    vurgulu = [w for w, p, _ in s if p > 1.2]
    hedef = HEDEF[ad]
    fazla = [w for w in vurgulu if w not in hedef]
    eksik = [w for w in hedef if w not in vurgulu]
    print(f"\n{ad}  (hece {bulunan}/{beklenen})")
    print("   " + "  ".join(f"{w}:{p:+.1f}" for w, p, _ in s))
    print(f"   vurgulu okunan: {', '.join(vurgulu) or '-'}   | olması gereken: {', '.join(hedef) or '-'}")
    if fazla: print(f"   GEREKSİZ vurgu: {', '.join(fazla)}")
    if eksik: print(f"   EKSİK vurgu: {', '.join(eksik)}")
