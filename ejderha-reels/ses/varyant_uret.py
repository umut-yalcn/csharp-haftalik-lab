"""Chris kaydından (E1-chris-simdiki.mp3) daha kalın ve duraksamalı 10 sn varyantlar üretir.
Yöntem: kayıt sessizliklerden ifadelere bölünür; her ifade rubberband ile kalınlaştırılır ve yavaşlatılır;
ifadeler arasına orijinal oda sesiyle uzatılmış duraklamalar konur; toplam tam 10,0 sn.
Kullanım: python3 -I varyant_uret.py <kaynak.mp3> <cikti_klasoru>
"""
import os, subprocess, sys, tempfile

KAYNAK, CIKTI = sys.argv[1], sys.argv[2]
SURE = 10.0
# ifadeler (silencedetect -35 dB ile ölçüldü), saniye
IFADE = [(0.00, 0.52), (1.04, 2.17), (2.68, 3.33), (3.82, 5.48), (5.95, 7.22)]
ODA = (0.62, 0.98)  # oda sesi (sessizlik) örneği
# ad, yarım ton, formant, tempo, duraklama ağırlıkları (4 ara), ek filtre
VARYANT = [
    ("1-hafif-kalin",          -1.5, "shifted",   0.95, [1, 1, 1, 1],         "bass=g=2:f=120"),
    ("2-orta-kalin",           -2.5, "shifted",   0.92, [1, 1, 1, 1],         "bass=g=3:f=120"),
    ("3-derin-agir",           -3.5, "shifted",   0.88, [1, 1.1, 1, 1.2],     "bass=g=3:f=110,treble=g=-2"),
    ("4-kalin-dogal-tini",     -3.0, "preserved", 0.92, [0.8, 1.3, 0.8, 1.4], "bass=g=4:f=110"),
    ("5-dramatik-duraksamali", -2.5, "shifted",   0.90, [0.7, 1.4, 0.9, 1.6], "bass=g=3:f=120,aecho=0.8:0.5:38:0.12"),
]

def ff(*a):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *a], check=True)

def sure(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]))

os.makedirs(CIKTI, exist_ok=True)
with tempfile.TemporaryDirectory() as tmp:
    oda = f"{tmp}/oda.wav"
    ff("-ss", str(ODA[0]), "-to", str(ODA[1]), "-i", KAYNAK, "-ar", "44100", "-ac", "1", oda)
    for ad, yt, formant, tempo, agirlik, ek in VARYANT:
        oran = 2 ** (yt / 12)
        parcalar = []
        for i, (a, b) in enumerate(IFADE):
            p = f"{tmp}/{ad}-{i}.wav"
            ff("-ss", str(a), "-to", str(b), "-i", KAYNAK, "-af",
               f"rubberband=pitch={oran:.5f}:tempo={tempo}:formant={formant}:pitchq=quality,"
               f"afade=t=in:d=0.015,areverse,afade=t=in:d=0.03,areverse", "-ar", "44100", "-ac", "1", p)
            parcalar.append(p)
        konusma = sum(sure(p) for p in parcalar)
        bas, son = 0.25, 0.35
        kalan = SURE - konusma - bas - son
        aralar = [kalan * w / sum(agirlik) for w in agirlik]
        sira = []
        def sessizlik(d, n):
            q = f"{tmp}/{ad}-s{n}.wav"
            ff("-stream_loop", "-1", "-i", oda, "-t", f"{d:.3f}", "-af", "volume=0.8", q)
            return q
        sira.append(sessizlik(bas, "b"))
        for i, p in enumerate(parcalar):
            sira.append(p)
            if i < len(aralar):
                sira.append(sessizlik(aralar[i], i))
        sira.append(sessizlik(son, "s"))
        liste = f"{tmp}/{ad}.txt"
        open(liste, "w").write("".join(f"file '{x}'\n" for x in sira))
        cikti = f"{CIKTI}/chris-{ad}.mp3"
        ff("-f", "concat", "-safe", "0", "-i", liste, "-af", f"{ek},loudnorm=I=-16:TP=-1.5:LRA=11",
           "-t", f"{SURE}", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "192k", cikti)
        print(f"{ad}: {yt:+} yarım ton, tempo {tempo}, duraklamalar {', '.join(f'{d:.2f}' for d in aralar)} sn -> {sure(cikti):.2f} sn")
