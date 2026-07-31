// Generates the free lead-magnet sample (Prologue + Chapter One) as a branded HTML
// file, then renders it to private/the-beginning.pdf via headless Chrome.
// Run: node scripts/build-sample-pdf.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HTML_OUT = join(root, 'private/the-beginning.html');
const PDF_OUT = join(root, 'private/the-beginning.pdf');

// Prologue through end of Chapter One (before Interlude 2) = the free "beginning".
const START = 4; // 1-indexed manuscript line: "Prologue"
const END = 130; // inclusive; stops before "Interlude 2"

const all = readFileSync(
  join(root, 'design_handoff/book/The Matrix is a Documentary.txt'),
  'utf8'
)
  .replace(/\r\n/g, '\n')
  .split('\n');

const lines = all.slice(START - 1, END);

const H1 = new Set(['Prologue', 'Chapter 1: Love’s Whisper']);
const H2 = new Set(['About Eterno', 'Orientation', 'Interlude 1: Before the Game']);

const esc = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const isEpigraph = (l) => /^[“"].*[”"]$/.test(l);
const stripQuotes = (l) => l.replace(/^[“"]|[”"]$/g, '');

// Line-by-line state machine (the manuscript rarely uses blank lines, so headings,
// epigraphs, bullets and "Eterno speaks" callouts must be detected inline).
let html = '';
let para = [];
let bullets = [];
let eterno = [];
let mode = 'normal'; // 'normal' | 'eterno'
let expectEpigraph = false;

const flushPara = () => {
  if (para.length) html += `<p>${para.map(esc).join('<br>')}</p>`;
  para = [];
};
const flushBullets = () => {
  if (bullets.length)
    html += `<ul class="questions">${bullets
      .map((b) => `<li>${esc(b)}</li>`)
      .join('')}</ul>`;
  bullets = [];
};
const flushEterno = () => {
  if (eterno.length)
    html += `<div class="eterno"><span class="eterno-label">Eterno speaks</span><p>${eterno
      .map(esc)
      .join('<br>')}</p></div>`;
  eterno = [];
};

for (const raw of lines) {
  const line = raw.trim();

  if (line === '') {
    flushBullets();
    if (mode === 'eterno') {
      flushEterno();
      mode = 'normal';
    } else {
      flushPara();
    }
    continue;
  }

  if (H1.has(line) || H2.has(line)) {
    flushBullets();
    if (mode === 'eterno') {
      flushEterno();
      mode = 'normal';
    }
    flushPara();
    html += H1.has(line) ? `<h1>${esc(line)}</h1>` : `<h2>${esc(line)}</h2>`;
    expectEpigraph = true;
    continue;
  }

  if (expectEpigraph && isEpigraph(line)) {
    html += `<p class="epigraph">${esc(stripQuotes(line))}</p>`;
    expectEpigraph = false;
    continue;
  }
  expectEpigraph = false;

  if (line === 'Eterno speaks:') {
    flushBullets();
    flushPara();
    mode = 'eterno';
    continue;
  }
  if (mode === 'eterno') {
    eterno.push(stripQuotes(line));
    continue;
  }

  if (line.startsWith('●')) {
    flushPara();
    bullets.push(line.replace(/^●\s*/, ''));
    continue;
  }
  flushBullets();
  para.push(line);
}
flushBullets();
flushEterno();
flushPara();

