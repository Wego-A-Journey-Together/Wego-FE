/**
 * 로그인 없이 유저 정보 조회시 사용되는 api 입니다.
 * @param kakaoId
 */

interface UserDetails {
    kakaoId: number | string;
    nickname: string;
    thumbnailUrl?: string;
    statusMessage?: string;
    gender?: string;
    ageGroup?: string;
}

export async function fetchUserDetail(
    kakaoId: string | number | undefined,
): Promise<UserDetails> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/profile/${kakaoId}`,
        {
            method: 'GET',
            credentials: 'include',
            cache: 'no-cache',
        },
    );

    if (!res.ok) throw new Error('유저 정보 조회 실패');

    return await res.json();
}
