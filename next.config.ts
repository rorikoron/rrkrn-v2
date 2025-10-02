import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    viewTransition: true,
  },
  images:{
    remotePatterns:[
      new URL('https://v5.airtableusercontent.com/**'),
      new URL(`https://archive.rorikoron.net/**`)
    ]
  }
};

export default nextConfig;
