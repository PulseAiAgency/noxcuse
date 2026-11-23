// Social media kit from the app icon drawing and the « NOXCUSE. » wordmark:
// profile picture (safe inside a circle crop), wordmark PNGs (transparent), X/Twitter banner.
// Usage: node scripts/make-social.mjs  → design/marketing/social/
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(join(execSync('npm root -g').toString().trim(), 'noop.js'));
const { chromium } = require('playwright');

const BG = '#111214';
const ACCENT = '#FF6A3D';
const WHITE = '#F5F5F0';
const INK = '#0E0E0F';
const OUT = 'design/marketing/social';
const font = readFileSync('assets/fonts/Archivo-Black.ttf').toString('base64');
const wide = readFileSync('assets/fonts/Archivo-ExpandedExtraBold.ttf').toString('base64');

function bar(color) {
  return `<rect x="-380" y="-22" width="760" height="44" rx="22" fill="${color}"/>
    <rect x="-330" y="-120" width="58" height="240" rx="14" fill="${color}"/>
    <rect x="272" y="-120" width="58" height="240" rx="14" fill="${color}"/>`;
}
/** The crossed bars (same drawing as scripts/make-icons.mjs) at (x, y), half-width `extent`. */
function cross(x, y, extent) {
  const k = extent / 354;
  return `<svg style="position:absolute;left:${x - extent * 1.2}px;top:${y - extent * 1.2}px" width="${extent * 2.4}" height="${extent * 2.4}" viewBox="${-extent * 1.2} ${-extent * 1.2} ${extent * 2.4} ${extent * 2.4}">
    <g transform="scale(${k})"><g transform="rotate(45)">${bar(WHITE)}</g><g transform="rotate(-45)">${bar(ACCENT)}</g></g></svg>`;
}
const css = `@font-face{font-family:B;src:url(data:font/ttf;base64,${font})}
@font-face{font-family:W;src:url(data:font/ttf;base64,${wide})}
body{margin:0}#c{position:relative;overflow:hidden}
.word{font-family:B;letter-spacing:-0.05em;line-height:1;white-space:nowrap;position:absolute}`;
const word = (size, color, x, y) =>
  `<div class="word" style="font-size:${size}px;color:${color};left:${x}px;top:${y}px">NOXCUSE<span style="color:${ACCENT}">.</span></div>`;

const jobs = [
  // Profile picture: the X stays inside the circle that Instagram / TikTok / X crop to.
  ['noxcuse-profil-1080.png', 1080, 1080, BG, cross(540, 540, 300), false],
  // Wordmark, transparent, light on dark and dark on light.
  ['noxcuse-logo-blanc.png', 2400, 520, null, word(400, WHITE, 60, 60), true],
  ['noxcuse-logo-noir.png', 2400, 520, null, word(400, INK, 60, 60), true],
  // X / Twitter header 1500 × 500 (profile picture overlaps the bottom left: keep it clear).
  [
    'noxcuse-banniere-1500x500.png',
    1500,
    500,
    BG,
    `<div style="position:absolute;inset:0;background:radial-gradient(ellipse 60% 90% at 70% 50%, rgba(255,106,61,.22), transparent 70%)"></div>
     ${cross(1290, 250, 130)}
     ${word(130, WHITE, 300, 150)}
     <div style="position:absolute;left:306px;top:310px;font-family:W;font-size:40px;color:#C9CACE;letter-spacing:.02em;text-transform:uppercase">La muscu entre potes<span style="color:${ACCENT}">.</span></div>`,
    false,
  ],
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [file, w, h, bg, body, transparent] of jobs) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(
    `<html><head><style>${css}</style></head><body><div id="c" style="width:${w}px;height:${h}px;${bg ? `background:${bg}` : ''}">${body}</div></body></html>`,
  );
  await page.evaluate(() => document.fonts.ready);
  const png = await page.locator('#c').screenshot({ omitBackground: transparent });
  writeFileSync(join(OUT, file), png);
  console.log('wrote', file);
}
await browser.close();
