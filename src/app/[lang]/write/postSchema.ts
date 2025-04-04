import { z } from 'zod';

export const PostSchema = z.object({
    // 제목 스키마 ( UI 안깨질 정도의 길이 )
    title: z
        .string()
        .min(4, '동행 제목은 5글자 이상 입력해 주세요')
        .max(32, '제목은 32자 이하로 작성해 주세요'),

    //필터 스키마
    filter: z.object({
        startDate: z.date(),
        endDate: z.date(),
        deadlineDate: z.date(),
        deadlineTime: z.string(),
        groupTheme: z.string(),
        groupSize: z.string(),
        gender: z.string().nullable(),
        age: z.string().nullable(),
    }),

    // 카카오 로컬 api 스펙에 따르면 기본 제공은 세 가지 필드 입니다. ( 사용자가 검색어 입력 후 선택시 따라오는 필드들 )
    location: z.object({
        placeName: z.string(),
        lat: z.number(),
        lng: z.number(),
    }),
    // json 직렬화 과정에서 텍스트가 늘어날 수 있습니다. 115는 ㅈㄱㄴ 부터 허용 범위 입니다. (세 글자)
    content: z
        .string()
        .min(115, { message: '조금 더 작성해 주세요' })
        .max(20000, { message: '죄송합니다. 본문 길이가 너무 깁니다.' }),
    // S3 업로드 후 검증할 생각이라 스트링, url 형식으로 처리 했습니다 + nullish
    thumbnailUrl: z
        .string()
        .url({
            message: '유효한 URL 형식의 문자열이어야 합니다.',
        })
        .optional(),
    // 태그 최대 5개, #으로 시작하는 어레이로 간주
    tags: z
        .array(
            z.string().regex(/^#[^\s#]{1,19}$/, {
                message: '태그는 #으로 시작하고 공백 없이 1~19자여야 합니다.',
            }),
        )
        .max(5, { message: '해시태그는 5개까지 가능합니다.' })
        .optional(),
});

export type PostFormValues = z.infer<typeof PostSchema>;
