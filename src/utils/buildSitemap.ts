
import { generateCompleteSitemap } from './sitemap';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

export const generateSitemapAtBuild = async () => {
  try {
    console.log('Generating sitemap during build...');
    const sitemapContent = await generateCompleteSitemap();
    
    // Write sitemap to public directory
    const sitemapPath = resolve(process.cwd(), 'public/sitemap.xml');
    writeFileSync(sitemapPath, sitemapContent, 'utf8');
    
    console.log('✅ Sitemap generated successfully at public/sitemap.xml');
  } catch (error) {
    console.error('❌ Error generating sitemap during build:', error);
    // Don't fail the build, just log the error
  }
};
