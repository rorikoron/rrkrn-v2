import type { Metadata } from "next";
import { M_PLUS_1 } from "next/font/google";
import "@/app/styles/globals.css";
import Header from "../components/client/Header";
import clsx from "clsx";

const mplusone = M_PLUS_1({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ろりころんほーむぺーじ",
    description: "ろりころんのサイト第二版です！",
    openGraph: {
        type: "website",
        title: "krn",
        description: "ろりころんのサイトです！",
        siteName: "ろりころんほーむぺーじ",
        url: "https://rorikoron.net/",
        locale: "ja_JP",
        images: [
            {
                url: "./OGP.png",
                width: 1200,
                height: 630,
                alt: "png for OGP",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "ろりころんほーむぺーじ",
        description: "ろりころんのサイトです！",
        images: ["./OGP.png"],
        site: "website",
    },
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`h-lvh w-lvw antialiased grid grid-cols-[420px_1fr] overflow-hidden`}
            >
                <Header />
                <div
                    className={clsx(
                        `${mplusone.className} py-12 px-8 text-accent h-full`,
                        "bg-gradient-to-br from-bg-background to-background-gradient"
                    )}
                >
                    {/* morse */}
                    <div className="absolute flex flex-col w-[4px] gap-3 -translate-x-2/4 -ml-4 opacity-40 [&>*:nth-child(3n)]:mb-6">
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
                    <span className="absolute bottom-6 pl-2 text-xl tracking-[8px] text-foreground-tint/70">
                        &copy;rorikoron.net
                    </span>
                    {children}
                </div>
            </body>
        </html>
    );
}
