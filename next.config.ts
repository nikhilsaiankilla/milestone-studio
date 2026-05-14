import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        hostname : 'nikhilsai.in',
        protocol: 'https',
      }
    ]
  }
};

export default nextConfig;
