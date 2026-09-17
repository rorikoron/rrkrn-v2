import { d1Query } from "@/lib/d1-client";
import fetchBoothItems from "./fetchBoothItems";

jest.mock("../lib/d1-client", () => ({
    d1Query: jest.fn(),
}));

const mockedD1Query = d1Query as jest.MockedFunction<typeof d1Query>;

describe("fetchBoothItems", () => {
    beforeEach(() => {
        mockedD1Query.mockReset();
    });

    it("joins items with their images, grouped by item id", async () => {
        mockedD1Query.mockImplementationOnce(async () => [
            {
                id: "item-1",
                name: "Shader A",
                notes: null,
                price_min: 500,
                price_max: 500,
                category: "shader",
            },
            {
                id: "item-2",
                name: "Tool B",
                notes: "note",
                price_min: 0,
                price_max: 0,
                category: "tool",
            },
        ] as never);
        mockedD1Query.mockImplementationOnce(async () => [
            { item_id: "item-1", r2_key: "item-1/a.png" },
            { item_id: "item-1", r2_key: "item-1/b.png" },
            { item_id: "item-2", r2_key: "item-2/a.png" },
        ] as never);

        const result = await fetchBoothItems();

        expect(result).toEqual([
            {
                id: "item-1",
                name: "Shader A",
                notes: "",
                category: "shader",
                price_min: 500,
                price_max: 500,
                pics: ["item-1/a.png", "item-1/b.png"],
            },
            {
                id: "item-2",
                name: "Tool B",
                notes: "note",
                category: "tool",
                price_min: 0,
                price_max: 0,
                pics: ["item-2/a.png"],
            },
        ]);
    });

    it("gives an item an empty pics array when it has no images", async () => {
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
        mockedD1Query.mockImplementationOnce(async () => []);

        const result = await fetchBoothItems();

        expect(result[0].pics).toEqual([]);
    });

    it("returns an empty array and does not throw when the query fails", async () => {
        mockedD1Query.mockRejectedValueOnce(new Error("D1 unavailable"));

        const result = await fetchBoothItems();

        expect(result).toEqual([]);
    });
});
