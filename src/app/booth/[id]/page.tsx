import { notFound } from "next/navigation";
import fetchBoothItemById from "@/data/fetchBoothItemById";
import fetchBoothItems from "@/data/fetchBoothItems";
import BoothItemCard from "@/components/client/BoothItemCard";
import { d1Query } from "@/lib/d1-client";

// 更新頻度は低い(月1回程度)がタイミングは不定なのでISRで追従
export const revalidate = 86400;

// generateStaticParams が無いと動的セグメントはISR/データキャッシュの
// 対象外になり、revalidate を設定しても毎リクエストD1に問い合わせてしまう。
export async function generateStaticParams() {
    const rows = await d1Query<{ id: string }>("SELECT id FROM booth_items");
    return rows.map(({ id }) => ({ id }));
}

export default async function BoothItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [item, otherItems] = await Promise.all([
        fetchBoothItemById(id),
        fetchBoothItems(),
    ]);
    if (!item) notFound();

    return <BoothItemCard item={item} otherItems={otherItems} />;
}
