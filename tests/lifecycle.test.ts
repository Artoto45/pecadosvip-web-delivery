import assert from 'node:assert/strict';
import test from 'node:test';

import {
  archiveProfile,
  canTransition,
  duplicateProfile,
  restoreProfile,
  transitionProfile,
} from '../lib/content/lifecycle.ts';
import { makeProfile } from './helpers.ts';

const later = '2026-08-27T01:00:00-05:00';

test('editor permissions are conservative while admin owns publish and archive', () => {
  assert.equal(canTransition('editor', 'draft', 'hidden'), true);
  assert.equal(canTransition('editor', 'draft', 'published'), false);
  assert.equal(canTransition('editor', 'draft', 'archived'), false);
  assert.equal(canTransition('admin', 'draft', 'published'), true);
  assert.equal(canTransition('admin', 'published', 'archived'), true);
});

test('archive is recoverable and increments the revision', () => {
  const profile = makeProfile(1);
  const archived = archiveProfile(profile, 'admin', later);
  const restored = restoreProfile(
    archived,
    'admin',
    '2026-08-27T02:00:00-05:00',
  );

  assert.equal(archived.status, 'archived');
  assert.equal(archived.revision, profile.revision + 1);
  assert.equal(restored.status, 'draft');
  assert.equal(restored.revision, profile.revision + 2);
});

test('duplicate creates an unpublished record requiring fresh approval', () => {
  const duplicate = duplicateProfile(
    makeProfile(2),
    'editor',
    'profile-copy',
    'synthetic-profile-copy',
    later,
  );

  assert.equal(duplicate.id, 'profile-copy');
  assert.equal(duplicate.slug, 'synthetic-profile-copy');
  assert.equal(duplicate.status, 'draft');
  assert.equal(duplicate.displayName, '');
  assert.equal(duplicate.biography, '');
  assert.equal(duplicate.approval.state, 'pending');
  assert.equal(duplicate.publicationConsentConfirmed, false);
  assert.equal(duplicate.revision, 1);
});

test('invalid direct transitions fail closed', () => {
  assert.throws(
    () => transitionProfile(makeProfile(3), 'admin', 'draft', later),
    /not allowed/,
  );
});
