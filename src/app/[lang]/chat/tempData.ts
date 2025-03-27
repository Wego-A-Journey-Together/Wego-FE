// 임시 데이터들
export interface ChatProps {
    chat: {
        id: number;
        name: string;
        location: string;
        time: string;
        message: string;
        unreadChat: number;
        userIcon: string;
    };
}
export type ChatItem = ChatProps['chat'];
export const chatData: ChatItem[] = [
    {
        id: 1,
        name: '여행하는몽자',
        location: '제주도',
        time: '1분전',
        message:
            '제주도 게스트하우스 예약했는데 근처에 맛집 추천해주실 수 있나요?',
        unreadChat: 3,
        userIcon: '',
    },
    {
        id: 2,
        name: '백패커',
        location: '부산',
        time: '5분전',
        message:
            '부산 해운대 근처에서 같이 여행하실 분 구해요! 사진 찍는 걸 좋아하시면 더 좋아요',
        unreadChat: 1,
        userIcon: '',
    },
    {
        id: 3,
        name: '등산러버',
        location: '설악산',
        time: '10분전',
        message:
            '이번 주말 설악산 등반하실 분 있나요? 초급자 코스로 계획했습니다',
        unreadChat: 5,
        userIcon: '',
    },
    {
        id: 4,
        name: '맛집탐험가',
        location: '서울',
        time: '30분전',
        message:
            '홍대 맛집 투어 같이 하실 분 구합니다! 맛있는 거 좋아하시는 분이면 좋겠어요',
        unreadChat: 2,
        userIcon: '',
    },
    {
        id: 5,
        name: '문화여행자',
        location: '경주',
        time: '1시간전',
        message:
            '경주 고궁 투어 함께해요! 역사에 관심 있으신 분이면 더 좋을 것 같아요',
        unreadChat: 1,
        userIcon: '',
    },
    {
        id: 6,
        name: '카메라맨',
        location: '강릉',
        time: '2시간전',
        message: '강릉 커피거리 투어하실 분 있나요? 인생샷도 찍어드립니다!',
        unreadChat: 0,
        userIcon: '',
    },
    {
        id: 7,
        name: '바다사랑',
        location: '여수',
        time: '3시간전',
        message: '여수 밤바다 구경하면서 맛집 탐방하실 분 찾습니다~',
        unreadChat: 8,
        userIcon: '',
    },
    {
        id: 8,
        name: '한옥스테이',
        location: '전주',
        time: '4시간전',
        message: '전주 한옥마을에서 한복 체험하실 분 구해요! 인생샷 보장합니다',
        unreadChat: 0,
        userIcon: '',
    },
    {
        id: 9,
        name: '산책러',
        location: '서울',
        time: '5시간전',
        message: '한강 따라 자전거 타실 분 있나요? 여의도에서 출발합니다',
        unreadChat: 2,
        userIcon: '',
    },
    {
        id: 10,
        name: '미술관투어',
        location: '서울',
        time: '6시간전',
        message:
            '북촌 갤러리 투어 함께하실 분 구합니다. 예술 좋아하시는 분이면 좋겠어요',
        unreadChat: 0,
        userIcon: '',
    },
    {
        id: 11,
        name: '섬여행자',
        location: '통영',
        time: '어제',
        message: '통영 동피랑 마을 구경하실 분 있나요? 섬 투어도 계획 중입니다',
        unreadChat: 4,
        userIcon: '',
    },
    {
        id: 12,
        name: '캠핑러버',
        location: '가평',
        time: '어제',
        message: '가평에서 글램핑하실 분 구해요! 바베큐 파티도 준비했습니다',
        unreadChat: 0,
        userIcon: '',
    },
    {
        id: 13,
        name: '식도락여행',
        location: '대구',
        time: '어제',
        message: '대구 서문시장 먹방 투어 함께하실 분! 맛집 리스트 준비했어요',
        unreadChat: 1,
        userIcon: '',
    },
    {
        id: 14,
        name: '올레길걷기',
        location: '제주도',
        time: '2일전',
        message:
            '제주 올레길 7코스 같이 걸으실 분 구합니다. 중간중간 맛집 들르기도 해요',
        unreadChat: 0,
        userIcon: '',
    },
    {
        id: 15,
        name: '카페투어',
        location: '광주',
        time: '2일전',
        message:
            '광주 카페거리 투어하실 분 있나요? 분위기 좋은 곳만 선별했습니다',
        unreadChat: 3,
        userIcon: '',
    },
    {
        id: 16,
        name: '축제마니아',
        location: '진주',
        time: '3일전',
        message:
            '진주 남강유등축제 보러 가실 분 구해요! 야경 사진도 찍을 예정입니다',
        unreadChat: 0,
        userIcon: '',
    },
    {
        id: 17,
        name: '시장구경',
        location: '부산',
        time: '3일전',
        message: '부산 국제시장 구경하실 분! 맛집 투어도 포함입니다',
        unreadChat: 0,
        userIcon: '',
    },
    {
        id: 18,
        name: '템플스테이',
        location: '해인사',
        time: '4일전',
        message: '해인사 템플스테이 참여하실 분 있나요? 2박 3일 일정입니다',
        unreadChat: 6,
        userIcon: '',
    },
    {
        id: 19,
        name: '도보여행',
        location: '군산',
        time: '4일전',
        message:
            '군산 근대문화거리 투어하실 분 구합니다. 복고풍 사진 찍기 좋아요',
        unreadChat: 0,
        userIcon: '',
    },
    {
        id: 20,
        name: '사진작가',
        location: '안동',
        time: '5일전',
        message: '안동 하회마을 한복 체험하면서 인생샷 찍으실 분 구해요!',
        unreadChat: 2,
        userIcon: '',
    },
];
