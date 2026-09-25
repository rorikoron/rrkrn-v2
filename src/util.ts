import pictureManifest from "@/generated/pictureManifest.json";

// Cloudflare Workers has no filesystem, so this reads a manifest generated at
// build time (scripts/generate-picture-manifest.mjs) instead of scanning
// public/ with fs.readdir at request time.
async function fetchPics(dir: string, regexp: RegExp = /\.(jpe?g|png|webp)$/i): Promise<string[]> {
    const files: string[] = (pictureManifest as Record<string, string[]>)[dir] ?? [];
    return files.filter((name) => regexp.test(name)).map((name) => `/${dir}/${name}`);
}

// Worker を通すと Workers Free の CPU 上限 (10ms) に引っかかるので、R2 の公開ドメインから直接配信する
function boothImageUrl(r2Key: string): string {
    return "https://booth.rorikoron.net/" + r2Key.split("/").map(encodeURIComponent).join("/");
}

function formatPriceRange(min: number, max: number): string {
    if (min === 0 && max === 0) return "無料";
    if (min === max) return `${min.toLocaleString()}円`;
    return `${min.toLocaleString()}円〜${max.toLocaleString()}円`;
}

// 縦横比の分からない画像はとりあえず正方形として扱う
const FALLBACK_ASPECT = 1;

// マソンリー用に、先頭から順に「その時点でいちばん短い列」へ積んでいく。
// 同じ長さなら左の列を優先するので、並びは左→右・上→下でおおよそ保たれる。
// 見出しなどで列の頭が埋まっている場合は、その高さを列幅比で initialHeights に渡す
function distributeToColumns<T extends { width?: number; height?: number }>(
    items: T[],
    columnCount: number,
    initialHeights: number[] = []
): T[][] {
    const columns: T[][] = Array.from({ length: columnCount }, () => []);
    const heights: number[] = Array.from({ length: columnCount }, (_, i) => initialHeights[i] ?? 0);
    for (const item of items) {
        const shortest = heights.indexOf(Math.min(...heights));
        columns[shortest].push(item);
        heights[shortest] +=
            item.width && item.height ? item.height / item.width : FALLBACK_ASPECT;
    }
    return columns;
}

export {
    fetchPics,
    boothImageUrl,
    formatPriceRange,
    distributeToColumns,
}