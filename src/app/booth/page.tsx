import BoothCategoryButton from "@/components/client/BoothCategoryButton";
import BoothItemList from "@/components/client/BoothItemList";
import { BoothItemType } from "@/store/booth";
import fetchBoothItems from "@/data/fetchBoothItems";
import clsx from "clsx";

// 一日毎にISR
export const revalidate = 86400;
const availlableCategory: (BoothItemType | "all")[] = [
    "all",
    "cloth",
    "accessory",
    "software",
    "shader",
    "goods",
];

export default async function Booth() {
    const items = await fetchBoothItems();

    return (
        <div className="h-full grid grid-rows-[auto_1fr] overflow-y-hidden px-4">
            <div className="pb-4 md:pt-0 md:flex justify-between items-center ">
                <h1 className="inline-block text-[42px] md:text-[64px] before:content-['#'] before:mr-[4px] pr-4 font-bold after:block after:w-14 after:h-1 after:mt-1 after:rounded-full after:bg-active">
                    KoronStore
                </h1>
                <h2
                    className={clsx(
                        "inline-block text-sm tracking-wider mt-2 py-2 border-primary/60",
                        "md:mt-4 md:py-4 md:border-l-3 md:pl-[30px]"
                    )}
                >
                    <div>自分が欲しくなったのを作ってます</div>
                    <div>気に入ってくれたら嬉しいな</div>
                </h2>
            </div>

            {/* bottom fields */}
            <div className="overflow-hidden h-full flex flex-col">
                {/* buttons */}
                <fieldset className="py-2 flex gap-1.5 flex-wrap">
                    {availlableCategory.map((category) => (
                        <BoothCategoryButton
                            category={category}
                            key={category}
                        />
                    ))}
                </fieldset>
                {/* items */}
                <div
                    data-booth-scroll
                    className="h-full pt-2 pb-8 pr-3 md:pr-4 overflow-y-auto"
                >
                    {/* Suspenseで包むとReactのViewTransitionが共有要素として
                        ペアリングしてくれなくなるので、ここでは包まない */}
                    <BoothItemList data={items} />
                </div>
            </div>
        </div>
    );
}
