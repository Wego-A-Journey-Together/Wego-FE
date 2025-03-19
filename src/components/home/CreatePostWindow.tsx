'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function CreatePostWindow() {
    const [isVisible, setIsVisible] = useState(true);
    const [prevScroll, setPrevScroll] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const isScrollDown = currentScrollY > prevScroll;

            if (isScrollDown) setIsVisible(false);
            else setIsVisible(true);

            setPrevScroll(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll);
    }, [prevScroll]);

    return (
        <div
            className={`fixed bottom-10 left-1/2 z-10 max-h-[140px] w-[420px] -translate-x-1/2 rounded-2xl bg-white shadow-md transition-all duration-300 ${
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
            }`}
        >
            <div className="flex flex-col items-center gap-4 px-5 py-6">
                <p className="text-sm text-[#666666]">
                    찾고 있는 동행이 없다면?
                </p>
                <Button className="h-[59px] w-full">
                    <span className="text-lg font-bold text-white">
                        내가 원하는 동행글 작성하기
                    </span>
                </Button>
            </div>
        </div>
    );
}
