"""Seslendirme kliplerini 2.500 kişi videosuna yerleştirir.
Her klip konuşma sonundan 0,25 sn sonra yumuşakça kesilir ve BASLA'daki saniyede başlar.
Kullanım: python3 -I montaj.py
"""
import subprocess

VIDEO = "../cikti/kariyer-pusulan-2500-insansiz.mp4"
# satır: (başlangıç sn, konuşma sonu sn — ölçüldü)
BASLA = {"S1": (0.30, 2.46), "S2": (4.00, 2.60), "S3": (6.75, 2.29), "S4": (9.05, 2.84), "S5": (12.10, 4.43),
         "S6": (16.60, 3.70), "S7": (22.10, 2.42), "S8": (25.80, 2.13), "S9": (29.90, 2.95)}
SURE = 33.333

girdiler, filtre, etiket = [], [], []
for i, (ad, (t0, son)) in enumerate(BASLA.items()):
    girdiler += ["-i", f"klipler/{ad}.mp3"]
    k = son + 0.25
    filtre.append(f"[{i}:a]atrim=0:{k:.3f},afade=t=out:st={k-0.2:.3f}:d=0.2,aresample=48000,adelay={int(t0*1000)}:all=1[a{i}]")
    etiket.append(f"[a{i}]")
filtre.append(f"{''.join(etiket)}amix=inputs={len(etiket)}:normalize=0,apad,atrim=0:{SURE},"
              f"highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150,loudnorm=I=-15:TP=-1.5:LRA=9[ses]")
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *girdiler, "-filter_complex", ";".join(filtre), "-map", "[ses]",
                "-ar", "48000", "-c:a", "pcm_s16le", "seslendirme-tam.wav"], check=True)
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", VIDEO, "-i", "seslendirme-tam.wav", "-map", "0:v", "-map", "1:a",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
                "../cikti/kariyer-pusulan-2500-seslendirmeli.mp4"], check=True)
print("tamam")
