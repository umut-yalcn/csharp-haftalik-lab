// Kesit 3 — Kampüste sabah & 2.500 (0:06–0:09). Bkz. ../kesit-03.md
// Sabah ışığında fakülte binası, merdivenlerde telefonlarına bakan öğrenciler; kamera hafifçe döner.
// "2.500" sayacı yükselir, sonda rakam kameraya doğru büyüyüp kareyi turkuaza boyar.
(function () {
  const { W, H, R, aralik, ease, lerp, clamp, rastgele, tuval, satir, yaziGolgesi, parlamaKatmani, grain, vinyet, poz, figur } = window.KP;

  const SURE = 3;
  const GUNES = { x: 905, y: 820 };
  const UFUK = 1160;

  // fakülte binası ve ağaçlar bir kez çizilir
  const bina = tuval(W + 200, 700);
  (function () {
    const g = bina.getContext("2d"), r = rastgele(303), taban = 680;
    g.fillStyle = "#0C2A5C";
    // ana bina, alınlık ve sütunlar
    g.fillRect(260, taban - 330, 760, 330);
    g.beginPath(); g.moveTo(240, taban - 330); g.lineTo(640, taban - 450); g.lineTo(1040, taban - 330); g.closePath(); g.fill();
    g.fillStyle = "rgba(191,230,245,0.18)";
    for (let i = 0; i < 9; i++) g.fillRect(320 + i * 82, taban - 300, 26, 300);
    g.fillStyle = "#0C2A5C"; g.fillRect(250, taban - 330, 780, 22);
    // yan kanatlar
    g.fillStyle = "#0A2452"; g.fillRect(40, taban - 220, 240, 220); g.fillRect(1000, taban - 240, 260, 240);
    g.fillStyle = "rgba(191,230,245,0.22)";
    for (const [x0, x1, y0] of [[60, 260, taban - 200], [1020, 1240, taban - 220]])
      for (let y = y0; y < taban - 20; y += 52) for (let x = x0; x < x1; x += 44) g.fillRect(x, y, 22, 30);
    // ağaçlar
    g.fillStyle = "#071D45";
    for (const [cx, n] of [[60, 9], [1200, 9]])
      for (let i = 0; i < n; i++) { g.beginPath(); g.arc(cx + (r() - 0.5) * 220, taban - 120 - r() * 220, 60 + r() * 50, 0, Math.PI * 2); g.fill(); }
  })();

  // Grup: x, merdiven seviyesi (y), ölçek, telefon eli, saç
  const GRUP = [
    { x: 170, y: 1690, o: 0.98, tel: "sag", sac: "uzun", derin: 1.0 },
    { x: 380, y: 1640, o: 0.92, tel: "sol", sac: null, derin: 0.85 },
    { x: 560, y: 1760, o: 1.05, tel: "sag", sac: "topuz", derin: 1.15 },
    { x: 760, y: 1620, o: 0.9, tel: null, sac: null, derin: 0.8, egim: -8 },
    { x: 930, y: 1700, o: 1.0, tel: "sol", sac: "uzun", derin: 1.05 },
  ];

  function gokyuzu(ctx, c) {
    const g = ctx.createLinearGradient(0, 0, 0, UFUK);
    g.addColorStop(0, "#071A44"); g.addColorStop(0.45, "#16508F"); g.addColorStop(0.8, "#5FA9D6"); g.addColorStop(1, "#CFEFFA");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const gx = GUNES.x - 60 * c;
    const p = ctx.createRadialGradient(gx, GUNES.y, 10, gx, GUNES.y, 760);
    p.addColorStop(0, "rgba(255,250,235,0.95)"); p.addColorStop(0.12, "rgba(255,236,200,0.55)"); p.addColorStop(0.5, "rgba(143,216,255,0.15)"); p.addColorStop(1, "rgba(143,216,255,0)");
    ctx.fillStyle = p; ctx.fillRect(0, 0, W, H);
    // ışık huzmeleri
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.filter = "blur(12px)";
    for (let i = 0; i < 7; i++) {
      const a = -2.2 + i * 0.32 + c * 0.05;
      ctx.fillStyle = "rgba(255,245,220,0.06)";
      ctx.beginPath(); ctx.moveTo(gx, GUNES.y); ctx.lineTo(gx + Math.cos(a) * 1600, GUNES.y + Math.sin(a) * 1600);
      ctx.lineTo(gx + Math.cos(a + 0.08) * 1600, GUNES.y + Math.sin(a + 0.08) * 1600); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  function merdivenler(ctx, c) {
    for (let i = 0; i < 9; i++) {
      const y = UFUK + 40 + i * 92;
      const g = ctx.createLinearGradient(0, y, 0, y + 92);
      g.addColorStop(0, i % 2 ? "#0B2550" : "#0D2A5A"); g.addColorStop(1, "#061533");
      ctx.fillStyle = g; ctx.fillRect(0, y, W, 92);
      ctx.fillStyle = `rgba(255,240,215,${0.28 - i * 0.025})`; ctx.fillRect(0, y, W, 3);
    }
    ctx.fillStyle = "#0A2250"; ctx.fillRect(0, UFUK - 10, W, 52);
  }

  function sayi(n) { return n >= 1000 ? `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, "0")}` : String(n); }

  window.KESITLER["03"] = {
    sure: SURE,
    ciz(ctx, t, kare) {
      const c = ease.inOut(aralik(t, 0, SURE));
      gokyuzu(ctx, c);
      ctx.drawImage(bina, -100 - 40 * c, UFUK - 680);
      merdivenler(ctx, c);
      for (const k of GRUP) {
        const p = poz.ayakta({ telefon: k.tel, nefes: Math.sin(t * 2 + k.x) * 1.5, egim: k.egim || 0 });
        p.sac = k.sac;
        if (k.tel) p.bas.y += 10; // telefona eğilen baş
        KP.insan(ctx, p, {
          x: k.x + 70 * c * k.derin, y: k.y, olcek: k.o, t, tohum: k.x,
          kenarlar: [[-4, 0, "rgba(255,240,215,0.9)"], [0, 4, "rgba(255,250,235,0.8)"], [4, 0, "rgba(24,209,227,0.7)"]],
          parlamaKenar: [-6, 0, "rgba(255,236,200,0.8)"],
        });
      }
      vinyet(ctx, 0.5);

      // yazılar ve sayaç; sonda rakam kameraya doğru büyür
      const buyu = ease.in(aralik(t, 2.35, 2.95));
      const digerAlfa = 1 - aralik(t, 2.3, 2.5);
      ctx.save(); ctx.globalAlpha = digerAlfa;
      yaziGolgesi(ctx, 600, 760, 0.45);
      satir(ctx, [{ m: "Ve bugün..." }], { y: 340, boy: 82, agirlik: 800, k: aralik(t, 0.2, 0.5) });
      satir(ctx, [{ m: "KİŞİ" }], { y: 790, boy: 68, agirlik: 800, aralikHarf: 16, k: aralik(t, 1.0, 1.3) });
      satir(ctx, [{ m: "KariyerPusulan.com'da buluştu." }], { y: 880, boy: 46, agirlik: 600, renk: R.acikMavi, k: aralik(t, 1.45, 1.75) });
      ctx.restore();
      const n = Math.round(2500 * ease.out(aralik(t, 0.65, 1.7)));
      if (t >= 0.6) {
        const ox = W / 2, oy = 610;
        ctx.save();
        ctx.translate(ox, oy); ctx.scale(1 + buyu * 14, 1 + buyu * 14); ctx.translate(-ox, -oy);
        satir(ctx, [{ m: sayi(n), renk: "gradyan" }], { y: 690, boy: 250, agirlik: 900, k: aralik(t, 0.6, 0.8), parlama: 40 });
        ctx.restore();
      }
      grain(ctx, kare, 0.05);
      // kesit 2'nin beyaz ışığından açılış; sonda turkuaz dolgu
      const acilis = 1 - ease.out(aralik(t, 0, 0.3));
      if (acilis > 0) { ctx.fillStyle = `rgba(235,252,255,${acilis})`; ctx.fillRect(0, 0, W, H); }
      const dolgu = ease.in(aralik(t, 2.75, 3.0));
      if (dolgu > 0) { ctx.fillStyle = `rgba(24,209,227,${dolgu})`; ctx.fillRect(0, 0, W, H); }
    },
  };
})();
