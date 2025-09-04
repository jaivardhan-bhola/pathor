import React from 'react';
import clsx from 'clsx';

const base = 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
    default: 'bg-neutral-900 text-white hover:bg-neutral-800',
    outline: 'border border-neutral-300 hover:bg-neutral-100',
    ghost: 'hover:bg-neutral-100',
    destructive: 'bg-red-600 text-white hover:bg-red-500',
};

export const Button = React.forwardRef(function Button({ variant = 'default', className, ...props }, ref) {
    return <button ref={ref} className={clsx(base, variants[variant], className, 'h-10 px-4 py-2')} {...props} />;
});
