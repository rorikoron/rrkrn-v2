import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["sharp"],
  experimental: {
    // Cloudflare のビルドは .next/cache を前回から引き継ぐが、Turbopack のビルドキャッシュが
    // 古い globals.css の出力を使い回して、本番の CSS だけ前のテーマのままになったので切っておく
    turbopackFileSystemCacheForBuild: false,
  },
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
