/** @type {import('next').NextConfig} */

import TerserPlugin  from 'terser-webpack-plugin';
const nextConfig = {
  experimental: {
    ppr: 'incremental',
  },
  // productionBrowserSourceMaps: true,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            mangle: false,
            keep_classnames: true,
            keep_fnames: true,
          },
        }),
      ];
    }
    return config;
  },
};

export default nextConfig;
