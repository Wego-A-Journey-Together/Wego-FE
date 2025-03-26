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
            <main className="mx-auto w-full flex-col">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className={'w-full'}>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Main title for your article"
                                            {...field}
                                            className={`w-full`}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className={'w-full'}>
                                    <FormLabel>본문 내용</FormLabel>
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
                        <Button className={'my-4'} type="submit">
                            Submit
                        </Button>
                    </form>
                </Form>
            </main>
        </div>
    );
}
