// tasarim-kodu/oturt.html ve tasarim.html'den alınan ortak çizim fonksiyonları (miğfer, laptop)

const yukle = (s) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = s; });
const tuval = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
const TAU = Math.PI * 2;
let tohum = 1;
const rnd = () => (tohum = (tohum * 16807) % 2147483647) / 2147483647;

// ---------- ortak malzemeler: eskitilmiş kararmış çelik + solmuş bronz ----------
function percin(ctx, x, y, r) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
  g.addColorStop(0, "#d9b983"); g.addColorStop(0.55, "#8a6a3e"); g.addColorStop(1, "#33251a");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.fillStyle = "rgba(60,95,75,0.35)"; ctx.beginPath(); ctx.arc(x + r * 0.3, y + r * 0.3, r * 0.6, 0, TAU); ctx.fill();
}
function celik(ctx, yol, cx, cy, R, ton) {
  const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.45, R * 0.05, cx, cy, R);
  const t = ton || ["#78726b", "#4b4642", "#2b2826", "#1a1817"];
  g.addColorStop(0, t[0]); g.addColorStop(0.35, t[1]); g.addColorStop(0.75, t[2]); g.addColorStop(1, t[3]);
  ctx.fillStyle = g; ctx.fill(yol);
}
function bronzDolgu(ctx, yol, y0, y1) {
  const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, "#8f7650"); g.addColorStop(0.5, "#6b5435"); g.addColorStop(1, "#43331f");
  ctx.fillStyle = g; ctx.fill(yol);
}
function kenar(ctx, yol, k) {
  ctx.lineWidth = k + 2.5; ctx.strokeStyle = "#17120e"; ctx.stroke(yol);
  ctx.lineWidth = k; ctx.strokeStyle = "#6f5634"; ctx.stroke(yol);
  ctx.lineWidth = k * 0.3; ctx.strokeStyle = "rgba(190,160,110,0.45)"; ctx.stroke(yol);
}
// pas, kir, ezik, çizik
function eskit(ctx, yol, w, h, cx, cy) {
  cx = cx || 0; cy = cy || 0;
  ctx.save(); ctx.clip(yol);
  const R = Math.max(w, h) / 2;
  let g = ctx.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 1.1); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(25,18,12,0.55)");
  ctx.fillStyle = g; ctx.fillRect(cx - w, cy - h, w * 2, h * 2);
  ctx.filter = "blur(3px)";
  for (let i = 0; i < 14; i++) {
    const x = cx + (rnd() - 0.5) * w, y = cy + (rnd() - 0.5) * h;
    ctx.fillStyle = `rgba(${110 + rnd() * 30},${58 + rnd() * 20},30,${0.18 + rnd() * 0.18})`;
    ctx.beginPath(); ctx.ellipse(x, y, 4 + rnd() * 11, 3 + rnd() * 6, rnd() * 3, 0, TAU); ctx.fill();
  }
  ctx.filter = "none";
  for (let i = 0; i < 5; i++) {
    const x = cx + (rnd() - 0.5) * w * 0.85, y = cy + (rnd() - 0.5) * h * 0.85, rr = 4 + rnd() * 5;
    ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(10,8,6,0.55)"; ctx.beginPath(); ctx.arc(x, y, rr, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.strokeStyle = "rgba(200,190,175,0.32)"; ctx.beginPath(); ctx.arc(x, y, rr, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke();
  }
  for (let i = 0; i < 120; i++) {
    const x = cx + (rnd() - 0.5) * w, y = cy + (rnd() - 0.5) * h, u = 2 + rnd() * (i < 10 ? 26 : 8), a = -0.4 + rnd() * 0.8 + (rnd() < 0.3 ? 1.6 : 0);
    ctx.strokeStyle = i < 10 ? "rgba(205,195,180,0.28)" : `rgba(175,165,150,${0.06 + rnd() * 0.13})`; ctx.lineWidth = i < 10 ? 1.1 : 0.6;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * u, y + Math.sin(a) * u); ctx.stroke();
  }
  ctx.restore();
}
// büyük madalyon: bronz halka + siyah mine + sitenin koyu tema logosu
function madalyon(ctx, logo, x, y, R, percinSay) {
  const halka = new Path2D(); halka.arc(x, y, R, 0, TAU);
  bronzDolgu(ctx, halka, y - R, y + R);
  ctx.save(); ctx.clip(halka);
  for (let i = 0; i < 12; i++) { const a = rnd() * TAU, rr = R * (0.85 + rnd() * 0.15); ctx.fillStyle = `rgba(70,110,90,${0.15 + rnd() * 0.2})`; ctx.beginPath(); ctx.arc(x + Math.cos(a) * rr, y + Math.sin(a) * rr, 1.5 + rnd() * 3, 0, TAU); ctx.fill(); }
  ctx.restore();
  ctx.strokeStyle = "#15100c"; ctx.lineWidth = 1.6; ctx.stroke(halka);
  const n = percinSay || 10, d = R * 0.84;
  for (let i = 0; i < n; i++) { const a = i * TAU / n + Math.PI / n; percin(ctx, x + Math.cos(a) * (R + d) / 2, y + Math.sin(a) * (R + d) / 2, Math.max(1.6, (R - d) * 0.28)); }
  ctx.fillStyle = "#0b0b0d"; ctx.beginPath(); ctx.arc(x, y, d, 0, TAU); ctx.fill();
  ctx.strokeStyle = "#000"; ctx.lineWidth = 2; ctx.stroke();
  const L = d * 1.9; ctx.drawImage(logo, x - L / 2, y - L / 2, L, L);
  const g = ctx.createLinearGradient(x - d, y - d, x + d * 0.6, y + d * 0.6); g.addColorStop(0, "rgba(255,255,255,0.10)"); g.addColorStop(0.5, "rgba(255,255,255,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, d, 0, TAU); ctx.fill();
}
function plaka(ctx, yol, w, h, cx, cy, kalin, ton) {
  celik(ctx, yol, cx || 0, cy || 0, Math.max(w, h) * 0.6, ton);
  eskit(ctx, yol, w, h, cx, cy);
  kenar(ctx, yol, kalin || 3.2);
}
function percinler(ctx, noktalar, r) { for (const [x, y] of noktalar) percin(ctx, x, y, r || 2.5); }


// ---------- HİLAL + kademeli eskitme (k: 0 hafif … 1 savaştan çıkmış) ----------
function eskitK(ctx, yol, w, h, cx, cy, k) {
  ctx.save(); ctx.clip(yol);
  const R = Math.max(w, h) / 2;
  let g = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * 1.1); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, `rgba(25,18,12,${0.25 + 0.5 * k})`);
  ctx.fillStyle = g; ctx.fillRect(cx - w, cy - h, w * 2, h * 2);
  // pas lekeleri
  ctx.filter = "blur(3px)";
  for (let i = 0; i < 3 + 80 * k * k + 20 * k; i++) {
    const x = cx + (rnd() - 0.5) * w, y = cy + (rnd() - 0.5) * h;
    ctx.fillStyle = `rgba(${115 + rnd() * 35},${55 + rnd() * 22},28,${(0.10 + rnd() * 0.18) * (0.5 + 1.3 * k)})`;
    ctx.beginPath(); ctx.ellipse(x, y, 3 + rnd() * (6 + 14 * k), 2 + rnd() * (4 + 8 * k), rnd() * 3, 0, TAU); ctx.fill();
  }
  ctx.filter = "none";
  // ezikler
  for (let i = 0; i < 1 + 9 * k; i++) {
    const x = cx + (rnd() - 0.5) * w * 0.9, y = cy + (rnd() - 0.5) * h * 0.8, rr = 3 + rnd() * (3 + 5 * k);
    ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(10,8,6,0.6)"; ctx.beginPath(); ctx.arc(x, y, rr, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.strokeStyle = "rgba(200,190,175,0.35)"; ctx.beginPath(); ctx.arc(x, y, rr, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke();
  }
  // çizikler
  for (let i = 0; i < 30 + 200 * k; i++) {
    const derin = i < 3 + 14 * k;
    const x = cx + (rnd() - 0.5) * w, y = cy + (rnd() - 0.5) * h, u = 2 + rnd() * (derin ? 16 + 26 * k : 8), a = -0.4 + rnd() * 0.8 + (rnd() < 0.3 ? 1.6 : 0);
    ctx.strokeStyle = derin ? "rgba(210,200,185,0.32)" : `rgba(175,165,150,${0.05 + rnd() * 0.12})`; ctx.lineWidth = derin ? 1.1 : 0.6;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * u, y + Math.sin(a) * u); ctx.stroke();
  }
  ctx.restore();
}
function pasAkintisi(ctx, x, y, boy, k) {
  const g = ctx.createLinearGradient(x, y, x, y + boy); g.addColorStop(0, `rgba(130,62,26,${0.55 * k})`); g.addColorStop(1, "rgba(130,62,26,0)");
  ctx.save(); ctx.filter = "blur(1.2px)"; ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 2, y); ctx.quadraticCurveTo(x - 3, y + boy * 0.6, x, y + boy); ctx.quadraticCurveTo(x + 3, y + boy * 0.6, x + 2, y); ctx.fill(); ctx.restore();
}
function hilal(ctx, logo, k, savas) {
  const y = new Path2D(); y.moveTo(-112, 34); y.quadraticCurveTo(-100, -70, 0, -80); y.quadraticCurveTo(100, -70, 112, 34);
  y.quadraticCurveTo(80, -26, 0, -30); y.quadraticCurveTo(-80, -26, -112, 34); y.closePath();
  // çelik tonu: eskidikçe matlaşır ve kahverengileşir
  const ton = k < 0.3 ? ["#8a847c", "#56514c", "#302d2a", "#1d1b19"] : k < 0.7 ? ["#78726b", "#4b4642", "#2b2826", "#1a1817"] : ["#6a6157", "#463d35", "#2a2420", "#18130f"];
  celik(ctx, y, 0, -40, 134, ton);
  eskitK(ctx, y, 224, 120, 0, -40, k);
  kenar(ctx, y, 3.2);
  // bronz kenarda yeşil patina
  ctx.save(); ctx.lineWidth = 4; ctx.setLineDash([4 + k * 10, 4 + (1 - k) * 40]); ctx.strokeStyle = `rgba(80,130,105,${0.1 + 0.65 * k})`; ctx.stroke(y); ctx.restore();
  const percinler = [[-96, 12], [-80, -34], [-44, -60], [44, -60], [80, -34], [96, 12]];
  percinler.forEach(([x, yy], i) => {
    if (savas && i === 4) { ctx.fillStyle = "#0d0b09"; ctx.beginPath(); ctx.arc(x, yy, 2.4, 0, TAU); ctx.fill(); pasAkintisi(ctx, x, yy + 2, 14, 1); return; }
    percin(ctx, x, yy, 2.5);
    if (k > 0.4) pasAkintisi(ctx, x, yy + 2, 8 + 14 * k, k);
  });
  if (savas) {
    // çatlak ve kenar kırığı
    ctx.strokeStyle = "rgba(8,6,5,0.85)"; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(-104, 20); ctx.lineTo(-94, 12); ctx.lineTo(-90, 2); ctx.lineTo(-82, -4); ctx.stroke();
    ctx.strokeStyle = "rgba(200,190,175,0.3)"; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(-103, 21); ctx.lineTo(-93, 13); ctx.stroke();
    ctx.fillStyle = "#6c6660"; ctx.beginPath(); ctx.moveTo(98, -8); ctx.lineTo(106, 2); ctx.lineTo(102, 10); ctx.closePath(); ctx.fill();
    // derin kılıç izi
    ctx.strokeStyle = "rgba(220,210,195,0.5)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(30, -66); ctx.lineTo(78, -30); ctx.stroke();
    ctx.strokeStyle = "rgba(8,6,5,0.7)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(31, -64); ctx.lineTo(79, -28); ctx.stroke();
  }
  // madalyon: halka eskir, logo net kalır
  madalyon(ctx, logo, 0, -24, 58, 12);
  const halka = new Path2D(); halka.arc(0, -24, 58, 0, TAU); halka.arc(0, -24, 58 * 0.84, 0, TAU, true);
  ctx.save(); ctx.clip(halka);
  ctx.fillStyle = `rgba(20,15,10,${0.1 + 0.35 * k})`; ctx.fillRect(-60, -84, 120, 120);
  ctx.filter = "blur(2px)";
  for (let i = 0; i < 4 + 22 * k; i++) { const a = rnd() * TAU, rr = 50 + rnd() * 8; ctx.fillStyle = `rgba(${rnd() < 0.5 ? "80,125,100" : "125,62,28"},${0.2 + 0.35 * k})`; ctx.beginPath(); ctx.arc(Math.cos(a) * rr, -24 + Math.sin(a) * rr, 2 + rnd() * 4, 0, TAU); ctx.fill(); }
  ctx.filter = "none";
  for (let i = 0; i < 10 + 40 * k; i++) { const a = rnd() * TAU, rr = 49 + rnd() * 9, u = 2 + rnd() * 6; ctx.strokeStyle = "rgba(210,190,150,0.25)"; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * rr, -24 + Math.sin(a) * rr); ctx.lineTo(Math.cos(a + 0.05) * (rr + u * 0.2), -24 + Math.sin(a + 0.05) * (rr + u * 0.2) + u * 0.5); ctx.stroke(); }
  ctx.restore();
  // minenin cam yüzeyinde çok hafif kılcal çizik (logoyu kapatmaz)
  if (k > 0.5) { ctx.save(); ctx.beginPath(); ctx.arc(0, -24, 48, 0, TAU); ctx.clip();
    for (let i = 0; i < 6 * k; i++) { const x = (rnd() - 0.5) * 80, yy = -24 + (rnd() - 0.5) * 80; ctx.strokeStyle = "rgba(255,255,255,0.10)"; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + 10 + rnd() * 14, yy + (rnd() - 0.5) * 8); ctx.stroke(); }
    ctx.restore(); }
}

