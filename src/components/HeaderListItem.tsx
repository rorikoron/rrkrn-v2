"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useSetAtom } from "jotai";
import { hoveredLinkAtom, ExistLink, pathnameAtom } from "@/store/atoms";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function HeaderListitem({
    name,
    link,
}: Readonly<{
    name: ExistLink;
    link: string;
}>) {
    const [isHover, setIsHover] = useState(false);
    const setPrevPathname = useSetAtom(pathnameAtom);
    const setHoveredLink = useSetAtom(hoveredLinkAtom);
    const pathname = usePathname();

    useEffect(() => {
        if (isHover) setHoveredLink(name);
    }, [isHover]);

    return (
        <li
            key={name}
            className={clsx(
                "cursor-pointer transition-colors transition-all",
                isHover && "text-accent bg-gradient-to-r from-foreground-tint"
            )}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <Link
                href={link}
                onClick={() => setPrevPathname(pathname)}
                className={clsx(
                    "pl-8 py-1.5 block transform-gpu origin-left",
                    isHover && "scale-140 "
                )}
            >
                / {name}
            </Link>
        </li>
    );
}
