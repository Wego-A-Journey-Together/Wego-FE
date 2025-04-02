/**
 * 숫자 나이를 'N0대' 형식의 문자열로 변환
 * @param age 나이 (숫자)
 * @returns 'N0대' 형식의 문자열 (ex: '20대')
 */
export const convertAgeRange = (age: number): string => {
    if (!age && age !== 0) return '';

    // 10으로 나눈 몫에 10을 곱해 연령대 시작 숫자를 구함
    const decadeStart = Math.floor(age / 10) * 10;

    // 특수 케이스 처리 (예: 100세 이상)
    if (decadeStart >= 100) return 'GOAT';

    return `${decadeStart}대`;
};
