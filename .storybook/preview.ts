import '@/app/globals.css';
import type { Preview } from '@storybook/react';

const preview: Preview = {
    parameters: {
        controls: { expanded: true }, // 컨트롤 확장
    },
};

export default preview;
