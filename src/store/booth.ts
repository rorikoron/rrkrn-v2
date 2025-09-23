
import fetchBoothVRChatItem from '@/lib/fetchBoothVRChatItem';
import { atom } from 'jotai';
import { atomWithQuery, atomWithSuspenseQuery } from 'jotai-tanstack-query';
type BoothItemType = "all" | "cloth" | "accessaory" | "tool" | "shader" | "goods";
interface ItemInterface {
    category: BoothItemType;
    name: string;
    notes: string;
    pics: any[];
    price: number;
    sequence: number;
    id: string
}

const boothAtom = atomWithSuspenseQuery<ItemInterface[]>(() => ({
  queryKey: ['booth'],
  queryFn: async () => {
    const res = await fetch("/api/items")
            .then((data) => data.json())
            .then(({ records }) =>
                records?.map((record: { fields: any }) => record?.fields)
            )
            .then((items: any[]) =>
                items?.sort((a, b) => b?.sequence - a?.sequence)
            )
    // const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));
    // await sleep(100000);
    // const res = [{ category: "cloth", name: "dummy", notes: "test!", pics: [{ thumbnails: {large: {url:"/found.png"}} }], price: 120, sequence: 1, id: "3333" }] as ItemInterface[]
    return res;
  },
  staleTime: Infinity,       // 永久に古くならないようにする
  cacheTime: 1000 * 60 * 30, // 30分保持
  refetchOnWindowFocus: false, // フォーカス時に再フェッチしない
  refetchOnMount: false, 
}));
const itemCategoryAtom = atom<BoothItemType>("all") 


export {type ItemInterface, type BoothItemType, boothAtom, itemCategoryAtom};