/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["uplaodthing.com", "utfs.io", "img.clerk.com"],
  },
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      sharp: "commonjs sharp",
      canvas: "commonjs canvas",
    });

    return config;
  },
};

module.exports = nextConfig;
