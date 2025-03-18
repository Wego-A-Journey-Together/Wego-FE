import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * clsx + twMerge 가 통합된 유틸함수
 * pnpm dlx shadcn@latest init -d 자동생성
 * @param inputs classNames
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
