import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["sharp"],
  images:{
    remotePatterns:[
      new URL(`https://archive.rorikoron.net/**`)
    ],
  }
};

if (process.argv.includes("dev")) {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
