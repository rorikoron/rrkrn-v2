"use client";
import { BoothItemType, itemCategoryAtom } from "@/store/booth";
import clsx from "clsx";
import { useAtom } from "jotai";
import { startTransition } from "react";

export default function BoothCategoryButton({
    category,
}: {
    category: BoothItemType | "all";
}) {
    const [selectedCaterogry, setSelectedCategory] = useAtom(itemCategoryAtom);
    return (
        <button
            key={category}
            className={clsx(
                "px-5 py-1 rounded-xl border-2 transition-all",
                selectedCaterogry !== category &&
                    "border-foreground/25 cursor-pointer hover:border-active hover:bg-primary-soft/40",
                selectedCaterogry === category &&
                    "border-active text-active pointer-events-none"
            )}
            onClick={() => {
                // View Transitionのオーバーレイはスクロール領域のクリップを無視するので、
                // スクロールしたままだと画面外のカードがh1やヘッダーの上に描かれてしまう。
                // 絞り込み後は先頭から見せたいので、遷移の前にスクロールを戻しておく
                document
                    .querySelectorAll("[data-booth-scroll]")
                    .forEach((el) => el.scrollTo({ top: 0 }));
                startTransition(() => setSelectedCategory(category));
            }}
        >
            {category[0].toUpperCase() + category.slice(1)}
        </button>
    );
}
