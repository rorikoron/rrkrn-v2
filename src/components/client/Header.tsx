"use client";

import HeaderTitle from "./HeaderTitle";
import BashWindow from "@/components/ui/BashWindow";
import Icon from "@/components/ui/Icon";
import HeaderList, { LinksInterface } from "./HeaderList";
import { useAtom } from "jotai";
import { isHeaderOpenAtom } from "@/store/atoms";
import clsx from "clsx";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ThemeToggleButton from "./ThemeToggleButton";

const links: LinksInterface[] = [
    { name: "home", href: "/" },
    { name: "about", href: "/about" },
    { name: "archive", href: "/archive" },
    { name: "booth", href: "/booth" },
];

export default function Header() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useAtom(isHeaderOpenAtom);
    useEffect(() => {
        setIsOpen(false);
    }, [pathname, setIsOpen]);

    return (
        <>
            <header
                className={clsx(
                    `h-dvh px-2 py-12 z-12 bg-surface border-r-2 border-primary/60 text-foreground tracking-widest flex flex-col fixed w-[330px] lg:w-auto! lg:relative transition-all ease-in`,
                    isOpen ? "left-0" : "-left-[330px] lg:left-0"
                )}
            >
                {/* 中身。lg 未満で閉じている間は画面外にあるので invisible にして、
                    Tab でフォーカスが入ったり読み上げられたりしないようにする。
                    visibility は遷移の終わりで切り替わるので、閉じるアニメーション中は見えたまま */}
                <div
                    id="site-sidebar"
                    className={clsx(
                        "contents transition-[visibility] ease-in",
                        !isOpen && "max-lg:invisible"
                    )}
                >
                    <BashWindow
                        className={"ml-4 lg:ml-6 lg:mr-6 mb-20"}
                        command="pwd"
                        title={<HeaderTitle />}
                        isUserActive
                    />

                    <HeaderList links={links} />

                    <div className="mt-auto ml-4">
                        <ThemeToggleButton />
                    </div>
                </div>

                {/* 開閉ボタン */}
                <button
                    type="button"
                    aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
                    aria-expanded={isOpen}
                    aria-controls="site-sidebar"
                    className={clsx(
                        "absolute cursor-pointer bottom-4 -right-1 translate-x-full px-2 py-3 bg-surface border-foreground z-12 rounded-xl transition-all",
                        !isOpen && "rotate-180",
                        "lg:hidden"
                    )}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <Icon
                        name="arrow-left"
                        className="size-6 hover:scale-110 transition-transform"
                    />
                </button>
            </header>

            {/* マスク */}
            <div
                aria-hidden
                className={clsx(
                    "z-11 h-dvh w-dvw bg-white fixed left-0 top-0 transition-all",
                    isOpen && "opacity-20",
                    !isOpen && "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />
        </>
    );
}
