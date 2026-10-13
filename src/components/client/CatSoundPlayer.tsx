"use client";
import { useCallback, useRef } from "react";

// 10回まではランダムに鳴き、11回目だけ特別な声。それ以降は鳴かない
const MAX_PLAYS = 10;

interface CatSoundPlayerInterface {
    command: string;
}
export default function CatSoundPlayer({ command }: CatSoundPlayerInterface) {
    const count = useRef(0);
    const tracks = useRef<Record<number, HTMLAudioElement>>({});

    const playSound = useCallback(() => {
        if (count.current > MAX_PLAYS) return;
        const i = count.current !== MAX_PLAYS ? Math.floor(Math.random() * 2 + 1) : 3;

        if (!tracks.current[i]) {
            tracks.current[i] = new Audio(`/sounds/cat_${i}.mp3`);
        }
        count.current++;
        tracks.current[i].play().catch((err) => {
            console.error("音声再生に失敗:", err);
        });
    }, []);
    return (
        <button
            type="button"
            aria-label={`$${command} (猫の鳴き声を鳴らす)`}
            className="absolute top-6 -left-6 bg-surface px-2 border-foreground border-2 z-10 select-none cursor-pointer"
            onClick={playSound}
        >
            <span className="pr-1">$</span>{command}
        </button>
    );
}
