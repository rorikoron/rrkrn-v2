import clsx from "clsx";
import BashWindow from "../ui/BashWindow";
import Link from "next/link";
import { useState } from "react";
import { ExistLink, isHeaderOpenAtom } from "@/store/atoms";
import { usePathname } from "next/navigation";
import { useSetAtom } from "jotai";

const SelectExplanation = (link: ExistLink | "") => {
    switch (link) {
        case "":
        case "home":
            return "ホーム画面です。\nなんの変哲もない。";
        case "about":
            return "自分語りゾーンです。";
        case "archive":
            return "フレンドとの写真。\nまたはフレンドの写真。";
        case "booth":
            return "Boothの商品一覧です。\nよかったら見てってね。";
        default:
            return "このメッセージが　みれるのは　おかしいよ🍄\nみえたら　おしえてね";
    }
};
export interface LinksInterface {
    name: ExistLink;
    href: string;
}
export default function HeaderList({ links }: { links: LinksInterface[] }) {
    const [hoveredLink, setHoveredLink] = useState("");

    return (
        <div className="flex flex-col">
            <BashWindow command="cd" className="ml-8 mr-6 ">
                <ul className="flex flex-col text-xl text-inactive py-4 overflow-hidden">
                    {links.map(({ name, href }) => (
                        <li
                            key={name}
                            className={clsx(
                                "cursor-pointer transition-colors transition-all",

                                "hover:text-foregorund hover:bg-gradient-to-r from-background-sub-tint"
                            )}
                            onMouseEnter={() => setHoveredLink(name)}
                            onMouseLeave={() => setHoveredLink("")}
                        >
                            <Link
                                href={href}
                                className={clsx(
                                    "pl-8 py-1.5 block transform-gpu origin-left",
                                    "hover:scale-140 "
                                )}
                            >
                                / {name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </BashWindow>
            <BashWindow
                className="ml-16 -top-4 pr-2"
                command="cat"
                isCustomCommand
                title={<span className="-ml-2">&gt; Explain:</span>}
            >
                <article className="text-sm pl-8">
                    {SelectExplanation(hoveredLink as ExistLink)
                        .split("\n")
                        .filter((notEmpty) => notEmpty)
                        .map((phrase) => (
                            <article key={phrase}>&gt; {phrase}</article>
                        ))}
                </article>
            </BashWindow>
        </div>
    );
}
