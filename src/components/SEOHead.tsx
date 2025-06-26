
import { useEffect } from 'react';
import { updatePageSEO } from '@/utils/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'quiz';
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  structuredData
}) => {
  useEffect(() => {
    updatePageSEO({
      title,
      description,
      keywords,
      image,
      type,
      structuredData
    });
  }, [title, description, keywords, image, type, structuredData]);

  return null;
};

export default SEOHead;
