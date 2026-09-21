
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

/**
 * 直近のクリックで「遷移元 / 遷移先」になったアイテムのid。
 * これらはサイズも変わる共有要素なので、View Transitionで専用のクラスを当てる。
 */
const boothNavAtom = atom<{ from: string | null; to: string | null }>({
  from: null,
  to: null,
});

export { boothNavAtom };
