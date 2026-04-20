import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Vercel server-rendered deploy (default) — OG image + Edge runtime uyumlu.
  // Netlify/CF Pages gibi static-only host kullanılırsa `output: 'export'` eklenir
  // ve opengraph-image.tsx'e 'force-static' tanımlanır.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