// ---------- üçgen doku eşleme (miğferi kafa kavisine bükmek için) ----------
function ucgen(ctx, im, x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2) {
  const cx = (x0 + x1 + x2) / 3, cy = (y0 + y1 + y2) / 3, gen = (x, y) => { const dx = x - cx, dy = y - cy, l = Math.hypot(dx, dy) || 1; return [x + dx / l * 0.7, y + dy / l * 0.7]; };
  const [a0, b0] = gen(x0, y0), [a1, b1] = gen(x1, y1), [a2, b2] = gen(x2, y2);
  ctx.save(); ctx.beginPath(); ctx.moveTo(a0, b0); ctx.lineTo(a1, b1); ctx.lineTo(a2, b2); ctx.closePath(); ctx.clip();
  const d = u0 * (v2 - v1) - u1 * v2 + u2 * v1 + (u1 - u2) * v0;
  if (Math.abs(d) < 1e-9) { ctx.restore(); return; }
  const m11 = -(v0 * (x2 - x1) - v1 * x2 + v2 * x1 + (v1 - v2) * x0) / d;
  const m12 = (v1 * y2 + v0 * (y1 - y2) - v2 * y1 + (v2 - v1) * y0) / d;
  const m21 = (u0 * (x2 - x1) - u1 * x2 + u2 * x1 + (u1 - u2) * x0) / d;
  const m22 = -(u1 * y2 + u0 * (y1 - y2) - u2 * y1 + (u2 - u1) * y0) / d;
  const dx = (u0 * (v2 * x1 - v1 * x2) + v0 * (u1 * x2 - u2 * x1) + (u2 * v1 - u1 * v2) * x0) / d;
  const dy = (u0 * (v2 * y1 - v1 * y2) + v0 * (u1 * y2 - u2 * y1) + (u2 * v1 - u1 * v2) * y0) / d;
  ctx.transform(m11, m12, m21, m22, dx, dy); ctx.drawImage(im, 0, 0); ctx.restore();
}
const OL = 2, OX = 260, OY = 190; // düz miğfer tuvali: yerel (0,0) -> (260,190), 2x çözünürlük
function duzMigfer(logo, k, tohumNo) {
  tohum = tohumNo;
  const c = tuval(520, 300), g = c.getContext("2d");
  g.translate(OX, OY); g.scale(OL, OL); hilal(g, logo, k, false);
  // video yumuşaklığında da görünsün diye iri ölçekli eskitme (madalyonun içine girmez)
  const hp = new Path2D(); hp.moveTo(-112, 34); hp.quadraticCurveTo(-100, -70, 0, -80); hp.quadraticCurveTo(100, -70, 112, 34);
  hp.quadraticCurveTo(80, -26, 0, -30); hp.quadraticCurveTo(-80, -26, -112, 34); hp.closePath();
  const disMadalyon = new Path2D(); disMadalyon.rect(-130, -100, 260, 150); disMadalyon.arc(0, -24, 49, 0, TAU, true);
  g.save(); g.clip(hp); g.clip(disMadalyon);
  g.filter = "blur(4px)";
  for (let i = 0; i < 6 + 22 * k; i++) {
    const x = (rnd() - 0.5) * 220, y = -60 + rnd() * 90, r1 = 5 + rnd() * (8 + 14 * k);
    g.fillStyle = rnd() < 0.7 ? `rgba(${120 + rnd() * 30},${60 + rnd() * 20},26,${0.25 + 0.4 * k})` : `rgba(15,12,10,${0.25 + 0.3 * k})`;
    g.beginPath(); g.ellipse(x, y, r1, r1 * (0.5 + rnd() * 0.5), rnd() * 3, 0, TAU); g.fill();
  }
  g.filter = "none"; g.restore();
  // kenar aşınması: kenarlarda parlak çıplak çelik
  g.save(); g.clip(hp); g.lineWidth = 2.5 + 2 * k; g.setLineDash([6 + rnd() * 10, 10 + (1 - k) * 30, 3, 14]);
  g.strokeStyle = `rgba(200,192,180,${0.35 + 0.35 * k})`; g.stroke(hp); g.restore();
  // madalyon halkasında iri patina ve pas
  const halkaYol = new Path2D(); halkaYol.arc(0, -24, 58, 0, TAU); halkaYol.arc(0, -24, 49, 0, TAU, true);
  g.save(); g.clip(halkaYol); g.filter = "blur(2.5px)";
  for (let i = 0; i < 3 + 10 * k; i++) { const a = rnd() * TAU; g.fillStyle = rnd() < 0.5 ? `rgba(80,130,105,${0.3 + 0.4 * k})` : `rgba(125,62,28,${0.3 + 0.4 * k})`; g.beginPath(); g.arc(Math.cos(a) * 54, -24 + Math.sin(a) * 54, 3 + rnd() * 6, 0, TAU); g.fill(); }
  g.filter = "none"; g.restore();
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "source-atop";
  // silindir gölgelemesi: uçlar başın yanına döndükçe kararır; üstten bulutlu gök ışığı
  const R = 150;
  const yatay = g.createLinearGradient(OX - 120 * OL, 0, OX + 120 * OL, 0);
  for (let i = 0; i <= 10; i++) { const lx = -120 + i * 24, t = 1 - Math.cos(Math.min(1.4, Math.abs(lx) / R)); yatay.addColorStop(i / 10, `rgba(10,8,8,${Math.min(0.7, t * 1.6)})`); }
  g.fillStyle = yatay; g.fillRect(0, 0, 520, 300);
  const dikey = g.createLinearGradient(0, OY - 85 * OL, 0, OY + 40 * OL);
  dikey.addColorStop(0, "rgba(220,220,225,0.16)"); dikey.addColorStop(0.45, "rgba(220,220,225,0)"); dikey.addColorStop(1, "rgba(10,8,8,0.35)");
  g.fillStyle = dikey; g.fillRect(0, 0, 520, 300);
  return c;
}
// düz tuvali kafaya bük ve yerleştir
function buk(hedef, duz, p) {
  const R = p.R, NX = 22, NY = 10;
  const nokta = (px, py) => {
    const lx = (px - OX) / OL, ly = (py - OY) / OL, th = lx / R;
    const wx = R * Math.sin(th), wy = ly + p.bukum * R * (1 - Math.cos(th)) - p.kubbe * (1 - Math.cos(th)) * 10;
    const sx = wx * p.s, sy = wy * p.s * p.basik;
    const c = Math.cos(p.rot), s = Math.sin(p.rot);
    return [p.x + sx * c - sy * s, p.y + sx * s + sy * c];
  };
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    const u0 = i * 520 / NX, u1 = (i + 1) * 520 / NX, v0 = j * 300 / NY, v1 = (j + 1) * 300 / NY;
    const A = nokta(u0, v0), B = nokta(u1, v0), C = nokta(u1, v1), D = nokta(u0, v1);
    ucgen(hedef, duz, A[0], A[1], B[0], B[1], C[0], C[1], u0, v0, u1, v0, u1, v1);
    ucgen(hedef, duz, A[0], A[1], C[0], C[1], D[0], D[1], u0, v0, u1, v1, u0, v1);
  }
}
function sahneyeOturt(genis, logo, p) {
  const sahne = tuval(1280, 720), s = sahne.getContext("2d"); s.drawImage(genis, 0, 0);
  const orij = s.getImageData(0, 0, 1280, 720);
  // 1) bükülmüş miğfer katmanı
  const kat = tuval(1280, 720), k = kat.getContext("2d");
  buk(k, duzMigfer(logo, p.k, p.tohum), p);
  // 2) renk eşleme: matlık + sahnenin pusu (başın çevresindeki ortalama renk)
  const renk = tuval(1280, 720), r = renk.getContext("2d");
  r.filter = p.filtre; r.drawImage(kat, 0, 0); r.filter = "none";
  r.globalCompositeOperation = "source-atop";
  r.fillStyle = `rgba(${p.pus[0]},${p.pus[1]},${p.pus[2]},${p.pusA})`; r.fillRect(0, 0, 1280, 720);
  // 3) videonun yumuşaklığına indir (küçült-büyüt)
  const kucuk = tuval(Math.round(1280 * p.yumusak), Math.round(720 * p.yumusak)); kucuk.getContext("2d").drawImage(renk, 0, 0, kucuk.width, kucuk.height);
  const yum = tuval(1280, 720), y = yum.getContext("2d"); y.imageSmoothingQuality = "high"; y.drawImage(kucuk, 0, 0, 1280, 720);
  // 4) temas gölgesi + ortam gölgesi
  const golge = tuval(1280, 720), gg = golge.getContext("2d");
  gg.drawImage(yum, 0, 0); gg.globalCompositeOperation = "source-in"; gg.fillStyle = "#000"; gg.fillRect(0, 0, 1280, 720);
  s.save(); s.globalAlpha = 0.65; s.filter = "blur(9px)"; s.drawImage(golge, -2, 9); s.restore();
  s.save(); s.globalAlpha = 0.55; s.filter = "blur(3px)"; s.drawImage(golge, 0, 3); s.restore();
  s.drawImage(yum, 0, 0);
  // 5) gren
  const bx = 200, by = 50, bw = 330, bh = 290;
  const sd = s.getImageData(bx, by, bw, bh), md = yum.getContext("2d").getImageData(bx, by, bw, bh);
  // 6) kenar bandında ejderhanın açık renkli dikenleri miğferin önüne geçer
  const bul = tuval(1280, 720), bb = bul.getContext("2d"); bb.filter = `blur(${p.bant}px)`; bb.drawImage(yum, 0, 0);
  const bd = bb.getImageData(bx, by, bw, bh);
  for (let yy = 0; yy < bh; yy++) for (let xx = 0; xx < bw; xx++) {
    const i = (yy * bw + xx) * 4, a = md.data[i + 3] / 255;
    if (a > 0.02) { const n = (rnd() - 0.5) * 16 * a; sd.data[i] += n; sd.data[i + 1] += n; sd.data[i + 2] += n; }
    if (a < 0.3) continue;
    const ab = bd.data[i + 3] / 255; if (ab > 0.93) continue;
    const oi = ((by + yy) * 1280 + (bx + xx)) * 4, o = orij.data;
    const lum = 0.3 * o[oi] + 0.59 * o[oi + 1] + 0.11 * o[oi + 2];
    if (lum < p.dikenEsik) continue;
    const t = Math.min(1, (lum - p.dikenEsik) / 25) * Math.min(1, (0.93 - ab) / 0.25);
    for (let ch = 0; ch < 3; ch++) sd.data[i + ch] = sd.data[i + ch] * (1 - t) + o[oi + ch] * t;
  }
  s.putImageData(sd, bx, by);
  return sahne;
}

