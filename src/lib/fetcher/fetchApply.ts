/**
 * 포스트 아이디를 넘기면 유저 토큰 기반으로 해당 동행에 참여 신청하는 버튼 입니다.
 * 반환 메시지는 백엔드 필드값 사용하겠습니다.
 * @param postId
 */
export async function fetchApply(postId: number): Promise<string> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/apply/${postId}`,
        {
            method: 'POST',
            credentials: 'include',
            cache: 'no-cache',
        },
    );

    if (!res.ok) {
        throw new Error('동행 신청 요청 실패');
    }

    return await res.text();
}
