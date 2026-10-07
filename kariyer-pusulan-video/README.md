# Kariyer Pusulan — "2.500 Kişi" Reels Üretim Paketi

25 saniyelik, 9:16 dikey Instagram Reels videosu. 8 kesit ayrı ayrı üretilir, sonra kurguda birleştirilir.

| Dosya | Kesit | Süre |
|---|---|---|
| [00-stil-rehberi.md](00-stil-rehberi.md) | Instagram sayfası analizi, renkler, fontlar, yazı stili | — |
| [kesit-01.md](kesit-01.md) | Gece sekmeler & arayış | 0:00–0:03 |
| [kesit-02.md](kesit-02.md) | Fırsatlar & "Başvur" butonu | 0:03–0:06 |
| [kesit-03.md](kesit-03.md) | Kampüste sabah & 2.500 | 0:06–0:09 |
| [kesit-04.md](kesit-04.md) | Portreler & çeşitlilik | 0:09–0:12 |
| [kesit-05.md](kesit-05.md) | Geleceğe bakış & turkuaz yol | 0:12–0:15 |
| [kesit-06.md](kesit-06.md) | Mobil keşif akışı | 0:15–0:19 |
| [kesit-07.md](kesit-07.md) | Birlikte yürüyüş & gün batımı | 0:19–0:22 |
| [kesit-08.md](kesit-08.md) | Outro, logo ve CTA | 0:22–0:25 |
| [09-kurgu-ve-overlay.md](09-kurgu-ve-overlay.md) | Birleştirme, yazı animasyonları, logo, müzik, dışa aktarma | — |
| [10-uretim-plani.md](10-uretim-plani.md) | Kodla (API anahtarsız) üretim planı | — |
| `referans/` | Instagram profilinin ekran görüntüleri ve orijinal logo (`logo-orijinal.png`) | — |

## Temel kurallar

1. **Video modeline yazı, logo ya da arayüz metni ürettirme.** Türkçe karakterler (ş, ğ, ı, İ) bozulur ve logo yeniden çizilir. Bütün ekran yazıları ve orijinal logo kurgu aşamasında overlay olarak eklenir. Her promptta bunun için "no text" ifadesi var.
2. **Her kesiti 5 sn ya da daha uzun üret, kurguda kısalt.** Çoğu model 5–8 sn klip üretiyor. Hareketin en temiz kısmını seçmek için pay bırak.
3. **Her kesitten 2–4 varyasyon üret.** Işık ve renk tutarlılığına göre seç.
4. **Aynı modeli ve aynı ayarları kullan.** Kesitler arasında model değiştirmek görsel dili bozar.
5. Model "image-to-video" destekliyorsa önce her kesitin ilk karesini görsel olarak üret, renk ve ışığı onayla, sonra canlandır. Tutarlılık için en güvenli yol bu.
