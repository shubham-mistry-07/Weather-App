/** @type {import('next').NextConfig} */
const nextConfig = {
  // no experimental.turbo key
  webpack: (config) => {
    return config; // keep default webpack behavior
  },
};

module.exports = nextConfig;
