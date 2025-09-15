import { fetchPics } from "@/util";
import PictureItem from "./PictureItem";
import { Zen_Kaku_Gothic_Antique } from "next/font/google";

const zenkaku = Zen_Kaku_Gothic_Antique({
    subsets: ["latin"],
    weight: "500",
});

interface PicturePlayerInterface {
    className?: string;
    directory: string;
}
export default async function PicturePlayer({
    className,
    directory,
}: PicturePlayerInterface) {
    const pngs = await fetchPics(directory);

    return (
        <div
            className={`bg-gradient-to-b from-foreground-tint to-foreground text-accent ${className} ${zenkaku.className} flex flex-col gap-6 rounded-t-xl`}
        >
            <PictureItem pngs={pngs} />
        </div>
    );
}
