import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function SelectArea() {
    return (
        <>
            <Select>
                <SelectTrigger className="w-auto">
                    <SelectValue placeholder="지역 선택" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>지역</SelectLabel>
                        <SelectItem value="seoul">서울특별시</SelectItem>
                        <SelectItem value="busan">부산광역시</SelectItem>
                        <SelectItem value="incheon">인천광역시</SelectItem>
                        <SelectItem value="daegu">대구광역시</SelectItem>
                        <SelectItem value="gwangju">광주광역시</SelectItem>
                        <SelectItem value="daejeon">대전광역시</SelectItem>
                        <SelectItem value="ulsan">울산광역시</SelectItem>
                        <SelectItem value="sejong">세종특별자치시</SelectItem>
                        <SelectItem value="gyeonggi">경기도</SelectItem>
                        <SelectItem value="gangwon">강원도</SelectItem>
                        <SelectItem value="chungbuk">충청북도</SelectItem>
                        <SelectItem value="chungnam">충청남도</SelectItem>
                        <SelectItem value="jeonbuk">전라북도</SelectItem>
                        <SelectItem value="jeonnam">전라남도</SelectItem>
                        <SelectItem value="gyeongbuk">경상북도</SelectItem>
                        <SelectItem value="gyeongnam">경상남도</SelectItem>
                        <SelectItem value="jeju">제주특별자치도</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    );
}
