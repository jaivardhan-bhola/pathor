import * as React from 'react';
import clsx from 'clsx';

export const Input = React.forwardRef(function Input({ className, type = 'text', ...props }, ref) {
    return (
        <input
            type={type}
            ref={ref}
            className={clsx('flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-50', className)}
            {...props}
        />
    );
});
