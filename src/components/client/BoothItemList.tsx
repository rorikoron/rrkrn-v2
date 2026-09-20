"use client";
import { itemCategoryAtom, ItemInterface } from "@/store/booth";
import { useAtom } from "jotai";
import BoothItem from "../ui/BoothItem";

export default function BoothItemList({
    data,
    filterByCategory = true,
}: {
    data: ItemInterface[];
    /** 一覧ページで選択中のカテゴリで絞り込むか（詳細ページの関連アイテムでは false） */
    filterByCategory?: boolean;
}) {
    const [selectedCategory] = useAtom(itemCategoryAtom);
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 overflow-y-auto">
            {data
                ?.filter(({ category }) =>
                    !filterByCategory || selectedCategory === "all"
                        ? true
                        : category === selectedCategory
                )
                ?.map((item) => (
                    <BoothItem {...item} key={"item-" + item.id} />
                ))}
        </div>
    );
}
