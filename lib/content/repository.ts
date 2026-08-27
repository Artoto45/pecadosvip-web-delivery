import {
  archiveProfile,
  canTransition,
  duplicateProfile,
  restoreProfile,
  transitionProfile,
} from './lifecycle.ts';
import { citySlugs } from './types.ts';
import { validateProfileForPublication } from './validation.ts';
import type { ProfilePublicationReferences } from './validation.ts';
import type {
  ApprovalRecord,
  AuditEvent,
  Availability,
  CmsRole,
  Profile,
  PublicationStatus,
} from './types.ts';

export type Actor = { id: string; role: CmsRole };
export type CreateContext = { actor: Actor; requestId: string };
export type WriteContext = CreateContext & { expectedRevision: number };

export type NewProfileInput = Omit<
  Profile,
  | 'status'
  | 'approval'
  | 'availability'
  | 'verificationEvidenceReference'
  | 'adultAgeConfirmed'
  | 'publicationConsentConfirmed'
  | 'rightsConfirmed'
  | 'createdAt'
  | 'updatedAt'
  | 'revision'
>;

export type EditableProfilePatch = Partial<
  Pick<
    Profile,
    | 'displayName'
    | 'age'
    | 'biography'
    | 'measurements'
    | 'languages'
    | 'serviceIds'
    | 'media'
    | 'citySlugs'
  >
>;

export type VerificationEvidence = {
  adultAgeConfirmed: boolean;
  publicationConsentConfirmed: boolean;
  rightsConfirmed: boolean;
  sourceReference: string;
};

export type RepositoryErrorCode =
  | 'INVALID_INPUT'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'REVISION_CONFLICT'
  | 'DUPLICATE_ID'
  | 'DUPLICATE_SLUG'
  | 'DUPLICATE_REQUEST'
  | 'INVALID_STATE'
  | 'VALIDATION_FAILED';

export class RepositoryError extends Error {
  public readonly code: RepositoryErrorCode;

  constructor(
    code: RepositoryErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'RepositoryError';
    this.code = code;
  }
}

export interface ProfileRepository {
  getProfile(id: string, actor: Actor, includeArchived?: boolean): Profile;
  listProfiles(actor: Actor, includeArchived?: boolean): Profile[];
  createProfile(input: NewProfileInput, context: CreateContext): Profile;
  updateProfile(
    id: string,
    patch: EditableProfilePatch,
    context: WriteContext,
  ): Profile;
  duplicateProfile(
    sourceId: string,
    identity: { id: string; slug: string },
    context: WriteContext,
  ): Profile;
  setStatus(
    id: string,
    status: PublicationStatus,
    context: WriteContext,
  ): Profile;
  setAvailability(
    id: string,
    availability: Availability,
    context: WriteContext,
  ): Profile;
  reorderMedia(
    id: string,
    orderedMediaIds: readonly string[],
    context: WriteContext,
  ): Profile;
  recordEvidence(
    id: string,
    evidence: VerificationEvidence,
    context: WriteContext,
  ): Profile;
  approveProfile(
    id: string,
    sourceReference: string,
    context: WriteContext,
  ): Profile;
  listAuditEvents(actor: Actor): AuditEvent[];
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const actorIdPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const requestIdPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const availabilityValues: readonly Availability[] = [
  'available',
  'limited',
  'unavailable',
  'on-request',
];

function copy<T>(value: T): T {
  return structuredClone(value);
}

function assertActor(actor: Actor): void {
  if (
    !actor ||
    !actorIdPattern.test(actor.id) ||
    (actor.role !== 'admin' && actor.role !== 'editor')
  ) {
    throw new RepositoryError(
      'FORBIDDEN',
      'A known authenticated CMS actor is required.',
    );
  }
}

function assertAdmin(actor: Actor): void {
  assertActor(actor);
  if (actor.role !== 'admin') {
    throw new RepositoryError(
      'FORBIDDEN',
      'This operation requires the admin role.',
    );
  }
}

function assertRequest(requestId: string): void {
  if (!requestIdPattern.test(requestId)) {
    throw new RepositoryError(
      'INVALID_INPUT',
      'Request ID must be an opaque 1-128 character identifier.',
    );
  }
}

function assertProfileInvariant(profile: Profile): void {
  if (!profile.id.trim() || !slugPattern.test(profile.slug)) {
    throw new RepositoryError(
      'VALIDATION_FAILED',
      'Profile ID and slug are required and URL-safe.',
    );
  }
  if (
    profile.age !== null &&
    (!Number.isInteger(profile.age) || profile.age < 18)
  ) {
    throw new RepositoryError(
      'VALIDATION_FAILED',
      'A stored age must represent an adult.',
    );
  }
  if (!availabilityValues.includes(profile.availability)) {
    throw new RepositoryError(
      'VALIDATION_FAILED',
      'Unknown availability value.',
    );
  }
  if (profile.citySlugs.some((slug) => !citySlugs.includes(slug))) {
    throw new RepositoryError(
      'VALIDATION_FAILED',
      'Unknown city reference.',
    );
  }
  const mediaIds = new Set(profile.media.map((media) => media.id));
  if (
    mediaIds.size !== profile.media.length ||
    [...mediaIds].some((id) => !id.trim())
  ) {
    throw new RepositoryError(
      'VALIDATION_FAILED',
      'Media IDs must be non-empty and unique.',
    );
  }
  if (!Number.isInteger(profile.revision) || profile.revision < 1) {
    throw new RepositoryError(
      'VALIDATION_FAILED',
      'Revision must be a positive integer.',
    );
  }
}

export class InMemoryProfileRepository implements ProfileRepository {
  private readonly profiles = new Map<string, Profile>();
  private readonly auditEvents: AuditEvent[] = [];
  private readonly requestIds = new Set<string>();
  private readonly clock: () => string;
  private readonly publicationReferences?: ProfilePublicationReferences;
  private auditSequence = 0;

