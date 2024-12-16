import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { hostname: "public.blob.vercel-storage.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "abs.twimg.com" },
      { hostname: "pbs.twimg.com" },
      { hostname: "avatar.vercel.sh" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "g-odxgj0zkpuk.vusercontent.net" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "flag.vercel.app" },
      { hostname: "illustrations.popsy.co" },
    ],
  },
};

export default nextConfig;
