'use client';

import LoadingThreeDots from '@/components/common/LoadingThreeDots';
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
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
    ageGroup: z.enum([
        'ALL',
        'TEENS',
        'TWENTIES',
        'THIRTIES',
        'FORTIES',
        'FIFTIES',
        'SIXTIES',
        'SEVENTIES',
    ]),
});

type UserSchema = z.infer<typeof userSchema>;

interface ProfileEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: {
        nickname?: string;
        statusMessage?: string;
        thumbnailUrl?: string;
        gender?: string;
        ageGroup?: string;
    };
}

const genderDisplay = {
    MALE: '남자',
    FEMALE: '여자',
};

export default function ProfileEditor({
    open,
    onOpenChange,
    initialData,
}: ProfileEditorProps) {
    const searchParams = useSearchParams();
    const kakaoId = searchParams.get('kakaoId') || '';

    // 로컬스토리지에서 생년월일 정보 가져오기
    const getBirthInfoFromStorage = () => {
        const storedBirthInfo = localStorage.getItem(
            `birthInfo_${initialData?.nickname}`,
        );
        if (storedBirthInfo) {
            return JSON.parse(storedBirthInfo);
        }
        return {
            birthYear: undefined,
            birthMonth: undefined,
            birthDay: undefined,
        };
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
    } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            id: '',
            nickname: initialData?.nickname || kakaoId,
            email: '',
            gender:
                (initialData?.gender?.toLowerCase() as
                    | 'male'
                    | 'female'
                    | null) || undefined,
            ...getBirthInfoFromStorage(), // 저장된 생년월일 정보 사용
            userIntroduce: initialData?.statusMessage || '',
            profileImage:
                initialData?.thumbnailUrl || '/icon/profile/defaultProfile.svg',
            ageGroup:
                (initialData?.ageGroup as z.infer<
                    typeof userSchema
                >['ageGroup']) || undefined,
        },
        mode: 'onChange',
    });

    // 이메일과 닉네임을 함께 받아오는 API 호출
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const NEXT_PUBLIC_NEST_BFF_URL =
                    process.env.NEXT_PUBLIC_NEST_BFF_URL;
                const response = await fetch(
                    `${NEXT_PUBLIC_NEST_BFF_URL}/api/user/me`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    },
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setValue('email', data.email);
                // 닉네임이 없는 경우에만 API에서 받은 닉네임으로 설정
                if (!initialData?.nickname) {
                    setValue('nickname', data.nickname || kakaoId);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserData();
    }, [setValue, initialData?.nickname, kakaoId]);

    const formValues = watch();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const uploadProfileImage = async (file: File) => {
        if (!file) return;
        try {
            setIsUploading(true);

            //  업로드를 위한 presigned URL 요청
            const response = await fetch('/api/s3', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                }),
            });

            // 버킷에 이미지를 업로드
            if (!response.ok) {
                throw new Error('업로드 URL을 가져오지 못했습니다');
            }
            const { url, key } = await response.json();
            const uploadResponse = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                },
                body: file,
            });

            // 현재 프로필 이미지에서 업로드한 이미지로 교체
            if (!uploadResponse.ok) {
                throw new Error('이미지 업로드에 실패했습니다.');
            }
            const s3ImagePath = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
            setValue('profileImage', s3ImagePath);
        } catch (error) {
            console.error('이미지 업로드 실패', error);
            alert('이미지 업로드에 실패했습니다.');
        } finally {
            setIsUploading(false);
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadProfileImage(file);
        }
    };
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // 입력한 생년월일을 기준으로 연령대로 변환
    useEffect(() => {
        if (formValues.birthYear) {
            const currentYear = new Date().getFullYear();
            const age = currentYear - formValues.birthYear;
            let ageGroup: z.infer<typeof userSchema>['ageGroup'];
            if (age < 20) ageGroup = 'TEENS';
            else if (age < 30) ageGroup = 'TWENTIES';
            else if (age < 40) ageGroup = 'THIRTIES';
            else if (age < 50) ageGroup = 'FORTIES';
            else if (age < 60) ageGroup = 'FIFTIES';
            else if (age < 70) ageGroup = 'SIXTIES';
            else ageGroup = 'SEVENTIES';
            setValue('ageGroup', ageGroup);
        }
    }, [formValues.birthYear, setValue]);

    // 수정한 내용을 PUT으로 보내기
    const onSubmit = async (data: UserSchema) => {
        try {
            setIsLoading(true);
            setApiError(null);

            // 생년월일 정보 저장
            if (data.birthYear || data.birthMonth || data.birthDay) {
                localStorage.setItem(
                    `birthInfo_${data.nickname}`,
                    JSON.stringify({
                        birthYear: data.birthYear,
                        birthMonth: data.birthMonth,
                        birthDay: data.birthDay,
                    }),
                );
            }

            const NEXT_PUBLIC_NEST_BFF_URL =
                process.env.NEXT_PUBLIC_NEST_BFF_URL;

            const requestBody = {
                nickname: data.nickname,
                email: data.email,
                statusMessage: data.userIntroduce || '',
                thumbnailUrl: data.profileImage,
                gender: data.gender ? data.gender.toUpperCase() : null,
                ageGroup: data.ageGroup || 'ALL',
            };

            const response = await fetch(
                `${NEXT_PUBLIC_NEST_BFF_URL}/api/profile/me`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                    credentials: 'include',
                },
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert('프로필이 성공적으로 업데이트되었습니다.');
            window.location.reload();

            onOpenChange(false);
        } catch (error) {
            setApiError(
                error instanceof Error
                    ? error.message
                    : '프로필 업데이트에 실패했습니다.',
            );
            alert(
                '프로필 업데이트에 실패했습니다: ' +
                    (error instanceof Error
                        ? error.message
                        : '알 수 없는 오류'),
            );
        } finally {
            setIsLoading(false);
        }
    };

    const removeImage = () => {
        setValue('profileImage', '/icon/profile/defaultProfile.svg');
    };

    // 리랜더링 오류 해결
    useEffect(() => {
        const birthYear = watch('birthYear');
        const birthMonth = watch('birthMonth');
        const birthDay = watch('birthDay');

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
    }, [watch, setValue]);

    useEffect(() => {
        const birthYear = watch('birthYear');
        if (birthYear) {
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;

            let ageGroup: z.infer<typeof userSchema>['ageGroup'];
            if (age < 20) ageGroup = 'TEENS';
            else if (age < 30) ageGroup = 'TWENTIES';
            else if (age < 40) ageGroup = 'THIRTIES';
            else if (age < 50) ageGroup = 'FORTIES';
            else if (age < 60) ageGroup = 'FIFTIES';
            else if (age < 70) ageGroup = 'SIXTIES';
            else ageGroup = 'SEVENTIES';

            setValue('ageGroup', ageGroup);
        }
    }, [watch, setValue]);

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
        formValues,
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

                {isLoading ? (
                    <div className="flex h-[400px] items-center justify-center">
                        <LoadingThreeDots />
                    </div>
                ) : (
                    <>
                        {apiError && (
                            <div className="px-[30px] pt-4 text-center text-red-500">
                                {apiError}
                            </div>
                        )}

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
                                        {isUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/70">
                                                <LoadingThreeDots />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <Button
                                            variant="outline"
                                            className="h-auto rounded-md border border-solid border-[#e9e9e9] px-5 py-1.5"
                                            onClick={handleUploadClick}
                                            disabled={isUploading}
                                        >
                                            <span className="text-xs font-medium text-[#333333]">
                                                {isUploading
                                                    ? '업로드 중...'
                                                    : '사진 업로드'}
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
                                    <div className="flex flex-col gap-2.5">
                                        <Label className="text-base font-bold text-black">
                                            이메일
                                        </Label>
                                        <div className="flex h-11 items-center gap-2.5 rounded-xl bg-[#f5f6f7] px-4 py-2.5">
                                            <input
                                                type="email"
                                                {...register('email')}
                                                className="w-full bg-transparent text-base font-normal text-[#999999] outline-none"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 성별 선택 - 한글 표시 */}
                            <div className="mt-[30px] flex w-[440px] flex-col gap-2.5">
                                <div className="flex items-center gap-2">
                                    <Label className="text-base font-bold text-black">
                                        성별
                                        <span className="text-[#0ac7e4]">
                                            *
                                        </span>
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
                                        <Label htmlFor="male">
                                            {genderDisplay['MALE']}
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <input
                                            type="radio"
                                            {...register('gender')}
                                            value="female"
                                            id="female"
                                            className="h-5 w-5 cursor-pointer appearance-none rounded-full border border-[#D9D9D9] bg-white checked:border-[5px] checked:border-[#0ac7e4]"
                                        />
                                        <Label htmlFor="female">
                                            {genderDisplay['FEMALE']}
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {/* 생년월일 */}
                            <div className="mt-[30px] flex w-[440px] flex-col gap-2.5">
                                <div className="flex items-center gap-2">
                                    <Label className="text-base font-bold text-black">
                                        생년월일
                                        <span className="text-[#0ac7e4]">
                                            *
                                        </span>
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
                                    disabled={isLoading}
                                >
                                    취소
                                </Button>

                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    variant={isValid ? 'default' : 'darkGray'}
                                    className="h-[52px] flex-1"
                                    disabled={isLoading || !isValid}
                                >
                                    {isLoading ? '처리 중...' : '수정하기'}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
