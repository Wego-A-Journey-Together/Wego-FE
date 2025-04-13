'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function useCancelApply() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [error, setError] = useState<Error | null>(null);

    // isSuccess 상태가 변경될 때만 toast를 표시 (초기값 null)
    useEffect(() => {
        if (isSuccess === true) {
            toast('취소 요청 완료', {
                description: '다음에 또 만나요',
                action: {
                    label: '닫기',
                    onClick: () => {},
                },
            });
        } else if (isSuccess === false) {
            toast('취소 요청 실패', {
                description: '잠시 후 다시 시도해 주세요',
                action: {
                    label: '닫기',
                    onClick: () => {},
                },
            });
        }
    }, [isSuccess]);

    const cancelApply = useCallback(async (gatheringId: number) => {
        try {
            setIsLoading(true);
            setError(null);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_NEST_BFF_URL}/api/gathering/cancel/${gatheringId}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                },
            );

            if (!res.ok) {
                throw new Error(`Failed to cancel: ${res.status}`);
            }

            setIsSuccess(true);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
            setIsSuccess(false);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { cancelApply, isLoading, error };
}
