
import { atom } from 'jotai';
import { atomWithSuspenseQuery } from 'jotai-tanstack-query';
type BoothItemType = "all" | "cloth" | "accessory" | "tool" | "shader" | "goods";
interface ItemInterface {
    category: BoothItemType;
    name: string;
    notes: string;
    pics: string[];
    price_min: number;
    price_max: number;
    id: string
}

const boothAtom = atomWithSuspenseQuery<ItemInterface[]>(() => ({
  queryKey: ['booth'],
  queryFn: async () => {
    const res = await fetch("/api/items");
    if (!res.ok) throw new Error('Failed to fetch booth items');
    return res.json();
  },
  staleTime: Infinity,       // 永久に古くならないようにする
  cacheTime: 1000 * 60 * 30, // 30分保持
  refetchOnWindowFocus: false, // フォーカス時に再フェッチしない
  refetchOnMount: false,
}));
const itemCategoryAtom = atom<BoothItemType>("all")


export {type ItemInterface, type BoothItemType, boothAtom, itemCategoryAtom};
