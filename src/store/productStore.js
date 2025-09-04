import { create } from 'zustand';

const STORAGE_KEY = 'localProducts';

function loadInitial() {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
    } catch (_) { }
    return [];
}

export const useProductStore = create((set, get) => ({
    products: loadInitial(),
    addLocal(productInput) {
        const id = `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        const product = {
            id,
            title: productInput.title.trim(),
            price: Number(productInput.price) || 0,
            description: productInput.description?.trim() || 'No description provided.',
            category: productInput.category?.trim() || 'misc',
            image: productInput.image?.trim() || '/vercel.svg',
            local: true,
        };
        set(state => ({ products: [product, ...state.products] }));
        return product;
    },
    clearAll() { set({ products: [] }); }
}));

if (typeof window !== 'undefined') {
    useProductStore.subscribe((state) => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.products)); } catch (_) { /* ignore */ }
    });
}
