'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/schema/LoginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeClosed } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function LoginForm() {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const [showPassword, setShowPassword] = useState(false);
    // todo-jh: 백엔드 구현시 여기에 tanstackquery 사용하여 로딩처리도 해야함
    const loginRequest = async (values: z.infer<typeof loginSchema>) => {
        console.log(values);
        return Promise.reject(new Error('백엔드가 아직 구현되지 않았습니다.'));
    };
    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        try {
            // 로그인 API 요청
            await loginRequest(values);
        } catch {
            // 로그인 실패 시, 이메일과 비밀번호 필드에 에러 메시지를 설정
            form.setError('email', {
                type: 'manual',
                message: '아이디 또는 비밀번호를 확인해 주세요.',
            });
        }
    };
    return (
        <div className="mx-auto max-w-md rounded-md bg-white p-6 shadow-md dark:bg-neutral-900">
            <h2 className="mb-8 text-2xl font-bold">로그인</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    {/* 아이디 */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <div className={'flex justify-between'}>
                                    <FormLabel>아이디</FormLabel>{' '}
                                    {fieldState.error ? (
                                        <FormMessage className={`text-xs`} />
                                    ) : (
                                        <FormDescription className={`text-xs`}>
                                            유효한 이메일을 입력해 주세요
                                        </FormDescription>
                                    )}
                                </div>
                                <FormControl>
                                    <Input
                                        placeholder="example@dummy.com"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* 비밀번호 */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className={'flex justify-between'}>
                                    <FormLabel>비밀번호</FormLabel>
                                </div>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            placeholder="비밀번호 입력"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    >
                                        {showPassword ? <EyeClosed /> : <Eye />}
                                    </button>
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center justify-between">
                        <p className={`text-sm font-thin text-neutral-700`}>
                            계정이 아직 없으신가요 ?
                            <Link
                                href={'/auth/register'}
                                className={`ml-3 text-indigo-600`}
                            >
                                10초 회원가입
                            </Link>
                        </p>{' '}
                        <Button type="submit">Log in</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
