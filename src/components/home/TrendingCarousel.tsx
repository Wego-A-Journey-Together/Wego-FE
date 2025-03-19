'use client';

import { CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import trendingPost from '../../../public/data/trending';

interface TrendingCarouselProps {
    className?: string;
}

export function TrendingCarousel({ className }: TrendingCarouselProps) {
    const [align, setAlign] = useState<'start' | 'center'>('start');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setAlign('center');
            } else {
                setAlign('start');
            }
        };

        // 초기 실행 및 이벤트 등록
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <div className={cn('relative w-full overflow-hidden', className)}>
            <Carousel
                className="w-full"
                opts={{
                    align,
                    loop: true,
                }}
            >
                <section className={`flex justify-between`}>
                    <div className={`align-center mb-5 flex gap-2`}>
                        <Image
                            src={'/icon/trending.png'}
                            alt={'Hot'}
                            width={26}
                            height={26}
                        />
                        <h2 className={`flex text-xl font-semibold`}>
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

                <CarouselContent className={`gap-1`}>
                    {trendingPost.map((trend, index) => (
                        <CarouselItem
                            key={index}
                            className="min-w-[400px] basis-auto"
                        >
                            <CardContent className="relative flex h-[248px] w-[400px] cursor-pointer items-center justify-center overflow-hidden rounded-xl p-0">
                                <Link
                                    href={`/buddy/${trend.id}`}
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
