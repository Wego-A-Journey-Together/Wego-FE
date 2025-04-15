'use client';

import { PostFormValues, PostSchema } from '@/app/[lang]/write/postSchema';
import PostSetupPanel from '@/components/Editor/PostSetupPanel';
import ContentEditor from '@/components/Editor/Tiptap';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import HashtagInput from '@/components/write/HashtagInput';
import LocationSelector from '@/components/write/LocationSelector';
import ThumbnailUploader from '@/components/write/ThumbnailUploader';
import { useLocale } from '@/hooks/useLocale';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface PostFormProps {
    isEdit: boolean;
    gatheringId?: string;
}

export default function PostForm({
    isEdit = false,
    gatheringId,
}: PostFormProps) {
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;
    const router = useRouter();
    const { t } = useLocale();

    const form = useForm<PostFormValues>({
        resolver: zodResolver(PostSchema),
        mode: 'onBlur', // onChange 는 UX에 안좋아 보여서 포커스 기준 파라미터로 변경했습니다.
        reValidateMode: 'onChange', // 에러시 검증은 변화마다 검증
        defaultValues: {
            title: '',
            filter: {
                startDate: undefined,
                endDate: undefined,
                deadlineDate: undefined,
                deadlineTime: '',
                groupTheme: '',
                groupSize: '',
                gender: null,
                age: null,
            },
        },
    });

    const onSubmit = async (data: PostFormValues) => {
        // 직렬화된 JSON 문자열 확인

        const submissionData = { ...data };
        if (typeof submissionData.content === 'object') {
            submissionData.content = JSON.stringify(submissionData.content);
        }

        // 데이터를 복사해 마감시간을 UTC 형식으로 변환
        if (data.filter.deadlineDate && data.filter.deadlineTime) {
            // 사용자가 설정한 마감일을
            const deadlineDate = data.filter.deadlineDate;
            const deadlineTime = data.filter.deadlineTime;

            // 날짜 객체에서 정확한 로컬 날짜 추출
            const localYear = deadlineDate.getFullYear();
            const localMonth = String(deadlineDate.getMonth() + 1).padStart(
                2,
                '0',
            );
            const localDay = String(deadlineDate.getDate()).padStart(2, '0');

            // 최종 조합: 로컬 기준 날짜 + 시간
            const isoString = `${localYear}-${localMonth}-${localDay} ${deadlineTime}`;

            //타입 변환하면 에러가 너무 나서 type assertion 했습니다.
            submissionData.filter.deadlineDate = isoString as unknown as Date;
        }

        // 개발용 처리
        if (process.env.NODE_ENV === 'development') {
            console.log(JSON.stringify(submissionData, null, 2));
        }
        const method = isEdit ? 'PATCH' : 'POST';
        const targetRoute = isEdit
            ? `${NEXT_PUBLIC_NEST_BFF_URL}/api/posts/${gatheringId}`
            : `${NEXT_PUBLIC_NEST_BFF_URL}/api/posts`;

        console.log('[🔥SUBMIT] content type:', typeof submissionData.content);
        console.log(
            '[🔥SUBMIT] content preview:',
            submissionData.content.slice?.(0, 200),
        );

        const res = await fetch(targetRoute, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionData),
            credentials: 'include',
        });

        const body = await res.json();

        if (!res.ok) {
            console.warn('DTO 유효성 에러 발생:', body);
            toast('글 발행 실패', {
                description: '잠시 후 다시 시도해 주세요',
                action: {
                    label: '닫기',
                    onClick: () => {},
                },
            });
            return;
        }

        const newPostId = body;

        toast(isEdit ? '글 수정 완료!' : '글 발행 완료!', {
            description: isEdit
                ? '변경사항이 저장되었어요'
                : '참여 신청을 받으면 알려드릴게요',
            action: {
                label: '닫기',
                onClick: () => {},
            },
        });
        form.reset();

        // 게시물 아이디 페이지로 이동시키기
        router.push(`/detail/${newPostId}`);
    };

    /**
     * 수정 환경 이라면 get요청 후 초기화
     */
    useEffect(() => {
        if (isEdit && gatheringId) {
            (async () => {
                try {
                    const old = await fetch(
                        `${NEXT_PUBLIC_NEST_BFF_URL}/api/detail/${gatheringId}`,
                        {
                            method: 'GET',
                        },
                    );
                    const data = await old.json();
                    form.reset({
                        title: data.title,
                        content: data.content,
                        location: data.location,
                        tags: data.tags || [],
                        thumbnailUrl: data.thumbnailUrl || '',
                        filter: {
                            startDate: new Date(data.filter.startDate),
                            endDate: new Date(data.filter.endDate),
                            groupTheme: data.filter.groupTheme,
                            groupSize: data.filter.groupSize,
                            gender: data.filter.gender,
                            age: data.filter.age,
                            deadlineDate: new Date(data.filter.deadlineDate),
                            deadlineTime:
                                data.filter.deadlineDate
                                    ?.split('T')[1]
                                    ?.slice(0, 5) ?? '',
                        },
                    } as PostFormValues);
                } catch (err) {
                    console.error(err);

                    toast(t.errorLoading, {
                        description: t.tryagain,
                        action: {
                            label: t.close,
                            onClick: () => {},
                        },
                    });
                    router.back();
                }
            })();
        }
    }, [isEdit, gatheringId]);

    /**
     * 취소 누르면 이전 페이지로 사용자 밀어주기
     */
    const handleCancel = () => {
        toast('작성 취소됨', {
            description: '이전 페이지로 돌아갑니다',
            duration: 1000, // 토스트를 1초 동안 보여줌
            action: {
                label: '닫기',
                onClick: () => {},
            },
            onAutoClose: () => {
                router.back(); // 토스트가 자동으로 사라진 후 이전 페이지로 이동
            },
        });
    };

    return (
        <div className="mx-auto w-full">
            <h1 className={'mt-10 text-2xl font-bold'}>동행 작성하기</h1>
            {/*글쓰기 폼 섹션*/}
            <section className="mx-auto mt-17.5 w-full flex-col">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        {/*제목 섹션*/}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className={'w-full'}>
                                    <FormLabel htmlFor={'title'}>
                                        <h2 className={'text-base font-bold'}>
                                            제목
                                        </h2>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="제목을 입력해 주세요"
                                            {...field}
                                            className={`h-15 w-full rounded-lg p-4 text-xl font-bold placeholder:text-xl placeholder:font-normal placeholder:text-[#999]`}
                                            id={'title'}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* 필터 섹션 */}
                        <section>
                            <PostSetupPanel />
                        </section>

                        {/*지도 및 장소 검색 섹션*/}
                        <section>
                            <FormField
                                name="location"
                                render={({ field }) => (
                                    <LocationSelector field={field} />
                                )}
                            />
                        </section>

                        {/*본문 에디터 섹션*/}
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className={'w-full'}>
                                    <h2
                                        className={
                                            'mt-6 mb-2.5 text-base font-bold'
                                        }
                                    >
                                        본문
                                    </h2>
                                    <FormControl>
                                        {/*Tiptap 에디터 부분*/}
                                        <ContentEditor
                                            content={field.value}
                                            onChange={(
                                                content,
                                                contentType,
                                            ) => {
                                                // HTML 타입이 감지되면 XSS 공격 위험이 있다고 합니다.
                                                if (contentType !== 'json')
                                                    return;

                                                // Tiptap 반환값 체크 -> json 방식 채택

                                                const serialJSON =
                                                    JSON.stringify(content);
                                                console.log(serialJSON);
                                                field.onChange(serialJSON);
                                            }}
                                            contentType="json" // JSON 사용 설정
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/*썸네일 업로드 섹션*/}
                        <FormField
                            control={form.control}
                            name="thumbnailUrl"
                            render={({ field }) => (
                                <FormItem className="mt-6 w-full">
                                    <FormLabel>
                                        <h2 className={'text-base font-bold'}>
                                            썸네일
                                            <span
                                                className={
                                                    'font-normal text-neutral-400'
                                                }
                                            >
                                                (선택)
                                            </span>
                                        </h2>
                                    </FormLabel>
                                    <FormControl>
                                        <ThumbnailUploader
                                            value={field.value}
                                            onChange={(file) =>
                                                field.onChange(file)
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/*태그 섹션*/}
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel htmlFor="tags">
                                        <h2 className="mt-6 text-base font-bold">
                                            태그
                                            <span className="font-normal text-neutral-400">
                                                (선택)
                                            </span>
                                        </h2>
                                    </FormLabel>
                                    <FormControl>
                                        <HashtagInput
                                            value={field.value || []}
                                            onChange={field.onChange}
                                            id="tags"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/*버튼그룹 섹션*/}
                        <section
                            className={
                                'mt-24 mb-10 flex w-full items-center justify-center gap-2'
                            }
                        >
                            <Button
                                className={
                                    'h-13 w-54 border border-neutral-300 bg-white text-sm font-semibold text-neutral-600'
                                }
                                type="button"
                                onClick={handleCancel}
                            >
                                취소
                            </Button>
                            <Button
                                className={
                                    'bg-sky-blue h-13 w-54 text-sm font-semibold text-neutral-50'
                                }
                                disabled={form.formState.isSubmitting}
                                type="submit"
                            >
                                {form.formState.isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="border-sky-blue h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                                        <span>
                                            {isEdit ? t.editting : t.posting}
                                        </span>
                                    </div>
                                ) : isEdit ? (
                                    t.edit
                                ) : (
                                    t.post
                                )}
                            </Button>
                        </section>
                    </form>
                </Form>
            </section>
        </div>
    );
}
