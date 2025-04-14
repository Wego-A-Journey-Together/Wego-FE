import { SearchParams } from 'next/dist/server/request/search-params';





export default function SearchPage({
    searchParams,
}: {
    searchParams?: SearchParams;
}) {
    const keyword = searchParams?.keyword;
    return (
        <>
            {searchParams && <div>검색 페이지임{keyword}</div>}
            {!searchParams && <div>검색 페이지임</div>}
        </>
    );
}