const doc = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">
<style>
  @page { size: 148mm 210mm; margin: 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; }
  body { font-family: 'Crimson Pro', Georgia, serif; color: #241c10; background: #faf6ec; }

  /* Cover */
  .cover {
    height: 210mm; padding: 34mm 20mm; text-align: center;
    background: radial-gradient(ellipse 90% 60% at 50% 0%, #101a33 0%, #05070d 72%);
    color: #efe6d2; display: flex; flex-direction: column; align-items: center; justify-content: center;
    break-after: page;
  }
  .cover .kicker { font-family: 'Crimson Pro'; font-style: italic; letter-spacing: .14em; color: rgba(232,163,61,.85); font-size: 12pt; }
  .cover h1 { font-family: 'Cinzel'; font-weight: 700; font-size: 24pt; line-height: 1.25; letter-spacing: .04em; color: #efe6d2; margin: 10mm 0 4mm; }
  .cover .sub { font-family: 'Crimson Pro'; font-size: 12.5pt; color: rgba(233,228,216,.7); max-width: 90mm; line-height: 1.5; }
  .cover .rule { width: 40mm; height: 1px; background: rgba(232,163,61,.5); margin: 12mm 0; }
  .cover .free { font-family: 'Cinzel'; font-weight: 600; letter-spacing: .18em; font-size: 11pt;
    background: linear-gradient(180deg,#f5c76a,#c97b1f); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .cover .author { font-family: 'Cinzel'; letter-spacing: .2em; font-size: 10pt; color: rgba(232,163,61,.8); margin-top: 6mm; }

  /* Reading pages */
  .page { padding: 20mm 18mm 22mm; }
  h1 { font-family: 'Cinzel'; font-weight: 700; font-size: 19pt; color: #7a4d12; margin: 10mm 0 2mm; break-after: avoid; break-before: page; text-align: center; letter-spacing: .02em; }
  h1:first-of-type { break-before: avoid; }
  h2 { font-family: 'Cinzel'; font-weight: 600; font-size: 13pt; color: #9a6a1c; margin: 9mm 0 2mm; break-after: avoid; text-align: center; letter-spacing: .06em; }
  p { font-size: 12pt; line-height: 1.62; margin: 0 0 4.5mm; }
  .epigraph { font-style: italic; color: #7a4d12; text-align: center; font-size: 12.5pt; margin: 3mm auto 7mm; max-width: 95mm; }
  ul.questions { list-style: none; padding: 0; margin: 4mm 0 6mm; }
  ul.questions li { font-style: italic; color: #4a3a1e; font-size: 12pt; line-height: 1.5; margin: 0 0 2.5mm; padding-left: 6mm; position: relative; }
  ul.questions li::before { content: '❦'; position: absolute; left: 0; color: #c9962f; }
  .eterno { border-left: 2px solid #c9962f; background: #f3ead4; padding: 5mm 6mm; margin: 6mm 0; border-radius: 2px; break-inside: avoid; }
  ul.questions, .endnote { break-inside: avoid; }
  .eterno-label { display: block; font-family: 'Cinzel'; font-weight: 600; letter-spacing: .14em; font-size: 9.5pt; color: #9a6a1c; text-transform: uppercase; margin-bottom: 2mm; }
  .eterno p { font-style: italic; color: #3a2e18; margin: 0; font-size: 12pt; }

  .endnote { margin-top: 12mm; padding-top: 8mm; border-top: 1px solid rgba(122,77,18,.25); text-align: center; }
  .endnote .line { font-family: 'Cinzel'; color: #7a4d12; font-size: 12.5pt; line-height: 1.5; }
  .endnote .cta { font-family: 'Crimson Pro'; font-size: 11.5pt; color: #4a3a1e; margin-top: 4mm; }
</style></head>
<body>
  <section class="cover">
    <div class="kicker">A JOURNEY OF AWAKENING, REMEMBERING, AND THE KEY THAT FREES THE SOUL</div>
    <h1>The Matrix is a Documentary</h1>
    <div class="rule"></div>
    <div class="free">THE BEGINNING · PROLOGUE &amp; CHAPTER ONE</div>
    <div class="sub" style="margin-top:8mm">A free excerpt. Read the opening of the book, and feel the coin in your hand.</div>
    <div class="author">JACK AMORINO</div>
  </section>
  <div class="page">
    ${html}
    <div class="endnote">
      <div class="line">The story continues — with twenty-seven Keys<br>and the one that was always in your pocket.</div>
      <div class="cta">Continue reading: thematrixisadocumentary.com</div>
    </div>
  </div>
</body></html>`;

writeFileSync(HTML_OUT, doc, 'utf8');
console.log('Wrote HTML:', HTML_OUT);

// Render to PDF with headless Chrome.
execFileSync(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${PDF_OUT}`,
    `file://${HTML_OUT}`,
  ],
  { stdio: 'inherit', timeout: 120000 }
);
console.log('Wrote PDF:', PDF_OUT);
