/**
 * 여행 시작일과 종료일 사이의 일수를 계산하는 함수
 * @param startDate 여행 시작일 (Date 객체)
 * @param endDate 여행 종료일 (Date 객체)
 * @returns 여행 일수 (시작일과 종료일 포함)
 */
export const calculateDays = (
    startDate: string | Date,
    endDate: string | Date,
): number => {
    // 입력값 유효성 검사
    if (!startDate || !endDate) return 0;

    try {
        // 시간 정보 제거하여 날짜만 비교하도록 설정
        const start = new Date(startDate);
        const end = new Date(endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // 밀리초 단위 차이를 일 단위로 변환
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // 시작일과 종료일을 모두 포함해야 하므로 +1
        return diffDays + 1;
    } catch (error) {
        console.error('날짜 계산 오류:', error);
        return 0;
    }
};
