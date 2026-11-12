/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Serves onedollarstats from our own domain under neutral paths, because
  // content blockers block its domains and any path named "events".
  async rewrites() {
    return [
      { source: "/m/s.js", destination: "https://assets.onedollarstats.com/stonks.js" },
      { source: "/m/e", destination: "https://collector.onedollarstats.com/events" },
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/r/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ]
  },
}

export default nextConfig
