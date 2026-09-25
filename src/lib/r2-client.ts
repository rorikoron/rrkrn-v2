import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getArchiveBucket(): Promise<R2Bucket> {
  const { env } = await getCloudflareContext({ async: true });
  return env.ARCHIVE_BUCKET;
}
