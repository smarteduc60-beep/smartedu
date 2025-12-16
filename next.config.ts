import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
    ],
  },
  experimental: {
    appDir: true, // تفعيل App Router
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // ✅ تحديد مجلد src كمصدر رئيسي
  // هذا يضمن أن Next.js يتعرف على src/app دون الحاجة لنقل المجلد
  srcDir: 'src',
};

export default nextConfig;




