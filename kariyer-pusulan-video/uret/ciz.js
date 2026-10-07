// Bir kesiti kare kare çizer ve MP4'e çevirir.
// Kullanım: node ciz.js <kesit no, ör. 08> [--kareler 0,45,89] [--insan isik] [--yazi keskin|duz|kutu] [--laptop yeni] [--yuz yok|sade|detayli] [--insanlar yok]
//   --kareler: yalnızca o kareleri PNG olarak kaydeder; --insan isik: figürleri ışıktan insan olarak çizer
const http = require("http"), fs = require("fs"), path = require("path"), { spawn } = require("child_process");
const { chromium } = require("playwright");

const KOK = path.join(__dirname, "..");
const CIKTI = path.join(KOK, "cikti");
const kesit = process.argv[2];
const kareSecimi = process.argv.includes("--kareler") ? process.argv[process.argv.indexOf("--kareler") + 1].split(",").map(Number) : null;
if (!kesit) { console.error("Kullanım: node ciz.js <kesit no> [--kareler 0,45,89]"); process.exit(1); }

const TURLER = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".woff2": "font/woff2", ".woff": "font/woff" };
function sunucu() {
  return new Promise((coz) => {
    const s = http.createServer((istek, yanit) => {
      const yol = path.normalize(path.join(KOK, decodeURIComponent(istek.url.split("?")[0])));
      if (!yol.startsWith(KOK) || !fs.existsSync(yol) || fs.statSync(yol).isDirectory()) { yanit.writeHead(404); return yanit.end(); }
      yanit.writeHead(200, { "Content-Type": TURLER[path.extname(yol)] || "application/octet-stream" });
      fs.createReadStream(yol).pipe(yanit);
    });
    s.listen(0, "127.0.0.1", () => coz(s));
  });
}

(async () => {
  fs.mkdirSync(CIKTI, { recursive: true });
  const s = await sunucu();
  const tarayici = await chromium.launch({ args: ["--disable-gpu-vsync", "--force-color-profile=srgb"] });
  const sayfa = await tarayici.newPage({ viewport: { width: 1080, height: 1920 } });
  sayfa.on("pageerror", (h) => { console.error("Sayfa hatası:", h.message); process.exit(1); });
  const insan = process.argv.includes("--insan") ? process.argv[process.argv.indexOf("--insan") + 1] : "siluet";
  // ek seçenekler sayfaya sorgu parametresi olarak geçer: --yazi keskin, --laptop yeni, --yuz sade
  const ek = ["yazi", "laptop", "yuz", "insanlar"].filter((a) => process.argv.includes("--" + a)).map((a) => `&${a}=${process.argv[process.argv.indexOf("--" + a) + 1]}`).join("");
  const etiket = ["yazi", "laptop", "yuz", "insanlar"].filter((a) => process.argv.includes("--" + a)).map((a) => process.argv[process.argv.indexOf("--" + a) + 1]).join("-");
  await sayfa.goto(`http://127.0.0.1:${s.address().port}/uret/sahne.html?insan=${insan}${ek}`);
  await sayfa.evaluate(() => window.hazir);
  const sure = await sayfa.evaluate((k) => window.sure(k), kesit);
  const toplam = Math.round(sure * 30);
  const basla = Date.now();

  if (kareSecimi) {
    const klasor = path.join(CIKTI, `kesit-${kesit}${etiket ? "-" + etiket : ""}-kareler`);
    fs.mkdirSync(klasor, { recursive: true });
    for (const no of kareSecimi) {
      const b64 = await sayfa.evaluate(([k, n]) => window.kare(k, n), [kesit, no]);
      fs.writeFileSync(path.join(klasor, `${String(no).padStart(3, "0")}.png`), Buffer.from(b64, "base64"));
    }
    console.log(`${kareSecimi.length} kare -> ${klasor}`);
  } else {
    const dosya = path.join(CIKTI, `kesit-${kesit}${etiket ? "-" + etiket : ""}.mp4`);
    const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", "30", "-c:v", "png", "-i", "-",
      "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart", dosya], { stdio: ["pipe", "inherit", "inherit"] });
    for (let no = 0; no < toplam; no++) {
      const b64 = await sayfa.evaluate(([k, n]) => window.kare(k, n), [kesit, no]);
      if (!ff.stdin.write(Buffer.from(b64, "base64"))) await new Promise((c) => ff.stdin.once("drain", c));
    }
    ff.stdin.end();
    await new Promise((coz, red) => ff.on("close", (kod) => (kod === 0 ? coz() : red(new Error("ffmpeg " + kod)))));
    console.log(`${toplam} kare, ${((Date.now() - basla) / 1000).toFixed(1)} sn -> ${dosya}`);
  }
  await tarayici.close();
  s.close();
})().catch((h) => { console.error(h); process.exit(1); });
