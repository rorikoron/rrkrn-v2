import AsciiWindowContainer from "@/components/client/AsciiWindowContainer";
import BashWindow from "@/components/ui/BashWindow";
import fetchPics from "@/data/fetchPics";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { ViewTransition } from "react";

const linkGroups = [
    {
        title: "Social",
        sites: [
            {
                link: "https://vrchat.com/home/user/usr_21abbcba-ea81-4fb3-991c-52a2dc4b3260",
                logo: "VRChat",
            },
            {
                link: "https://x.com/rorikoron__game",
                logo: "Twitter",
            },
        ],
    },
    {
        title: "Create",
        sites: [
            {
                link: "https://rorikoron.booth.pm/",
                logo: "Booth",
            },
            {
                link: "https://www.pixiv.net/users/57156713",
                logo: "Pixiv",
            },
        ],
    },
    {
        title: "Wishlist",
        sites: [
            {
                link: "https://booth.pm/wish_list_names/poPToaBg",
                logo: "Booth",
            },
            {
                link: "https://www.amazon.jp/hz/wishlist/ls/1TD36KPYLJ4GH?ref_=wl_share",
                logo: "Amazon",
            },
        ],
    },
];

export default async function About() {
    const pics = await fetchPics("selfie");
    // This route has no `revalidate`/`use cache`, so it re-renders (and re-rolls)
    // on every request; picking the index client-side would cause a hydration
    // mismatch since the server and client would each roll a different value.
    // eslint-disable-next-line react-hooks/purity -- see comment above
    const index = Math.floor(Math.random() * pics.length);

    return (
        <div className="h-full">
            <main className="h-full grid gap-4 md:gap-0 grid-rows-[auto_1fr] md:grid-rows-none md:grid-cols-[min(30%,360px)_1fr]">
                <h1 className="sr-only">ろりころんについて</h1>

                {/* left side */}
                <div className="h-full grid grid-cols-[24%_1fr] md:grid-cols-none md:grid-rows-[auto_minmax(0,1fr)] gap-2 md:gap-6 overflow-y-hidden">
                    {/* 自画像 */}
                    <ViewTransition name="SelfieWindow">
                        <BashWindow className="aspect-square relative mt-20 origin-bottom-left scale-[1.4] md:mt-0 md:scale-100 z-10">
                            <Image
                                src={pics[index]}
                                // public/ の画像は圧縮済みの webp。/_next/image を通すと Worker の CPU を食うので素通しにする
                                unoptimized
                                alt="ろりころんの自画像 (VRChat のアバター)"
                                className="object-cover"
                                fill
                            />
                        </BashWindow>
                    </ViewTransition>
                    <ViewTransition name="DescriptionWindow">
                        {/* 説明文 */}
                        <BashWindow
                            className="ml-6"
                            command="man"
                            title={<h2>&gt; トリセツ?</h2>}
                        >
                            <div className="overflow-y-auto pr-4">
                                <p>&gt; 2005-08-01 生まれ</p>
                                <p>&gt; 好きなたべもの：全て</p>
                                <p>&gt; 好きなのみもの：調整豆乳、솔의눈</p>
                                <p>&gt; 好きなこと：何か作ること！</p>
                                <p>&gt; かしこくなりたいです。</p>
                            </div>
                        </BashWindow>
                    </ViewTransition>
                </div>

                {/* right side */}
                <div className="pl-6 md:pl-10 overflow-y-hidden">
                    <ViewTransition name="IntroductionWindow">
                        <BashWindow
                            className="h-full"
                            command="whoami"
                            title={
                                <h2 className="pl-4">&gt; こんにちは！</h2>
                            }
                        >
                            <div className="overflow-y-auto pr-4 pb-12">
                                <p>&gt; ろりころんです。</p>
                                <p>
                                    &gt;
                                    台湾で大学生してます。モデリング、お絵描き、プログラミングが趣味です。
                                </p>
                                <p>&gt;</p>
                                <p>&gt; 2023年11月からVRChatをしています。</p>
                                <p>
                                    &gt;
                                    始めたてはVroidで自作したキャラを使っていましたが、もうフレンドから頂いた真冬ちゃんしか使ってません。
                                </p>
                                <p>&gt;</p>
                                <p>
                                    &gt; 本サイトの前身は
                                    <Link
                                        href="https://krn-portfolio.vercel.app"
                                        className="text-accent-ink font-bold inline-flex px-1.5 mx-2 rounded-xl hover:bg-primary hover:text-foreground transition-all"
                                    >
                                        <span>ここ</span>
                                        <span className="sr-only">
                                            (前身のサイト krn-portfolio)
                                        </span>
                                        <Icon
                                            name="link"
                                            className="h-lh aspect-square"
                                        />
                                    </Link>
                                    です。見なくてもいいかも。
                                </p>
                                <p>&gt; TypeScript、C++が好きです。</p>
                                <p>
                                    &gt;
                                    絶賛頑張って日本での就職先を探しています。
                                </p>
                                <p>
                                    &gt;
                                    日中はネイティブなので翻訳のお仕事もあったらください。
                                </p>
                                <p>&gt; </p>
                                <div>
                                    {/* カテゴリ */}
                                    {linkGroups.map((group) => (
                                        <div key={group.title}>
                                            <p>&gt; {group.title}:</p>
                                            <ul className="flex gap-4 my-1">
                                                {/* 各リンク */}
                                                {group.sites.map((site) => (
                                                    <li key={site.link}>
                                                        <Link
                                                            href={site.link}
                                                            className={clsx(
                                                                "grid grid-cols-[1lh_1fr] bg-white px-2 py-1.5 text-foreground dark:text-background rounded transition-all",
                                                                "hover:bg-primary-soft dark:hover:text-foreground"
                                                            )}
                                                        >
                                                            <div className="aspect-square h-full relative">
                                                                <Image
                                                                    // 隣に名前があるので読み上げない
                                                                    alt=""
                                                                    src={
                                                                        "/svg/" +
                                                                        site.logo.toLowerCase() +
                                                                        ".svg"
                                                                    }
                                                                    className="p-1"
                                                                    fill
                                                                />
                                                            </div>
                                                            <span>
                                                                {site.logo}
                                                            </span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </BashWindow>
                    </ViewTransition>
                </div>

                <ViewTransition name="AsciiContainer">
                    <AsciiWindowContainer className="absolute right-2 md:right-24 bottom-2 md:bottom-4 z-100" />
                </ViewTransition>
            </main>
        </div>
    );
}
