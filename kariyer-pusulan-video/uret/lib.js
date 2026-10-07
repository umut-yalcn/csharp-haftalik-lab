// Ortak çizim kitaplığı: renkler, zamanlama, yazı, parlama, parçacık, grain.
// Bütün kesit dosyaları bunu kullanır; sahne.html içinde tarayıcıda çalışır.
(function () {
  const W = 1080, H = 1920, FPS = 30;

  // Feed'in siyah-lacivert ve mavi-turkuaz paleti (00-stil-rehberi.md)
  const R = {
    gece: "#040A1C",
    lacivert: "#0A1F4D",
    mavi: "#1E6BFF",
    turkuaz: "#18D1E3",
    acikMavi: "#8FD8FF",
    beyaz: "#FFFFFF",
  };

  // --- zaman yardımcıları ---
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const aralik = (t, a, b) => clamp((t - a) / (b - a)); // t'yi [a,b] içinde 0..1'e çevirir
  const ease = {
    out: (k) => 1 - Math.pow(1 - k, 3),
    in: (k) => k * k * k,
    inOut: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    outBack: (k) => { const c = 1.4; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
  };

  // Tohumlu rastgele sayı: her üretimde aynı sahne çıkar.
  function rastgele(tohum) {
    let s = tohum >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let r = Math.imul(s ^ (s >>> 15), 1 | s);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function tuval(w = W, h = H) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    return c;
  }

  // --- parlama (bloom): parlak öğeler ayrı katmana çizilir, bulanıklaştırılıp eklenir ---
  const parlamaTuval = tuval(), parlamaCtx = parlamaTuval.getContext("2d");
  function parlamaKatmani(ctx, ciz, { blur = 28, guc = 1 } = {}) {
    parlamaCtx.setTransform(1, 0, 0, 1, 0, 0);
    parlamaCtx.clearRect(0, 0, W, H);
    ciz(parlamaCtx);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = guc;
    ctx.filter = `blur(${blur}px)`;
    ctx.drawImage(parlamaTuval, 0, 0);
    ctx.filter = `blur(${Math.round(blur / 3)}px)`;
    ctx.drawImage(parlamaTuval, 0, 0);
    ctx.restore();
  }

  // --- yazı ---
  // Satır bir parça listesidir: [{ m: "2.500", renk: "gradyan" }, { m: " kişi" }]
  function yaziGenislik(ctx, parcalar) {
    return parcalar.reduce((s, p) => s + ctx.measureText(p.m).width, 0);
  }

  function gradyanDolgu(ctx, x, y, boy, stil = "eski") {
    const g = ctx.createLinearGradient(x, y - boy * 0.85, x, y + boy * 0.1);
    if (stil === "eski") { g.addColorStop(0, R.acikMavi); g.addColorStop(0.45, R.turkuaz); g.addColorStop(1, R.mavi); }
    else { g.addColorStop(0, "#2BE3F0"); g.addColorStop(1, "#1E7BFF"); } // dar aralık, doygun
    return g;
  }

  // Vurgu yazısı stilleri: "eski" (geniş gradyan + ışıma), "keskin" (dar gradyan + sert gölge),
  // "duz" (tek renk turkuaz + sert gölge), "kutu" (beyaz yazı, arkada turkuaz vurgu kutusu)
  const YAZI = { stil: "eski" };

  // Ortalanmış, parça parça renkli tek satır. k: giriş ilerlemesi (0..1).
  function satir(ctx, parcalar, { x = W / 2, y, boy = 80, agirlik = 800, renk = R.beyaz, k = 1, aralikHarf = 0, parlama = 0, yaziStili = null }) {
    const stil = yaziStili || YAZI.stil;
    if (k <= 0) return;
    ctx.save();
    ctx.font = `${agirlik} ${boy}px Montserrat`;
    ctx.letterSpacing = `${aralikHarf}px`;
    ctx.textBaseline = "alphabetic";
    const genislik = yaziGenislik(ctx, parcalar);
    const e = ease.out(k);
    ctx.globalAlpha = e;
    let px = x - genislik / 2;
    const py = y + (1 - e) * 26;
    for (const p of parcalar) {
      const w = ctx.measureText(p.m).width;
      const vurgu = p.renk === "gradyan" || p.renk === R.turkuaz;
      let r = p.renk === "gradyan" ? gradyanDolgu(ctx, px, py, boy, stil) : p.renk || renk;
      if (stil === "eski") {
        if (parlama > 0) { ctx.shadowColor = vurgu ? R.turkuaz : "rgba(143,216,255,0.6)"; ctx.shadowBlur = parlama; }
      } else {
        // ışıma yok; zeminden ayrışma keskin, hafif kaydırılmış koyu gölgeyle
        ctx.shadowColor = "rgba(2,6,20,0.75)"; ctx.shadowBlur = Math.max(2, boy * 0.03); ctx.shadowOffsetY = Math.max(2, boy * 0.04);
        if (vurgu && stil === "duz") r = "#22D8E6";
        if (vurgu && stil === "kutu") {
          const pad = boy * 0.14;
          ctx.save(); ctx.shadowColor = "transparent";
          ctx.fillStyle = "#14C3D6"; ctx.beginPath(); ctx.roundRect(px - pad * 0.6, py - boy * 0.8, w + pad * 1.2, boy * 1.02, boy * 0.16); ctx.fill();
          ctx.restore();
          r = "#FFFFFF"; ctx.shadowColor = "rgba(2,6,20,0.35)";
        }
      }
      ctx.fillStyle = r;
      ctx.fillText(p.m, px, py);
      px += w;
    }
    ctx.restore();
  }

  // Okunurluk için yazının arkasına yumuşak koyu bant
  function yaziGolgesi(ctx, y, yukseklik, guc = 0.45) {
    const g = ctx.createLinearGradient(0, y - yukseklik / 2, 0, y + yukseklik / 2);
    g.addColorStop(0, "rgba(4,10,28,0)");
    g.addColorStop(0.5, `rgba(4,10,28,${guc})`);
    g.addColorStop(1, "rgba(4,10,28,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, y - yukseklik / 2, W, yukseklik);
  }

  // --- parçacıklar: yukarı süzülen ışık noktaları ---
  function parcacikSeti(tohum, adet, { yMin = 0, yMax = H } = {}) {
    const r = rastgele(tohum);
    return Array.from({ length: adet }, () => ({
      x: r() * W, y: yMin + r() * (yMax - yMin), boy: 0.8 + r() * 2.6,
      hiz: 18 + r() * 50, salinim: r() * Math.PI * 2, parlak: 0.25 + r() * 0.75,
      renk: r() < 0.7 ? R.turkuaz : R.beyaz,
    }));
  }
  function parcaciklar(ctx, set, t, { yMin = 0, yMax = H, alfa = 1 } = {}) {
    const yuk = yMax - yMin;
    for (const p of set) {
      let y = p.y - p.hiz * t;
      y = yMin + ((((y - yMin) % yuk) + yuk) % yuk);
      const x = p.x + Math.sin(t * 0.9 + p.salinim) * 14;
      const kenar = Math.min(1, (y - yMin) / 160, (yMax - y) / 160);
      ctx.globalAlpha = alfa * p.parlak * clamp(kenar) * (0.75 + 0.25 * Math.sin(t * 3 + p.salinim));
      ctx.fillStyle = p.renk;
      ctx.beginPath(); ctx.arc(x, y, p.boy, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // --- film grain ve kenar kararması ---
  const grainler = [];
  (function () {
    const r = rastgele(99);
    for (let i = 0; i < 6; i++) {
      const c = tuval(540, 960), g = c.getContext("2d"), d = g.createImageData(540, 960);
      for (let j = 0; j < d.data.length; j += 4) {
        const v = 128 + (r() - 0.5) * 255;
        d.data[j] = d.data[j + 1] = d.data[j + 2] = v; d.data[j + 3] = 255;
      }
      g.putImageData(d, 0, 0);
      grainler.push(c);
    }
  })();
  function grain(ctx, kare, guc = 0.06) {
    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = guc;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(grainler[kare % grainler.length], 0, 0, W, H);
    ctx.restore();
  }
  function vinyet(ctx, guc = 0.6) {
    const g = ctx.createRadialGradient(W / 2, H * 0.48, H * 0.25, W / 2, H * 0.5, H * 0.75);
    g.addColorStop(0, "rgba(2,6,18,0)");
    g.addColorStop(1, `rgba(2,6,18,${guc})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // --- şekiller ---
  function yuvarlakDikdortgen(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }

  // Basit küre ikonu (site adresi hap etiketinde)
  function kureIkonu(ctx, x, y, r, renk) {
    ctx.save();
    ctx.strokeStyle = renk; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, y, r * 0.45, r, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.stroke();
    ctx.restore();
  }

  // Silik pusula gülü (arka plan motifi)
  function pusulaGulu(ctx, x, y, r, aci, renk, alfa) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(aci);
    ctx.globalAlpha = alfa; ctx.strokeStyle = renk; ctx.lineWidth = 2;
    for (const rr of [r, r * 0.78, r * 0.42]) { ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.stroke(); }
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2, uz = i % 9 === 0 ? 0.1 : 0.04;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      ctx.lineTo(Math.cos(a) * r * (1 - uz), Math.sin(a) * r * (1 - uz));
      ctx.stroke();
    }
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2, uz = i % 2 === 0 ? 0.95 : 0.6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r * uz, Math.sin(a) * r * uz);
      ctx.lineTo(Math.cos(a + 0.12) * r * 0.16, Math.sin(a + 0.12) * r * 0.16);
      ctx.lineTo(Math.cos(a - 0.12) * r * 0.16, Math.sin(a - 0.12) * r * 0.16);
      ctx.closePath(); ctx.stroke();
    }
    ctx.restore();
  }

  window.KP = {
    W, H, FPS, R, YAZI, clamp, lerp, aralik, ease, rastgele, tuval,
    parlamaKatmani, satir, yaziGolgesi, parcacikSeti, parcaciklar, grain, vinyet,
    yuvarlakDikdortgen, kureIkonu, pusulaGulu,
  };
  window.KESITLER = window.KESITLER || {};
  // insansız sürümde figürlere bağlı gölge ve ışıklar da çizilmez
  window.KP.insanVar = () => (window.KP.SECENEK || {}).insanlar !== "yok";
  // geçişlerdeki ışık dolgularının (flaş, ışık patlaması, sızıntı) yoğunluğu; --gecis yumusak ile yarıya iner
  // tur "beyaz": beyaz/beyaza yakın flaşlar; --flas az ile ayrıca 0.2'ye iner (turkuaz geçişler etkilenmez)
  window.KP.gecisIsigi = (tur) => {
    const s = window.KP.SECENEK || {};
    if (tur === "beyaz" && s.flas === "az") return 0.2;
    return s.gecis === "yumusak" ? 0.5 : 1;
  };
})();
