import Link from 'next/link';

export default function Logo() {
    return (
        <div className="flex items-center">
            <Link
                href="/"
                className={`text-sky-blue font-orienta text-2xl leading-none [-webkit-text-stroke:1.1px_#0ac7e4] sm:text-3xl`}
            >
                Wego
            </Link>
        </div>
    );
}
