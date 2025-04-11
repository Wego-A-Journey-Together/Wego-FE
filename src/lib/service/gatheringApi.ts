export async function acceptMember(gatheringId: number, userId: number) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/${gatheringId}/accept/${userId}`,
        {
            method: 'PATCH',
            credentials: 'include',
        },
    );

    if (!response.ok) {
        throw new Error(`멤버 승인 실패: ${response.status}`);
    }

    return await response.json();
}

export async function blockMember(gatheringId: number, userId: number) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/${gatheringId}/block/${userId}`,
        {
            method: 'PATCH',
            credentials: 'include',
        },
    );

    if (!response.ok) {
        throw new Error(`멤버 거절/차단 실패: ${response.status}`);
    }

    return await response.json();
}

// 여러 멤버에 대한 일괄 처리 함수
export async function acceptMultipleMembers(
    gatheringId: number,
    userIds: number[],
) {
    const promises = userIds.map((userId) => acceptMember(gatheringId, userId));
    return Promise.all(promises);
}

export async function blockMultipleMembers(
    gatheringId: number,
    userIds: number[],
) {
    const promises = userIds.map((userId) => blockMember(gatheringId, userId));
    return Promise.all(promises);
}
