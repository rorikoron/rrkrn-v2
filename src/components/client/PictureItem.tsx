"use client";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Zen_Kaku_Gothic_Antique } from "next/font/google";
import "@/app/styles/component/player.scss";
import Link from "next/link";

// variable used to update. unit: msec
const updateInterval = 2000;
const zenkaku = Zen_Kaku_Gothic_Antique({
    subsets: ["latin"],
    weight: "500",
});

interface PictureItemInterface {
    pngs: string[];
}

export default function PictureItem({ pngs }: PictureItemInterface) {
    const [index, setIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const [isMinify, setIsMinify] = useState(false);
    const [hasShownMini, setHasShownMini] = useState(false);

    useEffect(() => {
        setHasShownMini((prev) => prev || isMinify);
    }, [isMinify]);

    return (
        <>
            <div
                className={clsx(
                    "border-foreground fixed bottom-[10px] right-[8px] md:right-[36px] transition-all z-11",
                    isMinify && "translate-y-[85%]"
                )}
            >
                {/* spotify ui zone */}
                <div
                    className={clsx(
                        `text-accent h-[60lvh] md:h-[68lvh] aspect-9/16 flex flex-col gap-6 rounded-xl ${zenkaku.className}`,
                        "bg-gradient-to-b from-foreground-tint to-foreground",
                        "bg-background/30 bg-blend-multiply"
                    )}
                >
                    <div className="h-full flex flex-col justify-between py-4">
                        <div className="px-6 my-2 flex justify-between">
                            <button
                                className={clsx(
                                    "transition-all h-[16px] aspect-square relative p-4 rounded-full",
                                    "hover:bg-accent/20"
                                )}
                                onClick={() => setIsMinify((prev) => !prev)}
                            >
                                <Image
                                    src="svg/arrow-left.svg"
                                    className={clsx(
                                        "command-accent p-2 transition-all",
                                        isMinify && "rotate-90",
                                        !isMinify && "rotate-270"
                                    )}
                                    alt="back"
                                    fill
                                />
                            </button>
                            <span>フレンド写真集</span>
                        </div>
                        <figure className="flex flex-col gap-2 md:gap-6 px-4 md:px-6 ">
                            <div className="w-full aspect-square relative rounded-sm overflow-hidden ">
                                <Image
                                    src={pngs[index]}
                                    alt="Test"
                                    fill={true}
                                    objectFit="cover"
                                    placeholder="blur"
                                    blurDataURL="/file.png"
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <figcaption className="text-md">
                                        撮られた写真({index + 1}/{pngs.length})
                                    </figcaption>
                                    <figcaption className="text-inactive text-sm">
                                        撮った人:{" "}
                                        {
                                            pngs[index]
                                                .split("/")[2]
                                                .split(".")[0]
                                        }
                                    </figcaption>
                                </div>

                                <Link
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href={
                                        "http://twitter.com/share?url=https://rorikoron.net/&text=ろりころんのホームページです！！！&via=rorikoron"
                                    }
                                >
                                    <button
                                        className={clsx(
                                            "transition-all h-full aspect-square relative -mr-2 p-2 rounded-full flex justify-center",
                                            "hover:bg-accent/20"
                                        )}
                                    >
                                        <Image
                                            src="svg/share.svg"
                                            alt="共有"
                                            width="20"
                                            height="20"
                                            className=" command-accent"
                                        />
                                    </button>
                                </Link>
                            </div>

                            <div>
                                <div
                                    key={index}
                                    onAnimationEnd={() =>
                                        setIndex(
                                            (prev) => (prev + 1) % pngs.length
                                        )
                                    }
                                    className={clsx(
                                        "w-full h-[4px] bg-inactive rounded gauge mb-2",
                                        !isRunning && "pause-animation"
                                    )}
                                    style={
                                        {
                                            "--active-color":
                                                "var(--background)",
                                            "--interval": `${updateInterval}ms`,
                                        } as React.CSSProperties
                                    }
                                />
                                <div className="flex justify-between text-xs text-accent/80">
                                    <span>0:00</span>
                                    <span>{"0:0" + updateInterval / 1000}</span>
                                </div>
                            </div>
                        </figure>

                        {/* buttons */}
                        <div className="flex justify-around">
                            {/* previous button */}

                            <button
                                className={clsx(
                                    "transition-all h-full aspect-square relative p-4 rounded-full",
                                    "hover:bg-accent/20"
                                )}
                                onClick={() =>
                                    setIndex(
                                        (prev) =>
                                            (prev + pngs.length - 1) %
                                            pngs.length
                                    )
                                }
                            >
                                <Image
                                    src={"svg/skip-left.svg"}
                                    alt="前の写真"
                                    fill={true}
                                    className="p-2 command-accent"
                                />
                            </button>

                            {/* play/stop button */}
                            <button
                                className="relative aspect-square rounded-full p-6 bg-accent"
                                onClick={() => setIsRunning((prev) => !prev)}
                            >
                                <Image
                                    src={
                                        isRunning
                                            ? "svg/pause.svg"
                                            : "svg/play.svg"
                                    }
                                    alt="play"
                                    fill={true}
                                    className="p-2.5 command-foreground"
                                />
                            </button>

                            {/* next button */}
                            <button
                                className={clsx(
                                    "transition-all h-full aspect-square relative  p-4 -scale-x-100 rounded-full",
                                    "hover:bg-accent/20"
                                )}
                                onClick={() =>
                                    setIndex((prev) => (prev + 1) % pngs.length)
                                }
                            >
                                <Image
                                    src={"svg/skip-left.svg"}
                                    alt="次の写真"
                                    fill={true}
                                    className="p-2 command-accent"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={clsx(
                    "fixed translate-x-[50%] w-[calc(68lvh*9/16*0.7)] aspect-square z-1 transition-all",
                    "right-[calc(36px+60lvh*9/16*0.5)] bottom-[calc(10px+60lvh*0.15-40px)]",
                    "md:right-[calc(36px+68lvh*9/16*0.5)] md:bottom-[calc(10px+68lvh*0.15-40px)]"
                )}
            >
                <Image
                    className={clsx(
                        "minikoron",
                        hasShownMini && "minikoron-hide"
                    )}
                    src="/found.png"
                    alt="みにころん"
                    fill
                />
            </div>
        </>
    );
}
