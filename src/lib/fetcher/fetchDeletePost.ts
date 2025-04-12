/**
 * 게시물 숨기기 ajax 함수
 * 삭제가 되었는지 아닌지만 리턴합니다.
 * @param postId
 */
export default async function fetchDeletePost(
    postId: number,
): Promise<boolean> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/${postId}`,
            {
                method: 'DELETE',
                credentials: 'include',
            },
        );
        if (!res.ok) {
            console.error('서버 응답 실패', res.status);
            return false;
        }

        return true;
    } catch (err) {
        console.error('게시글 숨기기 실패', err);
        return false;
    }
}
