import { Hono } from 'hono'
import fetchBoothItems from '@/data/fetchBoothItems';
import { fetchVRChatArchiveAvailableYears } from '@/data/fetchVRChatArchiveAvailableYears';
import fetchVRChatArchiveByYear from '@/data/fetchVRChatArchiveByYear';

// GET の結果を ISR でキャッシュし、月に一度作り直す。
// パスは初めて来たときに生成してキャッシュする (generateStaticParams なし)
export const dynamic = "force-static";
export const revalidate = 2592000; // 30日

// ブラウザ・CDN にも同じ期間だけ持たせる。期限切れ後は裏で取り直す間、古いものを返してよい
const MONTHLY_CACHE = {
  "Cache-Control": `public, max-age=${revalidate}, stale-while-revalidate=86400`,
};

const archive_router = new Hono().get("/", async (c) => {
  const years = await fetchVRChatArchiveAvailableYears();
  return c.json(years, 200, MONTHLY_CACHE);
}).get(":year", async (c) => {
    const year = c.req.param("year");
    const res = ((await fetchVRChatArchiveByYear({year: Number(year)})));
    return c.json(res, 200, MONTHLY_CACHE);
})

const api = new Hono().basePath("/api").onError((err, c) => {
    console.error(`Unhandled error on ${c.req.method} ${c.req.path}:`, err);
    return c.json({ error: "Internal Server Error" }, 500);
}).get("/items", async (c) => {
    const items = await fetchBoothItems();
    return c.json(items, 200, MONTHLY_CACHE);
}).route("/archive", archive_router);

// hono/vercel の handle(api) で受け取った request をそのまま渡さないのは、force-static では
// それが Next の Proxy で、Workers だと Proxy 越しに request.method を読んだ時点で
// "Illegal invocation" で落ちるから。force-dynamic で Proxy を外さないのは、ISR のキャッシュを残したいから。
export const GET = (req: Request) => api.fetch(new Request(req.url));
export type AppType = typeof api;
