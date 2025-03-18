'use client';

import RecruitPost from '@/components/common/RecruitPost';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'motion/react';
import { useEffect, useRef } from 'react';

// 임시 타입
interface Post {
    id: number;
    title: string;
    body: string;
}

export default function InfiniteScroll() {
    const ref = useRef(null);
    const isInView = useInView(ref);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ['posts'],
            queryFn: async ({ pageParam = 1 }) => {
                const response = await fetch(
                    // 임시 데이터입니다.
                    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`,
                );
                return response.json();
            },
            getNextPageParam: (lastPage, allPages) => {
                return lastPage.length ? allPages.length + 1 : undefined;
            },
            initialPageParam: 1,
        });

    useEffect(() => {
        if (isInView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [isInView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1200px]">
            {data?.pages.map((page) =>
                page.map((post: Post) => (
                    <div key={post.id}>
                        <RecruitPost />
                    </div>
                )),
            )}
            {isFetchingNextPage && (
                <div className="col-span-full flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
                </div>
            )}

            <div className="h-1" ref={ref}></div>
        </div>
    );
}
