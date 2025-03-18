import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    // SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function SortDateSelect() {
    return (
        <div className="ml-auto">
            <Select>
                <SelectTrigger className="w-auto">
                    <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {/* <SelectLabel>정렬</SelectLabel> */}
                        <SelectItem value="recent">최신순</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
