// Cloudflare Workers has no filesystem, so `public/` can't be scanned with
// fs.readdir at request time (see https://github.com/opennextjs/opennextjs-cloudflare/issues/734).
// This runs in real Node.js at build time and bakes the file listing into JSON instead.
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");
const outPath = path.join(process.cwd(), "src", "generated", "pictureManifest.json");

const dirs = ["player", "selfie"];
const manifest = {};

for (const dir of dirs) {
    const targetDir = path.join(publicDir, dir);
    const entries = readdirSync(targetDir, { withFileTypes: true });
    manifest[dir] = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
}

mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");
