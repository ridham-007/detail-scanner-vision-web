
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  author_id: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  
  // SEO Meta Content
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  
  // Additional SEO fields
  reading_time?: number;
  word_count?: number;
  schema_markup?: Record<string, unknown>;
  
  // Relations
  author?: {
    id: string;
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
  categories?: BlogCategory[];
  tags?: BlogTag[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface CreateBlogPost {
  title: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  is_published?: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  word_count?: number;
  reading_time?: number;
  published_at?: string;
}
