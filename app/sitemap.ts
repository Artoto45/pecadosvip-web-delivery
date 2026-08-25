import type { MetadataRoute } from 'next';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.pecadosvip.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/madrid`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/barcelona`,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
