'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface OptimisticUpdateLikesProps {
    id: number;
}

interface ItemData {
    liked: boolean;
}

export default function OptimisticUpdateLikes({
    id,
}: OptimisticUpdateLikesProps) {
    const [isLike, setIsLike] = useState<boolean>(false);
    const queryClient = useQueryClient();

    /**
     * mutationFn 에 해당합니다. 백엔드에 찜할 포스트의 아이디를 연결합니다.
     * todo : 로그인 구현 후에 유저의 아이디를 포함해야 정확한 찜 로직으로 동작할 것 입니다 .
     * @param id
     */
    const changeLike = async (id: number) => {
        const res = await fetch('/api/likes/' + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                like: !isLike,
            }),
        });
        if (!res.ok) {
            throw new Error('Like 요청 실패');
        }
    };

    const { mutate } = useMutation({
        mutationFn: changeLike,

        // -------------------
        // 1) onMutate
        // -------------------
        onMutate: async (postId) => {
            // (a) 혹시 이 게시물 데이터를 다시 불러오려던 게 있으면 취소
            await queryClient.cancelQueries({
                queryKey: ['item', postId],
            });

            // (b) 이전 캐시 값(스냅샷) 저장
            const prevItemData = queryClient.getQueryData<ItemData>([
                'item',
                postId,
            ]);

            // (c) 캐시 낙관적 업데이트
            queryClient.setQueryData<ItemData>(['item', postId], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    liked: !oldData.liked, // liked 토글
                };
            });

            // (d) 로컬 state도 즉시 반영
            setIsLike((prev) => !prev);

            // (e) onError/onSettled에서 복원할 수 있도록 반환
            return { prevItemData };
        },

        // -------------------
        // 2) onError
        // -------------------
        onError: (error, postId, context) => {
            // (a) onMutate에서 return한 { prevItemData }를 context로 받음
            if (context?.prevItemData) {
                // (b) 캐시 롤백
                queryClient.setQueryData(
                    ['item', postId],
                    context.prevItemData,
                );
            }

            // (c) 로컬 state도 복원
            if (context?.prevItemData?.liked !== undefined) {
                setIsLike(context.prevItemData.liked);
            }
        },

        // -------------------
        // 3) onSettled
        // -------------------
        onSettled: (_data, _error, postId) => {
            // (a) 성공/실패 관계없이 다시 캐시 invalidate -> 프로미스 체인은 보통 무시한다.
            queryClient.invalidateQueries({
                queryKey: ['item', postId],
            });
        },
    });

    // 버튼 클릭 시 -> mutate(id)
    const handleClick = () => {
        mutate(id);
    };
    return (
        <Button
            variant="outline"
            className="flex flex-1 items-center gap-1.5 rounded-lg bg-white px-[30px] py-2 md:flex-none"
            onClick={handleClick}
        >
            <Heart
                className={cn(
                    'transition-colors',
                    isLike && 'fill-rose-700 stroke-rose-500',
                )}
            />
            <span className="font-semibold">찜하기</span>
        </Button>
    );
}
