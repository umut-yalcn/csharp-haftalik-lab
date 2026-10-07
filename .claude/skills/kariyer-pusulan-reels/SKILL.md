---
name: kariyer-pusulan-reels
description: Kariyer Pusulan Instagram Reels videolarını kodla (Canvas + başsız Chromium + ffmpeg, API anahtarsız) üretirken, revize ederken ya da yeni kesit eklerken kullan. Onaylanan stil kararlarını (keskin gradyan yazı, sinematik renkli karakterler, sade yüz, laptop, logo kuralları), üretim komutlarını ve kontrol listesini içerir.
---

# Kariyer Pusulan Reels üretimi

Proje klasörü: `kariyer-pusulan-video/`. Kod `uret/` içinde, çıktılar `cikti/` içinde.

## 1. Önce oku
- `kariyer-pusulan-video/KARARLAR.md`: onaylanmış bütün kararlar ve geri bildirim geçmişi. **Bunlara aykırı bir şey yapma.** Karar değişirse dosyayı güncelle.
- `00-stil-rehberi.md`: renk, font ve güvenli alan.
- `kesit-0X.md`: her kesitin senaryosu, metinleri ve zamanlaması.

## 2. Altyapı
```
cd kariyer-pusulan-video/uret
npm install
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers   # bulut ortamında; yerelde gerekmez
```

| Dosya | Görevi |
|---|---|
| `lib.js` | Renkler, zamanlama, `satir()` yazı, parlama, parçacık, grain, vinyet |
| `figur2.js` | Pozlar (`poz2.ayakta`, `poz2.yuru`) |
| `karakter.js` | Renkli karakter çizimi (stil, yüz, kıyafet) |
| `kadro.js` | Sabit karakter kadrosu |
| `ikon.js` | Feed stili ikonlar, başparmak |
| `kesit-0X.js` | Kesitler |
| `sahne.html` | Varsayılan seçenekler |
| `ciz.js` | Kare çizer, MP4 üretir |
| `onizle.sh` | Önizleme görseli yapar |

## 3. Komutlar
```
node ciz.js 05                        # kesit 5 -> cikti/kesit-05.mp4
node ciz.js 05 --kareler 0,45,89      # yalnızca seçili kareler (PNG) -> cikti/kesit-05-kareler/
sh onizle.sh 05 0,45,89 onizleme.png  # kareleri yan yana önizleme
# seçenekler (varsayılanlar onaylı hâller): --yazi eski|keskin|duz|kutu  --laptop eski|yeni  --yuz yok|sade|detayli
# GÜNCEL ANA SÜRÜM (insansız, 0.75x, yumuşak geçiş, beyaz flaş az) — 8 kesitin hepsi:
#   node ciz.js 01 --insanlar yok --gecis yumusak --flas az --hiz 0.75   -> cikti/kesit-01-yok-yumusak-az-0.75.mp4
#   birleştirmede bu dosyaları kullan -> kariyer-pusulan-2500-insansiz.mp4 (~33,3 sn, 1000 kare)
```
Birleştirme (`cikti/` içinde):
```
for k in 01 02 03 04 05 06 07 08; do echo "file 'kesit-$k.mp4'"; done > liste.txt
ffmpeg -y -f concat -safe 0 -i liste.txt -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -r 30 -movflags +faststart kariyer-pusulan-2500.mp4
```
Tam bir kesit 1–3 dakika sürer. Uzun işlemleri arka planda çalıştır.

## 4. Değişmez kurallar
- **Logo:** Yalnızca `referans/logo-orijinal.png`. Değiştirme. Koyu zeminde beyaz rozet içinde, en fazla 240 px.
- **Yazı:** Hiçbir yazıda ışıma yok; özel kodla çizilen yazılar da `KP.YAZI.stil`'e uymalı. Montserrat. Vurgu kelimesi için `{ renk: "gradyan" }`; varsayılan stil keskin gradyan, ışıma yok. Gerektiğinde yazının arkasına `yaziGolgesi` bandı. Bütün yazılar güvenli alanda: üst 220 px, alt 420 px ve sağ 140 px boş.
- **İnsanlar:** Her zaman kadrodan ve şu çağrıyla:
  ```
  KP.karakter(ctx, KP.poz2.ayakta|yuru(...), KP.kadro(ad, "arka"|"on", ek), { x, y, olcek, stil: { tip: "sinematik", karartma }, kenarIsigi })
  ```
  Kenar ışığını sahnenin ışığına göre seç. Sade yüz varsayılan. Siyah silüet ya da ışıktan insan kullanma.
- **Kesitler arası geçişler:** Bir kesit hangi renk ya da ışıkla bitiyorsa sonraki o renk ya da ışıkla açılır (bkz. `09-kurgu-ve-overlay.md`). Bir kesiti değiştirirken başını ve sonunu koru.
- **Kapsam:** Kullanıcı yalnızca X'i istediyse yalnızca X'i değiştir. Zorunlu küçük bir ek gerekirse yap ve söyle.

## 5. Kontrol listesi (teslimden önce)
- [ ] Değişen kesitlerden seçili kareleri çizip gözle kontrol et: taşan yazı, güvenli alan, bozuk Türkçe karakter (ş, ğ, ı, İ).
- [ ] Yazı netliğini Instagram sıkıştırmasıyla test et:
  ```
  ffmpeg -loop 1 -t 0.2 -i kare.png -vf scale=720:1280 -crf 30 test.mp4
  ```
  Ardından kareyi çıkarıp bak.
- [ ] Birleştirilmiş videonun süresi ve kare sayısı doğru olmalı (`ffprobe -count_frames`): 1x'te 25,0 sn ve 750 kare, 0.75x'te 33,3 sn ve 1000 kare.
- [ ] Geçişlerin öncesinden ve sonrasından kare çıkarıp sıçrama olmadığını kontrol et.
- [ ] Commit'le ve gönder. Değişikliği ve gerekiyorsa `KARARLAR.md` güncellemesini kullanıcıya kısa ve net anlat.
