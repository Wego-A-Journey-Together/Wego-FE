'use client';

import CustomBulletList from '@/components/Editor/CustomBulletList';
import CustomOrderedList from '@/components/Editor/CustomOrderedList';
import { CustomHeading, CustomLink } from '@/components/Editor/Tiptap';
import { generateHTML } from '@tiptap/core';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import DOMPurify from 'dompurify';

export default function JsonToHtml({ content }: { content: string }) {
    const html = generateHTML(JSON.parse(content), [
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
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Highlight.configure({ multicolor: true }),
    ]);
    const safe = DOMPurify.sanitize(html);

    return (
        <article className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: safe }} />
        </article>
    );
}
