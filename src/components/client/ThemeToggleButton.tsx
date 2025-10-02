"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const STORAGE_KEY = "rorikoron-toggle";

export default function ThemeToggleButton() {
    const [isToggled, setIsToggled] = useState(false);

    // マウント時にローカルストレージを読み込む
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
            setIsToggled(stored === "true");
        }
    }, []);

    useEffect(() => {
        if (isToggled) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isToggled]);

    // トグル処理
    const handleToggle = () => {
        setIsToggled((prev) => {
            const newValue = !prev;
            localStorage.setItem(STORAGE_KEY, String(newValue));
            return newValue;
        });
    };

    return (
        <button
            onClick={handleToggle}
            className={`px-4 py-3 rounded-full block transition-all ${
                isToggled
                    ? "bg-accent hover:brightness-60"
                    : "outline-2 hover:bg-foreground/60"
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
