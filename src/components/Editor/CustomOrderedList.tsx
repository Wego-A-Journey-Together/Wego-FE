'use client';

import { mergeAttributes } from '@tiptap/core';
import OrderedList from '@tiptap/extension-ordered-list';

const CustomOrderedList = OrderedList.extend({
    renderHTML({ HTMLAttributes }) {
        return [
            'ol',
            mergeAttributes(HTMLAttributes, {
                class: 'list-decimal pl-5 my-2',
            }),
            0,
        ];
    },
});

export default CustomOrderedList;
