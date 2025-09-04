"use client";
import { useCartStore } from '@/store/cartStore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import clsx from 'clsx';
import React from 'react';

export default function CartPage() {
    const items = useCartStore(s => s.items);
    const remove = useCartStore(s => s.remove);
    const add = useCartStore(s => s.add);
    const dec = useCartStore(s => s.decrement);
    const clear = useCartStore(s => s.clear);
    const total = useCartStore(s => s.totalPrice());

    const entries = Object.values(items);
    const [status, setStatus] = React.useState('idle');
    const [message, setMessage] = React.useState('');
    const [hydrated, setHydrated] = React.useState(false);
    React.useEffect(() => { setHydrated(true); }, []);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
                    <p className="text-sm text-neutral-600 mt-1">Manage items before checkout.</p>
                </div>
                <Link href="/dashboard" className="text-sm underline">Continue shopping</Link>
            </div>

            {!hydrated && (
                <div className="grid lg:grid-cols-3 gap-8 items-start animate-fade-in">
                    <div className="lg:col-span-2 space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-3">
                                <div className="h-6 w-2/3 skeleton-shimmer rounded" />
                                <div className="h-4 w-1/3 skeleton-shimmer rounded" />
                                <div className="h-24 skeleton-shimmer rounded" />
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        <div className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-3">
                            <div className="h-5 w-1/2 skeleton-shimmer rounded" />
                            <div className="h-4 w-1/3 skeleton-shimmer rounded" />
                            <div className="h-4 w-1/4 skeleton-shimmer rounded" />
                        </div>
                    </div>
                </div>
            )}

            {hydrated && entries.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-lg bg-neutral-50">
                    <div className="w-16 h-16 mb-6 text-neutral-400">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"> <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" /><circle cx="7" cy="21" r="1" /><circle cx="17" cy="21" r="1" /></svg>
                    </div>
                    <h2 className="text-lg font-medium mb-2">Your cart is empty</h2>
                    <p className="text-sm text-neutral-500 mb-4 max-w-sm">Browse products on the dashboard and add them to your cart to review them here.</p>
                    <Link href="/dashboard"><Button>Browse Products</Button></Link>
                </div>
            )}

            {hydrated && entries.length > 0 && (
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-4">
                        {entries.map(({ product, qty }) => {
                            const lineTotal = product.price * qty;
                            return (
                                <Card key={product.id} className="p-4 flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center justify-center sm:w-32">
                                        <img src={product.image} alt={product.title} loading="lazy" className="h-24 object-contain" />
                                    </div>
                                    <div className="flex-1 grid sm:grid-cols-5 gap-4 items-start">
                                        <div className="sm:col-span-3 space-y-1">
                                            <CardHeader className="p-0 mb-1">
                                                <CardTitle className="text-base leading-snug line-clamp-2">{product.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0 text-xs text-neutral-500 capitalize">{product.category}</CardContent>
                                        </div>
                                        <div className="flex flex-col gap-2 sm:items-end sm:col-span-2">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" onClick={() => dec(product.id)} className="h-8 w-8 p-0">-</Button>
                                                <span className="min-w-[2ch] text-center text-sm font-medium">{qty}</span>
                                                <Button variant="outline" onClick={() => add(product)} className="h-8 w-8 p-0">+</Button>
                                            </div>
                                            <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
                                            <p className="text-sm font-semibold">${lineTotal.toFixed(2)}</p>
                                            <Button variant="destructive" onClick={() => remove(product.id)} className="h-8 px-3 text-xs self-start sm:self-end">Remove</Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                    <div className="space-y-4 lg:sticky lg:top-4">
                        <Card className="p-5">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle className="text-lg">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 space-y-3 text-sm">
                                <div className="flex justify-between"><span>Items</span><span>{entries.reduce((a, i) => a + i.qty, 0)}</span></div>
                                <div className="flex justify-between"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
                                <div className="flex justify-between font-semibold text-base pt-2 border-t border-neutral-200 dark:border-neutral-700"><span>Total</span><span>${total.toFixed(2)}</span></div>
                            </CardContent>
                            <CardFooter className="p-0 mt-4 flex flex-col gap-3">
                                {status === 'success' && (
                                    <div className="text-sm rounded border border-green-300 bg-green-50 text-green-700 px-3 py-2">
                                        <p className="font-medium mb-1">Order Placed</p>
                                        <p>{message}</p>
                                    </div>
                                )}
                                {status !== 'success' && (
                                    <Button
                                        className="w-full"
                                        disabled={status === 'processing' || entries.length === 0}
                                        onClick={() => {
                                            setStatus('processing');
                                            setMessage('');
                
                                            const orderId = Math.random().toString(36).slice(2, 8).toUpperCase();
                                            setTimeout(() => {
                                                setStatus('success');
                                                setMessage(`Confirmation #${orderId}. Total charged $${total.toFixed(2)}.`);
                                                clear();
                                            }, 1200);
                                        }}
                                    >
                                        {status === 'processing' ? 'Processing…' : 'Checkout'}
                                    </Button>
                                )}
                                {status === 'processing' && (
                                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                                        <span className="inline-block h-3 w-3 rounded-full border-2 border-neutral-300 border-t-neutral-700 animate-spin" />
                                        Finalizing order…
                                    </div>
                                )}
                                {status !== 'processing' && status !== 'success' && (
                                    <Button variant="outline" onClick={clear} className="w-full">Clear Cart</Button>
                                )}
                                {status === 'success' && (
                                    <Button variant="outline" onClick={() => { setStatus('idle'); setMessage(''); }} className="w-full">Shop More</Button>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
