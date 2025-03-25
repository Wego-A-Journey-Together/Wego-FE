'use client';

import { mergeAttributes } from '@tiptap/core';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import CustomBulletList from './CustomBulletList';
import CustomOrderedList from './CustomOrderedList';
import Toolbar from './Toolbar';

// 커스텀 Heading extension: 각 헤딩 레벨에 Tailwind 클래스를 적용
const CustomHeading = Heading.extend({
    renderHTML({ node, HTMLAttributes }) {
        const level = node.attrs.level;
        let classes = '';
        if (level === 1) {
            classes = 'text-4xl font-bold my-4';
        } else if (level === 2) {
            classes = 'text-3xl font-semibold my-3';
        } else if (level === 3) {
            classes = 'text-2xl font-medium my-2';
        }
        return [
            `h${level}`,
            mergeAttributes(HTMLAttributes, { class: classes }),
            0,
        ];
    },
});

// 커스텀 Link extension: 링크에 Tailwind 스타일 적용 (파란색, 밑줄)
const CustomLink = Link.extend({
    renderHTML({ HTMLAttributes }) {
        return [
            'a',
            mergeAttributes(HTMLAttributes, {
                class: 'text-blue-500 underline',
            }),
            0,
        ];
    },
});

type ContentEditorProps = {
    content?: string | JSONContent;
    onChange?: (
        content: string | JSONContent,
        contentType: 'html' | 'json',
    ) => void;
    contentType?: 'html' | 'json';
};

export default function ContentEditor({
    content = '',
    onChange = () => {},
    contentType = 'html',
}: ContentEditorProps) {
    // 초기 내용: HTML 문자열 혹은 JSONContent 모두 지원
    const initialContent = typeof content === 'string' ? content : content;

    const handleChange = (html: string, jsonContent: JSONContent) => {
        if (typeof onChange === 'function') {
            if (contentType === 'html') {
                onChange(html, 'html');
            } else {
                onChange(jsonContent, 'json');
            }
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                bulletList: false,
                orderedList: false,
            }),
            CustomHeading.configure({ levels: [1, 2, 3] }),
            CustomBulletList,
            CustomOrderedList,
            Image.configure({ allowBase64: true, inline: false }),
            CustomLink.configure({ openOnClick: false }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'min-h-[300px] max-h-[600px] overflow-y-auto p-4 border rounded-md focus:outline-none prose prose-sm md:prose-base max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            handleChange(editor.getHTML(), editor.getJSON());
        },
        immediatelyRender: false,
    });

    return (
        <div className="w-full border-0">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
            <p className="text-muted-foreground mt-2 text-xs">
                이미지는 URL을 입력하거나 복사(Ctrl+C) 후 붙여넣기(Ctrl+V)로
                추가할 수 있습니다.
            </p>
        </div>
    );
}
