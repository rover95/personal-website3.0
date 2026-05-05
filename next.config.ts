import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // R3F/WebGL contexts are expensive to mount twice in dev; StrictMode's double
  // mount can surface as repeated "Context Lost" while iterating on the scene.
  reactStrictMode: false,
};

export default nextConfig;
