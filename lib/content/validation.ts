import { citySlugs } from './types.ts';
import type {
  ApprovalRecord,
  CityPage,
  ContentSnapshot,
  LegalDocument,
  Profile,
} from './types.ts';

export type ValidationIssue = {
  code: string;
  path: string;
  message: string;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

function isApproved(approval: ApprovalRecord): boolean {
  return (
    approval.state === 'approved' &&
    hasText(approval.approvedBy ?? '') &&
    hasText(approval.approvedAt ?? '') &&
    hasText(approval.sourceReference ?? '')
  );
}

function isIsoDate(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

function isHttpsOrigin(value: string | undefined): boolean {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.origin === value.replace(/\/$/, '');
  } catch {
    return false;
  }
}

function validateLegalDocument(
  document: LegalDocument,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!hasText(document.title) || !hasText(document.body)) {
    issues.push({
      code: 'LEGAL_CONTENT_MISSING',
      path,
      message: 'Approved legal title and body are required for release.',
    });
  }

  if (!isApproved(document.approval)) {
    issues.push({
      code: 'LEGAL_APPROVAL_MISSING',
      path: `${path}.approval`,
      message: 'Legal content needs traceable approval evidence.',
    });
  }
}

function validateCity(
  city: CityPage,
  index: number,
  profileSlugs: Set<string>,
  issues: ValidationIssue[],
): void {
  const path = `cities[${index}]`;

  if (!citySlugs.includes(city.slug)) {
    issues.push({
      code: 'CITY_SLUG_UNSUPPORTED',
      path: `${path}.slug`,
      message: `Unsupported city slug: ${city.slug}`,
    });
  }

  if (!isIsoDate(city.updatedAt) || !isIsoDate(city.seo.lastModified)) {
    issues.push({
      code: 'CITY_DATE_INVALID',
      path,
      message: 'City update dates must be valid ISO timestamps.',
    });
  }

  for (const profileSlug of city.profileSlugs) {
    if (!profileSlugs.has(profileSlug)) {
      issues.push({
        code: 'CITY_PROFILE_REFERENCE_MISSING',
        path: `${path}.profileSlugs`,
        message: `Unknown profile slug: ${profileSlug}`,
      });
    }
  }

  if (city.seo.indexable || city.status === 'published') {
    const missingApprovedContent =
      !isApproved(city.approval) ||
      !city.serviceConfirmed ||
      !hasText(city.headline) ||
      !hasText(city.introduction) ||
      city.differentiators.length === 0 ||
      city.coverageAreas.length === 0 ||
      city.coverageAreas.some((area) => !area.confirmed) ||
      city.faqs.length === 0 ||
      !hasText(city.seo.title) ||
      !hasText(city.seo.description);

    if (missingApprovedContent) {
      issues.push({
        code: 'CITY_PUBLICATION_EVIDENCE_MISSING',
        path,
        message: 'A public city page requires approved, confirmed and complete local content.',
      });
    }
  }

  if (city.seo.indexable && city.status !== 'published') {
    issues.push({
      code: 'CITY_INDEXING_STATE_INVALID',
      path: `${path}.seo.indexable`,
      message: 'Only published cities can be indexable.',
    });
  }
}

function validateProfile(
  profile: Profile,
  index: number,
  serviceIds: Set<string>,
  issues: ValidationIssue[],
): void {
  const path = `profiles[${index}]`;

  if (!slugPattern.test(profile.slug)) {
    issues.push({
      code: 'PROFILE_SLUG_INVALID',
      path: `${path}.slug`,
      message: 'Profile slug must be lowercase and URL-safe.',
    });
  }

  if (!Number.isInteger(profile.age) || profile.age < 18) {
    issues.push({
      code: 'PROFILE_AGE_INVALID',
      path: `${path}.age`,
      message: 'Every profile must have a verified adult age.',
    });
  }

  if (!isIsoDate(profile.createdAt) || !isIsoDate(profile.updatedAt)) {
    issues.push({
      code: 'PROFILE_DATE_INVALID',
      path,
      message: 'Profile dates must be valid ISO timestamps.',
    });
  }

  if (!Number.isInteger(profile.revision) || profile.revision < 1) {
    issues.push({
      code: 'PROFILE_REVISION_INVALID',
      path: `${path}.revision`,
      message: 'Profile revision must be a positive integer.',
    });
  }

  for (const serviceId of profile.serviceIds) {
    if (!serviceIds.has(serviceId)) {
      issues.push({
        code: 'PROFILE_SERVICE_REFERENCE_MISSING',
        path: `${path}.serviceIds`,
        message: `Unknown service id: ${serviceId}`,
      });
    }
  }

  const mediaOrders = new Set<number>();
  for (const [mediaIndex, media] of profile.media.entries()) {
    if (!hasText(media.alt)) {
      issues.push({
        code: 'MEDIA_ALT_MISSING',
        path: `${path}.media[${mediaIndex}].alt`,
        message: 'Every media asset needs meaningful alternative text.',
      });
    }
    if (!media.rightsConfirmed || !hasText(media.rightsEvidence ?? '')) {
      issues.push({
        code: 'MEDIA_RIGHTS_MISSING',
        path: `${path}.media[${mediaIndex}]`,
        message: 'Every media asset needs traceable rights evidence.',
      });
    }
    if (mediaOrders.has(media.order)) {
      issues.push({
        code: 'MEDIA_ORDER_DUPLICATE',
        path: `${path}.media[${mediaIndex}].order`,
        message: `Duplicate media order: ${media.order}`,
      });
    }
    mediaOrders.add(media.order);
  }

  if (profile.status === 'published') {
    const publicationBlocked =
      !isApproved(profile.approval) ||
      !profile.adultAgeConfirmed ||
      !profile.publicationConsentConfirmed ||
      !profile.rightsConfirmed ||
      !hasText(profile.displayName) ||
      !hasText(profile.biography) ||
      profile.languages.length === 0 ||
      profile.serviceIds.length === 0 ||
      profile.citySlugs.length === 0 ||
      profile.media.length === 0;

    if (publicationBlocked) {
      issues.push({
        code: 'PROFILE_PUBLICATION_EVIDENCE_MISSING',
        path,
        message: 'A published profile requires approved adult, consent, rights and content evidence.',
      });
    }
  }
}

