import { d1Query } from "@/lib/d1-client";
import { BoothItemType, ItemInterface } from "@/store/booth";

interface BoothItemRow {
  id: string;
  name: string;
  notes: string | null;
  price_min: number;
  price_max: number;
  category: string;
}

interface BoothItemImageRow {
  item_id: string;
  r2_key: string;
}

export default async function fetchBoothItems(): Promise<ItemInterface[]> {
  try {
    const [items, images] = await Promise.all([
      d1Query<BoothItemRow>(
        `SELECT booth_items.id, booth_items.name, booth_items.notes, booth_items.price_min, booth_items.price_max, booth_categories.name AS category
         FROM booth_items
         JOIN booth_categories ON booth_categories.id = booth_items.category_id
         ORDER BY booth_items.id DESC`
      ),
      d1Query<BoothItemImageRow>(
        `SELECT item_id, r2_key FROM booth_item_images ORDER BY r2_key`
      ),
    ]);

    const picsByItem = new Map<string, string[]>();
    for (const { item_id, r2_key } of images) {
      if (!item_id) continue;
      const pics = picsByItem.get(item_id) ?? [];
      pics.push(r2_key);
      picsByItem.set(item_id, pics);
    }

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      notes: item.notes ?? "",
      category: item.category as BoothItemType,
      price_min: item.price_min,
      price_max: item.price_max,
      pics: picsByItem.get(item.id) ?? [],
    }));
  } catch (err) {
    console.error("Failed to fetch booth items:", err);
    return [];
  }
}
