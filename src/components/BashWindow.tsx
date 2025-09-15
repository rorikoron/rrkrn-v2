import clsx from "clsx";
import { ReactElement } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";

interface BashWindowInterface {
    className?: string;
    command: string;
    title?: ReactElement | string;
    output?: ReactElement | string;
    isUserActive?: boolean;
}
export default function BashWindow({
    className,
    command,
    title,
    output,
    isUserActive,
}: BashWindowInterface) {
    return (
        <div
            className={`border-accent border-2 py-6 px-6 relative ${className} bg-foreground`}
        >
            <span
                className={clsx(
                    "absolute -top-3 -left-6 bg-foreground px-2 text-sm border-white border-2 z-10",
                    !isUserActive && "hidden"
                )}
            >
                user@rrkrn
            </span>
            <ViewTransition name={`BashWindow-${command}`}>
                <span className="absolute top-6 -left-6 bg-foreground px-2 text-md border-white border-2 z-10">
                    $ {command}
                </span>
            </ViewTransition>
            <h5 className="text-2xl pl-8 ">{title}</h5>
            <div className="">{output}</div>
        </div>
    );
}
