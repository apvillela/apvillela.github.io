import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages serves static files only — no image optimizer
  images: { unoptimized: true },
};

export default nextConfig;
