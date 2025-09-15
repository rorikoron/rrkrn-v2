import HoverFlipButton from "@/components/HoverFlipButton";
import { unstable_ViewTransition as ViewTransition } from "react";
import { fetchPics } from "@/util";
import PictureItem from "@/components/PictureItem";

export default async function Home() {
    const pngs = await fetchPics("player");

    return (
        <div className="h-full">
            <main className="h-full grid grid-rows-[4fr_6fr] relative">
                <div className="flex flex-col justify-center">
                    <h1 className="text-[128px] leading-none">Rorikoron</h1>

                    <h4 className="leading-none pl-2">創作が好きです。</h4>
                    <span className="absolute bottom-0 pl-2 text-xl tracking-[8px] text-foreground/60">
                        &copy;rrkrn.vercel.app
                    </span>
                </div>
                <div className="pl-2">
                    <div className="inline-block relative">
                        <HoverFlipButton
                            className="ml-2"
                            frontLabel="もっと詳しく"
                            rearLabel="$ cd /about"
                            frontIcon="read-more"
                            rearIcon="extend"
                        />

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
