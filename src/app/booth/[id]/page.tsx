"use client";
import clsx from "clsx";
import {
    useEffect,
    useRef,
    useState,
    unstable_ViewTransition as ViewTransition,
} from "react";
import Image from "next/image";
import { useAtom, useAtomValue } from "jotai";
import { boothAtom, itemCategoryAtom, ItemInterface } from "@/store/booth";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createGunzip } from "zlib";
import BoothItem from "@/components/ui/BoothItem";

// export const revalidate = false;

export default function BoothItemCard() {
    const { id } = useParams();
    const [{ data }] = useAtom(boothAtom);
    const category = useAtomValue(itemCategoryAtom);
    const item = data.find((item) => item.id === id) as ItemInterface;
    const linkRef = useRef<HTMLAnchorElement>(null);
    const [thumbnailndex, setThumbnailIndex] = useState(0);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                linkRef.current?.click();
            }
        };
        console.log(item);

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    return (
        <div className="h-full grid grid-rows-[auto_1fr] overflow-y-auto">
            {/* Back button */}
            <div>
                <Link
                    ref={linkRef}
                    href={"/booth"}
                    className="group inline-block h-[40px] aspect-square relative p-5 rounded-full hover:bg-foreground-tint transition-all"
                >
                    <Image
                        src="/svg/arrow-left.svg"
                        alt="back"
                        fill
                        className="p-2 command-accent -translate-x-[5%]"
                    />
                </Link>
            </div>

            <div className="size-full px-4 py-2 flex flex-col overflow-y-auto">
                {/* カード */}
                <ViewTransition name={"item-card-" + id}>
                    <figure className="grid sm:grid-cols-[300px_1fr] lg:grid-cols-[auto_1fr] grid-rows-[auto_1fr] justify-between">
                        {/* 画像 */}
                        <div className="bg-foreground-tint grid grid-rows-[auto_46px] gap-4 px-10 pt-6 pb-3">
                            <ViewTransition name={"item-picture-" + item.id}>
                                <div
                                    className={clsx(
                                        "w-full bg-accent aspect-square relative"
                                    )}
                                >
                                    <Image
                                        src={
                                            item.pics[thumbnailndex].thumbnails
                                                .large.url
                                        }
                                        alt={item.name + "のサムネイル"}
                                        fill
                                        objectFit="cover"
                                    />

                                    {/* left/right button */}
                                    <div className="absolute p-2 top-[50%] left-0 -translate-y-[50%] -translate-x-full cursor-pointer">
                                        <button
                                            className="h-[32px] aspect-square relative cursor-pointer "
                                            onClick={() => {
                                                const l = item.pics.length;
                                                setThumbnailIndex(
                                                    (p) => (p + l - 1) % l
                                                );
                                            }}
                                        >
                                            <Image
                                                src="/svg/arrow-left.svg"
                                                alt="Left Button"
                                                fill
                                                className="command-accent"
                                            />
                                        </button>
                                    </div>
                                    <div className="absolute p-2 top-[50%] right-0 -translate-y-[50%] translate-x-full -scale-x-100 cursor-pointer">
                                        <button
                                            className="h-[32px] aspect-square relative cursor-pointer"
                                            onClick={() => {
                                                const l = item.pics.length;
                                                setThumbnailIndex(
                                                    (p) => (p + 1) % l
                                                );
                                            }}
                                        >
                                            <Image
                                                src="/svg/arrow-left.svg"
                                                alt="Left Button"
                                                fill
                                                className="command-accent"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </ViewTransition>

                            {/* サムネs */}
                            <div className="h-full flex gap-2 justify-center">
                                {item.pics.map((pic, i) => (
                                    <div
                                        className={clsx(
                                            "h-full aspect-square relative transition-all",
                                            i !== thumbnailndex &&
                                                "brightness-50"
                                        )}
                                        key={pic?.filename}
                                    >
                                        <Image
                                            src={pic?.thumbnails.small.url}
                                            alt={"サムネイル" + pic?.filename}
                                            fill
                                            objectFit="cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* 右の紹介欄文字 */}
                        <div className="w-full flex flex-col bg-foreground py-3 lg:py-14 px-8 relative overflow-hidden">
                            <ViewTransition name={"item-name-" + item.id}>
                                <figcaption className="text-[40px] lg:text-[46px]">
                                    {item.name}
                                </figcaption>
                            </ViewTransition>
                            <figcaption className="text-xs">
                                Category: {item.category}
                            </figcaption>
                            <figcaption className="text-sm">
                                {item.price === 0 ? "無料" : item.price + "円"}
                            </figcaption>
                            <figcaption className="flex-1 my-6 overflow-auto break-words">
                                <div className="tracking-widest">
                                    {item.notes}
                                </div>
                            </figcaption>

                            <Link
                                href={"https://booth.pm/ja/items/" + id}
                                target="blank"
                                className="self-end border-accnet border-2 w-fit py-2 hover:bg-foreground-tint transition-all"
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
                            <span className="absolute bottom-[14%] -right-[10px] text-[62px] opacity-10 font-bold tracking-wider pointer-events-none">
                                {item.id}
                            </span>
                        </div>
                    </figure>
                </ViewTransition>

                {/* 下のエリア */}
                <div className="py-4 [&>*]:w-[20%] [&>*]:h-fit  flex  overflow-hidden">
                    {data
                        .filter((item) =>
                            category === "all"
                                ? true
                                : item.category === category
                        )
                        .filter((item) => item.id !== id)
                        .map((item) => (
                            <BoothItem key={item.id} {...item} />
                        ))}
                </div>
            </div>
        </div>
    );
}
