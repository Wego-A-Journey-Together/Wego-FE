'use client';

import Tab from '@/components/common/Tab';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';
import { useState } from 'react';

export default function DropDown({ name }: { name: string }) {
    const dropDownOptions = [
        { id: 'journey', label: '의 동행' },
        { id: 'sogam', label: '동행 소감' },
    ] as const;

    const tabOptions = [
        {
            id: 'journey',
            label: [
                '참여중인 동행',
                '참여 종료된 동행',
                '내 동행',
                '작성 댓글',
            ],
        },
        {
            id: 'sogam',
            label: ['받은 소감', '작성 가능한 소감', '내가 작성한 소감'],
        },
    ];

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const [selectOption, setSelectOption] = useState<
        (typeof dropDownOptions)[number]
    >(dropDownOptions[0]);

    const DropDownContents = dropDownOptions.filter(
        (option) => option.id !== selectOption.id,
    );

    const handleClick = (option: (typeof dropDownOptions)[number]) => {
        setSelectOption(option);
        setIsPopoverOpen(false);
        setSelectedTabIndex(0);
    };

    const getDisplayText = (option: (typeof dropDownOptions)[number]) => {
        return option.id === 'journey' ? name + option.label : option.label;
    };
    //---------------------------------------------------------
    //탭 관련 로직
    //---------------------------------------------------------
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const currentTabItems =
        tabOptions.find((option) => option.id === selectOption.id)?.label || [];
    const currentSelectedTab = currentTabItems[selectedTabIndex];
    const handleTabChange = (index: number) => {
        setSelectedTabIndex(index);
    };

    return (
        <>
            <div className="mb-10 flex w-full items-center gap-2.5">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <div className="flex items-center gap-2.5">
                        {/*드롭다운 섹션 ( 동행,동행 소감, 받은 소감 )*/}
                        <h2 className="w-40 text-2xl font-bold">
                            {getDisplayText(selectOption)}
                        </h2>{' '}
                        <PopoverTrigger>
                            {' '}
                            <Image
                                width={18}
                                height={18}
                                alt="dropdown icon"
                                src="/icon/profile/dropDown.svg"
                                className="cursor-pointer"
                            />
                        </PopoverTrigger>
                    </div>

                    <PopoverContent
                        className="mt-2 mr-5 w-40 gap-3 p-0"
                        align="end"
                        alignOffset={0}
                        sideOffset={5}
                    >
                        {DropDownContents.map((option, idx) => {
                            return (
                                <p
                                    key={'key' + idx}
                                    className="hover:text-sky-blue cursor-pointer text-center text-2xl font-bold transition-colors hover:bg-neutral-100"
                                    onClick={() => handleClick(option)}
                                >
                                    {getDisplayText(option)}
                                </p>
                            );
                        })}
                    </PopoverContent>
                </Popover>
            </div>
            <section
                className={`sticky top-18 z-50 border-b border-b-[#AAAAAAA]`}
            >
                <Tab
                    tabItems={currentTabItems}
                    selectedTab={currentSelectedTab}
                    onChange={handleTabChange}
                    className={'leading-relaxed'}
                />
            </section>
        </>
    );
}
