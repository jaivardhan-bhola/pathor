import React from 'react';
import clsx from 'clsx';

export function Card({ className, children, ...props }) {
    return (
        <div className={clsx('rounded-lg border bg-white shadow-sm border-neutral-200', className)} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={clsx('p-4 border-b border-neutral-200', className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }) {
    return (
        <h3 className={clsx('font-semibold leading-none tracking-tight', className)} {...props}>
            {children}
        </h3>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={clsx('p-4 space-y-2', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children, ...props }) {
    return (
        <div className={clsx('p-4 border-t border-neutral-200 flex items-center justify-between gap-2', className)} {...props}>
            {children}
        </div>
    );
}
