import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const badgeVariants = cva(
    'inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden',
    {
        variants: {
            variant: {
                // 피그마 디자인대로 기본 변경했습니다. (동행 모집)
                default:
                    'rounded-full border-none bg-[#fa9b56] px-3 py-1 text-xs font-semibold text-white',
                // 비활성화(모집 마감) 색상입니다.
                disable:
                    'rounded-full border-none bg-[#999999] px-3 py-1 text-xs font-semibold text-white',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
                destructive:
                    'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70',
                outline:
                    'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

function Badge({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<'span'> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'span';

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
