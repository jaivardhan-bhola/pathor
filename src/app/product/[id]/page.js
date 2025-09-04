"use client";
import { useEffect, useState } from 'react';
import { fetchProduct } from '@/lib/api';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import clsx from 'clsx';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const add = useCartStore(s => s.add);

    useEffect(() => {
        let active = true;
        (async () => {
            try { setLoading(true); setError(null); const p = await fetchProduct(id); if (active) setProduct(p); }
            catch (e) { if (active) setError(e.message); } finally { if (active) setLoading(false); }
        })();
        return () => { active = false; };
    }, [id]);

    if (loading) return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="h-4 w-20 skeleton-shimmer rounded mb-6" />
            <div className="grid md:grid-cols-2 gap-10">
                <div className="aspect-square rounded-xl skeleton-shimmer" />
                <div className="space-y-4">
                    <div className="h-6 w-3/4 skeleton-shimmer rounded" />
                    <div className="h-4 w-1/2 skeleton-shimmer rounded" />
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (<div key={i} className="h-3 w-full skeleton-shimmer rounded" />))}
                    </div>
                    <div className="h-10 w-32 skeleton-shimmer rounded" />
                </div>
            </div>
        </div>
    );
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!product) return null;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
                <Link href="/dashboard" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">← Back to products</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
                <div>
                    <div className="relative aspect-square rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 flex items-center justify-center overflow-hidden">
                        <img src={product.image} alt={product.title} loading="lazy" className="max-h-full max-w-full object-contain drop-shadow-sm" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="space-y-3">
                        <h1 className="text-2xl md:text-3xl font-semibold leading-tight">{product.title}</h1>
                        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-neutral-500">
                            <span className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">{product.category}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-neutral-600 whitespace-pre-line">
                            {product.description}
                        </p>
                        <div className="pt-2">
                            <span className="text-3xl font-bold">${product.price}</span>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <Button onClick={() => add(product)} className="flex-1">Add to Cart</Button>
                        <Button variant="outline" onClick={() => { add(product); }} className="flex-1">Quick Add +1</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
