import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
    {
        variants: {
            variant: {
                // sky-blue 디폴트로 적용해 두겠습니다, 글씨색 디폴트 지정해 두었습니다.
                default: 'bg-sky-blue text-white text-sm hover:bg-sky-blue/90',

                destructive:
                    'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',

                // 디폴트와 유사하게 수정했습니다.
                outline:
                    'border border-input text-[#999999] text-sm bg-background hover:bg-accent',

                // outline에서 선택됐을 때 css입니다.
                selected:
                    'border border-[#333333] text-[#333333] text-sm bg-[#0AC7E4]/8 hover:bg-[#0AC7E4]/12',

                // 회색 버튼
                gray: 'bg-[#F5F6F7] text-[#666666] text-sm hover:bg-[#F5F6F7]/90',

                // 더 어두운 회색 버튼
                darkGray:
                    'bg-[#999999] text-white text-sm hover:bg-[#999999]/90',
                // 초기화 버튼 (하늘색 외곽선)
                reset: 'border-1 border-sky-blue text-sky-blue hover:text-sky-blue hover:bg-sky-blue/10 font-semibold text-[14px]',
                //
                skyblueOutline:
                    'border-1 border-sky-blue text-sky-blue hover:text-sky-blue hover:bg-sky-blue/10 font-semibold text-[14px] bg-background-light',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-9 px-4 py-2 has-[>svg]:px-3',
                sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
                lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
                icon: 'size-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
