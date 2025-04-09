export async function fetchPostDetail(id: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/detail/${id}`,
        {
            cache: 'no-cache',
        },
    );

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error('404');
        }
        throw new Error('게시글 로딩 실패');
    }

    return res.json();
}
