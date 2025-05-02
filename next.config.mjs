/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Disable App Router features
    experimental: {
        appDir: false
    }
};

export default nextConfig;
