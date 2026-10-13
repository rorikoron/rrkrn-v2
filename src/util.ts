// クライアントからも使う純粋な関数だけを置く。
// ビルド時のマニフェストを読む fetchPics は src/data/fetchPics.ts (クライアントのバンドルに JSON を入れないため)

// Worker を通すと Workers Free の CPU 上限 (10ms) に引っかかるので、R2 の公開ドメインから直接配信する
function boothImageUrl(r2Key: string): string {
    return "https://booth.rorikoron.net/" + r2Key.split("/").map(encodeURIComponent).join("/");
}

function formatPriceRange(min: number, max: number): string {
    if (min === 0 && max === 0) return "無料";
    if (min === max) return `${min.toLocaleString()}円`;
    return `${min.toLocaleString()}円〜${max.toLocaleString()}円`;
}

// next/image の placeholder="blur" 用。読み込み中はピンクの面をぼかしたものを出す。
// 数百バイトで済むように、画像ファイルではなく SVG をそのまま data URL にしている
const PLACEHOLDER_BLUR_DATA_URL =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><linearGradient id="g" x2="1" y2="1"><stop stop-color="#ffc2c2"/><stop offset="1" stop-color="#e8b4b8"/></linearGradient><rect width="8" height="8" fill="url(#g)"/></svg>'
    );

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
    boothImageUrl,
    formatPriceRange,
    distributeToColumns,
    PLACEHOLDER_BLUR_DATA_URL,
}