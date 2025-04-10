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
    const handleApplyClick = async () => {
        // 로그인 안되면 모달띄우기
        if (!isAuthenticated) {
            dispatch(openLoginModal());
            return;
        }
        try {
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
            toast.error(
                '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            );
        }
    };

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
