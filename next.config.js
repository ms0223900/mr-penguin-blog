/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for `next export` - default Image Optimization API is not available in static export
  images: {
    unoptimized: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  async redirects() {
    return [
      {
        source: '/projects',
        destination: '/projects/work',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
