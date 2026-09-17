import { BoothItemType, ItemInterface } from "@/store/booth";

export interface BoothItemRow {
  id: string;
  name: string;
  notes: string | null;
  price_min: number;
  price_max: number;
  category: string;
}

export const BOOTH_ITEM_SELECT = `SELECT booth_items.id, booth_items.name, booth_items.notes, booth_items.price_min, booth_items.price_max, booth_categories.name AS category
         FROM booth_items
         JOIN booth_categories ON booth_categories.id = booth_items.category_id`;

export function toItemInterface(row: BoothItemRow, pics: string[]): ItemInterface {
  return {
    id: row.id,
    name: row.name,
    notes: row.notes ?? "",
    category: row.category as BoothItemType,
    price_min: row.price_min,
    price_max: row.price_max,
    pics,
  };
}
