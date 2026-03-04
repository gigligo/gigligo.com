import React from 'react';
import Image from 'next/image';

export function Logo({
    className = "h-8",
    variant = 'dark',
}: {
    className?: string;
    variant?: 'dark' | 'white';
}) {
    return (
        <Image
            src={variant === 'white' ? '/logo-white.svg' : '/logo.svg'}
            alt="GIGLIGO"
            width={200}
            height={50}
            className={`${className} w-auto object-contain`}
            priority
        />
    );
}
