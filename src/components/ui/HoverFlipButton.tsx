import clsx from "clsx";
import Icon, { IconName } from "./Icon";

interface HoverFlipButtonInterface {
    className?: string;
    frontLabel: string;
    rearLabel: string;
    frontIcon: IconName;
    rearIcon: IconName;
}

/**
 * ホバーで表裏が入れ替わるボタンの見た目。リンクやボタンの中に置くので、中身は span だけで組む。
 * 読み上げるのは表のラベルだけ (裏はホバー時の遊び)
 */
export default function HoverFlipButton({
    className,
    frontLabel,
    rearLabel,
    frontIcon,
    rearIcon,
}: HoverFlipButtonInterface) {
    return (
        <span className="group inline-block">
            <span
                className={clsx(
                    `bg-primary w-[180px] lg:w-[200px] px-6 lg:px-8 py-4 flex justify-between cursor-pointer overflow-hidden transition-all`,
                    `group-hover:bg-foreground group-hover:border-surface`,
                    className
                )}
            >
                <span>
                    <span
                        className={clsx(
                            "absolute text-nowrap transition-all text-foreground",
                            "group-hover:opacity-0"
                        )}
                    >
                        {frontLabel}
                    </span>
                    <span
                        aria-hidden
                        className={clsx(
                            "absolute text-nowrap transition-all text-surface opacity-0",
                            "group-hover:opacity-100"
                        )}
                    >
                        {rearLabel}
                    </span>
                </span>

                <span className="h-lh aspect-square relative">
                    <Icon
                        name={frontIcon}
                        className={clsx(
                            "absolute inset-0 transition-all text-foreground",
                            "group-hover:ml-3 group-hover:opacity-0"
                        )}
                    />
                    <Icon
                        name={rearIcon}
                        className={clsx(
                            "absolute inset-0 transition-all opacity-0 text-surface",
                            "group-hover:ml-3 group-hover:opacity-100"
                        )}
                    />
                </span>
            </span>
        </span>
    );
}
