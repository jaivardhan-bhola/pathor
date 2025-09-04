"use client";
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';

export default function Home() {
  const totalItems = useCartStore(s => s.totalItems());
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold">Mini Product Dashboard</h1>
      <p className="text-neutral-600 dark:text-neutral-400">A responsive demo app using Next.js App Router, TailwindCSS, and lightweight shadcn-style components. Browse products, filter, search, and manage a client-side cart.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/dashboard"><Button>Enter Dashboard</Button></Link>
        <Link href="/cart"><Button variant="outline">Cart ({totalItems})</Button></Link>
      </div>
      <p className="text-xs text-neutral-400">Data from fakestoreapi.com</p>
    </main>
  );
}
