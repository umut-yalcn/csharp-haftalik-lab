# Stil Rehberi — @kariyerpusulan Instagram Analizi

Bu rehber profilin ekran görüntülerinden (`referans/`) çıkarıldı. Renk kodları ekran görüntüsünden tahmin edildi. Elinizde resmî marka kodları varsa onları kullanın.

## Sayfada ne gördüm

- **Zemin:** Gönderilerin neredeyse tamamı koyu lacivert, siyaha yakın. Açık zemin yalnızca bilgi kartlarında var (KYK, burs listesi).
- **Işık dili:** Elektrik mavisi ve turkuaz parlamalar, ışık izleri, parçacıklar, lens flare, neon kenar ışıkları. Sahneler mavi ışıkla aydınlanmış gibi.
- **Kıvrılan ışıklı yol:** "KP Rehber" serisinde (#01, #02) zeminde mavi-turkuaz parlayan, kıvrılarak uzaklaşan bir yol var. Bu sayfanın en ayırt edici görsel motifi. Kesit 5'teki "turkuaz yol" fikriyle birebir örtüşüyor. Videoda geçiş motifi olarak bu kullanılmalı.
- **Pusula:** Logo pusula ve "KP" harflerinden oluşuyor. Arka planlarda silik pusula gülü ve kadran çizgileri var.
- **Görsel türü:** Sinematik, gerçekçi ama "parlatılmış" sahneler: şehir silueti, kampüs, kalabalık, laptop başında çalışma masası.
- **Başlık stili:**
  - Kalın geometrik sans-serif. İki renkli: üst satır beyaz, vurgu kelimesi turkuaz ya da elektrik mavisi ("Hedefine Göre **Fırsat Seç**", "Kariyer Pusulan **Yayında!**").
  - Rakamlar büyük, mavi-turkuaz gradyanlı ("7 Günde **250** Üye!").
  - Kutlama gönderilerinde altın vurgu ("1111. Üyelik Kutlaması").
- **UI öğeleri:**
  - İnce çizgili, yuvarlak köşeli kutular içinde ikonlar (Staj / Eğitim / Hackathon / Etkinlik).
  - Ok ikonlu hap butonlar ("Kaydır →").
  - Altta globe ikonlu `kariyerpusulan.com` hap etiketi.
- **Logo yerleşimi:** Ya sol üstte küçük, ya da merkezde büyük ve parlamalı ("250 Üye" ve "Çok Yakında" gönderileri).
- **Sloganlar:** "Eğitimleri, etkinlikleri ve fırsatları tek yerde bul." · "Hedefini keşfet, yolunu çiz." · "Kariyerin için doğru yön" · "Doğru Yön · Net Bir Yol · Geleceğine Yön Ver"

## Senaryoya göre yaptığım uyarlamalar

| Konu | Senaryodaki hâli | Önerim | Neden |
|---|---|---|---|
| Kesit 8 zemini | "Temiz açık arka plan" (metin) ile "deep navy gradient" (prompt) çelişiyor | **Açık zemin** (kesit 7'nin lacivertinden beyaza ışık açılımı) | Verilen orijinal logo lacivert renkte ve beyaz zeminli. Koyu zeminde lacivert kısımları kaybolur, logoyu değiştirmeden okunur kılmanın yolu açık zemin. |
| Kesit 7 gün batımı | Sıcak altın saat | Altın arka ışık kalsın ama gökyüzü hızla lacivert ve turkuaza dönsün | Feed soğuk tonlu. Altın yalnızca kutlama vurgusu olarak kullanılıyor. |
| Kesit 5 yol | Dijital turkuaz çizgi | KP Rehber'deki **kıvrılan, parlayan ışık nehri** | Takipçinin tanıdığı motif. Seriyle bağ kurar. |
| Geçişler | Beyaz flash | Beyaz yerine **turkuaz-beyaz** flash | Marka rengi korunur. |
| Kesit 6 arayüz | Yapay zekâ ile üretilmiş uygulama | Gerçek `kariyerpusulan.com` mobil ekran kaydı, telefona yerleştirilmiş | Üretilen arayüz anlamsız metin içerir. Gerçek site daha inandırıcı ve "stok" hissi vermez. |
| 2.500 rakamı | Animasyonla yükselir | "250 Üye" gönderisindeki gibi mavi-turkuaz gradyanlı, kalın rakam | Önceki milestone gönderisiyle süreklilik kurar ("250 → 2.500"). |

## Renk paleti

Lacivert, turkuaz ve mavi kodları orijinal logo dosyasından (`referans/logo-orijinal.png`) ölçüldü. Diğerleri feed'den tahmin.

| Rol | HEX | Kaynak | Kullanım |
|---|---|---|---|
| Gece zemini | `#020C24` | feed | Arka planlar, vinyet |
| **Marka laciverti** | `#03214B` | logo | Gradyan, kart zemini, açık zeminde yazı |
| **Marka mavisi** | `#0285ED` → `#0155FA` | logo (ok gradyanı) | Vurgu kelimesi, ışık izleri |
| **Marka turkuazı** | `#00C5C3` | logo (S yolu) | Ana vurgu, ışıklı yol, rakam gradyanı |
| Açık mavi | `#8FD8FF` | feed | Parlama, ikincil metin |
| Beyaz | `#FFFFFF` | — | Ana başlık |
| Altın (yalnızca vurgu) | `#F5B83D` | feed | Kesit 7'de en fazla 1 dokunuş, tercihen hiç |

**Renk derecelendirme (grade):** Gölgeler laciverte, yüksek ışıklar turkuaz-beyaza kaysın (teal-navy split tone). Kontrast orta-yüksek, siyahlar tamamen ezilmesin. Bütün kesitlere aynı LUT uygulanmalı.

## Tipografi

Feed'deki fontların birebir adı belli değil. En yakın ücretsiz ve Türkçe karakter destekli seçenekler:

- **Ana başlık:** Montserrat ExtraBold / Black (alternatif: Poppins Bold)
- **Büyük rakam (2.500):** Montserrat Black, mavi→turkuaz dikey gradyan, hafif dış parlama
- **Alt yazı / küçük metin:** Montserrat Medium, `#8FD8FF` ya da beyaz %85
- **Elle yazılmış vurgu (isteğe bağlı):** "İyi ki varsınız" için ince script font (Great Vibes / Allura). Feed'deki "KP Rehber" ve "Kutlu Olsun" yazılarıyla uyumlu.

## Ortak negatif prompt (her kesite ekle)

```
text, letters, words, captions, subtitles, logo, watermark, brand names, UI text, gibberish writing,
distorted hands, extra fingers, deformed faces, plastic skin, stock photo look, oversaturated,
cartoon, 3D render look, low resolution, flicker, warped geometry
```

## Instagram Reels güvenli alanı (1080×1920)

- Üst 220 px: profil ve ses ikonu alanı. Yazı koyma.
- Alt 420 px: açıklama, beğeni ve yorum alanı. Yalnızca kesit 8'deki site adresi en fazla bu alanın hemen üstüne gelsin.
- Sağ 140 px: beğen, yorum, paylaş butonları.
- **Bütün başlıklar ortadaki 900×1280 px alanda kalmalı.**
