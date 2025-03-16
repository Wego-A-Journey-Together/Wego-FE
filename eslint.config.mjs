import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends(
        'next/core-web-vitals',
        'next/typescript',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/jsx-runtime',
        //todo 이 부분 의존성 설치하고 빌드시 에러납니다. 해결해야 할 거 같습니다.
        // 'plugin:@tanstack/eslint-plugin-query/recommended',
    ),
    {
        //todo : 이 부분도 동일한 이유로 추가되었습니다.
        rules: {
            'react/prop-types': 'off',
        },
    },
];

export default eslintConfig;
