import { BEHomePost } from '@/types/BEHomePost';

const paramMappings: Record<string, string> = {
    category: 'category',
    preferredGender: 'preferredGender',
    preferredAge: 'preferredAge',
    address: 'address',
    startDate: 'startDate',
    endDate: 'endDate',
    maxParticipants: 'maxParticipants',
};

/**
디버 * 백엔드 API 응답 타입 정의
 */
export interface GatheringResponse {
    content: Array<BEHomePost>;
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    empty: boolean;
}

/**
 * 게시물 목록을 가져오는 API 함수
 */
export const fetchGatherings = async (
    searchParams: URLSearchParams,
    pageParam: number = 1,
): Promise<GatheringResponse> => {
    const NEXT_PUBLIC_NEST_BFF_URL = process.env.NEXT_PUBLIC_NEST_BFF_URL;

    // 필터 파라미터가 있는지 확인 (더 간결한 방식으로 변경)
    const hasFilters = hasActiveFilters(searchParams);

    let url;
    if (hasFilters) {
        // 백엔드 API 요청을 위한 URL 구성
        const apiParams = new URLSearchParams();

        // 필터 파라미터 추가 (페이지네이션 제외)
        for (const [key, value] of searchParams.entries()) {
            // 유효한 파라미터만 처리
            if (
                value &&
                value !== 'undefined' &&
                value !== 'null' &&
                !['page', 'size'].includes(key) &&
                paramMappings[key]
            ) {
                // 날짜 형식 변환 YYYY-MM-EE
                if (['startDate', 'endDate'].includes(key)) {
                    const formattedDate = new Date(value)
                        .toISOString()
                        .split('T')[0];
                    apiParams.set(paramMappings[key], formattedDate);
                }
                // 숫자 변환
                else if (key === 'maxParticipants') {
                    apiParams.set(paramMappings[key], String(parseInt(value)));
                }
                // 일반 문자열
                else {
                    apiParams.set(paramMappings[key], value);
                }
            }
        }

        // 페이지네이션 파라미터 추가
        apiParams.set('page', String(pageParam - 1)); // 1-based를 0-based로 변환
        apiParams.set('size', '10');

        url = `${NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/filter?${apiParams.toString()}`;
    } else {
        url = `${NEXT_PUBLIC_NEST_BFF_URL}/api/gatherings/list?page=${pageParam - 1}&size=10`; // 1-based to 0-based
    }

    // API request and response handling
    try {
        console.log(`Requesting URL for page ${pageParam}: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `HTTP error! status: ${response.status}, message: ${errorText}`,
            );
        }

        const data = await response.json();
        console.log(`API Response for page ${pageParam}:`, {
            number: data.number,
            size: data.size,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            last: data.last,
            contentLength: data.content?.length,
            hasContent: !!data.content,
            firstItemId: data.content?.[0]?.id || 'N/A',
        });
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

/**
 * 필터링이 적용되었는지 확인하는 함수
 */
export const hasActiveFilters = (searchParams: URLSearchParams): boolean => {
    return Array.from(searchParams.entries()).some(
        ([key, value]) =>
            !['page', 'size'].includes(key) &&
            value &&
            value !== 'undefined' &&
            value !== 'null',
    );
};