  constructor(
    seedProfiles: readonly Profile[] = [],
    clock: () => string = () => new Date().toISOString(),
    publicationReferences?: ProfilePublicationReferences,
  ) {
    this.clock = clock;
    this.publicationReferences = publicationReferences
      ? copy(publicationReferences)
      : undefined;
    for (const profile of seedProfiles) {
      const candidate = copy(profile);
      assertProfileInvariant(candidate);
      this.assertUnique(candidate.id, candidate.slug);
      this.profiles.set(candidate.id, candidate);
    }
  }

  getProfile(id: string, actor: Actor, includeArchived = false): Profile {
    assertActor(actor);
    if (includeArchived && actor.role !== 'admin') {
      throw new RepositoryError(
        'FORBIDDEN',
        'Only admins may read archived profiles.',
      );
    }
    const profile = this.profiles.get(id);
    if (!profile || (profile.status === 'archived' && !includeArchived)) {
      throw new RepositoryError('NOT_FOUND', 'Profile not found: ' + id);
    }
    return copy(profile);
  }

  listProfiles(actor: Actor, includeArchived = false): Profile[] {
    assertActor(actor);
    if (includeArchived && actor.role !== 'admin') {
      throw new RepositoryError(
        'FORBIDDEN',
        'Only admins may list archived profiles.',
      );
    }
    return [...this.profiles.values()]
      .filter((profile) => includeArchived || profile.status !== 'archived')
      .map(copy);
  }

  createProfile(input: NewProfileInput, context: CreateContext): Profile {
    this.assertCreateContext(context);
    this.assertUnique(input.id, input.slug);
    const occurredAt = this.now();
    const profile: Profile = {
      ...copy(input),
      availability: 'unavailable',
      status: 'draft',
      approval: { state: 'pending' },
      verificationEvidenceReference: undefined,
      adultAgeConfirmed: false,
      publicationConsentConfirmed: false,
      rightsConfirmed: false,
      createdAt: occurredAt,
      updatedAt: occurredAt,
      revision: 1,
    };
    assertProfileInvariant(profile);
    this.profiles.set(profile.id, copy(profile));
    this.recordRequest(context.requestId);
    this.recordAudit(undefined, profile, context, 'create', Object.keys(input));
    return copy(profile);
  }

