"use client";
import { useCallback, useRef } from "react";

interface CatSoundPlayerInterface {
    command: string;
}
export default function CatSoundPlayer({ command }: CatSoundPlayerInterface) {
    const count = useRef(0);
    const trakcs = useRef<Record<number, HTMLAudioElement>>({});

    const playSound = useCallback(() => {
        if (count.current > 10) return;
        const i = count.current !== 10 ? Math.floor(Math.random() * 2 + 1) : 3;

        if (!trakcs.current[i]) {
            trakcs.current[i] = new Audio(`/sounds/cat_${i}.mp3`);
        }
        count.current++;
        trakcs.current[i].play().catch((err) => {
            console.error("音声再生に失敗:", err);
        });
    }, []);
    return (
        <span
            className="absolute top-6 -left-6 bg-background-sub px-2 text-md border-foreground border-2 z-10 select-none"
            onClick={playSound}
        >
            $ {command}
        </span>
    );
}
