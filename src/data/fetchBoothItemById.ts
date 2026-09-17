import { d1Query } from "@/lib/d1-client";
import { ItemInterface } from "@/store/booth";
import { BOOTH_ITEM_SELECT, BoothItemRow, toItemInterface } from "./boothItemRow";

export default async function fetchBoothItemById(id: string): Promise<ItemInterface | null> {
  try {
    const [items, images] = await Promise.all([
      d1Query<BoothItemRow>(
        `${BOOTH_ITEM_SELECT}
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

    return toItemInterface(
      item,
      images.map((image) => image.r2_key)
    );
  } catch (err) {
    console.error(`Failed to fetch booth item "${id}":`, err);
    return null;
  }
}
