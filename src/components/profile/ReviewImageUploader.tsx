'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface ReviewImageUploaderProps {
    onImageSelect: (url: string) => void;
    initialImage?: string;
}

export default function ReviewImageUploader({
    onImageSelect,
    initialImage,
}: ReviewImageUploaderProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        initialImage ?? null,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);
    const blobRef = useRef<string | null>(null);

    // 블롭 주소 revoke 처리
    useEffect(() => {
        return () => {
            if (blobRef.current?.startsWith('blob:')) {
                URL.revokeObjectURL(blobRef.current);
                blobRef.current = null;
            }
        };
    }, [previewUrl]);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // blob preview
            const tempBlobUrl = URL.createObjectURL(file);
            setPreviewUrl(tempBlobUrl);
            blobRef.current = tempBlobUrl;

            // presigned URL 요청
            const res = await fetch('/api/s3', {
                method: 'POST',
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const { url, key } = await res.json();

            // S3 업로드
            await fetch(url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            const publicUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
            setPreviewUrl(publicUrl);
            onImageSelect(publicUrl);

            if (blobRef.current?.startsWith('blob:')) {
                URL.revokeObjectURL(blobRef.current);
                blobRef.current = null;
            }
        } catch (err) {
            console.error('이미지 업로드 실패:', err);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="mx-auto mt-[30px] w-[440px]">
            <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleChange}
            />

            {previewUrl ? (
                // 이미지가 있으면 클릭 시 재선택 가능하게
                <div
                    className="flex h-[52px] w-full cursor-pointer items-center justify-center overflow-hidden rounded border border-dashed border-[#999999] bg-white"
                    onClick={handleImageClick}
                >
                    <img
                        src={previewUrl}
                        alt="preview"
                        className="h-full max-h-[200px] w-auto object-contain"
                    />
                </div>
            ) : (
                // 이미지 없으면 기본 버튼
                <label
                    htmlFor="image-upload"
                    className="flex h-[52px] w-full cursor-pointer items-center justify-center gap-1 rounded border border-dashed border-[#999999]"
                >
                    <Image
                        src="/icon/profile/uploadPhoto.svg"
                        width={16}
                        height={13}
                        alt="upload"
                    />
                    <span className="text-base font-bold text-black">
                        사진 첨부하기
                    </span>
                </label>
            )}
        </div>
    );
}
