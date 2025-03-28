'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Button } from '../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';

interface User {
    id: string;
    nickname: string;
    email: string;
    gender: 'male' | 'female' | undefined;
    birthYear: number | null;
    birthMonth: number | null;
    birthDay: number | null;
    userIntroduce: string;
    profileImage: string;
}

interface ProfileEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProfileEditor({
    open,
    onOpenChange,
}: ProfileEditorProps) {
    const [user, setUser] = useState<User>({
        id: 'user123',
        nickname: '귀여운 동행자',
        email: 'cute@kakao.com',
        gender: undefined,
        birthYear: null,
        birthMonth: null,
        birthDay: null,
        userIntroduce: '제주도 여행중',
        profileImage: '/image/dogProfile.png',
    });

    // 에러 상태 추가
    const [errors, setErrors] = useState({
        gender: false,
        birth: false,
    });

    // 유효성 검사
    useEffect(() => {
        setErrors({
            gender: !user.gender,
            birth: !user.birthYear || !user.birthMonth || !user.birthDay,
        });
    }, [user]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                variant="noOverlay"
                className="w-[500px] overflow-visible border border-solid border-[#00000033] p-0"
            >
                <DialogHeader className="flex h-[47px] items-center justify-between border-b [border-bottom-style:solid] border-[#e9e9e9] px-[30px] py-2.5">
                    <DialogTitle className="w-full text-center text-base font-bold text-black">
                        프로필 수정하기
                    </DialogTitle>
                </DialogHeader>

                <div className="px-[30px]">
                    {/* 프로필 섹션 */}
                    <div className="mt-[30px] flex items-start gap-[30px]">
                        <div className="flex flex-col items-start justify-center gap-3">
                            <div className="relative h-24 w-24">
                                <Image
                                    className="rounded-full bg-gray-100 object-cover"
                                    alt="Profile"
                                    src={user.profileImage}
                                    fill
                                />
                            </div>

                            <div className="flex flex-col items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    className="h-auto rounded-md border border-solid border-[#e9e9e9] px-5 py-1.5"
                                >
                                    <span className="text-xs font-medium text-[#333333]">
                                        사진 업로드
                                    </span>
                                </Button>

                                {/* 사진 제거 누르면 기본 프로필 이미지로 변경 */}
                                <Button
                                    variant="ghost"
                                    className="h-auto p-0"
                                    onClick={() => {
                                        setUser({
                                            ...user,
                                            profileImage:
                                                '/icon/profile/defaultProfile.svg',
                                        });
                                    }}
                                >
                                    <span className="text-xs font-medium text-[#999999]">
                                        사진 제거
                                    </span>
                                </Button>
                            </div>
                        </div>

                        {/* 별명 설정 */}
                        <div className="flex w-[314px] flex-col gap-5">
                            <div className="flex flex-col gap-2.5">
                                <Label className="text-base font-bold text-black">
                                    별명
                                </Label>
                                <div className="flex items-center gap-2.5 rounded-xl bg-[#f5f6f7] px-4 py-2.5">
                                    <input
                                        type="text"
                                        value={user.nickname}
                                        onChange={(e) =>
                                            setUser({
                                                ...user,
                                                nickname: e.target.value,
                                            })
                                        }
                                        className="w-full bg-transparent text-base font-medium text-black outline-none"
                                    />
                                </div>
                            </div>

                            {/* 이메일 수정 */}
                            {/* 소셜 로그인이라 이메일은 수정 불가능한 것으로 보여 readOnly 처리 했습니다. */}
                            <div className="flex flex-col gap-2.5">
                                <Label className="text-base font-bold text-black">
                                    이메일
                                </Label>
                                <div className="flex h-11 items-center gap-2.5 rounded-xl bg-[#f5f6f7] px-4 py-2.5">
                                    <div className="flex items-center gap-2.5 rounded-xl bg-[#f5f6f7] py-2.5">
                                        <input
                                            type="email"
                                            value={user.email}
                                            readOnly
                                            className="w-full bg-transparent text-base font-normal text-[#999999] outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 성별 선택 */}
                    <div className="mt-[30px] flex w-[440px] flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                            <Label className="text-base font-bold text-black">
                                성별
                                <span className="text-[#0ac7e4]">*</span>
                            </Label>
                            {errors.gender && (
                                <span className="ml-auto text-xs text-[#FF0000]">
                                    내 프로필을 완성하면 동행원을 찾을 수
                                    있어요.
                                </span>
                            )}
                        </div>
                        <div className="flex gap-10">
                            <div className="flex items-center gap-1.5">
                                <input
                                    type="radio"
                                    name="gender"
                                    id="male"
                                    value="male"
                                    checked={user.gender === 'male'}
                                    onChange={() => {
                                        setUser({
                                            ...user,
                                            gender: 'male',
                                        });
                                    }}
                                    className="accent-sky-blue h-5 w-5 cursor-pointer"
                                />
                                <Label
                                    htmlFor="male"
                                    className="cursor-pointer text-base font-medium text-black"
                                >
                                    남자
                                </Label>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <input
                                    type="radio"
                                    name="gender"
                                    id="female"
                                    value="female"
                                    checked={user.gender === 'female'}
                                    onChange={() => {
                                        setUser({
                                            ...user,
                                            gender: 'female',
                                        });
                                    }}
                                    className="accent-sky-blue h-5 w-5 cursor-pointer"
                                />
                                <Label
                                    htmlFor="female"
                                    className="cursor-pointer text-base font-medium text-black"
                                >
                                    여자
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* 생년월일 */}
                    <div className="mt-[30px] flex w-[440px] flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                            <Label className="text-base font-bold text-black">
                                생년월일
                                <span className="text-[#0ac7e4]">*</span>
                            </Label>
                            {errors.birth && (
                                <span className="ml-auto text-xs text-[#FF0000]">
                                    내 프로필을 완성하면 동행원을 찾을 수
                                    있어요.
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-center gap-[30px] rounded-xl bg-[#f5f6f7] px-4 py-2.5">
                            <input
                                type="number"
                                placeholder="YYYY"
                                value={user.birthYear ?? ''} // Add null coalescing operator
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        birthYear: e.target.value
                                            ? parseInt(e.target.value)
                                            : null,
                                    });
                                }}
                                // 넘버 인풋의 기본 화살표 버튼을 제거
                                className="number-arrow-hide w-12 bg-transparent text-center text-base font-medium text-black outline-none placeholder:text-[#999999]"
                            />
                            <span className="text-base font-extralight text-[#999999]">
                                /
                            </span>
                            <input
                                type="number"
                                placeholder="MM"
                                value={user.birthMonth ?? ''}
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        birthMonth: e.target.value
                                            ? parseInt(e.target.value)
                                            : null,
                                    });
                                }}
                                className="number-arrow-hide w-8 bg-transparent text-center text-base font-medium text-black outline-none placeholder:text-[#999999]"
                            />
                            <span className="text-base font-extralight text-[#999999]">
                                /
                            </span>
                            <input
                                type="number"
                                placeholder="DD"
                                value={user.birthDay ?? ''}
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        birthDay: e.target.value
                                            ? parseInt(e.target.value)
                                            : null,
                                    });
                                }}
                                className="number-arrow-hide w-8 bg-transparent text-center text-base font-medium text-black outline-none placeholder:text-[#999999]"
                            />
                        </div>
                    </div>

                    {/* 상태 메세지 */}
                    <div className="mt-[30px] flex flex-col gap-2.5">
                        <Label className="text-base font-bold text-black">
                            한 줄 소개
                        </Label>
                        <div className="flex w-[440px] items-center gap-2.5 rounded-xl bg-[#f5f6f7] px-4 py-2.5">
                            <input
                                type="text"
                                placeholder="간단하게 나를 소개해 보세요."
                                value={user.userIntroduce}
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        userIntroduce: e.target.value,
                                    });
                                }}
                                className="w-full bg-transparent text-base font-medium text-black outline-none placeholder:text-[#999999]"
                            />
                        </div>
                    </div>

                    <div className="mt-[30px]">
                        <Button
                            variant="link"
                            className="p-0 text-xs font-medium text-[#898989] underline"
                        >
                            회원탈퇴
                        </Button>
                    </div>
                </div>

                <div className="mt-[20px] flex flex-col items-center gap-5">
                    <hr className="h-1.5 w-full border-0 bg-[#f5f6f7]" />

                    <div className="mb-5 flex w-[440px] gap-2">
                        <Button
                            variant="outline"
                            className="ㅈ h-[52px] flex-1"
                        >
                            취소
                        </Button>
                        <Button className="h-[52px] flex-1">수정하기</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
