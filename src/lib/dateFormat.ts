import { format, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * Date 가 이동중 string 으로 변환될 가능성이 있어서 추가
 * @param date
 * @param includeTime - 시간 포함 여부 (기본값: true)
 * @returns 포맷팅된 날짜 문자열
 */
export function dateFormat(date: Date | string, includeTime = true): string {
    // 날짜가 없는 경우 빈 문자열 반환
    if (!date) return '';

    try {
        // 문자열을 Date 객체로 변환
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        // 유효한 날짜인지 확인
        if (!isValid(dateObj)) return '';

        // 시간 포함 여부에 따라 다른 포맷 사용
        const formatPattern = includeTime ? 'yyyy.MM.dd a h:mm' : 'yyyy.MM.dd';

        return format(dateObj, formatPattern, { locale: ko });
    } catch (error) {
        console.error('날짜 포맷팅 오류:', error);
        return '';
    }
}

export default dateFormat;
