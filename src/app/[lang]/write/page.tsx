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
        console.log('Form values:', values);
        console.log('Description type:', typeof values.description);

        // JSON 형식이면 문자열로 변환해서 로그 보기
        if (typeof values.description === 'object') {
            console.log(
                'JSON as string:',
                JSON.stringify(values.description, null, 2),
            );
        }

        // 여기서 API 요청 처리
    };

    return (
        <div>
            <main className={'p-24'}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Main title for your article"
                                            {...field}
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
                                <FormItem>
                                    <FormLabel>본문 내용</FormLabel>
                                    <FormControl>
                                        {/* JSON 형식으로 저장하는 방식으로 변경 */}
                                        <ContentEditor
                                            content={field.value}
                                            onChange={(
                                                content,
                                                contentType,
                                            ) => {
                                                if (contentType === 'json') {
                                                    // JSON 형식으로 저장
                                                    field.onChange(content);
                                                } else {
                                                    // HTML 문자열로 저장 (원래 방식)
                                                    field.onChange(content);
                                                }
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
