"""ElevenLabs ile seslendirme klipleri üretir (Chris, eleven_v3, Türkçe).
Anahtar ortam değişkeninden okunur: ELEVENLABS_API_KEY (dosyaya/sohbete yazılmaz).
Kullanım:
  python3 uret_ses.py deneme      # yalnızca S1 ve S4 (~70 kredi)
  python3 uret_ses.py tam         # S1–S9 (zaten üretilenler atlanır)
  python3 uret_ses.py S5 S9       # belirli satırları yeniden üret (üzerine yazar)
Çıktı: klipler/S1.mp3 ... ; her üretim harcanan karakterle uretim-gunlugu.txt'ye yazılır.
"""
import json, os, re, sys, time, urllib.request

SES_CHRIS = "iP95p4xoKVk53GoZ742B"
MODEL = "eleven_v3"
KOK = os.path.dirname(os.path.abspath(__file__))

def satirlar():
    out = {}
    for r in open(os.path.join(KOK, "METIN-TASLAK.md"), encoding="utf-8"):
        if r.startswith("| S"):
            c = [x.strip() for x in r.split("|")]
            out[c[1]] = c[3]
    return out

def uret(ad, metin, anahtar):
    govde = json.dumps({"text": metin, "model_id": MODEL, "language_code": "tr"}).encode()
    istek = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{SES_CHRIS}?output_format=mp3_44100_128",
        data=govde, headers={"xi-api-key": anahtar, "Content-Type": "application/json", "Accept": "audio/mpeg"})
    with urllib.request.urlopen(istek, timeout=120) as y:
        veri = y.read()
    os.makedirs(os.path.join(KOK, "klipler"), exist_ok=True)
    open(os.path.join(KOK, "klipler", f"{ad}.mp3"), "wb").write(veri)
    sayi = len(re.sub(r"\[[^\]]*\]", "", metin).strip())
    with open(os.path.join(KOK, "uretim-gunlugu.txt"), "a", encoding="utf-8") as g:
        g.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')}\t{ad}\t{len(metin)} karakter (etiketsiz {sayi})\t{metin}\n")
    return len(metin)

if __name__ == "__main__":
    anahtar = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not anahtar:
        sys.exit("ELEVENLABS_API_KEY tanımlı değil.")
    S = satirlar()
    arg = sys.argv[1:] or ["deneme"]
    if arg == ["deneme"]:
        hedef, zorla = ["S1", "S4"], False
    elif arg == ["tam"]:
        hedef, zorla = list(S), False
    else:
        hedef, zorla = arg, True
    tahmin = sum(len(S[a]) for a in hedef)
    print(f"Üretilecek: {', '.join(hedef)} — tahmini en fazla {tahmin} karakter")
    toplam = 0
    for a in hedef:
        if not zorla and os.path.exists(os.path.join(KOK, "klipler", f"{a}.mp3")):
            print(f"{a}: zaten var, atlandı"); continue
        toplam += uret(a, S[a], anahtar); print(f"{a}: tamam")
    print(f"Gönderilen toplam: {toplam} karakter")
