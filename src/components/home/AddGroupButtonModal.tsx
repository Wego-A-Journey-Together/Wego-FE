'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    groupName: z.string().min(1, '모임 이름을 입력해주세요'),
    groupLocation: z.string().min(1, '장소를 선택해주세요'),
    groupHeadcount: z.string().min(1, '모집 정원을 입력해주세요'),
    startDate: z.date(),
    endDate: z.date(),
});

export function AddGroupButtonModal() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            groupName: '',
            groupLocation: '',
            groupHeadcount: '',
        },
    });

    function onSubmit() {}

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="ml-auto">
                    모임 만들기
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>모임 만들기</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="groupName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>모임 이름</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="모임 이름을 작성해주세요"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="groupLocation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>장소</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="장소를 입력해주세요."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="groupHeadcount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>모집 정원</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="최소 5인 이상 입력해주세요"
                                            {...field}
                                            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="flex w-1/2 flex-col">
                                    <FormLabel>모임 날짜</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button>
                                                    {field.value ? (
                                                        format(
                                                            field.value,
                                                            'yyyy년 M월 d일',
                                                        )
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem className="flex w-1/2 flex-col">
                                    <FormLabel>마감 날짜</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button>
                                                    {field.value ? (
                                                        format(
                                                            field.value,
                                                            'yyyy년 M월 d일',
                                                        )
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit">저장하기</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
