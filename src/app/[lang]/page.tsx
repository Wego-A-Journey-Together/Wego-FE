import {AddGroupButtonModal} from '@/components/home/AddGroupButtonModal';
import DateSelect from '@/components/home/DateSelect';
import InfiniteScroll from '@/components/home/InfiniteScroll';
import RegionSelect from '@/components/home/RegionSelect';
import SortDateSelect from '@/components/home/SortDateSelect';
import {TrendingCarousel} from '@/components/home/TrendingCarousel';

export default function Home() {
    return (
        <div className="max-h-auto min-h-screen ">
            {/* 인기 모임 캐러셀 영역 */}
            <TrendingCarousel className="mt-8"/>
            <section className="m-auto max-h-auto min-h-screen max-w-7xl bg-amber-200 px-24 py-8">
                <div className="h-auto w-full bg-gray-300">


                    <div className="flex h-20 w-full items-center justify-center bg-blue-400">
                        <h1>지금 모임에 참여하세요!</h1>
                    </div>
                    <div className="relative flex h-20 w-full items-center bg-green-200">
                        <AddGroupButtonModal/>
                    </div>
                </div>
                <div className="flex h-14 items-center gap-2">
                    <RegionSelect/>
                    <DateSelect/>
                    <SortDateSelect/>
                </div>
                <InfiniteScroll/>
            </section>
        </div>
    );
}
