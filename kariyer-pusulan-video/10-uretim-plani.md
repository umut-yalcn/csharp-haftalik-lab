# Üretim Planı — Kodla Çizilen Reels (API anahtarsız)

Diğer Reels oturumundaki yöntemin aynısı: sahneler kodla çizilir, başsız Chromium'da kare kare görüntülenir, ffmpeg ile videoya çevrilir. Yapay zekâ video modeli, ücret ya da API anahtarı gerekmez.

## Yöntem ve araçlar

| Parça | Araç | Durum (bu ortamda kontrol edildi) |
|---|---|---|
| Sahne çizimi | HTML Canvas 2D ve gerektiğinde Three.js (npm) | npm erişilebilir |
| Kare kare görüntüleme | Playwright + kurulu Chromium | Chromium kurulu |
| Font | Montserrat (`@fontsource/montserrat`, npm). Türkçe karakter destekli. | npm erişilebilir |
| Videoya çevirme | ffmpeg (H.264, 1080×1920, 30 fps) | kurulu |
| Logo | `referans/logo-orijinal.png`, olduğu gibi | hazır |

**Neden "kare kare"?** Sahne gerçek zamanlı oynatılmaz. Her kare için zaman `t = kare / 30` verilir ve sayfa o anı çizer. Bilgisayar ne kadar yavaş olursa olsun video takılmaz, her üretim birebir aynı çıkar. 25 sn = 750 kare.

## Görsel dil: "ışıklı stilize sinematik"

Fotoğraf gerçekçiliği bu yöntemle çıkmaz. Hedef, feed'deki görsellerin hareketli ve stilize hâli:
- Koyu lacivert zemin, katmanlı derinlik (ön-orta-arka plan farklı hızla kayar, parallax)
- Parlayan turkuaz yol, ışık izleri, parçacıklar, bloom (parlama), film grain, kenar kararması
- **İnsanlar silüet** olarak çizilir: arkadan ışık almış, kenarları turkuaz parlayan figürler. Yüz detayı yok, bu sayede "yapay" görünmez.
- Arayüz parçaları (kartlar, buton, telefon) feed'deki ikon ve kart stilinde, net vektör çizim

## Kesitlerin koddaki karşılığı

| Kesit | Çizilecek sahne | Zorluk |
|---|---|---|
| 1 · 0:00–0:03 | Gece odası: masa, laptop ve arkadan silüet öğrenci. Ekranda onlarca sekme kartı titrer, ekran ışığı odayı boyar. Kamera yavaşça yaklaşır, bir sekmeye zoom ve flash. | Orta |
| 2 · 0:03–0:06 | Dört hızlı vuruş: staj, burs ve eğitim kartları (ikonlu, feed stili), dördüncüde "Başvur →" butonu. Parmak dokunur, ışık patlar. | Kolay |
| 3 · 0:06–0:09 | Sabah kampüsü: gradyan gökyüzü, bina silüeti, merdivende 5 öğrenci silüeti, telefon ışıkları. Hafif orbit (parallax). "2.500" sayacı ve kameraya doğru büyüme. | Orta-zor |
| 4 · 0:09–0:12 | Dört portre silüeti (öğrenci, mezun, kodlayan, staj arayan). Her biri farklı nesneyle tanınır: kitap, ceket, laptop, sırt çantası. Bakış çizgileri ışıklı yola dönüşür. | Orta |
| 5 · 0:12–0:15 | Çatı ve şehir silüeti, köprü, alacakaranlık. Ayakların altından KP Rehber tarzı kıvrılan turkuaz ışık nehri şehre akar. Kamera yükselir. | Orta |
| 6 · 0:15–0:19 | Telefon çizimi; içinde kariyer keşif arayüzü. Kartlar kayar, kaydet ikonu "pop" yapar, başvuru sayfası açılır. Keşfet / Kaydet / Başvur. | Kolay-orta |
| 7 · 0:19–0:22 | Gün batımı gökyüzü (ufukta sıcak, üstte lacivert), birlikte yürüyen 6 silüet, slow motion yürüme döngüsü. Gökyüzü laciverte döner, beyaz ışık açılır. | Zor (yürüme animasyonu) |
| 8 · 0:22–0:25 | Açık zemin, orijinal logo, başlıklar, site adresi (bkz. `kesit-08.md`). | Kolay |

Bütün ekran yazıları videonun içine doğrudan çizilir. Ayrı kurgu gerekmez, ama istenirse şeffaf yazı katmanları da ayrıca verilebilir.

## Aşamalar

**Aşama 0 — Altyapı (kısa)**
- npm ile Playwright, Three.js ve Montserrat kurulur.
- `uret/` klasörü: ortak çizim kitaplığı (renkler, yazı animasyonu, parçacık, bloom, grain), kare çizici ve ffmpeg betiği.
- Test: tek kare çizilir, boyut ve Türkçe karakterler kontrol edilir.

**Aşama 1 — Görünüm onayı (ilk teslim)**
- **Kesit 8 (outro) ve kesit 5 (ışıklı yol)** tam hâliyle üretilir. Biri en kolay, diğeri markanın imza sahnesi; ikisi birlikte genel görünümü gösterir.
- Teslim: iki kısa MP4 ve her kesitten 3 kare görsel.
- **Burada onayınızı beklerim.** Renk, yoğunluk ve silüet stili beğenilmezse diğer kesitlere geçmeden düzeltilir.

**Aşama 2 — Kalan kesitler**
- Kolaydan zora: 2 → 6 → 1 → 4 → 3 → 7.
- Her kesit ayrı MP4 olarak üretilir. Her kesitten sonra kareler kontrol edilir: taşan yazı, güvenli alan, bozuk karakter.

**Aşama 3 — Birleştirme ve teslim**
- 8 kesit geçişlerle tek videoda birleşir: `kariyer-pusulan-2500.mp4` (25,0 sn, 1080×1920, sessiz).
- Ek teslimler: kapak karesi (PNG), her kesitin ayrı MP4'ü, şeffaf yazı katmanları (istenirse).
- Müzik eklenmez; Instagram'da kendi kütüphanesinden eklenir (telif güvenli). Zamanlama müziğin 0:07'deki drop'una göre hazırlanır.

**Aşama 4 — Revizyon**
- Geri bildirime göre yazı, zamanlama ve renk düzeltmeleri. Kodla üretildiği için tek bir değeri değiştirip yeniden üretmek dakikalar sürer.

## Riskler ve dürüst sınırlar
- **Gerçekçilik:** Video stilize olacak; kampüs ve şehir fotoğraf gibi görünmeyecek. Feed'in AI-fotoğraf hissini birebir vermez. Daha yakın bir sonuç için ileride kesit 1, 3, 4 ve 7 bir video aracında üretilip bu videodaki yerlerine konabilir (karma yol). Plan buna uygun kuruluyor: her kesit ayrı dosya.
- **Kesit 7 yürüyüş:** Silüetlerin doğal yürümesi en zor kısım. Gerekirse yürüyüş yerine yavaşça ilerleyen, saçları ve ceketleri rüzgârda hareket eden duruş silüetlerine geçilir.
- **Logo boyutu:** Logo dosyası 224 px. Outro'da en fazla 240 px genişlikte kullanılabilir. Daha büyük dosya bulunursa logo büyütülür.
- **Müzik yok:** Video sessiz teslim edilir, müzik Instagram'da eklenir.

## Sizden beklenenler
1. Bu planın onayı. Onaydan sonra Aşama 0 ve 1'e başlarım.
2. (İsteğe bağlı) Logonun daha büyük hâli ya da SVG dosyası.
3. Aşama 1 sonunda görünüm onayı.
