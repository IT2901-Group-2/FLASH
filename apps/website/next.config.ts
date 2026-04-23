import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@flash/ui", "@flash/file-storage"],
  serverExternalPackages: ["better-sqlite3", "typescript-result"],
  outputFileTracingIncludes: {
    "/": ["drizzle/**/*"],
  },
  //!!! TEMP FIX !!!
  images: {unoptimized: true}
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
