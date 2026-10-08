# Ejderha & Şövalye Reels — Onaylanan Kararlar

Bu dosya projenin hafızasıdır. Yeni bir adım atmadan önce oku; bir karar değişirse burayı güncelle.

## Kaynak
- Referans video: "Comment CAT for the guide / Fight fight fight… until my can opener is back / Made with yesand" (18,08 sn, 1280×720 yatay, 24 fps). Video repoda yok; kullanıcının yüklediği dosyadır.
- Çekimler: 0–4,9 kedi ejderhanın pençesinde kılıç kaldırıyor · 4,9–6,0 geniş, şövalye sisin içinde · **6,0–7,0 yakın plan, eldivenlerde mama konservesi** · 7,0–~10 kedi koşuyor · ~10–14,5 geniş, ejderha uyanıp şövalyenin arkasına geliyor · 14,5–18,1 ejderha başını şövalyenin yanına indiriyor, kedi ayakta.
- Ses: diyalog ve müzik yok; efektler var (kedi, ~6,0 sn konserve açılışı, metal, ejderha hırıltısı, ~15,75 sn miyav).

## Değişiklikler (yalnızca bunlar; geri kalan her şey aynı)
1. **Mama konservesi → laptop.** Şövalye laptopu avuçlarının üstünde tutar, ekran kameraya dönüktür. Konservenin geçtiği her çekimde (yakın ve geniş planlar) laptop olur.
2. **Laptop ekranında Kariyer Pusulan ana sayfası, koyu tema** (`referans/site-ana-sayfa-koyu.png`, kırpma x 130–1710, y 0–938).
3. **Ejderhanın başında logolu miğfer** (ejderhanın göründüğü bütün çekimlerde).

## Laptop (onaylı) — `onayli/laptop-tasarim-sayfasi.png`, `onayli/06sn-yakin-laptop.png`
- Kararmış çelik kasa, gümüş rulo kenar, köşelerde perçinli zırh başlıkları, alt çerçevede gravür süsü (yazı yok).
- **Klavye üstündeki kahverengi deri menteşe kayışları kaldırıldı** (kullanıcı isteği).
- Ekran net olmalı: ekran bulanıklaştırılmaz, sis/ışık katmanları ekranın üstüne binmez, site görüntüsü adım adım küçültülür, cam yansıması çok hafif (%5). Geri bildirim: "ekran buğulu gibi gözüküyor" → düzeltildi, "bu daha iyi".

## Ejderha miğferi (onaylı) — **Hilal, örnek 8: eskitme orta · gömülü** — `onayli/17sn-migfer-8-ve-laptop.png`
- Biçim: alnın üstünde hilal bant, tepede büyük madalyon (10 tasarım arasından "10. Hilal" seçildi).
- Yer: gözün üstünde, kafatasının tepesinde, kaş dikenlerinin arasında, başın orta çizgisinde (kullanıcının işaretlediği alan).
- Malzeme: kararmış çelik, bronz kenar ve perçinler.
- Renk: **matlık 3. Orta** (parlaklık %70, renk %55, kontrast %92). Kullanıcı için "eskitme" önce bu demekti: renk parlaklığını azaltmak.
- Eskitme: orta (k = 0,45) — iri pas lekeleri, kenarlarda aşınmış çıplak çelik, madalyon halkasında yeşil patina.
- Oturma: "gömülü" — R 130, büküm 0,45, kubbe 1, ölçek 0,95, basıklık 0,86, dönüş −0,22, merkez (347, 188); açık renkli ejderha dikenleri kenar bandında miğferin önüne geçer (eşik 128, bant 9 px).
- Sahneye uydurma: kafa kavisine bükme, silindir gölgelemesi + üstten gök ışığı, sahnenin pus rengi, videonun yumuşaklığına indirme (×0,62), gren, temas ve ortam gölgesi.
- **Logo:** sitenin koyu tema logosu (`referans/logo-koyu-tema.png`, ekran görüntüsünden kesildi, yeniden çizilmedi), madalyonda siyah mine zemin üzerinde, büyük ve belirgin. Logonun zemini eskitilmez.
- Reddedilenler: burun sırtındaki gümüş alın plakası (yer ve renk uymadı), parlak gümüş renkler, küçük logo, düz yapıştırılmış (bükülmemiş) miğfer ("yapay duruyor").

