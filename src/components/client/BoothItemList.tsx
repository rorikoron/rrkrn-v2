"use client";
import { itemCategoryAtom, ItemInterface, parseCategoryHash } from "@/store/booth";
import { useAtom } from "jotai";
import { useLayoutEffect } from "react";
import BoothItem from "./BoothItem";

/** 一覧ページのアイテム一覧。選択中のカテゴリで絞り込む */
export default function BoothItemList({ data }: { data: ItemInterface[] }) {
    const [selectedCategory, setSelectedCategory] = useAtom(itemCategoryAtom);

    // URL のハッシュ (/booth#shader) からカテゴリを復元する。
    // クライアント遷移では、URL の書き換えはこのコミットの中で layout effect より先に済んでいるので、
    // 描画前に読めば前のページで選んでいたカテゴリが一瞬映ることはない
    useLayoutEffect(() => {
        const sync = () => setSelectedCategory(parseCategoryHash(location.hash));
        sync();
        window.addEventListener("hashchange", sync);
        return () => window.removeEventListener("hashchange", sync);
    }, [setSelectedCategory]);

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
