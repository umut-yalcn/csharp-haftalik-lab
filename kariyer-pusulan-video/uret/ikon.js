// Feed'deki ince çizgili ikon stili: çanta (staj), kep (burs), kitap (eğitim), roket (bootcamp),
// takvim (etkinlik), yer imi (kaydet). Hepsi (x, y) merkezli, r yarıçaplı kutuya çizilir.
(function () {
  function hazirla(ctx, renk, kalinlik) {
    ctx.save();
    ctx.strokeStyle = renk; ctx.fillStyle = renk;
    ctx.lineWidth = kalinlik; ctx.lineCap = "round"; ctx.lineJoin = "round";
  }

  const IKON = {
    canta(ctx, x, y, r) {
      ctx.beginPath(); ctx.roundRect(x - r, y - r * 0.55, r * 2, r * 1.4, r * 0.18); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(x - r * 0.38, y - r * 0.9, r * 0.76, r * 0.35, r * 0.1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - r, y + r * 0.05); ctx.lineTo(x + r, y + r * 0.05); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(x - r * 0.16, y - r * 0.08, r * 0.32, r * 0.26, 3); ctx.fill();
    },
    kep(ctx, x, y, r) {
      ctx.beginPath(); ctx.moveTo(x - r, y - r * 0.3); ctx.lineTo(x, y - r * 0.75); ctx.lineTo(x + r, y - r * 0.3); ctx.lineTo(x, y + r * 0.15); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - r * 0.58, y - r * 0.08); ctx.lineTo(x - r * 0.58, y + r * 0.45);
      ctx.quadraticCurveTo(x, y + r * 0.85, x + r * 0.58, y + r * 0.45); ctx.lineTo(x + r * 0.58, y - r * 0.08); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + r * 0.8, y - r * 0.38); ctx.lineTo(x + r * 0.8, y + r * 0.4); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + r * 0.8, y + r * 0.48, r * 0.09, 0, Math.PI * 2); ctx.fill();
    },
    kitap(ctx, x, y, r) {
      ctx.beginPath(); ctx.moveTo(x, y - r * 0.55);
      ctx.quadraticCurveTo(x - r * 0.5, y - r * 0.8, x - r, y - r * 0.6); ctx.lineTo(x - r, y + r * 0.7);
      ctx.quadraticCurveTo(x - r * 0.5, y + r * 0.5, x, y + r * 0.75);
      ctx.quadraticCurveTo(x + r * 0.5, y + r * 0.5, x + r, y + r * 0.7); ctx.lineTo(x + r, y - r * 0.6);
      ctx.quadraticCurveTo(x + r * 0.5, y - r * 0.8, x, y - r * 0.55); ctx.lineTo(x, y + r * 0.75); ctx.stroke();
    },
    roket(ctx, x, y, r) {
      ctx.beginPath(); ctx.moveTo(x, y - r);
      ctx.bezierCurveTo(x + r * 0.5, y - r * 0.6, x + r * 0.45, y + r * 0.2, x + r * 0.3, y + r * 0.5);
      ctx.lineTo(x - r * 0.3, y + r * 0.5);
      ctx.bezierCurveTo(x - r * 0.45, y + r * 0.2, x - r * 0.5, y - r * 0.6, x, y - r); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y - r * 0.2, r * 0.17, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - r * 0.35, y + r * 0.2); ctx.lineTo(x - r * 0.7, y + r * 0.55); ctx.lineTo(x - r * 0.3, y + r * 0.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + r * 0.35, y + r * 0.2); ctx.lineTo(x + r * 0.7, y + r * 0.55); ctx.lineTo(x + r * 0.3, y + r * 0.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y + r * 0.62); ctx.lineTo(x, y + r * 0.95); ctx.stroke();
    },
    takvim(ctx, x, y, r) {
      ctx.beginPath(); ctx.roundRect(x - r, y - r * 0.7, r * 2, r * 1.6, r * 0.2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - r, y - r * 0.25); ctx.lineTo(x + r, y - r * 0.25); ctx.stroke();
      for (const dx of [-0.5, 0.5]) { ctx.beginPath(); ctx.moveTo(x + r * dx, y - r * 0.95); ctx.lineTo(x + r * dx, y - r * 0.5); ctx.stroke(); }
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
        ctx.beginPath(); ctx.arc(x - r * 0.5 + i * r * 0.5, y + r * 0.15 + j * r * 0.4, r * 0.08, 0, Math.PI * 2); ctx.fill();
      }
    },
    yerImi(ctx, x, y, r, dolu = false) {
      ctx.beginPath(); ctx.moveTo(x - r * 0.6, y - r); ctx.lineTo(x + r * 0.6, y - r); ctx.lineTo(x + r * 0.6, y + r);
      ctx.lineTo(x, y + r * 0.5); ctx.lineTo(x - r * 0.6, y + r); ctx.closePath();
      if (dolu) ctx.fill(); else ctx.stroke();
    },
    ok(ctx, x, y, r) {
      ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.moveTo(x + r * 0.4, y - r * 0.55); ctx.lineTo(x + r, y); ctx.lineTo(x + r * 0.4, y + r * 0.55); ctx.stroke();
    },
  };

  // İkonu feed'deki gibi ince çerçeveli yuvarlak kare kutunun içinde çizer.
  function ikonKutusu(ctx, ad, x, y, boy, { renk = "#18D1E3", kalinlik = 3, kutu = true, dolu = false, alfa = 1 } = {}) {
    hazirla(ctx, renk, kalinlik);
    ctx.globalAlpha *= alfa;
    if (kutu) {
      ctx.save();
      ctx.fillStyle = "rgba(10,31,77,0.6)"; ctx.globalAlpha *= 1;
      ctx.beginPath(); ctx.roundRect(x - boy / 2, y - boy / 2, boy, boy, boy * 0.22); ctx.fill();
      ctx.strokeStyle = "rgba(24,209,227,0.65)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x - boy / 2, y - boy / 2, boy, boy, boy * 0.22); ctx.stroke();
      ctx.restore();
    }
    IKON[ad](ctx, x, y, boy * 0.28, dolu);
    ctx.restore();
  }

  // Ekrana dokunan başparmak silüeti; uç noktası orijinde, gövdesi +y yönünde uzanır.
  function basparmak(ctx) {
    ctx.save();
    const sekil = () => {
      ctx.beginPath();
      ctx.moveTo(-50, 40);
      ctx.bezierCurveTo(-56, -30, -30, -62, 0, -62);
      ctx.bezierCurveTo(32, -62, 58, -30, 54, 40);
      ctx.bezierCurveTo(60, 160, 74, 300, 110, 460);
      ctx.lineTo(-90, 460);
      ctx.bezierCurveTo(-70, 300, -52, 160, -50, 40);
      ctx.closePath();
    };
    const g = ctx.createLinearGradient(-60, 0, 60, 0);
    g.addColorStop(0, "#0A1430"); g.addColorStop(0.6, "#050A18"); g.addColorStop(1, "#03060F");
    ctx.fillStyle = g; sekil(); ctx.fill();
    // tırnak
    ctx.fillStyle = "rgba(143,216,255,0.10)";
    ctx.beginPath(); ctx.ellipse(2, -24, 30, 34, 0, 0, Math.PI * 2); ctx.fill();
    // ekran ışığı kenarı
    ctx.strokeStyle = "rgba(24,209,227,0.75)"; ctx.lineWidth = 3; sekil(); ctx.stroke();
    ctx.restore();
  }

  Object.assign(window.KP, { IKON, ikonKutusu, basparmak });
})();
