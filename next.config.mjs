const nextConfig = {
    trailingSlash: true,

    images: {
        domains: ["tzxvlfemmamhrxtcqfhz.supabase.co"],
    },
    async redirects() {
        return [
            {
                source: '/calculators/:path*',
                destination: '/calculator/:path*',
                statusCode: 301,
            },
        ]
    },
};

export default nextConfig;