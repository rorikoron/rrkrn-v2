import HoverFlipButton from "@/components/ui/HoverFlipBox";
import { ViewTransition } from "react";
import { fetchPics } from "@/util";
import PictureItem from "@/components/client/PictureItem";
import Link from "next/link";
import "@/app/styles/title.scss";
import fetchBoothItems from "@/data/fetchBoothItems";
import { fetchVRChatArchiveAvailableYears } from "@/data/fetchVRChatArchiveAvailableYears";
import { fetchVRChatArchiveUrlsByYear } from "@/data/fetchVRChatArchiveByYear";

// プレビューカードに最新のboothアイテム・アーカイブ写真を使うので、他のページと同じく一日毎にISR
export const revalidate = 86400;

/** 一番新しい年のアーカイブ写真を1枚 */
async function fetchLatestArchivePic(): Promise<string | undefined> {
    const years = await fetchVRChatArchiveAvailableYears();
    const latest = years.map(Number).sort((a, b) => b - a)[0];
    if (latest === undefined) return undefined;
    return (await fetchVRChatArchiveUrlsByYear({ year: latest }))[0];
}

export default async function Home() {
    const [pngs, boothItems, archivePic] = await Promise.all([
        fetchPics("player"),
        fetchBoothItems(),
        fetchLatestArchivePic(),
    ]);
    const boothThumbnail = boothItems[0]?.pics[0];

    return (
        <div className="h-full">
            <main className="h-full grid grid-rows-[3fr_6fr] relative">
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
