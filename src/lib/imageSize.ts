export interface ImageSize {
    width: number;
    height: number;
}

// 画像ファイルの先頭バイトから縦横サイズを読む。PNG / JPEG / WebP に対応。
// 読めない形式やバイト数が足りない場合は null を返す
export function readImageSize(bytes: Uint8Array): ImageSize | null {
    return readPngSize(bytes) ?? readJpegSize(bytes) ?? readWebpSize(bytes);
}

function readPngSize(b: Uint8Array): ImageSize | null {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    if (b.length < 24 || !signature.every((v, i) => b[i] === v)) return null;
    const view = new DataView(b.buffer, b.byteOffset, b.byteLength);
    // IHDR チャンクは必ず先頭。幅と高さは 16 / 20 バイト目
    return { width: view.getUint32(16), height: view.getUint32(20) };
}

function readJpegSize(b: Uint8Array): ImageSize | null {
    if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
    const view = new DataView(b.buffer, b.byteOffset, b.byteLength);
    let offset = 2;
    while (offset + 9 < b.length) {
        if (b[offset] !== 0xff) return null;
        const marker = b[offset + 1];
        // 0xFF の詰め物はスキップ
        if (marker === 0xff) {
            offset++;
            continue;
        }
        // SOF0〜SOF15 (DHT / JPG / DAC の C4 / C8 / CC を除く) にサイズがある
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
            return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
        }
        offset += 2 + view.getUint16(offset + 2);
    }
    return null;
}

function readWebpSize(b: Uint8Array): ImageSize | null {
    const ascii = (start: number, end: number) => String.fromCharCode(...b.subarray(start, end));
    if (b.length < 30 || ascii(0, 4) !== "RIFF" || ascii(8, 12) !== "WEBP") return null;
    const view = new DataView(b.buffer, b.byteOffset, b.byteLength);
    switch (ascii(12, 16)) {
        case "VP8 ":
            return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
        case "VP8L": {
            const bits = view.getUint32(21, true);
            return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
        }
        case "VP8X": {
            const u24 = (at: number) => b[at] | (b[at + 1] << 8) | (b[at + 2] << 16);
            return { width: u24(24) + 1, height: u24(27) + 1 };
        }
        default:
            return null;
    }
}
