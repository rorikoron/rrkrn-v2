"use client";
import BashWindow from "@/components/ui/BashWindow";
import AsciiArt from "@/components/ui/AsciiArt";
import { useEffect, useRef, useState } from "react";
import HoverFlipButton from "@/components/ui/HoverFlipButton";

/** 画面の端で跳ね返りながら動くウィンドウの位置と速度 (px, px/frame) */
type Body = {
    x: number;
    y: number;
    vx: number;
    vy: number;
};

// 動きを減らす設定のときに、ずらして重ねる幅
const CASCADE_STEP = 24;

interface AsciiWindowContainerInterface {
    className?: string;
}
export default function AsciiWindowContainer({
    className,
}: AsciiWindowContainerInterface) {
    // React が持つのはウィンドウの一覧だけ。位置は毎フレーム変わるので ref に持ち、
    // style.transform を直接書き換える (state にすると毎フレーム再描画になる)
    const [ids, setIds] = useState<number[]>([]);
    const nextId = useRef(0);
    const bodies = useRef(new Map<number, Body>());
    const elements = useRef(new Map<number, HTMLDivElement>());
    const hasWindows = ids.length > 0;

    // ウィンドウがある間だけアニメーションを回す
    useEffect(() => {
        if (!hasWindows) return;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let frameId = requestAnimationFrame(function update() {
            const maxW = window.innerWidth;
            const maxH = window.innerHeight;
            for (const [id, body] of bodies.current) {
                const el = elements.current.get(id);
                if (!el) continue;
                const w = el.offsetWidth;
                const h = el.offsetHeight;

                body.x += body.vx;
                body.y += body.vy;
                if (body.x < 0 || body.x + w > maxW) {
                    body.vx = -body.vx;
                    body.x = Math.max(0, Math.min(body.x, maxW - w));
                }
                if (body.y < 0 || body.y + h > maxH) {
                    body.vy = -body.vy;
                    body.y = Math.max(0, Math.min(body.y, maxH - h));
                }
                el.style.transform = `translate(${body.x}px, ${body.y}px)`;
            }
            frameId = requestAnimationFrame(update);
        });
        return () => cancelAnimationFrame(frameId);
    }, [hasWindows]);

    // 新しいウィンドウ追加
    const addWindow = () => {
        const id = nextId.current++;
        const offset = id * CASCADE_STEP;
        bodies.current.set(id, {
            x: offset,
            y: offset,
            vx: Math.random() + 1,
            vy: Math.random() + 1,
        });
        setIds((prev) => [...prev, id]);
    };

    return (
        <div className={className}>
            <button type="button" className="cursor-pointer" onClick={addWindow}>
                <HoverFlipButton
                    frontLabel="開発中ボタン"
                    rearLabel="押しちゃだめ"
                    frontIcon="warning"
                    rearIcon="do-not-touch"
                />
            </button>
            {ids.map((id) => (
                <div
                    key={id}
                    ref={(el) => {
                        if (!el) {
                            elements.current.delete(id);
                            return;
                        }
                        // 初めて付いたときだけ初期位置に置く。以降はアニメーションが書き換える
                        // (ref は再描画のたびに付け直されるので、要素側に位置があるかで判断する)
                        if (!el.style.transform) {
                            const body = bodies.current.get(id);
                            if (body) el.style.transform = `translate(${body.x}px, ${body.y}px)`;
                        }
                        elements.current.set(id, el);
                    }}
                    className="fixed left-0 top-0"
                >
                    <BashWindow
                        title={
                            <div className="-ml-12">
                                <p>☻ You are an Idiot</p>
                                <p>----v---------------</p>
                            </div>
                        }
                        hasClose
                        // 閉じようとすると増える
                        closeHandler={addWindow}
                    >
                        <AsciiArt />
                    </BashWindow>
                </div>
            ))}
        </div>
    );
}
