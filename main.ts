/* Leonida Atlas — entry program for make.fun gta6-trophy-guide-01.
   Copies app/ and screenshots/ from beside this file into the output
   directory, then asks the vendored dossier builder to write the
   dossier for them. The output directory comes from the
   MAKEFUN_OUTPUT_DIR environment variable, or /output when unset.
   Standard library only; runs on Node 22+. */
import { cp, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

const caps = {
  text_max_bytes: 163840,
  screenshots_max: 4,
  screenshot_max_bytes: 262144,
  app_max_files: 993,
  app_max_bytes: 50331648,
};

await mkdir(outDir, { recursive: true });
await cp(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });
await cp(join(repoRoot, "screenshots"), join(outDir, "screenshots"), { recursive: true });

const dossier = await buildDossier(outDir, caps);
await writeFile(join(outDir, "dossier.json"), dossier);
console.log("wrote " + join(outDir, "dossier.json"));
