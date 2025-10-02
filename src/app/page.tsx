import HoverFlipButton from "@/components/ui/HoverFlipBox";
import { unstable_ViewTransition as ViewTransition } from "react";
import { fetchPics } from "@/util";
import PictureItem from "@/components/client/PictureItem";
import Link from "next/link";
import "@/app/styles/title.scss";

export default async function Home() {
    const pngs = await fetchPics("player");

    return (
        <div className="h-full">
            <main className="h-full grid grid-rows-[4fr_6fr] relative">
                <div className="flex flex-col justify-center overflow-hidden">
                    <h1 className="text-[60px] sm:text-[80px] md:text-[128px] leading-none text-foreground">
                        Rorikoron
                    </h1>
                    <h4 className="w-fit overlay leading-none pl-2">
                        創作が好きです。
                    </h4>
                </div>
                <div className="pl-2">
                    <div className="inline-block relative">
                        <Link href="/about">
                            <HoverFlipButton
                                frontLabel="もっと詳しく"
                                rearLabel="$ cd /about"
                                frontIcon="read-more"
                                rearIcon="extend"
                            />
                        </Link>

                        {/* Dummy for 自画像window */}
                        <ViewTransition name="SelfieWindow">
                            <div className="absolute left-[50%] top-[50%]" />
                        </ViewTransition>

                        {/* Dummy for トリセツwindow */}
                        <ViewTransition name="DescriptionWindow">
                            <div className="absolute left-[50%] top-[50%]" />
                        </ViewTransition>

                        {/* Dummy for 紹介window */}
                        <ViewTransition name="IntroductionWindow">
                            <div className="absolute left-[50%] top-[50%]" />
                        </ViewTransition>

                        {/* Dummy for AsciiContainer */}
                        <ViewTransition name="AsciiContainer">
                            <div className="absolute left-[50%] top-[50%]" />
                        </ViewTransition>
                    </div>
                </div>
            </main>

            <ViewTransition name="player">
                <PictureItem pngs={pngs} />
            </ViewTransition>
        </div>
    );
}
