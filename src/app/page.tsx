import HoverFlipButton from "@/components/HoverFlipButton";
import PicturePlayer from "@/components/PicturePlayer";
import { unstable_ViewTransition as ViewTransition } from "react";
export default async function Home() {
    return (
        <div className="h-full">
            <main className="h-full grid grid-rows-[4fr_6fr]">
                <div className="flex flex-col justify-center">
                    <h1 className="text-[128px] leading-none">Rorikoron</h1>

                    <h4 className="leading-none pl-2 mb-10">
                        創作が好きです。
                    </h4>
                </div>
                <div className="pl-2">
                    <ViewTransition name="IntroduceWindow">
                        <HoverFlipButton className="ml-2" />
                    </ViewTransition>
                </div>
            </main>

            <ViewTransition name="player">
                <div className="border-foreground absolute bottom-0 right-0">
                    <PicturePlayer
                        className="h-[68lvh] aspect-9/16"
                        directry="player"
                    />
                </div>
            </ViewTransition>
        </div>
    );
}
