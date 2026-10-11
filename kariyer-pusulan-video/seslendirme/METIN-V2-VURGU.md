# Seslendirme metni v2 — vurgu düzeltmesi (onay bekliyor)

Geri bildirim: "Bazı yerlerde gereksiz, bazı yerlerde eksik vurgulama yapıyor."

Kural: **Sesteki vurgu, ekranda turkuaz-mavi gradyanla vurgulanan kelimeyle aynı olsun.** Başka hiçbir kelime vurgulanmaz.
- Vurgu = BÜYÜK HARF (eleven_v3 büyük harfli kelimeyi vurgular).
- Duygu etiketleri ([calm], [warm], [confident] …) kaldırıldı: gereksiz vurgu ve abartılı tonun ana kaynağı bunlar.
- Duraklama yalnızca üç nokta (...) ve virgülle; satır sonunda kesilmesin diye [pause] kalır.
- Ayar: stability 0.5 (Natural) ve 1.0 (Robust) olmak üzere her satırdan iki okuma; en dengeli olan seçilir.

| # | Ekranda vurgulu kelime | v1 (şu an) | v2 (yeni) |
|---|---|---|---|
| S1 | kaçırmış | [calm, thoughtful] Bir fırsatı... kaçırmış olabilir misin? | Bir fırsatı... KAÇIRMIŞ olabilir misin? [pause] |
| S2 | staj / burs / eğitim | Bir staj. Bir burs. Bir eğitim. | Bir STAJ. Bir BURS. Bir EĞİTİM. [pause] |
| S3 | o tek başvuru | [soft] Belki de... o tek başvuru. | Belki de... o TEK başvuru. [pause] |
| S4 | 2.500 | [warm] Ve bugün... iki bin beş yüz kişi Kariyer Pusulan'da. | Ve bugün... İKİ BİN BEŞ YÜZ kişi, Kariyer Pusulan'da. [pause] |
| S5 | 2.500 (+ değişen kelime) | İki bin beş yüz farklı hedef... farklı hikâye... farklı gelecek. | İki bin beş yüz farklı HEDEF... farklı HİKÂYE... farklı GELECEK. [pause] |
| S6 | 2.500 · Sıradaki fırsatı | [slow] Ama mesele iki bin beş yüz değil... Sıradaki fırsatı bulmak. | Ama mesele iki bin beş yüz DEĞİL... SIRADAKİ fırsatı bulmak. [pause] |
| S7 | (beyaz, sırayla vurgu) | [confident] Keşfet. Kaydet. Başvur. | Keşfet. Kaydet. Başvur. [pause] |
| S8 | yeni başlıyoruz | [warm, smiling] İyi ki varsınız. Daha yeni başlıyoruz. | İyi ki varsınız. Daha YENİ başlıyoruz. [pause] |
| S9 | 2.500 · sen | İki bin beş yüz kişi pusulasını buldu. Sıradaki... sen misin? | İki bin beş yüz kişi pusulasını buldu. Sıradaki... SEN misin? [pause] |
