'use client';

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

export default function WritePage() {
    const postSchema = z.object({
        description: z.string().min(5, { message: '다섯 글자는 넘어야죠' }),
    });
    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        mode: 'onChange',
        defaultValues: {
            description: '',
        },
    });
    return (
        <div>
            <main className={'p-24'}>
                <Form {...form}>
                    <form>
                        <FormField
                            control={form.control}
                            name="description"
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
                    </form>
                </Form>
            </main>
        </div>
    );
}
