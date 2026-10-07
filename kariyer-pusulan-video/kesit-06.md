# Kesit 6 — Mobil Keşif Akışı (0:15–0:19)

**Üretim süresi:** 5 sn (telefon klibi) + ekran kaydı · **Kullanılacak:** 4 sn

## Amaç
Ürünün nasıl çalıştığını göstermek: Keşfet → Kaydet → Başvur.

## Önemli karar: gerçek site kullan
Video modeli uygulama arayüzünü anlamsız harflerle üretir, "stok" ve yapay görünür. Önerilen yöntem:

1. **Ekran kaydı:** Telefonda `kariyerpusulan.com` açılır (karanlık tema). Kartlarda kaydırılır (Staj, Burs, Eğitim, Bootcamp, Etkinlik), bir fırsat seçilir, kaydet ikonuna basılır, başvuru sayfası açılır. 1080×2340 çözünürlükte, 60 fps kaydedilir.
2. **Telefon klibi:** Aşağıdaki prompt ile **boş yeşil ekranlı** telefon tutan el klibi üretilir.
3. Kurguda ekran kaydı telefonun ekranına corner-pin ile yerleştirilir.

Yerleştirme zor gelirse ekran kaydını tam ekran kullanın. Kenarlarına lacivert gradyan çerçeve ve ince turkuaz parlama ekleyin. Feed'deki "Web sitemizi yeniledik" gönderisi bu yaklaşıma uygun.

## Prompt (telefon klibi)
```
Cinematic vertical 9:16 first-person POV video. A young person's hand holds a modern smartphone in a softly lit dark
room with navy-blue ambient light and turquoise bokeh in the background. The phone screen is solid flat chroma green,
evenly lit, no reflections, no content. The thumb makes natural scrolling and tapping motions over the screen. Very
subtle handheld movement, phone stays centered and fully in frame. Photorealistic, crisp detail. No text, no logos.
```

## Ekran yazısı ve UI vurguları (kurguda)
| Zaman | Olay | Overlay |
|---|---|---|
| 0:15.0–0:16.6 | Kartlar akıyor | Telefonun yanında sırayla ince çizgili kutular içinde ikon ve etiket: Staj · Burs · Eğitim · Bootcamp · Etkinlik ("Hedefine Göre Fırsat Seç" gönderisinin ikon stili) |
| 0:16.6–0:17.4 | Fırsat seçilir | **Keşfet.** |
| 0:17.4–0:18.2 | Kaydet ikonuna basılır | **Kaydet.** + ikonda turkuaz "pop" parlaması |
| 0:18.2–0:19.0 | Başvuru sayfası açılır | **Başvur.** |

Üç kelime üst bölgede yan yana birikir. Önce gelen kelime beyaza döner, aktif kelime turkuaz olur. Montserrat ExtraBold.

## Geçiş → Kesit 7
Telefon ekranı ileri doğru zoom yapar (kamera ekrana girer). Ekranın turkuaz ışığı kesit 7'nin gökyüzüne dönüşür (cross-dissolve + glow).

## Ses
Her dokunuşta yumuşak UI "tap" sesi. Kaydet anında kısa "pop" sesi.
