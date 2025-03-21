import PostContent from '@/components/detail/PostContent';
import UserProfile from '@/components/detail/UserProfile';
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
        <div className="relative flex min-h-screen w-full flex-col gap-3">
            <UserProfile post={post} />
            <PostContent post={post} />
        </div>
    );
}