  updateProfile(
    id: string,
    patch: EditableProfilePatch,
    context: WriteContext,
  ): Profile {
    const current = this.prepareMutation(id, context);
    if (current.status === 'published' || current.status === 'archived') {
      throw new RepositoryError(
        'INVALID_STATE',
        'Hide a published profile or restore an archived profile before editing it.',
      );
    }
    const allowedFields = new Set([
      'displayName',
      'age',
      'biography',
      'measurements',
      'languages',
      'serviceIds',
      'media',
      'citySlugs',
    ]);
    const changedFields = Object.keys(patch);
    if (
      changedFields.length === 0 ||
      changedFields.some((field) => !allowedFields.has(field))
    ) {
      throw new RepositoryError(
        'INVALID_INPUT',
        'The profile patch is empty or contains protected fields.',
      );
    }
    const next: Profile = {
      ...current,
      ...copy(patch),
      approval: { state: 'pending' },
      verificationEvidenceReference: undefined,
      adultAgeConfirmed: false,
      publicationConsentConfirmed: false,
      rightsConfirmed: false,
      updatedAt: this.now(),
      revision: current.revision + 1,
    };
    return this.commit(current, next, context, 'edit', changedFields);
  }

  duplicateProfile(
    sourceId: string,
    identity: { id: string; slug: string },
    context: WriteContext,
  ): Profile {
    const source = this.prepareMutation(sourceId, context);
    if (source.status === 'archived') {
      throw new RepositoryError(
        'INVALID_STATE',
        'Restore the source before duplicating it.',
      );
    }
    this.assertUnique(identity.id, identity.slug);
    const duplicate = duplicateProfile(
      source,
      context.actor.role,
      identity.id,
      identity.slug,
      this.now(),
    );
    assertProfileInvariant(duplicate);
    this.profiles.set(duplicate.id, copy(duplicate));
    this.recordRequest(context.requestId);
    this.recordAudit(
      undefined,
      duplicate,
      context,
      'duplicate',
      ['id', 'slug', 'status', 'approval', 'personal-content'],
      source.id,
    );
    return copy(duplicate);
  }

