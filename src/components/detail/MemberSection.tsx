'use client';

import UserProfile from '@/components/detail/UserProfile';
import { useEffect, useState } from 'react';

import LoadingThreeDots from '../common/LoadingThreeDots';

// 참여자 정보 인터페이스 정의
interface GatheringMemberResponseDto {
    userId: number;
    user: UserProfileDto;
    status: 'APPLYING' | 'BLOCKED' | 'ACCEPTED';
}
interface UserProfileDto {
    kakaoId: number;
    nickname: string;
    thumbnailUrl: string;
    statusMessage: string;
    gender: 'MALE' | 'FEMALE' | 'ANY';
    ageGroup:
        | 'ALL'
        | 'TEENS'
        | 'TWENTIES'
        | 'THIRTIES'
        | 'FORTIES'
        | 'FIFTIES'
        | 'SIXTIES'
        | 'SEVENTIES';
}
interface MemberSectionProps {
    gatheringId: number;
}

export default function MemberSection({ gatheringId }: MemberSectionProps) {
    // 참여자 목록 상태 관리
    const [participants, setParticipants] = useState<
        GatheringMemberResponseDto[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 참여자 목록 조회 api
    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                setIsLoading(true);
                const NEXT_PUBLIC_NEST_BFF_URL =
                    process.env.NEXT_PUBLIC_NEST_BFF_URL ||
                    'http://localhost:3000';
                const response = await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/participants/${gatheringId}`,
                    {
                        credentials: 'include',
                    },
                );

                if (!response.ok) {
                    throw new Error(
                        `참여자 목록을 불러오는데 실패했습니다: ${response.status}`,
                    );
                }

                const data = await response.json();
                setParticipants(data);
            } catch (err) {
                console.error('참여자 목록 조회 오류:', err);
                setError(
                    err instanceof Error ? err.message : '알 수 없는 오류',
                );
            } finally {
                setIsLoading(false);
            }
        };
        fetchParticipants();
    }, [gatheringId]);

    // 연령 스키마를 ui로 변경
    const convertAgeGroupToNumber = (ageGroup: string): number | string => {
        switch (ageGroup) {
            case 'TEENS':
                return '10대';
            case 'TWENTIES':
                return '20대';
            case 'THIRTIES':
                return '30대';
            case 'FORTIES':
                return '40대';
            case 'FIFTIES':
                return '50대';
            case 'SIXTIES':
                return '60대';
            case 'SEVENTIES':
                return '70대';
            case 'ALL':
            default:
                return 0;
        }
    };

    // 성별 스키마를 ui로 변경
    const convertGenderToKorean = (gender: string): string => {
        switch (gender) {
            case 'MALE':
                return '남성';
            case 'FEMALE':
                return '여성';
            case 'ANY':
            default:
                return '무관';
        }
    };

    return (
        <div className="mt-12.5">
            <h2 className="mb-5 text-xl font-bold">멤버 소개</h2>
            {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                    <LoadingThreeDots />
                </div>
            ) : error ? (
                <div className="flex h-40 items-center justify-center text-red-500">
                    <p>{error}</p>
                </div>
            ) : participants.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                    <p>아직 참여자가 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* 모든 멤버 보기 갯수 제한  */}
                    {participants.slice(0, 5).map((participant) => (
                        <UserProfile
                            key={participant.userId}
                            post={{
                                userName: participant.user.nickname,
                                statusMessage: participant.user.statusMessage,
                                userAge: convertAgeGroupToNumber(
                                    participant.user.ageGroup,
                                ),
                                userGender: convertGenderToKorean(
                                    participant.user.gender,
                                ),
                                userRating: 0, // API에서 제공하지 않아 임시 값 지정
                                profileImage: participant.user.thumbnailUrl,
                                kakaoId: participant.user.kakaoId,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