function yuvarlakDikdortgen(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function percinL(ctx, x, y, r) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
  g.addColorStop(0, "#f4f6f8"); g.addColorStop(0.5, "#a9afb5"); g.addColorStop(1, "#3d4248");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}


// Ekranı net çiz: site görüntüsünü adım adım küçült (tek seferde küçültmek yazıları bulandırır),
// bulanıklık / sis / ışık katmanlarının ÜSTÜNE en son çizilir.
function netEkran(ctx, site, kirp, e) {
  let c = tuval(kirp[2], kirp[3]); c.getContext("2d").drawImage(site, kirp[0], kirp[1], kirp[2], kirp[3], 0, 0, kirp[2], kirp[3]);
  while (c.width / 2 > e.sw * 1.5) { const k = tuval(Math.round(c.width / 2), Math.round(c.height / 2)), g = k.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(c, 0, 0, k.width, k.height); c = k; }
  ctx.save(); ctx.imageSmoothingQuality = "high"; ctx.beginPath(); ctx.rect(e.sx, e.sy, e.sw, e.sh); ctx.clip();
  ctx.drawImage(c, e.sx, e.sy, e.sw, e.sh);
  const g = ctx.createLinearGradient(e.sx, e.sy, e.sx + e.sw * 0.7, e.sy + e.sh);
  g.addColorStop(0, "rgba(255,255,255,0.05)"); g.addColorStop(0.45, "rgba(255,255,255,0.015)"); g.addColorStop(0.46, "rgba(255,255,255,0)");
  ctx.fillStyle = g; ctx.fillRect(e.sx, e.sy, e.sw, e.sh); ctx.restore();
  ctx.lineWidth = Math.max(1, e.sw / 240); ctx.strokeStyle = "rgba(0,0,0,0.7)"; ctx.strokeRect(e.sx, e.sy, e.sw, e.sh);
}

