'use client';

import Replies from '@/components/Icons/Replies';
import { cn, dateFormat } from '@/lib';
import Image from 'next/image';
import React from 'react';

/** #T101 타입 안정성: content 객체의 중첩된 타입을 별도로 분리하여 재사용성 향상 필요 */
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

/** #P102 성능: 불필요한 리렌더링 방지를 위해 React.memo 적용 검토 필요 */
export default function SingleComment({
    content,
    variant,
    setIsReplyInputOpen,
    setIsReplyOpen,
}: SingleCommentProps) {
    /** #A103 접근성: 댓글 작성자 정보와 내용에 대한 적절한 ARIA 레이블 추가 필요 */
    return (
        <div>
            <div className={cn('flex gap-2.5', variant === 'Reply' && 'mt-5')}>
                {variant === 'Reply' && <Replies className={'mt-2 shrink-0'} />}
                {/*유저 정보 섹션*/}
                <div>
                    <div className="flex flex-1 items-center gap-3">
                        {/*유저 이미지*/}
                        {/** #P104 성능: 이미지 최적화를 위한 priority, loading, sizes 속성 추가 필요 */}
                        <div className="relative aspect-square h-8 w-8">
                            <Image
                                src={content.writer.thumbnailUrl}
                                alt="유저 프로필 이미지"
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>

                        {/* 유저 정보 */}
                        {/** #U105 사용자 경험: 작성자 프로필 클릭 시 프로필 페이지로 이동 기능 추가 검토 */}
                        <div className="w-full text-sm font-semibold text-black">
                            {content.writer.nickname}
                        </div>
                    </div>

                    {/*댓글 본문 */}
                    {/** #S106 보안: XSS 방지를 위한 댓글 내용 이스케이프 처리 필요 */}
                    <div className={`mt-2.5`}>
                        <p className={`text-base font-medium text-[#333333]`}>
                            {content.content}
                        </p>
                    </div>

                    <div className={`mt-2.5 flex justify-start gap-[27px]`}>
                        {/*날짜 섹션*/}
                        {/** #A107 접근성: 날짜 정보를 스크린 리더에 적절히 전달하도록 개선 필요 */}
                        <p className={`text-xs font-normal text-[#666666]`}>
                            {dateFormat(content.createdAt)}
                        </p>

                        {/** #U108 사용자 경험: 답글 버튼에 호버/포커스 상태 스타일 추가 필요 */}
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
