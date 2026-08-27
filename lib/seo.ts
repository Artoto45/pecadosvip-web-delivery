import type { Metadata } from 'next';

import { isRuntimeRouteIndexable } from './content/runtime-publication.ts';
import { siteConfig, type SiteConfig } from './site-config.ts';

type PublicMetadataInput = {
  path: `/${string}` | '/';
  title: string;
  description: string;
  openGraphDescription?: string;
  twitterDescription?: string;
  imageAlt?: string;
  forceNoIndex?: boolean;
};

type CityMetadataInput = {
  slug: 'madrid' | 'barcelona';
  city: string;
  description: string;
  openGraphDescription: string;
  twitterDescription: string;
};

export function buildPublicMetadata(
  input: PublicMetadataInput,
  config: SiteConfig = siteConfig,
  routeIndexable: boolean = isRuntimeRouteIndexable(input.path),
): Metadata {
  const canPublish = Boolean(
    !input.forceNoIndex &&
      routeIndexable &&
      config.indexingEnabled &&
      config.origin,
  );
  const publishableOrigin = canPublish ? config.origin : undefined;
  const canonicalUrl = publishableOrigin
    ? new URL(input.path, publishableOrigin).toString()
    : undefined;
  const imageUrl = publishableOrigin
    ? new URL('/og.png', publishableOrigin).toString()
    : undefined;
  const publicTitle = canPublish ? input.title : 'Sitio en preparación';
  const publicDescription = canPublish
    ? input.description
    : 'Versión no publicada. El contenido permanece cerrado hasta completar las aprobaciones del release.';
  const socialTitle = `${publicTitle} | PecadosVip`;

  return {
    title: publicTitle,
    description: publicDescription,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      title: socialTitle,
      description: canPublish
        ? input.openGraphDescription ?? input.description
        : publicDescription,
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
                alt: input.imageAlt ?? 'PecadosVip Madrid y Barcelona',
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: canPublish
        ? input.twitterDescription ?? input.description
        : publicDescription,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    robots: canPublish
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export function buildCityMetadata(input: CityMetadataInput): Metadata {
  return buildPublicMetadata({
    path: `/${input.slug}`,
    title: `Compañía privada en ${input.city}`,
    description: input.description,
    openGraphDescription: input.openGraphDescription,
    twitterDescription: input.twitterDescription,
    imageAlt: `PecadosVip ${input.city}`,
  });
}
