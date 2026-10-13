import clsx from "clsx";
import { ReactElement } from "react";
import { ViewTransition } from "react";
import CatSoundPlayer from "../client/CatSoundPlayer";
import Icon from "./Icon";

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
            className={clsx(
                "border-foreground border-2 p-6 flex flex-col relative font-mono text-foreground bg-surface max-h-fit",
                className
            )}
        >
            {hasClose && (
                <button
                    type="button"
                    aria-label="閉じる"
                    className="flex justify-end h-lh mb-2"
                    onClick={closeHandler}
                >
                    <span className="aspect-square relative h-full hover:bg-primary/40 transition-all p-5 rounded">
                        <Icon name="close" className="absolute inset-0 p-2" />
                    </span>
                </button>
            )}
            {isUserActive && (
                <span className="absolute -top-3 -left-6 bg-surface px-2 text-sm border-foreground border-2 z-10">
                    user@rrkrn
                </span>
            )}
            {command && (
                <ViewTransition name={`BashWindow-${command}`}>
                    {isCustomCommand ? (
                        <CatSoundPlayer command={command} />
                    ) : (
                        <span className="absolute top-6 -left-6 bg-surface px-2 border-foreground border-2 z-10">
                            <span className="pr-1">$</span>{command}
                        </span>
                    )}
                </ViewTransition>
            )}
            {title && (
                <div className="text-2xl pl-10 inline-block">{title}</div>
            )}
            {children}
        </div>
    );
}
