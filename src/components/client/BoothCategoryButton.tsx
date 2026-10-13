"use client";
import { BoothItemType, boothListHref, itemCategoryAtom } from "@/store/booth";
import clsx from "clsx";
import { useAtom } from "jotai";
import { startTransition } from "react";

export default function BoothCategoryButton({
    category,
}: {
    category: BoothItemType;
}) {
    const [selectedCategory, setSelectedCategory] = useAtom(itemCategoryAtom);
    const isSelected = selectedCategory === category;
    return (
        <button
            type="button"
            aria-pressed={isSelected}
            className={clsx(
                "px-5 py-1 rounded-xl border-2 transition-all",
                !isSelected &&
                    "border-foreground/60 cursor-pointer hover:border-primary-strong hover:bg-primary-soft/40",
                isSelected &&
                    "border-primary-ink text-primary-ink pointer-events-none"
            )}
            onClick={() => {
                // View Transitionのオーバーレイはスクロール領域のクリップを無視するので、
                // スクロールしたままだと画面外のカードがh1やヘッダーの上に描かれてしまう。
                // 絞り込み後は先頭から見せたいので、遷移の前にスクロールを戻しておく
                document
                    .querySelectorAll("[data-booth-scroll]")
                    .forEach((el) => el.scrollTo({ top: 0 }));
                // 共有・再読み込みしても同じ絞り込みになるよう URL に残す。
                // 履歴は増やさない (戻るで絞り込みを一つずつ戻るのは煩わしいので)
                history.replaceState(history.state, "", boothListHref(category));
                startTransition(() => setSelectedCategory(category));
            }}
        >
            {category[0].toUpperCase() + category.slice(1)}
        </button>
    );
}
