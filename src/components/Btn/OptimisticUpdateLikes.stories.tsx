import { Meta, StoryObj } from '@storybook/react';

import Like from './Like';

const meta: Meta<typeof Like> = {
    title: 'Button/Like',
    component: Like,
};

export default meta;

// 기본 상태 (스토리북 UI에서 직접 클릭 테스트 가능)
export const Default: StoryObj<typeof Like> = {};
