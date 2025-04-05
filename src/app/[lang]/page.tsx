import HomeSearch from '@/components/home/HomeSearch';
import InfiniteScroll from '@/components/home/InfiniteScroll';
import { TrendingCarousel } from '@/components/home/TrendingCarousel';

export default async function Home() {
    const NEST_BFF_URL = process.env.NEST_BFF_URL;
    const res = await fetch(`${NEST_BFF_URL}/api/trending`, {
        cache: 'no-store',
    });
    const trendingPosts = await res.json();
    return (
        <div>
            {/* 인기 모임 캐러셀 영역 */}
            <TrendingCarousel
                className="mt-5 sm:mt-7.5"
                posts={trendingPosts}
            />

            {/* 필터링 영역 */}
            <HomeSearch />

            {/* 동행 모집글 리스트 */}
            <section className="m-auto">
                <InfiniteScroll />
            </section>
        </div>
    );
}

/**
 * SEO 와 정적 빌드를 위한 언어 설정
 */
export async function generateStaticParams() {
    return [{ lang: 'ko' }, { lang: 'en' }];
}
