export interface MyPosts {
    totalElements: number;
    content: {
        gatheringId: number;
        title: string;
        thumbnailUrl: string;
        startAt: string;
        endAt: string;
        preferredGender: string;
        preferredAge: string;
    }[];
}

export async function fetchMySonGroup(): Promise<MyPosts> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/me/gathering/created`,
        {
            method: 'GET',
            credentials: 'include',
            cache: 'no-cache',
        },
    );

    if (!res.ok) throw new Error('내가 만든 동행 조회 실패');

    return await res.json();
}
