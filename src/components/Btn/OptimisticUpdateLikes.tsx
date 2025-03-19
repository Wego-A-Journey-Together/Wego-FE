'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib';
import { Heart } from 'lucide-react';
import { useState } from 'react';

export default function OptimisticUpdateLikes() {
    const [isLike, setIsLike] = useState(false);
    const handleClick = async () => {
        setIsLike((prev) => !prev);
    };
    return (
        <Button
            variant="outline"
            className="flex flex-1 items-center gap-1.5 rounded-lg bg-white px-[30px] py-2 md:flex-none"
            onClick={handleClick}
        >
            <Heart
                className={cn(
                    'transition-colors',
                    isLike && 'fill-rose-700 stroke-rose-500',
                )}
            />
            <span className="font-semibold">찜하기</span>
        </Button>
    );
}
