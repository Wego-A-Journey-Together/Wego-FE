import { z } from 'zod';

/**
 * 회원가입시 유저 폼 스키마.
 * 각 필드별로 검증하며 message, path가 적절한지 체크합니다.
 */
export const registerSchema = z
    .object({
        username: z
            .string()
            .min(2, '이름을 확인 해주세요')
            .max(12, '이름이 너무 깁니다.'),
        email: z.string().email('이메일 형식을 확인해 주세요'),
        company: z.string().min(1, '회사명을 입력해 주세요'),
        password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
        passwordConfirm: z.string(),
    })
    .refine((field) => field.password === field.passwordConfirm, {
        message: '비밀번호가 일치하지 않습니다.',
        path: ['passwordConfirm'],
    });
