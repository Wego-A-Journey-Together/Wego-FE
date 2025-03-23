'use client';

import { cn } from '@/lib/utils';
import { addDays, addMonths, format, startOfWeek, subMonths } from 'date-fns';
import { endOfWeek, isSameDay, isSameMonth } from 'date-fns';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '../ui/button';

// 요일 표시 컴포넌트
const RenderDays = () => {
    const date = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = date.map((day, i) => (
        <div className="text-center text-sm font-medium" key={i}>
            {day}
        </div>
    ));

    return (
        <div className="mb-4 grid w-full grid-cols-7 items-center pb-2">
            {days}
        </div>
    );
};

interface RenderCellsProps {
    currentMonth: Date;
    selectedStartDate: Date | null;
    selectedEndDate: Date | null;
    onDateClick: (day: Date) => void;
}

// 달력의 날짜 표시
const RenderCells = ({
    currentMonth,
    selectedStartDate,
    selectedEndDate,
    onDateClick,
}: RenderCellsProps) => {
    // 현재 월의 시작일과 종료일 계산
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

    // 날짜 배열 생성 (시작일부터 종료일까지)
    const getDaysArray = () => {
        const daysArray = [];
        let currentDay = startDate;

        while (currentDay <= endDate) {
            daysArray.push(new Date(currentDay));
            currentDay = addDays(currentDay, 1);
        }

        return daysArray;
    };

    // 날짜 배열을 주 단위로 분할
    const getWeeksArray = () => {
        const days = getDaysArray();
        const weeks = [];

        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }

        return weeks;
    };

    // 주 단위로 렌더링
    return (
        <div className="w-full">
            {getWeeksArray().map((week, weekIndex) => (
                <div
                    className="mb-2 grid w-full grid-cols-7"
                    key={`week-${weekIndex}`}
                >
                    {week.map((day, dayIndex) => {
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

// 달력 헤더 컴포넌트 - 월과 연도 표시
const RenderHeader = ({ currentMonth }: { currentMonth: Date }) => {
    return (
        <div className="mb-2 flex items-center justify-between font-bold">
            {currentMonth.toLocaleString('en-US', { month: 'long' })}{' '}
            {format(currentMonth, 'yyyy')}
        </div>
    );
};

// 메인 스크롤 캘린더 컴포넌트
export const ScrollCalender = () => {
    const currentDate = new Date();
    // 날짜 선택 상태 관리
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
        null,
    );
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

    // 날짜 범위 제한 설정 (현재 날짜 기준 1년 전후)
    const minDate = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        1,
    );

    const maxDate = new Date(
        currentDate.getFullYear() + 1,
        currentDate.getMonth() + 1,
        0,
    );

    // 로딩 단계 추적 (0: 초기, 1: 6개월 로드됨, 2: 전체 로드됨)
    const loadingStage = useRef(0);

    // 화면에 표시할 월 목록 - 초기에는 이전 달, 현재 달, 다음 달 로드
    const [visibleMonths, setVisibleMonths] = useState<Date[]>(() => {
        return [
            subMonths(currentDate, 1),
            new Date(currentDate),
            addMonths(currentDate, 1),
        ];
    });

    // DOM 요소 참조
    const calendarRef = useRef<HTMLDivElement>(null);
    const monthRef = useRef<HTMLDivElement>(null);
    const prevScrollPosition = useRef(0);
    const isInitialRender = useRef(true);
    const isLoadingMonths = useRef(false);

    // 날짜 클릭 처리 함수
    const handleDateClick = useCallback(
        (day: Date) => {
            if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
                // 새로운 선택 시작
                setSelectedStartDate(day);
                setSelectedEndDate(null);
            } else {
                // 선택 완료
                if (day < selectedStartDate) {
                    // 선택한 날짜가 시작일보다 이전이면 순서 변경
                    setSelectedEndDate(selectedStartDate);
                    setSelectedStartDate(day);
                } else {
                    setSelectedEndDate(day);
                }
            }
        },
        [selectedStartDate, selectedEndDate],
    );

    // 선택한 날짜 범위를 적용
    const applyDateRange = useCallback(() => {
        if (selectedStartDate) {
            const startDateStr = format(selectedStartDate, 'yyyy-MM-dd');

            if (selectedEndDate) {
                const endDateStr = format(selectedEndDate, 'yyyy-MM-dd');
                alert(`선택한 날짜 범위: ${startDateStr} ~ ${endDateStr}`);
            } else {
                alert(`선택한 날짜: ${startDateStr}`);
            }
        } else {
            alert('날짜를 선택해주세요.');
        }
    }, [selectedStartDate, selectedEndDate]);

    // 선택 초기화 함수
    const resetSelection = useCallback(() => {
        setSelectedStartDate(null);
        setSelectedEndDate(null);
    }, []);

    // 이전 6개월 로드 함수
    const loadPreviousMonths = useCallback(() => {
        if (isLoadingMonths.current) return;
        isLoadingMonths.current = true;

        const firstMonth = new Date(visibleMonths[0]);
        const months: Date[] = [];

        // 로딩 단계에 따라 다른 개수의 월 로드
        if (loadingStage.current === 0) {
            // 첫 번째 스크롤: 6개월 로드
            for (let i = 1; i <= 6; i++) {
                const prevMonth = subMonths(firstMonth, i);

                // 최소 날짜 제한 확인
                if (prevMonth.getTime() >= minDate.getTime()) {
                    months.unshift(new Date(prevMonth));
                } else {
                    // 이미 최소 날짜에 도달했으면 모든 단계 완료
                    loadingStage.current = 2;
                    break;
                }
            }

            // 6개월을 모두 로드했으면 다음 단계로
            if (months.length === 6) {
                loadingStage.current = 1;
            }
        } else if (loadingStage.current === 1) {
            // 두 번째 스크롤: 최소 날짜까지 모든 남은 월 로드
            let tempDate = subMonths(firstMonth, 1);

            while (tempDate.getTime() >= minDate.getTime()) {
                months.unshift(new Date(tempDate));
                tempDate = subMonths(tempDate, 1);
            }

            // 모든 월 로드 완료
            loadingStage.current = 2;
        }

        if (months.length > 0) {
            // 현재 스크롤 위치와 높이 저장
            const currentScrollTop = calendarRef.current?.scrollTop || 0;
            const currentHeight = calendarRef.current?.scrollHeight || 0;

            setVisibleMonths((prev) => [...months, ...prev]);

            // DOM 업데이트 후 스크롤 위치 조정
            setTimeout(() => {
                if (calendarRef.current) {
                    const newHeight = calendarRef.current.scrollHeight;
                    const heightDiff = newHeight - currentHeight;
                    calendarRef.current.scrollTop =
                        currentScrollTop + heightDiff;
                }
                isLoadingMonths.current = false;
            }, 50);
        } else {
            isLoadingMonths.current = false;
        }
    }, [visibleMonths, minDate]);

    // 스크롤 처리 함수 - 이전 달과 다음 달 동적으로 로드
    const handleScroll = useCallback(() => {
        if (!calendarRef.current || isLoadingMonths.current) return;

        const { scrollTop, scrollHeight, clientHeight } = calendarRef.current;
        const isScrollingUp = scrollTop < prevScrollPosition.current;
        prevScrollPosition.current = scrollTop;

        // 상단 근처 - 이전 달 로드 (단계에 따라 다른 양 로드)
        if (scrollTop < 100 && isScrollingUp && loadingStage.current < 2) {
            loadPreviousMonths();
        }

        // 하단 근처 - 다음 달 로드 (최대 날짜 제한 확인)
        if (scrollHeight - scrollTop - clientHeight < 100 && !isScrollingUp) {
            const lastMonth = new Date(visibleMonths[visibleMonths.length - 1]);
            const nextMonth = addMonths(lastMonth, 1);

            // 다음 달이 최대 날짜보다 이후인지 확인
            const nextMonthEnd = endOfMonth(nextMonth);
            if (nextMonthEnd.getTime() <= maxDate.getTime()) {
                setVisibleMonths((prev) => {
                    // 이미 해당 월이 있는지 확인
                    if (prev.some((m) => isSameMonth(m, nextMonth))) {
                        return prev;
                    }
                    return [...prev, nextMonth];
                });
            }
        }
    }, [visibleMonths, maxDate, loadPreviousMonths]);

    // 초기 렌더링 시 현재 월로 스크롤
    useEffect(() => {
        if (isInitialRender.current && monthRef.current !== null) {
            // 약간의 지연을 두어 렌더링이 완료된 후 스크롤
            setTimeout(() => {
                if (monthRef.current !== null) {
                    monthRef.current.scrollIntoView({ behavior: 'auto' });
                    isInitialRender.current = false;
                }
            }, 50);
        }
    }, [visibleMonths]);

    // 스크롤 이벤트 리스너 설정
    useEffect(() => {
        const calendarElement = calendarRef.current;
        if (calendarElement) {
            calendarElement.addEventListener('scroll', handleScroll);
            return () => {
                calendarElement.removeEventListener('scroll', handleScroll);
            };
        }
    }, [handleScroll]);

    return (
        <div className="flex h-full w-full flex-col items-center justify-start p-4 font-sans">
            {/* 요일 표시 영역 */}
            <RenderDays />
            {/* 스크롤 영역 */}
            <div
                ref={calendarRef}
                className="scrollbar-hide flex h-[300px] w-full flex-col overflow-y-auto"
            >
                {visibleMonths.map((month, index) => (
                    <div
                        className="mb-8 w-full opacity-100 transition-opacity"
                        key={`${month.getFullYear()}-${month.getMonth()}-${index}`}
                        ref={isSameMonth(month, currentDate) ? monthRef : null}
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
            {/* 버튼 영역 */}
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
