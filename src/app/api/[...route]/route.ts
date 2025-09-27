import { Env, ExecutionContext, Hono } from 'hono'
import fetchBoothVRChatItem from '@/data/fetchBoothVRChatItem';
import { z } from "zod";

import { handle } from "hono/vercel";
// Hono app を定義
const AirtableRecordSchema = z.object({
  id: z.string(),
  fields: z.record(z.string(), z.any()),
});
const AirtableResponseSchema = z.object({
  records: z.array(AirtableRecordSchema),
});

const api = new Hono().basePath("/api").get("/items", async (c) => {
    const res = await fetchBoothVRChatItem();
    const parsed = AirtableResponseSchema.safeParse(res);
    return c.json(parsed)
});

export const GET = handle(api);
export type HonoAppType = typeof api;