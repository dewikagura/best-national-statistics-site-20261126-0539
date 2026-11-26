// NusaStat — entrypoint for the best-national-statistics-site bounty.
// Node 22, standard library only. The site itself lives in app/ as plain
// static files (index.html + local .js/.css, no build step, no network).
// This program hands the site in: it copies app/ and screenshots/ from
// beside this file into the output directory and writes dossier.json there
// with the kit's vendored buildDossier, exactly as the gate re-derives it.
// vendor/makefun-frontend.ts is the kit's copy, unchanged.
//
// Run it twice and compare: both runs must write identical bytes.
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(root, 'app');
const shotsDir = join(root, 'screenshots');

function fail(message: string): never {
  throw new Error('NusaStat hand-in: ' + message);
}

// The gate refuses more than 4 screenshots or one over 256 KiB, and an app/
// over 993 entries or 16 MiB. Check early so a bad hand-in fails loudly here
// instead of silently at the gate.
const shots = existsSync(shotsDir) ? readdirSync(shotsDir).filter((f) => !f.startsWith('.')) : [];
if (shots.length < 3 || shots.length > 4) fail(`expected 3 or 4 screenshots, found ${shots.length}`);
for (const shot of shots) {
  const size = statSync(join(shotsDir, shot)).size;
  if (size > 256 * 1024) fail(`screenshot ${shot} is ${size} bytes, over the 256 KiB cap`);
}
if (!existsSync(join(appDir, 'index.html'))) fail('app/index.html is missing');

mkdirSync(outDir, { recursive: true });
cpSync(appDir, join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });

writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

console.log(`NusaStat handed in: ${shots.length} screenshots, dossier written to ${join(outDir, 'dossier.json')}`);
console.log(`app/ files copied from ${appDir}; entrypoint checks passed.`);
