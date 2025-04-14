'use client';

import { ageLabelMap, genderLabelMap } from '@/lib/utils/enumMapper';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { openLoginModal } from '@/redux/slices/modalSlice';
import { useEffect, useState } from 'react';

interface MyProfile {
    kakaoId: string;
    nickname: string;
    thumbnailUrl: string;
    statusMessage: string;
    ageGroup: string;
    gender: string;
}

export default function useGetMyProfile() {
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.user.info);
    const [myProfile, setMyProfile] = useState<MyProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userInfo) {
                dispatch(openLoginModal());
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/profile/${userInfo.kakaoId}`,
                );
                const data = await res.json();
                setMyProfile({
                    ...data,
                    gender: genderLabelMap[data.gender] || '정보 없음',
                    ageGroup: ageLabelMap[data.ageGroup] || '정보 없음',
                });
            } catch (error) {
                console.error('프로필 불러오기 실패', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userInfo, dispatch]);

    return { myProfile, loading };
}
