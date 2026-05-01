const nextConfig = {
  trailingSlash: true,

  images: {
    domains: ["tzxvlfemmamhrxtcqfhz.supabase.co"],
  },
  async redirects() {
    return [
      {
        source: "/calculators/:path*",
        destination: "/calculator/:path*",
        statusCode: 301,
      },
      {
        source: "/quiz/dc66adc8-f4ae-44b2-a7e7-237dce3e910f",
        destination: "/",
        permanent: false,
      },
      {
        source: "/quiz/ef555678-cfda-48ff-94a4-8573c1fd1050",
        destination: "/",
        permanent: false,
      },
      {
        source: "/quiz/59f00633-44d2-44e6-897b-3aca77c725c6",
        destination: "/",
        permanent: false,
      },
      {
        source: "/quiz/7b75669f-98aa-43df-94fe-8f154e777a0a",
        destination: "/",
        permanent: false,
      },
      {
        source: "/quiz/0d7667a4-a912-4fc1-b857-65eb51bb5161",
        destination: "/",
        permanent: false,
      },
      {
        source: "/quiz/9bbcb7f7-b163-47b1-ae22-17963a062171",
        destination: "/",
        permanent: false,
      },
      {
        source: "/quiz/2453c85d-a917-4c5e-92b8-0b505438573c",
        destination: "/",
        permanent: false,
      },
      {
        source: "/quiz/5708629d-d6ef-4be6-84cb-d348537cf372",
        destination: "/",
        permanent: false,
      },
      {
        source: "/scanner",
        destination: "/food-scanner",
        permanent: false,
      }
    ];
  },
};

export default nextConfig;
