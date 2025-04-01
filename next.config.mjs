// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//         domains: ['drive.google.com'],
//       },

// };

// export default nextConfig;
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['drive.google.com'],
  },
  experimental:{
    appDir:true,
  },
};

export default withNextIntl(nextConfig);
