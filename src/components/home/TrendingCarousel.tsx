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

interface TrendingCarouselProps {
    className?: string;
}

export function TrendingCarousel({ className }: TrendingCarouselProps) {
    return (
        <div className={cn('w-full relative overflow-hidden', className)}>
            <Carousel className="w-full">
                <section className={`flex justify-between`}>
                    <div className={`flex gap-2 mb-5 align-center`}>
                        <Image
                            src={'/icon/trending.png'}
                            alt={'Hot'}
                            width={26}
                            height={26}
                        />
                        <h2 className={`flex font-semibold text-xl`}>
                            이번 주 Hot한 동행
                        </h2>
                    </div>
                    {/* 버튼 컨테이너 - absolute 포지셔닝을 제거하여 flex 내에 유지 */}
                    <div className="flex justify-end mt-5">
                        <CarouselPrevious
                            className="relative left-0 right-0 top-0 transform-none m-0 h-8 bg-transparent border border-gray-200 rounded-l-md rounded-r-none border-r-0 shadow-none hover:bg-gray-50"
                            variant="ghost"
                        />
                        <CarouselNext
                            className="relative left-0 right-0 top-0 transform-none m-0 h-8 bg-transparent border border-gray-200 rounded-r-md rounded-l-none shadow-none hover:bg-gray-50"
                            variant="ghost"
                        />
                    </div>
                </section>

                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem
                            key={index}
                            className="md:basis-1/2 lg:basis-1/3"
                        >
                            <CardContent className="relative overflow-hidden w-[400px] h-[248px] flex items-center justify-center rounded-xl p-0">
                                <div className="w-full h-full relative">
                                    <Image
                                        src="/image/jejuGirl.png"
                                        alt="제주소녀"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* 이미지와 더 자연스럽게 어울리는 그라데이션 오버레이 */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                </div>

                                {/* 텍스트 정보 - 더 나은 위치 지정을 위해 그라데이션 div 외부로 이동 */}
                                <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                                    {/* 프로필 정보 */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <Image
                                            src="/image/userIcon.png"
                                            alt="profile"
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                        <span className="text-sm font-semibold">
                                            김동키씨
                                        </span>
                                        <span className="text-sm">
                                            20대 · 여자
                                        </span>
                                    </div>
                                    <div className="flex justify-between px-4">
                                        {/* 제목 */}
                                        <p className="text-base font-semibold">
                                            제주도 동행 구합니다
                                        </p>

                                        {/* 날짜 */}
                                        <div className="flex items-center gap-1 text-sm">
                                            <Image
                                                src={'/icon/calender.png'}
                                                alt={'📅'}
                                                width={15}
                                                height={14}
                                            />
                                            <span>25.03.10 - 25.03.12</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}
