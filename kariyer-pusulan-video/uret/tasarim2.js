// Renkli karakter tasarım denemeleri: aynı sahne, aynı dört karakter, on farklı çizim stili.
// KESITLER["renkli-01"] … ["renkli-10"] olarak tek kare üretir.
(function () {
  const { W, H, R, grain, vinyet, poz2, karakter, renk } = window.KP;

  const ZEMIN = 1660;
  const KARAKTERLER = [
    { x: 175, o: 0.92, poz: () => poz2.ayakta({ agirlik: 0.6, egim: -3 }),
      k: { gorunum: "arka", ten: "#C68A62", sac: { tip: "kisa", renk: "#2B1A12" }, ust: { tip: "kapusonlu", renk: "#2F6B4F" }, alt: { tip: "kot", renk: "#3B5C8C" }, ayakkabi: { renk: "#F2F2F2", taban: "#CFCFCF" }, canta: { tip: "sirt", renk: "#1E2230" } } },
    { x: 410, o: 0.9, poz: () => poz2.yuru(0.32),
      k: { gorunum: "arka", ten: "#E8B898", sac: { tip: "dalgali", renk: "#6B3A1E" }, ust: { tip: "ceket", renk: "#C49A6C", uzun: true }, alt: { tip: "kumas", renk: "#2A2A35" }, ayakkabi: { renk: "#3A2418", taban: "#2A1A10" }, canta: { tip: "omuz", renk: "#7A2E2E" } } },
    { x: 660, o: 0.9, poz: () => poz2.ayakta({ telefon: "sag", agirlik: -0.5 }),
      k: { gorunum: "on", ten: "#F1C9A8", sac: { tip: "topuz", renk: "#1A1414" }, ust: { tip: "mont", renk: "#8C2F45" }, alt: { tip: "kot", renk: "#2E4A73" }, ayakkabi: { renk: "#FFFFFF", taban: "#18D1E3" } } },
    { x: 900, o: 0.94, poz: () => poz2.ayakta({ agirlik: 0.4, egim: 2 }),
      k: { gorunum: "on", ten: "#7A4A2E", sac: { tip: "kivircik", renk: "#120D0A" }, ust: { tip: "gomlek", renk: "#9CC3E6" }, alt: { tip: "kumas", renk: "#C8B48A" }, ayakkabi: { renk: "#5B3A22", taban: "#F2F2F2" }, kulaklik: "#1F1F1F", canta: { tip: "sirt", renk: "#E0A43A" } } },
  ];

  // renk dönüşümleri
  const pastel = (h) => { const c = renk.hex(h), gri = (c[0] + c[1] + c[2]) / 3; return "#" + renk.karis(renk.karis(c, [gri, gri, gri], 0.25), [255, 248, 240], 0.38).map((v) => Math.round(v).toString(16).padStart(2, "0")).join(""); };
  const MARKA = ["#0A1F4D", "#14306B", "#1E6BFF", "#18D1E3", "#8FD8FF", "#E6F4FF"];
  const marka = (h) => { const c = renk.hex(h), l = (0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]) / 255; return MARKA[Math.min(MARKA.length - 1, Math.floor(l * MARKA.length * 1.05))]; };

  const STILLER = [
    { ad: "Düz renk", acik: "Gölgesiz, sade vektör illüstrasyon", stil: { tip: "duz" } },
    { ad: "Hücre gölge", acik: "Düz renk + tek gölge ve ışık bandı", stil: { tip: "cel" } },
    { ad: "Hacimli gradyan", acik: "Yumuşak renk geçişleriyle hacim", stil: { tip: "gradyan" } },
    { ad: "Sinematik", acik: "Sahne ışığıyla koyulaşmış renk, sıcak arka ışık", stil: { tip: "sinematik", karartma: "rgba(10,25,60,0.32)" },
      kenar: [[4, 0, "rgba(255,220,170,0.9)"], [-3, 0, "rgba(24,209,227,0.6)"], [6, 0, "rgba(255,200,140,0.8)", 5]] },
    { ad: "Konturlu", acik: "Koyu dış çizgi, editoryal / çizgi roman", stil: { tip: "kontur" } },
    { ad: "Pastel", acik: "Yumuşatılmış, açık tonlu renkler", stil: { tip: "cel" }, donustur: pastel },
    { ad: "Marka paleti", acik: "Kıyafetler lacivert, mavi, turkuaz, beyaz", stil: { tip: "cel" }, donustur: marka },
    { ad: "Grenli baskı", acik: "Risograf dokusu, hafif baskı kayması", stil: { tip: "duz", grain: 70, kayma: 5 } },
    { ad: "Renkli low-poly", acik: "Her parça üçgen yüzeylerle gölgelenir", stil: { tip: "lowpoly" } },
    { ad: "Yarı gerçekçi", acik: "Gradyan + gölge + kumaş ayrıntıları", stil: { tip: "gercekci" },
      kenar: [[3, 0, "rgba(255,230,190,0.55)"]] },
  ];

  function sahne(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0A1F4D"); g.addColorStop(0.45, "#1F5A9A"); g.addColorStop(0.66, "#7FB5D9"); g.addColorStop(0.71, "#E9B07A");
    g.addColorStop(0.715, "#2A3A5E"); g.addColorStop(1, "#0B1428");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const p = ctx.createRadialGradient(W / 2, 1360, 10, W / 2, 1360, 700);
    p.addColorStop(0, "rgba(255,225,180,0.45)"); p.addColorStop(1, "rgba(255,225,180,0)");
    ctx.fillStyle = p; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 2;
    for (let i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 10, 1373); ctx.lineTo(W / 2 + i * 220, H); ctx.stroke(); }
    // karakterlerin altında yumuşak gölge
    for (const c of KARAKTERLER) { ctx.fillStyle = "rgba(5,10,25,0.45)"; ctx.beginPath(); ctx.ellipse(c.x, ZEMIN + 18, 70, 12, 0, 0, Math.PI * 2); ctx.fill(); }
  }

  STILLER.forEach((S, n) => {
    window.KESITLER[`renkli-${String(n + 1).padStart(2, "0")}`] = {
      sure: 1,
      ciz(ctx, t, kare) {
        sahne(ctx);
        for (const c of KARAKTERLER) karakter(ctx, c.poz(), c.k, { x: c.x, y: ZEMIN, olcek: c.o, stil: S.stil, kenarIsigi: S.kenar || null, renkDonustur: S.donustur || null, koru: [c.k.ten, c.k.sac.renk] });
        vinyet(ctx, 0.4);
        ctx.save();
        ctx.fillStyle = "rgba(4,10,28,0.7)"; ctx.fillRect(0, 0, W, 330);
        ctx.font = "900 120px Montserrat"; ctx.fillStyle = R.turkuaz; ctx.fillText(String(n + 1).padStart(2, "0"), 70, 190);
        ctx.font = "800 64px Montserrat"; ctx.fillStyle = R.beyaz; ctx.fillText(S.ad, 260, 160);
        ctx.font = "500 38px Montserrat"; ctx.fillStyle = R.acikMavi; ctx.fillText(S.acik, 262, 230, W - 300);
        ctx.restore();
        grain(ctx, kare, 0.03);
      },
    };
  });
})();
