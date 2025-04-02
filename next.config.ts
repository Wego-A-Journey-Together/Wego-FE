import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true, // 개발 중 잠재적 문제를 조기에 발견하기 위한 설정
    // Next.js 에서 이제 디폴트로 관리되어 불필요한 설정이라 주석 처리 하였습니다.
    // swcMinify: true, // Rust 기반 컴파일러로 빌드 속도 향상
    compress: true, // 응답 압축으로 성능 향상
    poweredByHeader: false, // 보안을 위해 X-Powered-By 헤더 제거
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/static/**',
            },
            {
                protocol: 'https',
                hostname: 'gateway.wego-travel.click',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname:
                    'wegotiptaparticleimageuploadersuperultraggorgeousbucket.s3.ap-northeast-2.amazonaws.com',
                port: '',
                pathname: '/**',
            },
            {
                //picsum.photos
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
                pathname: '/**',
            },
            {
                //picsum.photos
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.jsdelivr.net',
                port: '',
                pathname: '/**',
            },
        ], // 외부 이미지 도메인 허용 목록 -> domains -> remotePatterns 로 수정 하였습니다.
        formats: ['image/webp', 'image/avif'], // 최신 이미지 포맷 지원
    },
    // 미들웨어에서 이미 처리하고 있고, 레거시 설정이라 주석처리 하였습니다.
    // i18n: {
    //     locales: ['ko', 'en'],
    //     defaultLocale: 'ko',
    // },
};

export default nextConfig;
