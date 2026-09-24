import { getArchiveBucket } from "@/lib/r2-client";
import fetchVRChatArchiveByYear, { parseSizeFromKey } from "./fetchVRChatArchiveByYear";

jest.mock("../lib/r2-client", () => ({
    getArchiveBucket: jest.fn(),
}));

const mockedGetArchiveBucket = getArchiveBucket as jest.MockedFunction<typeof getArchiveBucket>;

describe("parseSizeFromKey", () => {
    it("reads the size from the end of the file name", () => {
        expect(parseSizeFromKey("2025/VRChat_2025-03-21_23-59-01.997_1200x1200.webp")).toEqual({
            width: 1200,
            height: 1200,
        });
    });

    it("returns null when the name has no size", () => {
        expect(parseSizeFromKey("2025/photo.webp")).toBeNull();
    });
});

describe("fetchVRChatArchiveByYear", () => {
    it("uses the size in the file name without reading the image", async () => {
        const get = jest.fn();
        mockedGetArchiveBucket.mockResolvedValue({
            list: async () => ({ objects: [{ key: "2024/VRChat_2024-01-01_13-28-40.757_608x1080.webp" }] }),
            get,
        } as unknown as R2Bucket);

        expect(await fetchVRChatArchiveByYear({ year: 2024 })).toEqual([
            {
                src: "https://archive.rorikoron.net/2024/VRChat_2024-01-01_13-28-40.757_608x1080.webp",
                width: 608,
                height: 1080,
            },
        ]);
        expect(get).not.toHaveBeenCalled();
    });
});
