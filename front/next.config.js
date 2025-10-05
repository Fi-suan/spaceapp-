/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  },
  async rewrites() {
    // Only use rewrites in development
    if (process.env.NODE_ENV === 'development') {
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080'

      return [
        // Проксируем API запросы к бэкенду
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
        // Проксируем Swagger UI
        {
          source: '/docs',
          destination: `${backendUrl}/docs`,
        },
        // Проксируем ReDoc
        {
          source: '/redoc',
          destination: `${backendUrl}/redoc`,
        },
        // Проксируем OpenAPI JSON
        {
          source: '/openapi.json',
          destination: `${backendUrl}/openapi.json`,
        },
      ]
    }

    return []
  },
}

module.exports = nextConfig