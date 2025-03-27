'use client';

import LoginBtn from '@/components/Btn/LoginBtn';
import ThemeToggler from '@/components/ThemeToggler/DarkModeToggler';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib';
import { Menu, X } from 'lucide-react';
import { useRef, useState } from 'react';

export default function Hamburger({ isDarkMode }: { isDarkMode: boolean }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleMenuToggle = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
                <div
                    className="relative cursor-pointer"
                    ref={menuRef}
                    onClick={handleMenuToggle}
                >
                    <Menu
                        className={cn(
                            'h-5 w-5 transition-all duration-300 ease-in-out sm:h-7.5 sm:w-7.5',
                            isMenuOpen
                                ? 'scale-0 rotate-90 opacity-0'
                                : 'scale-100 rotate-0 opacity-100',
                        )}
                    />
                    <X
                        className={cn(
                            'absolute top-0 left-0 h-5 w-5 transition-all duration-300 ease-in-out sm:h-7.5 sm:w-7.5',
                            isMenuOpen
                                ? 'scale-100 rotate-0 opacity-100'
                                : 'scale-0 rotate-90 opacity-0',
                        )}
                    />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-auto">
                <DropdownMenuItem>
                    <LoginBtn />
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <ThemeToggler
                        colorTheme={isDarkMode}
                        className={'mx-auto'}
                    />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
