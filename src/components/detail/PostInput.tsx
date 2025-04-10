'use client';

import AssignComment from '@/components/Btn/AssignComment';
import Replies from '@/components/Icons/Replies';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib';
import { useAppDispatch } from '@/redux/hooks';
import { openLoginModal } from '@/redux/slices/modalSlice';
import React, { useState } from 'react';

/**
 * 필드가 하나라 RHF 보다는 useState 로 입력값 관리 하였습니다.
 */
export default function PostInput({
    parentId,
    postId,
    variant,
    setIsReplyInputOpen,
}: {
    parentId: number | null;
    postId: number;
    variant: 'Comment' | 'Reply';
    setIsReplyInputOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [content, setContent] = useState('');
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useSession();
    return (
        // 댓글 반복문에서 마진 40px + 10px =50px
        <div
            className={cn(
                `mt-2.5 flex w-auto flex-col gap-2 rounded-2xl border p-4`,
                variant === 'Reply'
                    ? 'ml-5 flex-row items-center border-[#dcdcdc] bg-[#fafafa]'
                    : 'bg-white',
            )}
        >
            {variant === 'Reply' && <Replies className="mr-3" />}
            <Textarea
                className={cn(
                    `resize-none border-none p-0 shadow-none outline-none placeholder:text-sm placeholder:text-[#666666] focus:ring-0`,
                    variant === 'Reply'
                        ? 'min-h-[48px] text-sm'
                        : 'min-h-[80px] text-base',
                )}
                placeholder={
                    isAuthenticated
                        ? variant === 'Reply'
                            ? '답글을 남겨 보세요'
                            : '댓글을 남겨 주세요'
                        : '로그인이 필요한 서비스 입니다.'
                }
                onChange={(e) => setContent(e.target.value)}
                value={content}
                onFocus={(e) => {
                    if (!isAuthenticated) {
                        e.target.blur();
                        dispatch(openLoginModal());
                    }
                }}
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
                    variant={variant}
                    setIsReplyInputOpen={setIsReplyInputOpen}
                />
            </section>
        </div>
    );
}
