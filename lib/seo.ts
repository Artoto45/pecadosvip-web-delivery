import type { Metadata } from 'next';

import { siteConfig } from './site-config.ts';

type CityMetadataInput = {
  slug: 'madrid' | 'barcelona';
  city: string;
  description: string;
  openGraphDescription: string;
  twitterDescription: string;
};

export function buildCityMetadata(input: CityMetadataInput): Metadata {
  const canonicalUrl = siteConfig.origin
    ? new URL(`/${input.slug}`, siteConfig.origin).toString()
    : undefined;
  const imageUrl = siteConfig.origin
    ? new URL('/og.png', siteConfig.origin).toString()
    : undefined;
  const title = `Compañía privada en ${input.city}`;
  const socialTitle = `${title} | PecadosVip`;

  return {
    title,
    description: input.description,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      title: socialTitle,
      description: input.openGraphDescription,
      locale: 'es_ES',
      type: 'website',
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: `PecadosVip ${input.city}`,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: input.twitterDescription,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    robots: siteConfig.indexingEnabled
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