  setStatus(
    id: string,
    status: PublicationStatus,
    context: WriteContext,
  ): Profile {
    const current = this.prepareMutation(id, context);
    if (!canTransition(context.actor.role, current.status, status)) {
      throw new RepositoryError(
        'FORBIDDEN',
        'Status transition is not allowed for this role.',
      );
    }
    if (status === 'published') {
      if (!this.publicationReferences) {
        throw new RepositoryError(
          'VALIDATION_FAILED',
          'Publication references are required before publishing a profile.',
        );
      }
      const issues = validateProfileForPublication(
        current,
        this.publicationReferences,
      );
      if (issues.length > 0) {
        throw new RepositoryError(
          'VALIDATION_FAILED',
          'Publication blocked: ' +
            [...new Set(issues.map((issue) => issue.code))].join(', '),
        );
      }
    }
    let next: Profile;
    try {
      if (status === 'archived') {
        next = {
          ...archiveProfile(current, context.actor.role, this.now()),
          availability: 'unavailable',
        };
      } else if (current.status === 'archived' && status === 'draft') {
        next = restoreProfile(current, context.actor.role, this.now());
      } else {
        next = transitionProfile(
          current,
          context.actor.role,
          status,
          this.now(),
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Status transition failed.';
      const code =
        message === 'PROFILE_PUBLICATION_EVIDENCE_MISSING'
          ? 'VALIDATION_FAILED'
          : 'FORBIDDEN';
      throw new RepositoryError(code, message);
    }
    const action: AuditEvent['action'] =
      status === 'published'
        ? 'publish'
        : status === 'hidden'
          ? 'hide'
          : status === 'archived'
            ? 'archive'
            : current.status === 'archived'
              ? 'restore'
              : 'return-to-draft';
    const changedFields =
      action === 'archive'
        ? ['status', 'availability']
        : action === 'restore'
          ? [
              'status',
              'availability',
              'approval',
              'verificationEvidenceReference',
              'adultAgeConfirmed',
              'publicationConsentConfirmed',
              'rightsConfirmed',
            ]
          : ['status'];
    return this.commit(current, next, context, action, changedFields);
  }

  setAvailability(
    id: string,
    availability: Availability,
    context: WriteContext,
  ): Profile {
    const current = this.prepareMutation(id, context);
    if (current.status === 'archived') {
      throw new RepositoryError(
        'INVALID_STATE',
        'Archived profiles cannot change availability.',
      );
    }
    if (!availabilityValues.includes(availability)) {
      throw new RepositoryError(
        'INVALID_INPUT',
        'Unknown availability value.',
      );
    }
    const next = {
      ...current,
      availability,
      updatedAt: this.now(),
      revision: current.revision + 1,
    };
    return this.commit(
      current,
      next,
      context,
      'availability-change',
      ['availability'],
    );
  }

  reorderMedia(
    id: string,
    orderedMediaIds: readonly string[],
    context: WriteContext,
  ): Profile {
    const current = this.prepareMutation(id, context);
    if (current.status === 'archived') {
      throw new RepositoryError(
        'INVALID_STATE',
        'Archived profiles cannot reorder media.',
      );
    }
    const requested = new Set(orderedMediaIds);
    const existing = new Set(current.media.map((media) => media.id));
    if (
      requested.size !== orderedMediaIds.length ||
      requested.size !== existing.size ||
      [...requested].some((mediaId) => !existing.has(mediaId))
    ) {
      throw new RepositoryError(
        'INVALID_INPUT',
        'Media order must be an exact permutation of every current media ID.',
      );
    }
    const byId = new Map(current.media.map((media) => [media.id, media]));
    const next = {
      ...current,
      media: orderedMediaIds.map((mediaId, order) => ({
        ...copy(byId.get(mediaId)!),
        order,
      })),
      updatedAt: this.now(),
      revision: current.revision + 1,
    };
    return this.commit(
      current,
      next,
      context,
      'reorder-media',
      ['media.order'],
    );
  }

  recordEvidence(
    id: string,
    evidence: VerificationEvidence,
    context: WriteContext,
  ): Profile {
    assertAdmin(context.actor);
    const current = this.prepareMutation(id, context);
    if (current.status === 'published' || current.status === 'archived') {
      throw new RepositoryError(
        'INVALID_STATE',
        'Evidence can only be recorded on draft or hidden profiles.',
      );
    }
    if (!evidence.sourceReference.trim()) {
      throw new RepositoryError(
        'INVALID_INPUT',
        'Traceable evidence reference is required.',
      );
    }
    if (
      typeof evidence.adultAgeConfirmed !== 'boolean' ||
      typeof evidence.publicationConsentConfirmed !== 'boolean' ||
      typeof evidence.rightsConfirmed !== 'boolean'
    ) {
      throw new RepositoryError(
        'INVALID_INPUT',
        'Verification flags must be runtime booleans.',
      );
    }
    if (evidence.sourceReference.length > 512) {
      throw new RepositoryError(
        'INVALID_INPUT',
        'Evidence reference exceeds the 512 character limit.',
      );
    }
    const next = {
      ...current,
      adultAgeConfirmed: evidence.adultAgeConfirmed,
      publicationConsentConfirmed: evidence.publicationConsentConfirmed,
      rightsConfirmed: evidence.rightsConfirmed,
      verificationEvidenceReference: evidence.sourceReference,
      approval: { state: 'pending' } satisfies ApprovalRecord,
      updatedAt: this.now(),
      revision: current.revision + 1,
    };
    return this.commit(
      current,
      next,
      context,
      'record-evidence',
      [
        'adultAgeConfirmed',
        'publicationConsentConfirmed',
        'rightsConfirmed',
        'verificationEvidenceReference',
      ],
    );
  }

  approveProfile(
    id: string,
    sourceReference: string,
    context: WriteContext,
  ): Profile {
    assertAdmin(context.actor);
    const current = this.prepareMutation(id, context);
    if (current.status === 'published' || current.status === 'archived') {
      throw new RepositoryError(
        'INVALID_STATE',
        'Only draft or hidden profiles can be approved.',
      );
    }
    if (!sourceReference.trim()) {
      throw new RepositoryError(
        'INVALID_INPUT',
        'Traceable approval evidence is required.',
      );
    }
    const occurredAt = this.now();
    const next = {
      ...current,
      approval: {
        state: 'approved',
        sourceReference,
        approvedBy: context.actor.id,
        approvedAt: occurredAt,
      } satisfies ApprovalRecord,
      updatedAt: occurredAt,
      revision: current.revision + 1,
    };
    return this.commit(current, next, context, 'approve', ['approval']);
  }

  listAuditEvents(actor: Actor): AuditEvent[] {
    assertAdmin(actor);
    return this.auditEvents.map(copy);
  }

  private prepareMutation(id: string, context: WriteContext): Profile {
    assertActor(context.actor);
    assertRequest(context.requestId);
    if (this.requestIds.has(context.requestId)) {
      throw new RepositoryError(
        'DUPLICATE_REQUEST',
        'Request ID was already committed.',
      );
    }
    if (
      !Number.isInteger(context.expectedRevision) ||
      context.expectedRevision < 1
    ) {
      throw new RepositoryError(
        'INVALID_INPUT',
        'Expected revision must be a positive integer.',
      );
    }
    const current = this.profiles.get(id);
    if (!current) {
      throw new RepositoryError('NOT_FOUND', 'Profile not found: ' + id);
    }
    if (current.revision !== context.expectedRevision) {
      throw new RepositoryError(
        'REVISION_CONFLICT',
        'Expected revision ' +
          context.expectedRevision +
          ', found ' +
          current.revision +
          '.',
      );
    }
    return copy(current);
  }

  private commit(
    current: Profile,
    next: Profile,
    context: WriteContext,
    action: AuditEvent['action'],
    changedFields: string[],
  ): Profile {
    if (next.revision !== current.revision + 1) {
      throw new RepositoryError(
        'VALIDATION_FAILED',
        'A mutation must advance the revision exactly once.',
      );
    }
    this.assertUnique(next.id, next.slug, current.id);
    assertProfileInvariant(next);
    this.profiles.set(next.id, copy(next));
    this.recordRequest(context.requestId);
    this.recordAudit(current, next, context, action, changedFields);
    return copy(next);
  }

  private assertCreateContext(context: CreateContext): void {
    assertActor(context.actor);
    assertRequest(context.requestId);
    if (this.requestIds.has(context.requestId)) {
      throw new RepositoryError(
        'DUPLICATE_REQUEST',
        'Request ID was already committed.',
      );
    }
  }

  private assertUnique(id: string, slug: string, exceptId?: string): void {
    if (this.profiles.has(id) && id !== exceptId) {
      throw new RepositoryError(
        'DUPLICATE_ID',
        'Duplicate profile ID: ' + id,
      );
    }
    for (const profile of this.profiles.values()) {
      if (profile.id !== exceptId && profile.slug === slug) {
        throw new RepositoryError(
          'DUPLICATE_SLUG',
          'Duplicate profile slug: ' + slug,
        );
      }
    }
  }

  private now(): string {
    const value = this.clock();
    if (!Number.isFinite(Date.parse(value))) {
      throw new RepositoryError(
        'VALIDATION_FAILED',
        'Repository clock returned an invalid timestamp.',
      );
    }
    return value;
  }

  private recordRequest(requestId: string): void {
    this.requestIds.add(requestId);
  }

  private recordAudit(
    from: Profile | undefined,
    to: Profile,
    context: CreateContext,
    action: AuditEvent['action'],
    changedFields: string[],
    sourceEntityId?: string,
  ): void {
    this.auditSequence += 1;
    this.auditEvents.push({
      id: 'audit-' + String(this.auditSequence).padStart(6, '0'),
      actorId: context.actor.id,
      actorRole: context.actor.role,
      requestId: context.requestId,
      action,
      entityType: 'profile',
      entityId: to.id,
      sourceEntityId,
      occurredAt: to.updatedAt,
      fromRevision: from?.revision,
      toRevision: to.revision,
      fromStatus: from?.status,
      toStatus: to.status,
      changedFields: [...changedFields],
    });
  }
}
