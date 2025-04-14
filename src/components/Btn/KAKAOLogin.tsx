'use client';

import { useAppSelector } from '@/redux/hooks';
import Image from 'next/image';

/** #S101 보안: 환경 변수 값이 없을 때의 폴백 URL을 하드코딩하지 않도록 개선 필요 */
const NEXT_PUBLIC_NEST_BFF_URL =
    process.env.NEXT_PUBLIC_NEST_BFF_URL || 'https://gateway.wego-travel.click';

export default function KAKAOLogin() {
    /** #P102 성능: translations 객체를 컴포넌트 외부로 이동하여 리렌더링 방지 필요 */
    const translations = {
        ko: {
            kakaoImage: '/kakao/wideKorean.png',
        },
        en: {
            kakaoImage: '/kakao/wideEnglish.png',
        },
    };

    const t = useAppSelector((state) => state.locale.current);

    //-----------------------------------------------------------
    // KAKAO 로그인 관련
    //-------------------------------------------------------------

    /** #E103 에러처리: 카카오 로그인 실패 시 에러 처리 필요 */
    /** #U104 사용자 경험: 로그인 진행 중 로딩 상태 표시 필요 */
    const handleClick = () => {
        // 유저를 서버로 이동
        window.location.href = `${NEXT_PUBLIC_NEST_BFF_URL}/api/user/kakao/authorize`;
    };
    //lang 이 "ko"나 "en"이 아닐 경우에도 fallback "ko"를 기준으로 번역합니다

    /** #A105 접근성: 이미지 버튼에 적절한 role과 키보드 접근성 추가 필요 */
    return (
        <Image
            src={translations[t].kakaoImage}
            alt={'카카오 로그인'}
            width={300}
            height={45}
            className={`h-9 w-60 cursor-pointer object-contain`}
            onClick={handleClick}
        />
    );
}
