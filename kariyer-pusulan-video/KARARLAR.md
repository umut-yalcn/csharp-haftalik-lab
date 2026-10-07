# Kariyer Pusulan Reels — Onaylanan Kararlar

Bu dosya projenin hafızasıdır: kullanıcıyla verilen ve onaylanan kararlar burada tutulur. Yeni bir kesit, yeni bir video ya da revizyon yaparken önce bunu oku. Bir karar değişirse bu dosyayı güncelle.

## Genel yön
- **Üretim yöntemi:** Kodla çizim (Canvas + başsız Chromium + ffmpeg). Yapay zekâ video modeli ve API anahtarı yok. Ayrıntı: `10-uretim-plani.md`.
- **Format:** 9:16, 1080×1920, 30 fps, sessiz. Müzik Instagram'da eklenir.
- **Palet:** Feed'deki siyah-lacivert zemin, mavi-turkuaz vurgu. Logodan çıkan renklere göre değiştirilmedi; kullanıcı "ilk dediğin doğruydu" dedi.
- **Değişiklik kuralı:** Kullanıcı bir şeyin düzeltilmesini istediğinde başka hiçbir şeyi değiştirme. Zorunlu küçük bir ek gerekirse (ör. okunurluk için yazı bandı) yap ve açıkça söyle.

## Logo
- Yalnızca `referans/logo-orijinal.png` kullanılır. Yeniden çizilmez, renklendirilmez, değiştirilmez.
- Dosya lacivert ve beyaz zeminli olduğu için koyu zeminde **beyaz yuvarlak rozet** içinde gösterilir.
- Dosya 224 px; ekranda en fazla 240 px genişlikte kullanılır.
- Outro (kesit 8) **koyu lacivert** zeminde kalır.

