"use client";

import Image from "next/image";
import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "rorikoron-toggle";

function subscribe(callback: () => void) {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
    return localStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot() {
    return false;
}

export default function ThemeToggleButton() {
    // ローカルストレージ(外部の可変ストア)を安全に読むため useSyncExternalStore を使用
    const isToggled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isToggled);
    }, [isToggled]);

    // トグル処理
    const handleToggle = () => {
        localStorage.setItem(STORAGE_KEY, String(!isToggled));
        // "storage" イベントは変更元のタブでは発火しないため手動で通知する
        window.dispatchEvent(new Event("storage"));
    };

    return (
        <button
            onClick={handleToggle}
            className={`px-3 py-3 rounded-full block transition-all cursor-pointer ${
                isToggled
                    ? "bg-accent hover:brightness-60"
                    : "outline-2 hover:bg-primary-strong/60"
            }`}
        >
            <Image
                src={"/svg/moon.svg"}
                height={20}
                width={20}
                alt="Darkmode button"
            />
        </button>
    );
}
