import { MetadataRoute } from 'next'
import { supabase } from '@/integrations/supabase/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.eateriq.com'

  // Fetch blogs
  const { data: blogs } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('is_published', true)

  const blogEntries: MetadataRoute.Sitemap = (blogs || []).map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Fetch quizzes
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('slug, created_at')
    .eq('is_published', true)

  const quizEntries: MetadataRoute.Sitemap = (quizzes || []).map((quiz) => ({
    url: `${baseUrl}/quiz/${quiz.slug}`,
    lastModified: quiz.created_at ? new Date(quiz.created_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/scanner`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...blogEntries,
    ...quizEntries,
  ]
}
