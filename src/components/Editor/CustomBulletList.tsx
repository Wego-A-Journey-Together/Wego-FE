'use client';

import { mergeAttributes } from '@tiptap/core';
import BulletList from '@tiptap/extension-bullet-list';

const CustomBulletList = BulletList.extend({
    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
        return [
            'ul',
            mergeAttributes(HTMLAttributes, { class: 'list-disc pl-5 my-2' }),
            0,
        ];
    },
});

export default CustomBulletList;
