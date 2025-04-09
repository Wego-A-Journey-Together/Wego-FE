'use client';

import AssignComment from '@/components/Btn/AssignComment';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

/**
 * 필드가 하나라 RHF 보다는 useState 로 입력값 관리 하였습니다.
 */
export default function PostInput({
    parentId,
    postId,
}: {
    parentId: string | null;
    postId: number;
}) {
    const [content, setContent] = useState('');
    return (
        // 댓글 반복문에서 마진 40px + 10px =50px
        <div
            className={`mt-2.5 flex h-[138px] w-full flex-col rounded-2xl border p-5`}
        >
            <Textarea
                className="h-auto flex-grow-1 resize-none border-none p-0 shadow-none outline-none placeholder:text-base placeholder:font-medium placeholder:text-[#666666] hover:border-none focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder={`댓글을 입력하세요`}
                onChange={(e) => setContent(e.target.value)}
            />
            {/*버튼 그룹*/}
            <section className={`flex justify-end gap-2`}>
                {/*취소버튼*/}
                <Button
                    type="button"
                    variant="ghost"
                    className="h-[37px] w-[85px] rounded-lg text-sm font-semibold text-[#666666]"
                >
                    취소
                </Button>
                {/*등록 버튼*/}
                <AssignComment
                    content={content}
                    parentId={parentId}
                    postId={postId}
                    setContent={setContent}
                />
            </section>
        </div>
    );
}
