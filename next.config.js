/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/TakakiMaeda.github.io' : '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: isProd ? '/TakakiMaeda.github.io/' : '',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
