import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/privacy",
        destination: "/policies?tab=privacy",
        permanent: false,
      },
      {
        source: "/terms",
        destination: "/policies?tab=terms",
        permanent: false,
      },
      {
        source: "/cookies",
        destination: "/policies?tab=cookies",
        permanent: false,
      },
      {
        source: "/practice-standards",
        destination: "/policies?tab=ethics",
        permanent: false,
      },
      {
        source: "/practice-standards-and-code-of-ethics",
        destination: "/policies?tab=ethics",
        permanent: false,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-65289ca0758840a892be313f4c7c1ae3.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
