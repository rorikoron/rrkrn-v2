import fetchBoothVRChatItem from "@/data/fetchBoothVRChatItem";
import { Hono } from "hono";
import { z } from "zod";

// ここにrecordのスキーマを定義？用検討
const AirtableRecordSchema = z.object({
  id: z.string(),
  fields: z.record(z.string(), z.any()),
});
const AirtableResponseSchema = z.object({
  records: z.array(AirtableRecordSchema),
});

const app = new Hono().basePath("/api").get("/items", async (c) => {
    const res = await fetchBoothVRChatItem();
    const parsed = AirtableResponseSchema.safeParse(res);
    console.log(parsed)
    return c.json(parsed)
});


export const GET = app.fetch;
export type HonoAppType = typeof app;