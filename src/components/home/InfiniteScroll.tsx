'use client';

import RecruitPost from '@/components/common/RecruitPost';
import { BEHomePost } from '@/types/BEHomePost';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion, useInView } from 'motion/react';
import { useEffect, useRef } from 'react';

// api 생기면 삭제
import LoadingThreeDots from '../common/LoadingThreeDots';
import CreatePost from './CreatePost';
import CreatePostWindow from './CreatePostWindow';

interface InfiniteScrollProps {
    initialPosts: BEHomePost[];
    keyword?: string;
}

/**
 * 0 페이지 데이터는 SSR 로 넘겨받아서 랜더링
 * 이후 페이지에 대해 무한스크롤 (page=1, default size = 10 입니다.)
 * @param initialPosts
 * @param queryKey
 * @param fetchFn
 * @constructor
 */
export default function InfiniteScroll({
    initialPosts,
    keyword,
}: InfiniteScrollProps) {
    const ref = useRef(null);
    const isInView = useInView(ref);
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: keyword ? ['search', keyword] : ['posts'],
        queryFn: async ({ pageParam = 1 }) => {
            const baseURL = `${NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/list`;
            const query = `page=${pageParam}&size=12`;
            const keywordQuery = keyword
                ? `&keyword=${encodeURIComponent(keyword)}`
                : '';
            const res = await fetch(`${baseURL}?${query}${keywordQuery}`, {
                cache: 'no-store',
            });
            return res.json();
        },
        getNextPageParam: (lastPage) => {
            return lastPage.last ? undefined : lastPage.number + 1;
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
            {/* SSR로 받은 초기 데이터 렌더링 */}
            {initialPosts.map((post) => (
                <motion.div
                    key={`initial-${post.id}`}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <RecruitPost post={post} />
                </motion.div>
            ))}

            {/* 클라이언트에서 가져온 나머지 페이지 */}
            {data?.pages.map((page, pageIndex) =>
                page.content.map((post: BEHomePost, postIndex: number) => (
                    <motion.div
                        key={`${pageIndex + 1}-${post.id}`}
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
