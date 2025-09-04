/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['fakestoreapi.com'],
        unoptimized: true, // disable server-side optimization to prevent timeouts fetching remote images
    },
};

export default nextConfig;
