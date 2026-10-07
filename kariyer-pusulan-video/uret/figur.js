// Poz verilebilen insan silüeti. Eklemler (baş, omuz, dirsek, el, kalça, diz, bilek) yerel
// koordinatta verilir: ayak tabanı orijin, yukarı eksi y, boy ~660 birim.
// Silüet önce maskeye çizilir; kenar ışığı maskenin kaydırılmış kopyası çıkarılarak bulunur.
(function () {
  const { tuval, lerp } = window.KP;

  // --- pozlar ---
  // Ayakta, arkadan ya da önden (silüette ikisi aynı görünür)
  function ayakta({ nefes = 0, telefon = null, egim = 0, kolAcik = 0 } = {}) {
    const n = nefes;
    const p = {
      bas: { x: egim * 0.6, y: -598 - n, rx: 37, ry: 45, profil: 0 },
      omuz: { y: -515 - n, gen: 86 }, kalca: { y: -262, gen: 44 },
      kollar: [
        [[-86, -500 - n], [-100 - kolAcik, -385], [-92 - kolAcik * 0.6, -272]],
        [[86, -500 - n], [100 + kolAcik, -385], [92 + kolAcik * 0.6, -272]],
      ],
      bacaklar: [
        [[-27, -262], [-30, -134], [-31, -16]],
        [[27, -262], [30, -134], [31, -16]],
      ],
      telefon: null,
    };
    // telefon: 'sag' ya da 'sol' kol dirsekten bükülür, el göğüs hizasına gelir
    if (telefon) {
      const i = telefon === "sol" ? 0 : 1, s = i ? 1 : -1;
      p.kollar[i] = [[86 * s, -500 - n], [70 * s, -372], [22 * s, -432]];
      p.telefon = { x: 22 * s, y: -446, a: 0 };
    }
    return p;
  }

  // Yürüme döngüsü (arkadan görünüm). faz: 0..1
  function yuru(faz, { kolAcik = 0 } = {}) {
    const a = faz * Math.PI * 2;
    const zipla = Math.abs(Math.sin(a)) * 8;
    const p = ayakta({ kolAcik });
    const kaydir = (pt) => [pt[0], pt[1] - zipla];
    p.bas.y -= zipla; p.omuz.y -= zipla; p.kalca.y -= zipla;
    p.bas.x += Math.sin(a) * 4;
    for (let i = 0; i < 2; i++) {
      const s = i ? 1 : -1, ileri = Math.sin(a + i * Math.PI);
      // arkadan bakınca öne atılan ayak kısalır (uzaklaşır), geri kalan ayak topuk kaldırır
      const kalk = Math.max(0, -ileri) * 46;
      p.bacaklar[i] = [kaydir([27 * s, -262]), kaydir([30 * s, -132 + kalk * 0.3]), [31 * s, -16 - kalk - Math.max(0, ileri) * 10]];
      const kol = Math.sin(a + i * Math.PI + Math.PI) * 10;
      p.kollar[i] = [kaydir([86 * s, -500]), kaydir([(100 + kolAcik) * s, -385 + kol]), kaydir([(92 + kolAcik * 0.6) * s, -272 + kol * 1.4])];
    }
    return p;
  }

  // Masada oturan, arkadan: yalnızca baş, omuz ve sırt
  function otur({ nefes = 0, egim = 0 } = {}) {
    const n = nefes;
    return {
      bas: { x: egim, y: -598 - n, rx: 37, ry: 45, profil: 0 },
      omuz: { y: -515 - n, gen: 92 }, kalca: { y: -260, gen: 74 },
      kollar: [
        [[-86, -500 - n], [-90, -400], [-72, -300]],
        [[86, -500 - n], [90, -400], [72, -300]],
      ],
      bacaklar: [], telefon: null,
    };
  }

  // Portre (3/4 profil, sağa bakar): baş, boyun, omuzlar
  function portre({ don = 0.6, nefes = 0, egim = 0 } = {}) {
    const n = nefes;
    return {
      bas: { x: 6 + egim, y: -598 - n, rx: 37, ry: 45, profil: don },
      omuz: { y: -515 - n, gen: 100 }, kalca: { y: -40, gen: 104 },
      kollar: [
        [[-92, -500 - n], [-108, -300], [-110, -40]],
        [[92, -500 - n], [108, -300], [110, -40]],
      ],
      bacaklar: [], telefon: null,
    };
  }

  // --- çizim (maskeye) ---
  function cizgi(g, noktalar, k1, k2) {
    for (let i = 0; i < noktalar.length - 1; i++) {
      const a = noktalar[i], b = noktalar[i + 1];
      g.lineWidth = lerp(k1, k2, i / Math.max(1, noktalar.length - 2));
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    }
    for (const [i, pt] of noktalar.entries()) {
      g.beginPath(); g.arc(pt[0], pt[1], lerp(k1, k2, i / (noktalar.length - 1)) / 2, 0, Math.PI * 2); g.fill();
    }
  }

  function govdeCiz(g, p) {
    g.lineCap = "round"; g.lineJoin = "round";
    // bacaklar ve ayakkabılar
    for (const b of p.bacaklar) {
      cizgi(g, b, 46, 30);
      const a = b[b.length - 1];
      g.beginPath(); g.ellipse(a[0], a[1] + 8, 19, 10, 0, 0, Math.PI * 2); g.fill();
    }
    // gövde (ceket)
    const o = p.omuz, k = p.kalca;
    g.beginPath();
    g.moveTo(-k.gen - 6, k.y + 14);
    g.bezierCurveTo(-k.gen - 8, k.y - 70, -o.gen + 12, o.y + 150, -o.gen + 2, o.y + 30);
    g.bezierCurveTo(-o.gen + 4, o.y - 6, -o.gen * 0.6, o.y - 18, -24, o.y - 24);
    g.lineTo(24, o.y - 24);
    g.bezierCurveTo(o.gen * 0.6, o.y - 18, o.gen - 4, o.y - 6, o.gen - 2, o.y + 30);
    g.bezierCurveTo(o.gen - 12, o.y + 150, k.gen + 8, k.y - 70, k.gen + 6, k.y + 14);
    g.closePath(); g.fill();
    // kollar ve eller
    for (const kol of p.kollar) {
      cizgi(g, kol, 32, 22);
      const e = kol[kol.length - 1];
      g.beginPath(); g.ellipse(e[0], e[1] + 6, 11, 15, 0, 0, Math.PI * 2); g.fill();
    }
    // boyun, baş ve saç
    const b = p.bas;
    if (p.sac === "uzun") {
      // omuzlara inen saç, başın arkasında
      g.beginPath();
      g.moveTo(b.x - b.rx - 6, b.y - 10);
      g.bezierCurveTo(b.x - b.rx - 16, b.y + 60, b.x - b.rx - 14, o.y + 10, b.x - b.rx + 6, o.y + 40);
      g.lineTo(b.x + b.rx * 0.2, o.y + 40);
      g.lineTo(b.x + b.rx * 0.6, b.y + 20);
      g.lineTo(b.x + b.rx, b.y - 10);
      g.closePath(); g.fill();
    }
    if (p.sac === "topuz") { g.beginPath(); g.arc(b.x - b.rx * 0.75, b.y - b.ry * 0.75, 22, 0, Math.PI * 2); g.fill(); }
    g.beginPath(); g.moveTo(b.x - 19 + b.profil * 4, o.y - 4); g.lineTo(b.x - 15 + b.profil * 4, b.y + b.ry - 14);
    g.lineTo(b.x + 15 + b.profil * 4, b.y + b.ry - 14); g.lineTo(b.x + 19 + b.profil * 4, o.y - 4); g.closePath(); g.fill();
    g.beginPath(); g.ellipse(b.x, b.y, b.rx, b.ry, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(b.x - b.profil * 5, b.y - 7, b.rx + 1, b.ry - 1, -b.profil * 0.15, 0, Math.PI * 2); g.fill();
    if (b.profil > 0) {
      // burun ve çene: yüz sağa döner
      const s = b.profil;
      g.beginPath();
      g.moveTo(b.x + b.rx * 0.75, b.y - 22);
      g.quadraticCurveTo(b.x + b.rx + 20 * s, b.y + 2, b.x + b.rx + 2, b.y + 10);
      g.quadraticCurveTo(b.x + b.rx + 4, b.y + 22, b.x + b.rx - 2, b.y + 28);
      g.quadraticCurveTo(b.x + b.rx * 0.8, b.y + b.ry + 4, b.x + b.rx * 0.2, b.y + b.ry + 2);
      g.lineTo(b.x, b.y); g.closePath(); g.fill();
    }
    if (p.ekle) p.ekle(g);
  }

  const onbellek = {};
  function tuvalCifti(w, h) {
    const anahtar = `${w}x${h}`;
    if (!onbellek[anahtar]) onbellek[anahtar] = [tuval(w, h), tuval(w, h), tuval(w, h)];
    return onbellek[anahtar];
  }

  // Figürü ctx üzerinde (x, y) ayak noktasına çizer.
  // kenarlar: [[dx, dy, renk], ...] kenar ışıkları; isik: maske içine yumuşak dolgu (gradyan fonksiyonu)
  function figur(ctx, p, { x, y, olcek = 1, govde = "#02050D", kenarlar = [], isik = null, parlamaKenar = null, alfa = 1 }) {
    const MW = Math.ceil(340 * olcek) + 40, MH = Math.ceil(720 * olcek) + 40;
    const [maske, kenar, gecici] = tuvalCifti(MW, MH);
    const MX = MW / 2, MY = MH - 24;
    const m = maske.getContext("2d");
    m.setTransform(1, 0, 0, 1, 0, 0); m.clearRect(0, 0, MW, MH);
    m.setTransform(olcek, 0, 0, olcek, MX, MY);
    m.fillStyle = govde; m.strokeStyle = govde;
    govdeCiz(m, p);
    m.setTransform(1, 0, 0, 1, 0, 0);

    const k = kenar.getContext("2d");
    const boya = (dx, dy, dolgu) => {
      k.globalCompositeOperation = "source-over"; k.clearRect(0, 0, MW, MH);
      k.drawImage(maske, 0, 0);
      k.globalCompositeOperation = "source-in"; k.fillStyle = dolgu; k.fillRect(0, 0, MW, MH);
      if (dx || dy) { k.globalCompositeOperation = "destination-out"; k.drawImage(maske, dx, dy); }
      return kenar;
    };

    ctx.save();
    ctx.globalAlpha = alfa;
    ctx.translate(x, y);
    ctx.drawImage(maske, -MX, -MY);
    if (isik) ctx.drawImage(boya(0, 0, isik(k, MX, MY, olcek)), -MX, -MY);
    ctx.globalCompositeOperation = "lighter";
    for (const [dx, dy, renk] of kenarlar) ctx.drawImage(boya(dx, dy, renk), -MX, -MY);
    if (parlamaKenar) {
      const [dx, dy, renk] = parlamaKenar;
      const gg = gecici.getContext("2d");
      gg.clearRect(0, 0, MW, MH); gg.drawImage(boya(dx, dy, renk), 0, 0);
      ctx.filter = "blur(6px)"; ctx.globalAlpha = alfa * 0.7;
      ctx.drawImage(gecici, -MX, -MY);
      ctx.filter = "none";
    }
    ctx.restore();

    // telefon ekranının ışığı (maskenin üstünde, parlak)
    if (p.telefon) {
      const tx = x + p.telefon.x * olcek, ty = y + p.telefon.y * olcek;
      ctx.save();
      ctx.globalAlpha = alfa;
      ctx.globalCompositeOperation = "lighter";
      // ekran ışığı telefondan yukarı, yüze doğru yayılır
      const yx = x + p.bas.x * olcek, yy = y + (p.bas.y + 20) * olcek;
      const g = ctx.createRadialGradient(yx, yy, 4, yx, yy, 70 * olcek);
      g.addColorStop(0, "rgba(120,236,245,0.35)"); g.addColorStop(1, "rgba(24,209,227,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(yx, yy, 70 * olcek, 0, Math.PI * 2); ctx.fill();
      const g2 = ctx.createRadialGradient(tx, ty - 10 * olcek, 2, tx, ty - 10 * olcek, 40 * olcek);
      g2.addColorStop(0, "rgba(120,236,245,0.3)"); g2.addColorStop(1, "rgba(24,209,227,0)");
      ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(tx, ty - 10 * olcek, 40 * olcek, 0, Math.PI * 2); ctx.fill();
      // telefonun arkası: koyu gövde, ışık sızan kenar
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#0A1430";
      ctx.beginPath(); ctx.roundRect(tx - 10 * olcek, ty - 17 * olcek, 20 * olcek, 32 * olcek, 4 * olcek); ctx.fill();
      ctx.strokeStyle = "rgba(120,236,245,0.85)"; ctx.lineWidth = Math.max(1.5, 2 * olcek);
      ctx.beginPath(); ctx.roundRect(tx - 10 * olcek, ty - 17 * olcek, 20 * olcek, 32 * olcek, 4 * olcek); ctx.stroke();
      ctx.restore();
    }
  }

  Object.assign(window.KP, { poz: { ayakta, yuru, otur, portre }, figur });
})();
