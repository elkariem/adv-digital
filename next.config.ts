import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // The supplied brand assets are .jfif. Next.js has no built-in MIME
        // entry for that extension, so it serves them as
        // application/octet-stream. next/image re-encodes them correctly, but
        // anything requesting the files directly would get the wrong type.
        source: "/:path*.jfif",
        headers: [{ key: "Content-Type", value: "image/jpeg" }],
      },
    ];
  },
};

export default nextConfig;