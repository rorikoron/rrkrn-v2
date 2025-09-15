"use client";
import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";

interface HoverFlipButtonInterface {
    className?: string;
}
export default function HoverFlipButton({
    className,
}: HoverFlipButtonInterface) {
    const [isHover, setIsHover] = useState(false);
    return (
        <Link
            href="/about"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className={clsx(
                `${className} w-[220px] px-8 py-3.5 border-2 flex justify-between cursor-pointer overflow-hidden transition-all`,
                isHover && "bg-foreground border-accent",
                !isHover && " border-foreground"
            )}
        >
            <div>
                <span
                    className={clsx(
                        "absolute text-nowrap transition-all text-foreground",
                        isHover && "opacity-0",
                        !isHover && "opacity-100"
                    )}
                >
                    もっと詳しく？
                </span>
                <ViewTransition name="BashWindow-whoami">
                    <span
                        className={clsx(
                            "absolute text-nowrap transition-all text-accent",
                            isHover && "opacity-100",
                            !isHover && "opacity-0"
                        )}
                    >
                        $ whoami
                    </span>
                </ViewTransition>
            </div>

            <div
                className={clsx(
                    "h-lh aspect-square relative",
                    isHover && "command-accent",
                    !isHover && "command-foreground"
                )}
            >
                <Image
                    src={isHover ? "extend.svg" : "read-more.svg"}
                    alt="詳細"
                    className={clsx("transition-all", isHover && "ml-4")}
                    fill
                />
            </div>
        </Link>
    );
}
