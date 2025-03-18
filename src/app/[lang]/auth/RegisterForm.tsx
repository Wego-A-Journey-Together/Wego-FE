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
import { registerSchema } from '@/schema/RegisterSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeClosed } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function RegisterForm() {
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            company: '',
            password: '',
            passwordConfirm: '',
        },
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        console.log('Submitted values:', values);
    };
    return (
        <div className="mx-auto max-w-md rounded-md bg-white p-6 shadow-md dark:bg-neutral-900">
            <h2 className="mb-4 text-2xl font-bold">회원가입</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {/* 이름 */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <div className={'flex justify-between'}>
                                    <FormLabel>이름</FormLabel>{' '}
                                    {<FormMessage className={`text-xs`} />}
                                </div>
                                <FormControl>
                                    <Input
                                        placeholder="이름을 입력해 주세요"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* 아이디 */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <div className={'flex justify-between'}>
                                    <FormLabel>아이디</FormLabel>
                                    {fieldState.error ? (
                                        <FormMessage className={`text-xs`} />
                                    ) : (
                                        <FormDescription className={`text-xs`}>
                                            이메일 형식으로 입력해 주세요.
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

                    {/* 회사명 */}
                    <FormField
                        control={form.control}
                        name="company"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <div className={'flex justify-between'}>
                                    <FormLabel>회사명</FormLabel>{' '}
                                    {fieldState.error ? (
                                        <FormMessage className={`text-xs`} />
                                    ) : (
                                        <FormDescription className={`text-xs`}>
                                            소속 회사명을 입력하세요.
                                        </FormDescription>
                                    )}
                                </div>
                                <FormControl>
                                    <Input placeholder="삼성 전자" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* 비밀번호 */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <div className={'flex justify-between'}>
                                    <FormLabel>비밀번호</FormLabel>{' '}
                                    {fieldState.error ? (
                                        <FormMessage className={`text-xs`} />
                                    ) : (
                                        <FormDescription className={`text-xs`}>
                                            비밀번호는 6자 이상, 특수문자를
                                            포함해 주세요
                                        </FormDescription>
                                    )}
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

                    {/* 비밀번호 확인 */}
                    <FormField
                        control={form.control}
                        name="passwordConfirm"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <div className={'flex justify-between'}>
                                    <FormLabel>비밀번호 확인</FormLabel>{' '}
                                    {fieldState.error ? (
                                        <FormMessage className={`text-xs`} />
                                    ) : (
                                        <FormDescription className={`text-xs`}>
                                            동일한 비밀번호를 입력하세요.
                                        </FormDescription>
                                    )}
                                </div>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            placeholder="비밀번호 확인 입력"
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (prev) => !prev,
                                            )
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeClosed />
                                        ) : (
                                            <Eye />
                                        )}
                                    </button>
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className={`flex justify-between`}>
                        <p className={`text-sm font-thin text-neutral-700`}>
                            계정이 있으신가요 ?{' '}
                            <Link
                                href={'/auth/login'}
                                className={`text-indigo-600`}
                            >
                                로그인
                            </Link>
                        </p>{' '}
                        <Button type="submit">Sign up</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
