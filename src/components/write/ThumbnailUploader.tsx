'use client';

import { ThumbnailBtn } from '@/components/write/ThumbnailBtn';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type Props = {
    onChange: (url: string | null) => void;
    value?: string | null;
};

export default function ThumbnailUploader({ onChange, value }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // 미리보기 용 프리뷰 (s3저장소 활용 방안)
    useEffect(() => {
        if (value) {
            setPreviewUrl(value); // S3에서 온 URL
        } else {
            setPreviewUrl(null);
        }
    }, [value]);

    const handleButtonClick = () => {
        inputRef.current?.click();
    };

    /**
     * 파일이 선택되면 presignedUrl 발급하고
     * s3에 업로드후 해당 주소로 onchange를 RHF에 넘겨주는 구조 입니다.
     * @param e
     */
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (!file) return;

        if (file.size > 1024 * 1024) {
            toast.error('썸네일 이미지는 1MB 이하여야 합니다.');
            return;
        }

        try {
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

            const { url } = await res.json();

            // 이미지 업로드
            const uploadRes = await fetch(url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (!uploadRes.ok) {
                throw new Error(
                    `S3 업로드 실패: ${uploadRes.status} ${uploadRes.statusText}`,
                );
            }

            // 성공하면 알림
            toast.success('이미지 업로드 성공!');

            // s3 주소로 RHF onChange 값 업데이트
            onChange(url.split('?')[0]);
        } catch (error) {
            console.error('업로드 실패:', error);
            // 실패시에도 알림
            toast.error('이미지 업로드에 실패했어요. 다시 시도해주세요.');
        }
    };

    return (
        <div className="flex items-center gap-4">
            {/* 숨겨진 파일 입력 */}
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            {/* 썸네일 버튼 */}
            <ThumbnailBtn onClick={handleButtonClick} />

            {/* 썸네일 미리보기 */}
            {previewUrl && (
                <div className="h-20 w-20 overflow-hidden rounded-lg border">
                    <img
                        src={previewUrl}
                        alt="thumbnail preview"
                        className="h-full w-full object-cover"
                    />
                </div>
            )}
        </div>
    );
}
