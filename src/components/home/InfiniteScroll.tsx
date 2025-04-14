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
}

export default function InfiniteScroll({ initialPosts }: InfiniteScrollProps) {
    const ref = useRef(null);
    const isInView = useInView(ref);
    const searchParams = useSearchParams();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['posts', searchParams.toString()],
        queryFn: async ({ pageParam = 1 }) => {
            try {
                return await fetchGatherings(
                    new URLSearchParams(searchParams.toString()),
                    pageParam,
                );
            } catch (error) {
                console.error('Fetch error:', error);
                throw error;
            }
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.last) return undefined;
            return lastPage.number + 2;
        },
        initialPageParam: 1,
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (isInView && !isFetchingNextPage && hasNextPage) {
                fetchNextPage({ cancelRefetch: false });
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [isInView, fetchNextPage, isFetchingNextPage, hasNextPage]);

    useEffect(() => {
        refetch();
    }, [searchParams, refetch]);

    if (isError) {
        console.error('Error fetching posts data');
        return <CreatePost />;
    }

    const activeFilters = hasActiveFilters(
        new URLSearchParams(searchParams.toString()),
    );
    const hasNoData = !data?.pages?.[0]?.content?.length;

    return (
        <div className="mt-6 grid max-w-[1200px] grid-cols-1 gap-6 lg:grid-cols-2">
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

            {hasNoData && <CreatePost />}
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
