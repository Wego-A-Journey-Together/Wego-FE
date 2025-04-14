import { SearchParams } from 'next/dist/server/request/search-params';





export default async function SearchPage({
    searchParams,
}: {
    searchParams?: Promise<SearchParams>;
}) {
    const sp = await searchParams;
    const keyword = sp?.keyword;

    return (
        <>
            <h1 className="mt-10 text-2xl font-semibold">
                &#34;{keyword}&#34;(으)로 검색한 결과에요
            </h1>

            <p className="mt-7.5 text-sm text-[#808080]">검색된 동행 2개</p>
            {keyword ? (
                <div>검색 페이지임: {keyword}</div>
            ) : (
                <div>검색어 없음</div>
            )}
        </>
    );
}
