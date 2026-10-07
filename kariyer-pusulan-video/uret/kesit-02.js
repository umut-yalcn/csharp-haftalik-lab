// Kesit 2 — Fırsatlar & "Başvur" butonu (0:03–0:06). Bkz. ../kesit-02.md
// Dört hızlı vuruş: staj, burs, eğitim kartları ve son olarak "Başvur" butonu; dokununca ışık kareyi kaplar.
(function () {
  const { W, H, R, aralik, ease, lerp, clamp, rastgele, satir, parlamaKatmani, grain, vinyet, ikonKutusu, IKON } = window.KP;

  const SURE = 3, VURUS = 0.75;
  const KARTLAR = [
    { ikon: "canta", baslik: "Yazılım Stajı", alt: "Son başvuru: 30 Kasım", etiket: "STAJ", kelime: "staj." },
    { ikon: "kep", baslik: "Lisans Bursu", alt: "Aylık destek • 9 ay", etiket: "BURS", kelime: "burs." },
    { ikon: "kitap", baslik: "Veri Bilimi Eğitimi", alt: "Ücretsiz • Sertifikalı", etiket: "EĞİTİM", kelime: "eğitim." },
  ];

  const cizgiler = (() => { const r = rastgele(202); return Array.from({ length: 46 }, () => ({ y: r() * H, w: 80 + r() * 380, hiz: 1800 + r() * 2600, x0: r() * W * 2, a: 0.05 + r() * 0.18 })); })();

  function zemin(ctx, t, vurus) {
    const g = ctx.createRadialGradient(W / 2, 1050, 60, W / 2, 1050, 1200);
    g.addColorStop(0, "#123272"); g.addColorStop(0.5, R.lacivert); g.addColorStop(1, R.gece);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // hız çizgileri: her vuruşun başında hızlanır
    const yerel = (t % VURUS) / VURUS, hizlan = 0.35 + 1.4 * Math.exp(-yerel * 6);
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (const c of cizgiler) {
      const x = W - ((c.x0 + t * c.hiz * hizlan) % (W + c.w * 2)) + c.w;
      const lg = ctx.createLinearGradient(x, 0, x + c.w, 0);
      lg.addColorStop(0, "rgba(24,209,227,0)"); lg.addColorStop(1, `rgba(24,209,227,${c.a * hizlan})`);
      ctx.fillStyle = lg; ctx.fillRect(x, c.y, c.w, 2);
    }
    ctx.restore();
  }

  function kart(ctx, k, giris, t) {
    // sağdan hızlı giriş, hareket bulanıklığı için iz bırakır
    const e = ease.out(giris), x0 = lerp(760, 0, e), olcek = 1 + 0.04 * t;
    const cx = W / 2, cy = 1060, w = 800, h = 540;
    const ciz = (dx, alfa) => {
      ctx.save();
      ctx.globalAlpha = alfa;
      ctx.translate(cx + dx, cy); ctx.scale(olcek, olcek); ctx.translate(-w / 2, -h / 2);
      const gg = ctx.createLinearGradient(0, 0, 0, h);
      gg.addColorStop(0, "rgba(18,50,114,0.95)"); gg.addColorStop(1, "rgba(6,20,52,0.95)");
      ctx.fillStyle = gg; ctx.beginPath(); ctx.roundRect(0, 0, w, h, 36); ctx.fill();
      ctx.strokeStyle = R.turkuaz; ctx.lineWidth = 2.5; ctx.shadowColor = R.turkuaz; ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.roundRect(0, 0, w, h, 36); ctx.stroke(); ctx.shadowBlur = 0;
      ikonKutusu(ctx, k.ikon, 120, 120, 150, { kalinlik: 4 });
      // etiket
      ctx.font = "700 26px Montserrat"; ctx.letterSpacing = "3px";
      const ew = ctx.measureText(k.etiket).width + 40;
      ctx.strokeStyle = "rgba(24,209,227,0.7)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(w - 50 - ew, 62, ew, 52, 26); ctx.stroke();
      ctx.fillStyle = R.turkuaz; ctx.textBaseline = "middle"; ctx.fillText(k.etiket, w - 50 - ew + 20, 90);
      ctx.letterSpacing = "0px";
      // başlık ve alt satır
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = R.beyaz; ctx.font = "800 58px Montserrat"; ctx.fillText(k.baslik, 56, 290);
      ctx.fillStyle = R.acikMavi; ctx.font = "500 34px Montserrat"; ctx.fillText(k.alt, 56, 350);
      // alt şerit: ilerleme çubuğu ve "Detaylar"
      ctx.fillStyle = "rgba(143,216,255,0.15)"; ctx.beginPath(); ctx.roundRect(56, 410, 420, 12, 6); ctx.fill();
      const dolu = ctx.createLinearGradient(56, 0, 476, 0); dolu.addColorStop(0, R.mavi); dolu.addColorStop(1, R.turkuaz);
      ctx.fillStyle = dolu; ctx.beginPath(); ctx.roundRect(56, 410, 420 * clamp(0.3 + t * 0.5), 12, 6); ctx.fill();
      ctx.fillStyle = R.beyaz; ctx.font = "700 32px Montserrat"; ctx.fillText("Detaylar", w - 260, 470);
      ctx.save(); ctx.strokeStyle = R.turkuaz; ctx.lineWidth = 4; ctx.lineCap = "round"; IKON.ok(ctx, w - 82, 459, 18); ctx.restore();
      ctx.restore();
    };
    if (giris < 1) for (let i = 4; i >= 1; i--) ciz(x0 + i * 70 * (1 - e), 0.12 * (1 - e));
    ciz(x0, clamp(giris * 3));
  }

  // Son vuruş: telefon ekranında "Başvur" butonu, parmak dokunur, ışık patlar
  function basvur(ctx, t) {
    const yerel = t - 3 * VURUS, giris = ease.out(aralik(yerel, 0, 0.18));
    const ekran = { x: 190, y: 700, w: 700, h: 1000 };
    const bas = aralik(yerel, 0.3, 0.36), birak = aralik(yerel, 0.36, 0.42);
    const butonOlcek = 1 - 0.05 * bas + 0.05 * birak;
    ctx.save();
    ctx.globalAlpha = clamp(giris * 2);
    ctx.translate(0, (1 - giris) * 140);
    // ekran
    ctx.fillStyle = "rgba(6,18,46,0.96)";
    ctx.beginPath(); ctx.roundRect(ekran.x, ekran.y, ekran.w, ekran.h, 60); ctx.fill();
    ctx.strokeStyle = "rgba(143,216,255,0.35)"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(ekran.x, ekran.y, ekran.w, ekran.h, 60); ctx.stroke();
    // özet içerik
    ikonKutusu(ctx, "canta", ekran.x + 120, ekran.y + 140, 120, { kalinlik: 3.5 });
    ctx.fillStyle = R.beyaz; ctx.font = "800 46px Montserrat"; ctx.fillText("Yazılım Stajı", ekran.x + 210, ekran.y + 130);
    ctx.fillStyle = R.acikMavi; ctx.font = "500 30px Montserrat"; ctx.fillText("Son başvuru: 30 Kasım", ekran.x + 210, ekran.y + 178);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = "rgba(143,216,255,0.12)";
      ctx.beginPath(); ctx.roundRect(ekran.x + 60, ekran.y + 280 + i * 56, [560, 480, 520, 360][i], 18, 9); ctx.fill();
    }
    // buton
    const bx = W / 2, by = ekran.y + 690, bw = 520, bh = 130;
    parlamaKatmani(ctx, (g) => {
      g.fillStyle = R.turkuaz; g.globalAlpha = 0.8 + 0.2 * Math.sin(t * 9);
      g.beginPath(); g.roundRect(bx - bw / 2, by - bh / 2, bw, bh, bh / 2); g.fill();
    }, { blur: 36, guc: 0.9 });
    ctx.save();
    ctx.translate(bx, by); ctx.scale(butonOlcek, butonOlcek);
    const bg = ctx.createLinearGradient(-bw / 2, 0, bw / 2, 0); bg.addColorStop(0, "#22E3EE"); bg.addColorStop(1, R.turkuaz);
    ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, bh / 2); ctx.fill();
    ctx.fillStyle = R.lacivert; ctx.font = "800 56px Montserrat"; ctx.textBaseline = "middle";
    const bm = ctx.measureText("Başvur").width;
    ctx.fillText("Başvur", -bm / 2 - 30, 4);
    ctx.strokeStyle = R.lacivert; ctx.lineWidth = 7; ctx.lineCap = "round"; IKON.ok(ctx, bm / 2 + 10, 2, 26);
    ctx.restore();
    // parmak ucu (sağ alttan gelir)
    const pk = ease.inOut(aralik(yerel, 0.05, 0.32)), pc = ease.in(aralik(yerel, 0.42, 0.6));
    const px = lerp(1000, bx + 175, pk) + pc * 200, py = lerp(1900, by + 30, pk) + pc * 500 + bas * 8 - birak * 8;
    ctx.save();
    ctx.translate(px, py); ctx.rotate(-0.45);
    KP.basparmak(ctx);
    ctx.restore();
    ctx.restore();
    return { bx, by };
  }

  window.KESITLER["02"] = {
    sure: SURE,
    ciz(ctx, t, kare) {
      const vurus = Math.min(3, Math.floor(t / VURUS)), yerel = t - vurus * VURUS;
      zemin(ctx, t, vurus);

      if (vurus < 3) {
        const k = KARTLAR[vurus];
        kart(ctx, k, aralik(yerel, 0, 0.16), yerel);
        satir(ctx, [{ m: "Bir " }, { m: k.kelime, renk: "gradyan" }], { y: 600, boy: 120, agirlik: 900, k: aralik(yerel, 0.02, 0.16), parlama: 18 });
        vinyet(ctx, 0.55);
      } else {
        const { bx, by } = basvur(ctx, t);
        satir(ctx, [{ m: "Belki de" }], { y: 430, boy: 84, agirlik: 800, k: aralik(yerel, 0.0, 0.14) });
        satir(ctx, [{ m: "o tek başvuru.", renk: "gradyan" }], { y: 540, boy: 92, agirlik: 900, k: aralik(yerel, 0.06, 0.2), parlama: 22 });
        vinyet(ctx, 0.5);
        // dokunuştan çıkan ışık bütün kareyi kaplar
        const p = ease.in(aralik(yerel, 0.38, 0.75));
        if (p > 0) {
          const r = lerp(40, 2400, p);
          const g = ctx.createRadialGradient(bx, by, 0, bx, by, r);
          g.addColorStop(0, `rgba(235,252,255,${clamp(p * 2)})`); g.addColorStop(0.6, `rgba(120,236,245,${clamp(p * 1.6)})`); g.addColorStop(1, "rgba(24,209,227,0)");
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
          if (p > 0.8) { ctx.fillStyle = `rgba(235,252,255,${(p - 0.8) * 5})`; ctx.fillRect(0, 0, W, H); }
        }
      }
      // vuruş kesmelerinde kısa ışık sızıntısı
      for (let i = 1; i < 4; i++) {
        const d = Math.abs(t - i * VURUS);
        if (d < 0.05) { ctx.fillStyle = `rgba(120,236,245,${0.25 * (1 - d / 0.05)})`; ctx.fillRect(0, 0, W, H); }
      }
      grain(ctx, kare, 0.05);
      // kesit 1'in flaşından açılış
      const acilis = 1 - ease.out(aralik(t, 0, 0.22));
      if (acilis > 0) { ctx.fillStyle = `rgba(230,251,255,${acilis})`; ctx.fillRect(0, 0, W, H); }
    },
  };
})();
