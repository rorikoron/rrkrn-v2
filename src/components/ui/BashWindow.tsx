import clsx from "clsx";
import { Red_Hat_Mono } from "next/font/google";
import Image from "next/image";
import { ReactElement } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";
const redHatMono = Red_Hat_Mono({ subsets: ["latin"] });

interface BashWindowInterface {
    className?: string;
    command?: string;
    title?: ReactElement | string;
    output?: ReactElement | string;
    isUserActive?: boolean;
    hasClose?: boolean;
    closeHandler?: () => void;
}
export default function BashWindow({
    className,
    command,
    title,
    output,
    isUserActive,
    hasClose,
    closeHandler,
}: BashWindowInterface) {
    return (
        <div
            className={`border-accent border-2 p-6 flex flex-col relative ${className} ${redHatMono.className}  bg-foreground`}
        >
            {hasClose && (
                <button
                    className="flex justify-end h-lh mb-2"
                    onClick={closeHandler}
                >
                    <div className="aspect-square relative command-accent h-full hover:bg-foreground-tint transition-all p-4 rounded">
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
                        "absolute -top-3 -left-6 bg-foreground px-2 text-sm border-white border-2 z-10",
                        !isUserActive && "hidden"
                    )}
                >
                    user@rrkrn
                </span>
            )}
            {command && (
                <ViewTransition name={`BashWindow-${command}`}>
                    <span className="absolute top-6 -left-6 bg-foreground px-2 text-md border-white border-2 z-10">
                        $ {command}
                    </span>
                </ViewTransition>
            )}
            {title && (
                <div className="text-2xl pl-12 inline-block">{title}</div>
            )}
            {output && <div>{output}</div>}
        </div>
    );
}
