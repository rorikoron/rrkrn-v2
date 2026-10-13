"use client";
import clsx from "clsx";
import BashWindow from "@/components/ui/BashWindow";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ExistLink } from "@/store/atoms";

const explanations: Record<ExistLink, string> = {
    home: "ホーム画面です。\nなんの変哲もない。",
    about: "自分語りゾーンです。",
    archive: "フレンドとの写真。\nまたはフレンドの写真。",
    booth: "Boothの商品一覧です。\nよかったら見てってね。",
};
const UNKNOWN_EXPLANATION = "このメッセージが　みれるのは　おかしいよ🍄\nみえたら　おしえてね";

export interface LinksInterface {
    name: ExistLink;
    href: string;
}

/** 今のパスがどのリンクの下にあるか。/booth/123 は booth */
function findCurrentLink(links: LinksInterface[], pathname: string) {
    return links.find(({ href }) =>
        href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/")
    );
}

export default function HeaderList({ links }: { links: LinksInterface[] }) {
    const pathname = usePathname();
    const [hoveredLink, setHoveredLink] = useState<ExistLink | null>(null);
    const current = findCurrentLink(links, pathname);

    // ホバー (またはフォーカス) 中のリンク先の説明。なければ今いるページの説明
    const explained = hoveredLink ?? current?.name;
    const explanation = explained ? explanations[explained] : UNKNOWN_EXPLANATION;

    return (
        <div className="flex flex-col">
            <BashWindow command="cd" className="ml-8 mr-6 ">
                <nav aria-label="サイト内">
                    <ul className="flex flex-col text-xl text-muted py-4 overflow-hidden">
                        {links.map(({ name, href }) => {
                            const isCurrent = current?.name === name;
                            return (
                                <li
                                    key={name}
                                    className={clsx(
                                        "cursor-pointer transition-all",
                                        "hover:text-foreground hover:bg-linear-to-r from-primary-soft",
                                        isCurrent && "text-foreground bg-linear-to-r"
                                    )}
                                    onMouseEnter={() => setHoveredLink(name)}
                                    onMouseLeave={() => setHoveredLink(null)}
                                >
                                    <Link
                                        href={href}
                                        aria-current={isCurrent ? "page" : undefined}
                                        onFocus={() => setHoveredLink(name)}
                                        onBlur={() => setHoveredLink(null)}
                                        className={clsx(
                                            "pl-8 py-1.5 block transform-gpu origin-left",
                                            "hover:scale-140",
                                            isCurrent && "font-bold"
                                        )}
                                    >
                                        <span className="pr-1">/</span>
                                        {name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </BashWindow>
            <BashWindow
                className="ml-16 -top-4 pr-2 mr-8"
                command="cat"
                isCustomCommand
                title={<span>&gt; Explain:</span>}
            >
                <div className="text-sm pt-2">
                    {explanation
                        .split("\n")
                        .filter((notEmpty) => notEmpty)
                        .map((phrase) => (
                            <p key={phrase}>&gt; {phrase}</p>
                        ))}
                </div>
            </BashWindow>
        </div>
    );
}
