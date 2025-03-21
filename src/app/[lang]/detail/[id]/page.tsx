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
            {/*30픽셀 여백 ( 우선 제목에 마진탑 줬습니다 )*/}
            <section className={`mt-7.5 flex justify-between`}>
                <div>
                    <h1 className={`mb-1 text-xl font-bold`}>{post.title} </h1>
                    <div className="flex items-center text-sm text-neutral-500">
                        <span>조회수 {post.view}</span>
                        <div className="mx-2.5 h-2.5 w-px bg-neutral-300"></div>
                        <span>찜 {post.bookMark}</span>
                        <div className="mx-2.5 h-2.5 w-px bg-neutral-300"></div>
                        <span>댓글 {post.commentCount}</span>
                    </div>
                </div>
                {/*todo: isBookMarked? 조건부 fill */}
                <Bookmark fill={`black`} className={`my-auto`} />
            </section>
            {/*주최자정보섹션*/}
            <section></section>
            <div className="flex flex-col gap-3">
                <p>id: {post.id}</p>
                <p>title: {post.title}</p>
                <p>userName: {post.userName}</p>
                <p>age: {post.age}</p>
                <p>gender: {post.gender}</p>
                <p>startDate: {post.startDate}</p>
                <p>endDate: {post.endDate}</p>
            </div>
        </div>
    );
}
