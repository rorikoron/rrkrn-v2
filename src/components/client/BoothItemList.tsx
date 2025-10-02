"use client";
import { boothAtom, itemCategoryAtom, ItemInterface } from "@/store/booth";
import { useAtom } from "jotai";
import BoothItem from "../ui/BoothItem";

export default function BoothItemList({ data }: { data: ItemInterface[] }) {
    const [selectedCategory] = useAtom(itemCategoryAtom);
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 overflow-y-auto">
            {data
                ?.filter(({ category }) =>
                    selectedCategory === "all"
                        ? true
                        : category === selectedCategory
                )
                ?.map((item) => (
                    <BoothItem {...item} key={"item-" + item.id} />
                ))}
        </div>
    );
}
