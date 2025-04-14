import InfiniteScroll from '@/components/home/InfiniteScroll';
import { BEHomePost } from '@/types/BEHomePost';
import { SearchParams } from 'next/dist/server/request/search-params';

export default async function SearchPage({
    searchParams,
}: {
    searchParams?: Promise<SearchParams>;
}) {
    const sp = await searchParams;
    const rawKeyword = sp?.keyword;
    const keyword = Array.isArray(rawKeyword)
        ? rawKeyword[0]
        : (rawKeyword ?? '');
    const NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;

    const res = await fetch(
        `${NEST_BFF_URL}/api/gatherings/list?keyword=${encodeURIComponent(keyword)}&page=0&size=12`,
        { cache: 'no-store' },
    );

    if (!res.ok) {
        console.error('검색 결과 로딩 실패');
        return <div>검색 결과를 불러오지 못했습니다.</div>;
    }

    const data = await res.json();
    const initialPosts: BEHomePost[] = data.content;

    return (
        <>
            <h1 className="mt-10 text-2xl font-semibold">
                &#34;{keyword}&#34;(으)로 검색한 결과에요
            </h1>

            <p className="mt-7.5 text-sm text-[#808080]">
                검색된 동행 {data.totalElements}개
            </p>

            {data.totalElements === 0 ? (
                <div className="flex min-h-[50vh] items-center justify-center">
                    <p className="text-center text-base text-neutral-500">
                        검색 결과가 없어요. 다른 키워드로 검색해보세요!
                    </p>
                </div>
            ) : (
                <section className="mt-5">
                    <InfiniteScroll
                        initialPosts={initialPosts}
                        keyword={keyword}
                    />
                </section>
            )}
        </>
    );
}
