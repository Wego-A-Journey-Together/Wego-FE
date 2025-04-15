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
    isLikedPage?: boolean; // 찜한 페이지인지 여부를 확인하는 prop 추가
}

export default function InfiniteScroll({
    initialPosts,
    keyword,
    isLikedPage = false, // 기본값은 false
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
            : isLikedPage
              ? ['liked-posts']
              : ['posts', searchParams.toString()],
        queryFn: async ({ pageParam = 1 }) => {
            try {
                // 찜한 페이지인 경우 추가 데이터를 불러오지 않고 초기 데이터만 사용
                if (isLikedPage) {
                    // 페이지네이션 형식에 맞게 초기 데이터 반환
                    return {
                        content: initialPosts,
                        last: true, // 더 이상 페이지가 없음을 표시
                        number: 0,
                    };
                }

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
        // 찜한 페이지인 경우 초기 데이터만 사용하므로 enabled 옵션 추가
        enabled: !isLikedPage,
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
            {/* 찜한 페이지인 경우 initialPosts만 표시 */}
            {isLikedPage ? (
                initialPosts?.map((post) => (
                    <motion.div
                        key={`liked-${post.id}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <RecruitPost post={post} />
                    </motion.div>
                ))
            ) : (
                <>
                    {/* 기존 SSR 데이터 표시 로직 */}
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
                </>
            )}

            {/* 글이 없는 경우 띄울 Ui */}
            {!isLikedPage && hasNoData && <CreatePost />}

            {/* 첫 로딩을 끝낸 이후 데이터가 있으면 게시글 작성 버튼을 fixed로 띄웁니다. */}
            {!isLoading && !hasNoData && !isLikedPage && <CreatePostWindow />}

            {!isLikedPage && isFetchingNextPage && (
                <div className="col-span-full py-8">
                    <LoadingThreeDots />
                </div>
            )}

            {!isLikedPage && (
                <div className="col-span-full h-1 w-full" ref={ref}></div>
            )}
        </div>
    );
}
