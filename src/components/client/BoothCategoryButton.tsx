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
                "px-5 py-1 rounded-xl transition-all ",
                selectedCaterogry !== category &&
                    "bg-accent/20   cursor-pointer hover:bg-accent/60",
                selectedCaterogry === category &&
                    "bg-foreground pointer-events-none"
            )}
            onClick={() => startTransition(() => setSelectedCategory(category))}
        >
            {category[0].toUpperCase() + category.slice(1)}
        </button>
    );
}
