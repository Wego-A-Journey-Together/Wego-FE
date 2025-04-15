'use client';

import { fetchGatherings, hasActiveFilters } from '@/api/gatheringApi';
import RecruitPost from '@/components/common/RecruitPost';
import { BEHomePost } from '@/types/BEHomePost';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion, useInView } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

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
    const searchParams = useSearchParams();
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch,
    } = useInfiniteQuery({
        queryKey: keyword
            ? ['search', keyword]
            : ['posts', searchParams.toString()],
        queryFn: async ({ pageParam = 1 }) => {
            try {
                if (keyword) {
                    const baseURL = `${NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/list`;
                    const query = `page=${pageParam - 1}&size=10`;
                    const keywordQuery = `&keyword=${encodeURIComponent(keyword)}`;
                    const res = await fetch(
                        `${baseURL}?${query}${keywordQuery}`,
                        {
                            cache: 'no-store',
                        },
                    );
                    return res.json();
                } else {
                    console.log('Fetching page:', pageParam);
                    return await fetchGatherings(
                        new URLSearchParams(searchParams.toString()),
                        pageParam,
                    );
                }
            } catch (error) {
                console.error('Fetch error:', error);
                throw error;
            }
        },
        getNextPageParam: (lastPage) => {
            // 마지막 페이지인 경우 undefined 반환
            if (lastPage.last) {
                console.log('No more pages to fetch');
                return undefined;
            }

            // 다음 페이지 번호 계산 (백엔드는 0-based, 프론트엔드는 1-based)
            return lastPage.number + 2; // 0-based에서 1-based로 변환 후 다음 페이지
        },
        initialPageParam: 1,
    });

    useEffect(() => {
        const handleFetchNext = async () => {
            if (isInView && !isFetchingNextPage && hasNextPage) {
                console.log('Fetching next page...');
                await fetchNextPage({ cancelRefetch: false });
            }
        };

        // 디바운싱 처리를 통한 데이터 두 번 로드되는 버그 수정
        const timeoutId = setTimeout(handleFetchNext, 300); // 100ms에서 300ms로 증가
        return () => clearTimeout(timeoutId);
    }, [isInView, fetchNextPage, isFetchingNextPage, hasNextPage]);

    // 검색 파라미터가 변경될 때마다 데이터 다시 가져오기
    useEffect(() => {
        refetch();
    }, [searchParams, refetch]);

    if (isError) {
        console.error('Error fetching posts data');
        return <CreatePost />;
    }

    // 필터링 상태 및 데이터 확인
    const activeFilters = hasActiveFilters(
        new URLSearchParams(searchParams.toString()),
    );
    const hasNoData = !data?.pages?.[0]?.content?.length;

    return (
        <div className="mt-6 grid max-w-[1200px] grid-cols-1 gap-6 lg:grid-cols-2">
            {/* SSR로 받은 초기 데이터는 필터링이 없을 때만 렌더링 */}
            {!activeFilters &&
                !data?.pages?.length &&
                initialPosts?.map((post) => (
                    <motion.div
                        key={`initial-${post.id}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <RecruitPost post={post} />
                    </motion.div>
                ))}

            {/* 클라이언트에서 가져온 데이터 */}
            {data?.pages?.map((page, pageIndex) =>
                (page?.content || []).map(
                    (post: BEHomePost, postIndex: number) => (
                        <motion.div
                            key={`page-${pageIndex}-post-${post.id}`}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: 0.3,
                                delay: postIndex * 0.05,
                            }}
                        >
                            <RecruitPost post={post} />
                        </motion.div>
                    ),
                ),
            )}

            {/* 글이 없는 경우 띄울 Ui */}
            {hasNoData && <CreatePost />}

            {/* 첫 로딩을 끝낸 이후 데이터가 있으면 게시글 작성 버튼을 fixed로 띄웁니다. */}
            {!isLoading && !hasNoData && <CreatePostWindow />}

            {isFetchingNextPage && (
                <div className="col-span-full py-8">
                    <LoadingThreeDots />
                </div>
            )}

            <div className="col-span-full h-1 w-full" ref={ref}></div>
        </div>
    );
}
