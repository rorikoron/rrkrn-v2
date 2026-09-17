import pictureManifest from "@/generated/pictureManifest.json";

// Cloudflare Workers has no filesystem, so this reads a manifest generated at
// build time (scripts/generate-picture-manifest.mjs) instead of scanning
// public/ with fs.readdir at request time.
async function fetchPics(dir: string, regexp: RegExp = /\.(jpg|png)$/i): Promise<string[]> {
    const files: string[] = (pictureManifest as Record<string, string[]>)[dir] ?? [];
    return files.filter((name) => regexp.test(name)).map((name) => `/${dir}/${name}`);
}

function boothImageUrl(r2Key: string): string {
    return "/api/images/" + r2Key.split("/").map(encodeURIComponent).join("/");
}

function formatPriceRange(min: number, max: number): string {
    if (min === 0 && max === 0) return "無料";
    if (min === max) return `${min.toLocaleString()}円`;
    return `${min.toLocaleString()}円〜${max.toLocaleString()}円`;
}

export {
    fetchPics,
    boothImageUrl,
    formatPriceRange,
}