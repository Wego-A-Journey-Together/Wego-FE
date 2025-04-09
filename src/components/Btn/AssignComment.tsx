'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface AssignCommentProps {
    content: string;
    parentId: string | null;
    postId: number;
    setContent: React.Dispatch<React.SetStateAction<string>>;
}

export default function AssignCommentBtn({
    content,
    parentId,
    postId,
    setContent,
}: AssignCommentProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;

    const handleSubmitComment = async () => {
        setLoading(true);

        const res = await fetch(
            `${NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/${postId}/comments`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content, parentId }),
            },
        );
        if (!res.ok) {
            toast('댓글 작성 실패', {
                description: '잠시 후 다시 시도해 주세요',
                action: {
                    label: '닫기',
                    onClick: () => {},
                },
            });
            setLoading(false);
            return;
        }
        toast('댓글 작성 완료!', {
            description: '댓글을 성공적으로 남겼습니다.',
            action: {
                label: '닫기',
                onClick: () => {},
            },
        });
        setContent('');
        setLoading(false);
        router.refresh();
    };
    return (
        <Button
            className="h-[37px] w-[92px] rounded-lg bg-[#999999] font-semibold text-white hover:bg-[#888888]"
            type="submit"
            onClick={handleSubmitComment}
            disabled={loading}
        >
            댓글 등록
        </Button>
    );
}
