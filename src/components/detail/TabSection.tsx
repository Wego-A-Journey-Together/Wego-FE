'use client';

import PostComment from '@/components/detail/PostComment';
import PostContent from '@/components/detail/PostContent';
import PostInput from '@/components/detail/PostInput';
import PostLocation from '@/components/detail/PostLocation';
import PostReview from '@/components/detail/PostReview';
import ScrollSpy from '@/components/detail/ScrollSpy';
import { DetailPost } from '@/types/DetailPost';
import { useRef } from 'react';

export default function TabSection({ post }: { post: DetailPost }) {
    // 스크롤 할 ref 위치 기록
    const contentAreaRef = useRef<HTMLDivElement>(null);
    const locationAreaRef = useRef<HTMLDivElement>(null);
    const memberAreaRef = useRef<HTMLDivElement>(null);
    const commentAreaRef = useRef<HTMLDivElement>(null);
    const reviewAreaRef = useRef<HTMLDivElement>(null);

    const refs = [
        contentAreaRef,
        locationAreaRef,
        memberAreaRef,
        commentAreaRef,
        reviewAreaRef,
    ];

    return (
        <>
            <section
                className={`sticky top-18 z-50 mt-17.5 border-b border-b-[#AAAAAAA]`}
            >
                <p className={`sr-only`}>탭그룹</p>
                <ScrollSpy refs={refs} />
            </section>
            {/*상세 정보 섹션*/}
            <section ref={contentAreaRef} className="scroll-mt-40">
                <PostContent post={post} />
            </section>
            {/*지도 섹션*/}
            <section ref={locationAreaRef} className="scroll-mt-40">
                <PostLocation
                    placeName={post.location.placeName}
                    lat={post.location.latitude}
                    lng={post.location.longitude}
                />
            </section>
            {/*todo: 멤버 소개 섹션*/}
            <section ref={memberAreaRef} className="scroll-mt-40">
                <div
                    className={`bg-sky-blue mt-12.5 flex h-40 items-center justify-center text-2xl font-black text-white`}
                >
                    <p> 멤버 소개 섹션 준비중 입니다.</p>
                </div>
            </section>
            {/*todo: 댓글과 리뷰도 ajax요청으로 변경 해야 할 것 같습니다.*/}
            {/*댓글 섹션*/}
            <section ref={commentAreaRef} className={`mt-15 scroll-mt-40`}>
                <PostComment postId={post.id} />
                <PostInput />
            </section>
            {/*리뷰 섹션*/}
            <section ref={reviewAreaRef} className="scroll-mt-40">
                <PostReview />
            </section>
        </>
    );
}
