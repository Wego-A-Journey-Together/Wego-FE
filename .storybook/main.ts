import type { StorybookConfig } from '@storybook/nextjs';





const config: StorybookConfig = {
    framework: '@storybook/nextjs',
    core: {
        builder: 'webpack5', // ✅ Webpack 5 사용
    },
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
    webpackFinal: async (config) => {
        // Next.js의 Turbopack 관련 문제 해결
        if (!config.resolve) {
            config.resolve = {};
        }
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false, // 파일 시스템 모듈 제거
        };
        return config;
    },
};

export default config;
