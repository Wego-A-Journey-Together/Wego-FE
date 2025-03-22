import { Button } from '@/components/ui/button';

export default function AssignCommentBtn() {
    return (
        <Button
            className="h-[37px] w-[92px] rounded-lg bg-[#999999] font-semibold text-white hover:bg-[#888888]"
            style={{ fontFamily: "'Pretendard-SemiBold', Helvetica" }}
        >
            댓글 등록
        </Button>
    );
}
