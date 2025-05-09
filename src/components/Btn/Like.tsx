'use client';

import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib';
import { useAppDispatch } from '@/redux/hooks';
import { openLoginModal } from '@/redux/slices/modalSlice';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bookmark } from 'lucide-react';

interface LikeProps {
    id: number;
    className?: string;
}

export default function Like({ id, className }: LikeProps) {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useSession();
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;

    const { data: isLike = false } = useQuery<boolean>({
        queryKey: ['likeStatus', id],
        queryFn: async () => {
            console.log('[queryfn] likeStatus 요청 시작');
            const res = await fetch(
                `${NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/like/${id}`,
                {
                    credentials: 'include',
                },
            );
            if (!res.ok) throw new Error('찜 상태 조회 실패');
            return res.json(); //불리언 타입
        },
        enabled: isAuthenticated && process.env.NODE_ENV !== 'development', // 로그인 안된 사람은 쿼리 방지
    });
    /**
     * mutationFn 에 해당합니다. 백엔드에 찜할 포스트의 아이디를 연결합니다.
     * todo : 로그인 구현 후에 유저의 아이디를 포함해야 정확한 찜 로직으로 동작할 것 입니다 .
     * @param id
     */
    const changeLike = async ({ postId }: { postId: number }) => {
        const res = await fetch(
            `${NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/like/${postId}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            },
        );
        if (!res.ok) {
            throw new Error('Like 요청 실패');
        }
    };

    const { mutate } = useMutation({
        mutationFn: changeLike,

        // -------------------
        // 1) onMutate
        // -------------------
        onMutate: async ({ postId }) => {
            console.log(`뮤테이션 시작: postId=${postId}`);
            // (a) 혹시 이 게시물 데이터를 다시 불러오려던 게 있으면 취소
            await queryClient.cancelQueries({
                queryKey: ['likeStatus', postId],
            });

            // (b) 이전 캐시 값(스냅샷) 저장
            const prev = queryClient.getQueryData<boolean>([
                'likeStatus',
                postId,
            ]);

            // (c) 캐시 낙관적 업데이트
            queryClient.setQueryData<boolean>(
                ['likeStatus', postId],
                (oldData) => {
                    return !oldData;
                },
            );

            // (e) onError/onSettled에서 복원할 수 있도록 반환
            return { prev, postId };
        },

        // -------------------
        // 2) onError
        // -------------------
        onError: (error, postId, context) => {
            console.error(
                `[onError] 요청 실패 → 롤백 시도: postId=${context?.postId}`,
                error,
            );
            // (a) onMutate에서 return한 { prevItemData }를 context로 받음
            if (context?.prev) {
                // (b) 캐시 롤백
                queryClient.setQueryData(
                    ['likeStatus', context.postId],
                    context.prev,
                );
            }
        },

        // -------------------
        // 3) onSettled
        // -------------------
        onSettled: (_data, _error, _variables, context) => {
            console.log(
                `[onSettled] 캐시 invalidate: postId=${context?.postId}`,
            );
            void queryClient.invalidateQueries({
                queryKey: ['likeStatus', context?.postId],
            });
        },
    });

    // 버튼 클릭 시 -> mutate(id)
    const handleClick = () => {
        if (!isAuthenticated) {
            dispatch(openLoginModal());
            return;
        }
        console.log('찜버튼 눌렀음.');
        mutate({ postId: id });
    };

    return (
        <button
            className={cn(
                'flex h-full cursor-pointer items-center gap-1.5 rounded-lg px-[30px] py-2 md:px-0',
                className,
            )}
            type="button"
            onClick={handleClick}
        >
            <Bookmark
                className={cn(
                    'stroke-[#666666] stroke-2 transition-colors',
                    isLike && 'fill-neutral-500',
                )}
            />
        </button>
    );
}
