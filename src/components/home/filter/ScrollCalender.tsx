'use client';

import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDateAction } from '@/redux/slices/filterSlice';
import {
    addDays,
    addMonths,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    startOfMonth,
    startOfWeek,
    subMonths,
} from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '../../ui/button';

// 요일 표시 컴포넌트 - 간결하게 변경
const RenderDays = () => (
    <div className="mb-4 grid w-full grid-cols-7 items-center pb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <div className="text-center text-sm font-medium" key={i}>
                {day}
            </div>
        ))}
    </div>
);

// 달력 헤더 컴포넌트 - 월과 연도 표시
const RenderHeader = ({ currentMonth }: { currentMonth: Date }) => (
    <div className="mb-2 flex items-center justify-between font-bold">
        {currentMonth.toLocaleString('en-US', { month: 'long' })}{' '}
        {format(currentMonth, 'yyyy')}
    </div>
);

// 달력의 날짜 표시 컴포넌트
const RenderCells = ({
    currentMonth,
    selectedStartDate,
    selectedEndDate,
    onDateClick,
}: {
    currentMonth: Date;
    selectedStartDate: Date | null;
    selectedEndDate: Date | null;
    onDateClick: (day: Date) => void;
}) => {
    // 날짜 계산 로직 간소화
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    // 날짜가 선택된 범위 내에 있는지 확인
    const isInRange = useCallback(
        (day: Date) => {
            if (!selectedStartDate) return false;
            if (!selectedEndDate) return isSameDay(day, selectedStartDate);
            return (
                (day >= selectedStartDate && day <= selectedEndDate) ||
                (day >= selectedEndDate && day <= selectedStartDate)
            );
        },
        [selectedStartDate, selectedEndDate],
    );

    // 날짜 배열 생성 및 주 단위로 분할 - 함수 간소화
    const getWeeksArray = useCallback(() => {
        const daysArray = [];
        let currentDay = startDate;

        while (currentDay <= endDate) {
            daysArray.push(new Date(currentDay));
            currentDay = addDays(currentDay, 1);
        }

        // 주 단위로 분할
        const weeks = [];
        for (let i = 0; i < daysArray.length; i += 7) {
            weeks.push(daysArray.slice(i, i + 7));
        }
        return weeks;
    }, [startDate, endDate]);

    // 주 단위로 렌더링
    return (
        <div className="w-full">
            {getWeeksArray().map((week, weekIndex) => (
                <div
                    className="mb-2 grid w-full grid-cols-7"
                    key={`week-${weekIndex}`}
                >
                    {week.map((day, dayIndex) => {
                        // 날짜 상태 계산
                        const formattedDate = format(day, 'd');
                        const isSelected =
                            selectedStartDate &&
                            isSameDay(day, selectedStartDate);
                        const isEndDate =
                            selectedEndDate && isSameDay(day, selectedEndDate);
                        const isRangeDate = isInRange(day);
                        const isNotValid =
                            format(currentMonth, 'M') !== format(day, 'M');
                        const isSunday = dayIndex === 0;
                        const isSaturday = dayIndex === 6;

                        return (
                            <div
                                className={cn(
                                    'flex cursor-pointer items-center justify-center py-1 transition-transform hover:scale-105',
                                    isNotValid && 'hover:scale-100',
                                )}
                                key={day.toString()}
                                onClick={() =>
                                    !isNotValid && onDateClick(new Date(day))
                                }
                            >
                                <span
                                    className={cn(
                                        'flex h-8 w-8 items-center justify-center text-center transition-colors',
                                        isNotValid && 'text-gray-300',
                                        isSunday &&
                                            !isNotValid &&
                                            'text-red-500',
                                        isSaturday &&
                                            !isNotValid &&
                                            'text-blue-500',
                                        isSelected &&
                                            'rounded-full bg-blue-500 text-white',
                                        isEndDate &&
                                            'rounded-full bg-blue-500 text-white',
                                        isRangeDate &&
                                            !isSelected &&
                                            !isEndDate &&
                                            'rounded-full bg-blue-100',
                                    )}
                                >
                                    {formattedDate}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

// 메인 스크롤 캘린더 컴포넌트
export const ScrollCalender = () => {
    const currentDate = useMemo(() => new Date(), []);
    const dispatch = useAppDispatch();
    const serializedDate = useAppSelector((state) => state.filter.date);

    // Redux 상태에서 날짜 정보 가져오기
    const selectedStartDate = useMemo(
        () => (serializedDate?.from ? new Date(serializedDate.from) : null),
        [serializedDate?.from],
    );

    const selectedEndDate = useMemo(
        () => (serializedDate?.to ? new Date(serializedDate.to) : null),
        [serializedDate?.to],
    );

    // 날짜 범위 제한 설정
    const minDate = useMemo(
        () =>
            new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1),
        [currentDate],
    );

    const maxDate = useMemo(
        () =>
            new Date(
                currentDate.getFullYear() + 1,
                currentDate.getMonth() + 1,
                0,
            ),
        [currentDate],
    );

    // 상태 및 참조 변수 - 초기화 로직 간소화
    const [visibleMonths, setVisibleMonths] = useState<Date[]>(() => [
        subMonths(currentDate, 1),
        new Date(currentDate),
        addMonths(currentDate, 1),
    ]);

    // Refs 통합 선언
    const refs = {
        loadingStage: useRef(0),
        calendar: useRef<HTMLDivElement>(null),
        month: useRef<HTMLDivElement>(null),
        prevScrollPosition: useRef(0),
        isInitialRender: useRef(true),
        isLoadingMonths: useRef(false),
    };

    // 날짜 클릭 처리 함수
    const handleDateClick = useCallback(
        (day: Date) => {
            if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
                dispatch(setDateAction({ from: day, to: undefined }));
            } else {
                dispatch(
                    setDateAction({
                        from: day < selectedStartDate ? day : selectedStartDate,
                        to: day < selectedStartDate ? selectedStartDate : day,
                    }),
                );
            }
        },
        [selectedStartDate, selectedEndDate, dispatch],
    );

    // 선택한 날짜 범위를 적용
    const applyDateRange = useCallback(() => {
        if (selectedStartDate) {
            const startDateStr = format(selectedStartDate, 'yyyy-MM-dd');
            const message = selectedEndDate
                ? `선택한 날짜 범위: ${startDateStr} ~ ${format(selectedEndDate, 'yyyy-MM-dd')}`
                : `선택한 날짜: ${startDateStr}`;
            alert(message);
        } else {
            alert('날짜를 선택해주세요.');
        }
    }, [selectedStartDate, selectedEndDate]);

    // 선택 초기화 함수
    const resetSelection = useCallback(() => {
        dispatch(setDateAction(undefined));
    }, [dispatch]);

    // 이전 월 로드 함수
    const loadPreviousMonths = useCallback(() => {
        if (refs.isLoadingMonths.current) return;
        refs.isLoadingMonths.current = true;

        const firstMonth = new Date(visibleMonths[0]);
        const months: Date[] = [];

        // 로딩 단계에 따라 다른 개수의 월 로드
        if (refs.loadingStage.current === 0) {
            // 첫 번째 스크롤: 6개월 로드
            for (let i = 1; i <= 6; i++) {
                const prevMonth = subMonths(firstMonth, i);
                if (prevMonth.getTime() >= minDate.getTime()) {
                    months.unshift(new Date(prevMonth));
                } else {
                    refs.loadingStage.current = 2;
                    break;
                }
            }
            if (months.length === 6) refs.loadingStage.current = 1;
        } else if (refs.loadingStage.current === 1) {
            // 두 번째 스크롤: 최소 날짜까지 모든 남은 월 로드
            let tempDate = subMonths(firstMonth, 1);
            while (tempDate.getTime() >= minDate.getTime()) {
                months.unshift(new Date(tempDate));
                tempDate = subMonths(tempDate, 1);
            }
            refs.loadingStage.current = 2;
        }

        if (months.length > 0) {
            // 현재 스크롤 위치와 높이 저장
            const currentScrollTop = refs.calendar.current?.scrollTop || 0;
            const currentHeight = refs.calendar.current?.scrollHeight || 0;

            setVisibleMonths((prev) => [...months, ...prev]);

            // DOM 업데이트 후 스크롤 위치 조정
            setTimeout(() => {
                if (refs.calendar.current) {
                    const newHeight = refs.calendar.current.scrollHeight;
                    refs.calendar.current.scrollTop =
                        currentScrollTop + (newHeight - currentHeight);
                }
                refs.isLoadingMonths.current = false;
            }, 50);
        } else {
            refs.isLoadingMonths.current = false;
        }
    }, [visibleMonths, minDate]);

    // 스크롤 처리 함수
    const handleScroll = useCallback(() => {
        if (!refs.calendar.current || refs.isLoadingMonths.current) return;

        const { scrollTop, scrollHeight, clientHeight } = refs.calendar.current;
        const isScrollingUp = scrollTop < refs.prevScrollPosition.current;
        refs.prevScrollPosition.current = scrollTop;

        // 상단 근처 - 이전 달 로드
        if (scrollTop < 100 && isScrollingUp && refs.loadingStage.current < 2) {
            loadPreviousMonths();
        }

        // 하단 근처 - 다음 달 로드
        if (scrollHeight - scrollTop - clientHeight < 100 && !isScrollingUp) {
            const lastMonth = new Date(visibleMonths[visibleMonths.length - 1]);
            const nextMonth = addMonths(lastMonth, 1);

            if (endOfMonth(nextMonth).getTime() <= maxDate.getTime()) {
                setVisibleMonths((prev) =>
                    prev.some((m) => isSameMonth(m, nextMonth))
                        ? prev
                        : [...prev, nextMonth],
                );
            }
        }
    }, [visibleMonths, maxDate, loadPreviousMonths]);

    // 초기 렌더링 시 현재 월로 스크롤
    useEffect(() => {
        if (refs.isInitialRender.current && refs.month.current !== null) {
            setTimeout(() => {
                refs.month.current?.scrollIntoView({ behavior: 'auto' });
                refs.isInitialRender.current = false;
            }, 50);
        }
    }, [visibleMonths]);

    // 스크롤 이벤트 리스너 설정
    useEffect(() => {
        const calendarElement = refs.calendar.current;
        if (calendarElement) {
            calendarElement.addEventListener('scroll', handleScroll);
            return () =>
                calendarElement.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    return (
        <div className="flex h-full w-full flex-col items-center justify-start p-4 font-sans">
            <RenderDays />
            <div
                ref={refs.calendar}
                className="scrollbar-hide flex h-[300px] w-full flex-col overflow-y-auto"
            >
                {visibleMonths.map((month, index) => (
                    <div
                        className="mb-8 w-full opacity-100 transition-opacity"
                        key={`${month.getFullYear()}-${month.getMonth()}-${index}`}
                        ref={
                            isSameMonth(month, currentDate) ? refs.month : null
                        }
                    >
                        <RenderHeader currentMonth={month} />
                        <RenderCells
                            currentMonth={month}
                            selectedStartDate={selectedStartDate}
                            selectedEndDate={selectedEndDate}
                            onDateClick={handleDateClick}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-4 flex w-full justify-center gap-2">
                <Button
                    variant="outline"
                    onClick={resetSelection}
                    className="transition-transform hover:scale-105 active:scale-95"
                >
                    초기화
                </Button>
                <Button
                    variant={selectedStartDate ? 'default' : 'ghost'}
                    onClick={applyDateRange}
                    className="transition-transform hover:scale-105 active:scale-95"
                >
                    적용
                </Button>
            </div>
        </div>
    );
};

export default ScrollCalender;
