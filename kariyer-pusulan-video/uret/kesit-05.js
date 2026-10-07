// Kesit 5 — Geleceğe bakış & turkuaz yol (0:12–0:15). Bkz. ../kesit-05.md
// Çatıdan şehre bakan mezun silüeti; ayaklarının altından şehre kıvrılarak akan ışık nehri
// (feed'deki KP Rehber motifi). Kamera yavaşça yükselir.
(function () {
  const { W, H, R, aralik, ease, lerp, clamp, rastgele, tuval, satir, yaziGolgesi, parcacikSeti, parcaciklar,
    parlamaKatmani, grain, vinyet } = window.KP;

  const SURE = 3;
  const UFUK = 1060;        // kamera yükselmeden önceki ufuk çizgisi
  const KAYIP = { x: 410 }; // yolun ufukta kaybolduğu nokta
  const ZEMIN_KENAR = 1430; // çatı terasının kenarı
  const AYAK = { x: 650, y: 1610 };
  const FIGUR_OLCEK = 0.8;

  // Kamera yükselirken yakındaki her şey uzaktakinden daha çok aşağı kayar.
  const kaydirma = (y, c) => {
    const d = clamp((y - UFUK) / (H - UFUK));
    return 70 * c + 170 * c * Math.pow(d, 0.9);
  };

  // --- durağan katmanlar bir kez çizilir ---
  const SEHIR_Y = 520; // şehir tuvalinde ufuk çizgisinin yeri
  const sehir = tuval(W, SEHIR_Y + 10);
  const yildizlar = (() => { const r = rastgele(55); return Array.from({ length: 120 }, () => ({ x: r() * W, y: r() * 760, b: r() })); })();

  (function sehirCiz() {
    const g = sehir.getContext("2d"), r = rastgele(2026);
    // uzak, puslu sıra
    g.fillStyle = "#0E2A5C";
    for (let x = -20; x < W; ) {
      const w = 26 + r() * 50, h = 30 + r() * (x < 620 ? 150 : 50);
      g.fillRect(x, SEHIR_Y - h, w, h); x += w * 0.8;
    }
    // yakın sıra: binalar ve pencereler
    const binalar = [];
    for (let x = -30; x < 640; ) {
      const w = 34 + r() * 70;
      const kule = r() < 0.12;
      const h = kule ? 190 + r() * 70 : 45 + r() * 150;
      binalar.push({ x, w, h, kule }); x += w * (0.75 + r() * 0.3);
    }
    for (const b of binalar) {
      g.fillStyle = "#061433";
      g.fillRect(b.x, SEHIR_Y - b.h, b.w, b.h);
      if (b.kule) { g.fillRect(b.x + b.w / 2 - 2, SEHIR_Y - b.h - 46, 4, 46); }
      for (let wy = SEHIR_Y - b.h + 10; wy < SEHIR_Y - 6; wy += 9) {
        for (let wx = b.x + 5; wx < b.x + b.w - 5; wx += 8) {
          const s = r();
          if (s < 0.2) {
            g.fillStyle = s < 0.025 ? "rgba(255,206,140,0.85)" : s < 0.12 ? "rgba(24,209,227,0.75)" : "rgba(143,216,255,0.55)";
            g.fillRect(wx, wy, 3, 2);
          }
        }
      }
      if (b.kule) { g.fillStyle = "#FF5A6A"; g.fillRect(b.x + b.w / 2 - 2, SEHIR_Y - b.h - 48, 4, 4); }
    }
    // karşı kıyı tepeleri ve ışıkları
    g.fillStyle = "#081A3E";
    g.beginPath(); g.moveTo(600, SEHIR_Y);
    for (let x = 600; x <= W; x += 20) g.lineTo(x, SEHIR_Y - 28 - Math.sin(x * 0.012) * 18 - r() * 6);
    g.lineTo(W, SEHIR_Y); g.closePath(); g.fill();
    for (let i = 0; i < 160; i++) {
      g.fillStyle = r() < 0.5 ? "rgba(143,216,255,0.6)" : "rgba(255,206,140,0.5)";
      g.fillRect(600 + r() * 480, SEHIR_Y - 4 - r() * 34, 2, 2);
    }
    // asma köprü (Boğaz köprüsü havası)
    const tabliye = SEHIR_Y - 46, kuleler = [700, 1010], kuleTepe = SEHIR_Y - 250;
    g.fillStyle = "#04102A";
    g.fillRect(520, tabliye, W - 520, 8);
    for (const kx of kuleler) {
      g.fillRect(kx - 9, kuleTepe, 6, SEHIR_Y - kuleTepe);
      g.fillRect(kx + 3, kuleTepe, 6, SEHIR_Y - kuleTepe);
      for (const yy of [kuleTepe + 8, kuleTepe + 90, tabliye - 6]) g.fillRect(kx - 9, yy, 18, 5);
      g.fillStyle = "#FF5A6A"; g.fillRect(kx - 2, kuleTepe - 5, 4, 4); g.fillStyle = "#04102A";
    }
    const kablo = (x) => {
      if (x < kuleler[0]) { const k = (x - 520) / (kuleler[0] - 520); return lerp(tabliye, kuleTepe, Math.pow(k, 1.6)); }
      if (x <= kuleler[1]) { const k = (x - kuleler[0]) / (kuleler[1] - kuleler[0]); return kuleTepe + (tabliye - 10 - kuleTepe) * (1 - Math.pow(2 * k - 1, 2)); }
      const k = (x - kuleler[1]) / 300; return lerp(kuleTepe, tabliye, Math.min(1, Math.pow(k, 0.7)));
    };
    g.strokeStyle = "#0A1E46"; g.lineWidth = 2.5;
    g.beginPath(); for (let x = 520; x <= W; x += 4) g.lineTo(x, kablo(x)); g.stroke();
    g.lineWidth = 1;
    for (let x = 530; x < W; x += 14) { g.beginPath(); g.moveTo(x, kablo(x)); g.lineTo(x, tabliye); g.stroke(); }
    // köprü ışıkları
    for (let x = 524; x < W; x += 11) {
      g.fillStyle = "rgba(24,209,227,0.95)"; g.fillRect(x, tabliye - 2, 3, 3);
      g.fillStyle = "rgba(30,107,255,0.8)"; g.fillRect(x, kablo(x) - 1, 2, 2);
    }
  })();

  // Işık nehrinin orta çizgisi: s=0 kameranın altı, s=1 ufuk.
  function yolNoktasi(s, c, t) {
    const yTaban = UFUK + (H + 60 - UFUK) * Math.pow(1 - s, 2.2);
    const sAyak = 0.215; // ayakların hizası
    const f = Math.pow(Math.max(0, (1 - s) / (1 - sAyak)), 0.8);
    const kivrim = 270 * Math.pow(1 - s, 1.05) * Math.sin(Math.PI * 2.6 * (s - sAyak) + t * 0.08);
    const x = KAYIP.x + (AYAK.x - KAYIP.x) * f - kivrim;
    const genislik = 330 * Math.pow(1 - s, 1.75) + 2.5;
    return { x, y: yTaban + kaydirma(yTaban, c), w: genislik };
  }

  function yolSekli(g, c, t, sSon, olcekGenislik = 1) {
    const N = 160, sol = [], sag = [];
    for (let i = 0; i <= N; i++) {
      const s = (i / N) * sSon;
      const p = yolNoktasi(s, c, t), q = yolNoktasi(Math.min(1, s + 0.004), c, t);
      const dx = q.x - p.x, dy = q.y - p.y, l = Math.hypot(dx, dy) || 1;
      const nx = -dy / l, ny = dx / l, w = (p.w * olcekGenislik) / 2;
      sol.push([p.x + nx * w, p.y + ny * w]); sag.push([p.x - nx * w, p.y - ny * w]);
    }
    g.beginPath();
    sol.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    for (let i = sag.length - 1; i >= 0; i--) g.lineTo(sag[i][0], sag[i][1]);
    g.closePath();
  }

  const akanIsiklar = (() => { const r = rastgele(505); return Array.from({ length: 90 }, () => ({ s0: r(), yan: (r() - 0.5) * 0.8, hiz: 0.07 + r() * 0.08, b: 1 + r() * 2.2 })); })();

  function isikNehri(ctx, c, t, guc) {
    const sSon = ease.out(aralik(t, 0, 0.9)) * 0.995 + 0.005;
    // geniş turkuaz parlama
    parlamaKatmani(ctx, (g) => {
      g.fillStyle = R.turkuaz; g.globalAlpha = 0.55 * guc;
      yolSekli(g, c, t, sSon, 2.2); g.fill();
      g.fillStyle = R.mavi; g.globalAlpha = 0.6 * guc;
      yolSekli(g, c, t, sSon, 1.2); g.fill();
    }, { blur: 40, guc: 1 });
    // gövde: kenarlarda mavi, ortada turkuaz-beyaz
    ctx.save();
    ctx.filter = "blur(5px)";
    for (const [olcek, renk] of [[1, "rgba(30,107,255,0.35)"], [0.82, "rgba(30,107,255,0.35)"], [0.64, "rgba(24,209,227,0.4)"],
      [0.46, "rgba(24,209,227,0.5)"], [0.3, "rgba(120,236,245,0.55)"], [0.16, `rgba(235,252,255,${0.5 + 0.3 * guc})`]]) {
      ctx.fillStyle = renk; yolSekli(ctx, c, t, sSon, olcek); ctx.fill();
    }
    ctx.restore();
    // yol boyunca ufka akan ışık noktaları
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const a of akanIsiklar) {
      const s = (a.s0 + t * a.hiz) % 1;
      if (s > sSon) continue;
      const p = yolNoktasi(s, c, t), q = yolNoktasi(Math.min(1, s + 0.004), c, t);
      const dx = q.x - p.x, dy = q.y - p.y, l = Math.hypot(dx, dy) || 1;
      const x = p.x + (-dy / l) * a.yan * p.w * 0.5, y = p.y + (dx / l) * a.yan * p.w * 0.5;
      const boy = a.b * (0.35 + (1 - s) * 1.6);
      ctx.globalAlpha = 0.85 * (1 - s * 0.5);
      ctx.fillStyle = "#E6FBFF";
      ctx.beginPath(); ctx.arc(x, y, boy, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  // Çatıdaki mezun (kadrodan Barış), arkadan; şehir ve yol ışığı kenarlarını boyar
  function mezun(ctx, c, t) {
    const dy = kaydirma(AYAK.y, c);
    ctx.save();
    ctx.translate(AYAK.x, AYAK.y + dy);
    const g0 = ctx.createRadialGradient(0, 0, 10, 0, 0, 200);
    g0.addColorStop(0, "rgba(24,209,227,0.45)"); g0.addColorStop(1, "rgba(24,209,227,0)");
    ctx.fillStyle = g0; ctx.beginPath(); ctx.ellipse(0, 0, 200, 40, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    const p = KP.poz2.ayakta({ nefes: Math.sin(t * 2.1) * 1.5, agirlik: 0.4 });
    KP.karakter(ctx, p, KP.kadro("baris", "arka"), {
      x: AYAK.x, y: AYAK.y + dy, olcek: FIGUR_OLCEK,
      stil: { tip: "sinematik", karartma: "rgba(4,12,40,0.5)" },
      kenarIsigi: [[4, 0, "rgba(24,209,227,0.85)"], [-3, 0, "rgba(30,107,255,0.7)"], [0, 3, "rgba(143,216,255,0.5)"], [5, 0, "rgba(24,209,227,0.7)", 6]],
    });
  }

  function gokyuzu(ctx, c, t) {
    const dy = 20 * c;
    const g = ctx.createLinearGradient(0, dy, 0, UFUK + 70 * c);
    g.addColorStop(0, "#020818"); g.addColorStop(0.5, "#071A44"); g.addColorStop(0.86, "#0F3A78"); g.addColorStop(1, "#1C6C9A");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (const y of yildizlar) {
      ctx.globalAlpha = (0.25 + 0.5 * y.b) * (0.7 + 0.3 * Math.sin(t * 2 + y.x)) * clamp(1 - y.y / 760);
      ctx.fillStyle = "#CFEFFF"; ctx.fillRect(y.x, y.y + dy, 2, 2);
    }
    ctx.globalAlpha = 1;
    // ufuk parlaması
    const p = ctx.createRadialGradient(KAYIP.x, UFUK + 70 * c, 10, KAYIP.x, UFUK + 70 * c, 620);
    p.addColorStop(0, "rgba(24,209,227,0.38)"); p.addColorStop(1, "rgba(24,209,227,0)");
    ctx.fillStyle = p; ctx.fillRect(0, 0, W, H);
  }

  function sehirVeSu(ctx, c, t) {
    const dy = 70 * c, ufuk = UFUK + dy;
    ctx.drawImage(sehir, 0, ufuk - SEHIR_Y);
    // su
    const g = ctx.createLinearGradient(0, ufuk, 0, ZEMIN_KENAR + kaydirma(ZEMIN_KENAR, c));
    g.addColorStop(0, "#0B2B5C"); g.addColorStop(1, "#030A1C");
    ctx.fillStyle = g; ctx.fillRect(0, ufuk, W, H - ufuk);
    // şehrin suya yansıması
    ctx.save();
    ctx.globalAlpha = 0.32; ctx.filter = "blur(3px)";
    ctx.translate(0, ufuk + 2); ctx.scale(1, -0.75);
    ctx.drawImage(sehir, 0, -SEHIR_Y);
    ctx.restore();
    // dalgacıklar
    ctx.save();
    const r = rastgele(77);
    for (let i = 0; i < 70; i++) {
      const y = ufuk + 6 + Math.pow(r(), 1.6) * 360, x = r() * W, w = 20 + r() * 90;
      ctx.globalAlpha = 0.12 + 0.12 * Math.sin(t * 2.4 + i);
      ctx.fillStyle = r() < 0.5 ? R.acikMavi : R.turkuaz;
      ctx.fillRect(x + Math.sin(t + i) * 8, y, w, 1.5);
    }
    ctx.restore();
  }

  function teras(ctx, c) {
    const y = ZEMIN_KENAR + kaydirma(ZEMIN_KENAR, c);
    const g = ctx.createLinearGradient(0, y, 0, H);
    g.addColorStop(0, "#081430"); g.addColorStop(0.25, "#040A1A"); g.addColorStop(1, "#010309");
    ctx.fillStyle = g; ctx.fillRect(0, y, W, H - y + 300);
    ctx.fillStyle = "rgba(143,216,255,0.28)"; ctx.fillRect(0, y, W, 2);
    // kenardaki cam korkuluk
    ctx.fillStyle = "rgba(143,216,255,0.05)"; ctx.fillRect(0, y - 120, W, 120);
    ctx.fillStyle = "rgba(143,216,255,0.22)"; ctx.fillRect(0, y - 120, W, 2);
    for (let x = 40; x < W; x += 260) { ctx.fillStyle = "rgba(143,216,255,0.12)"; ctx.fillRect(x, y - 120, 3, 120); }
  }

  const tozlar = parcacikSeti(515, 55, { yMin: 300, yMax: 1700 });

  window.KESITLER["05"] = {
    sure: SURE,
    ciz(ctx, t, kare) {
      const c = ease.inOut(aralik(t, 0, SURE));
      const sonGuc = 1 + 0.6 * ease.in(aralik(t, 2.6, 3.0)); // geçiş için yol parlar

      ctx.save();
      const olcek = 1 + 0.045 * c;
      ctx.translate(W / 2, H / 2); ctx.scale(olcek, olcek); ctx.translate(-W / 2, -H / 2);
      gokyuzu(ctx, c, t);
      sehirVeSu(ctx, c, t);
      teras(ctx, c);
      isikNehri(ctx, c, t, sonGuc);
      if (KP.insanVar()) mezun(ctx, c, t);
      parcaciklar(ctx, tozlar, t, { yMin: 300, yMax: 1700, alfa: 0.7 });
      ctx.restore();

      vinyet(ctx, 0.6);
      yaziGolgesi(ctx, 480, 560, 0.3);
      satir(ctx, [{ m: "Ama mesele" }], { y: 380, boy: 92, agirlik: 800, k: aralik(t, 0.2, 0.55) });
      satir(ctx, [{ m: "2.500", renk: "gradyan" }, { m: " değil." }], { y: 490, boy: 92, agirlik: 900, k: aralik(t, 0.35, 0.7), parlama: 18 });
      satir(ctx, [{ m: "Sıradaki fırsatı", renk: "gradyan" }], { y: 640, boy: 76, agirlik: 900, k: aralik(t, 1.75, 2.1), parlama: 22 });
      satir(ctx, [{ m: "bulmak." }], { y: 732, boy: 76, agirlik: 800, k: aralik(t, 1.9, 2.25) });

      grain(ctx, kare, 0.06);
      // kesit 4'ün karanlık kapanışından açılış
      const acilis = 1 - ease.out(aralik(t, 0, 0.25));
      if (acilis > 0) { ctx.fillStyle = `rgba(4,10,28,${acilis * 0.85})`; ctx.fillRect(0, 0, W, H); }
      // yolun ışığı kareyi kaplar; kesit 6 aynı turkuaz ışıktan açılır
      const isik = ease.in(aralik(t, 2.75, 3.0));
      if (isik > 0) { ctx.fillStyle = `rgba(120,236,245,${isik * 0.85})`; ctx.fillRect(0, 0, W, H); }
    },
  };
})();
