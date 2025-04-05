'use client';

import { en } from '@/dict/en';
import { ko } from '@/dict/ko';
import { useAppSelector } from '@/redux/hooks';

export function useLocale() {
    const locale = useAppSelector((state) => state.locale.current);
    const t = locale === 'en' ? en : ko;
    return { t };
}
