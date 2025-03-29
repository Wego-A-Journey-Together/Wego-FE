import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest, NextResponse } from 'next/server';

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.AWS_S3_BUCKET_NAME!;

const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(req: NextRequest) {
    try {
        const { filename, contentType } = await req.json();

        const key = `uploads/${Date.now()}-${filename}`;

        const command = new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            ContentType: contentType,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // 60초 유효

        return NextResponse.json({
            url: signedUrl,
            key: key,
        });
    } catch {
        console.error('Error generating presigned URL:');
        return NextResponse.json(
            { error: 'Failed to generate URL' },
            { status: 500 },
        );
    }
}
