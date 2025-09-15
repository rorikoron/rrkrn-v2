"use client";
import { pathnameAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function HeaderListitem() {
    const pathname = usePathname();
    const prevPathname = useAtomValue(pathnameAtom);
    const [localPrevPathname, setLocalPrevPathname] = useState(prevPathname);

    useEffect(() => {
        let mode: "clear" | "append" = "clear";
        const test = setInterval(() => {
            setLocalPrevPathname((prev) => {
                if (prev.length === 1) {
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
        <span className="typewriter">
            &gt; /{localPrevPathname.substring(1)}
        </span>
    );
}
