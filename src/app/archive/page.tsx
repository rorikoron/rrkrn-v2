import ArchiveGallery, { type YearArchive } from "@/components/client/ArchiveGallery";
import { fetchVRChatArchiveAvailableYears } from "@/data/fetchVRChatArchiveAvailableYears";
import fetchVRChatArchiveByYear from "@/data/fetchVRChatArchiveByYear";

// 一日毎にISR
export const revalidate = 86400;

export default async function Archive() {
    // 新しい年から。年の中は撮った順 (R2 のキーが日付順なので list の順のまま)
    const years = (await fetchVRChatArchiveAvailableYears()).sort((a, b) => Number(b) - Number(a));
    const archives: YearArchive[] = (
        await Promise.all(
            years.map(async (year) => ({
                year,
                photos: await fetchVRChatArchiveByYear({ year: Number(year) }),
            }))
        )
    ).filter(({ photos }) => photos.length > 0);

    return (
        // レイアウトの余白を打ち消して、背景の四角を画面の端から敷く
        <div className="relative -mx-6 -my-6 md:-mx-8 md:-my-12 h-[calc(100%+3rem)] md:h-[calc(100%+6rem)] overflow-hidden">
            {/* 左上に重なるピンクの四角。下から: 横長の帯 → 左上の四角 → 下へ薄れていく縦の帯。
                写真の裏に隠れないよう、タイトルと年見出しのあたりで消えるようにする。
                左端はレイアウトのモールス信号が見えるように空けておく */}
            <div aria-hidden className="absolute inset-0 pointer-events-none dark:opacity-50">
                <div className="absolute left-[15%] top-[40px] md:top-[64px] w-[45%] h-[80px] md:h-[110px] bg-primary-soft/35" />
                <div className="absolute left-8 md:left-10 top-0 w-[45%] md:w-[30%] h-[100px] md:h-[150px] bg-primary-soft/75" />
                {/* 左上の四角と左端がそろわないよう、少し右にずらす */}
                <div className="absolute left-14 md:left-20 top-[24px] md:top-[36px] h-[55%] w-[25%] md:w-[20%] bg-linear-to-b from-active/75 via-primary/45 to-transparent" />
            </div>
            <ArchiveGallery archives={archives} />
        </div>
    );
}
