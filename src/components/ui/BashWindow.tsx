import clsx from "clsx";
import { Red_Hat_Mono } from "next/font/google";
import Image from "next/image";
import { ReactElement } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";
import CatSoundPlayer from "../client/CatSoundPlayer";
const redHatMono = Red_Hat_Mono({ subsets: ["latin"] });

interface BashWindowInterface {
    children?: React.ReactNode;
    className?: string;
    command?: string;
    title?: ReactElement | string;
    isUserActive?: boolean;
    isCustomCommand?: boolean;
    hasClose?: boolean;
    closeHandler?: () => void;
}
export default function BashWindow({
    children,
    className,
    command,
    title,

    isCustomCommand,
    isUserActive,
    hasClose,
    closeHandler,
}: BashWindowInterface) {
    return (
        <div
            className={`border-foreground border-2 p-6 flex flex-col relative ${className} ${redHatMono.className} text-foreground bg-background-sub max-h-fit`}
        >
            {hasClose && (
                <button
                    className="flex justify-end h-lh mb-2"
                    onClick={closeHandler}
                >
                    <div className="aspect-square relative command-foreground h-full hover:bg-background-sub-tint/60 transition-all p-4 rounded">
                        <Image
                            className="p-1"
                            src="svg/close.svg"
                            alt="閉じるボタン"
                            fill
                            objectFit="cover"
                        />
                    </div>
                </button>
            )}
            {isUserActive && (
                <span
                    className={clsx(
                        "absolute -top-3 -left-6 bg-background-sub px-2 text-sm border-foreground border-2 z-10",
                        !isUserActive && "hidden"
                    )}
                >
                    user@rrkrn
                </span>
            )}
            {command && (
                <ViewTransition name={`BashWindow-${command}`}>
                    {isCustomCommand ? (
                        <CatSoundPlayer command={command} />
                    ) : (
                        <span className="absolute top-6 -left-6 bg-background-sub px-2 text-md border-foreground border-2 z-10">
                            $ {command}
                        </span>
                    )}
                </ViewTransition>
            )}
            {title && (
                <div className="text-2xl pl-11 inline-block">{title}</div>
            )}
            {children}
        </div>
    );
}
