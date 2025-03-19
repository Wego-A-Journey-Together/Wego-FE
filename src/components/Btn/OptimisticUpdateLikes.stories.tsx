import { Meta, StoryObj } from '@storybook/react';

import OptimisticUpdateLikes from './OptimisticUpdateLikes';

const meta: Meta<typeof OptimisticUpdateLikes> = {
    title: 'Button/OptimisticUpdateLikes',
    component: OptimisticUpdateLikes,
};

export default meta;

// 기본 상태 (스토리북 UI에서 직접 클릭 테스트 가능)
export const Default: StoryObj<typeof OptimisticUpdateLikes> = {};
