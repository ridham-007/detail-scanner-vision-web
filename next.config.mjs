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
                permanent: true,
            },
        ]
    },
};

export default nextConfig;