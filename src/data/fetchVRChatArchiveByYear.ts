import { getArchiveBucket } from "@/lib/r2-client"
import { readImageSize } from "@/lib/imageSize"

export interface VRChatArchiveInterface{
    year: number,
}

export interface ArchivePhoto {
    src: string,
    // ヘッダーが読めなかった画像は undefined
    width?: number,
    height?: number,
}

// JPEG は EXIF が大きいとサイズ情報が後ろにずれるので、読めなければ全体を取り直す
const HEADER_BYTES = 64 * 1024

// ファイル名の "…_1920x1080.webp" から縦横を読む。
// 名前と中身のズレは scripts/fix-archive-resolutions.mjs で直す
export function parseSizeFromKey(key: string) {
  const match = key.match(/_(\d+)x(\d+)\.\w+$/)
  return match ? { width: Number(match[1]), height: Number(match[2]) } : null
}

async function fetchImageSize(bucket: R2Bucket, key: string) {
  const fromName = parseSizeFromKey(key)
  if (fromName) return fromName

  // 名前にサイズがない画像だけ、R2 から先頭を読んで調べる
  const head = await bucket.get(key, { range: { offset: 0, length: HEADER_BYTES } })
  if (!head) return null
  const size = readImageSize(new Uint8Array(await head.arrayBuffer()))
  if (size || head.size <= HEADER_BYTES) return size

  const whole = await bucket.get(key)
  return whole ? readImageSize(new Uint8Array(await whole.arrayBuffer())) : null
}

const archiveUrl = (key: string) => `https://archive.rorikoron.net/${key}`

// URL だけ欲しいとき用。画像サイズは読まないので軽い
export async function fetchVRChatArchiveUrlsByYear({year}: VRChatArchiveInterface): Promise<string[]>{
  try {
    const bucket = await getArchiveBucket()
    const listed = await bucket.list({ prefix: year + "/" })
    return listed.objects.map((object) => archiveUrl(object.key))
  } catch (err) {
    console.error(`Failed to fetch VRChat archive for year ${year}:`, err);
    return [];
  }
}

export default async function fetchVRChatArchiveByYear({year}: VRChatArchiveInterface): Promise<ArchivePhoto[]>{
  try {
    const bucket = await getArchiveBucket()
    const listed = await bucket.list({ prefix: year + "/" })

    return await Promise.all(
      listed.objects.map(async (object) => {
        const size = await fetchImageSize(bucket, object.key).catch(() => null)
        return {
          src: archiveUrl(object.key),
          ...size,
        }
      })
    )
  } catch (err) {
    console.error(`Failed to fetch VRChat archive for year ${year}:`, err);
    return [];
  }
}
