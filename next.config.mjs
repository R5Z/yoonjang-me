/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  allowedDevOrigins: ['172.30.1.81', 'localhost', '127.0.0.1'],
};

export default nextConfig;