'use client';

import Replies from '@/components/Icons/Replies';
import { cn, dateFormat } from '@/lib';
import Image from 'next/image';
import React from 'react';

interface SingleCommentProps {
    content: {
        id: number;
        content: string;
        createdAt: string;
        writer: {
            thumbnailUrl: string;
            nickname: string;
        };
        parentId: number | null;
    };
    variant: 'Parent' | 'Reply';
    setIsReplyInputOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsReplyOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * 댓글 or 대댓글에 따라 하나의 UI를 완성하는 컴포넌트입니다.
 * @param content
 * @param variant = <'Reply' | 'Comment'> 유니언 리터럴타입 입니다.
 * @param postId
 * @constructor
 */
export default function SingleComment({
    content,
    variant,
    setIsReplyInputOpen,
    setIsReplyOpen,
}: SingleCommentProps) {
    return (
        <div>
            <div className={cn('flex gap-2.5', variant === 'Reply' && 'mt-5')}>
                {variant === 'Reply' && <Replies className={'mt-2 shrink-0'} />}
                {/*유저 정보 섹션*/}
                <div>
                    <div className="flex flex-1 items-center gap-3">
                        {/*유저 이미지*/}
                        <div className="relative aspect-square h-8 w-8">
                            <Image
                                src={content.writer.thumbnailUrl}
                                alt="유저 프로필 이미지"
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>

                        {/* 유저 정보 */}
                        <div className="w-full text-sm font-semibold text-black">
                            {content.writer.nickname}
                        </div>
                    </div>

                    {/*댓글 본문 */}
                    <div className={`mt-2.5`}>
                        <p className={`text-base font-medium text-[#333333]`}>
                            {content.content}
                        </p>
                    </div>

                    <div className={`mt-2.5 flex justify-start gap-[27px]`}>
                        {/*날짜 섹션*/}
                        <p className={`text-xs font-normal text-[#666666]`}>
                            {dateFormat(content.createdAt)}
                        </p>

                        <button
                            className={`cursor-pointer text-xs font-medium text-[#666666]`}
                            type="button"
                            onClick={() => {
                                setIsReplyOpen(true);
                                setIsReplyInputOpen(true);
                            }}
                        >
                            답글달기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
