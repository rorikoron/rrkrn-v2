"use client";
import { itemCategoryAtom, ItemInterface } from "@/store/booth";
import { useAtom } from "jotai";
import BoothItem from "../ui/BoothItem";

/** 一覧ページのアイテム一覧。選択中のカテゴリで絞り込む */
export default function BoothItemList({ data }: { data: ItemInterface[] }) {
    const [selectedCategory] = useAtom(itemCategoryAtom);

    const items = (data ?? []).filter(({ category }) =>
        selectedCategory === "all" ? true : category === selectedCategory
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 overflow-y-auto gap-3 md:gap-4">
            {items.map((item) => (
                <BoothItem {...item} key={"item-" + item.id} />
            ))}
        </div>
    );
}
