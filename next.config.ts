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
    // sharp needs native bindings that can't run in Cloudflare's workerd
    // runtime, so next/image's built-in optimizer is unusable here.
    // See patches/@opennextjs__cloudflare@1.9.0.patch.
    unoptimized: true,
  }
};

if (process.argv.includes("dev")) {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
