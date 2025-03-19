import CreatePostWindow from '@/components/home/CreatePostWindow';
import FilterSelector from '@/components/home/FilterSelector';
import InfiniteScroll from '@/components/home/InfiniteScroll';
import { TrendingCarousel } from '@/components/home/TrendingCarousel';
import { Checkbox } from '@/components/ui/checkbox';

export default function Home() {
    return (
        <div className="max-h-auto min-h-screen">
            {/* 인기 모임 캐러셀 영역 */}
            <TrendingCarousel className="mt-8" />

            {/* 필터링 영역 */}
            <h1 className="mt-[75px] mb-[26px] text-2xl font-semibold">
                나와 함께 할 동행 찾기
            </h1>
            <FilterSelector />
            <section className="mt-[30px] flex items-center text-sm text-[#808080]">
                <h2>
                    검색된 동행 <span className="font-bold">{'90'}</span>개
                </h2>
                <Checkbox id="showRecruiting" className="mr-1.5 ml-auto" />
                <label htmlFor="showRecruiting">동행구함만 보기</label>
            </section>

            {/* 동행 모집글 리스트 */}
            <section className="m-auto max-h-auto min-h-screen">
                <InfiniteScroll />
            </section>

            {/* 동행 모집 글쓰기 */}
            <CreatePostWindow />
        </div>
    );
}
