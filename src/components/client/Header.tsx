"use client";

import HeaderTitle from "./HeaderTitle";
import BashWindow from "../ui/BashWindow";
import HeaderList, { LinksInterface } from "./HeaderList";
import { useAtom } from "jotai";
import { isHeaderOpenAtom } from "@/store/atoms";
import Image from "next/image";
import clsx from "clsx";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ThemeToggleButton from "./ThemeToggleButton";

export default function Header() {
    const links: LinksInterface[] = [
        { name: "home", href: "/" },
        { name: "about", href: "/about" },
        { name: "archive", href: "/archive" },
        { name: "booth", href: "/booth" },
    ];

    const pathname = usePathname();
    const [isOpen, setIsOpen] = useAtom(isHeaderOpenAtom);
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            <header
                className={clsx(
                    `h-lvh px-2 py-12 z-12 bg-background-sub text-foreground tracking-widest flex flex-col fixed w-[330px] lg:!w-auto lg:relative transition-all ease-in`,
                    isOpen ? "left-0" : "-left-[330px] lg:left-0"
                )}
            >
                <BashWindow
                    className={"ml-4 lg:ml-6 lg:mr-6 xl:mr-10 2xl:mr-20 mb-20"}
                    command="pwd"
                    title={<HeaderTitle />}
                    isUserActive
                />

                <HeaderList links={links} />

                {/* 開閉ボタン */}
                <div
                    className={clsx(
                        "absolute cursor-pointer bottom-4 -right-1 translate-x-full px-2 py-3 bg-background-sub border-foreground z-9 rounded-xl transition-all",
                        !isOpen && "rotate-180",
                        "lg:hidden"
                    )}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <Image
                        className="command-foreground hover:scale-110 transition-transform"
                        src="/svg/arrow-left.svg"
                        alt="Toggle Button"
                        height="24"
                        width="24"
                    />
                </div>

                <div className="mt-auto ml-4">
                    <ThemeToggleButton />
                </div>
            </header>

            {/* マスク */}
            <div
                className={clsx(
                    "z-11 h-lvh w-lvw bg-white fixed left-0 top-0 transition-all",
                    isOpen && "opacity-20",
                    !isOpen && "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />
        </>
    );
}
