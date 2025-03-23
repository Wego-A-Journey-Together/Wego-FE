import PostComment from '@/components/detail/PostComment';
import PostContent from '@/components/detail/PostContent';
import PostInput from '@/components/detail/PostInput';
import PostLocation from '@/components/detail/PostLocation';
import PostReview from '@/components/detail/PostReview';
import Tab from '@/components/detail/Tab';

import { TrendingPost } from '../../../public/data/trending';

export default function TabSection({ post }: { post: TrendingPost }) {
    return (
        <>
            // 탭 섹션
            <section
                className={`sticky top-18 z-50 mt-17.5 border-b border-b-[#AAAAAAA]`}
            >
                <p className={`sr-only`}>탭그룹</p>
                <Tab />
            </section>
            <section>
                <PostContent post={post} />
            </section>
            {/*지도 섹션*/}
            <section>
                <PostLocation location={post.location} />
            </section>
            {/*todo: 멤버 소개 섹션*/}
            {/*댓글 섹션*/}
            <section className={`mt-15`}>
                <PostComment />
                <PostInput />
            </section>
            {/*리뷰 섹션*/}
            <section>
                <PostReview />
            </section>
        </>
    );
}
