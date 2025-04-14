'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface ReviewImageUploaderProps {
    onImageSelect: (url: string) => void;
    initialImage?: string;
}

/**
 *  콘텐츠에 url 업로드를 해두고 랜더링시에 분리하면 s3사용해서 api없이 이미지 업로드 구현 될 것 같습니다.
 * @param onImageSelect
 * @param initialImage
 * @constructor
 */
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
            console.log('📷 blob preview url:', tempBlobUrl);

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
            console.log('🔗 presigned url:', url);

            //  S3 업로드
            const uploadRes = await fetch(url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });
            console.log('✅ S3 upload status:', uploadRes.status, uploadRes.ok);

            const publicUrl = `https://${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${key}`;
            console.log('🌐 public image url:', publicUrl);

            setPreviewUrl(publicUrl);
            onImageSelect(publicUrl);

            // 블롭 해제
            if (blobRef.current?.startsWith('blob:')) {
                URL.revokeObjectURL(blobRef.current);
                blobRef.current = null;
            }
        } catch (err) {
            console.error('이미지 업로드 실패:', err);
        }
    };

    return (
        <>
            <label
                htmlFor="image-upload"
                className="mx-auto mt-[30px] flex h-[52px] w-[440px] cursor-pointer items-center justify-center gap-1 rounded border border-dashed border-[#999999]"
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
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleChange}
                />
            </label>

            {previewUrl && (
                <div className="mt-4 flex justify-center">
                    <Image
                        src={previewUrl}
                        alt="preview"
                        width={200}
                        height={200}
                        className="rounded object-cover"
                    />
                </div>
            )}
        </>
    );
}
