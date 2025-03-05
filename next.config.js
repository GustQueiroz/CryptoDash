/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["coin-images.coingecko.com", "assets.coingecko.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        port: "",
        pathname: "/coins/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
