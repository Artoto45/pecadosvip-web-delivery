import type { ContentSnapshot } from './types.ts';

export type RouteEntry = {
  path: string;
  kind: 'home' | 'city' | 'profiles' | 'profile' | 'contact' | 'legal';
  indexable: boolean;
  lastModified?: string;
};

export function buildRouteManifest(snapshot: ContentSnapshot): RouteEntry[] {
  const routes: RouteEntry[] = [
    { path: '/', kind: 'home', indexable: snapshot.settings.publicationEnabled },
    { path: '/perfiles', kind: 'profiles', indexable: snapshot.settings.publicationEnabled },
    { path: '/contacto', kind: 'contact', indexable: snapshot.settings.publicationEnabled },
  ];

  for (const city of snapshot.cities) {
    if (city.status === 'published') {
      routes.push({
        path: `/${city.slug}`,
        kind: 'city',
        indexable: city.seo.indexable,
        lastModified: city.seo.lastModified,
      });
    }
  }

  for (const profile of snapshot.profiles) {
    if (profile.status === 'published') {
      routes.push({
        path: `/perfiles/${profile.slug}`,
        kind: 'profile',
        indexable: true,
        lastModified: profile.updatedAt,
      });
    }
  }

  const legalRoutes: Array<[string, keyof ContentSnapshot['settings']['legal']]> = [
    ['/legal/aviso-legal', 'legalNotice'],
    ['/legal/privacidad', 'privacy'],
    ['/legal/cookies', 'cookies'],
    ['/legal/terminos-del-servicio', 'serviceTerms'],
  ];

  for (const [path, key] of legalRoutes) {
    const document = snapshot.settings.legal[key];
    if (document.approval.state === 'approved' && document.body.trim()) {
      routes.push({ path, kind: 'legal', indexable: true, lastModified: document.updatedAt });
    }
  }

  return routes;
}

export function sitemapRoutes(snapshot: ContentSnapshot): RouteEntry[] {
  return buildRouteManifest(snapshot).filter((route) => route.indexable);
}
