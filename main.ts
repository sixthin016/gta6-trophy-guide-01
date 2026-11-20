// Leonida Atlas — entry program for the gta6-trophy-guide-01 bounty.
// Copies app/ and screenshots/ from beside this file into the output
// directory, then builds dossier.json there with the kit's vendored
// dossier builder. Node 22, standard library only.
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

const dossierBytes = await buildDossier(outDir, caps);
await writeFile(join(outDir, "dossier.json"), dossierBytes);
console.log("wrote " + join(outDir, "dossier.json") + " (" + dossierBytes.length + " bytes)");
