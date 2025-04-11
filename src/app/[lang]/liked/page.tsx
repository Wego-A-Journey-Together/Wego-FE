import InfiniteScroll from '@/components/home/InfiniteScroll';
import { LikedPageFilter } from '@/components/liked/LikedPageFilter';

export default async function LikedPage() {
    const NEST_BFF_URL = process.env.NEST_BFF_URL;

    const likedPostsRes = await fetch(
        `${NEST_BFF_URL}/api/gatherings/like/my`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        },
    );
    const likedPosts = await likedPostsRes.json();

    return (
        <div className="mx-auto px-4 py-8">
            <h1 className="mtext-2xl font-bold">찜한 동행</h1>
            <section className="m-auto">
                <LikedPageFilter />
                <InfiniteScroll initialPosts={likedPosts} />
            </section>
        </div>
    );
}
