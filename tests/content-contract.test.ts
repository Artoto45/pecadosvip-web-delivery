import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildRouteManifest,
  sitemapRoutes,
} from '../lib/content/route-manifest.ts';
import { validateContentSnapshot } from '../lib/content/validation.ts';
import { makeSnapshot } from './helpers.ts';

test('a fully evidenced snapshot satisfies draft and release validation', () => {
  const snapshot = makeSnapshot();

  assert.deepEqual(validateContentSnapshot(snapshot, 'draft'), []);
  assert.deepEqual(validateContentSnapshot(snapshot, 'release'), []);
});

test('validation rejects duplicate slugs, minors and media without rights evidence', () => {
  const snapshot = makeSnapshot();
  snapshot.profiles[1].slug = snapshot.profiles[0].slug;
  snapshot.profiles[0].age = 17;
  snapshot.profiles[0].media[0].rightsEvidence = '';

  const codes = new Set(
    validateContentSnapshot(snapshot).map((issue) => issue.code),
  );

  assert.equal(codes.has('PROFILE_SLUG_DUPLICATE'), true);
  assert.equal(codes.has('PROFILE_AGE_INVALID'), true);
  assert.equal(codes.has('MEDIA_RIGHTS_MISSING'), true);
});

test('route generation supports more than eight profiles without a hardcoded ceiling', () => {
  const snapshot = makeSnapshot(9);
  const routes = buildRouteManifest(snapshot);
  const profileDetailRoutes = routes.filter((route) =>
    route.path.startsWith('/perfiles/'),
  );

  assert.equal(profileDetailRoutes.length, 9);
  assert.equal(routes.filter((route) => route.kind === 'city').length, 7);
});

test('draft, hidden, archived and unapproved profiles never enter public route sets', () => {
  const snapshot = makeSnapshot();
  snapshot.profiles[0].status = 'draft';
  snapshot.profiles[1].status = 'hidden';
  snapshot.profiles[2].status = 'archived';
  snapshot.profiles[3].approval = { state: 'pending' };

  const paths = buildRouteManifest(snapshot).map((route) => route.path);
  const sitemapPaths = sitemapRoutes(snapshot).map((route) => route.path);

  for (const profile of snapshot.profiles.slice(0, 4)) {
    assert.equal(paths.includes(`/perfiles/${profile.slug}`), false);
    assert.equal(sitemapPaths.includes(`/perfiles/${profile.slug}`), false);
  }
});

test('validation rejects unsafe media, measurements and runtime references', () => {
  const snapshot = makeSnapshot();
  const profile = snapshot.profiles[0];
  profile.measurements.heightCm = -1;
  profile.media[0].desktopUrl = '';
  profile.media[0].order = 2;
  profile.media.push({
    ...profile.media[0],
    id: profile.media[0].id,
    order: 1,
  });
  profile.citySlugs = ['unknown-city' as never];
  snapshot.services[0].status = 'archived';
  profile.approval.approvedAt = 'not-a-date';

  const codes = new Set(
    validateContentSnapshot(snapshot).map((issue) => issue.code),
  );

  assert.equal(codes.has('PROFILE_MEASUREMENT_INVALID'), true);
  assert.equal(codes.has('MEDIA_URL_INVALID'), true);
  assert.equal(codes.has('MEDIA_ID_INVALID'), true);
  assert.equal(codes.has('MEDIA_ORDER_NOT_CONTIGUOUS'), true);
  assert.equal(codes.has('PROFILE_CITY_REFERENCE_INVALID'), true);
  assert.equal(codes.has('PROFILE_SERVICE_NOT_PUBLISHABLE'), true);
  assert.equal(codes.has('PROFILE_PUBLICATION_EVIDENCE_MISSING'), true);
});

test('every route is non-indexable when the global release gate is closed', () => {
  const snapshot = makeSnapshot();
  snapshot.settings.publicationEnabled = false;

  const routes = buildRouteManifest(snapshot);

  assert.equal(routes.length > 0, true);
  assert.equal(routes.every((route) => route.indexable === false), true);
  assert.deepEqual(sitemapRoutes(snapshot), []);
});
