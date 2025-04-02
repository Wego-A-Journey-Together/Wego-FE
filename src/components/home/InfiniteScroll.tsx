'use client';

import RecruitPost from '@/components/common/RecruitPost';
import { HomePost } from '@/types/HomePost';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion, useInView } from 'motion/react';
import { useEffect, useRef } from 'react';

// api 생기면 삭제
import LoadingThreeDots from '../common/LoadingThreeDots';
import CreatePost from './CreatePost';
import CreatePostWindow from './CreatePostWindow';

export default function InfiniteScroll() {
    const ref = useRef(null);
    const isInView = useInView(ref);
    const NEST_BFF_URL = process.env.NEST_BFF_URL;
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetch(
                // 임시 링크입니다.
                `${NEST_BFF_URL}/api/posts?_page=${pageParam}&_limit=12`,
            );
            return response.json();
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
    });

    useEffect(() => {
        const handleFetchNext = async () => {
            if (isInView && !isFetchingNextPage && hasNextPage) {
                await fetchNextPage({ cancelRefetch: false });
            }
        };

        // 디바운싱 처리를 통한 데이터 두 번 로드되는 버그 수정
        const timeoutId = setTimeout(handleFetchNext, 100);
        return () => clearTimeout(timeoutId);
    }, [isInView, fetchNextPage, isFetchingNextPage, hasNextPage]);

    if (isError) {
        console.error('Error fetching posts data');
        return <CreatePost />;
    }

    const hasNoData = data?.pages[0]?.length === 0;

    return (
        <div className="mt-6 grid max-w-[1200px] grid-cols-1 gap-6 lg:grid-cols-2">
            {isLoading && (
                <div className="col-span-full my-30">
                    <LoadingThreeDots />
                </div>
            )}

            {/* 임시 데이터 */}
            {!isLoading &&
                data?.pages.map((page, pageIndex) =>
                    page.map((post: HomePost, postIndex: number) => (
                        <motion.div
                            key={`${pageIndex}-${post.id}`}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: 0.3,
                                delay: postIndex * 0.05,
                            }}
                        >
                            <RecruitPost post={post} />
                        </motion.div>
                    )),
                )}

            {/* 글이 없는 경우 띄울 Ui */}
            {hasNoData && <CreatePost />}

            {/* 첫 로딩을 끝낸 이후 데이터가 있으면 게시글 작성 버튼을 fixed로 띄웁니다. */}
            {!isLoading && !hasNoData && <CreatePostWindow />}

            <CreatePostWindow />

            {isFetchingNextPage && (
                <div className="col-span-full py-8">
                    <LoadingThreeDots />
                </div>
            )}

            <div className="col-span-full h-1 w-full" ref={ref}></div>
        </div>
    );
}
