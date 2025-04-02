'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const userSchema = z.object({
    id: z.string(),
    nickname: z
        .string()
        .min(1, { message: '별명을 작성해주세요.' })
        .refine((value) => !value.includes(' '), {
            message: '공백은 사용할 수 없습니다.',
        })
        .refine(
            (value) => {
                const koreanRegex = /[가-힣]/;
                const englishRegex = /[a-zA-Z]/;
                const mixedRegex = /^[가-힣a-zA-Z]+$/;

                if (!mixedRegex.test(value)) return false;

                const hasKorean = koreanRegex.test(value);
                const englishMatches = value.match(englishRegex)?.length || 0;

                return hasKorean || englishMatches >= 2;
            },
            {
                message:
                    '한글 완성형 또는 2글자 이상의 영문을 포함해야 합니다.',
            },
        ),
    email: z.string().email(),
    gender: z
        .enum(['male', 'female'])
        .nullable()
        .refine((value) => value !== null, {
            message: '내 프로필을 완성하면 동행원을 찾을 수 있어요.',
        }),
    birthYear: z
        .number({
            required_error: '내 프로필을 완성하면 동행원을 찾을 수 있어요.',
            invalid_type_error: '숫자만 입력해주세요.',
        })
        .nullable()
        .refine((value) => value !== undefined, {
            message: '내 프로필을 완성하면 동행원을 찾을 수 있어요.',
        })
        .refine((value) => !value || (value >= 1900 && value <= 2025), {
            message: '올바른 연도를 입력해주세요',
        }),
    birthMonth: z
        .number({
            required_error: '내 프로필을 완성하면 동행원을 찾을 수 있어요.',
            invalid_type_error: '숫자만 입력해주세요.',
        })
        .nullable()
        .refine((value) => value !== undefined, {
            message: '내 프로필을 완성하면 동행원을 찾을 수 있어요.',
        })
        .refine(
            (value) =>
                value === undefined ||
                (value !== null && value >= 1 && value <= 12),
            {
                message: '올바른 월을 입력해주세요',
            },
        ),
    birthDay: z
        .number({
            invalid_type_error: '숫자만 입력해주세요.',
        })
        .nullable()
        .refine((value) => value !== undefined, {
            message: '내 프로필을 완성하면 동행원을 찾을 수 있어요.',
        })
        .refine(
            (value) =>
                value === undefined ||
                (value !== null && value >= 1 && value <= 31),
            {
                message: '올바른 일을 입력해주세요',
            },
        ),
    userIntroduce: z.string(),
    profileImage: z.string(),
});

type UserSchema = z.infer<typeof userSchema>;

