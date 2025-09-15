"use client";
import BashWindow from "@/components/BashWindow";
import AsciiArt from "@/components/AsciiArt";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import HoverFlipButton from "./HoverFlipButton";

type WindowState = {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    w: number;
    h: number;
};

interface AsciiWindowContainerInterface {
    className?: string;
}
export default function AsciiWindowContainer({
    className,
}: AsciiWindowContainerInterface) {
    const [windows, setWindows] = useState<WindowState[]>([]);
    const refs = useRef<Map<number, HTMLDivElement>>(new Map());

    // サイズ計測
    useLayoutEffect(() => {
        setWindows((prev) =>
            prev.map((w) => {
                const el = refs.current.get(w.id);
                if (el) {
                    return {
                        ...w,
                        w: el.offsetWidth,
                        h: el.offsetHeight,
                    };
                }
                return w;
            })
        );
    }, [windows.length]);

    // アニメーション更新
    useEffect(() => {
        let frameId: number;

        const update = () => {
            setWindows((prev) =>
                prev.map((win) => {
                    let { x, y, vx, vy, w, h } = win;

                    const maxW = window.innerWidth;
                    const maxH = window.innerHeight;

                    x += vx;
                    y += vy;

                    if (x < 0 || x + w > maxW) {
                        vx = -vx;
                        x = Math.max(0, Math.min(x, maxW - w));
                    }
                    if (y < 0 || y + h > maxH) {
                        vy = -vy;
                        y = Math.max(0, Math.min(y, maxH - h));
                    }

                    return { ...win, x, y, vx, vy };
                })
            );
            frameId = requestAnimationFrame(update);
        };

        frameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId);
    }, []);

    // 新しいウィンドウ追加
    const addWindow = () => {
        console.log("test");
        setWindows((prev) => [
            ...prev,
            {
                id: prev.length,
                x: 100,
                y: 100,
                vx: Math.random() + 1,
                vy: Math.random() + 1,
                w: 200, // 仮サイズ（後で計測で更新）
                h: 150,
            },
        ]);
    };

    return (
        <div className={className}>
            <button className="cursor-pointer" onClick={addWindow}>
                <HoverFlipButton
                    frontLabel="開発中ボタン"
                    rearLabel="さわっちゃだめ"
                    frontIcon="warning"
                    rearIcon="do-not-touch"
                />
            </button>
            {windows.map((w) => (
                <div
                    key={w.id}
                    ref={(el) => {
                        if (el) refs.current.set(w.id, el);
                    }}
                    className="absolute z-11"
                    style={{
                        left: w.x,
                        top: w.y,
                    }}
                >
                    <BashWindow
                        title={
                            <div className="-ml-12">
                                <p>☻ You are an Idiot</p>
                                <p>----v---------------</p>
                            </div>
                        }
                        output={
                            <div>
                                <AsciiArt />
                            </div>
                        }
                        hasClose
                        closeHandler={addWindow}
                    />
                </div>
            ))}
        </div>
    );
}
