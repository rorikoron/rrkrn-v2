import type { Metadata, Viewport } from "next";
import "@/app/styles/globals.css";
import Header from "@/components/client/Header";
import ViewTransitionCleanup from "@/components/client/ViewTransitionCleanup";
import { fontVariables } from "@/app/fonts";
import { themeInitScript } from "@/lib/theme";
import clsx from "clsx";

const SITE_NAME = "ろりころんほーむぺーじ";
const SITE_DESCRIPTION = "ろりころんのサイトです！";
const SITE_URL = "https://rorikoron.net/";

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_BASE_URL || "https://rorikoron.net"
    ),
    title: SITE_NAME,
    description: "ろりころんのサイト第二版です！",
    openGraph: {
        type: "website",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        siteName: SITE_NAME,
        url: SITE_URL,
        locale: "ja_JP",
        images: [
            {
                url: "/OGP.png",
                width: 1200,
                height: 630,
                alt: SITE_NAME,
            },
        ],
    },

    twitter: {
        card: "player",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: ["/OGP.png"],
        site: "@rorikoron",
        creator: "@rorikoron",
        // card を player にするには players が要るが、Next は必ず twitter:player:stream も出す。
        // 動画の URL が無いのに空の stream タグを出したくないので、プレイヤーのタグは下の other で出す
        players: [],
    },
    // ツイート内の iframe にサイトそのものを埋め込む。幅と高さは縦長 (スマホ向けレイアウト) の比率
    other: {
        "twitter:player": SITE_URL,
        "twitter:player:width": "480",
        "twitter:player:height": "640",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // .dark は下の script がハイドレーション前に付けるので、サーバーの HTML と食い違ってよい
        <html lang="ja" className={fontVariables} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
            </head>
            <body
                className={`h-dvh! w-dvw! antialiased relative lg:grid lg:grid-cols-[max(10%,380px)_1fr] overflow-hidden`}
            >
                <ViewTransitionCleanup />
                <Header />
                <div
                    className={clsx(
                        "py-6 md:py-12 px-6 md:px-8 text-foreground h-dvh",
                        "bg-linear-to-br from-background to-background-gradient"
                    )}
                >
                    {/* morse: RRKRN */}
                    <div
                        aria-hidden
                        className="absolute flex flex-col w-[4px] gap-3 -translate-x-2/4 -ml-4 opacity-40 [&>*:nth-child(3n)]:mb-6"
                    >
                        <span className="dot" />
                        <span className="bar" />
                        <span className="dot" />

                        <span className="dot" />
                        <span className="bar" />
                        <span className="dot" />

                        <span className="bar" />
                        <span className="dot" />
                        <span className="bar" />

                        <span className="dot" />
                        <span className="bar" />
                        <span className="dot" />

                        <span className="bar" />
                        <span className="dot" />
                    </div>
                    <small className="absolute bottom-6 pl-2 text-xl tracking-[4px] text-primary-ink">
                        &copy;rorikoron.net
                    </small>
                    {children}
                </div>
            </body>
        </html>
    );
}
