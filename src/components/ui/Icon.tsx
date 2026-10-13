import clsx from "clsx";

// public/svg にある単色アイコン。ロゴなど色付きの SVG は next/image のまま使う
export type IconName =
    | "arrow-back"
    | "arrow-left"
    | "close"
    | "do-not-touch"
    | "extend"
    | "link"
    | "moon"
    | "pause"
    | "play"
    | "read-more"
    | "share"
    | "skip-left"
    | "warning";

interface IconProps {
    name: IconName;
    className?: string;
}

/**
 * SVG をマスクにして、背景色 (= currentColor) で塗る。
 * 色は親の text-* を継ぐので、テーマが変わっても CSS フィルターで色を作り直さなくていい。
 * パディングを付けたときもその内側に収まるよう、マスクは content-box に合わせる。
 * 装飾なので読み上げない。意味はボタンやリンクの aria-label に持たせる
 */
export default function Icon({ name, className }: IconProps) {
    const mask = `url(/svg/${name}.svg) center / contain no-repeat content-box`;
    return (
        <span
            aria-hidden
            className={clsx("block bg-current", className)}
            style={{ mask, WebkitMask: mask }}
        />
    );
}
