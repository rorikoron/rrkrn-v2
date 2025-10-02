import { Hono } from 'hono'
import fetchBoothVRChatItem from '@/data/fetchBoothVRChatItem';
import { z } from "zod";

import { handle } from "hono/vercel";
import { fetchVRChatArchiveAvailableYears } from '@/data/fetchVRChatArchiveAvailableYears';
import fetchVRChatArchiveByYear from '@/data/fetchVRChatArchiveByYear';
import { hc } from 'hono/client';
// Hono app を定義
const AirtableRecordSchema = z.object({
  id: z.string(),
  fields: z.record(z.string(), z.any()),
});
const AirtableResponseSchema = z.object({
  records: z.array(AirtableRecordSchema),
});

const archive_router = new Hono().get("/", async (c) => {
  const years = await fetchVRChatArchiveAvailableYears();
  return c.json(years);
}).get(":year", async (c) => {
    const year = c.req.param("year");
    const res = ((await fetchVRChatArchiveByYear({year: Number(year)})));
    return c.json(res);
})

const api = new Hono().basePath("/api").get("/items", async (c) => {
    const res = await fetchBoothVRChatItem();
    const parsed = AirtableResponseSchema.safeParse(res);
    return c.json(parsed)
}).route("/archive", archive_router);

export const GET = handle(api);
type AppType = typeof api;
export const client = hc<AppType>(process.env.NEXT_PUBLIC_BASE_URL ?? "");