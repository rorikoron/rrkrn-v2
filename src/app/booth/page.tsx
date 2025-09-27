import BoothCategoryButton from "@/components/client/BoothCategoryButton";
import BoothItemList from "@/components/client/BoothItemList";
import { BoothItemType, ItemInterface } from "@/store/booth";
import { Suspense, unstable_ViewTransition as ViewTransition } from "react";
import Image from "next/image";
import fetchBoothVRChatItem from "@/data/fetchBoothVRChatItem";

// 一日毎に再生成
const availlableCategory: (BoothItemType | "all")[] = [
    "all",
    "cloth",
    "accessaory",
    "tool",
    "shader",
    "goods",
];

function LoadingFallback() {
    return (
        <div className="size-full relative">
            <div className="h-[200px] aspect-square absolute left-50 top-50 translate-x-[100%] -translate-y-[50%] animate-bounce">
                <div className="absolute top-25 -left-50">
                    ちょっとまってね… &gt;
                </div>
                <Image src="/loading.png" alt="ロードアイコン" fill priority />
            </div>
        </div>
    );
}

export default async function Booth() {
    const items = await fetchBoothVRChatItem()
        .then(({ records }) =>
            records?.map((record: { fields: any }) => record?.fields)
        )
        .then((items: ItemInterface[]) =>
            items?.sort((a, b) => b?.sequence - a?.sequence)
        );

    return (
        <div className="h-full grid grid-rows-[auto_1fr] overflow-hidden">
            <div className="px-4 grid grid-cols-[6fr_4fr] items-center ">
                <h1 className="inline-block text-[64px] before:content-['#'] before:mr-[4px]">
                    KoronStore
                </h1>
                <div className="relative text-sm tracking-wider mt-4 before:content-[''] before:absolute before:-left-[32px] before:w-[3px] before:h-[calc(100%+20px)] before:rounded-xl before:-top-[10px] before:bg-accent/60">
                    <p>自分が欲しくなったのを作ってます</p>
                    <p>気に入ってくれたら嬉しいな</p>
                </div>
            </div>

            {/* bottom fields */}
            <div className="h-full overflow-hidden">
                {/* buttons */}
                <fieldset className="px-8 py-2 flex gap-1.5">
                    {availlableCategory.map((category) => (
                        <BoothCategoryButton
                            category={category}
                            key={category}
                        />
                    ))}
                </fieldset>
                {/* items */}
                <div className="py-2 px-4">
                    <Suspense fallback={<LoadingFallback />}>
                        <BoothItemList data={items} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
