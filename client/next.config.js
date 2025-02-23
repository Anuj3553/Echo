/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "localhost"], // Add Google user content domain
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
