'use client';

import InfiniteScroll from '@/components/home/InfiniteScroll';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocale } from '@/hooks/useLocale';
import { BEHomePost } from '@/types/BEHomePost';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useEffect } from 'react';

export default function LikedPage() {
    const { t } = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const [isGroupOpen, setIsGroupOpen] = useState(false);
    const [formattedPosts, setFormattedPosts] = useState<BEHomePost[]>([]);

    useEffect(() => {
        const fetchLikedPosts = async () => {
            const NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;
            try {
                const response = await fetch(`${NEST_BFF_URL}/api/me/likes`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                // 중복으로 생성되는 버그 수정
                const uniquePosts = Array.isArray(data)
                    ? data.filter(
                          (post, index, self) =>
                              index === self.findIndex((p) => p.id === post.id),
                      )
                    : [];
                setFormattedPosts(uniquePosts);
            } catch (error) {
                console.error('Failed to fetch liked posts:', error);
                setFormattedPosts([]);
            }
        };

        fetchLikedPosts();
    }, []);

    const handleCheckboxChange = async (checked: boolean) => {
        setIsGroupOpen(checked);
        setIsLoading(true);

        try {
            const filterParams = {
                isGroupOpen: checked,
            };
            const queryString = encodeURIComponent(
                JSON.stringify(filterParams),
            );
            router.push(`${pathname}?filters=${queryString}`);
        } catch (error) {
            console.error('필터 적용 오류:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-4 py-6">
            <div className="flex items-center justify-between pb-4">
                <h1 className="text-xl font-bold">찜한 동행</h1>
            </div>
            <div className="py-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        저장된 동행 {formattedPosts.length}개
                    </p>
                    <div className="flex items-center">
                        <Checkbox
                            id="likedPageFilter"
                            className="mr-1.5 ml-auto"
                            checked={isGroupOpen}
                            onCheckedChange={handleCheckboxChange}
                            disabled={isLoading}
                        />
                        <label
                            htmlFor="likedPageFilter"
                            className="cursor-pointer text-sm text-gray-600"
                            onClick={() =>
                                !isLoading && handleCheckboxChange(!isGroupOpen)
                            }
                        >
                            {t.lookfor}
                        </label>
                    </div>
                </div>
                <section className="mt-4">
                    <InfiniteScroll initialPosts={formattedPosts} />
                </section>
            </div>
        </div>
    );
}
