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
        // Tarayıcıdan /api ile gelen her şeyi...
        source: '/api/:path*',
        // ...arka planda 8000 portunda çalışan Python'a gönder.
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
    ]
  },
};

module.exports = nextConfig;