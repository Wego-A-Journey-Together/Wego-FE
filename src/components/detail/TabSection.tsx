'use client';

import PostComment from '@/components/detail/PostComment';
import PostContent from '@/components/detail/PostContent';
import PostInput from '@/components/detail/PostInput';
import PostLocation from '@/components/detail/PostLocation';
import PostReview from '@/components/detail/PostReview';
import Tab from '@/components/detail/Tab';
import { useRef } from 'react';

import { TrendingPost } from '../../../public/data/trending';

export default function TabSection({ post }: { post: TrendingPost }) {
    const contentAreaRef = useRef<HTMLDivElement>(null);
    const locationAreaRef = useRef<HTMLDivElement>(null);
    const memberAreaRef = useRef<HTMLDivElement>(null);
    const commentAreaRef = useRef<HTMLDivElement>(null);
    const reviewAreaRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <section
                className={`sticky top-18 z-50 mt-17.5 border-b border-b-[#AAAAAAA]`}
            >
                <p className={`sr-only`}>탭그룹</p>
                <Tab />
            </section>
            {/*상세 정보 섹션*/}
            <section ref={contentAreaRef}>
                <PostContent post={post} />
            </section>
            {/*지도 섹션*/}
            <section ref={locationAreaRef}>
                <PostLocation location={post.location} />
            </section>
            {/*todo: 멤버 소개 섹션*/}
            <section ref={memberAreaRef}>
                <div
                    className={`bg-sky-blue mt-12.5 flex h-40 items-center justify-center text-2xl font-black text-white`}
                >
                    <p> 멤버 소개 섹션이에</p>
                    <p className={`animate-spin`}> 요</p>
                </div>
            </section>
            {/*댓글 섹션*/}
            <section ref={commentAreaRef} className={`mt-15`}>
                <PostComment />
                <PostInput />
            </section>
            {/*리뷰 섹션*/}
            <section ref={reviewAreaRef}>
                <PostReview />
            </section>
        </>
    );
}
