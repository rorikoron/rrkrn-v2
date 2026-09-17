import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getBoothBucket(): Promise<R2Bucket> {
  const { env } = await getCloudflareContext({ async: true });
  return env.BOOTH_BUCKET;
}

export async function getArchiveBucket(): Promise<R2Bucket> {
  const { env } = await getCloudflareContext({ async: true });
  return env.ARCHIVE_BUCKET;
}
