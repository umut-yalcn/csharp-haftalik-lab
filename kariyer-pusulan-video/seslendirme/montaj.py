"""Seslendirme kliplerini 2.500 kişi videosuna yerleştirir.
Her klip konuşma sonundan 0,25 sn sonra yumuşakça kesilir ve BASLA'daki saniyede başlar.
Kullanım: python3 -I montaj.py
"""
import re, subprocess, sys

KLASOR = sys.argv[1] if len(sys.argv) > 1 else "klipler"
CIKTI = sys.argv[2] if len(sys.argv) > 2 else "../cikti/kariyer-pusulan-2500-seslendirmeli.mp4"

def konusma_sonu(p):
    o = subprocess.run(["ffmpeg", "-i", p, "-af", "silencedetect=n=-40dB:d=0.15", "-f", "null", "-"], capture_output=True, text=True).stderr
    bas = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", o)]
    son = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", o)]
    T = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]))
    # sondaki sessizlik dosyanın sonuna kadar sürüyorsa (bitişi yoksa ya da sona çok yakınsa) konuşma orada biter
    if bas and (len(son) < len(bas) or son[-1] > T - 0.15):
        return bas[-1]
    return T

VIDEO = "../cikti/kariyer-pusulan-2500-insansiz.mp4"
# satır: (başlangıç sn, konuşma sonu sn) — konuşma sonu her klipten otomatik ölçülür
BASLA = {"S1": (0.30, 0), "S2": (4.00, 0), "S3": (6.55, 0), "S4": (9.10, 0), "S5": (12.70, 0),
         "S6": (17.05, 0), "S7": (22.10, 0), "S8": (25.80, 0), "S9": (29.90, 2.95)}
# ikinci değer 0 değilse elle verilmiş konuşma sonudur (S9: 3,5 sn sonrasında nefes/gürültü var, kesilir)
SURE = 33.333

girdiler, filtre, etiket = [], [], []
for i, (ad, (t0, _)) in enumerate(BASLA.items()):
    son = _ or konusma_sonu(f"{KLASOR}/{ad}.mp3")
    print(f"{ad}: {t0:.2f} sn'de başlar, konuşma {son:.2f} sn -> {t0 + son:.2f} sn'de biter")
    girdiler += ["-i", f"{KLASOR}/{ad}.mp3"]
    k = son + 0.25
    filtre.append(f"[{i}:a]atrim=0:{k:.3f},afade=t=out:st={k-0.2:.3f}:d=0.2,aresample=48000,adelay={int(t0*1000)}:all=1[a{i}]")
    etiket.append(f"[a{i}]")
filtre.append(f"{''.join(etiket)}amix=inputs={len(etiket)}:normalize=0,apad,atrim=0:{SURE},"
              f"highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150,loudnorm=I=-15:TP=-1.5:LRA=9[ses]")
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *girdiler, "-filter_complex", ";".join(filtre), "-map", "[ses]",
                "-ar", "48000", "-c:a", "pcm_s16le", "seslendirme-tam.wav"], check=True)
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", VIDEO, "-i", "seslendirme-tam.wav", "-map", "0:v", "-map", "1:a",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
                CIKTI], check=True)
print("tamam")
