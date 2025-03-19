import OptimisticUpdateLikes from '@/components/Btn/OptimisticUpdateLikes';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

//todo : 현재는 낙관적 업데이트를 위한 단순한 id 만 정의 (데이터 바인딩 x )
interface RecruitPostProps {
    id: number;
}

export default function RecruitPost({ id }: RecruitPostProps) {
    const isRecruitOpen = true;
    const hashtags = [
        { text: '#제주도' },
        { text: '#무계획' },
        { text: '#먹방여행' },
    ];

    return (
        <article className="flex flex-col gap-2.5 rounded-xl bg-[#f5f6f7] px-[34px] py-[30px]">
            {/* 헤더 섹션 */}
            <header className="flex w-full flex-col">
                <div className="mb-2 flex w-full items-center gap-2">
                    <span
                        className={`${isRecruitOpen ? 'bg-[#fa9b56]' : 'bg-[#999999]'} rounded-[20px] px-3 py-1 text-xs font-semibold text-white`}
                    >
                        {isRecruitOpen ? '동행 구함' : '모집 마감'}
                    </span>
                    <h1 className="flex-1 truncate text-xl font-bold text-black">
                        {
                            '3/22 ~ 3/26 혼여예정이에요. 서귀동 동행하실 분 구해요'
                        }
                    </h1>
                </div>

                {/* 모집 정보 */}
                <div className="mb-3.5 flex items-center gap-2.5">
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
                <ul className="mb-[22px] flex items-center gap-2">
                    {hashtags.map((hashtag, index) => (
                        <li
                            key={index}
                            className="relative rounded px-1.5 py-1"
                        >
                            <div className="text-bg-sky-blue z-10 text-[15px] leading-[19.1px] font-medium tracking-[0.47px] whitespace-nowrap">
                                {hashtag.text}
                            </div>
                            <div className="bg-sky-blue absolute top-0 left-0 h-[27px] w-full rounded opacity-[0.08]" />
                        </li>
                    ))}
                </ul>

                {/* 본문 미리보기 */}
                <p className="mb-3.5 h-[62px] w-full overflow-hidden text-base leading-[20.8px] font-normal text-[#333333]">
                    {
                        '처음 혼자 여행하는데 계속 혼자 돌아다니면 심심할 것 같아서 같이 재미있게 여행다니실 분 구합니다. 아직 여행계획은 없는 상태이지만 성산쪽으로 구경하고 싶어요. 운전 가능합니다. 제가 먹는걸 좋아해서 먹는 걸 좋아하는 분이랑'
                    }
                </p>
            </header>

            <hr className="mb-3.5 h-px w-full border-0 bg-gray-200" />

            {/* 유저 프로필 */}
            <section className="flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-2">
                {/* 아이콘 */}
                <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                        <Image
                            src={'/image/dogProfile.png'}
                            alt="유저 프로필 이미지"
                            width={50}
                            height={50}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* 유저 정보 */}
                    <div className="flex w-[187px] flex-col items-start gap-1.5">
                        <div className="w-full text-[15px] font-semibold text-black">
                            {'사용자아이디'}
                        </div>
                        <div className="flex items-center gap-2 rounded-[24.53px] bg-[#e5e8ea] px-3 py-1.5">
                            <span className="text-xs text-[#666666]">
                                {'간단 상태 메세지'}
                            </span>
                            <div className="h-1.5 w-px bg-gray-300" />
                            <span className="text-xs text-[#666666]">
                                {'20대'}
                            </span>
                            <div className="h-1.5 w-px bg-gray-300" />
                            <span className="text-xs text-[#666666]">
                                {'여자'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 상호작용 버튼 */}
                <div className="flex w-full items-center gap-2 md:w-auto">
                    {/*낙관적 업데이트 찜 버튼*/}
                    <OptimisticUpdateLikes id={id} />
                    <Button className="bg-sky-blue flex flex-1 items-center gap-2.5 rounded-lg px-[30px] py-2">
                        <span className="text-sm leading-[21px] font-semibold text-white">
                            동행하기
                        </span>
                    </Button>
                </div>
            </section>
        </article>
    );
}
