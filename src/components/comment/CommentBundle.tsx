'use client';

import SingleComment from '@/components/comment/SingleComment';
import PostInput from '@/components/detail/PostInput';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Writer {
    nickname: string;
    thumbnailUrl: string;
}

export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    writer: Writer;
    parentId: number | null;
    replies: Comment[];
}

/**
 * 부모 댓글과 답글을 포함하는 번들 입니다.
 * 데이터에서 부모 데이터와 자식들 데이터를 쪼개서 SingleComment 컴포넌트로 전송합니다.
 * @param initialComments
 * @constructor
 */
export default function CommentBundle({
    bundle,
    postId,
}: {
    bundle: Comment;
    postId: number;
}) {
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);

    const replies = bundle.replies;

    return (
        <div className="mb-5">
            {/* 부모 댓글 */}
            <SingleComment
                content={{
                    id: bundle.id,
                    content: bundle.content,
                    createdAt: bundle.createdAt,
                    writer: bundle.writer,
                    parentId: null,
                }}
                variant="Parent"
                setIsReplyInputOpen={setIsReplyInputOpen}
                setIsReplyOpen={setIsReplyOpen}
            />
            {/* 답글 목록 */}
            {replies.length > 0 && (
                <div>
                    <button
                        type={'button'}
                        onClick={() => {
                            setIsReplyOpen((prev) => !prev);
                            setIsReplyInputOpen((prev) => !prev);
                        }}
                        className="my-5 flex items-center"
                    >
                        <p className={'text-sky-blue text-xs font-medium'}>
                            답글 {replies.length}개
                        </p>
                        {isReplyOpen ? (
                            <ChevronDown
                                size={10}
                                strokeWidth={3}
                                className="text-sky-blue ml-1.5 scale-x-[1.3]"
                            />
                        ) : (
                            <ChevronUp
                                size={10}
                                strokeWidth={3}
                                className="text-sky-blue ml-1.5 scale-x-[1.3]"
                            />
                        )}
                    </button>
                    {isReplyOpen &&
                        replies.map((reply) => (
                            <SingleComment
                                key={reply.id}
                                content={{
                                    id: reply.id,
                                    content: reply.content,
                                    createdAt: reply.createdAt,
                                    writer: reply.writer,
                                    parentId: reply.parentId || bundle.id,
                                }}
                                variant="Reply"
                                setIsReplyInputOpen={setIsReplyInputOpen}
                                setIsReplyOpen={setIsReplyOpen}
                            />
                        ))}
                </div>
            )}
            {isReplyInputOpen && (
                <PostInput
                    postId={postId}
                    parentId={bundle.id}
                    variant={'Reply'}
                    setIsReplyInputOpen={setIsReplyInputOpen}
                />
            )}
            {/* 세퍼레이터 */}
            <div className="mt-5 h-px w-full bg-[#e9e9e9]" />
        </div>
    );
}
