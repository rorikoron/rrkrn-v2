"use client";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

interface PictureItemInterface {
    pngs: string[];
}

export default function PictureItem({ pngs }: PictureItemInterface) {
    const [index, setIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(true);

    // variable used to update. unit: msec
    const updateInterval = 2000;

    return (
        <div className="h-full flex flex-col justify-between py-6">
            <figure className="flex flex-col gap-8 px-6 ">
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
                <div>
                    <figcaption className="text-md">撮られた写真</figcaption>
                    <figcaption className="text-inactive text-sm">
                        撮った人: {pngs[index].split("/")[2].split(".")[0]}
                    </figcaption>
                </div>

                <div>
                    <div
                        key={index}
                        onAnimationEnd={() =>
                            setIndex((prev) => (prev + 1) % pngs.length)
                        }
                        className={clsx(
                            "w-full h-[4px] bg-inactive rounded gauge mb-2",
                            !isRunning && "pause-animation"
                        )}
                        style={
                            {
                                "--active-color": "var(--background)",
                                "--interval": `${updateInterval}ms`,
                            } as React.CSSProperties
                        }
                    />
                    <div className="flex justify-between text-xs text-inactive">
                        <span>0:00</span>
                        <span>{"0:0" + updateInterval / 1000}</span>
                    </div>
                </div>
            </figure>

            {/* buttons */}
            <div className="flex justify-around">
                {/* previous button */}
                <button
                    className="relative aspect-square rounded-full p-5 command-accent"
                    onClick={() =>
                        setIndex(
                            (prev) => (prev + pngs.length - 1) % pngs.length
                        )
                    }
                >
                    <Image
                        src={"skip-left.svg"}
                        alt="前の写真"
                        fill={true}
                        className="p-1"
                    />
                </button>

                {/* play/stop button */}
                <button
                    className="relative aspect-square rounded-full p-6 bg-accent command-foreground"
                    onClick={() => setIsRunning((prev) => !prev)}
                >
                    <Image
                        src={isRunning ? "/pause.svg" : "play.svg"}
                        alt="play"
                        fill={true}
                        className="p-2.5"
                    />
                </button>

                {/* next button */}
                <button
                    className="relative aspect-square rounded-full p-5 command-accent -scale-x-100"
                    onClick={() => setIndex((prev) => (prev + 1) % pngs.length)}
                >
                    <Image
                        src={"skip-left.svg"}
                        alt="次の写真"
                        fill={true}
                        className="p-1"
                    />
                </button>
            </div>
        </div>
    );
}
