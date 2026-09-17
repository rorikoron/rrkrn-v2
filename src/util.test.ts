import { fetchPics, boothImageUrl, formatPriceRange } from "@/util";

describe("fetchPics", () => {
    it("returns manifest entries matching the default image extensions", async () => {
        const result = await fetchPics("player");
        expect(Array.isArray(result)).toBe(true);
        for (const url of result) {
            expect(url.startsWith("/player/")).toBe(true);
        }
    });

    it("returns an empty array for a directory not in the manifest", async () => {
        const result = await fetchPics("does-not-exist");
        expect(result).toEqual([]);
    });

    it("filters by a custom regexp", async () => {
        const result = await fetchPics("player", /nonexistent-suffix\.zzz$/i);
        expect(result).toEqual([]);
    });
});

describe("boothImageUrl", () => {
    it("builds an /api/images path from an R2 key", () => {
        expect(boothImageUrl("items/foo.png")).toBe("/api/images/items/foo.png");
    });

    it("percent-encodes each path segment independently", () => {
        expect(boothImageUrl("items/日本語 名前.png")).toBe(
            `/api/images/items/${encodeURIComponent("日本語 名前.png")}`
        );
    });

    it("does not encode the slash separators themselves", () => {
        expect(boothImageUrl("a/b/c.png")).toBe("/api/images/a/b/c.png");
    });
});

describe("formatPriceRange", () => {
    it("returns 無料 when both min and max are 0", () => {
        expect(formatPriceRange(0, 0)).toBe("無料");
    });

    it("returns a single price when min equals max", () => {
        expect(formatPriceRange(1000, 1000)).toBe("1,000円");
    });

    it("returns a range when min differs from max", () => {
        expect(formatPriceRange(1000, 2000)).toBe("1,000円〜2,000円");
    });

    it("formats large numbers with thousands separators", () => {
        expect(formatPriceRange(1000000, 1000000)).toBe("1,000,000円");
    });
});
