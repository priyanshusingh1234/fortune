/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["assets.hackclub.com", "api.dicebear.com"],
  },
};

module.exports = nextConfig;

