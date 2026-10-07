// Kesit 8 — Outro, logo ve CTA (0:22–0:25). Bkz. ../kesit-08.md
(function () {
  const { W, H, R, aralik, ease, lerp, satir, parcacikSeti, parcaciklar, parlamaKatmani, grain, vinyet,
    yuvarlakDikdortgen, kureIkonu, pusulaGulu } = window.KP;

  const SURE = 3;
  const ROZET = { x: W / 2, y: 560, r: 145 };
  const LOGO_GENISLIK = 240; // dosya 224 px; bundan büyüğü bulanıklaşır
  const parcacik = parcacikSeti(808, 70);

  function zemin(ctx, t) {
    const g = ctx.createRadialGradient(W / 2, 640, 40, W / 2, 900, 1300);
    g.addColorStop(0, "#0E2A63");
    g.addColorStop(0.45, R.lacivert);
    g.addColorStop(1, R.gece);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    pusulaGulu(ctx, W / 2, 900, 640, t * 0.035, R.acikMavi, 0.07);
  }

  function rozet(ctx, t) {
    const k = ease.outBack(aralik(t, 0.0, 0.5));
    const alfa = ease.out(aralik(t, 0.0, 0.35));
    if (alfa <= 0) return;
    const olcek = lerp(0.9, 1, k);
    const nabiz = 0.85 + 0.15 * Math.sin(t * 2.4);

    // turkuaz hale
    parlamaKatmani(ctx, (g) => {
      g.globalAlpha = alfa * nabiz;
      g.fillStyle = R.turkuaz;
      g.beginPath(); g.arc(ROZET.x, ROZET.y, ROZET.r * olcek + 8, 0, Math.PI * 2); g.fill();
    }, { blur: 46, guc: 0.9 });

    ctx.save();
    ctx.globalAlpha = alfa;
    ctx.translate(ROZET.x, ROZET.y);
    ctx.scale(olcek, olcek);
    // ince turkuaz çerçeve
    ctx.strokeStyle = R.turkuaz; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, ROZET.r + 9, 0, Math.PI * 2); ctx.stroke();
    // beyaz rozet; logo değiştirilmeden içine konur, kırpma yalnızca beyaz köşeleri alır
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath(); ctx.arc(0, 0, ROZET.r, 0, Math.PI * 2); ctx.fill();
    ctx.clip();
    const lw = LOGO_GENISLIK, lh = LOGO_GENISLIK * (window.LOGO.height / window.LOGO.width);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(window.LOGO, -lw / 2, -lh / 2, lw, lh);
    ctx.restore();
  }

  function siteHapi(ctx, t) {
    const k = ease.out(aralik(t, 1.45, 1.85));
    if (k <= 0) return;
    const metin = "KariyerPusulan.com";
    ctx.save();
    ctx.font = "600 40px Montserrat";
    const mw = ctx.measureText(metin).width;
    const ikon = 30, bosluk = 18, ic = 44;
    const w = ic * 2 + ikon * 2 + bosluk + mw, h = 92;
    const x = W / 2 - w / 2, y = 1290 - h / 2 + (1 - k) * 22;
    ctx.globalAlpha = k;
    ctx.fillStyle = "rgba(10,31,77,0.55)";
    yuvarlakDikdortgen(ctx, x, y, w, h, h / 2); ctx.fill();
    ctx.strokeStyle = R.turkuaz; ctx.lineWidth = 2.5; ctx.shadowColor = R.turkuaz; ctx.shadowBlur = 18;
    yuvarlakDikdortgen(ctx, x, y, w, h, h / 2); ctx.stroke();
    ctx.shadowBlur = 0;
    kureIkonu(ctx, x + ic + ikon, y + h / 2, ikon * 0.72, R.turkuaz);
    ctx.fillStyle = R.beyaz; ctx.textBaseline = "middle";
    ctx.fillText(metin, x + ic + ikon * 2 + bosluk, y + h / 2 + 2);
    ctx.restore();
  }

  window.KESITLER["08"] = {
    sure: SURE,
    ciz(ctx, t, kare) {
      zemin(ctx, t);
      parcaciklar(ctx, parcacik, t, { alfa: 0.8 });
      rozet(ctx, t);

      satir(ctx, [{ m: "2.500", renk: "gradyan" }, { m: " kişi" }],
        { y: 870, boy: 112, agirlik: 900, k: aralik(t, 0.4, 0.75), parlama: 22 });
      satir(ctx, [{ m: "pusulasını buldu." }],
        { y: 985, boy: 80, agirlik: 800, k: aralik(t, 0.55, 0.9) });
      satir(ctx, [{ m: "Sıradaki sen misin?" }],
        { y: 1125, boy: 68, agirlik: 800, renk: R.turkuaz, k: aralik(t, 1.05, 1.4), parlama: 26 });
      siteHapi(ctx, t);
      satir(ctx, [{ m: "Keşfet " }, { m: "•", renk: R.turkuaz }, { m: " Kaydet " }, { m: "•", renk: R.turkuaz }, { m: " Başvur" }],
        { y: 1428, boy: 34, agirlik: 600, renk: R.acikMavi, aralikHarf: 5, k: aralik(t, 1.65, 2.0) });

      vinyet(ctx, 0.55);
      grain(ctx, kare, 0.05);
      // kesit 7'den lacivertle açılış
      const acilis = 1 - ease.out(aralik(t, 0, 0.3));
      if (acilis > 0) { ctx.fillStyle = `rgba(10,31,77,${acilis})`; ctx.fillRect(0, 0, W, H); }
    },
  };
})();
