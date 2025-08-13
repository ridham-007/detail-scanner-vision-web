
interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
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

export const updatePageSEO = (config: SEOConfig) => {
  const {
    title = 'EaterIQ - Smart Food Intelligence',
    description = 'AI-powered barcode scanner and quiz platform for smarter food choices',
    keywords = 'barcode scanner, food scanner, nutrition app, health score, AI food quiz',
    image = 'http://eateriq.com/eater-iq.png',
    url = window.location.href,
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
  } = config;

  // Update document title
  document.title = title;

  // Update or create meta tags
  const updateMeta = (name: string, content: string, property = false) => {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let meta = document.querySelector(selector) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  // Update basic meta tags
  updateMeta('description', description);
  updateMeta('keywords', keywords);
  
  // Update Open Graph tags
  updateMeta('og:title', ogTitle || title, true);
  updateMeta('og:description', ogDescription || description, true);
  updateMeta('og:image', ogImage || image, true);
  updateMeta('og:url', canonicalUrl || url, true);
  updateMeta('og:type', type, true);
  
  // Update Twitter tags
  updateMeta('twitter:title', twitterTitle || title);
  updateMeta('twitter:description', twitterDescription || description);
  updateMeta('twitter:image', twitterImage || image);
  updateMeta('twitter:url', canonicalUrl || url);

  // Article-specific meta tags
  if (type === 'article' && articleData) {
    if (articleData.publishedTime) {
      updateMeta('article:published_time', articleData.publishedTime, true);
    }
    if (articleData.modifiedTime) {
      updateMeta('article:modified_time', articleData.modifiedTime, true);
    }
    if (articleData.author) {
      updateMeta('article:author', articleData.author, true);
    }
    if (articleData.section) {
      updateMeta('article:section', articleData.section, true);
    }
  }

  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl || url);

  // Add structured data if provided
  if (structuredData) {
    const existingScript = document.querySelector('script[data-seo="dynamic"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'dynamic');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
};

export const generateQuizStructuredData = (quiz: {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  created_at: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Quiz",
  "name": quiz.title,
  "description": quiz.description,
  "about": {
    "@type": "Thing",
    "name": "Nutrition and Food Knowledge"
  },
  "educationalLevel": quiz.difficulty,
  "dateCreated": quiz.created_at,
  "creator": {
    "@type": "Organization",
    "name": "EaterIQ"
  },
  "provider": {
    "@type": "Organization",
    "name": "EaterIQ",
    "url": "https://www.eateriq.com"
  },
  "url": `https://www.eateriq.com/quiz/${quiz.id}`,
  "isPartOf": {
    "@type": "WebSite",
    "name": "EaterIQ",
    "url": "https://www.eateriq.com"
  }
});

export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});
