import type { CmsRole, Profile, PublicationStatus } from './types.ts';

const transitions: Record<PublicationStatus, readonly PublicationStatus[]> = {
  draft: ['hidden', 'published', 'archived'],
  hidden: ['draft', 'published', 'archived'],
  published: ['hidden', 'archived'],
  archived: ['draft'],
};

export function canTransition(
  role: CmsRole,
  from: PublicationStatus,
  to: PublicationStatus,
): boolean {
  if (!transitions[from].includes(to)) {
    return false;
  }

  if (role === 'editor' && (to === 'published' || to === 'archived')) {
    return false;
  }

  return true;
}

export function transitionProfile(
  profile: Profile,
  role: CmsRole,
  to: PublicationStatus,
  occurredAt: string,
): Profile {
  if (!canTransition(role, profile.status, to)) {
    throw new Error(`Transition ${profile.status} -> ${to} is not allowed for ${role}`);
  }

  return {
    ...profile,
    status: to,
    updatedAt: occurredAt,
    revision: profile.revision + 1,
  };
}

export function archiveProfile(
  profile: Profile,
  role: CmsRole,
  occurredAt: string,
): Profile {
  return transitionProfile(profile, role, 'archived', occurredAt);
}

export function restoreProfile(
  profile: Profile,
  role: CmsRole,
  occurredAt: string,
): Profile {
  return transitionProfile(profile, role, 'draft', occurredAt);
}

export function duplicateProfile(
  profile: Profile,
  role: CmsRole,
  id: string,
  slug: string,
  occurredAt: string,
): Profile {
  if (role !== 'admin' && role !== 'editor') {
    throw new Error('Unknown CMS role');
  }

  return {
    ...profile,
    id,
    slug,
    displayName: '',
    biography: '',
    status: 'draft',
    approval: { state: 'pending' },
    publicationConsentConfirmed: false,
    createdAt: occurredAt,
    updatedAt: occurredAt,
    revision: 1,
  };
}
