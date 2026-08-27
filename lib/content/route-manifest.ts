import { evaluateRelease } from './release-gates.ts';
import { isProfilePublicationReady } from './validation.ts';
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
  return profile.status === 'published' && isProfilePublicationReady(profile);
}

export function buildRouteManifest(snapshot: ContentSnapshot): RouteEntry[] {
  const releaseReady = evaluateRelease(snapshot).ok;
  const publishableCities = new Set(
    snapshot.cities.filter(isCityPublishable).map((city) => city.slug),
  );
  const publishableServices = new Set(
    snapshot.services
      .filter(
        (service) =>
          service.status === 'published' && hasApprovalEvidence(service.approval),
      )
      .map((service) => service.id),
  );
  const routes: RouteEntry[] = [
    { path: '/', kind: 'home', indexable: releaseReady },
    { path: '/perfiles', kind: 'profiles', indexable: releaseReady },
    { path: '/contacto', kind: 'contact', indexable: releaseReady },
  ];

  for (const city of snapshot.cities) {
    if (isCityPublishable(city)) {
      routes.push({
        path: `/${city.slug}`,
        kind: 'city',
        indexable: releaseReady && city.seo.indexable,
        lastModified: city.seo.lastModified,
      });
    }
  }

  for (const profile of snapshot.profiles) {
    if (
      isProfilePublishable(profile) &&
      profile.citySlugs.every((slug) => publishableCities.has(slug)) &&
      profile.serviceIds.every((id) => publishableServices.has(id))
    ) {
      routes.push({
        path: `/perfiles/${profile.slug}`,
        kind: 'profile',
        indexable: releaseReady,
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
      routes.push({
        path,
        kind: 'legal',
        indexable: releaseReady,
        lastModified: document.updatedAt,
      });
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
