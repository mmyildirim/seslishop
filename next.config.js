/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  },
  // ─── KRİTİK EKLEME: API Yönlendirmesi ──────────────────────────────────────
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Python tarafında /api olmadığı için hedefi doğrudan ana dizine yönlendiriyoruz
        destination: 'http://127.0.0.1:8000/:path*',
      },
    ]
  },
};

module.exports = nextConfig;