function validateUnique(
  values: string[],
  path: string,
  code: string,
  issues: ValidationIssue[],
): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      issues.push({ code, path, message: `Duplicate value: ${value}` });
    }
    seen.add(value);
  }
}

export function validateContentSnapshot(
  snapshot: ContentSnapshot,
  mode: 'draft' | 'release' = 'draft',
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  validateUnique(snapshot.cities.map((city) => city.id), 'cities', 'CITY_ID_DUPLICATE', issues);
  validateUnique(snapshot.cities.map((city) => city.slug), 'cities', 'CITY_SLUG_DUPLICATE', issues);
  validateUnique(snapshot.profiles.map((profile) => profile.id), 'profiles', 'PROFILE_ID_DUPLICATE', issues);
  validateUnique(snapshot.profiles.map((profile) => profile.slug), 'profiles', 'PROFILE_SLUG_DUPLICATE', issues);
  validateUnique(snapshot.services.map((service) => service.id), 'services', 'SERVICE_ID_DUPLICATE', issues);

  const profileSlugs = new Set(snapshot.profiles.map((profile) => profile.slug));
  const serviceIds = new Set(snapshot.services.map((service) => service.id));

  snapshot.cities.forEach((city, index) => validateCity(city, index, profileSlugs, issues));
  snapshot.profiles.forEach((profile, index) => validateProfile(profile, index, serviceIds, issues));

  if (mode === 'release') {
    if (!snapshot.settings.publicationEnabled) {
      issues.push({
        code: 'PUBLICATION_DISABLED',
        path: 'settings.publicationEnabled',
        message: 'Publication must be explicitly enabled for a release.',
      });
    }

    if (!isHttpsOrigin(snapshot.settings.canonicalOrigin)) {
      issues.push({
        code: 'CANONICAL_ORIGIN_INVALID',
        path: 'settings.canonicalOrigin',
        message: 'A confirmed HTTPS canonical origin is required for release.',
      });
    }

    const contacts = snapshot.settings.contact;
    if (!Object.values(contacts).some((value) => hasText(value ?? ''))) {
      issues.push({
        code: 'CONTACT_CHANNEL_MISSING',
        path: 'settings.contact',
        message: 'At least one approved contact destination is required for release.',
      });
    }

    validateLegalDocument(snapshot.settings.legal.legalNotice, 'settings.legal.legalNotice', issues);
    validateLegalDocument(snapshot.settings.legal.privacy, 'settings.legal.privacy', issues);
    validateLegalDocument(snapshot.settings.legal.cookies, 'settings.legal.cookies', issues);
    validateLegalDocument(snapshot.settings.legal.serviceTerms, 'settings.legal.serviceTerms', issues);

    const publishedCitySlugs = new Set(
      snapshot.cities
        .filter((city) => city.status === 'published' && city.seo.indexable)
        .map((city) => city.slug),
    );
    for (const citySlug of citySlugs) {
      if (!publishedCitySlugs.has(citySlug)) {
        issues.push({
          code: 'REQUIRED_CITY_NOT_PUBLISHED',
          path: 'cities',
          message: `Required city route is not release-ready: ${citySlug}`,
        });
      }
    }

    const publishedProfiles = snapshot.profiles.filter(
      (profile) => profile.status === 'published',
    );
    if (publishedProfiles.length < 8) {
      issues.push({
        code: 'INITIAL_PROFILE_LOAD_INCOMPLETE',
        path: 'profiles',
        message: 'The confirmed initial load requires at least eight publishable profiles.',
      });
    }
  }

  return issues;
}
