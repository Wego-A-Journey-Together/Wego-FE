import { notFound } from 'next/navigation';

import trendingPost from '../../../../../public/data/trending';

type Params = { id: string };

interface TestPageProps {
    params: Promise<Params>;
}

export default async function BuddyPage({ params }: TestPageProps) {
    const { id } = await params;
    const post = trendingPost.find((post) => post.id === +id);
    if (!post) {
        notFound();
    }
    return (
        <div className="w-full min-h-screen relative flex flex-col justify-center items-center gap-3">
            <h1 className={`text-2xl font-black`}>{id}게시물 페이지 에요 </h1>
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
