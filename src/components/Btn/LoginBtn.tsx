import { Button } from '@/components/ui/button';
import { cn } from '@/lib';
import Link from 'next/link';

export default function LoginBtn() {
    return (
        <Button className={cn(`px-7 py-2.5`)}>
            <Link href={`/auth/login`}>로그인 및 회원가입</Link>
        </Button>
    );
}
