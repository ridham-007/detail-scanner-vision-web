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
    url: `${baseUrl}/blog/${blog.slug}/`,
    lastModified: new Date(blog.updated_at),
    changeFrequency: 'daily',
  }))

  // Fetch quizzes
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('slug, created_at')
    .eq('is_published', true)

  const quizEntries: MetadataRoute.Sitemap = (quizzes || []).map((quiz) => ({
    url: `${baseUrl}/quiz/${quiz.slug}`,
    lastModified: quiz.created_at ? new Date(quiz.created_at) : new Date(),
    changeFrequency: 'daily',
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    {
      url: `${baseUrl}/food-scanner/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    {
      url: `${baseUrl}/quiz/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    {
      url: `${baseUrl}/categories/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    {
      url: `${baseUrl}/compare/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    {
      url: `${baseUrl}/dietary-guides/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    {
      url: `${baseUrl}/pricing/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    {
      url: `${baseUrl}/privacy/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    {
      url: `${baseUrl}/support/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    {
      url: `${baseUrl}/terms/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    {
      url: `${baseUrl}/calculator/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    {
    url: `${baseUrl}/calculator/bmi-calculator/`,
    lastModified: new Date(),
    changeFrequency: 'daily',
  },
  {
    url: `${baseUrl}/calculator/calorie-calculator/`,
    lastModified: new Date(),
    changeFrequency: 'daily',
  },
  {
    url: `${baseUrl}/calculator/water-intake-calculator/`,
    lastModified: new Date(),
    changeFrequency: 'daily',
  },{
    url: `${baseUrl}/calculator/tdee-calculator/`,
    lastModified: new Date(),
    changeFrequency: 'daily',
  },
  {
    url: `${baseUrl}/calculator/pregnancy-calculator/`,
    lastModified: new Date(),
    changeFrequency: 'daily',
  },
  {
    url: `${baseUrl}/calculator/protein-calculator/`,
    lastModified: new Date(),
    changeFrequency: 'daily',
  },
    ...blogEntries,
    ...quizEntries,
  ]
}
