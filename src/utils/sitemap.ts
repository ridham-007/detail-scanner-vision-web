
import { supabase } from '../integrations/supabase/client';

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
  try {
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('id, updated_at')
      .eq('is_published', true);

    if (error) {
      console.error('Error fetching quizzes for sitemap:', error);
      return [];
    }

    const baseUrl = 'https://eateriq.com';
    
    return quizzes.map((quiz: { id: string; updated_at: string }) => ({
      loc: `${baseUrl}/quiz/${quiz.id}`,
      lastmod: new Date(quiz.updated_at).toISOString().split('T')[0],
      changefreq: 'weekly' as const,
      priority: 0.8
    }));
  } catch (error) {
    console.error('Error generating quiz sitemap URLs:', error);
    return [];
  }
};

export const generateUserProfileSitemapUrls = async (): Promise<SitemapUrl[]> => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('username, updated_at')
      .not('username', 'is', null);

    if (error) {
      console.error('Error fetching user profiles for sitemap:', error);
      return [];
    }

    const baseUrl = 'https://eateriq.com';
    
    return profiles.map((profile: { username: string; updated_at: string }) => ({
      loc: `${baseUrl}/profile/${profile.username}`,
      lastmod: new Date(profile.updated_at).toISOString().split('T')[0],
      changefreq: 'monthly' as const,
      priority: 0.6
    }));
  } catch (error) {
    console.error('Error generating user profile sitemap URLs:', error);
    return [];
  }
};

export const generateCompleteSitemap = async (): Promise<string> => {
  const staticUrls = getStaticSitemapUrls();
  const quizUrls = await generateQuizSitemapUrls();
  const profileUrls = await generateUserProfileSitemapUrls();
  
  const allUrls = [...staticUrls, ...quizUrls, ...profileUrls];
  
  return generateSitemap(allUrls);
};
