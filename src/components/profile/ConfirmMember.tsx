'use client';

import LoadingThreeDots from '@/components/common/LoadingThreeDots';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
    members?: MemberType[];
    gatheringId?: number;
}

export default function ConfirmMember({
    members: initialMembers,
    currentTabIndex,
    gatheringId,
}: ConfirmMemberProps) {
    const [members, setMembers] = useState<MemberType[]>(initialMembers || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialMembers && initialMembers.length > 0) {
            setMembers(initialMembers);
            return;
        }

        if (gatheringId) {
            fetchMembers(gatheringId);
        }
    }, [gatheringId, initialMembers]);

    const fetchMembers = async (id: number) => {
        setLoading(true);
        setError(null);

        try {
            // 특정 동행에 참여 신청한 유저 목록을 조회합니다.
            const response = await fetch(`/api/gatherings/appliers/${id}`);

            if (!response.ok) {
                throw new Error(
                    `신청자 목록을 불러오는데 에러가 발생했습니다: ${response.status}`,
                );
            }

            const data = await response.json();
            setMembers(data);
        } catch (err) {
            console.error('신청자 목록을 불러오는데 에러가 발생했습니다:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : '신청자 목록을 불러오는데 에러가 발생했습니다.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-5">
            {loading && <LoadingThreeDots />}

            {error && (
                <div className="py-6 text-center text-rose-500">{error}</div>
            )}

            <div className="text-gray-700">
                {!loading && !error && members && members.length > 0
                    ? members.map((member, idx) => {
                          return (
                              <div key={member.id} className="mb-4">
                                  {/*-------------------------------------------------*/}
                                  {/*체크박스, 유저아이콘,문의버튼 한 줄에 해당*/}
                                  {/*-------------------------------------------------*/}
                                  <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center justify-between gap-3">
                                          <div className="flex items-center justify-between gap-3">
                                              <Checkbox
                                                  className={'h-6 w-6'}
                                                  iconSize={
                                                      'size-5.5 stroke-[4px]'
                                                  }
                                              />
                                              <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                                                  <Image
                                                      src={member.profileImage}
                                                      alt="유저 프로필 이미지"
                                                      width={50}
                                                      height={50}
                                                      className="z-0 h-full w-full object-cover"
                                                  />
                                              </div>
                                              {/* 유저 정보 */}
                                              <div className="flex flex-col items-start gap-1.5">
                                                  <h1 className="w-full text-[15px] font-semibold text-black">
                                                      {member.userName}
                                                  </h1>
                                                  <div className="flex items-center gap-2 rounded-[24.53px] bg-[#e5e8ea] px-3 py-1.5">
                                                      <p className="text-xs text-[#666666]">
                                                          {member.statusMessage}
                                                      </p>
                                                      <div className="h-1.5 w-px bg-gray-300" />
                                                      <p className="text-xs text-[#666666]">
                                                          {member.age}
                                                      </p>
                                                      <div className="h-1.5 w-px bg-gray-300" />
                                                      <p className="text-xs text-[#666666]">
                                                          {member.gender}
                                                      </p>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <Button
                                          variant={'outline'}
                                          className="h-10 w-[130px] border-[#0ac7e4] text-sm font-semibold text-[#0ac7e4]"
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
                          );
                      })
                    : !loading &&
                      !error && (
                          <div className="py-6 text-center text-gray-500">
                              참여하려는 멤버가 없어요
                          </div>
                      )}
            </div>
            {/* 하단 체크박스 및 버튼 그룹 */}
            <div className="mt-11 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Checkbox className={'h-6 w-6'} />
                    <p className={'text-base text-black'}>전체 선택</p>
                </div>
                {currentTabIndex === 0 ? (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-[100px] border-[#d9d9d9] text-xs text-[#666666] hover:border-rose-500 hover:text-rose-500"
                        >
                            거절하기
                        </Button>
                        <Button
                            size="sm"
                            className="h-10 w-[130px] text-xs font-semibold"
                        >
                            참여 확정하기
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-[100px] border-[#d9d9d9] text-xs text-[#666666] hover:border-rose-500 hover:text-rose-500"
                    >
                        거절하기
                    </Button>
                )}
            </div>
        </div>
    );
}