interface ProfileEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProfileEditor({
    open,
    onOpenChange,
}: ProfileEditorProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
    } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            id: 'user123',
            nickname: '귀여운 동행자',
            email: 'cute@kakao.com',
            gender: undefined,
            birthYear: undefined,
            birthMonth: undefined,
            birthDay: undefined,
            userIntroduce: '제주도 여행중',
            profileImage: '/image/dogProfile.png',
        },
        mode: 'onChange',
    });

    const formValues = watch();

    const onSubmit = (data: UserSchema) => {
        alert(JSON.stringify(data));
    };

    const removeImage = () => {
        setValue('profileImage', '/icon/profile/defaultProfile.svg');
    };

    useEffect(() => {
        const { birthYear, birthMonth, birthDay } = formValues;

        if (birthYear && birthMonth && birthDay) {
            const date = new Date(birthYear, birthMonth - 1, birthDay);
            const isValidDate =
                date.getFullYear() === birthYear &&
                date.getMonth() === birthMonth - 1 &&
                date.getDate() === birthDay;

            if (!isValidDate) {
                setValue('birthYear', null);
                setValue('birthMonth', null);
                setValue('birthDay', null);
            }
        }
    }, [
        formValues.birthYear,
        formValues.birthMonth,
        formValues.birthDay,
        setValue,
    ]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[500px] overflow-visible border border-[#E0E0E0] p-0 shadow-[0_0_25px_rgba(0,0,0,0.15)]">
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
                                    src={formValues.profileImage}
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
                                    onClick={removeImage}
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
                                <div className="flex items-center gap-2">
                                    <Label className="text-base font-bold text-black">
                                        별명
                                    </Label>
                                    {errors.nickname && (
                                        <span className="ml-auto text-xs text-[#FF0000]">
                                            {errors.nickname.message}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2.5 rounded-xl bg-[#f5f6f7] px-4 py-2.5">
                                    <input
                                        type="text"
                                        {...register('nickname')}
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
                                    <input
                                        type="email"
                                        {...register('email')}
                                        readOnly
                                        className="w-full bg-transparent text-base font-normal text-[#999999] outline-none"
                                    />
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
                                    {errors.gender.message}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-10">
                            <div className="flex items-center gap-1.5">
                                <input
                                    type="radio"
                                    {...register('gender')}
                                    value="male"
                                    id="male"
                                    className="h-5 w-5 cursor-pointer appearance-none rounded-full border border-[#D9D9D9] bg-white checked:border-[5px] checked:border-[#0ac7e4]"
                                />
                                <Label htmlFor="male">남자</Label>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <input
                                    type="radio"
                                    {...register('gender')}
                                    value="female"
                                    id="female"
                                    className="h-5 w-5 cursor-pointer appearance-none rounded-full border border-[#D9D9D9] bg-white checked:border-[5px] checked:border-[#0ac7e4]"
                                />
                                <Label htmlFor="female">여자</Label>
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
                            {(errors.birthYear ||
                                errors.birthMonth ||
                                errors.birthDay) && (
                                <span className="ml-auto text-xs text-[#FF0000]">
                                    {errors.birthYear?.message ||
                                        errors.birthMonth?.message ||
                                        errors.birthDay?.message}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-center gap-[30px] rounded-xl bg-[#f5f6f7] px-4 py-2.5">
                            <input
                                type="text"
                                placeholder="YYYY"
                                maxLength={4}
                                {...register('birthYear', {
                                    setValueAs: (value) =>
                                        value === ''
                                            ? undefined
                                            : parseInt(value, 10),
                                })}
                                className="w-12 bg-transparent text-center text-base font-medium text-black outline-none placeholder:text-[#999999]"
                            />
                            <span className="text-base font-extralight text-[#999999]">
                                /
                            </span>
                            <input
                                type="text"
                                placeholder="MM"
                                maxLength={2}
                                {...register('birthMonth', {
                                    setValueAs: (value) =>
                                        value === ''
                                            ? undefined
                                            : parseInt(value, 10),
                                })}
                                className="w-8 bg-transparent text-center text-base font-medium text-black outline-none placeholder:text-[#999999]"
                            />
                            <span className="text-base font-extralight text-[#999999]">
                                /
                            </span>
                            <input
                                type="text"
                                placeholder="DD"
                                maxLength={2}
                                {...register('birthDay', {
                                    setValueAs: (value) =>
                                        value === ''
                                            ? undefined
                                            : parseInt(value, 10),
                                })}
                                className="w-8 bg-transparent text-center text-base font-medium text-black outline-none placeholder:text-[#999999]"
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
                                {...register('userIntroduce')}
                                className="w-full bg-transparent text-base font-medium text-black outline-none placeholder:text-[#999999]"
                            />
                        </div>
                    </div>

                    <div className="mt-[30px]">
                        <Button
                            variant="link"
                            className="cursor-pointer p-0 text-xs font-medium text-[#898989] underline"
                        >
                            회원탈퇴
                        </Button>
                    </div>
                </div>

                <div className="mt-[20px] flex flex-col items-center gap-5">
                    <hr className="h-1.5 w-full border-0 bg-[#f5f6f7]" />

                    <div className="mb-5 flex w-[440px] gap-2">
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="outline"
                            className="h-[52px] flex-1"
                        >
                            취소
                        </Button>

                        <Button
                            onClick={handleSubmit(onSubmit)}
                            variant={isValid ? 'default' : 'darkGray'}
                            className="h-[52px] flex-1"
                        >
                            수정하기
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
