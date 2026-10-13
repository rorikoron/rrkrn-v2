"use client";

import Icon from "@/components/ui/Icon";
import { prefersDark, THEME_CHANGE_EVENT, THEME_STORAGE_KEY } from "@/lib/theme";
import { useSyncExternalStore } from "react";

// .dark の付け外しはここと layout の <head> のスクリプトだけが行う。
// 表示は <html> のクラスから読むので、描画前に付いたクラスとずれない
function subscribe(callback: () => void) {
    // 他のタブで切り替えたら、このタブにも反映する
    const onStorage = (e: StorageEvent) => {
        if (e.key !== THEME_STORAGE_KEY) return;
        document.documentElement.classList.toggle("dark", prefersDark());
        callback();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(THEME_CHANGE_EVENT, callback);
    return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(THEME_CHANGE_EVENT, callback);
    };
}

function getSnapshot() {
    return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
    return false;
}

export default function ThemeToggleButton() {
    const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const handleToggle = () => {
        const next = !isDark;
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem(THEME_STORAGE_KEY, String(next));
        window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            aria-label="ダークモード"
            aria-pressed={isDark}
            // 見た目は dark: で切り替える。state で分けると、ハイドレーションまでの間ライトの見た目になる
            className="px-3 py-3 rounded-full block transition-all cursor-pointer outline-2 hover:bg-primary-wash/60 dark:outline-0 dark:bg-accent dark:text-background dark:hover:brightness-60"
        >
            <Icon name="moon" className="size-5" />
        </button>
    );
}
