'use client';

import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib';
import { fetchApply } from '@/lib/fetcher/fetchApply';
import { useAppDispatch } from '@/redux/hooks';
import { openLoginModal } from '@/redux/slices/modalSlice';
import { toast } from 'sonner';

interface ApplyProps {
    postId: number;
    className?: string;
}

/**
 * 동행 아이디를 받아서 참여 Post 요청하는 버튼
 * @param postId
 * @param className
 */
export default function ApplyGatheringBtn({ postId, className }: ApplyProps) {
    const { isAuthenticated } = useSession();
    const dispatch = useAppDispatch();

    /** #P106 성능: 중복 클릭 방지를 위한 디바운싱 처리 필요 */
    const handleApplyClick = async () => {
        // 로그인 안되면 모달띄우기
        if (!isAuthenticated) {
            dispatch(openLoginModal());
            return;
        }

        /** #S103 보안: CSRF 토큰 검증 필요 */
        /** #U104 사용자 경험: 버튼 클릭 시 로딩 상태 표시 필요 */
        try {
            /** #T102 타입 안정성: API 응답 타입 정의 및 검증 필요 */
            const message = await fetchApply(postId);
            toast('참가 요청 결과', {
                id: 'apply-toast',
                description: message,
                action: {
                    label: '확인',
                    onClick: () => {},
                },
            });
        } catch {
            /** #E101 에러처리: 네트워크 오류와 서버 오류를 구분하여 처리 필요 */
            toast.error(
                '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            );
        }
    };

    /** #A105 접근성: 버튼에 aria-label 추가 필요 */
    return (
        <Button
            type="button"
            onClick={handleApplyClick}
            className={cn('px-[30px] py-2', className)}
        >
            <p>참여하기</p>
        </Button>
    );
}
