"""Seçilen okumalarda kalan vurgu hatalarını kelime düzeyinde ses işlemeyle düzeltir (kredi harcamaz).
Vurgulanacak kelime: perde +1,2 yarım ton, %7 uzama, +3 dB. Gereksiz vurgulu kelime: perde -0,6 yarım ton, -3 dB.
Kelime sınırları vurgu_analiz.py'nin hece ölçümünden gelir.
Kullanım: python3 -I vurgu_duzelt.py   ->  klipler-final/S1.mp3 ... S9.mp3
"""
import os, subprocess, sys, tempfile
import numpy as np
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "vurgu_analiz.py")).read().split("if __name__")[0])

# satır: (kaynak dosya, vurgulanacak, yumuşatılacak)
PLAN = {
 "S1": ("klipler-v2/S1a.mp3", ["kaçırmış"], ["fırsatı", "olabilir"]),
 "S2": ("klipler-v2/S2b.mp3", ["burs", "eğitim"], []),
 "S3": ("klipler-v2/S3a.mp3", [], ["de"]),
 "S4": ("klipler-v2/S4a.mp3", ["iki", "bin"], ["Pusulan'da"]),
 "S5": ("klipler-v2/S5b.mp3", ["hedef", "hikâye"], ["İki", "beş", "yüz"]),
 "S6": ("klipler-v2/S6b.mp3", ["değil"], ["bin"]),
 "S7": ("klipler-v2/S7a.mp3", [], ["Kaydet", "Başvur"]),
 "S8": ("klipler/S8.mp3", [], ["ki"]),
 "S9": ("klipler/S9.mp3", [], ["bin", "beş", "yüz"]),
}

def ff(*a):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *a], check=True)

def sure(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]))

os.makedirs("klipler-final", exist_ok=True)
for ad, (kaynak, artir, azalt) in PLAN.items():
    s, _, _ = analiz(ad, METIN[ad], kaynak)
    T = sure(kaynak)
    # kelime sınırları: komşu kelimelerin hece bölgeleri arasındaki orta nokta
    sinir = [0.0]
    for (w1, _, a1), (w2, _, a2) in zip(s, s[1:]):
        sinir.append((a1[1] + a2[0]) / 2 if a1 and a2 else sinir[-1])
    sinir.append(T)
    with tempfile.TemporaryDirectory() as tmp:
        parca = []
        for i, (w, _, _) in enumerate(s):
            a, b = sinir[i], sinir[i + 1]
            if b - a < 0.02: continue
            if w in artir:
                af = "rubberband=pitch=1.0718:tempo=0.935:formant=preserved:pitchq=quality,volume=3dB"
            elif w in azalt:
                af = "rubberband=pitch=0.9659:formant=preserved:pitchq=quality,volume=-3dB"
            else:
                af = "anull"
            p = f"{tmp}/{i:02d}.wav"
            ff("-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", kaynak, "-af",
               f"{af},afade=t=in:d=0.006,areverse,afade=t=in:d=0.006,areverse", "-ar", "44100", "-ac", "1", p)
            parca.append(p)
        open(f"{tmp}/l.txt", "w").write("".join(f"file '{p}'\n" for p in parca))
        ff("-f", "concat", "-safe", "0", "-i", f"{tmp}/l.txt", "-c:a", "libmp3lame", "-b:a", "192k", f"klipler-final/{ad}.mp3")
    print(f"{ad}: {kaynak} | +{','.join(artir) or '-'} | -{','.join(azalt) or '-'}")
