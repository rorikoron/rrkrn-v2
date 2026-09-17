import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["sharp"],
  experimental: {
    viewTransition: true,
  },
  images:{
    remotePatterns:[
      new URL(`https://archive.rorikoron.net/**`)
    ],
    unoptimized: true,
  }
};

if (process.argv.includes("dev")) {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
