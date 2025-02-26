/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: "1946013291",
    NEXT_PUBLIC_ZEGO_SERVER_SECRET: "411b6e2b4a44391fa2f13dfd3c88168c"
  },
  images: {
    domains: ["lh3.googleusercontent.com", "localhost"], // Add Google user content domain
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
