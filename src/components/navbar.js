"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import React from 'react';

function NavLink({ href, children }) {
    const pathname = usePathname();
    const active = pathname === href;
    return (
        <Link href={href} className={`text-sm font-medium transition-colors ${active ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'}`}>{children}</Link>
    );
}

export function Navbar() {
    const totalItems = useCartStore(s => s.totalItems());
    return (
        <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/80 backdrop-blur">
            <div className="max-w-7xl mx-auto h-14 px-4 md:px-6 flex items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-base font-semibold tracking-tight">MiniShop</Link>
                    <nav className="hidden sm:flex items-center gap-5">
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/dashboard">Dashboard</NavLink>
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/cart" className="relative">
                        <Button variant="outline" className="h-9 px-4">
                            Cart
                            {totalItems > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center text-xs font-semibold rounded-full bg-neutral-900 text-white h-5 min-w-[1.25rem] px-1">
                                    {totalItems}
                                </span>
                            )}
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
