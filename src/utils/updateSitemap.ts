
import { generateCompleteSitemap } from './sitemap';

export const updateSitemapFile = async (): Promise<void> => {
  try {
    const sitemapContent = await generateCompleteSitemap();
    
    // This function is now primarily for development/manual updates
    // The build process will handle automatic generation
    console.log('Generated sitemap content:', sitemapContent);
    
    return;
  } catch (error) {
    console.error('Error updating sitemap:', error);
  }
};

// Export the function to get sitemap content for manual use
export const getSitemapContent = async (): Promise<string> => {
  return await generateCompleteSitemap();
};
