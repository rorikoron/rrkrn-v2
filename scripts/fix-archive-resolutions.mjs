// アーカイブ写真のファイル名に入っている解像度 (…_1920x1080.webp) を、実際の画像サイズに合わせてリネームする。
// トリミングしたのにファイル名が元の解像度のまま、というズレを直すための一回きりのスクリプト。
//
//   node --no-warnings scripts/fix-archive-resolutions.mjs          … 変更内容を表示するだけ (dry run)
//   node --no-warnings scripts/fix-archive-resolutions.mjs --apply  … 実際にリネームする
// (--no-warnings は .ts を直接 import するときの警告を消すだけ)
//
// R2 にはリネームがないので「新しい名前で put → 確認 → 古い名前を delete」で行う。
// delete の前に元ファイルを .archive-backup/ に保存しておく。
import { getPlatformProxy } from "wrangler";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { readImageSize } from "../src/lib/imageSize.ts";

const apply = process.argv.includes("--apply");
const HEADER_BYTES = 64 * 1024;
const SIZE_IN_NAME = /_(\d+)x(\d+)(\.\w+)$/;

async function readSize(bucket, object) {
    const head = await bucket.get(object.key, { range: { offset: 0, length: HEADER_BYTES } });
    const size = head && readImageSize(new Uint8Array(await head.arrayBuffer()));
    if (size || object.size <= HEADER_BYTES) return size;
    const whole = await bucket.get(object.key);
    return whole && readImageSize(new Uint8Array(await whole.arrayBuffer()));
}

function renamedKey(key, { width, height }) {
    return SIZE_IN_NAME.test(key)
        ? key.replace(SIZE_IN_NAME, `_${width}x${height}$3`)
        : key.replace(/(\.\w+)$/, `_${width}x${height}$1`);
}

const { env, dispose } = await getPlatformProxy();
const bucket = env.ARCHIVE_BUCKET;

try {
    const objects = [];
    let cursor;
    do {
        const listed = await bucket.list({ cursor });
        objects.push(...listed.objects);
        cursor = listed.truncated ? listed.cursor : undefined;
    } while (cursor);

    const existing = new Set(objects.map((o) => o.key));
    const renames = [];
    const unreadable = [];

    for (const object of objects) {
        const size = await readSize(bucket, object);
        if (!size) {
            unreadable.push(object.key);
            continue;
        }
        const to = renamedKey(object.key, size);
        if (to !== object.key) renames.push({ from: object.key, to });
    }

    console.log(`${objects.length} 枚中 ${renames.length} 枚のファイル名がズレています\n`);
    for (const { from, to } of renames) console.log(`  ${from}\n→ ${to}\n`);
    if (unreadable.length) {
        console.log(`サイズを読めなかったファイル (そのままにします):`);
        for (const key of unreadable) console.log(`  ${key}`);
    }

    const collisions = renames.filter(({ to }) => existing.has(to));
    if (collisions.length) {
        console.error(`\n新しい名前が既存のファイルとぶつかるので中止します:`);
        for (const { to } of collisions) console.error(`  ${to}`);
        process.exitCode = 1;
    } else if (!apply) {
        if (renames.length) console.log(`\ndry run です。リネームするには --apply を付けて実行してください`);
    } else {
        const backupDir = path.join(".archive-backup", new Date().toISOString().replace(/[:.]/g, "-"));
        for (const { from, to } of renames) {
            const original = await bucket.get(from);
            const body = new Uint8Array(await original.arrayBuffer());

            const backupPath = path.join(backupDir, from);
            await mkdir(path.dirname(backupPath), { recursive: true });
            await writeFile(backupPath, body);

            await bucket.put(to, body, {
                httpMetadata: original.httpMetadata,
                customMetadata: original.customMetadata,
            });
            const copied = await bucket.head(to);
            if (copied?.size !== body.byteLength) {
                throw new Error(`${to} のアップロードを確認できませんでした。${from} は消していません`);
            }
            await bucket.delete(from);
            console.log(`renamed ${from} → ${to}`);
        }
        console.log(`\n完了。元ファイルは ${backupDir} にあります`);
    }
} finally {
    await dispose();
}
