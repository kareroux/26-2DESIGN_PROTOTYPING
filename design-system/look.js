// Renders the lamp scroll page at fixed scroll points, deterministically.
// prefers-reduced-motion pins the camera wobble and the lamp flicker, so two
// runs of the same build are pixel-identical and a diff means a real change.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..', 'scroll-work', 'fish_lamp_scroll');
const OUT = path.join(__dirname, 'looks', process.argv[2] || 'after');
const STATES = [0, 0.20, 0.45, 0.70, 0.97];
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css' };

const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(f, (e, d) => e ? (res.writeHead(404), res.end()) :
    (res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }), res.end(d)));
});

(async () => {
  await new Promise(r => server.listen(8777, r));
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  for (const p of STATES) {
    await page.goto(`http://localhost:8777/?p=${p}`, { waitUntil: 'load' });
    await page.waitForFunction(() => window.__fl && window.__fl.info().parts > 0, null, { timeout: 30000 });
    await page.waitForTimeout(2500);               // let the camera lerp settle
    const name = `p${String(Math.round(p * 100)).padStart(3, '0')}.png`;
    await page.screenshot({ path: path.join(OUT, name) });
    process.stdout.write(`${name}  parts=${(await page.evaluate(() => window.__fl.info())).parts}\n`);
  }
  await browser.close();
  server.close();
})();
