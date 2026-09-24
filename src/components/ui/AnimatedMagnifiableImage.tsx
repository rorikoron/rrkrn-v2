"use client";
import { startTransition, ViewTransition, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import clsx from "clsx";

interface AnimatedMagnifiableImageInterface {
    src: string;
    // 分かっていれば渡す。読み込み前から枠の高さが決まるのでレイアウトがずれない
    width?: number;
    height?: number;
}
export default function AnimatedMagnifiableImage({
    src,
    width,
    height,
}: AnimatedMagnifiableImageInterface) {
    const filename = src.split("/").at(-1) ?? "Fetched image";
    const date = filename.split("_")[1]?.replaceAll("-", "/");
    const transitionName = "picture-animated-" + filename;
    const [isOpen, setIsOpen] = useState(false);

    // 同じ name の ViewTransition を「サムネイルから消して拡大表示に出す」ことで、
    // その場から画面中央へ写真が移動して大きくなるアニメーションになる
    const open = () => startTransition(() => setIsOpen(true));
    const close = () => startTransition(() => setIsOpen(false));

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") startTransition(() => setIsOpen(false));
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);

    return (
        <>
            <button
                type="button"
                onClick={open}
                aria-label={`${date ?? filename} の写真を拡大`}
                className="group h-fit relative overflow-hidden rounded-md cursor-zoom-in"
                // 拡大中もレーンの中の場所は空けたままにする
                style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
            >
                {!isOpen && (
                    <ViewTransition name={transitionName}>
                        <Image
                            src={src}
                            alt={filename}
                            placeholder="blur"
                            className="group-hover:brightness-60 transition-all w-full h-auto rounded-md"
                            blurDataURL="/loading.png"
                            width={width ?? 0}
                            height={height ?? 0}
                            // レーン幅くらい (PC は 4〜6 レーン、スマホは 2 レーン)
                            sizes="(min-width: 768px) 25vw, 50vw"
                            style={{
                                width: "100%",
                                height: "auto",
                            }}
                        />
                    </ViewTransition>
                )}
                <div
                    className={clsx(
                        "absolute bottom-0 right-0 py-0.5 px-2 text-accent invisible opacity-0 transition-all",
                        "group-hover:visible group-hover:opacity-100"
                    )}
                >
                    {date}
                </div>
            </button>

            {/* レーンのスクロール領域やヘッダーの重なり順に巻き込まれないよう body 直下に出す */}
            {isOpen &&
                createPortal(
                    <div
                        role="dialog"
                        aria-modal
                        aria-label={`${date ?? filename} の写真`}
                        onClick={close}
                        className="fixed inset-0 z-50 grid place-items-center p-4 md:p-10 bg-background/80 backdrop-blur-sm cursor-zoom-out"
                    >
                        <figure className="flex flex-col items-end gap-2">
                            <ViewTransition name={transitionName}>
                                <Image
                                    src={src}
                                    alt={filename}
                                    width={width ?? 1920}
                                    height={height ?? 1080}
                                    sizes="90vw"
                                    className="max-w-[90vw] max-h-[85dvh] w-auto h-auto object-contain rounded-md shadow-2xl"
                                />
                            </ViewTransition>
                            {date && <figcaption className="text-sm tracking-wider text-foreground">{date}</figcaption>}
                        </figure>
                    </div>,
                    document.body
                )}
        </>
    );
}
