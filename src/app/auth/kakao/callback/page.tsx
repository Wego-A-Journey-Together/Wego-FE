'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CallBackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        try {
            const code = searchParams.get('code');
            if (!code) router.push('/');
        } catch (e) {}
    }, [router, searchParams]);

    const code = searchParams.get('code');
    console.log('인가코드:', code);
    return (
        <div>
            <LoadingSpinner />
        </div>
    );
}
