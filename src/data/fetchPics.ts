import pictureManifest from "@/generated/pictureManifest.json";

// Cloudflare Workers has no filesystem, so this reads a manifest generated at
// build time (scripts/generate-picture-manifest.mjs) instead of scanning
// public/ with fs.readdir at request time.
export default async function fetchPics(dir: string, regexp: RegExp = /\.(jpe?g|png|webp)$/i): Promise<string[]> {
    const files: string[] = (pictureManifest as Record<string, string[]>)[dir] ?? [];
    return files.filter((name) => regexp.test(name)).map((name) => `/${dir}/${name}`);
}
