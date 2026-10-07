// Kesit 7 — Birlikte yürüyüş & gün batımı (0:19–0:22). Bkz. ../kesit-07.md
// Gün batımında altı genç arkadan, ağır çekimde ufka doğru yürür. Sıcak ışık yalnızca ufukta;
// gökyüzünün geri kalanı lacivert-turkuaz. Sonda kamera yukarı bakar, kare marka laciverdine döner.
(function () {
  const { W, H, R, aralik, ease, lerp, clamp, rastgele, satir, yaziGolgesi, parlamaKatmani, grain, vinyet, poz, figur } = window.KP;

  const SURE = 3, UFUK = 1140, KX = 540;
  // Kadrodan altı kişi; uzaktakiler (küçük y) önce çizilir
  const GRUP = [
    { ad: "can", x: 395, y: 1690, o: 0.8, faz: 0.55 },
    { ad: "emre", x: 850, y: 1695, o: 0.79, faz: 0.05 },
    { ad: "zeynep", x: 610, y: 1700, o: 0.82, faz: 0.8 },
    { ad: "elif", x: 250, y: 1720, o: 0.8, faz: 0.1 },
    { ad: "ayse", x: 720, y: 1730, o: 0.8, faz: 0.45 },
    { ad: "deniz", x: 500, y: 1745, o: 0.85, faz: 0.3 },
  ];
  // Sinematik stil: güneş karşıda, sırtlar gölgede; kenarlar sıcak ışık alır
  const STIL = { tip: "sinematik", karartma: "rgba(12,24,58,0.42)" };
  const KENAR = [[3, 0, "rgba(255,206,150,0.55)"], [-3, 0, "rgba(255,206,150,0.55)"], [0, 3, "rgba(255,225,180,0.7)"], [0, 5, "rgba(255,190,130,0.55)", 6]];
  const lambalar = [-1, 1].flatMap((s) => [0, 1, 2, 3, 4].map((i) => ({ s, i })));

  function gokyuzu(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, UFUK);
    g.addColorStop(0, "#071640"); g.addColorStop(0.45, "#13407F"); g.addColorStop(0.78, "#2F78B5");
    g.addColorStop(0.92, "#E7A35C"); g.addColorStop(1, "#F5B83D");
    ctx.fillStyle = g; ctx.fillRect(0, -400, W, H + 400);
    // güneş ve parlaması
    parlamaKatmani(ctx, (gg) => {
      gg.fillStyle = "#FFD58A"; gg.beginPath(); gg.arc(KX, UFUK + 10, 90, 0, Math.PI * 2); gg.fill();
    }, { blur: 70, guc: 1 });
    const p = ctx.createRadialGradient(KX, UFUK, 20, KX, UFUK, 900);
    p.addColorStop(0, "rgba(255,214,150,0.6)"); p.addColorStop(0.3, "rgba(255,180,110,0.18)"); p.addColorStop(1, "rgba(255,180,110,0)");
    ctx.fillStyle = p; ctx.fillRect(0, -400, W, H + 400);
    ctx.fillStyle = "#FFF1D2"; ctx.beginPath(); ctx.arc(KX, UFUK + 12, 62, Math.PI, Math.PI * 2); ctx.fill();
    // ince bulutlar
    ctx.save(); ctx.filter = "blur(8px)";
    const r = rastgele(707);
    for (let i = 0; i < 7; i++) {
      const y = 760 + r() * 300, x = r() * W - t * 10;
      ctx.fillStyle = `rgba(255,190,140,${0.12 + r() * 0.12})`;
      ctx.beginPath(); ctx.ellipse(x, y, 160 + r() * 200, 10 + r() * 8, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function yol(ctx, t) {
    const g = ctx.createLinearGradient(0, UFUK, 0, H);
    g.addColorStop(0, "#3A3C5C"); g.addColorStop(0.15, "#13244F"); g.addColorStop(1, "#050D24");
    ctx.fillStyle = g; ctx.fillRect(0, UFUK, W, H - UFUK);
    // güneşin yoldaki yansıması
    const y = ctx.createLinearGradient(0, UFUK, 0, H);
    y.addColorStop(0, "rgba(255,200,130,0.55)"); y.addColorStop(1, "rgba(255,200,130,0)");
    ctx.fillStyle = y; ctx.beginPath(); ctx.moveTo(KX - 40, UFUK); ctx.lineTo(KX + 40, UFUK); ctx.lineTo(KX + 260, H); ctx.lineTo(KX - 260, H); ctx.closePath(); ctx.fill();
    // perspektif çizgileri ve kameraya doğru akan derzler
    ctx.strokeStyle = "rgba(143,216,255,0.16)"; ctx.lineWidth = 2;
    for (let i = -6; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(KX + i * 8, UFUK); ctx.lineTo(KX + i * 260, H); ctx.stroke(); }
    for (let i = 0; i < 14; i++) {
      const k = ((i + t * 0.35) % 14) / 14, yy = UFUK + Math.pow(k, 2.2) * (H - UFUK);
      ctx.globalAlpha = 0.1 + k * 0.15; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // kenardaki lambalar (turkuaz ışık)
    for (const { s, i } of lambalar) {
      const k = Math.pow((i + 1) / 6, 1.8), x = KX + s * lerp(30, 640, k), yy = UFUK + k * (H - UFUK) * 0.6, boy = lerp(30, 420, k);
      ctx.fillStyle = "#040A1C"; ctx.fillRect(x - 2 * k - 1, yy - boy, 4 * k + 2, boy);
      parlamaKatmani(ctx, (gg) => { gg.fillStyle = R.turkuaz; gg.beginPath(); gg.arc(x, yy - boy, 4 + 10 * k, 0, Math.PI * 2); gg.fill(); }, { blur: 14, guc: 0.9 });
    }
  }

  // kalp ikonu (💙 yerine; emoji fontu platforma göre değiştiği için çizilir)
  function kalp(ctx, x, y, r, k) {
    if (k <= 0) return;
    ctx.save();
    ctx.translate(x, y); ctx.scale(ease.outBack(k), ease.outBack(k));
    const g = ctx.createLinearGradient(0, -r, 0, r); g.addColorStop(0, R.turkuaz); g.addColorStop(1, R.mavi);
    ctx.fillStyle = g; ctx.shadowColor = R.turkuaz; ctx.shadowBlur = 24;
    ctx.beginPath(); ctx.moveTo(0, r * 0.9);
    ctx.bezierCurveTo(-r * 1.4, -r * 0.1, -r * 0.7, -r * 1.2, 0, -r * 0.45);
    ctx.bezierCurveTo(r * 0.7, -r * 1.2, r * 1.4, -r * 0.1, 0, r * 0.9);
    ctx.fill();
    ctx.restore();
  }

  window.KESITLER["07"] = {
    sure: SURE,
    ciz(ctx, t, kare) {
      const yukari = ease.inOut(aralik(t, 2.1, 3.0)); // kamera yukarı bakar: sahne aşağı kayar
      ctx.save(); ctx.translate(0, yukari * 260);
      gokyuzu(ctx, t);
      yol(ctx, t);
      for (const k of KP.insanVar() ? GRUP : []) {
        ctx.fillStyle = "rgba(4,8,20,0.45)"; ctx.beginPath(); ctx.ellipse(k.x, k.y + 18, 62, 11, 0, 0, Math.PI * 2); ctx.fill();
        const p = KP.poz2.yuru((k.faz + t / 2.4) % 1); // ağır çekim adımlar
        KP.karakter(ctx, p, KP.kadro(k.ad, "arka"), { x: k.x, y: k.y, olcek: k.o, stil: STIL, kenarIsigi: KENAR });
      }
      ctx.restore();
      vinyet(ctx, 0.55);

      // "İyi ki varsınız." elle yazılıyormuş gibi soldan sağa açılır
      ctx.save();
      ctx.font = "700 128px 'Dancing Script'";
      const metin = "İyi ki varsınız.", mw = ctx.measureText(metin).width, kalpBoy = 46;
      const x0 = W / 2 - (mw + kalpBoy * 2.4) / 2, yaz = ease.inOut(aralik(t, 0.25, 1.25));
      yaziGolgesi(ctx, 480, 380, 0.3);
      ctx.beginPath(); ctx.rect(x0 - 20, 280, (mw + 40) * yaz, 260); ctx.clip();
      ctx.fillStyle = R.beyaz;
      if (KP.YAZI.stil === "eski") { ctx.shadowColor = "rgba(143,216,255,0.6)"; ctx.shadowBlur = 18; }
      else { ctx.shadowColor = "rgba(2,6,20,0.7)"; ctx.shadowBlur = 3; ctx.shadowOffsetY = 3; } // ışıma yok, keskin
      ctx.fillText(metin, x0, 460);
      ctx.restore();
      kalp(ctx, x0 + mw + kalpBoy * 1.4, 420, kalpBoy, aralik(t, 1.15, 1.45));
      satir(ctx, [{ m: "Daha " }, { m: "yeni başlıyoruz.", renk: "gradyan" }], { y: 600, boy: 70, agirlik: 900, k: aralik(t, 1.5, 1.8), parlama: 18 });

      grain(ctx, kare, 0.06);
      // kesit 6'nın ekran ışığından açılış; sonda kare marka laciverdine döner (kesit 8 bu renkten açılır)
      const acilis = 1 - ease.out(aralik(t, 0, 0.3));
      if (acilis > 0) { ctx.fillStyle = `rgba(160,225,250,${acilis * 0.9 * KP.gecisIsigi()})`; ctx.fillRect(0, 0, W, H); }
      const lacivert = ease.in(aralik(t, 2.45, 3.0));
      if (lacivert > 0) { ctx.fillStyle = `rgba(10,31,77,${lacivert})`; ctx.fillRect(0, 0, W, H); }
    },
  };
})();
