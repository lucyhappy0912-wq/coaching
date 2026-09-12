import type { NextConfig } from "next";

const adminHeaders = [
  { key: "Cache-Control", value: "no-store, must-revalidate" },
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
  { key: "Referrer-Policy", value: "no-referrer" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // 영상 1GB + multipart 여유. 이 값보다 큰 본문은 잘린 채로 통과하므로 업로드 상한보다 크게 둔다.
    proxyClientMaxBodySize: "1200mb",
  },
  async redirects() {
    return [
      { source: "/service", destination: "/way", permanent: false },
      { source: "/program", destination: "/coaching/founder", permanent: false },
      { source: "/coaching/founder/next", destination: "/coaching/leadership", permanent: false },
      { source: "/coaching/adult", destination: "/coaching/stage", permanent: false },
      { source: "/coaching/senior", destination: "/coaching/next-chapter", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
      { source: "/admin", headers: adminHeaders },
      { source: "/admin/:path*", headers: adminHeaders },
    ];
  },
};

export default nextConfig;
