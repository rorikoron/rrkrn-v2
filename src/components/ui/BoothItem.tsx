import { ItemInterface } from "@/store/booth";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";

export default function BoothItem({ id, name, pics }: ItemInterface) {
    return (
        <ViewTransition name={"item-card-" + id}>
            <Link
                href={"/booth/" + id}
                className={clsx(
                    "p-2 w-full text-foreground z-5 rounded-xl transition-all cursor-pointer",
                    "hover:bg-white/40"
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
