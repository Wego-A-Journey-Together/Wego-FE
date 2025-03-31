'use client';

import { cn } from '@/lib/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import * as React from 'react';

interface CheckboxProps
    extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
    iconSize?: string;
    checkIconStrokeWidth?: number;
}

function Checkbox({
    iconSize,
    checkIconStrokeWidth = 4, // 체크박스 두께 조정
    className,
    ...props
}: CheckboxProps) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                'peer border-input dark:bg-input/30 data-[state=checked]:bg-sky-blue data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-sky-blue data-[state=checked]:border-sky-blue focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border bg-white shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="flex items-center justify-center text-current transition-none"
            >
                <CheckIcon
                    className={cn('size-4', iconSize)}
                    strokeWidth={checkIconStrokeWidth}
                />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { Checkbox };
