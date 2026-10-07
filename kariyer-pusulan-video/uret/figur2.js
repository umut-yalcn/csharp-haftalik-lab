// Geliştirilmiş insan silüeti: gerçekçi oranlar, kıyafet ve saç seçenekleri, yumuşatılmış kontur.
// Gövde konik parçalardan kurulur, sonra bulanıklaştırılıp eşiklenir; böylece eklem yerlerindeki
// "manken" kırıkları kaybolur ve tek parça, organik bir kontur elde edilir.
// Yerel koordinat: ayak tabanı orijin, yukarı eksi y, boy ~660 birim.
(function () {
  const { tuval, lerp } = window.KP;

  // --- pozlar (eklemler) ---
  function ayakta2({ nefes = 0, egim = 0, agirlik = 0, telefon = null } = {}) {
    const n = nefes, a = agirlik; // agirlik: -1 sol bacak, +1 sağ bacak taşır (kalça kayar)
    const p = {
      bas: { x: egim + a * 4, y: ((window.KP.SECENEK || {}).yuz ? -590 : -598) - n }, // yeni görünümde boyun daha kısa
      omuz: [[-74, -510 - n + a * 3], [74, -510 - n - a * 3]],
      kalca: [[-34 + a * 6, -262 + a * 4], [34 + a * 6, -262 - a * 4]],
      kollar: [
        ...(((window.KP.SECENEK || {}).yuz) // yeni görünüm: kollar gövdeye yakın, dirsekte hafif bükük
          ? [[[-80, -498 - n], [-92, -384], [-90, -282]], [[80, -498 - n], [92, -384], [90, -282]]]
          : [[[-80, -498 - n], [-100, -382], [-108, -276]], [[80, -498 - n], [100, -382], [108, -276]]]),
      ],
      bacaklar: [
        [[-34 + a * 6, -262], [-36 + a * 2, -140], [-38, -24]],
        [[34 + a * 6, -262], [36 + a * 2, -140], [38, -24]],
      ],
      ayak: [0, 0], telefon: null,
    };
    if (telefon) {
      const i = telefon === "sol" ? 0 : 1, s = i ? 1 : -1;
      p.kollar[i] = [[80 * s, -498 - n], [76 * s, -384], [34 * s, -430]];
      p.telefon = { x: 22 * s, y: -452 };
      p.bas.y += 8; // telefona eğilir
    }
    return p;
  }

  // Yürüme (arkadan): diz bükülür, topuk kalkar, kollar karşıt sallanır, gövde hafif iner-kalkar
  function yuru2(faz) {
    const a = faz * Math.PI * 2;
    const zipla = (1 - Math.cos(a * 2)) * 4;
    const p = ayakta2();
    p.bas.y -= zipla; p.bas.x += Math.sin(a) * 3;
    p.omuz = p.omuz.map(([x, y], i) => [x, y - zipla + (i ? 1 : -1) * Math.sin(a) * 4]);
    p.kalca = p.kalca.map(([x, y], i) => [x + Math.sin(a) * 4, y - zipla - (i ? 1 : -1) * Math.sin(a) * 5]);
    for (let i = 0; i < 2; i++) {
      const s = i ? 1 : -1, f = Math.sin(a + i * Math.PI);
      const kalk = Math.max(0, f); // bu bacak geride: topuk kalkar, diz bükülür
      const k = p.kalca[i];
      p.bacaklar[i] = [k, [36 * s + Math.sin(a) * 2, -140 - zipla + kalk * 18], [38 * s, -24 - kalk * 46 - Math.max(0, -f) * 6]];
      const sal = Math.sin(a + i * Math.PI + Math.PI);
      p.kollar[i] = [[80 * s, -498 - zipla], [(100 + sal * 4) * s, -382 - zipla + sal * 6], [(106 + sal * 10) * s, -278 - zipla + Math.abs(sal) * 14]];
    }
    return p;
  }

  // --- çizim ---
  // Konik parça: a noktasından b noktasına, wa'dan wb'ye incelen yuvarlak uçlu şerit
  function konik(g, a, b, wa, wb) {
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    g.beginPath();
    g.moveTo(a[0] + nx * wa / 2, a[1] + ny * wa / 2); g.lineTo(b[0] + nx * wb / 2, b[1] + ny * wb / 2);
    g.lineTo(b[0] - nx * wb / 2, b[1] - ny * wb / 2); g.lineTo(a[0] - nx * wa / 2, a[1] - ny * wa / 2); g.closePath(); g.fill();
    g.beginPath(); g.arc(a[0], a[1], wa / 2, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(b[0], b[1], wb / 2, 0, Math.PI * 2); g.fill();
  }

  // giyim: { ust: "kapusonlu"|"ceket"|"tisort"|"mont", alt: "pantolon"|"etek"|"sort", sac: "kisa"|"uzun"|"topuz"|"at"|"bere"|"kivircik", canta: bool, beden: 0.9..1.1 }
  function govde(g, p, giyim = {}) {
    const ust = giyim.ust || "ceket", alt = giyim.alt || "pantolon", sac = giyim.sac || "kisa", b = giyim.beden || 1;
    const [oL, oR] = p.omuz, [kL, kR] = p.kalca;
    const bol = ust === "kapusonlu" || ust === "mont" ? 10 : 0;

    // bacaklar: uyluk kalın, dizde incelir, baldır, bilek
    for (const bc of p.bacaklar) {
      const [k, d, a] = bc, baldir = [lerp(d[0], a[0], 0.35), lerp(d[1], a[1], 0.35)];
      const pc = alt === "pantolon" ? 4 : 0;
      konik(g, k, d, 56 * b + pc, 40 * b + pc);
      konik(g, d, baldir, 42 * b + pc, 44 * b + pc);
      konik(g, baldir, a, 44 * b + pc, (alt === "pantolon" ? 34 : 26) * b);
      // ayakkabı
      g.beginPath(); g.ellipse(a[0], a[1] + 12, 21, 13, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.roundRect(a[0] - 21, a[1] + 6, 42, 20, 9); g.fill();
    }
    // etek / şort
    if (alt === "etek") {
      g.beginPath(); g.moveTo(kL[0] - 30, -330); g.lineTo(kR[0] + 30, -330);
      g.quadraticCurveTo(kR[0] + 70, -250, kR[0] + 78, -176); g.lineTo(kL[0] - 78, -176);
      g.quadraticCurveTo(kL[0] - 70, -250, kL[0] - 30, -330); g.closePath(); g.fill();
    }
    // gövde: boyun dibinden eğimli omuz, göğüs, belde incelme, kalça; kıyafetin etek ucu
    const etekUcu = ust === "ceket" || ust === "mont" ? -236 : ust === "kapusonlu" ? -244 : -262;
    const bl = bol * 0.5;
    g.beginPath();
    g.moveTo(-24, oL[1] - 22);
    g.quadraticCurveTo(-52, oL[1] - 18, oL[0], oL[1]);                                   // trapez kası, omuz eğimi
    g.bezierCurveTo(oL[0] - 10 - bl, oL[1] + 16, -72 * b - bl, -456, -70 * b - bl, -430);  // omuz başı, göğüs
    g.bezierCurveTo(-66 * b - bl, -390, -56 * b - bl, -360, -56 * b - bl, -340);           // bel
    g.bezierCurveTo(-58 * b - bl, -300, kL[0] - 30 - bl, -280, kL[0] - 32 - bl, etekUcu);  // kalça
    g.lineTo(kR[0] + 32 + bl, etekUcu);
    g.bezierCurveTo(kR[0] + 30 + bl, -280, 58 * b + bl, -300, 56 * b + bl, -340);
    g.bezierCurveTo(56 * b + bl, -360, 66 * b + bl, -390, 70 * b + bl, -430);
    g.bezierCurveTo(72 * b + bl, -456, oR[0] + 10 + bl, oR[1] + 16, oR[0], oR[1]);
    g.quadraticCurveTo(52, oR[1] - 18, 24, oR[1] - 22);
    g.closePath(); g.fill();
    // kollar: üst kol, ön kol, bilek, el
    for (const kol of p.kollar) {
      const [o, d, e] = kol;
      konik(g, o, d, (32 + bol * 0.6) * b, (26 + bol * 0.5) * b);
      konik(g, d, e, (26 + bol * 0.5) * b, (ust === "tisort" ? 18 : 21 + bol * 0.3) * b);
      const yon = Math.atan2(e[1] - d[1], e[0] - d[0]);
      g.save(); g.translate(e[0] + Math.cos(yon) * 16, e[1] + Math.sin(yon) * 16); g.rotate(yon - Math.PI / 2);
      g.beginPath(); g.ellipse(0, 0, 12, 20, 0, 0, Math.PI * 2); g.fill(); g.restore();
    }
    // kapüşon (ensede yığılır) ve sırt çantası
    if (ust === "kapusonlu") { g.beginPath(); g.ellipse(p.bas.x * 0.5, -530, 46, 24, 0, 0, Math.PI * 2); g.fill(); }
    if (ust === "ceket") { g.beginPath(); g.ellipse(p.bas.x * 0.5, -530, 34, 16, 0, 0, Math.PI * 2); g.fill(); }
    if (giyim.canta) { g.beginPath(); g.roundRect(-66, -496, 132, 196, 40); g.fill(); }
    // boyun ve baş
    const h = p.bas;
    konik(g, [h.x * 0.6, -520], [h.x * 0.85, -566], 34, 30);
    g.beginPath(); g.ellipse(h.x, h.y, 33, 41, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(h.x, h.y + 22, 26, 24, 0, 0, Math.PI * 2); g.fill(); // çene hattı
    // kulaklar
    for (const s of [-1, 1]) { g.beginPath(); g.ellipse(h.x + s * 33, h.y + 2, 7, 12, 0, 0, Math.PI * 2); g.fill(); }
    // saç
    if (sac === "kisa") { g.beginPath(); g.ellipse(h.x, h.y - 12, 36, 36, 0, Math.PI * 0.95, Math.PI * 2.05); g.fill(); }
    if (sac === "kivircik") { for (let i = 0; i < 9; i++) { const a = Math.PI * (1 + i / 8); g.beginPath(); g.arc(h.x + Math.cos(a) * 34, h.y - 8 + Math.sin(a) * 38, 15, 0, Math.PI * 2); g.fill(); } }
    if (sac === "uzun") {
      g.beginPath(); g.moveTo(h.x - 38, h.y - 14);
      g.bezierCurveTo(h.x - 46, h.y + 50, h.x - 50, h.y + 96, h.x - 40, h.y + 128);
      g.lineTo(h.x + 40, h.y + 128); g.bezierCurveTo(h.x + 50, h.y + 96, h.x + 46, h.y + 50, h.x + 38, h.y - 14);
      g.closePath(); g.fill();
      g.beginPath(); g.ellipse(h.x, h.y - 10, 38, 38, 0, Math.PI, Math.PI * 2); g.fill();
    }
    if (sac === "topuz") { g.beginPath(); g.ellipse(h.x, h.y - 10, 36, 36, 0, Math.PI, Math.PI * 2); g.fill(); g.beginPath(); g.arc(h.x, h.y - 56, 20, 0, Math.PI * 2); g.fill(); }
    if (sac === "at") {
      g.beginPath(); g.ellipse(h.x, h.y - 10, 36, 36, 0, Math.PI, Math.PI * 2); g.fill();
      konik(g, [h.x, h.y - 20], [h.x + 6, h.y + 70], 26, 12);
    }
    if (sac === "bere") { g.beginPath(); g.ellipse(h.x, h.y - 16, 40, 38, 0, Math.PI * 0.92, Math.PI * 2.08); g.fill(); g.beginPath(); g.arc(h.x, h.y - 56, 9, 0, Math.PI * 2); g.fill(); }
  }

  // Maske: konik parçalar çizilir, bulanıklaştırılıp eşiklenerek tek parça yumuşak kontura çevrilir.
  const onbellek = {};
  function figurMaskesi2(p, olcek = 1, giyim = {}) {
    const MW = Math.ceil(360 * olcek) + 60, MH = Math.ceil(740 * olcek) + 60, MX = MW / 2, MY = MH - 30;
    const anahtar = `${MW}x${MH}`;
    if (!onbellek[anahtar]) onbellek[anahtar] = [tuval(MW, MH), tuval(MW, MH)];
    const [ham, sonuc] = onbellek[anahtar];
    const h = ham.getContext("2d");
    h.setTransform(1, 0, 0, 1, 0, 0); h.clearRect(0, 0, MW, MH);
    h.setTransform(olcek, 0, 0, olcek, MX, MY); h.fillStyle = "#fff";
    govde(h, p, giyim);
    const s = sonuc.getContext("2d", { willReadFrequently: true });
    s.setTransform(1, 0, 0, 1, 0, 0); s.clearRect(0, 0, MW, MH);
    s.filter = `blur(${Math.max(1.5, 3.2 * olcek)}px)`; s.drawImage(ham, 0, 0); s.filter = "none";
    const v = s.getImageData(0, 0, MW, MH), d = v.data;
    for (let i = 3; i < d.length; i += 4) { const a = d[i]; d[i] = a < 96 ? 0 : a > 150 ? 255 : ((a - 96) / 54) * 255; d[i - 1] = d[i - 2] = d[i - 3] = 255; }
    s.putImageData(v, 0, 0);
    return { tuval: sonuc, MX, MY, MW, MH };
  }

  Object.assign(window.KP, { poz2: { ayakta: ayakta2, yuru: yuru2 }, figurMaskesi2 });
})();
