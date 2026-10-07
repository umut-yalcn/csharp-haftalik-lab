// "Işıktan insan": figürün maskesi örneklenir, kenarlar yoğun ve parlak, iç kısım seyrek ışık
// noktalarıyla çizilir. Biçimler: "parcacik" (nokta bulutu), "iz" (arkasında ışık izi bırakan),
// "cizgi" (yalnızca tek neon kontur).
(function () {
  const { rastgele, figurMaskesi, parlamaKatmani } = window.KP;

  function noktalar(p, olcek, tohum, adim) {
    const m = figurMaskesi(p, olcek);
    const d = m.tuval.getContext("2d").getImageData(0, 0, m.MW, m.MH).data;
    const dolu = (x, y) => x >= 0 && y >= 0 && x < m.MW && y < m.MH && d[(y * m.MW + x) * 4 + 3] > 128;
    const r = rastgele(tohum), kenar = [], ic = [];
    const k = Math.max(3, Math.round(4 * olcek));
    for (let y = 0; y < m.MH; y += adim) for (let x = 0; x < m.MW; x += adim) {
      const jx = x + Math.round((r() - 0.5) * adim), jy = y + Math.round((r() - 0.5) * adim);
      if (!dolu(jx, jy)) continue;
      const kenarda = !dolu(jx + k, jy) || !dolu(jx - k, jy) || !dolu(jx, jy + k) || !dolu(jx, jy - k);
      (kenarda ? kenar : ic).push({ x: jx - m.MX, y: jy - m.MY, b: r(), f: r() * 6.28 });
    }
    return { kenar, ic, m };
  }

  function isikInsan(ctx, p, { x, y, olcek = 1, t = 0, bicim = "parcacik", tohum = 1, renk = "#18D1E3", ikinci = "#8FD8FF", iz = null }) {
    const adim = Math.max(2, Math.round((bicim === "cizgi" ? 1 : 5) * olcek));
    const { kenar, ic, m } = noktalar(p, olcek, tohum, adim);
    // parlama katmanı ekran koordinatında çizilir (ctx kaydırılmadan önce)
    parlamaKatmani(ctx, (g) => {
      g.save(); g.translate(x, y); g.fillStyle = renk;
      if (bicim === "cizgi") for (const n of kenar) g.fillRect(n.x - 3, n.y - 3, 6, 6);
      else { g.globalAlpha = 0.9; for (const n of kenar) { g.beginPath(); g.arc(n.x, n.y, 2.4 * olcek, 0, 6.28); g.fill(); } }
      g.restore();
    }, { blur: bicim === "cizgi" ? 14 : 12, guc: bicim === "cizgi" ? 1.4 : 0.9 });
    ctx.save();
    ctx.translate(x, y);
    ctx.globalCompositeOperation = "lighter";
    if (bicim === "cizgi") {
      ctx.fillStyle = "#E6FBFF";
      for (const n of kenar) ctx.fillRect(n.x - 1.5, n.y - 1.5, 3, 3);
      ctx.restore();
      return;
    }
    // yumuşak iç ışıma
    ctx.globalAlpha = 0.18; ctx.filter = "blur(14px)"; ctx.drawImage(m.tuval, -m.MX, -m.MY);
    ctx.filter = "none";
    for (const n of ic) {
      ctx.globalAlpha = (0.25 + 0.5 * n.b) * (0.7 + 0.3 * Math.sin(t * 4 + n.f));
      ctx.fillStyle = n.b > 0.8 ? "#FFFFFF" : ikinci;
      ctx.beginPath(); ctx.arc(n.x, n.y, (0.8 + n.b * 1.4) * olcek, 0, 6.28); ctx.fill();
    }
    for (const n of kenar) {
      ctx.globalAlpha = 0.75 + 0.25 * Math.sin(t * 5 + n.f);
      ctx.fillStyle = n.b > 0.6 ? "#E6FBFF" : renk;
      ctx.beginPath(); ctx.arc(n.x, n.y, (1.2 + n.b * 1.2) * olcek, 0, 6.28); ctx.fill();
    }
    // ışık izi: figürden kameraya doğru (aşağı) sürüklenen parçacıklar
    if (iz) {
      const r = rastgele(tohum + 7);
      for (let i = 0; i < iz.adet; i++) {
        const n = kenar[Math.floor(r() * kenar.length)]; if (!n) break;
        const k = ((r() + t * iz.hiz) % 1);
        ctx.globalAlpha = (1 - k) * 0.7;
        ctx.fillStyle = r() < 0.5 ? renk : "#E6FBFF";
        ctx.beginPath(); ctx.arc(n.x + (r() - 0.5) * 20 * k, n.y + k * iz.boy, (1.6 - k) * olcek * 1.4, 0, 6.28); ctx.fill();
      }
    }
    ctx.restore();
  }

  // Sahnelerin kullandığı tek giriş: insan modu "isik" ise ışıktan insan, değilse silüet çizer.
  function insan(ctx, p, o) {
    if (window.KP.insanModu === "isik") return isikInsan(ctx, p, { x: o.x, y: o.y, olcek: o.olcek, t: o.t, bicim: o.isikBicim || "parcacik", tohum: o.tohum || 1, iz: o.iz || null });
    return window.KP.figur(ctx, p, o);
  }

  Object.assign(window.KP, { isikInsan, insan });
})();
