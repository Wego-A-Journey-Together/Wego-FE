'use client';

import { CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import useMediaQuery from '@/hooks/useMediaQuery';
import { cn } from '@/lib';
import Image from 'next/image';
import Link from 'next/link';

import trendingPost from '../../../public/data/trending';

interface TrendingCarouselProps {
    className?: string;
}

export function TrendingCarousel({ className }: TrendingCarouselProps) {
    const isMobile = useMediaQuery('(max-width: 630px)');

    return (
        <div className={cn('relative w-full overflow-hidden', className)}>
            <Carousel
                className="w-full"
                opts={{
                    align: 'start',
                    loop: true,
                }}
            >
                <section className={`-mb-1 flex justify-between sm:mb-0`}>
                    <div
                        className={`align-center mb-5 flex gap-1.5 text-center`}
                    >
                        {isMobile ? (
                            <Image
                                src={'/icon/trending.svg'}
                                alt={'Hot'}
                                width={18}
                                height={18}
                                className={'translate-y-0.5'}
                            />
                        ) : (
                            <Image
                                src={'/icon/trending.svg'}
                                alt={'Hot'}
                                width={26}
                                height={26}
                            />
                        )}
                        <h2
                            className={`flex items-end text-base font-semibold sm:text-xl`}
                        >
                            이번 주 Hot한 동행
                        </h2>
                    </div>
                    {/* 버튼 컨테이너 - absolute 포지셔닝을 제거하여 flex 내에 유지 */}
                    <div className="mt-5 flex justify-end">
                        <CarouselPrevious
                            className="relative top-0 right-0 left-0 m-0 h-8 transform-none rounded-l-md rounded-r-none border border-r-0 border-gray-200 bg-transparent shadow-none hover:bg-gray-50"
                            variant="ghost"
                        />
                        <CarouselNext
                            className="relative top-0 right-0 left-0 m-0 h-8 transform-none rounded-l-none rounded-r-md border border-gray-200 bg-transparent shadow-none hover:bg-gray-50"
                            variant="ghost"
                        />
                    </div>
                </section>

                <CarouselContent className="gap-1 px-1">
                    {trendingPost.map((trend, index) => (
                        <CarouselItem
                            key={index}
                            className="min-w-[264px] basis-auto sm:min-w-[400px]"
                        >
                            <CardContent className="relative flex h-[164px] w-[264px] cursor-pointer items-center justify-center overflow-hidden rounded-xl p-0 sm:h-[248px] sm:w-[400px]">
                                <Link
                                    href={`/detail/${trend.id}`}
                                    className="relative h-full w-full"
                                >
                                    <Image
                                        src={trend.imageSrc}
                                        alt="제주소녀"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* 이미지와 더 자연스럽게 어울리는 그라데이션 오버레이 */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                </Link>

                                {/* 텍스트 정보 - 더 나은 위치 지정을 위해 그라데이션 div 외부로 이동 */}
                                <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                                    {/* 프로필 정보 */}
                                    <div className="flex w-full items-center">
                                        <Link
                                            href={`/profile/${trend.userId}`}
                                            className="hover:text-sky-blue mb-2 flex w-auto items-center gap-2 transition-colors"
                                        >
                                            <Image
                                                src={trend.profileImage}
                                                alt="profile"
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                            <span className="text-sm font-semibold">
                                                {trend.userName}
                                            </span>
                                            <span className="text-sm">
                                                {trend.age} · {trend.gender}
                                            </span>
                                        </Link>
                                        <div className="flex-grow"></div>
                                    </div>
                                    <div className="flex justify-between">
                                        {/* 제목 */}
                                        <p className="text-base font-semibold">
                                            {trend.title}
                                        </p>

                                        {/* 날짜 */}
                                        <div className="flex items-center gap-1 text-sm">
                                            <Image
                                                src={'/icon/calender.png'}
                                                alt={'📅'}
                                                width={15}
                                                height={14}
                                            />
                                            <span>
                                                {trend.startDate} -{' '}
                                                {trend.endDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </CarouselItem>
                    ))}{' '}
                </CarouselContent>
            </Carousel>
        </div>
    );
}
