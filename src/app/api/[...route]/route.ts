import { Hono } from 'hono'
import fetchBoothItems from '@/data/fetchBoothItems';
import { handle } from "hono/vercel";
import { fetchVRChatArchiveAvailableYears } from '@/data/fetchVRChatArchiveAvailableYears';
import fetchVRChatArchiveByYear from '@/data/fetchVRChatArchiveByYear';
import { getBoothBucket } from '@/lib/r2-client';

const IMMUTABLE_CACHE = { "Cache-Control": "public, max-age=31536000, immutable" };
const DAILY_CACHE = { "Cache-Control": "public, max-age=86400" };

const archive_router = new Hono().get("/", async (c) => {
  const years = await fetchVRChatArchiveAvailableYears();
  return c.json(years, 200, IMMUTABLE_CACHE);
}).get(":year", async (c) => {
    const year = c.req.param("year");
    const res = ((await fetchVRChatArchiveByYear({year: Number(year)})));
    return c.json(res, 200, IMMUTABLE_CACHE);
})

const api = new Hono().basePath("/api").onError((err, c) => {
    console.error(`Unhandled error on ${c.req.method} ${c.req.path}:`, err);
    return c.json({ error: "Internal Server Error" }, 500);
}).get("/items", async (c) => {
    const items = await fetchBoothItems();
    return c.json(items, 200, DAILY_CACHE);
}).get("/images/:key{.+}", async (c) => {
    const key = decodeURIComponent(c.req.param("key"));

    try {
      const bucket = await getBoothBucket();
      const object = await bucket.get(key);
      if (!object || !object.body) return c.notFound();

      return c.body(object.body, 200, {
        "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      });
    } catch (err) {
      console.error(`Failed to load R2 object "${key}":`, err);
      return c.notFound();
    }
}).route("/archive", archive_router);

export const GET = handle(api);
export type AppType = typeof api;
