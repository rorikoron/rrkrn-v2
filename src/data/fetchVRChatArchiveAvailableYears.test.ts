import { getArchiveBucket } from "@/lib/r2-client";
import { fetchVRChatArchiveAvailableYears } from "./fetchVRChatArchiveAvailableYears";

jest.mock("../lib/r2-client", () => ({
    getArchiveBucket: jest.fn(),
}));

const mockedGetArchiveBucket = getArchiveBucket as jest.MockedFunction<
    typeof getArchiveBucket
>;

describe("fetchVRChatArchiveAvailableYears", () => {
    beforeEach(() => {
        mockedGetArchiveBucket.mockReset();
    });

    it("strips the trailing slash from each delimited prefix", async () => {
        const list = jest.fn().mockResolvedValue({
            delimitedPrefixes: ["2022/", "2023/"],
        });
        mockedGetArchiveBucket.mockResolvedValue({ list } as never);

        const result = await fetchVRChatArchiveAvailableYears();

        expect(list).toHaveBeenCalledWith({ delimiter: "/" });
        expect(result).toEqual(["2022", "2023"]);
    });

    it("filters out empty prefixes", async () => {
        const list = jest.fn().mockResolvedValue({
            delimitedPrefixes: ["", "2023/"],
        });
        mockedGetArchiveBucket.mockResolvedValue({ list } as never);

        const result = await fetchVRChatArchiveAvailableYears();

        expect(result).toEqual(["2023"]);
    });

    it("returns an empty array and does not throw when the bucket call fails", async () => {
        mockedGetArchiveBucket.mockRejectedValue(new Error("R2 unavailable"));

        const result = await fetchVRChatArchiveAvailableYears();

        expect(result).toEqual([]);
    });
});
