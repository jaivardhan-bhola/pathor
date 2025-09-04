"use client";
import { useEffect, useState } from 'react';
import { fetchAllProducts, fetchCategories } from '@/lib/api';
import { useProductStore } from '@/store/productStore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';


const PAGE_SIZE = 12;

export default function DashboardPage() {
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState('all');
    const [categories, setCategories] = useState(['all']);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const add = useCartStore(s => s.add);

    const localProducts = useProductStore(s => s.products);
    useEffect(() => {
        (async () => {
            try { setLoading(true); setError(null); const data = await fetchAllProducts(); setAllProducts([...localProducts, ...data]); }
            catch (e) { setError(e.message); }
            finally { setLoading(false); }
        })();
        fetchCategories().then(cats => setCategories(prev => Array.from(new Set([...prev, ...cats])))).catch(console.error);
    }, []);

    useEffect(() => {
        setAllProducts(prev => {
            const remote = prev.filter(p => !p.local);
            return [...localProducts, ...remote];
        });
    }, [localProducts]);

    useEffect(() => {
        let data = allProducts;
        if (category && category !== 'all') data = data.filter(p => p.category === category);
        if (search) { const q = search.toLowerCase(); data = data.filter(p => p.title.toLowerCase().includes(q)); }
        const total = data.length; setTotal(total);
        const start = (page - 1) * PAGE_SIZE; const end = start + PAGE_SIZE;
        setProducts(data.slice(start, end));
    }, [allProducts, category, search, page]);

    const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold">Product Dashboard</h1>
                <p className="text-sm text-neutral-600">Browse products, filter and add to cart. <a href="/addItem" className="underline ml-1">Add mock product ↗</a></p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
                <Input placeholder="Search title..." value={search} onChange={e => { setPage(1); setSearch(e.target.value); }} />
                <Select value={category} onChange={val => { setPage(1); setCategory(val); }}>
                    {categories.map(c => {
                        const label = c.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                        return <SelectItem key={c} value={c}>{label}</SelectItem>;
                    })}
                </Select>
                <div className="flex items-center gap-2 text-sm"><span>Page {page} / {totalPages}</span></div>
            </div>
            {loading && <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-pulse">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 space-y-3">
                        <div className="h-4 w-3/4 skeleton-shimmer rounded" />
                        <div className="h-32 skeleton-shimmer rounded" />
                        <div className="flex items-center justify-between pt-2">
                            <div className="h-4 w-12 skeleton-shimmer rounded" />
                            <div className="h-8 w-16 skeleton-shimmer rounded" />
                        </div>
                    </div>
                ))}
            </div>}
            {error && <div className="text-red-600 text-sm">{error}. <button className="underline" onClick={() => window.location.reload()}>Retry</button></div>}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map(p => (
                    <Card key={p.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="line-clamp-2 text-sm flex items-center gap-2">
                                {p.title}
                                {p.local && <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded bg-neutral-900 text-white">LOCAL</span>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col items-center justify-center">
                            <img src={p.image} alt={p.title} loading="lazy" className="h-32 w-auto object-contain" />
                            <div className="mt-2 text-xs capitalize text-neutral-500">{p.category}</div>
                        </CardContent>
                        <CardFooter>
                            <span className="font-semibold text-sm">${p.price}</span>
                            <div className="flex gap-2">
                                {!p.local && <Link href={`/product/${p.id}`} className="text-sm"><Button variant="ghost">View</Button></Link>}
                                <Button onClick={() => add(p)} className="text-sm">Add</Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <div className="flex items-center justify-center gap-4 pt-4">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
        </div>
    );
}
