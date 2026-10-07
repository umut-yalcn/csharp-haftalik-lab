// Kesit 4 — Portreler & çeşitlilik (0:09–0:12). Bkz. ../kesit-04.md
// Dört portre silüeti: öğrenci, yeni mezun, yazılım öğrenen, staj arayan. Her biri kendi ortamında,
// yüzünü sağ üste çevirir. Sonda bakış çizgileri tek bir ışıklı noktada birleşir.
(function () {
  const { W, H, R, aralik, ease, lerp, clamp, rastgele, satir, parlamaKatmani, grain, vinyet, poz, figur } = window.KP;

  const SURE = 3, SURE_P = 0.75;
  const KELIMELER = [[0, "hedef."], [1.0, "hikâye."], [1.9, "gelecek ihtimali."]];
  const BIRLESME = { x: 880, y: 330 };
  const OLCEK = 3.0, AYAK = { x: 500, y: 2620 };
  const gozNoktasi = () => ({ x: AYAK.x + (6 + 37 * 0.9) * OLCEK, y: AYAK.y - 608 * OLCEK });
  // bakış çizgileri: biri bu portrenin yüzünden, ötekiler önceki portrelerden (kadraj dışından) gelir
  const BASLANGICLAR = () => { const g = gozNoktasi(); return [[g.x, g.y], [-40, 980], [-40, 1500], [380, 1960]]; };

  // --- ortamlar ---
  function koridor(ctx, t) {
    ctx.fillStyle = "#051032"; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.filter = "blur(18px)";
    for (let i = 0; i < 6; i++) {
      const x = 80 + i * 190 - t * 30, a = 0.25 + 0.15 * (i % 2);
      const g = ctx.createLinearGradient(0, 200, 0, 1500);
      g.addColorStop(0, `rgba(143,216,255,${a})`); g.addColorStop(1, "rgba(30,107,255,0.05)");
      ctx.fillStyle = g; ctx.fillRect(x, 200, 110, 1300);
    }
    ctx.restore();
  }
  function atrium(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0E3A78"); g.addColorStop(1, "#061433");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.filter = "blur(4px)"; ctx.strokeStyle = "rgba(143,216,255,0.22)"; ctx.lineWidth = 3;
    for (let x = -100; x < W + 200; x += 140) { ctx.beginPath(); ctx.moveTo(x - t * 40, 0); ctx.lineTo(x * 0.7 + 160 - t * 40, H); ctx.stroke(); }
    for (let y = 120; y < 1400; y += 170) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y + 40); ctx.stroke(); }
    ctx.restore();
    const p = ctx.createRadialGradient(820, 300, 10, 820, 300, 700);
    p.addColorStop(0, "rgba(220,245,255,0.35)"); p.addColorStop(1, "rgba(220,245,255,0)");
    ctx.fillStyle = p; ctx.fillRect(0, 0, W, H);
  }
  function calismaAlani(ctx, t) {
    ctx.fillStyle = "#030816"; ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(900, 1500, 20, 900, 1500, 900);
    g.addColorStop(0, "rgba(24,209,227,0.45)"); g.addColorStop(1, "rgba(24,209,227,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.filter = "blur(10px)";
    const r = rastgele(44);
    for (let i = 0; i < 14; i++) { ctx.fillStyle = `rgba(30,107,255,${0.1 + r() * 0.15})`; ctx.fillRect(r() * W, 200 + r() * 700, 60 + r() * 120, 8); }
    ctx.restore();
  }
  function durak(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#081A44"); g.addColorStop(0.6, "#123A73"); g.addColorStop(1, "#0A1D45");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.filter = "blur(14px)"; ctx.globalCompositeOperation = "lighter";
    const r = rastgele(45);
    for (let i = 0; i < 26; i++) {
      const sicak = r() < 0.35;
      ctx.fillStyle = sicak ? `rgba(255,190,120,${0.2 + r() * 0.25})` : `rgba(24,209,227,${0.15 + r() * 0.25})`;
      ctx.beginPath(); ctx.arc(r() * W - t * 60, 500 + r() * 800, 20 + r() * 60, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  // --- portre ekleri ---
  const PORTRELER = [
    { ortam: koridor, ad: "ayse", ek: {} },                          // üniversite öğrencisi
    { ortam: atrium, ad: "baris", ek: {} },                          // yeni mezun
    { ortam: calismaAlani, ad: "zeynep", ek: { kulaklik: "#1F1F1F" } }, // yazılım öğrenen
    { ortam: durak, ad: "deniz", ek: {} },                           // staj arayan
  ];

  function portreCiz(ctx, i, yerel, t) {
    const P = PORTRELER[i];
    const k = yerel / SURE_P, olcek = 1 + 0.05 * k;
    ctx.save();
    ctx.translate(W / 2, H * 0.55); ctx.scale(olcek, olcek); ctx.translate(-W / 2, -H * 0.55);
    P.ortam(ctx, t);
    const don = lerp(0.35, 0.85, ease.inOut(k));
    const p = KP.poz2.ayakta({ nefes: Math.sin(t * 2) * 2, egim: lerp(-4, 6, k) + don * 8 });
    p.bas.don = don; p.bas.y -= 4 * don; // yüz sağ üste döner
    KP.karakter(ctx, p, KP.kadro(P.ad, "on", P.ek), {
      x: AYAK.x, y: AYAK.y, olcek: OLCEK,
      stil: { tip: "sinematik", karartma: "rgba(6,16,46,0.4)" },
      kenarIsigi: [[-4, 0, "rgba(24,209,227,0.8)"], [-2, 3, "rgba(143,216,255,0.5)"], [3, 0, "rgba(30,107,255,0.4)"], [-6, 0, "rgba(24,209,227,0.7)", 7]],
    });
    ctx.restore();
  }

  window.KESITLER["04"] = {
    sure: SURE,
    ciz(ctx, t, kare) {
      const i = Math.min(3, Math.floor(t / SURE_P)), yerel = t - i * SURE_P;
      portreCiz(ctx, i, yerel, t);
      vinyet(ctx, 0.65);

      // bakış çizgileri: her portrenin bakış noktasından sağ üstteki birleşme noktasına
      const c = ease.inOut(aralik(t, 2.45, 2.9));
      if (c > 0) {
        parlamaKatmani(ctx, (g) => {
          g.strokeStyle = R.turkuaz; g.lineWidth = 6; g.lineCap = "round";
          BASLANGICLAR().forEach(([x0, y0]) => {
            g.globalAlpha = 0.9;
            g.beginPath(); g.moveTo(x0, y0); g.lineTo(lerp(x0, BIRLESME.x, c), lerp(y0, BIRLESME.y, c)); g.stroke();
          });
          g.fillStyle = "#E6FBFF"; g.globalAlpha = c;
          g.beginPath(); g.arc(BIRLESME.x, BIRLESME.y, 10 + c * 40, 0, Math.PI * 2); g.fill();
        }, { blur: 18, guc: 1 });
        ctx.save(); ctx.strokeStyle = "rgba(230,251,255,0.9)"; ctx.lineWidth = 2.5;
        BASLANGICLAR().forEach(([x0, y0]) => {
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, BIRLESME.x, c), lerp(y0, BIRLESME.y, c)); ctx.stroke();
        });
        ctx.restore();
      }

      // yazı: "2.500 farklı" sabit, alt satırdaki kelime değişir
      KP.yaziGolgesi(ctx, 1390, 300, 0.6); // açık renk kıyafetlerin üstünde okunurluk için
      satir(ctx, [{ m: "2.500", renk: "gradyan" }, { m: " farklı" }], { y: 1330, boy: 100, agirlik: 900, k: aralik(t, 0.08, 0.3), parlama: 18 });
      for (let j = 0; j < KELIMELER.length; j++) {
        const [t0, m] = KELIMELER[j], t1 = KELIMELER[j + 1] ? KELIMELER[j + 1][0] : 99;
        if (t < t0 || t >= t1) continue;
        satir(ctx, [{ m }], { y: 1442, boy: m.length > 10 ? 80 : 92, agirlik: 800, k: aralik(t, t0 + 0.1, t0 + 0.3) });
      }

      // portre geçişlerinde turkuaz ışık sızıntısı
      for (let j = 1; j < 4; j++) {
        const d = Math.abs(t - j * SURE_P);
        if (d < 0.07) { ctx.fillStyle = `rgba(24,209,227,${0.45 * (1 - d / 0.07) * KP.gecisIsigi()})`; ctx.fillRect(0, 0, W, H); }
      }
      grain(ctx, kare, 0.06);
      // kesit 3'ün turkuaz rakamından açılış; sonda karanlığa geçiş
      const acilis = 1 - ease.out(aralik(t, 0, 0.28));
      if (acilis > 0) { ctx.fillStyle = `rgba(24,209,227,${acilis * KP.gecisIsigi()})`; ctx.fillRect(0, 0, W, H); }
      const kapanis = ease.in(aralik(t, 2.85, 3.0));
      if (kapanis > 0) { ctx.fillStyle = `rgba(4,10,28,${kapanis * 0.85})`; ctx.fillRect(0, 0, W, H); }
    },
  };
})();
