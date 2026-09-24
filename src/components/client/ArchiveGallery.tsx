"use client";
import AnimatedMagnifiableImage from "@/components/ui/AnimatedMagnifiableImage";
import BashWindow from "@/components/ui/BashWindow";
import type { ArchivePhoto } from "@/data/fetchVRChatArchiveByYear";
import { distributeToColumns } from "@/util";
import clsx from "clsx";
import { RefObject, startTransition, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";

export interface YearArchive {
    year: string;
    photos: ArchivePhoto[];
}

// レーン1本の最小幅。これを下回らない範囲でレーンを増やす
const MIN_LANE_WIDTH = 240;
const MIN_LANES = 2;
const MAX_LANES = 6;

// 先頭レーンの頭の年見出しと、最後のレーンの頭の grep ウィンドウの高さ (レーン幅比のおおよそ)。
// 写真の積み方をこの分だけずらして、レーンの下端がそろうようにする
const HEADING_HEIGHT = 0.4;
const PICKER_OVERHANG = 0.5;

// 画面幅ではなく実際の表示幅で決める (lg 以上はサイドバーの分だけ狭いので)。
// n レーンに必要な幅は n * MIN_LANE_WIDTH + (n - 1) * gap なので、それが収まる最大の n を取る。
// gap は画面幅で変わる (gap-x-2 / md:gap-x-4) ので実際のスタイルから読む
function useLaneCount(ref: RefObject<HTMLElement | null>) {
    const [count, setCount] = useState<number | null>(null);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const update = () => {
            const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
            const fits = Math.floor((el.clientWidth + gap) / (MIN_LANE_WIDTH + gap));
            setCount(Math.min(MAX_LANES, Math.max(MIN_LANES, fits)));
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, [ref]);
    return count;
}

function subscribeHash(onChange: () => void) {
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
}
const readHash = () => decodeURIComponent(location.hash.slice(1));

function PhotoLane({ photos }: { photos: ArchivePhoto[] }) {
    return photos.map((photo) => (
        <AnimatedMagnifiableImage key={photo.src} src={photo.src} width={photo.width} height={photo.height} />
    ));
}

function YearHeading({ year, count }: { year: string; count: number }) {
    return (
        <div className="text-right pb-2 md:pb-4">
            <h2 className="text-4xl md:text-6xl font-light tracking-wider">{year}</h2>
            <p className="mt-2 md:mt-3 text-sm tracking-wider">-c {count}まい</p>
        </div>
    );
}

// 「$ grep 2026」で年を絞り込むウィンドウ。年が増えたら中でスクロールする
function YearPicker({
    years,
    selected,
    onSelect,
}: {
    years: string[];
    selected: string;
    onSelect: (year: string) => void;
}) {
    const activeRef = useRef<HTMLLIElement>(null);
    useEffect(() => {
        activeRef.current?.scrollIntoView({ block: "nearest" });
    }, [selected]);

    return (
        <BashWindow command="grep" className="!px-2 !py-4 md:!p-6 ml-6">
            <ul className="h-28 md:h-40 mt-10 md:mt-8 px-6 md:px-8 overflow-y-auto snap-y [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-col items-center gap-2 md:gap-4">
                {years.map((year) => (
                    <li key={year} ref={year === selected ? activeRef : undefined} className="snap-center">
                        {/* ホバーで「>」が出て少し右へずれる。選択中の年は「>」が出たまま */}
                        <button
                            className={clsx(
                                "relative text-2xl md:text-3xl tracking-wider transition-all duration-200",
                                "before:content-['>'] before:absolute before:-left-5 md:before:-left-6 before:transition-all before:duration-200",
                                year === selected
                                    ? "text-active translate-x-2 pointer-events-none"
                                    : "cursor-pointer before:opacity-0 before:-translate-x-2 hover:translate-x-2 hover:text-active/70 hover:before:opacity-100 hover:before:translate-x-0"
                            )}
                            onClick={() => onSelect(year)}
                        >
                            {year}
                        </button>
                    </li>
                ))}
            </ul>
        </BashWindow>
    );
}

export default function ArchiveGallery({ archives }: { archives: YearArchive[] }) {
    const years = archives.map(({ year }) => year);
    // #2025 のようなリンクで来たらその年を開く。選び直したらそちらを優先する
    const hashYear = useSyncExternalStore(subscribeHash, readHash, () => "");
    const [picked, setPicked] = useState<string | null>(null);
    const selected = picked ?? (years.includes(hashYear) ? hashYear : years[0]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const laneCount = useLaneCount(gridRef);

    const select = (year: string) => {
        // View Transition のオーバーレイはスクロール領域のクリップを無視するので、先に先頭へ戻す
        scrollRef.current?.scrollTo({ top: 0 });
        history.replaceState(null, "", "#" + year);
        startTransition(() => setPicked(year));
    };

    const photos = archives.find(({ year }) => year === selected)?.photos ?? [];
    const lanes = laneCount ?? MIN_LANES;
    const initialHeights = Array.from({ length: lanes }, (_, i) =>
        i === 0 ? HEADING_HEIGHT : i === lanes - 1 ? PICKER_OVERHANG : 0
    );
    const columns = laneCount ? distributeToColumns(photos, lanes, initialHeights) : [];

    return (
        <div ref={scrollRef} className="relative z-1 h-full overflow-y-auto px-6 md:px-8 py-6 md:py-12">
            {/* 1行目: タイトル (最後のレーン以外) と grep ウィンドウ (最後のレーン)。
                2行目: 先頭レーンの頭に年見出し、そこから写真。レーン数が決まるまでは隠しておく */}
            <div
                ref={gridRef}
                className={clsx("grid gap-x-2 md:gap-x-4 items-start", !laneCount && "invisible")}
                style={{ gridTemplateColumns: `repeat(${lanes}, minmax(0, 1fr))` }}
            >
                <h1
                    className="row-start-1 self-center text-[42px] md:text-[64px] font-bold tracking-wide leading-none pl-2 pt-4 pb-8 md:pt-6 md:pb-12"
                    style={{ gridColumn: `1 / ${lanes}` }}
                >
                    Archive
                </h1>
                <div
                    className="row-start-1 row-span-2 flex flex-col gap-4 md:gap-6"
                    style={{ gridColumn: lanes }}
                >
                    <div className="self-end pt-4 mb-4">
                        <YearPicker years={years} selected={selected} onSelect={select} />
                    </div>
                    <PhotoLane photos={columns[lanes - 1] ?? []} />
                </div>
                {Array.from({ length: lanes - 1 }, (_, i) => (
                    <div
                        key={i}
                        className="row-start-2 flex flex-col gap-4 md:gap-6"
                        style={{ gridColumn: i + 1 }}
                    >
                        {i === 0 && <YearHeading year={selected} count={photos.length} />}
                        <PhotoLane photos={columns[i] ?? []} />
                    </div>
                ))}
            </div>
        </div>
    );
}
