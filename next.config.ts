import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
    ],
  },
  // 301 Redirects for SEO - preserve old Shopify URLs
  async redirects() {
    return [
      // Redirect old Shopify blog URLs to new structure
      {
        source: "/blogs/news/:slug",
        destination: "/blog/:slug",
        permanent: true, // 301 redirect
      },
      {
        source: "/blogs/news",
        destination: "/blog",
        permanent: true,
      },
      // Old shop pages (no longer selling)
      {
        source: "/collections/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/products/:path*",
        destination: "/",
        permanent: true,
      },
      // Account pages
      {
        source: "/account/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
