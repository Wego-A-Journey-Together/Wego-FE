'use client';

import RecruitPost from '@/components/common/RecruitPost';
import { Button } from '@/components/ui/button';
import { PostContentProps } from '@/types/PostContent';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion, useInView } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

// api 생기면 삭제
import trendingPost from '../../../public/data/trending';
import LoadingThreeDots from '../common/LoadingThreeDots';
import CreatePostWindow from './CreatePostWindow';

export default function InfiniteScroll() {
    const ref = useRef(null);
    const isInView = useInView(ref);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetch(
                // 임시 링크입니다.
                `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=12`,
            );
            // return response.json();
            return [];
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
        return <div>Error: {error.message}</div>;
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
            {trendingPost.map((post) => (
                <motion.div
                    key={post.id}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <RecruitPost post={post} />
                </motion.div>
            ))}

            {/* api 생기면 다시 활성화, 글이 없는 경우 띄울 Ui */}
            {/* {hasNoData && (
                <div className="col-span-full mx-auto w-full max-w-[380px]">
                    <div className="mt-40 mb-[329px] flex flex-col items-center gap-[30px]">
                        <p className="text-center text-base font-medium text-gray-500">
                            조건에 부합하는 동행이 없어요.
                            <br />
                            내가 원하는 동행을 만들어보세요!
                        </p>

                        <Button className="h-[59px] w-full">
                            <span className="text-lg font-bold">
                                내가 원하는 동행글 작성하기
                            </span>
                        </Button>
                    </div>
                </div>
            )} */}
            {/* 첫 로딩을 끝낸 이후 데이터가 있으면 게시글 작성 버튼을 fixed로 띄웁니다. */}
            {/* {!isLoading && !hasNoData && <CreatePostWindow />} */}

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
