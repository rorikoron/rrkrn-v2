"use client";
import { boothNavAtom, ItemInterface } from "@/store/booth";
import { boothImageUrl } from "@/util";
import clsx from "clsx";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ViewTransition } from "react";

export default function BoothItem({ id, name, pics }: ItemInterface) {
    const thumbnail = pics?.[0];
    const params = useParams<{ id?: string }>();
    const [nav, setNav] = useAtom(boothNavAtom);

    // 一覧/詳細の両方に居るアイテムは同名でペアになり、位置だけ動く。
    // 遷移元/遷移先のアイテムはサイズも変わるので、専用のクラスで扱う
    const share = nav.from === id || nav.to === id ? "booth-card" : "booth-item";

    return (
        <ViewTransition
            name={"item-card-" + id}
            share={share}
            enter="none"
            exit="none"
        >
            <Link
                href={"/booth/" + id}
                onClick={() => setNav({ from: params.id ?? null, to: id })}
                className={clsx(
                    "p-2 w-full text-foreground z-5 rounded-xl transition-all cursor-pointer",
                    "hover:bg-white/40"
                )}
            >
                <ViewTransition name={"item-picture-" + id} share={share}>
                    <div className={clsx("aspect-square relative m-2")}>
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
                <ViewTransition name={"item-name-" + id} share={share}>
                    <div className="line-clamp-1 m-2 font-bold">{name}</div>
                </ViewTransition>
            </Link>
        </ViewTransition>
    );
}
