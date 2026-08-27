import { evaluateRelease } from './release-gates.ts';
import type {
  ApprovalRecord,
  CityPage,
  ContentSnapshot,
  Profile,
} from './types.ts';

export type RouteEntry = {
  path: string;
  kind: 'home' | 'city' | 'profiles' | 'profile' | 'contact' | 'legal';
  indexable: boolean;
  lastModified?: string;
};

function hasApprovalEvidence(approval: ApprovalRecord): boolean {
  return Boolean(
    approval.state === 'approved' &&
      approval.approvedBy?.trim() &&
      approval.approvedAt?.trim() &&
      approval.sourceReference?.trim(),
  );
}

function isCityPublishable(city: CityPage): boolean {
  return Boolean(
    city.status === 'published' &&
      city.seo.indexable &&
      city.serviceConfirmed &&
      hasApprovalEvidence(city.approval) &&
      city.headline.trim() &&
      city.introduction.trim() &&
      city.differentiators.length > 0 &&
      city.coverageAreas.length > 0 &&
      city.coverageAreas.every((area) => area.confirmed) &&
      city.faqs.length > 0,
  );
}

function isProfilePublishable(profile: Profile): boolean {
  return Boolean(
    profile.status === 'published' &&
      hasApprovalEvidence(profile.approval) &&
      profile.age >= 18 &&
      profile.adultAgeConfirmed &&
      profile.publicationConsentConfirmed &&
      profile.rightsConfirmed &&
      profile.displayName.trim() &&
      profile.biography.trim() &&
      profile.languages.length > 0 &&
      profile.serviceIds.length > 0 &&
      profile.citySlugs.length > 0 &&
      profile.media.length > 0 &&
      profile.media.every(
        (media) =>
          media.alt.trim() &&
          media.rightsConfirmed &&
          media.rightsEvidence?.trim(),
      ),
  );
}

export function buildRouteManifest(snapshot: ContentSnapshot): RouteEntry[] {
  const routes: RouteEntry[] = [
    { path: '/', kind: 'home', indexable: snapshot.settings.publicationEnabled },
    { path: '/perfiles', kind: 'profiles', indexable: snapshot.settings.publicationEnabled },
    { path: '/contacto', kind: 'contact', indexable: snapshot.settings.publicationEnabled },
  ];

  for (const city of snapshot.cities) {
    if (isCityPublishable(city)) {
      routes.push({
        path: `/${city.slug}`,
        kind: 'city',
        indexable: city.seo.indexable,
        lastModified: city.seo.lastModified,
      });
    }
  }

  for (const profile of snapshot.profiles) {
    if (isProfilePublishable(profile)) {
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
    if (hasApprovalEvidence(document.approval) && document.body.trim()) {
      routes.push({ path, kind: 'legal', indexable: true, lastModified: document.updatedAt });
    }
  }

  return routes;
}

export function sitemapRoutes(snapshot: ContentSnapshot): RouteEntry[] {
  if (!evaluateRelease(snapshot).ok) {
    return [];
  }

  return buildRouteManifest(snapshot).filter((route) => route.indexable);
}
