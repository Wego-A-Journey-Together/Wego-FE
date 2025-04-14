import { cn } from '@/lib';
import { Star } from 'lucide-react';

/**
 * 별들 간격이 있어서 소수점 완벽 지원은 애매하고 절반까지 지원이 올바른 것 같습니다. 1~10까지 숫자를 1.0~5.0 으로 매핑해도 될것같아요
 * @param rating
 * @constructor
 */
export default function ReviewRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => {
                const isFull = i <= Math.floor(rating);
                const isHalf = i - rating <= 0.5 && i > rating;

                return (
                    <div key={i} className="relative h-9 w-9">
                        {/* 빈 별 (기본 상태 - 채워지지 않음) */}
                        <Star
                            strokeWidth={1}
                            className="h-9 w-9 p-0.5 text-[#FFD900]"
                        />

                        {/* 채워진 별 (clip-path로 덮기) */}
                        {(isFull || isHalf) && (
                            <Star
                                fill="currentColor"
                                strokeWidth={1}
                                className={cn(
                                    'absolute top-0 left-0 h-9 w-9 fill-[#FFD900] p-0.5 text-[#FFD900]',
                                    isHalf && 'clip-half',
                                )}
                                style={
                                    isHalf
                                        ? { clipPath: 'inset(0 50% 0 0)' }
                                        : {}
                                }
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