## Format
- **Instagram Reels, dikey 9:16 (1080×1920).** Yatay videoyu kırpmak yerine her çekim dikey kadrajla **yeniden üretilecek** (17. sn sahnesinde ejderha başı ve şövalye yatay kırpmada aynı kareye sığmıyor).
- Yazılar Reels güvenli alanında kalır.

## Üretim yöntemi
- Gerçekçi sahneler yapay zekâ video aracıyla üretilecek (bu ortamda erişim yok; araç kullanıcıda).
- Ekrandaki site, üretimden sonra net hâliyle kompozitle yerleştirilir.

## Kod
`tasarim-kodu/` içindeki sayfalar Canvas ile tasarım görsellerini üretir (`node calistir.js <sayfa>.html`). Sayfaların yanında `genis.png` (17 sn karesi), `yakin.png` (6,5 sn karesi), `site-koyu.png`, `site-acik.png`, `logo.png`, `logo-koyu.png` ve `node_modules` (Playwright, Montserrat) bulunmalıdır; bunlar `referans/` ve `kariyer-pusulan-video/uret/node_modules` içindedir.

## Üretim v1 (Yol 1 + (b) düzeni, ücretsiz) — `cikti/ejderha-dikey-9x16.mp4`, `cikti/ejderha-yatay.mp4`
- Kullanıcı kararı: önce ücretsiz yol denenir — orijinal videonun üstüne kare kare kompozit (telif riski kabul edildi), dikey için 9:16 ekranın ortasında yatay video + üstte/altta bulanık arka plan.
- Çekimler (24 fps, 432 kare): 1–118 ve 169–251 değişmez · 119–144 geniş sis: küçük laptop · 145–168 yakın plan: büyük laptop · 252–347 ejderha uyanır (yandan → önden): miğfer + küçük laptop · 348–432 baş şövalyenin yanında: miğfer + küçük laptop.
- Takip: `uretim/izle.py` (numpy yama eşleme, OpenCV yok). Ejderha: gözler + burun; şövalye: eller + miğfer; yakın plan: eldivenler/kemer.
- Parametreler: `uretim/parametre.py` → `uretim/parametre.json`. Son çekimde 409. kareye göre benzerlik dönüşümü; uyanma çekiminde göz arası / baş boyu oranıyla yandan-önden geçişi (yaw), yandan görünüşte miğfer kafatasının üstüne, biraz geriye kayar.
- Çizim: `uretim/uret.html` + `uretim/ortak.js` (onaylı miğfer ve laptop kodu), `node uretim/uret.js <kaynak_kareler> uretim/parametre.json <cikti_kareler>`.
- Ses: orijinal ses (konserve açılma sesi dahil) olduğu gibi.

## Üretim v2 — miğfer hareket uyumu (geri bildirim: "bilgisayar ve geçişler güzel, miğfer hareket ederken daha uyumlu olmalı")
- Laptop ve geçişler v1'deki gibi kaldı, dokunulmadı.
- Kafatası bağlantısı: miğferin oturduğu bölgeden otomatik seçilen 12'şer dokulu nokta izlenir (`uretim/nokta_sec.py` → `iz/d5.json`, `iz/d6.json`); aykırılar atılarak benzerlik ve **afin** dönüşüm çözülür. Afin dönüşüm baş eğilip dönerken kafatası yüzeyindeki perspektif sıkışma ve eğilmeyi miğfere de uygular (güvene göre benzerlik çözümüyle harmanlanır).
- **Hareket bulanıklığı:** miğfer hızı (kare başına 10–14 px'e kadar) yönünde yarım kare pozlamayla bulanıklaştırılır; ejderha durunca net.
- **Işık/sis eşleme:** miğferin altındaki bölgenin parlaklığı ve kontrastı her karede ölçülür (409. kare referans); miğfer parlaklığı ve pusu buna göre ayarlanır.
- Doğrulama: miğfere göre sabitlenmiş kırpmalarda altındaki kafatası dokusu kaymıyor; ardışık karelerde sıçrama yok.
- Çıktılar: `cikti/ejderha-dikey-9x16.mp4`, `cikti/ejderha-yatay.mp4`, kontrol için `cikti/ejderha-migfer-yakindan.mp4` (miğferi takip eden yakın kadraj, 10,5–18 sn).
