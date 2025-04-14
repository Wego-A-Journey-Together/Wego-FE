'use client';

import SingleComment from '@/components/comment/SingleComment';
import PostInput from '@/components/detail/PostInput';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

/** #T101 타입 안정성: Writer 인터페이스에 필수/선택적 필드 명시 필요 */
interface Writer {
    nickname: string;
    thumbnailUrl: string;
}

/** #T102 타입 안정성: Comment 인터페이스에 readOnly 필드 추가 검토 필요 */
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

/** #P103 성능: 댓글 목록이 많을 경우 가상화 적용 검토 필요 */
export default function CommentBundle({
    bundle,
    postId,
}: {
    bundle: Comment;
    postId: number;
}) {
    /** #P104 성능: 상태 업데이트 로직 최적화를 위해 useReducer 사용 검토 필요 */
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);

    const replies = bundle.replies;

    /** #A105 접근성: ARIA 레이블과 역할을 통한 의미론적 구조 강화 필요 */
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
                /** #U106 사용자 경험: 답글 토글 버튼에 애니메이션 효과 추가 필요 */
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
                        /** #S107 보안: XSS 방지를 위한 컨텐츠 이스케이프 처리 필요 */
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
                /** #E108 에러처리: 답글 작성 실패 시 사용자 피드백 및 재시도 기능 필요 */
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
