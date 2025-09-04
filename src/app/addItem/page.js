"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProductStore } from '@/store/productStore';
import Link from 'next/link';

export default function AddItemPage() {
    const [form, setForm] = useState({ title: '', price: '', category: '', image: '', description: '' });
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const addLocal = useProductStore(s => s.addLocal);

    function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

    async function onSubmit(e) {
        e.preventDefault();
        if (status === 'submitting') return;
        setError('');
        if (!form.title.trim()) { setError('Title required'); return; }
        if (!form.price || Number.isNaN(Number(form.price))) { setError('Valid price required'); return; }
        setStatus('submitting');
        try {
            await new Promise(res => setTimeout(res, 400));
            addLocal(form);
            setForm({ title: '', price: '', category: '', image: '', description: '' });
            setStatus('success');
            setTimeout(() => setStatus('idle'), 1200);
        } catch (e) {
            setError(e.message);
            setStatus('error');
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Add Mock Product</h1>
                <Link href="/dashboard" className="text-sm underline">Back to Dashboard</Link>
            </div>
            <p className="text-sm text-neutral-600">Create a locally stored product (persists in your browser only) to test UI flows.</p>
            <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Title" value={form.title} onChange={e => update('title', e.target.value)} />
                    <Input placeholder="Price" value={form.price} onChange={e => update('price', e.target.value)} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Category" value={form.category} onChange={e => update('category', e.target.value)} />
                    <Input placeholder="Image URL" value={form.image} onChange={e => update('image', e.target.value)} />
                </div>
                <Input placeholder="Description" value={form.description} onChange={e => update('description', e.target.value)} />
                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={status === 'submitting'}>
                        {status === 'submitting' ? 'Adding…' : status === 'success' ? 'Added!' : 'Add Product'}
                    </Button>
                    {error && <span className="text-xs text-red-600">{error}</span>}
                    {status === 'error' && !error && <span className="text-xs text-red-600">Failed. Retry.</span>}
                    <span className="text-xs text-neutral-500 ml-auto">Stored locally only</span>
                </div>
            </form>
            {/* Removed simulation note per request */}
        </div>
    );
}
