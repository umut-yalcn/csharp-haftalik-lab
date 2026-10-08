// Kareleri işler: kaynak kareler + parametreler -> işlenmiş PNG kareler.
// Kullanım: node uret.js <kaynak_kareler> <parametre.json> <cikti_klasoru> [bas son]
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const [KAYNAK, PARAM, CIKTI] = process.argv.slice(2, 5).map((p) => path.resolve(p));
const BAS = +(process.argv[5] || 1), SON = +(process.argv[6] || 432);
const KOK = __dirname, VARLIK = path.join(KOK, "..", "referans");
const TUR = { ".html": "text/html", ".png": "image/png", ".js": "text/javascript" };
const sunucu = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split("?")[0]);
  const p = u.startsWith("/kareler/") ? path.join(KAYNAK, u.slice(9)) : u.startsWith("/varlik/") ? path.join(VARLIK, u.slice(8)) : path.join(KOK, u);
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { "Content-Type": TUR[path.extname(p)] || "application/octet-stream" }); res.end(d); });
});
sunucu.listen(0, async () => {
  const P = JSON.parse(fs.readFileSync(PARAM, "utf8"));
  fs.mkdirSync(CIKTI, { recursive: true });
  const tarayici = await chromium.launch();
  const sayfa = await tarayici.newPage({ viewport: { width: 1280, height: 720 } });
  sayfa.on("pageerror", (e) => console.log("[hata]", e.message));
  await sayfa.goto(`http://127.0.0.1:${sunucu.address().port}/uret.html`);
  await sayfa.evaluate(() => window.hazirla());
  const t0 = Date.now();
  for (let no = BAS; no <= SON; no++) {
    const ad = String(no).padStart(3, "0") + ".png";
    if (!P[no]) { fs.copyFileSync(path.join(KAYNAK, ad), path.join(CIKTI, ad)); continue; }
    const url = await sayfa.evaluate(([n, p]) => window.ciz(n, p), [no, P[no]]);
    fs.writeFileSync(path.join(CIKTI, ad), Buffer.from(url.split(",")[1], "base64"));
    if (no % 24 === 0) console.log(`kare ${no} (${((Date.now() - t0) / 1000).toFixed(0)} sn)`);
  }
  await tarayici.close(); sunucu.close();
});
