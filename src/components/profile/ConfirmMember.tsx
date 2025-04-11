'use client';

import LoadingThreeDots from '@/components/common/LoadingThreeDots';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    acceptMultipleMembers,
    blockMultipleMembers,
} from '@/lib/service/gatheringApi';
import { ageLabelMap, genderLabelMap } from '@/lib/utils/enumMapper';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface RawMember {
    userId: number;
    user: {
        kakaoId: number;
        nickname: string;
        thumbnailUrl: string;
        statusMessage: string;
        gender: string;
        ageGroup: string;
    };
    status: 'APPLYING' | 'APPROVED';
}

interface MemberType {
    id: number;
    profileImage: string;
    userName: string;
    statusMessage: string;
    age: string;
    gender: string;
    isApproved: boolean;
}

interface ConfirmMemberProps {
    currentTabIndex: number;
    gatheringId: number;
}

export default function ConfirmMember({
    currentTabIndex,
    gatheringId,
}: ConfirmMemberProps) {
    const [members, setMembers] = useState<MemberType[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!gatheringId) return;
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const NEXT_PUBLIC_NEST_BFF_URL =
                    process.env.NEXT_PUBLIC_NEST_BFF_URL;
                const endpoint =
                    currentTabIndex === 0
                        ? `${NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/appliers/${gatheringId}`
                        : `${NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/participants/${gatheringId}`;
                const res = await fetch(endpoint, {
                    credentials: 'include',
                });

                if (!res.ok)
                    throw new Error('참여자 목록을 불러오는데 실패했습니다');

                const data: RawMember[] = await res.json();

                const mapped: MemberType[] = data.map((m) => ({
                    id: m.userId,
                    profileImage: m.user.thumbnailUrl,
                    userName: m.user.nickname,
                    statusMessage: m.user.statusMessage,
                    age: m.user.ageGroup,
                    gender: m.user.gender,
                    isApproved: m.status === 'APPROVED',
                }));
                setMembers(mapped);
            } catch {
                setError('데이터를 불러오는 중 오류 발생');
            } finally {
                setLoading(false);
            }
        };
        void fetchMembers();
    }, [gatheringId, currentTabIndex]);

    // 개별 선택 토글부분 함수
    const toggleSelectMember = (memberId: number) => {
        setSelectedMembers((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId],
        );
    };

    // 전체 체크박스 선택 함수
    const toggleSelectAll = () => {
        setSelectedMembers((prev) =>
            members.length > 0 && prev.length === members.length
                ? []
                : members.map((m) => m.id),
        );
    };

    const handleAcceptSelected = async () => {
        if (selectedMembers.length === 0) {
            toast.error('멤버 수락 실패', {
                description: '선택된 멤버가 없습니다.',
                action: {
                    label: '닫기',
                    onClick: () => {},
                },
            });
            return;
        }
        setIsProcessing(true);
        try {
            await acceptMultipleMembers(gatheringId, selectedMembers);
            toast.success('참여 확정 완료', {
                description: '선택한 멤버들의 참여가 확정되었습니다.',
                action: {
                    label: '닫기',
                    onClick: () => {},
                },
            });
            setSelectedMembers([]);
        } catch (error) {
            console.error(error);
            toast.error('참여 확정 실패', {
                description: '참여 확정 중 오류가 발생했습니다.',
                action: {
                    label: '닫기',
                    onClick: () => {},
                },
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBlockSelected = async () => {
        if (selectedMembers.length === 0) {
            toast.error('멤버 거절 실패', {
                description: '선택된 멤버가 없습니다.',
                action: {
                    label: '닫기',
                    onClick: () => {},
                },
            });
            return;
        }
        setIsProcessing(true);
        try {
            await blockMultipleMembers(gatheringId, selectedMembers);
            toast.success('거절 완료', {
                description: '선택한 멤버들이 거절되었습니다.',
                action: {
                    label: '닫기',
                    onClick: () => {},
                },
            });
            setSelectedMembers([]);
        } catch (error) {
            console.error(error);
            toast.error('거절 실패', {
                description: '거절 처리 중 오류가 발생했습니다.',
                action: {
                    label: '닫기',
                    onClick: () => {},
                },
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="mt-5">
            {loading && <LoadingThreeDots />}
            {error && (
                <div className="py-6 text-center text-rose-500">{error}</div>
            )}

            {!loading && !error && (
                <>
                    {members.length === 0 ? (
                        <div className="py-6 text-center text-gray-500">
                            {currentTabIndex === 0
                                ? '참여 신청한 멤버가 없어요'
                                : '참여 확정된 멤버가 없어요'}
                        </div>
                    ) : (
                        <>
                            {members.map((member, idx) => (
                                <div key={member.id} className="mb-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                className="h-6 w-6"
                                                checked={selectedMembers.includes(
                                                    member.id,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleSelectMember(
                                                        member.id,
                                                    )
                                                }
                                            />
                                            <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                                                <Image
                                                    src={member.profileImage}
                                                    alt="유저 프로필 이미지"
                                                    width={50}
                                                    height={50}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <h1 className="text-[15px] font-semibold text-black">
                                                    {member.userName}
                                                </h1>
                                                <div className="flex items-center gap-2 rounded bg-[#e5e8ea] px-3 py-1.5 text-xs text-[#666666]">
                                                    <span>
                                                        {member.statusMessage}
                                                    </span>
                                                    <div className="h-1.5 w-px bg-gray-300" />
                                                    <span>
                                                        {ageLabelMap[
                                                            member.age
                                                        ] ?? member.age}
                                                    </span>
                                                    <div className="h-1.5 w-px bg-gray-300" />
                                                    <span>
                                                        {genderLabelMap[
                                                            member.gender
                                                        ] ?? member.gender}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-10 w-[130px] text-sm font-semibold"
                                        >
                                            <Image
                                                src="/icon/detail/chatIcon.svg"
                                                alt="chat"
                                                width={16}
                                                height={16}
                                                className="mr-1.5"
                                            />
                                            문의 확인하기
                                        </Button>
                                    </div>
                                    {idx < members.length - 1 && (
                                        <div className="my-4 h-px w-full bg-[#eaeaea]" />
                                    )}
                                </div>
                            ))}

                            <div className="mt-11 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        className="h-6 w-6"
                                        checked={
                                            members.length > 0 &&
                                            selectedMembers.length ===
                                                members.length
                                        }
                                        onCheckedChange={toggleSelectAll}
                                    />
                                    <p className="text-base text-black">
                                        전체 선택
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleBlockSelected}
                                        disabled={isProcessing}
                                        className="h-10 w-[100px] border-[#d9d9d9] text-xs text-[#666666] hover:border-rose-500 hover:text-rose-500"
                                    >
                                        {isProcessing
                                            ? '처리 중...'
                                            : '거절하기'}
                                    </Button>
                                    {currentTabIndex === 0 && (
                                        <Button
                                            size="sm"
                                            onClick={handleAcceptSelected}
                                            disabled={isProcessing}
                                            className="h-10 w-[130px] text-xs font-semibold"
                                        >
                                            {isProcessing
                                                ? '처리 중...'
                                                : '참여 확정하기'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
