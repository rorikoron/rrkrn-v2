import { notFound } from "next/navigation";
import fetchBoothItemById from "@/data/fetchBoothItemById";
import fetchBoothItems from "@/data/fetchBoothItems";
import BoothItemCard from "@/components/client/BoothItemCard";

export default async function BoothItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [item, items] = await Promise.all([
        fetchBoothItemById(id),
        fetchBoothItems(),
    ]);
    if (!item) notFound();

    return (
        <BoothItemCard
            item={item}
            others={items.filter(
                (other) =>
                    other.id !== item.id && other.category === item.category
            )}
        />
    );
}
