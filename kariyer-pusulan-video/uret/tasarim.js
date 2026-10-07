// Silüet tasarım denemeleri: aynı sahne, aynı üç figür, on farklı çizim biçimi.
// Her biri KESITLER["tasarim-01"] … ["tasarim-10"] olarak tek kare üretir.
(function () {
  const { W, H, R, rastgele, tuval, parlamaKatmani, grain, vinyet, poz2, figurMaskesi2 } = window.KP;

  const ZEMIN = 1640;
  const FIGURLER = [
    { x: 290, poz: () => poz2.ayakta({ agirlik: 0.6, egim: -3 }), giyim: { ust: "kapusonlu", alt: "pantolon", sac: "kisa", canta: true }, o: 1.12 },
    { x: 560, poz: () => poz2.yuru(0.32), giyim: { ust: "ceket", alt: "etek", sac: "uzun", beden: 0.92 }, o: 1.06 },
    { x: 815, poz: () => poz2.ayakta({ telefon: "sag", agirlik: -0.5 }), giyim: { ust: "mont", alt: "pantolon", sac: "topuz", beden: 0.95 }, o: 1.1 },
  ];

  // --- yardımcılar ---
  const gecici = {};
  function tv(ad, w, h) { const k = `${ad}${w}x${h}`; if (!gecici[k]) gecici[k] = tuval(w, h); const c = gecici[k]; c.getContext("2d").clearRect(0, 0, w, h); return c; }
  // maskeyi verilen dolgu ile boyar
  function boya(m, dolgu, ad = "b") {
    const c = tv(ad, m.MW, m.MH), g = c.getContext("2d");
    g.globalCompositeOperation = "source-over"; g.drawImage(m.tuval, 0, 0);
    g.globalCompositeOperation = "source-in"; g.fillStyle = typeof dolgu === "function" ? dolgu(g, m) : dolgu; g.fillRect(0, 0, m.MW, m.MH);
    g.globalCompositeOperation = "source-over";
    return c;
  }
  // kenar şeridi: maske eksi (dx, dy) kaydırılmış maske
  function kenar(m, dx, dy, renk, ad = "k") {
    const c = boya(m, renk, ad), g = c.getContext("2d");
    g.globalCompositeOperation = "destination-out"; g.drawImage(m.tuval, dx, dy); g.globalCompositeOperation = "source-over";
    return c;
  }
  // maskenin içine serbest çizim (kırpılmış)
  function icine(m, ciz, ad = "i") {
    const c = tv(ad, m.MW, m.MH), g = c.getContext("2d");
    ciz(g, m);
    g.globalCompositeOperation = "destination-in"; g.drawImage(m.tuval, 0, 0); g.globalCompositeOperation = "source-over";
    return c;
  }
  const koy = (ctx, c, f, m, alfa = 1, mod = "source-over", filtre = "none") => {
    ctx.save(); ctx.globalAlpha = alfa; ctx.globalCompositeOperation = mod; ctx.filter = filtre;
    ctx.drawImage(c, f.x - m.MX, ZEMIN - m.MY); ctx.restore();
  };

  // --- ortak sahne ---
  function sahne(ctx, t, aydinlik = 1) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#040A1C"); g.addColorStop(0.55, "#0E2F66"); g.addColorStop(0.66, "#2B6FAE"); g.addColorStop(0.7, "#0B2350"); g.addColorStop(1, "#030816");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const p = ctx.createRadialGradient(W / 2, 1300, 10, W / 2, 1300, 760);
    p.addColorStop(0, `rgba(143,216,255,${0.55 * aydinlik})`); p.addColorStop(0.3, `rgba(24,209,227,${0.18 * aydinlik})`); p.addColorStop(1, "rgba(24,209,227,0)");
    ctx.fillStyle = p; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(143,216,255,0.25)"; ctx.fillRect(0, 1345, W, 2);
    ctx.strokeStyle = "rgba(143,216,255,0.08)"; ctx.lineWidth = 2;
    for (let i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 10, 1346); ctx.lineTo(W / 2 + i * 220, H); ctx.stroke(); }
  }

  // --- on tasarım ---
  const TASARIMLAR = [
    { ad: "Sinematik kontur", acik: "Siyah gövde, tek yönden ince ışık kenarı",
      ciz(ctx, f, m) {
        koy(ctx, boya(m, "#02050D"), f, m);
        koy(ctx, kenar(m, 4, 0, "rgba(220,245,255,0.95)"), f, m, 1, "lighter");
        koy(ctx, kenar(m, -3, 2, "rgba(24,209,227,0.7)"), f, m, 1, "lighter");
        koy(ctx, kenar(m, 6, 0, "rgba(24,209,227,0.9)"), f, m, 0.7, "lighter", "blur(6px)");
      } },
    { ad: "Marka gradyanı", acik: "Gövde lacivertten maviye geçen renkte",
      ciz(ctx, f, m) {
        koy(ctx, boya(m, (g, mm) => { const gr = g.createLinearGradient(0, 0, 0, mm.MH); gr.addColorStop(0, "#1E6BFF"); gr.addColorStop(0.5, "#0E3A8A"); gr.addColorStop(1, "#071433"); return gr; }), f, m);
        koy(ctx, kenar(m, 0, 4, "rgba(143,216,255,0.9)"), f, m, 1, "lighter");
        koy(ctx, kenar(m, 3, 0, "rgba(24,209,227,0.8)"), f, m, 1, "lighter");
      } },
    { ad: "Cam silüet", acik: "Yarı saydam gövde, içten parlayan kenar",
      ciz(ctx, f, m) {
        koy(ctx, boya(m, "rgba(143,216,255,0.16)"), f, m);
        for (const [dx, dy] of [[3, 0], [-3, 0], [0, 3], [0, -3]]) koy(ctx, kenar(m, dx, dy, "rgba(230,251,255,0.55)"), f, m, 1, "lighter");
        koy(ctx, icine(m, (g, mm) => { g.fillStyle = "rgba(255,255,255,0.22)"; g.translate(mm.MX, mm.MY); g.rotate(-0.5); g.fillRect(-30, -900, 36, 1200); g.fillRect(20, -900, 12, 1200); }), f, m, 1, "lighter");
        koy(ctx, kenar(m, 3, 0, "rgba(24,209,227,0.9)"), f, m, 0.8, "lighter", "blur(5px)");
      } },
    { ad: "Low-poly", acik: "Gövde üçgen yüzeylerle gölgelenir",
      ciz(ctx, f, m) {
        koy(ctx, icine(m, (g, mm) => {
          const r = rastgele(f.x), s = 46;
          for (let y = 0; y < mm.MH; y += s) for (let x = -s; x < mm.MW + s; x += s) {
            for (const tri of [[[x, y], [x + s, y], [x, y + s]], [[x + s, y], [x + s, y + s], [x, y + s]]]) {
              const isik = 0.25 + (x / mm.MW) * 0.5 + (1 - y / mm.MH) * 0.25 + r() * 0.2;
              g.fillStyle = `rgb(${8 + isik * 26},${24 + isik * 70},${60 + isik * 120})`;
              g.beginPath(); g.moveTo(...tri[0]); g.lineTo(...tri[1]); g.lineTo(...tri[2]); g.closePath(); g.fill();
            }
          }
        }), f, m);
        koy(ctx, kenar(m, 3, 0, "rgba(24,209,227,0.9)"), f, m, 1, "lighter");
      } },
    { ad: "Çift pozlama", acik: "Gövdenin içinde gece şehri ve yıldızlar",
      ciz(ctx, f, m) {
        koy(ctx, icine(m, (g, mm) => {
          const gr = g.createLinearGradient(0, 0, 0, mm.MH); gr.addColorStop(0, "#071640"); gr.addColorStop(1, "#1C6C9A");
          g.fillStyle = gr; g.fillRect(0, 0, mm.MW, mm.MH);
          const r = rastgele(f.x + 5);
          for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(230,251,255,${0.3 + r() * 0.7})`; g.fillRect(r() * mm.MW, r() * mm.MH * 0.6, 2, 2); }
          let x = 0; while (x < mm.MW) { const w = 14 + r() * 30, h = 40 + r() * 150; g.fillStyle = "#040A1C"; g.fillRect(x, mm.MH - 120 - h, w, h + 120); for (let k = 0; k < 6; k++) { g.fillStyle = "rgba(24,209,227,0.8)"; g.fillRect(x + 3 + r() * (w - 6), mm.MH - 110 - r() * h, 2, 2); } x += w + 2; }
        }), f, m);
        koy(ctx, kenar(m, 3, 0, "rgba(143,216,255,0.9)"), f, m, 1, "lighter");
        koy(ctx, kenar(m, -3, 0, "rgba(24,209,227,0.6)"), f, m, 1, "lighter");
      } },
    { ad: "Düz illüstrasyon", acik: "Yüzsüz ama renkli: kıyafet, saç, ayakkabı",
      ciz(ctx, f, m, i) {
        const renkler = [["#0A1530", "#18D1E3", "#14306B", "#E6F4FF"], ["#3B2216", "#0E3A8A", "#1E6BFF", "#E6F4FF"], ["#0A1530", "#E6F4FF", "#0E2552", "#18D1E3"]][i];
        koy(ctx, icine(m, (g, mm) => {
          const o = f.o, y = (v) => mm.MY + v * o;
          g.fillStyle = renkler[2]; g.fillRect(0, y(-262), mm.MW, mm.MH);               // alt
          g.fillStyle = renkler[1]; g.fillRect(0, y(-545), mm.MW, y(-240) - y(-545));     // üst
          g.fillStyle = renkler[0]; g.fillRect(0, 0, mm.MW, y(-560));                     // baş, saç
          g.fillStyle = renkler[3]; g.fillRect(0, y(-28), mm.MW, mm.MH);                  // ayakkabı
          g.fillStyle = "rgba(0,0,0,0.28)"; g.fillRect(0, 0, mm.MX - 8 * o, mm.MH);       // gölge tarafı
        }), f, m);
        koy(ctx, kenar(m, 3, 0, "rgba(230,251,255,0.5)"), f, m, 1, "lighter");
      } },
    { ad: "Arkadan ışık", acik: "Güçlü arka ışık kenarları yer, hale bırakır",
      arka(ctx, f, m) { koy(ctx, boya(m, "rgba(200,240,255,1)", "h"), f, m, 0.9, "lighter", "blur(26px)"); },
      ciz(ctx, f, m) {
        koy(ctx, boya(m, "#02050D"), f, m);
        for (const [dx, dy] of [[3, 0], [-3, 0], [0, 3]]) koy(ctx, kenar(m, dx, dy, "rgba(240,252,255,0.95)"), f, m, 1, "lighter");
        koy(ctx, kenar(m, 0, 6, "rgba(240,252,255,0.9)"), f, m, 0.8, "lighter", "blur(4px)");
      } },
    { ad: "Yansıma ve gölge", acik: "Parlak zeminde yansıma, öne düşen gölge",
      arka(ctx, f, m) {
        ctx.save(); ctx.translate(f.x, ZEMIN + 8); ctx.scale(1, -0.55); ctx.globalAlpha = 0.35; ctx.filter = "blur(3px)";
        ctx.drawImage(boya(m, "#1A4B8F", "y"), -m.MX, -m.MY); ctx.restore();
        ctx.save(); ctx.translate(f.x, ZEMIN + 4); ctx.transform(1, 0, -0.35, 0.28, 0, 0); ctx.globalAlpha = 0.5; ctx.filter = "blur(4px)";
        ctx.drawImage(boya(m, "#01030A", "g"), -m.MX, -m.MY); ctx.restore();
      },
      ciz(ctx, f, m) {
        koy(ctx, boya(m, "#03071A"), f, m);
        koy(ctx, kenar(m, 3, 0, "rgba(143,216,255,0.8)"), f, m, 1, "lighter");
        koy(ctx, kenar(m, 0, 3, "rgba(143,216,255,0.6)"), f, m, 1, "lighter");
      } },
    { ad: "Stilize oranlar", acik: "Uzun bacaklar, küçük baş, ince gövde",
      stilize: true,
      ciz(ctx, f, m) {
        koy(ctx, boya(m, (g, mm) => { const gr = g.createLinearGradient(0, 0, mm.MW, 0); gr.addColorStop(0, "#030716"); gr.addColorStop(1, "#0A1F4D"); return gr; }), f, m);
        koy(ctx, kenar(m, 4, 0, "rgba(24,209,227,0.95)"), f, m, 1, "lighter");
        koy(ctx, kenar(m, -3, 0, "rgba(30,107,255,0.8)"), f, m, 1, "lighter");
        koy(ctx, kenar(m, 6, 0, "rgba(24,209,227,0.9)"), f, m, 0.6, "lighter", "blur(6px)");
      } },
    { ad: "Yarım ton", acik: "Gövde aşağı doğru büyüyen noktalarla dolar",
      ciz(ctx, f, m) {
        koy(ctx, boya(m, "#040A1C"), f, m);
        koy(ctx, icine(m, (g, mm) => {
          const s = 11;
          for (let y = 0; y < mm.MH; y += s) for (let x = (y / s) % 2 ? s / 2 : 0; x < mm.MW; x += s) {
            const k = y / mm.MH, r = 1 + k * 4.6;
            g.fillStyle = k < 0.5 ? "#18D1E3" : "#1E6BFF";
            g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
          }
        }), f, m);
        koy(ctx, kenar(m, 3, 0, "rgba(230,251,255,0.8)"), f, m, 1, "lighter");
      } },
  ];

  TASARIMLAR.forEach((T, n) => {
    window.KESITLER[`tasarim-${String(n + 1).padStart(2, "0")}`] = {
      sure: 1,
      ciz(ctx, t, kare) {
        sahne(ctx, t, T.ad === "Arkadan ışık" ? 1.6 : 1);
        const maskeler = FIGURLER.map((f) => {
          let p = f.poz(), giyim = { ...f.giyim };
          if (T.stilize) { giyim.beden = (giyim.beden || 1) * 0.9; p.bas.y += 0; }
          const m = figurMaskesi2(p, f.o, giyim);
          // maske paylaşılan tuvalde; her figür için kopyası alınır
          const kopya = tuval(m.MW, m.MH); kopya.getContext("2d").drawImage(m.tuval, 0, 0);
          let mm = { ...m, tuval: kopya };
          if (T.stilize) {
            // bacakları uzatmak için dikey germe: kalçanın altı %25 uzar
            const kes = Math.round(m.MY - 300 * f.o);
            const c = tuval(m.MW, Math.ceil(kes + (m.MH - kes) * 1.25)), g = c.getContext("2d");
            g.drawImage(kopya, 0, 0, m.MW, kes, 0, 0, m.MW, kes);
            g.drawImage(kopya, 0, kes, m.MW, m.MH - kes, 0, kes, m.MW, (m.MH - kes) * 1.25);
            const yeni = Math.round(kes + (m.MH - kes) * 1.25);
            mm = { tuval: c, MW: m.MW, MH: Math.max(yeni, c.height), MX: m.MX, MY: kes + (m.MY - kes) * 1.25 };
          }
          return mm;
        });
        FIGURLER.forEach((f, i) => T.arka && T.arka(ctx, f, maskeler[i]));
        FIGURLER.forEach((f, i) => T.ciz(ctx, f, maskeler[i], i));
        vinyet(ctx, 0.5);
        // başlık
        ctx.save();
        ctx.fillStyle = "rgba(4,10,28,0.7)"; ctx.fillRect(0, 0, W, 330);
        ctx.font = "900 120px Montserrat"; ctx.fillStyle = R.turkuaz; ctx.fillText(String(n + 1).padStart(2, "0"), 70, 190);
        ctx.font = "800 64px Montserrat"; ctx.fillStyle = R.beyaz; ctx.fillText(T.ad, 260, 160);
        ctx.font = "500 38px Montserrat"; ctx.fillStyle = R.acikMavi; ctx.fillText(T.acik, 262, 230, W - 300);
        ctx.restore();
        grain(ctx, kare, 0.04);
      },
    };
  });
})();
