"use client";

import { Button } from "@/components/ui/button";

// 필요한 데이터 예상 객체입니다.
const userData = {
  userId: "유저아이디",
  userIcon:
    "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
  userStatusMessage: "상태메세지",
  userRating: 4.6, // 유저 평점 평균값
};
const groupData = {
  isGroupOpen: true,
  title: "제주 여행하실 분 모집합니다.",
  image:
    "https://econmingle.com/wp-content/uploads/2024/12/Tourists-on-Jeju-Island-plummet-6-1024x682.jpg",
  content: "본문입니다.",
  location: "제주도",
  recruitStart: "25.03.14.",
  recruitEnd: "25.03.16.",
  numberOfPeople: 0, // 현재 참여 인원수
  maximumMemer: 20, // 모집 정원
};

export default function RecruitPost() {
  return (
    <div className="w-full rounded-lg bg-white">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <section className="flex items-center gap-3">
            {/* 사용자 아이콘 */}
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
              <img
                src={userData.userIcon}
                alt="user icon"
                className="h-full w-full object-cover"
              />
            </div>
            {/* 상태메세지 */}
            <div>
              <h2 className="text-base font-medium">{userData.userId}</h2>
              <h2 className="border-gray-200 text-xs">
                {userData.userStatusMessage}
              </h2>
            </div>
          </section>
          {/* 모집 마감 여부 */}
          <div>
            <h3 className="text-sm text-gray-500">
              {groupData.isGroupOpen ? "모집 중" : "모집 마감"}
            </h3>
          </div>
        </div>

        <section>
          {/* 그룹 모집 타이틀 */}
          <h1 className="mb-1 text-lg font-bold">{groupData.title}</h1>

          {/* Description */}
          <p className="mb-3 text-sm text-gray-700">{groupData.content}</p>

          {/* 여행 세부사항 */}
          <div className="flex items-center text-xs text-gray-700">
            <p className="mr-2">
              {`${groupData.recruitStart} - ${groupData.recruitEnd}`}
            </p>
            <p className="mr-auto">{groupData.location}</p>
            <Button>찜하기</Button>
            <Button>동행하기</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
