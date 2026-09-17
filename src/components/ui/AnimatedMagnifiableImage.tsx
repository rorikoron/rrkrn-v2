"use client";
import { unstable_ViewTransition as ViewTransition } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useEffect, useState } from "react";

interface AnimatedMagnifiableImageInterface {
    src: string;
}
export default function AnimatedMagnifiableImage({
    src,
}: AnimatedMagnifiableImageInterface) {
    const filename = src.split("/").at(-1) ?? "Fetched image";
    const dateLabel = filename.split("_")[1]?.replaceAll("-", "/");
    const [isMagnified, setIsMagnified] = useState(false);

    useEffect(() => {
        if (!isMagnified) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsMagnified(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMagnified]);

    return (
        <>
            <ViewTransition name={"picture-animated-" + filename}>
                <button
                    type="button"
                    key={src}
                    onClick={() => setIsMagnified(true)}
                    aria-label={`${filename}を拡大表示`}
                    className="group block h-fit w-full relative rounded overflow-hidden cursor-zoom-in text-left appearance-none border-0 bg-transparent p-0 m-0"
                >
                    <Image
                        src={src}
                        alt={filename}
                        objectFit="cover"
                        placeholder="blur"
                        className="group-hover:brightness-60 group-hover:scale-105 transition-all w-full h-auto "
                        blurDataURL="/loading.png"
                        width={0}
                        height={0}
                        sizes="100%"
                        style={{
                            width: "100%",
                            height: "auto",
                        }}
                    />
                    {dateLabel && (
                        <div
                            className={clsx(
                                "absolute bottom-0 right-0 py-0.5 px-2 text-accent invisible opacity-0 transition-all",
                                "group-hover:visible group-hover:opacity-100"
                            )}
                        >
                            {dateLabel}
                        </div>
                    )}
                </button>
            </ViewTransition>

            {isMagnified && (
                <div
                    role="dialog"
                    aria-modal
                    onClick={() => setIsMagnified(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-6 cursor-zoom-out animate-magnify-fade-in"
                >
                    <div className="relative w-full h-full max-w-4xl max-h-[85vh] animate-magnify-in">
                        <Image
                            src={src}
                            alt={filename}
                            fill
                            objectFit="contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
