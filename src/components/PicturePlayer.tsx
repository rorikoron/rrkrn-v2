import fs from "fs/promises";
import path from "path";
import PictureItem from "./PictureItem";
import { Zen_Kaku_Gothic_Antique } from "next/font/google";
const zenkaku = Zen_Kaku_Gothic_Antique({
    subsets: ["latin"],
    weight: "500",
});

async function findPngs(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const results: string[] = [];

    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...(await findPngs(full)));
        } else if (entry.isFile() && /\.(jpg|png)$/i.test(entry.name)) {
            const rel = path
                .relative(path.join(process.cwd(), "public"), full)
                .split(path.sep)
                .join("/");
            results.push(`/${rel}`);
        }
    }
    return results;
}

interface PicturePlayerInterface {
    className?: string;
    directry: string;
}
export default async function PicturePlayer({
    className,
    directry,
}: PicturePlayerInterface) {
    const targetDir = path.join(process.cwd(), "public", directry);
    const pngs = await findPngs(targetDir);

    return (
        <div
            className={`bg-gradient-to-b from-foreground-tint to-foreground text-accent ${className} ${zenkaku.className} flex flex-col gap-6 rounded-t-xl`}
        >
            <PictureItem pngs={pngs} />
        </div>
    );
}
