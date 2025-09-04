## Mini Product Dashboard

Lightweight product browsing & cart demo built with Next.js (App Router), React 19, Tailwind CSS v4, and small shadcn‑style UI primitives. Data is pulled from https://fakestoreapi.com and managed client‑side with a persisted Zustand cart store.

### Demo Links
- [YouTube Video](https://youtu.be/VjtlmTS8jF8)
- [Live Website](https://pathor.vercel.app)

### Features
* Home landing page with quick navigation & cart badge
* Product Dashboard (`/dashboard`)
	* Fetch all products (cached briefly in memory)
	* Client‑side pagination (12 per page)
	* Category filter (dynamic list from API)
	* Title search (case‑insensitive)
	* Loading skeletons + basic error handling & retry
* Product Detail (`/product/[id]`)
	* Full description, category tag, price, image
	* Add / quick add to cart
* Add Item (`/addItem`)
	* Form to create mock products stored locally only
	* Local items labeled `LOCAL` in dashboard list
* Cart (`/cart`)
	* Quantity increment/decrement & remove
	* Line totals + order summary + fake checkout flow
	* LocalStorage persistence (survives refresh)
	* Empty + processing + success states
* Global Navbar with live cart count & total price badge
* Accessible custom select, buttons, inputs, cards
* Responsive mobile‑first layout

### Tech Stack
* Next.js 15 App Router
* React 19
* Tailwind CSS v4
* Zustand (cart state + persistence)
* Fakestore API (public product data)

### Local Development
Prereqs: Node 18+ (recommend latest LTS), npm.

Install deps:
```bash
npm install
```
Run dev server:
```bash
npm run dev
```
Open: http://localhost:3000

Build for production:
```bash
npm run build
npm start
```

Lint:
```bash
npm run lint
```

### Key Paths
```
src/
	app/
		page.js                # Home
		dashboard/page.js      # Dashboard listing
		product/[id]/page.js   # Product detail
		cart/page.js           # Cart + checkout simulation
		addItem/page.js        # Add mock product form
	components/
		navbar.js              # Global navigation
		ui/                    # UI primitives (button, card, input, select)
	lib/api.js               # Fetch helpers (with simple caching + timeout)
	store/cartStore.js       # Zustand store + persistence
	store/productStore.js    # Local mock products (persisted)
```

### Notes
* Pagination is client‑side (API returns full list; sliced per page size 12).
* Product list fetch cached in memory for 60s to reduce network calls.
* Cart state persisted to `localStorage` under key `cart`.
* Locally added products persisted under key `localProducts`.
* Basic loading skeletons implemented via utility CSS class `.skeleton-shimmer`.
* No environment variables required; all API calls are public.

### Deployment
Deploy easily on Vercel: push repository, import, and use default build (`next build`).
