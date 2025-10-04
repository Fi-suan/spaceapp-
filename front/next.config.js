/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  },
  async rewrites() {
    return [
      // Проксируем API запросы к бэкенду
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
      // Проксируем Swagger UI
      {
        source: '/docs',
        destination: 'http://localhost:8080/docs',
      },
      // Проксируем ReDoc
      {
        source: '/redoc',
        destination: 'http://localhost:8080/redoc',
      },
      // Проксируем OpenAPI JSON
      {
        source: '/openapi.json',
        destination: 'http://localhost:8080/openapi.json',
      },
    ]
  },
}

module.exports = nextConfig