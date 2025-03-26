import type { JSONContent } from '@tiptap/react';





/**
 * TipTap 에디터 JSON 문자열에서 maxLength 만큼 텍스트 추출하는 함수 입니다.
 * @param content
 * @param maxLength =130
 */
export function extractPreview(content: string, maxLength = 130) {
    if (!content) return null;

    // TipTap 의 제이슨 타입 가져오기
    let data: JSONContent;

    // 직렬화된 제이슨 형식이 아닐경우 미리보기 없음.
    try {
        data = JSON.parse(content);
    } catch {
        return null;
    }

    let collected = '';
    let done = false;
    /**
     * TipTap JSON 이 트리 구조라 DFS 탐색 알고리즘 작성
     * 미리보기 길이 넘치면 멈추고, 아닐경우 collected 에 쌓앋둡니다.
     * @param node
     */
    const visitor = (node: JSONContent): void => {
        if (done || !node) return;

        if (node.type === 'text' && node.text) {
            collected += node.text + ' ';
            if (collected.length >= maxLength) {
                done = true;
                return;
            }
        }

        if (node.content) {
            for (const child of node.content) {
                if (done) break;
                visitor(child);
            }
        }
    };

    visitor(data);

    return (
        collected.trim().slice(0, maxLength) +
        (collected.length > maxLength ? '...' : '')
    );
}
