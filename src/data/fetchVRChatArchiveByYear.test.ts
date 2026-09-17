import { getArchiveBucket } from "@/lib/r2-client";
import fetchVRChatArchiveByYear from "./fetchVRChatArchiveByYear";

jest.mock("../lib/r2-client", () => ({
    getArchiveBucket: jest.fn(),
}));

const mockedGetArchiveBucket = getArchiveBucket as jest.MockedFunction<
    typeof getArchiveBucket
>;

describe("fetchVRChatArchiveByYear", () => {
    beforeEach(() => {
        mockedGetArchiveBucket.mockReset();
    });

    it("lists objects under the year prefix as public archive URLs", async () => {
        const list = jest.fn().mockResolvedValue({
            objects: [
                { key: "2023/photo_2023-01-01.png" },
                { key: "2023/photo_2023-06-15.png" },
            ],
        });
        mockedGetArchiveBucket.mockResolvedValue({ list } as never);

        const result = await fetchVRChatArchiveByYear({ year: 2023 });

        expect(list).toHaveBeenCalledWith({ prefix: "2023/" });
        expect(result).toEqual([
            "https://archive.rorikoron.net/2023/photo_2023-01-01.png",
            "https://archive.rorikoron.net/2023/photo_2023-06-15.png",
        ]);
    });

    it("returns an empty array and does not throw when the bucket call fails", async () => {
        mockedGetArchiveBucket.mockRejectedValue(new Error("R2 unavailable"));

        const result = await fetchVRChatArchiveByYear({ year: 2023 });

        expect(result).toEqual([]);
    });
});
