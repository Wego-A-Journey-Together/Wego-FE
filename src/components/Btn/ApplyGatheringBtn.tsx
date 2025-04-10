import { Button } from '@/components/ui/button';
import { cn } from '@/lib';

interface ApplyProps {
    postId: number;
    className?: string;
}

/**
 * 동행 아이디를 받아서 참여 Post 요청하는 버튼
 * @param postId
 */
export default function ApplyGatheringBtn({ postId, className }: ApplyProps) {
    const handleApplyClick = async () => {};

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
