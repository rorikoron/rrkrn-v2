import BoothCategoryButton from "@/components/client/BoothCategoryButton";
import BoothItemList from "@/components/client/BoothItemList";
import { BoothItemType, ItemInterface } from "@/store/booth";
import { Suspense, unstable_ViewTransition as ViewTransition } from "react";
import Image from "next/image";
import fetchBoothVRChatItem from "@/data/fetchBoothVRChatItem";
import clsx from "clsx";

// 一日毎にISR
export const revalidate = 86400;
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
        <div className="h-full grid grid-rows-[auto_1fr] overflow-y-hidden">
            <div className="pb-4 md:pt-0 md:px-4 md:flex justify-between items-center ">
                <h1 className="inline-block text-[42px] md:text-[64px] before:content-['#'] before:mr-[4px]">
                    KoronStore
                </h1>
                <h2
                    className={clsx(
                        "inline-block text-sm tracking-wider mt-4 py-4 pr-[42px] border-t-3  border-accent/60",
                        "md:border-t-0 md:border-l-3 md:pl-[30px]"
                    )}
                >
                    <div>自分が欲しくなったのを作ってます</div>
                    <div>気に入ってくれたら嬉しいな</div>
                </h2>
            </div>

            {/* bottom fields */}
            <div className="h-full overflow-hidden">
                {/* buttons */}
                <fieldset className="md:px-8 py-2 flex gap-1.5 flex-wrap">
                    {availlableCategory.map((category) => (
                        <BoothCategoryButton
                            category={category}
                            key={category}
                        />
                    ))}
                </fieldset>
                {/* items */}
                <div className="py-2 md:px-4 h-full overflow-y-auto">
                    <Suspense fallback={<LoadingFallback />}>
                        <BoothItemList data={items} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
