'use client';

import { Button } from '@/components/ui/button';
import {
    AnimatePresence,
    motion,
    useMotionValueEvent,
    useScroll,
} from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CreatePostWindow() {
    const [isVisible, setIsVisible] = useState(true);
    const { scrollY } = useScroll();
    const [initialRender, setInitialRender] = useState(true);

    useEffect(() => {
        setInitialRender(false);
    }, []);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        if (initialRender) return;

        const previous = scrollY.getPrevious();
        if (previous !== undefined) {
            setIsVisible(latest < previous);
        }
    });

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-10 left-1/2 z-10 max-h-[140px] w-[420px] -translate-x-1/2 rounded-2xl bg-white shadow-md"
                >
                    <div className="flex flex-col items-center gap-4 px-5 py-6">
                        <p className="text-sm text-[#666666]">
                            찾고 있는 동행이 없다면?
                        </p>
                        <Button className="h-[59px] w-full">
                            <Link
                                href={'/write'}
                                className="text-lg font-bold text-white"
                            >
                                내가 원하는 동행글 작성하기
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
