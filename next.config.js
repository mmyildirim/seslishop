/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  },
  async rewrites() {
    return [
      {
        // /api/parse olarak gelen isteği...
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*', 
      },
    ]
  },
};

module.exports = nextConfig;