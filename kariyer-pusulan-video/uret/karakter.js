// Renkli karakterler: ten, saç, üst, alt, ayakkabı ve aksesuar ayrı parçalar olarak, kendi
// renkleriyle çizilir. Aynı karakter farklı "stil"lerle (düz, gölgeli, gradyan, konturlu …) çizilebilir.
// Pozlar figur2.js'teki eklemleri kullanır (ayak tabanı orijin, yukarı eksi y, boy ~660).
(function () {
  const { tuval, lerp, rastgele } = window.KP;

  // --- renk yardımcıları ---
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const rgb = ([r, g, b], a = 1) => `rgba(${r | 0},${g | 0},${b | 0},${a})`;
  const karis = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
  const koyuHex = (h, k) => "#" + karis(hex(h), [10, 14, 30], k).map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const renkAyar = { donustur: (c) => c };
  let aktifIz = null; // gölge bantları için karakter tuvaliyle aynı boyda iki yardımcı tuval
  function ton(h, k) { // k<0 koyu, k>0 açık
    const c = hex(renkAyar.donustur(h));
    return rgb(k < 0 ? karis(c, [10, 14, 30], -k) : karis(c, [255, 250, 240], k));
  }

  // --- yol (path) kurucular: hepsi tek kapalı kontur ---
  function kapsul(g, a, b, wa, wb) {
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), nx = Math.cos(ang + Math.PI / 2), ny = Math.sin(ang + Math.PI / 2);
    g.moveTo(a[0] + nx * wa / 2, a[1] + ny * wa / 2);
    g.lineTo(b[0] + nx * wb / 2, b[1] + ny * wb / 2);
    g.arc(b[0], b[1], wb / 2, ang + Math.PI / 2, ang - Math.PI / 2, true);
    g.lineTo(a[0] - nx * wa / 2, a[1] - ny * wa / 2);
    g.arc(a[0], a[1], wa / 2, ang - Math.PI / 2, ang + Math.PI / 2, true);
    g.closePath();
  }
  const elips = (g, x, y, rx, ry, r = 0) => { g.moveTo(x + rx * Math.cos(r), y + rx * Math.sin(r)); g.ellipse(x, y, rx, ry, r, 0, Math.PI * 2); g.closePath(); };

  // --- parça boyama: stil burada uygulanır ---
  // yol: (g, dx, dy) => kontur(lar) ekler; s: stil; renk: "#rrggbb"
  function boya(g, yol, renk, s, sinir) {
    const p = (dx = 0, dy = 0) => { g.beginPath(); yol(g, dx, dy); };
    const temel = ton(renk, 0);
    if (s.tip === "lowpoly") {
      g.save(); p(); g.clip();
      const r = rastgele(Math.round((sinir ? sinir[0] : 0) * 13 + renk.length)), a = 22;
      const [x0, y0, x1, y1] = sinir || [-200, -700, 200, 20];
      for (let y = y0 - a; y < y1 + a; y += a) for (let x = x0 - a; x < x1 + a; x += a) {
        for (const tri of [[[x, y], [x + a, y], [x, y + a]], [[x + a, y], [x + a, y + a], [x, y + a]]]) {
          g.fillStyle = ton(renk, (x - x0) / (x1 - x0 + 1) * 0.3 - 0.18 + (r() - 0.5) * 0.14);
          g.beginPath(); g.moveTo(...tri[0]); g.lineTo(...tri[1]); g.lineTo(...tri[2]); g.closePath(); g.fill();
        }
      }
      g.restore();
      return;
    }
    const dolgu = () => {
      if (s.tip !== "gradyan" && s.tip !== "gercekci") return temel;
      const [x0, , x1] = sinir || [-100, 0, 100];
      const gr = g.createLinearGradient(x0, 0, x1, 0);
      gr.addColorStop(0, ton(renk, -0.32)); gr.addColorStop(0.55, temel); gr.addColorStop(1, ton(renk, 0.18));
      return gr;
    };
    if (s.tip === "cel" || s.tip === "gercekci" || s.tip === "sinematik") {
      // Parça yardımcı tuvalde kurulur: önce dolgu, sonra ışık sağ üstten geldiği için
      // sol-alt kenarda gölge bandı, sağ kenarda parlak band (parça eksi kaydırılmış parça).
      const [iz, bant] = aktifIz, ig = iz.getContext("2d"), bg = bant.getContext("2d"), T = g.getTransform();
      ig.setTransform(1, 0, 0, 1, 0, 0); ig.clearRect(0, 0, iz.width, iz.height); ig.setTransform(T);
      ig.fillStyle = dolgu(); ig.beginPath(); yol(ig, 0, 0); ig.fill();
      const bantCiz = (dx, dy, r, alfa) => {
        bg.globalCompositeOperation = "source-over"; bg.setTransform(1, 0, 0, 1, 0, 0); bg.clearRect(0, 0, bant.width, bant.height); bg.setTransform(T);
        bg.fillStyle = r; bg.beginPath(); yol(bg, 0, 0); bg.fill();
        bg.globalCompositeOperation = "destination-out"; bg.beginPath(); yol(bg, dx, dy); bg.fill();
        ig.save(); ig.setTransform(1, 0, 0, 1, 0, 0); ig.globalAlpha = alfa; ig.drawImage(bant, 0, 0); ig.restore();
      };
      bantCiz(9, -5, ton(renk, s.tip === "sinematik" ? -0.45 : -0.28), s.tip === "gercekci" ? 0.6 : 1);
      bantCiz(-4, 2, ton(renk, s.tip === "sinematik" ? 0.05 : 0.22), 1);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(iz, 0, 0); g.restore();
    } else { g.fillStyle = dolgu(); p(); g.fill(); }
  }

  // ince ayrıntı çizgisi (dikiş, fermuar, kıvrım); düz ve pastel stillerde daha silik
  function cizgi(g, s, renk, noktalar, kalinlik = 2.5, alfa = 0.55) {
    if (s.tip === "lowpoly") return;
    g.save(); g.strokeStyle = ton(renk, -0.4); g.globalAlpha = alfa * (s.tip === "duz" ? 0.6 : 1); g.lineWidth = kalinlik; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath(); noktalar.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); g.restore();
  }

  // --- karakter çizimi ---
  // k: { gorunum: "arka"|"on", ten, sac: {tip, renk}, ust: {tip, renk, ikinci}, alt: {tip, renk}, ayakkabi: {renk, taban}, canta: {tip, renk}, kulaklik: renk }
  function ciz(g, p, k, s) {
    const on = k.gorunum === "on";
    const [oL, oR] = p.omuz, [kL, kR] = p.kalca, h = p.bas;
    const ust = k.ust, alt = k.alt;
    const bol = ust.tip === "mont" ? 14 : ust.tip === "kapusonlu" ? 8 : ust.tip === "ceket" ? 6 : 0;
    const etekUcu = ust.tip === "ceket" ? (ust.uzun ? -150 : -232) : ust.tip === "mont" ? -244 : ust.tip === "kapusonlu" ? -246 : -268;
    const kisaKol = ust.tip === "tisort";

    // 1) arkadaki saç (önden görünümde omuzlara dökülen uzun saç)
    const sacUzun = k.sac.tip === "uzun" || k.sac.tip === "dalgali";
    if (on && sacUzun) boya(g, (q, dx, dy) => { q.moveTo(h.x - 42 + dx, h.y - 10 + dy); q.bezierCurveTo(h.x - 56 + dx, h.y + 60 + dy, h.x - 54 + dx, h.y + 110 + dy, h.x - 44 + dx, h.y + 132 + dy); q.lineTo(h.x + 44 + dx, h.y + 132 + dy); q.bezierCurveTo(h.x + 54 + dx, h.y + 110 + dy, h.x + 56 + dx, h.y + 60 + dy, h.x + 42 + dx, h.y - 10 + dy); q.closePath(); }, k.sac.renk, s, [h.x - 56, h.y - 20, h.x + 56, h.y + 132]);

    // 2) bacaklar (pantolon ya da ten) ve ayakkabılar
    for (const [i, bc] of p.bacaklar.entries()) {
      const [kk, d, a] = bc, baldir = [lerp(d[0], a[0], 0.35), lerp(d[1], a[1], 0.35)];
      const pant = alt.tip !== "etek";
      const genis = alt.tip === "esofman" ? 6 : alt.tip === "kot" ? 2 : 4;
      const yol = (q, dx, dy) => {
        const o = (pt) => [pt[0] + dx, pt[1] + dy];
        kapsul(q, o(kk), o(d), 56 + genis, 42 + genis);
        kapsul(q, o(d), o(a), 42 + genis, (pant ? 34 + genis : 26));
      };
      boya(g, yol, pant ? alt.renk : k.ten, s, [kk[0] - 30, kk[1], kk[0] + 30, a[1]]);
      if (alt.tip === "kot") { cizgi(g, s, alt.renk, [[kk[0] + (i ? 14 : -14), kk[1] + 10], [a[0] + (i ? 12 : -12), a[1] - 6]], 2, 0.45); cizgi(g, s, alt.renk, [[a[0] - 18, a[1] - 14], [a[0] + 18, a[1] - 14]], 3, 0.5); }
      if (alt.tip === "esofman") boya(g, (q, dx, dy) => kapsul(q, [kk[0] + (i ? 24 : -24) + dx, kk[1] + 6 + dy], [a[0] + (i ? 16 : -16) + dx, a[1] - 10 + dy], 7, 6), alt.ikinci || "#FFFFFF", s, null);
      // ayakkabı
      const ay = k.ayakkabi;
      boya(g, (q, dx, dy) => { q.moveTo(a[0] - 22 + dx, a[1] + 2 + dy); q.quadraticCurveTo(a[0] + dx, a[1] - 10 + dy, a[0] + 22 + dx, a[1] + 2 + dy); q.lineTo(a[0] + 24 + dx, a[1] + 22 + dy); q.lineTo(a[0] - 24 + dx, a[1] + 22 + dy); q.closePath(); }, ay.renk, s, [a[0] - 24, a[1] - 10, a[0] + 24, a[1] + 22]);
      boya(g, (q, dx, dy) => { q.roundRect(a[0] - 25 + dx, a[1] + 16 + dy, 50, 8, 4); }, ay.taban || "#F2F2F2", s, null);
    }

    // 3) etek
    if (alt.tip === "etek") {
      const yol = (q, dx, dy) => { q.moveTo(kL[0] - 30 + dx, -338 + dy); q.lineTo(kR[0] + 30 + dx, -338 + dy); q.quadraticCurveTo(kR[0] + 70 + dx, -250 + dy, kR[0] + 80 + dx, -170 + dy); q.lineTo(kL[0] - 80 + dx, -170 + dy); q.quadraticCurveTo(kL[0] - 70 + dx, -250 + dy, kL[0] - 30 + dx, -338 + dy); q.closePath(); };
      boya(g, yol, alt.renk, s, [kL[0] - 80, -338, kR[0] + 80, -170]);
      for (const x of [-40, -12, 16, 44]) cizgi(g, s, alt.renk, [[x * 0.7, -330], [x * 1.25, -176]], 2, 0.4);
    }

    // 4) gövde (üst giysi)
    const govdeYol = (q, dx, dy) => {
      const bl = bol * 0.5;
      q.moveTo(-24 + dx, oL[1] - 22 + dy);
      q.quadraticCurveTo(-52 + dx, oL[1] - 18 + dy, oL[0] + dx, oL[1] + dy);
      q.bezierCurveTo(oL[0] - 10 - bl + dx, oL[1] + 16 + dy, -72 - bl + dx, -456 + dy, -70 - bl + dx, -430 + dy);
      q.bezierCurveTo(-66 - bl + dx, -390 + dy, -56 - bl + dx, -360 + dy, -56 - bl + dx, -340 + dy);
      q.bezierCurveTo(-58 - bl + dx, -300 + dy, kL[0] - 30 - bl + dx, -280 + dy, kL[0] - 34 - bl - (ust.uzun ? 12 : 0) + dx, etekUcu + dy);
      q.lineTo(kR[0] + 34 + bl + (ust.uzun ? 12 : 0) + dx, etekUcu + dy);
      q.bezierCurveTo(kR[0] + 30 + bl + dx, -280 + dy, 58 + bl + dx, -300 + dy, 56 + bl + dx, -340 + dy);
      q.bezierCurveTo(56 + bl + dx, -360 + dy, 66 + bl + dx, -390 + dy, 70 + bl + dx, -430 + dy);
      q.bezierCurveTo(72 + bl + dx, -456 + dy, oR[0] + 10 + bl + dx, oR[1] + 16 + dy, oR[0] + dx, oR[1] + dy);
      q.quadraticCurveTo(52 + dx, oR[1] - 18 + dy, 24 + dx, oR[1] - 22 + dy);
      q.closePath();
    };
    boya(g, govdeYol, ust.renk, s, [-90, -540, 90, etekUcu]);
    // giysi ayrıntıları
    if (ust.tip === "mont") for (let y = -470; y < etekUcu - 10; y += 46) cizgi(g, s, ust.renk, [[-64, y], [-20, y + 6], [20, y + 6], [64, y]], 2.5, 0.5);
    if (ust.tip === "kapusonlu" || ust.tip === "kazak") cizgi(g, s, ust.renk, [[kL[0] - 34, etekUcu - 20], [kR[0] + 34, etekUcu - 20]], 2.5, 0.5); // ribanalı etek ucu
    if (ust.tip === "ceket") { cizgi(g, s, ust.renk, on ? [[0, -520], [0, etekUcu]] : [[0, -500], [0, etekUcu]], 2.5, 0.5); if (on) { cizgi(g, s, ust.renk, [[-26, -526], [-8, -440]], 3, 0.6); cizgi(g, s, ust.renk, [[26, -526], [8, -440]], 3, 0.6); } }
    if (ust.tip === "gomlek" && on) { cizgi(g, s, ust.renk, [[0, -520], [0, etekUcu]], 2, 0.45); for (let y = -500; y < etekUcu; y += 50) { g.fillStyle = ton(ust.renk, -0.35); g.beginPath(); g.arc(4, y, 3.5, 0, Math.PI * 2); g.fill(); } }
    if (ust.tip === "kapusonlu" && on) { cizgi(g, s, "#DDDDDD", [[-14, -520], [-16, -456]], 3, 0.8); cizgi(g, s, "#DDDDDD", [[14, -520], [16, -456]], 3, 0.8); cizgi(g, s, ust.renk, [[-44, -330], [-30, -380], [30, -380], [44, -330]], 2.5, 0.5); }
    if (ust.desen === "cizgili") { g.save(); g.beginPath(); govdeYol(g, 0, 0); g.clip(); g.fillStyle = ton(ust.ikinci || "#FFFFFF", 0); g.globalAlpha = 0.85; for (let y = -500; y < etekUcu; y += 30) g.fillRect(-120, y, 240, 10); g.restore(); }

    // 5) sırt çantası (arkadan gövdenin üstünde; önden yalnızca askılar)
    const canta = k.canta;
    if (canta && canta.tip === "sirt") {
      if (!on) {
        boya(g, (q, dx, dy) => q.roundRect(-62 + dx, -494 + dy, 124, 190, 36), canta.renk, s, [-62, -494, 62, -304]);
        boya(g, (q, dx, dy) => q.roundRect(-46 + dx, -390 + dy, 92, 70, 18), canta.renk, s, [-46, -390, 46, -320]);
        cizgi(g, s, canta.renk, [[-40, -470], [40, -470]], 3, 0.5);
      } else for (const sx of [-1, 1]) boya(g, (q, dx, dy) => kapsul(q, [sx * 44 + dx, -512 + dy], [sx * 50 + dx, -380 + dy], 13, 12), canta.renk, s, null);
    }

    // 6) kollar (kol kumaşı) ve eller
    for (const kol of p.kollar) {
      const [o, d, e] = kol;
      const bilek = [lerp(d[0], e[0], kisaKol ? 0.15 : 1), lerp(d[1], e[1], kisaKol ? 0.15 : 1)];
      boya(g, (q, dx, dy) => { const t = (pt) => [pt[0] + dx, pt[1] + dy]; kapsul(q, t(o), t(d), 36 + bol * 0.6, 31 + bol * 0.5); kapsul(q, t(d), t(bilek), 31 + bol * 0.5, 26 + bol * 0.3); }, ust.renk, s, [Math.min(o[0], e[0]) - 20, o[1], Math.max(o[0], e[0]) + 20, e[1]]);
      if (kisaKol) boya(g, (q, dx, dy) => kapsul(q, [bilek[0] + dx, bilek[1] + dy], [e[0] + dx, e[1] + dy], 23, 19), k.ten, s, null);
      const yon = Math.atan2(e[1] - d[1], e[0] - d[0]);
      boya(g, (q, dx, dy) => elips(q, e[0] + Math.cos(yon) * 17 + dx, e[1] + Math.sin(yon) * 17 + dy, 13, 22, yon - Math.PI / 2), k.ten, s, null);
    }
    // telefon (önden: ekran ışığı; arkadan: görünmez)
    if (p.telefon && on) {
      boya(g, (q, dx, dy) => q.roundRect(p.telefon.x - 13 + dx, p.telefon.y - 20 + dy, 26, 42, 5), "#1A1F2E", s, null);
    }

    // 7) boyun, baş, saç
    const kapusonArka = ust.tip === "kapusonlu";
    const yeniGorunum = !!(window.KP.SECENEK || {}).yuz;
    boya(g, (q, dx, dy) => kapsul(q, [h.x * 0.6 + dx, -522 + dy], [h.x * 0.85 + dx, -566 + dy], 30, 27), k.ten, s, null);
    if (kapusonArka) boya(g, (q, dx, dy) => elips(q, h.x * 0.5 + dx, -528 + dy, 48, 22), ust.renk, s, [-48, -550, 48, -506]);
    else if (on && yeniGorunum) boya(g, (q, dx, dy) => { q.moveTo(-26 + dx, -538 + dy); q.quadraticCurveTo(0 + dx, -522 + dy, 26 + dx, -538 + dy); q.lineTo(30 + dx, -530 + dy); q.quadraticCurveTo(0 + dx, -512 + dy, -30 + dx, -530 + dy); q.closePath(); }, koyuHex(ust.renk, 0.22), s, [-30, -540, 30, -512]);
    if (k.kulaklik) boya(g, (q, dx, dy) => { q.moveTo(-40 + dx, -540 + dy); q.quadraticCurveTo(0 + dx, -500 + dy, 40 + dx, -540 + dy); q.lineTo(34 + dx, -530 + dy); q.quadraticCurveTo(0 + dx, -508 + dy, -34 + dx, -530 + dy); q.closePath(); elips(q, -38 + dx, -536 + dy, 11, 15); elips(q, 38 + dx, -536 + dy, 11, 15); }, k.kulaklik, s, null);
    // kulaklar ve baş
    for (const sx of [-1, 1]) boya(g, (q, dx, dy) => elips(q, h.x + sx * 33 + dx, h.y + 2 + dy, 7, 12), k.ten, s, null);
    boya(g, (q, dx, dy) => { q.moveTo(h.x + 33 + dx, h.y + dy); q.bezierCurveTo(h.x + 34 + dx, h.y + 30 + dy, h.x + 18 + dx, h.y + 44 + dy, h.x + dx, h.y + 44 + dy); q.bezierCurveTo(h.x - 18 + dx, h.y + 44 + dy, h.x - 34 + dx, h.y + 30 + dy, h.x - 33 + dx, h.y + dy); q.bezierCurveTo(h.x - 33 + dx, h.y - 26 + dy, h.x - 18 + dx, h.y - 42 + dy, h.x + dx, h.y - 42 + dy); q.bezierCurveTo(h.x + 18 + dx, h.y - 42 + dy, h.x + 33 + dx, h.y - 26 + dy, h.x + 33 + dx, h.y + dy); q.closePath(); }, k.ten, s, [h.x - 34, h.y - 42, h.x + 34, h.y + 44]);
    // saç
    const sr = k.sac.renk, st = k.sac.tip;
    const sacYol = {
      kisa: (q, dx, dy) => { q.moveTo(h.x - 35 + dx, h.y + (on ? -6 : 14) + dy); q.bezierCurveTo(h.x - 38 + dx, h.y - 40 + dy, h.x - 16 + dx, h.y - 52 + dy, h.x + 4 + dx, h.y - 50 + dy); q.bezierCurveTo(h.x + 30 + dx, h.y - 48 + dy, h.x + 40 + dx, h.y - 30 + dy, h.x + 35 + dx, h.y + (on ? -6 : 14) + dy); if (on) q.quadraticCurveTo(h.x + dx, h.y - 30 + dy, h.x - 35 + dx, h.y - 6 + dy); else q.quadraticCurveTo(h.x + dx, h.y + 30 + dy, h.x - 35 + dx, h.y + 14 + dy); q.closePath(); },
      uzun: (q, dx, dy) => { q.moveTo(h.x - 38 + dx, h.y + 4 + dy); q.bezierCurveTo(h.x - 42 + dx, h.y - 60 + dy, h.x + 42 + dx, h.y - 60 + dy, h.x + 38 + dx, h.y + 4 + dy); if (on) { q.quadraticCurveTo(h.x + 10 + dx, h.y - 34 + dy, h.x - 38 + dx, h.y + 4 + dy); } else { q.bezierCurveTo(h.x + 46 + dx, h.y + 70 + dy, h.x + 46 + dx, h.y + 120 + dy, h.x + 40 + dx, h.y + 132 + dy); q.lineTo(h.x - 40 + dx, h.y + 132 + dy); q.bezierCurveTo(h.x - 46 + dx, h.y + 120 + dy, h.x - 46 + dx, h.y + 70 + dy, h.x - 38 + dx, h.y + 4 + dy); } q.closePath(); },
      topuz: (q, dx, dy) => { q.moveTo(h.x - 35 + dx, h.y + (on ? -4 : 10) + dy); q.bezierCurveTo(h.x - 40 + dx, h.y - 60 + dy, h.x + 40 + dx, h.y - 60 + dy, h.x + 35 + dx, h.y + (on ? -4 : 10) + dy); q.quadraticCurveTo(h.x + dx, h.y + (on ? -28 : 24) + dy, h.x - 35 + dx, h.y + (on ? -4 : 10) + dy); q.closePath(); elips(q, h.x + dx, h.y - 50 + dy, 22, 18); },
      kivircik: (q, dx, dy) => { for (let i = 0; i < 11; i++) { const a = Math.PI * (0.95 + i * 0.11); elips(q, h.x + Math.cos(a) * 34 + dx, h.y - 6 + Math.sin(a) * 40 + dy, 17, 16); } if (!on) elips(q, h.x + dx, h.y + 4 + dy, 32, 30); },
      bere: (q, dx, dy) => { const alt = on ? -8 : 16; q.moveTo(h.x - 38 + dx, h.y + alt + dy); q.bezierCurveTo(h.x - 42 + dx, h.y - 70 + dy, h.x + 42 + dx, h.y - 70 + dy, h.x + 38 + dx, h.y + alt + dy); q.lineTo(h.x - 38 + dx, h.y + alt + dy); q.closePath(); },
    };
    sacYol.dalgali = sacYol.uzun;
    boya(g, sacYol[st], sr, s, [h.x - 46, h.y - 50, h.x + 46, h.y + 132]);
    // kâkül (önden): alnı biraz örter, yüze doğallık katar
    if (on && yeniGorunum && (st === "uzun" || st === "dalgali" || st === "kisa")) boya(g, (q, dx, dy) => {
      q.moveTo(h.x - 35 + dx, h.y + (st === "kisa" ? -6 : 8) + dy);
      q.bezierCurveTo(h.x - 38 + dx, h.y - 50 + dy, h.x + 38 + dx, h.y - 50 + dy, h.x + 35 + dx, h.y + (st === "kisa" ? -8 : 4) + dy);
      q.quadraticCurveTo(h.x + 26 + dx, h.y - 20 + dy, h.x + 6 + dx, h.y - 18 + dy);
      q.quadraticCurveTo(h.x - 18 + dx, h.y - 16 + dy, h.x - 35 + dx, h.y + (st === "kisa" ? -6 : 8) + dy);
      q.closePath(); }, sr, s, [h.x - 38, h.y - 46, h.x + 38, h.y + 8]);
    if (st === "dalgali" && !on) for (const x of [-22, 0, 22]) cizgi(g, s, sr, [[h.x + x, h.y + 10], [h.x + x - 6, h.y + 60], [h.x + x + 4, h.y + 110]], 2.5, 0.45);
    if (st === "bere") { boya(g, (q, dx, dy) => q.roundRect(h.x - 40 + dx, h.y + (on ? -16 : 6) + dy, 80, 16, 6), sr, s, null); boya(g, (q, dx, dy) => elips(q, h.x + dx, h.y - 60 + dy, 9, 9), sr, s, null); }
    // önden: yüz. --yuz sade|detayli ile yüz hatları çizilir; yoksa yalnızca burun ve yanak gölgesi
    const yuzModu = (window.KP.SECENEK || {}).yuz || "yok";
    if (on && yuzModu !== "yok") yuz(g, h, k, yuzModu);
    else if (on && s.tip !== "duz" && s.tip !== "lowpoly") {
      g.save(); g.globalAlpha = 0.25; g.fillStyle = ton(k.ten, -0.4);
      g.beginPath(); g.ellipse(h.x + 4 + (h.don || 0) * 16, h.y + 14, 4, 9, 0, 0, Math.PI * 2); g.fill();
      if (h.don) { g.globalAlpha = 0.18 * h.don; g.beginPath(); g.ellipse(h.x - 22, h.y + 6, 12, 26, 0, 0, Math.PI * 2); g.fill(); }
      g.restore();
    }
    // omuz çantası
    if (canta && canta.tip === "omuz") {
      cizgi(g, s, canta.renk, [[oR[0] - 18, oR[1] - 6], [oR[0] + 8, -330]], 5, 0.95);
      boya(g, (q, dx, dy) => q.roundRect(oR[0] - 18 + dx, -340 + dy, 74, 92, 10), canta.renk, s, [oR[0] - 18, -340, oR[0] + 56, -248]);
    }
  }

  // Yüz hatları. h: baş (x, y, don = sağa dönüş 0..1). Baş: rx 33, çene h.y + 44.
  function yuz(g, h, k, mod) {
    const d = (h.don || 0), fx = h.x + d * 10;          // yüz dönünce hatlar sağa kayar
    const sac = k.sac.renk, tenK = ton(k.ten, -0.38), tenA = ton(k.ten, 0.12);
    g.save(); g.lineCap = "round"; g.lineJoin = "round";
    const goz = [[-12, 1], [12, 1]].map(([x, y]) => [fx + x * (x < 0 ? 1 - d * 0.35 : 1), h.y + y]);
    if (mod === "sade") {
      for (const [x, y] of goz) { g.fillStyle = "#1A1210"; g.beginPath(); g.ellipse(x, y, 3.2, 4.2, 0, 0, Math.PI * 2); g.fill(); }
      g.strokeStyle = ton(sac, -0.1); g.lineWidth = 3.2;
      for (const [x, y] of goz) { g.beginPath(); g.moveTo(x - 6, y - 10); g.quadraticCurveTo(x, y - 13, x + 6, y - 10); g.stroke(); }
      g.strokeStyle = tenK; g.lineWidth = 2.4; g.globalAlpha = 0.7;
      g.beginPath(); g.moveTo(fx + 2, h.y + 8); g.quadraticCurveTo(fx + 5, h.y + 16, fx, h.y + 17); g.stroke(); // burun
      g.globalAlpha = 0.9; g.strokeStyle = ton(k.ten, -0.5); g.lineWidth = 2.6;
      g.beginPath(); g.moveTo(fx - 7, h.y + 26); g.quadraticCurveTo(fx, h.y + 30, fx + 7, h.y + 26); g.stroke(); // gülümseme
    } else {
      // ayrıntılı: badem göz (beyaz, iris, göz bebeği, ışık), göz kapağı, kaş, burun, dudak, yanak
      for (const [x, y] of goz) {
        g.fillStyle = "#EDE8E1"; g.beginPath(); g.ellipse(x, y, 6.2, 3.8, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#4A2E1C"; g.beginPath(); g.arc(x + d * 1.5, y + 0.3, 3.7, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#120A06"; g.beginPath(); g.arc(x + d * 1.5, y + 0.3, 1.7, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#FFFFFF"; g.beginPath(); g.arc(x + d * 1.5 + 1.3, y - 1.2, 0.9, 0, Math.PI * 2); g.fill();
        g.strokeStyle = "#1A1210"; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y + 0.4, 6.6, 4.2, 0, Math.PI * 1.02, Math.PI * 1.98); g.stroke();
      }
      g.strokeStyle = ton(sac, -0.05); g.lineWidth = 2.8;
      for (const [x, y] of goz) { g.beginPath(); g.moveTo(x - 8, y - 9); g.quadraticCurveTo(x - 1, y - 14, x + 8, y - 11); g.stroke(); }
      g.fillStyle = tenK; g.globalAlpha = 0.35; g.beginPath(); g.ellipse(fx + 3, h.y + 12, 3.4, 8, 0, 0, Math.PI * 2); g.fill();
      g.globalAlpha = 0.7; for (const sx of [-1, 1]) { g.beginPath(); g.arc(fx + sx * 3.5 + 1, h.y + 19, 1.6, 0, Math.PI * 2); g.fill(); }
      g.globalAlpha = 1; g.fillStyle = ton("#B5524E", -0.05);
      g.beginPath(); g.moveTo(fx - 8, h.y + 27); g.quadraticCurveTo(fx - 3, h.y + 24, fx, h.y + 25.5); g.quadraticCurveTo(fx + 3, h.y + 24, fx + 8, h.y + 27);
      g.quadraticCurveTo(fx, h.y + 33, fx - 8, h.y + 27); g.fill();
      g.fillStyle = "#E07A6E"; g.globalAlpha = 0.16; for (const sx of [-1, 1]) { g.beginPath(); g.ellipse(fx + sx * 18, h.y + 16, 7, 4.5, 0, 0, Math.PI * 2); g.fill(); }
    }
    g.restore();
  }

  // Karakteri ayrı tuvale çizer; stil sonrası işlemler (grain, kenar ışığı) burada.
  const onbellek = {};
  // koru: renk dönüşümünden muaf tutulacak renkler (ör. ten ve saç doğal kalsın)
  function karakter(ctx, p, k, { x, y, olcek = 1, stil = { tip: "cel" }, kenarIsigi = null, renkDonustur = null, koru = [] }) {
    const MW = Math.ceil(380 * olcek) + 60, MH = Math.ceil(760 * olcek) + 60, MX = MW / 2, MY = MH - 30;
    const anahtar = `${MW}x${MH}`;
    if (!onbellek[anahtar]) onbellek[anahtar] = [tuval(MW, MH), tuval(MW, MH), tuval(MW, MH), tuval(MW, MH)];
    const [c, kenar, iz, bant] = onbellek[anahtar], g = c.getContext("2d");
    aktifIz = [iz, bant];
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, MW, MH);
    g.setTransform(olcek, 0, 0, olcek, MX, MY);
    renkAyar.donustur = renkDonustur ? (h) => (koru.includes(h) ? h : renkDonustur(h)) : (h) => h;
    ciz(g, p, k, stil);
    renkAyar.donustur = (h) => h;
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (stil.grain) {
      const r = rastgele(7), v = g.getImageData(0, 0, MW, MH), d = v.data;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 0) { const n = (r() - 0.5) * stil.grain; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
      g.putImageData(v, 0, 0);
    }
    if (stil.karartma) { g.globalCompositeOperation = "source-atop"; g.fillStyle = stil.karartma; g.fillRect(0, 0, MW, MH); g.globalCompositeOperation = "source-over"; }
    if (stil.tip === "kontur") {
      // dış hat: karakter maskesinin dört yöne kaydırılmış kopyaları koyu renkle arkaya çizilir
      const kg = kenar.getContext("2d");
      kg.globalCompositeOperation = "source-over"; kg.clearRect(0, 0, MW, MH); kg.drawImage(c, 0, 0);
      kg.globalCompositeOperation = "source-in"; kg.fillStyle = "#141A2E"; kg.fillRect(0, 0, MW, MH);
      ctx.save();
      for (const [dx, dy] of [[-4, 0], [4, 0], [0, -4], [0, 4], [-3, -3], [3, 3], [-3, 3], [3, -3]]) ctx.drawImage(kenar, x - MX + dx, y - MY + dy);
      ctx.restore();
    }
    ctx.save();
    if (stil.kayma) { ctx.globalAlpha = 0.5; ctx.globalCompositeOperation = "multiply"; ctx.drawImage(c, x - MX + stil.kayma, y - MY + 2); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; }
    ctx.drawImage(c, x - MX, y - MY);
    if (kenarIsigi) {
      const kg = kenar.getContext("2d");
      for (const [dx, dy, renk, bulanik] of kenarIsigi) {
        kg.globalCompositeOperation = "source-over"; kg.clearRect(0, 0, MW, MH); kg.drawImage(c, 0, 0);
        kg.globalCompositeOperation = "source-in"; kg.fillStyle = renk; kg.fillRect(0, 0, MW, MH);
        kg.globalCompositeOperation = "destination-out"; kg.drawImage(c, dx, dy);
        ctx.globalCompositeOperation = "lighter"; ctx.filter = bulanik ? `blur(${bulanik}px)` : "none";
        ctx.drawImage(kenar, x - MX, y - MY); ctx.filter = "none";
      }
    }
    ctx.restore();
  }

  Object.assign(window.KP, { karakter, renk: { hex, rgb, karis } });
})();
