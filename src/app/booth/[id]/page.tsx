import { notFound } from "next/navigation";
import fetchBoothItemById from "@/data/fetchBoothItemById";
import fetchBoothItems from "@/data/fetchBoothItems";
import BoothItemCard from "@/components/client/BoothItemCard";

// 一日毎にISR
export const revalidate = 86400;

export async function generateStaticParams() {
    const items = await fetchBoothItems();
    return items.map((item) => ({ id: item.id }));
}

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
