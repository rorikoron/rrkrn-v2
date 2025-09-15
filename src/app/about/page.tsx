import AsciiWindowContainer from "@/components/AsciiWindowContainer";
import BashWindow from "@/components/BashWindow";
import { fetchPics } from "@/util";
import Image from "next/image";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";

export default async function Home() {
    const pics = await fetchPics("selfie");
    const index = Math.floor(Math.random() * pics.length);

    return (
        <div className="h-full px-4">
            <main className="h-full gap-4 grid grid-cols-[4fr_8fr] ">
                {/* left side */}
                <div className="flex flex-col justify-around">
                    {/* 自画像 */}
                    <ViewTransition name="SelfieWindow">
                        <BashWindow
                            className="aspect-square relative"
                            output={
                                <Image
                                    src={pics[index]}
                                    alt="自画像"
                                    objectFit="cover"
                                    fill
                                />
                            }
                        />
                    </ViewTransition>
                    <ViewTransition name="DescriptionWindow">
                        {/* 説明文 */}
                        <BashWindow
                            command="man"
                            title={<h5>&gt; トリセツ？</h5>}
                            output={
                                <>
                                    <p>&gt;</p>
                                    <p>&gt; 08/01 生まれ</p>
                                    <p>&gt;</p>
                                    <p>&gt; 好きなたべもの：全て</p>
                                    <p>&gt; 好きなのみもの：調整豆乳、솔의눈</p>
                                    <p>&gt; 好きなこと：何か作ること！</p>
                                    <p>&gt;</p>
                                    <p>&gt; かしこくなりたいです。</p>
                                </>
                            }
                        />
                    </ViewTransition>
                </div>

                {/* right side */}
                <div className="pl-2 flex flex-col justify-around">
                    <ViewTransition name="IntroductionWindow">
                        <BashWindow
                            command="whoami"
                            title={
                                <span className="pl-4">&gt; こんにちは！</span>
                            }
                            output={
                                <div>
                                    <p>&gt;</p>
                                    <p>&gt; ろりころんです。</p>
                                    <p>
                                        &gt;
                                        台湾で大学生してます。モデリング、お絵描き、プログラミングが趣味です。
                                    </p>
                                    <p>&gt;</p>
                                    <p>
                                        &gt; 2023年11月からVRChatをしています。
                                    </p>
                                    <p>
                                        &gt;
                                        始めたてはVroidで自作したキャラを使っていましたが、もうフレンドから頂いた真冬ちゃんしか使ってません。
                                    </p>
                                    <p>&gt;</p>
                                    <p>
                                        &gt; 本サイトの前身は
                                        <Link
                                            href="https://krn-portfolio.vercel.app"
                                            className="text-link font-bold inline-flex px-2"
                                        >
                                            <span>ここ</span>
                                            <span className="h-lh aspect-square relative command-link inline-block">
                                                <Image
                                                    src="link.svg"
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
                                </div>
                            }
                        />
                    </ViewTransition>

                    <ViewTransition name="AsciiContainer">
                        <AsciiWindowContainer className="text-center" />
                    </ViewTransition>
                </div>
            </main>
        </div>
    );
}
