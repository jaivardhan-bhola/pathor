import { create } from 'zustand';

const STORAGE_KEY = 'cart';

function loadInitial() {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
    } catch (_) { }
    return {};
}

export const useCartStore = create((set, get) => ({
    items: loadInitial(),
    add(product) {
        set((state) => {
            const existing = state.items[product.id];
            const qty = existing ? existing.qty + 1 : 1;
            return { items: { ...state.items, [product.id]: { product, qty } } };
        });
    },
    remove(id) {
        set((state) => {
            const next = { ...state.items };
            delete next[id];
            return { items: next };
        });
    },
    decrement(id) {
        set((state) => {
            const existing = state.items[id];
            if (!existing) return {};
            if (existing.qty <= 1) {
                const next = { ...state.items };
                delete next[id];
                return { items: next };
            }
            return { items: { ...state.items, [id]: { ...existing, qty: existing.qty - 1 } } };
        });
    },
    clear() { set({ items: {} }); },
    totalItems() { return Object.values(get().items).reduce((a, i) => a + i.qty, 0); },
    totalPrice() { return Object.values(get().items).reduce((a, i) => a + i.qty * i.product.price, 0); }
}));

if (typeof window !== 'undefined') {
    const unsub = useCartStore.subscribe((state) => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)); } catch (_) { }
    });
}
