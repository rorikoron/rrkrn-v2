import { M_PLUS_1 } from "next/font/google";
import fetchVRChatArchiveByYear, {
    VRChatArchiveInterface,
} from "@/data/fetchVRChatArchiveByYear";
import Link from "next/link";
import AnimatedMagnifiableImage from "@/components/ui/AnimatedMagnifiableImage";
import Image from "next/image";
import { hc } from "hono/client";
import { AppType } from "../api/[...route]/route";
const plusone = M_PLUS_1({ subsets: ["latin"] });
export const revalidate = 86400;

export default async function Home() {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseURL) throw new Error("API URL Was Not Set");
    const client = hc<AppType>(baseURL);
    const res = await client.api.archive.$get();
    const years: string[] = await res.json();

    const archivesByYear: Record<
        string,
        Awaited<ReturnType<typeof fetchVRChatArchiveByYear>>
    > = {};
    await Promise.all(
        years.map(async (year) => {
            archivesByYear[year] = await fetchVRChatArchiveByYear({
                year: Number(year),
            } as VRChatArchiveInterface);
        })
    );

    return (
        <div className={plusone.className}>
            <ul className="flex flex-col gap-4">
                {years.map((year) => (
                    <li
                        key={year}
                        className="group list-inside text-xl w-fit py-1.5 pl-3 pr-12"
                    >
                        <Link
                            href={"/archive/#" + year}
                            className="inline-flex items-center gap-3 text-md "
                        >
                            <div className="w-5 h-5 relative">
                                <Image
                                    className="rotate-180 command-accent"
                                    src="/svg/arrow-left.svg"
                                    alt="移動"
                                    fill
                                />
                            </div>
                            <span className=" group-hover:translate-x-[50%] transition-all">
                                {year}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="fixed left-[40%] bottom-0 origin-bottom-left rotate-10 h-[calc(100lvh/0.98480+200px)] w-[54lvw] bg-background-sub/60 py-[200px] overflow-y-scroll px-4">
                {years.map((year) => [
                    <>
                        <h4
                            id={year}
                            key={`year-${year}`}
                            className="text-5xl tracking-widest font-light pb-2"
                        >
                            {year}
                        </h4>
                        <div className="columns-3 space-y-4">
                            {...(archivesByYear[year] ?? []).map((value) => (
                                <AnimatedMagnifiableImage
                                    src={value}
                                    key={value}
                                />
                            ))}
                        </div>
                    </>,
                ])}
            </div>
        </div>
    );
}
