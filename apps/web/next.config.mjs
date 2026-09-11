/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_ACTIONS || process.env.EXPORT_STATIC;

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@foldlens/core-types'],
  output: isGithubPages ? 'export' : undefined,
  images: {
    unoptimized: true
  },
  trailingSlash: true
};

export default nextConfig;
