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
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function WritePage() {
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;
    const router = useRouter();

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
        //todo: BE 팀과 이야기 후 json 직렬화하여 본문 부분 전송하기로 했습니다.
        // 여기서 API 요청 처리

        const submissionData = { ...data };

        // 데이터를 복사해 마감시간을 UTC 형식으로 변환
        if (data.filter.deadlineDate && data.filter.deadlineTime) {
            // 사용자가 설정한 마감일을
            const partOfDeadLine = data.filter.deadlineDate
                .toISOString()
                .split('T')[0];

            // 사용자가 설정한 마감 시간과 결합
            const partOfTime = data.filter.deadlineTime;

            submissionData.filter.deadlineTime = `${partOfDeadLine}T${partOfTime}:00.000Z`;
        }

        // 개발용 처리
        if (process.env.NODE_ENV === 'development') {
            console.log(JSON.stringify(submissionData, null, 2));
        }

        const res = await fetch(`${NEXT_PUBLIC_NEST_BFF_URL}/api/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionData),
            credentials: 'include',
        });

        if (!res.ok) {
            const errorData = await res.json();

            console.warn('DTO 유효성 에러 발생:', errorData);
            if (Array.isArray(errorData.message)) {
                console.warn('에러 목록:', errorData.message);
            }

            toast('글 발행 실패', {
                description: '잠시 후 다시 시도해 주세요',
                action: {
                    label: '닫기',
                    onClick: () => {}, // 라벨 누르면 닫히는건 디폴트 동작 이라고 합니다.
                },
            });
            return;
        }

        toast('글 발행 완료 !', {
            description: '참여 신청을 받으면 알려드릴게요',
            action: {
                label: '닫기',
                onClick: () => {},
            },
        });
        form.reset();
        router.push('/'); //todo: 지금은 홈으로 밀지만 be 연동 이후 포스트아이디가 넘어 온다면 해당 상세 페이지로 이동하는 것이 좋을 듯 합니다.
    };

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
                                            placeholder="동행 제목을 입력해 보세요"
                                            {...field}
                                            className={`mt-2.5 h-15 w-full rounded-lg p-4 text-xl font-bold`}
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
                                    <div
                                        className={
                                            'border-t-none animate-spin border-2 border-white'
                                        }
                                    />
                                ) : (
                                    '등록'
                                )}
                            </Button>
                        </section>
                    </form>
                </Form>
            </section>
        </div>
    );
}
