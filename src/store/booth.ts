
import { atom } from 'jotai';
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

const itemCategoryAtom = atom<BoothItemType>("all")


export {type ItemInterface, type BoothItemType, itemCategoryAtom};
