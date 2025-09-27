"use client";
import { pathnameAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function HeaderListitem() {
    const pathname = usePathname();
    const [localPrevPathname, setLocalPrevPathname] = useState(pathname);

    useEffect(() => {
        let mode: "clear" | "append" = "clear";
        const test = setInterval(() => {
            setLocalPrevPathname((prev) => {
                if (prev.length === 1 || pathname.startsWith(prev)) {
                    mode = "append";
                }
                if (mode === "append" && prev === pathname) {
                    clearInterval(test);
                    return prev;
                }
                switch (mode) {
                    case "clear":
                        return prev.substring(0, prev.length - 1);
                    case "append":
                        return pathname.substring(0, prev.length + 1);
                }
            });
        }, 100);
        return () => {
            clearInterval(test);
        };
    }, [pathname]);
    return (
        <span className="tracking-wider typewriter -ml-2">
            &gt;/{localPrevPathname.substring(1)}
        </span>
    );
}
