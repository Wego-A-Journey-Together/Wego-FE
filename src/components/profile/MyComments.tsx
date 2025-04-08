import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState } from 'react';

import LoadingThreeDots from '../common/LoadingThreeDots';

interface CommentData {
    content: string;
    parentId: number;
    id?: number;
    timestamp?: string;
    subtitle?: string;
    isGroupOpen?: boolean;
}

interface PaginatedResponse {
    page: number;
    size: number;
    sort: string[];
    content: CommentData[];
}

export default function Comments() {
    const [messages, setMessages] = useState<CommentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setIsLoading(true);
                const NEXT_PUBLIC_NEST_BFF_URL =
                    process.env.NEXT_PUBLIC_NEST_BFF_URL;
                const response = await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/users/me/comments`,
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }

                const data: PaginatedResponse = await response.json();
                setMessages(data.content || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching comments:', err);
                setError('댓글을 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full py-4">
                <LoadingThreeDots />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-4 text-center text-red-500">
                Error: {error}
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="w-full py-4 text-center text-[#666666]">
                내가 작성한 댓글이 없어요
            </div>
        );
    }

    return (
        <div className="w-full">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className="flex items-start border-b border-[#e9e9e9] py-4"
                >
                    <Checkbox className="mt-1 h-5 w-5" />

                    <div className="ml-3 flex flex-col">
                        <div className="text-base font-medium">
                            {message.content}
                        </div>

                        <div className="mt-1 text-xs text-[#333333]">
                            {message?.timestamp}
                        </div>

                        <div className="mt-2 flex items-center">
                            <Badge
                                variant={
                                    message?.isGroupOpen ? 'default' : 'disable'
                                }
                            >
                                {message?.isGroupOpen ? '모집 중' : '모집 마감'}
                            </Badge>

                            <div className="ml-2 text-sm font-semibold text-[#666666]">
                                {message?.subtitle}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex items-center justify-between pt-5">
                <div className="flex items-center">
                    <Checkbox className="h-5 w-5" />
                    <span className="ml-2 text-sm text-black">전체선택</span>
                </div>

                <Button
                    variant="outline"
                    className="h-10 w-[100px] rounded-lg border border-solid border-[#e9e9e9] bg-white"
                >
                    <span className="text-sm text-[#666666]">삭제</span>
                </Button>
            </div>
        </div>
    );
}
