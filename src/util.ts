import fs from "fs/promises";
import path from "path";




async function fetchPics(dir: string, regexp: RegExp = /\.(jpg|png)$/i): Promise<string[]> {
    const targetDir = path.join(process.cwd(), "public", dir);
    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    const results: string[] = [];

    for (const entry of entries) {
        const full = path.join(targetDir, entry.name);

        // ignore directory
        if (entry.isDirectory()) continue;

        if (entry.isFile() && regexp.test(entry.name)) {
            const rel = path
                .relative(path.join(process.cwd(), "public"), full)
                .split(path.sep)
                .join("/");
            results.push(`/${rel}`);
        }
    }
    return results;
}

export {
    fetchPics
}