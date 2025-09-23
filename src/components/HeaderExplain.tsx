"use client";

import { ExistLink, hoveredLinkAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";

const SelectExplanation = (link: ExistLink | "") => {
    switch (link) {
        case "home":
            return "ホーム画面です。\nなんの変哲もない。";
        case "about":
            return "自分語りゾーンです。";
        case "archive":
            return "フレンドとの写真。\nまたはフレンドの写真。";
        case "booth":
            return "Boothの商品一覧です。\nよかったら見てってね。";
        default:
            return "";
    }
};

export default function HeaderExplain() {
    const hoveredLink = useAtomValue(hoveredLinkAtom);
    return (
        <article className="text-sm pl-8">
            {SelectExplanation(hoveredLink)
                .split("\n")
                .filter((notEmpty) => notEmpty)
                .map((phrase) => (
                    <article key={phrase}>&gt; {phrase}</article>
                ))}
        </article>
    );
}
