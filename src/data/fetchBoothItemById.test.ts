import { d1Query } from "@/lib/d1-client";
import fetchBoothItemById from "./fetchBoothItemById";

jest.mock("../lib/d1-client", () => ({
    d1Query: jest.fn(),
}));

const mockedD1Query = d1Query as jest.MockedFunction<typeof d1Query>;

describe("fetchBoothItemById", () => {
    beforeEach(() => {
        mockedD1Query.mockReset();
    });

    it("returns the item joined with its images", async () => {
        mockedD1Query.mockImplementationOnce(async () => [
            {
                id: "item-1",
                name: "Shader A",
                notes: null,
                price_min: 500,
                price_max: 500,
                category: "shader",
            },
        ] as never);
        mockedD1Query.mockImplementationOnce(async () => [
            { r2_key: "item-1/a.png" },
            { r2_key: "item-1/b.png" },
        ] as never);

        const result = await fetchBoothItemById("item-1");

        expect(result).toEqual({
            id: "item-1",
            name: "Shader A",
            notes: "",
            category: "shader",
            price_min: 500,
            price_max: 500,
            pics: ["item-1/a.png", "item-1/b.png"],
        });
    });

    it("returns null when no item matches the id", async () => {
        mockedD1Query.mockImplementationOnce(async () => []);
        mockedD1Query.mockImplementationOnce(async () => []);

        const result = await fetchBoothItemById("missing-id");

        expect(result).toBeNull();
    });

    it("returns null and does not throw when the query fails", async () => {
        mockedD1Query.mockRejectedValueOnce(new Error("D1 unavailable"));

        const result = await fetchBoothItemById("item-1");

        expect(result).toBeNull();
    });
});
