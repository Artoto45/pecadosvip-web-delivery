import type { MetadataRoute } from 'next';
import { siteConfig } from '../lib/site-config';

export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.indexingEnabled || !siteConfig.origin) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/preview/'],
    },
    sitemap: `${siteConfig.origin}/sitemap.xml`,
  };
}
