import type { MetadataRoute } from 'next';
import { siteConfig } from '../lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.indexingEnabled || !siteConfig.origin) {
    return [];
  }

  return [
    {
      url: `${siteConfig.origin}/madrid`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.origin}/barcelona`,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
