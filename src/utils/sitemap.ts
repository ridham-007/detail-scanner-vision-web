
export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (urls: SitemapUrl[]): string => {
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;
  
  return sitemapContent;
};

export const getStaticSitemapUrls = (): SitemapUrl[] => {
  const baseUrl = 'https://eateriq.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  return [
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/quizzes`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/privacy`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.3
    },
    {
      loc: `${baseUrl}/terms`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.3
    },
    {
      loc: `${baseUrl}/support`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.5
    }
  ];
};

export const generateQuizSitemapUrls = async (): Promise<SitemapUrl[]> => {
  // This would typically fetch from your database
  // For now, returning empty array as we'd need to import supabase here
  // In a real implementation, you'd fetch all published quizzes
  return [];
};
