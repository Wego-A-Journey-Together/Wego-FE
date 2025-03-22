//todo : 지워야 합니다.
const trendingPost = [
    {
        id: 1,
        title: '제주도 동행 구합니다',
        content:
            '3월 10일부터 12일까지 제주도 여행 갈 예정입니다! 렌트카로 제주도 일주하면서 맛집 탐방하고 올레길도 걸어보고 싶어요. 숙소는 서귀포시 근처 게스트하우스 생각 중이에요. 같이 즐거운 추억 만드실 20대 여성분 구합니다! 편하게 연락주세요 😊',
        imageSrc: '/image/jejuGirl.png', // 기본 이미지
        profileImage: '/image/userIcon.png',
        userName: '김동키',
        statusMessage: '혼여행러',
        rating: 5.0,

        reviewCount: 29,
        age: '20대',
        gender: '여자',
        startDate: '25.03.10',
        endDate: '25.03.12',
        userId: 'dongki',
        view: 234,
        bookMark: 3,
        commentCount: 3,
        location: '제주도 서귀포시 중문동',
        category: '친구 동행',
        groupScale: '2인',
        ageRange: '20대 - 30대',
        preferredGender: '여',
        maxMembers: 4,
        currentMembers: 1,
        hashtags: ['제주도', '맛집투어', '올레길', '렌트카'],
    },
    {
        id: 2,
        title: '3/22~3/26 서울 맛집 탐방',
        content:
            '서울 맛집 투어 하실 분 구해요! 3월 25-26일 이틀동안 망원동, 연남동, 익선동 맛집 돌아다니면서 맛있는 거 먹고 사진도 찍을 예정입니다. 맛집 탐방에 진심이신 분이면 더 좋아요. 숙소는 홍대 근처 호텔 예약했습니다. 맛있는 추억 만들어요 🍜',
        imageSrc:
            'data:image/jpeg;base64,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', // 기본 이미지
        profileImage: '/image/userIcon.png',
        userName: '백종원',
        statusMessage: '먹방 유튜버',
        rating: 2.3,
        reviewCount: 592,
        age: '40대',
        gender: '남자',
        startDate: '25.03.25',
        endDate: '25.03.26',
        userId: 'baek',
        view: 234,
        bookMark: 3,
        commentCount: 3,
        location: '서울 마포구 망원동',
        category: '맛집 동행',
        groupScale: '10인 이하',
        ageRange: '무관',
        preferredGender: '무관',
        maxMembers: 3,
        currentMembers: 1,
        hashtags: ['맛집투어', '카페투어', '망원동'],
    },
    {
        id: 3,
        title: '강릉 카페 투어 동행',
        content:
            '3월 20일부터 22일까지 강릉 카페투어 가실 분 구합니다! 안목커피거리부터 시작해서 주문진, 정동진 쪽 예쁜 카페들 다니면서 커피도 마시고 사진도 찍을 계획이에요. 카페 투어와 바다 구경을 좋아하시는 분이면 좋겠어요. 숙소는 강릉 시내에서 잡을 예정입니다 ☕️',
        imageSrc: '/data/TemporalBG.png',
        profileImage: '/image/userIcon.png',
        userName: '최카페',
        statusMessage: '카페 블로거',
        rating: 4.5,
        reviewCount: 13,
        age: '20대',
        gender: '여자',
        startDate: '25.03.20',
        endDate: '25.03.22',
        userId: 'choi',

        view: 234,
        bookMark: 3,
        commentCount: 3,
        location: '강원도 강릉시 교동',
        category: '투어 동행',
        groupScale: '2인',
        ageRange: '10대 - 20대',
        preferredGender: '여',
        maxMembers: 4,
        currentMembers: 2,
        hashtags: ['카페투어', '바다', '커피'],
    },
    {
        id: 4,
        title: '부산 여행 같이 가실 분',
        content:
            '3월 15일부터 17일까지 부산 여행 동행 구합니다! 해운대, 광안리, 감천문화마을, 자갈치시장 등 부산 핫플레이스 돌아다닐 예정이에요. 부산 여행이 처음이라 같이 가면 더 재미있을 것 같아요. 숙소는 해운대 근처로 잡았습니다. 즐거운 부산 여행 같이해요 🌊',
        imageSrc: '/image/jejuGirl.png', // 기본 이미지
        profileImage: '/image/userIcon.png',
        userName: '역마살',

        statusMessage: '집이 싫어요',

        rating: 2.3,
        reviewCount: 592,
        age: '30대',
        gender: '남자',
        startDate: '25.03.15',
        endDate: '25.03.17',
        userId: 'hangout',
        view: 234,
        bookMark: 3,
        commentCount: 3,
        location: '부산 해운대구 우동',
        category: '친구 동행',
        groupScale: '10인 이하',
        ageRange: '20대 - 40대',
        preferredGender: '무관',
        maxMembers: 5,
        currentMembers: 1,
        hashtags: [
            '해운대',
            '광안리',
            '감천문화마을',
            '자갈치시장',
            '부산여행',
        ],
    },
    {
        id: 5,
        title: 'props 여행',
        content:
            '4월 1일부터 3일까지 속초 여행 가실 분 구해요! 속초 중앙시장에서 맛있는 것도 먹고, 설악산도 등산하고, 해수욕장도 구경할 계획입니다. 중간중간 예쁜 카페도 들르고 싶어요. 활동적인 여행 좋아하시는 분이면 더 좋을 것 같아요. 숙소는 속초 해수욕장 근처입니다 🏔',
        imageSrc: '/image/jejuGirl.png', // 기본 이미지
        profileImage: '/image/userIcon.png',
        userName: '김드릴',
        statusMessage: '안녕하세요',
        rating: 4.0,
        reviewCount: 2,
        age: '30대',
        gender: '여자',
        startDate: '25.04.01',
        endDate: '25.04.03',
        userId: 'drill',
        view: 234,
        bookMark: 3,
        commentCount: 3,
        location: '강원도 속초시 조양동',
        category: '투어 동행',
        groupScale: '2인',
        ageRange: '30대 - 40대',
        preferredGender: '여',
        maxMembers: 3,
        currentMembers: 1,
        hashtags: ['설악산', '중앙시장'],
    },
];

export default trendingPost;
