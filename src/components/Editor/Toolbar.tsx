'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { type Editor } from '@tiptap/react';
import {
    Bold,
    Heading2,
    Image as ImageIcon,
    Italic,
    List,
    ListOrdered,
} from 'lucide-react';
import { useState } from 'react';

type ToolbarProps = {
    editor: Editor | null;
};

export default function Toolbar({ editor }: ToolbarProps) {
    const [imageUrl, setImageUrl] = useState('');

    if (!editor) {
        return null;
    }

    const addImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl('');
        }
    };

    return (
        <div className="bg-background mb-2 flex flex-wrap items-center gap-2 rounded-md border p-2">
            {/* 텍스트 서식 버튼들 */}
            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 2 })}
                onPressedChange={() => {
                    if (editor.isActive('heading', { level: 2 })) {
                        editor.chain().focus().setParagraph().run();
                    } else {
                        editor.chain().focus().setHeading({ level: 2 }).run();
                    }
                }}
                className="flex h-8 w-8 items-center justify-center p-0"
                aria-label="제목"
            >
                <Heading2 className="h-4 w-4" />
            </Toggle>

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

            {/* 이미지 URL 입력 필드 */}
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
