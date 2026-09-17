import { getArchiveBucket } from "@/lib/r2-client"

export interface VRChatArchiveInterface{
    year: number,
}

export default async function fetchVRChatArchiveByYear({year}: VRChatArchiveInterface){
  try {
    const bucket = await getArchiveBucket()
    const listed = await bucket.list({ prefix: year + "/" })

    return listed.objects.map((object) => `https://archive.rorikoron.net/${object.key}`);
  } catch (err) {
    console.error(`Failed to fetch VRChat archive for year ${year}:`, err);
    return [];
  }
}
