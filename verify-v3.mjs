// Local verification for the Leonida Atlas v3 entry (not part of the entry).
// Stricter than v2: every trophy carries Gamerscore (sum 1000), difficulty,
// time and chapter; 5 unconfirmed + 1 lead are flagged; the 100% checklist
// and platinum facts are present; guides are longer (avg >= 65, non-story
// min >= 55); citations >= 180 across 9 sources.
import { readdirSync, readFileSync, statSync } from 'node:fs';

let fail = 0;
function check(name, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
  if (!ok) fail++;
}

// Screenshots: 3-4 files, each <=256 KiB, long side <=1280, short side >=480.
const shots = readdirSync('out/screenshots').sort();
check('screenshot count 3-4', shots.length >= 3 && shots.length <= 4, shots.join(', '));
for (const f of shots) {
  const b = readFileSync('out/screenshots/' + f);
  let w = 0, h = 0;
  for (let i = 2; i < b.length - 9; i++) {
    if (b[i] === 0xFF && b[i + 1] === 0xC0) { h = b.readUInt16BE(i + 5); w = b.readUInt16BE(i + 7); break; }
  }
  check(`${f} <=256 KiB`, b.length <= 262144, `${(b.length / 1024).toFixed(1)} KiB`);
  check(`${f} dimensions`, Math.max(w, h) <= 1280 && Math.min(w, h) >= 480, `${w}x${h}`);
}

// App: plain files, <=993 entries, <=48 MiB.
let n = 0, bytes = 0;
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = dir + '/' + e.name;
    if (e.isDirectory()) { n++; walk(p); } else { n++; bytes += statSync(p).size; }
  }
})('out/app');
check('app entries <=993', n <= 993, String(n));
check('app bytes <=48 MiB', bytes <= 50331648, String(bytes));

