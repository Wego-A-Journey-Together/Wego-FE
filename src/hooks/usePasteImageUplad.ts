'use client';

import { Editor } from '@tiptap/react';
import { useEffect } from 'react';

export default function usePasteImageUpload(
    editor: Editor | null,
    setIsUploading?: (v: boolean) => void,
) {
    useEffect(() => {
        if (!editor) return;

        const handlePaste = async (event: ClipboardEvent) => {
            const items = event.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    event.preventDefault();
                    const file = item.getAsFile();
                    if (!file) return;

                    try {
                        setIsUploading?.(true);

                        const res = await fetch('/api/s3', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                filename: file.name,
                                contentType: file.type,
                            }),
                        });

                        const { url, key } = await res.json();

                        await fetch(url, {
                            method: 'PUT',
                            headers: { 'Content-Type': file.type },
                            body: file,
                        });

                        const uploadedUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;

                        editor
                            .chain()
                            .focus()
                            .setImage({ src: uploadedUrl })
                            .run();
                    } catch (err) {
                        console.error('이미지 업로드 실패:', err);
                        alert('이미지 업로드에 실패했어요 😢');
                    } finally {
                        setIsUploading?.(false); // 로딩해제
                    }
                }
            }
        };

        editor.view.dom.addEventListener('paste', handlePaste);
        return () => {
            editor.view.dom.removeEventListener('paste', handlePaste);
        };
    }, [editor, setIsUploading]);
}
