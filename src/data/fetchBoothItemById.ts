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

export default async function fetchBoothItemById(id: string): Promise<ItemInterface | null> {
  try {
    const [items, images] = await Promise.all([
      d1Query<BoothItemRow>(
        `SELECT booth_items.id, booth_items.name, booth_items.notes, booth_items.price_min, booth_items.price_max, booth_categories.name AS category
         FROM booth_items
         JOIN booth_categories ON booth_categories.id = booth_items.category_id
         WHERE booth_items.id = ?`,
        [id]
      ),
      d1Query<{ r2_key: string }>(
        `SELECT r2_key FROM booth_item_images WHERE item_id = ? ORDER BY id`,
        [id]
      ),
    ]);

    const item = items[0];
    if (!item) return null;

    return {
      id: item.id,
      name: item.name,
      notes: item.notes ?? "",
      category: item.category as BoothItemType,
      price_min: item.price_min,
      price_max: item.price_max,
      pics: images.map((image) => image.r2_key),
    };
  } catch (err) {
    console.error(`Failed to fetch booth item "${id}":`, err);
    return null;
  }
}
