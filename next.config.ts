import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export — Vercel/Netlify/GH Pages uyumlu
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Play Console + Apple için .well-known/ path'ini korumak kritik
  // (public/ altında tutulur, Next otomatik serve eder)
};

export default nextConfig;
