
import { useEffect } from 'react';
import { updatePageSEO } from '@/utils/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'quiz';
  structuredData?: object;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  articleData?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
  };
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  structuredData,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  articleData
}) => {
  useEffect(() => {
    updatePageSEO({
      title,
      description,
      keywords,
      image,
      type,
      structuredData,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterImage,
      canonicalUrl,
      articleData
    });
  }, [title, description, keywords, image, type, structuredData, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, twitterImage, canonicalUrl, articleData]);

  return null;
};

export default SEOHead;
