'use client';

import { checkClosed } from '@/lib/checkClosed';
import { fetchGatheringAppliers } from '@/lib/fetcher/fetchGatheringAppliers';
import { MyPosts, fetchMySonGroup } from '@/lib/fetcher/fetchMySonGroup';
import { useEffect, useState } from 'react';

interface GroupPost {
    id: number;
    title: string;
    status: boolean;
    date: string;
    age: string;
    gender: string;
    participants: string;
    image: string;
    isDeleted: boolean;
}

/**
 *  내가 만든 동행 fetcher 받아온 데이터와 참여자 정보에서 받아온 데이터를 결합하는 훅
 */
export default function useSelectMyGathering() {
    const [myPosts, setMyPosts] = useState<MyPosts | null>(null);
    const [groupPosts, setGroupPosts] = useState<GroupPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const data = await fetchMySonGroup();
                setMyPosts(data);

                const postsWithAppliersPromises = data.content.map(
                    async (post) => {
                        try {
                            const appliers = await fetchGatheringAppliers(
                                post.gatheringId,
                            );

                            // 데이터 매핑
                            return {
                                id: post.gatheringId,
                                title: post.title,
                                status: checkClosed(post.endAt),
                                date: `${post.startAt} - ${post.endAt}`,
                                age: post.preferredAge,
                                gender: post.preferredGender,
                                participants: `${appliers.filter((a) => a.status === 'ACCEPTED').length}명 / 20명`, //todo: api에 최대 인원이 안들어오네요
                                image: post.thumbnailUrl,
                                isDeleted: false, // todo
                            };
                        } catch (err) {
                            console.error(
                                `동행 ID ${post.gatheringId}의 참여자 정보 로딩 실패:`,
                                err,
                            );
                            return null;
                        }
                    },
                );

                const posts = (
                    await Promise.all(postsWithAppliersPromises)
                ).filter(Boolean) as GroupPost[];
                setGroupPosts(posts);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : '알 수 없는 오류가 발생했습니다',
                );
            } finally {
                setIsLoading(false);
            }
        };

        void loadData();
    }, []);

    return {
        myPosts,
        groupPosts,
        isLoading,
        error,
    };
}
