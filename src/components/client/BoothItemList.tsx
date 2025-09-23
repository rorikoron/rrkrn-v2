"use client";
import { boothAtom, itemCategoryAtom, ItemInterface } from "@/store/booth";
import clsx from "clsx";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";

function BoothItem({ id, name, pics }: ItemInterface) {
    return (
        <ViewTransition name={"item-card-" + id}>
            <Link
                href={"/booth/" + id}
                className={clsx(
                    "p-2 w-full h-fit text-accent z-5 rounded-xl transition-all cursor-pointer",
                    "hover:bg-accent/40"
                )}
            >
                <ViewTransition name={"item-picture-" + id}>
                    <div className={clsx("aspect-square relative m-2")}>
                        <Image
                            src={pics[0].thumbnails.large.url}
                            alt={name + "のサムネイル"}
                            fill
                            objectFit="cover"
                            placeholder="blur"
                            blurDataURL={pics[0].thumbnails.small.url}
                        />
                    </div>
                </ViewTransition>
                <ViewTransition name={"item-name-" + id}>
                    <div className="line-clamp-1 m-2 font-bold">{name}</div>
                </ViewTransition>
            </Link>
        </ViewTransition>
    );
}

export default function BoothItemList() {
    const [{ data }] = useAtom(boothAtom);
    const [selectedCaterogry, setSelectedCategory] = useAtom(itemCategoryAtom);
    return (
        <div className="grid grid-cols-5 overflow-y-scroll">
            {data
                ?.filter(({ category }) =>
                    selectedCaterogry === "all"
                        ? true
                        : category === selectedCaterogry
                )
                .map((item) => (
                    <BoothItem {...item} key={"item-" + item.id} />
                ))}
        </div>
    );
}
