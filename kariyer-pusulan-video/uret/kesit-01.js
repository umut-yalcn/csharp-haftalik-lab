// Kesit 1 — Gece sekmeler & arayış (0:00–0:03). Bkz. ../kesit-01.md
// Karanlık oda, laptop başında arkadan görünen öğrenci; ekranda onlarca sekme ve pencere.
// Kamera yavaşça yaklaşır, sonda bir sekmeye hızlı zoom ve turkuaz-beyaz flaş.
(function () {
  const { W, H, R, aralik, ease, lerp, clamp, rastgele, satir, yaziGolgesi, parlamaKatmani, grain, vinyet, poz, figur } = window.KP;

  const SURE = 3;
  // --laptop yeni: ekran küçülür, klavye tabanı perspektifle görünür (televizyon gibi durmasın)
  const YENI = (window.KP.SECENEK || {}).laptop === "yeni";
  const EKRAN = YENI ? { x: 300, y: 770, w: 480, h: 300 } : { x: 250, y: 800, w: 580, h: 370 };
  const HEDEF = YENI ? { x: 600, y: 915 } : { x: 610, y: 960 }; // zoom yapılan sekme kartı
  // Yeni laptop öğrenciye göre gerçekçi boyda: mantıksal çizim LAPTOP_OLCEK ile küçültülür,
  // menteşe (540, 1080) masa çizgisine oturur.
  const LAPTOP_OLCEK = 0.62, MENTESE = { x: 540, y: 1080 }, MENTESE_G = { x: 560, y: 1116 };
  const gorunen = (p) => (YENI ? { x: MENTESE_G.x + (p.x - MENTESE.x) * LAPTOP_OLCEK, y: MENTESE_G.y + (p.y - MENTESE.y) * LAPTOP_OLCEK } : p);
  const HEDEF_G = gorunen(HEDEF); // zoom hedefinin ekrandaki yeri
  const MASA_Y = YENI ? MENTESE_G.y - 4 : 1210;
  const r0 = rastgele(101);
  const PENCERELER = Array.from({ length: 9 }, (_, i) => ({
    x: 14 + r0() * 330, y: 52 + r0() * 170, w: 170 + r0() * 120, h: 110 + r0() * 90,
    gir: i < 4 ? -1 : 0.15 + (i - 4) * 0.42, renk: r0() < 0.5 ? R.mavi : R.turkuaz, satir: 2 + Math.floor(r0() * 4),
  }));

  function ekranIcerik(ctx, t) {
    const { w, h } = EKRAN;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#0C2C66"); g.addColorStop(1, "#071A44");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // sekme çubuğu: sığmayacak kadar çok sekme, yenileri eklenir
    const sekmeSayi = 22 + Math.floor(t * 6);
    const sw = (w - 20) / sekmeSayi;
    for (let i = 0; i < sekmeSayi; i++) {
      ctx.fillStyle = i === sekmeSayi - 1 ? "rgba(24,209,227,0.9)" : `rgba(143,216,255,${0.18 + (i % 3) * 0.06})`;
      ctx.beginPath(); ctx.roundRect(10 + i * sw, 8, sw - 2, 20, [5, 5, 0, 0]); ctx.fill();
    }
    ctx.fillStyle = "rgba(143,216,255,0.12)"; ctx.fillRect(0, 30, w, 14);
    // üst üste binmiş pencereler; zamanla yenileri açılır ve sallanır
    for (const p of PENCERELER) {
      if (p.gir > t) continue;
      const k = p.gir < 0 ? 1 : ease.outBack(aralik(t, p.gir, p.gir + 0.18));
      const sal = Math.sin(t * 3 + p.x) * 2;
      ctx.save();
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2 + sal); ctx.scale(k, k); ctx.translate(-p.w / 2, -p.h / 2);
      ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 14;
      ctx.fillStyle = "#0E2552"; ctx.beginPath(); ctx.roundRect(0, 0, p.w, p.h, 6); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(143,216,255,0.25)"; ctx.fillRect(0, 0, p.w, 12);
      ctx.fillStyle = p.renk; ctx.globalAlpha = 0.7; ctx.fillRect(8, 20, p.w * 0.32, p.h * 0.42); ctx.globalAlpha = 1;
      for (let s = 0; s < p.satir; s++) { ctx.fillStyle = "rgba(143,216,255,0.3)"; ctx.fillRect(p.w * 0.38, 22 + s * 14, p.w * (0.5 - s * 0.06), 6); }
      ctx.restore();
    }
    // zoom hedefi: "fırsat" kartı, yanıp söner
    const hx = HEDEF.x - EKRAN.x - 70, hy = HEDEF.y - EKRAN.y - 40;
    ctx.fillStyle = "#0B2A5E"; ctx.beginPath(); ctx.roundRect(hx, hy, 140, 80, 8); ctx.fill();
    ctx.strokeStyle = `rgba(24,209,227,${0.6 + 0.4 * Math.sin(t * 8)})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(hx, hy, 140, 80, 8); ctx.stroke();
    ctx.fillStyle = R.turkuaz; ctx.beginPath(); ctx.roundRect(hx + 10, hy + 12, 46, 46, 6); ctx.fill();
    ctx.fillStyle = "rgba(143,216,255,0.5)"; ctx.fillRect(hx + 64, hy + 16, 64, 7); ctx.fillRect(hx + 64, hy + 32, 48, 7);
    ctx.fillStyle = "rgba(24,209,227,0.8)"; ctx.beginPath(); ctx.roundRect(hx + 64, hy + 50, 50, 14, 7); ctx.fill();
    // bildirim rozetleri
    for (let i = 0; i < 3; i++) {
      const a = Math.sin(t * 6 + i * 2) > 0.3 ? 1 : 0.2;
      ctx.fillStyle = `rgba(255,90,106,${a})`; ctx.beginPath(); ctx.arc(w - 30 - i * 24, 38, 6, 0, Math.PI * 2); ctx.fill();
    }
  }

  const ekranTuval = window.KP.tuval(EKRAN.w, EKRAN.h);

  function oda(ctx, t, parlak) {
    ctx.fillStyle = "#02050D"; ctx.fillRect(0, 0, W, H);
    // ekrandan yayılan ışık
    const g = ctx.createRadialGradient(540, 1000, 40, 540, 1050, 1100);
    g.addColorStop(0, `rgba(30,107,255,${0.42 * parlak})`); g.addColorStop(0.35, `rgba(24,120,200,${0.16 * parlak})`); g.addColorStop(1, "rgba(2,5,13,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // pencere (sol üst): gece şehri
    ctx.fillStyle = "#061433"; ctx.fillRect(70, 230, 250, 400);
    const r = rastgele(11);
    for (let i = 0; i < 40; i++) { ctx.fillStyle = r() < 0.7 ? "rgba(143,216,255,0.5)" : "rgba(255,206,140,0.5)"; ctx.fillRect(80 + r() * 230, 420 + r() * 200, 3, 3); }
    ctx.fillStyle = "#03081A"; for (let y = 240; y < 630; y += 26) ctx.fillRect(70, y, 250, 9);
    ctx.strokeStyle = "rgba(143,216,255,0.15)"; ctx.lineWidth = 3; ctx.strokeRect(70, 230, 250, 400);
    // raf ve kitaplar (sağ üst)
    ctx.fillStyle = "#050C1E"; ctx.fillRect(700, 560, 330, 14);
    const r2 = rastgele(12); let x = 712;
    while (x < 1010) { const bw = 18 + r2() * 22, bh = 70 + r2() * 70; ctx.fillStyle = r2() < 0.5 ? "#081633" : "#0A1D40"; ctx.fillRect(x, 560 - bh, bw, bh); x += bw + 3; }
    ctx.fillStyle = "rgba(143,216,255,0.12)"; ctx.fillRect(700, 560, 330, 2);
    // masa
    const m = ctx.createLinearGradient(0, MASA_Y + 5, 0, MASA_Y + 490);
    m.addColorStop(0, `rgba(20,60,130,${0.55 * parlak})`); m.addColorStop(0.4, "#050C1E"); m.addColorStop(1, "#02050D");
    ctx.fillStyle = m; ctx.fillRect(0, MASA_Y, W, H);
    ctx.fillStyle = `rgba(143,216,255,${0.25 * parlak})`; ctx.fillRect(0, MASA_Y, W, 2);
  }

  function laptop(ctx, t) {
    if (YENI) {
      ctx.save();
      ctx.translate(MENTESE_G.x, MENTESE_G.y); ctx.scale(LAPTOP_OLCEK, LAPTOP_OLCEK); ctx.translate(-MENTESE.x, -MENTESE.y);
      laptopCiz(ctx, t);
      ctx.restore();
    } else laptopCiz(ctx, t);
  }
  function laptopCiz(ctx, t) {
    const e = EKRAN;
    const ec = ekranTuval.getContext("2d");
    ec.setTransform(1, 0, 0, 1, 0, 0); ekranIcerik(ec, t);
    parlamaKatmani(ctx, (g) => { g.globalAlpha = 0.9; g.drawImage(ekranTuval, e.x, e.y); }, { blur: 50, guc: 0.55 });
    if (YENI) { yeniLaptop(ctx, e); return; }
    ctx.fillStyle = "#0A0F1E"; ctx.beginPath(); ctx.roundRect(e.x - 18, e.y - 18, e.w + 36, e.h + 36, 18); ctx.fill();
    ctx.drawImage(ekranTuval, e.x, e.y);
    // klavye tabanı
    ctx.fillStyle = "#0B1428";
    ctx.beginPath(); ctx.moveTo(e.x - 40, e.y + e.h + 18); ctx.lineTo(e.x + e.w + 40, e.y + e.h + 18); ctx.lineTo(e.x + e.w + 90, e.y + e.h + 52); ctx.lineTo(e.x - 90, e.y + e.h + 52); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(143,216,255,0.3)"; ctx.fillRect(e.x - 40, e.y + e.h + 18, e.w + 80, 2);
    // kupa ve defterler
    ctx.fillStyle = "#04091A";
    ctx.beginPath(); ctx.roundRect(905, 1150, 82, 100, [6, 6, 14, 14]); ctx.fill();
    ctx.lineWidth = 12; ctx.strokeStyle = "#04091A"; ctx.beginPath(); ctx.arc(990, 1195, 24, -1.2, 1.2); ctx.stroke();
    ctx.fillStyle = "rgba(24,209,227,0.4)"; ctx.fillRect(905, 1150, 3, 96);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = ["#071331", "#0A1A3E", "#061028"][i]; ctx.beginPath(); ctx.roundRect(70 - i * 6, 1218 - i * 16, 170, 16, 3); ctx.fill(); }
    ctx.fillStyle = "rgba(143,216,255,0.25)"; ctx.fillRect(64, 1186, 170, 2);
  }

  // Arkadan, omuz üstünden görülen laptop: ince çerçeveli kapak, kamera, menteşe,
  // perspektifle kameraya doğru genişleyen klavye tabanı, tuşlar ve dokunmatik yüzey.
  function yeniLaptop(ctx, e) {
    const c = 10; // çerçeve
    // kapak (hafif geriye yatık: üst kenar biraz dar)
    ctx.fillStyle = "#151C2C";
    ctx.beginPath(); ctx.moveTo(e.x - c + 6, e.y - c); ctx.lineTo(e.x + e.w + c - 6, e.y - c); ctx.lineTo(e.x + e.w + c, e.y + e.h + c); ctx.lineTo(e.x - c, e.y + e.h + c); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(143,216,255,0.35)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.drawImage(ekranTuval, e.x, e.y);
    ctx.fillStyle = "#05080F"; ctx.beginPath(); ctx.arc(e.x + e.w / 2, e.y - c / 2, 2.5, 0, Math.PI * 2); ctx.fill(); // kamera
    // menteşe
    const ay = e.y + e.h + c;
    ctx.fillStyle = "#0B101C"; ctx.fillRect(e.x + 30, ay, e.w - 60, 7);
    // klavye tabanı: arka kenar menteşede, ön kenar kameraya yakın ve geniş
    const arkaY = ay + 6, onY = ay + 178, arkaG = e.w + 26, onG = e.w + 250, mx = e.x + e.w / 2;
    const nokta = (u, v) => [mx + (u - 0.5) * lerp(arkaG, onG, v), lerp(arkaY, onY, Math.pow(v, 0.9))];
    const taban = ctx.createLinearGradient(0, arkaY, 0, onY);
    taban.addColorStop(0, "#2A3550"); taban.addColorStop(1, "#141B2B");
    ctx.fillStyle = taban;
    ctx.beginPath(); ctx.moveTo(...nokta(0, 0)); ctx.lineTo(...nokta(1, 0)); ctx.lineTo(...nokta(1, 1)); ctx.lineTo(...nokta(0, 1)); ctx.closePath(); ctx.fill();
    // ön kenar kalınlığı
    const [solX, onYk] = nokta(0, 1), [sagX] = nokta(1, 1);
    ctx.fillStyle = "#0A0F1A"; ctx.beginPath(); ctx.moveTo(solX, onYk); ctx.lineTo(sagX, onYk); ctx.lineTo(sagX - 6, onYk + 12); ctx.lineTo(solX + 6, onYk + 12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(143,216,255,0.35)"; ctx.fillRect(solX + 4, onYk, sagX - solX - 8, 1.5);
    // tuşlar (ekran ışığıyla hafif aydınlanır)
    const satirlar = 5, sutun = 14;
    for (let r = 0; r < satirlar; r++) {
      const v0 = 0.06 + r * 0.105, v1 = v0 + 0.085;
      for (let s = 0; s < sutun; s++) {
        let u0 = 0.07 + s * (0.86 / sutun), u1 = u0 + 0.86 / sutun - 0.012;
        if (r === satirlar - 1 && s > 3 && s < 10) { if (s !== 4) continue; u1 = 0.07 + 10 * (0.86 / sutun) - 0.012; } // boşluk tuşu
        const a = nokta(u0, v0), b = nokta(u1, v0), cc = nokta(u1, v1), d = nokta(u0, v1);
        ctx.fillStyle = "#0B111D"; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...cc); ctx.lineTo(...d); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(24,209,227,0.18)"; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    // dokunmatik yüzey
    const t0 = nokta(0.36, 0.64), t1 = nokta(0.64, 0.64), t2 = nokta(0.64, 0.94), t3 = nokta(0.36, 0.94);
    ctx.fillStyle = "#1C2538"; ctx.beginPath(); ctx.moveTo(...t0); ctx.lineTo(...t1); ctx.lineTo(...t2); ctx.lineTo(...t3); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(143,216,255,0.25)"; ctx.stroke();
    // kupa ve defterler masada
    ctx.fillStyle = "#04091A";
    ctx.beginPath(); ctx.roundRect(925, 1110, 82, 100, [6, 6, 14, 14]); ctx.fill();
    ctx.lineWidth = 12; ctx.strokeStyle = "#04091A"; ctx.beginPath(); ctx.arc(1010, 1155, 24, -1.2, 1.2); ctx.stroke();
    ctx.fillStyle = "rgba(24,209,227,0.4)"; ctx.fillRect(925, 1110, 3, 96);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = ["#071331", "#0A1A3E", "#061028"][i]; ctx.beginPath(); ctx.roundRect(40 - i * 6, 1168 - i * 16, 170, 16, 3); ctx.fill(); }
    ctx.fillStyle = "rgba(143,216,255,0.25)"; ctx.fillRect(34, 1136, 170, 2);
  }

  window.KESITLER["01"] = {
    sure: SURE,
    ciz(ctx, t, kare) {
      const parlak = 0.85 + 0.15 * Math.sin(t * 11) * Math.sin(t * 4.3);
      const yakl = ease.inOut(aralik(t, 0, 2.5)), zoom = ease.in(aralik(t, 2.5, 2.92));
      const olcek = (1 + 0.16 * yakl) * (1 + (YENI ? 7 / LAPTOP_OLCEK : 7) * zoom);
      const mx = lerp(540, HEDEF_G.x, zoom), my = lerp(1010, HEDEF_G.y, zoom);

      ctx.save();
      ctx.translate(mx, my); ctx.scale(olcek, olcek); ctx.translate(-mx, -my);
      oda(ctx, t, parlak);
      laptop(ctx, t);
      // öğrenci, arkadan; ekran ışığı başın ve omuzların kenarını boyar
      {
        const p = KP.poz2.ayakta({ nefes: Math.sin(t * 2) * 2, egim: Math.sin(t * 0.8) * 4 });
        p.kollar = [[[-80, -498], [-96, -400], [-72, -318]], [[80, -498], [96, -400], [72, -318]]]; // eller klavyede
        KP.karakter(ctx, p, KP.kadro("deniz", "arka", { canta: null }), {
          x: 480, y: 2170, olcek: 1.5,
          stil: { tip: "sinematik", karartma: `rgba(4,12,40,${0.62 - 0.1 * parlak})` },
          kenarIsigi: [[0, 5, `rgba(120,200,255,${0.75 * parlak})`], [5, 0, "rgba(24,209,227,0.6)"], [-5, 0, "rgba(30,107,255,0.6)"], [0, 7, "rgba(30,107,255,0.8)", 6]],
        });
      }
      // sandalye sırtı (kameraya en yakın katman)
      ctx.fillStyle = "#03060F";
      ctx.beginPath(); ctx.roundRect(300, 1640, 360, 420, [60, 60, 0, 0]); ctx.fill();
      ctx.strokeStyle = `rgba(30,107,255,${0.55 * parlak})`; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(300, 1640, 360, 420, [60, 60, 0, 0]); ctx.stroke();
      ctx.restore();

      vinyet(ctx, 0.7);
      const yaziAlfa = 1 - aralik(t, 2.35, 2.55);
      if (yaziAlfa > 0) {
        ctx.save(); ctx.globalAlpha = yaziAlfa;
        yaziGolgesi(ctx, 450, 420, 0.35);
        satir(ctx, [{ m: "Bir fırsatı" }], { y: 360, boy: 88, agirlik: 800, k: aralik(t, 0.25, 0.55) });
        satir(ctx, [{ m: "kaçırmış", renk: "gradyan" }], { y: 476, boy: 112, agirlik: 900, k: aralik(t, 0.5, 0.8), parlama: 24 });
        satir(ctx, [{ m: "olabilir misin?" }], { y: 576, boy: 88, agirlik: 800, k: aralik(t, 0.75, 1.05) });
        ctx.restore();
      }
      grain(ctx, kare, 0.07);
      // videonun başı: karanlıktan açılış; sonu: turkuaz-beyaz flaş
      const acilis = 1 - ease.out(aralik(t, 0, 0.3));
      if (acilis > 0) { ctx.fillStyle = `rgba(2,5,13,${acilis})`; ctx.fillRect(0, 0, W, H); }
      const flas = ease.in(aralik(t, 2.8, 3.0));
      if (flas > 0) { ctx.fillStyle = `rgba(230,251,255,${flas})`; ctx.fillRect(0, 0, W, H); }
    },
  };
})();
