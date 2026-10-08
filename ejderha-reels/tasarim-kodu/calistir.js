// Statik sunucu + Playwright: tasarim.html içindeki her canvas'ı PNG olarak kaydeder.
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const KOK = __dirname;
const TUR = { ".html": "text/html", ".png": "image/png", ".css": "text/css", ".woff2": "font/woff2", ".woff": "font/woff", ".js": "text/javascript" };
const sunucu = http.createServer((req, res) => {
  const p = path.join(KOK, decodeURIComponent(req.url.split("?")[0]));
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { "Content-Type": TUR[path.extname(p)] || "application/octet-stream" }); res.end(d); });
});
sunucu.listen(0, async () => {
  const port = sunucu.address().port;
  const tarayici = await chromium.launch();
  const sayfa = await tarayici.newPage({ viewport: { width: 2000, height: 1200 } });
  sayfa.on("console", (m) => console.log("[sayfa]", m.text()));
  sayfa.on("pageerror", (e) => console.log("[hata]", e.message));
  await sayfa.goto(`http://127.0.0.1:${port}/${process.argv[2] || "tasarim.html"}`);
  await sayfa.waitForFunction("window.HAZIR === true", null, { timeout: 30000 });
  const ciktilar = await sayfa.evaluate(() => [...document.querySelectorAll("canvas")].map((c) => [c.id, c.toDataURL("image/png")]));
  for (const [ad, url] of ciktilar) fs.writeFileSync(path.join(KOK, ad + ".png"), Buffer.from(url.split(",")[1], "base64"));
  console.log("kaydedildi:", ciktilar.map((c) => c[0]).join(", "));
  await tarayici.close(); sunucu.close();
});
