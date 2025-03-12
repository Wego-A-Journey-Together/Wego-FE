"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import RecruitPost from "@/components/common/RecruitPost";

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
      queryKey: ["posts"],
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
    <div className="mt-6 flex flex-col gap-6">
      <RecruitPost />
      {data?.pages.map((page) =>
        page.map((post: Post) => {
          return (
            <div className="w-full rounded-lg bg-white p-4" key={post.id}>
              <h1 className="text-lg font-bold">{post.title}</h1>
              <h2>#{post.id}</h2>
              <p>{post.body}</p>
            </div>
          );
        }),
      )}
      {isFetchingNextPage && <h2 className="text-center">로딩 중</h2>}

      <div ref={ref}></div>
    </div>
  );
}
