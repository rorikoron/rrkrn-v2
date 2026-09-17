import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function d1Query<T = Record<string, unknown>>(
  sql: string,
  params: (string | number | null)[] = []
): Promise<T[]> {
  const { env } = await getCloudflareContext({ async: true });
  const { results } = await env.BOOTH_ITEM_LIST.prepare(sql)
    .bind(...params)
    .all<T>();
  return results;
}
