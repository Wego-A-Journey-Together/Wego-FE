import AssignComment from '@/components/Btn/AssignComment';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function PostInput() {
    return (
        // 댓글 반복문에서 마진 40px + 10px =50px
        <div
            className={`mt-2.5 flex h-[138px] w-full flex-col rounded-2xl border p-5`}
        >
            <Textarea
                className="h-auto flex-grow-1 resize-none border-none p-0 shadow-none outline-none placeholder:text-base placeholder:font-medium placeholder:text-[#666666] hover:border-none focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder={`댓글을 입력하세요`}
            />
            {/*버튼 그룹*/}
            <section className={`flex justify-end gap-2`}>
                {/*취소버튼*/}
                <Button
                    variant="ghost"
                    className="h-[37px] w-[85px] rounded-lg text-sm font-semibold text-[#666666]"
                >
                    취소
                </Button>
                {/*등록 버튼*/}
                <AssignComment />
            </section>
        </div>
    );
}
