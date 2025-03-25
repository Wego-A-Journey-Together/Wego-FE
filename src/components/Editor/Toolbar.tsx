'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { type Editor } from '@tiptap/react';
import {
    Bold,
    Image as ImageIcon,
    Italic,
    Link2,
    List,
    ListOrdered,
} from 'lucide-react';
import { useState } from 'react';

type ToolbarProps = {
    editor: Editor | null;
};

export default function Toolbar({ editor }: ToolbarProps) {
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');

    if (!editor) {
        return null;
    }

    const addImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl('');
        }
    };

    const addLink = () => {
        if (!linkUrl) return;

        // 선택된 텍스트가 없으면 링크 URL 자체를 링크 텍스트로 삽입
        if (editor.state.selection.empty) {
            editor
                .chain()
                .focus()
                .insertContent(`<a href="${linkUrl}">${linkUrl}</a>`)
                .run();
        } else {
            editor.chain().focus().setLink({ href: linkUrl }).run();
        }
        setLinkUrl('');
    };

    return (
        <div className="bg-background mb-2 flex flex-wrap items-center gap-2 rounded-md border p-2">
            {/* Heading 버튼 */}
            <button
                onClick={() => {
                    if (editor.isActive('heading', { level: 1 })) {
                        editor.chain().focus().setParagraph().run();
                    } else {
                        editor.chain().focus().setHeading({ level: 1 }).run();
                    }
                }}
                className={`flex h-8 w-8 items-center justify-center p-0 text-xs ${
                    editor.isActive('heading', { level: 1 }) ? 'font-bold' : ''
                }`}
                aria-label="헤딩 1"
            >
                H1
            </button>
            <button
                onClick={() => {
                    if (editor.isActive('heading', { level: 2 })) {
                        editor.chain().focus().setParagraph().run();
                    } else {
                        editor.chain().focus().setHeading({ level: 2 }).run();
                    }
                }}
                className={`flex h-8 w-8 items-center justify-center p-0 text-xs ${
                    editor.isActive('heading', { level: 2 }) ? 'font-bold' : ''
                }`}
                aria-label="헤딩 2"
            >
                H2
            </button>
            <button
                onClick={() => {
                    if (editor.isActive('heading', { level: 3 })) {
                        editor.chain().focus().setParagraph().run();
                    } else {
                        editor.chain().focus().setHeading({ level: 3 }).run();
                    }
                }}
                className={`flex h-8 w-8 items-center justify-center p-0 text-xs ${
                    editor.isActive('heading', { level: 3 }) ? 'font-bold' : ''
                }`}
                aria-label="헤딩 3"
            >
                H3
            </button>

            <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onPressedChange={() =>
                    editor.chain().focus().toggleBold().run()
                }
                className="flex h-8 w-8 items-center justify-center p-0"
                aria-label="굵게"
            >
                <Bold className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onPressedChange={() =>
                    editor.chain().focus().toggleItalic().run()
                }
                className="flex h-8 w-8 items-center justify-center p-0"
                aria-label="기울임"
            >
                <Italic className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive('bulletList')}
                onPressedChange={() =>
                    editor.chain().focus().toggleBulletList().run()
                }
                className="flex h-8 w-8 items-center justify-center p-0"
                aria-label="글머리 기호"
            >
                <List className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive('orderedList')}
                onPressedChange={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }
                className="flex h-8 w-8 items-center justify-center p-0"
                aria-label="번호 매기기"
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>

            {/* 링크 임베드 */}
            <div className="ml-2 flex items-center gap-1">
                <Link2 className="text-muted-foreground h-4 w-4" />
                <Input
                    type="text"
                    placeholder="링크 URL 입력"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="h-8 w-48 text-xs md:w-60"
                />
                <Button onClick={addLink} size="sm" className="h-8">
                    추가
                </Button>
            </div>

            {/* 이미지 URL 입력 */}
            <div className="ml-2 flex items-center gap-1">
                <ImageIcon className="text-muted-foreground h-4 w-4" />
                <Input
                    type="text"
                    placeholder="이미지 URL 입력"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="h-8 w-48 text-xs md:w-60"
                />
                <Button onClick={addImage} size="sm" className="h-8">
                    추가
                </Button>
            </div>
        </div>
    );
}
