import PostContent from '@/components/detail/PostContent';
import PostLocation from '@/components/detail/PostLocation';
import RecruitFooter from '@/components/detail/RecruitFooter';
import UserProfile from '@/components/detail/UserProfile';
import Tab from '@/components/detail/Tab';
import TabSection from '@/components/detail/TabSection';
import { Bookmark } from 'lucide-react';
import { notFound } from 'next/navigation';

import trendingPost from '../../../../../public/data/trending';

type Params = { id: string };

interface TestPageProps {
    params: Promise<Params>;
}

export default async function DetailPage({ params }: TestPageProps) {
    const { id } = await params;
    const post = trendingPost.find((post) => post.id === +id);
    if (!post) {
        notFound();
    }

    return (
        <div className="relative min-h-screen w-full">
            {/*배너*/}
            <section>
                <div className="rounded-xl bg-amber-600 md:h-75 md:w-full" />
            </section>
            {/*제목 섹션 */}
            <section className={`mt-7.5 flex justify-between`}>
                <div>
                    <h1 className={`mb-1 text-2xl font-bold`}>{post.title} </h1>
                    <div className="flex items-center text-sm text-[#666666]">
                        <span>조회수 {post.view}</span>
                        <div className="mx-2.5 h-2.5 w-px bg-neutral-400"></div>
                        <span>찜 {post.bookMark}</span>
                        <div className="mx-2.5 h-2.5 w-px bg-neutral-400"></div>
                        <span>댓글 {post.commentCount}</span>
                    </div>
                </div>
                {/*todo: isBookMarked? 조건부 fill */}
                <Bookmark fill={`black`} className={`my-auto`} />
            </section>
            {/*주최자정보섹션*/}
            <section>
                <TabSection post={post} />
            </section>

            <div className="flex h-[400vh] flex-col gap-3">
                <p>id: {post.id}</p>
                <p>title: {post.title}</p>
                <p>userName: {post.userName}</p>
                <p>age: {post.age}</p>
                <p>gender: {post.gender}</p>
                <p>startDate: {post.startDate}</p>
                <p>endDate: {post.endDate}</p>
            </div>
            <div className="relative flex min-h-screen w-full max-w-[1200px] flex-col gap-3 pb-[77px]">
                <UserProfile post={post} />
                <PostContent post={post} />
                <PostLocation location={post.location} />
                <RecruitFooter title={post.title} />
            </div>
        </div>
    );
}
