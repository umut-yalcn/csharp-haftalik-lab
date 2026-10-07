# Kurgu, Overlay ve Dışa Aktarma

## Proje ayarları
- 1080×1920, 30 fps (kesit 7'deki slow motion için kaynak 60 fps ise daha iyi olur)
- Toplam süre 25,0 sn
- Bütün kesitlere aynı renk ayarı ya da LUT: gölgeler lacivert, yüksek ışıklar turkuaz (bkz. stil rehberi)
- Kesitlerin üzerine çok hafif ortak film grain katmanı (%3–5). Kesitler aynı kameradan çıkmış gibi görünür.

## Katman sırası (alttan üste)
1. Üretilen video kesitleri
2. Renk ayarı ve LUT
3. Okunurluk için lacivert gradyan vinyet (yazının olduğu bölgede, %25–40 opak)
4. Işık izi, flash ve light-leak geçişleri
5. Metinler
6. Orijinal logo (yalnızca kesit 8. İsterseniz bütün video boyunca sol üstte %60 opak küçük bir filigran.)

## Yazı animasyon standardı
- Giriş: 6–8 kare, aşağıdan 20 px yukarı + opacity 0→100, ease-out
- Çıkış: 4–6 kare, opacity 100→0
- Vurgu kelimesi giriş anında 1 kez hafif turkuaz parlama yapar
- Bir ekranda en fazla 2 satır başlık
- Bütün metin güvenli alanda kalır (bkz. stil rehberi)

## Zaman çizelgesi özeti
| Zaman | Kesit | Ana yazı | Geçiş |
|---|---|---|---|
| 0:00–0:03 | 1 | Bir fırsatı kaçırmış olabilir misin? | Sekmeye zoom → turkuaz-beyaz flash |
| 0:03–0:06 | 2 | Bir staj. / Bir burs. / Bir eğitim. / Belki de o tek başvuru. | Başvur butonu ışığı kareyi kaplar |
| 0:06–0:09 | 3 | Ve bugün... / 2.500 KİŞİ / KariyerPusulan.com'da buluştu. | 2.500 kameraya doğru büyür |
| 0:09–0:12 | 4 | 2.500 farklı hedef / hikâye / gelecek ihtimali. | Bakış çizgileri ışıklı yola dönüşür |
| 0:12–0:15 | 5 | Ama mesele 2.500 değil. / Sıradaki fırsatı bulmak. | Yol kameranın altından geçer |
| 0:15–0:19 | 6 | Keşfet. Kaydet. Başvur. | Telefon ekranına zoom |
| 0:19–0:22 | 7 | İyi ki varsınız. 💙 / Daha yeni başlıyoruz. | Gökyüzü marka laciverdine döner |
| 0:22–0:25 | 8 | 2.500 kişi pusulasını buldu. / Sıradaki sen misin? / KariyerPusulan.com / Keşfet • Kaydet • Başvur | — (son 1 sn sabit) |

## Müzik
- 25 sn'ye uyan, ~110–120 BPM, gerilimden umuda yükselen sinematik ya da elektronik bir parça
- Drop 0:07'de ("2.500" sayacı biter), stop-down 0:13,6'da ("Ama mesele 2.500 değil.")
- Instagram'ın kendi müzik kütüphanesinden seçilirse telif sorunu olmaz. Kurguda müziksiz dışa aktarıp müziği Instagram'da ekleyin.

## Kapak
Kesit 8'in son karesi (0:24,5) Reels kapağı olarak kullanılır. Profil ızgarasında 3:4 kırpılınca logo ve "2.500 kişi pusulasını buldu." görünür kalmalı. Bunu dışa aktarmadan önce kontrol edin.

## Açıklama metni önerisi
```
2.500 kişi pusulasını buldu. 💙
Staj, burs, eğitim, bootcamp ve etkinlik fırsatları tek yerde.
Keşfet • Kaydet • Başvur → kariyerpusulan.com

İyi ki varsınız. Daha yeni başlıyoruz.

#kariyerpusulan #staj #burs #üniversite #yenimezun #kariyer #bootcamp #fırsat
```

## Dışa aktarma
- H.264, 1080×1920, 30 fps, ~12–16 Mbps, AAC 48 kHz
- Yüklemeden önce telefonda izleyin: yazılar Instagram arayüzünün altında kalıyor mu, Türkçe karakterler doğru görünüyor mu?

## Kontrol listesi
- [ ] Hiçbir AI klibinde okunabilir ya da bozuk yazı, sahte logo yok
- [ ] Logo orijinal dosyadan, değiştirilmeden kullanıldı
- [ ] Bütün kesitlerde aynı renk ayarı var
- [ ] ş, ğ, ı, İ, ü, ö, ç karakterleri doğru
- [ ] "2.500" her yerde nokta ile yazıldı (2,500 değil)
- [ ] Son 1 sn logo ve site adresi sabit
