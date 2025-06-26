
import type { Plugin } from 'vite';
import { generateSitemapAtBuild } from '../utils/buildSitemap';

export const sitemapPlugin = (): Plugin => {
  return {
    name: 'sitemap-generator',
    buildStart() {
      // Generate sitemap when build starts
      if (process.env.NODE_ENV === 'production') {
        generateSitemapAtBuild();
      }
    }
  };
};
