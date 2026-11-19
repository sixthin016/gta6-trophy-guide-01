// Leonida Atlas — the entry program (Node 22, standard library only).
//
// It hands the guide in: copies this repository's app/ and screenshots/ to
// /output and writes /output/dossier.json with the vendored make.fun library
// (vendor/makefun-frontend.ts, the kit's copy, unchanged — the scorer rebuilds
// the dossier with its own copy and compares the two byte for byte).
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Serve the guide locally first with `node serve.ts` (http://localhost:8080).

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Sanity check before the hand-in: the trophy file must name all 55 trophies
// with a guide each, or the entry would fail the gate's trophies row.
const trophyFile = JSON.parse(readFileSync(join(here, 'app', 'data', 'trophies.json'), 'utf-8'));
const trophies = Array.isArray(trophyFile) ? trophyFile : trophyFile.trophies;
if (!Array.isArray(trophies) || trophies.length !== 55) {
  throw new Error(`expected 55 trophies in app/data/trophies.json, found ${Array.isArray(trophies) ? trophies.length : 'none'}`);
}
for (const trophy of trophies) {
  if (typeof trophy.name !== 'string' || !trophy.name.trim()) throw new Error('a trophy is missing its name');
  if (typeof trophy.guide !== 'string' || !trophy.guide.trim()) throw new Error(`trophy "${trophy.name}" has no guide`);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in
// app/ or 48 MiB of app files: app/ counts beside /output's own 1000-entry
// cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
