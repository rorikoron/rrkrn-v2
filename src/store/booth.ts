
import { HonoAppType } from '@/app/api/[...route]/route';
import fetchBoothVRChatItem from '@/data/fetchBoothVRChatItem';
import { hc } from 'hono/client';
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
    const res = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items`)
            .then((data) => data.json())
            .then((result) => {
                if (result.success && result.data) {
                    return result.data;
                }
                throw new Error('Failed to fetch booth items');
            })
            .then(({ records }) =>
                records?.map((record: { fields: any }) => record?.fields)
            )
            .then((items: any[]) =>
                items?.sort((a, b) => b?.sequence - a?.sequence)
            )

            return res;
  },
  staleTime: Infinity,       // 永久に古くならないようにする
  cacheTime: 1000 * 60 * 30, // 30分保持
  refetchOnWindowFocus: false, // フォーカス時に再フェッチしない
  refetchOnMount: false, 
}));
const itemCategoryAtom = atom<BoothItemType>("all") 


export {type ItemInterface, type BoothItemType, boothAtom, itemCategoryAtom};