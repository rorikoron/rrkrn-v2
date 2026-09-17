import { d1Query } from "@/lib/d1-client";
import { ItemInterface } from "@/store/booth";
import { BOOTH_ITEM_SELECT, BoothItemRow, toItemInterface } from "./boothItemRow";

interface BoothItemImageRow {
  item_id: string;
  r2_key: string;
}

export default async function fetchBoothItems(): Promise<ItemInterface[]> {
  try {
    const [items, images] = await Promise.all([
      d1Query<BoothItemRow>(
        `${BOOTH_ITEM_SELECT}
         ORDER BY booth_items.created_at DESC`
      ),
      d1Query<BoothItemImageRow>(
        `SELECT item_id, r2_key FROM booth_item_images ORDER BY item_id, id`
      ),
    ]);

    const picsByItem = new Map<string, string[]>();
    for (const { item_id, r2_key } of images) {
      if (!item_id) continue;
      const pics = picsByItem.get(item_id) ?? [];
      pics.push(r2_key);
      picsByItem.set(item_id, pics);
    }

    return items.map((item) => toItemInterface(item, picsByItem.get(item.id) ?? []));
  } catch (err) {
    console.error("Failed to fetch booth items:", err);
    return [];
  }
}