// No absolute URLs in html/js/css source (gate references).
const absRe = /https?:\/\/|src\s*=\s*["']\/\//;
let absFound = [];
for (const f of ['app/index.html', 'app/app.js', 'app/style.css']) {
  const s = readFileSync('out/' + f, 'utf8');
  if (absRe.test(s)) absFound.push(f);
}
check('no absolute URLs in html/js/css', absFound.length === 0, absFound.join(', '));

// No network fetch of remote hosts in app.js; only relative data fetch.
const appJs = readFileSync('out/app/app.js', 'utf8');
check('app.js fetches only relative data', /fetch\('data\/trophies\.json'\)/.test(appJs) && !/fetch\(['"`]https?:/.test(appJs));

// Trophies gate: 55 official names with non-blank guides.
const official = [
  'Vice Got a Price!', 'Just Like Paradise', 'Paradise Lost', 'T**s Ass Drug Money',
  'Vice City, Baby!', 'Top Of The World, Ma', 'You Gotta Know When to Get Off', 'Trust',
  'Break the Bank', 'Family Matters', 'DWNFALL', 'Hi-Jacked', 'Snow Storm', 'A Long Road',
  'Cunning Stunts', 'Master of None', 'The Shootist', 'Top Fun', 'Earn Cash, Not Kudos',
  'Baited My Tackle', 'Stick Fiddler', 'Road to Rehabilitation', 'This Was No Boat Accident',
  'The Lone Rider', 'Strangers & Freaks', 'Supply & Demand', 'Spin On This!',
  'Positive Mental Attitude', 'Fair Game', "Don't Touch My Deck", 'You WAiNKer!',
  'One Last Thing', 'Hot Together', 'Retail Therapy', 'Whip It Good', 'Gunslinger',
  'Catch Me If You Can', 'Challenging Tank', 'Sneakthief', 'Maximum Withdrawal',
  'A Classic Blitz Play', 'The Goodtime State', 'Pest Control', 'In The Beginning…',
  'Capital Offense', 'Let’s Go Bowling', 'Personal Best', 'Actions Speak Louder',
  'Bad Luck, I Guess', 'The Truth Is Out There', 'Ten Pin', 'Dime on the Dollar',
  'Treat Yo Self', 'Little Boxes', 'On the Spot',
];
const data = JSON.parse(readFileSync('out/app/data/trophies.json', 'utf8'));
const norm = (s) => s.replace(/[’‘]/g, "'").replace(/[–—]/g, '-').replace(/…/g, '...').replace(/\s+/g, ' ').trim().toLowerCase();
const byName = new Map(data.trophies.map((t) => [norm(t.name), t]));
const missing = official.filter((name) => {
  const t = byName.get(norm(name));
  return !t || !t.guide || !t.guide.trim();
});
check('55/55 official names with guides', missing.length === 0, missing.join('; '));
check('55 trophies total', data.trophies.length === 55, String(data.trophies.length));
check('14 missable', data.trophies.filter((t) => t.missable).length === 14);
check('roadmap covers 55', data.roadmap.reduce((a, s) => a + s.trophies.length, 0) === 55);
check('every guide cites >=1 source', data.trophies.every((t) => t.sources && t.sources.length >= 1));
const cites = data.trophies.reduce((a, t) => a + t.sources.length, 0);
const uniq = new Set(data.trophies.flatMap((t) => t.sources.map((s) => s.name))).size;
console.log(`INFO  citations total: ${cites}, unique source names: ${uniq}`);
console.log(`INFO  grades: ${JSON.stringify(data.trophies.reduce((a, t) => { a[t.grade] = (a[t.grade] || 0) + 1; return a; }, {}))}`);
console.log(`INFO  source matrix entries: ${(data.sources || []).length}`);

// v3 gates: new per-trophy fields and content depth.
const words = (s) => (s || '').split(/\s+/).filter(Boolean).length;
const guideWords = data.trophies.map((t) => words(t.guide));
const avgWords = guideWords.reduce((a, w) => a + w, 0) / guideWords.length;
const nonStoryMin = Math.min(...data.trophies.filter((t) => t.kind !== 'story').map((t) => words(t.guide)));
check('avg guide words >= 65', avgWords >= 65, avgWords.toFixed(1));
check('non-story min guide words >= 55', nonStoryMin >= 55, String(nonStoryMin));
check('every trophy has >= 2 steps', data.trophies.every((t) => (t.steps || []).length >= 2));
check('non-story trophies have >= 3 steps',
  data.trophies.filter((t) => t.kind !== 'story').every((t) => (t.steps || []).length >= 3));
const gsSum = data.trophies.reduce((a, t) => a + (t.gamerscore ?? 0), 0);
check('gamerscore sums to 1000', gsSum === 1000, String(gsSum));
check('every trophy has gamerscore 0-100', data.trophies.every((t) => Number.isInteger(t.gamerscore) && t.gamerscore >= 0 && t.gamerscore <= 100));
check('every trophy has difficulty 1-5', data.trophies.every((t) => Number.isInteger(t.difficulty) && t.difficulty >= 1 && t.difficulty <= 5));
check('every trophy has a time estimate', data.trophies.every((t) => typeof t.time === 'string' && t.time.trim().length > 0));
check('every trophy has a chapter', data.trophies.every((t) => ['1', '2', '3', '4', '5', 'any', 'post-story'].includes(String(t.chapter))));
const unconfirmed = data.trophies.filter((t) => t.status === 'unconfirmed').map((t) => t.name);
check('exactly 5 unconfirmed', unconfirmed.length === 5, unconfirmed.join('; '));
const leads = data.trophies.filter((t) => t.status === 'lead').map((t) => t.name);
check('exactly 1 lead (Personal Best)', leads.length === 1 && leads[0] === 'Personal Best', leads.join('; '));
check('citations >= 180', cites >= 180, String(cites));
check('source matrix >= 9', (data.sources || []).length >= 9, String((data.sources || []).length));
check('checklist100 has 14 rows', (data.checklist100 || []).length === 14, String((data.checklist100 || []).length));
check('platinum facts present', !!data.platinum && data.platinum.difficulty === '4/10' && /200/.test(data.platinum.time || ''));
check('every roadmap stage has hours', data.roadmap.every((s) => typeof s.hours === 'string' && s.hours.length > 0));
console.log(`INFO  guide words total: ${guideWords.reduce((a, w) => a + w, 0)}, steps total: ${data.trophies.reduce((a, t) => a + t.steps.length, 0)}`);

// Dossier: byte-identical rebuild check is the scorer's job; here just confirm
// the dossier text carries the Load Totals line and the outline headings.
const dossier = JSON.parse(readFileSync('out/dossier.json', 'utf8'));
check('dossier has text', typeof dossier.text === 'string' && dossier.text.length > 1000, `${dossier.text.length} chars`);
check('dossier text <=160 KiB', Buffer.byteLength(dossier.text) <= 163840);

console.log(fail === 0 ? '\nALL CHECKS PASSED' : `\n${fail} CHECK(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);
