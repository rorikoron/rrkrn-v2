import fetchPics from "./fetchPics";

describe("fetchPics", () => {
    it("returns manifest entries matching the default image extensions", async () => {
        const result = await fetchPics("player");
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
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
