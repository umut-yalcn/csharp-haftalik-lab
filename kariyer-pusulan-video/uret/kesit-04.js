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

  // --- insansız sürüm: pusula ve 2.500 ışık noktası ---
  // Ortada ince çizgili pusula gülü, çevresinde yörüngede dönen 2.500 ışık noktası. Her kelimede iğne
  // bir yöne dönüp oradaki ikonu yakar (hedef, hikâye, gelecek ihtimali); sonda sağ üste, bakış
  // çizgilerinin birleştiği noktaya döner ve kesit 5'in ışık yoluna bağlanır.
  const PM = { x: 540, y: 760 }, PR = 290, IKON_R = 395;
  const derece = (d) => (d * Math.PI) / 180;
  const DURAKLAR = [ // [başlangıç zamanı, iğne açısı, ikon]
    [0.08, derece(-140), "hedef"],
    [1.0, derece(25), "hikaye"],
    [1.9, derece(150), "gelecek"],
  ];
  const SON_ACI = Math.atan2(BIRLESME.y - PM.y, BIRLESME.x - PM.x);
  const NOKTALAR = (() => {
    const r = rastgele(2500);
    return Array.from({ length: 2500 }, (_, i) => ({
      r: PR + 30 + Math.pow(r(), 0.7) * 110, a: r() * Math.PI * 2, hiz: (0.05 + r() * 0.12) * (r() < 0.5 ? 1 : 0.6),
      b: 0.8 + r() * 1.6, alfa: 0.25 + r() * 0.75, gir: (i / 2500) * 0.7, renk: r() < 0.75 ? "#18D1E3" : "#E6FBFF",
    }));
  })();

  function igneAcisi(t) {
    let a = derece(-90);
    for (const [t0, hedef] of DURAKLAR) a = lerp(a, hedef, ease.inOut(aralik(t, t0, t0 + 0.4)));
    return lerp(a, SON_ACI, ease.inOut(aralik(t, 2.4, 2.85)));
  }

  function hedefIkonu(ctx, x, y, r) {
    for (const k of [1, 0.66, 0.33]) { ctx.beginPath(); ctx.arc(x, y, r * k, 0, Math.PI * 2); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(x, y, r * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + r * 1.15, y - r * 1.15); ctx.lineTo(x + r * 0.12, y - r * 0.12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + r * 1.15, y - r * 1.15); ctx.lineTo(x + r * 0.8, y - r * 1.2); ctx.moveTo(x + r * 1.15, y - r * 1.15); ctx.lineTo(x + r * 1.2, y - r * 0.8); ctx.stroke();
  }

  function pusulaSahnesi(ctx, t) {
    const gir = ease.out(aralik(t, 0, 0.45));
    if (gir <= 0) return;
    ctx.save();
    ctx.globalAlpha = gir;
    // merkezden yayılan yumuşak turkuaz hale
    const hale = ctx.createRadialGradient(PM.x, PM.y, 10, PM.x, PM.y, PR + 180);
    hale.addColorStop(0, "rgba(24,209,227,0.22)"); hale.addColorStop(1, "rgba(24,209,227,0)");
    ctx.fillStyle = hale; ctx.fillRect(0, 0, W, H);
    // pusula gülü: ince çizgiler, yavaş döner
    KP.pusulaGulu(ctx, PM.x, PM.y, PR, t * 0.06, R.turkuaz, 0.55);
    KP.pusulaGulu(ctx, PM.x, PM.y, PR * 0.62, -t * 0.09, R.acikMavi, 0.35);
    // 2.500 ışık noktası: yörüngede döner, kesit başında sırayla belirir
    ctx.globalCompositeOperation = "lighter";
    for (const n of NOKTALAR) {
      const g = clamp((t - n.gir) / 0.25);
      if (g <= 0) continue;
      const a = n.a + t * n.hiz;
      ctx.globalAlpha = gir * g * n.alfa * (0.75 + 0.25 * Math.sin(t * 3 + n.a * 7));
      ctx.fillStyle = n.renk;
      ctx.fillRect(PM.x + Math.cos(a) * n.r - n.b / 2, PM.y + Math.sin(a) * n.r * 0.92 - n.b / 2, n.b, n.b);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = gir;
    // ikonlar: iğne gelince parlayıp büyür, sonra sönük kalır (sahne dolar)
    DURAKLAR.forEach(([t0, aci, ad], i) => {
      const gel = ease.outBack(aralik(t, t0 + 0.25, t0 + 0.55));
      if (gel <= 0) return;
      const sonraki = DURAKLAR[i + 1] ? DURAKLAR[i + 1][0] + 0.2 : 2.45;
      const aktif = t < sonraki ? 1 : 0.45;
      const x = PM.x + Math.cos(aci) * IKON_R, y = PM.y + Math.sin(aci) * IKON_R * 0.92, boy = 132 * gel;
      ctx.save();
      ctx.globalAlpha = gir * (0.45 + 0.55 * aktif);
      if (aktif === 1) parlamaKatmani(ctx, (g) => { g.fillStyle = R.turkuaz; g.globalAlpha = 0.7; g.beginPath(); g.roundRect(x - boy / 2, y - boy / 2, boy, boy, boy * 0.24); g.fill(); }, { blur: 26, guc: 0.8 });
      ctx.fillStyle = "rgba(6,20,52,0.92)"; ctx.beginPath(); ctx.roundRect(x - boy / 2, y - boy / 2, boy, boy, boy * 0.24); ctx.fill();
      ctx.strokeStyle = R.turkuaz; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(x - boy / 2, y - boy / 2, boy, boy, boy * 0.24); ctx.stroke();
      ctx.strokeStyle = ctx.fillStyle = aktif === 1 ? "#E6FBFF" : R.turkuaz; ctx.lineWidth = 4.5; ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (ad === "hedef") hedefIkonu(ctx, x - 4, y + 4, boy * 0.27);
      if (ad === "hikaye") KP.IKON.kitap(ctx, x, y, boy * 0.3);
      if (ad === "gelecek") {
        KP.IKON.roket(ctx, x, y, boy * 0.3);
        // dallanan ışık yolları: geleceğin farklı ihtimalleri
        const d = ease.out(aralik(t, t0 + 0.45, t0 + 0.95));
        ctx.lineWidth = 3; ctx.strokeStyle = R.turkuaz; ctx.globalAlpha *= 0.8;
        for (const s of [-0.5, 0, 0.5]) {
          ctx.beginPath(); ctx.moveTo(x, y + boy / 2 + 6);
          ctx.quadraticCurveTo(x + s * 60, y + boy / 2 + 50 * d, x + s * 150 * d, y + boy / 2 + 110 * d); ctx.stroke();
        }
      }
      // iğne gelince halka dalgası
      const dalga = aralik(t, t0 + 0.3, t0 + 0.9);
      if (dalga > 0 && dalga < 1) { ctx.globalAlpha = gir * (1 - dalga) * 0.8; ctx.strokeStyle = R.turkuaz; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, boy * 0.6 + dalga * 80, 0, Math.PI * 2); ctx.stroke(); }
      ctx.restore();
    });
    // iğne: ön ucu turkuaz-beyaz, arka ucu lacivert; merkezde göbek
    const a = igneAcisi(t), L = PR * 0.86, gen = 22;
    const uc = [PM.x + Math.cos(a) * L, PM.y + Math.sin(a) * L], kuyruk = [PM.x - Math.cos(a) * L * 0.55, PM.y - Math.sin(a) * L * 0.55];
    const yan = (s) => [PM.x + Math.cos(a + Math.PI / 2) * gen * s, PM.y + Math.sin(a + Math.PI / 2) * gen * s];
    parlamaKatmani(ctx, (g) => { g.fillStyle = R.turkuaz; g.beginPath(); g.moveTo(...uc); g.lineTo(...yan(1)); g.lineTo(...yan(-1)); g.closePath(); g.fill(); g.beginPath(); g.arc(...uc, 12, 0, Math.PI * 2); g.fill(); }, { blur: 22, guc: 0.9 });
    const ig = ctx.createLinearGradient(PM.x, PM.y, ...uc); ig.addColorStop(0, "#18D1E3"); ig.addColorStop(1, "#E6FBFF");
    ctx.fillStyle = ig; ctx.beginPath(); ctx.moveTo(...uc); ctx.lineTo(...yan(1)); ctx.lineTo(...yan(-1)); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#0E2A63"; ctx.beginPath(); ctx.moveTo(...kuyruk); ctx.lineTo(...yan(1)); ctx.lineTo(...yan(-1)); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(143,216,255,0.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...kuyruk); ctx.lineTo(...yan(1)); ctx.lineTo(...uc); ctx.lineTo(...yan(-1)); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = "#E6FBFF"; ctx.beginPath(); ctx.arc(PM.x, PM.y, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = R.turkuaz; ctx.beginPath(); ctx.arc(PM.x, PM.y, 7, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  window.KESITLER["04"] = {
    sure: SURE,
    ciz(ctx, t, kare) {
      const i = Math.min(3, Math.floor(t / SURE_P)), yerel = t - i * SURE_P;
      portreCiz(ctx, i, yerel, t);
      vinyet(ctx, 0.65);
      if (!KP.insanVar()) pusulaSahnesi(ctx, t); // insansız sürümde boş kalan sahneyi doldurur

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
