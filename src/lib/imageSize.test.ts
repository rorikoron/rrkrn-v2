import { readImageSize } from "@/lib/imageSize";

function png(width: number, height: number): Uint8Array {
    const b = new Uint8Array(24);
    b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const view = new DataView(b.buffer);
    view.setUint32(16, width);
    view.setUint32(20, height);
    return b;
}

function jpeg(width: number, height: number): Uint8Array {
    return new Uint8Array([
        0xff, 0xd8,
        // APP0 (中身は適当、長さ 6)
        0xff, 0xe0, 0x00, 0x06, 0, 0, 0, 0,
        // DHT はサイズ情報ではないので読み飛ばされるべき
        0xff, 0xc4, 0x00, 0x04, 0, 0,
        // SOF2 (プログレッシブ)
        0xff, 0xc2, 0x00, 0x11, 0x08,
        height >> 8, height & 0xff, width >> 8, width & 0xff,
        0x03, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
}

function webpVp8x(width: number, height: number): Uint8Array {
    const b = new Uint8Array(30);
    b.set([..."RIFF"].map((c) => c.charCodeAt(0)), 0);
    b.set([..."WEBPVP8X"].map((c) => c.charCodeAt(0)), 8);
    const w = width - 1;
    const h = height - 1;
    b.set([w & 0xff, (w >> 8) & 0xff, (w >> 16) & 0xff], 24);
    b.set([h & 0xff, (h >> 8) & 0xff, (h >> 16) & 0xff], 27);
    return b;
}

describe("readImageSize", () => {
    it("reads PNG dimensions from IHDR", () => {
        expect(readImageSize(png(1920, 1080))).toEqual({ width: 1920, height: 1080 });
    });

    it("reads JPEG dimensions from the SOF marker, skipping other segments", () => {
        expect(readImageSize(jpeg(1080, 1440))).toEqual({ width: 1080, height: 1440 });
    });

    it("reads WebP (VP8X) dimensions", () => {
        expect(readImageSize(webpVp8x(1200, 1200))).toEqual({ width: 1200, height: 1200 });
    });

    it("returns null for unknown formats", () => {
        expect(readImageSize(new Uint8Array(64))).toBeNull();
    });

    it("returns null for a JPEG cut off before the SOF marker", () => {
        expect(readImageSize(jpeg(1080, 1440).subarray(0, 16))).toBeNull();
    });
});
