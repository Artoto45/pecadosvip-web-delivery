import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assertReleaseReady,
  evaluateRelease,
} from '../lib/content/release-gates.ts';
import { makeSnapshot } from './helpers.ts';

test('release gate passes only for a complete evidenced snapshot', () => {
  const result = evaluateRelease(makeSnapshot());

  assert.equal(result.ok, true);
  assert.deepEqual(result.blockers, []);
});

test('release gate exposes every material external dependency', () => {
  const snapshot = makeSnapshot(7);
  snapshot.settings.publicationEnabled = false;
  snapshot.settings.canonicalOrigin = undefined;
  snapshot.settings.contact = {};
  snapshot.settings.legal.privacy.approval = { state: 'pending' };
  snapshot.cities = snapshot.cities.filter((city) => city.slug !== 'segovia');

  const result = evaluateRelease(snapshot);
  const codes = new Set(result.blockerCodes);

  assert.equal(result.ok, false);
  assert.equal(codes.has('PUBLICATION_DISABLED'), true);
  assert.equal(codes.has('CANONICAL_ORIGIN_INVALID'), true);
  assert.equal(codes.has('CONTACT_CHANNEL_MISSING'), true);
  assert.equal(codes.has('LEGAL_APPROVAL_MISSING'), true);
  assert.equal(codes.has('REQUIRED_CITY_NOT_PUBLISHED'), true);
  assert.equal(codes.has('INITIAL_PROFILE_LOAD_INCOMPLETE'), true);
});

test('assertReleaseReady throws instead of silently publishing an unsafe snapshot', () => {
  const snapshot = makeSnapshot();
  snapshot.profiles[0].adultAgeConfirmed = false;

  assert.throws(
    () => assertReleaseReady(snapshot),
    /PROFILE_PUBLICATION_EVIDENCE_MISSING/,
  );
});

test('release rejects reserved origins, unsafe contacts and missing analytics consent', () => {
  const snapshot = makeSnapshot();
  snapshot.settings.canonicalOrigin = 'https://localhost';
  snapshot.settings.contact = {
    formActionUrl: 'javascript:alert(1)',
  };
  snapshot.settings.analyticsConsentConfigured = false;

  const result = evaluateRelease(snapshot);
  const codes = new Set(result.blockerCodes);

  assert.equal(result.ok, false);
  assert.equal(codes.has('CANONICAL_ORIGIN_INVALID'), true);
  assert.equal(codes.has('CONTACT_CHANNEL_INVALID'), true);
  assert.equal(codes.has('ANALYTICS_CONSENT_NOT_CONFIGURED'), true);
});
