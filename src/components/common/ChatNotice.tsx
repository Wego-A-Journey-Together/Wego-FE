'use client';

/** #P101 성능: 정적 컴포넌트이므로 React.memo 적용 검토 필요 */
export default function ChatNotice() {
    /** #A102 접근성: 공지사항에 대한 ARIA 레이블과 역할 추가 필요 */
    return (
        <div className="flex h-full items-center justify-center">
            <div className="max-w-[368px] rounded-xl bg-[#f9f9f9] p-5">
                <h3 className="mb-[30px] text-center text-lg font-semibold text-[#333333]">
                    🎁 동행 찾기를 위한 TIP 🎁
                </h3>
                <h4 className="mb-5 text-center text-base font-semibold text-[#333333]">
                    여행 스타일을 파악할 수 있게 자기소개를 나눠보세요
                </h4>
                {/* 메세지 없는 경우에만 출력 */}
                <p className="text-center text-sm leading-[18.2px] text-[#333333]">
                    ex) 안녕하세요! 20대 중반 직장인입니다.
                    <br />
                    뭐든지 잘 먹어서 저랑 함께하지면
                    <br />
                    여러 메뉴를 드셔보실 수 있으실 겁니다.
                    <br />
                    친화력도 엄청 좋은 ENFP이니 걱정말고
                    <br />
                    여행을 같이 즐겨봐요!
                </p>
            </div>
        </div>
    );
}
