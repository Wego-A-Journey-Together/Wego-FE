'use client';

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
import KakaoMap from '@/components/write/KakaoMap';
import { ThumbnailBtn } from '@/components/write/ThumbnailBtn';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// JSONContent 타입을 zod에서 사용할 수 있도록 설정
const jsonContentSchema = z.any(); // 복잡한 JSON 객체를 허용

export default function WritePage() {
    const postSchema = z.object({
        title: z.string().min(4, { message: '제목은 네글자 이상' }),
        // JSON 형식 또는 문자열 둘 다 허용
        description: z.union([z.string().min(5), jsonContentSchema]),
        location: z.string().min(5),
    });

    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        mode: 'onChange',
        defaultValues: {
            title: '',
            description: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof postSchema>) => {
        // 직렬화된 JSON 문자열 확인
        console.log('Serialized description:', values.description);
        //todo: BE 팀과 이야기 후 json 직렬화하여 본문 부분 전송하기로 했습니다.
        // 여기서 API 요청 처리
        // fetch('/api/posts', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(values)
        // })
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
                        {/*todo:필터 기능 추가는 도움 요청 드립니다. */}
                        <section
                            className={
                                'flex w-full flex-col items-center justify-center text-center'
                            }
                        >
                            <div
                                className={'bg-sky-blue/30 mt-6 h-19.5 w-full'}
                            >
                                윗필터
                            </div>
                            <div
                                className={'bg-sky-blue/30 mt-6 h-19.5 w-full'}
                            >
                                아래필터
                            </div>
                        </section>

                        {/*지도 및 장소 검색 섹션*/}
                        <section>
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem className={'w-full'}>
                                        <FormLabel htmlFor={'location'}>
                                            <h2
                                                className={
                                                    'mt-6 text-base font-bold'
                                                }
                                            >
                                                장소
                                            </h2>
                                        </FormLabel>
                                        <div
                                            className={
                                                'mt-2.5 flex items-center gap-2.5'
                                            }
                                        >
                                            <FormControl>
                                                <Input
                                                    placeholder="여행지를 입력해 주세요"
                                                    {...field}
                                                    className={`h-11 w-full rounded-lg bg-neutral-100 p-4 text-base text-[#666666]`}
                                                    id={'location'}
                                                />
                                            </FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={
                                                    'border-sky-blue font-semibild text-sky-blue h-11 border-2 px-7.5 py-2 text-sm'
                                                }
                                            >
                                                위치 찾기
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/*실제 지도 랜더 섹션*/}
                            <section>
                                <KakaoMap />
                            </section>
                        </section>
                        <FormField
                            control={form.control}
                            name="description"
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
                        {/*썸네일 섹션*/}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className={'w-full'}>
                                    <FormLabel htmlFor={'title'}>
                                        <h2
                                            className={
                                                'mt-6 text-base font-bold'
                                            }
                                        >
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
                        <div className={'flex gap-1.5'}>
                            <ThumbnailBtn /> <ThumbnailBtn />
                        </div>
                        {/*태그 섹션*/}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className={'w-full'}>
                                    <FormLabel htmlFor={'title'}>
                                        <h2
                                            className={
                                                'mt-6 text-base font-bold'
                                            }
                                        >
                                            태그
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
                            >
                                취소
                            </Button>
                            <Button
                                className={
                                    'bg-sky-blue h-13 w-54 text-sm font-semibold text-neutral-50'
                                }
                                type="submit"
                            >
                                등록
                            </Button>
                        </section>
                    </form>
                </Form>
            </section>
        </div>
    );
}
