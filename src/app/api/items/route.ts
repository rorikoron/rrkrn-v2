import fetchBoothVRChatItem from "@/lib/fetchBoothVRChatItem";

export async function GET() {
  const item = await fetchBoothVRChatItem();
  console.log(item)
  if (!item) return new Response("Not found", { status: 404 });
  return Response.json(item);
}