## Yazı
- **Font:** Montserrat (Türkçe karakter destekli). El yazısı vurgu: Dancing Script. Great Vibes'ta "İ" harfi "J" gibi okunduğu için reddedildi.
- **Vurgu kelimeleri: "keskin gradyan" (B stili).** Turkuazdan (#2BE3F0) maviye (#1E7BFF) dar geçiş, **ışıma yok**, altında ince sert koyu gölge.
  - Neden: Eski geniş gradyan ve ışıma Instagram sıkıştırmasında bulanıklaşıyordu. Geri bildirim: "renkler güzel ama parlak durduğu için net değil".
  - Kodda varsayılan: `YAZI.stil = "keskin"`.
- **Hiçbir yazıda ışıma (glow/shadowBlur ile parlama) olmaz.** Buna `satir()` dışında özel kodla çizilen yazılar da dahil (kesit 6'daki "Keşfet. Kaydet. Başvur.", kesit 7'deki el yazısı). Yeni yazı eklerken mümkünse `satir()` kullan.
- Bütün yazılar Reels güvenli alanında kalır: üst 220 px, alt 420 px ve sağ 140 px boş bırakılır.
- Yazı açık renkli bir şeyin üstüne gelirse arkasına `yaziGolgesi` bandı eklenir.

## İnsanlar
- **Stil: "sinematik" renkli karakterler.** Gerçek kıyafet, saç, ten ve aksesuarlarla çizilir. Renkler sahne ışığıyla koyulaşır (karartma); kenarlarda sahneye uygun ışık bulunur (gün batımında sıcak, gece ekranında mavi-turkuaz).
  - Reddedilenler: siyah silüet (manken gibi), ışıktan ya da parçacıktan insan, neon çizgi, düz, pastel ve marka paleti stilleri.
- **Yüz: "sade yüz".** Nokta gözler, kaş, küçük burun çizgisi, hafif gülümseme. Ayrıntılı yüz (iris, dudak) reddedildi: uzak planda bakışlar sabit görünüyor.
- **Oranlar:**
  - Kollar gövdeye yakın, dirsekte hafif bükük; dışa açık değil.
  - Boyun kısa, önden görünümde yaka var.
  - Uzun ve kısa saçlarda kâkül var.
- **Kadro** (`uret/kadro.js`): Deniz, Elif, Zeynep, Emre, Can, Ayşe, Mert, Barış. Her kesitte aynı kişi aynı kıyafetle görünür. Yeni bir kişi gerekirse kadroya eklenir.
- Kalabalıkta uzaktakiler önce çizilir; her figürün altında zemin gölgesi olur.

## İnsansız sürüm (şu an paylaşılan ana sürüm)
- Kullanıcı aynı videonun **insan figürü olmayan** bir sürümünü de istedi: `cikti/kariyer-pusulan-2500-insansiz.mp4`. Karşı taraf bunu "daha akıcı" buldu; revizyonlar bu sürüme yapılır.
- **Hız 0.75x:** Yazılar çok hızlı geçiyordu. Video 0.75x hızda baştan çizilir (`--hiz 0.75`); süre yaklaşık 33,3 sn, 1000 kare. Sonradan yavaşlatma yapılmaz, çünkü kareler tekrar eder ve görüntü takılır.
- **Yumuşak geçişler:** Geçişlerdeki ışık dolguları (flaş, ışık patlaması, sızıntı) yarı yoğunlukta (`--gecis yumusak`). Karanlık geçişler aynı kalır.
- **Beyaz flaş az:** Beyaz ya da beyaza yakın geçiş flaşları ayrıca 0.2 yoğunlukta (`--flas az`). Bunlar kesit 1'in sonu ve 2'nin başı, kesit 2'deki "Başvur" patlaması ve 3'ün başı, kesit 6'nın sonu ve 7'nin başı. Turkuaz renkli geçişler 0.5'te kalır.
- Tam komut: `node ciz.js <kesit> --insanlar yok --gecis yumusak --flas az --hiz 0.75` (8 kesitin hepsi) → `kesit-XX-yok-yumusak-az-0.75.mp4`, ardından birleştirme. Kesit 4, 5 ve 8 `--flas`tan etkilenmediği için onların `kesit-XX-yok-yumusak-0.75.mp4` dosyaları da birebir aynıdır.
- Sahneler, geçişler, yazılar ve dekor aynı kalır. Yalnızca karakterler ve onlara bağlı gölgeler, ayak altı ışığı ve telefon ışıkları çizilmez. Kesit 1'deki boş sandalye dekor olarak kalır.
- Kesit 2, 6 ve 8'de insan yoktur, ama hız ve geçiş ayarları için onlar da aynı seçeneklerle yeniden çizilir.
- Kesit 2 ve 6'daki ekrana dokunan başparmak arayüz etkileşiminin parçası olarak bırakıldı.
- İnsanlı sürüm de korunur: `cikti/kariyer-pusulan-2500.mp4`.

## Sahneye özel
- **Kesit 1:** Televizyon değil, **laptop**: klavye, dokunmatik yüzey, menteşe ve ince çerçeve görünür. Laptop öğrenciye göre gerçekçi boyda (`LAPTOP_OLCEK = 0.62`). Geri bildirim: "laptop aşırı büyük".
- **Kesit 4:** Portrelerde yüz sağ üste döner (`bas.don`). "2.500 farklı" yazısının arkasında koyu bant var.
- **Kesit 6:** Telefon arayüzündeki kart içerikleri temsilîdir, gerçek fırsat değildir.

## Geri bildirim geçmişi
1. Figürler beğenilmedi, bir tasarım kararı istendi → silüet iyileştirme → renkli karakterler → sinematik stil seçildi.
2. "Parlak yazılar net değil", "ilk sahnede bilgisayar olsun", "insan görselleri iyileşmeli" → keskin gradyan, laptop ve sade yüz seçildi; laptop küçültüldü.
3. "Aynı video olsun ama insanları tamamen kaldır; geçiş ve görseller değişmesin" → ayrı insansız sürüm üretildi.
5. "Her şey mükemmel; geçişlerdeki beyaz flaş azalsın" → beyaz flaşlar 0.2'ye indirildi (`--flas az`), başka hiçbir şey değişmedi.
4. "Başvur yazısı iyi okunmuyor", "yazılar çok hızlı geçiyor, 0.75x'e alabiliriz", "geçişler biraz fazla ışıklı" → kesit 6 kelimeleri keskin stile geçti, insansız sürüm 0.75x ve yumuşak geçişlerle yeniden üretildi.
