import AsciiWindowContainer from "@/components/ui/AsciiWindowContainer";
import BashWindow from "@/components/ui/BashWindow";
import { fetchPics } from "@/util";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";

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

export default async function Home() {
    const pics = await fetchPics("selfie");
    const index = Math.floor(Math.random() * pics.length);

    return (
        <div className="h-full">
            <main className="h-full grid gap-4 md:gap-0 grid-rows-[auto_1fr] md:grid-rows-none md:grid-cols-[min(40%,360px)_1fr]">
                {/* left side */}
                <div className="h-full grid grid-cols-[24%_1fr] md:grid-cols-none md:grid-rows-[auto_minmax(0,1fr)] gap-2 md:gap-10 overflow-y-hidden">
                    {/* 自画像 */}
                    <ViewTransition name="SelfieWindow">
                        <BashWindow className="aspect-square relative mt-20 origin-top-left scale-[1.4] md:scale-1 z-10">
                            <Image
                                src={pics[index]}
                                alt="自画像"
                                objectFit="cover"
                                fill
                            />
                        </BashWindow>
                    </ViewTransition>
                    <ViewTransition name="DescriptionWindow">
                        {/* 説明文 */}
                        <BashWindow
                            command="man"
                            title={<h5>&gt; トリセツ?</h5>}
                        >
                            <div className="overflow-y-auto">
                                <p>&gt;</p>
                                <p>&gt; 08/01 生まれ</p>
                                <p>&gt;</p>
                                <p>&gt; 好きなたべもの：全て</p>
                                <p>&gt; 好きなのみもの：調整豆乳、솔의눈</p>
                                <p>&gt; 好きなこと：何か作ること！</p>
                                <p>&gt;</p>
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
                                <span className="pl-4">&gt; こんにちは！</span>
                            }
                        >
                            <div className="overflow-y-auto">
                                <p>&gt;</p>
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
                                        className="text-link font-bold inline-flex px-1.5 mx-2 rounded-xl hover:bg-foreground-tint transition-all"
                                    >
                                        <span>ここ</span>
                                        <span className="h-lh aspect-square relative command-link inline-block">
                                            <Image
                                                src="svg/link.svg"
                                                fill
                                                alt="共有アイコン"
                                            />
                                        </span>
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
                                <p>&gt;</p>
                                <ul className="gap-4">
                                    {/* カテゴリ */}
                                    {linkGroups.map((group) => (
                                        <div key={group.title}>
                                            <p>&gt; {group.title}:</p>
                                            <div className="flex gap-4 my-1">
                                                {/* 各リンク */}
                                                {group.sites.map((site) => (
                                                    <li key={site.link}>
                                                        <Link
                                                            href={site.link}
                                                            className={clsx(
                                                                "grid grid-cols-[1lh_1fr] bg-accent px-2 py-1.5 text-foreground rounded transition-all",
                                                                "hover:bg-inactive"
                                                            )}
                                                        >
                                                            <div className="aspect-square h-full relative">
                                                                <Image
                                                                    alt={
                                                                        site.logo +
                                                                        "のロゴ"
                                                                    }
                                                                    src={
                                                                        "svg/" +
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
                                            </div>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </BashWindow>
                    </ViewTransition>
                </div>

                <ViewTransition name="AsciiContainer">
                    <AsciiWindowContainer className="absolute right-2 md:right-24 bottom-2 md:bottom-12 z-1" />
                </ViewTransition>
            </main>
        </div>
    );
}
