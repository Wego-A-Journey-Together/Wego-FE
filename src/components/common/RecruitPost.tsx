import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Image from 'next/image';

export default function RecruitPost() {
    const isRecruitOpen = true;
    const hashtags = [
        { text: '#제주도' },
        { text: '#무계획' },
        { text: '#먹방여행' },
    ];

    return (
        <article className="flex flex-col gap-2.5 px-[34px] py-[30px] bg-[#f5f6f7] rounded-xl">
            {/* 헤더 섹션 */}
            <header className="flex flex-col w-full">
                <div className="flex items-center gap-2 w-full mb-2">
                    <span
                        className={`${isRecruitOpen ? 'bg-[#fa9b56]' : 'bg-[#999999]'} text-white rounded-[20px] px-3 py-1 text-xs font-semibold`}
                    >
                        {isRecruitOpen ? '동행 구함' : '모집 마감'}
                    </span>
                    <h1 className="flex-1 font-bold text-black text-xl truncate">
                        {
                            '3/22 ~ 3/26 혼여예정이에요. 서귀동 동행하실 분 구해요'
                        }
                    </h1>
                </div>

                {/* 모집 정보 */}
                <div className="flex items-center gap-2.5 mb-3.5">
                    <span className="text-sm text-[#333333]">
                        {'25.03.24 - 25.03.24 (0일)'}
                    </span>
                    <div className="h-1.5 w-px bg-gray-300" />
                    <span className="text-sm text-[#333333]">
                        {'나이 무관'}
                    </span>
                    <div className="h-1.5 w-px bg-gray-300" />
                    <span className="text-sm text-[#333333]">{'여자'}</span>
                    <div className="h-1.5 w-px bg-gray-300" />
                    <span>
                        <span className="text-sm text-[#999999]">{'0명'} </span>
                        <span className="text-sm text-[#333333]">
                            / {'1명'}
                        </span>
                    </span>
                </div>

                {/* 해시태그 리스트 */}
                <ul className="flex items-center gap-2 mb-[22px]">
                    {hashtags.map((hashtag, index) => (
                        <li
                            key={index}
                            className="relative px-1.5 py-1 rounded"
                        >
                            <div className="font-medium text-bg-sky-blue text-[15px] tracking-[0.47px] leading-[19.1px] whitespace-nowrap z-10">
                                {hashtag.text}
                            </div>
                            <div className="absolute w-full h-[27px] top-0 left-0 bg-sky-blue rounded opacity-[0.08]" />
                        </li>
                    ))}
                </ul>

                {/* 본문 미리보기 */}
                <p className="w-full h-[62px] font-normal text-[#333333] text-base leading-[20.8px] overflow-hidden mb-3.5">
                    {
                        '처음 혼자 여행하는데 계속 혼자 돌아다니면 심심할 것 같아서 같이 재미있게 여행다니실 분 구합니다. 아직 여행계획은 없는 상태이지만 성산쪽으로 구경하고 싶어요. 운전 가능합니다. 제가 먹는걸 좋아해서 먹는 걸 좋아하는 분이랑'
                    }
                </p>
            </header>

            <hr className="w-full h-px border-0 bg-gray-200 mb-3.5" />

            {/* 유저 프로필 */}
            <section className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4 md:gap-2">
                {/* 아이콘 */}
                <div className="flex items-center gap-3">
                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                        <Image
                            src={'/image/dogProfile.png'}
                            alt="유저 프로필 이미지"
                            width={50}
                            height={50}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* 유저 정보 */}
                    <div className="flex flex-col w-[187px] items-start gap-1.5">
                        <div className="w-full font-semibold text-black text-[15px]">
                            {'사용자아이디'}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#e5e8ea] rounded-[24.53px]">
                            <span className="text-[#666666] text-xs">
                                {'간단 상태 메세지'}
                            </span>
                            <div className="h-1.5 w-px bg-gray-300" />
                            <span className="text-[#666666] text-xs">
                                {'20대'}
                            </span>
                            <div className="h-1.5 w-px bg-gray-300" />
                            <span className="text-[#666666] text-xs">
                                {'여자'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 상호작용 버튼 */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button
                        variant="outline"
                        className="flex items-center gap-1.5 px-[30px] py-2 bg-white rounded-lg flex-1 md:flex-none"
                    >
                        <Heart />
                        <span className="font-semibold">찜하기</span>
                    </Button>
                    <Button className="flex items-center gap-2.5 px-[30px] py-2 bg-sky-blue rounded-lg flex-1">
                        <span className="font-semibold text-white text-sm leading-[21px]">
                            동행하기
                        </span>
                    </Button>
                </div>
            </section>
        </article>
    );
}
