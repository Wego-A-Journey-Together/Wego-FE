export const getCategories = (isVisitor: boolean) => ({
    journey: {
        id: 'journey',
        label: '의 동행',
        tabs: isVisitor
            ? [] // 방문자는 journey 탭 비공개
            : [
                  { id: 'participating', label: '참여중인 동행' },
                  { id: 'ended', label: '참여 종료된 동행' },
                  { id: 'my', label: '내 동행' },
                  { id: 'comments', label: '작성 댓글' },
              ],
    },
    sogam: {
        id: 'sogam',
        label: '동행 소감',
        tabs: [
            { id: 'received', label: '받은 소감' },
            // 방문자에게는 이 아래 두 탭 숨김
            ...(isVisitor
                ? []
                : [
                      { id: 'writable', label: '작성 가능한 소감' },
                      { id: 'written', label: '내가 작성한 소감' },
                  ]),
        ],
    },
});
