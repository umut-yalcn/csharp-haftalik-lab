// Kesit 6 — Mobil keşif akışı (0:15–0:19). Bkz. ../kesit-06.md
// Telefonda kariyer keşif uygulaması: kartlar kayar (Keşfet), yer imine basılır (Kaydet),
// başvuru sayfası açılır (Başvur). Sonunda kamera ekrana girer.
(function () {
  const { W, H, R, aralik, ease, lerp, clamp, rastgele, parlamaKatmani, grain, vinyet, ikonKutusu, IKON } = window.KP;

  const SURE = 4;
  const TEL = { x: 240, y: 400, w: 600, h: 1200, r: 84 };
  const EK = { x: TEL.x + 18, y: TEL.y + 18, w: TEL.w - 36, h: TEL.h - 36, r: 68 };
  const CIPLER = ["Staj", "Burs", "Eğitim", "Bootcamp", "Etkinlik"];
  const KARTLAR = [
    { ikon: "canta", b: "Yazılım Stajı", m: "İstanbul • Son gün 30 Kasım", e: "STAJ" },
    { ikon: "kep", b: "Lisans Bursu", m: "Aylık destek • 9 ay", e: "BURS" },
    { ikon: "kitap", b: "Veri Bilimi Eğitimi", m: "Online • Sertifikalı", e: "EĞİTİM" },
    { ikon: "roket", b: "Yapay Zekâ Bootcamp", m: "8 hafta • Ücretsiz", e: "BOOTCAMP" },
    { ikon: "takvim", b: "Kariyer Zirvesi 2026", m: "Ankara • 12 Aralık", e: "ETKİNLİK" },
    { ikon: "canta", b: "Pazarlama Stajı", m: "Hibrit • 3 ay", e: "STAJ" },
    { ikon: "kep", b: "Yüksek Lisans Bursu", m: "Yurt dışı • 2 yıl", e: "BURS" },
  ];
  const SECILEN = 3;
  const KART_Y0 = 330, KART_H = 186, KART_ARA = 20;
  const KAYDIR = 380; // liste bu kadar yukarı kayar; seçilen kart ekranın ortasına gelir

  // Zaman çizelgesi
  const T = { dokun1: 1.6, detay: [1.72, 2.12], dokun2: 2.45, dokun3: 3.0, form: [3.08, 3.45], zoom: [3.6, 4.0] };

  const bokeh = (() => { const r = rastgele(606); return Array.from({ length: 18 }, () => ({ x: r() * W, y: r() * H, r: 30 + r() * 110, a: 0.05 + r() * 0.12, renk: r() < 0.6 ? R.turkuaz : R.mavi })); })();

  function yazi(ctx, m, x, y, font, renk, hiza = "left", enFazla) {
    ctx.font = font; ctx.fillStyle = renk; ctx.textAlign = hiza; ctx.fillText(m, x, y, enFazla); ctx.textAlign = "left";
  }

  function liste(ctx, t) {
    const kay = KAYDIR * ease.inOut(aralik(t, 0.15, 1.45));
    const aktif = Math.min(4, Math.floor(aralik(t, 0.1, 1.5) * 5));
    // kartlar
    KARTLAR.forEach((k, i) => {
      const y = KART_Y0 + i * (KART_H + KART_ARA) - kay;
      if (y > EK.h || y + KART_H < 280) return;
      const secili = i === SECILEN && t >= T.dokun1 - 0.02;
      ctx.fillStyle = secili ? "rgba(24,209,227,0.16)" : "rgba(18,50,114,0.55)";
      ctx.beginPath(); ctx.roundRect(24, y, EK.w - 48, KART_H, 28); ctx.fill();
      ctx.strokeStyle = secili ? R.turkuaz : "rgba(143,216,255,0.18)"; ctx.lineWidth = secili ? 3 : 1.5;
      ctx.beginPath(); ctx.roundRect(24, y, EK.w - 48, KART_H, 28); ctx.stroke();
      ikonKutusu(ctx, k.ikon, 96, y + 70, 92, { kalinlik: 3 });
      yazi(ctx, k.b, 162, y + 64, "800 27px Montserrat", R.beyaz, "left", EK.w - 270);
      yazi(ctx, k.m, 162, y + 104, "500 22px Montserrat", R.acikMavi);
      ctx.font = "700 17px Montserrat"; ctx.letterSpacing = "2px";
      const ew = ctx.measureText(k.e).width + 26;
      ctx.strokeStyle = "rgba(24,209,227,0.6)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(162, y + 128, ew, 36, 18); ctx.stroke();
      ctx.fillStyle = R.turkuaz; ctx.fillText(k.e, 175, y + 152); ctx.letterSpacing = "0px";
      ctx.save(); ctx.strokeStyle = "rgba(143,216,255,0.7)"; ctx.lineWidth = 2.5; IKON.yerImi(ctx, EK.w - 70, y + 52, 16); ctx.restore();
      // dokunma dalgası
      if (secili) {
        const d = aralik(t, T.dokun1, T.dokun1 + 0.3);
        if (d > 0 && d < 1) {
          ctx.save(); ctx.beginPath(); ctx.roundRect(24, y, EK.w - 48, KART_H, 28); ctx.clip();
          ctx.fillStyle = `rgba(120,236,245,${0.35 * (1 - d)})`;
          ctx.beginPath(); ctx.arc(EK.w * 0.62, y + 110, 40 + d * 420, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
      }
    });
    // üst bölüm: başlık, arama, çipler (kartların üstünde kalır)
    const ust = ctx.createLinearGradient(0, 0, 0, 300);
    ust.addColorStop(0, "#071433"); ust.addColorStop(0.92, "#071433"); ust.addColorStop(1, "rgba(7,20,51,0)");
    ctx.fillStyle = ust; ctx.fillRect(0, 0, EK.w, 300);
    ctx.save();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(62, 74, 28, 0, Math.PI * 2); ctx.fill();
    ctx.clip(); ctx.drawImage(window.LOGO, 62 - 25, 74 - 25, 50, 50 * (window.LOGO.height / window.LOGO.width));
    ctx.restore();
    yazi(ctx, "Kariyer Pusulan", 106, 84, "800 28px Montserrat", R.beyaz);
    ctx.fillStyle = "rgba(143,216,255,0.1)"; ctx.beginPath(); ctx.roundRect(24, 126, EK.w - 48, 62, 31); ctx.fill();
    ctx.strokeStyle = "rgba(143,216,255,0.6)"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(62, 155, 11, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(70, 163); ctx.lineTo(78, 171); ctx.stroke();
    yazi(ctx, "Fırsat ara...", 92, 165, "500 24px Montserrat", "rgba(143,216,255,0.6)");
    // çipler: aktif çip görünür kalsın diye satır kayar
    const cipKay = lerp(0, 230, ease.inOut(aralik(t, 0.6, 1.5)));
    let cx = 24 - cipKay;
    ctx.font = "700 22px Montserrat";
    CIPLER.forEach((c, i) => {
      const w = ctx.measureText(c).width + 40;
      const ak = i === aktif;
      ctx.fillStyle = ak ? R.turkuaz : "rgba(18,50,114,0.8)";
      ctx.beginPath(); ctx.roundRect(cx, 214, w, 50, 25); ctx.fill();
      if (!ak) { ctx.strokeStyle = "rgba(143,216,255,0.25)"; ctx.lineWidth = 1.5; ctx.stroke(); }
      ctx.fillStyle = ak ? R.lacivert : R.acikMavi; ctx.fillText(c, cx + 20, 247);
      cx += w + 12;
    });
  }

  function detay(ctx, t) {
    const k = KARTLAR[SECILEN];
    ctx.fillStyle = "#071433"; ctx.fillRect(0, 0, EK.w, EK.h);
    const ust = ctx.createRadialGradient(EK.w / 2, 120, 10, EK.w / 2, 120, 520);
    ust.addColorStop(0, "rgba(24,209,227,0.18)"); ust.addColorStop(1, "rgba(24,209,227,0)");
    ctx.fillStyle = ust; ctx.fillRect(0, 0, EK.w, EK.h);
    ctx.save(); ctx.strokeStyle = R.acikMavi; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(62, 64); ctx.lineTo(46, 80); ctx.lineTo(62, 96); ctx.stroke(); ctx.restore();
    // yer imi butonu: dokununca dolar ve "pop" yapar
    const kayit = t >= T.dokun2;
    const pop = kayit ? 1 + 0.35 * Math.sin(Math.PI * clamp((t - T.dokun2) / 0.22)) : 1;
    ctx.save(); ctx.translate(EK.w - 70, 80); ctx.scale(pop, pop);
    ctx.fillStyle = kayit ? "rgba(24,209,227,0.2)" : "rgba(143,216,255,0.08)";
    ctx.beginPath(); ctx.arc(0, 0, 38, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = kayit ? R.turkuaz : R.acikMavi; ctx.fillStyle = R.turkuaz; ctx.lineWidth = 3; ctx.lineJoin = "round";
    IKON.yerImi(ctx, 0, 0, 17, kayit);
    ctx.restore();
    if (kayit) {
      const d = aralik(t, T.dokun2, T.dokun2 + 0.4);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2, r = 40 + d * 70;
        ctx.globalAlpha = 1 - d; ctx.fillStyle = R.turkuaz;
        ctx.beginPath(); ctx.arc(EK.w - 70 + Math.cos(a) * r, 80 + Math.sin(a) * r, 4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ikonKutusu(ctx, k.ikon, 110, 230, 150, { kalinlik: 4 });
    yazi(ctx, "Yapay Zekâ", 36, 380, "900 46px Montserrat", R.beyaz);
    yazi(ctx, "Bootcamp", 36, 434, "900 46px Montserrat", R.turkuaz);
    yazi(ctx, "8 hafta • Ücretsiz • Online", 36, 486, "500 24px Montserrat", R.acikMavi);
    let px = 36;
    ctx.font = "700 20px Montserrat";
    for (const e of ["Yapay Zekâ", "Python", "Sertifika"]) {
      const w = ctx.measureText(e).width + 32;
      ctx.strokeStyle = "rgba(24,209,227,0.6)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(px, 520, w, 44, 22); ctx.stroke();
      ctx.fillStyle = R.turkuaz; ctx.fillText(e, px + 16, 549); px += w + 12;
    }
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = "rgba(143,216,255,0.12)";
      ctx.beginPath(); ctx.roundRect(36, 610 + i * 46, [480, 440, 470, 400, 460, 300][i], 16, 8); ctx.fill();
    }
    // Başvur butonu
    const bas = t >= T.dokun3 - 0.02 && t < T.dokun3 + 0.1 ? 0.95 : 1;
    ctx.save(); ctx.translate(EK.w / 2, 1010); ctx.scale(bas, bas);
    const bg = ctx.createLinearGradient(-230, 0, 230, 0); bg.addColorStop(0, "#22E3EE"); bg.addColorStop(1, R.turkuaz);
    ctx.shadowColor = R.turkuaz; ctx.shadowBlur = 30;
    ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-230, -50, 460, 100, 50); ctx.fill(); ctx.shadowBlur = 0;
    ctx.font = "800 38px Montserrat"; ctx.fillStyle = R.lacivert; ctx.textBaseline = "middle";
    const bm = ctx.measureText("Başvur").width; ctx.fillText("Başvur", -bm / 2 - 22, 3);
    ctx.strokeStyle = R.lacivert; ctx.lineWidth = 5; ctx.lineCap = "round"; IKON.ok(ctx, bm / 2 + 8, 1, 18);
    ctx.restore();
  }

  function form(ctx, t) {
    ctx.fillStyle = "#071433"; ctx.fillRect(0, 0, EK.w, EK.h);
    yazi(ctx, "Adım 1 / 3", 36, 90, "700 22px Montserrat", R.turkuaz);
    ctx.fillStyle = "rgba(143,216,255,0.15)"; ctx.beginPath(); ctx.roundRect(36, 110, EK.w - 72, 10, 5); ctx.fill();
    ctx.fillStyle = R.turkuaz; ctx.beginPath(); ctx.roundRect(36, 110, (EK.w - 72) * lerp(0.05, 0.33, ease.out(aralik(t, T.form[1], T.form[1] + 0.4))), 10, 5); ctx.fill();
    yazi(ctx, "Başvuru Formu", 36, 190, "900 44px Montserrat", R.beyaz);
    yazi(ctx, "Yapay Zekâ Bootcamp", 36, 234, "600 24px Montserrat", R.acikMavi);
    ["Ad Soyad", "E-posta", "Üniversite", "Bölüm"].forEach((e, i) => {
      const y = 300 + i * 150;
      yazi(ctx, e, 36, y, "700 22px Montserrat", R.acikMavi);
      ctx.strokeStyle = i === 0 ? R.turkuaz : "rgba(143,216,255,0.3)"; ctx.lineWidth = i === 0 ? 2.5 : 1.5;
      ctx.beginPath(); ctx.roundRect(36, y + 18, EK.w - 72, 74, 18); ctx.stroke();
      if (i === 0 && Math.floor(t * 4) % 2 === 0) { ctx.fillStyle = R.turkuaz; ctx.fillRect(58, y + 38, 3, 34); }
    });
    ctx.fillStyle = "rgba(24,209,227,0.9)"; ctx.beginPath(); ctx.roundRect(52, 960, EK.w - 104, 96, 48); ctx.fill();
    ctx.font = "800 34px Montserrat"; ctx.fillStyle = R.lacivert; ctx.textAlign = "center"; ctx.fillText("Devam Et", EK.w / 2, 1020); ctx.textAlign = "left";
  }

  function ekran(ctx, t) {
    ctx.save();
    ctx.translate(EK.x, EK.y);
    ctx.beginPath(); ctx.roundRect(0, 0, EK.w, EK.h, EK.r); ctx.clip();
    ctx.fillStyle = "#071433"; ctx.fillRect(0, 0, EK.w, EK.h);
    const dg = ease.inOut(aralik(t, T.detay[0], T.detay[1]));
    const fg = ease.inOut(aralik(t, T.form[0], T.form[1]));
    if (dg < 1) { ctx.save(); ctx.translate(-EK.w * 0.3 * dg, 0); liste(ctx, t); ctx.restore(); }
    if (dg > 0 && fg < 1) {
      ctx.save(); ctx.translate(EK.w * (1 - dg), 0);
      ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 40; detay(ctx, t); ctx.restore();
    }
    if (fg > 0) { ctx.save(); ctx.translate(0, EK.h * (1 - fg)); form(ctx, t); ctx.restore(); }
    // durum çubuğu
    yazi(ctx, "13:21", 52, 40, "700 20px Montserrat", "rgba(255,255,255,0.85)");
    ctx.fillStyle = "#000"; ctx.beginPath(); ctx.roundRect(EK.w / 2 - 60, 14, 120, 34, 17); ctx.fill();
    ctx.restore();
  }

  function telefon(ctx, t) {
    // gövde ve kenar parlaması
    parlamaKatmani(ctx, (g) => {
      g.fillStyle = R.turkuaz; g.globalAlpha = 0.5;
      g.beginPath(); g.roundRect(TEL.x - 6, TEL.y - 6, TEL.w + 12, TEL.h + 12, TEL.r + 6); g.fill();
    }, { blur: 60, guc: 0.6 });
    const gg = ctx.createLinearGradient(TEL.x, 0, TEL.x + TEL.w, 0);
    gg.addColorStop(0, "#1B2E55"); gg.addColorStop(0.08, "#060B18"); gg.addColorStop(0.92, "#060B18"); gg.addColorStop(1, "#1B2E55");
    ctx.fillStyle = gg; ctx.beginPath(); ctx.roundRect(TEL.x, TEL.y, TEL.w, TEL.h, TEL.r); ctx.fill();
    ctx.strokeStyle = "rgba(143,216,255,0.45)"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(TEL.x, TEL.y, TEL.w, TEL.h, TEL.r); ctx.stroke();
    ekran(ctx, t);
  }

  // Başparmak: dokunma noktaları arasında gider gelir (ekran koordinatı)
  const PARMAK = [
    [0, 1100, 2200], [1.3, 1100, 2200], [T.dokun1 - 0.05, EK.x + EK.w * 0.62, EK.y + KART_Y0 + SECILEN * (KART_H + KART_ARA) - KAYDIR + 110],
    [T.dokun1 + 0.1, EK.x + EK.w * 0.62, EK.y + KART_Y0 + SECILEN * (KART_H + KART_ARA) - KAYDIR + 110],
    [T.dokun2 - 0.05, EK.x + EK.w - 70, EK.y + 80], [T.dokun2 + 0.1, EK.x + EK.w - 70, EK.y + 80],
    [T.dokun3 - 0.05, EK.x + EK.w / 2 + 150, EK.y + 1010], [T.dokun3 + 0.1, EK.x + EK.w / 2 + 150, EK.y + 1010],
    [3.45, 1150, 2300], [4, 1150, 2300],
  ];
  function parmak(ctx, t) {
    let i = 0; while (i < PARMAK.length - 2 && t > PARMAK[i + 1][0]) i++;
    const [t0, x0, y0] = PARMAK[i], [t1, x1, y1] = PARMAK[i + 1];
    const k = ease.inOut(aralik(t, t0, t1));
    const x = lerp(x0, x1, k), y = lerp(y0, y1, k);
    const basili = [T.dokun1, T.dokun2, T.dokun3].some((d) => t >= d - 0.04 && t <= d + 0.08);
    ctx.save(); ctx.translate(x, y + (basili ? 6 : 0)); ctx.rotate(-0.42); ctx.scale(0.9, 0.9);
    KP.basparmak(ctx);
    ctx.restore();
  }

  function kelimeler(ctx, t, dis = 1) {
    const parcalar = [["Keşfet.", T.dokun1], ["Kaydet.", T.dokun2], ["Başvur.", T.dokun3]];
    ctx.save();
    ctx.font = "900 70px Montserrat";
    const ara = 26, gen = parcalar.reduce((s, [m]) => s + ctx.measureText(m).width, 0) + ara * 2;
    let x = W / 2 - gen / 2;
    parcalar.forEach(([m, t0], i) => {
      const w = ctx.measureText(m).width;
      const k = ease.out(aralik(t, t0 - 0.08, t0 + 0.12));
      const sonraki = parcalar[i + 1] ? parcalar[i + 1][1] : 99;
      const aktif = t < sonraki - 0.08;
      ctx.globalAlpha = k * dis;
      // ortak yazı stiliyle aynı: eski stilde ışımalı geniş gradyan, keskin stilde dar gradyan + sert gölge
      const keskin = KP.YAZI.stil !== "eski";
      if (keskin) { ctx.shadowColor = "rgba(2,6,20,0.75)"; ctx.shadowBlur = 2; ctx.shadowOffsetY = 3; }
      if (aktif) {
        const g = ctx.createLinearGradient(0, 240, 0, 306);
        if (keskin) { g.addColorStop(0, "#2BE3F0"); g.addColorStop(1, "#1E7BFF"); }
        else { g.addColorStop(0, R.acikMavi); g.addColorStop(0.5, R.turkuaz); g.addColorStop(1, R.mavi); ctx.shadowColor = R.turkuaz; ctx.shadowBlur = 24; }
        ctx.fillStyle = g;
      } else { ctx.fillStyle = R.beyaz; if (!keskin) ctx.shadowBlur = 0; }
      ctx.fillText(m, x, 300 + (1 - k) * 20);
      x += w + ara;
    });
    ctx.restore();
  }

  window.KESITLER["06"] = {
    sure: SURE,
    ciz(ctx, t, kare) {
      const g = ctx.createRadialGradient(W / 2, 1000, 50, W / 2, 1000, 1300);
      g.addColorStop(0, "#0E2A63"); g.addColorStop(0.5, R.lacivert); g.addColorStop(1, R.gece);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.filter = "blur(30px)";
      for (const b of bokeh) { ctx.globalAlpha = b.a; ctx.fillStyle = b.renk; ctx.beginPath(); ctx.arc(b.x + Math.sin(t + b.r) * 20, b.y, b.r, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();

      // sonda kamera ekrana girer
      const z = ease.in(aralik(t, T.zoom[0], T.zoom[1]));
      const yuz = 1 + Math.sin(t * 1.3) * 0.004;
      ctx.save();
      const merkezX = EK.x + EK.w / 2, merkezY = EK.y + EK.h * 0.45;
      ctx.translate(merkezX, merkezY); ctx.scale(yuz * (1 + z * 5), yuz * (1 + z * 5)); ctx.rotate(Math.sin(t * 0.9) * 0.008); ctx.translate(-merkezX, -merkezY);
      telefon(ctx, t);
      parmak(ctx, t);
      ctx.restore();

      kelimeler(ctx, t, 1 - aralik(t, 3.5, 3.62));
      vinyet(ctx, 0.5);
      grain(ctx, kare, 0.05);
      // kesit 5'in yol ışığından açılış, sonda ışığa geçiş
      const acilis = 1 - ease.out(aralik(t, 0, 0.25));
      if (acilis > 0) { ctx.fillStyle = `rgba(120,236,245,${acilis * 0.85 * KP.gecisIsigi()})`; ctx.fillRect(0, 0, W, H); }
      const kapanis = ease.in(aralik(t, 3.8, 4.0));
      if (kapanis > 0) { ctx.fillStyle = `rgba(160,225,250,${kapanis * 0.9 * KP.gecisIsigi()})`; ctx.fillRect(0, 0, W, H); }
    },
  };
})();
