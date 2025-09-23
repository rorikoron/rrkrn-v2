
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
            .then((res) => res.json())
            .then(({ records }) =>
                records?.map((record: { fields: any }) => record?.fields)
            )
            .then((items: any[]) =>
                items.sort((a, b) => b.sequence - a.sequence)
            )
    // const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));
    // await sleep(100000);
    // const res = [{ category: "cloth", name: "dummy", notes: "test!", pics: [{ thumbnails: {large: {url:"/found.png"}} }], price: 120, sequence: 1, id: "3333" }] as ItemInterface[]
    return res;
  },
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 30,
}));
const itemCategoryAtom = atom<BoothItemType>("all") 


export {type ItemInterface, type BoothItemType, boothAtom, itemCategoryAtom};