// ---------- ORTA ÇAĞ LAPTOP (önden) ----------
// x,y: kapak dış kutusunun sol üstü; w: kapak genişliği. Ekran şövalyeye değil kameraya bakar.
function laptop(ctx, L) {
  const { x, y, w, site, kirp, derinlik, tasma } = L;
  const s = w / 500, h = w * 0.64;
  // menteşe kayışları (kapağın arkasından deck'e iner)
  // kapak
  yuvarlakDikdortgen(ctx, x, y, w, h, 9 * s);
  let g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, "#41464c"); g.addColorStop(0.5, "#26292e"); g.addColorStop(1, "#1a1c20");
  ctx.fillStyle = g; ctx.fill();
  ctx.lineWidth = 4 * s; ctx.strokeStyle = "#c3c8cd"; ctx.stroke();
  ctx.lineWidth = 1.2 * s; ctx.strokeStyle = "rgba(20,22,25,0.9)";
  yuvarlakDikdortgen(ctx, x + 4 * s, y + 4 * s, w - 8 * s, h - 8 * s, 7 * s); ctx.stroke();
  // ekran
  const sx = x + 16 * s, sy = y + 16 * s, sw = w - 32 * s, sh = h - 42 * s;
  ctx.save(); ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip();
  ctx.drawImage(site, kirp[0], kirp[1], kirp[2], kirp[3], sx, sy, sw, sh);
  g = ctx.createLinearGradient(sx, sy, sx + sw * 0.7, sy + sh);
  g.addColorStop(0, "rgba(255,255,255,0.10)"); g.addColorStop(0.45, "rgba(255,255,255,0.03)"); g.addColorStop(0.46, "rgba(255,255,255,0)");
  ctx.fillStyle = g; ctx.fillRect(sx, sy, sw, sh);
  ctx.restore();
  ctx.lineWidth = 2 * s; ctx.strokeStyle = "rgba(0,0,0,0.7)"; ctx.strokeRect(sx, sy, sw, sh);
  // köşe zırh başlıkları + perçinler
  const k = 40 * s, kk = 11 * s;
  for (const [cx, cy, dx, dy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(cx + dx * k, cy); ctx.lineTo(cx + dx * k, cy + dy * kk * 0.6);
    ctx.quadraticCurveTo(cx + dx * kk * 1.4, cy + dy * kk, cx + dx * kk, cy + dy * kk * 1.4);
    ctx.lineTo(cx + dx * kk * 0.6, cy + dy * k); ctx.lineTo(cx, cy + dy * k); ctx.closePath();
    const cg = ctx.createLinearGradient(cx, cy, cx + dx * k, cy + dy * k);
    cg.addColorStop(0, "#eef1f3"); cg.addColorStop(0.6, "#a6acb2"); cg.addColorStop(1, "#6b7177");
    ctx.fillStyle = cg; ctx.fill(); ctx.lineWidth = 1 * s; ctx.strokeStyle = "rgba(30,33,37,0.8)"; ctx.stroke();
    percinL(ctx, cx + dx * k * 0.72, cy + dy * kk * 0.5, 2.6 * s);
    percinL(ctx, cx + dx * kk * 0.5, cy + dy * k * 0.72, 2.6 * s);
  }
  // alt çerçevede gravür süsü (yazı yok)
  const ox = x + w / 2, oy = y + h - 13 * s;
  ctx.strokeStyle = "rgba(200,205,210,0.55)"; ctx.lineWidth = 1 * s;
  ctx.beginPath(); ctx.moveTo(ox - 6 * s, oy); ctx.lineTo(ox, oy - 5 * s); ctx.lineTo(ox + 6 * s, oy); ctx.lineTo(ox, oy + 5 * s); ctx.closePath(); ctx.stroke();
  for (const d of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(ox + d * 10 * s, oy);
    ctx.bezierCurveTo(ox + d * 30 * s, oy - 7 * s, ox + d * 45 * s, oy + 6 * s, ox + d * 62 * s, oy - 1 * s);
    ctx.stroke();
    ctx.beginPath(); ctx.arc(ox + d * 66 * s, oy - 2 * s, 3 * s, 0, Math.PI * 2); ctx.stroke();
  }
  // klavye gövdesi (perspektif yamuk)
  const yb = y + h, yf = yb + derinlik, e = tasma;
  ctx.beginPath(); ctx.moveTo(x + 6 * s, yb); ctx.lineTo(x + w - 6 * s, yb); ctx.lineTo(x + w + e, yf); ctx.lineTo(x - e, yf); ctx.closePath();
  g = ctx.createLinearGradient(0, yb, 0, yf); g.addColorStop(0, "#2a2d32"); g.addColorStop(1, "#4a4f55");
  ctx.fillStyle = g; ctx.fill();
  const satirX = (t) => [x + 6 * s + (-e - 6 * s) * t, x + w - 6 * s + (e + 6 * s) * t];
  if (derinlik > 12) {
    for (let r = 0; r < 4; r++) {
      const t0 = 0.10 + r * 0.13, t1 = t0 + 0.10;
      const [a0, b0] = satirX(t0), [a1, b1] = satirX(t1);
      const n = 14;
      for (let i = 0; i < n; i++) {
        const u0 = 0.08 + i * 0.84 / n + 0.006, u1 = 0.08 + (i + 1) * 0.84 / n - 0.006;
        ctx.beginPath();
        ctx.moveTo(a0 + (b0 - a0) * u0, yb + derinlik * t0); ctx.lineTo(a0 + (b0 - a0) * u1, yb + derinlik * t0);
        ctx.lineTo(a1 + (b1 - a1) * u1, yb + derinlik * t1); ctx.lineTo(a1 + (b1 - a1) * u0, yb + derinlik * t1); ctx.closePath();
        ctx.fillStyle = "#16181b"; ctx.fill();
      }
    }
    const t0 = 0.68, t1 = 0.92, [a0, b0] = satirX(t0), [a1, b1] = satirX(t1);
    ctx.beginPath();
    ctx.moveTo(a0 + (b0 - a0) * 0.36, yb + derinlik * t0); ctx.lineTo(a0 + (b0 - a0) * 0.64, yb + derinlik * t0);
    ctx.lineTo(a1 + (b1 - a1) * 0.64, yb + derinlik * t1); ctx.lineTo(a1 + (b1 - a1) * 0.36, yb + derinlik * t1); ctx.closePath();
    ctx.fillStyle = "rgba(20,22,25,0.55)"; ctx.fill();
  }
  // ön yüz: gümüş kenar
  const yuz = Math.max(3, 10 * s);
  ctx.beginPath(); ctx.moveTo(x - e, yf); ctx.lineTo(x + w + e, yf); ctx.lineTo(x + w + e - 2 * s, yf + yuz); ctx.lineTo(x - e + 2 * s, yf + yuz); ctx.closePath();
  g = ctx.createLinearGradient(0, yf, 0, yf + yuz); g.addColorStop(0, "#dfe3e6"); g.addColorStop(1, "#7d838a");
  ctx.fillStyle = g; ctx.fill();
  return { sx, sy, sw, sh, h };
}


