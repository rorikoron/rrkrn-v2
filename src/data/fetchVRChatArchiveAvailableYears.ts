import { r2 } from "@/lib/r2-client"
import { ListObjectsV2Command } from "@aws-sdk/client-s3"

export async function fetchVRChatArchiveAvailableYears(): Promise<string[]> {
  const res = await r2.send(
    // find root directory
    new ListObjectsV2Command({
      Bucket: process.env.R2_ARCHIVE_BUCKET,
      Delimiter: "/",
      Prefix: "",
    })
  )

  return (
    res.CommonPrefixes?.map((prefixObj) => {
      const prefix = prefixObj.Prefix ?? ""

       // "2023/" → "2023"
      return prefix.endsWith("/") ? prefix.slice(0, -1) : prefix
    }) ?? []
  )
}