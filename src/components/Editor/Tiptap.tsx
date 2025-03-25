'use client';

import Image from '@tiptap/extension-image';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import Toolbar from './Toolbar';

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
    // 초기 내용 설정
    const initialContent =
        typeof content === 'string'
            ? content // HTML 문자열인 경우
            : content; // JSON 객체인 경우

    // onChange가 함수인지 확인하는 안전 래퍼
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
                heading: { levels: [2, 3] },
            }),
            Image.configure({
                allowBase64: true,
                inline: false,
            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'min-h-[300px] max-h-[600px] overflow-y-auto p-4 border rounded-md focus:outline-none prose prose-sm md:prose-base max-w-none',
            },
            handlePaste: (view, event) => {
                const items = event.clipboardData?.items;
                if (!items) return false;

                for (const item of items) {
                    if (item.type.startsWith('image/')) {
                        event.preventDefault();
                        const blob = item.getAsFile();

                        if (blob && editor) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const dataUrl = e.target?.result;
                                if (typeof dataUrl === 'string') {
                                    editor
                                        .chain()
                                        .focus()
                                        .setImage({ src: dataUrl })
                                        .run();
                                }
                            };
                            reader.readAsDataURL(blob);
                            return true;
                        }
                    }
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            // HTML과 JSON 모두 전달
            handleChange(editor.getHTML(), editor.getJSON());
        },
        // SSR 문제 해결을 위한 설정
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
