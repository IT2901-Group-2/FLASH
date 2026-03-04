import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["ui", "file-storage"],
  serverExternalPackages: ["better-sqlite3", "typescript-result"],
  outputFileTracingIncludes: {
    "/": ["drizzle/**/*"],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
