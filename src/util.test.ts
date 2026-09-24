import { fetchPics, boothImageUrl, formatPriceRange, distributeToColumns } from "@/util";

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

describe("distributeToColumns", () => {
    const landscape = (id: string) => ({ id, width: 16, height: 9 });
    const portrait = (id: string) => ({ id, width: 9, height: 16 });
    type Item = { id: string; width?: number; height?: number };
    const ids = (columns: Item[][]) => columns.map((c) => c.map((i) => i.id));

    it("fills the first row left to right", () => {
        const items = ["a", "b", "c"].map(landscape);
        expect(ids(distributeToColumns(items, 3))).toEqual([["a"], ["b"], ["c"]]);
    });

    it("puts the next item under the shortest column", () => {
        const items = [portrait("tall"), landscape("short"), landscape("next")];
        expect(ids(distributeToColumns(items, 2))).toEqual([["tall"], ["short", "next"]]);
    });

    it("treats items without dimensions as square", () => {
        const items: Item[] = [{ id: "unknown" }, landscape("wide"), landscape("next")];
        expect(ids(distributeToColumns(items, 2))).toEqual([["unknown"], ["wide", "next"]]);
    });

    it("starts columns at the given initial heights", () => {
        const items = ["a", "b"].map(landscape);
        expect(ids(distributeToColumns(items, 3, [1, 0, 0.5]))).toEqual([[], ["a"], ["b"]]);
    });

    it("returns empty columns for no items", () => {
        expect(distributeToColumns([], 2)).toEqual([[], []]);
    });
});
