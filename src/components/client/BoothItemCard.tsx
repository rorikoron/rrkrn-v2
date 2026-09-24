"use client";
import clsx from "clsx";
import {
    useEffect,
    useRef,
    useState,
    unstable_ViewTransition as ViewTransition,
} from "react";
import Image from "next/image";
import { useSetAtom } from "jotai";
import { boothNavAtom, itemCategoryAtom, ItemInterface } from "@/store/booth";
import Link from "next/link";
import BoothItem from "@/components/ui/BoothItem";
import { boothImageUrl, formatPriceRange } from "@/util";
import { Red_Hat_Mono } from "next/font/google";
const redHatMono = Red_Hat_Mono({ subsets: ["latin"] });

/** 関連アイテムは1行に収まる数だけ出す (PCは4つ、狭い画面では先頭2つ) */
const RELATED_LIMIT = 4;
const RELATED_LIMIT_NARROW = 2;

export default function BoothItemCard({
    item,
    others,
}: {
    item: ItemInterface;
    others: ItemInterface[];
}) {
    const setNav = useSetAtom(boothNavAtom);
    const setCategory = useSetAtom(itemCategoryAtom);
    const linkRef = useRef<HTMLAnchorElement>(null);
    const [thumbnailndex, setThumbnailIndex] = useState(0);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                linkRef.current?.click();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const related = others.slice(0, RELATED_LIMIT);

    return (
        <div className="h-full flex flex-col overflow-hidden text-foreground relative isolate p-2">
            {/* 最大化されたウィンドウの枠。一覧のカードと共有要素になっていて、
                クリックするとカードがこの大きさまで広がる (見た目はglobals.cssの.booth-card)。
                -z-10 で中身より下に描き、遷移中も画像・名前が枠の上を飛ぶようにする */}
            <ViewTransition name={"item-card-" + item.id} share="booth-card">
                <div
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-md border-2 border-active pointer-events-none"
                />
            </ViewTransition>

            {/* Back button */}
            <div className="shrink-0">
                <Link
                    ref={linkRef}
                    href={"/booth"}
                    onClick={() => setNav({ from: item.id, to: null })}
                    className="group inline-block h-[40px] aspect-square relative p-5 rounded-full hover:bg-primary transition-all"
                >
                    <Image
                        src="/svg/arrow-back.svg"
                        alt="back"
                        fill
                        className="p-2 command-foreground -translate-x-[5%]"
                    />
                </Link>
            </div>

            {/* 中身はページをスクロールさせず、上のカードが残りの高さを使い、関連アイテムは下に1行だけ置く */}
            <div className="flex-1 min-h-0 flex flex-col gap-3 md:gap-4 px-2 md:px-4 pb-2">
                {/* カード */}
                <figure className="@container flex-1 min-h-0 grid grid-rows-[auto_minmax(0,1fr)] md:grid-rows-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                    {/* 画像ビューア。画像はパネルの横幅いっぱい (PCでは残りの高さも) に広げ、
                        全体が見えるよう object-contain で置く。左右ボタンは画像の上に重ねる */}
                    <div className="bg-primary dot-grid-white min-h-0 flex flex-col gap-2 md:gap-3 p-3 md:p-4">
                        <div
                            className={`${redHatMono.className} hidden md:flex justify-between gap-4 text-[11px] tracking-wider text-foreground/70`}
                        >
                            <span className="shrink-0">
                                IMG {thumbnailndex + 1}/{item.pics.length}
                            </span>
                            <span className="truncate">
                                {item.pics[thumbnailndex]?.split("/").at(-1)}
                            </span>
                        </div>

                        <div className="relative w-full h-[30svh] md:h-auto md:flex-1 md:min-h-0">
                            <ViewTransition name={"item-picture-" + item.id}>
                                <div className="absolute inset-0">
                                    {item.pics[thumbnailndex] && (
                                        <Image
                                            src={boothImageUrl(
                                                item.pics[thumbnailndex]
                                            )}
                                            alt={item.name + "のサムネイル"}
                                            fill
                                            className="object-contain"
                                        />
                                    )}
                                </div>
                            </ViewTransition>

                            {/* left/right button */}
                            {item.pics.length > 1 &&
                                ([-1, 1] as const).map((step) => (
                                    <button
                                        key={step}
                                        aria-label={
                                            step < 0 ? "前の画像" : "次の画像"
                                        }
                                        className={clsx(
                                            "absolute top-1/2 -translate-y-1/2 size-9 md:size-10 grid place-items-center rounded-full cursor-pointer",
                                            "bg-surface/80 hover:bg-surface border-2 border-transparent hover:border-active transition-colors",
                                            step < 0 ? "left-2" : "right-2"
                                        )}
                                        onClick={() => {
                                            const l = item.pics.length;
                                            setThumbnailIndex(
                                                (p) => (p + l + step) % l
                                            );
                                        }}
                                    >
                                        <span
                                            className={clsx(
                                                "relative size-5",
                                                step > 0 && "-scale-x-100"
                                            )}
                                        >
                                            <Image
                                                src="/svg/arrow-left.svg"
                                                alt=""
                                                fill
                                                className="command-foreground"
                                            />
                                        </span>
                                    </button>
                                ))}
                        </div>

                        {/* サムネs。押すとその画像に切り替わる */}
                        <div className="shrink-0 h-12 md:h-16 flex gap-2 justify-center overflow-x-auto">
                            {item.pics.map((pic, i) => (
                                <button
                                    key={pic}
                                    aria-label={`${i + 1}枚目の画像`}
                                    onClick={() => setThumbnailIndex(i)}
                                    className={clsx(
                                        "h-full aspect-square relative shrink-0 border-2 transition-all cursor-pointer",
                                        i === thumbnailndex
                                            ? "border-active"
                                            : "border-transparent brightness-75 hover:brightness-100"
                                    )}
                                >
                                    <Image
                                        src={boothImageUrl(pic)}
                                        alt={"サムネイル" + pic}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 右の紹介欄文字。長い説明はここだけスクロールする */}
                    <div className="min-h-0 flex flex-col bg-surface px-5 md:px-8 py-3 md:py-8 relative overflow-hidden">
                        <ViewTransition name={"item-name-" + item.id}>
                            <figcaption className="text-2xl md:text-[clamp(1.5rem,4cqw,2.875rem)] leading-tight">
                                {item.name}
                            </figcaption>
                        </ViewTransition>
                        <figcaption className="text-xs mt-1">
                            Category: {item.category}
                        </figcaption>
                        <ViewTransition name={"item-price-" + item.id}>
                            <figcaption className="text-sm w-fit">
                                {formatPriceRange(
                                    item.price_min,
                                    item.price_max
                                )}
                            </figcaption>
                        </ViewTransition>
                        <figcaption className="flex-1 min-h-0 my-3 md:my-6 overflow-auto break-words">
                            <div className="tracking-widest">{item.notes}</div>
                        </figcaption>

                        <Link
                            href={"https://booth.pm/ja/items/" + item.id}
                            target="blank"
                            className="shrink-0 self-end border-active border-2 w-fit py-2 hover:bg-primary transition-all"
                        >
                            <div className="flex h-full px-5 gap-4">
                                <div className="h-full aspect-square relative">
                                    <Image
                                        src="/svg/booth.svg"
                                        alt="Booth"
                                        fill
                                    />
                                </div>
                                <div>Boothへ</div>
                            </div>
                        </Link>

                        {/* 装飾 */}
                        <span className="absolute bottom-[14%] -right-[10px] text-[40px] md:text-[62px] opacity-10 font-bold tracking-wider pointer-events-none">
                            {item.id}
                        </span>
                    </div>
                </figure>

                {/* 関連アイテム。高さ固定の1行 */}
                {related.length > 0 && (
                    <section className="shrink-0 flex flex-col gap-2">
                        <div
                            className={`${redHatMono.className} flex items-center justify-between gap-2 text-xs md:text-sm`}
                        >
                            <span className="truncate text-muted">
                                $ ls /booth --category={item.category}
                            </span>
                            <Link
                                href="/booth"
                                onClick={() => {
                                    setCategory(item.category);
                                    setNav({ from: item.id, to: null });
                                }}
                                className="shrink-0 px-2 rounded hover:bg-primary-soft/40 transition-colors"
                            >
                                more →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                            {related.map((other, i) => (
                                <BoothItem
                                    {...other}
                                    compact
                                    key={"item-" + other.id}
                                    className={
                                        i >= RELATED_LIMIT_NARROW
                                            ? "max-md:hidden"
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
