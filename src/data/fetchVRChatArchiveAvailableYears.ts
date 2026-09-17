import { getArchiveBucket } from "@/lib/r2-client"

export async function fetchVRChatArchiveAvailableYears(): Promise<string[]> {
  try {
    const bucket = await getArchiveBucket()
    const listed = await bucket.list({ delimiter: "/" })

    // "2023/" → "2023"
    return listed.delimitedPrefixes
      .filter((prefix) => prefix.length > 0)
      .map((prefix) => (prefix.endsWith("/") ? prefix.slice(0, -1) : prefix))
  } catch (err) {
    console.error("Failed to fetch VRChat archive available years:", err);
    return []
  }
}
