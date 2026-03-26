/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/TakakiMaeda.github.io' : '',
  assetPrefix: isProd ? '/TakakiMaeda.github.io/' : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
