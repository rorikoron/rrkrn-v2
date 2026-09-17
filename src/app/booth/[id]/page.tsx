import { notFound } from "next/navigation";
import fetchBoothItemById from "@/data/fetchBoothItemById";
import BoothItemCard from "@/components/client/BoothItemCard";

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
