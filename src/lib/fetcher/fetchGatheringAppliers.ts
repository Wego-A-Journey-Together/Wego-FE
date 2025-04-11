interface ApplierUser {
    kakaoId: number;
    nickname: string;
    thumbnailUrl: string;
    statusMessage: string;
    gender: 'MALE' | 'FEMALE' | 'ALL';
    ageGroup: string;
}

interface Applier {
    userId: number;
    user: ApplierUser;
    status: 'APPLYING' | 'BLOCKED' | 'ACCEPTED'; // 이넘 값 수정
}

export async function fetchGatheringAppliers(
    gatheringId: number,
): Promise<Applier[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/appliers/${gatheringId}`,
        {
            method: 'GET',
            credentials: 'include',
            cache: 'no-cache',
        },
    );

    if (!res.ok) throw new Error(`동행 참여자 조회 실패 (ID: ${gatheringId})`);

    return await res.json();
}
