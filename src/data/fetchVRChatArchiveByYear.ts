import { r2 } from "@/lib/r2-client"
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"

export interface VRChatArchiveInterface{
    year: number,
    page?: number,
    per?: number
}

export default async function fetchVRChatArchiveByYear({year, page, per}: VRChatArchiveInterface){
    const result = await r2.send(
        new ListObjectsV2Command({
        Bucket: process.env.R2_ARCHIVE_BUCKET,
        Prefix: year + '/',
    })
  )
  if (!result.Contents) return [];

  // make it api source
  return result.Contents.map(({Key}) => `https://archive.rorikoron.net/${Key}`);
}