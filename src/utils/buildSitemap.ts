
import { generateCompleteSitemap } from './sitemap';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

export const generateSitemapAtBuild = async () => {
  try {
    const sitemapContent = await generateCompleteSitemap();
    
    // Write sitemap to public directory
    const sitemapPath = resolve(process.cwd(), 'public/sitemap.xml');
    writeFileSync(sitemapPath, sitemapContent, 'utf8');
  } catch (error) {
    console.error('❌ Error generating sitemap during build:', error);
    // Don't fail the build, just log the error
  }
};
