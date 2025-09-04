const BASE = 'https://fakestoreapi.com';
let _allProductsCache = { time: 0, data: null };
const CACHE_TTL_MS = 60_000;

export async function fetchProducts({ limit = 10, page = 1, category, search } = {}) {
    let url = `${BASE}/products`;
    if (category && category !== 'all') url = `${BASE}/products/category/${encodeURIComponent(category)}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    let data = await res.json();
    if (search) {
        const q = search.toLowerCase();
        data = data.filter(p => p.title.toLowerCase().includes(q));
    }
    const start = (page - 1) * limit;
    const end = start + limit;
    const paged = data.slice(start, end);
    return { products: paged, total: data.length };
}

export async function fetchAllProducts(force = false) {
    const now = Date.now();
    if (!force && _allProductsCache.data && (now - _allProductsCache.time) < CACHE_TTL_MS) {
        return _allProductsCache.data;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
        const res = await fetch(`${BASE}/products`, { next: { revalidate: 60 }, signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        _allProductsCache = { time: now, data };
        return data;
    } catch (e) {
        if (e.name === 'AbortError') throw new Error('Request timed out');
        throw e;
    } finally { clearTimeout(timeout); }
}

export async function fetchProduct(id) {
    const res = await fetch(`${BASE}/products/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
}

export async function fetchCategories() {
    const res = await fetch(`${BASE}/products/categories`, { cache: 'force-cache' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const cats = await res.json();
    return ['all', ...cats];
}
