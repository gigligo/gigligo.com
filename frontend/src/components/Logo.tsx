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
            width={340}
            height={90}
            className={className}
            priority
        />
    );
}
