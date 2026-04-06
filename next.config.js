/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ngrok domain'ini izin ver (localhost için dev ortamı)
  allowedDevOrigins: ['nondepreciatory-metonymical-annamae.ngrok-free.dev'],
  
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
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