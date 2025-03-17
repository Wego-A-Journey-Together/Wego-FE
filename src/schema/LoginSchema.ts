import { z } from 'zod';

/**
 * 로그인 폼 스키마.
 * 이메일 형식만 검증하고, 비밀번호는 검증하지 않습니다.
 */
export const loginSchema = z.object({
    email: z.string().email('이메일 형식을 확인해 주세요'),
    password: z.string(),
});
