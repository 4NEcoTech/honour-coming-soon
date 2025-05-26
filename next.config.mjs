// For Internationationalization and Google Drive Version 

// import createNextIntlPlugin from 'next-intl/plugin';

// const withNextIntl = createNextIntlPlugin();

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['drive.google.com'],
//   },
//   experimental:{
//     appDir:true,
//   },
// };

// export default withNextIntl(nextConfig);


// For Mobile Version Deep Link and Internationationalization and Google Drive Version 

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['drive.google.com'],
  },
  experimental: {
    appDir: true,
  },
  // Add these new configurations:
  async headers() {
    return [
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          { key: 'Cache-Control', value: 'public, max-age=86400' }
        ],
      },
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
  // Optional: For better caching of verification files
  async rewrites() {
    return [
      {
        source: '/.well-known/assetlinks.json',
        destination: '/api/.well-known/assetlinks',
      },
      {
        source: '/.well-known/apple-app-site-association',
        destination: '/api/.well-known/apple-app-site-association',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
