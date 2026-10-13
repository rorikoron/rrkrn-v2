"use client";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import "@/app/styles/component/player.scss";
import "@/app/styles/component/minikoron.scss";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { PLACEHOLDER_BLUR_DATA_URL } from "@/util";

// variable used to update. unit: msec
const updateInterval = 2000;

// 共有ボタンから開く X の投稿画面。via はサイトのアカウント
const SHARE_URL =
    "https://x.com/intent/tweet?" +
    new URLSearchParams({
        url: "https://rorikoron.net/",
        text: "ろりころんのホームページです！！！",
        via: "rorikoron",
    });

interface PictureItemInterface {
    pngs: string[];
}

/** "/player/雨空ゆる.webp" → "雨空ゆる" */
function photographerOf(src: string) {
    return decodeURIComponent(src.split("/").at(-1) ?? "").replace(/\.\w+$/, "");
}

export default function PictureItem({ pngs }: PictureItemInterface) {
    const [index, setIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const [isMinify, setIsMinify] = useState(false);
    const [hasShownMini, setHasShownMini] = useState(false);

    const toggleMinify = () => {
        const next = !isMinify;
        setIsMinify(next);
        if (next) setHasShownMini(true);
    };

    const photographer = photographerOf(pngs[index]);

    return (
        <>
            <section
                aria-label="フレンド写真集"
                className={clsx(
                    "fixed bottom-[10px] right-[8px] md:right-[36px] transition-all z-11",
                    isMinify && "translate-y-[85%]"
                )}
            >
                {/* spotify ui zone */}
                <div
                    className={clsx(
                        `text-foreground font-medium w-[230px] md:w-[260px] aspect-9/16 flex flex-col gap-6 rounded-xl`,
                        "bg-linear-to-b from-background to-surface",
                        "bg-background/80 bg-blend-multiply"
                    )}
                >
                    <div className="h-fit flex flex-col justify-between py-4">
                        <div className="px-6 my-2 flex justify-between items-center">
                            {/* 最小化ボタン */}
                            <button
                                type="button"
                                aria-label={isMinify ? "プレイヤーを広げる" : "プレイヤーをたたむ"}
                                aria-expanded={!isMinify}
                                className={clsx(
                                    "transition-all -translate-x-[50%] h-[16px] aspect-square relative p-4 rounded-full",
                                    "hover:bg-primary-wash/20"
                                )}
                                onClick={toggleMinify}
                            >
                                <Icon
                                    name="arrow-left"
                                    className={clsx(
                                        "absolute inset-0 p-2 transition-all",
                                        isMinify && "rotate-90",
                                        !isMinify && "rotate-270"
                                    )}
                                />
                            </button>
                            <span>フレンド写真集</span>
                        </div>
                        <figure className="flex flex-col gap-3 md:gap-6 px-4 md:px-6 ">
                            <div className="aspect-square relative rounded-sm overflow-hidden ">
                                <Image
                                    src={pngs[index]}
                                    // public/ の画像は圧縮済みの webp。/_next/image を通すと Worker の CPU を食うので素通しにする
                                    unoptimized
                                    alt={`${photographer}さんが撮ってくれた、ろりころんの写真`}
                                    fill
                                    className="object-cover"
                                    placeholder="blur"
                                    blurDataURL={PLACEHOLDER_BLUR_DATA_URL}
                                />
                            </div>
                            <div className="flex justify-between">
                                <figcaption>
                                    <p className="text-nowrap break-keep">
                                        撮られた写真({index + 1}/{pngs.length})
                                    </p>
                                    <p className="text-muted text-sm text-nowrap break-keep">
                                        撮った人: {photographer}
                                    </p>
                                </figcaption>

                                <Link
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href={SHARE_URL}
                                    aria-label="X でこのサイトを共有"
                                    className={clsx(
                                        "transition-all h-full aspect-square relative -mr-2 p-2 rounded-full flex justify-center",
                                        "hover:bg-primary-wash/20"
                                    )}
                                >
                                    <Icon name="share" className="size-5" />
                                </Link>
                            </div>

                            <div>
                                <div
                                    key={index}
                                    aria-hidden
                                    onAnimationEnd={() =>
                                        setIndex(
                                            (prev) => (prev + 1) % pngs.length
                                        )
                                    }
                                    className={clsx(
                                        "w-full h-[4px] bg-muted rounded gauge mb-2",
                                        !isRunning && "pause-animation"
                                    )}
                                    style={
                                        {
                                            "--active-color":
                                                "var(--primary)",
                                            "--interval": `${updateInterval}ms`,
                                        } as React.CSSProperties
                                    }
                                />
                                <div
                                    aria-hidden
                                    className="flex justify-between text-xs text-foreground/80"
                                >
                                    <span>0:00</span>
                                    <span>{"0:0" + updateInterval / 1000}</span>
                                </div>
                            </div>
                        </figure>

                        {/* buttons */}
                        <div className="flex justify-around h-fit">
                            {/* previous button */}
                            <button
                                type="button"
                                aria-label="前の写真"
                                className={clsx(
                                    "transition-all h-full aspect-square relative p-4 rounded-full",
                                    "hover:bg-primary-wash/20"
                                )}
                                onClick={() =>
                                    setIndex(
                                        (prev) =>
                                            (prev + pngs.length - 1) %
                                            pngs.length
                                    )
                                }
                            >
                                <Icon
                                    name="skip-left"
                                    className="absolute inset-0 p-2"
                                />
                            </button>

                            {/* play/stop button */}
                            <button
                                type="button"
                                aria-label={isRunning ? "スライドショーを止める" : "スライドショーを再生"}
                                className="relative aspect-square rounded-full p-6 bg-foreground text-surface"
                                onClick={() => setIsRunning((prev) => !prev)}
                            >
                                <Icon
                                    name={isRunning ? "pause" : "play"}
                                    className="absolute inset-0 p-2.5"
                                />
                            </button>

                            {/* next button */}
                            <button
                                type="button"
                                aria-label="次の写真"
                                className={clsx(
                                    "transition-all h-full aspect-square relative p-4 -scale-x-100 rounded-full",
                                    "hover:bg-primary-wash/20"
                                )}
                                onClick={() =>
                                    setIndex((prev) => (prev + 1) % pngs.length)
                                }
                            >
                                <Icon
                                    name="skip-left"
                                    className="absolute inset-0 p-2"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div
                aria-hidden
                className={clsx(
                    "fixed translate-x-[50%] w-[calc(230px*0.7)] md:w-[calc(260px*0.7)] aspect-square z-1 transition-all",
                    "right-[calc(8px+230px*0.5)] bottom-[calc(10px+230px*16/9*0.15-30px)]",
                    "md:right-[calc(36px+260px*0.5)] md:bottom-[calc(10px+260px*16/9*0.15-30px)]"
                )}
            >
                <Image
                    className={clsx(
                        "minikoron",
                        hasShownMini && "minikoron-hide"
                    )}
                    src="/minikoron/shocked.png"
                    unoptimized
                    alt=""
                    fill
                />

                <Image
                    className={clsx(
                        "minikoron-second",
                        hasShownMini && "minikoron-hide"
                    )}
                    src="/minikoron/embarrassed.png"
                    unoptimized
                    alt=""
                    fill
                />
            </div>
        </>
    );
}
