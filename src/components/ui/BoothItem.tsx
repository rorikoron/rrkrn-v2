"use client";
import { boothNavAtom, BoothItemType, ItemInterface } from "@/store/booth";
import { boothImageUrl, formatPriceRange } from "@/util";
import clsx from "clsx";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ViewTransition } from "react";
import { Red_Hat_Mono } from "next/font/google";
const redHatMono = Red_Hat_Mono({ subsets: ["latin"] });

// 商品名の下線の色。Tailwindが拾えるようにクラス名は丸ごと書く
const categoryLineClass: Record<BoothItemType, string> = {
    all: "after:bg-primary",
    cloth: "after:bg-category-cloth",
    accessory: "after:bg-category-accessory",
    software: "after:bg-category-software",
    shader: "after:bg-category-shader",
    goods: "after:bg-category-goods",
};

interface BoothItemProps extends ItemInterface {
    /** 詳細ページの関連アイテム用。サムネイルを左に置いた横長の小さいカードにする */
    compact?: boolean;
    className?: string;
}

export default function BoothItem({
    id,
    name,
    pics,
    category,
    price_min,
    price_max,
    compact = false,
    className,
}: BoothItemProps) {
    const thumbnail = pics?.[0];
    const params = useParams<{ id?: string }>();
    const [nav, setNav] = useAtom(boothNavAtom);

    // 一覧/詳細の両方に居るアイテムは同名でペアになり、位置だけ動く。
    // 遷移元/遷移先のアイテムはサイズも変わるので、専用のクラスで扱う
    const share = nav.from === id || nav.to === id ? "booth-card" : "booth-item";
    // カードの中の画像・名前・値段。booth-card はウィンドウ枠の見た目 (枠線・スナップショット非表示) を持つので、
    // 中身には付けず、動きのタイミングだけ揃えた別のクラスにする
    const partShare = share === "booth-card" ? "booth-card-part" : "booth-item";

    return (
        <ViewTransition
            name={"item-card-" + id}
            share={share}
            enter="none"
            exit="none"
        >
            <Link
                href={"/booth/" + id}
                // 一覧のカードを全部先読みすると Worker へのリクエストが同時に飛び、
                // Workers Free の CPU 上限 (10ms) で落ちるので切っておく
                prefetch={false}
                onClick={() => setNav({ from: params.id ?? null, to: id })}
                className={clsx(
                    "group w-full flex text-foreground z-5 rounded-md transition-colors cursor-pointer",
                    "border-2 border-primary/60 hover:border-active hover:bg-primary-soft/40",
                    compact
                        ? "items-center gap-2 md:gap-3 p-1.5"
                        : "flex-col p-2 md:p-3",
                    className
                )}
            >
                {/* パスは画像の共有要素の外に置き、詳細への遷移アニメーションには乗せない */}
                <div
                    className={clsx(
                        "relative overflow-hidden",
                        compact && "w-14 md:w-16 shrink-0"
                    )}
                >
                    <ViewTransition name={"item-picture-" + id} share={partShare}>
                        <div className={clsx("aspect-square relative")}>
                            {thumbnail && (
                                <Image
                                    src={boothImageUrl(thumbnail)}
                                    alt={name + "のサムネイル"}
                                    fill
                                    objectFit="cover"
                                    unoptimized
                                />
                            )}
                        </div>
                    </ViewTransition>
                    {/* 移動先のパス。ホバーで画像の下から迫り上がる */}
                    {!compact && (
                        <div
                            aria-hidden
                            className={clsx(
                                `${redHatMono.className} absolute inset-x-0 bottom-0 px-2 py-1 text-xs truncate bg-foreground text-surface`,
                                "before:content-['$cd_']",
                                "translate-y-full group-hover:translate-y-0 transition-transform duration-200"
                            )}
                        >
                            /booth/{id}
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                    <ViewTransition name={"item-name-" + id} share={partShare}>
                        <div
                            className={clsx(
                                "font-bold",
                                "after:block after:w-6 after:h-[3px] after:rounded-full",
                                compact
                                    ? "text-sm after:mt-1"
                                    : "mx-1 mt-3 md:text-lg after:mt-2",
                                categoryLineClass[category]
                            )}
                        >
                            {/* line-clampだと::afterまで切り取られるので内側で省略する */}
                            <span className="line-clamp-1">{name}</span>
                        </div>
                    </ViewTransition>
                    <ViewTransition name={"item-price-" + id} share={partShare}>
                        <span
                            className={clsx(
                                "self-end rounded block text-right",
                                compact ? "mt-1 text-xs" : "mt-3 py-1 text-sm"
                            )}
                        >
                            {formatPriceRange(price_min, price_max)}
                        </span>
                    </ViewTransition>
                </div>
            </Link>
        </ViewTransition>
    );
}
