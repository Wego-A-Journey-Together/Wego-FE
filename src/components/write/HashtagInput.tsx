'use client';

import { KeyboardEvent, useState } from 'react';

type Props = {
    value: string[];
    onChange: (tags: string[]) => void;
    id: string;
};

export default function HashtagInput({ value, onChange, id }: Props) {
    const [input, setInput] = useState('');

    const addTag = (tag: string) => {
        const cleaned = tag.trim();
        const isValid = /^#[^\s#]{1,19}$/.test(cleaned);

        if (isValid && !value.includes(cleaned)) {
            if (value.length >= 5) return; // 5개 제한
            onChange([...value, cleaned]);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            addTag(input);
            setInput('');
        }
    };

    const removeTag = (tag: string) => {
        onChange(value.filter((t) => t !== tag));
    };

    return (
        <div className="flex h-12 flex-wrap items-center gap-2 rounded-md border py-2 pr-1 pl-3">
            {value.map((tag) => (
                <div
                    key={tag}
                    className="text-sky-blue flex items-center gap-1 rounded-sm bg-sky-100 px-3 py-1 text-sm"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 cursor-pointer text-rose-300 hover:text-rose-400"
                    >
                        ×
                    </button>
                </div>
            ))}
            {value.length < 5 && (
                <input
                    id={id}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="#해시태그"
                    className="flex-1 border-none bg-transparent outline-none"
                />
            )}
        </div>
    );
}
