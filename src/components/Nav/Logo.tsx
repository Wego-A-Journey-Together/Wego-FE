import Link from 'next/link';

export default function Logo() {
    return (
        <div className="flex items-center">
            <Link
                href="/"
                className={`text-sky-blue text-4xl font-semibold leading-none font-orienta`}
            >
                Wego
            </Link>
        </div>
    );
}
