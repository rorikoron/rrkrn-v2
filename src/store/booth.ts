import { atom } from "jotai";

type BoothItemType = "all" | "cloth" | "accessory" | "software" | "shader" | "goods";
interface ItemInterface {
    category: BoothItemType;
    name: string;
    notes: string;
    pics: string[];
    price_min: number;
    price_max: number;
    id: string;
}

/** 一覧の絞り込みボタンに並べる順 */
const BOOTH_CATEGORIES: BoothItemType[] = [
    "all",
    "cloth",
    "accessory",
    "software",
    "shader",
    "goods",
];

/**
 * 一覧で選んでいるカテゴリ。URL のハッシュ (/booth#shader) と同期する
 * (BoothItemList が読み込み時とハッシュの変化で合わせ、BoothCategoryButton が書く)。
 * 描画は React の state で行う。View Transition は transition 内の state 更新でしか動かないため
 */
const itemCategoryAtom = atom<BoothItemType>("all");

/** "#shader" → "shader"。知らない値や空なら "all" */
function parseCategoryHash(hash: string): BoothItemType {
    const value = decodeURIComponent(hash.replace(/^#/, ""));
    return BOOTH_CATEGORIES.find((category) => category === value) ?? "all";
}

/** カテゴリで絞り込んだ一覧の URL。"all" はハッシュなし */
function boothListHref(category: BoothItemType): string {
    return category === "all" ? "/booth" : `/booth#${category}`;
}

/**
 * 直近のクリックで「遷移元 / 遷移先」になったアイテムのid。
 * これらはサイズも変わる共有要素なので、View Transitionで専用のクラスを当てる。
 */
const boothNavAtom = atom<{ from: string | null; to: string | null }>({
    from: null,
    to: null,
});

export {
    type ItemInterface,
    type BoothItemType,
    BOOTH_CATEGORIES,
    itemCategoryAtom,
    parseCategoryHash,
    boothListHref,
    boothNavAtom,
};
