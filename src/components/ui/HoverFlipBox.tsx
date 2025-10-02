import Image from "next/image";
import clsx from "clsx";

interface HoverFlipButtonInterface {
    className?: string;
    frontLabel: string;
    rearLabel: string;
    frontIcon: string;
    rearIcon: string;
}
export default function HoverFlipButton({
    className,
    frontLabel,
    rearLabel,
    frontIcon,
    rearIcon,
}: HoverFlipButtonInterface) {
    return (
        <div className="group inline-block">
            <div
                className={clsx(
                    `${className} bg-background-sub border-foreground w-[180px] lg:w-[220px] px-6 lg:px-8 py-3.5 border-2 flex justify-between cursor-pointer overflow-hidden transition-all`,
                    `group-hover:bg-foreground group-hover:border-background-sub`
                )}
            >
                <div>
                    <span
                        className={clsx(
                            "absolute text-nowrap transition-all text-foreground",
                            "group-hover:opacity-0"
                        )}
                    >
                        {frontLabel}
                    </span>
                    <span
                        className={clsx(
                            "absolute text-nowrap transition-all text-background-sub opacity-0",
                            "group-hover:opacity-100"
                        )}
                    >
                        {rearLabel}
                    </span>
                </div>

                <div className={clsx("h-lh aspect-square relative")}>
                    <Image
                        src={"svg/" + frontIcon + ".svg"}
                        alt="詳細"
                        className={clsx(
                            "transition-all command-foreground",
                            "group-hover:ml-3 group-hover:opacity-0"
                        )}
                        fill
                    />

                    <Image
                        src={"svg/" + rearIcon + ".svg"}
                        alt="展開"
                        className={clsx(
                            "transition-all opacity-0 command-background-sub",
                            "group-hover:ml-3 group-hover:opacity-100"
                        )}
                        fill
                    />
                </div>
            </div>
        </div>
    );
}
