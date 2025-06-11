// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   output: 'standalone',
  
//   // Configure for Docker environment
//   env: {
//     NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
//   },

//   // Handle trailing slashes
//   trailingSlash: false,
  
//   // Configure domains for images if needed
//   images: {
//     domains: ['localhost'],
//   },

//   // Experimental features for better Docker performance
//   experimental: {
//     outputFileTracingRoot: '/app',
//   },
// }

// module.exports = nextConfig