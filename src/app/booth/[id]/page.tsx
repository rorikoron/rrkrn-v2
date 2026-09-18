import { notFound } from "next/navigation";
import fetchBoothItemById from "@/data/fetchBoothItemById";
import BoothItemCard from "@/components/client/BoothItemCard";

// 更新頻度は低い(月1回程度)がタイミングは不定なのでISRで追従
export const revalidate = 86400;

export default async function BoothItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const item = await fetchBoothItemById(id);
    if (!item) notFound();

    return <BoothItemCard item={item} />;
}
